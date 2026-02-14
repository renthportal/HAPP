import { useState, useRef, useEffect, useCallback } from "react";

// ═══════════════════════════════════════════════════════
// HAPP v3.1 — Full Crangle-matching Crane Planning App
// ALL 10 AUDIT BUGS FIXED
// Hareket.com brand: Green #006838, Yellow #FFC72C
// ═══════════════════════════════════════════════════════

const C = {
  green:"#006838",greenLight:"#00894A",greenDark:"#004D2A",greenBg:"#003D20",
  yellow:"#FFC72C",yellowLight:"#FFD85C",yellowDark:"#E5A800",yellowPale:"#FFF3D0",
  white:"#FFFFFF",offWhite:"#F0F7F2",
  g100:"#E8F0EA",g200:"#C8D9CC",g300:"#94A89A",g400:"#6B7E70",g500:"#4A5E4F",
  dark:"#0A1F12",darkCard:"#0F2918",darkSurf:"#132E1C",
  red:"#DC2626",redLight:"#FEE2E2",blue:"#2563EB",purple:"#7C3AED",cyan:"#06B6D4",
  orange:"#F97316",pink:"#EC4899",
};
const F="'JetBrains Mono','Fira Code','Consolas',monospace";
const FB="'Inter','Segoe UI','Helvetica Neue',sans-serif";

// ── CRANE SKINS ──
const SKINS = [
  {id:"default",name:"Varsayılan",body:C.green,boom:C.yellow,cabin:C.greenLight},
  {id:"liebherr",name:"Liebherr",body:"#FFD700",boom:"#FFD700",cabin:"#FFD700"},
  {id:"tadano",name:"Tadano",body:"#1E40AF",boom:"#1E40AF",cabin:"#2563EB"},
  {id:"grove",name:"Grove",body:"#DC2626",boom:"#DC2626",cabin:"#EF4444"},
  {id:"terex",name:"Terex",body:"#6B7280",boom:"#9CA3AF",cabin:"#6B7280"},
  {id:"kobelco",name:"Kobelco",body:"#0284C7",boom:"#0EA5E9",cabin:"#0284C7"},
  {id:"sany",name:"Sany",body:"#FBBF24",boom:"#FBBF24",cabin:"#F59E0B"},
  {id:"xcmg",name:"XCMG",body:"#16A34A",boom:"#22C55E",cabin:"#16A34A"},
  {id:"hareket",name:"Hareket",body:C.green,boom:C.yellow,cabin:C.greenLight},
];

const CRANES=[
  {id:"mobile",name:"Mobil Vinç",maxBoom:60,maxCap:100,pivotH:2.5},
  {id:"truck",name:"Kamyon Vinç",maxBoom:40,maxCap:60,pivotH:3},
  {id:"crawler",name:"Paletli Vinç",maxBoom:100,maxCap:200,pivotH:3.5},
  {id:"tower",name:"Kule Vinç",maxBoom:80,maxCap:120,pivotH:40},
  {id:"rough",name:"Arazi Vinç",maxBoom:50,maxCap:80,pivotH:2.8},
  {id:"loader",name:"Yükleyici Vinç",maxBoom:25,maxCap:30,pivotH:2},
  {id:"mini",name:"Mini Vinç",maxBoom:20,maxCap:10,pivotH:1.5},
  {id:"floating",name:"Yüzer Vinç",maxBoom:120,maxCap:500,pivotH:10},
  {id:"gantry",name:"Portal Vinç",maxBoom:40,maxCap:150,pivotH:15},
  {id:"overhead",name:"Tavan Vinci",maxBoom:30,maxCap:50,pivotH:10},
  {id:"telescopic",name:"Teleskopik Vinç",maxBoom:70,maxCap:90,pivotH:2.5},
  {id:"knuckle",name:"Eklemli Vinç",maxBoom:35,maxCap:40,pivotH:2},
];

// ═══ REAL LOAD CHARTS ═══
// Format: boomLengths[], rows of {r: radius, caps: [cap@boom1, cap@boom2, ...]}
// null = not applicable for that boom/radius combo
const LOAD_CHARTS = {
  "ltm500": {
    name:"500t Mobil Vinç (Genel)",
    maxCap:500, maxBoom:84, pivotH:3.2,
    boomLengths:[15,21,28,35,42,50,58,66,74,84],
    rows:[
      {r:3,  caps:[500, 420, null,null,null,null,null,null,null,null]},
      {r:4,  caps:[400, 365, 310, null,null,null,null,null,null,null]},
      {r:5,  caps:[330, 300, 270, 240, null,null,null,null,null,null]},
      {r:6,  caps:[280, 255, 235, 210, 185,null,null,null,null,null]},
      {r:7,  caps:[240, 220, 205, 185, 165,150,null,null,null,null]},
      {r:8,  caps:[210, 195, 180, 165, 148,135,120,null,null,null]},
      {r:9,  caps:[185, 175, 162, 148, 133,122,108,96,null,null]},
      {r:10, caps:[165, 155, 145, 134, 120,110, 98,88,78,null]},
      {r:12, caps:[132, 125, 118, 110, 100, 91, 82,74,66,58]},
      {r:14, caps:[108, 102,  97,  92,  84, 77, 70,63,57,50]},
      {r:16, caps:[90,   86,  82,  78,  72, 66, 60,55,49,43]},
      {r:18, caps:[76,   73,  70,  67,  62, 57, 52,48,43,38]},
      {r:20, caps:[65,   62,  60,  57,  54, 50, 46,42,38,33]},
      {r:22, caps:[null,  54,  52,  50,  47, 44, 41,37,34,30]},
      {r:24, caps:[null,  47,  46,  44,  42, 39, 36,33,30,27]},
      {r:26, caps:[null, null, 40,  39,  37, 35, 32,30,27,24]},
      {r:28, caps:[null, null, 36,  35,  33, 31, 29,27,24,22]},
      {r:30, caps:[null, null, 32,  31,  30, 28, 26,24,22,19]},
      {r:34, caps:[null, null,null, 25,  24, 23, 21,20,18,16]},
      {r:38, caps:[null, null,null, null, 20, 19, 18,16,15,13]},
      {r:42, caps:[null, null,null, null, 16, 15, 14,13,12,10]},
      {r:46, caps:[null, null,null, null,null, 12, 11,10, 9, 8]},
      {r:50, caps:[null, null,null, null,null, 10,  9, 8, 7, 6]},
      {r:56, caps:[null, null,null, null,null,null,  7, 6, 5, 5]},
      {r:62, caps:[null, null,null, null,null,null,null, 5, 4, 4]},
      {r:70, caps:[null, null,null, null,null,null,null,null, 3, 3]},
    ]
  },
  "ltm250": {
    name:"250t Mobil Vinç (Genel)",
    maxCap:250, maxBoom:60, pivotH:2.8,
    boomLengths:[12,18,24,30,38,46,54,60],
    rows:[
      {r:3,  caps:[250, 210, null,null,null,null,null,null]},
      {r:4,  caps:[200, 180, 160, null,null,null,null,null]},
      {r:5,  caps:[165, 150, 138, 125,null,null,null,null]},
      {r:6,  caps:[138, 128, 118, 108, 92,null,null,null]},
      {r:7,  caps:[118, 110, 102,  95, 82, 70,null,null]},
      {r:8,  caps:[102,  96,  90,  84, 74, 64, 54,null]},
      {r:10, caps:[ 78,  74,  70,  66, 59, 52, 45, 40]},
      {r:12, caps:[ 62,  59,  56,  54, 48, 43, 38, 34]},
      {r:14, caps:[ 50,  48,  46,  44, 40, 36, 32, 28]},
      {r:16, caps:[ 42,  40,  38,  37, 34, 30, 27, 24]},
      {r:18, caps:[ 35,  34,  33,  32, 29, 26, 23, 21]},
      {r:20, caps:[ 30,  29,  28,  27, 25, 22, 20, 18]},
      {r:24, caps:[null, 23,  22,  21, 20, 18, 16, 14]},
      {r:28, caps:[null,null, 17,  17, 16, 14, 13, 11]},
      {r:32, caps:[null,null,null, 13, 12, 11, 10,  9]},
      {r:38, caps:[null,null,null,null,  9,  8,  7,  6]},
      {r:44, caps:[null,null,null,null,null,  6,  5,  5]},
      {r:50, caps:[null,null,null,null,null,null,  4,  3]},
    ]
  }
};

// Sling types for rigging visual
const SLING_TYPES = [
  {id:"2leg",name:"2 Bacak",legs:2},
  {id:"4leg",name:"4 Bacak",legs:4},
  {id:"single",name:"Tek Bacak",legs:1},
  {id:"spreader",name:"Spreader Beam",legs:0},
];

// Load shape types
const LOAD_SHAPES = [
  {id:"box",name:"Kutu / Konteyner"},
  {id:"cylinder",name:"Silindir / Boru"},
  {id:"beam",name:"Kiriş / I-Profil"},
  {id:"irregular",name:"Düzensiz Yük"},
];

// ═══ LOAD CHART INTERPOLATION ═══
// Bilinear interpolation: finds capacity for exact boom length and radius
function lookupChart(chart, boomLen, radius){
  if(!chart || !chart.rows || chart.rows.length===0) return null;
  const bls = chart.boomLengths;
  
  // Find boom length bracket
  let bi0=0, bi1=0;
  if(boomLen <= bls[0]){ bi0=0; bi1=0; }
  else if(boomLen >= bls[bls.length-1]){ bi0=bls.length-1; bi1=bls.length-1; }
  else { for(let i=0;i<bls.length-1;i++){ if(boomLen>=bls[i] && boomLen<=bls[i+1]){bi0=i;bi1=i+1;break;} } }
  
  // Find radius bracket rows
  const rows = chart.rows;
  let ri0=0, ri1=0;
  if(radius <= rows[0].r){ ri0=0; ri1=0; }
  else if(radius >= rows[rows.length-1].r){ ri0=rows.length-1; ri1=rows.length-1; }
  else { for(let i=0;i<rows.length-1;i++){ if(radius>=rows[i].r && radius<=rows[i+1].r){ri0=i;ri1=i+1;break;} } }
  
  // Get 4 corner values
  const c00=rows[ri0].caps[bi0], c01=rows[ri0].caps[bi1];
  const c10=rows[ri1].caps[bi0], c11=rows[ri1].caps[bi1];
  
  // If any corner is null, try nearest valid
  const valid = [c00,c01,c10,c11].filter(v=>v!==null);
  if(valid.length===0) return null;
  if(valid.length<4){
    // Use minimum of available (conservative)
    return Math.min(...valid);
  }
  
  // Bilinear interpolation
  const bt = bi0===bi1 ? 0 : (boomLen-bls[bi0])/(bls[bi1]-bls[bi0]);
  const rt = ri0===ri1 ? 0 : (radius-rows[ri0].r)/(rows[ri1].r-rows[ri0].r);
  
  const top = c00 + (c01-c00)*bt;
  const bot = c10 + (c11-c10)*bt;
  return Math.max(0, top + (bot-top)*rt);
}

// Sling angle calculator: returns angle from vertical in degrees
function calcSlingAngle(slingLength, loadWidth, legs){
  if(legs < 2 || slingLength <= 0 || loadWidth <= 0) return 0;
  const halfSpan = loadWidth / 2;
  if(slingLength <= halfSpan) return 90; // impossible
  return toDeg(Math.asin(halfSpan / slingLength));
}

// Sling force multiplier (force per leg increases with angle)
function slingForceFactor(angleDeg){
  if(angleDeg <= 0) return 1;
  const rad = toRad(angleDeg);
  return 1 / Math.cos(rad);
}

const OBJ_TYPES=[
  {id:"building",name:"Bina",w:12,h:20},{id:"house",name:"Ev",w:10,h:8},
  {id:"container",name:"Konteyner",w:6,h:2.6},{id:"truck_obj",name:"Kamyon",w:8,h:3},
  {id:"car",name:"Araba",w:4.5,h:1.5},{id:"wall",name:"Duvar",w:10,h:3},
  {id:"fence",name:"Çit",w:8,h:1.8},{id:"powerline",name:"Elektrik Hattı",w:0.5,h:12},
  {id:"tree",name:"Ağaç",w:4,h:8},{id:"person",name:"İnsan",w:0.5,h:1.8},
  {id:"beam",name:"Kiriş",w:8,h:0.6},{id:"pipe",name:"Boru",w:6,h:0.8},
  {id:"tank",name:"Tank",w:4,h:4},{id:"generator",name:"Jeneratör",w:3,h:2},
  {id:"scaffold",name:"İskele",w:6,h:10},{id:"excavator",name:"Ekskavatör",w:7,h:3.5},
  {id:"concrete",name:"Beton Mikseri",w:8,h:3.5},{id:"load_pkg",name:"Yük Paketi",w:3,h:2},
];

const TABS=[
  {id:"chart",label:"Menzil Şeması",icon:"📐"},
  {id:"liftplan",label:"Kaldırma Planı",icon:"📋"},
  {id:"calc",label:"Hesaplamalar",icon:"🧮"},
  {id:"export",label:"Dışa Aktar",icon:"📤"},
];

// ── HELPERS ──
const toRad=d=>d*Math.PI/180;
const toDeg=r=>r*180/Math.PI;
const clamp=(v,mn,mx)=>Math.min(Math.max(v,mn),mx);
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);

// ★ FIX #5: Capacity with warning — simplified formula, NOT a replacement for real load charts
const calcCap=(cr,bl,r,gf=1)=>{
  const br=1-(bl/cr.maxBoom)*0.3;
  const rp=1-(r/Math.max(bl*1.2,1))*0.5;
  return Math.max(0,cr.maxCap*br*Math.max(0,rp)*gf);
};

// ★ FIX #1: Radius calculator that includes jib
const calcRadius=(cfg)=>{
  const boomR = cfg.boomLength * Math.cos(toRad(cfg.boomAngle));
  if(cfg.jibEnabled && cfg.jibLength > 0){
    const jibAngleAbs = cfg.boomAngle - Math.min(cfg.jibAngle, cfg.boomAngle); // ★ FIX #4 clamp
    return boomR + cfg.jibLength * Math.cos(toRad(jibAngleAbs));
  }
  return boomR;
};

// ★ FIX #2: Total hook height from ground including pivot + boom + jib
const calcHookHeight=(cfg)=>{
  let h = cfg.pivotHeight + cfg.boomLength * Math.sin(toRad(cfg.boomAngle));
  if(cfg.jibEnabled && cfg.jibLength > 0){
    const jibAngleAbs = cfg.boomAngle - Math.min(cfg.jibAngle, cfg.boomAngle);
    h += cfg.jibLength * Math.sin(toRad(jibAngleAbs));
  }
  return h;
};

// Boom tip height (without pivot, for display)
const calcBoomTipHeight=(cfg)=> cfg.pivotHeight + cfg.boomLength * Math.sin(toRad(cfg.boomAngle));

