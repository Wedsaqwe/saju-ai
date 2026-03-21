import Anthropic from "@anthropic-ai/sdk";

// ─── RSS Sources (same as briefing but focused on financial) ───
const FEEDS = [
  { url: "https://news.google.com/rss/search?q=stock+market+S%26P500+KOSPI&hl=en-US&gl=US&ceid=US:en", cat: "stock" },
  { url: "https://news.google.com/rss/search?q=cryptocurrency+bitcoin+ethereum&hl=en-US&gl=US&ceid=US:en", cat: "crypto" },
  { url: "https://news.google.com/rss/search?q=real+estate+housing+market&hl=en-US&gl=US&ceid=US:en", cat: "realestate" },
  { url: "https://news.google.com/rss/search?q=gold+commodities+oil&hl=en-US&gl=US&ceid=US:en", cat: "commodity" },
  { url: "https://news.google.com/rss/search?q=한국+주식+코스피+반도체&hl=ko&gl=KR&ceid=KR:ko", cat: "stock" },
  { url: "https://news.google.com/rss/search?q=서울+부동산+아파트+재건축&hl=ko&gl=KR&ceid=KR:ko", cat: "realestate" },
  { url: "https://news.google.com/rss/search?q=비트코인+암호화폐+코인&hl=ko&gl=KR&ceid=KR:ko", cat: "crypto" },
  { url: "https://news.google.com/rss/search?q=원달러+환율+금값&hl=ko&gl=KR&ceid=KR:ko", cat: "forex" },
];

async function fetchRSS(feed, signal) {
  try {
    const res = await fetch(feed.url, { signal, headers: { "User-Agent": "NUVO-AI/1.0" } });
    if (!res.ok) return [];
    const xml = await res.text();
    const items = [];
    const re = /<item>([\s\S]*?)<\/item>/gi;
    let m;
    while ((m = re.exec(xml)) !== null && items.length < 4) {
      const c = m[1];
      const title = c.match(/<title><!\[CDATA\[(.*?)\]\]>|<title>(.*?)<\/title>/)?.[1] || c.match(/<title>(.*?)<\/title>/)?.[1] || "";
      const desc = c.match(/<description><!\[CDATA\[(.*?)\]\]>|<description>(.*?)<\/description>/)?.[1] || "";
      if (title) items.push({ title: title.replace(/<[^>]*>/g, "").trim(), desc: desc.replace(/<[^>]*>/g, "").trim().substring(0, 200), cat: feed.cat });
    }
    return items;
  } catch { return []; }
}

async function collectNews() {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 12000);
  try {
    const results = await Promise.allSettled(FEEDS.map(f => fetchRSS(f, ctrl.signal)));
    return results.filter(r => r.status === "fulfilled").flatMap(r => r.value);
  } finally { clearTimeout(t); }
}

// ─── Element-to-Asset Mapping Logic ───
const ELEMENT_ASSET_MAP = {
  "목": { sectors: ["바이오/헬스케어", "목재/펄프", "패션/의류", "교육", "농업/식품"], etfs: ["TIGER 바이오TOP10", "KODEX 헬스케어"], traits: "성장·확장 에너지", season: "봄(3~5월)", color: "청색/녹색" },
  "화": { sectors: ["반도체", "AI/IT", "엔터테인먼트", "에너지", "방산/우주"], etfs: ["TIGER 반도체", "KODEX AI반도체핵심장비"], traits: "혁신·열정 에너지", season: "여름(6~8월)", color: "적색" },
  "토": { sectors: ["건설/인프라", "부동산/리츠", "식품/음료", "유통", "금융"], etfs: ["TIGER 리츠부동산인프라", "KODEX 건설"], traits: "안정·축적 에너지", season: "환절기", color: "황색" },
  "금": { sectors: ["금/은/귀금속", "자동차", "기계/로봇", "철강", "조선"], etfs: ["TIGER 로봇", "KODEX 철강"], traits: "수확·결실 에너지", season: "가을(9~11월)", color: "백색" },
  "수": { sectors: ["해운/물류", "수산", "암호화폐", "핀테크", "관광/레저"], etfs: ["TIGER 원자력테마", "KODEX 2차전지산업"], traits: "유동·지혜 에너지", season: "겨울(12~2월)", color: "흑색" },
};

