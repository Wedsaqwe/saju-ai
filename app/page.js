"use client";
import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════
   AI 사주명리 v4.0 — 동서양 융합 운명 분석 플랫폼
   ═══════════════════════════════════════════════════════════════ */

/* ═══ SAJU DATA ═══ */
const 천간=["갑","을","병","정","무","기","경","신","임","계"];
const 지지=["자","축","인","묘","진","사","오","미","신","유","술","해"];
const OH_G={갑:"목",을:"목",병:"화",정:"화",무:"토",기:"토",경:"금",신:"금",임:"수",계:"수"};
const OH_J={자:"수",축:"토",인:"목",묘:"목",진:"토",사:"화",오:"화",미:"토",신:"금",유:"금",술:"토",해:"수"};
const OHC={목:"#34D399",화:"#F472B6",토:"#FBBF24",금:"#A78BFA",수:"#60A5FA"};
const OHK={목:"木",화:"火",토:"土",금:"金",수:"水"};
const GK={갑:"甲",을:"乙",병:"丙",정:"丁",무:"戊",기:"己",경:"庚",신:"辛",임:"壬",계:"癸"};
const JK={자:"子",축:"丑",인:"寅",묘:"卯",진:"辰",사:"巳",오:"午",미:"未",신:"申",유:"酉",술:"戌",해:"亥"};
const DDI={자:"쥐",축:"소",인:"호랑이",묘:"토끼",진:"용",사:"뱀",오:"말",미:"양",신:"원숭이",유:"닭",술:"개",해:"돼지"};
const DDI_E={자:"🐀",축:"🐂",인:"🐅",묘:"🐇",진:"🐉",사:"🐍",오:"🐴",미:"🐑",신:"🐒",유:"🐓",술:"🐕",해:"🐖"};
const SJ_MAP=[[23,1,"자"],[1,3,"축"],[3,5,"인"],[5,7,"묘"],[7,9,"진"],[9,11,"사"],[11,13,"오"],[13,15,"미"],[15,17,"신"],[17,19,"유"],[19,21,"술"],[21,23,"해"]];
const 시진표=[
  {지:"자",시:"子時",범위:"23:00~01:00",설명:"밤 11시~새벽 1시"},
  {지:"축",시:"丑時",범위:"01:00~03:00",설명:"새벽 1시~3시"},
  {지:"인",시:"寅時",범위:"03:00~05:00",설명:"새벽 3시~5시"},
  {지:"묘",시:"卯時",범위:"05:00~07:00",설명:"새벽 5시~7시"},
  {지:"진",시:"辰時",범위:"07:00~09:00",설명:"아침 7시~9시"},
  {지:"사",시:"巳時",범위:"09:00~11:00",설명:"오전 9시~11시"},
  {지:"오",시:"午時",범위:"11:00~13:00",설명:"낮 11시~오후 1시"},
  {지:"미",시:"未時",범위:"13:00~15:00",설명:"오후 1시~3시"},
  {지:"신",시:"申時",범위:"15:00~17:00",설명:"오후 3시~5시"},
  {지:"유",시:"酉時",범위:"17:00~19:00",설명:"오후 5시~7시"},
  {지:"술",시:"戌時",범위:"19:00~21:00",설명:"저녁 7시~9시"},
  {지:"해",시:"亥時",범위:"21:00~23:00",설명:"밤 9시~11시"},
];
const 오행상생={목:"화",화:"토",토:"금",금:"수",수:"목"};
const 오행상극={목:"토",화:"금",토:"수",금:"목",수:"화"};
const 음양간={갑:"양",을:"음",병:"양",정:"음",무:"양",기:"음",경:"양",신:"음",임:"양",계:"음"};
const 음양지={자:"양",축:"음",인:"양",묘:"음",진:"양",사:"음",오:"양",미:"음",신:"양",유:"음",술:"양",해:"음"};
const 십성색={비견:"#A78BFA",겁재:"#A78BFA",식신:"#34D399",상관:"#34D399",편재:"#FBBF24",정재:"#FBBF24",편관:"#F472B6",정관:"#F472B6",편인:"#60A5FA",정인:"#60A5FA"};
const 십성설명={비견:"나와 같은 기운. 독립심, 자존심",겁재:"비슷하지만 다른 기운. 승부욕",식신:"내가 만드는 기운. 표현력, 재능",상관:"내가 뿜는 기운. 창의력",편재:"내가 다스리는 재물. 사업수완",정재:"안정적 재물. 월급, 저축",편관:"나를 압박하는 기운. 직장, 권위",정관:"나를 바로잡는 기운. 명예",편인:"편향된 학문. 특수기술",정인:"바른 학문. 어머니, 자격증"};

/* ═══ ZODIAC DATA (v4 신규) ═══ */
const ZODIAC=[
  {sign:"양자리",en:"Aries",symbol:"♈",element:"불",dates:"3/21-4/19",planet:"화성",traits:"개척, 리더십, 열정",startM:3,startD:21,endM:4,endD:19},
  {sign:"황소자리",en:"Taurus",symbol:"♉",element:"땅",dates:"4/20-5/20",planet:"금성",traits:"안정, 인내, 감각",startM:4,startD:20,endM:5,endD:20},
  {sign:"쌍둥이자리",en:"Gemini",symbol:"♊",element:"공기",dates:"5/21-6/20",planet:"수성",traits:"소통, 다재다능, 호기심",startM:5,startD:21,endM:6,endD:20},
  {sign:"게자리",en:"Cancer",symbol:"♋",element:"물",dates:"6/21-7/22",planet:"달",traits:"감성, 보호, 가정",startM:6,startD:21,endM:7,endD:22},
  {sign:"사자자리",en:"Leo",symbol:"♌",element:"불",dates:"7/23-8/22",planet:"태양",traits:"자신감, 창의력, 리더",startM:7,startD:23,endM:8,endD:22},
  {sign:"처녀자리",en:"Virgo",symbol:"♍",element:"땅",dates:"8/23-9/22",planet:"수성",traits:"분석, 완벽주의, 봉사",startM:8,startD:23,endM:9,endD:22},
  {sign:"천칭자리",en:"Libra",symbol:"♎",element:"공기",dates:"9/23-10/22",planet:"금성",traits:"균형, 조화, 미적감각",startM:9,startD:23,endM:10,endD:22},
  {sign:"전갈자리",en:"Scorpio",symbol:"♏",element:"물",dates:"10/23-11/21",planet:"명왕성",traits:"통찰, 변환, 집중력",startM:10,startD:23,endM:11,endD:21},
  {sign:"사수자리",en:"Sagittarius",symbol:"♐",element:"불",dates:"11/22-12/21",planet:"목성",traits:"자유, 탐구, 낙관",startM:11,startD:22,endM:12,endD:21},
  {sign:"염소자리",en:"Capricorn",symbol:"♑",element:"땅",dates:"12/22-1/19",planet:"토성",traits:"야망, 책임감, 인내",startM:12,startD:22,endM:1,endD:19},
  {sign:"물병자리",en:"Aquarius",symbol:"♒",element:"공기",dates:"1/20-2/18",planet:"천왕성",traits:"혁신, 독립, 인도주의",startM:1,startD:20,endM:2,endD:18},
  {sign:"물고기자리",en:"Pisces",symbol:"♓",element:"물",dates:"2/19-3/20",planet:"해왕성",traits:"직관, 공감, 예술",startM:2,startD:19,endM:3,endD:20},
];
const ELEM_COLOR={불:"#EF4444",땅:"#EAB308",공기:"#A78BFA",물:"#3B82F6"};

function getZodiac(m,d){
  const md=m*100+d;
  // 염소자리 spans year boundary
  if(md>=1222||md<=119) return ZODIAC[9];
  for(const z of ZODIAC){
    const s=z.startM*100+z.startD, e=z.endM*100+z.endD;
    if(s<=e&&md>=s&&md<=e) return z;
  }
  return ZODIAC[11]; // fallback pisces
}

/* ═══ MBTI ESTIMATION (v4 신규) ═══ */
function estimateMBTI(oh, saju){
  const dG=saju.일주.간, dOh=OH_G[dG], dYY=음양간[dG];
  // Collect 십성s
  const ssList=[];
  [saju.년주,saju.월주,saju.시주].filter(Boolean).forEach(p=>{
    ssList.push(get십성(dOh,dYY,OH_G[p.간],음양간[p.간]));
    ssList.push(get십성(dOh,dYY,OH_J[p.지],음양지[p.지]));
  });
  
  // 오행 기반 E/I
  const ei_e=(oh.목||0)+(oh.화||0);
  const ei_i=(oh.금||0)+(oh.수||0);
  const EI=ei_e>ei_i?"E":"I";
  
  // S/N
  const sn_s=(oh.토||0)+(oh.금||0);
  const sn_n=(oh.수||0)+(oh.목||0);
  const SN=sn_s>sn_n?"S":"N";
  
  // T/F
  const tf_t=(oh.금||0)+(oh.수||0);
  const tf_f=(oh.화||0)+(oh.목||0);
  const TF=tf_t>tf_f?"T":"F";
  
  // J/P
  const jp_j=(oh.토||0)+(oh.금||0);
  const jp_p=(oh.목||0)+(oh.화||0);
  const JP=jp_j>jp_p?"J":"P";
  
  // 십성 보정
  let scores={E:0,I:0,S:0,N:0,T:0,F:0,J:0,P:0};
  ssList.forEach(ss=>{
    if(ss==="편재"){scores.E++;scores.S++}
    if(ss==="정재"){scores.I++;scores.S++}
    if(ss==="편인"){scores.I++;scores.N++}
    if(ss==="정인"){scores.E++;scores.N++}
    if(ss==="편관"){scores.I++;scores.T++}
    if(ss==="정관"){scores.E++;scores.T++}
    if(ss==="식신"){scores.I++;scores.F++}
    if(ss==="상관"){scores.E++;scores.F++}
  });
  
  const finalEI=(EI==="E"?1:-1)+(scores.E-scores.I)>0?"E":"I";
  const finalSN=(SN==="S"?1:-1)+(scores.S-scores.N)>0?"S":"N";
  const finalTF=(TF==="T"?1:-1)+(scores.T-scores.F)>0?"T":"F";
  const finalJP=(JP==="J"?1:-1)+(scores.J-scores.P)>0?"J":"P";
  
  return finalEI+finalSN+finalTF+finalJP;
}

const MBTI_DESC={
  INTJ:"전략적 사색가 — 독립적이고 분석적이며 장기 비전을 세우는 유형",
  INTP:"논리적 탐구자 — 지적 호기심이 강하고 개념적 사고를 즐기는 유형",
  ENTJ:"결단력 있는 지휘관 — 효율적이고 전략적인 리더 유형",
  ENTP:"혁신적 발명가 — 새로운 아이디어와 가능성을 탐구하는 유형",
  INFJ:"통찰력 있는 조언자 — 깊은 직관과 이상을 가진 유형",
  INFP:"이상주의적 치유자 — 내면의 가치와 감성을 중시하는 유형",
  ENFJ:"영감을 주는 리더 — 타인을 성장시키는 데 열정적인 유형",
  ENFP:"열정적 활동가 — 자유롭고 창의적이며 가능성을 보는 유형",
  ISTJ:"신뢰할 수 있는 관리자 — 책임감과 조직력이 뛰어난 유형",
  ISFJ:"헌신적인 보호자 — 따뜻하고 세심하며 조화를 추구하는 유형",
  ESTJ:"체계적인 관리자 — 질서와 규칙을 중시하는 실행력의 유형",
  ESFJ:"사교적인 외교관 — 타인의 감정에 민감하고 조화를 이끄는 유형",
  ISTP:"만능 장인 — 실용적이고 적응력이 뛰어난 분석가 유형",
  ISFP:"감성적 예술가 — 내면의 가치를 조용히 표현하는 유형",
  ESTP:"모험적 사업가 — 에너지 넘치고 현실적인 행동파 유형",
  ESFP:"자유로운 연예인 — 즐거움과 경험을 중시하는 활력의 유형"
};

