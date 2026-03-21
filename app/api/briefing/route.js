import Anthropic from "@anthropic-ai/sdk";

// ─── RSS Feed Sources (무료) ───
const RSS_FEEDS = [
  // Global Markets
  { url: "https://feeds.reuters.com/reuters/businessNews", name: "Reuters Business", cat: "macro" },
  { url: "https://feeds.reuters.com/reuters/technologyNews", name: "Reuters Tech", cat: "stock" },
  { url: "https://news.google.com/rss/search?q=federal+reserve+interest+rate&hl=en-US&gl=US&ceid=US:en", name: "Google News - Fed", cat: "macro" },
  { url: "https://news.google.com/rss/search?q=stock+market+today&hl=en-US&gl=US&ceid=US:en", name: "Google News - Stocks", cat: "stock" },
  { url: "https://news.google.com/rss/search?q=cryptocurrency+bitcoin+ethereum&hl=en-US&gl=US&ceid=US:en", name: "Google News - Crypto", cat: "crypto" },
  { url: "https://news.google.com/rss/search?q=forex+currency+exchange+rate&hl=en-US&gl=US&ceid=US:en", name: "Google News - Forex", cat: "forex" },
  { url: "https://news.google.com/rss/search?q=real+estate+housing+market&hl=en-US&gl=US&ceid=US:en", name: "Google News - Real Estate", cat: "realestate" },
  // Korea
  { url: "https://news.google.com/rss/search?q=한국+주식+코스피&hl=ko&gl=KR&ceid=KR:ko", name: "Google News - KOSPI", cat: "stock" },
  { url: "https://news.google.com/rss/search?q=서울+부동산+아파트&hl=ko&gl=KR&ceid=KR:ko", name: "Google News - Seoul RE", cat: "realestate" },
  { url: "https://news.google.com/rss/search?q=원달러+환율&hl=ko&gl=KR&ceid=KR:ko", name: "Google News - KRW", cat: "forex" },
  { url: "https://news.google.com/rss/search?q=비트코인+암호화폐&hl=ko&gl=KR&ceid=KR:ko", name: "Google News - Crypto KR", cat: "crypto" },
];

// ─── Simple RSS Parser ───
async function fetchRSS(feed, signal) {
  try {
    const res = await fetch(feed.url, {
      signal,
      headers: { "User-Agent": "NUVO-AI-Briefing/1.0" },
    });
    if (!res.ok) return [];
    const xml = await res.text();

    // Basic XML parsing for RSS items
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let match;
    while ((match = itemRegex.exec(xml)) !== null && items.length < 5) {
      const content = match[1];
      const title = content.match(/<title><!\[CDATA\[(.*?)\]\]>|<title>(.*?)<\/title>/)?.[1] || content.match(/<title>(.*?)<\/title>/)?.[1] || "";
      const desc = content.match(/<description><!\[CDATA\[(.*?)\]\]>|<description>(.*?)<\/description>/)?.[1] || content.match(/<description>(.*?)<\/description>/)?.[1] || "";
      const pubDate = content.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || "";
      
      // Strip HTML tags from description
      const cleanDesc = desc.replace(/<[^>]*>/g, "").trim();
      
      if (title) {
        items.push({
          title: title.replace(/<[^>]*>/g, "").trim(),
          description: cleanDesc.substring(0, 300),
          pubDate,
          source: feed.name,
          category: feed.cat,
        });
      }
    }
    return items;
  } catch (e) {
    console.error(`RSS fetch failed for ${feed.name}:`, e.message);
    return [];
  }
}

// ─── Collect All News ───
async function collectNews() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

  try {
    const results = await Promise.allSettled(
      RSS_FEEDS.map((feed) => fetchRSS(feed, controller.signal))
    );

    const allItems = results
      .filter((r) => r.status === "fulfilled")
      .flatMap((r) => r.value);

    // Sort by date (newest first) and deduplicate by title similarity
    const sorted = allItems.sort((a, b) => {
      const da = a.pubDate ? new Date(a.pubDate) : new Date(0);
      const db = b.pubDate ? new Date(b.pubDate) : new Date(0);
      return db - da;
    });

    // Take top items per category
    const byCat = {};
    for (const item of sorted) {
      if (!byCat[item.category]) byCat[item.category] = [];
      if (byCat[item.category].length < 8) byCat[item.category].push(item);
    }

    return Object.values(byCat).flat();
  } finally {
    clearTimeout(timeout);
  }
}