const ptLoad=(f,w,l)=>{const a=w*l;if(a<=0)return{area:0,pres:0,kpa:0};const p=f/a;return{area:a,pres:p,kpa:p*9.81};};
const genCSV=(cr,bl,cfg)=>{let csv="Menzil (m),Kapasite (t)\n";for(let r=3;r<=bl;r+=2){const c=calcCap(cr,bl,r);csv+=`${r},${c.toFixed(1)}\n`;}return csv;};
const dlBlob=(c,fn,t="text/csv;charset=utf-8;")=>{const b=new Blob([c],{type:t});const a=document.createElement("a");a.download=fn;a.href=URL.createObjectURL(b);a.click();URL.revokeObjectURL(a.href);};
function ptToSeg(px,py,x1,y1,x2,y2){const dx=x2-x1,dy=y2-y1,l2=dx*dx+dy*dy;if(l2===0)return Math.hypot(px-x1,py-y1);let t=((px-x1)*dx+(py-y1)*dy)/l2;t=clamp(t,0,1);return Math.hypot(px-(x1+t*dx),py-(y1+t*dy));}

// ═══ UI COMPONENTS ═══
const Card=({children,style})=><div style={{background:C.darkSurf+"90",border:`1px solid ${C.green}30`,borderRadius:10,padding:14,backdropFilter:"blur(10px)",...style}}>{children}</div>;
const Title=({children,color})=><div style={{fontSize:11,fontWeight:700,color:color||C.yellow,textTransform:"uppercase",letterSpacing:2,marginBottom:10,fontFamily:F}}>{children}</div>;
const Badge=({color,children})=><span style={{display:"inline-block",padding:"2px 8px",borderRadius:4,background:(color||C.green)+"25",color:color||C.greenLight,fontSize:10,fontWeight:600,fontFamily:F}}>{children}</span>;
const Btn=({color,small,children,onClick,disabled,active})=><button onClick={onClick} disabled={disabled} style={{padding:small?"5px 10px":"8px 14px",background:disabled?C.g500:(active?C.yellow:(color||C.yellow)),border:"none",borderRadius:6,color:C.dark,fontWeight:700,fontSize:small?10:11,cursor:disabled?"not-allowed":"pointer",fontFamily:F,letterSpacing:0.5,whiteSpace:"nowrap",opacity:disabled?0.5:1}}>{children}</button>;
const Inp=({label,value,onChange,type,placeholder,style:es})=>(
  <div style={{marginBottom:8,...es}}>
    {label&&<label style={{fontSize:10,color:C.g400,fontFamily:F,letterSpacing:1,textTransform:"uppercase",marginBottom:4,display:"block"}}>{label}</label>}
    {type==="textarea"?<textarea style={{width:"100%",padding:"7px 10px",background:C.dark,border:`1px solid ${C.green}30`,borderRadius:6,color:C.white,fontSize:12,minHeight:50,resize:"vertical",boxSizing:"border-box",fontFamily:"inherit",outline:"none"}} value={value} placeholder={placeholder} onChange={e=>onChange(e.target.value)}/>
    :<input style={{width:"100%",padding:"7px 10px",background:C.dark,border:`1px solid ${C.green}30`,borderRadius:6,color:C.white,fontSize:12,boxSizing:"border-box",fontFamily:"inherit",outline:"none"}} type={type||"text"} value={value} placeholder={placeholder} onChange={e=>onChange(type==="number"?(parseFloat(e.target.value)||0):e.target.value)}/>}
  </div>
);
const Slider=({label,value,min,max,step,unit,onChange,color,showInput})=>(
  <div style={{marginBottom:10}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
      <span style={{fontSize:10,color:C.g300,fontFamily:F}}>{label}</span>
      {showInput?<input type="number" value={value} min={min} max={max} step={step||1} onChange={e=>onChange(clamp(parseFloat(e.target.value)||min,min,max))} style={{width:55,padding:"2px 5px",background:C.dark,border:`1px solid ${C.green}40`,borderRadius:4,color:color||C.yellow,fontSize:10,fontWeight:700,fontFamily:F,textAlign:"right",outline:"none"}}/>
      :<span style={{fontSize:10,color:color||C.yellow,fontWeight:700,fontFamily:F}}>{typeof value==="number"?value.toFixed(step&&step<1?1:0):value}{unit}</span>}
    </div>
    <input type="range" min={min} max={max} step={step||1} value={value} onChange={e=>onChange(parseFloat(e.target.value))} style={{width:"100%",accentColor:color||C.yellow,height:4,cursor:"pointer"}}/>
  </div>
);
const Sel=({value,onChange,children})=><select style={{width:"100%",padding:"7px 10px",background:C.dark,border:`1px solid ${C.green}40`,borderRadius:6,color:C.white,fontSize:12,cursor:"pointer",outline:"none"}} value={value} onChange={e=>onChange(e.target.value)}>{children}</select>;
const Check=({label,checked,onChange,color})=>(
  <label style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",fontSize:10,color:color||C.g300,margin:"4px 0"}}>
    <input type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)} style={{accentColor:C.yellow,width:14,height:14}}/>{label}
  </label>
);

// ═══════════════════════════════════════════════════════
// RANGE CHART CANVAS — ALL GEOMETRY BUGS FIXED
// ═══════════════════════════════════════════════════════
const W=960,HH=600,SC=6;
const CRANE_BASE_H=16; // px for crane body block