/* ═══ 만세력 ═══ */
function calcY(y){const g=(y-4)%10,j=(y-4)%12;return{간:천간[g>=0?g:g+10],지:지지[j>=0?j:j+12]}}
function calcM(y,m){const b=(천간.indexOf(calcY(y).간)%5)*2+2;return{간:천간[(b+m-1)%10],지:지지[(m+1)%12]}}
function calcD(y,m,d){const a=Math.floor((14-m)/12),yr=y+4800-a,mo=m+12*a-3,j=d+Math.floor((153*mo+2)/5)+365*yr+Math.floor(yr/4)-Math.floor(yr/100)+Math.floor(yr/400)-32045;return{간:천간[(j+9)%10>=0?(j+9)%10:(j+9)%10+10],지:지지[(j+1)%12>=0?(j+1)%12:(j+1)%12+12]}}
function calcH(dg,h){let hz="자";for(const[s,e,z]of SJ_MAP)if(s>e?(h>=s||h<e):(h>=s&&h<e)){hz=z;break}return{간:천간[((천간.indexOf(dg)%5)*2+지지.indexOf(hz))%10],지:hz}}
function mkSaju(y,m,d,h){const a=calcY(y),b=calcM(y,m),c=calcD(y,m,d);return{년주:a,월주:b,일주:c,시주:h!==null?calcH(c.간,h):null}}
function cntOH(s){const c={목:0,화:0,토:0,금:0,수:0};[s.년주,s.월주,s.일주,s.시주].filter(Boolean).forEach(p=>{c[OH_G[p.간]]++;c[OH_J[p.지]]++});return c}
function sStr(s){return `${GK[s.년주.간]}${JK[s.년주.지]} ${GK[s.월주.간]}${JK[s.월주.지]} ${GK[s.일주.간]}${JK[s.일주.지]}${s.시주?` ${GK[s.시주.간]}${JK[s.시주.지]}`:""}`}
function get십성(dOh,dYY,tOh,tYY){
  if(dOh===tOh&&dYY===tYY)return"비견";if(dOh===tOh)return"겁재";
  if(오행상생[dOh]===tOh&&dYY===tYY)return"식신";if(오행상생[dOh]===tOh)return"상관";
  if(오행상극[dOh]===tOh&&dYY===tYY)return"편재";if(오행상극[dOh]===tOh)return"정재";
  if(오행상극[tOh]===dOh&&dYY===tYY)return"편관";if(오행상극[tOh]===dOh)return"정관";
  if(오행상생[tOh]===dOh&&dYY===tYY)return"편인";if(오행상생[tOh]===dOh)return"정인";
  return"비견";
}
function hourFromSijin(sj){if(!sj)return null;const m={자:0,축:2,인:4,묘:6,진:8,사:10,오:12,미:14,신:16,유:18,술:20,해:22};return m[sj]??null}

/* ═══ API ═══ */
async function callAI(sys,msgs,mt=4000){
  try{
    const r=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:mt,system:sys,messages:msgs})});
    const d=await r.json();
    return d.content?.map(b=>b.type==="text"?b.text:"").join("")||"분석 결과를 불러올 수 없습니다.";
  }catch(e){return "네트워크 오류가 발생했습니다. 다시 시도해주세요."}
}

/* ═══ PROMPTS ═══ */
const SYS=`당신은 40년 경력의 대한민국 최고 사주명리학 대가입니다. 전통 명리학(격국론,용신론,십성론,신살론,합충형파해,대운·세운)에 정통하며 현대적이고 따뜻한 "~해요" 체로 풀이합니다. 한자 용어에 쉬운 설명을 반드시 병기합니다.`;
const PR_BASIC=SYS+`\n\n기본 분석(마크다운,900자):\n# {NAME}님의 사주 풀이\n## 🔮 사주 구성\n## ⚖️ 오행 균형과 용신\n## 🌟 타고난 기질\n## 📅 2026년 병오년\n## 💡 조언`;
const PR_PREMIUM=SYS+`\n\n프리미엄 상세 분석(마크다운,3000자+):\n# {NAME}님의 프리미엄 분석\n## 🔮 사주 심층 해석\n## ⚖️ 오행 & 용신\n## 🌟 성격·재능\n## 💰 재물운\n## 💼 직업운\n## 💕 연애운\n## 🏥 건강운\n## 📅 2026년 분기별\n### 1~3월\n### 4~6월\n### 7~9월\n### 10~12월\n## 🔄 10년 대운\n## 🎯 인생 조언 TOP 5`;
const PR_COMPAT=SYS+`\n\n궁합(마크다운):\n# {N1} ♥ {N2}\n## 💕 궁합 점수: [XX]/100\n## 🔮 두 사주의 관계\n## 💪 강점 3가지\n## ⚠️ 주의점 3가지\n## 💡 궁합 높이는 법\n## 📅 2026 관계 운세`;
const PR_DAILY=SYS+`\n\n오늘(2026.3.17 화)의 운세(마크다운,500자):\n# ✨ 오늘의 운세\n## 총운\n## 행운 포인트\n- 🎨 행운의 색\n- 🔢 행운의 숫자\n- 🧭 방위\n- 🍽 음식\n## ⏰ 시간대별\n## 💡 한마디`;
const PR_CAT=SYS+`\n\n{CAT} 상세 분석(마크다운,800자). 구체적 시기, 실천법 포함.`;
const PR_TAROT=SYS+`\n\n사주 기반 타로 해석(마크다운,700자):\n# 🎴 타로 리딩\n## 과거 — {C1}\n## 현재 — {C2}\n## 미래 — {C3}\n## 🔮 종합 메시지`;

/* v4 신규 프롬프트 */
const PR_ASTRO=`당신은 서양 점성술 전문가입니다. 태양 별자리, 원소(불/땅/공기/물), 지배 행성을 기반으로 분석합니다.\n마크다운으로 제공:\n# {SYMBOL} {SIGN} 분석\n## 기본 성향\n## 올해(2026) 행성 트랜짓 영향\n## 연애 & 궁합 좋은 별자리\n## 직업 & 재물\n## 건강 주의점\n## 이 별자리의 2026년 월별 포인트`;

const PR_INTEGRATED=`당신은 동양 명리학과 서양 점성술을 모두 수련한 통합 역학자입니다.
아래 세 가지 분석 결과를 교차 검증하여 통합 리포트를 작성하세요.

[사주명리] 사주: {SAJU}, 일간: {ILGAN}, 오행: {OHENG}, 십성: {SIPSUNG}
[서양점성술] 태양 별자리: {SIGN}, 원소: {ELEMENT}, 지배행성: {PLANET}
[MBTI 추정] 유형: {MBTI}

마크다운으로 제공 (3000자 이상):
# 🌌 {NAME}님의 동서양 통합 운명 분석

## 🔮 세 체계가 공통으로 말하는 당신의 본질
(사주, 점성술, MBTI가 공통으로 가리키는 핵심 성격 3가지)

## ☯ 사주명리가 보는 당신
(요약)

## ⭐ 서양 점성술이 보는 당신
(요약)

## 🧠 추정 MBTI: {MBTI}
(사주·점성술과 일치하는 점)

## 💰 재물운 — 동서양 교차 분석
## 💕 연애운 — 동서양 교차 분석
## 💼 직업운 — 동서양 교차 분석
## 🏥 건강운 — 동서양 교차 분석

## 📅 2026년 통합 운세
### 봄 (1~3월)
### 여름 (4~6월)
### 가을 (7~9월)
### 겨울 (10~12월)

## 🎯 세 체계가 합의하는 인생 조언 TOP 5`;

const PR_FACE_SAJU=SYS+`\n\n사주 오행 분포를 기반으로 관상학적 외모 경향성과 성격을 추정하세요.\n\n오행별 관상 특징:\n- 목(木) 강: 키 크고 마른 체형, 긴 얼굴, 눈매 선명\n- 화(火) 강: 이마 넓고 눈 빛남, 뾰족한 인상, 활발한 표정\n- 토(土) 강: 둥근 얼굴, 넓은 코, 안정감 있는 인상\n- 금(金) 강: 각진 얼굴, 서글서글한 눈, 단정한 인상\n- 수(水) 강: 둥근 체형, 귀가 크고 눈 깊음, 지적 인상\n\n마크다운:\n# 👤 {NAME}님의 사주 기반 관상 추정\n## 오행 분포로 본 외모 경향\n## 얼굴형 추정\n## 눈·코·입 특징\n## 관상으로 본 성격\n## 관상으로 본 운세 경향\n## ⚠️ 참고사항\n\n"관상은 참고용이며, 운명은 스스로 만들어가는 것"이라고 반드시 명시.`;

const PR_FACE_PHOTO=`당신은 동양 관상학 전문가입니다. 업로드된 얼굴 사진을 분석하여 관상학적 해석을 제공하세요.

분석 항목:
1. 얼굴형 (둥근형/긴형/각진형/달걀형 등) → 기본 성향
2. 이마 (넓이, 높이) → 초년운, 지적 능력
3. 눈 (크기, 형태, 눈꼬리) → 성격, 감정 표현
4. 코 (크기, 형태) → 재물운, 자존심
5. 입 (크기, 입술 두께) → 대인관계, 복
6. 귀 (크기, 위치) → 지혜, 장수
7. 종합 관상 운세

마크다운:
# 👤 관상 분석 결과
## 얼굴형과 기본 성향
## 이마 — 초년운
## 눈 — 성격과 감정
## 코 — 재물과 자존심
## 입 — 대인관계와 복
## 귀 — 지혜와 장수
## 🔮 종합 관상 운세
## ⚠️ 참고사항

"관상은 참고용이며, 운명은 스스로 만들어가는 것"이라고 반드시 명시.
사주 정보가 함께 제공되면 관상과 사주의 일치/불일치 포인트도 분석.`;

const TAROT=[
  {kr:"광대",name:"The Fool",meaning:"새로운 시작",icon:"🃏"},
  {kr:"마법사",name:"Magician",meaning:"창의력",icon:"🪄"},
  {kr:"여사제",name:"High Priestess",meaning:"직관",icon:"🌙"},
  {kr:"여황제",name:"Empress",meaning:"풍요",icon:"👑"},
  {kr:"황제",name:"Emperor",meaning:"안정",icon:"🏛"},
  {kr:"교황",name:"Hierophant",meaning:"가르침",icon:"📿"},
  {kr:"연인",name:"Lovers",meaning:"사랑과 선택",icon:"💕"},
  {kr:"전차",name:"Chariot",meaning:"의지와 승리",icon:"⚡"},
  {kr:"힘",name:"Strength",meaning:"용기",icon:"🦁"},
  {kr:"은둔자",name:"Hermit",meaning:"내면 탐구",icon:"🏔"},
  {kr:"운명의 수레바퀴",name:"Wheel",meaning:"변화",icon:"🎡"},
  {kr:"정의",name:"Justice",meaning:"균형",icon:"⚖️"},
  {kr:"매달린 사람",name:"Hanged Man",meaning:"새 관점",icon:"🔄"},
  {kr:"죽음",name:"Death",meaning:"변환",icon:"🦋"},
  {kr:"절제",name:"Temperance",meaning:"조화",icon:"🏺"},
  {kr:"악마",name:"Devil",meaning:"해방",icon:"🔥"},
  {kr:"탑",name:"Tower",meaning:"변화",icon:"💥"},
  {kr:"별",name:"Star",meaning:"희망",icon:"⭐"},
  {kr:"달",name:"Moon",meaning:"직감",icon:"🌕"},
  {kr:"태양",name:"Sun",meaning:"기쁨",icon:"☀️"},
  {kr:"심판",name:"Judgement",meaning:"결단",icon:"📯"},
  {kr:"세계",name:"World",meaning:"완성",icon:"🌍"},
];

