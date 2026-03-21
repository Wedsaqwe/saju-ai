import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/* ═══ RSS 소스 (무료, 11개) ═══ */
const RSS_SOURCES = {
  kr: [
    { name: "Google News KR", url: "https://news.google.com/rss/search?q=경제+주식+투자&hl=ko&gl=KR&ceid=KR:ko", cat: "all" },
    { name: "Google News KR 부동산", url: "https://news.google.com/rss/search?q=부동산+아파트+전세&hl=ko&gl=KR&ceid=KR:ko", cat: "realestate" },
    { name: "Google News KR 암호화폐", url: "https://news.google.com/rss/search?q=비트코인+암호화폐+코인&hl=ko&gl=KR&ceid=KR:ko", cat: "crypto" },
    { name: "Google News KR 환율", url: "https://news.google.com/rss/search?q=환율+달러+원화&hl=ko&gl=KR&ceid=KR:ko", cat: "forex" },
    { name: "Google News KR 거시경제", url: "https://news.google.com/rss/search?q=금리+인플레이션+GDP+한국은행&hl=ko&gl=KR&ceid=KR:ko", cat: "macro" },
  ],
  en: [
    { name: "Reuters Business", url: "https://news.google.com/rss/search?q=stock+market+economy&hl=en&gl=US&ceid=US:en", cat: "all" },
    { name: "Google News EN Crypto", url: "https://news.google.com/rss/search?q=bitcoin+cryptocurrency&hl=en&gl=US&ceid=US:en", cat: "crypto" },
    { name: "Google News EN Macro", url: "https://news.google.com/rss/search?q=federal+reserve+interest+rate+inflation&hl=en&gl=US&ceid=US:en", cat: "macro" },
    { name: "Google News EN Real Estate", url: "https://news.google.com/rss/search?q=real+estate+housing+market&hl=en&gl=US&ceid=US:en", cat: "realestate" },
    { name: "Google News EN Forex", url: "https://news.google.com/rss/search?q=forex+dollar+exchange+rate&hl=en&gl=US&ceid=US:en", cat: "forex" },
    { name: "Google News EN Stock", url: "https://news.google.com/rss/search?q=stock+market+S%26P500+nasdaq&hl=en&gl=US&ceid=US:en", cat: "stock" },
  ],
};

/* ═══ RSS 파싱 (XML → 텍스트) ═══ */
async function fetchRSS(url, timeout = 5000) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "NUVO-AI-Briefing/1.0" },
    });
    clearTimeout(timer);
    const text = await res.text();

    // 간단한 XML 파싱 (item 태그 추출)
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    while ((match = itemRegex.exec(text)) !== null && items.length < 8) {
      const itemXml = match[1];
      const title = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]>|<title>(.*?)<\/title>/)?.[1] || itemXml.match(/<title>(.*?)<\/title>/)?.[1] || "";
      const desc = itemXml.match(/<description><!\[CDATA\[(.*?)\]\]>|<description>(.*?)<\/description>/)?.[1] || "";
      const pubDate = itemXml.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || "";
      if (title) items.push({ title: title.replace(/<[^>]+>/g, "").trim(), desc: desc.replace(/<[^>]+>/g, "").trim().slice(0, 200), date: pubDate });
    }
    return items;
  } catch (e) {
    console.error(`RSS fetch failed: ${url}`, e.message);
    return [];
  }
}

/* ═══ 브리핑 생성 프롬프트 ═══ */
function buildBriefingPrompt(articles, lang, category) {
  const langLabel = lang === "kr" ? "한국어" : "English";
  const catLabel = { all: "전체", stock: "주식", realestate: "부동산", forex: "환율", crypto: "암호화폐", macro: "거시경제" }[category] || "전체";

  return `당신은 글로벌 금융 시장 분석가입니다. 아래 뉴스를 분석하여 ${langLabel}로 투자 브리핑을 작성하세요.
카테고리: ${catLabel}

반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트 없이 JSON만:

{
  "summary": "오늘 시장의 핵심 3줄 요약 (마크다운)",
  "insights": [
    {
      "title": "인사이트 제목",
      "content": "분석 내용 (2~3문장)",
      "impact": 임팩트 점수 (-5 ~ +5),
      "chain": ["1차 영향", "2차 영향", "3차 영향", "4차 영향"]
    }
  ],
  "signals": [
    {
      "title": "시그널 제목",
      "direction": "상승" 또는 "하락" 또는 "중립",
      "sector": "관련 섹터",
      "confidence": 신뢰도 (0~100)
    }
  ]
}

insights는 4개, signals는 4개 생성하세요.

=== 수집된 뉴스 ===
${articles.map((a, i) => `[${i + 1}] ${a.title}\n${a.desc}`).join("\n\n")}`;
}

export async function POST(req) {
  try {
    const { lang = "kr", category = "all" } = await req.json();

    // 1. RSS 수집 (Vercel Hobby 10초 제한 — 최대 3소스)
    const sources = RSS_SOURCES[lang] || RSS_SOURCES.kr;
    const filteredSources = category === "all"
      ? sources.slice(0, 3)
      : sources.filter((s) => s.cat === "all" || s.cat === category).slice(0, 3);

    const allArticles = [];
    await Promise.all(
      filteredSources.map(async (src) => {
        const items = await fetchRSS(src.url);
        items.forEach((item) => allArticles.push({ ...item, source: src.name }));
      })
    );

    // 중복 제거
    const seen = new Set();
    const unique = allArticles.filter((a) => {
      const key = a.title.slice(0, 30);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 12);

    if (unique.length === 0) {
      return Response.json({ error: "뉴스를 수집할 수 없습니다. 잠시 후 다시 시도해주세요." });
    }

    // 2. Claude 분석
    const prompt = buildBriefingPrompt(unique, lang, category);
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content?.map((b) => (b.type === "text" ? b.text : "")).join("") || "";

    // JSON 파싱
    try {
      // ```json ... ``` 제거
      const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      const data = JSON.parse(cleaned);
      return Response.json(data);
    } catch (parseErr) {
      // JSON 파싱 실패 시 raw text로 폴백
      return Response.json({
        summary: text.slice(0, 500),
        insights: [],
        signals: [],
        raw: true,
      });
    }
  } catch (error) {
    console.error("Briefing API error:", error);
    return Response.json(
      { error: error.message || "브리핑 생성 실패" },
      { status: 500 }
    );
  }
}
