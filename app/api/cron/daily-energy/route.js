// /api/cron/daily-energy/route.js
// Vercel Cron Job: 매일 아침 6AM KST (21:00 UTC 전날)
// vercel.json에 cron 설정 필요

export const dynamic = "force-dynamic";

// 간이 만세력 (일주 계산용)
const 천간=["갑","을","병","정","무","기","경","신","임","계"];
const 지지=["자","축","인","묘","진","사","오","미","신","유","술","해"];
const GK={갑:"甲",을:"乙",병:"丙",정:"丁",무:"戊",기:"己",경:"庚",신:"辛",임:"壬",계:"癸"};
const JK={자:"子",축:"丑",인:"寅",묘:"卯",진:"辰",사:"巳",오:"午",미:"未",신:"申",유:"酉",술:"戌",해:"亥"};
const OH_G={갑:"목",을:"목",병:"화",정:"화",무:"토",기:"토",경:"금",신:"금",임:"수",계:"수"};
const 오행상극={목:"토",화:"금",토:"수",금:"목",수:"화"};

function calcD(y,m,d){
  const base=new Date(1900,0,1);const target=new Date(y,m-1,d);
  const diff=Math.floor((target-base)/(1000*60*60*24));
  const gIdx=(diff+10)%10;const jIdx=(diff)%12;
  return{간:천간[gIdx<0?gIdx+10:gIdx],지:지지[jIdx<0?jIdx+12:jIdx]};
}

const 지지관계={
  자:{오:"충",축:"합",묘:"형",유:"합",해:"삼합",신:"삼합"},
  축:{미:"충",자:"합",진:"형",술:"형",사:"삼합",유:"삼합"},
  인:{신:"충",해:"합",사:"형",묘:"삼합",오:"삼합"},
  묘:{유:"충",술:"합",자:"형",인:"삼합",해:"삼합"},
  진:{술:"충",유:"합",진:"자형",축:"형",신:"삼합",자:"삼합"},
  사:{해:"충",신:"합",인:"형",축:"삼합",유:"삼합"},
  오:{자:"충",미:"합",오:"자형",묘:"형",인:"삼합",술:"삼합"},
  미:{축:"충",오:"합",술:"형",진:"형",해:"삼합",묘:"삼합"},
  신:{인:"충",사:"합",해:"형",자:"삼합",진:"삼합"},
  유:{묘:"충",진:"합",유:"자형",축:"삼합",사:"삼합"},
  술:{진:"충",묘:"합",축:"형",미:"형",인:"삼합",오:"삼합"},
  해:{사:"충",인:"합",해:"자형",신:"형",묘:"삼합",미:"삼합"},
};

function getDayRelation(userJi, dayJi) {
  return 지지관계[userJi]?.[dayJi] || "평";
}

function getInvestGrade(rel, hasJae) {
  if (rel === "삼합" && hasJae) return "A+";
  if (rel === "합" || rel === "삼합") return "A";
  if (rel === "평") return hasJae ? "B" : "B";
  if (rel === "형") return "C";
  if (rel === "충") return "D";
  return "B";
}

const GRADE_EMOJI = { "A+": "🔥", "A": "✨", "B": "🌤", "C": "☁️", "D": "🌧" };
const GRADE_MSG = {
  "A+": "최고의 에너지! 뭘 해도 흐름이 좋은 날",
  "A": "에너지 좋음. 적극적으로 움직이세요",
  "B": "평온한 하루. 기존 계획을 이어가세요",
  "C": "신중한 판단 필요. 큰 결정은 미루세요",
  "D": "에너지 낮음. 무리 금지, 충전의 날",
};

export async function GET(req) {
  // 인증: Vercel Cron 헤더 OR 쿼리 파라미터
  const authHeader = req.headers.get("authorization");
  const url = new URL(req.url);
  const querySecret = url.searchParams.get("secret");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}` && querySecret !== cronSecret) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 오늘 일진 계산 (KST)
    const now = new Date();
    const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    const y = kst.getFullYear(), m = kst.getMonth() + 1, d = kst.getDate();
    const dc = calcD(y, m, d);
    const dayStr = `${GK[dc.간]}${JK[dc.지]}`;
    const dayOh = OH_G[dc.간];

    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const dateStr = `${y}년 ${m}월 ${d}일 ${days[kst.getDay()]}요일`;

    // 일반적 메시지 (개인화 없이)
    // 추후: DB에서 사용자별 사주를 읽어 개인화
    const message = `🔮 NUVO AI 오늘의 에너지

📅 ${dateStr}
☯ 일진: ${dayStr}일 (${dayOh})

${Object.entries(오행상극).map(([k, v]) => {
      const rel = k === dayOh ? "비겁(같은 기운)" : v === dayOh ? "재성(재물운)" : "";
      return rel ? `  ${k} 일간 → ${rel}` : "";
    }).filter(Boolean).join("\n")}

💡 Tip: 오늘 ${dayOh}(火) 기운이 강한 날입니다.
  → ${dayOh === "화" ? "열정과 추진력이 높지만 조급함 주의" :
        dayOh === "목" ? "시작과 성장에 좋은 날. 새 프로젝트 착수" :
        dayOh === "토" ? "안정과 신뢰의 날. 계약과 협상에 유리" :
        dayOh === "금" ? "결실과 수확의 날. 마무리에 집중" :
        "유연함과 지혜의 날. 학습과 네트워킹"}

🔗 자세한 분석: https://saju-ai-one.vercel.app

✦ NUVO AI — 사주 × AI × 시장 시그널`;

    // Telegram 발송
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      return Response.json({ error: "TELEGRAM_BOT_TOKEN not set" }, { status: 500 });
    }

    // 구독자 목록 (현재는 환경변수에서 읽음, 추후 DB)
    const chatIds = (process.env.TELEGRAM_SUBSCRIBERS || "").split(",").filter(Boolean);

    if (chatIds.length === 0) {
      return Response.json({ message: "No subscribers", date: dateStr });
    }

    const results = await Promise.allSettled(
      chatIds.map(async (chatId) => {
        const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId.trim(),
            text: message,
            parse_mode: "Markdown",
          }),
        });
        return { chatId, ok: res.ok };
      })
    );

    return Response.json({
      success: true,
      date: dateStr,
      dayGan: dc.간,
      dayJi: dc.지,
      sent: results.length,
      results: results.map((r) => r.value || r.reason),
    });
  } catch (error) {
    console.error("Daily energy cron error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
