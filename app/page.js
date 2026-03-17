"use client";
import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════ */
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

// 십성 관계
const 십성표={
  "비견":{short:"같은 오행·같은 음양",desc:"나와 같은 기운. 경쟁심, 독립심, 자존심이 강해요. 동료나 형제와의 관계를 나타내요.",color:"#A78BFA"},
  "겁재":{short:"같은 오행·다른 음양",desc:"나와 비슷하지만 다른 기운. 승부욕이 강하고 적극적이에요. 재물의 소비를 의미하기도 해요.",color:"#A78BFA"},
  "식신":{short:"내가 생하는·같은 음양",desc:"내가 만들어내는 기운. 표현력, 재능, 먹는 복을 나타내요. 안정적이고 여유로운 기운이에요.",color:"#34D399"},
  "상관":{short:"내가 생하는·다른 음양",desc:"내가 뿜어내는 기운. 창의력과 반항심이 공존해요. 예술적 재능이 있지만 관(직장)을 극하기도 해요.",color:"#34D399"},
  "편재":{short:"내가 극하는·같은 음양",desc:"내가 다스리는 재물. 사업 수완, 투자, 아버지를 나타내요. 큰 돈을 다루지만 변동이 커요.",color:"#FBBF24"},
  "정재":{short:"내가 극하는·다른 음양",desc:"안정적인 재물. 월급, 저축, 성실한 수입을 나타내요. 꾸준하고 알뜰한 재물 관리 능력이에요.",color:"#FBBF24"},
  "편관":{short:"나를 극하는·같은 음양",desc:"나를 압박하는 기운. 직장, 권위, 스트레스를 나타내요. 리더십이 있지만 부담도 커요.",color:"#F472B6"},
  "정관":{short:"나를 극하는·다른 음양",desc:"나를 바로잡는 기운. 명예, 직장, 남편(여성 기준)을 나타내요. 책임감 있고 사회적 성공과 연결돼요.",color:"#F472B6"},
  "편인":{short:"나를 생하는·같은 음양",desc:"나를 키우는 편향된 기운. 학문, 종교, 특수 기술을 나타내요. 창의적이지만 고독할 수 있어요.",color:"#60A5FA"},
  "정인":{short:"나를 생하는·다른 음양",desc:"나를 키우는 바른 기운. 어머니, 학문, 자격증을 나타내요. 배움을 좋아하고 도움을 잘 받는 기운이에요.",color:"#60A5FA"}
};
const 오행상생={목:"화",화:"토",토:"금",금:"수",수:"목"};
const 오행상극={목:"토",화:"금",토:"수",금:"목",수:"화"};

function get십성(dayOh, dayYY, targetOh, targetYY) {
  const sameOh = dayOh === targetOh;
  const sameYY = dayYY === targetYY;
  if (sameOh && sameYY) return "비견";
  if (sameOh && !sameYY) return "겁재";
  if (오행상생[dayOh] === targetOh && sameYY) return "식신";
  if (오행상생[dayOh] === targetOh && !sameYY) return "상관";
  if (오행상극[dayOh] === targetOh && sameYY) return "편재";
  if (오행상극[dayOh] === targetOh && !sameYY) return "정재";
  if (오행상극[targetOh] === dayOh && sameYY) return "편관";
  if (오행상극[targetOh] === dayOh && !sameYY) return "정관";
  if (오행상생[targetOh] === dayOh && sameYY) return "편인";
  if (오행상생[targetOh] === dayOh && !sameYY) return "정인";
  return "비견";
}

const 음양간={갑:"양",을:"음",병:"양",정:"음",무:"양",기:"음",경:"양",신:"음",임:"양",계:"음"};
const 음양지={자:"양",축:"음",인:"양",묘:"음",진:"양",사:"음",오:"양",미:"음",신:"양",유:"음",술:"양",해:"음"};

const TAROT=[
  {name:"The Fool",kr:"광대",meaning:"새로운 시작과 모험",icon:"🃏"},
  {name:"The Magician",kr:"마법사",meaning:"창의력과 의지력",icon:"🪄"},
  {name:"High Priestess",kr:"여사제",meaning:"직관과 내면의 지혜",icon:"🌙"},
  {name:"The Empress",kr:"여황제",meaning:"풍요와 자연의 축복",icon:"👑"},
  {name:"The Emperor",kr:"황제",meaning:"권위와 안정",icon:"🏛"},
  {name:"Hierophant",kr:"교황",meaning:"전통과 가르침",icon:"📿"},
  {name:"The Lovers",kr:"연인",meaning:"사랑과 선택",icon:"💕"},
  {name:"The Chariot",kr:"전차",meaning:"의지와 승리",icon:"⚡"},
  {name:"Strength",kr:"힘",meaning:"용기와 인내",icon:"🦁"},
  {name:"The Hermit",kr:"은둔자",meaning:"내면 탐구",icon:"🏔"},
  {name:"Wheel",kr:"운명의 수레바퀴",meaning:"변화와 순환",icon:"🎡"},
  {name:"Justice",kr:"정의",meaning:"공정과 균형",icon:"⚖️"},
  {name:"Hanged Man",kr:"매달린 사람",meaning:"새로운 관점",icon:"🔄"},
  {name:"Death",kr:"죽음",meaning:"변환과 재탄생",icon:"🦋"},
  {name:"Temperance",kr:"절제",meaning:"조화와 균형",icon:"🏺"},
  {name:"The Devil",kr:"악마",meaning:"속박에서의 해방",icon:"🔥"},
  {name:"The Tower",kr:"탑",meaning:"갑작스런 변화",icon:"💥"},
  {name:"The Star",kr:"별",meaning:"희망과 영감",icon:"⭐"},
  {name:"The Moon",kr:"달",meaning:"직감과 무의식",icon:"🌕"},
  {name:"The Sun",kr:"태양",meaning:"기쁨과 활력",icon:"☀️"},
  {name:"Judgement",kr:"심판",meaning:"결단과 부활",icon:"📯"},
  {name:"The World",kr:"세계",meaning:"완성과 성취",icon:"🌍"},
];

/* ═══ 만세력 ═══ */
const calcY=(y)=>{const g=(y-4)%10,j=(y-4)%12;return{간:천간[g>=0?g:g+10],지:지지[j>=0?j:j+12]}};
const calcM=(y,m)=>{const b=(천간.indexOf(calcY(y).간)%5)*2+2;return{간:천간[(b+m-1)%10],지:지지[(m+1)%12]}};
const calcD=(y,m,d)=>{const a=Math.floor((14-m)/12),yr=y+4800-a,mo=m+12*a-3,j=d+Math.floor((153*mo+2)/5)+365*yr+Math.floor(yr/4)-Math.floor(yr/100)+Math.floor(yr/400)-32045;return{간:천간[(j+9)%10>=0?(j+9)%10:(j+9)%10+10],지:지지[(j+1)%12>=0?(j+1)%12:(j+1)%12+12]}};
const calcH=(dg,h)=>{let hz="자";for(const[s,e,z]of SJ_MAP)if(s>e?(h>=s||h<e):(h>=s&&h<e)){hz=z;break}return{간:천간[((천간.indexOf(dg)%5)*2+지지.indexOf(hz))%10],지:hz}};
const mkSaju=(y,m,d,h)=>{const a=calcY(y),b=calcM(y,m),c=calcD(y,m,d);return{년주:a,월주:b,일주:c,시주:h!==null?calcH(c.간,h):null}};
const cntOH=(s)=>{const c={목:0,화:0,토:0,금:0,수:0};[s.년주,s.월주,s.일주,s.시주].filter(Boolean).forEach(p=>{c[OH_G[p.간]]++;c[OH_J[p.지]]++});return c};
const sStr=(s)=>`${GK[s.년주.간]}${JK[s.년주.지]} ${GK[s.월주.간]}${JK[s.월주.지]} ${GK[s.일주.간]}${JK[s.일주.지]}${s.시주?` ${GK[s.시주.간]}${JK[s.시주.지]}`:""}`;

/* ═══ API ═══ */
const callAI=async(sys,msgs,mt=4000)=>{try{const r=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:mt,system:sys,messages:msgs})});const d=await r.json();return d.content?.map(b=>b.type==="text"?b.text:"").join("")||"분석 결과를 불러올 수 없습니다."}catch(e){return"네트워크 오류가 발생했습니다. 다시 시도해주세요."}};

const SYS=`당신은 40년 경력의 대한민국 최고 사주명리학 대가입니다. 전통 명리학(격국론,용신론,십성론,신살론,합충형파해,대운·세운)에 정통하며 현대적이고 따뜻한 "~해요" 체로 풀이합니다. 한자 용어에 쉬운 설명을 반드시 병기하세요. 긍정적이되 현실적으로 조언하세요.`;