export async function POST(req) {
  try {
    const body = await req.json();
    const { sajuData } = body;

    // sajuData expected shape:
    // { name, birthYear, birthMonth, birthDay, birthHour,
    //   pillars: { year: {간,지}, month: {간,지}, day: {간,지}, hour: {간,지} },
    //   ohangBalance: { 목:2, 화:1, 토:3, 금:1, 수:1 },
    //   jaeSung: "편재" | "정재" | "없음",
    //   monthlyFortune: { month: 3, element: "화", score: 85, description: "..." },
    //   yearFortune: { year: 2026, description: "..." } }

    if (!sajuData || !sajuData.ohangBalance) {
      return Response.json({ error: "사주 데이터가 필요합니다." }, { status: 400 });
    }

    // Collect news
    const news = await collectNews();
    const newsDigest = news.map((n, i) => `[${n.cat}] ${n.title}: ${n.desc}`).join("\n");

    // Analyze ohang balance
    const oh = sajuData.ohangBalance;
    const sorted = Object.entries(oh).sort((a, b) => b[1] - a[1]);
    const strongest = sorted[0][0];
    const weakest = sorted[sorted.length - 1][0];
    const strongInfo = ELEMENT_ASSET_MAP[strongest];
    const weakInfo = ELEMENT_ASSET_MAP[weakest];

    const client = new Anthropic();

    const systemPrompt = `You are NUVO AI's Fortune x Market Signal engine. You combine traditional Korean fortune analysis (사주명리) with real-time market intelligence to create personalized investment signals.

You are given:
1. A person's saju (사주) fortune data — their five element (오행) balance, wealth star (재성), and monthly fortune
2. Today's market news

Your job: Generate personalized market signals that connect their saju energy patterns to actual market opportunities.

IMPORTANT RULES:
- This is for entertainment/reference purposes, not financial advice. Include a disclaimer.
- The 오행 → sector mapping has real cultural basis in Korean fortune telling tradition. Treat it seriously, not mockingly.
- Connect saju insights to actual market conditions from the news — don't just make generic predictions.
- Korean text must be natural and professional, using proper 명리학 terminology.

Output ONLY valid JSON (no markdown fences):
{
  "userProfile": {
    "dominantElement": "목|화|토|금|수",
    "dominantTraits": "2-3 word trait description",
    "deficientElement": "목|화|토|금|수",
    "wealthStar": "편재|정재|없음",
    "wealthStarMeaning": "1 sentence about their money personality",
    "currentMonthEnergy": "description of this month's energy for them"
  },
  "elementMatchSignals": [
    {
      "element": "화",
      "matchType": "dominant|补充(보충)|seasonal",
      "matchReason": "Why this element matters for them now (Korean, 1-2 sentences)",
      "sectors": ["sector1", "sector2"],
      "specificSignal": {
        "asset": "Specific asset or ETF name",
        "direction": "bullish|bearish|neutral",
        "reasoning": "2-3 sentences connecting their saju energy to this market opportunity, referencing actual news (Korean)",
        "timeframe": "이번 주|이번 달|Q2 2026|올해 하반기",
        "confidence": 60-90
      }
    }
  ],
  "luckyTimingThisWeek": {
    "bestDay": "요일",
    "bestDayReason": "Why (Korean, based on 일진 logic)",
    "cautionDay": "요일",
    "cautionReason": "Why (Korean)",
    "actionItem": "Specific action to take on the best day (Korean)"
  },
  "personalizedAdvice": {
    "title": "2-3 word title (Korean)",
    "body": "3-4 sentence personalized advice combining their saju profile with current market conditions. Reference specific elements, their wealth star type, and actual market news. (Korean)",
    "avoidSectors": ["sector to avoid based on clashing elements"],
    "avoidReason": "Why (Korean, 1 sentence)"
  },
  "disclaimer": "본 콘텐츠는 사주명리학 기반 참고 자료이며, 투자 결정은 본인의 판단과 책임 하에 이루어져야 합니다."
}

Generate exactly 3 elementMatchSignals:
1. Based on their DOMINANT element (strongest energy → naturally aligned sectors)
2. Based on their DEFICIENT element (보충 needed → sectors that could balance their energy)
3. Based on SEASONAL energy (current month's 월운 element → timely opportunities)`;

    const userMessage = `사주 데이터:
- 오행 분포: 목(${oh.목||0}) 화(${oh.화||0}) 토(${oh.토||0}) 금(${oh.금||0}) 수(${oh.수||0})
- 가장 강한 오행: ${strongest} (${strongInfo.traits})
- 가장 약한 오행: ${weakest} (${weakInfo.traits})
- 재성(財星): ${sajuData.jaeSung || "분석 중"}
- 이번 달 월운: ${sajuData.monthlyFortune?.description || "정보 없음"}
- 연운(2026): ${sajuData.yearFortune?.description || "정보 없음"}

관련 섹터 매핑:
- ${strongest}(강): ${strongInfo.sectors.join(", ")} → ETF: ${strongInfo.etfs.join(", ")}
- ${weakest}(약/보충 필요): ${weakInfo.sectors.join(", ")} → ETF: ${weakInfo.etfs.join(", ")}

오늘의 시장 뉴스:
${newsDigest}

위 사주 데이터와 시장 뉴스를 결합하여 맞춤형 Fortune x Market Signal을 생성해주세요.`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });

    let text = message.content[0].text.trim();
    if (text.startsWith("```")) text = text.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
    const result = JSON.parse(text);

    return Response.json({
      success: true,
      signal: result,
      meta: {
        newsCount: news.length,
        generatedAt: new Date().toISOString(),
        strongElement: strongest,
        weakElement: weakest,
        elementMap: { strong: strongInfo, weak: weakInfo },
      },
    });
  } catch (error) {
    console.error("Fortune Signal error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
