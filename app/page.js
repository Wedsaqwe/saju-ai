"use client";
import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════
   AI 사주명리 v4.0 — Apple-style redesign
   동서양 융합 운명 분석 플랫폼
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
const 시진표=[{지:"자",시:"子時",범위:"23:00~01:00",설명:"밤 11시~새벽 1시"},{지:"축",시:"丑時",범위:"01:00~03:00",설명:"새벽 1시~3시"},{지:"인",시:"寅時",범위:"03:00~05:00",설명:"새벽 3시~5시"},{지:"묘",시:"卯時",범위:"05:00~07:00",설명:"새벽 5시~7시"},{지:"진",시:"辰時",범위:"07:00~09:00",설명:"아침 7시~9시"},{지:"사",시:"巳時",범위:"09:00~11:00",설명:"오전 9시~11시"},{지:"오",시:"午時",범위:"11:00~13:00",설명:"낮 11시~오후 1시"},{지:"미",시:"未時",범위:"13:00~15:00",설명:"오후 1시~3시"},{지:"신",시:"申時",범위:"15:00~17:00",설명:"오후 3시~5시"},{지:"유",시:"酉時",범위:"17:00~19:00",설명:"오후 5시~7시"},{지:"술",시:"戌時",범위:"19:00~21:00",설명:"저녁 7시~9시"},{지:"해",시:"亥時",범위:"21:00~23:00",설명:"밤 9시~11시"}];
const 오행상생={목:"화",화:"토",토:"금",금:"수",수:"목"};
const 오행상극={목:"토",화:"금",토:"수",금:"목",수:"화"};
const 음양간={갑:"양",을:"음",병:"양",정:"음",무:"양",기:"음",경:"양",신:"음",임:"양",계:"음"};
const 음양지={자:"양",축:"음",인:"양",묘:"음",진:"양",사:"음",오:"양",미:"음",신:"양",유:"음",술:"양",해:"음"};
const 십성색={비견:"#A78BFA",겁재:"#A78BFA",식신:"#34D399",상관:"#34D399",편재:"#FBBF24",정재:"#FBBF24",편관:"#F472B6",정관:"#F472B6",편인:"#60A5FA",정인:"#60A5FA"};
const 십성설명={비견:"나와 같은 기운. 독립심, 자존심",겁재:"비슷하지만 다른 기운. 승부욕",식신:"내가 만드는 기운. 표현력, 재능",상관:"내가 뿜는 기운. 창의력",편재:"내가 다스리는 재물. 사업수완",정재:"안정적 재물. 월급, 저축",편관:"나를 압박하는 기운. 직장, 권위",정관:"나를 바로잡는 기운. 명예",편인:"편향된 학문. 특수기술",정인:"바른 학문. 어머니, 자격증"};

/* ═══ ZODIAC ═══ */
const ZODIAC=[
  {sign:"양자리",en:"Aries",symbol:"♈",element:"불",planet:"화성",traits:"개척, 리더십, 열정",startM:3,startD:21,endM:4,endD:19},
  {sign:"황소자리",en:"Taurus",symbol:"♉",element:"땅",planet:"금성",traits:"안정, 인내, 감각",startM:4,startD:20,endM:5,endD:20},
  {sign:"쌍둥이자리",en:"Gemini",symbol:"♊",element:"공기",planet:"수성",traits:"소통, 다재다능, 호기심",startM:5,startD:21,endM:6,endD:20},
  {sign:"게자리",en:"Cancer",symbol:"♋",element:"물",planet:"달",traits:"감성, 보호, 가정",startM:6,startD:21,endM:7,endD:22},
  {sign:"사자자리",en:"Leo",symbol:"♌",element:"불",planet:"태양",traits:"자신감, 창의력, 리더",startM:7,startD:23,endM:8,endD:22},
  {sign:"처녀자리",en:"Virgo",symbol:"♍",element:"땅",planet:"수성",traits:"분석, 완벽주의, 봉사",startM:8,startD:23,endM:9,endD:22},
  {sign:"천칭자리",en:"Libra",symbol:"♎",element:"공기",planet:"금성",traits:"균형, 조화, 미적감각",startM:9,startD:23,endM:10,endD:22},
  {sign:"전갈자리",en:"Scorpio",symbol:"♏",element:"물",planet:"명왕성",traits:"통찰, 변환, 집중력",startM:10,startD:23,endM:11,endD:21},
  {sign:"사수자리",en:"Sagittarius",symbol:"♐",element:"불",planet:"목성",traits:"자유, 탐구, 낙관",startM:11,startD:22,endM:12,endD:21},
  {sign:"염소자리",en:"Capricorn",symbol:"♑",element:"땅",planet:"토성",traits:"야망, 책임감, 인내",startM:12,startD:22,endM:1,endD:19},
  {sign:"물병자리",en:"Aquarius",symbol:"♒",element:"공기",planet:"천왕성",traits:"혁신, 독립, 인도주의",startM:1,startD:20,endM:2,endD:18},
  {sign:"물고기자리",en:"Pisces",symbol:"♓",element:"물",planet:"해왕성",traits:"직관, 공감, 예술",startM:2,startD:19,endM:3,endD:20},
];
const ELEM_COLOR={불:"#EF4444",땅:"#EAB308",공기:"#A78BFA",물:"#3B82F6"};
function getZodiac(m,d){const md=m*100+d;if(md>=1222||md<=119)return ZODIAC[9];for(const z of ZODIAC){const s=z.startM*100+z.startD,e=z.endM*100+z.endD;if(s<=e&&md>=s&&md<=e)return z}return ZODIAC[11]}

/* ═══ MBTI ═══ */
function estimateMBTI(oh,saju){
  const dG=saju.일주.간,dOh=OH_G[dG],dYY=음양간[dG];
  const ssList=[];
  [saju.년주,saju.월주,saju.시주].filter(Boolean).forEach(p=>{ssList.push(get십성(dOh,dYY,OH_G[p.간],음양간[p.간]));ssList.push(get십성(dOh,dYY,OH_J[p.지],음양지[p.지]))});
  let sc={E:0,I:0,S:0,N:0,T:0,F:0,J:0,P:0};
  ssList.forEach(ss=>{if(ss==="편재"){sc.E++;sc.S++}if(ss==="정재"){sc.I++;sc.S++}if(ss==="편인"){sc.I++;sc.N++}if(ss==="정인"){sc.E++;sc.N++}if(ss==="편관"){sc.I++;sc.T++}if(ss==="정관"){sc.E++;sc.T++}if(ss==="식신"){sc.I++;sc.F++}if(ss==="상관"){sc.E++;sc.F++}});
  const a=(oh.목+oh.화>oh.금+oh.수?1:-1)+(sc.E-sc.I)>0?"E":"I";
  const b=(oh.토+oh.금>oh.수+oh.목?1:-1)+(sc.S-sc.N)>0?"S":"N";
  const c=(oh.금+oh.수>oh.화+oh.목?1:-1)+(sc.T-sc.F)>0?"T":"F";
  const d=(oh.토+oh.금>oh.목+oh.화?1:-1)+(sc.J-sc.P)>0?"J":"P";
  return a+b+c+d;
}
const MBTI_DESC={INTJ:"전략적 사색가",INTP:"논리적 탐구자",ENTJ:"결단력 있는 지휘관",ENTP:"혁신적 발명가",INFJ:"통찰력 있는 조언자",INFP:"이상주의적 치유자",ENFJ:"영감을 주는 리더",ENFP:"열정적 활동가",ISTJ:"신뢰할 수 있는 관리자",ISFJ:"헌신적인 보호자",ESTJ:"체계적인 관리자",ESFJ:"사교적인 외교관",ISTP:"만능 장인",ISFP:"감성적 예술가",ESTP:"모험적 사업가",ESFP:"자유로운 연예인"};

/* ═══ 만세력 ═══ */
function calcY(y){const g=(y-4)%10,j=(y-4)%12;return{간:천간[g>=0?g:g+10],지:지지[j>=0?j:j+12]}}
function calcM(y,m){const b=(천간.indexOf(calcY(y).간)%5)*2+2;return{간:천간[(b+m-1)%10],지:지지[(m+1)%12]}}
function calcD(y,m,d){const a=Math.floor((14-m)/12),yr=y+4800-a,mo=m+12*a-3,j=d+Math.floor((153*mo+2)/5)+365*yr+Math.floor(yr/4)-Math.floor(yr/100)+Math.floor(yr/400)-32045;return{간:천간[(j+9)%10>=0?(j+9)%10:(j+9)%10+10],지:지지[(j+1)%12>=0?(j+1)%12:(j+1)%12+12]}}
function calcH(dg,h){let hz="자";for(const[s,e,z]of SJ_MAP)if(s>e?(h>=s||h<e):(h>=s&&h<e)){hz=z;break}return{간:천간[((천간.indexOf(dg)%5)*2+지지.indexOf(hz))%10],지:hz}}
function mkSaju(y,m,d,h){const a=calcY(y),b=calcM(y,m),c=calcD(y,m,d);return{년주:a,월주:b,일주:c,시주:h!==null?calcH(c.간,h):null}}
function cntOH(s){const c={목:0,화:0,토:0,금:0,수:0};[s.년주,s.월주,s.일주,s.시주].filter(Boolean).forEach(p=>{c[OH_G[p.간]]++;c[OH_J[p.지]]++});return c}
function sStr(s){return`${GK[s.년주.간]}${JK[s.년주.지]} ${GK[s.월주.간]}${JK[s.월주.지]} ${GK[s.일주.간]}${JK[s.일주.지]}${s.시주?` ${GK[s.시주.간]}${JK[s.시주.지]}`:""}`}
function get십성(dOh,dYY,tOh,tYY){if(dOh===tOh&&dYY===tYY)return"비견";if(dOh===tOh)return"겁재";if(오행상생[dOh]===tOh&&dYY===tYY)return"식신";if(오행상생[dOh]===tOh)return"상관";if(오행상극[dOh]===tOh&&dYY===tYY)return"편재";if(오행상극[dOh]===tOh)return"정재";if(오행상극[tOh]===dOh&&dYY===tYY)return"편관";if(오행상극[tOh]===dOh)return"정관";if(오행상생[tOh]===dOh&&dYY===tYY)return"편인";if(오행상생[tOh]===dOh)return"정인";return"비견"}
function hourFromSijin(sj){if(!sj)return null;const m={자:0,축:2,인:4,묘:6,진:8,사:10,오:12,미:14,신:16,유:18,술:20,해:22};return m[sj]??null}