const PROMPTS={
basic:SYS+`\n\n기본 분석 (마크다운, 900자):\n# {이름}님의 사주 풀이\n## 🔮 사주 구성과 기운\n(각 기둥의 의미, 천간합충, 지지합충 언급)\n## ⚖️ 오행 균형과 용신\n(강한/부족한 오행, 용신 제시, 보완법)\n## 🌟 타고난 기질과 재능\n(핵심 성격 3가지, 숨은 재능)\n## 📅 2026년 병오년 운세\n(5-6문장 핵심, 조심할 달, 좋은 달 언급)\n## 💡 오늘의 조언\n(실천 가능한 1가지)\n\n---\n🔒 프리미엄에서 재물운, 연애운, 직업운, 건강운, 월별 운세를 상세하게 확인하세요.`,
premium:SYS+`\n\n프리미엄 상세 분석 (마크다운, 3000자 이상):\n# {이름}님의 프리미엄 사주 분석 ✦\n## 🔮 사주 심층 해석\n(천간 합충, 지지 합충형파해, 각 기둥간 관계)\n## ⚖️ 오행 & 용신 분석\n(균형 상태, 희신·기신, 구체적 보완법 — 색상, 방위, 숫자)\n## 🌟 성격·재능·대인관계\n(일간 기준 상세 성격, 직장 내 스타일, 리더십)\n## 💰 재물운\n(재성 분석, 투자성향, 적합한 재테크, 2026 재물흐름)\n## 💼 직업운\n(적합 직종 TOP 3, 이직 최적 시기, 사업 적합도)\n## 💕 연애운 & 결혼운\n(이상적 파트너 오행·띠, 2026 연애흐름, 결혼 시기 암시)\n## 🏥 건강운\n(약한 장기, 주의 질환 계통, 보양 음식, 운동 추천)\n## 📅 2026년 분기별 운세\n### 🌸 1~3월 (봄)\n### ☀️ 4~6월 (여름)\n### 🍂 7~9월 (가을)\n### ❄️ 10~12월 (겨울)\n(각 분기별 핵심 운세, 행운의 날, 조심할 날)\n## 🔄 향후 10년 대운\n(현재 대운~다음 대운 전환 시점, 인생 전환기)\n## 🎯 인생 조언 TOP 5`,
compat:SYS+`\n\n궁합 분석 (마크다운):\n# {n1} ♥ {n2} 궁합 분석\n## 💕 궁합 점수: [XX]/100\n(구체적 근거와 함께)\n## 🔮 두 사주의 관계\n(천간합, 지지합충, 오행 상생상극)\n## 🌟 서로에게 미치는 영향\n### {n1} → {n2}\n### {n2} → {n1}\n## 💪 이 커플의 강점 3가지\n## ⚠️ 주의할 점 3가지 + 해결법\n## 💡 궁합을 높이는 실천법 3가지\n## 📅 2026년 두 사람의 관계 운세`,
daily:SYS+`\n\n오늘(2026년 3월 17일 화요일)의 운세를 마크다운으로 제공하세요 (500자):\n# ✨ 오늘의 운세\n## 총운\n(3-4문장)\n## 행운 포인트\n- 🎨 행운의 색: [구체적 색상]\n- 🔢 행운의 숫자: [숫자]\n- 🧭 행운의 방위: [방위]\n- 🍽 행운의 음식: [음식]\n- 👔 행운의 코디: [코디 팁]\n## ⏰ 시간대별 흐름\n- 오전: \n- 오후: \n- 저녁: \n## 💡 오늘의 한마디\n(따뜻하고 실천 가능한 조언)`,
tarot:SYS+`\n\n사주 기반 타로 해석 (마크다운, 700자):\n# 🎴 타로 리딩\n## 과거 — {card1}\n(사주의 과거 흐름과 연결)\n## 현재 — {card2}\n(현재 사주 운세와 연결)\n## 미래 — {card3}\n(앞으로의 운의 흐름과 연결)\n## 🔮 종합 메시지\n(3장의 카드가 하나의 이야기로 연결되는 해석)\n\n따뜻하고 희망적인 톤.`,
category:SYS+`\n\n{category} 상세 분석 (마크다운, 800자):\n사주 정보를 기반으로 {category}에 대해 깊이 있게 분석해주세요. 구체적 시기, 수치, 실천 방법을 포함하세요.`
};

/* ═══ COMPONENTS ═══ */
function Md({text}){
  if(!text)return null;
  const f=s=>s.replace(/\*\*(.*?)\*\*/g,'<strong style="color:#E0D4FF">$1</strong>').replace(/\*(.*?)\*/g,'<em style="color:#A78BFA">$1</em>');
  return text.split("\n").map((l,i)=>{
    if(l.startsWith("### "))return<h3 key={i} style={{fontSize:"15px",fontWeight:600,color:"#A78BFA",margin:"14px 0 5px"}}>{l.slice(4)}</h3>;
    if(l.startsWith("## "))return<h2 key={i} style={{fontSize:"18px",fontWeight:600,color:"#E0D4FF",margin:"20px 0 7px"}}>{l.slice(3)}</h2>;
    if(l.startsWith("# "))return<h1 key={i} style={{fontSize:"22px",fontWeight:700,color:"#fff",margin:"0 0 10px"}}>{l.slice(2)}</h1>;
    if(l.startsWith("---"))return<div key={i} style={{height:"1px",background:"linear-gradient(90deg,transparent,#A78BFA22,transparent)",margin:"16px 0"}}/>;
    if(l.startsWith("- "))return<p key={i} style={{margin:"2px 0 2px 12px",color:"#B4A8D2",fontSize:"15px",lineHeight:1.85}}><span style={{color:"#A78BFA",marginRight:"5px",fontSize:"5px",verticalAlign:"middle"}}>●</span><span dangerouslySetInnerHTML={{__html:f(l.slice(2))}}/></p>;
    if(l.match(/^\d+\.\s/))return<p key={i} style={{margin:"2px 0 2px 12px",color:"#B4A8D2",fontSize:"15px",lineHeight:1.85}} dangerouslySetInnerHTML={{__html:f(l)}}/>;
    if(!l.trim())return<div key={i} style={{height:"4px"}}/>;
    return<p key={i} style={{margin:"2px 0",color:"#B4A8D2",fontSize:"15px",lineHeight:1.855}} dangerouslySetInnerHTML={{__html:f(l)}}/>;
  });
}