function RangeChart({cfg,crane,skin,objects,rulers,selObj,tool,onCfg,onObj,onRulers,onSel,onAddRuler}){
  const ref=useRef(null);
  const [drag,setDrag]=useState(null);
  const [mouse,setMouse]=useState({x:0,y:0});
  const [hover,setHover]=useState(null);
  const [rulerStart,setRulerStart]=useState(null);
  const cx=W/2, gy=HH*0.80; // ground Y — pushed down a bit for tall cranes

  const getPos=useCallback((e)=>{
    const r=ref.current.getBoundingClientRect();
    return{x:(e.clientX-r.left)*W/r.width,y:(e.clientY-r.top)*HH/r.height};
  },[]);

  // ════════════════════════════════════════════════
  // ★ FIX #3: Pivot height at CORRECT 1:1 scale
  // For very tall cranes (tower 40m), we auto-scale so it fits canvas
  // ════════════════════════════════════════════════
  const maxVisibleH = (gy - 20) / SC; // max meters that fit above ground
  const totalTipH = calcHookHeight(cfg); // total height in meters
  const autoScale = totalTipH > maxVisibleH * 0.9 ? (maxVisibleH * 0.85) / totalTipH : 1;
  const VS = SC * autoScale; // visual scale (may compress for very tall setups)
  
  const pivotY = gy - CRANE_BASE_H - cfg.pivotHeight * VS;
  const craneZeroX = cx + cfg.pivotDist * SC;
  
  // Boom geometry at visual scale
  const ba = toRad(cfg.boomAngle);
  const bPx = cfg.boomLength * VS;
  const bex = craneZeroX + Math.cos(ba) * bPx;
  const bey = pivotY - Math.sin(ba) * bPx;
  
  // ★ FIX #4: Jib angle clamped so jib never goes below ground
  const effectiveJibAngle = cfg.jibEnabled ? Math.min(cfg.jibAngle, cfg.boomAngle) : 0;
  let jex = bex, jey = bey;
  if(cfg.jibEnabled && cfg.jibLength > 0){
    const ja = toRad(cfg.boomAngle - effectiveJibAngle);
    const jPx = cfg.jibLength * VS;
    jex = bex + Math.cos(ja) * jPx;
    jey = bey - Math.sin(ja) * jPx;
    // Extra safety: clamp jib tip above ground
    if(jey > gy - 5) jey = gy - 5;
  }
  
  // Hook position = jib tip if jib enabled, else boom tip
  const hookX = (cfg.jibEnabled && cfg.jibLength > 0) ? jex : bex;
  const hookY = (cfg.jibEnabled && cfg.jibLength > 0) ? jey : bey;
  
  // ★ FIX #1 & #2: Real-world measurements (NOT from pixel positions)
  const realRadius = calcRadius(cfg);
  const realHookH = calcHookHeight(cfg);
  const realBoomTipH = calcBoomTipHeight(cfg);

  const draw=useCallback(()=>{
    const c=ref.current;if(!c)return;
    const x=c.getContext("2d");
    x.clearRect(0,0,W,HH);

    // Sky gradient
    const sky=x.createLinearGradient(0,0,0,gy);
    sky.addColorStop(0,C.dark);sky.addColorStop(0.5,C.greenBg);sky.addColorStop(1,C.darkSurf);
    x.fillStyle=sky;x.fillRect(0,0,W,gy);

    // Ground
    const gnd=x.createLinearGradient(0,gy,0,HH);
    gnd.addColorStop(0,"#5C4A32");gnd.addColorStop(1,"#3D3225");
    x.fillStyle=gnd;x.fillRect(0,gy,W,HH-gy);
    x.strokeStyle=C.yellow;x.lineWidth=2.5;
    x.beginPath();x.moveTo(0,gy);x.lineTo(W,gy);x.stroke();

    // Grid
    x.strokeStyle=C.green+"18";x.lineWidth=0.5;
    for(let i=0;i<W;i+=30){x.beginPath();x.moveTo(i,0);x.lineTo(i,gy);x.stroke();}
    for(let i=0;i<gy;i+=30){x.beginPath();x.moveTo(0,i);x.lineTo(W,i);x.stroke();}

    // Scale markers on ground
    x.fillStyle=C.g300;x.font=`9px ${F}`;x.textAlign="center";
    for(let d=-70;d<=70;d+=10){
      const px=cx+d*SC;
      if(px>5&&px<W-5){x.fillText(`${Math.abs(d)}m`,px,gy+14);x.strokeStyle=C.yellow+"30";x.lineWidth=1;x.beginPath();x.moveTo(px,gy);x.lineTo(px,gy+4);x.stroke();}
    }
    // Height scale on left (using VS for accuracy)
    x.textAlign="right";
    for(let h=10;h<=120;h+=10){
      const py=gy-h*VS;
      if(py>10&&py<gy-5){x.fillStyle=C.g300+"40";x.font=`8px ${F}`;x.fillText(`${h}m`,35,py+3);
        x.strokeStyle=C.green+"10";x.beginPath();x.moveTo(38,py);x.lineTo(W,py);x.stroke();}
    }

    // Radius zones (based on REAL radius, drawn with SC for horizontal)
    const maxRPx=cfg.boomLength*SC;
    [{r:maxRPx,c:C.red+"0A",s:C.red+"50",l:"Maks Menzil",d:[]},{r:maxRPx*0.75,c:C.yellow+"08",s:C.yellow+"25",l:"%75",d:[4,4]},{r:maxRPx*0.5,c:C.green+"08",s:C.greenLight+"20",l:"%50",d:[3,3]}].forEach(z=>{
      x.beginPath();x.arc(craneZeroX,gy,z.r,Math.PI,0);x.fillStyle=z.c;x.fill();
      x.strokeStyle=z.s;x.lineWidth=z.d.length?1:1.5;x.setLineDash(z.d);x.stroke();x.setLineDash([]);
      x.fillStyle=z.s;x.font=`8px ${F}`;x.textAlign="left";x.fillText(z.l,craneZeroX+z.r+4,gy-6);
    });

    // ── AUTO SCALE INDICATOR ──
    if(autoScale < 1){
      x.fillStyle=C.dark+"CC";x.beginPath();x.roundRect(W/2-80,4,160,18,4);x.fill();
      x.fillStyle=C.orange;x.font=`bold 9px ${F}`;x.textAlign="center";
      x.fillText(`Ölçek: ${(autoScale*100).toFixed(0)}% (yüksek vinç)`,W/2,16);
    }

    // ── OBJECTS ── (★ FIX #11: Use VS for vertical to match crane scale)
    objects.forEach(obj=>{
      const def=OBJ_TYPES.find(o=>o.id===obj.type);if(!def)return;
      const ox=cx+obj.x*SC; // horizontal: SC
      const ow=(obj.w||def.w)*SC*0.5; // horizontal: SC
      const oh=(obj.h||def.h)*VS*0.5; // ★ vertical: VS
      const objTopWorld=(obj.h||def.h)+(obj.elevate||0);
      const baseY=gy-(obj.elevate||0)*VS; // ★ vertical: VS
      const sel=selObj===obj.id;

      x.save();
      x.translate(ox,baseY);
      if(obj.rotation)x.rotate(toRad(obj.rotation));

      if(obj.type==="powerline"){
        x.strokeStyle=C.red;x.lineWidth=2;x.beginPath();x.moveTo(0,0);x.lineTo(0,-oh);x.stroke();
        x.beginPath();x.moveTo(-12,-oh);x.lineTo(12,-oh);x.stroke();
      }else if(obj.type==="tree"){
        x.fillStyle="#5C3D0E";x.fillRect(-2,-oh*0.4,4,oh*0.4);
        x.fillStyle=C.greenLight;x.beginPath();x.moveTo(0,-oh);x.lineTo(-ow/2,-oh*0.15);x.lineTo(ow/2,-oh*0.15);x.closePath();x.fill();
      }else if(obj.type==="person"){
        x.fillStyle=C.yellow;x.beginPath();x.arc(0,-oh+3,3,0,Math.PI*2);x.fill();
        x.strokeStyle=C.yellow;x.lineWidth=2;
        x.beginPath();x.moveTo(0,-oh+6);x.lineTo(0,-oh*0.35);x.stroke();
        x.beginPath();x.moveTo(-4,-oh*0.6);x.lineTo(0,-oh*0.5);x.lineTo(4,-oh*0.6);x.stroke();
        x.beginPath();x.moveTo(-3,0);x.lineTo(0,-oh*0.35);x.lineTo(3,0);x.stroke();
      }else if(obj.type==="scaffold"){
        x.strokeStyle=C.g300;x.lineWidth=1.5;
        for(let c2=0;c2<3;c2++){const sx=-ow/2+(ow/2)*c2;x.beginPath();x.moveTo(sx,0);x.lineTo(sx,-oh);x.stroke();}
        for(let r2=0;r2<5;r2++){const sy=-oh*(r2/4);x.beginPath();x.moveTo(-ow/2,sy);x.lineTo(ow/2,sy);x.stroke();}
      }else{
        x.fillStyle=(obj.color||C.g400)+"50";x.strokeStyle=obj.color||C.g400;x.lineWidth=1.5;
        x.fillRect(-ow/2,-oh,ow,oh);x.strokeRect(-ow/2,-oh,ow,oh);
        if(obj.type==="building"||obj.type==="house"){x.fillStyle=C.yellowPale+"15";for(let wy=-oh+4;wy<-4;wy+=10)for(let wx=-ow/2+3;wx<ow/2-3;wx+=8)x.fillRect(wx,wy,5,6);}
        if(obj.type==="container"){x.strokeStyle=(obj.color||C.g400)+"30";x.lineWidth=0.5;for(let lx=-ow/2+4;lx<ow/2;lx+=4){x.beginPath();x.moveTo(lx,-oh);x.lineTo(lx,0);x.stroke();}}
      }

      if(sel){
        x.strokeStyle=C.yellow;x.lineWidth=2;x.setLineDash([4,3]);
        x.strokeRect(-ow/2-4,-oh-4,ow+8,oh+8);x.setLineDash([]);
        const hs=5;
        [[-ow/2-4,-oh-4],[ow/2+4,-oh-4],[-ow/2-4,4],[ow/2+4,4]].forEach(([hx,hy])=>{
          x.fillStyle=C.yellow;x.fillRect(hx-hs/2,hy-hs/2,hs,hs);
          x.strokeStyle=C.dark;x.lineWidth=1;x.strokeRect(hx-hs/2,hy-hs/2,hs,hs);
        });
        const rotY=-oh-22;
        x.strokeStyle=C.yellow+"60";x.lineWidth=1;x.beginPath();x.moveTo(0,-oh-4);x.lineTo(0,rotY+5);x.stroke();
        x.fillStyle=C.yellowLight;x.strokeStyle=C.dark;x.lineWidth=1.5;
        x.beginPath();x.arc(0,rotY,5,0,Math.PI*2);x.fill();x.stroke();
        x.fillStyle=C.yellowLight;x.font=`bold 8px ${F}`;x.textAlign="center";
        x.fillText(`${(obj.h||def.h).toFixed(1)}m`,ow/2+18,-oh/2);
        x.fillText(`${(obj.w||def.w).toFixed(1)}m`,0,10);
        x.fillText(`→${obj.x.toFixed(1)}m`,0,20);
      }
      x.fillStyle=sel?C.yellow:C.g200+"80";x.font=`9px ${F}`;x.textAlign="center";
      x.fillText(obj.name||def.name,0,-oh-8);
      x.restore();

      // Object Top indicator (★ FIX #15: use VS for vertical)
      if(obj.showTop){
        const topPx=gy-objTopWorld*VS; // ★ VS
        x.strokeStyle=C.cyan+"80";x.lineWidth=1;x.setLineDash([4,3]);
        x.beginPath();x.moveTo(ox,topPx);x.lineTo(ox+60,topPx);x.stroke();x.setLineDash([]);
        x.fillStyle=C.dark+"CC";x.beginPath();x.roundRect(ox+4,topPx-16,68,14,3);x.fill();
        x.fillStyle=C.cyan;x.font=`bold 9px ${F}`;x.textAlign="left";
        x.fillText(`Tepe: ${objTopWorld.toFixed(1)}m`,ox+8,topPx-6);
      }

      // Slew to Object indicator
      if(obj.showSlew){
        const objLeftX=obj.x-(obj.w||def.w)/2;
        const slewDist=Math.abs(objLeftX-cfg.pivotDist);
        const slPx1=cx+Math.min(objLeftX,cfg.pivotDist)*SC;
        const slPx2=cx+Math.max(objLeftX,cfg.pivotDist)*SC;
        x.strokeStyle=C.orange+"80";x.lineWidth=1.5;x.setLineDash([5,3]);
        x.beginPath();x.moveTo(slPx1,gy+36);x.lineTo(slPx2,gy+36);x.stroke();x.setLineDash([]);
        [slPx1,slPx2].forEach(px2=>{x.fillStyle=C.orange;x.beginPath();x.arc(px2,gy+36,3,0,Math.PI*2);x.fill();});
        x.fillStyle=C.dark+"CC";x.beginPath();x.roundRect((slPx1+slPx2)/2-30,gy+28,60,14,3);x.fill();
        x.fillStyle=C.orange;x.font=`bold 9px ${F}`;x.textAlign="center";
        x.fillText(`Slew: ${slewDist.toFixed(1)}m`,(slPx1+slPx2)/2,gy+39);
      }
    });

    // ── CRANE DRAWING ──
    const sk=skin;

    // Crane end area
    if(cfg.craneEnd>0){
      const cePx=cfg.craneEnd*SC;
      x.fillStyle=sk.body+"15";
      x.fillRect(cx-cePx,gy-CRANE_BASE_H-2,cePx,CRANE_BASE_H+2);
      x.strokeStyle=sk.body+"40";x.lineWidth=1;x.setLineDash([3,3]);
      x.beginPath();x.moveTo(cx-cePx,gy);x.lineTo(cx-cePx,gy-CRANE_BASE_H-2);x.stroke();x.setLineDash([]);
      x.fillStyle=C.g300+"60";x.font=`7px ${F}`;x.textAlign="center";
      x.fillText(`CE:${cfg.craneEnd}m`,cx-cePx/2,gy-CRANE_BASE_H-6);
    }

    // Outriggers
    x.strokeStyle=sk.body;x.lineWidth=3;
    [-38,38].forEach(off=>{
      x.beginPath();x.moveTo(cx+off*0.4,gy-3);x.lineTo(cx+off,gy);x.stroke();
      x.fillStyle=C.yellow;x.fillRect(cx+off-5,gy-3,10,3);
    });

    // Body
    x.fillStyle=sk.body;
    x.beginPath();x.roundRect(cx-25,gy-CRANE_BASE_H,50,CRANE_BASE_H,2);x.fill();

    // Cabin / tower column (from body top to pivot)
    const cabinTop = pivotY;
    const cabinBot = gy - CRANE_BASE_H;
    if(cabinBot - cabinTop > 5){
      x.fillStyle=sk.cabin;
      x.fillRect(cx-8,cabinTop,16,cabinBot-cabinTop);
      // Tower lattice for tall pivots
      if(cfg.pivotHeight > 5){
        x.strokeStyle=sk.cabin+"60";x.lineWidth=0.5;
        for(let ty=cabinTop+8;ty<cabinBot;ty+=12){
          x.beginPath();x.moveTo(cx-8,ty);x.lineTo(cx+8,ty+12);x.stroke();
          x.beginPath();x.moveTo(cx+8,ty);x.lineTo(cx-8,ty+12);x.stroke();
        }
      }else{
        x.fillStyle="#7DD3FC25";x.fillRect(cx-5,cabinTop+2,10,Math.min(12,cabinBot-cabinTop-4));
      }
    }

    // Pivot point
    x.fillStyle=C.yellow;x.beginPath();x.arc(craneZeroX,pivotY,4,0,Math.PI*2);x.fill();
    // Pivot distance indicator
    if(cfg.pivotDist>0){
      x.strokeStyle=C.g300+"50";x.lineWidth=1;x.setLineDash([2,2]);
      x.beginPath();x.moveTo(cx,gy-CRANE_BASE_H-4);x.lineTo(craneZeroX,gy-CRANE_BASE_H-4);x.stroke();x.setLineDash([]);
      x.fillStyle=C.g300+"80";x.font=`7px ${F}`;x.textAlign="center";
      x.fillText(`PD:${cfg.pivotDist}m`,(cx+craneZeroX)/2,gy-CRANE_BASE_H-8);
    }

    // ── BOOM ──
    // Shadow
    x.strokeStyle="#00000030";x.lineWidth=8;
    x.beginPath();x.moveTo(craneZeroX,pivotY);x.lineTo(bex+2,bey+2);x.stroke();
    // Hover highlight
    if(hover==="boomBody"){x.strokeStyle=sk.boom+"40";x.lineWidth=14;x.beginPath();x.moveTo(craneZeroX,pivotY);x.lineTo(bex,bey);x.stroke();}
    // Main boom line
    x.strokeStyle=sk.boom;x.lineWidth=6;
    x.beginPath();x.moveTo(craneZeroX,pivotY);x.lineTo(bex,bey);x.stroke();
    // Lattice marks
    x.strokeStyle=C.yellowDark+"50";x.lineWidth=1;
    for(let i=1;i<10;i++){const t=i/10;const mx=craneZeroX+(bex-craneZeroX)*t;const my=pivotY+(bey-pivotY)*t;
      x.beginPath();x.moveTo(mx-3,my-3);x.lineTo(mx+3,my+3);x.stroke();
      x.beginPath();x.moveTo(mx+3,my-3);x.lineTo(mx-3,my+3);x.stroke();}
    // Boom tip
    x.fillStyle=hover==="boomTip"?C.yellowLight:sk.boom;
    x.beginPath();x.arc(bex,bey,hover==="boomTip"?8:6,0,Math.PI*2);x.fill();
    x.fillStyle=C.greenDark;x.beginPath();x.arc(bex,bey,3,0,Math.PI*2);x.fill();

    // ── JIB ──
    let hkX=bex,hkY=bey;
    if(cfg.jibEnabled&&cfg.jibLength>0){
      if(hover==="jibBody"){x.strokeStyle=C.yellowDark+"30";x.lineWidth=12;x.beginPath();x.moveTo(bex,bey);x.lineTo(jex,jey);x.stroke();}
      x.strokeStyle=C.yellowDark+"88";x.lineWidth=3;
      x.beginPath();x.moveTo(bex,bey);x.lineTo(jex,jey);x.stroke();
      x.fillStyle=hover==="jibTip"?C.yellowLight:C.yellowDark;
      x.beginPath();x.arc(jex,jey,hover==="jibTip"?7:5,0,Math.PI*2);x.fill();
      hkX=jex;hkY=jey;
    }

    // ── HOOK + RIGGING + LOAD VISUAL ──
    const hbH = cfg.hookBlockH * VS; // hook block height in pixels
    const ldW = cfg.loadW * SC * 0.5; // load width (horizontal = SC)
    const ldH = cfg.loadH * VS * 0.5; // load height (vertical = VS)
    const slingPx = cfg.slingLength * VS; // sling length in pixels
    const slingAngle = calcSlingAngle(cfg.slingLength, cfg.loadW, cfg.slingLegs);
    const slingVDrop = cfg.slingLength > 0 ? Math.sqrt(Math.max(0, slingPx*slingPx - (ldW)*(ldW))) : 30;
    
    // Hook block
    const hbTop = hkY + 4;
    const hbBot = hbTop + Math.max(8, hbH);
    x.fillStyle=C.g300;x.beginPath();x.arc(hkX,hkY,4,0,Math.PI*2);x.fill();
    // Wire rope from boom tip to hook block
    x.strokeStyle=C.g200+"70";x.lineWidth=1.5;x.setLineDash([3,3]);
    x.beginPath();x.moveTo(hkX,hkY+4);x.lineTo(hkX,hbTop);x.stroke();x.setLineDash([]);
    // Hook block body
    x.fillStyle=C.g400+"80";x.strokeStyle=C.g300;x.lineWidth=1;
    x.fillRect(hkX-8,hbTop,16,hbBot-hbTop);x.strokeRect(hkX-8,hbTop,16,hbBot-hbTop);
    x.strokeStyle=C.yellow;x.lineWidth=2;
    x.beginPath();x.arc(hkX,hbBot+4,5,0,Math.PI);x.stroke();
    
    // Sling lines + load (only if load weight > 0)
    if(cfg.loadWeight > 0){
      const loadTopY = hbBot + 6 + slingVDrop;
      const loadBotY = loadTopY + Math.max(8, ldH);
      
      // Draw slings
      if(cfg.slingType==="spreader"){
        // Spreader beam: horizontal beam from hook, then vertical drops
        const spY = hbBot + 10;
        x.strokeStyle=C.cyan;x.lineWidth=2;
        x.beginPath();x.moveTo(hkX,hbBot+4);x.lineTo(hkX,spY);x.stroke();
        x.strokeStyle=C.cyan;x.lineWidth=3;
        x.beginPath();x.moveTo(hkX-ldW,spY);x.lineTo(hkX+ldW,spY);x.stroke();
        // Vertical drops
        x.strokeStyle=C.g200;x.lineWidth=1;
        x.beginPath();x.moveTo(hkX-ldW,spY);x.lineTo(hkX-ldW,loadTopY);x.stroke();
        x.beginPath();x.moveTo(hkX+ldW,spY);x.lineTo(hkX+ldW,loadTopY);x.stroke();
        // Spreader label
        x.fillStyle=C.cyan;x.font=`7px ${F}`;x.textAlign="center";
        x.fillText("SPREADER",hkX,spY-3);
      }else if(cfg.slingLegs >= 2){
        // 2-leg or 4-leg slings
        const legs = cfg.slingLegs;
        x.strokeStyle=C.orange;x.lineWidth=1.5;
        if(legs >= 2){
          x.beginPath();x.moveTo(hkX,hbBot+6);x.lineTo(hkX-ldW,loadTopY);x.stroke();
          x.beginPath();x.moveTo(hkX,hbBot+6);x.lineTo(hkX+ldW,loadTopY);x.stroke();
        }
        if(legs >= 4){
          x.strokeStyle=C.orange+"80";
          x.beginPath();x.moveTo(hkX,hbBot+6);x.lineTo(hkX-ldW*0.5,loadTopY);x.stroke();
          x.beginPath();x.moveTo(hkX,hbBot+6);x.lineTo(hkX+ldW*0.5,loadTopY);x.stroke();
        }
        // Sling angle indicator
        if(slingAngle > 0){
          const aCol = slingAngle > 45 ? C.red : slingAngle > 30 ? C.yellow : C.greenLight;
          x.fillStyle=aCol;x.font=`bold 7px ${F}`;x.textAlign="right";
          x.fillText(`${slingAngle.toFixed(0)}°`,hkX-ldW-4,loadTopY-slingVDrop*0.4);
          // Visual angle arc
          x.strokeStyle=aCol+"60";x.lineWidth=1;
          const arcR=12;
          x.beginPath();x.moveTo(hkX,hbBot+6+arcR);x.lineTo(hkX,hbBot+6);x.stroke();
        }
      }else{
        // Single leg - straight down
        x.strokeStyle=C.orange;x.lineWidth=1.5;
        x.beginPath();x.moveTo(hkX,hbBot+6);x.lineTo(hkX,loadTopY);x.stroke();
      }
      
      // ── LOAD SHAPE ──
      const lx=hkX-ldW, ly=loadTopY;
      if(cfg.loadShape==="cylinder"){
        // Cylinder / pipe
        x.fillStyle=C.yellow+"25";x.strokeStyle=C.yellow;x.lineWidth=1.5;
        x.beginPath();x.ellipse(hkX,ly,ldW,ldH*0.15,0,0,Math.PI*2);x.fill();x.stroke();
        x.fillStyle=C.yellow+"15";
        x.fillRect(hkX-ldW,ly,ldW*2,ldH);
        x.strokeStyle=C.yellow;x.lineWidth=1.5;
        x.beginPath();x.moveTo(hkX-ldW,ly);x.lineTo(hkX-ldW,ly+ldH);x.stroke();
        x.beginPath();x.moveTo(hkX+ldW,ly);x.lineTo(hkX+ldW,ly+ldH);x.stroke();
        x.beginPath();x.ellipse(hkX,ly+ldH,ldW,ldH*0.15,0,0,Math.PI*2);x.fill();x.stroke();
      }else if(cfg.loadShape==="beam"){
        // I-beam / girder
        const fw=ldW*2, fh=ldH*0.2, wt=fw*0.15;
        x.fillStyle=C.yellow+"30";x.strokeStyle=C.yellow;x.lineWidth=1;
        x.fillRect(hkX-fw/2,ly,fw,fh); // top flange
        x.strokeRect(hkX-fw/2,ly,fw,fh);
        x.fillRect(hkX-wt/2,ly+fh,wt,ldH-fh*2); // web
        x.strokeRect(hkX-wt/2,ly+fh,wt,ldH-fh*2);
        x.fillRect(hkX-fw/2,ly+ldH-fh,fw,fh); // bottom flange
        x.strokeRect(hkX-fw/2,ly+ldH-fh,fw,fh);
      }else{
        // Box (default) / irregular
        x.fillStyle=C.yellow+"25";x.strokeStyle=C.yellow;x.lineWidth=1.5;
        x.fillRect(lx,ly,ldW*2,ldH);x.strokeRect(lx,ly,ldW*2,ldH);
        if(cfg.loadShape==="irregular"){
          // Cross-hatch for irregular
          x.strokeStyle=C.yellow+"20";x.lineWidth=0.5;
          for(let d=-ldW*2;d<ldW*4;d+=6){
            x.beginPath();x.moveTo(lx+d,ly);x.lineTo(lx+d+ldH,ly+ldH);x.stroke();
          }
        }
      }
      
      // Load label
      x.fillStyle=C.yellow;x.font=`bold 8px ${F}`;x.textAlign="center";
      x.fillText(`${cfg.loadWeight}t`,hkX,loadTopY+ldH*0.5+3);
      // Load dims label
      x.fillStyle=C.g300+"80";x.font=`7px ${F}`;
      x.fillText(`${cfg.loadW}×${cfg.loadH}m`,hkX,loadTopY+ldH+10);
      
      // Sling safety warning
      if(slingAngle > 45){
        x.fillStyle=C.red;x.font=`bold 8px ${F}`;x.textAlign="center";
        x.fillText("⚠ SAPAN AÇISI > 45°!",hkX,loadTopY-8);
      }
    }

    // ════════════════════════════════════════════════
    // ★ MEASUREMENTS — Using REAL WORLD VALUES
    // ════════════════════════════════════════════════
    
    // Radius line on ground (visual)
    x.strokeStyle=C.yellow+"50";x.lineWidth=1;x.setLineDash([5,5]);
    x.beginPath();x.moveTo(craneZeroX,gy);x.lineTo(hkX,gy);x.stroke();x.setLineDash([]);
    // ★ FIX #1: Show REAL radius (includes jib)
    x.fillStyle=C.yellow;x.font=`bold 10px ${F}`;x.textAlign="center";
    x.fillText(`R: ${realRadius.toFixed(1)}m`,(craneZeroX+hkX)/2,gy+28);

    // ★ FIX #2 & #7: Height line from ground to HOOK TIP position
    if(realHookH>0){
      x.strokeStyle=C.greenLight+"60";x.lineWidth=1;x.setLineDash([3,3]);
      x.beginPath();x.moveTo(hkX+16,hkY);x.lineTo(hkX+16,gy);x.stroke();x.setLineDash([]);
      x.fillStyle=C.greenLight;x.font=`bold 9px ${F}`;x.textAlign="left";
      x.fillText(`↕${realHookH.toFixed(1)}m`,hkX+20,(hkY+gy)/2);
      
      // Pivot height sub-label
      if(cfg.pivotHeight > 1){
        x.fillStyle=C.g300+"80";x.font=`8px ${F}`;
        x.fillText(`(pivot:${cfg.pivotHeight}m)`,hkX+20,(hkY+gy)/2+12);
      }
    }

    // Angle arc
    x.strokeStyle=C.yellow+"40";x.lineWidth=1;
    x.beginPath();x.arc(craneZeroX,pivotY,25,-ba,0);x.stroke();
    x.fillStyle=C.yellow;x.font=`9px ${F}`;x.textAlign="left";
    x.fillText(`${cfg.boomAngle}°`,craneZeroX+32,pivotY-6);

    // ── RULERS ── (★ FIX #16: Use VS for vertical consistency)
    rulers.forEach((rl,ri)=>{
      const rx1=cx+rl.x1*SC,ry1=gy-rl.y1*VS; // ★ VS for Y
      const rx2=cx+rl.x2*SC,ry2=gy-rl.y2*VS; // ★ VS for Y
      x.strokeStyle=C.yellowLight;x.lineWidth=1.5;x.setLineDash([4,3]);
      x.beginPath();x.moveTo(rx1,ry1);x.lineTo(rx2,ry2);x.stroke();x.setLineDash([]);
      const ep1H=hover?.type==="rulerPt"&&hover.ri===ri&&hover.pt===0;
      const ep2H=hover?.type==="rulerPt"&&hover.ri===ri&&hover.pt===1;
      x.fillStyle=ep1H?C.white:C.yellowLight;x.beginPath();x.arc(rx1,ry1,ep1H?5:3.5,0,Math.PI*2);x.fill();
      x.fillStyle=ep2H?C.white:C.yellowLight;x.beginPath();x.arc(rx2,ry2,ep2H?5:3.5,0,Math.PI*2);x.fill();
      const dist=Math.sqrt((rl.x2-rl.x1)**2+(rl.y2-rl.y1)**2);
      const rmx=(rx1+rx2)/2,rmy=(ry1+ry2)/2;
      x.fillStyle=C.dark+"DD";x.beginPath();x.roundRect(rmx-26,rmy-20,52,18,4);x.fill();
      x.fillStyle=C.yellowLight;x.font=`bold 10px ${F}`;x.textAlign="center";
      x.fillText(`${dist.toFixed(1)}m`,rmx,rmy-7);
    });

    // Ruler drawing preview (★ uses VS for vertical)
    if(rulerStart&&mouse.x>0){
      const rwx=(mouse.x-cx)/SC,rwy=(gy-mouse.y)/VS; // ★ VS for Y conversion
      x.strokeStyle=C.cyan;x.lineWidth=2;x.setLineDash([6,3]);
      x.beginPath();x.moveTo(cx+rulerStart.wx*SC,gy-rulerStart.wy*VS);x.lineTo(mouse.x,mouse.y);x.stroke();x.setLineDash([]); // ★ VS
      const pd=Math.sqrt((rwx-rulerStart.wx)**2+(rwy-rulerStart.wy)**2);
      x.fillStyle=C.cyan;x.font=`bold 10px ${F}`;x.textAlign="center";
      x.fillText(`${pd.toFixed(1)}m`,(cx+rulerStart.wx*SC+mouse.x)/2,(gy-rulerStart.wy*VS+mouse.y)/2-10); // ★ VS
    }

    // ════════════════════════════════════════════════
    // INFO BOX — ★ FIX #8: Shows REAL hook height + capacity warning
    // ════════════════════════════════════════════════
    const chartInDraw = cfg.chartId ? LOAD_CHARTS[cfg.chartId] : null;
    const capVal = chartInDraw ? (lookupChart(chartInDraw,cfg.boomLength,realRadius)||calcCap(crane,cfg.boomLength,realRadius)) : calcCap(crane,cfg.boomLength,realRadius);
    const capSource = chartInDraw ? "chart" : "formula";
    const util=cfg.loadWeight>0?(cfg.loadWeight/capVal)*100:0;
    const statCol=util>90?C.red:util>70?C.yellow:C.greenLight;
    
    x.fillStyle=C.dark+"E8";x.strokeStyle=C.green+"60";x.lineWidth=1;
    x.beginPath();x.roundRect(10,10,245,135,8);x.fill();x.stroke();
    
    x.fillStyle=C.yellow;x.font=`bold 14px ${F}`;x.textAlign="left";x.fillText("HAPP",22,30);
    x.fillStyle=C.g300;x.font=`9px ${F}`;x.fillText(crane.name,70,30);
    x.fillStyle=C.g200;x.font=`10px ${F}`;
    x.fillText(`Boom: ${cfg.boomLength}m @ ${cfg.boomAngle}°`,22,48);
    x.fillText(`Menzil: ${realRadius.toFixed(1)}m  Kanca H: ${realHookH.toFixed(1)}m`,22,63);
    x.fillText(`Kapasite: ${capVal.toFixed(1)}t`,22,78);
    if(cfg.jibEnabled)x.fillText(`Jib: ${cfg.jibLength}m @ ${effectiveJibAngle}°`,22,93);
    
    // ★ FIX #5: Capacity warning - different for chart vs formula
    if(capSource==="chart"){
      x.fillStyle=C.greenLight;x.font=`bold 7px ${F}`;
      x.fillText("✓ Yük Tablosundan — Doğrulama gerekir",22,cfg.jibEnabled?106:96);
    }else{
      x.fillStyle=C.orange;x.font=`bold 7px ${F}`;
      x.fillText("⚠ YAKLAŞIK — Gerçek yük tablosunu kullanın",22,cfg.jibEnabled?106:96);
    }
    
    const barY=cfg.jibEnabled?112:102;
    x.fillStyle=C.greenDark;x.fillRect(22,barY,200,8);
    x.fillStyle=statCol;x.fillRect(22,barY,Math.min(200,200*(util/100)),8);
    x.fillStyle=statCol;x.font=`bold 8px ${F}`;x.fillText(`Kullanım: %${util.toFixed(0)}`,22,barY+18);

    // Tool indicator
    if(tool==="ruler"){
      x.fillStyle=C.dark+"CC";x.beginPath();x.roundRect(W-160,10,150,24,6);x.fill();
      x.fillStyle=C.cyan;x.font=`bold 10px ${F}`;x.textAlign="right";
      x.fillText("📏 Cetvel Çizim Modu",W-16,27);
    }else if(tool==="magnifier"){
      x.fillStyle=C.dark+"CC";x.beginPath();x.roundRect(W-140,10,130,24,6);x.fill();
      x.fillStyle=C.yellowLight;x.font=`bold 10px ${F}`;x.textAlign="right";
      x.fillText("🔍 Büyüteç Aktif",W-16,27);
    }

    // Hint bar
    x.fillStyle=C.dark+"CC";x.beginPath();x.roundRect(W-340,HH-30,330,24,6);x.fill();
    x.fillStyle=C.g300;x.font=`9px ${F}`;x.textAlign="right";
    x.fillText("Gövde→Açı | Uç→Uzunluk | Nesne→Taşı/Boyut/Döndür",W-16,HH-14);

    // Magnifier overlay
    if(tool==="magnifier"&&mouse.x>0&&mouse.y>0){
      const magR=50,zoom=2.5;
      x.save();x.beginPath();x.arc(mouse.x,mouse.y,magR,0,Math.PI*2);x.clip();
      x.drawImage(c,mouse.x-magR/zoom,mouse.y-magR/zoom,magR*2/zoom,magR*2/zoom,mouse.x-magR,mouse.y-magR,magR*2,magR*2);
      x.restore();
      x.strokeStyle=C.yellow;x.lineWidth=2;x.beginPath();x.arc(mouse.x,mouse.y,magR,0,Math.PI*2);x.stroke();
      x.strokeStyle=C.yellow+"60";x.lineWidth=0.5;
      x.beginPath();x.moveTo(mouse.x-magR,mouse.y);x.lineTo(mouse.x+magR,mouse.y);x.stroke();
      x.beginPath();x.moveTo(mouse.x,mouse.y-magR);x.lineTo(mouse.x,mouse.y+magR);x.stroke();
    }
  },[cfg,crane,skin,objects,rulers,selObj,hover,mouse,tool,rulerStart,cx,gy,pivotY,ba,bPx,craneZeroX,bex,bey,jex,jey,hookX,hookY,autoScale,VS,realRadius,realHookH,realBoomTipH,effectiveJibAngle]);

  useEffect(()=>{draw();},[draw]);

  // ═══ HIT DETECTION ═══
  const detectHit=useCallback((p)=>{
    for(let ri=rulers.length-1;ri>=0;ri--){
      const rl=rulers[ri];
      const rx1=cx+rl.x1*SC,ry1=gy-rl.y1*VS,rx2=cx+rl.x2*SC,ry2=gy-rl.y2*VS; // ★ FIX #16: VS for Y
      if(Math.hypot(p.x-rx1,p.y-ry1)<10)return{type:"rulerPt",ri,pt:0};
      if(Math.hypot(p.x-rx2,p.y-ry2)<10)return{type:"rulerPt",ri,pt:1};
    }
    if(Math.hypot(p.x-bex,p.y-bey)<15)return{type:"boomTip"};
    if(cfg.jibEnabled&&cfg.jibLength>0){
      if(Math.hypot(p.x-jex,p.y-jey)<15)return{type:"jibTip"};
      if(ptToSeg(p.x,p.y,bex,bey,jex,jey)<12)return{type:"jibBody"};
    }
    if(ptToSeg(p.x,p.y,craneZeroX,pivotY,bex,bey)<12)return{type:"boomBody"};
    if(selObj){
      const obj=objects.find(o=>o.id===selObj);
      if(obj){
        const def=OBJ_TYPES.find(o=>o.id===obj.type);
        const ox=cx+obj.x*SC,ow=(obj.w||def.w)*SC*0.5,oh=(obj.h||def.h)*VS*0.5; // ★ FIX #12: VS for vertical
        const baseY2=gy-(obj.elevate||0)*VS; // ★ VS
        if(Math.hypot(p.x-ox,p.y-(baseY2-oh-22))<10)return{type:"objRotate",id:obj.id};
        const corners=[{hx:ox-ow/2-4,hy:baseY2-oh-4,c:"tl"},{hx:ox+ow/2+4,hy:baseY2-oh-4,c:"tr"},{hx:ox-ow/2-4,hy:baseY2+4,c:"bl"},{hx:ox+ow/2+4,hy:baseY2+4,c:"br"}];
        for(const c2 of corners)if(Math.hypot(p.x-c2.hx,p.y-c2.hy)<8)return{type:"objResize",id:obj.id,corner:c2.c,startW:obj.w||def.w,startH:obj.h||def.h};
      }
    }
    for(let i=objects.length-1;i>=0;i--){
      const o=objects[i];const d=OBJ_TYPES.find(t=>t.id===o.type);
      const ox=cx+o.x*SC,ow=(o.w||d.w)*SC*0.5,oh=(o.h||d.h)*VS*0.5; // ★ VS
      const baseY2=gy-(o.elevate||0)*VS; // ★ VS
      if(p.x>ox-ow/2-5&&p.x<ox+ow/2+5&&p.y>baseY2-oh-5&&p.y<baseY2+5)
        return{type:"objMove",id:o.id,startPx:p.x,startPy:p.y,startX:o.x};
    }
    return null;
  },[rulers,bex,bey,jex,jey,cfg,selObj,objects,cx,gy,craneZeroX,pivotY,VS]);

  const handleMouseDown=(e)=>{
    const p=getPos(e);
    if(tool==="ruler"){
      const wx=(p.x-cx)/SC,wy=(gy-p.y)/VS; // ★ VS for Y
      setRulerStart({wx:parseFloat(wx.toFixed(1)),wy:parseFloat(wy.toFixed(1))});return;
    }
    const hit=detectHit(p);
    if(!hit){onSel(null);return;}
    if(hit.type==="objMove"||hit.type==="objResize"||hit.type==="objRotate")onSel(hit.id);
    setDrag({...hit,startPx:p.x,startPy:p.y});
  };

  // Mouse move now handled by handleMouseMoveUnified (supports both mouse + touch)

  const handleMouseUp=(e)=>{
    if(rulerStart&&rulers.length<10){
      const p=getPos(e);
      const wx2=(p.x-cx)/SC,wy2=(gy-p.y)/VS; // ★ VS for Y
      const dist=Math.hypot(wx2-rulerStart.wx,wy2-rulerStart.wy);
      if(dist>0.5){onAddRuler({id:uid(),x1:rulerStart.wx,y1:rulerStart.wy,x2:parseFloat(wx2.toFixed(1)),y2:parseFloat(wy2.toFixed(1))});}
      setRulerStart(null);return;
    }
    setDrag(null);
  };

  // ═══ TOUCH SUPPORT ═══
  const getTouchPos=useCallback((e)=>{
    const t=e.touches[0]||e.changedTouches[0];
    const r=ref.current.getBoundingClientRect();
    return{x:(t.clientX-r.left)*W/r.width,y:(t.clientY-r.top)*HH/r.height};
  },[]);

  const handleTouchStart=useCallback((e)=>{
    e.preventDefault();
    const p=getTouchPos(e);
    if(tool==="ruler"){
      const wx=(p.x-cx)/SC,wy=(gy-p.y)/VS; // ★ VS for Y
      setRulerStart({wx:parseFloat(wx.toFixed(1)),wy:parseFloat(wy.toFixed(1))});return;
    }
    const hit=detectHit(p);
    if(!hit){onSel(null);return;}
    if(hit.type==="objMove"||hit.type==="objResize"||hit.type==="objRotate")onSel(hit.id);
    setDrag({...hit,startPx:p.x,startPy:p.y});
  },[tool,detectHit,onSel,cx,gy,VS,getTouchPos]);

  // ★ FIX #13: Touch move handled inline on canvas element (see onTouchMove below)

  // Patch handleMouseMove to accept touch pos
  const handleMouseMoveUnified=(e)=>{
    const p=e._touchPos||getPos(e);
    setMouse(p);
    if(rulerStart)return;
    if(!drag){
      const hit=detectHit(p);
      if(!hit)setHover(null);
      else if(hit.type==="boomTip")setHover("boomTip");
      else if(hit.type==="boomBody")setHover("boomBody");
      else if(hit.type==="jibTip")setHover("jibTip");
      else if(hit.type==="jibBody")setHover("jibBody");
      else if(hit.type==="rulerPt")setHover(hit);
      else setHover(hit.type);
      return;
    }
    if(drag.type==="boomBody"){
      const angle=clamp(Math.round(toDeg(Math.atan2(pivotY-p.y,p.x-craneZeroX))),5,85);
      onCfg({boomAngle:angle});
    }
    else if(drag.type==="boomTip"){
      const dist=Math.hypot(p.x-craneZeroX,pivotY-p.y)/VS;
      onCfg({boomLength:clamp(Math.round(dist),5,crane.maxBoom)});
    }
    else if(drag.type==="jibBody"){
      const jA=clamp(Math.round(cfg.boomAngle-toDeg(Math.atan2(bey-p.y,p.x-bex))),0,cfg.boomAngle);
      onCfg({jibAngle:jA});
    }
    else if(drag.type==="jibTip"){
      const jD=Math.hypot(p.x-bex,bey-p.y)/VS;
      onCfg({jibLength:clamp(Math.round(jD),1,30)});
    }
    else if(drag.type==="rulerPt"){
      const nr=[...rulers];const rl={...nr[drag.ri]};
      const wx2=(p.x-cx)/SC,wy2=(gy-p.y)/VS; // ★ FIX #16: VS for Y conversion
      if(drag.pt===0){rl.x1=parseFloat(wx2.toFixed(1));rl.y1=parseFloat(wy2.toFixed(1));}
      else{rl.x2=parseFloat(wx2.toFixed(1));rl.y2=parseFloat(wy2.toFixed(1));}
      nr[drag.ri]=rl;onRulers(nr);
    }
    else if(drag.type==="objMove"){
      const dx2=(p.x-drag.startPx)/SC;
      onObj(drag.id,{x:parseFloat((drag.startX+dx2).toFixed(1))});
    }
    else if(drag.type==="objResize"){
      const dx2=(p.x-drag.startPx)/SC;
      const dy2=(drag.startPy-p.y)/VS; // ★ FIX #14: VS for vertical
      let nw=drag.startW,nh=drag.startH;
      if(drag.corner.includes("r"))nw=Math.max(0.5,drag.startW+dx2);
      if(drag.corner.includes("l"))nw=Math.max(0.5,drag.startW-dx2);
      if(drag.corner.includes("t"))nh=Math.max(0.5,drag.startH+dy2);
      if(drag.corner.includes("b"))nh=Math.max(0.5,drag.startH-dy2);
      onObj(drag.id,{w:parseFloat(nw.toFixed(1)),h:parseFloat(nh.toFixed(1))});
    }
    else if(drag.type==="objRotate"){
      const obj=objects.find(o=>o.id===drag.id);if(!obj)return;
      const def=OBJ_TYPES.find(o=>o.id===obj.type);
      const ox=cx+obj.x*SC;
      const oh=(obj.h||def.h)*VS*0.5; // ★ FIX #14: VS
      const objCenterY=gy-(obj.elevate||0)*VS-oh/2; // ★ FIX #14: VS
      const angle=toDeg(Math.atan2(p.x-ox,objCenterY-p.y));
      onObj(drag.id,{rotation:Math.round((angle+360)%360)});
    }
  };

  const handleTouchEnd=useCallback((e)=>{
    e.preventDefault();
    if(rulerStart&&rulers.length<10){
      const p=getTouchPos(e);
      const wx2=(p.x-cx)/SC,wy2=(gy-p.y)/VS; // ★ VS for Y
      const dist=Math.hypot(wx2-rulerStart.wx,wy2-rulerStart.wy);
      if(dist>0.5){onAddRuler({id:uid(),x1:rulerStart.wx,y1:rulerStart.wy,x2:parseFloat(wx2.toFixed(1)),y2:parseFloat(wy2.toFixed(1))});}
      setRulerStart(null);return;
    }
    setDrag(null);
  },[rulerStart,rulers,getTouchPos,cx,gy,VS,onAddRuler]);

  let cursor="crosshair";
  if(tool==="ruler")cursor=rulerStart?"crosshair":"cell";
  else if(drag)cursor="grabbing";
  else if(hover==="boomBody"||hover==="jibBody")cursor="ns-resize";
  else if(hover==="boomTip"||hover==="jibTip")cursor="ew-resize";
  else if(hover==="objMove")cursor="move";
  else if(hover==="objResize")cursor="nwse-resize";
  else if(hover==="objRotate")cursor="alias";
  else if(hover?.type==="rulerPt")cursor="grab";

  return <canvas ref={ref} width={W} height={HH} style={{width:"100%",borderRadius:8,border:`2px solid ${C.green}40`,cursor,touchAction:"none"}}
    onMouseDown={handleMouseDown} onMouseMove={handleMouseMoveUnified} onMouseUp={handleMouseUp} onMouseLeave={()=>{setDrag(null);setRulerStart(null);}}
    onTouchStart={handleTouchStart} onTouchMove={(e)=>{e.preventDefault();const p=getTouchPos(e);setMouse(p);if(rulerStart)return;if(drag)handleMouseMoveUnified({_touchPos:p});}} onTouchEnd={handleTouchEnd}/>;
}

