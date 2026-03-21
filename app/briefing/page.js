"use client";
import { useState, useEffect, useCallback } from "react";

/* ══════════════════════════════════════════════════════════════
   NUVO AI — Briefing Hub (Product #2)
   Route: /briefing
   Tab 1: Daily Briefing (뉴스 → 인사이트 → 연쇄영향)
   Tab 2: Fortune × Signal (사주 재물운 + 시장 시그널)
   ══════════════════════════════════════════════════════════════ */

// ─── Constants ───
const tagMap = {
  stock: { en: "STOCK", kr: "주식", cls: "tStock" },
  realestate: { en: "REAL ESTATE", kr: "부동산", cls: "tRE" },
  forex: { en: "FOREX", kr: "환율", cls: "tFX" },
  crypto: { en: "CRYPTO", kr: "암호화폐", cls: "tCrypto" },
  macro: { en: "MACRO", kr: "매크로", cls: "tMacro" },
  commodity: { en: "COMMODITY", kr: "원자재", cls: "tMacro" },
};
const catLabels = { en: ["All","Stocks","Real Estate","Forex","Crypto","Macro"], kr: ["전체","주식","부동산","환율","암호화폐","거시경제"] };
const catKeys = ["all","stock","realestate","forex","crypto","macro"];
const OH_COLORS = { 목:"#22c55e", 화:"#ef4444", 토:"#f59e0b", 금:"#e2e8f0", 수:"#3b82f6" };
const OH_HANJA = { 목:"木", 화:"火", 토:"土", 금:"金", 수:"水" };
const OH_BG = { 목:"rgba(34,197,94,0.12)", 화:"rgba(239,68,68,0.12)", 토:"rgba(245,158,11,0.12)", 금:"rgba(226,232,240,0.12)", 수:"rgba(59,130,246,0.12)" };
const DIR_MAP = { bullish:{icon:"▲",color:"#10b981",label:"매수 시그널"}, bearish:{icon:"▼",color:"#ef4444",label:"관망 시그널"}, neutral:{icon:"●",color:"#f59e0b",label:"중립"} };
const MATCH_LABEL = { dominant:"주도 에너지", "补充(보충)":"보충 에너지", seasonal:"시즌 에너지" };

// ─── Saju calculation helpers ───
const 천간=["갑","을","병","정","무","기","경","신","임","계"];
const 지지=["자","축","인","묘","진","사","오","미","신","유","술","해"];
const 오행천간={갑:"목",을:"목",병:"화",정:"화",무:"토",기:"토",경:"금",신:"금",임:"수",계:"수"};
const 오행지지={자:"수",축:"토",인:"목",묘:"목",진:"토",사:"화",오:"화",미:"토",신:"금",유:"금",술:"토",해:"수"};

function calcPillars(y,m,d,h){
  const yg=(y-4)%10,yj=(y-4)%12;
  const yearP={간:천간[yg>=0?yg:yg+10],지:지지[yj>=0?yj:yj+12]};
  const bi=(천간.indexOf(yearP.간)%5)*2+2,mg=(bi+m-1)%10,mj=(m+1)%12;
  const monthP={간:천간[mg],지:지지[mj]};
  const a=Math.floor((14-m)/12),yr=y+4800-a,mo=m+12*a-3;
  const jdn=d+Math.floor((153*mo+2)/5)+365*yr+Math.floor(yr/4)-Math.floor(yr/100)+Math.floor(yr/400)-32045;
  const dg=(jdn+9)%10,dj=(jdn+1)%12;
  const dayP={간:천간[dg>=0?dg:dg+10],지:지지[dj>=0?dj:dj+12]};
  const hm=[[23,1,"자"],[1,3,"축"],[3,5,"인"],[5,7,"묘"],[7,9,"진"],[9,11,"사"],[11,13,"오"],[13,15,"미"],[15,17,"신"],[17,19,"유"],[19,21,"술"],[21,23,"해"]];
  let hz="자"; for(const[s,e,z]of hm){if(s>e?(h>=s||h<e):(h>=s&&h<e)){hz=z;break;}}
  const di=천간.indexOf(dayP.간),hbi=(di%5)*2,hgi=(hbi+지지.indexOf(hz))%10;
  return{year:yearP,month:monthP,day:dayP,hour:{간:천간[hgi],지:hz}};
}
function calcOhang(p){const c={목:0,화:0,토:0,금:0,수:0};for(const v of Object.values(p)){c[오행천간[v.간]]++;c[오행지지[v.지]]++;}return c;}
function calcJaeSung(p){const dayEl=오행천간[p.day.간];const ov={목:"토",화:"금",토:"수",금:"목",수:"화"};const t=ov[dayEl];const all=Object.values(p).flatMap(v=>[오행천간[v.간],오행지지[v.지]]);const cnt=all.filter(e=>e===t).length;if(cnt>=2)return"편재";if(cnt===1)return"정재";return"없음";}

const DEMO_BRIEFING = {
  ticker:[{name:"S&P 500",nameKr:"S&P 500",value:"—",change:"—",direction:"up"},{name:"KOSPI",nameKr:"코스피",value:"—",change:"—",direction:"up"},{name:"BTC/USD",nameKr:"비트코인",value:"—",change:"—",direction:"up"},{name:"USD/KRW",nameKr:"달러/원",value:"—",change:"—",direction:"up"}],
  aiSummary:{en:'Click <strong>"Generate Briefing"</strong> to collect live news and generate AI analysis.',kr:'<strong>"브리핑 생성"</strong> 버튼을 클릭하면 실시간 뉴스를 수집하고 AI가 분석합니다.'},
  briefings:[],signals:[]
};