const G=({children,style,...p})=><div style={{background:"rgba(255,255,255,0.035)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"16px",padding:"20px",...style}} {...p}>{children}</div>;

/* ═══ Enhanced 사주원국표 ═══ */
function SajuTable({saju, oh}){
  const dayG = saju.일주.간;
  const dayOh = OH_G[dayG];
  const dayYY = 음양간[dayG];
  
  const pillars = [
    saju.시주 ? {label:"시주",한:"時柱",...saju.시주} : null,
    {label:"일주",한:"日柱",...saju.일주},
    {label:"월주",한:"月柱",...saju.월주},
    {label:"년주",한:"年柱",...saju.년주},
  ].filter(Boolean);

  return(
    <div style={{overflowX:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:"12px"}}>
        <thead>
          <tr>
            <td style={{padding:"4px 8px",color:"#4A4060",fontSize:"10px",fontWeight:600,letterSpacing:"1px"}}></td>
            {pillars.map((p,i)=>(
              <th key={i} style={{padding:"6px",textAlign:"center",color:p.label==="일주"?"#A78BFA":"#6B5F8A",fontSize:"10px",fontWeight:600,letterSpacing:"1px",borderBottom:"1px solid rgba(167,139,250,0.1)"}}>
                {p.한}<br/><span style={{fontSize:"9px",color:"#4A4060"}}>{p.label}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* 십성 row */}
          <tr>
            <td style={{padding:"4px 6px",color:"#4A4060",fontSize:"9px",textAlign:"right"}}>십성</td>
            {pillars.map((p,i)=>{
              const ss = get십성(dayOh, dayYY, OH_G[p.간], 음양간[p.간]);
              const ssData = 십성표[ss];
              return <td key={i} style={{padding:"4px",textAlign:"center",color:p.label==="일주"?"#A78BFA":(ssData?.color||"#8B7FA8"),fontSize:"10px",cursor:p.label!=="일주"?"help":"default",position:"relative"}} title={ssData?.desc||""}>{p.label==="일주"?"일간":ss}</td>;
            })}
          </tr>
          {/* 천간 row */}
          <tr>
            <td style={{padding:"4px 6px",color:"#4A4060",fontSize:"9px",textAlign:"right"}}>천간</td>
            {pillars.map((p,i)=>{
              const c = OHC[OH_G[p.간]];
              return <td key={i} style={{padding:"8px 4px",textAlign:"center",background:p.label==="일주"?"rgba(167,139,250,0.08)":"transparent",borderRadius:"6px"}}>
                <div style={{fontSize:"26px",fontWeight:300,color:"#fff"}}>{GK[p.간]}</div>
                <div style={{fontSize:"8px",color:c,fontWeight:600,marginTop:"2px"}}>{OHK[OH_G[p.간]]} {음양간[p.간]}</div>
              </td>;
            })}
          </tr>
          {/* 지지 row */}
          <tr>
            <td style={{padding:"4px 6px",color:"#4A4060",fontSize:"9px",textAlign:"right"}}>지지</td>
            {pillars.map((p,i)=>{
              const c = OHC[OH_J[p.지]];
              const ss = get십성(dayOh, dayYY, OH_J[p.지], 음양지[p.지]);
              return <td key={i} style={{padding:"8px 4px",textAlign:"center",borderTop:"1px solid rgba(167,139,250,0.06)"}}>
                <div style={{fontSize:"26px",fontWeight:300,color:"#fff"}}>{JK[p.지]}</div>
                <div style={{fontSize:"8px",color:c,fontWeight:600,marginTop:"2px"}}>{OHK[OH_J[p.지]]} {음양지[p.지]}</div>
                <div style={{fontSize:"8px",color:십성표[ss]?.color||"#4A4060",marginTop:"1px",cursor:"help"}} title={십성표[ss]?.desc||""}>{ss}</div>
              </td>;
            })}
          </tr>
        </tbody>
      </table>
      {/* 오행 분포 바 */}
      {oh&&<div style={{marginTop:"14px"}}>
        <div style={{display:"flex",gap:"2px",height:"6px",borderRadius:"3px",overflow:"hidden"}}>
          {Object.entries(oh).map(([k,v])=>v>0&&<div key={k} style={{flex:v,background:OHC[k],opacity:.5,transition:"flex .6s"}}/>)}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:"6px"}}>
          {Object.entries(oh).map(([k,v])=>(
            <div key={k} style={{textAlign:"center",flex:1}}>
              <div style={{fontSize:"14px",fontWeight:600,color:v===0?"#2A2540":OHC[k]}}>{v}</div>
              <div style={{fontSize:"9px",color:"#4A4060"}}>{OHK[k]}</div>
            </div>
          ))}
        </div>
      </div>}
    </div>
  );
}

/* ═══ Fortune Category Cards ═══ */
function CategoryCards({onSelect}){
  const cats=[
    {id:"wealth",emoji:"💰",label:"재물운",color:"#FBBF24",desc:"돈·투자·재테크"},
    {id:"love",emoji:"💕",label:"연애운",color:"#F472B6",desc:"연애·결혼·인연"},
    {id:"career",emoji:"💼",label:"직업운",color:"#A78BFA",desc:"취업·이직·승진"},
    {id:"health",emoji:"🏥",label:"건강운",color:"#34D399",desc:"건강·체력·주의"},
    {id:"study",emoji:"📚",label:"학업운",color:"#60A5FA",desc:"시험·자격·학습"},
    {id:"luck",emoji:"🍀",label:"행운",color:"#F59E0B",desc:"행운의 날·방위·색"},
  ];
  return(
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"8px"}}>
      {cats.map(c=>(
        <div key={c.id} onClick={()=>onSelect(c)} style={{cursor:"pointer",background:`${c.color}08`,border:`1px solid ${c.color}20`,borderRadius:"12px",padding:"14px 8px",textAlign:"center",transition:"all .2s"}}
          onMouseEnter={e=>e.currentTarget.style.borderColor=`${c.color}50`}
          onMouseLeave={e=>e.currentTarget.style.borderColor=`${c.color}20`}>
          <div style={{fontSize:"22px",marginBottom:"4px"}}>{c.emoji}</div>
          <div style={{fontSize:"14px",fontWeight:600,color:"#E0D4FF"}}>{c.label}</div>
          <div style={{fontSize:"11px",color:"#6B5F8A",marginTop:"2px"}}>{c.desc}</div>
        </div>
      ))}
    </div>
  );
}