/* ═══ API ═══ */
async function callAI(sys,msgs,mt=4000){try{const r=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:mt,system:sys,messages:msgs})});const d=await r.json();return d.content?.map(b=>b.type==="text"?b.text:"").join("")||"분석 결과를 불러올 수 없습니다."}catch(e){return"네트워크 오류가 발생했습니다. 다시 시도해주세요."}}

/* ═══ PROMPTS ═══ */
const SYS=`당신은 40년 경력의 대한민국 최고 사주명리학 대가입니다. 전통 명리학(격국론,용신론,십성론,신살론,합충형파해,대운·세운)에 정통하며 현대적이고 따뜻한 "~해요" 체로 풀이합니다. 한자 용어에 쉬운 설명을 반드시 병기합니다.`;
const PR_BASIC=SYS+`\n\n기본 분석(마크다운,2000자 이상 상세히):\n# {NAME}님의 사주 풀이\n\n## 🔮 사주 구성과 핵심 해석\n(일간의 의미, 각 기둥별 관계를 풍부하게 설명)\n\n## ⚖️ 오행 균형과 용신\n(어떤 오행이 강하고 약한지, 용신이 무엇이고 왜 그런지 구체적으로)\n\n## 🌟 타고난 기질과 성격\n(강점 3가지와 주의할 점 2가지를 구체적 예시와 함께)\n\n## 💼 적성과 재능\n(어울리는 직업군과 재능 발휘 방향)\n\n## 📅 2026년 병오년 운세\n(올해 전체 흐름과 주요 전환 시기를 구체적으로)\n\n## 🍀 행운 포인트\n(행운의 색, 숫자, 방위, 음식을 근거와 함께)\n\n## 💡 인생 조언 3가지\n(실천 가능한 구체적 조언)\n\n반드시 2000자 이상 상세하게 작성. 각 섹션마다 최소 3~4문장. 구체적 예시와 비유를 활용.`;
const PR_PREMIUM=SYS+`\n\n프리미엄 상세 분석(마크다운,3000자+):\n# {NAME}님의 프리미엄 분석\n## 🔮 사주 심층 해석\n## ⚖️ 오행 & 용신\n## 🌟 성격·재능\n## 💰 재물운\n## 💼 직업운\n## 💕 연애운\n## 🏥 건강운\n## 📅 2026년 분기별\n### 1~3월\n### 4~6월\n### 7~9월\n### 10~12월\n## 🔄 10년 대운\n## 🎯 인생 조언 TOP 5`;
const PR_COMPAT=SYS+`\n\n궁합(마크다운):\n# {N1} ♥ {N2}\n## 💕 궁합 점수: [XX]/100\n## 🔮 두 사주의 관계\n## 💪 강점 3가지\n## ⚠️ 주의점 3가지\n## 💡 궁합 높이는 법\n## 📅 2026 관계 운세`;
const PR_DAILY=SYS+`\n\n오늘(2026.3.17 화)의 운세(마크다운,800자 이상 상세히):\n# ✨ 오늘의 운세\n## 총운\n(오늘 하루 전체 기운을 3~4문장으로)\n## 행운 포인트\n- 🎨 행운의 색 (이유 포함)\n- 🔢 행운의 숫자 (이유 포함)\n- 🧭 좋은 방위\n- 🍽 행운의 음식\n## ⏰ 시간대별 운세\n(오전/오후/저녁 각각 구체적으로)\n## 주의할 점\n## 💡 오늘의 한마디`;
const PR_CAT=SYS+`\n\n{CAT} 상세 분석(마크다운,1500자 이상). 구체적 시기, 실천법, 주의사항, 조언을 포함. 각 항목별 3~4문장 이상 상세하게.`;
const PR_TAROT=SYS+`\n\n사주 기반 타로 해석(마크다운,1200자 이상):\n# 🎴 타로 리딩\n## 과거 — {C1}\n(이 카드가 사주 기반으로 어떤 과거를 의미하는지 3~4문장)\n## 현재 — {C2}\n(현재 상황과 카드의 연결점을 구체적으로)\n## 미래 — {C3}\n(앞으로의 흐름과 주의점)\n## 🔮 종합 메시지\n(세 카드를 관통하는 핵심 메시지와 실천 조언)\n## 💡 타로가 전하는 한마디`;
const PR_ASTRO=`당신은 서양 점성술 전문가입니다. 태양 별자리, 원소(불/땅/공기/물), 지배 행성을 기반으로 분석합니다.\n마크다운으로 2000자 이상 상세히 제공:\n# {SYMBOL} {SIGN} 분석\n## 기본 성향\n(3~4문장 이상, 구체적 성격 묘사)\n## 올해(2026) 행성 트랜짓 영향\n(목성, 토성 등 주요 행성의 영향을 구체적으로)\n## 연애 & 궁합 좋은 별자리\n(상위 3개 별자리와 이유)\n## 직업 & 재물\n(어울리는 직업군과 2026년 재물 흐름)\n## 건강 주의점\n(이 별자리가 특히 조심해야 할 건강 영역)\n## 이 별자리의 2026년 월별 포인트\n(분기별로 주요 이벤트와 조언)\n## 💡 별자리 전문가의 조언`;
const PR_INTEGRATED=`당신은 동양 명리학과 서양 점성술을 모두 수련한 통합 역학자입니다.\n아래 세 가지 분석 결과를 교차 검증하여 통합 리포트를 작성하세요.\n\n[사주명리] 사주: {SAJU}, 일간: {ILGAN}, 오행: {OHENG}, 십성: {SIPSUNG}\n[서양점성술] 태양 별자리: {SIGN}, 원소: {ELEMENT}, 지배행성: {PLANET}\n[MBTI 추정] 유형: {MBTI}\n\n마크다운으로 제공 (3000자 이상):\n# 🌌 {NAME}님의 동서양 통합 운명 분석\n\n## 🔮 세 체계가 공통으로 말하는 당신의 본질\n\n## ☯ 사주명리가 보는 당신\n\n## ⭐ 서양 점성술이 보는 당신\n\n## 🧠 추정 MBTI: {MBTI}\n\n## 💰 재물운 — 동서양 교차 분석\n## 💕 연애운 — 동서양 교차 분석\n## 💼 직업운 — 동서양 교차 분석\n## 🏥 건강운 — 동서양 교차 분석\n\n## 📅 2026년 통합 운세\n### 봄 (1~3월)\n### 여름 (4~6월)\n### 가을 (7~9월)\n### 겨울 (10~12월)\n\n## 🎯 세 체계가 합의하는 인생 조언 TOP 5`;
const PR_FACE_SAJU=SYS+`\n\n사주 오행 분포를 기반으로 관상학적 외모 경향성과 성격을 추정하세요.\n마크다운:\n# 👤 {NAME}님의 사주 기반 관상 추정\n## 오행 분포로 본 외모 경향\n## 얼굴형 추정\n## 눈·코·입 특징\n## 관상으로 본 성격\n## 관상으로 본 운세 경향\n## ⚠️ 참고사항\n"관상은 참고용이며, 운명은 스스로 만들어가는 것"이라고 반드시 명시.`;
const PR_FACE_PHOTO=`당신은 동양 관상학 전문가입니다. 업로드된 얼굴 사진을 분석하여 관상학적 해석을 제공하세요.\n마크다운:\n# 👤 관상 분석 결과\n## 얼굴형과 기본 성향\n## 이마 — 초년운\n## 눈 — 성격과 감정\n## 코 — 재물과 자존심\n## 입 — 대인관계와 복\n## 귀 — 지혜와 장수\n## 🔮 종합 관상 운세\n## ⚠️ 참고사항\n"관상은 참고용이며, 운명은 스스로 만들어가는 것"이라고 반드시 명시.`;