// ─── Claude API: Analyze & Generate Briefing ───
async function generateBriefing(newsItems) {
  const client = new Anthropic();

  const newsDigest = newsItems
    .map((n, i) => `[${i + 1}] [${n.category.toUpperCase()}] ${n.source}: ${n.title}\n${n.description}`)
    .join("\n\n");

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Seoul",
  });

  const systemPrompt = `You are NUVO AI, a world-class financial market analyst that produces daily briefings for sophisticated investors. You combine macro analysis, cross-asset correlations, and chain-reaction forecasting.

Your output must be a valid JSON object with this exact structure. Do NOT wrap in markdown code blocks. Return ONLY the JSON:

{
  "date": "${today}",
  "ticker": [
    {"name": "S&P 500", "nameKr": "S&P 500", "value": "5,892", "change": "+1.2%", "direction": "up"},
    {"name": "KOSPI", "nameKr": "코스피", "value": "2,687", "change": "-0.3%", "direction": "down"},
    {"name": "BTC/USD", "nameKr": "비트코인", "value": "$97,452", "change": "+3.8%", "direction": "up"},
    {"name": "USD/KRW", "nameKr": "달러/원", "value": "1,342", "change": "+0.1%", "direction": "up"},
    {"name": "Gold", "nameKr": "금", "value": "$3,041", "change": "+0.6%", "direction": "up"},
    {"name": "10Y UST", "nameKr": "미국 10년물", "value": "4.28%", "change": "-2bp", "direction": "down"}
  ],
  "aiSummary": {
    "en": "3-4 sentence executive summary connecting today's key themes across all asset classes. Bold the most critical points with <strong> tags.",
    "kr": "Korean version of the same summary, naturally written (not Google Translate), with Korean market context woven in."
  },
  "briefings": [
    {
      "category": "stock|realestate|forex|crypto|macro",
      "impact": "high|mid|low",
      "tags": ["stock", "macro"],
      "time": "HH:MM KST",
      "headline": {"en": "...", "kr": "..."},
      "summary": {"en": "2-3 sentences on what happened", "kr": "..."},
      "insight": {"en": "3-4 sentences of deep analysis — historical precedents, specific numbers, contrarian angles. This is what makes NUVO AI different from generic news.", "kr": "..."},
      "chainReaction": {
        "en": [
          {"text": "<strong>First order effect</strong> → immediate market impact"},
          {"text": "<strong>Second order</strong> → follow-on effect"},
          {"text": "<strong>Third order</strong> → cross-asset spillover"},
          {"text": "<strong>Fourth order</strong> → final downstream consequence"}
        ],
        "kr": [same structure in Korean]
      },
      "impactScore": 7
    }
  ],
  "signals": [
    {
      "direction": "📈|📉|⚠️",
      "asset": {"en": "Asset Name", "kr": "자산명"},
      "prediction": {"en": "1-2 sentence prediction with timeframe", "kr": "..."},
      "confidence": 75
    }
  ]
}

RULES:
- Generate exactly 4 briefings: pick the 4 most impactful stories from the news digest
- Each briefing MUST have exactly 4 chain reaction steps
- Generate exactly 4 signals
- Ticker values should be realistic estimates based on the news context
- Impact scores: 8-10 for market-moving events, 5-7 for notable, 1-4 for minor
- Korean text must be naturally written, not translated — use Korean financial terminology (갭투자, 재건축, 김치프리미엄, 주담대 etc.)
- Insights should include specific numbers, historical precedents, and contrarian analysis
- Chain reactions must show cross-asset correlations (e.g., Fed → bonds → FX → Korean real estate)
- Be specific: mention actual companies, indices, percentages, timeframes`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 6000,
    messages: [
      {
        role: "user",
        content: `Here is today's news digest (${today}). Analyze these and generate the NUVO AI Daily Briefing:\n\n${newsDigest}`,
      },
    ],
    system: systemPrompt,
  });

  const text = message.content[0].text;

  // Try to parse JSON - handle potential markdown code blocks
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
  }

  return JSON.parse(cleaned);
}

// ─── API Route Handler ───
export async function POST(req) {
  try {
    // Step 1: Collect news from RSS feeds
    const newsItems = await collectNews();

    if (newsItems.length === 0) {
      return Response.json(
        { error: "No news items collected. RSS feeds may be temporarily unavailable." },
        { status: 502 }
      );
    }

    // Step 2: Send to Claude for analysis
    const briefing = await generateBriefing(newsItems);

    return Response.json({
      success: true,
      briefing,
      meta: {
        newsCount: newsItems.length,
        generatedAt: new Date().toISOString(),
        sources: [...new Set(newsItems.map((n) => n.source))],
      },
    });
  } catch (error) {
    console.error("Briefing generation error:", error);
    return Response.json(
      {
        error: "Failed to generate briefing",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