export default function BriefingHub() {
  const [activeTab,setActiveTab]=useState("briefing");
  const [lang,setLang]=useState("kr");

  // ─── Briefing State ───
  const [cat,setCat]=useState("all");
  const [bData,setBData]=useState(DEMO_BRIEFING);
  const [bLoading,setBLoading]=useState(false);
  const [bError,setBError]=useState(null);
  const [bMeta,setBMeta]=useState(null);

  // ─── Fortune Signal State ───
  const [fsResult,setFsResult]=useState(null);
  const [fsLoading,setFsLoading]=useState(false);
  const [fsError,setFsError]=useState(null);
  const [fsForm,setFsForm]=useState({name:"",birthYear:1990,birthMonth:1,birthDay:1,birthHour:12});

  // ─── Clock ───
  const [time,setTime]=useState("");
  const [dateStr,setDateStr]=useState("");
  useEffect(()=>{
    const tick=()=>{
      const n=new Date(),k=new Date(n.toLocaleString("en-US",{timeZone:"Asia/Seoul"}));
      const h=String(k.getHours()).padStart(2,"0"),m=String(k.getMinutes()).padStart(2,"0"),s=String(k.getSeconds()).padStart(2,"0");
      setTime(`${h}:${m}:${s}`);
      const mo=lang==="kr"?["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"]:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      const dy=lang==="kr"?["일","월","화","수","목","금","토"]:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
      setDateStr(lang==="kr"?`${k.getFullYear()}년 ${mo[k.getMonth()]} ${k.getDate()}일 (${dy[k.getDay()]})`:`${dy[k.getDay()]}, ${mo[k.getMonth()]} ${k.getDate()}, ${k.getFullYear()}`);
    };tick();const id=setInterval(tick,1000);return()=>clearInterval(id);
  },[lang]);

  const g=(obj)=>{if(!obj)return"";if(typeof obj==="string")return obj;return lang==="kr"?obj.kr||obj.en:obj.en;};

  // ─── Generate Briefing ───
  const genBriefing=useCallback(async()=>{
    setBLoading(true);setBError(null);
    try{
      const res=await fetch("/api/briefing",{method:"POST"});
      const json=await res.json();
      if(!res.ok)throw new Error(json.error||"생성 실패");
      setBData(json.briefing);setBMeta(json.meta);
    }catch(e){setBError(e.message);}finally{setBLoading(false);}
  },[]);

  // ─── Generate Fortune Signal ───
  const genFortune=useCallback(async()=>{
    setFsLoading(true);setFsError(null);
    try{
      const{birthYear:y,birthMonth:m,birthDay:d,birthHour:h,name}=fsForm;
      const pillars=calcPillars(y,m,d,h);
      const ohangBalance=calcOhang(pillars);
      const jaeSung=calcJaeSung(pillars);
      const now=new Date();const cm=now.getMonth()+1;
      const mEl=["수","토","목","목","토","화","화","토","금","금","토","수"];
      const sajuData={name:name||"사용자",birthYear:y,birthMonth:m,birthDay:d,birthHour:h,pillars,ohangBalance,jaeSung,
        monthlyFortune:{month:cm,element:mEl[cm-1],score:70+Math.floor(Math.random()*25),description:`${cm}월 ${mEl[cm-1]}(${OH_HANJA[mEl[cm-1]]}) 에너지가 지배하는 달`},
        yearFortune:{year:2026,description:"2026 병오(丙午)년 — 화(火) 에너지가 강한 해"}};
      const res=await fetch("/api/fortune-signal",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sajuData})});
      const json=await res.json();
      if(!res.ok)throw new Error(json.error||"생성 실패");
      setFsResult({signal:json.signal,ohang:ohangBalance});
    }catch(e){setFsError(e.message);}finally{setFsLoading(false);}
  },[fsForm]);

  // URL params (from saju app cross-sell)
  useEffect(()=>{
    const p=new URLSearchParams(window.location.search);
    if(p.get("tab")==="fortune")setActiveTab("fortune");
    if(p.get("birth")){
      const[y,m,d,h]=p.get("birth").split("-").map(Number);
      if(y&&m&&d)setFsForm(f=>({...f,birthYear:y,birthMonth:m,birthDay:d,birthHour:h||12}));
    }
  },[]);

  const filteredBriefs=cat==="all"?(bData.briefings||[]):(bData.briefings||[]).filter(b=>b.category===cat);

  return (
    <>
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css');
        @import url('https://cdn.jsdelivr.net/gh/sunn-us/SUIT/fonts/variable/woff2/SUIT-Variable.css');
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500&display=swap');
        :root{--bg:#0c0b14;--bg2:#11101c;--card:#15142a;--cardH:#1a1935;--elev:#1e1d38;--bdr:rgba(255,255,255,0.06);--bdrA:rgba(255,255,255,0.1);--purple:#8b5cf6;--purple2:#a78bfa;--pDim:rgba(139,92,246,0.12);--pGlow:rgba(139,92,246,0.25);--green:#10b981;--gDim:rgba(16,185,129,0.12);--red:#ef4444;--rDim:rgba(239,68,68,0.12);--blue:#3b82f6;--bDim:rgba(59,130,246,0.12);--amber:#f59e0b;--aDim:rgba(245,158,11,0.12);--txt:#f0ece4;--txt2:#a09cae;--muted:#5c5875;--R:16px;--Rs:10px}
        *{margin:0;padding:0;box-sizing:border-box}body{font-family:'SUIT Variable','Pretendard Variable',-apple-system,sans-serif;background:var(--bg);color:var(--txt);min-height:100vh;-webkit-font-smoothing:antialiased;font-feature-settings:'ss01' on;letter-spacing:-0.01em}
        .amb{position:fixed;top:0;left:0;right:0;bottom:0;pointer-events:none;z-index:0;overflow:hidden}.orb{position:absolute;border-radius:50%;filter:blur(130px);opacity:.1}.o1{width:500px;height:500px;background:var(--purple);top:-150px;right:-80px;animation:d1 25s ease-in-out infinite}.o2{width:400px;height:400px;background:#6366f1;bottom:10%;left:-120px;animation:d2 30s ease-in-out infinite}
        @keyframes d1{0%,100%{transform:translate(0,0)}50%{transform:translate(-60px,40px)}}@keyframes d2{0%,100%{transform:translate(0,0)}50%{transform:translate(40px,-30px)}}
        .W{position:relative;z-index:1;max-width:900px;margin:0 auto;padding:0 20px}

        /* Header */
        .H{display:flex;align-items:center;justify-content:space-between;padding:16px 0;border-bottom:1px solid var(--bdr);position:sticky;top:0;background:rgba(12,11,20,.88);backdrop-filter:blur(24px);z-index:100}
        .Hl{display:flex;align-items:center;gap:10px}
        .Hm{width:32px;height:32px;background:linear-gradient(135deg,var(--purple),#6366f1);border-radius:9px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;color:#fff;box-shadow:0 0 16px var(--pGlow);cursor:pointer}
        .Ht{font-size:18px;font-weight:800;letter-spacing:-.04em}.Ht span{color:var(--muted);font-size:10px;font-weight:500;margin-left:8px;letter-spacing:1.5px;text-transform:uppercase}
        .Hr{display:flex;align-items:center;gap:8px}
        .live{display:flex;align-items:center;gap:5px;padding:4px 10px;background:var(--pDim);border:1px solid rgba(139,92,246,.2);border-radius:18px;font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:500;color:var(--purple2);letter-spacing:1.5px;text-transform:uppercase}
        .liveDot{width:5px;height:5px;background:var(--purple2);border-radius:50%;animation:pulse 2s ease-in-out infinite}@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(.7)}}
        .langT{display:flex;background:var(--card);border:1px solid var(--bdr);border-radius:18px;padding:2px}.langB{padding:4px 12px;border-radius:16px;font-size:11px;font-weight:600;color:var(--muted);background:transparent;border:none;cursor:pointer;transition:all .2s}.langB.on{background:var(--purple);color:#fff;box-shadow:0 0 10px var(--pGlow)}

        /* Tabs */
        .tabs{display:flex;gap:4px;padding:16px 0;border-bottom:1px solid var(--bdr)}
        .tab{padding:8px 20px;border-radius:20px;font-size:13px;font-weight:600;border:1px solid var(--bdr);background:transparent;color:var(--txt2);cursor:pointer;transition:all .25s;letter-spacing:-.02em}
        .tab:hover{border-color:var(--bdrA);color:var(--txt)}
        .tab.on{background:var(--purple);color:#fff;border-color:var(--purple);box-shadow:0 0 14px var(--pGlow)}
        .tabBadge{font-size:9px;padding:2px 6px;border-radius:8px;margin-left:6px;background:rgba(255,255,255,.1);font-family:'JetBrains Mono',monospace;vertical-align:middle}

        /* Date bar */
        .DB{display:flex;align-items:center;justify-content:space-between;padding:20px 0 10px}
        .DP{font-size:clamp(20px,4vw,28px);font-weight:800;letter-spacing:-.04em}
        .DT{font-family:'JetBrains Mono',monospace;font-size:20px;font-weight:300;color:var(--muted);letter-spacing:2px}
        .DTz{font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:2px;margin-top:2px;text-align:right}

        /* Generate button */
        .gen{width:100%;padding:14px;border-radius:12px;border:none;cursor:pointer;background:linear-gradient(135deg,var(--purple),#6366f1);color:#fff;font-size:14px;font-weight:700;letter-spacing:-.02em;font-family:inherit;transition:all .3s;box-shadow:0 0 20px var(--pGlow);position:relative;overflow:hidden;margin:16px 0}
        .gen:hover{transform:translateY(-1px);box-shadow:0 0 32px var(--pGlow)}.gen:disabled{opacity:.5;cursor:not-allowed;transform:none}
        .shim{position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.12),transparent);animation:sh 2s infinite}@keyframes sh{0%{left:-100%}100%{left:100%}}

        .meta{display:flex;gap:8px;flex-wrap:wrap;padding:4px 0 12px}.metaT{font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--muted);background:var(--card);border:1px solid var(--bdr);border-radius:10px;padding:3px 8px}
        .err{background:var(--rDim);border:1px solid rgba(239,68,68,.2);border-radius:var(--Rs);padding:12px;margin:12px 0;color:var(--red);font-size:13px}

        /* Ticker */
        .tick{display:flex;gap:2px;padding:12px 0;border-top:1px solid var(--bdr);border-bottom:1px solid var(--bdr);overflow-x:auto;scrollbar-width:none}.tick::-webkit-scrollbar{display:none}
        .tk{flex-shrink:0;padding:10px 16px;background:var(--card);border:1px solid var(--bdr);border-radius:var(--Rs);min-width:130px;transition:all .2s}.tk:hover{border-color:var(--bdrA);background:var(--cardH)}
        .tkN{font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:4px}
        .tkV{font-size:16px;font-weight:700;letter-spacing:-.03em;margin-bottom:2px}
        .tkC{font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:500}.tkC.up{color:var(--green)}.tkC.down{color:var(--red)}

        /* AI Summary */
        .aiB{background:linear-gradient(135deg,rgba(139,92,246,.06),rgba(59,130,246,.04));border:1px solid rgba(139,92,246,.15);border-radius:var(--R);padding:20px;margin:16px 0}
        .aiH{display:flex;align-items:center;gap:8px;margin-bottom:12px}
        .aiI{width:24px;height:24px;background:linear-gradient(135deg,var(--purple),#6366f1);border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:12px;color:#fff;box-shadow:0 0 12px var(--pGlow)}
        .aiTt{font-size:15px;font-weight:700;letter-spacing:-.03em}
        .aiTx{font-size:13px;line-height:1.8;color:var(--txt2)}

        /* Section */
        .sH{display:flex;align-items:baseline;gap:10px;padding:22px 0 12px}.sN{font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--muted);letter-spacing:1px}.sTt{font-size:clamp(16px,3.5vw,20px);font-weight:800;letter-spacing:-.04em}.sL{flex:1;height:1px;background:var(--bdr);margin-left:10px}

        /* Category tabs */
        .cats{display:flex;gap:5px;padding:0 0 14px;overflow-x:auto;scrollbar-width:none}.cats::-webkit-scrollbar{display:none}
        .catB{flex-shrink:0;padding:6px 14px;border-radius:18px;font-size:12px;font-weight:600;border:1px solid var(--bdr);background:transparent;color:var(--txt2);cursor:pointer;transition:all .2s;letter-spacing:-.02em}
        .catB:hover{border-color:var(--bdrA);color:var(--txt)}.catB.on{background:var(--purple);color:#fff;border-color:var(--purple);box-shadow:0 0 12px var(--pGlow)}

        /* Cards */
        .bC{background:var(--card);border:1px solid var(--bdr);border-radius:var(--R);padding:20px;margin-bottom:12px;position:relative;overflow:hidden;transition:all .3s}
        .bC::before{content:'';position:absolute;top:0;left:0;width:3px;height:100%;border-radius:3px 0 0 3px}
        .bC.hi::before{background:var(--red)}.bC.mid::before{background:var(--amber)}.bC.lo::before{background:var(--blue)}
        .bC:hover{border-color:var(--bdrA);background:var(--cardH);transform:translateY(-1px)}

        .cTop{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
        .cTags{display:flex;gap:4px}
        .tag{padding:2px 8px;border-radius:10px;font-family:'JetBrains Mono',monospace;font-size:8px;font-weight:600;text-transform:uppercase;letter-spacing:1px}
        .tStock{background:var(--gDim);color:var(--green)}.tRE{background:var(--bDim);color:var(--blue)}.tFX{background:var(--aDim);color:var(--amber)}.tCrypto{background:var(--pDim);color:var(--purple2)}.tMacro{background:rgba(255,255,255,.05);color:var(--txt2)}
        .cTm{font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--muted)}
        .cHl{font-size:clamp(15px,3vw,18px);font-weight:800;line-height:1.35;letter-spacing:-.03em;margin-bottom:8px}
        .cSm{font-size:12px;line-height:1.75;color:var(--txt2);margin-bottom:14px}

        .insB{background:var(--elev);border:1px solid var(--bdr);border-radius:var(--Rs);padding:14px;margin-bottom:10px}
        .insL{font-family:'JetBrains Mono',monospace;font-size:8px;text-transform:uppercase;letter-spacing:2px;color:var(--purple2);margin-bottom:6px}.insL::before{content:'◆ ';font-size:6px}
        .insT{font-size:12px;line-height:1.75;color:var(--txt)}
        .chnL{font-family:'JetBrains Mono',monospace;font-size:8px;text-transform:uppercase;letter-spacing:2px;color:var(--amber);margin-bottom:8px}.chnL::before{content:'⟁ ';font-size:10px}
        .chnS{display:flex;align-items:flex-start;gap:10px;padding:6px 0}
        .chnCn{display:flex;flex-direction:column;align-items:center;width:16px;flex-shrink:0}
        .chnD{width:7px;height:7px;border-radius:50%;border:2px solid var(--amber);background:var(--bg);z-index:1;flex-shrink:0}
        .chnW{width:1px;flex:1;background:linear-gradient(to bottom,var(--amber),transparent);min-height:12px}
        .chnS:last-child .chnW{display:none}.chnS:last-child .chnD{border-color:var(--red);background:var(--rDim)}
        .chnTx{font-size:11px;line-height:1.6;color:var(--txt2)}

        .impR{display:flex;align-items:center;gap:8px;margin-top:12px;padding-top:12px;border-top:1px solid var(--bdr)}
        .impL{font-family:'JetBrains Mono',monospace;font-size:8px;text-transform:uppercase;letter-spacing:1.5px;color:var(--muted)}
        .impBs{display:flex;gap:2px}.impB{width:20px;height:3px;border-radius:1px;background:rgba(255,255,255,.06)}.impB.on{background:var(--amber)}.bC.hi .impB.on{background:var(--red)}
        .impSc{font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--txt2)}

        /* Signals grid */
        .sgG{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:8px;margin-top:6px}
        .sgC{background:var(--card);border:1px solid var(--bdr);border-radius:var(--Rs);padding:14px;transition:all .2s}.sgC:hover{border-color:var(--bdrA);background:var(--cardH)}
        .sgD{font-size:16px;margin-bottom:4px}.sgA{font-family:'JetBrains Mono',monospace;font-size:9px;text-transform:uppercase;letter-spacing:1.5px;color:var(--muted);margin-bottom:3px}
        .sgP{font-size:12px;line-height:1.5;color:var(--txt);margin-bottom:4px}.sgCf{font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--muted)}.sgCf em{font-style:normal;color:var(--purple2);font-weight:500}

        /* Fortune Signal */
        .fForm{background:var(--card);border:1px solid var(--bdr);border-radius:var(--R);padding:20px;margin:16px 0}
        .fTitle{font-size:15px;font-weight:700;margin-bottom:14px;letter-spacing:-.03em}
        .fGrid{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px}
        .fF label{display:block;font-size:10px;color:var(--muted);margin-bottom:3px;font-family:'JetBrains Mono',monospace;letter-spacing:.5px;text-transform:uppercase}
        .fF input,.fF select{width:100%;padding:9px 10px;background:var(--elev);border:1px solid var(--bdr);border-radius:var(--Rs);color:var(--txt);font-size:13px;font-family:inherit;outline:none;transition:border-color .2s}.fF input:focus,.fF select:focus{border-color:var(--purple)}
        .fFull{grid-column:1/-1}

        .pCard{background:linear-gradient(135deg,rgba(139,92,246,.08),rgba(99,102,241,.04));border:1px solid rgba(139,92,246,.15);border-radius:var(--R);padding:20px;margin:16px 0}
        .pHd{display:flex;align-items:center;gap:8px;margin-bottom:14px}
        .pIco{width:24px;height:24px;background:linear-gradient(135deg,var(--purple),#6366f1);border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:12px;box-shadow:0 0 12px var(--pGlow)}
        .pTt{font-size:15px;font-weight:700;letter-spacing:-.03em}
        .ohBar{display:flex;gap:2px;margin:12px 0 8px;height:24px;border-radius:5px;overflow:hidden}
        .ohSeg{display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;color:#000;min-width:24px}
        .pGrid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
        .pItem{background:rgba(255,255,255,.03);border:1px solid var(--bdr);border-radius:var(--Rs);padding:10px}
        .pIL{font-family:'JetBrains Mono',monospace;font-size:8px;color:var(--muted);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:3px}
        .pIV{font-size:13px;font-weight:600;letter-spacing:-.02em}.pID{font-size:11px;color:var(--txt2);margin-top:2px;line-height:1.4}

        .fsC{background:var(--card);border:1px solid var(--bdr);border-radius:var(--R);padding:18px;margin-bottom:10px;position:relative;overflow:hidden;transition:all .3s}
        .fsC::before{content:'';position:absolute;top:0;left:0;width:3px;height:100%}
        .fsC.bullish::before{background:var(--green)}.fsC.bearish::before{background:var(--red)}.fsC.neutral::before{background:var(--amber)}
        .fsC:hover{border-color:var(--bdrA);background:var(--cardH)}
        .fsTop{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
        .fsEl{display:flex;align-items:center;gap:5px}
        .fsElD{width:20px;height:20px;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700}
        .fsMT{font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:1px}
        .fsDir{display:flex;align-items:center;gap:3px;font-weight:600;font-size:12px}
        .fsAsset{font-size:16px;font-weight:800;letter-spacing:-.03em;margin-bottom:5px}
        .fsReason{font-size:12px;line-height:1.7;color:var(--txt2);margin-bottom:8px}
        .fsSec{display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px}
        .fsSecT{padding:2px 7px;border-radius:8px;font-size:9px;font-weight:600;font-family:'JetBrains Mono',monospace;background:rgba(255,255,255,.05);color:var(--txt2)}
        .fsMeta{display:flex;gap:10px;padding-top:8px;border-top:1px solid var(--bdr)}.fsMI{font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--muted)}.fsMI em{font-style:normal;color:var(--purple2);font-weight:500}

        .tmC{background:var(--card);border:1px solid var(--bdr);border-radius:var(--R);padding:18px;margin-bottom:10px}
        .tmG{display:grid;grid-template-columns:1fr 1fr;gap:8px}
        .tmI{background:var(--elev);border:1px solid var(--bdr);border-radius:var(--Rs);padding:12px}
        .tmL{font-family:'JetBrains Mono',monospace;font-size:8px;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:5px}.tmL.g{color:var(--green)}.tmL.r{color:var(--red)}
        .tmD{font-size:16px;font-weight:700;margin-bottom:3px}.tmDsc{font-size:11px;color:var(--txt2);line-height:1.5}
        .tmAct{grid-column:1/-1;background:var(--pDim);border:1px solid rgba(139,92,246,.15);border-radius:var(--Rs);padding:12px}
        .tmAL{font-family:'JetBrains Mono',monospace;font-size:8px;text-transform:uppercase;letter-spacing:1.5px;color:var(--purple2);margin-bottom:5px}

        .advC{background:linear-gradient(135deg,rgba(16,185,129,.06),rgba(59,130,246,.04));border:1px solid rgba(16,185,129,.15);border-radius:var(--R);padding:18px;margin-bottom:10px}
        .advTt{font-size:15px;font-weight:700;margin-bottom:8px;letter-spacing:-.03em}
        .advBd{font-size:13px;line-height:1.8;color:var(--txt2);margin-bottom:10px}
        .avdB{background:rgba(239,68,68,.06);border:1px solid rgba(239,68,68,.12);border-radius:var(--Rs);padding:10px;margin-top:8px}
        .avdL{font-family:'JetBrains Mono',monospace;font-size:8px;text-transform:uppercase;letter-spacing:1.5px;color:var(--red);margin-bottom:3px}
        .avdT{font-size:11px;color:var(--txt2);line-height:1.5}

        .disc{font-size:10px;color:var(--muted);text-align:center;padding:16px 0;line-height:1.6;border-top:1px solid var(--bdr);margin-top:20px}
        .empty{text-align:center;padding:40px 16px;color:var(--muted);font-size:13px}.emIco{font-size:28px;margin-bottom:10px;opacity:.5}
        .skel{background:linear-gradient(90deg,var(--card) 25%,var(--cardH) 50%,var(--card) 75%);background-size:200% 100%;animation:sk 1.8s infinite;border-radius:var(--Rs);height:180px;margin-bottom:12px}@keyframes sk{0%{background-position:200% 0}100%{background-position:-200% 0}}

        .backLink{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:18px;background:var(--card);border:1px solid var(--bdr);color:var(--txt2);font-size:12px;font-weight:500;text-decoration:none;margin:16px 0 0;transition:all .2s;cursor:pointer}
        .backLink:hover{border-color:var(--bdrA);color:var(--txt)}

        .ftr{padding:24px 0;border-top:1px solid var(--bdr);margin-top:32px;display:flex;align-items:center;justify-content:space-between}
        .ftrL{font-size:11px;color:var(--muted)}.ftrL b{color:var(--txt2);font-weight:500}
        .ftrR{font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--muted);letter-spacing:1px}

        @media(max-width:640px){.DP{font-size:18px}.DT{font-size:16px}.fGrid{grid-template-columns:1fr 1fr}.pGrid{grid-template-columns:1fr}.tmG{grid-template-columns:1fr}.sgG{grid-template-columns:1fr}.H{flex-wrap:wrap;gap:8px}.ftr{flex-direction:column;gap:8px;text-align:center}}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(139,92,246,.2);border-radius:2px}
      `}</style>

      <div className="amb"><div className="orb o1"/><div className="orb o2"/></div>

      <div className="W">
        {/* Header */}
        <header className="H">
          <div className="Hl">
            <div className="Hm" onClick={()=>window.location.href="/"}>N</div>
            <div className="Ht">NUVO AI <span>Briefing</span></div>
          </div>
          <div className="Hr">
            <div className="live"><div className="liveDot"/>LIVE</div>
            <div className="langT">
              <button className={`langB ${lang==="en"?"on":""}`} onClick={()=>setLang("en")}>EN</button>
              <button className={`langB ${lang==="kr"?"on":""}`} onClick={()=>setLang("kr")}>KR</button>
            </div>
          </div>
        </header>

        {/* Back to Saju */}
        <a className="backLink" href="/">← {lang==="kr"?"사주 분석으로 돌아가기":"Back to Saju Analysis"}</a>

        {/* Tabs */}
        <div className="tabs">
          <button className={`tab ${activeTab==="briefing"?"on":""}`} onClick={()=>setActiveTab("briefing")}>
            {lang==="kr"?"📡 데일리 브리핑":"📡 Daily Briefing"}
          </button>
          <button className={`tab ${activeTab==="fortune"?"on":""}`} onClick={()=>setActiveTab("fortune")}>
            {lang==="kr"?"🔮 Fortune × Signal":"🔮 Fortune × Signal"}
            <span className="tabBadge">BUNDLE</span>
          </button>
        </div>

        {/* ═══════════════════════════════════════════════════════
            TAB 1: Daily Briefing
            ═══════════════════════════════════════════════════════ */}
        {activeTab==="briefing" && (<>
          <div className="DB">
            <div className="DP">{dateStr}</div>
            <div style={{textAlign:"right"}}><div className="DT">{time}</div><div className="DTz">{lang==="kr"?"한국 표준시":"KST"}</div></div>
          </div>

          <button className="gen" onClick={genBriefing} disabled={bLoading}>
            {bLoading&&<div className="shim"/>}
            {bLoading?(lang==="kr"?"🔄 뉴스 수집 + AI 분석 중... (30~60초)":"🔄 Collecting news... (30-60s)"):(lang==="kr"?"✦ 오늘의 브리핑 생성":"✦ Generate Today's Briefing")}
          </button>

          {bMeta&&<div className="meta"><span className="metaT">{lang==="kr"?"기사":"Articles"}: {bMeta.newsCount}</span><span className="metaT">{lang==="kr"?"소스":"Sources"}: {bMeta.sources?.length||0}</span></div>}
          {bError&&<div className="err">⚠️ {bError}</div>}

          <div className="tick">{(bData.ticker||[]).map((t,i)=><div className="tk" key={i}><div className="tkN">{lang==="kr"?t.nameKr||t.name:t.name}</div><div className="tkV">{t.value}</div><div className={`tkC ${t.direction}`}>{t.change}</div></div>)}</div>

          <div className="aiB"><div className="aiH"><div className="aiI">✦</div><div className="aiTt">{lang==="kr"?"NUVO AI 핵심 요약":"Executive Summary"}</div></div><div className="aiTx" dangerouslySetInnerHTML={{__html:g(bData.aiSummary)}}/></div>

          <div className="sH"><span className="sN">01</span><span className="sTt">{lang==="kr"?"오늘의 브리핑":"Today's Briefing"}</span><div className="sL"/></div>
          <div className="cats">{catLabels[lang].map((c,i)=><button key={i} className={`catB ${catKeys[i]===cat?"on":""}`} onClick={()=>setCat(catKeys[i])}>{c}</button>)}</div>

          {bLoading&&<div>{[1,2,3].map(i=><div className="skel" key={i} style={{animationDelay:`${i*.12}s`}}/>)}</div>}

          {!bLoading&&filteredBriefs.length>0&&filteredBriefs.map((b,idx)=>(
            <div className={`bC ${b.impact}`} key={idx}>
              <div className="cTop"><div className="cTags">{(b.tags||[]).map((t,ti)=><span className={`tag ${tagMap[t]?.cls||"tMacro"}`} key={ti}>{tagMap[t]?.[lang]||t}</span>)}</div><div className="cTm">{b.time}</div></div>
              <div className="cHl">{g(b.headline)}</div>
              <div className="cSm">{g(b.summary)}</div>
              <div className="insB"><div className="insL">{lang==="kr"?"핵심 인사이트":"KEY INSIGHT"}</div><div className="insT" dangerouslySetInnerHTML={{__html:g(b.insight)}}/></div>
              <div className="insB"><div className="chnL">{lang==="kr"?"연쇄 영향 예측":"CHAIN REACTION"}</div>
                {(g(b.chainReaction)||[]).map((s,si)=><div className="chnS" key={si}><div className="chnCn"><div className="chnD"/><div className="chnW"/></div><div className="chnTx" dangerouslySetInnerHTML={{__html:s.text}}/></div>)}
              </div>
              <div className="impR"><span className="impL">{lang==="kr"?"임팩트":"IMPACT"}</span><div className="impBs">{[...Array(10)].map((_,i)=><div className={`impB ${i<b.impactScore?"on":""}`} key={i}/>)}</div><span className="impSc">{b.impactScore}/10</span></div>
            </div>
          ))}

          {!bLoading&&filteredBriefs.length===0&&<div className="empty"><div className="emIco">📡</div>{lang==="kr"?"브리핑을 생성하면 AI 분석 결과가 표시됩니다":"Generate a briefing to see analysis"}</div>}

          {(bData.signals||[]).length>0&&(<>
            <div className="sH"><span className="sN">02</span><span className="sTt">{lang==="kr"?"연쇄 영향 시그널":"Chain Reaction Signals"}</span><div className="sL"/></div>
            <div className="sgG">{bData.signals.map((s,i)=><div className="sgC" key={i}><div className="sgD">{s.direction}</div><div className="sgA">{g(s.asset)}</div><div className="sgP">{g(s.prediction)}</div><div className="sgCf">{lang==="kr"?"신뢰도":"Confidence"}: <em>{s.confidence}%</em></div></div>)}</div>
          </>)}
        </>)}

        {/* ═══════════════════════════════════════════════════════
            TAB 2: Fortune × Signal
            ═══════════════════════════════════════════════════════ */}
        {activeTab==="fortune" && (<>
          {!fsResult && (
            <div className="fForm">
              <div className="fTitle">🔮 {lang==="kr"?"사주 정보 입력":"Enter Birth Info"}</div>
              <div className="fGrid">
                <div className="fF fFull"><label>{lang==="kr"?"이름":"Name"}</label><input defaultValue={fsForm.name} onChange={e=>setFsForm(f=>({...f,name:e.target.value}))} placeholder={lang==="kr"?"이름 입력":"Your name"}/></div>
                <div className="fF"><label>{lang==="kr"?"출생년도":"Year"}</label><input type="number" min="1940" max="2010" defaultValue={fsForm.birthYear} onChange={e=>setFsForm(f=>({...f,birthYear:+e.target.value}))}/></div>
                <div className="fF"><label>{lang==="kr"?"월":"Month"}</label><select defaultValue={fsForm.birthMonth} onChange={e=>setFsForm(f=>({...f,birthMonth:+e.target.value}))}>{[...Array(12)].map((_,i)=><option key={i} value={i+1}>{i+1}{lang==="kr"?"월":""}</option>)}</select></div>
                <div className="fF"><label>{lang==="kr"?"일":"Day"}</label><input type="number" min="1" max="31" defaultValue={fsForm.birthDay} onChange={e=>setFsForm(f=>({...f,birthDay:+e.target.value}))}/></div>
                <div className="fF"><label>{lang==="kr"?"시 (0-23)":"Hour"}</label><input type="number" min="0" max="23" defaultValue={fsForm.birthHour} onChange={e=>setFsForm(f=>({...f,birthHour:+e.target.value}))}/></div>
              </div>
              <button className="gen" onClick={genFortune} disabled={fsLoading}>
                {fsLoading&&<div className="shim"/>}
                {fsLoading?(lang==="kr"?"🔮 사주 + 시장 결합 분석 중... (30~60초)":"🔮 Analyzing..."):(lang==="kr"?"✦ Fortune × Market Signal 생성":"✦ Generate Fortune × Signal")}
              </button>
            </div>
          )}

          {fsError&&<div className="err">⚠️ {fsError}</div>}

          {fsResult&&(<>
            {/* Profile */}
            <div className="pCard">
              <div className="pHd"><div className="pIco">✦</div><div className="pTt">{lang==="kr"?"나의 투자 체질":"Investment Profile"}</div></div>
              <div className="ohBar">{fsResult.ohang&&Object.entries(fsResult.ohang).map(([el,cnt])=><div key={el} className="ohSeg" style={{flex:Math.max(cnt,.5),background:OH_COLORS[el]}}>{OH_HANJA[el]} {cnt}</div>)}</div>
              <div className="pGrid">
                <div className="pItem"><div className="pIL">{lang==="kr"?"주도 에너지":"DOMINANT"}</div><div className="pIV" style={{color:OH_COLORS[fsResult.signal.userProfile?.dominantElement]}}>{OH_HANJA[fsResult.signal.userProfile?.dominantElement]} {fsResult.signal.userProfile?.dominantElement}</div><div className="pID">{fsResult.signal.userProfile?.dominantTraits}</div></div>
                <div className="pItem"><div className="pIL">{lang==="kr"?"보충 필요":"DEFICIENT"}</div><div className="pIV" style={{color:OH_COLORS[fsResult.signal.userProfile?.deficientElement]}}>{OH_HANJA[fsResult.signal.userProfile?.deficientElement]} {fsResult.signal.userProfile?.deficientElement}</div></div>
                <div className="pItem"><div className="pIL">{lang==="kr"?"재성":"WEALTH STAR"}</div><div className="pIV">{fsResult.signal.userProfile?.wealthStar}</div><div className="pID">{fsResult.signal.userProfile?.wealthStarMeaning}</div></div>
                <div className="pItem"><div className="pIL">{lang==="kr"?"이번 달":"THIS MONTH"}</div><div className="pID">{fsResult.signal.userProfile?.currentMonthEnergy}</div></div>
              </div>
            </div>

            <div className="sH"><span className="sN">01</span><span className="sTt">{lang==="kr"?"맞춤 시장 시그널":"Personalized Signals"}</span><div className="sL"/></div>
            {(fsResult.signal.elementMatchSignals||[]).map((sig,i)=>{const dir=DIR_MAP[sig.specificSignal?.direction]||DIR_MAP.neutral;return(
              <div key={i} className={`fsC ${sig.specificSignal?.direction||"neutral"}`}>
                <div className="fsTop"><div className="fsEl"><div className="fsElD" style={{background:OH_BG[sig.element],color:OH_COLORS[sig.element]}}>{OH_HANJA[sig.element]}</div><span className="fsMT">{MATCH_LABEL[sig.matchType]||sig.matchType}</span></div><div className="fsDir" style={{color:dir.color}}>{dir.icon} {dir.label}</div></div>
                <div className="fsAsset">{sig.specificSignal?.asset}</div>
                <div style={{fontSize:"11px",color:"var(--txt2)",marginBottom:"6px",lineHeight:1.6}}>{sig.matchReason}</div>
                <div className="fsReason">{sig.specificSignal?.reasoning}</div>
                <div className="fsSec">{(sig.sectors||[]).map((s,si)=><span key={si} className="fsSecT">{s}</span>)}</div>
                <div className="fsMeta"><span className="fsMI">{lang==="kr"?"타임프레임":"Timeframe"}: <em>{sig.specificSignal?.timeframe}</em></span><span className="fsMI">{lang==="kr"?"신뢰도":"Confidence"}: <em>{sig.specificSignal?.confidence}%</em></span></div>
              </div>
            );})}

            {fsResult.signal.luckyTimingThisWeek&&(<>
              <div className="sH"><span className="sN">02</span><span className="sTt">{lang==="kr"?"이번 주 투자 타이밍":"Weekly Timing"}</span><div className="sL"/></div>
              <div className="tmC"><div className="tmG">
                <div className="tmI"><div className="tmL g">BEST DAY</div><div className="tmD" style={{color:"var(--green)"}}>{fsResult.signal.luckyTimingThisWeek.bestDay}</div><div className="tmDsc">{fsResult.signal.luckyTimingThisWeek.bestDayReason}</div></div>
                <div className="tmI"><div className="tmL r">CAUTION</div><div className="tmD" style={{color:"var(--red)"}}>{fsResult.signal.luckyTimingThisWeek.cautionDay}</div><div className="tmDsc">{fsResult.signal.luckyTimingThisWeek.cautionReason}</div></div>
                <div className="tmAct"><div className="tmAL">ACTION</div><div style={{fontSize:"12px",lineHeight:1.7}}>{fsResult.signal.luckyTimingThisWeek.actionItem}</div></div>
              </div></div>
            </>)}

            {fsResult.signal.personalizedAdvice&&(<>
              <div className="sH"><span className="sN">03</span><span className="sTt">{lang==="kr"?"맞춤 조언":"Advice"}</span><div className="sL"/></div>
              <div className="advC">
                <div className="advTt">{fsResult.signal.personalizedAdvice.title}</div>
                <div className="advBd">{fsResult.signal.personalizedAdvice.body}</div>
                {fsResult.signal.personalizedAdvice.avoidSectors&&<div className="avdB"><div className="avdL">{lang==="kr"?"주의 섹터":"AVOID"}</div><div className="avdT">{fsResult.signal.personalizedAdvice.avoidSectors.join(", ")} — {fsResult.signal.personalizedAdvice.avoidReason}</div></div>}
              </div>
            </>)}

            <button className="gen" onClick={genFortune} disabled={fsLoading}>{fsLoading?"🔮 재분석 중...":"↻ 시그널 새로고침"}</button>
            <button className="gen" onClick={()=>setFsResult(null)} style={{background:"var(--card)",border:"1px solid var(--bdr)",boxShadow:"none",marginTop:"8px"}}>{lang==="kr"?"← 다른 생년월일로 분석":"← Try different birth date"}</button>
            <div className="disc">{fsResult.signal.disclaimer}</div>
          </>)}
        </>)}

        {/* Footer */}
        <footer className="ftr">
          <div className="ftrL"><b>NUVO AI</b> — {lang==="kr"?"AI 기반 시장 인텔리전스":"AI-powered market intelligence"}</div>
          <div className="ftrR">{lang==="kr"?"프로덕트 #2 · NUVO 에코시스템":"PRODUCT #2 · NUVO ECOSYSTEM"}</div>
        </footer>
      </div>
    </>
  );
}