const TAROT=[{kr:"광대",icon:"🃏"},{kr:"마법사",icon:"🪄"},{kr:"여사제",icon:"🌙"},{kr:"여황제",icon:"👑"},{kr:"황제",icon:"🏛"},{kr:"교황",icon:"📿"},{kr:"연인",icon:"💕"},{kr:"전차",icon:"⚡"},{kr:"힘",icon:"🦁"},{kr:"은둔자",icon:"🏔"},{kr:"운명의 수레바퀴",icon:"🎡"},{kr:"정의",icon:"⚖️"},{kr:"매달린 사람",icon:"🔄"},{kr:"죽음",icon:"🦋"},{kr:"절제",icon:"🏺"},{kr:"악마",icon:"🔥"},{kr:"탑",icon:"💥"},{kr:"별",icon:"⭐"},{kr:"달",icon:"🌕"},{kr:"태양",icon:"☀️"},{kr:"심판",icon:"📯"},{kr:"세계",icon:"🌍"}];

/* ═══ DESIGN TOKENS (Apple-style) ═══ */
const T={
  bg:"#050508",surface:"#0a0a0f",card:"#111118",border:"#1a1a24",
  purple:"#a78bfa",purple2:"#8b5cf6",pink:"#f472b6",gold:"#fbbf24",green:"#34d399",blue:"#60a5fa",
  text:"#f0eeff",sub:"#9891b0",dim:"#4a4560",
};

/* ═══ Apple-style Components ═══ */
function Md({text}){
  if(!text)return null;
  const f=s=>s.replace(/\*\*(.*?)\*\*/g,'<strong style="color:#f0eeff">$1</strong>').replace(/\*(.*?)\*/g,'<em style="color:#a78bfa">$1</em>');
  return text.split("\n").map((l,i)=>{
    if(l.startsWith("### "))return <h3 key={i} style={{fontSize:14,fontWeight:700,color:T.purple,margin:"16px 0 6px",letterSpacing:"-0.02em"}}>{l.slice(4)}</h3>;
    if(l.startsWith("## "))return <h2 key={i} style={{fontSize:17,fontWeight:700,color:"#fff",margin:"24px 0 8px",letterSpacing:"-0.03em"}}>{l.slice(3)}</h2>;
    if(l.startsWith("# "))return <h1 key={i} style={{fontSize:22,fontWeight:800,color:"#fff",margin:"0 0 12px",letterSpacing:"-0.04em"}}>{l.slice(2)}</h1>;
    if(l.startsWith("---"))return <div key={i} style={{height:1,background:T.border,margin:"20px 0"}}/>;
    if(l.startsWith("- "))return <p key={i} style={{margin:"3px 0 3px 14px",color:T.sub,fontSize:14,lineHeight:1.8}}><span style={{color:T.purple,marginRight:6,fontSize:4,verticalAlign:"middle"}}>●</span><span dangerouslySetInnerHTML={{__html:f(l.slice(2))}}/></p>;
    if(l.match(/^\d+\.\s/))return <p key={i} style={{margin:"3px 0 3px 14px",color:T.sub,fontSize:14,lineHeight:1.8}} dangerouslySetInnerHTML={{__html:f(l)}}/>;
    if(!l.trim())return <div key={i} style={{height:6}}/>;
    return <p key={i} style={{margin:"3px 0",color:T.sub,fontSize:14,lineHeight:1.85}} dangerouslySetInnerHTML={{__html:f(l)}}/>;
  });
}

function Card({children,style,...p}){return <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:20,...style}} {...p}>{children}</div>}
function Pill({children,active,color=T.purple,onClick,style}){return <button onClick={onClick} style={{padding:"8px 16px",borderRadius:50,border:active?`1px solid ${color}`:`1px solid ${T.border}`,background:active?`${color}15`:"transparent",color:active?color:T.dim,fontSize:13,fontWeight:active?600:400,cursor:"pointer",transition:"all .2s",...style}}>{children}</button>}
function Btn({children,primary,color,onClick,style}){return <button onClick={onClick} style={{padding:"14px 28px",borderRadius:50,border:primary?"none":`1px solid ${T.border}`,background:primary?(color||T.purple2):"transparent",color:primary?"#fff":(color||T.sub),fontSize:15,fontWeight:700,cursor:"pointer",letterSpacing:"-0.02em",transition:"all .2s",...style}}>{children}</button>}
function Spin({color=T.purple,size=18}){return <div style={{width:size,height:size,margin:"0 auto",borderRadius:"50%",border:`2px solid ${T.border}`,borderTopColor:color,animation:"spin 1s linear infinite"}}/>}
function Back({onClick}){return <button onClick={onClick} style={{background:"none",border:"none",color:T.dim,cursor:"pointer",fontSize:13,marginBottom:16,fontWeight:500,letterSpacing:"-0.01em"}}>← 돌아가기</button>}
function PageTitle({emoji,title,sub}){return <div style={{textAlign:"center",marginBottom:28}}>{emoji&&<div style={{fontSize:28,marginBottom:8}}>{emoji}</div>}<h2 style={{fontSize:24,fontWeight:800,color:"#fff",letterSpacing:"-0.04em",margin:0}}>{title}</h2>{sub&&<p style={{fontSize:13,color:T.dim,marginTop:6}}>{sub}</p>}</div>}

/* ═══ SajuTable (Apple-style) ═══ */
function SajuTable({saju,oh}){
  const dG=saju.일주.간,dOh=OH_G[dG],dYY=음양간[dG];
  const cols=[saju.시주?{l:"시주",h:"時",...saju.시주}:null,{l:"일주",h:"日",...saju.일주},{l:"월주",h:"月",...saju.월주},{l:"년주",h:"年",...saju.년주}].filter(Boolean);
  return <div>
    <div style={{display:"flex",justifyContent:"center",gap:12,marginBottom:16}}>
      {cols.map((p,i)=>{const isMe=p.l==="일주";const ss=get십성(dOh,dYY,OH_G[p.간],음양간[p.간]);return <div key={i} style={{textAlign:"center",padding:"12px 10px",borderRadius:12,background:isMe?`${T.purple}10`:"transparent",border:isMe?`1px solid ${T.purple}20`:`1px solid ${T.border}`,minWidth:60}}>
        <div style={{fontSize:9,color:isMe?T.purple:T.dim,fontWeight:600,marginBottom:4}}>{p.h}柱 {p.l}</div>
        <div style={{fontSize:9,color:isMe?T.purple:(십성색[ss]||T.dim),marginBottom:6}}>{isMe?"일간":ss}</div>
        <div style={{fontSize:28,fontWeight:300,color:"#fff",lineHeight:1}}>{GK[p.간]}</div>
        <div style={{fontSize:8,color:OHC[OH_G[p.간]],fontWeight:600,margin:"4px 0"}}>{OHK[OH_G[p.간]]} {음양간[p.간]}</div>
        <div style={{height:1,background:T.border,margin:"6px 0"}}/>
        <div style={{fontSize:28,fontWeight:300,color:"#fff",lineHeight:1}}>{JK[p.지]}</div>
        <div style={{fontSize:8,color:OHC[OH_J[p.지]],fontWeight:600,marginTop:4}}>{OHK[OH_J[p.지]]} {음양지[p.지]}</div>
      </div>})}
    </div>
    {oh&&<div>
      <div style={{display:"flex",gap:2,height:5,borderRadius:3,overflow:"hidden"}}>{Object.entries(oh).map(([k,v])=>v>0&&<div key={k} style={{flex:v,background:OHC[k],opacity:.5,borderRadius:2}}/>)}</div>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:8}}>{Object.entries(oh).map(([k,v])=><div key={k} style={{textAlign:"center",flex:1}}><div style={{fontSize:16,fontWeight:700,color:v===0?T.border:OHC[k]}}>{v}</div><div style={{fontSize:10,color:T.dim}}>{OHK[k]}</div></div>)}</div>
    </div>}
  </div>;
}

function TCard({card,flipped,onClick,delay}){
  return <div onClick={onClick} style={{width:88,height:136,perspective:600,cursor:flipped?"default":"pointer",animation:`fadeIn .5s ease ${delay}s both`}}>
    <div style={{width:"100%",height:"100%",position:"relative",transformStyle:"preserve-3d",transition:"transform 0.8s cubic-bezier(.4,0,.2,1)",transform:flipped?"rotateY(180deg)":"rotateY(0)"}}>
      <div style={{position:"absolute",inset:0,backfaceVisibility:"hidden",borderRadius:14,background:T.card,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:18,color:T.purple,opacity:.3}}>✦</span></div>
      <div style={{position:"absolute",inset:0,backfaceVisibility:"hidden",transform:"rotateY(180deg)",borderRadius:14,background:T.surface,border:`1px solid ${T.purple}30`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:8,textAlign:"center"}}><span style={{fontSize:26,marginBottom:4}}>{card?.icon}</span><span style={{fontSize:11,fontWeight:600,color:T.text}}>{card?.kr}</span></div>
    </div>
  </div>;
}

/* ═══════════════════════════════════════════════════════════════
   MAIN APP — UNCONTROLLED INPUTS (Korean IME safe)
   ═══════════════════════════════════════════════════════════════ */
