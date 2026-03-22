"use client";
import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════
   NUVO AI v1.0 — 통합 플랫폼
   사주 분석 + AI 뉴스 브리핑 + Fortune Signal + 5개 신규 기능
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

/* ═══ 오행→자산 매핑 ═══ */
const OH_ASSET={
  목:{label:"바이오/헬스케어",etf:["TIGER 바이오TOP10","KODEX 헬스케어"],traits:"성장·확장",emoji:"🌱",sectors:["바이오","헬스케어","교육","농업","패션"]},
  화:{label:"반도체/AI/IT",etf:["TIGER 반도체","KODEX AI반도체핵심장비"],traits:"혁신·열정",emoji:"🔥",sectors:["반도체","AI/IT","엔터","에너지","방산"]},
  토:{label:"건설/부동산/리츠",etf:["TIGER 리츠부동산인프라"],traits:"안정·축적",emoji:"🏔",sectors:["건설","부동산","리츠","식품","유통","금융"]},
  금:{label:"금/귀금속/로봇",etf:["TIGER 로봇","KODEX 철강"],traits:"수확·결실",emoji:"⚙️",sectors:["금/귀금속","자동차","기계/로봇","철강"]},
  수:{label:"해운/암호화폐/핀테크",etf:["TIGER 원자력테마"],traits:"유동·지혜",emoji:"💧",sectors:["해운","암호화폐","핀테크","관광"]},
};

/* ═══ 일진 관계 판별 ═══ */
const 생합쌍={자:"축",축:"자",인:"해",해:"인",묘:"술",술:"묘",진:"유",유:"진",사:"신",신:"사",오:"미",미:"오"};
const 삼합={인:["오","술"],오:["술","인"],술:["인","오"],사:["유","축"],유:["축","사"],축:["사","유"],신:["자","진"],자:["진","신"],진:["신","자"],해:["묘","미"],묘:["미","해"],미:["해","묘"]};
const 충쌍={자:"오",오:"자",축:"미",미:"축",인:"신",신:"인",묘:"유",유:"묘",진:"술",술:"진",사:"해",해:"사"};

function getDayRelation(userDayJi, targetDayJi){
  if(생합쌍[userDayJi]===targetDayJi) return "생합";
  if(삼합[userDayJi]?.includes(targetDayJi)) return "삼합";
  const uOh=OH_J[userDayJi], tOh=OH_J[targetDayJi];
  if(uOh===tOh) return "비화";
  if(오행상생[tOh]===uOh) return "상생";
  if(충쌍[userDayJi]===targetDayJi) return "충";
  if(오행상극[tOh]===uOh||오행상극[uOh]===tOh) return "상극";
  return "비화";
}
function getInvestGrade(rel, hasJaeSung){
  const base={생합:"A+",삼합:"A",상생:"A",비화:"B",상극:"C",충:"D"};
  let g=base[rel]||"B";
  if(hasJaeSung&&g!=="A+") g=g==="A"?"A+":g==="B"?"A":g==="C"?"B":g;
  return g;
}
const GRADE_COLOR={"A+":"#34D399",A:"#34D399",B:"#FBBF24",C:"#F97316",D:"#EF4444"};

/* ═══ 월간 일진 계산 ═══ */
function getMonthDays(y,m){
  const days=[];
  const daysInMonth=new Date(y,m,0).getDate();
  for(let d=1;d<=daysInMonth;d++){
    const dc=calcD(y,m,d);
    days.push({day:d,간:dc.간,지:dc.지,oh_g:OH_G[dc.간],oh_j:OH_J[dc.지]});
  }
  return days;
}

/* ═══ API (스트리밍) ═══ */
async function callAI(sys,msgs,mt=4000,onChunk=null){
  try{
    // 스트리밍 모드 (onChunk 콜백이 있으면)
    if(onChunk){
      const r=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:mt,system:sys,messages:msgs,stream:true})});
      if(!r.ok)return"분석 중 오류가 발생했습니다.";
      const reader=r.body.getReader();const decoder=new TextDecoder();let full="";
      while(true){
        const{done,value}=await reader.read();if(done)break;
        const chunk=decoder.decode(value,{stream:true});
        const lines=chunk.split("\n");
        for(const line of lines){
          if(line.startsWith("data: ")&&line!=="data: [DONE]"){
            try{const j=JSON.parse(line.slice(6));if(j.text){full+=j.text;onChunk(full)}}catch(e){}
          }
        }
      }
      return full||"분석 결과를 불러올 수 없습니다.";
    }
    // 비스트리밍 폴백
    const r=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:mt,system:sys,messages:msgs})});
    const d=await r.json();return d.content?.map(b=>b.type==="text"?b.text:"").join("")||"분석 결과를 불러올 수 없습니다.";
  }catch(e){return"네트워크 오류가 발생했습니다. 다시 시도해주세요."}
}

/* ═══ RSS 브리핑 API ═══ */
async function fetchBriefing(lang="kr",category="all"){
  try{
    const r=await fetch("/api/briefing",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({lang,category})});
    const d=await r.json();return d;
  }catch(e){return{error:"브리핑을 불러올 수 없습니다."}}
}
async function fetchFortuneSignal(birthData,oh){
  try{
    const r=await fetch("/api/fortune-signal",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({birthData,oh})});
    const d=await r.json();return d;
  }catch(e){return{error:"시그널을 불러올 수 없습니다."}}
}

/* ═══ PROMPTS ═══ */
const SYS=`당신은 40년 경력의 대한민국 최고 사주명리학 대가입니다. 전통 명리학(격국론,용신론,십성론,신살론,합충형파해,대운·세운)에 정통하며 현대적이고 따뜻한 "~해요" 체로 풀이합니다. 한자 용어에 쉬운 설명을 반드시 병기합니다.`;
const PR_BASIC=SYS+`\n\n기본 분석(마크다운,2000자 이상 상세히):\n# {NAME}님의 사주 풀이\n\n## 🔮 사주 구성과 핵심 해석\n(일간의 의미, 각 기둥별 관계를 풍부하게 설명)\n\n## ⚖️ 오행 균형과 용신\n(어떤 오행이 강하고 약한지, 용신이 무엇이고 왜 그런지 구체적으로)\n\n## 🌟 타고난 기질과 성격\n(강점 3가지와 주의할 점 2가지를 구체적 예시와 함께)\n\n## 💼 적성과 재능\n(어울리는 직업군과 재능 발휘 방향)\n\n## 📅 2026년 병오년 운세\n(올해 전체 흐름과 주요 전환 시기를 구체적으로)\n\n## 🍀 행운 포인트\n(행운의 색, 숫자, 방위, 음식을 근거와 함께)\n\n## 💡 인생 조언 3가지\n(실천 가능한 구체적 조언)\n\n반드시 2000자 이상 상세하게 작성. 각 섹션마다 최소 3~4문장. 구체적 예시와 비유를 활용.`;
const PR_PREMIUM=SYS+`\n\n프리미엄 상세 분석(마크다운,3000자+):\n# {NAME}님의 프리미엄 분석\n## 🔮 사주 심층 해석\n## ⚖️ 오행 & 용신\n## 🌟 성격·재능\n## 💰 재물운\n## 💼 직업운\n## 💕 연애운\n## 🏥 건강운\n## 📅 2026년 분기별\n### 1~3월\n### 4~6월\n### 7~9월\n### 10~12월\n## 🔄 10년 대운\n## 🎯 인생 조언 TOP 5`;
const PR_COMPAT=SYS+`\n\n궁합(마크다운):\n# {N1} ♥ {N2}\n## 💕 궁합 점수: [XX]/100\n## 🔮 두 사주의 관계\n## 💪 강점 3가지\n## ⚠️ 주의점 3가지\n## 💡 궁합 높이는 법\n## 📅 2026 관계 운세`;
const PR_DAILY=SYS+`\n\n오늘의 운세(마크다운,800자 이상 상세히):\n# ✨ 오늘의 운세\n## 총운\n(오늘 하루 전체 기운을 3~4문장으로)\n## 행운 포인트\n- 🎨 행운의 색 (이유 포함)\n- 🔢 행운의 숫자 (이유 포함)\n- 🧭 좋은 방위\n- 🍽 행운의 음식\n## ⏰ 시간대별 운세\n(오전/오후/저녁 각각 구체적으로)\n## 주의할 점\n## 💡 오늘의 한마디`;
const PR_CAT=SYS+`\n\n{CAT} 상세 분석(마크다운,1500자 이상). 구체적 시기, 실천법, 주의사항, 조언을 포함. 각 항목별 3~4문장 이상 상세하게.`;
const PR_TAROT=SYS+`\n\n사주 기반 타로 해석(마크다운,1200자 이상):\n# 🎴 타로 리딩\n## 과거 — {C1}\n(이 카드가 사주 기반으로 어떤 과거를 의미하는지 3~4문장)\n## 현재 — {C2}\n(현재 상황과 카드의 연결점을 구체적으로)\n## 미래 — {C3}\n(앞으로의 흐름과 주의점)\n## 🔮 종합 메시지\n(세 카드를 관통하는 핵심 메시지와 실천 조언)\n## 💡 타로가 전하는 한마디`;
const PR_ASTRO=`당신은 서양 점성술 전문가입니다. 태양 별자리, 원소(불/땅/공기/물), 지배 행성을 기반으로 분석합니다.\n마크다운으로 2000자 이상 상세히 제공:\n# {SYMBOL} {SIGN} 분석\n## 기본 성향\n## 올해(2026) 행성 트랜짓 영향\n## 연애 & 궁합 좋은 별자리\n## 직업 & 재물\n## 건강 주의점\n## 이 별자리의 2026년 월별 포인트\n## 💡 별자리 전문가의 조언`;
const PR_INTEGRATED=`당신은 동양 명리학과 서양 점성술을 모두 수련한 통합 역학자입니다.\n아래 세 가지 분석 결과를 교차 검증하여 통합 리포트를 작성하세요.\n\n[사주명리] 사주: {SAJU}, 일간: {ILGAN}, 오행: {OHENG}, 십성: {SIPSUNG}\n[서양점성술] 태양 별자리: {SIGN}, 원소: {ELEMENT}, 지배행성: {PLANET}\n[MBTI 추정] 유형: {MBTI}\n\n마크다운으로 제공 (3000자 이상):\n# 🌌 {NAME}님의 동서양 통합 운명 분석\n\n## 🔮 세 체계가 공통으로 말하는 당신의 본질\n\n## ☯ 사주명리가 보는 당신\n\n## ⭐ 서양 점성술이 보는 당신\n\n## 🧠 추정 MBTI: {MBTI}\n\n## 💰 재물운 — 동서양 교차 분석\n## 💕 연애운 — 동서양 교차 분석\n## 💼 직업운 — 동서양 교차 분석\n## 🏥 건강운 — 동서양 교차 분석\n\n## 📅 2026년 통합 운세\n### 봄 (1~3월)\n### 여름 (4~6월)\n### 가을 (7~9월)\n### 겨울 (10~12월)\n\n## 🎯 세 체계가 합의하는 인생 조언 TOP 5`;
const PR_FACE_SAJU=SYS+`\n\n사주 오행 분포를 기반으로 관상학적 외모 경향성과 성격을 추정하세요.\n마크다운:\n# 👤 {NAME}님의 사주 기반 관상 추정\n## 오행 분포로 본 외모 경향\n## 얼굴형 추정\n## 눈·코·입 특징\n## 관상으로 본 성격\n## 관상으로 본 운세 경향\n## ⚠️ 참고사항\n"관상은 참고용이며, 운명은 스스로 만들어가는 것"이라고 반드시 명시.`;
const PR_FACE_PHOTO=`당신은 동양 관상학 전문가입니다. 업로드된 얼굴 사진을 분석하여 관상학적 해석을 제공하세요.\n마크다운:\n# 👤 관상 분석 결과\n## 얼굴형과 기본 성향\n## 이마 — 초년운\n## 눈 — 성격과 감정\n## 코 — 재물과 자존심\n## 입 — 대인관계와 복\n## 귀 — 지혜와 장수\n## 🔮 종합 관상 운세\n## ⚠️ 참고사항\n"관상은 참고용이며, 운명은 스스로 만들어가는 것"이라고 반드시 명시.`;

/* ═══ 신규 프롬프트 — AI 코치들 ═══ */
const PR_RELATIONSHIP=SYS+`\n\n당신은 사주 기반 연애 코칭 전문가입니다. 사주 궁합 데이터를 바탕으로 구체적이고 실용적인 연애 조언을 제공합니다.\n"오늘 상대방 일진이 예민한 날" 같은 구체적 조언을 포함하세요.\n마크다운으로 500자 이내. 따뜻하고 실용적인 어조.`;
const PR_CAREER=SYS+`\n\n당신은 사주 기반 커리어 코칭 전문가입니다. 사주 관운(官運)과 대운 흐름을 기반으로 이직, 연봉 협상, 사업 시작, 승진 등의 타이밍을 구체적으로 조언합니다.\n마크다운으로 500자 이내. 전문적이고 실용적인 어조.`;
const PR_WELLNESS=SYS+`\n\n오행 체질론 기반 건강 가이드를 작성하세요. 과다 오행은 줄이고, 부족 오행은 보충하는 방식입니다.\n\n마크다운으로 제공:\n# 🏥 {NAME}님의 체질 건강 가이드\n## 나의 오행 체질 요약\n## 🍽 추천 식단\n(오행별 식재료 매핑: 木=신맛/채소, 火=쓴맛/곡물, 土=단맛/과일, 金=매운맛/뿌리채소, 水=짠맛/해산물)\n## 🏃 추천 운동\n(木=유연성운동/스트레칭, 火=유산소/러닝, 土=코어/필라테스, 金=고강도/웨이트, 水=수영/명상)\n## 😴 수면 가이드\n(시주 기반 최적 취침/기상 시간)\n## ⚠️ 주의 계절/시기`;

const TAROT=[{kr:"광대",icon:"🃏"},{kr:"마법사",icon:"🪄"},{kr:"여사제",icon:"🌙"},{kr:"여황제",icon:"👑"},{kr:"황제",icon:"🏛"},{kr:"교황",icon:"📿"},{kr:"연인",icon:"💕"},{kr:"전차",icon:"⚡"},{kr:"힘",icon:"🦁"},{kr:"은둔자",icon:"🏔"},{kr:"운명의 수레바퀴",icon:"🎡"},{kr:"정의",icon:"⚖️"},{kr:"매달린 사람",icon:"🔄"},{kr:"죽음",icon:"🦋"},{kr:"절제",icon:"🏺"},{kr:"악마",icon:"🔥"},{kr:"탑",icon:"💥"},{kr:"별",icon:"⭐"},{kr:"달",icon:"🌕"},{kr:"태양",icon:"☀️"},{kr:"심판",icon:"📯"},{kr:"세계",icon:"🌍"}];

/* ═══ DESIGN TOKENS — NUVO AI cosmic dark ═══ */
const T={
  bg:"#0c0b14",surface:"#111020",card:"#15142a",border:"rgba(255,255,255,0.06)",
  purple:"#a78bfa",purple2:"#8b5cf6",pink:"#f472b6",gold:"#fbbf24",green:"#10b981",blue:"#3b82f6",red:"#ef4444",amber:"#f59e0b",
  text:"#f0eeff",sub:"#9891b0",dim:"#4a4560",
};

/* ═══ NUVO AI Components ═══ */
function Md({text}){
  if(!text)return null;
  const f=s=>s.replace(/\*\*(.*?)\*\*/g,'<strong style="color:#f0eeff">$1</strong>').replace(/\*(.*?)\*/g,'<em style="color:#a78bfa">$1</em>');
  return text.split("\n").map((l,i)=>{
    if(l.startsWith("### "))return <h3 key={i} style={{fontSize:14,fontWeight:700,color:T.purple,margin:"16px 0 6px",letterSpacing:"-0.02em",fontFamily:"'SUIT Variable','SUIT',sans-serif"}}>{l.slice(4)}</h3>;
    if(l.startsWith("## "))return <h2 key={i} style={{fontSize:17,fontWeight:700,color:"#fff",margin:"24px 0 8px",letterSpacing:"-0.03em",fontFamily:"'SUIT Variable','SUIT',sans-serif"}}>{l.slice(3)}</h2>;
    if(l.startsWith("# "))return <h1 key={i} style={{fontSize:22,fontWeight:800,color:"#fff",margin:"0 0 12px",letterSpacing:"-0.04em",fontFamily:"'SUIT Variable','SUIT',sans-serif"}}>{l.slice(2)}</h1>;
    if(l.startsWith("---"))return <div key={i} style={{height:1,background:T.border,margin:"20px 0"}}/>;
    if(l.startsWith("- "))return <p key={i} style={{margin:"3px 0 3px 14px",color:T.sub,fontSize:14,lineHeight:1.8}}><span style={{color:T.purple,marginRight:6,fontSize:4,verticalAlign:"middle"}}>●</span><span dangerouslySetInnerHTML={{__html:f(l.slice(2))}}/></p>;
    if(l.match(/^\d+\.\s/))return <p key={i} style={{margin:"3px 0 3px 14px",color:T.sub,fontSize:14,lineHeight:1.8}} dangerouslySetInnerHTML={{__html:f(l)}}/>;
    if(!l.trim())return <div key={i} style={{height:6}}/>;
    return <p key={i} style={{margin:"3px 0",color:T.sub,fontSize:14,lineHeight:1.85}} dangerouslySetInnerHTML={{__html:f(l)}}/>;
  });
}