/* ═══ Markdown Renderer ═══ */
function Md({text}){
  if(!text)return null;
  const f=s=>s.replace(/\*\*(.*?)\*\*/g,'<strong style="color:#E0D4FF">$1</strong>').replace(/\*(.*?)\*/g,'<em style="color:#A78BFA">$1</em>');
  return text.split("\n").map((l,i)=>{
    if(l.startsWith("### "))return <h3 key={i} style={{fontSize:"15px",fontWeight:600,color:"#A78BFA",margin:"14px 0 5px"}}>{l.slice(4)}</h3>;
    if(l.startsWith("## "))return <h2 key={i} style={{fontSize:"18px",fontWeight:600,color:"#E0D4FF",margin:"20px 0 7px"}}>{l.slice(3)}</h2>;
    if(l.startsWith("# "))return <h1 key={i} style={{fontSize:"22px",fontWeight:700,color:"#fff",margin:"0 0 10px"}}>{l.slice(2)}</h1>;
    if(l.startsWith("---"))return <div key={i} style={{height:"1px",background:"linear-gradient(90deg,transparent,#A78BFA22,transparent)",margin:"16px 0"}}/>;
    if(l.startsWith("- "))return <p key={i} style={{margin:"2px 0 2px 12px",color:"#B4A8D2",fontSize:"15px",lineHeight:1.85}}><span style={{color:"#A78BFA",marginRight:"5px",fontSize:"5px",verticalAlign:"middle"}}>●</span><span dangerouslySetInnerHTML={{__html:f(l.slice(2))}}/></p>;
    if(l.match(/^\d+\.\s/))return <p key={i} style={{margin:"2px 0 2px 12px",color:"#B4A8D2",fontSize:"15px",lineHeight:1.85}} dangerouslySetInnerHTML={{__html:f(l)}}/>;
    if(!l.trim())return <div key={i} style={{height:"4px"}}/>;
    return <p key={i} style={{margin:"2px 0",color:"#B4A8D2",fontSize:"15px",lineHeight:1.9}} dangerouslySetInnerHTML={{__html:f(l)}}/>;
  });
}

/* ═══ Glass Card ═══ */
function G({children,style,...p}){return <div style={{background:"rgba(255,255,255,0.035)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"16px",padding:"20px",...style}} {...p}>{children}</div>}

/* ═══ Spinner ═══ */
function Spin({color="#A78BFA",size=16}){return <div style={{width:size,height:size,margin:"0 auto",borderRadius:"50%",border:`1.5px solid #1E1A30`,borderTopColor:color,animation:"spin 1s linear infinite"}}/>}

/* ═══ SajuTable ═══ */
function SajuTable({saju,oh}){
  const dG=saju.일주.간, dOh=OH_G[dG], dYY=음양간[dG];
  const pills=[saju.시주?{l:"시주",h:"時",...saju.시주}:null,{l:"일주",h:"日",...saju.일주},{l:"월주",h:"月",...saju.월주},{l:"년주",h:"年",...saju.년주}].filter(Boolean);
  return <div>
    <table style={{width:"100%",borderCollapse:"collapse"}}>
      <thead><tr><td style={{padding:"4px 8px",color:"#4A4060",fontSize:"11px"}}></td>
        {pills.map((p,i)=><th key={i} style={{padding:"6px",textAlign:"center",color:p.l==="일주"?"#A78BFA":"#6B5F8A",fontSize:"11px",borderBottom:"1px solid rgba(167,139,250,0.1)"}}>{p.h}柱<br/><span style={{fontSize:"10px",color:"#4A4060"}}>{p.l}</span></th>)}
      </tr></thead>
      <tbody>
        <tr><td style={{padding:"4px 6px",color:"#4A4060",fontSize:"10px",textAlign:"right"}}>십성</td>
          {pills.map((p,i)=>{const ss=get십성(dOh,dYY,OH_G[p.간],음양간[p.간]);return <td key={i} style={{padding:"4px",textAlign:"center",color:p.l==="일주"?"#A78BFA":(십성색[ss]||"#6B5F8A"),fontSize:"12px"}} title={십성설명[ss]|""}>{p.l==="일주"?"일간":ss}</td>})}
        </tr>
        <tr><td style={{padding:"4px 6px",color:"#4A4060",fontSize:"10px",textAlign:"right"}}>천간</td>
          {pills.map((p,i)=>{const c=OHC[OH_G[p.간]];return <td key={i} style={{padding:"8px 4px",textAlign:"center",background:p.l==="일주"?"rgba(167,139,250,0.08)":"transparent",borderRadius:"6px"}}><div style={{fontSize:"26px",fontWeight:300,color:"#fff"}}>{GK[p.간]}</div><div style={{fontSize:"9px",color:c,fontWeight:600,marginTop:"2px"}}>{OHK[OH_G[p.간]]} {음양간[p.간]}</div></td>})}
        </tr>
        <tr><td style={{padding:"4px 6px",color:"#4A4060",fontSize:"10px",textAlign:"right"}}>지지</td>
          {pills.map((p,i)=>{const c=OHC[OH_J[p.지]];const ss=get십성(dOh,dYY,OH_J[p.지],음양지[p.지]);return <td key={i} style={{padding:"8px 4px",textAlign:"center",borderTop:"1px solid rgba(167,139,250,0.06)"}}><div style={{fontSize:"26px",fontWeight:300,color:"#fff"}}>{JK[p.지]}</div><div style={{fontSize:"9px",color:c,fontWeight:600,marginTop:"2px"}}>{OHK[OH_J[p.지]]} {음양지[p.지]}</div><div style={{fontSize:"9px",color:십성색[ss]||"#4A4060",marginTop:"1px"}} title={십성설명[ss]|""}>{ss}</div></td>})}
        </tr>
      </tbody>
    </table>
    {oh && <div style={{marginTop:"14px"}}>
      <div style={{display:"flex",gap:"2px",height:"6px",borderRadius:"3px",overflow:"hidden"}}>{Object.entries(oh).map(([k,v])=>v>0&&<div key={k} style={{flex:v,background:OHC[k],opacity:.5}}/>)}</div>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:"6px"}}>{Object.entries(oh).map(([k,v])=><div key={k} style={{textAlign:"center",flex:1}}><div style={{fontSize:"16px",fontWeight:600,color:v===0?"#2A2540":OHC[k]}}>{v}</div><div style={{fontSize:"10px",color:"#4A4060"}}>{OHK[k]}</div></div>)}</div>
    </div>}
  </div>;
}

/* ═══ Category Cards ═══ */
function CatCards({onSelect}){
  const cats=[{id:"wealth",emoji:"💰",label:"재물운",color:"#FBBF24"},{id:"love",emoji:"💕",label:"연애운",color:"#F472B6"},{id:"career",emoji:"💼",label:"직업운",color:"#A78BFA"},{id:"health",emoji:"🏥",label:"건강운",color:"#34D399"},{id:"study",emoji:"📚",label:"학업운",color:"#60A5FA"},{id:"luck",emoji:"🍀",label:"행운",color:"#F59E0B"}];
  return <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"8px"}}>{cats.map(c=><div key={c.id} onClick={()=>onSelect(c)} style={{cursor:"pointer",background:`${c.color}08`,border:`1px solid ${c.color}20`,borderRadius:"12px",padding:"14px 8px",textAlign:"center"}}><div style={{fontSize:"22px",marginBottom:"4px"}}>{c.emoji}</div><div style={{fontSize:"14px",fontWeight:600,color:"#E0D4FF"}}>{c.label}</div></div>)}</div>;
}

/* ═══ Tarot Card ═══ */
function TCard({card,flipped,onClick,delay}){
  return <div onClick={onClick} style={{width:"88px",height:"136px",perspective:"600px",cursor:flipped?"default":"pointer",animation:`fadeIn .5s ease ${delay}s both`}}>
    <div style={{width:"100%",height:"100%",position:"relative",transformStyle:"preserve-3d",transition:"transform 0.8s cubic-bezier(.4,0,.2,1)",transform:flipped?"rotateY(180deg)":"rotateY(0)"}}>
      <div style={{position:"absolute",inset:0,backfaceVisibility:"hidden",borderRadius:"12px",background:"linear-gradient(145deg,#1E1A30,#2A2540)",border:"1px solid rgba(167,139,250,0.2)",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:"18px",color:"#A78BFA",opacity:.4}}>✦</span></div>
      <div style={{position:"absolute",inset:0,backfaceVisibility:"hidden",transform:"rotateY(180deg)",borderRadius:"12px",background:"linear-gradient(145deg,#1A1530,#0F0D24)",border:"1px solid rgba(167,139,250,0.25)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"8px",textAlign:"center"}}><span style={{fontSize:"26px",marginBottom:"4px"}}>{card?.icon}</span><span style={{fontSize:"11px",fontWeight:600,color:"#E0D4FF"}}>{card?.kr}</span></div>
    </div>
  </div>;
}

/* ═══ Stars ═══ */
function Stars(){const s=Array.from({length:30},()=>({x:Math.random()*100,y:Math.random()*100,s:Math.random()*1.2+.3,d:Math.random()*5+2}));return <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0}}>{s.map((p,i)=><div key={i} style={{position:"absolute",left:`${p.x}%`,top:`${p.y}%`,width:`${p.s}px`,height:`${p.s}px`,borderRadius:"50%",background:"#fff",opacity:.08,animation:`tw ${p.d}s ease infinite`}}/>)}</div>}

/* ═══════════════════════════════════════════════════════════════
   MAIN APP — All text inputs are UNCONTROLLED (no value={state})
   Korean IME safe: state is only read on button click via refs
   ═══════════════════════════════════════════════════════════════ */
