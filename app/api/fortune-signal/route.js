import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/* ═══ 오행 → 자산 매핑 ═══ */
const OH_ASSET = {
  목: { label: "바이오/헬스케어", etf: ["TIGER 바이오TOP10", "KODEX 헬스케어"], traits: "성장·확장", sectors: "바이오, 헬스케어, 교육, 농업, 패션" },
  화: { label: "반도체/AI/IT", etf: ["TIGER 반도체", "KODEX AI반도체핵심장비"], traits: "혁신·열정", sectors: "반도체, AI/IT, 엔터, 에너지, 방산" },
  토: { label: "건설/부동산/리츠", etf: ["TIGER 리츠부동산인프라"], traits: "안정·축적", sectors: "건설, 부동산, 리츠, 식품, 유통, 금융" },
  금: { label: "금/귀금속/로봇", etf: ["TIGER 로봇", "KODEX 철강"], traits: "수확·결실", sectors: "금/귀금속, 자동차, 기계/로봇, 철강" },
  수: { label: "해운/암호화폐/핀테크", etf: ["TIGER 원자력테마"], traits: "유동·지혜", sectors: "해운, 암호화폐, 핀테크, 관광" },
};

function buildFSPrompt(oh, birthData) {
  const sorted = Object.entries(oh).sort(([, a], [, b]) => b - a);
  const dominant = sorted[0][0];
  const weak = sorted[sorted.length - 1][0];

  return `당신은 사주 오행 기반 투자 시그널 전문가입니다.
사용자 오행 분포: ${Object.entries(oh).map(([k, v]) => `${k}:${v}`).join(", ")}
주도 오행: ${dominant} (${OH_ASSET[dominant].label})
부족 오행: ${weak} (${OH_ASSET[weak].label})

반드시 아래 JSON 형식으로만 응답하세요:

{
  "investType": "투자 체질 유형 이름 (예: 혁신 추구형)",
  "investDesc": "투자 성향 설명 2~3문장",
  "signals": [
    {
      "type": "주도" 또는 "보충" 또는 "시즌",
      "oheng": "오행",
      "sector": "섹터명",
      "etf": ["추천 ETF"],
      "reason": "추천 이유 1~2문장",
      "strength": 강도 (1~10)
    }
  ],
  "weekTiming": {
    "bestDay": "이번 주 최적 투자일 (요일)",
    "bestReason": "이유",
    "cautionDay": "주의일 (요일)",
    "cautionReason": "이유"
  },
  "advice": "맞춤 투자 조언 2~3문장",
  "cautionSector": "주의해야 할 섹터와 이유"
}

signals는 3개 (주도/보충/시즌 각 1개).`;
}

export async function POST(req) {
  try {
    const { birthData, oh } = await req.json();

    if (!oh) {
      return Response.json({ error: "오행 데이터가 필요합니다." }, { status: 400 });
    }

    const prompt = buildFSPrompt(oh, birthData);
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content?.map((b) => (b.type === "text" ? b.text : "")).join("") || "";

    try {
      const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      const data = JSON.parse(cleaned);
      return Response.json(data);
    } catch (parseErr) {
      return Response.json({
        investType: "분석 중",
        investDesc: text.slice(0, 300),
        signals: [],
        raw: true,
      });
    }
  } catch (error) {
    console.error("Fortune Signal API error:", error);
    return Response.json(
      { error: error.message || "시그널 생성 실패" },
      { status: 500 }
    );
  }
}