function Card({children,style,...p}){return <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:20,...style}} {...p}>{children}</div>}
function Pill({children,active,color=T.purple,onClick,style}){return <button onClick={onClick} style={{padding:"8px 16px",borderRadius:50,border:active?`1px solid ${color}`:`1px solid ${T.border}`,background:active?`${color}15`:"transparent",color:active?color:T.dim,fontSize:13,fontWeight:active?600:400,cursor:"pointer",transition:"all .2s",fontFamily:"'SUIT Variable','SUIT',sans-serif",...style}}>{children}</button>}
function Btn({children,primary,color,onClick,style,disabled}){return <button onClick={onClick} disabled={disabled} style={{padding:"14px 28px",borderRadius:50,border:primary?"none":`1px solid ${T.border}`,background:primary?(color||T.purple2):"transparent",color:primary?"#fff":(color||T.sub),fontSize:15,fontWeight:700,cursor:disabled?"not-allowed":"pointer",opacity:disabled?.5:1,letterSpacing:"-0.02em",transition:"all .2s",fontFamily:"'SUIT Variable','SUIT',sans-serif",...style}}>{children}</button>}
function Spin({color=T.purple,size=18}){return <div style={{width:size,height:size,margin:"0 auto",borderRadius:"50%",border:`2px solid ${T.border}`,borderTopColor:color,animation:"spin 1s linear infinite"}}/>}
function Back({onClick}){return <button onClick={onClick} style={{background:"none",border:"none",color:T.dim,cursor:"pointer",fontSize:13,marginBottom:16,fontWeight:500,letterSpacing:"-0.01em",fontFamily:"'SUIT Variable','SUIT',sans-serif"}}>← 돌아가기</button>}
function PageTitle({emoji,title,sub}){return <div style={{textAlign:"center",marginBottom:28}}>{emoji&&<div style={{fontSize:28,marginBottom:8}}>{emoji}</div>}<h2 style={{fontSize:24,fontWeight:800,color:"#fff",letterSpacing:"-0.04em",margin:0,fontFamily:"'SUIT Variable','SUIT',sans-serif"}}>{title}</h2>{sub&&<p style={{fontSize:13,color:T.dim,marginTop:6}}>{sub}</p>}</div>}

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

/* ═══════════════════════════════════════════════════════════════
   MAIN APP — NUVO AI 통합 플랫폼
   ═══════════════════════════════════════════════════════════════ */