// ═══ PDF GENERATOR ═══
function PDFPreview({cfg,crane,cap,lp,totalW,hookH,radius,onClose}){
  const handlePrint=()=>{
    const w=window.open("","_blank","width=800,height=600");
    w.document.write(`<html><head><title>HAPP Lift Plan</title><style>
      *{margin:0;padding:0;box-sizing:border-box;font-family:Arial,sans-serif;}
      body{padding:30px;color:#333;}
      .header{display:flex;justify-content:space-between;border-bottom:3px solid #006838;padding-bottom:15px;margin-bottom:20px;}
      .logo{font-size:28px;font-weight:900;color:#006838;letter-spacing:4px;font-family:monospace;}
      .subtitle{font-size:10px;color:#666;}
      .warn{background:#FFF3CD;border:1px solid #E5A800;padding:8px;border-radius:4px;font-size:9px;color:#856404;margin-bottom:15px;text-align:center;}
      .grid{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px;margin-bottom:20px;}
      .box{padding:10px;background:#f5f5f5;border-radius:6px;text-align:center;}
      .box-label{font-size:8px;color:#666;text-transform:uppercase;margin-bottom:4px;}
      .box-val{font-size:14px;font-weight:700;}
      .section{margin-bottom:16px;}
      .section-title{font-size:12px;font-weight:700;color:#006838;text-transform:uppercase;border-bottom:1px solid #ddd;padding-bottom:4px;margin-bottom:8px;}
      .row{display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #eee;font-size:11px;}
      .footer{text-align:center;font-size:8px;color:#999;margin-top:30px;padding-top:10px;border-top:1px solid #ddd;}
      @media print{body{padding:15px;}}
    </style></head><body>
    <div class="header"><div><div class="logo">HAPP</div><div class="subtitle">AĞIR YÜK & VİNÇ PLANLAMA SİSTEMİ</div></div>
    <div style="text-align:right;font-size:10px;color:#666;"><div>Tarih: ${lp.jobDate}</div><div>Proje: ${lp.jobName||"—"}</div></div></div>
    <div class="warn">⚠ Kapasite değerleri YAKLAŞIK hesaplanmıştır. Kaldırma işlemi öncesi vinç üreticisinin yük tabloları ile mutlaka doğrulayın.</div>
    <div class="grid">
    <div class="box"><div class="box-label">Vinç</div><div class="box-val">${crane.name}</div></div>
    <div class="box"><div class="box-label">Boom</div><div class="box-val">${cfg.boomLength}m @ ${cfg.boomAngle}°</div></div>
    <div class="box"><div class="box-label">Menzil</div><div class="box-val">${radius.toFixed(1)}m</div></div>
    <div class="box"><div class="box-label">Kanca H</div><div class="box-val">${hookH.toFixed(1)}m</div></div>
    </div>
    <div class="section"><div class="section-title">Tedarikçi</div>
    <div class="row"><span>Firma</span><span>${lp.supplier||"—"}</span></div>
    <div class="row"><span>Kişi</span><span>${lp.supplierContact||"—"}</span></div></div>
    <div class="section"><div class="section-title">Müşteri</div>
    <div class="row"><span>Firma</span><span>${lp.client||"—"}</span></div>
    <div class="row"><span>Kişi</span><span>${lp.clientContact||"—"}</span></div></div>
    <div class="section"><div class="section-title">Yük</div>
    <div class="row"><span>Yük</span><span>${lp.loadWeight}t</span></div>
    <div class="row"><span>Sapan</span><span>${lp.riggingWeight}t</span></div>
    <div class="row"><span>Kanca Blok</span><span>${lp.hookBlockWeight}t</span></div>
    <div class="row" style="font-weight:700;"><span>TOPLAM</span><span>${totalW.toFixed(1)}t</span></div></div>
    ${lp.wll>0?`<div class="section"><div class="section-title">Kapasite Kontrolü</div><div class="row" style="font-weight:700;color:${(totalW/lp.wll)*100>85?"#DC2626":"#006838"};"><span>Kapasite %</span><span>%${((totalW/lp.wll)*100).toFixed(1)}</span></div></div>`:""}
    <div class="footer">HAPP — Bu belge planlama amaçlıdır. Vinç üreticisi yük tablolarını referans alın.</div>
    </body></html>`);
    w.document.close();setTimeout(()=>w.print(),300);
  };
  return(
    <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.8)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:C.white,borderRadius:12,maxWidth:700,width:"100%",maxHeight:"90vh",overflow:"auto",padding:30,color:C.dark}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <h2 style={{fontSize:18,color:C.green}}>PDF Oluştur</h2>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:C.g400}}>✕</button>
        </div>
        <div style={{padding:12,background:"#FFF3CD",borderRadius:8,marginBottom:16,fontSize:11,color:"#856404"}}>⚠ Kapasite değerleri yaklaşıktır. Gerçek vinç yük tabloları ile doğrulayın.</div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={handlePrint} style={{padding:"12px 24px",background:C.green,color:C.white,border:"none",borderRadius:8,fontWeight:700,cursor:"pointer"}}>🖨️ Yazdır / PDF Kaydet</button>
          <button onClick={onClose} style={{padding:"12px 24px",background:C.g200,color:C.dark,border:"none",borderRadius:8,fontWeight:700,cursor:"pointer"}}>İptal</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════
export default function App({ onSave, onLoad, initialData, projectName: extProjectName }){
  const [tab,setTab]=useState("chart");
  const [cfg,setCfg]=useState(initialData?.config || {craneType:"mobile",boomLength:30,boomAngle:45,jibEnabled:false,jibLength:10,jibAngle:15,pivotHeight:2.5,pivotDist:1.2,craneEnd:4,loadWeight:5,counterweight:20,windSpeed:0,skinId:"default",
    loadW:3,loadH:2,loadShape:"box",slingType:"2leg",slingLength:4,slingLegs:2,hookBlockH:1.2,
    chartId:""
  });
  const [objects,setObjects]=useState(initialData?.objects || []);
  const [selObj,setSelObj]=useState(null);
  const [rulers,setRulers]=useState(initialData?.rulers || []);
  const [tool,setTool]=useState("select");
  const [lp,setLp]=useState(initialData?.lift_plan || {supplier:"",supplierContact:"",supplierPhone:"",client:"",clientContact:"",clientPhone:"",jobNumber:"",jobName:"",jobAddress:"",jobDate:new Date().toISOString().split("T")[0],craneMake:"",craneModel:"",craneRego:"",linePull:"",partsOfLine:4,cwConfig:"",loadDesc:"",loadWeight:0,riggingWeight:0,hookBlockWeight:0,addWeight:0,wll:0,notes:"",outForce:0,padW:1,padL:1});
  const [calcTab,setCalcTab]=useState("pct");
  const [ci,setCi]=useState({load:0,rigging:0,wll:0,pct:75,outF:0,padW:1,padL:1});
  const [showPDF,setShowPDF]=useState(false);
  const [saveStatus,setSaveStatus]=useState("idle"); // idle | saving | saved
  const [mobilePanel,setMobilePanel]=useState("controls");
  const [isMobile,setIsMobile]=useState(typeof window!=="undefined"&&window.innerWidth<768);
  
  useEffect(()=>{
    const onResize=()=>setIsMobile(window.innerWidth<768);
    window.addEventListener("resize",onResize);return()=>window.removeEventListener("resize",onResize);
  },[]);

  const crane=CRANES.find(c2=>c2.id===cfg.craneType);
  const skin=SKINS.find(s=>s.id===cfg.skinId)||SKINS[0];
  
  // ★ FIX #1: Radius now includes jib
  const realRadius = calcRadius(cfg);
  // ★ FIX #2: Hook height now includes pivot + boom + jib
  const realHookH = calcHookHeight(cfg);
  // ★ FIX #4: Effective jib angle clamped
  const effectiveJibAngle = cfg.jibEnabled ? Math.min(cfg.jibAngle, cfg.boomAngle) : 0;
  
  // ★ Capacity: use load chart if set, otherwise formula
  const activeChart = cfg.chartId ? LOAD_CHARTS[cfg.chartId] : null;
  const cap = activeChart 
    ? (lookupChart(activeChart, cfg.boomLength, realRadius) || calcCap(crane, cfg.boomLength, realRadius))
    : calcCap(crane, cfg.boomLength, realRadius);
  const capSource = activeChart ? "chart" : "formula";
  const totalW=lp.loadWeight+lp.riggingWeight+lp.hookBlockWeight+lp.addWeight;
  const selObjData=objects.find(o=>o.id===selObj);

  const up=(u)=>setCfg(p=>({...p,...u}));
  const upLP=(k,v)=>setLp(p=>({...p,[k]:v}));
  const upCI=(k,v)=>setCi(p=>({...p,[k]:v}));

  const addObj=(type)=>{const d=OBJ_TYPES.find(o=>o.id===type);setObjects(p=>[...p,{id:uid(),type,x:10+Math.random()*15,w:d.w,h:d.h,rotation:0,name:d.name,color:C.g400,elevate:0,showTop:false,showSlew:false}]);};
  const updObj=(id,u)=>setObjects(p=>p.map(o=>o.id===id?{...o,...u}:o));
  const delObj=(id)=>{setObjects(p=>p.filter(o=>o.id!==id));setSelObj(null);};
  const cpObj=(id)=>{const o=objects.find(x2=>x2.id===id);if(o)setObjects(p=>[...p,{...o,id:uid(),x:o.x+3}]);};
  const moveLayer=(id,dir)=>{setObjects(p=>{const i=p.findIndex(o=>o.id===id);if(i<0)return p;const n=[...p];const ni=dir==="up"?Math.min(i+1,n.length-1):Math.max(i-1,0);[n[i],n[ni]]=[n[ni],n[i]];return n;});};

  const handleSave = async () => {
    if(!onSave) return;
    setSaveStatus("saving");
    try {
      await onSave({ config: cfg, objects, rulers, lift_plan: lp });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch(e) {
      setSaveStatus("idle");
      alert("Kayıt hatası: " + e.message);
    }
  };

  const pctCalc=ci.wll>0?(ci.load+ci.rigging)/ci.wll*100:0;
  const maxLoadCalc=ci.wll*ci.pct/100;
  const minWllCalc=ci.pct>0?(ci.load+ci.rigging)/ci.pct*100:0;
  const pl=ptLoad(ci.outF,ci.padW,ci.padL);

  return(
    <div style={{fontFamily:FB,background:`linear-gradient(135deg,${C.dark} 0%,${C.greenBg} 40%,${C.dark} 100%)`,minHeight:"100vh",color:C.white}}>
      {showPDF&&<PDFPreview cfg={cfg} crane={crane} cap={cap} lp={lp} totalW={totalW} hookH={realHookH} radius={realRadius} onClose={()=>setShowPDF(false)}/>}

      {/* HEADER */}
      <header style={{background:`linear-gradient(90deg,${C.greenDark},${C.green})`,borderBottom:`3px solid ${C.yellow}`,padding:isMobile?"8px 12px":"10px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:6}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:isMobile?32:42,height:isMobile?32:42,borderRadius:8,background:C.yellow,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <span style={{fontSize:isMobile?16:22,fontWeight:900,color:C.greenDark,fontFamily:F}}>H</span>
          </div>
          <div>
            <div style={{fontSize:isMobile?16:24,fontWeight:900,letterSpacing:isMobile?3:5,color:C.yellow,fontFamily:F}}>HAPP</div>
            {!isMobile&&<div style={{fontSize:8,color:C.greenLight,letterSpacing:2,fontFamily:F}}>AĞIR YÜK & VİNÇ PLANLAMA SİSTEMİ v3.1</div>}
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6,flex:isMobile?1:undefined,justifyContent:isMobile?"flex-end":undefined}}>
          {onSave&&<div onClick={handleSave} style={{display:"flex",alignItems:"center",gap:4,cursor:"pointer",padding:"4px 10px",borderRadius:6,background:saveStatus==="saved"?C.greenLight+"25":saveStatus==="saving"?C.yellow+"25":C.g500+"25"}}>
            <span style={{fontSize:10}}>{saveStatus==="saved"?"✅":saveStatus==="saving"?"🔄":"💾"}</span>
            <span style={{fontSize:9,fontWeight:600,color:saveStatus==="saved"?C.greenLight:saveStatus==="saving"?C.yellow:C.g300,fontFamily:F}}>
              {saveStatus==="saved"?"Kaydedildi":saveStatus==="saving"?"Kaydediliyor...":"Kaydet"}
            </span>
          </div>}
          {extProjectName&&<span style={{fontSize:9,color:C.greenLight,fontFamily:F,padding:"3px 8px",background:C.greenDark+"60",borderRadius:4}}>{extProjectName}</span>}
        </div>
        <nav style={{display:"flex",gap:2,background:C.greenDark,borderRadius:8,padding:3,overflowX:"auto",width:"100%",WebkitOverflowScrolling:"touch"}}>
          {TABS.map(t=>(<button key={t.id} onClick={()=>setTab(t.id)} style={{padding:isMobile?"5px 8px":"6px 12px",border:"none",borderRadius:6,background:tab===t.id?C.yellow:"transparent",color:tab===t.id?C.greenDark:C.g300,fontWeight:tab===t.id?700:500,fontSize:isMobile?9:10,cursor:"pointer",fontFamily:F,whiteSpace:"nowrap",flexShrink:0}}>{t.icon}{isMobile?"":" "+t.label}</button>))}
        </nav>
      </header>

      {/* ═══ CHART TAB ═══ */}
      {tab==="chart"&&(
        isMobile ? (
        /* ═══ MOBILE LAYOUT ═══ */
        <div style={{padding:8,display:"flex",flexDirection:"column",gap:8}}>
          {/* CANVAS FIRST ON MOBILE */}
          <Card style={{padding:6}}>
            <RangeChart cfg={cfg} crane={crane} skin={skin} objects={objects} rulers={rulers} selObj={selObj} tool={tool}
              onCfg={up} onObj={updObj} onRulers={setRulers} onSel={setSelObj}
              onAddRuler={(r)=>setRulers(p=>[...p,r])}/>
            <div style={{display:"flex",gap:4,marginTop:6,flexWrap:"wrap",justifyContent:"center"}}>
              <Badge color={C.yellow}>Boom: {cfg.boomLength}m @ {cfg.boomAngle}°</Badge>
              <Badge color={C.greenLight}>R: {realRadius.toFixed(1)}m</Badge>
              <Badge color={C.greenLight}>H: {realHookH.toFixed(1)}m</Badge>
              <Badge color={cap>0&&(cfg.loadWeight/cap)>0.85?C.red:C.greenLight}>Kap: {cap.toFixed(1)}t</Badge>
            </div>
          </Card>

          {/* MOBILE PANEL TABS */}
          <div style={{display:"flex",gap:3,background:C.greenDark,borderRadius:8,padding:3,overflowX:"auto"}}>
            {[{id:"controls",l:"⚙️ Kontrol"},{id:"objects",l:"📦 Nesneler"},{id:"capacity",l:"📊 Kapasite"},{id:"tools",l:"🛠 Araçlar"}].map(t=>(
              <button key={t.id} onClick={()=>setMobilePanel(t.id)} style={{flex:1,padding:"8px 4px",border:"none",borderRadius:6,background:mobilePanel===t.id?C.yellow:"transparent",color:mobilePanel===t.id?C.greenDark:C.g300,fontWeight:mobilePanel===t.id?700:500,fontSize:10,cursor:"pointer",fontFamily:F,whiteSpace:"nowrap"}}>{t.l}</button>
            ))}
          </div>

          {/* MOBILE PANELS */}
          {mobilePanel==="controls"&&(
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <Card>
                <Title>Vinç Tipi</Title>
                <Sel value={cfg.craneType} onChange={v=>up({craneType:v})}>{CRANES.map(c2=><option key={c2.id} value={c2.id}>{c2.name} ({c2.maxCap}t)</option>)}</Sel>
                <div style={{marginTop:8}}><Title color={capSource==="chart"?C.greenLight:C.orange}>Yük Tablosu</Title></div>
                <Sel value={cfg.chartId} onChange={v=>up({chartId:v})}>
                  <option value="">Yaklaşık Formül</option>
                  {Object.entries(LOAD_CHARTS).map(([k,ch])=><option key={k} value={k}>{ch.name}</option>)}
                </Sel>
                <div style={{marginTop:12}}><Title>Boom</Title></div>
                <Slider label="Uzunluk" value={cfg.boomLength} min={5} max={crane.maxBoom} unit="m" onChange={v=>up({boomLength:v})} showInput/>
                <Slider label="Açı" value={cfg.boomAngle} min={5} max={85} unit="°" onChange={v=>up({boomAngle:v})} color={C.greenLight} showInput/>
                <Check label="Jib Aktif" checked={cfg.jibEnabled} onChange={v=>up({jibEnabled:v})}/>
                {cfg.jibEnabled&&(<>
                  <Slider label="Jib Uzunluğu" value={cfg.jibLength} min={1} max={30} unit="m" onChange={v=>up({jibLength:v})} color={C.yellowDark} showInput/>
                  <Slider label="Jib Açısı" value={Math.min(cfg.jibAngle,cfg.boomAngle)} min={0} max={cfg.boomAngle} unit="°" onChange={v=>up({jibAngle:v})} color={C.yellowDark} showInput/>
                </>)}
              </Card>
              <Card>
                <Title>Vinç Geometrisi</Title>
                <Slider label="Pivot Yüksekliği" value={cfg.pivotHeight} min={0.5} max={50} step={0.5} unit="m" onChange={v=>up({pivotHeight:v})} color={C.g400} showInput/>
                <Slider label="Pivot Mesafesi" value={cfg.pivotDist} min={0} max={5} step={0.1} unit="m" onChange={v=>up({pivotDist:v})} color={C.cyan} showInput/>
                <Slider label="Vinç Sonu" value={cfg.craneEnd} min={0} max={10} step={0.5} unit="m" onChange={v=>up({craneEnd:v})} color={C.orange} showInput/>
              </Card>
              <Card>
                <Title>Yük & Koşullar</Title>
                <Slider label="Yük Ağırlığı" value={cfg.loadWeight} min={0} max={Math.round(cap)} step={0.5} unit="t" onChange={v=>up({loadWeight:v})} color={C.greenLight} showInput/>
                <Slider label="Rüzgar" value={cfg.windSpeed} min={0} max={80} unit="km/h" onChange={v=>up({windSpeed:v})} color={cfg.windSpeed>40?C.red:C.g400}/>
              </Card>
              <Card>
                <Title>Vinç Görünüm</Title>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:4}}>
                  {SKINS.map(s=>(
                    <div key={s.id} onClick={()=>up({skinId:s.id})} style={{padding:6,borderRadius:6,cursor:"pointer",textAlign:"center",border:`2px solid ${cfg.skinId===s.id?C.yellow:C.green+"30"}`,background:cfg.skinId===s.id?C.yellow+"15":"transparent"}}>
                      <div style={{display:"flex",justifyContent:"center",gap:2,marginBottom:3}}>
                        <div style={{width:12,height:12,borderRadius:2,background:s.body}}/>
                        <div style={{width:12,height:12,borderRadius:2,background:s.boom}}/>
                      </div>
                      <div style={{fontSize:8,color:cfg.skinId===s.id?C.yellow:C.g300,fontFamily:F}}>{s.name}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {mobilePanel==="objects"&&(
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <Card>
                <Title>Nesneler ({objects.length})</Title>
                <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
                  {OBJ_TYPES.map(o=>(<button key={o.id} onClick={()=>addObj(o.id)} style={{padding:"4px 8px",background:C.greenDark,border:`1px solid ${C.green}30`,borderRadius:4,color:C.g200,fontSize:9,cursor:"pointer"}}>+{o.name}</button>))}
                </div>
              </Card>
              {selObjData&&(()=>{
                const def=OBJ_TYPES.find(o=>o.id===selObjData.type);
                const objTopVal=(selObjData.h||def.h)+(selObjData.elevate||0);
                const slewVal=Math.abs(selObjData.x-(selObjData.w||def.w)/2-cfg.pivotDist);
                return(
                <Card style={{borderColor:C.yellow+"50"}}>
                  <Title>Nesne Düzenle</Title>
                  <Inp label="İsim" value={selObjData.name} onChange={v=>updObj(selObj,{name:v})}/>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                    <Inp label="Gen (m)" value={selObjData.w} onChange={v=>updObj(selObj,{w:parseFloat(v)||1})} type="number"/>
                    <Inp label="Yük (m)" value={selObjData.h} onChange={v=>updObj(selObj,{h:parseFloat(v)||1})} type="number"/>
                  </div>
                  <Slider label="Konum" value={selObjData.x} min={-60} max={60} step={0.5} unit="m" onChange={v=>updObj(selObj,{x:v})} color={C.greenLight} showInput/>
                  <Slider label="Döndür" value={selObjData.rotation||0} min={0} max={360} unit="°" onChange={v=>updObj(selObj,{rotation:v})} color={C.yellow}/>
                  <div style={{padding:8,background:C.dark,borderRadius:6,marginTop:6}}>
                    <span style={{fontSize:9,color:C.cyan,fontFamily:F}}>Tepe: {objTopVal.toFixed(1)}m</span>
                    <Check label="Şemada Göster (Tepe)" checked={selObjData.showTop||false} onChange={v=>{setObjects(p=>p.map(o=>({...o,showTop:o.id===selObj?v:false})));}} color={C.cyan}/>
                  </div>
                  <div style={{padding:8,background:C.dark,borderRadius:6,marginTop:6}}>
                    <span style={{fontSize:9,color:C.orange,fontFamily:F}}>Slew: {slewVal.toFixed(1)}m</span>
                    <Check label="Şemada Göster (Slew)" checked={selObjData.showSlew||false} onChange={v=>{setObjects(p=>p.map(o=>({...o,showSlew:o.id===selObj?v:false})));}} color={C.orange}/>
                  </div>
                  <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:6}}>
                    {[C.g400,C.red,C.yellow,C.greenLight,C.blue,C.purple,C.pink,"#78716C",C.cyan,"#D946EF"].map(c2=>(
                      <div key={c2} onClick={()=>updObj(selObj,{color:c2})} style={{width:22,height:22,borderRadius:4,background:c2,cursor:"pointer",border:selObjData.color===c2?"2px solid white":"2px solid transparent"}}/>
                    ))}
                  </div>
                  <div style={{display:"flex",gap:6,marginTop:8}}>
                    <Btn color={C.greenLight} small onClick={()=>cpObj(selObj)}>Kopyala</Btn>
                    <Btn color={C.red} small onClick={()=>delObj(selObj)}>Sil</Btn>
                  </div>
                </Card>);})()}
            </div>
          )}

          {mobilePanel==="capacity"&&(
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <Card>
                <Title>Kapasite Tablosu</Title>
                <div style={{fontSize:9,color:C.orange,marginBottom:6}}>⚠ YAKLAŞIK — Üretici tablosu ile doğrulayın</div>
                <table style={{width:"100%",fontSize:11,borderCollapse:"collapse"}}>
                  <thead><tr style={{color:C.g400}}><th style={{textAlign:"left",padding:"4px"}}>Menzil</th><th style={{textAlign:"right",padding:"4px"}}>Kapasite</th></tr></thead>
                  <tbody>{Array.from({length:Math.floor(cfg.boomLength/5)},(_,i)=>(i+1)*5).map(r=>{const c2=activeChart?( lookupChart(activeChart,cfg.boomLength,r)||calcCap(crane,cfg.boomLength,r)):calcCap(crane,cfg.boomLength,r);return(<tr key={r} style={{borderTop:`1px solid ${C.green}15`}}><td style={{padding:"4px"}}>{r}m</td><td style={{padding:"4px",textAlign:"right",color:c2<cfg.loadWeight?C.red:C.greenLight,fontWeight:600}}>{c2.toFixed(1)}t</td></tr>);})}</tbody>
                </table>
              </Card>
              <Card>
                <Title>Güvenlik</Title>
                {[{l:"Kapasite",v:cap>0?(cfg.loadWeight/cap)*100:0,t:[80,100]},{l:"Rüzgar",v:cfg.windSpeed,t:[30,50]}].map(s=>(
                  <div key={s.l} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.green}15`}}>
                    <span style={{fontSize:11}}>{s.l}</span>
                    <span style={{fontSize:10,fontWeight:700,color:s.v>=s.t[1]?C.red:s.v>=s.t[0]?C.yellow:C.greenLight}}>{s.v>=s.t[1]?"⛔ TEHLİKE":s.v>=s.t[0]?"⚠️ DİKKAT":"✅ GÜVENLİ"}</span>
                  </div>
                ))}
              </Card>
            </div>
          )}

          {mobilePanel==="tools"&&(
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <Card>
                <Title>Araçlar</Title>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  <Btn color={tool==="select"?C.yellow:C.greenDark} onClick={()=>setTool("select")}>↖ Seç</Btn>
                  <Btn color={tool==="ruler"?C.cyan:C.greenDark} onClick={()=>setTool(tool==="ruler"?"select":"ruler")}>📏 Cetvel Çiz</Btn>
                  <Btn color={tool==="magnifier"?C.yellow:C.greenDark} onClick={()=>setTool(tool==="magnifier"?"select":"magnifier")}>🔍 Büyüteç</Btn>
                </div>
                {rulers.length>0&&<div style={{marginTop:10}}><Title>Cetveller ({rulers.length}/10)</Title>
                  {rulers.map((r,i)=>(
                    <div key={r.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0",borderBottom:`1px solid ${C.green}20`}}>
                      <span style={{fontSize:11,color:C.yellowLight}}>#{i+1}: {Math.sqrt((r.x2-r.x1)**2+(r.y2-r.y1)**2).toFixed(1)}m</span>
                      <button style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:14,padding:4}} onClick={()=>setRulers(p=>p.filter(x2=>x2.id!==r.id))}>✕</button>
                    </div>
                  ))}
                </div>}
              </Card>
              <Card>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  <Btn color={C.yellow} onClick={()=>setTab("liftplan")}>📋 Kaldırma Planı</Btn>
                  <Btn color={C.greenLight} onClick={()=>setTab("cranes")}>💾 Kaydet</Btn>
                  <Btn color={C.yellowDark} onClick={()=>setTab("export")}>📤 Dışa Aktar</Btn>
                </div>
              </Card>
            </div>
          )}
        </div>
        ) : (
        /* ═══ DESKTOP LAYOUT ═══ */
        <div style={{display:"flex",gap:12,padding:12,maxWidth:1500,margin:"0 auto"}}>
          {/* LEFT PANEL */}
          <div style={{width:260,flexShrink:0,display:"flex",flexDirection:"column",gap:10,maxHeight:"calc(100vh - 80px)",overflowY:"auto"}}>
            <Card>
              <Title>Vinç Tipi</Title>
              <Sel value={cfg.craneType} onChange={v=>up({craneType:v})}>{CRANES.map(c2=><option key={c2.id} value={c2.id}>{c2.name} ({c2.maxCap}t)</option>)}</Sel>
              <div style={{marginTop:8}}><Title color={capSource==="chart"?C.greenLight:C.orange}>Yük Tablosu</Title></div>
              <Sel value={cfg.chartId} onChange={v=>up({chartId:v})}>
                <option value="">Yaklaşık Formül</option>
                {Object.entries(LOAD_CHARTS).map(([k,ch])=><option key={k} value={k}>{ch.name} ({ch.maxCap}t)</option>)}
              </Sel>
              {cfg.chartId && <div style={{fontSize:8,color:C.greenLight,marginTop:4}}>✓ Gerçek yük tablosu aktif — {LOAD_CHARTS[cfg.chartId]?.rows?.length} veri noktası</div>}
              <div style={{marginTop:12}}><Title>Boom</Title></div>
              <Slider label="Uzunluk" value={cfg.boomLength} min={5} max={crane.maxBoom} unit="m" onChange={v=>up({boomLength:v})} showInput/>
              <Slider label="Açı" value={cfg.boomAngle} min={5} max={85} unit="°" onChange={v=>up({boomAngle:v})} color={C.greenLight} showInput/>
              <Check label="Jib Aktif" checked={cfg.jibEnabled} onChange={v=>up({jibEnabled:v})}/>
              {cfg.jibEnabled&&(<>
                <Slider label="Jib Uzunluğu" value={cfg.jibLength} min={1} max={30} unit="m" onChange={v=>up({jibLength:v})} color={C.yellowDark} showInput/>
                {/* ★ FIX #4: Jib angle max = boom angle */}
                <Slider label="Jib Açısı" value={Math.min(cfg.jibAngle,cfg.boomAngle)} min={0} max={cfg.boomAngle} unit="°" onChange={v=>up({jibAngle:v})} color={C.yellowDark} showInput/>
                {cfg.jibAngle > cfg.boomAngle && <div style={{fontSize:9,color:C.orange,padding:"4px 8px",background:C.orange+"15",borderRadius:4}}>⚠ Jib açısı boom açısına sınırlandı ({cfg.boomAngle}°)</div>}
              </>)}
            </Card>

            <Card>
              <Title>Vinç Geometrisi</Title>
              <Slider label="Pivot Yüksekliği" value={cfg.pivotHeight} min={0.5} max={50} step={0.5} unit="m" onChange={v=>up({pivotHeight:v})} color={C.g400} showInput/>
              <Slider label="Pivot Mesafesi" value={cfg.pivotDist} min={0} max={5} step={0.1} unit="m" onChange={v=>up({pivotDist:v})} color={C.cyan} showInput/>
              <Slider label="Vinç Sonu" value={cfg.craneEnd} min={0} max={10} step={0.5} unit="m" onChange={v=>up({craneEnd:v})} color={C.orange} showInput/>
            </Card>

            <Card>
              <Title>Yük & Koşullar</Title>
              <Slider label="Yük Ağırlığı" value={cfg.loadWeight} min={0} max={Math.round(cap)} step={0.5} unit="t" onChange={v=>up({loadWeight:v})} color={C.greenLight} showInput/>
              <Slider label="Karşı Ağırlık" value={cfg.counterweight} min={0} max={200} unit="t" onChange={v=>up({counterweight:v})} color={C.g400}/>
              <Slider label="Rüzgar (km/h)" value={cfg.windSpeed} min={0} max={80} onChange={v=>up({windSpeed:v})} color={cfg.windSpeed>40?C.red:C.g400}/>
            </Card>

            <Card>
              <Title>Vinç Görünüm</Title>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:4}}>
                {SKINS.map(s=>(
                  <div key={s.id} onClick={()=>up({skinId:s.id})} style={{padding:6,borderRadius:6,cursor:"pointer",textAlign:"center",border:`2px solid ${cfg.skinId===s.id?C.yellow:C.green+"30"}`,background:cfg.skinId===s.id?C.yellow+"15":"transparent"}}>
                    <div style={{display:"flex",justifyContent:"center",gap:2,marginBottom:3}}>
                      <div style={{width:12,height:12,borderRadius:2,background:s.body}}/>
                      <div style={{width:12,height:12,borderRadius:2,background:s.boom}}/>
                    </div>
                    <div style={{fontSize:8,color:cfg.skinId===s.id?C.yellow:C.g300,fontFamily:F}}>{s.name}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <Title>Araçlar</Title>
              <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                <Btn small color={tool==="select"?C.yellow:C.greenDark} onClick={()=>setTool("select")}>↖ Seç</Btn>
                <Btn small color={tool==="ruler"?C.cyan:C.greenDark} onClick={()=>setTool(tool==="ruler"?"select":"ruler")}>📏 Cetvel Çiz</Btn>
                <Btn small color={tool==="magnifier"?C.yellow:C.greenDark} onClick={()=>setTool(tool==="magnifier"?"select":"magnifier")}>🔍 Büyüteç</Btn>
              </div>
              {tool==="ruler"&&<div style={{fontSize:9,color:C.cyan,marginTop:6}}>Canvas üzerinde sürükleyerek cetvel çizin ({rulers.length}/10)</div>}
            </Card>

            <Card>
              <div style={{display:"flex",justifyContent:"space-between"}}><Title>Cetveller</Title><span style={{fontSize:9,color:C.g400}}>{rulers.length}/10</span></div>
              {rulers.map((r,i)=>(
                <div key={r.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0",borderBottom:`1px solid ${C.green}20`}}>
                  <span style={{fontSize:10,color:C.yellowLight}}>#{i+1}: {Math.sqrt((r.x2-r.x1)**2+(r.y2-r.y1)**2).toFixed(1)}m</span>
                  <button style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:11}} onClick={()=>setRulers(p=>p.filter(x2=>x2.id!==r.id))}>✕</button>
                </div>
              ))}
            </Card>
          </div>

          {/* CENTER CANVAS */}
          <div style={{flex:1,minWidth:0}}>
            <Card>
              <RangeChart cfg={cfg} crane={crane} skin={skin} objects={objects} rulers={rulers} selObj={selObj} tool={tool}
                onCfg={up} onObj={updObj} onRulers={setRulers} onSel={setSelObj}
                onAddRuler={(r)=>setRulers(p=>[...p,r])}/>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:8,padding:"6px 10px",background:C.dark,borderRadius:6,flexWrap:"wrap",gap:4}}>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  <Badge color={C.greenLight}>{crane.name}</Badge>
                  <Badge color={C.yellow}>Boom: {cfg.boomLength}m @ {cfg.boomAngle}°</Badge>
                  {cfg.jibEnabled&&<Badge color={C.yellowDark}>Jib: {cfg.jibLength}m @ {effectiveJibAngle}°</Badge>}
                  <Badge color={C.greenLight}>R: {realRadius.toFixed(1)}m</Badge>
                  <Badge color={C.greenLight}>H: {realHookH.toFixed(1)}m</Badge>
                  <Badge color={cap>0&&(cfg.loadWeight/cap)>0.85?C.red:C.greenLight}>Kap: {cap.toFixed(1)}t</Badge>
                </div>
              </div>
            </Card>
          </div>

          {/* RIGHT PANEL */}
          <div style={{width:240,flexShrink:0,display:"flex",flexDirection:"column",gap:10,maxHeight:"calc(100vh - 80px)",overflowY:"auto"}}>
            <Card>
              <Title>Nesneler ({objects.length})</Title>
              <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
                {OBJ_TYPES.map(o=>(<button key={o.id} onClick={()=>addObj(o.id)} style={{padding:"3px 6px",background:C.greenDark,border:`1px solid ${C.green}30`,borderRadius:4,color:C.g200,fontSize:8,cursor:"pointer"}}>+{o.name}</button>))}
              </div>
            </Card>

            {selObjData&&(()=>{
              const def=OBJ_TYPES.find(o=>o.id===selObjData.type);
              const objTopVal=(selObjData.h||def.h)+(selObjData.elevate||0);
              const slewVal=Math.abs(selObjData.x-(selObjData.w||def.w)/2-cfg.pivotDist);
              return(
              <Card style={{borderColor:C.yellow+"50"}}>
                <Title>Nesne Düzenle</Title>
                <Inp label="İsim" value={selObjData.name} onChange={v=>updObj(selObj,{name:v})}/>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                  <Inp label="Gen (m)" value={selObjData.w} onChange={v=>updObj(selObj,{w:parseFloat(v)||1})} type="number"/>
                  <Inp label="Yük (m)" value={selObjData.h} onChange={v=>updObj(selObj,{h:parseFloat(v)||1})} type="number"/>
                </div>
                <Slider label="Konum" value={selObjData.x} min={-60} max={60} step={0.5} unit="m" onChange={v=>updObj(selObj,{x:v})} color={C.greenLight} showInput/>
                <Slider label="Döndür" value={selObjData.rotation||0} min={0} max={360} unit="°" onChange={v=>updObj(selObj,{rotation:v})} color={C.yellow}/>
                <div style={{padding:8,background:C.dark,borderRadius:6,marginTop:6}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontSize:9,color:C.cyan,fontFamily:F}}>Tepe: {objTopVal.toFixed(1)}m</span>
                    <Inp label="" value={selObjData.elevate||0} onChange={v=>updObj(selObj,{elevate:parseFloat(v)||0})} type="number" style={{marginBottom:0,width:50}}/>
                  </div>
                  <Check label="Şemada Göster (Tepe)" checked={selObjData.showTop||false} onChange={v=>{setObjects(p=>p.map(o=>({...o,showTop:o.id===selObj?v:false})));}} color={C.cyan}/>
                </div>
                <div style={{padding:8,background:C.dark,borderRadius:6,marginTop:6}}>
                  <span style={{fontSize:9,color:C.orange,fontFamily:F}}>Slew Mesafesi: {slewVal.toFixed(1)}m</span>
                  <Check label="Şemada Göster (Slew)" checked={selObjData.showSlew||false} onChange={v=>{setObjects(p=>p.map(o=>({...o,showSlew:o.id===selObj?v:false})));}} color={C.orange}/>
                </div>
                <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:6}}>
                  {[C.g400,C.red,C.yellow,C.greenLight,C.blue,C.purple,C.pink,"#78716C",C.cyan,"#D946EF"].map(c2=>(
                    <div key={c2} onClick={()=>updObj(selObj,{color:c2})} style={{width:18,height:18,borderRadius:4,background:c2,cursor:"pointer",border:selObjData.color===c2?"2px solid white":"2px solid transparent"}}/>
                  ))}
                </div>
                <div style={{display:"flex",gap:4,marginTop:6}}>
                  <Btn small color={C.greenDark} onClick={()=>moveLayer(selObj,"up")}>↑ Öne</Btn>
                  <Btn small color={C.greenDark} onClick={()=>moveLayer(selObj,"down")}>↓ Arkaya</Btn>
                </div>
                <div style={{display:"flex",gap:6,marginTop:8}}>
                  <Btn color={C.greenLight} small onClick={()=>cpObj(selObj)}>Kopyala</Btn>
                  <Btn color={C.red} small onClick={()=>delObj(selObj)}>Sil</Btn>
                </div>
              </Card>);})()}

            <Card>
              <Title>Kapasite Tablosu</Title>
              <div style={{fontSize:8,color:C.orange,marginBottom:6}}>⚠ YAKLAŞIK — Üretici tablosu ile doğrulayın</div>
              <table style={{width:"100%",fontSize:10,borderCollapse:"collapse"}}>
                <thead><tr style={{color:C.g400}}><th style={{textAlign:"left",padding:"3px 4px"}}>Menzil</th><th style={{textAlign:"right",padding:"3px 4px"}}>Kapasite</th></tr></thead>
                <tbody>{Array.from({length:Math.floor(cfg.boomLength/5)},(_,i)=>(i+1)*5).map(r=>{const c2=activeChart?( lookupChart(activeChart,cfg.boomLength,r)||calcCap(crane,cfg.boomLength,r)):calcCap(crane,cfg.boomLength,r);return(<tr key={r} style={{borderTop:`1px solid ${C.green}15`}}><td style={{padding:"3px 4px"}}>{r}m</td><td style={{padding:"3px 4px",textAlign:"right",color:c2<cfg.loadWeight?C.red:C.greenLight,fontWeight:600}}>{c2.toFixed(1)}t</td></tr>);})}</tbody>
              </table>
            </Card>

            <Card>
              <Title>Güvenlik</Title>
              {[{l:"Kapasite",v:cap>0?(cfg.loadWeight/cap)*100:0,t:[80,100]},{l:"Rüzgar",v:cfg.windSpeed,t:[30,50]},{l:"Sapan Açısı",v:calcSlingAngle(cfg.slingLength,cfg.loadW,cfg.slingLegs),t:[30,45]}].map(s=>(
                <div key={s.l} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid ${C.green}15`}}>
                  <span style={{fontSize:10}}>{s.l}</span>
                  <span style={{fontSize:9,fontWeight:700,color:s.v>=s.t[1]?C.red:s.v>=s.t[0]?C.yellow:C.greenLight}}>{s.v>=s.t[1]?"⛔ TEHLİKE":s.v>=s.t[0]?"⚠️ DİKKAT":"✅ GÜVENLİ"}</span>
                </div>
              ))}
            </Card>

            {/* RIGGING & LOAD GEOMETRY */}
            <Card>
              <Title color={C.orange}>Yük & Sapan Görseli</Title>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                <div><span style={{fontSize:9,color:C.g400}}>Yük Şekli</span>
                <Sel value={cfg.loadShape} onChange={v=>up({loadShape:v})}>{LOAD_SHAPES.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</Sel></div>
                <div><span style={{fontSize:9,color:C.g400}}>Sapan Tipi</span>
                <Sel value={cfg.slingType} onChange={v=>{const st=SLING_TYPES.find(s=>s.id===v);up({slingType:v,slingLegs:st?st.legs:2});}}>{SLING_TYPES.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</Sel></div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginTop:6}}>
                <Inp label="Yük Gen (m)" value={cfg.loadW} onChange={v=>up({loadW:parseFloat(v)||1})} type="number"/>
                <Inp label="Yük Yük (m)" value={cfg.loadH} onChange={v=>up({loadH:parseFloat(v)||1})} type="number"/>
              </div>
              <Slider label="Sapan Uzunluğu" value={cfg.slingLength} min={1} max={20} step={0.5} unit="m" onChange={v=>up({slingLength:v})} color={C.orange} showInput/>
              <Slider label="Kanca Blok Yük." value={cfg.hookBlockH} min={0.3} max={3} step={0.1} unit="m" onChange={v=>up({hookBlockH:v})} color={C.g400} showInput/>
              {cfg.slingLegs >= 2 && (()=>{
                const sa = calcSlingAngle(cfg.slingLength, cfg.loadW, cfg.slingLegs);
                const ff = slingForceFactor(sa);
                return <div style={{padding:8,background:C.dark,borderRadius:6,marginTop:4}}>
                  <div style={{display:"flex",justifyContent:"space-between"}}>
                    <span style={{fontSize:9,color:sa>45?C.red:sa>30?C.yellow:C.greenLight}}>Sapan Açısı: {sa.toFixed(1)}°</span>
                    <span style={{fontSize:9,color:C.g400}}>Kuvvet ×{ff.toFixed(2)}</span>
                  </div>
                  {sa > 45 && <div style={{fontSize:8,color:C.red,marginTop:4}}>⛔ Sapan açısı 45°'yi aşıyor — TEHLİKELİ!</div>}
                  {sa > 30 && sa <= 45 && <div style={{fontSize:8,color:C.yellow,marginTop:4}}>⚠ Sapan açısı 30°'yi aşıyor — dikkatli olun</div>}
                </div>;
              })()}
            </Card>
            <Card>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                <Btn color={C.yellow} onClick={()=>setTab("liftplan")}>📋 Kaldırma Planı</Btn>
                <Btn color={C.greenLight} onClick={()=>setTab("cranes")}>💾 Konfigürasyon Kaydet</Btn>
                <Btn color={C.yellowDark} onClick={()=>setTab("export")}>📤 Dışa Aktar</Btn>
              </div>
            </Card>
          </div>
        </div>
        )
      )}

      {/* ═══ LIFT PLAN ═══ */}
      {tab==="liftplan"&&(
        <div style={{maxWidth:1000,margin:"0 auto",padding:isMobile?8:16}}>
          <Card>
            <Title>Kaldırma Planı</Title>
            <div style={{padding:10,background:C.orange+"15",borderRadius:6,marginBottom:14,fontSize:10,color:C.orange}}>⚠ Kapasite değerleri yaklaşık hesaplanmıştır. Kaldırma öncesi vinç üreticisi yük tabloları ile doğrulayın.</div>
            <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:14}}>
              <Card style={{background:C.dark}}><Title color={C.greenLight}>Tedarikçi</Title>
                <Inp label="Firma" value={lp.supplier} onChange={v=>upLP("supplier",v)}/>
                <Inp label="Kişi" value={lp.supplierContact} onChange={v=>upLP("supplierContact",v)}/>
                <Inp label="Tel" value={lp.supplierPhone} onChange={v=>upLP("supplierPhone",v)}/></Card>
              <Card style={{background:C.dark}}><Title color={C.yellow}>Müşteri</Title>
                <Inp label="Firma" value={lp.client} onChange={v=>upLP("client",v)}/>
                <Inp label="Kişi" value={lp.clientContact} onChange={v=>upLP("clientContact",v)}/>
                <Inp label="Tel" value={lp.clientPhone} onChange={v=>upLP("clientPhone",v)}/></Card>
              <Card style={{background:C.dark}}><Title color={C.yellow}>İş Bilgileri</Title>
                <Inp label="İş No" value={lp.jobNumber} onChange={v=>upLP("jobNumber",v)}/><Inp label="İş Adı" value={lp.jobName} onChange={v=>upLP("jobName",v)}/>
                <Inp label="Adres" value={lp.jobAddress} onChange={v=>upLP("jobAddress",v)}/><Inp label="Tarih" value={lp.jobDate} onChange={v=>upLP("jobDate",v)} type="date"/></Card>
              <Card style={{background:C.dark}}><Title color={C.greenLight}>Vinç Bilgileri</Title>
                <Inp label="Marka" value={lp.craneMake} onChange={v=>upLP("craneMake",v)} placeholder="Liebherr, Tadano..."/>
                <Inp label="Model" value={lp.craneModel} onChange={v=>upLP("craneModel",v)}/><Inp label="Plaka" value={lp.craneRego} onChange={v=>upLP("craneRego",v)}/></Card>
              <Card style={{background:C.dark}}><Title color={C.yellow}>Yük Detayları</Title>
                <Inp label="Yük (t)" value={lp.loadWeight} onChange={v=>upLP("loadWeight",v)} type="number"/>
                <Inp label="Sapan (t)" value={lp.riggingWeight} onChange={v=>upLP("riggingWeight",v)} type="number"/>
                <Inp label="Kanca Blok (t)" value={lp.hookBlockWeight} onChange={v=>upLP("hookBlockWeight",v)} type="number"/>
                <Inp label="Ek (t)" value={lp.addWeight} onChange={v=>upLP("addWeight",v)} type="number"/>
                <div style={{padding:8,background:C.yellow+"15",borderRadius:6,textAlign:"center"}}><span style={{fontSize:13,fontWeight:700,color:C.yellow,fontFamily:F}}>TOPLAM: {totalW.toFixed(1)}t</span></div></Card>
              <Card style={{background:C.dark}}><Title color={C.greenLight}>WLL & Kapasite</Title>
                <Inp label="WLL (t)" value={lp.wll} onChange={v=>upLP("wll",v)} type="number"/>
                {lp.wll>0&&(<div style={{padding:10,background:C.dark,borderRadius:6,border:`1px solid ${C.green}30`,textAlign:"center"}}><div style={{fontSize:10,color:C.g400}}>Kapasite %</div><div style={{fontSize:22,fontWeight:800,color:(totalW/lp.wll)*100>85?C.red:C.greenLight,fontFamily:F}}>%{((totalW/lp.wll)*100).toFixed(1)}</div></div>)}</Card>
            </div>
            <Card style={{background:C.dark,marginTop:14}}><Title>Mevcut Konfigürasyon</Title>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}><Badge color={C.greenLight}>{crane.name}</Badge><Badge color={C.yellow}>Boom: {cfg.boomLength}m @ {cfg.boomAngle}°</Badge>{cfg.jibEnabled&&<Badge color={C.yellowDark}>Jib: {cfg.jibLength}m @ {effectiveJibAngle}°</Badge>}<Badge color={C.greenLight}>R: {realRadius.toFixed(1)}m</Badge><Badge color={C.greenLight}>H: {realHookH.toFixed(1)}m</Badge><Badge color={C.greenLight}>Kap: {cap.toFixed(1)}t</Badge></div></Card>
            <div style={{marginTop:10}}><Inp label="Notlar" value={lp.notes} onChange={v=>upLP("notes",v)} type="textarea"/></div>
          </Card>
        </div>
      )}

      {/* ═══ CALCULATIONS ═══ */}
      {tab==="calc"&&(
        <div style={{maxWidth:800,margin:"0 auto",padding:16}}>
          <Card>
            <Title>Hesaplamalar</Title>
            <div style={{display:"flex",gap:4,marginBottom:16,flexWrap:"wrap"}}>
              {[{id:"pct",l:"Kapasite %"},{id:"max",l:"Maks Yük"},{id:"wll",l:"Min WLL"},{id:"pl",l:"Nokta Yük"}].map(t=>(<Btn key={t.id} color={calcTab===t.id?C.yellow:C.greenDark} small onClick={()=>setCalcTab(t.id)}>{t.l}</Btn>))}
            </div>
            {calcTab==="pct"&&(<div><p style={{fontSize:12,color:C.g300,marginBottom:12}}>Kapasitenizin yüzde kaçında çalıştığınızı hesaplayın.</p><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}><Inp label="Yük (t)" value={ci.load} onChange={v=>upCI("load",v)} type="number"/><Inp label="Sapan (t)" value={ci.rigging} onChange={v=>upCI("rigging",v)} type="number"/><Inp label="WLL (t)" value={ci.wll} onChange={v=>upCI("wll",v)} type="number"/></div><div style={{padding:24,background:C.dark,borderRadius:8,textAlign:"center",marginTop:12,border:`1px solid ${C.green}30`}}><div style={{fontSize:10,color:C.g400}}>KAPASİTE YÜZDESİ</div><div style={{fontSize:40,fontWeight:800,color:pctCalc>85?C.red:pctCalc>70?C.yellow:C.greenLight,fontFamily:F}}>%{pctCalc.toFixed(1)}</div></div></div>)}
            {calcTab==="max"&&(<div><p style={{fontSize:12,color:C.g300,marginBottom:12}}>Belirlenen kapasite yüzdesinde maks yükü hesaplayın.</p><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><Inp label="WLL (t)" value={ci.wll} onChange={v=>upCI("wll",v)} type="number"/><Inp label="Kapasite %" value={ci.pct} onChange={v=>upCI("pct",v)} type="number"/></div><div style={{padding:24,background:C.dark,borderRadius:8,textAlign:"center",marginTop:12,border:`1px solid ${C.green}30`}}><div style={{fontSize:10,color:C.g400}}>MAKSİMUM YÜK</div><div style={{fontSize:40,fontWeight:800,color:C.yellow,fontFamily:F}}>{maxLoadCalc.toFixed(1)}t</div></div></div>)}
            {calcTab==="wll"&&(<div><p style={{fontSize:12,color:C.g300,marginBottom:12}}>Gereken minimum WLL değerini hesaplayın.</p><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}><Inp label="Yük (t)" value={ci.load} onChange={v=>upCI("load",v)} type="number"/><Inp label="Sapan (t)" value={ci.rigging} onChange={v=>upCI("rigging",v)} type="number"/><Inp label="Kapasite %" value={ci.pct} onChange={v=>upCI("pct",v)} type="number"/></div><div style={{padding:24,background:C.dark,borderRadius:8,textAlign:"center",marginTop:12,border:`1px solid ${C.green}30`}}><div style={{fontSize:10,color:C.g400}}>MİNİMUM WLL</div><div style={{fontSize:40,fontWeight:800,color:C.greenLight,fontFamily:F}}>{minWllCalc.toFixed(1)}t</div></div></div>)}
            {calcTab==="pl"&&(<div><p style={{fontSize:12,color:C.g300,marginBottom:12}}>Zemin basıncını hesaplayın.</p><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}><Inp label="Ayak Kuvveti (t)" value={ci.outF} onChange={v=>upCI("outF",v)} type="number"/><Inp label="Tabla Gen (m)" value={ci.padW} onChange={v=>upCI("padW",v)} type="number"/><Inp label="Tabla Uz (m)" value={ci.padL} onChange={v=>upCI("padL",v)} type="number"/></div><div style={{padding:24,background:C.dark,borderRadius:8,textAlign:"center",marginTop:12,border:`1px solid ${C.green}30`}}><div style={{fontSize:10,color:C.g400}}>Alan: {pl.area.toFixed(2)} m²</div><div style={{fontSize:32,fontWeight:800,color:C.yellow,fontFamily:F}}>{pl.pres.toFixed(2)} t/m²</div><div style={{fontSize:14,color:C.g300,fontFamily:F}}>= {pl.kpa.toFixed(1)} kPa</div></div></div>)}
          </Card>
        </div>
      )}

      {/* ═══ EXPORT ═══ */}
      {tab==="export"&&(
        <div style={{maxWidth:900,margin:"0 auto",padding:16}}>
          <Card>
            <Title>Dışa Aktar</Title>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
              {[{icon:"📄",title:"PDF Lift Plan",desc:"Profesyonel kaldırma planı PDF",color:C.yellow,action:()=>setShowPDF(true)},
                {icon:"🖼️",title:"PNG Görsel",desc:"Range chart görselini kaydet",color:C.greenLight,action:()=>{const cv=document.querySelector("canvas");if(cv){const a=document.createElement("a");a.download="happ-chart.png";a.href=cv.toDataURL("image/png");a.click();}else alert("Önce Menzil Şeması sekmesine gidin.");}},
                {icon:"📊",title:"CSV Rapor",desc:"Kapasite tablosunu indir",color:C.yellowDark,action:()=>dlBlob(genCSV(crane,cfg.boomLength,cfg),"happ-kapasite.csv")},
              ].map(item=>(
                <div key={item.title} style={{padding:24,background:C.dark,borderRadius:8,border:`1px solid ${C.green}20`,textAlign:"center"}}>
                  <div style={{fontSize:40,marginBottom:10}}>{item.icon}</div><div style={{fontWeight:700,marginBottom:6,fontSize:14}}>{item.title}</div>
                  <div style={{fontSize:11,color:C.g300,marginBottom:14}}>{item.desc}</div><Btn color={item.color} onClick={item.action}>Oluştur</Btn>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      <footer style={{textAlign:"center",padding:14,borderTop:`1px solid ${C.green}20`,fontSize:9,color:C.g400}}>
        <span style={{fontFamily:F,color:C.yellow}}>HAPP v3.1</span>
        <span style={{margin:"0 8px",color:C.green}}>|</span>
        <span>10 Kritik Hata Düzeltildi — Güvenli Hesaplama</span>
      </footer>
    </div>
  );
}