export default function SajuApp(){
  const[pg,setPg]=useState("splash");
  const[tab,setTab]=useState("result");
  const[navTab,setNT]=useState("home");
  const[gender,setGender]=useState("");
  const[month,setMonth]=useState("");
  const[day,setDay]=useState("");
  const[sijin,setSijin]=useState(null);
  const[gender2,setGender2]=useState("");
  const[month2,setMonth2]=useState("");
  const[day2,setDay2]=useState("");
  const[sijin2,setSijin2]=useState(null);
  const nameRef=useRef(null),yearRef=useRef(null),questionRef=useRef(null);
  const name2Ref=useRef(null),year2Ref=useRef(null);
  const chatRef=useRef(null),scrollRef=useRef(null),photoRef=useRef(null);
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
  const[ch,setCh]=useState([]);
  const[chatLoading,setChatLoading]=useState(false);
  const[dailyRd,setDailyRd]=useState("");
  const[dailyLoading,setDailyLoading]=useState(false);
  const[catRd,setCatRd]=useState("");
  const[catLoading,setCatLoading]=useState(false);
  const[catName,setCatName]=useState("");
  const[tCards,setTCards]=useState([]);
  const[tFlip,setTFlip]=useState([false,false,false]);
  const[tRd,setTRd]=useState("");
  const[tLoading,setTLoading]=useState(false);
  const[astroRd,setAstroRd]=useState("");
  const[astroLoading,setAstroLoading]=useState(false);
  const[zodiac,setZodiac]=useState(null);
  const[mbti,setMbti]=useState(null);
  const[intRd,setIntRd]=useState("");
  const[intLoading,setIntLoading]=useState(false);
  const[faceRd,setFaceRd]=useState("");
  const[faceLoading,setFaceLoading]=useState(false);
  const[facePhoto,setFacePhoto]=useState(null);
  const[faceMode,setFaceMode]=useState("saju");
  const[savedName,setSavedName]=useState("");
  const[savedYear,setSavedYear]=useState("");
  const[savedName2,setSavedName2]=useState("");
  const[savedYear2,setSavedYear2]=useState("");

  const loadMsgs=["사주를 펼칩니다","천간의 기운을 읽습니다","오행을 살핍니다","별자리를 읽습니다","동서양을 융합합니다"];
  useEffect(()=>{if(pg==="splash"){const t=setTimeout(()=>setPg("home"),1800);return()=>clearTimeout(t)}},[pg]);
  useEffect(()=>{if(loading){const t=setInterval(()=>setLi(p=>(p+1)%loadMsgs.length),2200);return()=>clearInterval(t)}},[loading]);
  useEffect(()=>{scrollRef.current?.scrollIntoView({behavior:"smooth"})},[ch]);

  const hasSaju=!!saju;
  const INP={width:"100%",padding:"12px 16px",borderRadius:12,border:`1px solid ${T.border}`,background:T.surface,color:T.text,fontSize:15,fontFamily:"'SUIT Variable','SUIT',-apple-system,sans-serif",outline:"none",boxSizing:"border-box",letterSpacing:"-0.01em"};

  function readForm(){const n=nameRef.current?.value||"",y=yearRef.current?.value||"",q=questionRef.current?.value||"";setSavedName(n);setSavedYear(y);return{name:n,year:y,question:q}}
  function readForm2(){const n=name2Ref.current?.value||"",y=year2Ref.current?.value||"";setSavedName2(n);setSavedYear2(y);return{name:n,year:y}}

  async function run(m){
    const{name,year,question}=readForm();if(!year||!month||!day||!gender)return;
    const h=hourFromSijin(sijin),s=mkSaju(+year,+month,+day,h),o=cntOH(s);
    setSaju(s);setOh(o);setPg("loading");setLoading(true);setMode(m);
    const z=getZodiac(+month,+day);setZodiac(z);const mb=estimateMBTI(o,s);setMbti(mb);
    const u=`이름:${name||"회원"}\n성별:${gender}\n생년월일:${year}년 ${month}월 ${day}일\n${sijin?`시:${시진표.find(x=>x.지===sijin)?.설명||""}`:""}\n사주:${sStr(s)}\n일간:${s.일주.간}(${OH_G[s.일주.간]})\n오행:${Object.entries(o).map(([k,v])=>`${OHK[k]}:${v}`).join(",")}\n띠:${DDI[s.년주.지]}\n나이:만${2026-(+year)}세\n${question?`질문:${question}`:""}`;
    const sys=(m==="premium"?PR_PREMIUM:PR_BASIC).replace("{NAME}",name||"회원");
    const text=await callAI(sys,[{role:"user",content:u}],m==="premium"?4000:3000);
    setRd(text);setCh([{role:"assistant",content:text}]);setPg("result");setTab("result");setLoading(false);setNT("result");
  }

  async function runCompat(){
    const f1=readForm(),f2=readForm2();if(!f1.year||!month||!day||!f2.year||!month2||!day2)return;
    const s1=mkSaju(+f1.year,+month,+day,hourFromSijin(sijin)),s2=mkSaju(+f2.year,+month2,+day2,hourFromSijin(sijin2));
    setSaju(s1);setSaju2(s2);setOh(cntOH(s1));setOh2(cntOH(s2));setZodiac(getZodiac(+month,+day));setMbti(estimateMBTI(cntOH(s1),s1));
    setPg("loading");setLoading(true);setMode("compat");
    const sys=PR_COMPAT.replace("{N1}",f1.name||"A").replace("{N2}",f2.name||"B");
    const u=`[A] ${f1.name||"A"},${gender},사주:${sStr(s1)}\n[B] ${f2.name||"B"},${gender2},사주:${sStr(s2)}`;
    const text=await callAI(sys,[{role:"user",content:u}]);
    setRd(text);setCh([{role:"assistant",content:text}]);setPg("result");setTab("result");setLoading(false);setNT("result");
  }

  async function doChat(){const val=chatRef.current?.value||"";if(!val.trim()||chatLoading)return;const msg=val.trim();chatRef.current.value="";setCh(p=>[...p,{role:"user",content:msg}]);setChatLoading(true);const msgs=[...ch,{role:"user",content:msg}].map(m=>({role:m.role,content:m.content}));const text=await callAI(`${SYS}\n사주:${saju?sStr(saju):""} 기반 답변. 마크다운. 500자 이내.`,msgs,2000);setCh(p=>[...p,{role:"assistant",content:text}]);setChatLoading(false)}
  async function doDaily(){if(!saju||dailyLoading)return;setDailyLoading(true);const u=`사주:${sStr(saju)}\n일간:${saju.일주.간}\n오행:${Object.entries(oh||{}).map(([k,v])=>`${OHK[k]}${v}`).join(" ")}\n이름:${savedName||"회원"}`;const text=await callAI(PR_DAILY,[{role:"user",content:u}],2000);setDailyRd(text);setDailyLoading(false)}
  async function doCat(cat){if(!saju)return;setCatLoading(true);setCatName(cat.label);setPg("category");setNT("category");const u=`사주:${sStr(saju)}\n일간:${saju.일주.간}\n오행:${Object.entries(oh||{}).map(([k,v])=>`${OHK[k]}${v}`).join(" ")}\n이름:${savedName||"회원"}\n성별:${gender}\n${cat.label} 상세 분석`;const text=await callAI(PR_CAT.replace("{CAT}",cat.label),[{role:"user",content:u}],2500);setCatRd(text);setCatLoading(false)}

  function doTarot(){const picked=[...TAROT].sort(()=>Math.random()-.5).slice(0,3);setTCards(picked);setTFlip([false,false,false]);setTRd("");setPg("tarot");setNT("tarot")}
  function flipTarot(i){if(tFlip[i])return;const nf=[...tFlip];nf[i]=true;setTFlip(nf);if(nf.every(Boolean)&&saju){setTLoading(true);const u=`사주:${sStr(saju)}\n카드:\n과거:${tCards[0].kr}\n현재:${tCards[1].kr}\n미래:${tCards[2].kr}`;const sys=PR_TAROT.replace("{C1}",tCards[0].kr).replace("{C2}",tCards[1].kr).replace("{C3}",tCards[2].kr);callAI(sys,[{role:"user",content:u}],2000).then(t=>{setTRd(t);setTLoading(false)})}}

  async function doAstro(){if(!saju||!zodiac)return;setAstroLoading(true);setPg("astro");setNT("astro");const sys=PR_ASTRO.replace("{SYMBOL}",zodiac.symbol).replace("{SIGN}",zodiac.sign);const u=`이름:${savedName||"회원"}\n태양 별자리:${zodiac.sign}(${zodiac.en})\n원소:${zodiac.element}\n지배행성:${zodiac.planet}\n특성:${zodiac.traits}\n사주 일간:${saju.일주.간}(${OH_G[saju.일주.간]})\n오행:${Object.entries(oh||{}).map(([k,v])=>`${OHK[k]}${v}`).join(" ")}`;const text=await callAI(sys,[{role:"user",content:u}],2500);setAstroRd(text);setAstroLoading(false)}

  async function doIntegrated(){if(!saju||!zodiac||!mbti)return;setIntLoading(true);setPg("integrated");setNT("integrated");const dG=saju.일주.간,dOh=OH_G[dG],dYY=음양간[dG];const ssList=[];[saju.년주,saju.월주,saju.시주].filter(Boolean).forEach(p=>{ssList.push(get십성(dOh,dYY,OH_G[p.간],음양간[p.간]))});const sys=PR_INTEGRATED.replace("{SAJU}",sStr(saju)).replace("{ILGAN}",`${saju.일주.간}(${dOh})`).replace("{OHENG}",Object.entries(oh||{}).map(([k,v])=>`${OHK[k]}${v}`).join(" ")).replace("{SIPSUNG}",ssList.join(",")).replace("{SIGN}",zodiac.sign).replace("{ELEMENT}",zodiac.element).replace("{PLANET}",zodiac.planet).replaceAll("{MBTI}",mbti).replace("{NAME}",savedName||"회원");const u=`이름:${savedName||"회원"}\n성별:${gender}\n생년월일:${savedYear}년${month}월${day}일\n사주:${sStr(saju)}\n별자리:${zodiac.sign}(${zodiac.en}) ${zodiac.symbol}\nMBTI추정:${mbti}\n오행:${Object.entries(oh||{}).map(([k,v])=>`${OHK[k]}${v}`).join(" ")}`;const text=await callAI(sys,[{role:"user",content:u}],4000);setIntRd(text);setIntLoading(false)}

  async function doFaceSaju(){if(!saju)return;setFaceLoading(true);setFaceMode("saju");setPg("face");setNT("face");const u=`이름:${savedName||"회원"}\n사주:${sStr(saju)}\n일간:${saju.일주.간}(${OH_G[saju.일주.간]})\n오행:${Object.entries(oh||{}).map(([k,v])=>`${OHK[k]}${v}`).join(" ")}\n성별:${gender}`;const text=await callAI(PR_FACE_SAJU.replace("{NAME}",savedName||"회원"),[{role:"user",content:u}],2500);setFaceRd(text);setFaceLoading(false)}
  async function doFacePhoto(){if(!facePhoto)return;setFaceLoading(true);setFaceMode("photo");setPg("face");setNT("face");try{const sajuInfo=saju?`\n사주:${sStr(saju)}\n일간:${saju.일주.간}(${OH_G[saju.일주.간]})\n오행:${Object.entries(oh||{}).map(([k,v])=>`${OHK[k]}${v}`).join(" ")}`:"";const r=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:3000,system:PR_FACE_PHOTO,messages:[{role:"user",content:[{type:"image",source:{type:"base64",media_type:"image/jpeg",data:facePhoto}},{type:"text",text:`이름:${savedName||"회원"}\n성별:${gender}${sajuInfo}\n\n위 사진의 관상을 분석해주세요.`}]}]})});const d=await r.json();setFaceRd(d.content?.map(b=>b.type==="text"?b.text:"").join("")||"분석 실패")}catch(e){setFaceRd("사진 분석 중 오류가 발생했습니다.")}setFaceLoading(false)}
  function handlePhotoUpload(e){const file=e.target.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=()=>setFacePhoto(reader.result.split(",")[1]);reader.readAsDataURL(file)}
  function reset(){setPg("home");setRd("");setCh([]);setSaju2(null);setTab("result");setNT("home")}

  /* ═══ SijinPicker ═══ */
  function SijinPicker({value,onChange}){
    return <div>
      <div style={{marginBottom:8,padding:"10px 14px",borderRadius:10,background:`${T.purple}08`,border:`1px solid ${T.purple}12`}}>
        <div style={{fontSize:13,color:T.sub,lineHeight:1.7}}>💡 <strong style={{color:T.text}}>왜 분은 안 받나요?</strong><br/>사주는 2시간 단위(시진)로 봐요.</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:4}}>
        <div onClick={()=>onChange(null)} style={{padding:"8px 4px",borderRadius:10,textAlign:"center",cursor:"pointer",border:value===null?`1px solid ${T.purple}`:`1px solid ${T.border}`,background:value===null?`${T.purple}12`:"transparent",fontSize:13,color:value===null?T.text:T.dim}}>모름</div>
        {시진표.map(s=><div key={s.지} onClick={()=>onChange(s.지)} style={{padding:"6px 2px",borderRadius:10,textAlign:"center",cursor:"pointer",border:value===s.지?`1px solid ${OHC[OH_J[s.지]]}`:`1px solid ${T.border}`,background:value===s.지?`${OHC[OH_J[s.지]]}12`:"transparent"}}>
          <div style={{fontSize:14,color:T.text,fontWeight:value===s.지?600:400}}>{s.시}</div>
          <div style={{fontSize:9,color:T.dim}}>{s.범위}</div>
        </div>)}
      </div>
    </div>;
  }

  /* ═══ RENDER ═══ */
  const wrap={maxWidth:440,margin:"0 auto",padding:"0 20px",position:"relative",zIndex:1};
  const page={...wrap,paddingTop:24,paddingBottom:100,animation:"fadeIn .4s ease"};

  return (
    <div style={{fontFamily:"'SUIT Variable','SUIT',-apple-system,BlinkMacSystemFont,sans-serif",background:T.bg,minHeight:"100vh",color:T.text,position:"relative",overflow:"hidden",paddingBottom:72,letterSpacing:"-0.02em"}}>
      <link href="https://cdn.jsdelivr.net/gh/sunn-us/SUIT/fonts/variable/woff2/SUIT-Variable.css" rel="stylesheet"/>
      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:.15}50%{opacity:.7}}
        @keyframes splashFade{0%{opacity:0;transform:scale(.95)}20%{opacity:1;transform:scale(1)}80%{opacity:1}100%{opacity:0}}
        ::placeholder{color:${T.dim}}
        select{appearance:none}
        button{transition:all .2s;font-family:'SUIT Variable','SUIT',-apple-system,sans-serif}
        *::-webkit-scrollbar{display:none}
      `}</style>

      {/* SPLASH */}
      {pg==="splash"&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",animation:"splashFade 1.8s ease forwards"}}>
        <div style={{fontSize:13,letterSpacing:".06em",color:T.dim,fontWeight:600,textTransform:"uppercase"}}>AI SAJU</div>
        <h1 style={{fontSize:28,fontWeight:800,color:"#fff",margin:"6px 0 0",letterSpacing:"-0.04em"}}>사주명리</h1>
        <p style={{fontSize:12,color:T.dim,marginTop:4}}>동서양 융합 운명 분석</p>
      </div>}

      {/* PAYWALL */}
      {pw&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",backdropFilter:"blur(12px)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setPw(false)}>
        <Card style={{maxWidth:360,width:"100%",textAlign:"center",padding:"32px 24px"}} onClick={e=>e.stopPropagation()}>
          <div style={{fontSize:28,marginBottom:10}}>🌌</div>
          <h2 style={{fontSize:22,fontWeight:800,color:"#fff",margin:"0 0 6px",letterSpacing:"-0.03em"}}>프리미엄</h2>
          <p style={{fontSize:13,color:T.dim,margin:"0 0 20px"}}>동서양 통합 분석의 모든 것</p>
          <div style={{textAlign:"left",marginBottom:20}}>{["사주 상세 분석 (4000자+)","동서양 통합 리포트","AI 사진 관상 분석","분기별 + 10년 대운","무제한 추가 질문"].map((f,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,fontSize:14,color:T.sub}}><span style={{color:T.green,fontSize:12}}>✓</span>{f}</div>)}</div>
          <div style={{marginBottom:20}}><span style={{fontSize:14,color:T.dim,textDecoration:"line-through",marginRight:8}}>₩4,900</span><span style={{fontSize:32,fontWeight:800,color:"#fff"}}>₩990</span></div>
          <Btn primary onClick={()=>{setPrem(true);setPw(false);if(saju)run("premium")}} style={{width:"100%",borderRadius:14}}>프리미엄 분석 받기</Btn>
          <button onClick={()=>setPw(false)} style={{background:"none",border:"none",color:T.dim,fontSize:12,cursor:"pointer",marginTop:12}}>다음에</button>
        </Card>
      </div>}

      {/* ═══ HOME ═══ */}
      {pg==="home"&&<div style={{...page,paddingTop:52}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <div style={{fontSize:13,letterSpacing:".06em",color:T.dim,fontWeight:600,marginBottom:6}}>AI SAJU</div>
          <h1 style={{fontSize:32,fontWeight:800,color:"#fff",margin:0,letterSpacing:"-0.04em"}}>사주명리</h1>
          <p style={{fontSize:14,color:T.dim,marginTop:4}}>동서양 융합 운명 분석</p>
        </div>

        {hasSaju&&<Card style={{marginBottom:12,cursor:"pointer",padding:"16px 18px"}} onClick={()=>{if(!dailyRd)doDaily();setPg("daily");setNT("daily")}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}><span style={{fontSize:22}}>✨</span><div style={{flex:1}}><div style={{fontSize:15,fontWeight:700,color:"#fff"}}>{savedName||"나"}의 오늘의 운세</div><div style={{fontSize:12,color:T.dim}}>2026.03.17 화요일</div></div><span style={{color:T.dim,fontSize:16}}>→</span></div>
        </Card>}

        {hasSaju&&zodiac&&mbti&&<Card style={{marginBottom:12,padding:"16px 18px"}}>
          <div style={{fontSize:13,color:T.dim,marginBottom:10}}>{savedName||"나"}님의 프로필</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            <Pill active color={T.purple}>{DDI_E[saju.년주.지]} {DDI[saju.년주.지]}띠</Pill>
            <Pill active color={ELEM_COLOR[zodiac.element]}>{zodiac.symbol} {zodiac.sign}</Pill>
            <Pill active color={T.green}>🧠 {mbti}</Pill>
          </div>
        </Card>}

        {hasSaju&&<Card style={{marginBottom:12,padding:"18px"}}>
          <div style={{fontSize:13,color:T.dim,fontWeight:600,marginBottom:12}}>주제별 운세</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
            {[{emoji:"💰",label:"재물운",c:T.gold},{emoji:"💕",label:"연애운",c:T.pink},{emoji:"💼",label:"직업운",c:T.purple},{emoji:"🏥",label:"건강운",c:T.green},{emoji:"📚",label:"학업운",c:T.blue},{emoji:"🍀",label:"행운",c:"#F59E0B"}].map(cat=><div key={cat.label} onClick={()=>doCat(cat)} style={{cursor:"pointer",background:`${cat.c}08`,border:`1px solid ${cat.c}15`,borderRadius:12,padding:"14px 8px",textAlign:"center",transition:"all .2s"}}><div style={{fontSize:22,marginBottom:4}}>{cat.emoji}</div><div style={{fontSize:13,fontWeight:600,color:T.text}}>{cat.label}</div></div>)}
          </div>
        </Card>}

        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {[
            {emoji:"🔮",title:"사주 분석",desc:"종합 사주명리 분석",fn:()=>setPg("input")},
            {emoji:"⭐",title:"점성술",desc:"서양 별자리 운세",badge:"NEW",bc:T.gold,fn:()=>{if(hasSaju)doAstro();else setPg("input")}},
            {emoji:"🌌",title:"통합 리포트",desc:"사주 × 점성술 × MBTI",badge:"PREMIUM",bc:T.purple2,fn:()=>{if(hasSaju){if(prem)doIntegrated();else setPw(true)}else setPg("input")}},
            {emoji:"💫",title:"궁합",desc:"두 사람의 궁합 분석",fn:()=>setPg("compat")},
            ...(hasSaju?[{emoji:"🎴",title:"타로 카드",desc:"3카드 리딩",fn:doTarot}]:[]),
            {emoji:"👤",title:"AI 관상",desc:"사주 / 사진 관상 분석",badge:"NEW",bc:T.green,fn:()=>{if(hasSaju)setPg("faceMenu");else setPg("input")}},
            {emoji:"🧠",title:"사주 MBTI",desc:"오행 기반 MBTI 추정",badge:"NEW",bc:T.blue,fn:()=>{if(hasSaju)setPg("mbtiResult");else setPg("input")}},
          ].map((item,i)=><Card key={i} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:14,padding:"16px 18px"}} onClick={item.fn}>
            <div style={{width:40,height:40,borderRadius:12,background:T.surface,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{item.emoji}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontSize:15,fontWeight:700,color:"#fff"}}>{item.title}</span>
                {item.badge&&<span style={{padding:"2px 8px",borderRadius:50,background:`${item.bc||T.purple}15`,color:item.bc||T.purple,fontSize:9,fontWeight:700}}>{item.badge}</span>}
              </div>
              <div style={{fontSize:12,color:T.dim,marginTop:1}}>{item.desc}</div>
            </div>
          </Card>)}
        </div>
      </div>}

      {/* ═══ INPUT ═══ */}
      {pg==="input"&&<div style={page}><Back onClick={()=>{setPg("home");setNT("home")}}/>
        <PageTitle emoji="🔮" title="내 사주"/>
        <Card>
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div><label style={{display:"block",fontSize:12,color:T.dim,marginBottom:4,fontWeight:500}}>이름</label><input ref={nameRef} defaultValue={savedName} placeholder="이름" style={INP}/></div>
            <div><label style={{display:"block",fontSize:12,color:T.dim,marginBottom:6,fontWeight:500}}>성별</label>
              <div style={{display:"flex",gap:8}}>{["남","여"].map(v=><Pill key={v} active={gender===v} onClick={()=>setGender(v)} style={{flex:1,textAlign:"center"}}>{v}</Pill>)}</div>
            </div>
            <div><label style={{display:"block",fontSize:12,color:T.dim,marginBottom:4,fontWeight:500}}>생년월일</label>
              <div style={{display:"flex",gap:6}}><input ref={yearRef} defaultValue={savedYear} placeholder="1990" maxLength={4} style={{...INP,flex:2}}/><select value={month} onChange={e=>setMonth(e.target.value)} style={{...INP,flex:1}}><option value="">월</option>{Array.from({length:12},(_,i)=><option key={i} value={i+1}>{i+1}</option>)}</select><select value={day} onChange={e=>setDay(e.target.value)} style={{...INP,flex:1}}><option value="">일</option>{Array.from({length:31},(_,i)=><option key={i} value={i+1}>{i+1}</option>)}</select></div>
            </div>
            <div><label style={{display:"block",fontSize:12,color:T.dim,marginBottom:6,fontWeight:500}}>태어난 시</label><SijinPicker value={sijin} onChange={setSijin}/></div>
            <div><label style={{display:"block",fontSize:12,color:T.dim,marginBottom:4,fontWeight:500}}>궁금한 점 <span style={{color:T.dim}}>(선택)</span></label><textarea ref={questionRef} defaultValue="" placeholder="예: 올해 이직 타이밍이 궁금합니다" rows={2} style={{...INP,resize:"vertical",lineHeight:1.5}}/></div>
          </div>
        </Card>
        <div style={{display:"flex",gap:8,marginTop:14}}>
          <Btn onClick={()=>run("basic")} style={{flex:1}}>무료 분석</Btn>
          <Btn primary onClick={()=>{if(prem)run("premium");else setPw(true)}} style={{flex:1}}>프리미엄 ✦</Btn>
        </div>
      </div>}

      {/* ═══ COMPAT ═══ */}
      {pg==="compat"&&<div style={page}><Back onClick={()=>{setPg("home");setNT("home")}}/>
        <PageTitle emoji="💫" title="궁합"/>
        <Card style={{marginBottom:8}}>
          <div style={{fontSize:11,color:T.purple,fontWeight:700,letterSpacing:".04em",marginBottom:12}}>첫 번째</div>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div><label style={{display:"block",fontSize:12,color:T.dim,marginBottom:4}}>이름</label><input ref={nameRef} defaultValue={savedName} placeholder="이름" style={INP}/></div>
            <div><label style={{display:"block",fontSize:12,color:T.dim,marginBottom:6}}>성별</label><div style={{display:"flex",gap:8}}>{["남","여"].map(v=><Pill key={v} active={gender===v} onClick={()=>setGender(v)} style={{flex:1,textAlign:"center"}}>{v}</Pill>)}</div></div>
            <div><label style={{display:"block",fontSize:12,color:T.dim,marginBottom:4}}>생년월일</label><div style={{display:"flex",gap:6}}><input ref={yearRef} defaultValue={savedYear} placeholder="1990" maxLength={4} style={{...INP,flex:2}}/><select value={month} onChange={e=>setMonth(e.target.value)} style={{...INP,flex:1}}><option value="">월</option>{Array.from({length:12},(_,i)=><option key={i} value={i+1}>{i+1}</option>)}</select><select value={day} onChange={e=>setDay(e.target.value)} style={{...INP,flex:1}}><option value="">일</option>{Array.from({length:31},(_,i)=><option key={i} value={i+1}>{i+1}</option>)}</select></div></div>
            <div><label style={{display:"block",fontSize:12,color:T.dim,marginBottom:6}}>태어난 시</label><SijinPicker value={sijin} onChange={setSijin}/></div>
          </div>
        </Card>
        <div style={{textAlign:"center",fontSize:16,color:T.pink,margin:"4px 0"}}>♥</div>
        <Card>
          <div style={{fontSize:11,color:T.pink,fontWeight:700,letterSpacing:".04em",marginBottom:12}}>두 번째</div>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div><label style={{display:"block",fontSize:12,color:T.dim,marginBottom:4}}>이름</label><input ref={name2Ref} defaultValue={savedName2} placeholder="이름" style={INP}/></div>
            <div><label style={{display:"block",fontSize:12,color:T.dim,marginBottom:6}}>성별</label><div style={{display:"flex",gap:8}}>{["남","여"].map(v=><Pill key={v} active={gender2===v} color={T.pink} onClick={()=>setGender2(v)} style={{flex:1,textAlign:"center"}}>{v}</Pill>)}</div></div>
            <div><label style={{display:"block",fontSize:12,color:T.dim,marginBottom:4}}>생년월일</label><div style={{display:"flex",gap:6}}><input ref={year2Ref} defaultValue={savedYear2} placeholder="1990" maxLength={4} style={{...INP,flex:2}}/><select value={month2} onChange={e=>setMonth2(e.target.value)} style={{...INP,flex:1}}><option value="">월</option>{Array.from({length:12},(_,i)=><option key={i} value={i+1}>{i+1}</option>)}</select><select value={day2} onChange={e=>setDay2(e.target.value)} style={{...INP,flex:1}}><option value="">일</option>{Array.from({length:31},(_,i)=><option key={i} value={i+1}>{i+1}</option>)}</select></div></div>
            <div><label style={{display:"block",fontSize:12,color:T.dim,marginBottom:6}}>태어난 시</label><SijinPicker value={sijin2} onChange={setSijin2}/></div>
          </div>
        </Card>
        <Btn primary color="#ec4899" onClick={runCompat} style={{width:"100%",marginTop:14}}>궁합 분석</Btn>
      </div>}

      {/* LOADING */}
      {pg==="loading"&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",gap:20}}>
        <Spin size={32}/><p style={{fontSize:15,fontWeight:600,color:"#fff"}}>{loadMsgs[li]}</p>
        <div style={{display:"flex",gap:4}}>{[0,1,2].map(i=><div key={i} style={{width:3,height:3,borderRadius:"50%",background:T.purple,animation:`pulse 1.5s ease ${i*.3}s infinite`}}/>)}</div>
      </div>}

      {/* DAILY */}
      {pg==="daily"&&<div style={page}><Back onClick={()=>{setPg("home");setNT("home")}}/><PageTitle title="오늘의 운세" sub="2026.03.17 화요일"/><Card>{dailyLoading?<div style={{textAlign:"center",padding:30}}><Spin/></div>:<Md text={dailyRd}/>}</Card></div>}

      {/* CATEGORY */}
      {pg==="category"&&<div style={page}><Back onClick={()=>{setPg("home");setNT("home")}}/><PageTitle title={`${catName} 상세 분석`}/><Card>{catLoading?<div style={{textAlign:"center",padding:30}}><Spin/></div>:<Md text={catRd}/>}</Card></div>}

      {/* TAROT */}
      {pg==="tarot"&&<div style={page}><Back onClick={()=>{setPg("home");setNT("home")}}/><PageTitle emoji="🎴" title="타로 카드" sub="카드를 하나씩 뒤집어 보세요"/>
        <div style={{display:"flex",justifyContent:"center",gap:12,marginBottom:14}}>{["과거","현재","미래"].map((l,i)=><div key={i} style={{textAlign:"center"}}><div style={{fontSize:10,color:T.dim,marginBottom:6}}>{l}</div>{tCards[i]&&<TCard card={tCards[i]} flipped={tFlip[i]} onClick={()=>flipTarot(i)} delay={i*.12}/>}</div>)}</div>
        {tFlip.every(Boolean)&&<Card>{tLoading?<div style={{textAlign:"center",padding:20}}><Spin color={T.gold}/></div>:<Md text={tRd}/>}</Card>}
      </div>}

      {/* ASTRO */}
      {pg==="astro"&&<div style={page}><Back onClick={()=>{setPg("home");setNT("home")}}/>
        {zodiac&&<PageTitle title={zodiac.sign} sub={`${zodiac.symbol} ${zodiac.element} 원소 · ${zodiac.planet}`}/>}
        {zodiac&&<div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:20,flexWrap:"wrap"}}>
          <Pill active color={ELEM_COLOR[zodiac.element]}>{zodiac.element} 원소</Pill>
          <Pill active color={T.purple}>🪐 {zodiac.planet}</Pill>
        </div>}
        <Card>{astroLoading?<div style={{textAlign:"center",padding:30}}><Spin color={T.gold}/></div>:<Md text={astroRd}/>}</Card>
      </div>}

      {/* MBTI */}
      {pg==="mbtiResult"&&<div style={page}><Back onClick={()=>{setPg("home");setNT("home")}}/><PageTitle emoji="🧠" title="사주 기반 MBTI" sub="오행 분포와 십성으로 추정"/>
        {mbti&&<Card>
          <div style={{textAlign:"center",marginBottom:20}}>
            <div style={{display:"inline-block",padding:"14px 32px",borderRadius:16,background:T.surface,border:`1px solid ${T.border}`}}>
              <div style={{fontSize:40,fontWeight:800,color:"#fff",letterSpacing:8}}>{mbti}</div>
            </div>
            <p style={{fontSize:14,color:T.sub,marginTop:10}}>{MBTI_DESC[mbti]||""}</p>
          </div>
          {oh&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:16}}>
            {[{l:"E/I",v:mbti[0],d:mbti[0]==="E"?`목·화(${oh.목+oh.화}) > 금·수(${oh.금+oh.수})`:`금·수(${oh.금+oh.수}) ≥ 목·화(${oh.목+oh.화})`},{l:"S/N",v:mbti[1],d:mbti[1]==="S"?`토·금(${oh.토+oh.금}) > 수·목(${oh.수+oh.목})`:`수·목(${oh.수+oh.목}) ≥ 토·금(${oh.토+oh.금})`},{l:"T/F",v:mbti[2],d:mbti[2]==="T"?`금·수(${oh.금+oh.수}) > 화·목(${oh.화+oh.목})`:`화·목(${oh.화+oh.목}) ≥ 금·수(${oh.금+oh.수})`},{l:"J/P",v:mbti[3],d:mbti[3]==="J"?`토·금(${oh.토+oh.금}) > 목·화(${oh.목+oh.화})`:`목·화(${oh.목+oh.화}) ≥ 토·금(${oh.토+oh.금})`}].map((r,i)=><div key={i} style={{padding:10,borderRadius:10,background:T.surface,border:`1px solid ${T.border}`}}><div style={{fontSize:13,fontWeight:700,color:T.text,marginBottom:2}}>{r.l}: {r.v}</div><div style={{fontSize:11,color:T.dim}}>{r.d}</div></div>)}
          </div>}
          <div style={{padding:"10px 14px",borderRadius:10,background:`${T.gold}08`,border:`1px solid ${T.gold}12`}}>
            <p style={{fontSize:12,color:T.sub,lineHeight:1.7,margin:0}}>⚠️ 학술 연구(이남호·김만태, 2018) 기반 <strong style={{color:T.text}}>재미 목적의 추정</strong>이며, 정식 MBTI 검사를 대체하지 않습니다.</p>
          </div>
        </Card>}
      </div>}

      {/* INTEGRATED */}
      {pg==="integrated"&&<div style={page}><Back onClick={()=>{setPg("home");setNT("home")}}/><PageTitle emoji="🌌" title="통합 리포트" sub="사주 × 점성술 × MBTI"/>
        {zodiac&&mbti&&<div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:20,flexWrap:"wrap"}}><Pill active>☯ 사주</Pill><Pill active color={ELEM_COLOR[zodiac.element]}>{zodiac.symbol} {zodiac.sign}</Pill><Pill active color={T.green}>🧠 {mbti}</Pill></div>}
        <Card>{intLoading?<div style={{textAlign:"center",padding:40}}><Spin/><p style={{fontSize:13,color:T.dim,marginTop:14}}>세 체계를 융합 분석 중...</p></div>:<Md text={intRd}/>}</Card>
      </div>}

      {/* FACE MENU */}
      {pg==="faceMenu"&&<div style={page}><Back onClick={()=>{setPg("home");setNT("home")}}/><PageTitle emoji="👤" title="AI 관상 분석" sub="두 가지 방식으로 관상을 봅니다"/>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <Card style={{cursor:"pointer",padding:22}} onClick={doFaceSaju}><div style={{display:"flex",alignItems:"center",gap:14}}><div style={{width:44,height:44,borderRadius:14,background:T.surface,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>☯</div><div style={{flex:1}}><div style={{fontSize:15,fontWeight:700,color:"#fff"}}>사주 기반 추정</div><div style={{fontSize:12,color:T.dim}}>오행으로 외모 경향 분석</div></div><Pill active color={T.green} style={{fontSize:10}}>무료</Pill></div></Card>
          <Card style={{cursor:"pointer",padding:22}} onClick={()=>setPg("faceUpload")}><div style={{display:"flex",alignItems:"center",gap:14}}><div style={{width:44,height:44,borderRadius:14,background:T.surface,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>📸</div><div style={{flex:1}}><div style={{fontSize:15,fontWeight:700,color:"#fff"}}>사진 관상 분석</div><div style={{fontSize:12,color:T.dim}}>실제 셀카로 분석</div></div><Pill active color={T.purple} style={{fontSize:10}}>PREMIUM</Pill></div></Card>
        </div>
      </div>}

      {/* FACE UPLOAD */}
      {pg==="faceUpload"&&<div style={page}><Back onClick={()=>setPg("faceMenu")}/><PageTitle emoji="📸" title="사진 관상 분석" sub="정면 셀카를 올려주세요"/>
        <Card style={{textAlign:"center",padding:30}}>
          <input ref={photoRef} type="file" accept="image/*" capture="user" onChange={handlePhotoUpload} style={{display:"none"}}/>
          {facePhoto?<div><div style={{width:120,height:120,margin:"0 auto 14px",borderRadius:"50%",overflow:"hidden",border:`2px solid ${T.border}`}}><img src={`data:image/jpeg;base64,${facePhoto}`} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/></div><button onClick={()=>setFacePhoto(null)} style={{background:"none",border:"none",color:T.dim,fontSize:12,cursor:"pointer",marginBottom:14}}>다시 선택</button></div>
          :<div onClick={()=>photoRef.current?.click()} style={{cursor:"pointer",padding:36,borderRadius:14,border:`2px dashed ${T.border}`,background:T.surface}}><div style={{fontSize:36,marginBottom:8}}>📷</div><p style={{fontSize:14,color:T.dim,margin:0}}>터치하여 사진 선택</p></div>}
          {facePhoto&&<Btn primary onClick={()=>{if(prem)doFacePhoto();else setPw(true)}} style={{width:"100%",marginTop:14}}>관상 분석 시작 ✦</Btn>}
        </Card>
      </div>}

      {/* FACE RESULT */}
      {pg==="face"&&<div style={page}><Back onClick={()=>{setPg("home");setNT("home")}}/><PageTitle title={`${faceMode==="photo"?"사진":"사주"} 관상 분석`}/><Card>{faceLoading?<div style={{textAlign:"center",padding:30}}><Spin color={T.green}/></div>:<Md text={faceRd}/>}</Card></div>}

      {/* ═══ RESULT ═══ */}
      {pg==="result"&&saju&&<div style={{...page,maxWidth:480}}>
        <Back onClick={reset}/>
        <Card style={{marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <span style={{fontSize:12,color:T.dim}}>{savedName?`${savedName} · `:""}{savedYear}.{month}.{day} · {DDI_E[saju.년주.지]} {DDI[saju.년주.지]}띠</span>
            <div style={{display:"flex",gap:4}}>
              {zodiac&&<Pill active color={ELEM_COLOR[zodiac.element]} style={{padding:"2px 8px",fontSize:9}}>{zodiac.symbol}{zodiac.sign}</Pill>}
              {mbti&&<Pill active color={T.green} style={{padding:"2px 8px",fontSize:9}}>{mbti}</Pill>}
              {mode==="premium"&&<Pill active style={{padding:"2px 8px",fontSize:9}}>PREMIUM</Pill>}
            </div>
          </div>
          <SajuTable saju={saju} oh={oh}/>
          <div style={{marginTop:16,padding:14,borderRadius:12,background:T.surface,border:`1px solid ${T.border}`,cursor:"pointer"}} onClick={()=>setShowManse(!showManse)}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:13,fontWeight:600,color:T.sub}}>📖 사주 읽는 법</span><span style={{fontSize:11,color:T.dim}}>{showManse?"접기 ▲":"펼치기 ▼"}</span></div>
            {showManse&&<div style={{marginTop:10,fontSize:13,color:T.dim,lineHeight:1.85}}>
              <p style={{margin:"0 0 8px"}}><strong style={{color:T.sub}}>만세력이란?</strong> 과거·현재·미래의 천간·지지를 기록한 역법.</p>
              <p style={{margin:"0 0 8px"}}><strong style={{color:T.sub}}>사주팔자란?</strong> 4개의 기둥(년·월·일·시)과 8개의 글자로 구성.</p>
              <p style={{margin:"0 0 8px"}}><strong style={{color:T.sub}}>일간이 핵심!</strong> 일주 천간이 "나 자신". 다른 7글자는 환경.</p>
              <p style={{margin:0,fontSize:11}}>사주는 확정된 운명이 아닌 타고난 기질과 흐름의 경향성이에요.</p>
            </div>}
          </div>
        </Card>
        {mode==="compat"&&saju2&&<Card style={{marginBottom:12}}><div style={{fontSize:12,color:T.pink,marginBottom:8}}>{savedName2||"상대방"} · {savedYear2}.{month2}.{day2}</div><SajuTable saju={saju2} oh={oh2}/></Card>}

        <div style={{display:"flex",gap:4,marginBottom:12}}>{[{k:"result",l:"📜 분석"},{k:"chat",l:"💬 질문"},{k:"share",l:"📤 공유"}].map(t=><Pill key={t.k} active={tab===t.k} onClick={()=>setTab(t.k)} style={{flex:1,textAlign:"center"}}>{t.l}</Pill>)}</div>

        {tab==="result"&&<Card><Md text={rd}/>{mode==="basic"&&!prem&&<div style={{position:"relative",margin:"20px 0",borderRadius:14,overflow:"hidden"}}><div style={{filter:"blur(4px)",opacity:.1,height:80,background:T.surface}}/><div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8}}><span style={{fontSize:13,fontWeight:600,color:T.text}}>재물운, 연애운, 동서양 통합 분석...</span><Btn primary onClick={()=>setPw(true)} style={{padding:"10px 24px",fontSize:13}}>프리미엄으로 열기 ✦</Btn></div></div>}</Card>}
        {tab==="chat"&&<Card style={{minHeight:160}}>
          <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:14,justifyContent:"center"}}>{["이직 시기","재물운","연애운","건강","내년 운세","별자리 궁합","MBTI 성격"].map(t=><Pill key={t} onClick={()=>{if(chatRef.current)chatRef.current.value=t+"이 궁금해요"}}>{t}</Pill>)}</div>
          {ch.slice(1).map((m,i)=><div key={i} style={{marginBottom:12}}>{m.role==="user"&&<div style={{background:T.surface,borderRadius:10,padding:"10px 12px",borderLeft:`2px solid ${T.purple}`,marginBottom:6}}><p style={{margin:0,color:T.text,fontSize:14}}>{m.content}</p></div>}{m.role==="assistant"&&<Md text={m.content}/>}</div>)}
          {chatLoading&&<div style={{display:"flex",alignItems:"center",gap:6,color:T.dim,fontSize:12}}><Spin size={10}/>답변 중</div>}
          <div ref={scrollRef}/>
        </Card>}
        {tab==="share"&&<div style={{textAlign:"center"}}><p style={{fontSize:12,color:T.dim,marginBottom:14}}>스크린샷으로 공유</p>
          <div style={{width:280,margin:"0 auto",padding:"22px 18px",background:T.surface,borderRadius:16,border:`1px solid ${T.border}`}}>
            <div style={{fontSize:8,letterSpacing:4,color:T.dim,marginBottom:6}}>AI SAJU</div>
            <div style={{fontSize:18,fontWeight:700,color:"#fff",marginBottom:2}}>{savedName||"나"}의 사주</div>
            <div style={{fontSize:10,color:T.dim,marginBottom:6}}>{savedYear}.{month}.{day} · {DDI_E[saju.년주.지]} {DDI[saju.년주.지]}띠</div>
            {zodiac&&mbti&&<div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:8}}><span style={{fontSize:10,color:ELEM_COLOR[zodiac.element]}}>{zodiac.symbol}{zodiac.sign}</span><span style={{fontSize:10,color:T.green}}>🧠{mbti}</span></div>}
            <div style={{display:"flex",justifyContent:"center",gap:12,marginBottom:10}}>{[saju.시주&&["시",saju.시주],["일",saju.일주],["월",saju.월주],["년",saju.년주]].filter(Boolean).map(([l,p],i)=><div key={i} style={{textAlign:"center"}}><div style={{fontSize:7,color:T.dim}}>{l}</div><div style={{fontSize:22,fontWeight:300,color:"#fff",lineHeight:1.1}}>{GK[p.간]}</div><div style={{fontSize:22,fontWeight:300,color:"#fff",lineHeight:1.1}}>{JK[p.지]}</div></div>)}</div>
            <div style={{height:1,background:T.border,margin:"8px 0"}}/>
            <div style={{display:"flex",justifyContent:"center",gap:8}}>{Object.entries(oh||{}).map(([k,v])=><span key={k} style={{fontSize:10,color:v?OHC[k]:T.border,fontWeight:600}}>{OHK[k]}{v}</span>)}</div>
          </div>
          <button onClick={()=>navigator.clipboard.writeText(`🔮 ${savedName||"나"}의 사주: ${sStr(saju)}\n${zodiac?`⭐ ${zodiac.symbol} ${zodiac.sign}`:""}\n${mbti?`🧠 추정 MBTI: ${mbti}`:""}\n오행: ${Object.entries(oh||{}).map(([k,v])=>`${OHK[k]}${v}`).join(" ")}\n\nAI 사주명리에서 분석 받기`)} style={{marginTop:14,padding:"8px 20px",borderRadius:50,border:`1px solid ${T.border}`,background:"transparent",color:T.dim,fontSize:12,cursor:"pointer"}}>텍스트 복사</button>
        </div>}
        {tab==="chat"&&<div style={{position:"fixed",bottom:72,left:0,right:0,background:`linear-gradient(transparent,${T.bg} 40%)`,padding:"12px 16px",zIndex:10}}><div style={{maxWidth:480,margin:"0 auto",display:"flex",gap:6}}><input ref={chatRef} defaultValue="" onKeyDown={e=>{if(e.key==="Enter"&&!e.nativeEvent.isComposing)doChat()}} placeholder="질문을 입력하세요" style={{...INP,flex:1}}/><Btn primary onClick={doChat} style={{padding:"12px 20px",fontSize:13,whiteSpace:"nowrap"}}>질문</Btn></div></div>}
      </div>}

      {/* ═══ BOTTOM NAV ═══ */}
      {pg!=="splash"&&pg!=="loading"&&<div style={{position:"fixed",bottom:0,left:0,right:0,background:`${T.bg}ee`,backdropFilter:"blur(16px)",borderTop:`1px solid ${T.border}`,zIndex:100,padding:"6px 0 env(safe-area-inset-bottom,6px)"}}>
        <div style={{maxWidth:480,margin:"0 auto",display:"flex",justifyContent:"space-around"}}>
          {[
            {k:"home",icon:"🏠",l:"홈",fn:()=>{setPg("home");setNT("home")}},
            {k:"saju",icon:"🔮",l:"사주",fn:()=>{setPg("input");setNT("saju")}},
            {k:"astro",icon:"⭐",l:"점성술",fn:()=>{if(hasSaju)doAstro();else{setPg("input");setNT("saju")}}},
            {k:"integrated",icon:"🌌",l:"통합",fn:()=>{if(hasSaju){if(prem)doIntegrated();else setPw(true)}else{setPg("input");setNT("saju")}}},
            {k:"result",icon:"📊",l:"결과",fn:()=>{if(rd){setPg("result");setNT("result")}else{setPg("input");setNT("saju")}}}
          ].map(t=><button key={t.k} onClick={t.fn} style={{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:1,padding:"5px 12px",color:navTab===t.k?T.purple:T.dim,fontSize:10}}>
            <span style={{fontSize:20,opacity:navTab===t.k?1:.35}}>{t.icon}</span>
            <span style={{fontWeight:navTab===t.k?700:400,letterSpacing:"-0.01em"}}>{t.l}</span>
          </button>)}
        </div>
      </div>}
    </div>
  );
}