export default function NuvoApp(){
  /* ═══ GLOBAL NAV STATE ═══ */
  const[mainTab,setMainTab]=useState("home"); // home | fortune | briefing | my
  const[pg,setPg]=useState("splash"); // 세부 페이지
  const[tab,setTab]=useState("result"); // 결과 페이지 탭

  /* ═══ SAJU STATE ═══ */
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
  const coachRef=useRef(null);
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
  const[pendingAction,setPendingAction]=useState(null);
  const[freeCount,setFreeCount]=useState(0);
  const[limitModal,setLimitModal]=useState(false);
  const FREE_LIMIT=3;

  /* ═══ BRIEFING STATE ═══ */
  const[briefLang,setBriefLang]=useState("kr");
  const[briefCat,setBriefCat]=useState("all");
  const[briefData,setBriefData]=useState(null);
  const[briefLoading,setBriefLoading]=useState(false);
  const[briefSub,setBriefSub]=useState("daily"); // daily | fortune | calendar

  /* ═══ FORTUNE SIGNAL STATE ═══ */
  const[fsData,setFsData]=useState(null);
  const[fsLoading,setFsLoading]=useState(false);

  /* ═══ LUCKY CALENDAR STATE ═══ */
  const[calYear,setCalYear]=useState(2026);
  const[calMonth,setCalMonth]=useState(3);
  const[calDays,setCalDays]=useState([]);
  const[calSelected,setCalSelected]=useState(null);

  /* ═══ COACH STATE ═══ */
  const[coachType,setCoachType]=useState(null); // relationship | career
  const[coachMsgs,setCoachMsgs]=useState([]);
  const[coachLoading,setCoachLoading]=useState(false);

  /* ═══ WELLNESS STATE ═══ */
  const[wellRd,setWellRd]=useState("");
  const[wellLoading,setWellLoading]=useState(false);

  /* ═══ TICKER STATE ═══ */
  const[tickers,setTickers]=useState([]);
  const[tickerLoading,setTickerLoading]=useState(false);
  const tickerRef=useRef(null);

  /* ═══ INVITE STATE ═══ */
  const[inviteCode,setInviteCode]=useState("");
  const[inviteCopied,setInviteCopied]=useState(false);
  const[inviteCount,setInviteCount]=useState(0);
  const[premExpiry,setPremExpiry]=useState(null);

  /* ═══ TELEGRAM STATE ═══ */
  const[tgChatId,setTgChatId]=useState("");
  const[tgSaved,setTgSaved]=useState(false);
  const[tgEnabled,setTgEnabled]=useState(false);
  const tgRef=useRef(null);

  /* ═══ MY TAB STATE ═══ */
  const[appLang,setAppLang]=useState("kr");
  const[history,setHistory]=useState([]);

  /* ═══ SUBSCRIPTION TIER ═══ */
  // "free" | "saju" | "briefing" | "bundle"
  const[subTier,setSubTier]=useState("free");
  const hasSajuSub=subTier==="saju"||subTier==="bundle"||prem;
  const hasBriefSub=subTier==="briefing"||subTier==="bundle"||prem;
  const hasBundleSub=subTier==="bundle"||prem;

  /* ═══ EFFECTS ═══ */
  useEffect(()=>{
    try{
      const data=JSON.parse(localStorage.getItem("nuvo_free")||"{}");
      const today=new Date().toISOString().slice(0,10);
      if(data.date===today){setFreeCount(data.count||0)}
      else{localStorage.setItem("nuvo_free",JSON.stringify({date:today,count:0}));setFreeCount(0)}
    }catch(e){setFreeCount(0)}
    // 히스토리 로드
    try{const h=JSON.parse(localStorage.getItem("nuvo_history")||"[]");setHistory(h)}catch(e){}
    // 초대 코드 생성/로드
    try{
      let code=localStorage.getItem("nuvo_invite_code");
      if(!code){code="NUVO"+Math.random().toString(36).slice(2,8).toUpperCase();localStorage.setItem("nuvo_invite_code",code)}
      setInviteCode(code);
      const cnt=parseInt(localStorage.getItem("nuvo_invite_count")||"0");
      setInviteCount(cnt);
      const exp=localStorage.getItem("nuvo_prem_expiry");
      if(exp){setPremExpiry(exp);if(new Date(exp)>new Date()){setPrem(true)}}
    }catch(e){}
    // Telegram 설정 로드
    try{
      const tg=localStorage.getItem("nuvo_tg_chatid");
      if(tg){setTgChatId(tg);setTgSaved(true);setTgEnabled(true)}
    }catch(e){}
    // 마켓 티커 로드
    fetchTickers();
    const tickerInterval=setInterval(fetchTickers,5*60*1000); // 5분마다
    return()=>clearInterval(tickerInterval);
  },[]);

  // URL 파라미터로 초대 체크
  useEffect(()=>{
    try{
      const params=new URLSearchParams(window.location.search);
      const ref=params.get("ref");
      if(ref&&ref!==inviteCode&&ref.startsWith("NUVO")){
        localStorage.setItem("nuvo_referred_by",ref);
      }
    }catch(e){}
  },[inviteCode]);

  function useFreeCount(){
    try{
      const today=new Date().toISOString().slice(0,10);
      const next=freeCount+1;
      localStorage.setItem("nuvo_free",JSON.stringify({date:today,count:next}));
      setFreeCount(next);
      return true;
    }catch(e){return true}
  }
  function canUseFree(){return prem||hasSajuSub||freeCount<FREE_LIMIT}

  function saveHistory(type,name){
    try{
      const h=[{type,name,date:new Date().toISOString().slice(0,10)},...history].slice(0,20);
      setHistory(h);
      localStorage.setItem("nuvo_history",JSON.stringify(h));
    }catch(e){}
  }

  /* ═══ TICKER FETCH ═══ */
  async function fetchTickers(){
    try{
      setTickerLoading(true);
      // 무료 API: 주요 지수/환율/코인 시세
      const symbols=[
        {name:"KOSPI",url:"https://api.coinpaprika.com/v1/tickers/btc-bitcoin",fallback:true},
      ];
      // CoinPaprika 무료 API로 BTC, ETH + 고정 시세 표시
      const r=await fetch("https://api.coinpaprika.com/v1/tickers?quotes=USD&limit=5");
      const data=await r.json();
      const mapped=data.slice(0,4).map(c=>({
        name:c.symbol,
        price:c.quotes?.USD?.price?.toFixed(c.quotes?.USD?.price>100?0:2)||"—",
        change:c.quotes?.USD?.percent_change_24h?.toFixed(1)||"0",
      }));
      setTickers(mapped);
    }catch(e){
      setTickers([]);
    }finally{setTickerLoading(false)}
  }

  /* ═══ INVITE FUNCTIONS ═══ */
  function copyInviteLink(){
    const link=`https://saju-ai-one.vercel.app?ref=${inviteCode}`;
    navigator.clipboard.writeText(link);
    setInviteCopied(true);
    setTimeout(()=>setInviteCopied(false),2000);
  }
  function grantInviteReward(){
    // 초대 성사 시: 본인에게 프리미엄 3일 부여
    try{
      const now=new Date();
      const existing=premExpiry?new Date(premExpiry):now;
      const base=existing>now?existing:now;
      base.setDate(base.getDate()+3);
      const newExpiry=base.toISOString().slice(0,10);
      localStorage.setItem("nuvo_prem_expiry",newExpiry);
      setPremExpiry(newExpiry);setPrem(true);
      const cnt=inviteCount+1;
      setInviteCount(cnt);
      localStorage.setItem("nuvo_invite_count",String(cnt));
    }catch(e){}
  }

  /* ═══ TELEGRAM FUNCTIONS ═══ */
  function saveTelegram(){
    const val=tgRef.current?.value||tgChatId;
    if(!val.trim())return;
    try{
      setTgChatId(val.trim());
      localStorage.setItem("nuvo_tg_chatid",val.trim());
      setTgSaved(true);setTgEnabled(true);
    }catch(e){}
  }
  function removeTelegram(){
    try{
      localStorage.removeItem("nuvo_tg_chatid");
      setTgChatId("");setTgSaved(false);setTgEnabled(false);
    }catch(e){}
  }
  async function sendTelegramTest(){
    const val=tgRef.current?.value||tgChatId;
    if(!val.trim())return;
    try{
      await fetch("/api/telegram",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chatId:val.trim(),message:"✅ NUVO AI 알림 연결 테스트 성공!\n매일 아침 시장 브리핑을 받아보세요."})});
    }catch(e){}
  }

  const loadMsgs=["사주를 펼칩니다","천간의 기운을 읽습니다","오행을 살핍니다","별자리를 읽습니다","동서양을 융합합니다"];
  useEffect(()=>{if(pg==="splash"){const t=setTimeout(()=>setPg("home"),1800);return()=>clearTimeout(t)}},[pg]);
  useEffect(()=>{if(loading){const t=setInterval(()=>setLi(p=>(p+1)%loadMsgs.length),2200);return()=>clearInterval(t)}},[loading]);
  useEffect(()=>{scrollRef.current?.scrollIntoView({behavior:"smooth"})},[ch,coachMsgs]);

  // 캘린더 일진 계산
  useEffect(()=>{
    if(saju&&briefSub==="calendar"){
      const days=getMonthDays(calYear,calMonth);
      const userDayJi=saju.일주.지;
      const dG=saju.일주.간,dOh=OH_G[dG];
      const mapped=days.map(d=>{
        const rel=getDayRelation(userDayJi,d.지);
        // 재성 체크: 해당일 천간의 오행이 일간이 극하는 오행인지
        const targetOh=OH_G[d.간];
        const hasJae=오행상극[dOh]===targetOh;
        const grade=getInvestGrade(rel,hasJae);
        return{...d,rel,hasJae,grade};
      });
      setCalDays(mapped);
    }
  },[saju,calYear,calMonth,briefSub]);

  const hasSaju=!!saju;
  const INP={width:"100%",padding:"12px 16px",borderRadius:12,border:`1px solid ${T.border}`,background:T.surface,color:T.text,fontSize:15,fontFamily:"'SUIT Variable','SUIT',-apple-system,sans-serif",outline:"none",boxSizing:"border-box",letterSpacing:"-0.01em"};

  const today=new Date();
  const todayStr=`${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`;
  const weekdays=["일","월","화","수","목","금","토"];
  const todayFull=`${todayStr} ${weekdays[today.getDay()]}요일`;

  /* ═══ FORM HELPERS ═══ */
  function readForm(){const n=nameRef.current?.value||"",y=yearRef.current?.value||"",q=questionRef.current?.value||"";setSavedName(n);setSavedYear(y);return{name:n,year:y,question:q}}
  function readForm2(){const n=name2Ref.current?.value||"",y=year2Ref.current?.value||"";setSavedName2(n);setSavedYear2(y);return{name:n,year:y}}
  function buildUserMsg(name,year){
    return`이름:${name||"회원"}\n성별:${gender}\n생년월일:${year}년 ${month}월 ${day}일\n${sijin?`시:${시진표.find(x=>x.지===sijin)?.설명||""}`:""}\n사주:${sStr(saju)}\n일간:${saju.일주.간}(${OH_G[saju.일주.간]})\n오행:${Object.entries(oh||{}).map(([k,v])=>`${OHK[k]}:${v}`).join(",")}\n띠:${DDI[saju.년주.지]}\n나이:만${2026-(+year)}세`;
  }

  /* ═══ SAJU HANDLERS ═══ */
  async function run(m){
    if(m==="basic"&&!prem&&!hasSajuSub){
      if(!canUseFree()){setLimitModal(true);return}
      useFreeCount();
    }
    const{name,year,question}=readForm();if(!year||!month||!day||!gender)return;
    const h=hourFromSijin(sijin),s=mkSaju(+year,+month,+day,h),o=cntOH(s);
    setSaju(s);setOh(o);setMode(m);
    const z=getZodiac(+month,+day);setZodiac(z);const mb=estimateMBTI(o,s);setMbti(mb);
    // 스트리밍: 로딩 화면 대신 결과 페이지로 바로 이동, 텍스트가 실시간 표시
    setRd("분석 중...");goFortuneSub("result");setTab("result");setLoading(true);
    const u=buildUserMsg(name,year)+(question?`\n질문:${question}`:"");
    const sys=(m==="premium"?PR_PREMIUM:PR_BASIC).replace("{NAME}",name||"회원");
    const text=await callAI(sys,[{role:"user",content:u}],m==="premium"?4000:3000,(chunk)=>{setRd(chunk)});
    setRd(text);setCh([{role:"assistant",content:text}]);setLoading(false);
    saveHistory(m==="premium"?"프리미엄 분석":"기본 분석",name);
    if(pendingAction){
      const action=pendingAction;setPendingAction(null);
      if(action==="astro"){doAstro();return}
      if(action==="integrated"){doIntegrated();return}
      if(action==="mbti"){goFortuneSub("mbtiResult");return}
      if(action==="face"){goFortuneSub("faceMenu");return}
    }
  }

  async function runCompat(){
    const f1=readForm(),f2=readForm2();if(!f1.year||!month||!day||!f2.year||!month2||!day2)return;
    const s1=mkSaju(+f1.year,+month,+day,hourFromSijin(sijin)),s2=mkSaju(+f2.year,+month2,+day2,hourFromSijin(sijin2));
    setSaju(s1);setSaju2(s2);setOh(cntOH(s1));setOh2(cntOH(s2));setZodiac(getZodiac(+month,+day));setMbti(estimateMBTI(cntOH(s1),s1));
    setMode("compat");setRd("궁합 분석 중...");goFortuneSub("result");setTab("result");setLoading(true);
    const sys=PR_COMPAT.replace("{N1}",f1.name||"A").replace("{N2}",f2.name||"B");
    const u=`[A] ${f1.name||"A"},${gender},사주:${sStr(s1)}\n[B] ${f2.name||"B"},${gender2},사주:${sStr(s2)}`;
    const text=await callAI(sys,[{role:"user",content:u}],4000,(chunk)=>{setRd(chunk)});
    setRd(text);setCh([{role:"assistant",content:text}]);setLoading(false);
    saveHistory("궁합 분석",`${f1.name}♥${f2.name}`);
  }

  async function doChat(){
    if(!prem&&!hasSajuSub){setLimitModal(true);return}
    const val=chatRef.current?.value||"";if(!val.trim()||chatLoading)return;
    const msg=val.trim();chatRef.current.value="";
    setCh(p=>[...p,{role:"user",content:msg}]);setChatLoading(true);
    const msgs=[...ch,{role:"user",content:msg}].map(m=>({role:m.role,content:m.content}));
    let partial="";
    setCh(p=>[...p,{role:"assistant",content:"..."}]);
    const text=await callAI(`${SYS}\n사주:${saju?sStr(saju):""} 기반 답변. 마크다운. 500자 이내.`,msgs,2000,(c)=>{
      partial=c;setCh(p=>{const n=[...p];n[n.length-1]={role:"assistant",content:c};return n});
    });
    setCh(p=>{const n=[...p];n[n.length-1]={role:"assistant",content:text};return n});setChatLoading(false);
  }

  async function doDaily(){if(!saju||dailyLoading)return;setDailyLoading(true);setDailyRd("오늘의 운세를 읽고 있어요...");const u=`사주:${sStr(saju)}\n일간:${saju.일주.간}\n오행:${Object.entries(oh||{}).map(([k,v])=>`${OHK[k]}${v}`).join(" ")}\n이름:${savedName||"회원"}\n오늘:${todayFull}\n오늘 일진:${(()=>{const dc=calcD(today.getFullYear(),today.getMonth()+1,today.getDate());return GK[dc.간]+JK[dc.지]})()}`;const text=await callAI(PR_DAILY,[{role:"user",content:u}],2000,(c)=>{setDailyRd(c)});setDailyRd(text);setDailyLoading(false)}

  async function doCat(cat){
    if(!saju)return;
    if(!prem&&!hasSajuSub){if(!canUseFree()){setLimitModal(true);return}useFreeCount()}
    setCatLoading(true);setCatName(cat.label);setCatRd("분석 중...");goFortuneSub("category");
    const u=`사주:${sStr(saju)}\n일간:${saju.일주.간}\n오행:${Object.entries(oh||{}).map(([k,v])=>`${OHK[k]}${v}`).join(" ")}\n이름:${savedName||"회원"}\n성별:${gender}\n${cat.label} 상세 분석`;
    const text=await callAI(PR_CAT.replace("{CAT}",cat.label),[{role:"user",content:u}],2500,(c)=>{setCatRd(c)});
    setCatRd(text);setCatLoading(false);
  }

  function doTarot(){const picked=[...TAROT].sort(()=>Math.random()-.5).slice(0,3);setTCards(picked);setTFlip([false,false,false]);setTRd("");goFortuneSub("tarot")}
  function flipTarot(i){if(tFlip[i])return;const nf=[...tFlip];nf[i]=true;setTFlip(nf);if(nf.every(Boolean)&&saju){setTLoading(true);setTRd("타로를 해석 중...");const u=`사주:${sStr(saju)}\n카드:\n과거:${tCards[0].kr}\n현재:${tCards[1].kr}\n미래:${tCards[2].kr}`;const sys=PR_TAROT.replace("{C1}",tCards[0].kr).replace("{C2}",tCards[1].kr).replace("{C3}",tCards[2].kr);callAI(sys,[{role:"user",content:u}],2000,(c)=>{setTRd(c)}).then(t=>{setTRd(t);setTLoading(false)})}}

  async function doAstro(){if(!saju||!zodiac)return;setAstroLoading(true);setAstroRd("별자리를 읽고 있어요...");goFortuneSub("astro");const sys=PR_ASTRO.replace("{SYMBOL}",zodiac.symbol).replace("{SIGN}",zodiac.sign);const u=`이름:${savedName||"회원"}\n태양 별자리:${zodiac.sign}(${zodiac.en})\n원소:${zodiac.element}\n지배행성:${zodiac.planet}\n특성:${zodiac.traits}\n사주 일간:${saju.일주.간}(${OH_G[saju.일주.간]})\n오행:${Object.entries(oh||{}).map(([k,v])=>`${OHK[k]}${v}`).join(" ")}`;const text=await callAI(sys,[{role:"user",content:u}],2500,(c)=>{setAstroRd(c)});setAstroRd(text);setAstroLoading(false)}

  async function doIntegrated(){if(!saju||!zodiac||!mbti)return;setIntLoading(true);setIntRd("세 체계를 융합 분석 중...");goFortuneSub("integrated");const dG=saju.일주.간,dOh=OH_G[dG],dYY=음양간[dG];const ssList=[];[saju.년주,saju.월주,saju.시주].filter(Boolean).forEach(p=>{ssList.push(get십성(dOh,dYY,OH_G[p.간],음양간[p.간]))});const sys=PR_INTEGRATED.replace("{SAJU}",sStr(saju)).replace("{ILGAN}",`${saju.일주.간}(${dOh})`).replace("{OHENG}",Object.entries(oh||{}).map(([k,v])=>`${OHK[k]}${v}`).join(" ")).replace("{SIPSUNG}",ssList.join(",")).replace("{SIGN}",zodiac.sign).replace("{ELEMENT}",zodiac.element).replace("{PLANET}",zodiac.planet).replaceAll("{MBTI}",mbti).replace("{NAME}",savedName||"회원");const u=`이름:${savedName||"회원"}\n성별:${gender}\n생년월일:${savedYear}년${month}월${day}일\n사주:${sStr(saju)}\n별자리:${zodiac.sign}(${zodiac.en}) ${zodiac.symbol}\nMBTI추정:${mbti}\n오행:${Object.entries(oh||{}).map(([k,v])=>`${OHK[k]}${v}`).join(" ")}`;const text=await callAI(sys,[{role:"user",content:u}],4000,(c)=>{setIntRd(c)});setIntRd(text);setIntLoading(false)}

  async function doFaceSaju(){if(!saju)return;setFaceLoading(true);setFaceMode("saju");setFaceRd("관상을 읽고 있어요...");goFortuneSub("face");const u=`이름:${savedName||"회원"}\n사주:${sStr(saju)}\n일간:${saju.일주.간}(${OH_G[saju.일주.간]})\n오행:${Object.entries(oh||{}).map(([k,v])=>`${OHK[k]}${v}`).join(" ")}\n성별:${gender}`;const text=await callAI(PR_FACE_SAJU.replace("{NAME}",savedName||"회원"),[{role:"user",content:u}],2500,(c)=>{setFaceRd(c)});setFaceRd(text);setFaceLoading(false)}
  async function doFacePhoto(){if(!facePhoto)return;setFaceLoading(true);setFaceMode("photo");setFaceRd("사진 관상을 분석 중...");goFortuneSub("face");try{const sajuInfo=saju?`\n사주:${sStr(saju)}\n일간:${saju.일주.간}(${OH_G[saju.일주.간]})\n오행:${Object.entries(oh||{}).map(([k,v])=>`${OHK[k]}${v}`).join(" ")}`:"";const r=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:3000,system:PR_FACE_PHOTO,messages:[{role:"user",content:[{type:"image",source:{type:"base64",media_type:"image/jpeg",data:facePhoto}},{type:"text",text:`이름:${savedName||"회원"}\n성별:${gender}${sajuInfo}\n\n위 사진의 관상을 분석해주세요.`}]}]})});const d=await r.json();setFaceRd(d.content?.map(b=>b.type==="text"?b.text:"").join("")||"분석 실패")}catch(e){setFaceRd("사진 분석 중 오류가 발생했습니다.")}setFaceLoading(false)}
  function handlePhotoUpload(e){const file=e.target.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=()=>setFacePhoto(reader.result.split(",")[1]);reader.readAsDataURL(file)}

  /* ═══ COACH HANDLERS ═══ */
  async function startCoach(type){
    setCoachType(type);setCoachMsgs([]);goFortuneSub("coach");
  }
  async function sendCoachMsg(msg){
    if(!msg?.trim()||coachLoading)return;
    const userMsg={role:"user",content:msg.trim()};
    setCoachMsgs(p=>[...p,userMsg,{role:"assistant",content:"..."}]);setCoachLoading(true);
    if(coachRef.current)coachRef.current.value="";
    const sys=coachType==="relationship"?PR_RELATIONSHIP:PR_CAREER;
    const sajuCtx=saju?`사주:${sStr(saju)}\n일간:${saju.일주.간}\n오행:${Object.entries(oh||{}).map(([k,v])=>`${OHK[k]}${v}`).join(" ")}\n이름:${savedName||"회원"}\n성별:${gender}`:"";
    const allMsgs=[{role:"user",content:sajuCtx},...coachMsgs,userMsg].map(m=>({role:m.role,content:m.content}));
    const text=await callAI(sys,allMsgs,2000,(c)=>{
      setCoachMsgs(p=>{const n=[...p];n[n.length-1]={role:"assistant",content:c};return n});
    });
    setCoachMsgs(p=>{const n=[...p];n[n.length-1]={role:"assistant",content:text};return n});setCoachLoading(false);
  }

  /* ═══ WELLNESS HANDLER ═══ */
  async function doWellness(){
    if(!saju)return;setWellLoading(true);setWellRd("체질을 분석 중...");goFortuneSub("wellness");
    const u=`이름:${savedName||"회원"}\n사주:${sStr(saju)}\n일간:${saju.일주.간}\n오행:${Object.entries(oh||{}).map(([k,v])=>`${OHK[k]}${v}`).join(" ")}\n${sijin?`시주:${saju.시주?.간}${saju.시주?.지}`:""}\n성별:${gender}`;
    const text=await callAI(PR_WELLNESS.replace("{NAME}",savedName||"회원"),[{role:"user",content:u}],3000,(c)=>{setWellRd(c)});
    setWellRd(text);setWellLoading(false);
  }

  /* ═══ BRIEFING HANDLERS ═══ */
  async function loadBriefing(){
    setBriefLoading(true);
    const data=await fetchBriefing(briefLang,briefCat);
    setBriefData(data);setBriefLoading(false);
  }

  /* ═══ NAV HELPERS ═══ */
  function goHome(){setMainTab("home");setPg("home")}
  function goFortune(){setMainTab("fortune");setPg("fortuneHub")}
  function goFortuneSub(sub){setMainTab("fortune");setPg(sub)}
  function goBriefing(){setMainTab("briefing");setPg("briefingHub");setBriefSub("daily")}

  // 브리핑 탭 진입 시 자동 로드
  useEffect(()=>{
    if(pg==="briefingHub"&&briefSub==="daily"&&!briefData&&!briefLoading){
      loadBriefing();
    }
  },[pg,briefSub]);
  function goCoach(){setMainTab("coach");setPg("coachHub")}
  function goMy(){setMainTab("my");setPg("myPage")}
  function resetAll(){setPg("home");setMainTab("home");setRd("");setCh([]);setSaju2(null);setTab("result")}

  /* ═══ RENDER ═══ */
  const wrap={maxWidth:480,margin:"0 auto",padding:"0 20px",position:"relative",zIndex:1,width:"100%"};
  const page={...wrap,paddingTop:24,paddingBottom:100,animation:"fadeIn .4s ease"};

  return (
    <div style={{fontFamily:"'SUIT Variable','SUIT',-apple-system,BlinkMacSystemFont,sans-serif",background:T.bg,minHeight:"100vh",color:T.text,position:"relative",overflow:"hidden",paddingBottom:72,letterSpacing:"-0.02em",maxWidth:480,width:"100%",margin:"0 auto",boxShadow:"0 0 80px rgba(139,92,246,0.05)"}}>
      <link href="https://cdn.jsdelivr.net/gh/sunn-us/SUIT/fonts/variable/woff2/SUIT-Variable.css" rel="stylesheet"/>
      <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet"/>
      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:.15}50%{opacity:.7}}
        @keyframes splashFade{0%{opacity:0;transform:scale(.95)}20%{opacity:1;transform:scale(1)}80%{opacity:1}100%{opacity:0}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes glow{0%,100%{opacity:.08}50%{opacity:.15}}
        ::placeholder{color:${T.dim}}
        select{appearance:none}
        button{transition:all .2s;font-family:'SUIT Variable','SUIT',-apple-system,sans-serif}
        *::-webkit-scrollbar{display:none}
        @media(min-width:481px){
          body{display:flex;justify-content:center;background:#050510}
        }
      `}</style>

      {/* ═══ AMBIENT ORBS ═══ */}
      <div style={{position:"fixed",top:"-20%",right:"-10%",width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,rgba(139,92,246,0.12),transparent 70%)",filter:"blur(130px)",pointerEvents:"none",animation:"glow 6s ease infinite"}}/>
      <div style={{position:"fixed",bottom:"-10%",left:"-15%",width:250,height:250,borderRadius:"50%",background:"radial-gradient(circle,rgba(139,92,246,0.08),transparent 70%)",filter:"blur(130px)",pointerEvents:"none",animation:"glow 8s ease 2s infinite"}}/>

      {/* ═══ SPLASH ═══ */}
      {pg==="splash"&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",animation:"splashFade 1.8s ease forwards"}}>
        <div style={{fontSize:12,letterSpacing:".15em",color:T.purple,fontWeight:700,textTransform:"uppercase",fontFamily:"'Geist',sans-serif"}}>NUVO AI</div>
        <h1 style={{fontSize:32,fontWeight:800,color:"#fff",margin:"8px 0 0",letterSpacing:"-0.04em"}}>사주명리</h1>
        <p style={{fontSize:13,color:T.dim,marginTop:6}}>사주 × AI × 시장 시그널</p>
      </div>}

      {/* ═══ PAYWALL MODAL ═══ */}
      {pw&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",backdropFilter:"blur(12px)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setPw(false)}>
        <Card style={{maxWidth:360,width:"100%",textAlign:"center",padding:"32px 24px"}} onClick={e=>e.stopPropagation()}>
          <div style={{fontSize:28,marginBottom:10}}>✦</div>
          <h2 style={{fontSize:22,fontWeight:800,color:"#fff",margin:"0 0 6px",letterSpacing:"-0.03em"}}>NUVO PREMIUM</h2>
          <p style={{fontSize:13,color:T.dim,margin:"0 0 20px"}}>사주 × 시장의 모든 인사이트</p>
          <div style={{textAlign:"left",marginBottom:20}}>{["무제한 사주·점성술 분석","동서양 통합 리포트","AI 사진 관상 분석","Fortune × Signal","Lucky Timing Calendar","AI 연애/커리어/건강 코치","무제한 브리핑 + 알림"].map((f,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,fontSize:14,color:T.sub}}><span style={{color:T.green,fontSize:12}}>✓</span>{f}</div>)}</div>
          <div style={{marginBottom:20}}><span style={{fontSize:32,fontWeight:800,color:"#fff"}}>₩14,900</span><span style={{fontSize:13,color:T.dim}}>/월</span></div>
          <Btn primary onClick={()=>{setPrem(true);setSubTier("bundle");setPw(false)}} style={{width:"100%",borderRadius:14}}>번들 구독 시작하기</Btn>
          <button onClick={()=>setPw(false)} style={{background:"none",border:"none",color:T.dim,fontSize:12,cursor:"pointer",marginTop:12}}>다음에</button>
        </Card>
      </div>}

      {/* ═══ FREE LIMIT MODAL ═══ */}
      {limitModal&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",backdropFilter:"blur(12px)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setLimitModal(false)}>
        <Card style={{maxWidth:360,width:"100%",textAlign:"center",padding:"32px 24px"}} onClick={e=>e.stopPropagation()}>
          <div style={{fontSize:28,marginBottom:10}}>🔒</div>
          <h2 style={{fontSize:20,fontWeight:800,color:"#fff",margin:"0 0 8px",letterSpacing:"-0.03em"}}>오늘의 무료 분석을 모두 사용했어요</h2>
          <p style={{fontSize:13,color:T.sub,margin:"0 0 20px",lineHeight:1.6}}>하루 {FREE_LIMIT}회 무료 분석이 제공됩니다.</p>
          <Btn primary onClick={()=>{setPrem(true);setSubTier("bundle");setLimitModal(false)}} style={{width:"100%",borderRadius:14,marginBottom:8}}>프리미엄 시작하기</Btn>
          <p style={{fontSize:11,color:T.dim,margin:0}}>내일 자정에 무료 횟수가 초기화됩니다</p>
        </Card>
      </div>}

      {/* ═══ LOADING ═══ */}
      {pg==="loading"&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",gap:20}}>
        <Spin size={32}/><p style={{fontSize:15,fontWeight:600,color:"#fff"}}>{loadMsgs[li]}</p>
        <div style={{display:"flex",gap:4}}>{[0,1,2].map(i=><div key={i} style={{width:3,height:3,borderRadius:"50%",background:T.purple,animation:`pulse 1.5s ease ${i*.3}s infinite`}}/>)}</div>
      </div>}

      {/* ═══════════════════════════════════════
           TAB 1: 🏠 HOME — Destiny Dashboard
         ═══════════════════════════════════════ */}
      {pg==="home"&&<div style={{...wrap,paddingTop:20,paddingBottom:100,position:"relative",zIndex:1}}>

        {/* ─── 사주 미입력: 몰입형 히어로 ─── */}
        {!hasSaju&&<div style={{minHeight:"calc(100vh - 150px)",display:"flex",flexDirection:"column",justifyContent:"center",textAlign:"center",padding:"40px 0"}}>
          {/* Floating Oheng Particles */}
          <div style={{position:"relative",height:120,marginBottom:24}}>
            {[{oh:"木",c:OHC.목,x:20,y:10,s:40,d:0},{oh:"火",c:OHC.화,x:75,y:5,s:36,d:.5},{oh:"土",c:OHC.토,x:50,y:50,s:44,d:1},{oh:"金",c:OHC.금,x:15,y:60,s:32,d:1.5},{oh:"水",c:OHC.수,x:80,y:55,s:38,d:2}].map((o,i)=><div key={i} style={{position:"absolute",left:`${o.x}%`,top:`${o.y}%`,width:o.s,height:o.s,borderRadius:"50%",background:`radial-gradient(circle,${o.c}40,${o.c}10)`,border:`1px solid ${o.c}30`,display:"flex",alignItems:"center",justifyContent:"center",animation:`float 3s ease ${o.d}s infinite`,fontSize:12,fontWeight:700,color:o.c,fontFamily:"'Geist',sans-serif"}}>{o.oh}</div>)}
          </div>
          <div style={{fontSize:12,letterSpacing:".15em",color:T.purple,fontWeight:700,fontFamily:"'Geist',sans-serif",marginBottom:8}}>NUVO AI</div>
          <h1 style={{fontSize:32,fontWeight:800,color:"#fff",letterSpacing:"-0.04em",lineHeight:1.15,marginBottom:12}}>당신의 운명을<br/><span style={{background:"linear-gradient(135deg,#8b5cf6,#3b82f6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>AI가 읽습니다</span></h1>
          <p style={{fontSize:14,color:T.sub,lineHeight:1.6,marginBottom:28}}>사주 × 점성술 × MBTI 교차분석<br/>+ AI 시장 브리핑 + 맞춤 투자 시그널</p>
          <Btn primary onClick={()=>goFortuneSub("input")} style={{padding:"16px 44px",fontSize:16,margin:"0 auto"}}>무료 사주 분석 →</Btn>
          <p style={{fontSize:11,color:T.dim,marginTop:12}}>30초 만에 완료 · 결제 없이 시작</p>

          {/* 기능 쇼케이스 — 가로 스와이프 */}
          <div style={{marginTop:36,overflowX:"auto",display:"flex",gap:10,paddingBottom:8,scrollbarWidth:"none",msOverflowStyle:"none",WebkitOverflowScrolling:"touch"}}>
            {[
              {emoji:"🔮",title:"사주명리",desc:"만세력 기반 AI 분석\n2000자+ 상세 풀이",bg:"rgba(139,92,246,0.1)",bc:"rgba(139,92,246,0.2)",fn:()=>goFortuneSub("input")},
              {emoji:"📡",title:"AI 브리핑",desc:"실시간 뉴스 수집\n연쇄영향 4단계 예측",bg:"rgba(59,130,246,0.1)",bc:"rgba(59,130,246,0.2)",fn:()=>goBriefing()},
              {emoji:"📈",title:"Fortune Signal",desc:"오행 × 시장 데이터\n맞춤 ETF 시그널",bg:"rgba(16,185,129,0.1)",bc:"rgba(16,185,129,0.2)",fn:()=>goFortuneSub("input")},
              {emoji:"💕",title:"AI 코치",desc:"연애·커리어·건강\n사주 기반 맞춤 상담",bg:"rgba(244,114,182,0.1)",bc:"rgba(244,114,182,0.2)",fn:()=>goCoach()},
              {emoji:"📅",title:"Lucky Calendar",desc:"일진 기반 투자 등급\nA+~D 월간 캘린더",bg:"rgba(245,158,11,0.1)",bc:"rgba(245,158,11,0.2)",fn:()=>goFortuneSub("input")},
            ].map((f,i)=><div key={i} onClick={f.fn} style={{minWidth:160,padding:"20px 16px",borderRadius:16,background:f.bg,border:`1px solid ${f.bc}`,textAlign:"left",flexShrink:0,cursor:"pointer",transition:"all .2s"}}>
              <div style={{fontSize:28,marginBottom:10}}>{f.emoji}</div>
              <div style={{fontSize:14,fontWeight:700,color:"#fff",marginBottom:6}}>{f.title}</div>
              <div style={{fontSize:11,color:T.sub,lineHeight:1.5,whiteSpace:"pre-line"}}>{f.desc}</div>
            </div>)}
          </div>
        </div>}

        {/* ─── 사주 입력 후: 운명 대시보드 ─── */}
        {hasSaju&&<div>
          {/* Header */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <div>
              <div style={{fontSize:11,letterSpacing:".12em",color:T.purple,fontWeight:700,fontFamily:"'Geist',sans-serif"}}>NUVO AI</div>
              <h1 style={{fontSize:24,fontWeight:800,color:"#fff",margin:"2px 0 0",letterSpacing:"-0.04em"}}>{savedName||"나"}의 대시보드</h1>
            </div>
            {prem?<div style={{padding:"5px 12px",borderRadius:50,background:`${T.purple}12`,border:`1px solid ${T.purple}20`}}>
              <span style={{fontSize:10,color:T.purple,fontWeight:700}}>✦ PREMIUM</span>
            </div>:<div style={{padding:"5px 12px",borderRadius:50,background:T.surface,border:`1px solid ${T.border}`}}>
              <span style={{fontSize:10,color:freeCount>=FREE_LIMIT?T.pink:T.sub}}>무료 {FREE_LIMIT-freeCount}회</span>
            </div>}
          </div>

          {/* 오행 오브 시각화 + 에너지 스코어 */}
          <Card style={{marginBottom:14,padding:"20px 18px",background:"linear-gradient(135deg,rgba(139,92,246,0.06),rgba(59,130,246,0.03))"}}>
            <div style={{display:"flex",alignItems:"center",gap:16}}>
              {/* 오행 오브 */}
              <div style={{position:"relative",width:100,height:100,flexShrink:0}}>
                {oh&&Object.entries(oh).map(([k,v],i)=>{
                  const total=Object.values(oh).reduce((a,b)=>a+b,0)||1;
                  const size=Math.max(20,16+v/total*60);
                  const positions=[{x:30,y:5},{x:60,y:15},{x:15,y:45},{x:55,y:50},{x:35,y:70}];
                  const p=positions[i];
                  return <div key={k} style={{position:"absolute",left:p.x,top:p.y,width:size,height:size,borderRadius:"50%",background:`radial-gradient(circle,${OHC[k]}50,${OHC[k]}15)`,border:`1.5px solid ${OHC[k]}60`,display:"flex",alignItems:"center",justifyContent:"center",animation:`float ${3+i*0.4}s ease ${i*0.3}s infinite`,boxShadow:`0 0 ${size/2}px ${OHC[k]}20`}}>
                    <span style={{fontSize:size>30?11:9,fontWeight:700,color:OHC[k],fontFamily:"'Geist',sans-serif"}}>{OHK[k]}{v}</span>
                  </div>;
                })}
              </div>
              {/* 오늘의 에너지 */}
              <div style={{flex:1}}>
                {(()=>{
                  const dc=calcD(today.getFullYear(),today.getMonth()+1,today.getDate());
                  const rel=getDayRelation(saju.일주.지,dc.지);
                  const hasJae=오행상극[OH_G[saju.일주.간]]===OH_G[dc.간];
                  const grade=getInvestGrade(rel,hasJae);
                  return <div>
                    <div style={{fontSize:10,color:T.dim,marginBottom:4}}>오늘의 에너지</div>
                    <div style={{display:"flex",alignItems:"baseline",gap:8}}>
                      <span style={{fontSize:36,fontWeight:800,color:GRADE_COLOR[grade],fontFamily:"'Geist',sans-serif",lineHeight:1}}>{grade}</span>
                      <div>
                        <div style={{fontSize:12,fontWeight:600,color:"#fff"}}>{todayFull}</div>
                        <div style={{fontSize:10,color:T.dim}}>{GK[dc.간]}{JK[dc.지]}일 · {rel}{hasJae?" · 💰 재성":"" }</div>
                      </div>
                    </div>
                    <div style={{marginTop:8,fontSize:11,color:T.sub,lineHeight:1.5}}>
                      {grade==="A+"||grade==="A"?"오늘은 에너지가 좋은 날이에요. 적극적으로 움직여보세요.":grade==="B"?"평온한 하루가 예상돼요. 기존 계획을 이어가세요.":"오늘은 신중하게 판단하는 게 좋겠어요."}
                    </div>
                  </div>;
                })()}
              </div>
            </div>
            {/* 프로필 태그 */}
            {zodiac&&mbti&&<div style={{display:"flex",gap:5,marginTop:14,flexWrap:"wrap"}}>
              <span style={{fontSize:10,padding:"3px 10px",borderRadius:50,background:`${T.purple}12`,border:`1px solid ${T.purple}20`,color:T.purple}}>{DDI_E[saju.년주.지]} {DDI[saju.년주.지]}띠</span>
              <span style={{fontSize:10,padding:"3px 10px",borderRadius:50,background:`${ELEM_COLOR[zodiac.element]}12`,border:`1px solid ${ELEM_COLOR[zodiac.element]}20`,color:ELEM_COLOR[zodiac.element]}}>{zodiac.symbol} {zodiac.sign}</span>
              <span style={{fontSize:10,padding:"3px 10px",borderRadius:50,background:`${T.green}12`,border:`1px solid ${T.green}20`,color:T.green}}>🧠 {mbti}</span>
            </div>}
          </Card>

          {/* 오늘의 운세 CTA */}
          <Card style={{marginBottom:14,cursor:"pointer",padding:"16px 18px",background:"linear-gradient(135deg,rgba(139,92,246,0.08),rgba(16,185,129,0.04))",border:"1px solid rgba(139,92,246,0.15)"}} onClick={()=>{if(!dailyRd)doDaily();goFortuneSub("daily")}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}><span style={{fontSize:22,animation:"float 3s ease infinite"}}>✨</span><div style={{flex:1}}><div style={{fontSize:15,fontWeight:700,color:"#fff"}}>오늘의 상세 운세 보기</div><div style={{fontSize:11,color:T.sub,marginTop:2}}>시간대별 운세 + 행운 포인트</div></div><span style={{color:T.purple,fontSize:14}}>→</span></div>
          </Card>

          {/* 주제별 운세 6그리드 */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:14}}>
            {[{emoji:"💰",label:"재물운",c:T.gold},{emoji:"💕",label:"연애운",c:T.pink},{emoji:"💼",label:"직업운",c:T.purple},{emoji:"🏥",label:"건강운",c:T.green},{emoji:"📚",label:"학업운",c:T.blue},{emoji:"🍀",label:"행운",c:T.amber}].map(cat=><div key={cat.label} onClick={()=>doCat(cat)} style={{cursor:"pointer",background:`${cat.c}08`,border:`1px solid ${cat.c}15`,borderRadius:12,padding:"14px 8px",textAlign:"center"}}><div style={{fontSize:22,marginBottom:3}}>{cat.emoji}</div><div style={{fontSize:11,fontWeight:600,color:T.text}}>{cat.label}</div></div>)}
          </div>

          {/* 시장 인사이트 — 가로 스와이프 3장 */}
          <div style={{fontSize:12,color:T.dim,fontWeight:600,marginBottom:8,paddingLeft:4}}>시장 인사이트</div>
          <div style={{display:"flex",gap:10,overflowX:"auto",marginBottom:14,paddingBottom:4,scrollbarWidth:"none",msOverflowStyle:"none",WebkitOverflowScrolling:"touch"}}>
            <div onClick={()=>goBriefing()} style={{minWidth:200,cursor:"pointer",padding:"20px 18px",borderRadius:16,background:"linear-gradient(135deg,rgba(59,130,246,0.12),rgba(139,92,246,0.06))",border:"1px solid rgba(59,130,246,0.2)",flexShrink:0}}>
              <div style={{fontSize:26,marginBottom:8}}>📡</div>
              <div style={{fontSize:14,fontWeight:700,color:"#fff",marginBottom:4}}>AI 브리핑</div>
              <div style={{fontSize:11,color:T.sub,lineHeight:1.5}}>실시간 뉴스 분석<br/>연쇄영향 4단계 예측</div>
              <span style={{display:"inline-block",marginTop:8,padding:"3px 10px",borderRadius:50,background:"rgba(59,130,246,0.15)",color:T.blue,fontSize:9,fontWeight:700}}>NEW</span>
            </div>
            <div onClick={()=>{setMainTab("briefing");setPg("briefingHub");setBriefSub("fortune")}} style={{minWidth:200,cursor:"pointer",padding:"20px 18px",borderRadius:16,background:"linear-gradient(135deg,rgba(16,185,129,0.12),rgba(139,92,246,0.06))",border:"1px solid rgba(16,185,129,0.2)",flexShrink:0}}>
              <div style={{fontSize:26,marginBottom:8}}>📈</div>
              <div style={{fontSize:14,fontWeight:700,color:"#fff",marginBottom:4}}>Fortune Signal</div>
              <div style={{fontSize:11,color:T.sub,lineHeight:1.5}}>오행 × 시장 데이터<br/>맞춤 ETF 시그널</div>
              <span style={{display:"inline-block",marginTop:8,padding:"3px 10px",borderRadius:50,background:"rgba(16,185,129,0.15)",color:T.green,fontSize:9,fontWeight:700}}>BUNDLE</span>
            </div>
            <div onClick={()=>{setMainTab("briefing");setPg("briefingHub");setBriefSub("calendar")}} style={{minWidth:200,cursor:"pointer",padding:"20px 18px",borderRadius:16,background:"linear-gradient(135deg,rgba(245,158,11,0.12),rgba(139,92,246,0.06))",border:"1px solid rgba(245,158,11,0.2)",flexShrink:0}}>
              <div style={{fontSize:26,marginBottom:8}}>📅</div>
              <div style={{fontSize:14,fontWeight:700,color:"#fff",marginBottom:4}}>Lucky Calendar</div>
              <div style={{fontSize:11,color:T.sub,lineHeight:1.5}}>일진 기반 투자 등급<br/>A+~D 월간 캘린더</div>
              <span style={{display:"inline-block",marginTop:8,padding:"3px 10px",borderRadius:50,background:"rgba(245,158,11,0.15)",color:T.amber,fontSize:9,fontWeight:700}}>BUNDLE</span>
            </div>
          </div>

          {/* 사주·운세 도구 — 4열 그리드 */}
          <div style={{fontSize:12,color:T.dim,fontWeight:600,marginBottom:8,paddingLeft:4}}>사주 · 운세</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:14}}>
            {[
              {emoji:"🔮",label:"사주",fn:()=>goFortuneSub("input")},
              {emoji:"⭐",label:"점성술",fn:doAstro},
              {emoji:"🌌",label:"통합분석",fn:()=>{if(prem)doIntegrated();else setPw(true)}},
              {emoji:"💫",label:"궁합",fn:()=>goFortuneSub("compat")},
              {emoji:"🎴",label:"타로",fn:doTarot},
              {emoji:"👤",label:"관상",fn:()=>goFortuneSub("faceMenu")},
              {emoji:"🧠",label:"MBTI",fn:()=>goFortuneSub("mbtiResult")},
              {emoji:"📜",label:"결과보기",fn:()=>{if(rd)goFortuneSub("result");else goFortuneSub("input")}},
            ].map((item,i)=><div key={i} onClick={item.fn} style={{cursor:"pointer",padding:"14px 4px",borderRadius:12,background:T.card,border:`1px solid ${T.border}`,textAlign:"center",transition:"all .2s"}}>
              <div style={{fontSize:20,marginBottom:3}}>{item.emoji}</div>
              <div style={{fontSize:10,fontWeight:600,color:T.sub}}>{item.label}</div>
            </div>)}
          </div>


        </div>}
      </div>}

      {/* ═══════════════════════════════════════
           TAB 2: 🔮 FORTUNE
         ═══════════════════════════════════════ */}

      {/* Fortune Hub */}
      {pg==="fortuneHub"&&<div style={page}>
        <PageTitle emoji="🔮" title="운세" sub="모든 사주·운세 기능"/>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {[
            {emoji:"🔮",title:"사주 입력",desc:"새로운 사주 분석 시작",fn:()=>goFortuneSub("input")},
            {emoji:"📜",title:"분석 결과",desc:rd?"마지막 분석 보기":"사주 입력 후 이용 가능",fn:()=>{if(rd)goFortuneSub("result");else goFortuneSub("input")}},
            {emoji:"✨",title:"오늘의 운세",desc:hasSaju?todayFull:"사주 입력 후 이용 가능",fn:()=>{if(hasSaju){if(!dailyRd)doDaily();goFortuneSub("daily")}else goFortuneSub("input")}},
            {emoji:"💫",title:"궁합 분석",desc:"두 사람의 궁합",fn:()=>goFortuneSub("compat")},
            {emoji:"⭐",title:"점성술",desc:hasSaju?`${zodiac?.symbol||""} ${zodiac?.sign||"별자리 분석"}`:"사주 입력 후 이용 가능",badge:"NEW",bc:T.gold,fn:()=>{if(hasSaju)doAstro();else{setPendingAction("astro");goFortuneSub("input")}}},
            {emoji:"🌌",title:"통합 리포트",desc:"사주 × 점성술 × MBTI",badge:"PREMIUM",bc:T.purple2,fn:()=>{if(hasSaju){if(prem)doIntegrated();else setPw(true)}else{setPendingAction("integrated");goFortuneSub("input")}}},
            {emoji:"🎴",title:"타로 카드",desc:"사주 기반 3카드 리딩",fn:()=>{if(hasSaju)doTarot();else goFortuneSub("input")}},
            {emoji:"👤",title:"AI 관상",desc:"사주 / 사진 관상 분석",badge:"NEW",bc:T.green,fn:()=>{if(hasSaju)goFortuneSub("faceMenu");else{setPendingAction("face");goFortuneSub("input")}}},
            {emoji:"🧠",title:"사주 MBTI",desc:hasSaju?(mbti||"오행 기반 MBTI"):"사주 입력 후 이용 가능",badge:"NEW",bc:T.blue,fn:()=>{if(hasSaju)goFortuneSub("mbtiResult");else{setPendingAction("mbti");goFortuneSub("input")}}},
          ].map((item,i)=><Card key={i} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:14,padding:"16px 18px"}} onClick={item.fn}>
            <div style={{width:40,height:40,borderRadius:12,background:T.surface,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{item.emoji}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontSize:15,fontWeight:700,color:"#fff"}}>{item.title}</span>
                {item.badge&&<span style={{padding:"2px 8px",borderRadius:50,background:`${item.bc||T.purple}15`,color:item.bc||T.purple,fontSize:9,fontWeight:700}}>{item.badge}</span>}
              </div>
              <div style={{fontSize:12,color:T.dim,marginTop:1}}>{item.desc}</div>
            </div>
            <span style={{color:T.dim,fontSize:14}}>→</span>
          </Card>)}


        </div>
      </div>}

      {/* ═══ Fortune Sub-pages ═══ */}

      {/* INPUT */}
      {pg==="input"&&<div style={page}><Back onClick={goFortune}/>
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
          <Btn primary onClick={()=>{if(prem||hasSajuSub)run("premium");else setPw(true)}} style={{flex:1}}>프리미엄 ✦</Btn>
        </div>
      </div>}

      {/* COMPAT */}
      {pg==="compat"&&<div style={page}><Back onClick={goFortune}/>
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

      {/* DAILY */}
      {pg==="daily"&&<div style={page}><Back onClick={goHome}/><PageTitle title="오늘의 운세" sub={todayFull}/><Card>{dailyLoading?<div style={{textAlign:"center",padding:30}}><Spin/></div>:<Md text={dailyRd}/>}
        {!dailyLoading&&dailyRd&&<div style={{marginTop:20,display:"flex",gap:8}}>
          <div style={{flex:1,cursor:"pointer",padding:12,borderRadius:12,background:`${T.amber}08`,border:`1px solid ${T.amber}15`,textAlign:"center"}} onClick={()=>{setMainTab("briefing");setPg("briefingHub");setBriefSub("calendar")}}>
            <span style={{fontSize:18}}>📅</span><div style={{fontSize:11,fontWeight:600,color:T.amber,marginTop:4}}>Lucky Calendar</div>
          </div>
          <div style={{flex:1,cursor:"pointer",padding:12,borderRadius:12,background:"linear-gradient(135deg,rgba(59,130,246,0.08),rgba(139,92,246,0.06))",border:"1px solid rgba(59,130,246,0.15)",textAlign:"center"}} onClick={()=>{setMainTab("briefing");setPg("briefingHub");setBriefSub("fortune")}}>
            <span style={{fontSize:18}}>📈</span><div style={{fontSize:11,fontWeight:600,color:T.purple,marginTop:4}}>투자 시그널</div>
          </div>
        </div>}
      </Card></div>}

      {/* CATEGORY */}
      {pg==="category"&&<div style={page}><Back onClick={goHome}/><PageTitle title={`${catName} 상세 분석`}/><Card>{catLoading?<div style={{textAlign:"center",padding:30}}><Spin/></div>:<Md text={catRd}/>}
        {/* CTA: 해당 코치로 연결 */}
        {!catLoading&&catRd&&(catName==="연애운"||catName==="직업운"||catName==="건강운")&&<div style={{marginTop:20,padding:16,borderRadius:14,background:`${T.purple}08`,border:`1px solid ${T.purple}15`,cursor:"pointer"}} onClick={()=>{if(!hasBundleSub){setPw(true);return}if(catName==="연애운")startCoach("relationship");else if(catName==="직업운")startCoach("career");else doWellness()}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:20}}>{catName==="연애운"?"💕":catName==="직업운"?"💼":"🏥"}</span>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:700,color:"#fff"}}>AI {catName==="연애운"?"연애":catName==="직업운"?"커리어":"웰니스"} 코치</div>
              <div style={{fontSize:12,color:T.dim}}>{hasBundleSub?"더 깊은 맞춤 상담 받기":"번들 구독으로 AI 코치 이용하기"}</div>
            </div>
            <span style={{color:T.purple,fontSize:14}}>{hasBundleSub?"→":"✦"}</span>
          </div>
        </div>}
        {/* CTA: 재물운 → 브리핑 */}
        {!catLoading&&catRd&&catName==="재물운"&&hasSaju&&<div style={{marginTop:12,padding:16,borderRadius:14,background:"linear-gradient(135deg,rgba(59,130,246,0.08),rgba(139,92,246,0.06))",border:"1px solid rgba(59,130,246,0.15)",cursor:"pointer"}} onClick={()=>{setMainTab("briefing");setPg("briefingHub");setBriefSub("fortune")}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:20}}>📈</span>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:700,color:"#fff"}}>재물운 × 시장 시그널</div>
              <div style={{fontSize:12,color:T.dim}}>오행 맞춤 투자 시그널 확인하기</div>
            </div>
            <span style={{color:T.blue,fontSize:14}}>→</span>
          </div>
        </div>}
        {/* CTA: 행운 → Lucky Calendar */}
        {!catLoading&&catRd&&catName==="행운"&&hasSaju&&<div style={{marginTop:12,padding:16,borderRadius:14,background:`${T.amber}08`,border:`1px solid ${T.amber}15`,cursor:"pointer"}} onClick={()=>{setMainTab("briefing");setPg("briefingHub");setBriefSub("calendar")}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:20}}>📅</span>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:700,color:"#fff"}}>Lucky Timing Calendar</div>
              <div style={{fontSize:12,color:T.dim}}>행운의 날짜 확인하기</div>
            </div>
            <span style={{color:T.amber,fontSize:14}}>→</span>
          </div>
        </div>}
      </Card></div>}

      {/* TAROT */}
      {pg==="tarot"&&<div style={page}><Back onClick={goFortune}/><PageTitle emoji="🎴" title="타로 카드" sub="카드를 하나씩 뒤집어 보세요"/>
        <div style={{display:"flex",justifyContent:"center",gap:12,marginBottom:14}}>{["과거","현재","미래"].map((l,i)=><div key={i} style={{textAlign:"center"}}><div style={{fontSize:10,color:T.dim,marginBottom:6}}>{l}</div>{tCards[i]&&<TCard card={tCards[i]} flipped={tFlip[i]} onClick={()=>flipTarot(i)} delay={i*.12}/>}</div>)}</div>
        {tFlip.every(Boolean)&&<Card>{tLoading?<div style={{textAlign:"center",padding:20}}><Spin color={T.gold}/></div>:<Md text={tRd}/>}
          {!tLoading&&tRd&&<div style={{marginTop:16,display:"flex",gap:6}}>
            <div style={{flex:1,cursor:"pointer",padding:12,borderRadius:12,background:`${T.pink}08`,border:`1px solid ${T.pink}15`,textAlign:"center"}} onClick={()=>{if(hasBundleSub)startCoach("relationship");else setPw(true)}}>
              <span style={{fontSize:16}}>💕</span><div style={{fontSize:11,fontWeight:600,color:T.pink,marginTop:4}}>연애 코치</div>
            </div>
            <div style={{flex:1,cursor:"pointer",padding:12,borderRadius:12,background:`${T.blue}08`,border:`1px solid ${T.blue}15`,textAlign:"center"}} onClick={()=>{if(hasBundleSub)startCoach("career");else setPw(true)}}>
              <span style={{fontSize:16}}>💼</span><div style={{fontSize:11,fontWeight:600,color:T.blue,marginTop:4}}>커리어 코치</div>
            </div>
            <div style={{flex:1,cursor:"pointer",padding:12,borderRadius:12,background:"linear-gradient(135deg,rgba(59,130,246,0.08),rgba(139,92,246,0.06))",border:"1px solid rgba(59,130,246,0.15)",textAlign:"center"}} onClick={()=>{setMainTab("briefing");setPg("briefingHub");setBriefSub("fortune")}}>
              <span style={{fontSize:16}}>📈</span><div style={{fontSize:11,fontWeight:600,color:T.purple,marginTop:4}}>시그널</div>
            </div>
          </div>}
        </Card>}
      </div>}

      {/* ASTRO */}
      {pg==="astro"&&<div style={page}><Back onClick={goFortune}/>
        {zodiac&&<PageTitle title={zodiac.sign} sub={`${zodiac.symbol} ${zodiac.element} 원소 · ${zodiac.planet}`}/>}
        {zodiac&&<div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:20,flexWrap:"wrap"}}>
          <Pill active color={ELEM_COLOR[zodiac.element]}>{zodiac.element} 원소</Pill>
          <Pill active color={T.purple}>🪐 {zodiac.planet}</Pill>
        </div>}
        <Card>{astroLoading?<div style={{textAlign:"center",padding:30}}><Spin color={T.gold}/></div>:<Md text={astroRd}/>}
          {!astroLoading&&astroRd&&<div style={{marginTop:20,cursor:"pointer",padding:14,borderRadius:12,background:"linear-gradient(135deg,rgba(139,92,246,0.08),rgba(16,185,129,0.04))",border:"1px solid rgba(139,92,246,0.15)"}} onClick={()=>{if(prem)doIntegrated();else setPw(true)}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:18}}>🌌</span><div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:"#fff"}}>통합 리포트</div><div style={{fontSize:11,color:T.dim}}>사주 × 점성술 × MBTI 교차 분석</div></div><span style={{color:T.purple,fontSize:12}}>{prem?"→":"✦"}</span></div>
          </div>}
        </Card>
      </div>}

      {/* MBTI */}
      {pg==="mbtiResult"&&<div style={page}><Back onClick={goFortune}/><PageTitle emoji="🧠" title="사주 기반 MBTI" sub="오행 분포와 십성으로 추정"/>
        {mbti&&<Card>
          <div style={{textAlign:"center",marginBottom:20}}>
            <div style={{display:"inline-block",padding:"14px 32px",borderRadius:16,background:T.surface,border:`1px solid ${T.border}`}}>
              <div style={{fontSize:40,fontWeight:800,color:"#fff",letterSpacing:8,fontFamily:"'Geist',sans-serif"}}>{mbti}</div>
            </div>
            <p style={{fontSize:14,color:T.sub,marginTop:10}}>{MBTI_DESC[mbti]||""}</p>
          </div>
          {oh&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:16}}>
            {[{l:"E/I",v:mbti[0],d:mbti[0]==="E"?`목·화(${oh.목+oh.화}) > 금·수(${oh.금+oh.수})`:`금·수(${oh.금+oh.수}) ≥ 목·화(${oh.목+oh.화})`},{l:"S/N",v:mbti[1],d:mbti[1]==="S"?`토·금(${oh.토+oh.금}) > 수·목(${oh.수+oh.목})`:`수·목(${oh.수+oh.목}) ≥ 토·금(${oh.토+oh.금})`},{l:"T/F",v:mbti[2],d:mbti[2]==="T"?`금·수(${oh.금+oh.수}) > 화·목(${oh.화+oh.목})`:`화·목(${oh.화+oh.목}) ≥ 금·수(${oh.금+oh.수})`},{l:"J/P",v:mbti[3],d:mbti[3]==="J"?`토·금(${oh.토+oh.금}) > 목·화(${oh.목+oh.화})`:`목·화(${oh.목+oh.화}) ≥ 토·금(${oh.토+oh.금})`}].map((r,i)=><div key={i} style={{padding:10,borderRadius:10,background:T.surface,border:`1px solid ${T.border}`}}><div style={{fontSize:13,fontWeight:700,color:T.text,marginBottom:2}}>{r.l}: {r.v}</div><div style={{fontSize:11,color:T.dim}}>{r.d}</div></div>)}
          </div>}
          <div style={{padding:"10px 14px",borderRadius:10,background:`${T.gold}08`,border:`1px solid ${T.gold}12`}}>
            <p style={{fontSize:12,color:T.sub,lineHeight:1.7,margin:0}}>⚠️ 학술 연구 기반 <strong style={{color:T.text}}>재미 목적의 추정</strong>이며, 정식 MBTI 검사를 대체하지 않습니다.</p>
          </div>
          {/* MBTI → 통합 리포트 크로스셀 */}
          <div style={{marginTop:16,cursor:"pointer",padding:14,borderRadius:12,background:"linear-gradient(135deg,rgba(139,92,246,0.08),rgba(16,185,129,0.04))",border:"1px solid rgba(139,92,246,0.15)"}} onClick={()=>{if(prem)doIntegrated();else setPw(true)}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:18}}>🌌</span><div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:"#fff"}}>통합 리포트에서 MBTI 심층 분석</div><div style={{fontSize:11,color:T.dim}}>사주 × 점성술 × MBTI 교차 검증</div></div><span style={{color:T.purple,fontSize:12}}>{prem?"→":"✦"}</span></div>
          </div>
        </Card>}
      </div>}

      {/* INTEGRATED */}
      {pg==="integrated"&&<div style={page}><Back onClick={goFortune}/><PageTitle emoji="🌌" title="통합 리포트" sub="사주 × 점성술 × MBTI"/>
        {zodiac&&mbti&&<div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:20,flexWrap:"wrap"}}><Pill active>☯ 사주</Pill><Pill active color={ELEM_COLOR[zodiac.element]}>{zodiac.symbol} {zodiac.sign}</Pill><Pill active color={T.green}>🧠 {mbti}</Pill></div>}
        <Card>{intLoading?<div style={{textAlign:"center",padding:40}}><Spin/><p style={{fontSize:13,color:T.dim,marginTop:14}}>세 체계를 융합 분석 중...</p></div>:<Md text={intRd}/>}
          {/* 통합 리포트 → 코치/브리핑 크로스셀 */}
          {!intLoading&&intRd&&<div style={{marginTop:20,display:"flex",flexDirection:"column",gap:8}}>
            <div style={{cursor:"pointer",padding:14,borderRadius:12,background:"linear-gradient(135deg,rgba(59,130,246,0.08),rgba(139,92,246,0.06))",border:"1px solid rgba(59,130,246,0.15)"}} onClick={()=>{setMainTab("briefing");setPg("briefingHub");setBriefSub("fortune")}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:18}}>📈</span><div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:"#fff"}}>Fortune × Signal</div><div style={{fontSize:11,color:T.dim}}>사주 맞춤 투자 시그널</div></div><span style={{color:T.blue,fontSize:12}}>→</span></div>
            </div>
            {[{emoji:"💕",t:"연애 코치",c:T.pink,fn:()=>{if(hasBundleSub)startCoach("relationship");else setPw(true)}},{emoji:"💼",t:"커리어 코치",c:T.blue,fn:()=>{if(hasBundleSub)startCoach("career");else setPw(true)}},{emoji:"🏥",t:"웰니스 가이드",c:T.green,fn:()=>{if(hasBundleSub)doWellness();else setPw(true)}}].map((x,i)=><div key={i} style={{cursor:"pointer",padding:14,borderRadius:12,background:`${x.c}08`,border:`1px solid ${x.c}15`}} onClick={x.fn}>
              <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:18}}>{x.emoji}</span><div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:"#fff"}}>{x.t}</div></div><span style={{color:x.c,fontSize:12}}>{hasBundleSub?"→":"✦"}</span></div>
            </div>)}
          </div>}
        </Card>
      </div>}

      {/* FACE MENU */}
      {pg==="faceMenu"&&<div style={page}><Back onClick={goFortune}/><PageTitle emoji="👤" title="AI 관상 분석" sub="두 가지 방식으로 관상을 봅니다"/>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <Card style={{cursor:"pointer",padding:22}} onClick={doFaceSaju}><div style={{display:"flex",alignItems:"center",gap:14}}><div style={{width:44,height:44,borderRadius:14,background:T.surface,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>☯</div><div style={{flex:1}}><div style={{fontSize:15,fontWeight:700,color:"#fff"}}>사주 기반 추정</div><div style={{fontSize:12,color:T.dim}}>오행으로 외모 경향 분석</div></div><Pill active color={T.green} style={{fontSize:10}}>무료</Pill></div></Card>
          <Card style={{cursor:"pointer",padding:22}} onClick={()=>goFortuneSub("faceUpload")}><div style={{display:"flex",alignItems:"center",gap:14}}><div style={{width:44,height:44,borderRadius:14,background:T.surface,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>📸</div><div style={{flex:1}}><div style={{fontSize:15,fontWeight:700,color:"#fff"}}>사진 관상 분석</div><div style={{fontSize:12,color:T.dim}}>실제 셀카로 분석</div></div><Pill active color={T.purple} style={{fontSize:10}}>PREMIUM</Pill></div></Card>
        </div>
      </div>}

      {/* FACE UPLOAD */}
      {pg==="faceUpload"&&<div style={page}><Back onClick={()=>goFortuneSub("faceMenu")}/><PageTitle emoji="📸" title="사진 관상 분석" sub="정면 셀카를 올려주세요"/>
        <Card style={{textAlign:"center",padding:30}}>
          <input ref={photoRef} type="file" accept="image/*" capture="user" onChange={handlePhotoUpload} style={{display:"none"}}/>
          {facePhoto?<div><div style={{width:120,height:120,margin:"0 auto 14px",borderRadius:"50%",overflow:"hidden",border:`2px solid ${T.border}`}}><img src={`data:image/jpeg;base64,${facePhoto}`} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/></div><button onClick={()=>setFacePhoto(null)} style={{background:"none",border:"none",color:T.dim,fontSize:12,cursor:"pointer",marginBottom:14}}>다시 선택</button></div>
          :<div onClick={()=>photoRef.current?.click()} style={{cursor:"pointer",padding:36,borderRadius:14,border:`2px dashed ${T.border}`,background:T.surface}}><div style={{fontSize:36,marginBottom:8}}>📷</div><p style={{fontSize:14,color:T.dim,margin:0}}>터치하여 사진 선택</p></div>}
          {facePhoto&&<Btn primary onClick={()=>{if(prem)doFacePhoto();else setPw(true)}} style={{width:"100%",marginTop:14}}>관상 분석 시작 ✦</Btn>}
        </Card>
      </div>}

      {/* FACE RESULT */}
      {pg==="face"&&<div style={page}><Back onClick={goFortune}/><PageTitle title={`${faceMode==="photo"?"사진":"사주"} 관상 분석`}/><Card>{faceLoading?<div style={{textAlign:"center",padding:30}}><Spin color={T.green}/></div>:<Md text={faceRd}/>}
        {!faceLoading&&faceRd&&<div style={{marginTop:20,cursor:"pointer",padding:14,borderRadius:12,background:`${T.green}08`,border:`1px solid ${T.green}15`}} onClick={()=>{if(hasBundleSub)doWellness();else setPw(true)}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:18}}>🏥</span><div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:"#fff"}}>웰니스 가이드</div><div style={{fontSize:11,color:T.dim}}>관상 + 오행 체질 기반 건강 가이드</div></div><span style={{color:T.green,fontSize:12}}>{hasBundleSub?"→":"✦"}</span></div>
        </div>}
      </Card></div>}

      {/* ═══ RESULT PAGE ═══ */}
      {pg==="result"&&saju&&<div style={{...page,maxWidth:480}}>
        <Back onClick={goFortune}/>
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

        {tab==="result"&&<Card><Md text={rd}/>
          {/* Fortune Signal CTA */}
          {saju&&<div onClick={()=>{setMainTab("briefing");setPg("briefingHub");setBriefSub("fortune")}} style={{cursor:"pointer",margin:"20px 0",padding:"16px 18px",borderRadius:14,background:"linear-gradient(135deg,rgba(16,185,129,0.08),rgba(139,92,246,0.06))",border:"1px solid rgba(139,92,246,0.15)"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:24}}>📈</span>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:700,color:"#fff",letterSpacing:"-0.02em"}}>나의 재물운 × 시장 시그널</div>
                <div style={{fontSize:12,color:T.sub,marginTop:2}}>사주 오행 기반 맞춤 투자 시그널</div>
              </div>
              <span style={{fontSize:10,padding:"4px 10px",borderRadius:50,background:"rgba(139,92,246,0.2)",color:"#a78bfa",fontWeight:700}}>보기 →</span>
            </div>
          </div>}
          {/* 궁합 공유 카드 CTA */}
          {mode==="compat"&&<div style={{margin:"16px 0",padding:16,borderRadius:14,background:`${T.pink}08`,border:`1px solid ${T.pink}15`,cursor:"pointer"}} onClick={()=>setTab("share")}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:20}}>💌</span>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:700,color:"#fff"}}>궁합 카드 공유하기</div>
                <div style={{fontSize:12,color:T.dim}}>카톡·인스타로 공유</div>
              </div>
              <span style={{color:T.pink,fontSize:14}}>→</span>
            </div>
          </div>}
          {mode==="basic"&&!prem&&!hasSajuSub&&<div style={{position:"relative",margin:"20px 0",borderRadius:14,overflow:"hidden"}}><div style={{filter:"blur(4px)",opacity:.1,height:80,background:T.surface}}/><div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8}}><span style={{fontSize:13,fontWeight:600,color:T.text}}>재물운, 연애운, 동서양 통합 분석...</span><Btn primary onClick={()=>setPw(true)} style={{padding:"10px 24px",fontSize:13}}>프리미엄으로 열기 ✦</Btn></div></div>}
        </Card>}
        {tab==="chat"&&<Card style={{minHeight:160}}>
          <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:14,justifyContent:"center"}}>{["이직 시기","재물운","연애운","건강","내년 운세","별자리 궁합","MBTI 성격"].map(t=><Pill key={t} onClick={()=>{if(chatRef.current)chatRef.current.value=t+"이 궁금해요"}}>{t}</Pill>)}</div>
          {ch.slice(1).map((m,i)=><div key={i} style={{marginBottom:12}}>{m.role==="user"&&<div style={{background:T.surface,borderRadius:10,padding:"10px 12px",borderLeft:`2px solid ${T.purple}`,marginBottom:6}}><p style={{margin:0,color:T.text,fontSize:14}}>{m.content}</p></div>}{m.role==="assistant"&&<Md text={m.content}/>}</div>)}
          {chatLoading&&<div style={{display:"flex",alignItems:"center",gap:6,color:T.dim,fontSize:12}}><Spin size={10}/>답변 중</div>}
          <div ref={scrollRef}/>
        </Card>}
        {tab==="share"&&<div style={{textAlign:"center"}}>
          <p style={{fontSize:12,color:T.dim,marginBottom:14}}>스크린샷으로 공유</p>
          {/* 궁합 공유 카드 (바이럴) */}
          {mode==="compat"&&saju2?<div style={{width:280,margin:"0 auto",padding:"22px 18px",background:"linear-gradient(135deg,#1a1040,#2d1060)",borderRadius:16,border:`1px solid ${T.purple}30`}}>
            <div style={{fontSize:8,letterSpacing:4,color:T.purple,marginBottom:8,fontFamily:"'Geist',sans-serif"}}>NUVO AI 궁합</div>
            <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:12,marginBottom:10}}>
              <div style={{textAlign:"center"}}>
                <div style={{fontSize:24}}>{DDI_E[saju.년주.지]}</div>
                <div style={{fontSize:13,fontWeight:700,color:"#fff"}}>{savedName||"A"}</div>
              </div>
              <div style={{fontSize:20,color:T.pink}}>♥</div>
              <div style={{textAlign:"center"}}>
                <div style={{fontSize:24}}>{DDI_E[saju2.년주.지]}</div>
                <div style={{fontSize:13,fontWeight:700,color:"#fff"}}>{savedName2||"B"}</div>
              </div>
            </div>
            <div style={{padding:"10px 14px",borderRadius:10,background:"rgba(255,255,255,0.05)",marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-around"}}>
                {[["시",saju.시주],["일",saju.일주],["월",saju.월주],["년",saju.년주]].filter(([,p])=>p).map(([l,p],i)=><div key={i} style={{textAlign:"center"}}><div style={{fontSize:7,color:T.dim}}>{l}</div><div style={{fontSize:14,color:"#fff"}}>{GK[p.간]}{JK[p.지]}</div></div>)}
              </div>
              <div style={{height:1,background:T.border,margin:"6px 0"}}/>
              <div style={{display:"flex",justifyContent:"space-around"}}>
                {[["시",saju2.시주],["일",saju2.일주],["월",saju2.월주],["년",saju2.년주]].filter(([,p])=>p).map(([l,p],i)=><div key={i} style={{textAlign:"center"}}><div style={{fontSize:7,color:T.dim}}>{l}</div><div style={{fontSize:14,color:"#fff"}}>{GK[p.간]}{JK[p.지]}</div></div>)}
              </div>
            </div>
            <div style={{fontSize:10,color:T.purple,textAlign:"center"}}>saju-ai-one.vercel.app</div>
          </div>
          :<div style={{width:280,margin:"0 auto",padding:"22px 18px",background:T.surface,borderRadius:16,border:`1px solid ${T.border}`}}>
            <div style={{fontSize:8,letterSpacing:4,color:T.purple,marginBottom:6,fontFamily:"'Geist',sans-serif"}}>NUVO AI</div>
            <div style={{fontSize:18,fontWeight:700,color:"#fff",marginBottom:2}}>{savedName||"나"}의 사주</div>
            <div style={{fontSize:10,color:T.dim,marginBottom:6}}>{savedYear}.{month}.{day} · {DDI_E[saju.년주.지]} {DDI[saju.년주.지]}띠</div>
            {zodiac&&mbti&&<div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:8}}><span style={{fontSize:10,color:ELEM_COLOR[zodiac.element]}}>{zodiac.symbol}{zodiac.sign}</span><span style={{fontSize:10,color:T.green}}>🧠{mbti}</span></div>}
            <div style={{display:"flex",justifyContent:"center",gap:12,marginBottom:10}}>{[saju.시주&&["시",saju.시주],["일",saju.일주],["월",saju.월주],["년",saju.년주]].filter(Boolean).map(([l,p],i)=><div key={i} style={{textAlign:"center"}}><div style={{fontSize:7,color:T.dim}}>{l}</div><div style={{fontSize:22,fontWeight:300,color:"#fff",lineHeight:1.1}}>{GK[p.간]}</div><div style={{fontSize:22,fontWeight:300,color:"#fff",lineHeight:1.1}}>{JK[p.지]}</div></div>)}</div>
            <div style={{height:1,background:T.border,margin:"8px 0"}}/>
            <div style={{display:"flex",justifyContent:"center",gap:8}}>{Object.entries(oh||{}).map(([k,v])=><span key={k} style={{fontSize:10,color:v?OHC[k]:T.border,fontWeight:600}}>{OHK[k]}{v}</span>)}</div>
          </div>}
          <button onClick={()=>{const t=mode==="compat"&&saju2?`🔮 ${savedName||"A"} ♥ ${savedName2||"B"} 궁합\n${DDI_E[saju.년주.지]}${savedName||""} × ${DDI_E[saju2.년주.지]}${savedName2||""}\n\nNUVO AI에서 궁합 보기\nsaju-ai-one.vercel.app`:`🔮 ${savedName||"나"}의 사주: ${sStr(saju)}\n${zodiac?`⭐ ${zodiac.symbol} ${zodiac.sign}`:""}\n${mbti?`🧠 추정 MBTI: ${mbti}`:""}\n오행: ${Object.entries(oh||{}).map(([k,v])=>`${OHK[k]}${v}`).join(" ")}\n\nNUVO AI에서 분석 받기\nsaju-ai-one.vercel.app`;navigator.clipboard.writeText(t)}} style={{marginTop:14,padding:"8px 20px",borderRadius:50,border:`1px solid ${T.border}`,background:"transparent",color:T.dim,fontSize:12,cursor:"pointer"}}>텍스트 복사</button>
        </div>}
        {tab==="chat"&&<div style={{position:"fixed",bottom:72,left:0,right:0,background:`linear-gradient(transparent,${T.bg} 40%)`,padding:"12px 16px",zIndex:10}}><div style={{maxWidth:480,margin:"0 auto",display:"flex",gap:6}}><input ref={chatRef} defaultValue="" onKeyDown={e=>{if(e.key==="Enter"&&!e.nativeEvent.isComposing)doChat()}} placeholder="질문을 입력하세요" style={{...INP,flex:1}}/><Btn primary onClick={doChat} style={{padding:"12px 20px",fontSize:13,whiteSpace:"nowrap"}}>질문</Btn></div></div>}
      </div>}

      {/* ═══ AI COACH ═══ */}
      {pg==="coach"&&<div style={page}><Back onClick={goFortune}/>
        <PageTitle emoji={coachType==="relationship"?"💕":"💼"} title={coachType==="relationship"?"AI 연애 코치":"커리어 타이밍 코치"} sub="사주 기반 맞춤 상담"/>
        <Card style={{minHeight:200}}>
          {/* 빠른 질문 */}
          <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:14,justifyContent:"center"}}>
            {(coachType==="relationship"?["오늘 데이트 어때?","고백 타이밍","다툼 후 화해법","상대 마음 읽기"]:["이직 타이밍","연봉 협상 시기","사업 시작 시점","승진 가능성"]).map(q=><Pill key={q} onClick={()=>sendCoachMsg(q)} style={{fontSize:12}}>{q}</Pill>)}
          </div>
          {coachMsgs.map((m,i)=><div key={i} style={{marginBottom:12}}>
            {m.role==="user"&&<div style={{background:T.surface,borderRadius:10,padding:"10px 12px",borderLeft:`2px solid ${coachType==="relationship"?T.pink:T.blue}`,marginBottom:6}}><p style={{margin:0,color:T.text,fontSize:14}}>{m.content}</p></div>}
            {m.role==="assistant"&&<Md text={m.content}/>}
          </div>)}
          {coachLoading&&<div style={{display:"flex",alignItems:"center",gap:6,color:T.dim,fontSize:12}}><Spin size={10}/>답변 중</div>}
          <div ref={scrollRef}/>
        </Card>
        <div style={{position:"fixed",bottom:72,left:0,right:0,background:`linear-gradient(transparent,${T.bg} 40%)`,padding:"12px 16px",zIndex:10}}>
          <div style={{maxWidth:480,margin:"0 auto",display:"flex",gap:6}}>
            <input ref={coachRef} defaultValue="" onKeyDown={e=>{if(e.key==="Enter"&&!e.nativeEvent.isComposing)sendCoachMsg(coachRef.current?.value)}} placeholder="상담 내용을 입력하세요" style={{...INP,flex:1}}/>
            <Btn primary color={coachType==="relationship"?"#ec4899":T.blue} onClick={()=>sendCoachMsg(coachRef.current?.value)} style={{padding:"12px 20px",fontSize:13,whiteSpace:"nowrap"}}>전송</Btn>
          </div>
        </div>
      </div>}

      {/* ═══ WELLNESS ═══ */}
      {pg==="wellness"&&<div style={page}><Back onClick={goFortune}/><PageTitle emoji="🏥" title="웰니스 가이드" sub="오행 체질 기반 건강 가이드"/>
        {oh&&<Card style={{marginBottom:12,padding:16}}>
          <div style={{fontSize:13,color:T.dim,fontWeight:600,marginBottom:10}}>나의 오행 분포</div>
          <div style={{display:"flex",gap:4,height:28,borderRadius:8,overflow:"hidden",marginBottom:8}}>
            {Object.entries(oh).map(([k,v])=>v>0&&<div key={k} style={{flex:v,background:OHC[k],borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontSize:10,fontWeight:700,color:"#000"}}>{OHK[k]}{v}</span>
            </div>)}
          </div>
        </Card>}
        <Card>{wellLoading?<div style={{textAlign:"center",padding:30}}><Spin color={T.green}/></div>:<Md text={wellRd}/>}
          {!wellLoading&&wellRd&&<div style={{marginTop:20,display:"flex",gap:8}}>
            <div style={{flex:1,cursor:"pointer",padding:12,borderRadius:12,background:"linear-gradient(135deg,rgba(59,130,246,0.08),rgba(139,92,246,0.06))",border:"1px solid rgba(59,130,246,0.15)",textAlign:"center"}} onClick={()=>{setMainTab("briefing");setPg("briefingHub");setBriefSub("fortune")}}>
              <span style={{fontSize:18}}>📈</span><div style={{fontSize:11,fontWeight:600,color:T.purple,marginTop:4}}>투자 시그널</div>
            </div>
            <div style={{flex:1,cursor:"pointer",padding:12,borderRadius:12,background:`${T.amber}08`,border:`1px solid ${T.amber}15`,textAlign:"center"}} onClick={()=>{setMainTab("briefing");setPg("briefingHub");setBriefSub("calendar")}}>
              <span style={{fontSize:18}}>📅</span><div style={{fontSize:11,fontWeight:600,color:T.amber,marginTop:4}}>Lucky Calendar</div>
            </div>
          </div>}
        </Card>
      </div>}

      {/* ═══════════════════════════════════════
           TAB 3: 📡 BRIEFING
         ═══════════════════════════════════════ */}
      {pg==="briefingHub"&&<div style={page}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div>
            <div style={{fontSize:12,letterSpacing:".12em",color:T.blue,fontWeight:700,fontFamily:"'Geist',sans-serif"}}>BRIEFING</div>
            <h1 style={{fontSize:24,fontWeight:800,color:"#fff",margin:"4px 0 0",letterSpacing:"-0.04em"}}>시장 분석</h1>
          </div>
          <div style={{display:"flex",gap:4}}>
            {["KR","EN"].map(l=><Pill key={l} active={briefLang===(l==="KR"?"kr":"en")} onClick={()=>setBriefLang(l==="KR"?"kr":"en")} style={{padding:"4px 10px",fontSize:11}}>{l}</Pill>)}
          </div>
        </div>

        {/* Sub Nav */}
        <div style={{display:"flex",gap:4,marginBottom:16}}>
          {[{k:"daily",l:"📰 브리핑"},{k:"fortune",l:"🔮 시그널"},{k:"calendar",l:"📅 캘린더"}].map(s=><Pill key={s.k} active={briefSub===s.k} onClick={()=>setBriefSub(s.k)} style={{flex:1,textAlign:"center",fontSize:12}}>{s.l}</Pill>)}
        </div>

        {/* Ticker Strip */}
        {tickers.length>0&&<div style={{marginBottom:14,overflow:"hidden",borderRadius:10,background:T.surface,border:`1px solid ${T.border}`,padding:"8px 0"}}>
          <div ref={tickerRef} style={{display:"flex",gap:16,paddingLeft:12,paddingRight:12,overflowX:"auto",scrollbarWidth:"none",msOverflowStyle:"none"}}>
            {tickers.map((t,i)=>{
              const up=parseFloat(t.change)>0;const down=parseFloat(t.change)<0;
              return <div key={i} style={{display:"flex",alignItems:"center",gap:6,whiteSpace:"nowrap",flexShrink:0}}>
                <span style={{fontSize:11,fontWeight:700,color:T.sub,fontFamily:"'JetBrains Mono','Geist',monospace"}}>{t.name}</span>
                <span style={{fontSize:12,fontWeight:600,color:"#fff",fontFamily:"'JetBrains Mono',monospace"}}>{typeof t.price==="number"?t.price.toLocaleString():t.price}</span>
                <span style={{fontSize:10,fontWeight:700,color:up?T.green:down?T.red:T.dim,fontFamily:"'JetBrains Mono',monospace"}}>{up?"+":""}{t.change}%</span>
                
                {i<tickers.length-1&&<span style={{color:T.border,fontSize:10}}>│</span>}
              </div>;
            })}
          </div>
        </div>}

        {/* Daily Briefing */}
        {briefSub==="daily"&&<div>
          {/* Category Filter */}
          <div style={{display:"flex",gap:4,marginBottom:14,overflowX:"auto",paddingBottom:4}}>
            {[{k:"all",l:"전체"},{k:"stock",l:"주식"},{k:"realestate",l:"부동산"},{k:"forex",l:"환율"},{k:"crypto",l:"암호화폐"},{k:"macro",l:"거시경제"}].map(c=><Pill key={c.k} active={briefCat===c.k} onClick={()=>setBriefCat(c.k)} style={{fontSize:11,padding:"6px 12px",whiteSpace:"nowrap"}}>{c.l}</Pill>)}
          </div>
          <Btn primary onClick={loadBriefing} disabled={briefLoading} style={{width:"100%",marginBottom:16}}>
            {briefLoading?"분석 중...":"AI 브리핑 생성"}
          </Btn>
          {briefData&&!briefData.error&&<div>
            {briefData.summary&&<Card style={{marginBottom:12}}>
              <div style={{fontSize:11,color:T.blue,fontWeight:700,letterSpacing:".04em",marginBottom:8}}>AI 핵심 요약</div>
              <Md text={briefData.summary}/>
            </Card>}
            {briefData.insights&&briefData.insights.map((ins,i)=><Card key={i} style={{marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <span style={{fontSize:14,fontWeight:700,color:"#fff"}}>{ins.title}</span>
                {ins.impact&&<span style={{fontSize:10,padding:"2px 8px",borderRadius:50,background:ins.impact>0?`${T.green}15`:`${T.red}15`,color:ins.impact>0?T.green:T.red,fontWeight:700}}>임팩트 {ins.impact>0?"+":""}{ins.impact}</span>}
              </div>
              <p style={{fontSize:13,color:T.sub,lineHeight:1.7,margin:0}}>{ins.content}</p>
              {ins.chain&&<div style={{marginTop:10,padding:10,borderRadius:10,background:T.surface,border:`1px solid ${T.border}`}}>
                <div style={{fontSize:10,color:T.dim,marginBottom:6}}>연쇄영향</div>
                {ins.chain.map((c,j)=><div key={j} style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                  <span style={{fontSize:10,color:T.purple}}>→</span>
                  <span style={{fontSize:12,color:T.sub}}>{c}</span>
                </div>)}
              </div>}
            </Card>)}
          </div>}
          {briefData?.error&&<Card><p style={{color:T.red,fontSize:13}}>{briefData.error}</p></Card>}
          {!briefData&&!briefLoading&&<Card style={{textAlign:"center",padding:40}}>
            <div style={{fontSize:32,marginBottom:12}}>📡</div>
            <p style={{fontSize:14,color:T.sub}}>AI가 실시간 뉴스를 분석하여<br/>투자 인사이트를 생성합니다</p>
          </Card>}
        </div>}

        {/* Fortune × Signal */}
        {briefSub==="fortune"&&<div>
          {!hasSaju&&<Card style={{textAlign:"center",padding:30}}>
            <div style={{fontSize:28,marginBottom:10}}>🔮</div>
            <p style={{fontSize:14,color:T.sub,marginBottom:16}}>사주 분석을 먼저 진행해주세요</p>
            <Btn primary onClick={()=>goFortuneSub("input")}>사주 입력하기</Btn>
          </Card>}
          {hasSaju&&oh&&<div>
            {/* 투자 체질 분석 */}
            <Card style={{marginBottom:12}}>
              <div style={{fontSize:11,color:T.purple,fontWeight:700,letterSpacing:".04em",marginBottom:12}}>투자 체질 분석</div>
              <div style={{display:"flex",gap:4,height:32,borderRadius:8,overflow:"hidden",marginBottom:12}}>
                {Object.entries(oh).map(([k,v])=>v>0&&<div key={k} style={{flex:v,background:OHC[k],borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
                  <span style={{fontSize:11,fontWeight:700,color:"#000"}}>{OH_ASSET[k].emoji}{OHK[k]}{v}</span>
                </div>)}
              </div>
              {/* 재성 유형 */}
              {saju&&<div style={{padding:12,borderRadius:10,background:T.surface,border:`1px solid ${T.border}`}}>
                <div style={{fontSize:12,color:T.dim,marginBottom:6}}>재성 유형</div>
                {(()=>{
                  const dOh=OH_G[saju.일주.간],dYY=음양간[saju.일주.간];
                  const jaeOh=오행상극[dOh];
                  const jaeAsset=OH_ASSET[jaeOh];
                  return <div>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                      <span style={{fontSize:16}}>{jaeAsset.emoji}</span>
                      <span style={{fontSize:14,fontWeight:700,color:OHC[jaeOh]}}>{OHK[jaeOh]} — {jaeAsset.label}</span>
                    </div>
                    <p style={{fontSize:12,color:T.sub,margin:0}}>{jaeAsset.traits} | {jaeAsset.sectors.join(", ")}</p>
                  </div>;
                })()}
              </div>}
            </Card>

            {/* 맞춤 시장 시그널 */}
            <Card style={{marginBottom:12}}>
              <div style={{fontSize:11,color:T.green,fontWeight:700,letterSpacing:".04em",marginBottom:12}}>맞춤 시장 시그널</div>
              {Object.entries(oh).sort(([,a],[,b])=>b-a).slice(0,3).map(([k,v],i)=><div key={k} style={{marginBottom:10,padding:12,borderRadius:10,background:`${OHC[k]}08`,border:`1px solid ${OHC[k]}15`}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                  <span style={{fontSize:14}}>{OH_ASSET[k].emoji}</span>
                  <span style={{fontSize:13,fontWeight:700,color:OHC[k]}}>{i===0?"주도":"보충"} — {OHK[k]} {OH_ASSET[k].label}</span>
                </div>
                <p style={{fontSize:12,color:T.sub,margin:"4px 0 0"}}>{OH_ASSET[k].traits} · ETF: {OH_ASSET[k].etf.join(", ")}</p>
              </div>)}
            </Card>

            {/* 이번 주 투자 타이밍 */}
            <Card style={{marginBottom:12}}>
              <div style={{fontSize:11,color:T.amber,fontWeight:700,letterSpacing:".04em",marginBottom:12}}>이번 주 투자 타이밍</div>
              {(()=>{
                const now=new Date();
                const weekDays=[];
                const startOfWeek=new Date(now);startOfWeek.setDate(now.getDate()-now.getDay()+1);
                for(let i=0;i<7;i++){
                  const d=new Date(startOfWeek);d.setDate(startOfWeek.getDate()+i);
                  const dc=calcD(d.getFullYear(),d.getMonth()+1,d.getDate());
                  const rel=getDayRelation(saju.일주.지,dc.지);
                  const hasJae=오행상극[OH_G[saju.일주.간]]===OH_G[dc.간];
                  const grade=getInvestGrade(rel,hasJae);
                  weekDays.push({date:d,간:dc.간,지:dc.지,grade,rel});
                }
                return <div style={{display:"flex",gap:4}}>
                  {weekDays.map((wd,i)=><div key={i} style={{flex:1,textAlign:"center",padding:"8px 2px",borderRadius:10,background:wd.date.toDateString()===now.toDateString()?`${T.purple}15`:"transparent",border:wd.date.toDateString()===now.toDateString()?`1px solid ${T.purple}30`:`1px solid ${T.border}`}}>
                    <div style={{fontSize:9,color:T.dim}}>{["월","화","수","목","금","토","일"][i]}</div>
                    <div style={{fontSize:12,color:"#fff",marginTop:2}}>{wd.date.getDate()}</div>
                    <div style={{fontSize:10,color:T.dim,marginTop:1}}>{GK[wd.간]}{JK[wd.지]}</div>
                    <div style={{marginTop:4,fontSize:11,fontWeight:700,color:GRADE_COLOR[wd.grade]}}>{wd.grade}</div>
                  </div>)}
                </div>;
              })()}
            </Card>

            {!hasBundleSub&&<div style={{padding:16,borderRadius:14,background:`${T.purple}08`,border:`1px solid ${T.purple}15`,textAlign:"center"}}>
              <p style={{fontSize:13,color:T.sub,margin:"0 0 10px"}}>Fortune × Signal은 번들 전용 기능입니다</p>
              <Btn primary onClick={()=>setPw(true)} style={{fontSize:13,padding:"10px 24px"}}>번들 구독 ✦</Btn>
            </div>}

            {/* AI 맞춤 투자 조언 */}
            {hasBundleSub&&<Card style={{marginBottom:12}}>
              <div style={{fontSize:11,color:T.purple,fontWeight:700,letterSpacing:".04em",marginBottom:12}}>AI 맞춤 투자 조언</div>
              {fsLoading&&<div style={{textAlign:"center",padding:20}}><Spin/></div>}
              {fsData&&!fsData.error&&<div>
                {fsData.investType&&<div style={{padding:12,borderRadius:10,background:T.surface,border:`1px solid ${T.border}`,marginBottom:10}}>
                  <div style={{fontSize:14,fontWeight:700,color:"#fff",marginBottom:4}}>{fsData.investType}</div>
                  <p style={{fontSize:12,color:T.sub,margin:0,lineHeight:1.6}}>{fsData.investDesc}</p>
                </div>}
                {fsData.advice&&<div style={{padding:12,borderRadius:10,background:`${T.green}08`,border:`1px solid ${T.green}15`}}>
                  <div style={{fontSize:10,color:T.green,fontWeight:600,marginBottom:4}}>맞춤 조언</div>
                  <p style={{fontSize:12,color:T.sub,margin:0,lineHeight:1.6}}>{fsData.advice}</p>
                </div>}
                {fsData.cautionSector&&<div style={{marginTop:8,padding:12,borderRadius:10,background:`${T.red}08`,border:`1px solid ${T.red}15`}}>
                  <div style={{fontSize:10,color:T.red,fontWeight:600,marginBottom:4}}>주의 섹터</div>
                  <p style={{fontSize:12,color:T.sub,margin:0,lineHeight:1.6}}>{fsData.cautionSector}</p>
                </div>}
              </div>}
              {!fsData&&!fsLoading&&<Btn primary onClick={async()=>{setFsLoading(true);const d=await fetchFortuneSignal({},oh);setFsData(d);setFsLoading(false)}} style={{width:"100%",fontSize:13}}>AI 투자 조언 받기</Btn>}
            </Card>}
          </div>}
        </div>}

        {/* Lucky Timing Calendar */}
        {briefSub==="calendar"&&<div>
          {!hasSaju&&<Card style={{textAlign:"center",padding:30}}>
            <div style={{fontSize:28,marginBottom:10}}>📅</div>
            <p style={{fontSize:14,color:T.sub,marginBottom:16}}>사주 분석을 먼저 진행해주세요</p>
            <Btn primary onClick={()=>goFortuneSub("input")}>사주 입력하기</Btn>
          </Card>}
          {hasSaju&&<div>
            {/* Month Nav */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <button onClick={()=>{if(calMonth===1){setCalMonth(12);setCalYear(y=>y-1)}else setCalMonth(m=>m-1)}} style={{background:"none",border:"none",color:T.sub,fontSize:18,cursor:"pointer"}}>◂</button>
              <div style={{fontSize:16,fontWeight:700,color:"#fff"}}>{calYear}년 {calMonth}월</div>
              <button onClick={()=>{if(calMonth===12){setCalMonth(1);setCalYear(y=>y+1)}else setCalMonth(m=>m+1)}} style={{background:"none",border:"none",color:T.sub,fontSize:18,cursor:"pointer"}}>▸</button>
            </div>

            {/* Calendar Grid */}
            <Card style={{padding:14}}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:4}}>
                {["일","월","화","수","목","금","토"].map(d=><div key={d} style={{textAlign:"center",fontSize:10,color:T.dim,padding:"4px 0",fontWeight:600}}>{d}</div>)}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
                {(()=>{
                  const firstDay=new Date(calYear,calMonth-1,1).getDay();
                  const blanks=Array.from({length:firstDay},(_,i)=>({blank:true,key:`b${i}`}));
                  const days=calDays.map(d=>({...d,blank:false,key:`d${d.day}`}));
                  return[...blanks,...days].map(d=>{
                    if(d.blank)return <div key={d.key}/>;
                    const isToday=calYear===today.getFullYear()&&calMonth===today.getMonth()+1&&d.day===today.getDate();
                    return <div key={d.key} onClick={()=>setCalSelected(d)} style={{textAlign:"center",padding:"6px 2px",borderRadius:8,cursor:"pointer",background:isToday?`${T.purple}15`:calSelected?.day===d.day?`${T.surface}`:"transparent",border:isToday?`1px solid ${T.purple}30`:calSelected?.day===d.day?`1px solid ${T.border}`:"1px solid transparent"}}>
                      <div style={{fontSize:12,color:isToday?"#fff":T.sub,fontWeight:isToday?700:400}}>{d.day}</div>
                      <div style={{fontSize:8,color:T.dim}}>{GK[d.간]}{JK[d.지]}</div>
                      <div style={{fontSize:10,fontWeight:700,color:GRADE_COLOR[d.grade],marginTop:1}}>{d.grade}</div>
                    </div>;
                  });
                })()}
              </div>
            </Card>

            {/* Selected Day Detail */}
            {calSelected&&<Card style={{marginTop:12}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div>
                  <span style={{fontSize:16,fontWeight:700,color:"#fff"}}>{calMonth}월 {calSelected.day}일</span>
                  <span style={{fontSize:12,color:T.dim,marginLeft:8}}>{GK[calSelected.간]}{JK[calSelected.지]}일</span>
                </div>
                <span style={{fontSize:18,fontWeight:800,color:GRADE_COLOR[calSelected.grade]}}>{calSelected.grade}</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                <div style={{padding:10,borderRadius:10,background:T.surface,border:`1px solid ${T.border}`}}>
                  <div style={{fontSize:10,color:T.dim}}>일진 관계</div>
                  <div style={{fontSize:13,fontWeight:600,color:T.text,marginTop:2}}>{calSelected.rel}</div>
                </div>
                <div style={{padding:10,borderRadius:10,background:T.surface,border:`1px solid ${T.border}`}}>
                  <div style={{fontSize:10,color:T.dim}}>재성 출현</div>
                  <div style={{fontSize:13,fontWeight:600,color:calSelected.hasJae?T.green:T.dim,marginTop:2}}>{calSelected.hasJae?"✓ 재물 기운":"—"}</div>
                </div>
              </div>
              <div style={{marginTop:10,padding:10,borderRadius:10,background:`${GRADE_COLOR[calSelected.grade]}08`,border:`1px solid ${GRADE_COLOR[calSelected.grade]}20`}}>
                <div style={{fontSize:10,color:GRADE_COLOR[calSelected.grade],fontWeight:600,marginBottom:4}}>추천 액션</div>
                <p style={{fontSize:12,color:T.sub,margin:0,lineHeight:1.6}}>
                  {calSelected.grade==="A+"?"생합일 — 적극 매수/매도 결정에 최적. 큰 계약, 투자 실행일로 활용하세요."
                  :calSelected.grade==="A"?`상생일 — ${OH_ASSET[OH_J[calSelected.지]]?.label||"관련"} 섹터에 주목. 신규 종목 편입 검토에 좋습니다.`
                  :calSelected.grade==="B"?"비화일 — 평이한 에너지. 기존 포지션 유지하며 리밸런싱 정도만 검토하세요."
                  :calSelected.grade==="C"?"상극일 — 신중 판단 필요. 소액 분할 매수만 고려하고 대규모 거래는 피하세요."
                  :"충일 — 에너지 충돌. 투자 결정을 미루고 관망하세요. 정보 수집에 집중하는 날."}
                </p>
                {calSelected.hasJae&&<p style={{fontSize:11,color:T.green,margin:"6px 0 0",fontWeight:600}}>💰 재성 출현 — 재물 기운이 활성화되는 날입니다</p>}
              </div>
            </Card>}

            {/* 등급 범례 */}
            <div style={{display:"flex",gap:8,marginTop:12,justifyContent:"center"}}>
              {Object.entries(GRADE_COLOR).map(([g,c])=><div key={g} style={{display:"flex",alignItems:"center",gap:4}}>
                <div style={{width:8,height:8,borderRadius:2,background:c}}/>
                <span style={{fontSize:10,color:T.dim}}>{g}</span>
              </div>)}
            </div>

            {!hasBundleSub&&<div style={{marginTop:16,padding:16,borderRadius:14,background:`${T.purple}08`,border:`1px solid ${T.purple}15`,textAlign:"center"}}>
              <p style={{fontSize:13,color:T.sub,margin:"0 0 10px"}}>Lucky Timing Calendar는 번들 전용 기능입니다</p>
              <Btn primary onClick={()=>setPw(true)} style={{fontSize:13,padding:"10px 24px"}}>번들 구독 ✦</Btn>
            </div>}
          </div>}
        </div>}
      </div>}

      {/* ═══════════════════════════════════════
           TAB 4: 💬 COACH
         ═══════════════════════════════════════ */}
      {pg==="coachHub"&&<div style={page}>
        <PageTitle emoji="💬" title="AI 코치" sub="사주 기반 맞춤 상담"/>
        {!hasSaju&&<Card style={{textAlign:"center",padding:30}}>
          <div style={{fontSize:28,marginBottom:10}}>💬</div>
          <p style={{fontSize:14,color:T.sub,marginBottom:16}}>사주 분석을 먼저 진행해주세요</p>
          <Btn primary onClick={()=>goFortuneSub("input")}>사주 입력하기</Btn>
        </Card>}
        {hasSaju&&<div style={{display:"flex",flexDirection:"column",gap:10}}>
          {[
            {emoji:"💕",title:"AI 연애 코치",desc:"사주 궁합 기반 연애 상담. 데이트 타이밍, 고백법, 화해법까지.",badge:"BUNDLE",bc:T.pink,type:"relationship",quickQ:["오늘 데이트 어때?","고백 타이밍","다툼 후 화해법","상대 마음 읽기"]},
            {emoji:"💼",title:"커리어 타이밍 코치",desc:"사주 관운(官運) 기반 이직·승진·사업 타이밍 코칭.",badge:"BUNDLE",bc:T.blue,type:"career",quickQ:["이직 타이밍","연봉 협상 시기","사업 시작 시점","승진 가능성"]},
            {emoji:"🏥",title:"웰니스 가이드",desc:"오행 체질 기반 식단·운동·수면 가이드.",badge:"BUNDLE",bc:T.green,type:"wellness"},
          ].map((item,i)=><Card key={i} style={{cursor:"pointer",padding:20,border:`1px solid ${item.bc}15`,background:`${item.bc}04`}} onClick={()=>{if(hasBundleSub){if(item.type==="wellness")doWellness();else startCoach(item.type)}else setPw(true)}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:14}}>
              <div style={{width:48,height:48,borderRadius:14,background:`${item.bc}12`,border:`1px solid ${item.bc}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{item.emoji}</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                  <span style={{fontSize:16,fontWeight:700,color:"#fff"}}>{item.title}</span>
                  <span style={{padding:"2px 8px",borderRadius:50,background:`${item.bc}15`,color:item.bc,fontSize:9,fontWeight:700}}>{item.badge}</span>
                </div>
                <p style={{fontSize:12,color:T.sub,margin:0,lineHeight:1.6}}>{item.desc}</p>
                {item.quickQ&&<div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:10}}>
                  {item.quickQ.map((q,j)=><span key={j} style={{fontSize:10,padding:"4px 10px",borderRadius:50,background:`${item.bc}10`,border:`1px solid ${item.bc}15`,color:item.bc}}>{q}</span>)}
                </div>}
              </div>
            </div>
          </Card>)}
        </div>}
      </div>}

      {/* ═══════════════════════════════════════
           TAB 5: 👤 MY
         ═══════════════════════════════════════ */}
      {pg==="myPage"&&<div style={page}>
        <PageTitle title="마이페이지"/>

        {/* 구독 상태 */}
        <Card style={{marginBottom:12,padding:"18px",background:prem?"linear-gradient(135deg,rgba(139,92,246,0.15),rgba(99,102,241,0.08))":T.card}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:11,color:T.dim,fontWeight:600}}>구독 상태</div>
              <div style={{fontSize:18,fontWeight:800,color:prem?T.purple:"#fff",marginTop:4}}>{prem?"PREMIUM 번들":"무료"}</div>
            </div>
            {!prem&&<Btn primary onClick={()=>setPw(true)} style={{fontSize:12,padding:"8px 18px"}}>업그레이드 ✦</Btn>}
          </div>
        </Card>

        {/* 구독 플랜 비교 */}
        {!prem&&<Card style={{marginBottom:12}}>
          <div style={{fontSize:13,color:T.dim,fontWeight:600,marginBottom:12}}>구독 플랜</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {[
              {name:"무료",price:"₩0",features:["기본 사주 3회/일","브리핑 1회/일","궁합 공유 카드"],active:subTier==="free"},
              {name:"사주 Only",price:"₩4,900",features:["무제한 사주 분석","프리미엄 리포트","AI 질문 채팅"],active:subTier==="saju",tier:"saju"},
              {name:"브리핑 Only",price:"₩9,900",features:["무제한 브리핑","연쇄영향 전체","Telegram 알림"],active:subTier==="briefing",tier:"briefing"},
              {name:"번들",price:"₩14,900",features:["모든 기능 포함","Fortune×Signal","Lucky Calendar","AI 코치"],active:subTier==="bundle",tier:"bundle",highlight:true},
            ].map((plan,i)=><div key={i} style={{padding:14,borderRadius:12,background:plan.highlight?`${T.purple}10`:T.surface,border:`1px solid ${plan.highlight?T.purple+"30":T.border}`,cursor:"pointer"}} onClick={()=>{if(plan.tier){setSubTier(plan.tier);if(plan.tier==="bundle")setPrem(true)}}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <span style={{fontSize:14,fontWeight:700,color:"#fff"}}>{plan.name}</span>
                <span style={{fontSize:14,fontWeight:800,color:plan.highlight?T.purple:T.sub}}>{plan.price}</span>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                {plan.features.map((f,j)=><span key={j} style={{fontSize:11,color:T.dim,background:`${T.surface}`,padding:"2px 8px",borderRadius:50}}>{f}</span>)}
              </div>
            </div>)}
          </div>
        </Card>}

        {/* 언어 설정 */}
        <Card style={{marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:14,color:T.sub}}>언어</span>
            <div style={{display:"flex",gap:4}}>
              {[{k:"kr",l:"한국어"},{k:"en",l:"English"}].map(l=><Pill key={l.k} active={appLang===l.k} onClick={()=>setAppLang(l.k)} style={{padding:"4px 12px",fontSize:12}}>{l.l}</Pill>)}
            </div>
          </div>
        </Card>

        {/* 분석 히스토리 */}
        <Card style={{marginBottom:12}}>
          <div style={{fontSize:13,color:T.dim,fontWeight:600,marginBottom:10}}>분석 히스토리</div>
          {history.length===0&&<p style={{fontSize:13,color:T.dim}}>아직 분석 기록이 없어요</p>}
          {history.slice(0,5).map((h,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:i<history.length-1?`1px solid ${T.border}`:"none"}}>
            <span style={{fontSize:13,color:T.sub}}>{h.type} — {h.name||"미입력"}</span>
            <span style={{fontSize:11,color:T.dim}}>{h.date}</span>
          </div>)}
        </Card>

        {/* 친구 초대 */}
        <Card style={{marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
            <span style={{fontSize:22}}>🎁</span>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:700,color:"#fff"}}>친구 초대</div>
              <div style={{fontSize:12,color:T.dim}}>초대 1명당 프리미엄 3일 무료</div>
            </div>
          </div>
          {/* 초대 코드 + 링크 */}
          <div style={{padding:14,borderRadius:12,background:T.surface,border:`1px solid ${T.border}`,marginBottom:10}}>
            <div style={{fontSize:10,color:T.dim,marginBottom:6}}>나의 초대 코드</div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:16,fontWeight:800,color:T.purple,fontFamily:"'JetBrains Mono','Geist',monospace",letterSpacing:2,flex:1}}>{inviteCode}</span>
              <button onClick={copyInviteLink} style={{padding:"6px 14px",borderRadius:50,border:`1px solid ${T.purple}30`,background:`${T.purple}12`,color:T.purple,fontSize:11,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>{inviteCopied?"복사됨 ✓":"링크 복사"}</button>
            </div>
          </div>
          {/* 초대 현황 */}
          <div style={{display:"flex",gap:8}}>
            <div style={{flex:1,padding:10,borderRadius:10,background:T.surface,border:`1px solid ${T.border}`,textAlign:"center"}}>
              <div style={{fontSize:18,fontWeight:800,color:T.green}}>{inviteCount}</div>
              <div style={{fontSize:10,color:T.dim}}>초대 성공</div>
            </div>
            <div style={{flex:1,padding:10,borderRadius:10,background:T.surface,border:`1px solid ${T.border}`,textAlign:"center"}}>
              <div style={{fontSize:18,fontWeight:800,color:T.purple}}>{inviteCount*3}일</div>
              <div style={{fontSize:10,color:T.dim}}>적립된 무료</div>
            </div>
            <div style={{flex:1,padding:10,borderRadius:10,background:T.surface,border:`1px solid ${T.border}`,textAlign:"center"}}>
              <div style={{fontSize:14,fontWeight:700,color:premExpiry?T.green:T.dim}}>{premExpiry||"—"}</div>
              <div style={{fontSize:10,color:T.dim}}>만료일</div>
            </div>
          </div>
        </Card>

        {/* Telegram 알림 설정 */}
        <Card style={{marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
            <span style={{fontSize:22}}>📬</span>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:700,color:"#fff"}}>Telegram 알림</div>
              <div style={{fontSize:12,color:T.dim}}>매일 아침 시장 브리핑 수신</div>
            </div>
            {tgEnabled&&<span style={{fontSize:10,padding:"4px 10px",borderRadius:50,background:`${T.green}15`,color:T.green,fontWeight:700}}>ON</span>}
          </div>
          {!tgSaved?<div>
            <div style={{padding:10,borderRadius:10,background:`${T.blue}08`,border:`1px solid ${T.blue}12`,marginBottom:10}}>
              <p style={{fontSize:12,color:T.sub,lineHeight:1.6,margin:0}}>1. Telegram에서 <strong style={{color:T.text}}>@NuvoAI_bot</strong> 검색 후 /start<br/>2. 받은 Chat ID를 아래에 입력</p>
            </div>
            <div style={{display:"flex",gap:6}}>
              <input ref={tgRef} defaultValue={tgChatId} placeholder="Chat ID 입력" style={{...INP,flex:1,fontSize:13}}/>
              <Btn primary onClick={()=>{saveTelegram();sendTelegramTest()}} style={{padding:"10px 18px",fontSize:12,whiteSpace:"nowrap"}}>연결</Btn>
            </div>
          </div>:<div>
            <div style={{display:"flex",alignItems:"center",gap:8,padding:12,borderRadius:10,background:T.surface,border:`1px solid ${T.border}`}}>
              <span style={{fontSize:12,color:T.green}}>✓</span>
              <span style={{fontSize:13,color:T.sub,flex:1}}>Chat ID: {tgChatId.slice(0,4)}****</span>
              <button onClick={sendTelegramTest} style={{background:"none",border:`1px solid ${T.border}`,borderRadius:50,padding:"4px 12px",color:T.dim,fontSize:11,cursor:"pointer"}}>테스트</button>
              <button onClick={removeTelegram} style={{background:"none",border:`1px solid ${T.red}30`,borderRadius:50,padding:"4px 12px",color:T.red,fontSize:11,cursor:"pointer"}}>해제</button>
            </div>
          </div>}
        </Card>

        {/* 앱 정보 */}
        <Card>
          <div style={{fontSize:13,color:T.dim}}>
            <p style={{margin:"0 0 6px"}}>NUVO AI v1.0</p>
            <p style={{margin:"0 0 6px",fontSize:12}}>사주 × AI × 시장 시그널 플랫폼</p>
            <p style={{margin:0,fontSize:11}}>문의: support@nuvo.ai</p>
          </div>
        </Card>
      </div>}

      {/* ═══ BOTTOM NAV (5-tab) ═══ */}
      {pg!=="splash"&&pg!=="loading"&&<div style={{position:"fixed",bottom:0,left:0,right:0,background:`${T.bg}ee`,backdropFilter:"blur(16px)",borderTop:`1px solid ${T.border}`,zIndex:100,padding:"6px 0 env(safe-area-inset-bottom,6px)"}}>
        <div style={{maxWidth:480,margin:"0 auto",display:"flex",justifyContent:"space-around"}}>
          {[
            {k:"home",icon:"🏠",l:"홈",fn:goHome},
            {k:"fortune",icon:"🔮",l:"운세",fn:goFortune},
            {k:"briefing",icon:"📡",l:"브리핑",fn:goBriefing},
            {k:"coach",icon:"💬",l:"코치",fn:goCoach},
            {k:"my",icon:"👤",l:"마이",fn:goMy},
          ].map(t=><button key={t.k} onClick={t.fn} style={{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:1,padding:"5px 10px",color:mainTab===t.k?T.purple:T.dim,fontSize:10}}>
            <span style={{fontSize:20,opacity:mainTab===t.k?1:.35}}>{t.icon}</span>
            <span style={{fontWeight:mainTab===t.k?700:400,letterSpacing:"-0.01em"}}>{t.l}</span>
          </button>)}
        </div>
      </div>}
    </div>
  );
}