/* ═══ Tarot Card ═══ */
function TarotCard({card,flipped,onClick,delay}){
  return<div onClick={onClick} style={{width:"88px",height:"136px",perspective:"600px",cursor:flipped?"default":"pointer",animation:`fadeIn .5s ease ${delay}s both`}}>
    <div style={{width:"100%",height:"100%",position:"relative",transformStyle:"preserve-3d",transition:"transform 0.8s cubic-bezier(.4,0,.2,1)",transform:flipped?"rotateY(180deg)":"rotateY(0)"}}>
      <div style={{position:"absolute",inset:0,backfaceVisibility:"hidden",borderRadius:"12px",background:"linear-gradient(145deg,#1E1A30,#2A2540)",border:"1px solid rgba(167,139,250,0.2)",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{width:"56px",height:"86px",borderRadius:"6px",border:"1px solid rgba(167,139,250,0.12)",display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(167,139,250,0.04)"}}>
          <span style={{fontSize:"18px",color:"#A78BFA",opacity:.4}}>✦</span>
        </div>
      </div>
      <div style={{position:"absolute",inset:0,backfaceVisibility:"hidden",transform:"rotateY(180deg)",borderRadius:"12px",background:"linear-gradient(145deg,#1A1530,#0F0D24)",border:"1px solid rgba(167,139,250,0.25)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"8px",textAlign:"center"}}>
        <span style={{fontSize:"26px",marginBottom:"4px"}}>{card?.icon}</span>
        <span style={{fontSize:"10px",fontWeight:600,color:"#E0D4FF",lineHeight:1.2}}>{card?.kr}</span>
        <span style={{fontSize:"7px",color:"#6B5F8A",marginTop:"2px"}}>{card?.name}</span>
      </div>
    </div>
  </div>;
}


/* ═══ Stars BG ═══ */
function Stars(){
  const s=Array.from({length:30},()=>({x:Math.random()*100,y:Math.random()*100,s:Math.random()*1.2+.3,d:Math.random()*5+2}));
  return<div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0}}>{s.map((p,i)=><div key={i} style={{position:"absolute",left:`${p.x}%`,top:`${p.y}%`,width:`${p.s}px`,height:`${p.s}px`,borderRadius:"50%",background:"#fff",opacity:.08,animation:`tw ${p.d}s ease infinite`}}/>)}</div>;
}

/* ═══════════════════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════════════════ */
export default function SajuV2(){
  const[pg,setPg]=useState("splash");
  const[nm,sNm]=useState("");const[gd,sGd]=useState("");
  const[by,sBY]=useState("");const[bm,sBM]=useState("");const[bd,sBD]=useState("");
  const[selectedSijin,setSijin]=useState(null); // null = 모름, "자"~"해"
  const[q,sQ]=useState("");
  const[nm2,sNm2]=useState("");const[gd2,sGd2]=useState("");
  const[by2,sBY2]=useState("");const[bm2,sBM2]=useState("");const[bd2,sBD2]=useState("");const[sijin2,setSijin2]=useState(null);
  const[saju,setSaju]=useState(null);const[saju2,setSaju2]=useState(null);
  const[oh,setOh]=useState(null);const[oh2,setOh2]=useState(null);
  const[rd,sRd]=useState("");const[ld,sLd]=useState(false);
  const[ch,sCH]=useState([]);const[fu,sFU]=useState("");const[cl,sCL]=useState(false);
  const[tab,setTab]=useState("result");const[pw,sPW]=useState(false);
  const[mode,setMode]=useState("basic");const[prem,sPrem]=useState(false);
  const[li,sLI]=useState(0);const[navTab,setNT]=useState("home");
  // Category
  const[catReading,sCatRd]=useState("");const[showManse,setShowManse]=useState(false);const[catLoading,sCatLd]=useState(false);const[catName,sCatNm]=useState("");
  // Daily
  const[dailyRd,sDailyRd]=useState("");const[dailyLd,sDailyLd]=useState(false);
  // Tarot
  const[tCards,setTC]=useState([]);const[tFlip,setTF]=useState([false,false,false]);const[tRd,setTRd]=useState("");const[tLd,setTLd]=useState(false);

  const cr=useRef(null);const chatInputRef=useRef(null);const chatComposing=useRef(false);const nameInputRef=useRef(null);const yearInputRef=useRef(null);const questionInputRef=useRef(null);const name2InputRef=useRef(null);const year2InputRef=useRef(null);
  const lm=["사주를 펼칩니다","천간의 기운을 읽습니다","지지의 흐름을 봅니다","오행을 살핍니다","용신을 찾습니다","대운을 읽습니다"];

  useEffect(()=>{if(pg==="splash"){const t=setTimeout(()=>setPg("home"),2000);return()=>clearTimeout(t)}},[pg]);
  useEffect(()=>{if(ld){const t=setInterval(()=>sLI(p=>(p+1)%lm.length),2200);return()=>clearInterval(t)}},[ld]);
  useEffect(()=>{cr.current?.scrollIntoView({behavior:"smooth"})},[ch]);

  const canGo=by&&bm&&bd&&gd;
  const hasSaju=!!saju;

  function getHourFromSijin(sj){
    if(!sj)return null;
    const map={자:0,축:2,인:4,묘:6,진:8,사:10,오:12,미:14,신:16,유:18,술:20,해:22};
    return map[sj]??null;
  }

  const run=async(m)=>{
    if(nameInputRef.current)sNm(nameInputRef.current.value);
    if(yearInputRef.current)sBY(yearInputRef.current.value);
    if(questionInputRef.current)sQ(questionInputRef.current.value);
    const currentName=nameInputRef.current?.value||nm;
    const currentYear=yearInputRef.current?.value||by;
    const currentQ=questionInputRef.current?.value||q;
    if(!currentYear||!bm||!bd||!gd)return;
    const h=getHourFromSijin(selectedSijin);
    const s=mkSaju(+currentYear,+bm,+bd,h),o=cntOH(s);
    setSaju(s);setOh(o);setPg("loading");sLd(true);setMode(m);
    const u=`이름:${currentName||nm||"회원"}\n성별:${gd}\n생년월일:${by}년 ${bm}월 ${bd}일\n${selectedSijin?`태어난 시:${시진표.find(x=>x.지===selectedSijin)?.설명||""}(${JK[selectedSijin]}시)`:""}\n사주팔자:${sStr(s)}\n일간:${s.일주.간}(${GK[s.일주.간]})—${OH_G[s.일주.간]}(${OHK[OH_G[s.일주.간]]})\n오행분포:${Object.entries(o).map(([k,v])=>`${OHK[k]}:${v}`).join(", ")}\n띠:${DDI[s.년주.지]}(${DDI_E[s.년주.지]})\n나이:만 ${2026-(+by)}세\n${currentQ?`특별히 궁금한 점:${currentQ}`:"종합 분석을 해주세요."}`;
    const text=await callAI(PROMPTS[m==="premium"?"premium":"basic"].replace("{이름}",nm||"회원"),[{role:"user",content:u}],m==="premium"?4000:2000);
    sRd(text);sCH([{role:"assistant",content:text}]);setPg("result");setTab("result");sLd(false);setNT("result");
  };

  const runCompat=async()=>{
    if(nameInputRef.current)sNm(nameInputRef.current.value);
    if(yearInputRef.current)sBY(yearInputRef.current.value);
    if(name2InputRef.current)sNm2(name2InputRef.current.value);
    if(year2InputRef.current)sBY2(year2InputRef.current.value);
    const y1=yearInputRef.current?.value||by;
    const y2=year2InputRef.current?.value||by2;
    if(!y1||!bm||!bd||!y2||!bm2||!bd2)return;
    const h1=getHourFromSijin(selectedSijin),h2=getHourFromSijin(sijin2);
    const s1=mkSaju(+y1,+bm,+bd,h1),s2=mkSaju(+y2,+bm2,+bd2,h2);
    setSaju(s1);setSaju2(s2);setOh(cntOH(s1));setOh2(cntOH(s2));setPg("loading");sLd(true);setMode("compat");
    const sys=PROMPTS.compat.replace(/\{n1\}/g,nm||"A").replace(/\{n2\}/g,nm2||"B");
    const u=`[첫번째]\n이름:${nm||"A"}, 성별:${gd}\n사주:${sStr(s1)}\n오행:${Object.entries(cntOH(s1)).map(([k,v])=>`${OHK[k]}${v}`).join(" ")}\n\n[두번째]\n이름:${nm2||"B"}, 성별:${gd2}\n사주:${sStr(s2)}\n오행:${Object.entries(cntOH(s2)).map(([k,v])=>`${OHK[k]}${v}`).join(" ")}`;
    const text=await callAI(sys,[{role:"user",content:u}]);
    sRd(text);sCH([{role:"assistant",content:text}]);setPg("result");setTab("result");sLd(false);setNT("result");
  };

  const doChat=async()=>{
    const chatVal=chatInputRef.current?.value||fu;if(!chatVal.trim()||cl)return;const msg=chatVal.trim();sFU("");if(chatInputRef.current)chatInputRef.current.value="";
    sCH(p=>[...p,{role:"user",content:msg}]);sCL(true);
    const msgs=ch.map(m=>({role:m.role,content:m.content}));msgs.push({role:"user",content:msg});
    const text=await callAI(`${SYS}\n이 사람의 사주:${saju?sStr(saju):""}, 일간:${saju?.일주?.간||""}\n위 사주를 기반으로 추가 질문에 마크다운으로 답변하세요. 500자 이내.`,msgs,2000);
    sCH(p=>[...p,{role:"assistant",content:text}]);sCL(false);
  };

  const doDaily=async()=>{
    if(!saju||dailyLd)return;sDailyLd(true);
    const u=`사주:${sStr(saju)}\n일간:${saju.일주.간}(${OH_G[saju.일주.간]})\n오행:${Object.entries(oh||{}).map(([k,v])=>`${OHK[k]}${v}`).join(" ")}\n이름:${nm||"회원"}\n성별:${gd}`;
    const text=await callAI(PROMPTS.daily,[{role:"user",content:u}],1200);sDailyRd(text);sDailyLd(false);
  };

  const doCategory=async(cat)=>{
    if(!saju)return;sCatLd(true);sCatNm(cat.label);setPg("category");setNT("category");
    const sys=PROMPTS.category.replace(/\{category\}/g,cat.label);
    const u=`사주:${sStr(saju)}\n일간:${saju.일주.간}\n오행:${Object.entries(oh||{}).map(([k,v])=>`${OHK[k]}${v}`).join(" ")}\n이름:${nm||"회원"}\n성별:${gd}\n나이:만${2026-(+by)}세\n\n${cat.label}에 대해 상세히 분석해주세요.`;
    const text=await callAI(sys,[{role:"user",content:u}],2000);sCatRd(text);sCatLd(false);
  };

  const doTarot=()=>{
    const shuffled=[...TAROT].sort(()=>Math.random()-.5).slice(0,3);
    setTC(shuffled);setTF([false,false,false]);setTRd("");setPg("tarot");setNT("tarot");
  };

  const flipTarot=(i)=>{
    if(tFlip[i])return;const nf=[...tFlip];nf[i]=true;setTF(nf);
    if(nf.every(Boolean)&&saju){
      setTLd(true);
      const u=`사주:${sStr(saju)}\n일간:${saju.일주.간}\n카드:\n1(과거):${tCards[0].kr}—${tCards[0].meaning}\n2(현재):${tCards[1].kr}—${tCards[1].meaning}\n3(미래):${tCards[2].kr}—${tCards[2].meaning}`;
      const sys=PROMPTS.tarot.replace("{card1}",tCards[0].kr).replace("{card2}",tCards[1].kr).replace("{card3}",tCards[2].kr);
      callAI(sys,[{role:"user",content:u}],1500).then(t=>{setTRd(t);setTLd(false)});
    }
  };

  const reset=()=>{setPg("home");sRd("");sCH([]);setSaju2(null);setTab("result");setNT("home")};

  /* ═══ 시진 선택 컴포넌트 ═══ */
  function SijinPicker({value,onChange}){
    return<div>
      <div style={{marginBottom:"8px",padding:"10px 12px",borderRadius:"8px",background:"rgba(167,139,250,0.04)",border:"1px solid rgba(167,139,250,0.08)"}}>
        <div style={{fontSize:"13px",color:"#8B7FA8",lineHeight:1.7}}>💡 <strong style={{color:"#B4A8D2"}}>왜 분(分)은 입력하지 않나요?</strong><br/>사주명리학은 하루를 12개의 시진(時辰, 2시간 단위)으로 나누어 봐요. 같은 시진 안에서는 3시 10분이든 4시 50분이든 사주가 동일하기 때문에, 몇 분에 태어났는지는 결과에 영향이 없어요.</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"4px"}}>
      <div onClick={()=>onChange(null)} style={{padding:"8px 4px",borderRadius:"8px",textAlign:"center",cursor:"pointer",border:value===null?"1px solid #A78BFA":"1px solid rgba(167,139,250,0.1)",background:value===null?"rgba(167,139,250,0.1)":"transparent",fontSize:"11px",color:value===null?"#E0D4FF":"#4A4060"}}>모름</div>
      {시진표.map(s=>(
        <div key={s.지} onClick={()=>onChange(s.지)} style={{padding:"6px 2px",borderRadius:"8px",textAlign:"center",cursor:"pointer",border:value===s.지?`1px solid ${OHC[OH_J[s.지]]}`:"1px solid rgba(167,139,250,0.08)",background:value===s.지?`${OHC[OH_J[s.지]]}12`:"transparent",transition:"all .15s"}}>
          <div style={{fontSize:"15px",color:"#E0D4FF",fontWeight:value===s.지?600:400}}>{s.시}</div>
          <div style={{fontSize:"10px",color:"#6B5F8A"}}>{s.범위}</div>
        </div>
      ))}
      </div>
    </div>;
  }

  /* ═══ PersonForm ═══ */
  function PF({idx,n,sn,g,sg,y,sy,m,sm,d,sd,sj,ssj,nameRef,yearRef,showSijin=true}){
    const inp={width:"100%",padding:"11px 13px",borderRadius:"10px",border:"1px solid rgba(167,139,250,0.12)",background:"rgba(255,255,255,0.03)",color:"#E0D4FF",fontSize:"16px",fontFamily:"'Pretendard',sans-serif",outline:"none",boxSizing:"border-box"};
    return<div style={{display:"flex",flexDirection:"column",gap:"14px"}}>
      {idx&&<div style={{fontSize:"10px",color:"#A78BFA",fontWeight:600,letterSpacing:"2px"}}>{idx}</div>}
      <div><label style={{display:"block",fontSize:"10px",color:"#6B5F8A",marginBottom:"4px",fontWeight:500}}>이름</label><input ref={nameRef} defaultValue={n} placeholder="이름" style={inp}/></div>
      <div><label style={{display:"block",fontSize:"10px",color:"#6B5F8A",marginBottom:"4px",fontWeight:500}}>성별</label>
        <div style={{display:"flex",gap:"8px"}}>{["남","여"].map(v=><button key={v} onClick={()=>sg(v)} style={{flex:1,padding:"10px",borderRadius:"10px",border:g===v?"1px solid #A78BFA":"1px solid rgba(167,139,250,0.12)",background:g===v?"rgba(167,139,250,0.1)":"transparent",color:g===v?"#E0D4FF":"#4A4060",fontSize:"13px",cursor:"pointer",fontWeight:g===v?600:400}}>{v}</button>)}</div>
      </div>
      <div><label style={{display:"block",fontSize:"10px",color:"#6B5F8A",marginBottom:"4px",fontWeight:500}}>생년월일</label>
        <div style={{display:"flex",gap:"6px"}}><input ref={yearRef} defaultValue={y} placeholder="1990" maxLength={4} style={{...inp,flex:2}}/><select value={m} onChange={e=>sm(e.target.value)} style={{...inp,flex:1,appearance:"none"}}><option value="">월</option>{Array.from({length:12},(_,i)=><option key={i} value={i+1}>{i+1}</option>)}</select><select value={d} onChange={e=>sd(e.target.value)} style={{...inp,flex:1,appearance:"none"}}><option value="">일</option>{Array.from({length:31},(_,i)=><option key={i} value={i+1}>{i+1}</option>)}</select></div>
      </div>
      {showSijin&&<div><label style={{display:"block",fontSize:"10px",color:"#6B5F8A",marginBottom:"6px",fontWeight:500}}>태어난 시 <span style={{color:"#3A3454"}}>(십이시진)</span></label><SijinPicker value={sj} onChange={ssj}/></div>}
    </div>;
  }

  return(
    <div style={{fontFamily:"'Pretendard',-apple-system,sans-serif",background:"linear-gradient(160deg,#0B0A1A 0%,#0F0D24 35%,#140E2E 65%,#0D0B1E 100%)",minHeight:"100vh",color:"#E0D4FF",position:"relative",overflow:"hidden",paddingBottom:"72px"}}>
      <link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" rel="stylesheet"/>
      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes tw{0%,100%{opacity:.04}50%{opacity:.4}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:.2}50%{opacity:.85}}
        @keyframes glow{0%,100%{box-shadow:0 0 15px rgba(167,139,250,.06)}50%{box-shadow:0 0 30px rgba(167,139,250,.12)}}
        @keyframes splashFade{0%{opacity:0;transform:scale(.92)}30%{opacity:1;transform:scale(1)}80%{opacity:1}100%{opacity:0}}
        ::placeholder{color:#3A3454}
        input:focus,textarea:focus,select:focus{border-color:rgba(167,139,250,.3)!important}
        select{appearance:none}
        *::-webkit-scrollbar{width:2px}*::-webkit-scrollbar-thumb{background:#2A2540;border-radius:2px}
        button{transition:all .2s;font-family:'Pretendard',sans-serif}
      `}</style>
      <Stars/>
      <div style={{position:"fixed",top:"-30%",left:"-20%",width:"140%",height:"50%",background:"radial-gradient(ellipse at 30% 50%,rgba(167,139,250,.04),transparent 60%)",pointerEvents:"none",zIndex:0}}/>

      {/* ═══ SPLASH ═══ */}
      {pg==="splash"&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",animation:"splashFade 2s ease forwards"}}>
        <div style={{width:"56px",height:"56px",borderRadius:"50%",background:"radial-gradient(circle,rgba(167,139,250,.1),transparent 70%)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"14px",animation:"glow 2s ease infinite"}}>
          <span style={{fontSize:"22px",color:"#A78BFA"}}>☯</span>
        </div>
        <div style={{fontSize:"7px",letterSpacing:"5px",color:"#4A4060",marginBottom:"6px"}}>AI SAJU</div>
        <h1 style={{fontSize:"24px",fontWeight:700,color:"#fff",margin:0}}>사주명리</h1>
      </div>}

      {/* ═══ PAYWALL ═══ */}
      {pw&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",backdropFilter:"blur(8px)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}} onClick={()=>sPW(false)}>
        <G style={{maxWidth:"340px",width:"100%",textAlign:"center",padding:"28px 22px",animation:"fadeIn .3s"}} onClick={e=>e.stopPropagation()}>
          <div style={{fontSize:"7px",letterSpacing:"3px",color:"#A78BFA",marginBottom:"12px"}}>PREMIUM</div>
          <h2 style={{fontSize:"18px",fontWeight:700,margin:"0 0 4px",color:"#fff"}}>프리미엄 분석</h2>
          <p style={{fontSize:"11px",color:"#4A4060",margin:"0 0 16px"}}>재물·연애·직업·건강·월별·10년 대운</p>
          <div style={{textAlign:"left",marginBottom:"16px"}}>
            {["재물운 상세 분석","연애운 & 이상적 파트너","직업운 & 커리어 로드맵","건강운 & 보양법","분기별 상세 운세","10년 대운 흐름","행운의 색·방위·숫자","무제한 추가 질문"].map((f,i)=>
              <div key={i} style={{display:"flex",alignItems:"center",gap:"6px",marginBottom:"4px",fontSize:"11px",color:"#B4A8D2"}}><span style={{width:"3px",height:"3px",borderRadius:"50%",background:"#A78BFA",flexShrink:0}}/>{f}</div>
            )}
          </div>
          <div style={{marginBottom:"16px"}}><span style={{fontSize:"28px",fontWeight:700,color:"#fff"}}>₩4,900</span><span style={{fontSize:"12px",color:"#4A4060",marginLeft:"3px"}}>/1회</span></div>
          <button onClick={()=>{sPrem(true);sPW(false);if(saju)run("premium")}} style={{width:"100%",padding:"12px",borderRadius:"12px",border:"none",background:"linear-gradient(135deg,#A78BFA,#7C5CFC)",color:"#fff",fontSize:"13px",fontWeight:600,cursor:"pointer"}}>프리미엄 분석 받기</button>
          <button onClick={()=>sPW(false)} style={{background:"none",border:"none",color:"#3A3454",fontSize:"10px",cursor:"pointer",marginTop:"8px"}}>다음에</button>
        </G>
      </div>}

      {/* ═══ HOME ═══ */}
      {pg==="home"&&<div style={{maxWidth:"420px",margin:"0 auto",padding:"40px 20px 20px",position:"relative",zIndex:1}}>
        <div style={{textAlign:"center",marginBottom:"32px",animation:"fadeIn .5s"}}>
          <div style={{width:"52px",height:"52px",margin:"0 auto 12px",borderRadius:"50%",background:"radial-gradient(circle,rgba(167,139,250,.08),transparent 70%)",display:"flex",alignItems:"center",justifyContent:"center",animation:"glow 4s ease infinite"}}>
            <span style={{fontSize:"20px",color:"#A78BFA"}}>☯</span>
          </div>
          <div style={{fontSize:"7px",letterSpacing:"4px",color:"#3A3454",marginBottom:"6px"}}>AI SAJU</div>
          <h1 style={{fontSize:"28px",fontWeight:700,margin:"0 0 6px",color:"#fff"}}>사주명리</h1>
          <p style={{fontSize:"12px",color:"#3A3454"}}>당신의 운명을 읽어드립니다</p>
        </div>

        {/* 오늘의 운세 배너 */}
        {hasSaju&&<G style={{marginBottom:"12px",padding:"14px 16px",cursor:"pointer",background:"linear-gradient(135deg,rgba(167,139,250,.06),rgba(96,165,250,.04))"}} onClick={()=>{if(!dailyRd)doDaily();setPg("daily");setNT("daily")}}>
          <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
            <span style={{fontSize:"20px"}}>✨</span>
            <div style={{flex:1}}><div style={{fontSize:"15px",fontWeight:600,color:"#fff"}}>{nm||"나"}의 오늘의 운세</div><div style={{fontSize:"12px",color:"#4A4060",marginTop:"1px"}}>2026.03.17 화요일</div></div>
            <span style={{fontSize:"12px",color:"#4A4060"}}>→</span>
          </div>
        </G>}

        {/* 주제별 운세 (사주 입력 후) */}
        {hasSaju&&<G style={{marginBottom:"12px",padding:"16px"}}>
          <div style={{fontSize:"13px",color:"#6B5F8A",fontWeight:600,letterSpacing:"1px",marginBottom:"10px"}}>주제별 운세</div>
          <CategoryCards onSelect={doCategory}/>
        </G>}

        {/* 메인 메뉴 */}
        <div style={{display:"flex",flexDirection:"column",gap:"8px",animation:"fadeIn .5s .1s both"}}>
          <G style={{cursor:"pointer",display:"flex",alignItems:"center",gap:"12px",padding:"16px 18px"}} onClick={()=>setPg("input")}
            onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(167,139,250,.2)"} onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,.07)"}>
            <div style={{width:"38px",height:"38px",borderRadius:"10px",background:"rgba(167,139,250,.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"16px",flexShrink:0}}>🔮</div>
            <div style={{flex:1}}><div style={{fontSize:"15px",fontWeight:600,color:"#fff"}}>내 사주 보기</div><div style={{fontSize:"12px",color:"#4A4060",marginTop:"1px"}}>종합 사주 분석</div></div>
          </G>
          <G style={{cursor:"pointer",display:"flex",alignItems:"center",gap:"12px",padding:"16px 18px"}} onClick={()=>setPg("compat")}
            onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(244,114,182,.2)"} onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,.07)"}>
            <div style={{width:"38px",height:"38px",borderRadius:"10px",background:"rgba(244,114,182,.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"16px",flexShrink:0}}>💫</div>
            <div style={{flex:1}}><div style={{fontSize:"15px",fontWeight:600,color:"#fff"}}>궁합 보기</div><div style={{fontSize:"12px",color:"#4A4060",marginTop:"1px"}}>두 사람의 궁합</div></div>
          </G>
          {hasSaju&&<G style={{cursor:"pointer",display:"flex",alignItems:"center",gap:"12px",padding:"16px 18px"}} onClick={doTarot}
            onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(251,191,36,.2)"} onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,.07)"}>
            <div style={{width:"38px",height:"38px",borderRadius:"10px",background:"rgba(251,191,36,.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"16px",flexShrink:0}}>🎴</div>
            <div style={{flex:1}}><div style={{fontSize:"15px",fontWeight:600,color:"#fff"}}>타로 카드</div><div style={{fontSize:"12px",color:"#4A4060",marginTop:"1px"}}>사주 기반 3카드 리딩</div></div>
          </G>}
        </div>
      </div>}

      {/* ═══ INPUT ═══ */}
      {pg==="input"&&<div style={{maxWidth:"420px",margin:"0 auto",padding:"24px 20px 40px",position:"relative",zIndex:1,animation:"fadeIn .3s"}}>
        <button onClick={()=>{setPg("home");setNT("home")}} style={{background:"none",border:"none",color:"#3A3454",cursor:"pointer",fontSize:"11px",marginBottom:"14px"}}>← 돌아가기</button>
        <div style={{textAlign:"center",marginBottom:"18px"}}><span style={{fontSize:"20px"}}>🔮</span><h2 style={{fontSize:"24px",fontWeight:700,color:"#fff",margin:"4px 0 2px"}}>내 사주</h2><p style={{fontSize:"13px",color:"#4A4060",margin:0}}>정확한 정보를 입력할수록 분석이 정밀해져요</p></div>
        <G><PF n={nm} sn={sNm} g={gd} sg={sGd} y={by} sy={sBY} m={bm} sm={sBM} d={bd} sd={sBD} sj={selectedSijin} ssj={setSijin} nameRef={nameInputRef} yearRef={yearInputRef}/>
          <div style={{marginTop:"12px"}}><label style={{display:"block",fontSize:"10px",color:"#6B5F8A",marginBottom:"4px"}}>궁금한 점 <span style={{color:"#3A3454"}}>(선택)</span></label>
            <textarea ref={questionRef} defaultValue={q} placeholder="예: 올해 이직 타이밍이 궁금합니다" rows={2} style={{width:"100%",padding:"11px 13px",borderRadius:"10px",border:"1px solid rgba(167,139,250,0.12)",background:"rgba(255,255,255,0.03)",color:"#E0D4FF",fontSize:"16px",fontFamily:"'Pretendard',sans-serif",outline:"none",boxSizing:"border-box",resize:"vertical",lineHeight:1.5}}/></div>
        </G>
        <div style={{display:"flex",gap:"8px",marginTop:"12px"}}>
          <button onClick={()=>run("basic")} disabled={!canGo} style={{flex:1,padding:"13px",borderRadius:"12px",border:"1px solid rgba(167,139,250,.15)",background:"transparent",color:canGo?"#A78BFA":"#2A2540",fontSize:"13px",fontWeight:600,cursor:canGo?"pointer":"not-allowed"}}>무료 분석</button>
          <button onClick={()=>{if(prem)run("premium");else sPW(true)}} disabled={!canGo} style={{flex:1,padding:"13px",borderRadius:"12px",border:"none",background:canGo?"linear-gradient(135deg,#A78BFA,#7C5CFC)":"#1E1A30",color:canGo?"#fff":"#2A2540",fontSize:"13px",fontWeight:600,cursor:canGo?"pointer":"not-allowed"}}>프리미엄 ✦</button>
        </div>
      </div>}

      {/* ═══ COMPAT ═══ */}
      {pg==="compat"&&<div style={{maxWidth:"420px",margin:"0 auto",padding:"24px 20px 40px",position:"relative",zIndex:1,animation:"fadeIn .3s"}}>
        <button onClick={()=>{setPg("home");setNT("home")}} style={{background:"none",border:"none",color:"#3A3454",cursor:"pointer",fontSize:"11px",marginBottom:"14px"}}>← 돌아가기</button>
        <div style={{textAlign:"center",marginBottom:"18px"}}><span style={{fontSize:"20px"}}>💫</span><h2 style={{fontSize:"24px",fontWeight:700,color:"#fff",margin:"4px 0 0"}}>궁합</h2></div>
        <G style={{marginBottom:"8px"}}><PF idx="첫 번째" n={nm} sn={sNm} g={gd} sg={sGd} y={by} sy={sBY} m={bm} sm={sBM} d={bd} sd={sBD} sj={selectedSijin} ssj={setSijin} nameRef={nameInputRef} yearRef={yearInputRef}/></G>
        <div style={{textAlign:"center",fontSize:"14px",color:"#F472B6",margin:"3px 0"}}>♥</div>
        <G><PF idx="두 번째" n={nm2} sn={sNm2} g={gd2} sg={sGd2} y={by2} sy={sBY2} m={bm2} sm={sBM2} d={bd2} sd={sBD2} sj={sijin2} ssj={setSijin2} nameRef={name2InputRef} yearRef={year2InputRef}/></G>
        <button onClick={runCompat} disabled={!by||!bm||!bd||!by2||!bm2||!bd2} style={{width:"100%",marginTop:"12px",padding:"13px",borderRadius:"12px",border:"none",background:(by&&by2)?"linear-gradient(135deg,#F472B6,#EC4899)":"#1E1A30",color:(by&&by2)?"#fff":"#2A2540",fontSize:"13px",fontWeight:600,cursor:(by&&by2)?"pointer":"not-allowed"}}>궁합 분석</button>
      </div>}

      {/* ═══ LOADING ═══ */}
      {pg==="loading"&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",gap:"18px",position:"relative",zIndex:1}}>
        <div style={{position:"relative",width:"50px",height:"50px"}}>
          <div style={{position:"absolute",inset:0,borderRadius:"50%",border:"1.5px solid rgba(167,139,250,.06)",borderTopColor:"#A78BFA",animation:"spin 2s linear infinite"}}/>
          <div style={{position:"absolute",inset:"6px",borderRadius:"50%",border:"1.5px solid rgba(96,165,250,.04)",borderBottomColor:"#60A5FA",animation:"spin 3s linear reverse infinite"}}/>
          <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"13px",color:"#A78BFA"}}>☯</div>
        </div>
        <p style={{fontSize:"13px",fontWeight:500,color:"#fff",margin:0}}>{lm[li]}</p>
        <div style={{display:"flex",gap:"3px"}}>{[0,1,2].map(i=><div key={i} style={{width:"3px",height:"3px",borderRadius:"50%",background:"#A78BFA",animation:`pulse 1.5s ease ${i*.3}s infinite`}}/>)}</div>
      </div>}

      {/* ═══ DAILY ═══ */}
      {pg==="daily"&&<div style={{maxWidth:"420px",margin:"0 auto",padding:"24px 20px 40px",position:"relative",zIndex:1,animation:"fadeIn .3s"}}>
        <button onClick={()=>{setPg("home");setNT("home")}} style={{background:"none",border:"none",color:"#3A3454",cursor:"pointer",fontSize:"11px",marginBottom:"14px"}}>← 돌아가기</button>
        <div style={{textAlign:"center",marginBottom:"18px"}}><span style={{fontSize:"20px"}}>✨</span><h2 style={{fontSize:"22px",fontWeight:700,color:"#fff",margin:"4px 0 2px"}}>오늘의 운세</h2><p style={{fontSize:"12px",color:"#4A4060",margin:0}}>2026년 3월 17일 화요일</p></div>
        <G>{dailyLd?<div style={{textAlign:"center",padding:"30px 0"}}><div style={{width:"16px",height:"16px",margin:"0 auto",borderRadius:"50%",border:"1.5px solid #1E1A30",borderTopColor:"#A78BFA",animation:"spin 1s linear infinite"}}/><p style={{fontSize:"12px",color:"#4A4060",marginTop:"8px"}}>오늘의 기운을 살피는 중...</p></div>:<Md text={dailyRd}/>}</G>
      </div>}

      {/* ═══ CATEGORY ═══ */}
      {pg==="category"&&<div style={{maxWidth:"420px",margin:"0 auto",padding:"24px 20px 40px",position:"relative",zIndex:1,animation:"fadeIn .3s"}}>
        <button onClick={()=>{setPg("home");setNT("home")}} style={{background:"none",border:"none",color:"#3A3454",cursor:"pointer",fontSize:"11px",marginBottom:"14px"}}>← 돌아가기</button>
        <div style={{textAlign:"center",marginBottom:"18px"}}><h2 style={{fontSize:"22px",fontWeight:700,color:"#fff",margin:0}}>{catName} 상세 분석</h2></div>
        <G>{catLoading?<div style={{textAlign:"center",padding:"30px 0"}}><div style={{width:"16px",height:"16px",margin:"0 auto",borderRadius:"50%",border:"1.5px solid #1E1A30",borderTopColor:"#A78BFA",animation:"spin 1s linear infinite"}}/><p style={{fontSize:"12px",color:"#4A4060",marginTop:"8px"}}>{catName}을(를) 분석하는 중...</p></div>:<Md text={catReading}/>}</G>
      </div>}

      {/* ═══ TAROT ═══ */}
      {pg==="tarot"&&<div style={{maxWidth:"420px",margin:"0 auto",padding:"24px 20px 40px",position:"relative",zIndex:1,animation:"fadeIn .3s"}}>
        <button onClick={()=>{setPg("home");setNT("home")}} style={{background:"none",border:"none",color:"#3A3454",cursor:"pointer",fontSize:"11px",marginBottom:"14px"}}>← 돌아가기</button>
        <div style={{textAlign:"center",marginBottom:"20px"}}><span style={{fontSize:"20px"}}>🎴</span><h2 style={{fontSize:"22px",fontWeight:700,color:"#fff",margin:"4px 0 2px"}}>타로 카드</h2><p style={{fontSize:"12px",color:"#4A4060",margin:0}}>카드를 하나씩 뒤집어 보세요</p></div>
        <div style={{display:"flex",justifyContent:"center",gap:"10px",marginBottom:"10px"}}>
          {["과거","현재","미래"].map((l,i)=><div key={i} style={{textAlign:"center"}}><div style={{fontSize:"8px",color:"#4A4060",marginBottom:"5px",letterSpacing:"1px"}}>{l}</div>{tCards[i]&&<TarotCard card={tCards[i]} flipped={tFlip[i]} onClick={()=>flipTarot(i)} delay={i*.12}/>}</div>)}
        </div>
        {tFlip.every(Boolean)&&<G style={{marginTop:"8px"}}>{tLd?<div style={{textAlign:"center",padding:"16px 0"}}><div style={{width:"14px",height:"14px",margin:"0 auto",borderRadius:"50%",border:"1.5px solid #1E1A30",borderTopColor:"#FBBF24",animation:"spin 1s linear infinite"}}/><p style={{fontSize:"12px",color:"#4A4060",marginTop:"6px"}}>카드를 해석하는 중...</p></div>:<Md text={tRd}/>}</G>}
      </div>}

      {/* ═══ RESULT ═══ */}
      {pg==="result"&&saju&&<div style={{maxWidth:"480px",margin:"0 auto",padding:"20px 16px 80px",position:"relative",zIndex:1,animation:"fadeIn .3s"}}>
        <button onClick={reset} style={{background:"none",border:"none",color:"#3A3454",cursor:"pointer",fontSize:"11px",marginBottom:"10px"}}>← 처음으로</button>

        {/* 사주원국표 */}
        <G style={{marginBottom:"10px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"}}>
            <span style={{fontSize:"12px",color:"#4A4060",letterSpacing:"1px"}}>
              {nm?`${nm} · `:""}{by}.{bm}.{bd} · {DDI_E[saju.년주.지]} {DDI[saju.년주.지]}띠
            </span>
            {mode==="premium"&&<span style={{padding:"2px 7px",borderRadius:"6px",background:"rgba(167,139,250,.1)",color:"#A78BFA",fontSize:"8px",fontWeight:600}}>PREMIUM</span>}
          </div>
          <SajuTable saju={saju} oh={oh}/>
          {/* 만세력 해설 */}
          <div style={{marginTop:"14px",padding:"12px",borderRadius:"10px",background:"rgba(167,139,250,0.03)",border:"1px solid rgba(167,139,250,0.06)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}} onClick={()=>setShowManse(!showManse)}>
              <span style={{fontSize:"13px",fontWeight:600,color:"#8B7FA8"}}>📖 만세력·사주 읽는 법</span>
              <span style={{fontSize:"12px",color:"#4A4060"}}>{showManse?"접기 ▲":"펼치기 ▼"}</span>
            </div>
            {showManse&&<div style={{marginTop:"10px",fontSize:"13px",color:"#6B5F8A",lineHeight:1.8}}>
              <p style={{margin:"0 0 8px"}}><strong style={{color:"#B4A8D2"}}>만세력(萬歲曆)이란?</strong><br/>만 년의 달력이라는 뜻으로, 과거·현재·미래의 천간(天干)과 지지(地支)를 기록한 역법 체계예요. 사주팔자의 기초가 되는 데이터베이스라고 생각하면 돼요.</p>
              <p style={{margin:"0 0 8px"}}><strong style={{color:"#B4A8D2"}}>사주팔자(四柱八字)란?</strong><br/>4개의 기둥(년·월·일·시)과 8개의 글자(천간 4개 + 지지 4개)로 구성돼요. 태어난 시간을 우주의 기운으로 변환한 것이에요.</p>
              <p style={{margin:"0 0 8px"}}><strong style={{color:"#B4A8D2"}}>일간(日干)이 핵심!</strong><br/>일주의 천간이 "나 자신"을 나타내요. 다른 7글자는 나를 둘러싼 환경이에요. 일간을 중심으로 다른 글자와의 관계(십성)를 분석하는 것이 사주풀이의 핵심이에요.</p>
              <p style={{margin:"0 0 8px"}}><strong style={{color:"#B4A8D2"}}>십성(十星) — 나와의 관계</strong><br/>일간을 기준으로 다른 글자가 나에게 어떤 영향을 주는지 10가지로 분류한 거예요. 글자 위에 마우스를 올리면(모바일은 길게 누르면) 각 십성의 의미를 볼 수 있어요.</p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"4px",marginTop:"6px"}}>
                {Object.entries(십성표).map(([k,v])=>(
                  <div key={k} style={{padding:"4px 6px",borderRadius:"4px",background:"rgba(255,255,255,0.02)",fontSize:"10px"}}>
                    <span style={{color:v.color,fontWeight:600}}>{k}</span>
                    <span style={{color:"#4A4060",marginLeft:"4px"}}>{v.short}</span>
                  </div>
                ))}
              </div>
              <p style={{margin:"10px 0 0"}}><strong style={{color:"#B4A8D2"}}>오행(五行) — 우주의 5가지 기운</strong></p>
              <div style={{display:"flex",gap:"6px",marginTop:"4px"}}>
                {[["목","나무","성장·인자",OHC.목],["화","불","열정·예의",OHC.화],["토","흙","안정·신뢰",OHC.토],["금","쇠","결단·의리",OHC.금],["수","물","지혜·소통",OHC.수]].map(([k,n,d,c])=>(
                  <div key={k} style={{flex:1,textAlign:"center",padding:"4px",borderRadius:"4px",background:`${c}08`}}>
                    <div style={{fontSize:"12px",color:c,fontWeight:600}}>{OHK[k]}</div>
                    <div style={{fontSize:"8px",color:"#6B5F8A"}}>{n}</div>
                    <div style={{fontSize:"7px",color:"#4A4060"}}>{d}</div>
                  </div>
                ))}
              </div>
              <p style={{margin:"10px 0 0",color:"#4A4060",fontSize:"10px"}}><strong style={{color:"#6B5F8A"}}>장점:</strong> 수천 년의 통계와 이론에 기반한 체계적 분석. 성격·적성·시기를 입체적으로 조망.<br/><strong style={{color:"#6B5F8A"}}>참고:</strong> 사주는 확정된 운명이 아닌 타고난 기질과 흐름의 경향성이에요. 참고용으로 활용하되, 선택은 항상 본인의 몫이에요.</p>
            </div>}
          </div>
        </G>

        {/* 궁합 상대 */}
        {mode==="compat"&&saju2&&<G style={{marginBottom:"10px"}}>
          <div style={{fontSize:"10px",color:"#F472B6",letterSpacing:"1px",marginBottom:"8px"}}>{nm2||"상대방"} · {by2}.{bm2}.{bd2} · {DDI_E[saju2.년주.지]} {DDI[saju2.년주.지]}띠</div>
          <SajuTable saju={saju2} oh={oh2}/>
        </G>}

        {/* Tabs */}
        <div style={{display:"flex",gap:"3px",marginBottom:"10px"}}>
          {[{k:"result",l:"📜 분석"},{k:"chat",l:"💬 질문"},{k:"share",l:"📤 공유"}].map(t=>
            <button key={t.k} onClick={()=>setTab(t.k)} style={{flex:1,padding:"9px",borderRadius:"10px",background:tab===t.k?"rgba(167,139,250,.08)":"transparent",border:tab===t.k?"1px solid rgba(167,139,250,.12)":"1px solid transparent",color:tab===t.k?"#E0D4FF":"#3A3454",fontSize:"11px",fontWeight:tab===t.k?600:400,cursor:"pointer"}}>{t.l}</button>
          )}
        </div>

        {tab==="result"&&<G><Md text={rd}/>{mode==="basic"&&!prem&&<div style={{position:"relative",margin:"16px 0",borderRadius:"12px",overflow:"hidden"}}>
          <div style={{filter:"blur(4px)",opacity:.12,height:"90px",background:"linear-gradient(135deg,#A78BFA08,#60A5FA08)"}}/>
          <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"6px"}}>
            <span style={{fontSize:"11px",fontWeight:600,color:"#E0D4FF"}}>재물운, 연애운, 건강운, 월별운세...</span>
            <button onClick={()=>sPW(true)} style={{padding:"7px 18px",borderRadius:"8px",border:"none",background:"linear-gradient(135deg,#A78BFA,#7C5CFC)",color:"#fff",fontSize:"11px",fontWeight:600,cursor:"pointer"}}>프리미엄으로 열기 ✦</button>
          </div>
        </div>}</G>}

        {tab==="chat"&&<G style={{minHeight:"160px"}}>
          <div style={{display:"flex",flexWrap:"wrap",gap:"4px",marginBottom:"12px",justifyContent:"center"}}>
            {["이직 시기","재물운","연애운","건강 주의점","내년 운세","궁합 좋은 띠"].map(t=><button key={t} onClick={()=>{const v=t+"이 궁금해요";sFU(v);if(chatInputRef.current)chatInputRef.current.value=v}} style={{padding:"5px 10px",borderRadius:"14px",border:"1px solid rgba(167,139,250,.08)",background:"transparent",color:"#6B5F8A",fontSize:"12px",cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(167,139,250,.25)"} onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(167,139,250,.08)"}>{t}</button>)}
          </div>
          {ch.slice(1).map((m,i)=><div key={i} style={{marginBottom:"10px"}}>
            {m.role==="user"&&<div style={{background:"rgba(167,139,250,.05)",borderRadius:"8px",padding:"8px 10px",borderLeft:"2px solid #A78BFA",marginBottom:"6px"}}><p style={{margin:0,color:"#E0D4FF",fontSize:"12px"}}>{m.content}</p></div>}
            {m.role==="assistant"&&<Md text={m.content}/>}
          </div>)}
          {cl&&<div style={{display:"flex",alignItems:"center",gap:"4px",color:"#3A3454",fontSize:"10px"}}><div style={{width:"10px",height:"10px",borderRadius:"50%",border:"1.5px solid #1E1A30",borderTopColor:"#A78BFA",animation:"spin 1s linear infinite"}}/>답변 중</div>}
          <div ref={cr}/>
        </G>}

        {tab==="share"&&<div style={{textAlign:"center"}}>
          <p style={{fontSize:"12px",color:"#4A4060",marginBottom:"12px"}}>스크린샷으로 공유하세요</p>
          <div style={{width:"280px",margin:"0 auto",padding:"22px 18px",background:"linear-gradient(160deg,#0F0D24,#1A1440,#0F0D24)",borderRadius:"14px",border:"1px solid rgba(167,139,250,.1)",boxShadow:"0 4px 20px rgba(0,0,0,.3)"}}>
            <div style={{fontSize:"7px",letterSpacing:"3px",color:"#3A3454",marginBottom:"6px"}}>AI SAJU</div>
            <div style={{fontSize:"16px",fontWeight:600,color:"#fff",marginBottom:"2px"}}>{nm||"나"}의 사주팔자</div>
            <div style={{fontSize:"9px",color:"#3A3454",marginBottom:"12px"}}>{by}.{bm}.{bd} · {DDI_E[saju.년주.지]} {DDI[saju.년주.지]}띠</div>
            <div style={{display:"flex",justifyContent:"center",gap:"10px",marginBottom:"10px"}}>
              {[saju.시주&&["시",saju.시주],["일",saju.일주],["월",saju.월주],["년",saju.년주]].filter(Boolean).map(([l,p],i)=>
                <div key={i} style={{textAlign:"center"}}><div style={{fontSize:"6px",color:"#3A3454",marginBottom:"2px"}}>{l}</div><div style={{fontSize:"18px",fontWeight:300,color:"#fff",lineHeight:1.2}}>{GK[p.간]}</div><div style={{fontSize:"18px",fontWeight:300,color:"#fff",lineHeight:1.2}}>{JK[p.지]}</div></div>
              )}
            </div>
            <div style={{height:"1px",background:"linear-gradient(90deg,transparent,rgba(167,139,250,.12),transparent)",margin:"8px 0"}}/>
            <div style={{display:"flex",justifyContent:"center",gap:"8px"}}>{Object.entries(oh||{}).map(([k,v])=><span key={k} style={{fontSize:"9px",color:v?OHC[k]:"#1A1430",fontWeight:500}}>{OHK[k]}{v}</span>)}</div>
          </div>
          <button onClick={()=>navigator.clipboard.writeText(`🔮 ${nm||"나"}의 사주: ${sStr(saju)}\n오행: ${Object.entries(oh||{}).map(([k,v])=>`${OHK[k]}${v}`).join(" ")}\n띠: ${DDI_E[saju.년주.지]} ${DDI[saju.년주.지]}\n\nAI 사주명리에서 무료 분석 받기 →`)} style={{marginTop:"12px",padding:"7px 16px",borderRadius:"8px",border:"1px solid rgba(167,139,250,.1)",background:"transparent",color:"#6B5F8A",fontSize:"12px",cursor:"pointer"}}>텍스트 복사</button>
        </div>}

        {tab==="chat"&&<div style={{position:"fixed",bottom:"72px",left:0,right:0,background:"linear-gradient(transparent,#0B0A1A 40%)",padding:"12px 16px 12px",zIndex:10}}>
          <div style={{maxWidth:"480px",margin:"0 auto",display:"flex",gap:"6px"}}>
            <input ref={chatInputRef} defaultValue="" onKeyDown={e=>{if(e.key==="Enter"&&!e.nativeEvent.isComposing){sFU(chatInputRef.current.value);setTimeout(doChat,10)}}} placeholder="질문을 입력하세요" style={{flex:1,padding:"11px 13px",borderRadius:"10px",border:"1px solid rgba(167,139,250,0.12)",background:"rgba(255,255,255,0.03)",color:"#E0D4FF",fontSize:"16px",fontFamily:"'Pretendard',sans-serif",outline:"none",boxSizing:"border-box"}}/>
            <button onClick={()=>{if(chatInputRef.current)sFU(chatInputRef.current.value);setTimeout(doChat,10)}} disabled={cl} style={{padding:"11px 16px",borderRadius:"10px",border:"none",background:fu.trim()?"linear-gradient(135deg,#A78BFA,#7C5CFC)":"#1E1A30",color:fu.trim()?"#fff":"#2A2540",fontSize:"12px",fontWeight:600,cursor:fu.trim()?"pointer":"not-allowed",whiteSpace:"nowrap"}}>질문</button>
          </div>
        </div>}
      </div>}

      {/* ═══ BOTTOM NAV ═══ */}
      {pg!=="splash"&&pg!=="loading"&&<div style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(11,10,26,.9)",backdropFilter:"blur(14px)",WebkitBackdropFilter:"blur(14px)",borderTop:"1px solid rgba(167,139,250,.04)",zIndex:100,padding:"5px 0 env(safe-area-inset-bottom,5px)"}}>
        <div style={{maxWidth:"480px",margin:"0 auto",display:"flex",justifyContent:"space-around"}}>
          {[
            {k:"home",icon:"🏠",l:"홈",fn:()=>{setPg("home");setNT("home")}},
            {k:"saju",icon:"🔮",l:"사주",fn:()=>{setPg("input");setNT("saju")}},
            {k:"tarot",icon:"🎴",l:"타로",fn:()=>{if(hasSaju)doTarot();else{setPg("input");setNT("saju")}}},
            {k:"daily",icon:"✨",l:"오늘",fn:()=>{if(hasSaju){if(!dailyRd)doDaily();setPg("daily");setNT("daily")}else{setPg("input");setNT("saju")}}},
            {k:"result",icon:"📊",l:"결과",fn:()=>{if(rd){setPg("result");setNT("result")}else{setPg("input");setNT("saju")}}},
          ].map(t=>(
            <button key={t.k} onClick={t.fn} style={{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:"1px",padding:"5px 10px",color:navTab===t.k?"#A78BFA":"#2A2540",fontSize:"10px"}}>
              <span style={{fontSize:"20px",opacity:navTab===t.k?1:.4}}>{t.icon}</span>
              <span style={{fontWeight:navTab===t.k?600:400,letterSpacing:".3px"}}>{t.l}</span>
            </button>
          ))}
        </div>
      </div>}
    </div>
  );
}