export default function SajuApp(){
  // Page navigation
  const[pg,setPg]=useState("splash");
  const[tab,setTab]=useState("result");
  const[navTab,setNT]=useState("home");

  // Form selections (buttons/selects only — safe for React)
  const[gender,setGender]=useState("");
  const[month,setMonth]=useState("");
  const[day,setDay]=useState("");
  const[sijin,setSijin]=useState(null);
  const[gender2,setGender2]=useState("");
  const[month2,setMonth2]=useState("");
  const[day2,setDay2]=useState("");
  const[sijin2,setSijin2]=useState(null);

  // Text input refs — NEVER bind value={} to these
  const nameRef=useRef(null);
  const yearRef=useRef(null);
  const questionRef=useRef(null);
  const name2Ref=useRef(null);
  const year2Ref=useRef(null);
  const chatRef=useRef(null);
  const scrollRef=useRef(null);
  const photoRef=useRef(null);

  // Results & loading
  const[saju,setSaju]=useState(null);
  const[saju2,setSaju2]=useState(null);
  const[oh,setOh]=useState(null);
  const[oh2,setOh2]=useState(null);
  const[rd,setRd]=useState("");
  const[loading,setLoading]=useState(false);
  const[mode,setMode]=useState("basic");
  const[prem,setPrem]=useState(false);
  const[pw,setPw]=useState(false);
  const[li,setLi]=useState(0);
  const[showManse,setShowManse]=useState(false);

  // Chat
  const[ch,setCh]=useState([]);
  const[chatLoading,setChatLoading]=useState(false);

  // Daily & Category & Tarot
  const[dailyRd,setDailyRd]=useState("");
  const[dailyLoading,setDailyLoading]=useState(false);
  const[catRd,setCatRd]=useState("");
  const[catLoading,setCatLoading]=useState(false);
  const[catName,setCatName]=useState("");
  const[tCards,setTCards]=useState([]);
  const[tFlip,setTFlip]=useState([false,false,false]);
  const[tRd,setTRd]=useState("");
  const[tLoading,setTLoading]=useState(false);

  // v4: Astrology
  const[astroRd,setAstroRd]=useState("");
  const[astroLoading,setAstroLoading]=useState(false);
  const[zodiac,setZodiac]=useState(null);

  // v4: MBTI
  const[mbti,setMbti]=useState(null);

  // v4: Integrated report
  const[intRd,setIntRd]=useState("");
  const[intLoading,setIntLoading]=useState(false);

  // v4: Face reading
  const[faceRd,setFaceRd]=useState("");
  const[faceLoading,setFaceLoading]=useState(false);
  const[facePhoto,setFacePhoto]=useState(null);
  const[faceMode,setFaceMode]=useState("saju"); // "saju" or "photo"

  // Stored values
  const[savedName,setSavedName]=useState("");
  const[savedYear,setSavedYear]=useState("");
  const[savedName2,setSavedName2]=useState("");
  const[savedYear2,setSavedYear2]=useState("");

  const loadMsgs=["사주를 펼칩니다","천간의 기운을 읽습니다","오행을 살핍니다","용신을 찾습니다","별자리를 읽습니다","동서양을 융합합니다"];
  useEffect(()=>{if(pg==="splash"){const t=setTimeout(()=>setPg("home"),2000);return()=>clearTimeout(t)}},[pg]);
  useEffect(()=>{if(loading){const t=setInterval(()=>setLi(p=>(p+1)%loadMsgs.length),2200);return()=>clearInterval(t)}},[loading]);
  useEffect(()=>{scrollRef.current?.scrollIntoView({behavior:"smooth"})},[ch]);

  const hasSaju=!!saju;
  const INP={width:"100%",padding:"12px 14px",borderRadius:"10px",border:"1px solid rgba(167,139,250,0.12)",background:"rgba(255,255,255,0.03)",color:"#E0D4FF",fontSize:"16px",fontFamily:"'Pretendard',sans-serif",outline:"none",boxSizing:"border-box"};

  /* ═══ Form readers ═══ */
  function readForm(){
    const n=nameRef.current?.value||"";
    const y=yearRef.current?.value||"";
    const q=questionRef.current?.value||"";
    setSavedName(n); setSavedYear(y);
    return{name:n,year:y,question:q};
  }
  function readForm2(){
    const n=name2Ref.current?.value||"";
    const y=year2Ref.current?.value||"";
    setSavedName2(n); setSavedYear2(y);
    return{name:n,year:y};
  }

  /* ═══ Core Saju Analysis ═══ */
  async function run(m){
    const{name,year,question}=readForm();
    if(!year||!month||!day||!gender)return;
    const h=hourFromSijin(sijin);
    const s=mkSaju(+year,+month,+day,h), o=cntOH(s);
    setSaju(s); setOh(o); setPg("loading"); setLoading(true); setMode(m);
    // v4: auto-calc zodiac & mbti
    const z=getZodiac(+month,+day);
    setZodiac(z);
    const mb=estimateMBTI(o,s);
    setMbti(mb);
    const u=`이름:${name||"회원"}\n성별:${gender}\n생년월일:${year}년 ${month}월 ${day}일\n${sijin?`시:${시진표.find(x=>x.지===sijin)?.설명||""}`:""}\n사주:${sStr(s)}\n일간:${s.일주.간}(${OH_G[s.일주.간]})\n오행:${Object.entries(o).map(([k,v])=>`${OHK[k]}:${v}`).join(",")}\n띠:${DDI[s.년주.지]}\n나이:만${2026-(+year)}세\n${question?`질문:${question}`:""}`;
    const sys=(m==="premium"?PR_PREMIUM:PR_BASIC).replace("{NAME}",name||"회원");
    const text=await callAI(sys,[{role:"user",content:u}],m==="premium"?4000:2000);
    setRd(text); setCh([{role:"assistant",content:text}]); setPg("result"); setTab("result"); setLoading(false); setNT("result");
  }

  /* ═══ Compatibility ═══ */
  async function runCompat(){
    const f1=readForm(), f2=readForm2();
    if(!f1.year||!month||!day||!f2.year||!month2||!day2)return;
    const s1=mkSaju(+f1.year,+month,+day,hourFromSijin(sijin));
    const s2=mkSaju(+f2.year,+month2,+day2,hourFromSijin(sijin2));
    setSaju(s1); setSaju2(s2); setOh(cntOH(s1)); setOh2(cntOH(s2));
    setZodiac(getZodiac(+month,+day));
    setMbti(estimateMBTI(cntOH(s1),s1));
    setPg("loading"); setLoading(true); setMode("compat");
    const sys=PR_COMPAT.replace("{N1}",f1.name||"A").replace("{N2}",f2.name||"B");
    const u=`[A] ${f1.name||"A"},${gender},사주:${sStr(s1)}\n[B] ${f2.name||"B"},${gender2},사주:${sStr(s2)}`;
    const text=await callAI(sys,[{role:"user",content:u}]);
    setRd(text); setCh([{role:"assistant",content:text}]); setPg("result"); setTab("result"); setLoading(false); setNT("result");
  }

  /* ═══ Chat ═══ */
  async function doChat(){
    const val=chatRef.current?.value||"";
    if(!val.trim()||chatLoading)return;
    const msg=val.trim();
    chatRef.current.value="";
    setCh(p=>[...p,{role:"user",content:msg}]); setChatLoading(true);
    const msgs=[...ch,{role:"user",content:msg}].map(m=>({role:m.role,content:m.content}));
    const text=await callAI(`${SYS}\n사주:${saju?sStr(saju):""} 기반 답변. 마크다운. 500자 이내.`,msgs,2000);
    setCh(p=>[...p,{role:"assistant",content:text}]); setChatLoading(false);
  }

  /* ═══ Daily ═══ */
  async function doDaily(){
    if(!saju||dailyLoading)return; setDailyLoading(true);
    const u=`사주:${sStr(saju)}\n일간:${saju.일주.간}\n오행:${Object.entries(oh||{}).map(([k,v])=>`${OHK[k]}${v}`).join(" ")}\n이름:${savedName||"회원"}`;
    const text=await callAI(PR_DAILY,[{role:"user",content:u}],1200);
    setDailyRd(text); setDailyLoading(false);
  }

  /* ═══ Category ═══ */
  async function doCat(cat){
    if(!saju)return; setCatLoading(true); setCatName(cat.label); setPg("category"); setNT("category");
    const u=`사주:${sStr(saju)}\n일간:${saju.일주.간}\n오행:${Object.entries(oh||{}).map(([k,v])=>`${OHK[k]}${v}`).join(" ")}\n이름:${savedName||"회원"}\n성별:${gender}\n${cat.label} 상세 분석`;
    const text=await callAI(PR_CAT.replace("{CAT}",cat.label),[{role:"user",content:u}],2000);
    setCatRd(text); setCatLoading(false);
  }

  /* ═══ Tarot ═══ */
  function doTarot(){
    const picked=[...TAROT].sort(()=>Math.random()-.5).slice(0,3);
    setTCards(picked); setTFlip([false,false,false]); setTRd(""); setPg("tarot"); setNT("tarot");
  }
  function flipTarot(i){
    if(tFlip[i])return; const nf=[...tFlip]; nf[i]=true; setTFlip(nf);
    if(nf.every(Boolean)&&saju){
      setTLoading(true);
      const u=`사주:${sStr(saju)}\n카드:\n과거:${tCards[0].kr}\n현재:${tCards[1].kr}\n미래:${tCards[2].kr}`;
      const sys=PR_TAROT.replace("{C1}",tCards[0].kr).replace("{C2}",tCards[1].kr).replace("{C3}",tCards[2].kr);
      callAI(sys,[{role:"user",content:u}],1500).then(t=>{setTRd(t);setTLoading(false)});
    }
  }

  /* ═══ v4: Astrology ═══ */
  async function doAstro(){
    if(!saju||!zodiac)return;
    setAstroLoading(true); setPg("astro"); setNT("astro");
    const sys=PR_ASTRO.replace("{SYMBOL}",zodiac.symbol).replace("{SIGN}",zodiac.sign);
    const u=`이름:${savedName||"회원"}\n태양 별자리:${zodiac.sign}(${zodiac.en})\n원소:${zodiac.element}\n지배행성:${zodiac.planet}\n특성:${zodiac.traits}\n사주 일간:${saju.일주.간}(${OH_G[saju.일주.간]})\n오행:${Object.entries(oh||{}).map(([k,v])=>`${OHK[k]}${v}`).join(" ")}`;
    const text=await callAI(sys,[{role:"user",content:u}],2500);
    setAstroRd(text); setAstroLoading(false);
  }

  /* ═══ v4: Integrated Report (킬러 기능) ═══ */
  async function doIntegrated(){
    if(!saju||!zodiac||!mbti)return;
    setIntLoading(true); setPg("integrated"); setNT("integrated");
    const dG=saju.일주.간, dOh=OH_G[dG], dYY=음양간[dG];
    const ssList=[];
    [saju.년주,saju.월주,saju.시주].filter(Boolean).forEach(p=>{
      ssList.push(get십성(dOh,dYY,OH_G[p.간],음양간[p.간]));
    });
    const sys=PR_INTEGRATED
      .replace("{SAJU}",sStr(saju)).replace("{ILGAN}",`${saju.일주.간}(${dOh})`)
      .replace("{OHENG}",Object.entries(oh||{}).map(([k,v])=>`${OHK[k]}${v}`).join(" "))
      .replace("{SIPSUNG}",ssList.join(","))
      .replace("{SIGN}",zodiac.sign).replace("{ELEMENT}",zodiac.element).replace("{PLANET}",zodiac.planet)
      .replaceAll("{MBTI}",mbti).replace("{NAME}",savedName||"회원");
    const u=`이름:${savedName||"회원"}\n성별:${gender}\n생년월일:${savedYear}년${month}월${day}일\n사주:${sStr(saju)}\n별자리:${zodiac.sign}(${zodiac.en}) ${zodiac.symbol}\nMBTI추정:${mbti}\n오행:${Object.entries(oh||{}).map(([k,v])=>`${OHK[k]}${v}`).join(" ")}`;
    const text=await callAI(sys,[{role:"user",content:u}],4000);
    setIntRd(text); setIntLoading(false);
  }

  /* ═══ v4: Face Reading ═══ */
  async function doFaceSaju(){
    if(!saju)return;
    setFaceLoading(true); setFaceMode("saju"); setPg("face"); setNT("face");
    const u=`이름:${savedName||"회원"}\n사주:${sStr(saju)}\n일간:${saju.일주.간}(${OH_G[saju.일주.간]})\n오행:${Object.entries(oh||{}).map(([k,v])=>`${OHK[k]}${v}`).join(" ")}\n성별:${gender}`;
    const text=await callAI(PR_FACE_SAJU.replace("{NAME}",savedName||"회원"),[{role:"user",content:u}],2500);
    setFaceRd(text); setFaceLoading(false);
  }

  async function doFacePhoto(){
    if(!facePhoto)return;
    setFaceLoading(true); setFaceMode("photo"); setPg("face"); setNT("face");
    try{
      const sajuInfo=saju?`\n사주:${sStr(saju)}\n일간:${saju.일주.간}(${OH_G[saju.일주.간]})\n오행:${Object.entries(oh||{}).map(([k,v])=>`${OHK[k]}${v}`).join(" ")}`:"";
      const r=await fetch("/api/chat",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:3000,
          system:PR_FACE_PHOTO,
          messages:[{
            role:"user",
            content:[
              {type:"image",source:{type:"base64",media_type:"image/jpeg",data:facePhoto}},
              {type:"text",text:`이름:${savedName||"회원"}\n성별:${gender}${sajuInfo}\n\n위 사진의 관상을 분석해주세요.`}
            ]
          }]
        })
      });
      const d=await r.json();
      const text=d.content?.map(b=>b.type==="text"?b.text:"").join("")||"분석 결과를 불러올 수 없습니다.";
      setFaceRd(text);
    }catch(e){
      setFaceRd("사진 분석 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
    setFaceLoading(false);
  }

  function handlePhotoUpload(e){
    const file=e.target.files?.[0];
    if(!file)return;
    const reader=new FileReader();
    reader.onload=()=>{
      const base64=reader.result.split(",")[1];
      setFacePhoto(base64);
    };
    reader.readAsDataURL(file);
  }

  function reset(){setPg("home");setRd("");setCh([]);setSaju2(null);setTab("result");setNT("home")}

  /* ═══ SijinPicker ═══ */
  function SijinPicker({value,onChange}){
    return <div>
      <div style={{marginBottom:"8px",padding:"10px 12px",borderRadius:"8px",background:"rgba(167,139,250,0.04)",border:"1px solid rgba(167,139,250,0.08)"}}>
        <div style={{fontSize:"13px",color:"#8B7FA8",lineHeight:1.7}}>💡 <strong style={{color:"#B4A8D2"}}>왜 분은 안 받나요?</strong><br/>사주는 2시간 단위(시진)로 봐요. 같은 시진 안에서는 사주가 동일합니다.</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"4px"}}>
        <div onClick={()=>onChange(null)} style={{padding:"8px 4px",borderRadius:"8px",textAlign:"center",cursor:"pointer",border:value===null?"1px solid #A78BFA":"1px solid rgba(167,139,250,0.1)",background:value===null?"rgba(167,139,250,0.1)":"transparent",fontSize:"13px",color:value===null?"#E0D4FF":"#4A4060"}}>모름</div>
        {시진표.map(s=><div key={s.지} onClick={()=>onChange(s.지)} style={{padding:"6px 2px",borderRadius:"8px",textAlign:"center",cursor:"pointer",border:value===s.지?`1px solid ${OHC[OH_J[s.지]]}`:"1px solid rgba(167,139,250,0.08)",background:value===s.지?`${OHC[OH_J[s.지]]}12`:"transparent"}}>
          <div style={{fontSize:"15px",color:"#E0D4FF",fontWeight:value===s.지?600:400}}>{s.시}</div>
          <div style={{fontSize:"10px",color:"#6B5F8A"}}>{s.범위}</div>
        </div>)}
      </div>
    </div>;
  }

  /* ═══ Menu Card component ═══ */
  function MenuCard({emoji,title,desc,color="#A78BFA",onClick,badge}){
    return <G style={{cursor:"pointer",display:"flex",alignItems:"center",gap:"12px",padding:"16px 18px"}} onClick={onClick}>
      <div style={{width:"38px",height:"38px",borderRadius:"10px",background:`${color}12`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"16px",flexShrink:0}}>{emoji}</div>
      <div style={{flex:1}}>
        <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
          <div style={{fontSize:"15px",fontWeight:600,color:"#fff"}}>{title}</div>
          {badge&&<span style={{padding:"1px 6px",borderRadius:"6px",background:`${color}18`,color:color,fontSize:"9px",fontWeight:600}}>{badge}</span>}
        </div>
        <div style={{fontSize:"12px",color:"#4A4060"}}>{desc}</div>
      </div>
    </G>;
  }

  /* ═══ RENDER ═══ */
  return (
    <div style={{fontFamily:"'Pretendard',-apple-system,sans-serif",background:"linear-gradient(160deg,#0B0A1A 0%,#0F0D24 35%,#140E2E 65%,#0D0B1E 100%)",minHeight:"100vh",color:"#E0D4FF",position:"relative",overflow:"hidden",paddingBottom:"72px"}}>
      <link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" rel="stylesheet"/>
      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes tw{0%,100%{opacity:.04}50%{opacity:.4}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:.2}50%{opacity:.85}}
        @keyframes glow{0%,100%{box-shadow:0 0 15px rgba(167,139,250,.06)}50%{box-shadow:0 0 30px rgba(167,139,250,.12)}}
        @keyframes splashFade{0%{opacity:0;transform:scale(.92)}30%{opacity:1;transform:scale(1)}80%{opacity:1}100%{opacity:0}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        ::placeholder{color:#3A3454}
        select{appearance:none}
        button{transition:all .2s;font-family:'Pretendard',sans-serif}
      `}</style>
      <Stars/>

      {/* SPLASH */}
      {pg==="splash"&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",animation:"splashFade 2s ease forwards"}}>
        <span style={{fontSize:"22px",color:"#A78BFA"}}>☯</span>
        <div style={{fontSize:"7px",letterSpacing:"5px",color:"#4A4060",marginTop:"12px"}}>AI SAJU v4</div>
        <h1 style={{fontSize:"24px",fontWeight:700,color:"#fff",margin:"6px 0 0"}}>사주명리</h1>
        <p style={{fontSize:"11px",color:"#3A3454",marginTop:"4px"}}>동서양 융합 운명 분석</p>
      </div>}

      {/* PAYWALL */}
      {pw&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",backdropFilter:"blur(8px)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}} onClick={()=>setPw(false)}>
        <G style={{maxWidth:"340px",width:"100%",textAlign:"center",padding:"28px 22px"}} onClick={e=>e.stopPropagation()}>
          <div style={{fontSize:"28px",marginBottom:"8px"}}>🌌</div>
          <h2 style={{fontSize:"20px",fontWeight:700,color:"#fff",margin:"0 0 6px"}}>프리미엄 분석</h2>
          <p style={{fontSize:"12px",color:"#6B5F8A",margin:"0 0 16px"}}>동서양 통합 운명 분석의 모든 것</p>
          <div style={{textAlign:"left",marginBottom:"16px"}}>{["사주 상세 분석 (4000자+)","🌌 동서양 통합 리포트","📸 AI 사진 관상 분석","주제별 상세 운세","분기별 + 10년 대운","궁합 상세 분석","무제한 추가 질문"].map((f,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:"6px",marginBottom:"4px",fontSize:"13px",color:"#B4A8D2"}}><span style={{width:"3px",height:"3px",borderRadius:"50%",background:"#A78BFA",flexShrink:0}}/>{f}</div>)}</div>
          <div style={{marginBottom:"16px"}}><span style={{fontSize:"14px",color:"#4A4060",textDecoration:"line-through",marginRight:"8px"}}>₩4,900</span><span style={{fontSize:"28px",fontWeight:700,color:"#fff"}}>₩990</span></div>
          <button onClick={()=>{setPrem(true);setPw(false);if(saju)run("premium")}} style={{width:"100%",padding:"13px",borderRadius:"12px",border:"none",background:"linear-gradient(135deg,#A78BFA,#7C5CFC)",color:"#fff",fontSize:"14px",fontWeight:600,cursor:"pointer"}}>프리미엄 분석 받기</button>
          <button onClick={()=>setPw(false)} style={{background:"none",border:"none",color:"#3A3454",fontSize:"11px",cursor:"pointer",marginTop:"10px"}}>다음에</button>
        </G>
      </div>}

      {/* ═══ HOME ═══ */}
      {pg==="home"&&<div style={{maxWidth:"420px",margin:"0 auto",padding:"40px 20px",position:"relative",zIndex:1,animation:"fadeIn .5s"}}>
        <div style={{textAlign:"center",marginBottom:"32px"}}>
          <div style={{width:"52px",height:"52px",margin:"0 auto 12px",borderRadius:"50%",background:"radial-gradient(circle,rgba(167,139,250,.08),transparent 70%)",display:"flex",alignItems:"center",justifyContent:"center",animation:"glow 4s ease infinite"}}><span style={{fontSize:"20px",color:"#A78BFA"}}>☯</span></div>
          <div style={{fontSize:"7px",letterSpacing:"4px",color:"#3A3454",marginBottom:"6px"}}>AI SAJU v4</div>
          <h1 style={{fontSize:"28px",fontWeight:700,margin:"0 0 4px",color:"#fff"}}>사주명리</h1>
          <p style={{fontSize:"14px",color:"#3A3454"}}>동서양 융합 운명 분석 플랫폼</p>
        </div>

        {/* 오늘의 운세 배너 */}
        {hasSaju&&<G style={{marginBottom:"12px",padding:"14px 16px",cursor:"pointer",background:"linear-gradient(135deg,rgba(167,139,250,.06),rgba(96,165,250,.04))"}} onClick={()=>{if(!dailyRd)doDaily();setPg("daily");setNT("daily")}}>
          <div style={{display:"flex",alignItems:"center",gap:"10px"}}><span style={{fontSize:"20px"}}>✨</span><div style={{flex:1}}><div style={{fontSize:"15px",fontWeight:600,color:"#fff"}}>{savedName||"나"}의 오늘의 운세</div><div style={{fontSize:"12px",color:"#4A4060"}}>2026.03.17 화요일</div></div><span style={{color:"#4A4060"}}>→</span></div>
        </G>}

        {/* 사주 요약 + 별자리/MBTI 뱃지 */}
        {hasSaju&&zodiac&&mbti&&<G style={{marginBottom:"12px",padding:"14px 16px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"8px"}}>
            <span style={{fontSize:"13px",color:"#6B5F8A"}}>{savedName||"나"}님의 프로필</span>
            <span style={{fontSize:"11px",color:"#4A4060"}}>{DDI_E[saju.년주.지]} {DDI[saju.년주.지]}띠</span>
          </div>
          <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
            <span style={{padding:"4px 10px",borderRadius:"8px",background:"rgba(167,139,250,0.08)",border:"1px solid rgba(167,139,250,0.12)",fontSize:"12px",color:"#A78BFA",fontWeight:600}}>☯ {sStr(saju).split(" ").slice(0,2).join(" ")}…</span>
            <span style={{padding:"4px 10px",borderRadius:"8px",background:`${ELEM_COLOR[zodiac.element]}12`,border:`1px solid ${ELEM_COLOR[zodiac.element]}25`,fontSize:"12px",color:ELEM_COLOR[zodiac.element],fontWeight:600}}>{zodiac.symbol} {zodiac.sign}</span>
            <span style={{padding:"4px 10px",borderRadius:"8px",background:"rgba(52,211,153,0.08)",border:"1px solid rgba(52,211,153,0.12)",fontSize:"12px",color:"#34D399",fontWeight:600}}>🧠 {mbti}</span>
          </div>
        </G>}

        {/* 주제별 운세 */}
        {hasSaju&&<G style={{marginBottom:"12px",padding:"16px"}}><div style={{fontSize:"13px",color:"#6B5F8A",fontWeight:600,letterSpacing:"1px",marginBottom:"10px"}}>주제별 운세</div><CatCards onSelect={doCat}/></G>}

        {/* 메뉴 카드 */}
        <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
          <MenuCard emoji="🔮" title="사주 분석" desc="종합 사주명리 분석" onClick={()=>setPg("input")}/>
          <MenuCard emoji="⭐" title="점성술 분석" desc="서양 별자리 운세" color="#EAB308" badge="NEW" onClick={()=>{if(hasSaju)doAstro();else setPg("input")}}/>
          <MenuCard emoji="🌌" title="통합 리포트" desc="사주 × 점성술 × MBTI 교차검증" color="#7C5CFC" badge="PREMIUM" onClick={()=>{if(hasSaju){if(prem)doIntegrated();else setPw(true)}else setPg("input")}}/>
          <MenuCard emoji="💫" title="궁합 보기" desc="두 사람의 궁합 분석" color="#F472B6" onClick={()=>setPg("compat")}/>
          {hasSaju&&<MenuCard emoji="🎴" title="타로 카드" desc="사주 기반 3카드 리딩" color="#FBBF24" onClick={doTarot}/>}
          <MenuCard emoji="👤" title="AI 관상" desc="사주 기반 / 사진 관상 분석" color="#34D399" badge="NEW" onClick={()=>{if(hasSaju)setPg("faceMenu");else setPg("input")}}/>
          <MenuCard emoji="🧠" title="사주 MBTI" desc="사주 오행 기반 MBTI 추정" color="#60A5FA" badge="NEW" onClick={()=>{if(hasSaju)setPg("mbtiResult");else setPg("input")}}/>
        </div>
      </div>}

      {/* ═══ INPUT ═══ */}
      {pg==="input"&&<div style={{maxWidth:"420px",margin:"0 auto",padding:"24px 20px 40px",position:"relative",zIndex:1,animation:"fadeIn .3s"}}>
        <button onClick={()=>{setPg("home");setNT("home")}} style={{background:"none",border:"none",color:"#4A4060",cursor:"pointer",fontSize:"12px",marginBottom:"14px"}}>← 돌아가기</button>
        <div style={{textAlign:"center",marginBottom:"18px"}}><span style={{fontSize:"20px"}}>🔮</span><h2 style={{fontSize:"24px",fontWeight:700,color:"#fff",margin:"4px 0 0"}}>내 사주</h2></div>
        <G>
          <div style={{display:"flex",flexDirection:"column",gap:"14px"}}>
            <div><label style={{display:"block",fontSize:"12px",color:"#6B5F8A",marginBottom:"4px"}}>이름</label><input ref={nameRef} defaultValue={savedName} placeholder="이름" style={INP}/></div>
            <div><label style={{display:"block",fontSize:"12px",color:"#6B5F8A",marginBottom:"4px"}}>성별</label>
              <div style={{display:"flex",gap:"8px"}}>{["남","여"].map(v=><button key={v} onClick={()=>setGender(v)} style={{flex:1,padding:"10px",borderRadius:"10px",border:gender===v?"1px solid #A78BFA":"1px solid rgba(167,139,250,0.12)",background:gender===v?"rgba(167,139,250,0.1)":"transparent",color:gender===v?"#E0D4FF":"#4A4060",fontSize:"14px",cursor:"pointer",fontWeight:gender===v?600:400}}>{v}</button>)}</div>
            </div>
            <div><label style={{display:"block",fontSize:"12px",color:"#6B5F8A",marginBottom:"4px"}}>생년월일</label>
              <div style={{display:"flex",gap:"6px"}}><input ref={yearRef} defaultValue={savedYear} placeholder="1990" maxLength={4} style={{...INP,flex:2}}/><select value={month} onChange={e=>setMonth(e.target.value)} style={{...INP,flex:1}}><option value="">월</option>{Array.from({length:12},(_,i)=><option key={i} value={i+1}>{i+1}</option>)}</select><select value={day} onChange={e=>setDay(e.target.value)} style={{...INP,flex:1}}><option value="">일</option>{Array.from({length:31},(_,i)=><option key={i} value={i+1}>{i+1}</option>)}</select></div>
            </div>
            <div><label style={{display:"block",fontSize:"12px",color:"#6B5F8A",marginBottom:"6px"}}>태어난 시</label><SijinPicker value={sijin} onChange={setSijin}/></div>
            <div><label style={{display:"block",fontSize:"12px",color:"#6B5F8A",marginBottom:"4px"}}>궁금한 점 <span style={{color:"#3A3454"}}>(선택)</span></label><textarea ref={questionRef} defaultValue="" placeholder="예: 올해 이직 타이밍이 궁금합니다" rows={2} style={{...INP,resize:"vertical",lineHeight:1.5}}/></div>
          </div>
        </G>
        <div style={{display:"flex",gap:"8px",marginTop:"12px"}}>
          <button onClick={()=>run("basic")} style={{flex:1,padding:"14px",borderRadius:"12px",border:"1px solid rgba(167,139,250,.15)",background:"transparent",color:"#A78BFA",fontSize:"14px",fontWeight:600,cursor:"pointer"}}>무료 분석</button>
          <button onClick={()=>{if(prem)run("premium");else setPw(true)}} style={{flex:1,padding:"14px",borderRadius:"12px",border:"none",background:"linear-gradient(135deg,#A78BFA,#7C5CFC)",color:"#fff",fontSize:"14px",fontWeight:600,cursor:"pointer"}}>프리미엄 ✦</button>
        </div>
      </div>}

      {/* ═══ COMPAT ═══ */}
      {pg==="compat"&&<div style={{maxWidth:"420px",margin:"0 auto",padding:"24px 20px 40px",position:"relative",zIndex:1,animation:"fadeIn .3s"}}>
        <button onClick={()=>{setPg("home");setNT("home")}} style={{background:"none",border:"none",color:"#4A4060",cursor:"pointer",fontSize:"12px",marginBottom:"14px"}}>← 돌아가기</button>
        <div style={{textAlign:"center",marginBottom:"18px"}}><span style={{fontSize:"20px"}}>💫</span><h2 style={{fontSize:"24px",fontWeight:700,color:"#fff",margin:"4px 0 0"}}>궁합</h2></div>
        <G style={{marginBottom:"8px"}}>
          <div style={{fontSize:"11px",color:"#A78BFA",fontWeight:600,letterSpacing:"2px",marginBottom:"10px"}}>첫 번째</div>
          <div style={{display:"flex",flexDirection:"column",gap:"14px"}}>
            <div><label style={{display:"block",fontSize:"12px",color:"#6B5F8A",marginBottom:"4px"}}>이름</label><input ref={nameRef} defaultValue={savedName} placeholder="이름" style={INP}/></div>
            <div><label style={{display:"block",fontSize:"12px",color:"#6B5F8A",marginBottom:"4px"}}>성별</label><div style={{display:"flex",gap:"8px"}}>{["남","여"].map(v=><button key={v} onClick={()=>setGender(v)} style={{flex:1,padding:"10px",borderRadius:"10px",border:gender===v?"1px solid #A78BFA":"1px solid rgba(167,139,250,0.12)",background:gender===v?"rgba(167,139,250,0.1)":"transparent",color:gender===v?"#E0D4FF":"#4A4060",fontSize:"14px",cursor:"pointer",fontWeight:gender===v?600:400}}>{v}</button>)}</div></div>
            <div><label style={{display:"block",fontSize:"12px",color:"#6B5F8A",marginBottom:"4px"}}>생년월일</label><div style={{display:"flex",gap:"6px"}}><input ref={yearRef} defaultValue={savedYear} placeholder="1990" maxLength={4} style={{...INP,flex:2}}/><select value={month} onChange={e=>setMonth(e.target.value)} style={{...INP,flex:1}}><option value="">월</option>{Array.from({length:12},(_,i)=><option key={i} value={i+1}>{i+1}</option>)}</select><select value={day} onChange={e=>setDay(e.target.value)} style={{...INP,flex:1}}><option value="">일</option>{Array.from({length:31},(_,i)=><option key={i} value={i+1}>{i+1}</option>)}</select></div></div>
            <div><label style={{display:"block",fontSize:"12px",color:"#6B5F8A",marginBottom:"6px"}}>태어난 시</label><SijinPicker value={sijin} onChange={setSijin}/></div>
          </div>
        </G>
        <div style={{textAlign:"center",fontSize:"14px",color:"#F472B6",margin:"3px 0"}}>♥</div>
        <G>
          <div style={{fontSize:"11px",color:"#F472B6",fontWeight:600,letterSpacing:"2px",marginBottom:"10px"}}>두 번째</div>
          <div style={{display:"flex",flexDirection:"column",gap:"14px"}}>
            <div><label style={{display:"block",fontSize:"12px",color:"#6B5F8A",marginBottom:"4px"}}>이름</label><input ref={name2Ref} defaultValue={savedName2} placeholder="이름" style={INP}/></div>
            <div><label style={{display:"block",fontSize:"12px",color:"#6B5F8A",marginBottom:"4px"}}>성별</label><div style={{display:"flex",gap:"8px"}}>{["남","여"].map(v=><button key={v} onClick={()=>setGender2(v)} style={{flex:1,padding:"10px",borderRadius:"10px",border:gender2===v?"1px solid #F472B6":"1px solid rgba(167,139,250,0.12)",background:gender2===v?"rgba(244,114,182,0.1)":"transparent",color:gender2===v?"#E0D4FF":"#4A4060",fontSize:"14px",cursor:"pointer",fontWeight:gender2===v?600:400}}>{v}</button>)}</div></div>
            <div><label style={{display:"block",fontSize:"12px",color:"#6B5F8A",marginBottom:"4px"}}>생년월일</label><div style={{display:"flex",gap:"6px"}}><input ref={year2Ref} defaultValue={savedYear2} placeholder="1990" maxLength={4} style={{...INP,flex:2}}/><select value={month2} onChange={e=>setMonth2(e.target.value)} style={{...INP,flex:1}}><option value="">월</option>{Array.from({length:12},(_,i)=><option key={i} value={i+1}>{i+1}</option>)}</select><select value={day2} onChange={e=>setDay2(e.target.value)} style={{...INP,flex:1}}><option value="">일</option>{Array.from({length:31},(_,i)=><option key={i} value={i+1}>{i+1}</option>)}</select></div></div>
            <div><label style={{display:"block",fontSize:"12px",color:"#6B5F8A",marginBottom:"6px"}}>태어난 시</label><SijinPicker value={sijin2} onChange={setSijin2}/></div>
          </div>
        </G>
        <button onClick={runCompat} style={{width:"100%",marginTop:"12px",padding:"14px",borderRadius:"12px",border:"none",background:"linear-gradient(135deg,#F472B6,#EC4899)",color:"#fff",fontSize:"14px",fontWeight:600,cursor:"pointer"}}>궁합 분석</button>
      </div>}

      {/* ═══ LOADING ═══ */}
      {pg==="loading"&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",gap:"18px",position:"relative",zIndex:1}}>
        <div style={{position:"relative",width:"50px",height:"50px"}}><div style={{position:"absolute",inset:0,borderRadius:"50%",border:"1.5px solid rgba(167,139,250,.06)",borderTopColor:"#A78BFA",animation:"spin 2s linear infinite"}}/><div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"13px",color:"#A78BFA"}}>☯</div></div>
        <p style={{fontSize:"14px",fontWeight:500,color:"#fff",margin:0}}>{loadMsgs[li]}</p>
        <div style={{display:"flex",gap:"3px"}}>{[0,1,2].map(i=><div key={i} style={{width:"3px",height:"3px",borderRadius:"50%",background:"#A78BFA",animation:`pulse 1.5s ease ${i*.3}s infinite`}}/>)}</div>
      </div>}

      {/* ═══ DAILY ═══ */}
      {pg==="daily"&&<div style={{maxWidth:"420px",margin:"0 auto",padding:"24px 20px 40px",position:"relative",zIndex:1,animation:"fadeIn .3s"}}>
        <button onClick={()=>{setPg("home");setNT("home")}} style={{background:"none",border:"none",color:"#4A4060",cursor:"pointer",fontSize:"12px",marginBottom:"14px"}}>← 돌아가기</button>
        <div style={{textAlign:"center",marginBottom:"18px"}}><h2 style={{fontSize:"22px",fontWeight:700,color:"#fff"}}>✨ 오늘의 운세</h2><p style={{fontSize:"12px",color:"#4A4060"}}>2026.03.17 화요일</p></div>
        <G>{dailyLoading?<div style={{textAlign:"center",padding:"30px"}}><Spin/></div>:<Md text={dailyRd}/>}</G>
      </div>}

      {/* ═══ CATEGORY ═══ */}
      {pg==="category"&&<div style={{maxWidth:"420px",margin:"0 auto",padding:"24px 20px 40px",position:"relative",zIndex:1,animation:"fadeIn .3s"}}>
        <button onClick={()=>{setPg("home");setNT("home")}} style={{background:"none",border:"none",color:"#4A4060",cursor:"pointer",fontSize:"12px",marginBottom:"14px"}}>← 돌아가기</button>
        <div style={{textAlign:"center",marginBottom:"18px"}}><h2 style={{fontSize:"22px",fontWeight:700,color:"#fff"}}>{catName} 상세 분석</h2></div>
        <G>{catLoading?<div style={{textAlign:"center",padding:"30px"}}><Spin/></div>:<Md text={catRd}/>}</G>
      </div>}

      {/* ═══ TAROT ═══ */}
      {pg==="tarot"&&<div style={{maxWidth:"420px",margin:"0 auto",padding:"24px 20px 40px",position:"relative",zIndex:1,animation:"fadeIn .3s"}}>
        <button onClick={()=>{setPg("home");setNT("home")}} style={{background:"none",border:"none",color:"#4A4060",cursor:"pointer",fontSize:"12px",marginBottom:"14px"}}>← 돌아가기</button>
        <div style={{textAlign:"center",marginBottom:"20px"}}><h2 style={{fontSize:"22px",fontWeight:700,color:"#fff"}}>🎴 타로 카드</h2><p style={{fontSize:"12px",color:"#4A4060"}}>카드를 하나씩 뒤집어 보세요</p></div>
        <div style={{display:"flex",justifyContent:"center",gap:"10px",marginBottom:"10px"}}>{["과거","현재","미래"].map((l,i)=><div key={i} style={{textAlign:"center"}}><div style={{fontSize:"10px",color:"#6B5F8A",marginBottom:"5px"}}>{l}</div>{tCards[i]&&<TCard card={tCards[i]} flipped={tFlip[i]} onClick={()=>flipTarot(i)} delay={i*.12}/>}</div>)}</div>
        {tFlip.every(Boolean)&&<G style={{marginTop:"8px"}}>{tLoading?<div style={{textAlign:"center",padding:"16px"}}><Spin color="#FBBF24"/></div>:<Md text={tRd}/>}</G>}
      </div>}

      {/* ═══ v4: ASTROLOGY ═══ */}
      {pg==="astro"&&<div style={{maxWidth:"420px",margin:"0 auto",padding:"24px 20px 40px",position:"relative",zIndex:1,animation:"fadeIn .3s"}}>
        <button onClick={()=>{setPg("home");setNT("home")}} style={{background:"none",border:"none",color:"#4A4060",cursor:"pointer",fontSize:"12px",marginBottom:"14px"}}>← 돌아가기</button>
        <div style={{textAlign:"center",marginBottom:"18px"}}>
          {zodiac&&<>
            <div style={{fontSize:"48px",marginBottom:"4px"}}>{zodiac.symbol}</div>
            <h2 style={{fontSize:"22px",fontWeight:700,color:"#fff",margin:"0 0 4px"}}>{zodiac.sign}</h2>
            <div style={{display:"flex",justifyContent:"center",gap:"8px",flexWrap:"wrap"}}>
              <span style={{padding:"3px 10px",borderRadius:"8px",background:`${ELEM_COLOR[zodiac.element]}15`,color:ELEM_COLOR[zodiac.element],fontSize:"11px",fontWeight:600}}>{zodiac.element} 원소</span>
              <span style={{padding:"3px 10px",borderRadius:"8px",background:"rgba(167,139,250,0.08)",color:"#A78BFA",fontSize:"11px",fontWeight:600}}>🪐 {zodiac.planet}</span>
              <span style={{padding:"3px 10px",borderRadius:"8px",background:"rgba(52,211,153,0.08)",color:"#34D399",fontSize:"11px",fontWeight:600}}>{zodiac.traits}</span>
            </div>
          </>}
        </div>
        <G>{astroLoading?<div style={{textAlign:"center",padding:"30px"}}><Spin color="#EAB308"/></div>:<Md text={astroRd}/>}</G>
      </div>}

      {/* ═══ v4: MBTI RESULT ═══ */}
      {pg==="mbtiResult"&&<div style={{maxWidth:"420px",margin:"0 auto",padding:"24px 20px 40px",position:"relative",zIndex:1,animation:"fadeIn .3s"}}>
        <button onClick={()=>{setPg("home");setNT("home")}} style={{background:"none",border:"none",color:"#4A4060",cursor:"pointer",fontSize:"12px",marginBottom:"14px"}}>← 돌아가기</button>
        <div style={{textAlign:"center",marginBottom:"18px"}}>
          <div style={{fontSize:"28px",marginBottom:"6px"}}>🧠</div>
          <h2 style={{fontSize:"22px",fontWeight:700,color:"#fff",margin:"0 0 6px"}}>사주 기반 MBTI 추정</h2>
          <p style={{fontSize:"12px",color:"#4A4060"}}>오행 분포와 십성으로 추정한 성격 유형</p>
        </div>
        {mbti&&<G>
          <div style={{textAlign:"center",marginBottom:"16px"}}>
            <div style={{display:"inline-block",padding:"12px 28px",borderRadius:"14px",background:"linear-gradient(135deg,rgba(96,165,250,0.1),rgba(167,139,250,0.1))",border:"1px solid rgba(96,165,250,0.2)"}}>
              <div style={{fontSize:"36px",fontWeight:700,color:"#fff",letterSpacing:"6px"}}>{mbti}</div>
            </div>
            <p style={{fontSize:"14px",color:"#B4A8D2",marginTop:"10px"}}>{MBTI_DESC[mbti]||""}</p>
          </div>
          
          <div style={{marginBottom:"16px"}}>
            <h3 style={{fontSize:"15px",fontWeight:600,color:"#A78BFA",margin:"0 0 8px"}}>오행 → MBTI 매핑 근거</h3>
            {oh&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px"}}>
              {[
                {label:"E/I",desc:mbti[0]==="E"?`목·화(${oh.목+oh.화}) > 금·수(${oh.금+oh.수})`:`금·수(${oh.금+oh.수}) ≥ 목·화(${oh.목+oh.화})`},
                {label:"S/N",desc:mbti[1]==="S"?`토·금(${oh.토+oh.금}) > 수·목(${oh.수+oh.목})`:`수·목(${oh.수+oh.목}) ≥ 토·금(${oh.토+oh.금})`},
                {label:"T/F",desc:mbti[2]==="T"?`금·수(${oh.금+oh.수}) > 화·목(${oh.화+oh.목})`:`화·목(${oh.화+oh.목}) ≥ 금·수(${oh.금+oh.수})`},
                {label:"J/P",desc:mbti[3]==="J"?`토·금(${oh.토+oh.금}) > 목·화(${oh.목+oh.화})`:`목·화(${oh.목+oh.화}) ≥ 토·금(${oh.토+oh.금})`},
              ].map((r,i)=><div key={i} style={{padding:"8px",borderRadius:"8px",background:"rgba(167,139,250,0.04)",border:"1px solid rgba(167,139,250,0.06)"}}>
                <div style={{fontSize:"13px",fontWeight:600,color:"#E0D4FF",marginBottom:"2px"}}>{r.label}: {mbti[i==="E/I"?0:i==="S/N"?1:i==="T/F"?2:3]||mbti[i]}</div>
                <div style={{fontSize:"11px",color:"#6B5F8A"}}>{r.desc}</div>
              </div>)}
            </div>}
          </div>

          <div style={{padding:"10px 12px",borderRadius:"8px",background:"rgba(251,191,36,0.04)",border:"1px solid rgba(251,191,36,0.08)"}}>
            <p style={{fontSize:"12px",color:"#8B7FA8",lineHeight:1.7,margin:0}}>⚠️ 사주 기반 MBTI 추정은 학술 연구(이남호·김만태, 2018)를 참고한 <strong style={{color:"#B4A8D2"}}>재미 목적의 추정</strong>이며, 정식 MBTI 검사를 대체하지 않습니다.</p>
          </div>
        </G>}
      </div>}

      {/* ═══ v4: INTEGRATED REPORT ═══ */}
      {pg==="integrated"&&<div style={{maxWidth:"420px",margin:"0 auto",padding:"24px 20px 40px",position:"relative",zIndex:1,animation:"fadeIn .3s"}}>
        <button onClick={()=>{setPg("home");setNT("home")}} style={{background:"none",border:"none",color:"#4A4060",cursor:"pointer",fontSize:"12px",marginBottom:"14px"}}>← 돌아가기</button>
        <div style={{textAlign:"center",marginBottom:"18px"}}>
          <div style={{fontSize:"32px",marginBottom:"4px"}}>🌌</div>
          <h2 style={{fontSize:"22px",fontWeight:700,color:"#fff",margin:"0 0 4px"}}>동서양 통합 리포트</h2>
          <p style={{fontSize:"12px",color:"#4A4060"}}>사주 × 점성술 × MBTI 교차검증</p>
          {zodiac&&mbti&&<div style={{display:"flex",justifyContent:"center",gap:"6px",marginTop:"8px",flexWrap:"wrap"}}>
            <span style={{padding:"3px 8px",borderRadius:"6px",background:"rgba(167,139,250,0.08)",fontSize:"10px",color:"#A78BFA",fontWeight:600}}>☯ 사주명리</span>
            <span style={{padding:"3px 8px",borderRadius:"6px",background:`${ELEM_COLOR[zodiac.element]}12`,fontSize:"10px",color:ELEM_COLOR[zodiac.element],fontWeight:600}}>{zodiac.symbol} {zodiac.sign}</span>
            <span style={{padding:"3px 8px",borderRadius:"6px",background:"rgba(52,211,153,0.08)",fontSize:"10px",color:"#34D399",fontWeight:600}}>🧠 {mbti}</span>
          </div>}
        </div>
        <G>{intLoading?<div style={{textAlign:"center",padding:"40px"}}><Spin color="#7C5CFC"/><p style={{fontSize:"13px",color:"#6B5F8A",marginTop:"12px"}}>세 체계를 융합 분석 중...</p></div>:<Md text={intRd}/>}</G>
      </div>}

      {/* ═══ v4: FACE MENU ═══ */}
      {pg==="faceMenu"&&<div style={{maxWidth:"420px",margin:"0 auto",padding:"24px 20px 40px",position:"relative",zIndex:1,animation:"fadeIn .3s"}}>
        <button onClick={()=>{setPg("home");setNT("home")}} style={{background:"none",border:"none",color:"#4A4060",cursor:"pointer",fontSize:"12px",marginBottom:"14px"}}>← 돌아가기</button>
        <div style={{textAlign:"center",marginBottom:"24px"}}>
          <div style={{fontSize:"32px",marginBottom:"4px"}}>👤</div>
          <h2 style={{fontSize:"22px",fontWeight:700,color:"#fff",margin:"0 0 4px"}}>AI 관상 분석</h2>
          <p style={{fontSize:"12px",color:"#4A4060"}}>두 가지 방식으로 관상을 봅니다</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
          <G style={{cursor:"pointer",padding:"20px"}} onClick={doFaceSaju}>
            <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
              <div style={{width:"44px",height:"44px",borderRadius:"12px",background:"rgba(52,211,153,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px"}}>☯</div>
              <div style={{flex:1}}>
                <div style={{fontSize:"15px",fontWeight:600,color:"#fff"}}>사주 기반 관상 추정</div>
                <div style={{fontSize:"12px",color:"#4A4060"}}>오행 분포로 외모 경향성 분석 (무료)</div>
              </div>
              <span style={{padding:"2px 8px",borderRadius:"6px",background:"rgba(52,211,153,0.08)",color:"#34D399",fontSize:"10px",fontWeight:600}}>무료</span>
            </div>
          </G>
          <G style={{cursor:"pointer",padding:"20px"}} onClick={()=>setPg("faceUpload")}>
            <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
              <div style={{width:"44px",height:"44px",borderRadius:"12px",background:"rgba(167,139,250,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px"}}>📸</div>
              <div style={{flex:1}}>
                <div style={{fontSize:"15px",fontWeight:600,color:"#fff"}}>사진 관상 분석</div>
                <div style={{fontSize:"12px",color:"#4A4060"}}>실제 얼굴 사진으로 관상 분석</div>
              </div>
              <span style={{padding:"2px 8px",borderRadius:"6px",background:"rgba(167,139,250,0.08)",color:"#A78BFA",fontSize:"10px",fontWeight:600}}>PREMIUM</span>
            </div>
          </G>
        </div>
      </div>}

      {/* ═══ v4: FACE UPLOAD ═══ */}
      {pg==="faceUpload"&&<div style={{maxWidth:"420px",margin:"0 auto",padding:"24px 20px 40px",position:"relative",zIndex:1,animation:"fadeIn .3s"}}>
        <button onClick={()=>{setPg("faceMenu");setNT("face")}} style={{background:"none",border:"none",color:"#4A4060",cursor:"pointer",fontSize:"12px",marginBottom:"14px"}}>← 돌아가기</button>
        <div style={{textAlign:"center",marginBottom:"24px"}}>
          <div style={{fontSize:"32px",marginBottom:"4px"}}>📸</div>
          <h2 style={{fontSize:"22px",fontWeight:700,color:"#fff",margin:"0 0 4px"}}>사진 관상 분석</h2>
          <p style={{fontSize:"12px",color:"#4A4060"}}>정면 셀카를 올려주세요</p>
        </div>
        <G style={{textAlign:"center",padding:"30px"}}>
          <input ref={photoRef} type="file" accept="image/*" capture="user" onChange={handlePhotoUpload} style={{display:"none"}}/>
          {facePhoto?<div>
            <div style={{width:"120px",height:"120px",margin:"0 auto 12px",borderRadius:"50%",overflow:"hidden",border:"2px solid rgba(167,139,250,0.2)"}}>
              <img src={`data:image/jpeg;base64,${facePhoto}`} alt="face" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            </div>
            <button onClick={()=>setFacePhoto(null)} style={{background:"none",border:"none",color:"#4A4060",fontSize:"12px",cursor:"pointer",marginBottom:"12px"}}>다시 선택</button>
          </div>:<div onClick={()=>photoRef.current?.click()} style={{cursor:"pointer",padding:"30px",borderRadius:"12px",border:"2px dashed rgba(167,139,250,0.15)",background:"rgba(167,139,250,0.02)"}}>
            <div style={{fontSize:"36px",marginBottom:"8px"}}>📷</div>
            <p style={{fontSize:"14px",color:"#6B5F8A",margin:0}}>터치하여 사진 선택</p>
          </div>}
          {facePhoto&&<button onClick={()=>{if(prem)doFacePhoto();else setPw(true)}} style={{width:"100%",marginTop:"12px",padding:"14px",borderRadius:"12px",border:"none",background:"linear-gradient(135deg,#A78BFA,#7C5CFC)",color:"#fff",fontSize:"14px",fontWeight:600,cursor:"pointer"}}>관상 분석 시작 ✦</button>}
        </G>
      </div>}

      {/* ═══ v4: FACE RESULT ═══ */}
      {pg==="face"&&<div style={{maxWidth:"420px",margin:"0 auto",padding:"24px 20px 40px",position:"relative",zIndex:1,animation:"fadeIn .3s"}}>
        <button onClick={()=>{setPg("home");setNT("home")}} style={{background:"none",border:"none",color:"#4A4060",cursor:"pointer",fontSize:"12px",marginBottom:"14px"}}>← 돌아가기</button>
        <div style={{textAlign:"center",marginBottom:"18px"}}>
          <h2 style={{fontSize:"22px",fontWeight:700,color:"#fff"}}>👤 {faceMode==="photo"?"사진":"사주"} 관상 분석</h2>
        </div>
        <G>{faceLoading?<div style={{textAlign:"center",padding:"30px"}}><Spin color="#34D399"/><p style={{fontSize:"13px",color:"#6B5F8A",marginTop:"12px"}}>관상을 살피는 중...</p></div>:<Md text={faceRd}/>}</G>
      </div>}

      {/* ═══ RESULT ═══ */}
      {pg==="result"&&saju&&<div style={{maxWidth:"480px",margin:"0 auto",padding:"20px 16px 80px",position:"relative",zIndex:1,animation:"fadeIn .3s"}}>
        <button onClick={reset} style={{background:"none",border:"none",color:"#4A4060",cursor:"pointer",fontSize:"12px",marginBottom:"10px"}}>← 처음으로</button>
        <G style={{marginBottom:"10px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"}}>
            <span style={{fontSize:"12px",color:"#4A4060"}}>{savedName?`${savedName} · `:""}{savedYear}.{month}.{day} · {DDI_E[saju.년주.지]} {DDI[saju.년주.지]}띠</span>
            <div style={{display:"flex",gap:"4px"}}>
              {zodiac&&<span style={{padding:"2px 7px",borderRadius:"6px",background:`${ELEM_COLOR[zodiac.element]}12`,color:ELEM_COLOR[zodiac.element],fontSize:"9px",fontWeight:600}}>{zodiac.symbol}{zodiac.sign}</span>}
              {mbti&&<span style={{padding:"2px 7px",borderRadius:"6px",background:"rgba(52,211,153,.08)",color:"#34D399",fontSize:"9px",fontWeight:600}}>{mbti}</span>}
              {mode==="premium"&&<span style={{padding:"2px 7px",borderRadius:"6px",background:"rgba(167,139,250,.1)",color:"#A78BFA",fontSize:"9px",fontWeight:600}}>PREMIUM</span>}
            </div>
          </div>
          <SajuTable saju={saju} oh={oh}/>
          <div style={{marginTop:"14px",padding:"12px",borderRadius:"10px",background:"rgba(167,139,250,0.03)",border:"1px solid rgba(167,139,250,0.06)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}} onClick={()=>setShowManse(!showManse)}>
              <span style={{fontSize:"13px",fontWeight:600,color:"#8B7FA8"}}>📖 사주 읽는 법</span>
              <span style={{fontSize:"11px",color:"#4A4060"}}>{showManse?"접기 ▲":"펼치기 ▼"}</span>
            </div>
            {showManse&&<div style={{marginTop:"10px",fontSize:"13px",color:"#6B5F8A",lineHeight:1.85}}>
              <p style={{margin:"0 0 8px"}}><strong style={{color:"#B4A8D2"}}>만세력이란?</strong> 과거·현재·미래의 천간·지지를 기록한 역법. 사주의 기초 데이터예요.</p>
              <p style={{margin:"0 0 8px"}}><strong style={{color:"#B4A8D2"}}>사주팔자란?</strong> 4개의 기둥(년·월·일·시)과 8개의 글자로 구성. 태어난 시간을 우주 기운으로 변환한 것이에요.</p>
              <p style={{margin:"0 0 8px"}}><strong style={{color:"#B4A8D2"}}>일간이 핵심!</strong> 일주 천간이 "나 자신". 다른 7글자는 나를 둘러싼 환경이에요.</p>
              <p style={{margin:"0 0 8px"}}><strong style={{color:"#B4A8D2"}}>십성</strong> — 일간 기준 다른 글자와의 관계를 10가지로 분류한 것. 글자 위에 마우스를 올리면 의미를 볼 수 있어요.</p>
              <p style={{margin:"0",color:"#4A4060",fontSize:"11px"}}>사주는 확정된 운명이 아닌 타고난 기질과 흐름의 경향성이에요.</p>
            </div>}
          </div>
        </G>
        {mode==="compat"&&saju2&&<G style={{marginBottom:"10px"}}><div style={{fontSize:"12px",color:"#F472B6",marginBottom:"8px"}}>{savedName2||"상대방"} · {savedYear2}.{month2}.{day2}</div><SajuTable saju={saju2} oh={oh2}/></G>}
        <div style={{display:"flex",gap:"3px",marginBottom:"10px"}}>{[{k:"result",l:"📜 분석"},{k:"chat",l:"💬 질문"},{k:"share",l:"📤 공유"}].map(t=><button key={t.k} onClick={()=>setTab(t.k)} style={{flex:1,padding:"10px",borderRadius:"10px",background:tab===t.k?"rgba(167,139,250,.08)":"transparent",border:tab===t.k?"1px solid rgba(167,139,250,.12)":"1px solid transparent",color:tab===t.k?"#E0D4FF":"#3A3454",fontSize:"12px",fontWeight:tab===t.k?600:400,cursor:"pointer"}}>{t.l}</button>)}</div>
        {tab==="result"&&<G><Md text={rd}/>{mode==="basic"&&!prem&&<div style={{position:"relative",margin:"16px 0",borderRadius:"12px",overflow:"hidden"}}><div style={{filter:"blur(4px)",opacity:.12,height:"90px",background:"linear-gradient(135deg,#A78BFA08,#60A5FA08)"}}/><div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"6px"}}><span style={{fontSize:"13px",fontWeight:600,color:"#E0D4FF"}}>재물운, 연애운, 건강운, 동서양 통합 분석...</span><button onClick={()=>setPw(true)} style={{padding:"8px 20px",borderRadius:"8px",border:"none",background:"linear-gradient(135deg,#A78BFA,#7C5CFC)",color:"#fff",fontSize:"12px",fontWeight:600,cursor:"pointer"}}>프리미엄으로 열기 ✦</button></div></div>}</G>}
        {tab==="chat"&&<G style={{minHeight:"160px"}}>
          <div style={{display:"flex",flexWrap:"wrap",gap:"4px",marginBottom:"12px",justifyContent:"center"}}>{["이직 시기","재물운","연애운","건강","내년 운세","별자리 궁합","MBTI 성격"].map(t=><button key={t} onClick={()=>{if(chatRef.current)chatRef.current.value=t+"이 궁금해요"}} style={{padding:"6px 12px",borderRadius:"14px",border:"1px solid rgba(167,139,250,.08)",background:"transparent",color:"#6B5F8A",fontSize:"12px",cursor:"pointer"}}>{t}</button>)}</div>
          {ch.slice(1).map((m,i)=><div key={i} style={{marginBottom:"10px"}}>{m.role==="user"&&<div style={{background:"rgba(167,139,250,.05)",borderRadius:"8px",padding:"8px 10px",borderLeft:"2px solid #A78BFA",marginBottom:"6px"}}><p style={{margin:0,color:"#E0D4FF",fontSize:"14px"}}>{m.content}</p></div>}{m.role==="assistant"&&<Md text={m.content}/>}</div>)}
          {chatLoading&&<div style={{display:"flex",alignItems:"center",gap:"4px",color:"#3A3454",fontSize:"11px"}}><div style={{width:"10px",height:"10px",borderRadius:"50%",border:"1.5px solid #1E1A30",borderTopColor:"#A78BFA",animation:"spin 1s linear infinite"}}/>답변 중</div>}
          <div ref={scrollRef}/>
        </G>}
        {tab==="share"&&<div style={{textAlign:"center"}}><p style={{fontSize:"12px",color:"#4A4060",marginBottom:"12px"}}>스크린샷으로 공유</p>
          <div style={{width:"280px",margin:"0 auto",padding:"22px 18px",background:"linear-gradient(160deg,#0F0D24,#1A1440,#0F0D24)",borderRadius:"14px",border:"1px solid rgba(167,139,250,.1)"}}>
            <div style={{fontSize:"7px",letterSpacing:"3px",color:"#3A3454",marginBottom:"6px"}}>AI SAJU v4</div>
            <div style={{fontSize:"18px",fontWeight:600,color:"#fff",marginBottom:"2px"}}>{savedName||"나"}의 사주</div>
            <div style={{fontSize:"10px",color:"#3A3454",marginBottom:"4px"}}>{savedYear}.{month}.{day} · {DDI_E[saju.년주.지]} {DDI[saju.년주.지]}띠</div>
            {zodiac&&mbti&&<div style={{display:"flex",justifyContent:"center",gap:"6px",marginBottom:"8px"}}>
              <span style={{fontSize:"10px",color:ELEM_COLOR[zodiac.element]}}>{zodiac.symbol}{zodiac.sign}</span>
              <span style={{fontSize:"10px",color:"#34D399"}}>🧠{mbti}</span>
            </div>}
            <div style={{display:"flex",justifyContent:"center",gap:"10px",marginBottom:"10px"}}>{[saju.시주&&["시",saju.시주],["일",saju.일주],["월",saju.월주],["년",saju.년주]].filter(Boolean).map(([l,p],i)=><div key={i} style={{textAlign:"center"}}><div style={{fontSize:"7px",color:"#3A3454"}}>{l}</div><div style={{fontSize:"20px",fontWeight:300,color:"#fff",lineHeight:1.2}}>{GK[p.간]}</div><div style={{fontSize:"20px",fontWeight:300,color:"#fff",lineHeight:1.2}}>{JK[p.지]}</div></div>)}</div>
            <div style={{height:"1px",background:"linear-gradient(90deg,transparent,rgba(167,139,250,.12),transparent)",margin:"8px 0"}}/>
            <div style={{display:"flex",justifyContent:"center",gap:"8px"}}>{Object.entries(oh||{}).map(([k,v])=><span key={k} style={{fontSize:"10px",color:v?OHC[k]:"#1A1430",fontWeight:500}}>{OHK[k]}{v}</span>)}</div>
          </div>
          <button onClick={()=>navigator.clipboard.writeText(`🔮 ${savedName||"나"}의 사주: ${sStr(saju)}\n${zodiac?`⭐ ${zodiac.symbol} ${zodiac.sign}`:""}\n${mbti?`🧠 추정 MBTI: ${mbti}`:""}\n오행: ${Object.entries(oh||{}).map(([k,v])=>`${OHK[k]}${v}`).join(" ")}\n\nAI 사주명리 v4에서 분석 받기`)} style={{marginTop:"12px",padding:"8px 18px",borderRadius:"8px",border:"1px solid rgba(167,139,250,.1)",background:"transparent",color:"#6B5F8A",fontSize:"12px",cursor:"pointer"}}>텍스트 복사</button>
        </div>}
        {tab==="chat"&&<div style={{position:"fixed",bottom:"72px",left:0,right:0,background:"linear-gradient(transparent,#0B0A1A 40%)",padding:"12px 16px",zIndex:10}}><div style={{maxWidth:"480px",margin:"0 auto",display:"flex",gap:"6px"}}><input ref={chatRef} defaultValue="" onKeyDown={e=>{if(e.key==="Enter"&&!e.nativeEvent.isComposing)doChat()}} placeholder="질문을 입력하세요" style={{...INP,flex:1}}/><button onClick={doChat} style={{padding:"12px 18px",borderRadius:"10px",border:"none",background:"linear-gradient(135deg,#A78BFA,#7C5CFC)",color:"#fff",fontSize:"13px",fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}}>질문</button></div></div>}
      </div>}

      {/* ═══ BOTTOM NAV ═══ */}
      {pg!=="splash"&&pg!=="loading"&&<div style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(11,10,26,.9)",backdropFilter:"blur(14px)",borderTop:"1px solid rgba(167,139,250,.04)",zIndex:100,padding:"5px 0 env(safe-area-inset-bottom,5px)"}}>
        <div style={{maxWidth:"480px",margin:"0 auto",display:"flex",justifyContent:"space-around"}}>
          {[
            {k:"home",icon:"🏠",l:"홈",fn:()=>{setPg("home");setNT("home")}},
            {k:"saju",icon:"🔮",l:"사주",fn:()=>{setPg("input");setNT("saju")}},
            {k:"integrated",icon:"🌌",l:"통합",fn:()=>{if(hasSaju){if(prem)doIntegrated();else setPw(true)}else{setPg("input");setNT("saju")}}},
            {k:"tarot",icon:"🎴",l:"타로",fn:()=>{if(hasSaju)doTarot();else{setPg("input");setNT("saju")}}},
            {k:"result",icon:"📊",l:"결과",fn:()=>{if(rd){setPg("result");setNT("result")}else{setPg("input");setNT("saju")}}}
          ].map(t=><button key={t.k} onClick={t.fn} style={{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:"1px",padding:"5px 10px",color:navTab===t.k?"#A78BFA":"#2A2540",fontSize:"10px"}}><span style={{fontSize:"20px",opacity:navTab===t.k?1:.4}}>{t.icon}</span><span style={{fontWeight:navTab===t.k?600:400}}>{t.l}</span></button>)}
        </div>
      </div>}
    </div>
  );
}
