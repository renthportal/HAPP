"use client";
import{useState,useEffect,useRef,useCallback,useMemo}from"react";
import{createClient}from"@/lib/supabase/client";

// ═══ COLORS ═══
const C={dark:"#0A1F12",darkSurf:"#132E1C",greenBg:"#0D2818",greenDark:"#004D2A",green:"#006838",greenLight:"#00A86B",yellow:"#FFC72C",yellowDark:"#B8860B",orange:"#FF6B35",cyan:"#00BCD4",red:"#DC2626",white:"#F0F4F1",g100:"#D9E5DD",g200:"#B8C9BE",g300:"#94A89A",g400:"#6B7E70",g500:"#475950",g600:"#2A3B30"};
const F="'Fira Code','SF Mono',monospace";
const LOGO_DATA="data:image/jpeg;base64,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HHp0PLYjnu02zOONXSDVzR6j3CslquvCGY+B9irMIiLnasiIiws5lcdg8TZy2Wtx1KVZhfLLIdg0fUnoAOZPIL61pcQ1oxJXwkAYlM5lcdg8TZy2Wtx1KVZhfLLIdg0fUnoAOZPIKlvHDipkeIWW8iDzKmBrPJq1Sdi89PMk26uPYdGg7DuS44cVMjxCy3kQeZUwNZ5NWqTsXnp5km3Vx7Do0HYdyY2XVNm9mxRAVFQMZDwH7fn0VSudzM57OP8AT6/CIiK4qFREREREREREREREREREREREREREREREREREREREREREREREREREREREREVkPZz40+T7to/WFv7rlHj8hK74OwikJ7dg49Oh5bEWYXmurF+z7xxix9VmmNb3S2rCzankZN3FjQP4cncj8J/I9tue7TbMb2NVRtz/AOzR6j3CsdruuGEMx8D7FWSzWToYbE2crk7LKtOrGZJpXnk1o/yfQDmTyCpXxw4qZHiFlvIg8ypgazyatUnYvPTzJNurj2HRoOw7k/fjtxYva/yZo0TLV09WfvBATs6dw/3JPn6Dt/XcqL1IbNbNiiAqagf3DwH7fn0WvdLmZz2UR7vr8IiIrkoRERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERf//Z";
const FB="'Inter','SF Pro',-apple-system,sans-serif";

// ═══ 12 CRANE TYPES (Crangle-style: visual only, no capacity data) ═══
const CRANES=[
  {id:"mobile",name:"Mobil Vinç",defBoom:60,pivotH:2.5,pivotDist:0,craneEnd:4,cat:"mobile"},
  {id:"crawler",name:"Paletli Vinç",defBoom:100,pivotH:3.5,pivotDist:0,craneEnd:5,cat:"crawler"},
  {id:"rough",name:"Arazi Tipi Vinç",defBoom:50,pivotH:2.8,pivotDist:0,craneEnd:3.5,cat:"mobile"},
  {id:"truck",name:"Kamyon Üstü Vinç",defBoom:40,pivotH:3,pivotDist:0,craneEnd:5,cat:"mobile"},
];

// ═══ CRANE VISUAL CONFIGS ═══
// Colors for each crane part (user-customizable)
const DEFAULT_CRANE_COLORS={
  body:"#2D5A3D",boom:"#FFC72C",jib:"#FF6B35",cab:"#1A3D25",
  tracks:"#333333",outriggers:"#444444",counterweight:"#555555",
  hook:"#888888",wheels:"#222222",base:"#1A3D25"
};

// ═══ CRANE SVG ICONS (silhouette style) ═══
// Base SVGs in black — inverted for dark theme at render time
const _BK="#D4D4D4",_WH="#1A2A1F",_D1="#B8B8B8",_D2="#A0A0A0",_WHL="#999";
const CRANE_SVG_MAP={
mobile:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 90"><polygon points="118,30 270,12 272,7 280,7 280,18 272,18 270,20 118,36" fill="${_BK}"/><line x1="135" y1="33" x2="135" y2="17" stroke="${_WH}" stroke-width="0.6" opacity="0.5"/><line x1="155" y1="31" x2="155" y2="16" stroke="${_WH}" stroke-width="0.6" opacity="0.5"/><line x1="175" y1="29" x2="175" y2="15" stroke="${_WH}" stroke-width="0.6" opacity="0.5"/><line x1="195" y1="27" x2="195" y2="14" stroke="${_WH}" stroke-width="0.6" opacity="0.5"/><line x1="215" y1="25" x2="215" y2="13" stroke="${_WH}" stroke-width="0.6" opacity="0.5"/><line x1="235" y1="23" x2="235" y2="12" stroke="${_WH}" stroke-width="0.6" opacity="0.5"/><line x1="255" y1="21" x2="255" y2="11" stroke="${_WH}" stroke-width="0.6" opacity="0.5"/><rect x="275" y="4" width="8" height="16" rx="1" fill="${_BK}"/><polygon points="6,52 8,34 20,30 22,30 22,52" fill="${_BK}"/><path d="M10,52 L14,34 Q16,27 24,27 L68,27 Q74,27 74,33 L74,52Z" fill="${_BK}"/><path d="M18,48 L21,36 Q22,32 26,32 L44,32 L44,48Z" fill="${_WH}"/><line x1="34" y1="32" x2="34" y2="48" stroke="${_BK}" stroke-width="1.2"/><path d="M46,32 L64,32 Q68,32 68,36 L68,48 L46,48Z" fill="${_WH}"/><rect x="6" y="32" width="5" height="7" rx="1.5" fill="${_BK}"/><rect x="14" y="42" width="300" height="12" rx="2" fill="${_BK}"/><rect x="78" y="24" width="58" height="20" rx="3" fill="${_BK}"/><rect x="82" y="28" width="24" height="10" rx="1.5" fill="${_WH}"/><line x1="94" y1="28" x2="94" y2="38" stroke="${_BK}" stroke-width="1"/><rect x="84" y="39" width="10" height="5" rx="0.5" fill="${_D1}" stroke="${_WH}" stroke-width="0.4"/><rect x="108" y="26" width="28" height="16" rx="2" fill="${_BK}"/><line x1="112" y1="29" x2="112" y2="39" stroke="${_WH}" stroke-width="0.4" opacity="0.4"/><line x1="116" y1="29" x2="116" y2="39" stroke="${_WH}" stroke-width="0.4" opacity="0.4"/><line x1="120" y1="29" x2="120" y2="39" stroke="${_WH}" stroke-width="0.4" opacity="0.4"/><line x1="124" y1="29" x2="124" y2="39" stroke="${_WH}" stroke-width="0.4" opacity="0.4"/><line x1="128" y1="29" x2="128" y2="39" stroke="${_WH}" stroke-width="0.4" opacity="0.4"/><line x1="132" y1="29" x2="132" y2="39" stroke="${_WH}" stroke-width="0.4" opacity="0.4"/><rect x="76" y="48" width="14" height="6" rx="1" fill="${_BK}"/><rect x="250" y="48" width="14" height="6" rx="1" fill="${_BK}"/><path d="M36,56 Q52,46 68,56" fill="${_BK}"/><path d="M74,56 Q90,46 106,56" fill="${_BK}"/><path d="M164,56 Q180,46 196,56" fill="${_BK}"/><path d="M210,56 Q226,46 242,56" fill="${_BK}"/><path d="M250,56 Q266,46 282,56" fill="${_BK}"/><circle cx="52" cy="68" r="13" fill="${_BK}"/><circle cx="52" cy="68" r="11" fill="${_D1}" stroke="${_WH}" stroke-width="0.8"/><circle cx="52" cy="68" r="7.5" fill="${_BK}"/><circle cx="52" cy="68" r="4" fill="${_D2}" stroke="${_WH}" stroke-width="0.5"/><circle cx="52" cy="68" r="1.5" fill="${_WH}"/><circle cx="90" cy="68" r="13" fill="${_BK}"/><circle cx="90" cy="68" r="11" fill="${_D1}" stroke="${_WH}" stroke-width="0.8"/><circle cx="90" cy="68" r="7.5" fill="${_BK}"/><circle cx="90" cy="68" r="4" fill="${_D2}" stroke="${_WH}" stroke-width="0.5"/><circle cx="90" cy="68" r="1.5" fill="${_WH}"/><circle cx="180" cy="68" r="13" fill="${_BK}"/><circle cx="180" cy="68" r="11" fill="${_D1}" stroke="${_WH}" stroke-width="0.8"/><circle cx="180" cy="68" r="7.5" fill="${_BK}"/><circle cx="180" cy="68" r="4" fill="${_D2}" stroke="${_WH}" stroke-width="0.5"/><circle cx="180" cy="68" r="1.5" fill="${_WH}"/><circle cx="226" cy="68" r="13" fill="${_BK}"/><circle cx="226" cy="68" r="11" fill="${_D1}" stroke="${_WH}" stroke-width="0.8"/><circle cx="226" cy="68" r="7.5" fill="${_BK}"/><circle cx="226" cy="68" r="4" fill="${_D2}" stroke="${_WH}" stroke-width="0.5"/><circle cx="226" cy="68" r="1.5" fill="${_WH}"/><circle cx="266" cy="68" r="13" fill="${_BK}"/><circle cx="266" cy="68" r="11" fill="${_D1}" stroke="${_WH}" stroke-width="0.8"/><circle cx="266" cy="68" r="7.5" fill="${_BK}"/><circle cx="266" cy="68" r="4" fill="${_D2}" stroke="${_WH}" stroke-width="0.5"/><circle cx="266" cy="68" r="1.5" fill="${_WH}"/></svg>`,
crawler:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100"><line x1="100" y1="24" x2="125" y2="2" stroke="${_BK}" stroke-width="5" stroke-linecap="round"/><line x1="150" y1="24" x2="125" y2="2" stroke="${_BK}" stroke-width="5" stroke-linecap="round"/><circle cx="125" cy="2" r="5.5" fill="${_BK}"/><circle cx="125" cy="2" r="2.5" fill="${_WH}"/><polygon points="85,28 240,10 242,5 250,5 250,16 242,16 240,16 85,34" fill="${_BK}"/><line x1="105" y1="31" x2="105" y2="16" stroke="${_WH}" stroke-width="0.5" opacity="0.4"/><line x1="130" y1="28" x2="130" y2="14" stroke="${_WH}" stroke-width="0.5" opacity="0.4"/><line x1="155" y1="25" x2="155" y2="12" stroke="${_WH}" stroke-width="0.5" opacity="0.4"/><line x1="180" y1="22" x2="180" y2="11" stroke="${_WH}" stroke-width="0.5" opacity="0.4"/><line x1="205" y1="19" x2="205" y2="9" stroke="${_WH}" stroke-width="0.5" opacity="0.4"/><rect x="55" y="22" width="190" height="28" rx="4" fill="${_BK}"/><rect x="60" y="27" width="34" height="12" rx="2" fill="${_WH}"/><line x1="78" y1="27" x2="78" y2="39" stroke="${_BK}" stroke-width="1"/><rect x="62" y="40" width="12" height="6" rx="0.5" fill="${_D1}" stroke="${_WH}" stroke-width="0.4"/><line x1="153" y1="27" x2="153" y2="45" stroke="${_WH}" stroke-width="0.4" opacity="0.3"/><line x1="159" y1="27" x2="159" y2="45" stroke="${_WH}" stroke-width="0.4" opacity="0.3"/><line x1="165" y1="27" x2="165" y2="45" stroke="${_WH}" stroke-width="0.4" opacity="0.3"/><line x1="171" y1="27" x2="171" y2="45" stroke="${_WH}" stroke-width="0.4" opacity="0.3"/><rect x="190" y="26" width="48" height="20" rx="2" fill="${_BK}" stroke="${_WH}" stroke-width="0.4" opacity="0.8"/><line x1="192" y1="32" x2="236" y2="32" stroke="${_WH}" stroke-width="0.4" opacity="0.3"/><line x1="192" y1="38" x2="236" y2="38" stroke="${_WH}" stroke-width="0.4" opacity="0.3"/><rect x="10" y="56" width="280" height="32" rx="15" fill="${_BK}"/><rect x="14" y="60" width="272" height="24" rx="11" fill="${_D1}" stroke="${_WH}" stroke-width="0.5"/><circle cx="26" cy="72" r="12" fill="${_BK}"/><circle cx="26" cy="72" r="7.5" fill="${_D1}" stroke="${_WH}" stroke-width="0.5"/><circle cx="26" cy="72" r="2.5" fill="${_WH}"/><circle cx="274" cy="72" r="10" fill="${_BK}"/><circle cx="274" cy="72" r="6.5" fill="${_D1}" stroke="${_WH}" stroke-width="0.5"/><circle cx="274" cy="72" r="2" fill="${_WH}"/><circle cx="70" cy="81" r="4" fill="${_BK}" stroke="${_WH}" stroke-width="0.4"/><circle cx="70" cy="81" r="1.5" fill="${_WH}"/><circle cx="110" cy="81" r="4" fill="${_BK}" stroke="${_WH}" stroke-width="0.4"/><circle cx="110" cy="81" r="1.5" fill="${_WH}"/><circle cx="150" cy="81" r="4" fill="${_BK}" stroke="${_WH}" stroke-width="0.4"/><circle cx="150" cy="81" r="1.5" fill="${_WH}"/><circle cx="190" cy="81" r="4" fill="${_BK}" stroke="${_WH}" stroke-width="0.4"/><circle cx="190" cy="81" r="1.5" fill="${_WH}"/><circle cx="230" cy="81" r="4" fill="${_BK}" stroke="${_WH}" stroke-width="0.4"/><circle cx="230" cy="81" r="1.5" fill="${_WH}"/></svg>`,
rough:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 230 100"><polygon points="80,32 190,18 192,13 200,13 200,24 192,24 190,24 80,40" fill="${_BK}"/><line x1="100" y1="37" x2="100" y2="24" stroke="${_WH}" stroke-width="0.5" opacity="0.4"/><line x1="120" y1="35" x2="120" y2="22" stroke="${_WH}" stroke-width="0.5" opacity="0.4"/><line x1="140" y1="32" x2="140" y2="20" stroke="${_WH}" stroke-width="0.5" opacity="0.4"/><line x1="160" y1="30" x2="160" y2="18" stroke="${_WH}" stroke-width="0.5" opacity="0.4"/><rect x="22" y="44" width="186" height="12" rx="3" fill="${_BK}"/><path d="M30,26 L76,26 Q82,26 82,32 L82,44 L28,44 L26,44 L22,38 Q20,34 22,30Z" fill="${_BK}"/><rect x="32" y="29" width="44" height="11" rx="1.5" fill="${_WH}"/><line x1="54" y1="29" x2="54" y2="40" stroke="${_BK}" stroke-width="1"/><rect x="86" y="30" width="46" height="16" rx="2" fill="${_BK}"/><line x1="92" y1="33" x2="92" y2="43" stroke="${_WH}" stroke-width="0.4" opacity="0.3"/><line x1="97" y1="33" x2="97" y2="43" stroke="${_WH}" stroke-width="0.4" opacity="0.3"/><line x1="102" y1="33" x2="102" y2="43" stroke="${_WH}" stroke-width="0.4" opacity="0.3"/><line x1="107" y1="33" x2="107" y2="43" stroke="${_WH}" stroke-width="0.4" opacity="0.3"/><rect x="136" y="32" width="28" height="14" rx="2" fill="${_BK}" stroke="${_WH}" stroke-width="0.3"/><rect x="32" y="50" width="10" height="6" rx="1" fill="${_BK}"/><rect x="168" y="50" width="10" height="6" rx="1" fill="${_BK}"/><circle cx="60" cy="74" r="17" fill="${_BK}"/><circle cx="60" cy="74" r="14.5" fill="${_D1}" stroke="${_WH}" stroke-width="0.8"/><circle cx="60" cy="74" r="9" fill="${_BK}"/><circle cx="60" cy="74" r="5" fill="${_D2}" stroke="${_WH}" stroke-width="0.5"/><circle cx="60" cy="74" r="2" fill="${_WH}"/><circle cx="164" cy="74" r="17" fill="${_BK}"/><circle cx="164" cy="74" r="14.5" fill="${_D1}" stroke="${_WH}" stroke-width="0.8"/><circle cx="164" cy="74" r="9" fill="${_BK}"/><circle cx="164" cy="74" r="5" fill="${_D2}" stroke="${_WH}" stroke-width="0.5"/><circle cx="164" cy="74" r="2" fill="${_WH}"/><path d="M40,58 Q60,44 80,58" fill="${_BK}"/><path d="M144,58 Q164,44 184,58" fill="${_BK}"/></svg>`,
truck:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 90"><polygon points="148,32 260,16 262,11 270,11 270,22 262,22 260,22 148,38" fill="${_BK}"/><line x1="165" y1="35" x2="165" y2="21" stroke="${_WH}" stroke-width="0.5" opacity="0.4"/><line x1="185" y1="33" x2="185" y2="19" stroke="${_WH}" stroke-width="0.5" opacity="0.4"/><line x1="205" y1="30" x2="205" y2="18" stroke="${_WH}" stroke-width="0.5" opacity="0.4"/><line x1="225" y1="28" x2="225" y2="16" stroke="${_WH}" stroke-width="0.5" opacity="0.4"/><line x1="245" y1="25" x2="245" y2="14" stroke="${_WH}" stroke-width="0.5" opacity="0.4"/><path d="M8,54 L8,30 Q8,24 14,24 L78,24 Q84,24 84,30 L84,54Z" fill="${_BK}"/><path d="M14,50 L14,32 Q14,28 18,28 L42,28 L42,50Z" fill="${_WH}"/><line x1="30" y1="28" x2="30" y2="50" stroke="${_BK}" stroke-width="1.2"/><path d="M44,28 L70,28 Q76,28 76,32 L76,50 L44,50Z" fill="${_WH}"/><rect x="3" y="30" width="5" height="6" rx="1.5" fill="${_BK}"/><rect x="84" y="36" width="210" height="8" rx="1" fill="${_BK}"/><rect x="14" y="44" width="286" height="12" rx="2" fill="${_BK}"/><rect x="94" y="24" width="52" height="14" rx="3" fill="${_BK}"/><rect x="98" y="27" width="20" height="8" rx="1.5" fill="${_WH}"/><line x1="108" y1="27" x2="108" y2="35" stroke="${_BK}" stroke-width="0.8"/><rect x="90" y="50" width="12" height="6" rx="1" fill="${_BK}"/><rect x="240" y="50" width="12" height="6" rx="1" fill="${_BK}"/><circle cx="48" cy="68" r="12" fill="${_BK}"/><circle cx="48" cy="68" r="10" fill="${_D1}" stroke="${_WH}" stroke-width="0.8"/><circle cx="48" cy="68" r="6.5" fill="${_BK}"/><circle cx="48" cy="68" r="3.5" fill="${_D2}" stroke="${_WH}" stroke-width="0.5"/><circle cx="48" cy="68" r="1.3" fill="${_WH}"/><circle cx="196" cy="68" r="12" fill="${_BK}"/><circle cx="196" cy="68" r="10" fill="${_D1}" stroke="${_WH}" stroke-width="0.8"/><circle cx="196" cy="68" r="6.5" fill="${_BK}"/><circle cx="196" cy="68" r="3.5" fill="${_D2}" stroke="${_WH}" stroke-width="0.5"/><circle cx="196" cy="68" r="1.3" fill="${_WH}"/><circle cx="230" cy="68" r="12" fill="${_BK}"/><circle cx="230" cy="68" r="10" fill="${_D1}" stroke="${_WH}" stroke-width="0.8"/><circle cx="230" cy="68" r="6.5" fill="${_BK}"/><circle cx="230" cy="68" r="3.5" fill="${_D2}" stroke="${_WH}" stroke-width="0.5"/><circle cx="230" cy="68" r="1.3" fill="${_WH}"/><circle cx="264" cy="68" r="12" fill="${_BK}"/><circle cx="264" cy="68" r="10" fill="${_D1}" stroke="${_WH}" stroke-width="0.8"/><circle cx="264" cy="68" r="6.5" fill="${_BK}"/><circle cx="264" cy="68" r="3.5" fill="${_D2}" stroke="${_WH}" stroke-width="0.5"/><circle cx="264" cy="68" r="1.3" fill="${_WH}"/><path d="M34,58 Q48,48 62,58" fill="${_BK}"/><path d="M184,58 Q196,48 208,58" fill="${_BK}"/><path d="M218,58 Q230,48 242,58" fill="${_BK}"/><path d="M252,58 Q264,48 276,58" fill="${_BK}"/></svg>`
};

// Convert SVGs to data URIs and preload as images
const CRANE_IMGS={};
if(typeof window!=="undefined"){Object.entries(CRANE_SVG_MAP).forEach(([id,svg])=>{
  const img=new Image();
  img.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(svg);
  CRANE_IMGS[id]=img;
});}

// Get thumbnail data URI for dropdown
function getCraneSvgUri(id){
  return "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(CRANE_SVG_MAP[id]||"");
}

// ═══ VISUAL DRAWING: SVG body + dynamic boom/jib ═══
function drawCraneVisual(ctx,type,SC,VS,pivotX,pivotY,boomTipX,boomTipY,colors,cfg,jibTipX,jibTipY){
  const cr=CRANES.find(c=>c.id===type);
  if(!cr) return;
  const cat=cr.cat;
  const groundY=pivotY+cfg.pivotHeight*VS;
  const boomW=Math.max(4, 2*SC*0.15);
  
  ctx.save();
  
  // ═══ DRAW SVG BODY IMAGE ═══
  const img=CRANE_IMGS[type];
  if(img&&img.complete&&img.naturalWidth>0){
    const iAR=img.naturalWidth/img.naturalHeight;
    // Scale based on craneEnd (rear length) — wider silhouettes need more space
    const bodyW=Math.max(cfg.craneEnd*SC*2.5, 120);
    let drawW=bodyW;
    let drawH=drawW/iAR;
    // Ensure minimum height relative to pivot
    const minH=Math.max(cfg.pivotHeight*VS*0.7, 30);
    if(drawH<minH){drawH=minH;drawW=drawH*iAR;}
    
    // Position: center body under pivot, bottom at ground
    const imgX=pivotX-drawW*0.35;
    const imgY=groundY-drawH;
    
    ctx.drawImage(img, imgX, imgY, drawW, drawH);
  }
  
  // ═══ BOOM (dynamic) ═══
  const bdx=boomTipX-pivotX; const bdy=boomTipY-pivotY;
  const bLen=Math.sqrt(bdx*bdx+bdy*bdy);
  if(bLen<1){ctx.restore();return;}
  
  const s=Math.max(0.7, Math.min(VS/6, 2.2));
  
  if(cat==="crawler"){
    // Lattice boom
    const nx=-bdy/bLen*boomW; const ny=bdx/bLen*boomW;
    ctx.strokeStyle="#FFC72C";
    ctx.lineWidth=Math.max(1.8, 2.2*s);
    ctx.beginPath();ctx.moveTo(pivotX+nx,pivotY+ny);ctx.lineTo(boomTipX+nx,boomTipY+ny);ctx.stroke();
    ctx.beginPath();ctx.moveTo(pivotX-nx,pivotY-ny);ctx.lineTo(boomTipX-nx,boomTipY-ny);ctx.stroke();
    ctx.lineWidth=Math.max(0.8, 1.2*s);
    const segs=Math.max(8, Math.floor(bLen/14));
    for(let i=0;i<segs;i++){
      const t1=i/segs; const t2=(i+1)/segs;
      const x1=pivotX+bdx*t1, y1=pivotY+bdy*t1;
      const x2=pivotX+bdx*t2, y2=pivotY+bdy*t2;
      ctx.beginPath();ctx.moveTo(x1+nx,y1+ny);ctx.lineTo(x1-nx,y1-ny);ctx.stroke();
      ctx.beginPath();ctx.moveTo(x1+nx,y1+ny);ctx.lineTo(x2-nx,y2-ny);ctx.stroke();
      ctx.beginPath();ctx.moveTo(x1-nx,y1-ny);ctx.lineTo(x2+nx,y2+ny);ctx.stroke();
    }
    ctx.beginPath();ctx.moveTo(boomTipX+nx,boomTipY+ny);ctx.lineTo(boomTipX-nx,boomTipY-ny);ctx.stroke();
  } else {
    // Telescopic boom (3-section)
    ctx.lineCap="round";
    ctx.strokeStyle="#FFC72C";ctx.lineWidth=boomW*3;
    ctx.beginPath();ctx.moveTo(pivotX,pivotY);ctx.lineTo(pivotX+bdx*0.42,pivotY+bdy*0.42);ctx.stroke();
    ctx.lineWidth=boomW*2.2;
    ctx.beginPath();ctx.moveTo(pivotX+bdx*0.18,pivotY+bdy*0.18);ctx.lineTo(pivotX+bdx*0.72,pivotY+bdy*0.72);ctx.stroke();
    ctx.strokeStyle="#B8860B";ctx.lineWidth=boomW*1.5;
    ctx.beginPath();ctx.moveTo(pivotX+bdx*0.4,pivotY+bdy*0.4);ctx.lineTo(boomTipX,boomTipY);ctx.stroke();
    // Section joint lines
    ctx.strokeStyle="rgba(0,0,0,0.15)";ctx.lineWidth=1;
    [0.38,0.6].forEach(t=>{
      const jnx=-bdy/bLen; const jny=bdx/bLen;
      const jx=pivotX+bdx*t; const jy=pivotY+bdy*t;
      ctx.beginPath();ctx.moveTo(jx+jnx*boomW*1.2,jy+jny*boomW*1.2);ctx.lineTo(jx-jnx*boomW*1.2,jy-jny*boomW*1.2);ctx.stroke();
    });
    ctx.lineCap="butt";
  }
  
  // ═══ JIB ═══
  if(cfg.jibEnabled&&jibTipX!==undefined){
    const jDx=jibTipX-boomTipX; const jDy=jibTipY-boomTipY;
    const jLen=Math.sqrt(jDx*jDx+jDy*jDy);
    if(jLen>1){
      const jW=boomW*0.55;
      const jnx=-jDy/jLen*jW; const jny=jDx/jLen*jW;
      ctx.strokeStyle="#FF6B35";ctx.lineWidth=Math.max(1.2, 1.8*s);
      ctx.beginPath();ctx.moveTo(boomTipX+jnx,boomTipY+jny);ctx.lineTo(jibTipX+jnx,jibTipY+jny);ctx.stroke();
      ctx.beginPath();ctx.moveTo(boomTipX-jnx,boomTipY-jny);ctx.lineTo(jibTipX-jnx,jibTipY-jny);ctx.stroke();
      ctx.lineWidth=Math.max(0.6, 0.9*s);
      const jSegs=Math.max(4, Math.floor(jLen/16));
      for(let i=0;i<=jSegs;i++){
        const t=i/jSegs;
        const x=boomTipX+jDx*t; const y=boomTipY+jDy*t;
        ctx.beginPath();ctx.moveTo(x+jnx,y+jny);ctx.lineTo(x-jnx,y-jny);ctx.stroke();
        if(i<jSegs){
          const t2=(i+1)/jSegs;
          const x2=boomTipX+jDx*t2; const y2=boomTipY+jDy*t2;
          ctx.beginPath();ctx.moveTo(x+jnx,y+jny);ctx.lineTo(x2-jnx,y2-jny);ctx.stroke();
          ctx.beginPath();ctx.moveTo(x-jnx,y-jny);ctx.lineTo(x2+jnx,y2+jny);ctx.stroke();
        }
      }
    }
    ctx.fillStyle="#FF6B35";
    ctx.beginPath();ctx.arc(jibTipX,jibTipY,4,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle="rgba(255,255,255,0.5)";ctx.lineWidth=1;
    ctx.beginPath();ctx.arc(jibTipX,jibTipY,4,0,Math.PI*2);ctx.stroke();
  }
  
  // Boom tip (drag handle)
  ctx.fillStyle="#FFC72C";
  ctx.beginPath();ctx.arc(boomTipX,boomTipY,6,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle="white";ctx.lineWidth=2;
  ctx.beginPath();ctx.arc(boomTipX,boomTipY,6,0,Math.PI*2);ctx.stroke();
  ctx.fillStyle="white";
  ctx.beginPath();ctx.arc(boomTipX,boomTipY,2.5,0,Math.PI*2);ctx.fill();
  
  // Pivot point
  ctx.fillStyle=C.red;
  ctx.beginPath();ctx.arc(pivotX,pivotY,5,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle="rgba(255,255,255,0.5)";ctx.lineWidth=1.5;
  ctx.beginPath();ctx.arc(pivotX,pivotY,5,0,Math.PI*2);ctx.stroke();
  
  ctx.restore();
}

// ═══ OBJECT TYPES ═══
const OBJ_TYPES=[
  {id:"building",name:"Bina",w:12,h:20,icon:"🏢",canFlip:false},
  {id:"house",name:"Ev",w:10,h:8,icon:"🏠",canFlip:false},
  {id:"container",name:"Konteyner",w:12,h:2.6,icon:"📦",canFlip:false},
  {id:"truck_obj",name:"Kamyon",w:10,h:3.5,icon:"🚛",canFlip:true},
  {id:"wall",name:"Duvar",w:0.3,h:6,icon:"🧱",canFlip:false},
  {id:"fence",name:"Çit",w:0.1,h:2,icon:"🔲",canFlip:false},
  {id:"powerline",name:"Elektrik Hattı",w:0.3,h:12,icon:"⚡",canFlip:false},
  {id:"car",name:"Araba",w:4.5,h:1.5,icon:"🚗",canFlip:true},
  {id:"tree",name:"Ağaç",w:4,h:8,icon:"🌳",canFlip:false},
  {id:"person",name:"İnsan",w:0.6,h:1.8,icon:"🧑",canFlip:true},
  {id:"beam",name:"Kiriş",w:12,h:0.5,icon:"📏",canFlip:false},
  {id:"pipe",name:"Boru",w:8,h:1,icon:"🔧",canFlip:false},
  {id:"tank",name:"Tank",w:6,h:6,icon:"🛢",canFlip:false},
  {id:"generator",name:"Jeneratör",w:3,h:2,icon:"⚡",canFlip:false},
  {id:"scaffold",name:"İskele",w:4,h:10,icon:"🔧",canFlip:false},
  {id:"excavator",name:"Ekskavatör",w:8,h:3.5,icon:"🏗",canFlip:true},
  {id:"mixer",name:"Beton Mikseri",w:8,h:3.5,icon:"🔄",canFlip:true},
  {id:"loadpack",name:"Yük Paketi",w:3,h:3,icon:"📦",canFlip:false},
];

// ═══ SKINS ═══
const SKINS=[
  {id:"default",name:"Varsayılan",boom:C.yellow,jib:C.orange,wire:"#99999960",hook:"#ccc",ground:"#3D2B1F",sky1:C.dark,sky2:C.greenBg},
  {id:"night",name:"Gece",boom:"#FFD700",jib:"#FF4500",wire:"#77777760",hook:"#aaa",ground:"#1A1A2E",sky1:"#0F0F23",sky2:"#1A1A2E"},
  {id:"day",name:"Gündüz",boom:"#E6A800",jib:"#CC5500",wire:"#66666660",hook:"#999",ground:"#8B7355",sky1:"#87CEEB",sky2:"#E0F0FF"},
  {id:"blueprint",name:"Teknik",boom:"#4FC3F7",jib:"#29B6F6",wire:"#4FC3F720",hook:"#90CAF9",ground:"#0D47A1",sky1:"#0D47A1",sky2:"#1565C0"},
];

const TABS=[
  {id:"chart",label:"Menzil Şeması",icon:"📐"},
  {id:"cranefinder",label:"Vinç Bul",icon:"🔍"},
  {id:"cranes",label:"Vinç Yönetimi",icon:"🏗️"},
  {id:"liftplan",label:"Kaldırma Planı",icon:"📋"},
  {id:"calc",label:"Hesaplamalar",icon:"🧮"},
  {id:"export",label:"Dışa Aktar",icon:"📤"},
];

// ─── HELPERS ───
const toRad=d=>d*Math.PI/180;
const toDeg=r=>r*180/Math.PI;
const clamp=(v,mn,mx)=>Math.min(Math.max(v,mn),mx);
const uid=()=>Math.random().toString(36).slice(2,10);

// ═══ REAL LOAD CHARTS ═══
const LOAD_CHARTS={
  "ltm500":{
    name:"500t Mobil Vinç (LTM 1500)",maxCap:500,maxBoom:84,pivotH:3.2,
    boomLengths:[15,21,28,35,42,50,58,66,74,84],
    rows:[
      {r:3,caps:[500,420,null,null,null,null,null,null,null,null]},
      {r:4,caps:[400,365,310,null,null,null,null,null,null,null]},
      {r:5,caps:[330,300,270,240,null,null,null,null,null,null]},
      {r:6,caps:[280,255,235,210,185,null,null,null,null,null]},
      {r:7,caps:[240,220,205,185,165,150,null,null,null,null]},
      {r:8,caps:[210,195,180,165,148,135,120,null,null,null]},
      {r:9,caps:[185,175,162,148,133,122,108,96,null,null]},
      {r:10,caps:[165,155,145,134,120,110,98,88,78,null]},
      {r:12,caps:[132,125,118,110,100,91,82,74,66,58]},
      {r:14,caps:[108,102,97,92,84,77,70,63,57,50]},
      {r:16,caps:[90,86,82,78,72,66,60,55,49,43]},
      {r:18,caps:[76,73,70,67,62,57,52,48,43,38]},
      {r:20,caps:[65,62,60,57,54,50,46,42,38,33]},
      {r:22,caps:[null,54,52,50,47,44,41,37,34,30]},
      {r:24,caps:[null,47,46,44,42,39,36,33,30,27]},
      {r:26,caps:[null,null,40,39,37,35,32,30,27,24]},
      {r:28,caps:[null,null,36,35,33,31,29,27,24,22]},
      {r:30,caps:[null,null,32,31,30,28,26,24,22,19]},
      {r:34,caps:[null,null,null,25,24,23,21,20,18,16]},
      {r:38,caps:[null,null,null,null,20,19,18,16,15,13]},
      {r:42,caps:[null,null,null,null,16,15,14,13,12,10]},
      {r:46,caps:[null,null,null,null,null,12,11,10,9,8]},
      {r:50,caps:[null,null,null,null,null,10,9,8,7,6]},
      {r:56,caps:[null,null,null,null,null,null,7,6,5,5]},
      {r:62,caps:[null,null,null,null,null,null,null,5,4,4]},
      {r:70,caps:[null,null,null,null,null,null,null,null,3,3]},
    ]
  },
  "ltm250":{
    name:"250t Mobil Vinç (LTM 1250)",maxCap:250,maxBoom:60,pivotH:2.8,
    boomLengths:[12,18,24,30,38,46,54,60],
    rows:[
      {r:3,caps:[250,210,null,null,null,null,null,null]},
      {r:4,caps:[200,180,160,null,null,null,null,null]},
      {r:5,caps:[165,150,138,125,null,null,null,null]},
      {r:6,caps:[138,128,118,108,92,null,null,null]},
      {r:7,caps:[118,110,102,95,82,70,null,null]},
      {r:8,caps:[102,96,90,84,74,64,54,null]},
      {r:10,caps:[78,74,70,66,59,52,45,40]},
      {r:12,caps:[62,59,56,54,48,43,38,34]},
      {r:14,caps:[50,48,46,44,40,36,32,28]},
      {r:16,caps:[42,40,38,37,34,30,27,24]},
      {r:18,caps:[35,34,33,32,29,26,23,21]},
      {r:20,caps:[30,29,28,27,25,22,20,18]},
      {r:24,caps:[null,23,22,21,20,18,16,14]},
      {r:28,caps:[null,null,17,17,16,14,13,11]},
      {r:32,caps:[null,null,null,13,12,11,10,9]},
      {r:38,caps:[null,null,null,null,9,8,7,6]},
      {r:44,caps:[null,null,null,null,null,6,5,5]},
      {r:50,caps:[null,null,null,null,null,null,4,3]},
    ]
  },
  "ltm100":{
    name:"100t Mobil Vinç (LTM 1100)",maxCap:100,maxBoom:52,pivotH:2.5,
    boomLengths:[10,15,20,27,34,42,52],
    rows:[
      {r:3,caps:[100,85,null,null,null,null,null]},
      {r:4,caps:[82,72,62,null,null,null,null]},
      {r:5,caps:[67,60,54,46,null,null,null]},
      {r:6,caps:[56,51,46,40,34,null,null]},
      {r:7,caps:[48,44,40,35,30,25,null]},
      {r:8,caps:[42,38,35,31,27,23,18]},
      {r:10,caps:[32,30,28,25,22,19,15]},
      {r:12,caps:[26,24,23,21,18,16,13]},
      {r:14,caps:[21,20,19,17,15,13,11]},
      {r:16,caps:[18,17,16,15,13,11,9]},
      {r:18,caps:[15,14,14,13,11,10,8]},
      {r:20,caps:[null,12,12,11,10,8,7]},
      {r:24,caps:[null,null,9,9,8,7,5]},
      {r:28,caps:[null,null,null,7,6,5,4]},
      {r:34,caps:[null,null,null,null,5,4,3]},
      {r:42,caps:[null,null,null,null,null,3,2]},
    ]
  },
  "cc300":{
    name:"300t Paletli Vinç (CC 2800)",maxCap:300,maxBoom:96,pivotH:3.5,
    boomLengths:[18,24,30,42,54,66,78,96],
    rows:[
      {r:4,caps:[300,260,null,null,null,null,null,null]},
      {r:5,caps:[250,225,200,null,null,null,null,null]},
      {r:6,caps:[210,192,175,145,null,null,null,null]},
      {r:7,caps:[178,165,152,130,108,null,null,null]},
      {r:8,caps:[155,144,134,116,98,82,null,null]},
      {r:10,caps:[118,112,105,93,80,68,56,null]},
      {r:12,caps:[94,90,85,77,67,58,49,38]},
      {r:14,caps:[76,73,70,64,56,49,42,33]},
      {r:16,caps:[63,61,58,54,48,42,37,29]},
      {r:18,caps:[53,52,50,46,41,37,32,26]},
      {r:20,caps:[45,44,43,40,36,32,28,23]},
      {r:24,caps:[null,34,33,31,28,26,23,19]},
      {r:28,caps:[null,null,26,25,23,21,19,16]},
      {r:32,caps:[null,null,null,20,19,17,15,13]},
      {r:38,caps:[null,null,null,null,14,13,12,10]},
      {r:44,caps:[null,null,null,null,null,10,9,7]},
      {r:52,caps:[null,null,null,null,null,null,7,5]},
      {r:62,caps:[null,null,null,null,null,null,null,4]},
    ]
  },
  "tc120":{
    name:"120t Kule Vinç (Liebherr 1000EC)",maxCap:120,maxBoom:60,pivotH:40,
    boomLengths:[25,30,35,40,45,50,55,60],
    rows:[
      {r:8,caps:[120,110,null,null,null,null,null,null]},
      {r:10,caps:[96,90,82,null,null,null,null,null]},
      {r:12,caps:[80,76,70,64,null,null,null,null]},
      {r:14,caps:[68,65,61,56,50,null,null,null]},
      {r:16,caps:[59,57,54,50,45,40,null,null]},
      {r:18,caps:[52,50,48,44,40,36,32,null]},
      {r:20,caps:[46,45,43,40,36,33,29,26]},
      {r:24,caps:[null,37,35,33,30,28,25,22]},
      {r:28,caps:[null,null,30,28,26,24,21,19]},
      {r:32,caps:[null,null,null,24,22,20,18,16]},
      {r:36,caps:[null,null,null,null,19,17,15,14]},
      {r:40,caps:[null,null,null,null,null,14,13,11]},
      {r:45,caps:[null,null,null,null,null,null,10,9]},
      {r:50,caps:[null,null,null,null,null,null,null,7]},
    ]
  }
};

// Sling & load shape types
const SLING_TYPES=[{id:"2leg",name:"2 Bacak",legs:2},{id:"4leg",name:"4 Bacak",legs:4},{id:"single",name:"Tek Bacak",legs:1},{id:"spreader",name:"Spreader Beam",legs:0}];
const LOAD_SHAPES=[{id:"box",name:"Kutu/Konteyner"},{id:"cylinder",name:"Silindir/Boru"},{id:"beam",name:"Kiriş/I-Profil"},{id:"irregular",name:"Düzensiz Yük"}];

// ═══ CALCULATION FUNCTIONS ═══
function lookupChart(chart,boomLen,radius){
  if(!chart||!chart.rows||chart.rows.length===0)return null;
  const bls=chart.boomLengths;
  let bi0=0,bi1=0;
  if(boomLen<=bls[0]){bi0=0;bi1=0;}
  else if(boomLen>=bls[bls.length-1]){bi0=bls.length-1;bi1=bls.length-1;}
  else{for(let i=0;i<bls.length-1;i++){if(boomLen>=bls[i]&&boomLen<=bls[i+1]){bi0=i;bi1=i+1;break;}}}
  const rows=chart.rows;
  let ri0=0,ri1=0;
  if(radius<=rows[0].r){ri0=0;ri1=0;}
  else if(radius>=rows[rows.length-1].r){ri0=rows.length-1;ri1=rows.length-1;}
  else{for(let i=0;i<rows.length-1;i++){if(radius>=rows[i].r&&radius<=rows[i+1].r){ri0=i;ri1=i+1;break;}}}
  const c00=rows[ri0].caps[bi0],c01=rows[ri0].caps[bi1],c10=rows[ri1].caps[bi0],c11=rows[ri1].caps[bi1];
  const valid=[c00,c01,c10,c11].filter(v=>v!==null);
  if(valid.length===0)return null;
  if(valid.length<4)return Math.min(...valid);
  const bt=bi0===bi1?0:(boomLen-bls[bi0])/(bls[bi1]-bls[bi0]);
  const rt=ri0===ri1?0:(radius-rows[ri0].r)/(rows[ri1].r-rows[ri0].r);
  const top=c00+(c01-c00)*bt;const bot=c10+(c11-c10)*bt;
  return Math.max(0,top+(bot-top)*rt);
}

function calcRadius(cfg){
  const bRad=toRad(cfg.boomAngle);
  let r=cfg.pivotDist+cfg.boomLength*Math.cos(bRad);
  if(cfg.jibEnabled&&cfg.jibLength>0){
    // Jib angle is measured DOWN from boom axis. Effective angle from horizontal:
    const jibFromHoriz=cfg.boomAngle-cfg.jibAngle;
    r+=cfg.jibLength*Math.cos(toRad(Math.max(0,jibFromHoriz)));
  }
  return Math.max(0,r);
}

function calcBoomTipHeight(cfg){
  const bRad=toRad(cfg.boomAngle);
  let h=cfg.pivotHeight+cfg.boomLength*Math.sin(bRad);
  if(cfg.jibEnabled&&cfg.jibLength>0){
    const jibFromHoriz=cfg.boomAngle-cfg.jibAngle;
    h+=cfg.jibLength*Math.sin(toRad(Math.max(0,jibFromHoriz)));
  }
  return h;
}

function calcHookHeight(cfg){
  // Net hook height = boom tip - hook block - sling length
  const tipH=calcBoomTipHeight(cfg);
  return Math.max(0, tipH - (cfg.hookBlockH||1.2) - (cfg.slingLength||4)*0.3);
}

// ═══ CRANE SEARCH ENGINE ═══
function searchCranes(allCharts,searchLoad,searchHeight,searchRadius,pivotH=2.5){
  if(!searchLoad||!searchHeight||!searchRadius)return[];
  const results=[];
  const hNet=Math.max(0,searchHeight-pivotH);
  const minBoom=Math.sqrt(searchRadius*searchRadius+hNet*hNet);

  for(const[chartId,chart] of Object.entries(allCharts)){
    if(!chart.rows||chart.rows.length===0||!chart.boomLengths)continue;
    let bestMatch=null;
    // Try each boom length, shortest first (shortest = highest capacity)
    for(const bl of chart.boomLengths){
      if(bl<minBoom*0.95)continue; // too short
      // At this boom, angle for working radius = R
      const cosA=searchRadius/bl;
      if(cosA>1||cosA<0)continue;
      const angle=toDeg(Math.acos(cosA));
      // Verify height: pivotH + sqrt(L²-R²) >= searchHeight
      const tipH=pivotH+Math.sqrt(Math.max(0,bl*bl-searchRadius*searchRadius));
      if(tipH<searchHeight*0.95)continue;
      // Look up capacity at this boom length and radius
      const cap=lookupChart(chart,bl,searchRadius);
      if(cap===null)continue;
      const util=searchLoad/cap*100;
      if(cap>=searchLoad){
        if(!bestMatch||bl<bestMatch.boomLength){
          bestMatch={chartId,chartName:chart.name,boomLength:bl,angle:Math.round(angle),capacity:Math.round(cap*10)/10,utilization:Math.round(util),maxCap:chart.maxCap,isPreset:chart.isPreset||false,tipHeight:Math.round(tipH*10)/10};
        }
      }
    }
    if(bestMatch)results.push(bestMatch);
    else{
      // No match — find closest
      let bestCap=0,bestBl=0,bestAng=0,bestTipH=0;
      for(const bl of chart.boomLengths){
        if(bl<minBoom*0.95)continue;
        const cosA=searchRadius/bl;if(cosA>1||cosA<0)continue;
        const ang=toDeg(Math.acos(cosA));
        const tipH=pivotH+Math.sqrt(Math.max(0,bl*bl-searchRadius*searchRadius));
        if(tipH<searchHeight*0.95)continue;
        const cap=lookupChart(chart,bl,searchRadius);
        if(cap!==null&&cap>bestCap){bestCap=cap;bestBl=bl;bestAng=Math.round(ang);bestTipH=Math.round(tipH*10)/10;}
      }
      if(bestCap>0){
        results.push({chartId,chartName:chart.name,boomLength:bestBl,angle:bestAng,capacity:Math.round(bestCap*10)/10,utilization:Math.round(searchLoad/bestCap*100),maxCap:chart.maxCap,isPreset:chart.isPreset||false,insufficient:true,tipHeight:bestTipH});
      }
    }
  }
  results.sort((a,b)=>{
    if(a.insufficient&&!b.insufficient)return 1;
    if(!a.insufficient&&b.insufficient)return -1;
    return a.utilization-b.utilization;
  });
  return results;
}

// calcCap REMOVED — Crangle philosophy: no fake capacity formula.
// Capacity comes ONLY from real load charts or manual user input.

function calcSlingAngle(slingLength,loadWidth,legs){
  if(legs<2||slingLength<=0||loadWidth<=0)return 0;
  // 4-leg: slings go to corners, diagonal spread = sqrt(w²+w²)/2 ≈ w*0.707
  const halfSpan=legs>=4?(loadWidth*0.707/2):(loadWidth/2);
  if(slingLength<=halfSpan)return 90;
  return toDeg(Math.asin(halfSpan/slingLength));
}


// ═══ UI COMPONENTS (Field/Sales optimized: bigger fonts, bigger targets) ═══
const Card=({children,style,collapsed,onToggle,title,...p})=>{
  if(title!==undefined)return<div style={{background:C.darkSurf+"E0",borderRadius:10,marginBottom:10,border:`1px solid ${C.green}15`,backdropFilter:"blur(8px)",...style}} {...p}>
    <div onClick={onToggle} style={{padding:"10px 12px",cursor:onToggle?"pointer":"default",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:collapsed?`none`:`1px solid ${C.green}10`}}>
      <span style={{fontSize:11,fontWeight:800,letterSpacing:1.5,color:C.yellow,fontFamily:F,textTransform:"uppercase"}}>{title}</span>
      {onToggle&&<span style={{color:C.g400,fontSize:12}}>{collapsed?"▸":"▾"}</span>}
    </div>
    {!collapsed&&<div style={{padding:12}}>{children}</div>}
  </div>;
  return<div style={{background:C.darkSurf+"E0",borderRadius:10,padding:12,marginBottom:10,border:`1px solid ${C.green}15`,backdropFilter:"blur(8px)",...style}} {...p}>{children}</div>;
};
const Title=({children,color=C.yellow,style,...p})=><div style={{fontSize:11,fontWeight:800,letterSpacing:1.5,color,marginBottom:8,fontFamily:F,textTransform:"uppercase",...style}} {...p}>{children}</div>;
const Lbl=({children})=><span style={{fontSize:11,color:C.g300,fontFamily:F}}>{children}</span>;
const Sli=({value,min,max,step=1,onChange,color=C.yellow})=><input type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(+e.target.value)} style={{width:"100%",accentColor:color,height:8,cursor:"pointer"}}/>;
const Num=({value,onChange,min,max,step=1,style:s})=>{const[local,setLocal]=useState(String(value));const ref=useRef(null);useEffect(()=>{if(ref.current!==document.activeElement)setLocal(String(value));},[value]);return<input ref={ref} type="number" value={local} min={min} max={max} step={step} onChange={e=>{setLocal(e.target.value);const v=parseFloat(e.target.value);if(!isNaN(v))onChange(clamp(v,min??-Infinity,max??Infinity));}} onBlur={()=>{const v=parseFloat(local);if(isNaN(v))setLocal(String(value));else{const clamped=clamp(v,min??-Infinity,max??Infinity);onChange(clamped);setLocal(String(clamped));}}} style={{width:62,background:C.dark,border:`1px solid ${C.green}30`,borderRadius:6,color:C.yellow,textAlign:"center",padding:"5px 6px",fontSize:13,fontWeight:600,fontFamily:F,...s}}/>;};

const Sel=({value,onChange,children,style:s})=><select value={value} onChange={e=>onChange(e.target.value)} style={{width:"100%",background:C.dark,border:`1px solid ${C.green}30`,borderRadius:8,color:C.white,padding:"10px 12px",fontSize:12,fontFamily:F,...s}}>{children}</select>;
const Btn=({children,onClick,color=C.yellow,small,disabled,style:s})=><button onClick={onClick} disabled={disabled} style={{padding:small?"5px 12px":"8px 18px",background:color,border:"none",borderRadius:8,color:C.greenDark,fontWeight:700,fontSize:small?11:13,cursor:disabled?"not-allowed":"pointer",fontFamily:F,opacity:disabled?0.5:1,...s}}>{children}</button>;
const MobNum=({value,onChange,step=0.1,label,style:s,inputMode:im})=>{const[local,setLocal]=useState(String(value));const ref=useRef(null);useEffect(()=>{if(ref.current!==document.activeElement)setLocal(String(value));},[value]);return<input ref={ref} type="number" inputMode={im||"decimal"} value={local} step={step} onChange={e=>{setLocal(e.target.value);const v=parseFloat(e.target.value);if(!isNaN(v))onChange(v);}} onFocus={()=>{setTimeout(()=>window.scrollTo(0,0),50);}} onBlur={()=>{const v=parseFloat(local);if(isNaN(v)){setLocal(String(value));}else{onChange(v);setLocal(String(v));}setTimeout(()=>window.scrollTo(0,0),100);}} style={{width:"100%",textAlign:"center",fontSize:16,fontWeight:700,border:"2px solid #ccc",borderRadius:8,padding:"4px 2px",background:"white",fontFamily:F,...s}}/>;};

const Row=({children,style})=><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8,...style}}>{children}</div>;

// Turkish decimal formatter (34.70 → "34,70")
const fmtTR=(v,d=2)=>v.toFixed(d).replace(".",",");

// ═══ PDF PREVIEW (Crangle-style Kaldırma Planı) ═══
function PDFPreview({cfg,crane,cap,lp,totalW,hookH,radius,onClose,realBoomTipH}){
  const wllPct=lp.wll>0?(totalW/lp.wll*100):0;
  const padArea=(lp.padShape||"square")==="round"?Math.PI*(lp.padW/2)*(lp.padL/2):lp.padW*lp.padL;
  const tpm2=padArea>0?lp.outForce/padArea:0;
  const kpa=tpm2*9.81;
  const hdr={background:"#36b5c0",color:"#fff",padding:"6px 10px",fontWeight:700,fontSize:12,textAlign:"center"};
  const cell={padding:"5px 8px",borderBottom:"1px solid #e0e0e0",fontSize:10};
  const cellR={...cell,textAlign:"right",fontWeight:600};
  // Capture canvas screenshot for Page 2
  const [chartImg,setChartImg]=useState(null);
  useEffect(()=>{const c=document.querySelector("canvas");if(c)setChartImg(c.toDataURL("image/png"));},[]);
  return(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={onClose} onKeyDown={e=>{if(e.key==="Escape")onClose();}} tabIndex={0}>
    <style>{`@media print{body>*{display:none!important}#hangle-pdf-print{display:block!important;position:fixed!important;inset:0!important;z-index:99999!important;background:white!important;overflow:auto!important}}`}</style>
    <div id="hangle-pdf-print" style={{background:"#fff",borderRadius:12,padding:24,maxWidth:700,width:"100%",maxHeight:"90vh",overflow:"auto",color:"#222"}} onClick={e=>e.stopPropagation()}>
      {/* Title */}
      <div style={{textAlign:"center",fontSize:22,fontWeight:700,color:"#36b5c0",marginBottom:16,fontFamily:"sans-serif"}}>Kaldırma Planı</div>

      {/* Tedarikçi + Müşteri side by side */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0,border:"1px solid #ddd",borderRadius:4,marginBottom:12}}>
        <div><div style={hdr}>Vinç Tedarikçisi</div><div style={{padding:10,minHeight:50,fontSize:10,borderRight:"1px solid #ddd"}}>{lp.supplier&&<div>{lp.supplier}</div>}{lp.supplierAddr&&<div>{lp.supplierAddr}</div>}{lp.supplierContact&&<div>{lp.supplierContact}</div>}{lp.supplierPhone&&<div>{lp.supplierPhone}</div>}{lp.supplierEmail&&<div>{lp.supplierEmail}</div>}</div></div>
        <div><div style={hdr}>Müşteri</div><div style={{padding:10,minHeight:50,fontSize:10}}>{lp.client&&<div>{lp.client}</div>}{lp.clientAddr&&<div>{lp.clientAddr}</div>}{lp.clientContact&&<div>{lp.clientContact}</div>}{lp.clientPhone&&<div>{lp.clientPhone}</div>}{lp.clientEmail&&<div>{lp.clientEmail}</div>}</div></div>
      </div>

      {/* İş Detayları */}
      <table style={{width:"100%",borderCollapse:"collapse",border:"1px solid #ddd",marginBottom:12}}>
        <thead><tr><td colSpan={2} style={hdr}>İş Detayları</td></tr></thead>
        <tbody>
          {[["Referans Numarası",lp.jobNumber],["Proje Adı",lp.jobName],["Proje Adresi",lp.jobAddress],["İş Tarihi",lp.jobDate]].map(([k,v])=><tr key={k}><td style={cell}>{k}</td><td style={cellR}>{v||"—"}</td></tr>)}
          <tr style={{borderTop:"2px solid #ddd"}}><td style={cell}>Vinç</td><td style={cellR}>{lp.craneMake||"—"}</td></tr>
          <tr><td style={cell}>Kapasite</td><td style={cellR}>{lp.craneModel||"—"}</td></tr>
          {lp.craneRego&&<tr><td style={cell}>Plaka/Seri No</td><td style={cellR}>{lp.craneRego}</td></tr>}
        </tbody>
      </table>

      {/* Halat ve Denge Ağırlığı */}
      <table style={{width:"100%",borderCollapse:"collapse",border:"1px solid #ddd",marginBottom:12}}>
        <thead><tr><td colSpan={2} style={hdr}>Halat ve Denge Ağırlığı</td></tr></thead>
        <tbody>
          {[["Hat Çekme",lp.linePull||"—"],["Hattın Parçaları",lp.partsOfLine||"—"],["Denge Ağırlığı Konfigürasyonu",lp.cwConfig||"—"]].map(([k,v])=><tr key={k}><td style={cell}>{k}</td><td style={cellR}>{v}</td></tr>)}
        </tbody>
      </table>

      {/* Vinç Konfigürasyonu */}
      <table style={{width:"100%",borderCollapse:"collapse",border:"1px solid #ddd",marginBottom:12}}>
        <thead><tr><td colSpan={2} style={hdr}>Vinç Konfigürasyonu</td></tr></thead>
        <tbody>
          {[["Bom Uzunluğu",fmtTR(cfg.boomLength)+"m"],["Bom Açısı",fmtTR(cfg.boomAngle)+"°"],...(cfg.jibEnabled?[["Pergel Uzunluğu",fmtTR(cfg.jibLength)+"m"],["Pergel Ofseti",fmtTR(cfg.jibAngle)+"°"]]:[]),["Kaldırma Yüksekliği",fmtTR(realBoomTipH||0)+"m"],["Yarıçap",fmtTR(radius,1)+"m"]].map(([k,v])=><tr key={k}><td style={cell}>{k}</td><td style={{...cellR,color:"#222"}}>{v}</td></tr>)}
        </tbody>
      </table>

      {/* Yük Detayları */}
      <table style={{width:"100%",borderCollapse:"collapse",border:"1px solid #ddd",marginBottom:12}}>
        <thead><tr><td colSpan={2} style={hdr}>Yük Detayları</td></tr></thead>
        <tbody>
          {lp.loadDesc&&<tr><td colSpan={2} style={{...cell,color:"#36b5c0",fontStyle:"italic"}}>{lp.loadDesc}</td></tr>}
          {[["Yük Ağırlığı",lp.loadWeight||"00"],["Donanım Ağırlığı",lp.riggingWeight||"00"],["Kanca Ağırlığı",lp.hookBlockWeight||"00"],["Ek Ağırlık",lp.addWeight||"00"]].map(([k,v])=><tr key={k}><td style={cell}>{k}</td><td style={cellR}>{v}</td></tr>)}
          <tr style={{background:"#f8f8f8"}}><td style={{...cell,fontWeight:700}}>Toplam Ağırlık</td><td style={{...cellR,color:"#36b5c0",fontWeight:700}}>{totalW.toFixed(1)}</td></tr>
        </tbody>
      </table>

      {/* Çalışma Yükü Sınırı (WLL) */}
      <table style={{width:"100%",borderCollapse:"collapse",border:"1px solid #ddd",marginBottom:12}}>
        <thead><tr><td colSpan={2} style={hdr}>Çalışma Yükü Sınırı (WLL)</td></tr></thead>
        <tbody>
          <tr><td style={cell}>Vinç Çalışma Yük Sınırı</td><td style={cellR}>{lp.wll||"00"}</td></tr>
          <tr><td style={cell}>Vincin çalıştığı çizelge %'si</td><td style={{...cellR,color:wllPct>100?"#e74c3c":wllPct>90?"#f39c12":"#36b5c0"}}>{wllPct.toFixed(0)}%</td></tr>
          <tr><td colSpan={2} style={{padding:"6px 8px"}}>
            <div style={{position:"relative",height:16,background:"#eee",borderRadius:3,overflow:"hidden",border:"1px solid #ddd"}}>
              <div style={{position:"absolute",left:0,top:0,bottom:0,width:Math.min(wllPct/130*100,100)+"%",background:wllPct>100?"#e74c3c":wllPct>90?"#f39c12":"#27ae60",opacity:0.6,borderRadius:2}}/>
              {[90,100].map(v=><div key={v} style={{position:"absolute",left:(v/130*100)+"%",top:0,bottom:0,width:1,background:"#999"}}/>)}
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:8,color:"#888",marginTop:2}}><span>0</span><span>90</span><span>100</span><span>130</span></div>
          </td></tr>
        </tbody>
      </table>

      {/* Tekil Yük */}
      <table style={{width:"100%",borderCollapse:"collapse",border:"1px solid #ddd",marginBottom:12}}>
        <thead><tr><td colSpan={2} style={hdr}>Tekil Yük</td></tr></thead>
        <tbody>
          {[["Uskundra Gücü",(lp.outForce||0)+"T"],["Uskundra Ped Boyutu",(lp.padW||0)+"m × "+(lp.padL||0)+"m"],["Uskundra Ped Alanı",padArea.toFixed(2)+"m²"],["Tekil Yük",tpm2.toFixed(1)+"Tpm²   "+kpa.toFixed(1)+"Kpa"]].map(([k,v])=><tr key={k}><td style={cell}>{k}</td><td style={{...cellR,color:k==="Tekil Yük"?"#36b5c0":"#222"}}>{v}</td></tr>)}
        </tbody>
      </table>

      {lp.notes&&<div style={{marginTop:8,padding:10,background:"#f5f5f5",borderRadius:6,fontSize:10,border:"1px solid #ddd"}}><strong>Notlar:</strong> {lp.notes}</div>}

      <div style={{textAlign:"right",marginTop:12,fontSize:10,color:"#888"}}>Powered by <span style={{color:"#36b5c0",fontWeight:700}}>HANGLE</span></div>

      {/* ═══ SAYFA 2: Menzil Çizelgesi ═══ */}
      <div style={{pageBreakBefore:"always",marginTop:24,paddingTop:16,borderTop:"2px solid #36b5c0"}}>
        <div style={{textAlign:"center",fontSize:16,fontWeight:700,color:"#36b5c0",marginBottom:12,fontFamily:"sans-serif"}}>Sayfa 2</div>
        {/* Summary table above chart (Crangle style) */}
        <table style={{width:"100%",borderCollapse:"collapse",border:"1px solid #ddd",marginBottom:12}}>
          <tbody>
            <tr>
              <td style={cell}>Bom Uzunluğu</td><td style={cellR}>{fmtTR(cfg.boomLength)+"m"}</td>
              {cfg.jibEnabled?<><td style={cell}>Pergel Uzunluğu</td><td style={cellR}>{fmtTR(cfg.jibLength)+"m"}</td></>:<><td style={cell}>Uç Yüksekliği</td><td style={cellR}>{fmtTR(realBoomTipH||0)+"m"}</td></>}
            </tr>
            <tr>
              <td style={cell}>Bom Açısı</td><td style={cellR}>{fmtTR(cfg.boomAngle)+"°"}</td>
              {cfg.jibEnabled?<><td style={cell}>Pergel Açısı</td><td style={cellR}>{fmtTR(cfg.jibAngle)+"°"}</td></>:<><td style={cell}>Yarıçap</td><td style={cellR}>{fmtTR(radius,1)+"m"}</td></>}
            </tr>
            {cfg.jibEnabled&&<tr>
              <td style={cell}>Yarıçap</td><td style={cellR}>{fmtTR(radius,1)+"m"}</td>
              <td style={cell}>Uç Yüksekliği</td><td style={cellR}>{fmtTR(realBoomTipH||0)+"m"}</td>
            </tr>}
          </tbody>
        </table>
        {/* Chart screenshot */}
        {chartImg?<div style={{border:"1px solid #ddd",borderRadius:4,overflow:"hidden"}}><img src={chartImg} alt="Menzil Çizelgesi" style={{width:"100%",display:"block"}}/></div>
          :<div style={{padding:40,textAlign:"center",color:"#aaa",border:"1px dashed #ddd",borderRadius:4}}>Menzil çizelgesi yüklenemedi</div>}
        <div style={{textAlign:"right",marginTop:8,fontSize:10,color:"#888"}}>Powered by <span style={{color:"#36b5c0",fontWeight:700}}>HANGLE</span></div>
      </div>

      <div style={{textAlign:"center",marginTop:16}}><Btn onClick={()=>{window.print()}} color="#36b5c0" style={{color:"white",padding:"10px 24px"}}>Yazdır / PDF</Btn> <Btn onClick={onClose} color="#ddd" style={{marginLeft:8}}>Kapat</Btn></div>
    </div>
  </div>);
}

// ═══ RANGE CHART CANVAS ═══
function RangeChart({cfg,crane,skin,objects,selObj,setSelObj,rulers,setRulers,tool,setTool,addObj,updObj,delObj,isMobile,craneColors,setDragTarget,onCfgUpdate,finalCap,derating,capSource:extCapSource,chartMismatch:extChartMismatch}){
  const canvasRef=useRef(null);
  const [drag,setDrag]=useState(null);
  const [magnifier,setMagnifier]=useState(null);

  const realRadius=useMemo(()=>calcRadius(cfg),[cfg]);
  const realBoomTipH=useMemo(()=>calcBoomTipHeight(cfg),[cfg]);
  const realHookH=useMemo(()=>calcHookHeight(cfg),[cfg]);
  const effectiveJibAngle=cfg.jibEnabled?Math.max(0,cfg.boomAngle-cfg.jibAngle):0;

  const canvasSizeRef=useRef({w:0,h:0});
  const draw=useCallback(()=>{
    const canvas=canvasRef.current;if(!canvas)return;
    const ctx=canvas.getContext("2d");
    const dpr=window.devicePixelRatio||1;
    const ow=canvas.offsetWidth;const oh=canvas.offsetHeight;
    if(canvasSizeRef.current.w!==ow||canvasSizeRef.current.h!==oh){
      canvas.width=ow*dpr;canvas.height=oh*dpr;
      canvasSizeRef.current={w:ow,h:oh};
    }
    const W=canvas.width;const H=canvas.height;
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const w=ow;const h=oh;

    // Scale calculations
    const maxDim=Math.max(cfg.boomLength*1.5,40);
    const SC=Math.min(w*0.6,h*0.5)/maxDim;
    const groundY=h*0.78;
    const pivotX=w*0.32;
    const pivotY=groundY-cfg.pivotHeight*SC;
    const VS=SC;// vertical scale = horizontal scale for proportional

    // Background
    const skyGrad=ctx.createLinearGradient(0,0,0,groundY);
    skyGrad.addColorStop(0,skin.sky1);skyGrad.addColorStop(1,skin.sky2);
    ctx.fillStyle=skyGrad;ctx.fillRect(0,0,w,groundY);
    ctx.fillStyle=skin.ground;ctx.fillRect(0,groundY,w,h-groundY);

    // Grid
    ctx.strokeStyle=C.green+"15";ctx.lineWidth=0.5;
    const gridStep=5;const gridPx=gridStep*SC;
    for(let x=pivotX%gridPx;x<w;x+=gridPx){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
    for(let y=groundY%gridPx;y<h;y+=gridPx){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
    for(let y=groundY;y>0;y-=gridPx){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}

    // Distance markers on ground
    ctx.font=`9px ${F}`;ctx.fillStyle=C.g500;ctx.textAlign="center";
    for(let d=-10;d<=80;d+=5){
      const x=pivotX+d*SC;
      if(x>0&&x<w){
        ctx.fillText(d+"m",x,groundY+14);
        ctx.strokeStyle=C.g600+"40";ctx.lineWidth=0.5;
        ctx.beginPath();ctx.moveTo(x,groundY);ctx.lineTo(x,groundY+4);ctx.stroke();
      }
    }
    // Height markers
    ctx.textAlign="right";
    for(let d=0;d<=60;d+=5){
      const y=groundY-d*VS;
      if(y>10&&y<groundY){
        ctx.fillText(d+"m",pivotX-8,y+3);
      }
    }

    // Boom geometry
    const boomRad=toRad(cfg.boomAngle);
    const boomTipX=pivotX+cfg.boomLength*Math.cos(boomRad)*SC;
    const boomTipY=pivotY-cfg.boomLength*Math.sin(boomRad)*VS;

    // Jib geometry
    let jibTipX=boomTipX,jibTipY=boomTipY;
    if(cfg.jibEnabled){
      const jRad=toRad(effectiveJibAngle);
      jibTipX=boomTipX+cfg.jibLength*Math.cos(jRad)*SC;
      jibTipY=boomTipY-cfg.jibLength*Math.sin(jRad)*VS;
    }
    const hookX=cfg.jibEnabled?jibTipX:boomTipX;
    const hookY=cfg.jibEnabled?jibTipY:boomTipY;

    // Range arc (boom sweep)
    ctx.strokeStyle=skin.boom+"30";ctx.lineWidth=1;ctx.setLineDash([4,4]);
    ctx.beginPath();ctx.arc(pivotX,pivotY,cfg.boomLength*SC,toRad(-90),toRad(0));ctx.stroke();
    ctx.setLineDash([]);

    // Objects (behind crane)
    objects.forEach(obj=>{
      const ox=pivotX+obj.x*SC;
      const oy=groundY-(obj.elevate||0)*VS;
      const ow=obj.w*SC;
      const oh=obj.h*VS;
      
      ctx.save();
      // Rotation
      if(obj.rotation){
        ctx.translate(ox+ow/2,oy-oh/2);
        ctx.rotate(toRad(obj.rotation));
        ctx.translate(-(ox+ow/2),-(oy-oh/2));
      }
      
      // Object body
      ctx.fillStyle=obj.color||C.g400;
      ctx.globalAlpha=0.7;
      if(obj.type==="tank"){
        ctx.beginPath();ctx.ellipse(ox+ow/2,oy-oh/2,ow/2,oh/2,0,0,Math.PI*2);ctx.fill();
      } else if(obj.type==="tree"){
        // Trunk
        ctx.fillStyle="#5D4037";
        ctx.fillRect(ox+ow*0.35,oy-oh*0.4,ow*0.3,oh*0.4);
        // Canopy
        ctx.fillStyle=obj.color||"#2E7D32";
        ctx.beginPath();ctx.arc(ox+ow/2,oy-oh*0.65,ow*0.5,0,Math.PI*2);ctx.fill();
      } else if(obj.type==="person"){
        // Simple figure
        ctx.fillStyle=obj.color||"#FFB74D";
        ctx.beginPath();ctx.arc(ox+ow/2,oy-oh*0.85,ow*0.4,0,Math.PI*2);ctx.fill();
        ctx.fillStyle=obj.color||C.g400;
        ctx.fillRect(ox+ow*0.2,oy-oh*0.75,ow*0.6,oh*0.75);
      } else {
        ctx.fillRect(ox,oy-oh,ow,oh);
        // Window pattern for buildings
        if(obj.type==="building"||obj.type==="house"){
          ctx.fillStyle="rgba(255,255,200,0.3)";
          const winW=ow*0.15;const winH=oh*0.06;
          for(let row=0;row<Math.min(8,Math.floor(oh/15));row++){
            for(let col=0;col<3;col++){
              ctx.fillRect(ox+ow*0.15+col*(ow*0.25),oy-oh+oh*0.1+row*(oh*0.12),winW,winH);
            }
          }
        }
      }
      ctx.globalAlpha=1;
      
      // Selection UI
      if(selObj===obj.id){
        ctx.strokeStyle=C.yellow;ctx.lineWidth=2;ctx.setLineDash([3,3]);
        ctx.strokeRect(ox-2,oy-oh-2,ow+4,oh+4);
        ctx.setLineDash([]);
        
        // Rotation handle
        const rhX=ox+ow/2;const rhY=oy-oh-15;
        ctx.strokeStyle=C.cyan;ctx.lineWidth=1;
        ctx.beginPath();ctx.moveTo(rhX,oy-oh);ctx.lineTo(rhX,rhY);ctx.stroke();
        ctx.fillStyle=C.cyan;
        ctx.beginPath();ctx.arc(rhX,rhY,5,0,Math.PI*2);ctx.fill();
        
        // Resize handles
        ctx.fillStyle=C.yellow;
        [[ox,oy-oh],[ox+ow,oy-oh],[ox,oy],[ox+ow,oy]].forEach(([hx,hy])=>{
          ctx.fillRect(hx-3,hy-3,6,6);
        });
        
        // Show in chart indicators
        if(obj.showTop){
          ctx.strokeStyle=C.cyan;ctx.lineWidth=1;ctx.setLineDash([2,2]);
          ctx.beginPath();ctx.moveTo(0,oy-oh);ctx.lineTo(w,oy-oh);ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillStyle=C.cyan;ctx.font=`8px ${F}`;ctx.textAlign="left";
          ctx.fillText(`Üst: ${(obj.h+(obj.elevate||0)).toFixed(1)}m`,ox+ow+5,oy-oh+3);
        }
        if(obj.showSlew){
          ctx.strokeStyle=C.orange;ctx.lineWidth=1;ctx.setLineDash([2,2]);
          ctx.beginPath();ctx.moveTo(ox,0);ctx.lineTo(ox,h);ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillStyle=C.orange;ctx.font=`8px ${F}`;ctx.textAlign="center";
          ctx.fillText(`${obj.x.toFixed(1)}m`,ox,groundY+26);
        }
      }
      
      // Object label
      ctx.fillStyle=C.g200;ctx.font=`8px ${FB}`;ctx.textAlign="center";ctx.globalAlpha=0.8;
      ctx.fillText(obj.name||obj.type,ox+ow/2,oy+12);
      ctx.globalAlpha=1;
      
      ctx.restore();
    });

    // Draw crane visual
    drawCraneVisual(ctx,cfg.craneType,SC,VS,pivotX,pivotY,boomTipX,boomTipY,craneColors,cfg,
      cfg.jibEnabled?jibTipX:undefined,cfg.jibEnabled?jibTipY:undefined);

    // Wire rope
    ctx.strokeStyle=skin.wire;ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(hookX,hookY);ctx.lineTo(hookX,hookY+20);ctx.stroke();

    // Hook + rigging visualization
    const hookBlockH=cfg.hookBlockH*VS;
    const loadW=cfg.loadW*SC;
    const loadH=cfg.loadH*VS;
    const hbY=hookY+5;
    
    // Hook block
    ctx.fillStyle=skin.hook;
    ctx.fillRect(hookX-8,hbY,16,Math.min(hookBlockH,20));
    
    // Slings
    const slingAngle=calcSlingAngle(cfg.slingLength,cfg.loadW,cfg.slingLegs);
    const slingBottomY=hbY+hookBlockH;
    const loadTopY=slingBottomY+cfg.slingLength*VS*0.3;
    
    if(cfg.slingLegs>=2){
      ctx.strokeStyle=C.orange;ctx.lineWidth=1.5;
      const slingSpread=loadW*0.4;
      // Left sling
      ctx.beginPath();ctx.moveTo(hookX,slingBottomY);ctx.lineTo(hookX-slingSpread,loadTopY);ctx.stroke();
      // Right sling
      ctx.beginPath();ctx.moveTo(hookX,slingBottomY);ctx.lineTo(hookX+slingSpread,loadTopY);ctx.stroke();
      if(cfg.slingLegs===4){
        ctx.beginPath();ctx.moveTo(hookX,slingBottomY);ctx.lineTo(hookX-slingSpread*0.5,loadTopY);ctx.stroke();
        ctx.beginPath();ctx.moveTo(hookX,slingBottomY);ctx.lineTo(hookX+slingSpread*0.5,loadTopY);ctx.stroke();
      }
      // Angle warning
      if(slingAngle>30){
        ctx.fillStyle=slingAngle>45?C.red:C.yellow;
        ctx.font=`bold 9px ${F}`;ctx.textAlign="center";
        ctx.fillText(`${slingAngle.toFixed(0)}°`,hookX,slingBottomY-3);
        if(slingAngle>45){
          ctx.fillText("⚠ AÇI > 45°!",hookX,slingBottomY-13);
        }
      }
    } else if(cfg.slingType==="spreader"){
      // Spreader beam
      ctx.strokeStyle=C.cyan;ctx.lineWidth=3;
      ctx.beginPath();ctx.moveTo(hookX-loadW*0.4,loadTopY-5);ctx.lineTo(hookX+loadW*0.4,loadTopY-5);ctx.stroke();
      ctx.strokeStyle=C.orange;ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(hookX,slingBottomY);ctx.lineTo(hookX,loadTopY-5);ctx.stroke();
      ctx.beginPath();ctx.moveTo(hookX-loadW*0.4,loadTopY-5);ctx.lineTo(hookX-loadW*0.4,loadTopY);ctx.stroke();
      ctx.beginPath();ctx.moveTo(hookX+loadW*0.4,loadTopY-5);ctx.lineTo(hookX+loadW*0.4,loadTopY);ctx.stroke();
    }
    
    // Load shape
    const lx=hookX-loadW/2;const ly=loadTopY;
    ctx.fillStyle=C.orange+"40";ctx.strokeStyle=C.orange;ctx.lineWidth=1;
    if(cfg.loadShape==="cylinder"){
      ctx.beginPath();ctx.ellipse(hookX,ly+loadH/2,loadW/2,loadH/2,0,0,Math.PI*2);ctx.fill();ctx.stroke();
    } else if(cfg.loadShape==="beam"){
      ctx.fillRect(lx-loadW*0.1,ly+loadH*0.3,loadW*1.2,loadH*0.4);
      ctx.strokeRect(lx-loadW*0.1,ly+loadH*0.3,loadW*1.2,loadH*0.4);
      // I-beam flanges
      ctx.fillRect(lx,ly,loadW,loadH*0.15);
      ctx.fillRect(lx,ly+loadH*0.85,loadW,loadH*0.15);
    } else {
      ctx.fillRect(lx,ly,loadW,loadH);ctx.strokeRect(lx,ly,loadW,loadH);
    }
    // Load weight label
    ctx.fillStyle=C.white;ctx.font=`bold 9px ${F}`;ctx.textAlign="center";
    ctx.fillText(`${cfg.loadWeight}t`,hookX,ly+loadH/2+3);
    if(cfg.loadW>0){ctx.fillStyle=C.g300;ctx.font=`7px ${F}`;ctx.fillText(`${cfg.loadW}×${cfg.loadH}m`,hookX,ly+loadH+10);}

    // Rulers
    rulers.forEach((ruler,ri)=>{
      const x1=pivotX+ruler.x1*SC;const y1=groundY-ruler.y1*VS;
      const x2=pivotX+ruler.x2*SC;const y2=groundY-ruler.y2*VS;
      const dx=ruler.x2-ruler.x1;const dy=ruler.y2-ruler.y1;
      const dist=Math.sqrt(dx*dx+dy*dy);
      ctx.strokeStyle=C.cyan;ctx.lineWidth=1.5;
      ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
      // Draggable endpoints (larger with white border)
      [x1,y1,x2,y2].forEach((_,idx)=>{
        if(idx%2!==0)return;
        const ex=idx===0?x1:x2;const ey=idx===0?y1:y2;
        ctx.fillStyle=C.cyan;
        ctx.beginPath();ctx.arc(ex,ey,6,0,Math.PI*2);ctx.fill();
        ctx.strokeStyle="#fff";ctx.lineWidth=1.5;
        ctx.beginPath();ctx.arc(ex,ey,6,0,Math.PI*2);ctx.stroke();
      });
      // Distance label
      const mx=(x1+x2)/2;const my=(y1+y2)/2;
      ctx.fillStyle=C.dark;ctx.fillRect(mx-20,my-8,40,16);
      ctx.fillStyle=C.cyan;ctx.font=`bold 9px ${F}`;ctx.textAlign="center";
      ctx.fillText(`${dist.toFixed(1)}m`,mx,my+3);
    });

    // Magnifier (when ruler tool active)
    if(magnifier&&tool==="ruler"){
      const mag=magnifier;
      const magR=40;const magZoom=3;
      ctx.save();
      ctx.beginPath();ctx.arc(mag.x+50,mag.y-50,magR,0,Math.PI*2);ctx.clip();
      ctx.drawImage(canvas,
        (mag.x-magR/magZoom)*(window.devicePixelRatio||1),(mag.y-magR/magZoom)*(window.devicePixelRatio||1),
        (magR*2/magZoom)*(window.devicePixelRatio||1),(magR*2/magZoom)*(window.devicePixelRatio||1),
        mag.x+50-magR,mag.y-50-magR,magR*2,magR*2
      );
      ctx.restore();
      ctx.strokeStyle=C.cyan;ctx.lineWidth=2;
      ctx.beginPath();ctx.arc(mag.x+50,mag.y-50,magR,0,Math.PI*2);ctx.stroke();
      // Crosshair
      ctx.strokeStyle=C.red;ctx.lineWidth=0.5;
      ctx.beginPath();ctx.moveTo(mag.x+50-5,mag.y-50);ctx.lineTo(mag.x+55,mag.y-50);ctx.stroke();
      ctx.beginPath();ctx.moveTo(mag.x+50,mag.y-55);ctx.lineTo(mag.x+50,mag.y-45);ctx.stroke();
    }

    // Radius line
    ctx.strokeStyle=C.greenLight+"50";ctx.lineWidth=1;ctx.setLineDash([3,3]);
    ctx.beginPath();ctx.moveTo(pivotX,groundY);ctx.lineTo(pivotX+realRadius*SC,groundY);ctx.stroke();
    ctx.setLineDash([]);
    // Radius label
    ctx.fillStyle=C.greenLight;ctx.font=`bold 9px ${F}`;ctx.textAlign="center";
    ctx.fillText(`R: ${realRadius.toFixed(1)}m`,pivotX+realRadius*SC/2,groundY+10);

    // ═══ BOOM TIP CROSSHAIR GUIDE LINES (Crangle style) ═══
    // Vertical line: full height at tip X. Horizontal line: full width at tip Y.
    {
      const tipX=cfg.jibEnabled?jibTipX:boomTipX;
      const tipY=cfg.jibEnabled?jibTipY:boomTipY;
      const tipHeightM=(groundY-tipY)/VS;
      const tipReachM=(tipX-pivotX)/SC;

      if(tipHeightM>0.5){
        ctx.save();
        ctx.strokeStyle="rgba(220,40,40,0.45)";
        ctx.lineWidth=1;

        // Full vertical line (edge-to-edge)
        ctx.beginPath();
        ctx.moveTo(tipX,10);
        ctx.lineTo(tipX,groundY);
        ctx.stroke();

        // Full horizontal line (edge-to-edge)
        ctx.beginPath();
        ctx.moveTo(pivotX,tipY);
        ctx.lineTo(w,tipY);
        ctx.stroke();

        // Boundary rectangle (Crangle red box)
        ctx.strokeStyle="rgba(220,40,40,0.35)";
        ctx.lineWidth=1.5;
        ctx.strokeRect(pivotX,tipY,tipX-pivotX,groundY-tipY);

        // Red dot at boom tip
        ctx.fillStyle="rgba(220,40,40,0.9)";
        ctx.beginPath();ctx.arc(tipX,tipY,5,0,Math.PI*2);ctx.fill();

        // Labels
        ctx.font=`bold 9px ${F}`;
        // Height label on Y axis (offset left to clear grid labels)
        ctx.fillStyle="rgba(180,30,30,0.85)";
        ctx.textAlign="right";
        const hLabel=tipHeightM.toFixed(1)+"m";
        const hlW=ctx.measureText(hLabel).width+6;
        ctx.fillRect(pivotX-hlW-14,tipY-7,hlW+4,14);
        ctx.fillStyle="#fff";
        ctx.fillText(hLabel,pivotX-14,tipY+3);

        // Reach label on X axis (offset below to clear distance markers)
        ctx.fillStyle="rgba(180,30,30,0.85)";
        ctx.textAlign="center";
        const rLabel=tipReachM.toFixed(1)+"m";
        const rlW=ctx.measureText(rLabel).width+6;
        ctx.fillRect(tipX-rlW/2,groundY+22,rlW,14);
        ctx.fillStyle="#fff";
        ctx.fillText(rLabel,tipX,groundY+33);

        ctx.restore();
      }
    }

    // Info box (desktop only — mobile uses full canvas)
    if(isMobile){
      // No info box on mobile — maximize canvas space
    } else {
    const boxH=68;
    ctx.fillStyle=C.dark+"D0";ctx.fillRect(10,10,260,boxH);
    ctx.strokeStyle=C.green+"40";ctx.lineWidth=1;ctx.strokeRect(10,10,260,boxH);
    ctx.fillStyle=C.yellow;ctx.font=`bold 11px ${F}`;ctx.textAlign="left";
    ctx.fillText("Hangle",18,28);
    ctx.fillStyle=C.g200;ctx.font=`9px ${F}`;
    ctx.fillText(`${crane?.name||""}`,70,28);
    ctx.fillText(`Boom: ${cfg.boomLength}m @ ${cfg.boomAngle}°`,18,44);
    ctx.fillText(`Menzil: ${realRadius.toFixed(1)}m  Uç: ${realBoomTipH.toFixed(1)}m  Kanca: ${realHookH.toFixed(1)}m`,18,58);
    if(cfg.jibEnabled){ctx.fillStyle=C.orange;ctx.fillText(`Jib: ${cfg.jibLength}m @ ${cfg.jibAngle}°`,18,72);}
    } // end info box

    // Status bar (desktop only — mobile has bottom bar)
    if(!isMobile){
    const barY=h-22;
    ctx.fillStyle=C.dark+"E0";ctx.fillRect(0,barY,w,22);
    ctx.fillStyle=C.g300;ctx.font=`9px ${F}`;ctx.textAlign="left";
    const items=[`${crane?.name}`,`Boom: ${cfg.boomLength}m @ ${cfg.boomAngle}°`,`R: ${realRadius.toFixed(1)}m`,`Uç: ${realBoomTipH.toFixed(1)}m`,`Kanca: ${realHookH.toFixed(1)}m`];
    items.forEach((item,i)=>{
      const badge=i===1;
      ctx.fillStyle=badge?C.yellow:C.g300;
      ctx.fillText(item,10+i*140,barY+14);
    });
    ctx.textAlign="right";ctx.fillStyle=C.g500;
    ctx.fillText("Gövde=Açı | Uç=Uzunluk | Nesne=Taşı/Boyut/Döndür",w-10,barY+14);
    }

  },[cfg,crane,skin,objects,selObj,rulers,tool,magnifier,craneColors,realRadius,realHookH,realBoomTipH,effectiveJibAngle,finalCap,derating,extCapSource,extChartMismatch,isMobile]);

  const rafRef=useRef(null);
  useEffect(()=>{if(rafRef.current)cancelAnimationFrame(rafRef.current);rafRef.current=requestAnimationFrame(draw);return()=>{if(rafRef.current)cancelAnimationFrame(rafRef.current);};},[draw]);
  useEffect(()=>{const onResize=()=>{if(rafRef.current)cancelAnimationFrame(rafRef.current);rafRef.current=requestAnimationFrame(draw);};window.addEventListener("resize",onResize);return()=>window.removeEventListener("resize",onResize);},[draw]);

  // ═══ MOUSE/TOUCH INTERACTION ═══
  const getPos=(e)=>{
    const rect=canvasRef.current.getBoundingClientRect();
    const t=e.touches?e.touches[0]:e;
    return{x:t.clientX-rect.left,y:t.clientY-rect.top};
  };

  const handleDown=(e)=>{
    if(e.touches)e.preventDefault();
    const pos=getPos(e);
    const canvas=canvasRef.current;if(!canvas)return;
    const w=canvas.offsetWidth;const h=canvas.offsetHeight;
    const maxDim=Math.max(cfg.boomLength*1.5,40);
    const SC=Math.min(w*0.6,h*0.5)/maxDim;
    const VS=SC;
    const groundY=h*0.78;
    const pivotX=w*0.32;
    const pivotY=groundY-cfg.pivotHeight*SC;

    // Check boom tip (drag to extend)
    const boomRad=toRad(cfg.boomAngle);
    const btX=pivotX+cfg.boomLength*Math.cos(boomRad)*SC;
    const btY=pivotY-cfg.boomLength*Math.sin(boomRad)*VS;
    if(Math.hypot(pos.x-btX,pos.y-btY)<15){
      setDrag({type:"boomTip",SC,VS,pivotX,pivotY});
      if(setDragTarget)setDragTarget("boomTip");
      return;
    }

    // Check jib tip
    if(cfg.jibEnabled){
      const jRad=toRad(effectiveJibAngle);
      const jtX=btX+cfg.jibLength*Math.cos(jRad)*SC;
      const jtY=btY-cfg.jibLength*Math.sin(jRad)*VS;
      if(Math.hypot(pos.x-jtX,pos.y-jtY)<15){
        setDrag({type:"jibTip",SC,VS,btX,btY});
        return;
      }
    }

    // Check boom body (drag = change angle)
    const boomMidX=pivotX+cfg.boomLength*0.5*Math.cos(boomRad)*SC;
    const boomMidY=pivotY-cfg.boomLength*0.5*Math.sin(boomRad)*VS;
    if(Math.hypot(pos.x-boomMidX,pos.y-boomMidY)<25){
      setDrag({type:"boomAngle",pivotX,pivotY});
      return;
    }

    // Check ruler endpoints (drag to fine-tune) — works in both select and ruler mode
    for(let ri=rulers.length-1;ri>=0;ri--){
      const r=rulers[ri];
      const rx1=pivotX+r.x1*SC;const ry1=groundY-r.y1*VS;
      const rx2=pivotX+r.x2*SC;const ry2=groundY-r.y2*VS;
      if(Math.hypot(pos.x-rx1,pos.y-ry1)<12){
        setDrag({type:"rulerEnd",rulerId:r.id,end:1,pivotX,groundY,SC,VS});
        setMagnifier(pos);
        return;
      }
      if(Math.hypot(pos.x-rx2,pos.y-ry2)<12){
        setDrag({type:"rulerEnd",rulerId:r.id,end:2,pivotX,groundY,SC,VS});
        setMagnifier(pos);
        return;
      }
    }

    // Ruler tool — create new ruler
    if(tool==="ruler"){
      const rx=(pos.x-pivotX)/SC;const ry=(groundY-pos.y)/VS;
      setDrag({type:"ruler",x1:rx,y1:ry,x2:rx,y2:ry,pivotX,groundY,SC,VS});
      setMagnifier(pos);
      return;
    }

    // Check objects
    for(let i=objects.length-1;i>=0;i--){
      const obj=objects[i];
      const ox=pivotX+obj.x*SC;const oy=groundY-(obj.elevate||0)*VS;
      const ow=obj.w*SC;const oh=obj.h*VS;
      
      // Check rotation handle
      if(selObj===obj.id){
        const rhX=ox+ow/2;const rhY=oy-oh-15;
        if(Math.hypot(pos.x-rhX,pos.y-rhY)<8){
          setDrag({type:"rotate",objId:obj.id,cx:ox+ow/2,cy:oy-oh/2});
          return;
        }
        // Check resize handles
        if(Math.hypot(pos.x-(ox+ow),pos.y-(oy-oh))<8){
          setDrag({type:"resize",objId:obj.id,corner:"tr",startX:pos.x,startY:pos.y,origW:obj.w,origH:obj.h,SC,VS});
          return;
        }
      }
      
      if(pos.x>=ox&&pos.x<=ox+ow&&pos.y>=oy-oh&&pos.y<=oy){
        setSelObj(obj.id);
        setDrag({type:"moveObj",objId:obj.id,offX:pos.x-ox,offY:pos.y-oy,SC,VS,pivotX,groundY});
        return;
      }
    }
    setSelObj(null);
  };

  const handleMove=(e)=>{
    if(!drag)return;
    if(e.touches)e.preventDefault();
    const pos=getPos(e);

    if(drag.type==="boomTip"){
      // Drag tip = change boom length (distance from pivot)
      const dx=pos.x-drag.pivotX;const dy=drag.pivotY-pos.y;
      const dist=Math.sqrt(dx*dx+dy*dy)/drag.SC;
      const crane=CRANES.find(c=>c.id===cfg.craneType);
      const newLen=clamp(Math.round(dist),5,200);
      const newAngle=clamp(Math.round(toDeg(Math.atan2(dy,dx))),0,85);
      if(setDragTarget)setDragTarget("boomTip");
      // Update both length and angle when dragging tip
      updFromCanvas({boomLength:newLen,boomAngle:newAngle});
    } else if(drag.type==="jibTip"){
      const dx=pos.x-drag.btX;const dy=drag.btY-pos.y;
      const dist=Math.sqrt(dx*dx+dy*dy)/drag.SC;
      const newLen=clamp(Math.round(dist),2,100);
      const newAngle=clamp(Math.round(toDeg(Math.atan2(dy,dx))),0,cfg.boomAngle);
      updFromCanvas({jibLength:newLen,jibAngle:newAngle});
    } else if(drag.type==="boomAngle"){
      const dx=pos.x-drag.pivotX;const dy=drag.pivotY-pos.y;
      const angle=clamp(Math.round(toDeg(Math.atan2(dy,dx))),0,85);
      updFromCanvas({boomAngle:angle});
    } else if(drag.type==="ruler"){
      const rx=(pos.x-drag.pivotX)/drag.SC;const ry=(drag.groundY-pos.y)/drag.VS;
      setDrag(p=>({...p,x2:rx,y2:ry}));
      setMagnifier(pos);
    } else if(drag.type==="rulerEnd"){
      const rx=(pos.x-drag.pivotX)/drag.SC;const ry=(drag.groundY-pos.y)/drag.VS;
      setRulers(p=>p.map(r=>r.id===drag.rulerId?(drag.end===1?{...r,x1:rx,y1:ry}:{...r,x2:rx,y2:ry}):r));
      setMagnifier(pos);
    } else if(drag.type==="moveObj"){
      const newX=(pos.x-drag.offX-drag.pivotX)/drag.SC;
      const newElevate=(drag.groundY-(pos.y-drag.offY))/drag.VS;
      updObj(drag.objId,{x:Math.max(-10,newX),elevate:Math.max(0,Math.round(newElevate*10)/10)});
    } else if(drag.type==="rotate"){
      const angle=toDeg(Math.atan2(pos.y-drag.cy,pos.x-drag.cx))+90;
      updObj(drag.objId,{rotation:Math.round(angle/5)*5});
    } else if(drag.type==="resize"){
      const dxPx=pos.x-drag.startX;const dyPx=pos.y-drag.startY;
      const newW=Math.max(0.5,drag.origW+dxPx/drag.SC);
      const newH=Math.max(0.5,drag.origH-dyPx/drag.VS);
      updObj(drag.objId,{w:Math.round(newW*10)/10,h:Math.round(newH*10)/10});
    }
  };

  const updFromCanvas=(updates)=>{
    // This calls up in parent
    if(onCfgUpdate) onCfgUpdate(updates);
  };

  const handleUp=()=>{
    if(drag?.type==="ruler"&&drag.x1!==undefined){
      const dx=drag.x2-drag.x1;const dy=drag.y2-drag.y1;
      if(Math.sqrt(dx*dx+dy*dy)>0.5){
        setRulers(p=>[...p,{id:uid(),x1:drag.x1,y1:drag.y1,x2:drag.x2,y2:drag.y2}]);
      }
    }
    setDrag(null);setMagnifier(null);
    if(setDragTarget)setDragTarget(null);
  };

  // Double-click/tap on ruler endpoint or line → delete that ruler
  const handleDblClick=(e)=>{
    const pos=getPos(e);
    const canvas=canvasRef.current;if(!canvas)return;
    const w=canvas.offsetWidth;const h=canvas.offsetHeight;
    const maxDim=Math.max(cfg.boomLength*1.5,40);
    const SC=Math.min(w*0.6,h*0.5)/maxDim;
    const VS=SC;
    const groundY=h*0.78;
    const pivotX=w*0.32;

    for(let ri=rulers.length-1;ri>=0;ri--){
      const r=rulers[ri];
      const rx1=pivotX+r.x1*SC;const ry1=groundY-r.y1*VS;
      const rx2=pivotX+r.x2*SC;const ry2=groundY-r.y2*VS;
      // Hit on endpoints
      if(Math.hypot(pos.x-rx1,pos.y-ry1)<14||Math.hypot(pos.x-rx2,pos.y-ry2)<14){
        setRulers(p=>p.filter((_,i)=>i!==ri));
        return;
      }
      // Hit on line body (distance from point to line segment)
      const ldx=rx2-rx1;const ldy=ry2-ry1;const len2=ldx*ldx+ldy*ldy;
      if(len2>0){
        const t=Math.max(0,Math.min(1,((pos.x-rx1)*ldx+(pos.y-ry1)*ldy)/len2));
        const projX=rx1+t*ldx;const projY=ry1+t*ldy;
        if(Math.hypot(pos.x-projX,pos.y-projY)<10){
          setRulers(p=>p.filter((_,i)=>i!==ri));
          return;
        }
      }
    }
  };

  // Register non-passive touch listeners to prevent page scroll during canvas interaction
  const handlersRef=useRef({down:handleDown,move:handleMove,up:handleUp});
  handlersRef.current={down:handleDown,move:handleMove,up:handleUp};
  useEffect(()=>{
    const c=canvasRef.current;if(!c)return;
    const opts={passive:false};
    const tStart=(e)=>{e.preventDefault();e.stopPropagation();handlersRef.current.down(e);};
    const tMove=(e)=>{e.preventDefault();e.stopPropagation();handlersRef.current.move(e);};
    const tEnd=(e)=>{e.preventDefault();handlersRef.current.up(e);};
    c.addEventListener("touchstart",tStart,opts);
    c.addEventListener("touchmove",tMove,opts);
    c.addEventListener("touchend",tEnd,opts);
    return()=>{c.removeEventListener("touchstart",tStart);c.removeEventListener("touchmove",tMove);c.removeEventListener("touchend",tEnd);};
  },[]);

  return(
    <canvas ref={canvasRef} style={{width:"100%",height:"100%",cursor:tool==="ruler"?"crosshair":drag?"grabbing":"default",touchAction:"none",borderRadius:8}}
      onMouseDown={handleDown} onMouseMove={handleMove} onMouseUp={handleUp} onMouseLeave={handleUp}
      onDoubleClick={handleDblClick}
    />
  );
}

// ═══ MAIN APP COMPONENT ═══
export default function App({onSave,initialData,projectName:extProjectName}){
  const [tab,setTab]=useState("chart");
  const [cfg,setCfg]=useState(initialData?.config||{craneType:"mobile",boomLength:30,boomAngle:45,jibEnabled:false,jibLength:10,jibAngle:15,pivotHeight:2.5,pivotDist:0,craneEnd:4,loadWeight:5,counterweight:20,windSpeed:0,skinId:"default",
    loadW:3,loadH:2,loadShape:"box",slingType:"2leg",slingLength:4,slingLegs:2,hookBlockH:1.2,
    chartId:"",outriggerSpread:"full",cwConfig:"full",manualCap:0,maxBoom:60
  });
  const [objects,setObjects]=useState(initialData?.objects||[]);
  const [selObj,setSelObj]=useState(null);
  const [rulers,setRulers]=useState(initialData?.rulers||[]);
  const [tool,setTool]=useState("select");
  // Vinç Bul state (used by crane finder page via localStorage)

  const [lp,setLp]=useState(initialData?.lift_plan||{supplier:"",supplierContact:"",supplierPhone:"",supplierEmail:"",supplierAddr:"",client:"",clientContact:"",clientPhone:"",clientEmail:"",clientAddr:"",jobNumber:"",jobName:"",jobAddress:"",jobDate:new Date().toISOString().split("T")[0],craneMake:"",craneModel:"",craneRego:"",linePull:0,partsOfLine:4,cwConfig:"",loadDesc:"",loadWeight:0,riggingWeight:0,hookBlockWeight:0,addWeight:0,wll:0,notes:"",outForce:0,padShape:"square",padW:1,padL:1});

  const [ci,setCi]=useState({load:0,wll:0,pct:75,outF:0,padW:1,padL:1,padShape:"square"});
  const [showPDF,setShowPDF]=useState(false);
  const [customCharts,setCustomCharts]=useState({});
  const [chartsLoading,setChartsLoading]=useState(true);
  const supabaseRef=useRef(null);
  const userIdRef=useRef(null);

  // Load custom charts from Supabase on mount
  useEffect(()=>{
    const loadCharts=async()=>{
      try{
        const sb=createClient();
        supabaseRef.current=sb;
        try{const{data:{user}}=await sb.auth.getUser();if(user)userIdRef.current=user.id;}catch{}
        // Load all accessible charts (preset + public + own)
        const{data,error}=await sb.from("load_charts").select("*");
        if(error){console.warn("Chart load error:",error);}
        if(data&&data.length>0){
          const charts={};
          data.forEach(row=>{
            charts[row.id]={
              name:row.name,
              maxCap:row.max_capacity,
              maxBoom:row.max_boom,
              pivotH:row.pivot_height||3,
              boomLengths:row.boom_lengths||[],
              rows:row.chart_data||[],
              config:{outrigger:row.outrigger_config,cw:row.counterweight_config,manufacturer:row.manufacturer,model:row.model},
              isPreset:row.is_preset||false,
              isPublic:row.is_public||false,
            };
          });
          setCustomCharts(charts);
        }
      }catch(e){console.warn("Chart load error:",e);}
      setChartsLoading(false);
    };
    loadCharts();
  },[]);
  const [saveStatus,setSaveStatus]=useState("idle");
  const [showMobMenu,setShowMobMenu]=useState(false);
  const [showMobObj,setShowMobObj]=useState(false);
  const [isMobile,setIsMobile]=useState(typeof window!=="undefined"&&window.innerWidth<768);
  const [craneColors,setCraneColors]=useState({...DEFAULT_CRANE_COLORS});
  const [colorEditPart,setColorEditPart]=useState(null);
  const [dragTarget,setDragTarget]=useState(null);
  const [showObjPanel,setShowObjPanel]=useState(false);
  const [detailOpen,setDetailOpen]=useState(false); // Detail sections collapsed by default
  
  // ═══ FLEET CRANES STATE ═══
  const [fleetCranes,setFleetCranes]=useState([]);
  const [fleetExpanded,setFleetExpanded]=useState(null);
  const [fleetForm,setFleetForm]=useState(null);
  const [cfgForm,setCfgForm]=useState(null);
  const [fleetLoading,setFleetLoading]=useState(false);
  const [selFleetId,setSelFleetId]=useState("");   // seçili filo vinci
  const [selCfgId,setSelCfgId]=useState("");       // seçili konfigürasyon
  const [finderExpandedCfg,setFinderExpandedCfg]=useState(null); // Vinç Bul accordion

  useEffect(()=>{
    const onResize=()=>setIsMobile(window.innerWidth<768);
    window.addEventListener("resize",onResize);return()=>window.removeEventListener("resize",onResize);
  },[]);

  // Scroll to top when switching tabs
  useEffect(()=>{window.scrollTo(0,0);},[tab]);

  // Lock body scroll on mobile chart tab (position:fixed handles the rest)
  useEffect(()=>{
    if(!isMobile||tab!=="chart")return;
    document.body.style.overflow="hidden";
    document.documentElement.style.overflow="hidden";
    return()=>{
      document.body.style.overflow="";
      document.documentElement.style.overflow="";
    };
  },[isMobile,tab]);

  // ═══ FLEET CRANES LOAD ═══
  const loadFleet=useCallback(async()=>{
    if(!supabaseRef.current)return;
    setFleetLoading(true);
    try{
      const{data:cr}=await supabaseRef.current.from("fleet_cranes").select("*").order("created_at",{ascending:false});
      const{data:cf}=await supabaseRef.current.from("crane_configs").select("*").order("sort_order");
      const{data:lc}=await supabaseRef.current.from("load_charts").select("id,name,max_capacity,max_boom").order("name");
      setFleetCranes((cr||[]).map(c=>({...c,configs:(cf||[]).filter(x=>x.crane_id===c.id),_charts:lc||[]})));
    }catch(e){console.error(e);}
    setFleetLoading(false);
  },[]);
  useEffect(()=>{if(tab==="cranes")loadFleet();},[tab]);
  // Also load fleet on mount so chart tab can use it
  useEffect(()=>{loadFleet();},[]);

  // ═══ Auto-apply when config is selected ═══
  useEffect(()=>{
    if(!selCfgId)return;
    const fc=fleetCranes.find(c=>c.id===selFleetId);
    if(!fc)return;
    const cf=fc.configs?.find(c=>c.id===selCfgId);
    if(!cf)return;
    // Map fleet crane type to CRANES id
    const typeMap={mobile:"mobile",crawler:"crawler",rough:"rough",truck:"truck"};
    const cType=typeMap[fc.crane_type]||"mobile";
    const updates={craneType:cType};
    if(cf.max_boom)updates.maxBoom=Number(cf.max_boom);
    if(cf.outrigger_config)updates.outriggerSpread=cf.outrigger_config;
    if(cf.counterweight)updates.cwConfig=cf.counterweight;
    // Link load chart
    if(cf.load_chart_id&&allCharts[cf.load_chart_id]){
      updates.chartId=cf.load_chart_id;
    }
    up(updates);
    // Update lift plan crane info
    setLp(p=>({...p,craneMake:fc.manufacturer||"",craneModel:fc.name||"",cwConfig:cf.counterweight||""}));
  },[selCfgId,selFleetId]);

  // When fleet crane changes, reset config selection
  useEffect(()=>{setSelCfgId("");},[selFleetId]);

  const fleetSaveCrane=async(data)=>{
    if(!supabaseRef.current)return;
    const clean={name:data.name,manufacturer:data.manufacturer||null,crane_type:data.crane_type||"mobile",
      max_capacity:data.max_capacity?Number(data.max_capacity):null,serial_number:data.serial_number||null,
      year_of_manufacture:data.year_of_manufacture?Number(data.year_of_manufacture):null,notes:data.notes||null};
    try{
      if(data.id){await supabaseRef.current.from("fleet_cranes").update(clean).eq("id",data.id);}
      else{const{error}=await supabaseRef.current.from("fleet_cranes").insert({...clean,user_id:userIdRef.current});if(error)throw error;}
      setFleetForm(null);loadFleet();
    }catch(e){alert("Kayıt hatası: "+e.message);}
  };
  const fleetDeleteCrane=async(id)=>{
    if(!confirm("Bu vinç ve tüm konfigürasyonları silinecek?"))return;
    await supabaseRef.current.from("fleet_cranes").delete().eq("id",id);
    if(selFleetId===id){setSelFleetId("");setSelCfgId("");}
    loadFleet();
  };
  const fleetSaveConfig=async(data,craneId)=>{
    if(!supabaseRef.current)return;
    const clean={crane_id:craneId,name:data.name,description:data.description||null,
      counterweight:data.counterweight||null,boom_type:data.boom_type||"telescopic",
      max_boom:data.max_boom?Number(data.max_boom):null,max_capacity_at_config:data.max_capacity_at_config?Number(data.max_capacity_at_config):null,
      outrigger_config:data.outrigger_config||"full",load_chart_id:data.load_chart_id||null,
      transport_vehicles:(data.transport_vehicles||[]).filter(v=>v.count>0)};
    try{
      if(data.id){await supabaseRef.current.from("crane_configs").update(clean).eq("id",data.id);}
      else{const{error}=await supabaseRef.current.from("crane_configs").insert(clean);if(error)throw error;}
      setCfgForm(null);loadFleet();
    }catch(e){alert("Kayıt hatası: "+e.message);}
  };
  const fleetDeleteConfig=async(id)=>{
    if(!confirm("Bu konfigürasyon silinecek?"))return;
    await supabaseRef.current.from("crane_configs").delete().eq("id",id);loadFleet();
  };

  // Bridge for canvas to update config
  // Config update callback for RangeChart child
  const handleCfgUpdate=useCallback((u)=>setCfg(p=>({...p,...u})),[]);

  const crane=CRANES.find(c2=>c2.id===cfg.craneType);
  // Auto-sync crane geometry when crane type changes
  useEffect(()=>{
    if(!crane)return;
    setCfg(p=>({...p,pivotHeight:crane.pivotH,pivotDist:crane.pivotDist??1.5,craneEnd:crane.craneEnd??4,maxBoom:crane.defBoom}));
  },[cfg.craneType]);
  const skin=SKINS.find(s=>s.id===cfg.skinId)||SKINS[0];
  const realRadius=useMemo(()=>calcRadius(cfg),[cfg]);
  const realBoomTipH=useMemo(()=>calcBoomTipHeight(cfg),[cfg]);
  const realHookH=useMemo(()=>calcHookHeight(cfg),[cfg]);
  const allCharts=useMemo(()=>({...LOAD_CHARTS,...customCharts}),[customCharts]);
  const activeChart=cfg.chartId?allCharts[cfg.chartId]:null;
  const rawCap=activeChart?lookupChart(activeChart,cfg.boomLength,realRadius):null;
  const cap=rawCap!==null?rawCap:(cfg.manualCap>0?cfg.manualCap:null);
  const capSource=rawCap!==null?"chart":(cfg.manualCap>0?"manual":"none");
  const combinedDerating=1; // No fake derating — real charts already account for configuration
  const chartMismatch=false; // No fake crane capacity to compare against
  const totalW=lp.loadWeight+lp.riggingWeight+lp.hookBlockWeight+lp.addWeight;
  const selObjData=objects.find(o=>o.id===selObj);

  const up=(u)=>{setCfg(p=>({...p,...u}));if(u.loadWeight!==undefined)setLp(p=>({...p,loadWeight:u.loadWeight}));};
  const upLP=(k,v)=>{setLp(p=>({...p,[k]:v}));if(k==="loadWeight")setCfg(p=>({...p,loadWeight:v}));};
  const upCI=(k,v)=>setCi(p=>({...p,[k]:v}));

  const addObj=(type)=>{const d=OBJ_TYPES.find(o=>o.id===type);setObjects(p=>[...p,{id:uid(),type,x:10+Math.random()*15,w:d.w,h:d.h,rotation:0,name:d.name,color:C.g400,elevate:0,showTop:false,showSlew:false,flipped:false}]);};
  const updObj=(id,u)=>setObjects(p=>p.map(o=>o.id===id?{...o,...u}:o));
  const delObj=(id)=>{setObjects(p=>p.filter(o=>o.id!==id));setSelObj(null);};
  const cpObj=(id)=>{const o=objects.find(x2=>x2.id===id);if(o)setObjects(p=>[...p,{...o,id:uid(),x:o.x+3}]);};
  const moveLayer=(id,dir)=>{setObjects(p=>{const i=p.findIndex(o=>o.id===id);if(i<0)return p;const n=[...p];const ni=dir==="up"?Math.min(i+1,n.length-1):Math.max(i-1,0);[n[i],n[ni]]=[n[ni],n[i]];return n;});};

  // Save handler
  const handleSave=async()=>{
    if(!onSave)return;
    setSaveStatus("saving");
    try{await onSave({config:cfg,objects,rulers,lift_plan:lp});setSaveStatus("saved");setTimeout(()=>setSaveStatus("idle"),2000);}
    catch(e){setSaveStatus("idle");}
  };

  // Navigate to crane finder page
  const navigateToCraneFinder=()=>{
    const params={
      craneType:cfg.craneType,boomLength:cfg.boomLength,boomAngle:cfg.boomAngle,
      jibEnabled:cfg.jibEnabled,jibLength:cfg.jibLength,jibAngle:cfg.jibAngle,
      loadWeight:cfg.loadWeight,radius:realRadius,hookHeight:realHookH,
      boomTipHeight:realBoomTipH,pivotHeight:cfg.pivotHeight,
      chartId:cfg.chartId||"",outriggerSpread:cfg.outriggerSpread,cwConfig:cfg.cwConfig,
    };
    if(typeof window!=="undefined"){
      localStorage.setItem("happ_crane_finder_config",JSON.stringify(params));
      window.location.href="/dashboard/crane-finder";
    }
  };

  // Calculations
  const pctCalc=ci.wll>0?ci.load/ci.wll*100:0;
  const maxLoadCalc=ci.wll*ci.pct/100;
  const minWllCalc=ci.pct>0?ci.load/ci.pct*100:0;

  // Export: canvas screenshot
  const exportScreenshot=()=>{
    const canvas=document.querySelector("canvas");if(!canvas)return;
    const link=document.createElement("a");
    link.download=`Hangle-${new Date().toISOString().split("T")[0]}.png`;
    link.href=canvas.toDataURL("image/png");
    link.click();
  };

  // JSON Import
  const csvInputRef=useRef(null);
  const importChartCSV=(e)=>{
    const file=e.target.files?.[0];if(!file)return;
    const reader=new FileReader();
    reader.onload=async(ev)=>{
      try{
        const text=ev.target.result;
        // Split by --- for multi-table support
        const sections=text.trim().split(/\n---\s*\n|\n---$/);
        const newCharts={};
        let firstName="";
        let firstId="";
        for(const section of sections){
          const lines=section.trim().split("\n").map(l=>l.split(",").map(s=>s.trim()));
          if(lines.length<3)continue;
          const name=lines[0][0]||"Özel Tablo";
          // Check if line 1 is a config: line
          let configLine={};
          let dataStart=1;
          if(lines[1]&&lines[1][0]&&lines[1][0].toLowerCase().startsWith("config:")){
            const cfgStr=lines[1].join(",").replace(/^config:\s*/i,"");
            cfgStr.split(",").forEach(p=>{const[k,v]=p.split("=").map(s=>s.trim());if(k&&v)configLine[k]=v;});
            dataStart=2;
          }
          const boomLengths=lines[dataStart].slice(1).map(v=>{const n=parseFloat(v.replace(",","."));return isNaN(n)?null:n;}).filter(v=>v!==null&&v>0);
          const rows=[];
          for(let i=dataStart+1;i<lines.length;i++){
            if(!lines[i]||!lines[i][0])continue;
            const r=parseFloat(lines[i][0].replace(",","."));if(isNaN(r))continue;
            const caps=lines[i].slice(1).map(v=>{const n=parseFloat((v||"").replace(",","."));return isNaN(n)||n<=0?null:n;});
            rows.push({r,caps});
          }
          if(boomLengths.length===0||rows.length===0)continue;
          const maxCap=Math.max(...rows.flatMap(r=>r.caps.filter(v=>v!==null)));
          const maxBoom=Math.max(...boomLengths);
          const id="tmp_"+Date.now()+"_"+Math.random().toString(36).slice(2,6);
          newCharts[id]={name,maxCap,maxBoom,pivotH:parseFloat(configLine.pivotH)||3,boomLengths,rows,config:configLine,isPreset:false};
          if(!firstName){firstName=name;firstId=id;}
        }
        const count=Object.keys(newCharts).length;
        if(count===0){alert("Geçerli tablo bulunamadı. Format:\nSatır 1: Tablo adı\n(Opsiyonel) config: outrigger=full, cw=87.5\nSatır 2: ,boom1,boom2,...\nSatır 3+: menzil,kap1,kap2,...\n\nÇoklu tablolar --- ile ayrılır.");return;}
        setCustomCharts(p=>({...p,...newCharts}));
        up({chartId:firstId});
        // Save to Supabase
        if(supabaseRef.current){
          for(const[_,ch] of Object.entries(newCharts)){
            const row={
              user_id:userIdRef.current||null,
              name:ch.name,
              max_capacity:Number(ch.maxCap),
              max_boom:Number(ch.maxBoom),
              pivot_height:Number(ch.pivotH)||3,
              boom_lengths:ch.boomLengths,
              chart_data:ch.rows,
              outrigger_config:String(ch.config?.outrigger||"full"),
              counterweight_config:ch.config?.cw?String(ch.config.cw):null,
              source:"csv_import"
            };
            console.log("Inserting chart:",row.name,row);
            const{data:saved,error}=await supabaseRef.current.from("load_charts").insert(row).select();
            if(error){console.error("Chart save FAILED:",error.message,error.details,error.hint,error.code,JSON.stringify(error));alert("Tablo kaydedilemedi: "+error.message);return;}
            if(saved&&saved[0]){
              const r=saved[0];
              const dbChart={
                name:r.name,maxCap:r.max_capacity,maxBoom:r.max_boom,
                pivotH:r.pivot_height||3,boomLengths:r.boom_lengths||[],
                rows:Array.isArray(r.chart_data)?r.chart_data:r.chart_data,
                config:{outrigger:r.outrigger_config,cw:r.counterweight_config},
                isPreset:false,
              };
              setCustomCharts(p=>{const n={...p};delete n[_];n[r.id]=dbChart;return n;});
              up({chartId:r.id});
              console.log("Chart saved OK:",r.id,r.name);
            }
          }
        }
        alert(count===1
          ?`Yük tablosu yüklendi: ${firstName}`
          :`${count} yük tablosu yüklendi! İlk tablo: ${firstName}`);
      }catch(err){alert("CSV parse hatası: "+err.message);}
    };
    reader.readAsText(file);
    e.target.value="";
  };
  // JSON import handled inline in Export tab

  const deleteChart=(chartId)=>{
    setCustomCharts(p=>{const n={...p};delete n[chartId];return n;});
    up({chartId:""});
    if(supabaseRef.current){
      supabaseRef.current.from("load_charts").delete().eq("id",chartId).then(({error})=>{if(error)console.warn("Chart delete error:",error);});
    }
  };

  return(
    <div style={{fontFamily:FB,background:`linear-gradient(135deg,${C.dark} 0%,${C.greenBg} 40%,${C.dark} 100%)`,color:C.white,...(isMobile&&tab==="chart"?{position:"fixed",inset:0,overflow:"hidden"}:{minHeight:"100vh"})}}>
      {showPDF&&<PDFPreview cfg={cfg} crane={crane} cap={cap} lp={lp} totalW={totalW} hookH={realHookH} radius={realRadius} realBoomTipH={realBoomTipH} onClose={()=>setShowPDF(false)}/>}

      {/* HEADER — quick actions always visible */}
      <header style={{background:`linear-gradient(90deg,${C.greenDark},${C.green})`,borderBottom:`2px solid ${C.yellow}`,padding:isMobile?"4px 8px":"10px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:isMobile?4:8,...(isMobile&&tab==="chart"?{position:"fixed",top:0,left:0,right:0,zIndex:50,height:44}:{})}}>
        <div style={{display:"flex",alignItems:"center",gap:8,minWidth:0}}>
          <img src={LOGO_DATA} alt="Hangle" style={{width:isMobile?28:42,height:isMobile?28:42,borderRadius:8,objectFit:"contain",flexShrink:0}}/>
          <div style={{minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontSize:isMobile?16:24,fontWeight:900,letterSpacing:isMobile?3:5,color:C.yellow,fontFamily:F}}>Hangle</span>
              {extProjectName&&<span style={{fontSize:isMobile?10:12,color:C.greenLight,fontFamily:F,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:isMobile?100:200}}>— {extProjectName}</span>}
            </div>
            {!isMobile&&<div style={{fontSize:9,color:C.greenLight,letterSpacing:2,fontFamily:F}}>VİNÇ PLANLAMA v5.3</div>}
          </div>
        </div>
        {/* Quick actions — always visible */}
        <div style={{display:"flex",alignItems:"center",gap:isMobile?4:6}}>
          {isMobile&&tab!=="chart"&&<button onClick={()=>setTab("chart")} style={{padding:"6px 10px",border:`1px solid ${C.yellow}60`,borderRadius:8,background:"transparent",color:C.yellow,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:F}}>← Şema</button>}
          <button onClick={()=>setShowPDF(true)} style={{padding:isMobile?"6px 10px":"6px 14px",background:C.yellow,border:"none",borderRadius:8,color:C.greenDark,fontWeight:700,fontSize:isMobile?10:12,cursor:"pointer",fontFamily:F}}>📋 {isMobile?"PDF":"Kaldırma Planı"}</button>
          {!isMobile&&<button onClick={exportScreenshot} style={{padding:"6px 14px",background:C.g500+"80",border:`1px solid ${C.g400}40`,borderRadius:8,color:C.g200,fontWeight:600,fontSize:11,cursor:"pointer",fontFamily:F}}>📷 Ekran Görüntüsü</button>}
          {onSave&&<button onClick={handleSave} style={{padding:isMobile?"6px 10px":"6px 14px",background:saveStatus==="saved"?C.greenLight+"30":C.g500+"80",border:`1px solid ${saveStatus==="saved"?C.greenLight:C.g400}40`,borderRadius:8,color:saveStatus==="saved"?C.greenLight:C.g200,fontWeight:600,fontSize:isMobile?10:11,cursor:"pointer",fontFamily:F}}>
            {saveStatus==="saved"?"✅ Kaydedildi":saveStatus==="saving"?"⏳":"💾 Kaydet"}
          </button>}
        </div>
        {!isMobile&&<nav style={{display:"flex",gap:3,background:C.greenDark,borderRadius:8,padding:3,width:"100%"}}>
          {TABS.map(t=>(<button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"8px 16px",border:"none",borderRadius:6,background:tab===t.id?C.yellow:t.id==="cranefinder"?`linear-gradient(135deg,${C.green},${C.greenLight})`:"transparent",color:tab===t.id?C.greenDark:t.id==="cranefinder"?"white":C.g300,fontWeight:tab===t.id||t.id==="cranefinder"?700:500,fontSize:12,cursor:"pointer",fontFamily:F,whiteSpace:"nowrap"}}>{t.icon} {t.label}</button>))}
          <div style={{flex:1}}/>
          <button onClick={()=>{window.location.href="/dashboard";}} style={{padding:"8px 16px",border:"none",borderRadius:6,background:"transparent",color:C.g500,fontWeight:500,fontSize:12,cursor:"pointer",fontFamily:F,whiteSpace:"nowrap"}}>📁 Projelerim</button>
        </nav>}
      </header>

      {/* ═══ CHART TAB ═══ */}
      {tab==="chart"&&(
        isMobile?(
        <div style={{position:"fixed",top:44,left:0,right:0,bottom:0,display:"flex",flexDirection:"column",overflow:"hidden",touchAction:"none"}}>
          {/* CANVAS - takes all space */}
          <div style={{flex:1,position:"relative",minHeight:0}}>
            <RangeChart cfg={cfg} crane={crane} skin={skin} objects={objects} selObj={selObj} setSelObj={setSelObj} rulers={rulers} setRulers={setRulers} tool={tool} setTool={setTool} addObj={addObj} updObj={updObj} delObj={delObj} isMobile={isMobile} craneColors={craneColors} setDragTarget={setDragTarget} onCfgUpdate={handleCfgUpdate} finalCap={cap} derating={combinedDerating} capSource={capSource} chartMismatch={chartMismatch}/>
            
            {/* Top-right floating toolbar */}
            <div style={{position:"absolute",top:6,right:6,display:"flex",gap:4,zIndex:20}}>
              {[{id:"select",icon:"👆",tip:"Seç"},{id:"ruler",icon:"📏",tip:"Cetvel"},{id:"obj",icon:"📦",tip:"Nesne"}].map(b=>(
                <button key={b.id} onClick={()=>{if(b.id==="obj"){setShowMobObj(!showMobObj);setShowMobMenu(false);}else{setTool(b.id==="select"?"select":"ruler");setShowMobObj(false);}}} style={{width:36,height:36,borderRadius:8,border:`2px solid ${(b.id==="obj"?showMobObj:tool===b.id)?C.yellow:C.green+"60"}`,background:(b.id==="obj"?showMobObj:tool===b.id)?"rgba(0,77,42,0.95)":"rgba(10,31,18,0.85)",color:"white",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(8px)"}} title={b.tip}>{b.icon}</button>
              ))}
              <button onClick={()=>{setShowMobMenu(!showMobMenu);setShowMobObj(false);}} style={{width:36,height:36,borderRadius:8,border:`2px solid ${showMobMenu?C.yellow:C.green+"60"}`,background:showMobMenu?"rgba(0,77,42,0.95)":"rgba(10,31,18,0.85)",color:"white",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(8px)"}}>☰</button>
            </div>

            {/* Objects overlay */}
            {showMobObj&&(<>
              <div onClick={()=>setShowMobObj(false)} style={{position:"absolute",inset:0,zIndex:25}}/>
              <div style={{position:"absolute",top:46,right:6,width:200,maxHeight:"50vh",overflow:"auto",background:"rgba(10,31,18,0.95)",border:`1px solid ${C.green}40`,borderRadius:10,padding:8,zIndex:30,backdropFilter:"blur(12px)",touchAction:"auto",overscrollBehavior:"contain"}}>
                <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                  {OBJ_TYPES.map(o=><button key={o.id} onClick={()=>{addObj(o.id);setShowMobObj(false);}} style={{padding:"6px 10px",background:C.green+"25",border:`1px solid ${C.green}35`,borderRadius:8,color:C.g200,fontSize:10,cursor:"pointer"}}>{o.icon} {o.name}</button>)}
                </div>
              </div>
            </>)}

            {/* Menu overlay — scrollable */}
            {showMobMenu&&(<>
              <div onClick={()=>setShowMobMenu(false)} style={{position:"absolute",inset:0,zIndex:25}}/>
              <div style={{position:"absolute",top:46,right:6,width:220,maxHeight:"calc(100% - 56px)",overflow:"auto",background:"rgba(10,31,18,0.96)",border:`1px solid ${C.green}40`,borderRadius:12,padding:6,zIndex:30,backdropFilter:"blur(12px)",touchAction:"auto",overscrollBehavior:"contain"}}>
                {[
                  {label:"Projelerim",icon:"📁",action:()=>{window.location.href="/dashboard";setShowMobMenu(false);}},
                  {label:"Vinç Bul",icon:"🔍",action:()=>{setTab("cranefinder");setShowMobMenu(false);}},
                  {label:"Jib "+(cfg.jibEnabled?"Kapat":"Aç"),icon:cfg.jibEnabled?"🔴":"🟢",action:()=>up({jibEnabled:!cfg.jibEnabled})},
                  {label:"Kaldırma Planı",icon:"📋",action:()=>{setTab("liftplan");setShowMobMenu(false);}},
                  {label:"Hesaplamalar",icon:"🔢",action:()=>{setTab("calc");setShowMobMenu(false);}},
                  {label:"Dışa Aktar",icon:"📤",action:()=>{setTab("export");setShowMobMenu(false);}},
                  {label:"Grafik Sıfırla",icon:"🗑️",action:()=>{if(window.confirm("Tüm nesneler ve cetveller silinecek. Emin misiniz?")){setObjects([]);setRulers([]);}setShowMobMenu(false);}},
                ].map((item,i)=>(
                  <button key={i} onClick={item.action} style={{width:"100%",padding:"10px 12px",background:"transparent",border:"none",borderBottom:i<6?`1px solid ${C.green}15`:"none",color:C.g200,fontSize:13,textAlign:"left",cursor:"pointer",display:"flex",alignItems:"center",gap:8,fontFamily:FB}}>
                    <span style={{fontSize:15}}>{item.icon}</span>{item.label}
                  </button>
                ))}
                {/* Vinç Tipi */}
                <div style={{padding:"6px 8px",borderTop:`1px solid ${C.green}20`}}>
                  <div style={{fontSize:10,color:C.g500,marginBottom:4}}>Vinç Tipi</div>
                  <select value={cfg.craneType} onChange={e=>{up({craneType:e.target.value});setShowMobMenu(false);}} style={{width:"100%",padding:"8px",background:C.dark,border:`1px solid ${C.green}30`,borderRadius:6,color:C.yellow,fontSize:11,fontFamily:F}}>
                    {CRANES.map(c2=><option key={c2.id} value={c2.id}>{c2.name}</option>)}
                  </select>
                </div>
                {/* Yük & Koşullar */}
                <div style={{padding:"6px 8px",borderTop:`1px solid ${C.green}20`}}>
                  <div style={{fontSize:10,color:C.g500,marginBottom:4}}>Yük Ağırlığı</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>
                    <div>
                      <div style={{fontSize:10,color:"#999"}}>Yük (t)</div>
                      <MobNum value={cfg.loadWeight} onChange={v=>up({loadWeight:clamp(v,0,999)})} step={0.5} style={{fontSize:14,padding:"4px 2px"}}/>
                    </div>
                    <div>
                      <div style={{fontSize:10,color:"#999"}}>Rüzgar (km/h)</div>
                      <MobNum value={cfg.windSpeed} onChange={v=>up({windSpeed:clamp(v,0,100)})} step={1} style={{fontSize:14,padding:"4px 2px"}}/>
                    </div>
                  </div>
                </div>
              </div>
            </>)}
          </div>

          {/* BOTTOM BAR — only when object selected */}
          {selObjData&&(
            <div style={{background:"#f5f5f5",borderTop:"2px solid #ddd",padding:"4px 4px",paddingBottom:"max(4px, env(safe-area-inset-bottom, 0px))",flexShrink:0}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr auto",gap:3,alignItems:"center"}}>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:10,color:"#888"}}>Yükseklik</div>
                  <MobNum value={selObjData.h} onChange={v=>updObj(selObj,{h:v})} step={0.1} style={{fontSize:13,padding:"3px 1px"}}/>
                </div>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:10,color:"#888"}}>Genişlik</div>
                  <MobNum value={selObjData.w} onChange={v=>updObj(selObj,{w:v})} step={0.1} style={{fontSize:13,padding:"3px 1px"}}/>
                </div>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:10,color:"#888"}}>Mesafe</div>
                  <MobNum value={selObjData.x} onChange={v=>updObj(selObj,{x:v})} step={0.5} style={{fontSize:13,padding:"3px 1px"}}/>
                </div>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:10,color:"#888"}}>Yükselt</div>
                  <MobNum value={selObjData.elevate||0} onChange={v=>updObj(selObj,{elevate:v})} step={0.5} style={{fontSize:13,padding:"3px 1px"}}/>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:3}}>
                  <button onClick={()=>cpObj(selObj)} style={{width:36,height:32,borderRadius:6,border:"1px solid #ccc",background:"white",fontSize:13,cursor:"pointer"}}>📋</button>
                  <button onClick={()=>delObj(selObj)} style={{width:36,height:32,borderRadius:6,border:"1px solid #ccc",background:"white",fontSize:13,cursor:"pointer",color:"#d00"}}>🗑</button>
                </div>
              </div>
            </div>
          )}
        </div>
        ):(
        /* ═══ DESKTOP LAYOUT ═══ */
        <div style={{display:"flex",height:"calc(100vh - 95px)"}}>
          {/* LEFT PANEL — organized for field foremen & sales */}
          <div style={{width:290,overflow:"auto",padding:12,background:C.dark+"80",borderRight:`1px solid ${C.green}15`}}>
            {/* ── TEMEL: Her zaman görünür ── */}
            
            {/* Vinç Tipi */}
            <Card>
              <Title>Vinç Tipi</Title>
              <Sel value={cfg.craneType} onChange={v=>up({craneType:v})}>{CRANES.map(c2=><option key={c2.id} value={c2.id}>{c2.name}</option>)}</Sel>
            </Card>

            {/* Boom — Uzunluk / Uzaklık / Açı (entegre & dinamik) */}
            <Card>
              <Title>Boom Ayarları</Title>
              <Row><Lbl>Uzunluk (m)</Lbl><Num value={cfg.boomLength} onChange={v=>{
                // Uzunluk değiştiğinde açı sabit kalır, uzaklık güncellenir
                up({boomLength:clamp(v,5,200)});
              }} min={5} max={200}/></Row>
              <Sli value={cfg.boomLength} min={5} max={200} onChange={v=>up({boomLength:v})}/>
              <Row><Lbl>Uzaklık (m)</Lbl><Num value={parseFloat(realRadius.toFixed(1))} onChange={v=>{
                // Uzaklık değiştiğinde uzunluk sabit kalır, açı güncellenir
                const targetR=clamp(v,0,cfg.boomLength+cfg.pivotDist);
                const cosA=(targetR-cfg.pivotDist)/cfg.boomLength;
                const newAngle=cosA>=-1&&cosA<=1?clamp(Math.round(toDeg(Math.acos(cosA))),0,85):cfg.boomAngle;
                up({boomAngle:newAngle});
              }} min={0} max={200} step={0.5}/></Row>
              <Sli value={realRadius} min={0} max={Math.max(cfg.boomLength+cfg.pivotDist,50)} onChange={v=>{
                const cosA=(v-cfg.pivotDist)/cfg.boomLength;
                const newAngle=cosA>=-1&&cosA<=1?clamp(Math.round(toDeg(Math.acos(cosA))),0,85):cfg.boomAngle;
                up({boomAngle:newAngle});
              }} color={C.cyan}/>
              <Row><Lbl>Açı (°)</Lbl><Num value={cfg.boomAngle} onChange={v=>{
                // Açı değiştiğinde uzunluk sabit kalır, uzaklık güncellenir
                up({boomAngle:clamp(v,0,85)});
              }} min={0} max={85}/></Row>
              <Sli value={cfg.boomAngle} min={0} max={85} onChange={v=>up({boomAngle:v})} color={C.greenLight}/>
              <Row><Lbl>Jib Aktif</Lbl><input type="checkbox" checked={cfg.jibEnabled} onChange={e=>up({jibEnabled:e.target.checked})} style={{width:18,height:18,cursor:"pointer"}}/></Row>
              {cfg.jibEnabled&&(<>
                <Row><Lbl>Jib Uzunluk (m)</Lbl><Num value={cfg.jibLength} onChange={v=>up({jibLength:v})} min={2} max={100}/></Row>
                <Sli value={cfg.jibLength} min={2} max={100} onChange={v=>up({jibLength:v})} color={C.orange}/>
                <Row><Lbl>Jib Açı (°)</Lbl><Num value={cfg.jibAngle} onChange={v=>up({jibAngle:v})} min={0} max={cfg.boomAngle}/></Row>
                <Sli value={cfg.jibAngle} min={0} max={cfg.boomAngle} onChange={v=>up({jibAngle:v})} color={C.orange}/>
              </>)}
            </Card>

            {/* Yük — kritik bilgi */}
            <Card>
              <Title>Yük Bilgileri</Title>
              <Row><Lbl>Yük Ağırlığı (t)</Lbl><Num value={cfg.loadWeight} onChange={v=>up({loadWeight:v})} min={0} max={999} step={0.5}/></Row>
              <Row><Lbl>Rüzgar (km/h)</Lbl><Num value={cfg.windSpeed} onChange={v=>up({windSpeed:v})} min={0} max={100}/></Row>
            </Card>


            {/* Vinç Bul butonu */}
            <div style={{marginTop:8}}>
              <Btn onClick={()=>setTab("cranefinder")} color={C.yellow} style={{width:"100%",padding:12,fontSize:12,color:"#000",fontWeight:800}}>🔍 Vinç Bul</Btn>
            </div>
              {/* Crane geometry — auto from crane type, read-only display */}
          </div>

          {/* CENTER: CANVAS */}
          <div style={{flex:1,position:"relative"}}>
            <RangeChart cfg={cfg} crane={crane} skin={skin} objects={objects} selObj={selObj} setSelObj={setSelObj} rulers={rulers} setRulers={setRulers} tool={tool} setTool={setTool} addObj={addObj} updObj={updObj} delObj={delObj} isMobile={isMobile} craneColors={craneColors} setDragTarget={setDragTarget} onCfgUpdate={handleCfgUpdate} finalCap={cap} derating={combinedDerating} capSource={capSource} chartMismatch={chartMismatch}/>
            {/* Drag hint */}
            {dragTarget==="boomTip"&&<div style={{position:"absolute",top:10,left:"50%",transform:"translateX(-50%)",background:C.yellow+"DD",color:C.greenDark,padding:"4px 12px",borderRadius:20,fontSize:10,fontWeight:700,fontFamily:F,pointerEvents:"none"}}>Boom ucu sürükleniyor — bırak için bırak</div>}
            {/* Tool bar */}
            <div style={{position:"absolute",bottom:30,left:"50%",transform:"translateX(-50%)",display:"flex",gap:4,background:C.dark+"E0",borderRadius:8,padding:4,border:`1px solid ${C.green}30`}}>
              <Btn small onClick={()=>setTool("select")} color={tool==="select"?C.yellow:C.g500}>Seç</Btn>
              <Btn small onClick={()=>setTool("ruler")} color={tool==="ruler"?C.cyan:C.g500}>📏 Cetvel</Btn>
              <Btn small onClick={()=>setShowObjPanel(!showObjPanel)} color={showObjPanel?C.orange:C.g500}>📦 Nesne</Btn>
              {rulers.length>0&&<Btn small onClick={()=>{if(window.confirm("Tüm cetveller silinecek. Emin misiniz?"))setRulers([]);}} color={C.red}>🗑 Cetvelleri Sil</Btn>}
            </div>
            {/* Object panel overlay */}
            {showObjPanel&&<div style={{position:"absolute",bottom:70,left:"50%",transform:"translateX(-50%)",background:C.dark+"F0",borderRadius:10,padding:12,border:`1px solid ${C.green}30`,maxWidth:500}}>
              <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                {OBJ_TYPES.map(o=><button key={o.id} onClick={()=>{addObj(o.id);setShowObjPanel(false);}} style={{padding:"5px 10px",background:C.green+"20",border:`1px solid ${C.green}30`,borderRadius:6,color:C.g200,fontSize:9,cursor:"pointer",fontFamily:F}}>+{o.name}</button>)}
              </div>
            </div>}
          </div>

          {/* RIGHT PANEL */}
          <div style={{width:280,overflow:"auto",padding:12,background:C.dark+"80",borderLeft:`1px solid ${C.green}15`}}>
            {/* Objects list */}
            <Card>
              <Title>Nesneler ({objects.length})</Title>
              <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                {OBJ_TYPES.slice(0,8).map(o=><button key={o.id} onClick={()=>addObj(o.id)} style={{padding:"3px 8px",background:C.green+"20",border:`1px solid ${C.green}30`,borderRadius:6,color:C.g200,fontSize:9,cursor:"pointer"}}>+{o.name}</button>)}
              </div>
              {/* Selected object controls */}
              {selObjData&&(
                <div style={{marginTop:8,padding:8,background:C.dark,borderRadius:6,border:`1px solid ${C.yellow}30`}}>
                  <Row><input value={selObjData.name} onChange={e=>updObj(selObj,{name:e.target.value})} style={{background:"transparent",border:"none",color:C.yellow,fontSize:10,fontWeight:700,fontFamily:F,width:"100%"}}/></Row>
                  <Row><Lbl>Genişlik</Lbl><Num value={selObjData.w} onChange={v=>updObj(selObj,{w:v})} min={0.1} max={100} step={0.1}/></Row>
                  <Row><Lbl>Yükseklik</Lbl><Num value={selObjData.h} onChange={v=>updObj(selObj,{h:v})} min={0.1} max={100} step={0.1}/></Row>
                  <Row><Lbl>Mesafe (Slew)</Lbl><Num value={selObjData.x} onChange={v=>updObj(selObj,{x:v})} min={-20} max={100} step={0.5}/></Row>
                  <Row><Lbl>Yükselt</Lbl><Num value={selObjData.elevate||0} onChange={v=>updObj(selObj,{elevate:v})} min={0} max={50} step={0.5}/></Row>
                  <Row><Lbl>Döndür</Lbl><Num value={selObjData.rotation||0} onChange={v=>updObj(selObj,{rotation:v})} min={-180} max={180} step={5}/></Row>
                  <Row><Lbl>Renk</Lbl><input type="color" value={selObjData.color||"#6B7E70"} onChange={e=>updObj(selObj,{color:e.target.value})} style={{width:30,height:20,border:"none",borderRadius:3}}/></Row>
                  <Row>
                    <label style={{fontSize:9,color:C.g300,display:"flex",alignItems:"center",gap:3}}>
                      <input type="checkbox" checked={selObjData.showTop||false} onChange={e=>updObj(selObj,{showTop:e.target.checked})}/> Üst Çizgide Göster
                    </label>
                  </Row>
                  <Row>
                    <label style={{fontSize:9,color:C.g300,display:"flex",alignItems:"center",gap:3}}>
                      <input type="checkbox" checked={selObjData.showSlew||false} onChange={e=>updObj(selObj,{showSlew:e.target.checked})}/> Mesafe Çizgisinde Göster
                    </label>
                  </Row>
                  <div style={{display:"flex",gap:3,marginTop:6}}>
                    <Btn small onClick={()=>cpObj(selObj)} color={C.cyan}>Kopya</Btn>
                    <Btn small onClick={()=>moveLayer(selObj,"up")} color={C.g500}>▲</Btn>
                    <Btn small onClick={()=>moveLayer(selObj,"down")} color={C.g500}>▼</Btn>
                    {OBJ_TYPES.find(o=>o.id===selObjData.type)?.canFlip&&<Btn small onClick={()=>updObj(selObj,{flipped:!selObjData.flipped})} color={C.g500}>↔ Çevir</Btn>}
                    <Btn small onClick={()=>delObj(selObj)} color={C.red}>Sil</Btn>
                  </div>
                </div>
              )}
            </Card>


            {/* Yük & Sapan Görseli */}
            <Card>
              <Title>Yük & Sapan Görseli</Title>
              <Row><Lbl>Yük Şekli</Lbl></Row>
              <Sel value={cfg.loadShape} onChange={v=>up({loadShape:v})}>{LOAD_SHAPES.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</Sel>
              <Row style={{marginTop:6}}><Lbl>Sapan Tipi</Lbl></Row>
              <Sel value={cfg.slingType} onChange={v=>{const st=SLING_TYPES.find(s=>s.id===v);up({slingType:v,slingLegs:st?.legs||2});}}>{SLING_TYPES.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</Sel>
              <Row style={{marginTop:6}}><Lbl>Yük Gen. (m)</Lbl><Num value={cfg.loadW} onChange={v=>up({loadW:v})} min={0.5} max={20} step={0.5}/></Row>
              <Row><Lbl>Yük Yük. (m)</Lbl><Num value={cfg.loadH} onChange={v=>up({loadH:v})} min={0.5} max={20} step={0.5}/></Row>
              <Row><Lbl>Sapan Uz. (m)</Lbl><Num value={cfg.slingLength} onChange={v=>up({slingLength:v})} min={1} max={20} step={0.5}/></Row>
              <Row><Lbl>Kanca Blok H (m)</Lbl><Num value={cfg.hookBlockH} onChange={v=>up({hookBlockH:v})} min={0.3} max={3} step={0.1}/></Row>
              {cfg.slingLegs>=2&&(()=>{
                const ang=calcSlingAngle(cfg.slingLength,cfg.loadW,cfg.slingLegs);
                return<div style={{marginTop:6,padding:6,borderRadius:4,background:ang>45?C.red+"20":ang>30?C.yellow+"20":C.greenLight+"20"}}>
                  <span style={{fontSize:9,color:ang>45?C.red:ang>30?C.yellow:C.greenLight,fontWeight:700}}>Sapan Açısı: {ang.toFixed(1)}° — Kuvvet ×{(1/Math.cos(toRad(ang))).toFixed(2)}</span>
                </div>;
              })()}
            </Card>
          </div>
        </div>
        )
      )}

      {/* ═══ CRANE FINDER TAB ═══ */}
      {tab==="cranefinder"&&(
        <div style={{maxWidth:900,margin:"0 auto",padding:20}}>
          <Card>
            <Title>Vinç Bul — Mevcut Konfigürasyona Göre</Title>
            <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr 1fr",gap:12,marginBottom:16,padding:12,background:C.dark,borderRadius:8,border:`1px solid ${C.green}20`}}>
              <div><div style={{fontSize:9,color:C.g500}}>Vinç Tipi</div><div style={{fontSize:13,fontWeight:700,color:C.yellow,fontFamily:F}}>{crane?.name||"—"}</div></div>
              <div><div style={{fontSize:9,color:C.g500}}>Boom</div><div style={{fontSize:13,fontWeight:700,color:C.g200,fontFamily:F}}>{cfg.boomLength}m @ {cfg.boomAngle}°</div></div>
              <div><div style={{fontSize:9,color:C.g500}}>Menzil / Uç Yükseklik</div><div style={{fontSize:13,fontWeight:700,color:C.cyan,fontFamily:F}}>{realRadius.toFixed(1)}m / {realBoomTipH.toFixed(1)}m</div></div>
              <div><div style={{fontSize:9,color:C.g500}}>Yük Ağırlığı</div><div style={{fontSize:13,fontWeight:700,color:C.orange,fontFamily:F}}>{cfg.loadWeight}t</div></div>
              {cfg.jibEnabled&&<div><div style={{fontSize:9,color:C.g500}}>Jib</div><div style={{fontSize:13,fontWeight:700,color:C.orange,fontFamily:F}}>{cfg.jibLength}m @ {cfg.jibAngle}°</div></div>}
              <div><div style={{fontSize:9,color:C.g500}}>Kanca Yüksekliği</div><div style={{fontSize:13,fontWeight:700,color:C.greenLight,fontFamily:F}}>{realHookH.toFixed(1)}m</div></div>
            </div>
          </Card>

          {/* Fleet crane results */}
          <Card>
            <Title>Filo Vinçleriniz</Title>
            {fleetLoading?<div style={{textAlign:"center",padding:20,color:C.g400}}>Yükleniyor...</div>:
            fleetCranes.length===0?<div style={{textAlign:"center",padding:20}}>
              <div style={{color:C.g400,marginBottom:8}}>Henüz filo vinci eklenmemiş.</div>
              <Btn onClick={()=>setTab("cranes")} color={C.yellow} style={{color:"#000"}}>Vinç Yönetimi'ne Git</Btn>
            </div>:
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {fleetCranes.map(fc=>{
                const cfgs=fc.configs||[];
                return <div key={fc.id} style={{background:C.dark,borderRadius:8,border:`1px solid ${C.green}20`,overflow:"hidden"}}>
                  <div style={{padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <div style={{fontSize:13,fontWeight:700,color:C.yellow,fontFamily:F}}>{fc.name}</div>
                      <div style={{fontSize:10,color:C.g400}}>{fc.manufacturer||""} {fc.crane_type||""} {fc.max_capacity?`· ${fc.max_capacity}t`:""}</div>
                    </div>
                    <div style={{fontSize:10,color:C.g500}}>{cfgs.length} konfig</div>
                  </div>
                  {cfgs.length>0&&<div style={{borderTop:`1px solid ${C.green}15`,padding:"6px 14px"}}>
                    {cfgs.map(cf=>{
                      const chartData=cf.load_chart_id&&allCharts[cf.load_chart_id]?allCharts[cf.load_chart_id]:null;
                      const cfCap=chartData?lookupChart(chartData,cfg.boomLength,realRadius):null;
                      const canLift=cfCap!==null&&cfCap>=cfg.loadWeight;
                      const isExpanded=finderExpandedCfg===cf.id;
                      const veh=cf.transport_vehicles||[];
                      const totV=veh.reduce((s,v)=>s+(v.count||0),0);
                      return <div key={cf.id} style={{marginBottom:4}}>
                        {/* Konfigürasyon başlık satırı — tıklanabilir */}
                        <div onClick={()=>setFinderExpandedCfg(isExpanded?null:cf.id)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${C.green}10`,cursor:"pointer",userSelect:"none"}}>
                          <div style={{flex:1}}>
                            <div style={{fontSize:11,fontWeight:600,color:C.g200}}>{isExpanded?"▾":"▸"} {cf.name}</div>
                            <div style={{fontSize:9,color:C.g500,marginLeft:14}}>{cf.counterweight?`CW: ${cf.counterweight}`:""} {cf.outrigger_config?`· Outrigger: ${cf.outrigger_config}`:""}</div>
                          </div>
                          <div style={{textAlign:"right",flexShrink:0}}>
                            {cfCap!==null?
                              <div style={{fontSize:12,fontWeight:700,color:canLift?C.greenLight:C.red,fontFamily:F}}>
                                {canLift?"✅":"❌"} {cfCap.toFixed(1)}t
                              </div>:
                              <div style={{fontSize:10,color:C.g500}}>Yük tablosu yok</div>
                            }
                            {cfCap!==null&&<div style={{fontSize:9,color:canLift?C.greenLight:C.red}}>
                              {canLift?`${cfg.loadWeight}t kaldırılabilir`:`${cfg.loadWeight}t kaldırılamaz`}
                            </div>}
                          </div>
                        </div>
                        {/* Accordion detay */}
                        {isExpanded&&<div style={{padding:"10px 12px",marginTop:2,marginBottom:6,background:C.greenBg,borderRadius:8,border:`1px solid ${C.green}15`}}>
                          {/* Boom tipi & max boom */}
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                            <div>
                              <div style={{fontSize:8,fontWeight:700,color:C.g500,textTransform:"uppercase",letterSpacing:1,marginBottom:2}}>Boom Tipi</div>
                              <div style={{fontSize:11,color:C.g200,fontFamily:F}}>{cf.boom_type==="lattice"?"Kafes":"Teleskopik"}</div>
                            </div>
                            <div>
                              <div style={{fontSize:8,fontWeight:700,color:C.g500,textTransform:"uppercase",letterSpacing:1,marginBottom:2}}>Max Boom</div>
                              <div style={{fontSize:11,color:C.g200,fontFamily:F}}>{cf.max_boom?cf.max_boom+"m":"—"}</div>
                            </div>
                          </div>
                          {/* Yük tablosu */}
                          <div style={{marginBottom:8}}>
                            <div style={{fontSize:8,fontWeight:700,color:C.g500,textTransform:"uppercase",letterSpacing:1,marginBottom:2}}>Yük Tablosu</div>
                            {chartData?
                              <div style={{fontSize:11,color:C.greenLight,fontWeight:600}}>📊 {chartData.name} ({chartData.maxCap}t / max {chartData.maxBoom}m)</div>:
                              <div style={{fontSize:10,color:C.g500,fontStyle:"italic"}}>Bağlı yük tablosu yok</div>
                            }
                          </div>
                          {/* Nakliye araçları */}
                          <div style={{marginBottom:cf.description?8:0}}>
                            <div style={{fontSize:8,fontWeight:700,color:C.g500,textTransform:"uppercase",letterSpacing:1,marginBottom:2}}>Nakliye Araçları</div>
                            {veh.length>0?<div style={{padding:"6px 8px",background:C.dark,borderRadius:6,border:`1px solid ${C.g500}15`}}>
                              <div style={{fontSize:9,fontWeight:700,color:C.g400,marginBottom:3}}>Toplam: {totV} araç</div>
                              {veh.map((v,vi)=>{
                                const ic=({lowbed:"🚛",salkasa:"🚚",other:"📦"})[v.type]||"📦";
                                const nl=({lowbed:"Lowbed",salkasa:"Salkasa",other:"Diğer"})[v.type]||v.type;
                                return <div key={vi} style={{display:"flex",alignItems:"center",gap:5,fontSize:10,color:C.white,marginBottom:1}}>
                                  <span>{ic}</span><span style={{fontWeight:600,color:C.yellow,minWidth:20,textAlign:"center"}}>{v.count}×</span><span>{nl}</span>
                                  {v.notes&&<span style={{color:C.g500,fontSize:8}}>— {v.notes}</span>}
                                </div>;
                              })}
                            </div>:<div style={{fontSize:10,color:C.g500,fontStyle:"italic"}}>Nakliye aracı tanımlanmamış</div>}
                          </div>
                          {/* Açıklama */}
                          {cf.description&&<div>
                            <div style={{fontSize:8,fontWeight:700,color:C.g500,textTransform:"uppercase",letterSpacing:1,marginBottom:2}}>Açıklama</div>
                            <div style={{fontSize:10,color:C.g300,lineHeight:1.4}}>{cf.description}</div>
                          </div>}
                        </div>}
                      </div>;
                    })}
                  </div>}
                </div>;
              })}
            </div>}
          </Card>
          <div style={{marginTop:12}}>
            <Btn onClick={()=>setTab("chart")} color={C.green} style={{width:"100%",padding:12,fontSize:12}}>← Menzil Şemasına Dön</Btn>
          </div>
        </div>
      )}

      {/* ═══ LIFT PLAN TAB ═══ */}
      {tab==="liftplan"&&(
        <div style={{maxWidth:800,margin:"0 auto",padding:20}}>
          <Card><Title>Vinç Tedarikçisi</Title>
            {[["supplier","Şirket Adı","Vinç firması adı"],["supplierAddr","Şirket Adresi","Adres"],["supplierContact","İletişim Adı","İlgili kişi"],["supplierPhone","Telefon","0xxx xxx xx xx"],["supplierEmail","E-posta","email@firma.com"]].map(([k,l,ph])=>(
              <Row key={k}><Lbl>{l}</Lbl><input value={lp[k]} onChange={e=>upLP(k,e.target.value)} placeholder={ph} style={{flex:1,background:C.dark,border:`1px solid ${C.green}30`,borderRadius:4,color:C.white,padding:"4px 8px",fontSize:10,fontFamily:F}}/></Row>
            ))}
          </Card>
          <Card><Title>Müşteri</Title>
            {[["client","Şirket Adı","Müşteri firma adı"],["clientAddr","Şirket Adresi","Adres"],["clientContact","İletişim Adı","İlgili kişi"],["clientPhone","Telefon","0xxx xxx xx xx"],["clientEmail","E-posta","email@firma.com"]].map(([k,l,ph])=>(
              <Row key={k}><Lbl>{l}</Lbl><input value={lp[k]} onChange={e=>upLP(k,e.target.value)} placeholder={ph} style={{flex:1,background:C.dark,border:`1px solid ${C.green}30`,borderRadius:4,color:C.white,padding:"4px 8px",fontSize:10,fontFamily:F}}/></Row>
            ))}
          </Card>
          <Card><Title>İş Detayları</Title>
            {[["jobNumber","Referans Numarası","İş ref. no"],["jobName","Proje Adı","Proje adı"],["jobAddress","Proje Adresi","Proje adresi"],["jobDate","İş Tarihi",""]].map(([k,l,ph])=>(
              <Row key={k}><Lbl>{l}</Lbl><input value={lp[k]} onChange={e=>upLP(k,e.target.value)} placeholder={ph} type={k==="jobDate"?"date":"text"} style={{flex:1,background:C.dark,border:`1px solid ${C.green}30`,borderRadius:4,color:C.white,padding:"4px 8px",fontSize:10,fontFamily:F}}/></Row>
            ))}
            <div style={{borderTop:`1px solid ${C.green}15`,marginTop:8,paddingTop:8}}>
            {[["craneMake","Vinç","Marka model"],["craneModel","Kapasite","Vinç kapasitesi"],["craneRego","Plaka/Seri No","Plaka veya seri no"]].map(([k,l,ph])=>(
              <Row key={k}><Lbl>{l}</Lbl><input value={lp[k]} onChange={e=>upLP(k,e.target.value)} placeholder={ph} style={{flex:1,background:C.dark,border:`1px solid ${C.green}30`,borderRadius:4,color:C.white,padding:"4px 8px",fontSize:10,fontFamily:F}}/></Row>
            ))}
            </div>
          </Card>
          <Card><Title>Halat ve Denge Ağırlığı</Title>
            <Row><Lbl>Hat Çekme</Lbl><Num value={lp.linePull} onChange={v=>upLP("linePull",v)} min={0} max={100} step={0.1}/></Row>
            <Row><Lbl>Hattın Parçaları</Lbl><Num value={lp.partsOfLine} onChange={v=>upLP("partsOfLine",v)} min={1} max={16}/></Row>
            <Row><Lbl>Denge Ağırlığı Konfig.</Lbl><input value={lp.cwConfig} onChange={e=>upLP("cwConfig",e.target.value)} placeholder="ör: 40t tam" style={{flex:1,background:C.dark,border:`1px solid ${C.green}30`,borderRadius:4,color:C.white,padding:"4px 8px",fontSize:10,fontFamily:F}}/></Row>
          </Card>
          <Card><Title>Yük Detayları</Title>
            <Row><Lbl>Açıklama</Lbl></Row>
            <textarea value={lp.loadDesc} onChange={e=>upLP("loadDesc",e.target.value)} rows={2} placeholder="Yük tanımı (ör: çelik kolon, jeneratör...)" style={{width:"100%",background:C.dark,border:`1px solid ${C.green}30`,borderRadius:4,color:C.white,padding:"6px 8px",fontSize:10,fontFamily:F,marginBottom:8,boxSizing:"border-box",resize:"vertical"}}/>
            <Row><Lbl>Yük Ağırlığı (t)</Lbl><Num value={lp.loadWeight} onChange={v=>upLP("loadWeight",v)} min={0} max={999} step={0.1}/></Row>
            <Row><Lbl>Donanım Ağırlığı (t)</Lbl><Num value={lp.riggingWeight} onChange={v=>upLP("riggingWeight",v)} min={0} max={50} step={0.1}/></Row>
            <Row><Lbl>Kanca Ağırlığı (t)</Lbl><Num value={lp.hookBlockWeight} onChange={v=>upLP("hookBlockWeight",v)} min={0} max={20} step={0.1}/></Row>
            <Row><Lbl>Ek Ağırlık (t)</Lbl><Num value={lp.addWeight} onChange={v=>upLP("addWeight",v)} min={0} max={50} step={0.1}/></Row>
            <div style={{padding:8,background:C.yellow+"15",borderRadius:6,marginTop:8}}>
              <Row><span style={{fontSize:11,fontWeight:700,color:C.yellow}}>Toplam Ağırlık</span><span style={{fontSize:11,fontWeight:700,color:C.yellow}}>{totalW.toFixed(1)}t</span></Row>
            </div>
          </Card>
          <Card><Title>Çalışma Yükü Sınırı (WLL)</Title>
            <Row><Lbl>Vinç Çalışma Yük Sınırı</Lbl><Num value={lp.wll} onChange={v=>upLP("wll",v)} min={0} max={999} step={0.1}/></Row>
            {(()=>{
              const wllPct=lp.wll>0?(totalW/lp.wll*100):0;
              const barColor=wllPct>100?C.red:wllPct>90?C.yellow:C.greenLight;
              return <>
                <Row><Lbl>Vincin çalıştığı çizelge %'si</Lbl><span style={{fontSize:11,fontWeight:700,color:barColor}}>{wllPct.toFixed(0)}%</span></Row>
                <div style={{position:"relative",height:18,background:C.dark,borderRadius:4,marginTop:6,overflow:"hidden",border:`1px solid ${C.green}20`}}>
                  <div style={{position:"absolute",left:0,top:0,bottom:0,width:Math.min(wllPct/130*100,100)+"%",background:barColor,opacity:0.4,borderRadius:3,transition:"width 0.3s"}}/>
                  {[0,90,100,130].map(v=>{
                    const pos=v/130*100;
                    return <div key={v} style={{position:"absolute",left:pos+"%",top:0,bottom:0,width:1,background:v===100?C.white+"60":C.g500+"40"}}/>
                  })}
                  <div style={{position:"absolute",bottom:0,left:0,right:0,display:"flex",justifyContent:"space-between",padding:"0 2px"}}>
                    {[0,90,100,130].map(v=><span key={v} style={{fontSize:7,color:C.g400,fontFamily:F}}>{v}</span>)}
                  </div>
                </div>
              </>
            })()}
          </Card>
          <Card><Title>Vinç Konfigürasyonu</Title>
            <div style={{opacity:0.85}}>
            {[
              ["Bom Uzunluğu",fmtTR(cfg.boomLength)+"m"],
              ["Bom Açısı",fmtTR(cfg.boomAngle)+"°"],
              ...(cfg.jibEnabled?[["Pergel Uzunluğu",fmtTR(cfg.jibLength)+"m"],["Pergel Ofseti",fmtTR(cfg.jibAngle)+"°"]]:[]),
              ["Kaldırma Yüksekliği",fmtTR(realBoomTipH)+"m"],
              ["Yarıçap",fmtTR(realRadius,1)+"m"],
            ].map(([k,v])=>(
              <Row key={k}><Lbl>{k}</Lbl><span style={{fontSize:11,fontWeight:600,color:C.cyan,fontFamily:F}}>{v}</span></Row>
            ))}
            </div>
          </Card>
          <Card><Title>Tekil Yük</Title>
            <Row><Lbl>Ped Şekli</Lbl>
              <div style={{display:"flex",gap:8}}>
                {["square","round"].map(s=>(
                  <label key={s} style={{display:"flex",alignItems:"center",gap:4,cursor:"pointer",fontSize:10,color:lp.padShape===s?C.cyan:C.g400}}>
                    <input type="radio" name="padShape" checked={lp.padShape===s} onChange={()=>upLP("padShape",s)} style={{accentColor:C.cyan}}/>
                    {s==="square"?"Kare":"Yuvarlak"}
                  </label>
                ))}
              </div>
            </Row>
            <Row><Lbl>Uskundra Gücü (t)</Lbl><Num value={lp.outForce} onChange={v=>upLP("outForce",v)} min={0} max={500} step={0.1}/></Row>
            <Row><Lbl>Uskundra Ped Boyutu</Lbl>
              <div style={{display:"flex",alignItems:"center",gap:4}}>
                <Num value={lp.padW} onChange={v=>upLP("padW",v)} min={0.1} max={10} step={0.1}/>
                <span style={{fontSize:10,color:C.g400}}>×</span>
                <Num value={lp.padL} onChange={v=>upLP("padL",v)} min={0.1} max={10} step={0.1}/>
              </div>
            </Row>
            {(()=>{
              const padArea=lp.padShape==="round"?Math.PI*(lp.padW/2)*(lp.padL/2):lp.padW*lp.padL;
              const tpm2=padArea>0?lp.outForce/padArea:0;
              const kpa=tpm2*9.81;
              return <>
                <Row><Lbl>Uskundra Ped Alanı</Lbl><span style={{fontSize:10,color:C.cyan,fontWeight:600}}>{padArea.toFixed(2)}m²</span></Row>
                <Row><Lbl>Tekil Yük</Lbl><span style={{fontSize:10,fontWeight:600}}><span style={{color:C.cyan}}>{tpm2.toFixed(1)}Tpm²</span> <span style={{color:C.g400,marginLeft:8}}>{kpa.toFixed(1)}Kpa</span></span></Row>
              </>
            })()}
          </Card>
          <Card><Title>Notlar</Title>
            <textarea value={lp.notes} onChange={e=>upLP("notes",e.target.value)} rows={3} placeholder="Ek notlar, özel koşullar..." style={{width:"100%",background:C.dark,border:`1px solid ${C.green}30`,borderRadius:6,color:C.white,padding:"8px",fontSize:10,fontFamily:F,resize:"vertical",boxSizing:"border-box"}}/>
          </Card>
          <Btn onClick={()=>setShowPDF(true)} color={C.yellow} style={{width:"100%",padding:12,fontSize:12}}>📋 Kaldırma Planı Önizle</Btn>
        </div>
      )}

      {/* ═══ CALCULATIONS TAB (Crangle style — all on one page) ═══ */}
      {tab==="calc"&&(
        <div style={{maxWidth:600,margin:"0 auto",padding:20}}>

          {/* ─── Çizelge Yüzdesi ─── */}
          <div style={{borderTop:`2px solid ${C.cyan}`,paddingTop:16,marginBottom:24}}>
            <div style={{textAlign:"center",marginBottom:16,position:"relative"}}>
              <span style={{fontSize:16,fontWeight:700,color:C.cyan}}>Çizelge Yüzdesi</span>
              <div style={{position:"absolute",right:0,top:-2,width:24,height:24,borderRadius:12,background:"#e67e22",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}} title="Yüzde kaçı: Toplam yükün (yük + donanım) çalışma yükü sınırına (WLL) oranını hesaplar."><span style={{color:"#fff",fontWeight:700,fontSize:13}}>?</span></div>
            </div>
            <div style={{textAlign:"center",fontSize:10,color:C.g400,marginBottom:10}}>Yüzde kaçı</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:12}}>
              <div style={{textAlign:"center"}}><Num value={ci.load} onChange={v=>upCI("load",v)} min={0} max={999} step={0.1}/><div style={{fontSize:9,color:C.g500,marginTop:3}}>Yük + Donanım</div></div>
              <div style={{textAlign:"center"}}><Num value={ci.wll} onChange={v=>upCI("wll",v)} min={0} max={999} step={0.1}/><div style={{fontSize:9,color:C.g500,marginTop:3}}>Çalışma Yükü Sınırı (WLL)</div></div>
            </div>
            <div style={{position:"relative",height:24,background:C.dark,borderRadius:4,overflow:"hidden",border:`1px solid ${C.green}20`,marginBottom:12}}>
              <div style={{position:"absolute",left:0,top:0,bottom:0,width:Math.min(pctCalc/130*100,100)+"%",background:pctCalc>100?"#e74c3c":pctCalc>90?"#f39c12":"#27ae60",opacity:0.5,borderRadius:3,transition:"width 0.3s"}}/>
              {[0,90,100,130].map(v=><div key={v} style={{position:"absolute",left:(v/130*100)+"%",top:0,bottom:0,width:v===100?2:1,background:v===100?C.white+"50":C.g500+"30"}}/>)}
              <div style={{position:"absolute",bottom:1,left:0,right:0,display:"flex",justifyContent:"space-between",padding:"0 4px"}}>
                {[0,90,100,130].map(v=><span key={v} style={{fontSize:8,color:C.g400}}>{v}</span>)}
              </div>
            </div>
            <div style={{textAlign:"center",padding:12,background:"#27ae60",borderRadius:8}}>
              <span style={{fontSize:32,fontWeight:900,color:"#fff",fontFamily:F}}>{pctCalc.toFixed(0)}</span>
            </div>
            <div style={{textAlign:"center",fontSize:10,color:C.g400,marginTop:4}}>Çizelgenin %'si</div>
          </div>

          {/* ─── Maksimum Yük ─── */}
          <div style={{borderTop:`2px solid ${C.cyan}`,paddingTop:16,marginBottom:24}}>
            <div style={{textAlign:"center",marginBottom:16,position:"relative"}}>
              <span style={{fontSize:16,fontWeight:700,color:C.cyan}}>Maksimum Yük</span>
              <div style={{position:"absolute",right:0,top:-2,width:24,height:24,borderRadius:12,background:"#e67e22",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}} title="Belirli bir WLL ve yüzde sınırı için taşınabilecek maksimum yükü hesaplar."><span style={{color:"#fff",fontWeight:700,fontSize:13}}>?</span></div>
            </div>
            <Row><Lbl>Aşılmamalıdır %</Lbl><Num value={ci.pct} onChange={v=>upCI("pct",v)} min={1} max={130}/></Row>
            <Row><Lbl>Çalışma Yükü Sınırı (WLL)</Lbl><Num value={ci.wll} onChange={v=>upCI("wll",v)} min={0} max={999} step={0.1}/></Row>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:12}}>
              <span style={{fontSize:11,color:C.g300}}>Maksimum Yük + Donanım</span>
              <div style={{padding:"8px 20px",background:"#27ae60",borderRadius:8}}>
                <span style={{fontSize:24,fontWeight:900,color:"#fff",fontFamily:F}}>{maxLoadCalc.toFixed(1)}</span>
              </div>
            </div>
          </div>

          {/* ─── Min Çalışma Yükü Sınırı (WLL) ─── */}
          <div style={{borderTop:`2px solid ${C.cyan}`,paddingTop:16,marginBottom:24}}>
            <div style={{textAlign:"center",marginBottom:16,position:"relative"}}>
              <span style={{fontSize:16,fontWeight:700,color:C.cyan}}>Min Çalışma Yükü Sınırı (WLL)</span>
              <div style={{position:"absolute",right:0,top:-2,width:24,height:24,borderRadius:12,background:"#e67e22",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}} title="Belirli bir yük ve yüzde sınırı için gerekli minimum WLL'yi hesaplar."><span style={{color:"#fff",fontWeight:700,fontSize:13}}>?</span></div>
            </div>
            <Row><Lbl>Aşılmamalıdır %</Lbl><Num value={ci.pct} onChange={v=>upCI("pct",v)} min={1} max={130}/></Row>
            <Row><Lbl>Yük + Donanım</Lbl><Num value={ci.load} onChange={v=>upCI("load",v)} min={0} max={999} step={0.1}/></Row>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:12}}>
              <span style={{fontSize:11,color:C.g300}}>Minimum Çalışma Yükü Sınırı (WLL)</span>
              <div style={{padding:"8px 20px",background:"#27ae60",borderRadius:8}}>
                <span style={{fontSize:24,fontWeight:900,color:"#fff",fontFamily:F}}>{minWllCalc.toFixed(1)}</span>
              </div>
            </div>
          </div>

          {/* ─── Tekil Yük ─── */}
          <div style={{borderTop:`2px solid ${C.cyan}`,paddingTop:16,marginBottom:24}}>
            <div style={{textAlign:"center",marginBottom:16,position:"relative"}}>
              <span style={{fontSize:16,fontWeight:700,color:C.cyan}}>Tekil Yük</span>
              <div style={{position:"absolute",right:0,top:-2,width:24,height:24,borderRadius:12,background:"#e67e22",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}} title="Uskundra (outrigger) ped boyutuna göre zemin basıncını Tpm² ve Kpa olarak hesaplar."><span style={{color:"#fff",fontWeight:700,fontSize:13}}>?</span></div>
            </div>
            <Row><Lbl>Ped Şekli</Lbl>
              <div style={{display:"flex",gap:12}}>
                {[["square","Kare"],["round","Yuvarlak"]].map(([v,l])=>(
                  <label key={v} style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer",fontSize:11,color:ci.padShape===v?C.cyan:C.g400}} onClick={()=>upCI("padShape",v)}>
                    <div style={{width:22,height:22,borderRadius:4,border:`2px solid ${ci.padShape===v?C.cyan:C.g500}`,display:"flex",alignItems:"center",justifyContent:"center",background:ci.padShape===v?C.cyan+"20":"transparent"}}>
                      {ci.padShape===v&&<span style={{color:C.cyan,fontSize:14}}>✓</span>}
                    </div>
                    {l}
                  </label>
                ))}
              </div>
            </Row>
            <Row><Lbl>Uskundra Gücü</Lbl><div style={{display:"flex",alignItems:"center",gap:4}}><Num value={ci.outF} onChange={v=>upCI("outF",v)} min={0} max={500} step={0.5}/><span style={{fontSize:9,color:C.g500}}>T</span></div></Row>
            <Row><Lbl>Uskundra Ped Boyutu</Lbl>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <Num value={ci.padW} onChange={v=>upCI("padW",v)} min={0.1} max={10} step={0.1}/>
                <span style={{fontSize:11,color:C.g400}}>×</span>
                <Num value={ci.padL} onChange={v=>upCI("padL",v)} min={0.1} max={10} step={0.1}/>
              </div>
            </Row>
            {(()=>{
              const area=(ci.padShape||"square")==="round"?Math.PI*(ci.padW/2)*(ci.padL/2):ci.padW*ci.padL;
              const tpm2=area>0?ci.outF/area:0;
              const kpa=tpm2*9.81;
              return <>
                <Row><Lbl>Uskundra Ped Alanı</Lbl><div style={{padding:"4px 14px",border:`1px solid ${C.cyan}40`,borderRadius:6}}><span style={{fontSize:12,color:C.cyan,fontWeight:600,fontFamily:F}}>{area.toFixed(2)}m²</span></div></Row>
                <div style={{marginTop:12}}>
                  <div style={{fontSize:11,color:C.g400,marginBottom:8}}>Tekil Yük</div>
                  <div style={{display:"flex",gap:10,justifyContent:"center"}}>
                    <div style={{padding:"10px 20px",background:"#27ae60",borderRadius:8,textAlign:"center",flex:1}}>
                      <span style={{fontSize:22,fontWeight:900,color:"#fff",fontFamily:F}}>{tpm2.toFixed(1)}</span>
                      <span style={{fontSize:10,color:"rgba(255,255,255,0.75)",marginLeft:3}}>Tpm²</span>
                    </div>
                    <div style={{padding:"10px 20px",background:"#2980b9",borderRadius:8,textAlign:"center",flex:1}}>
                      <span style={{fontSize:22,fontWeight:900,color:"#fff",fontFamily:F}}>{kpa.toFixed(1)}</span>
                      <span style={{fontSize:10,color:"rgba(255,255,255,0.75)",marginLeft:3}}>Kpa</span>
                    </div>
                  </div>
                </div>
              </>
            })()}
          </div>

        </div>
      )}

      {/* ═══ CRANES MANAGEMENT TAB ═══ */}
      {tab==="cranes"&&(
        <div style={{maxWidth:800,margin:"0 auto",padding:isMobile?"12px 8px":"20px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div>
              <div style={{fontSize:18,fontWeight:800,color:C.yellow,letterSpacing:2}}>VİNÇ YÖNETİMİ</div>
              <div style={{fontSize:10,color:C.g400}}>Filo vinçleri · konfigürasyonlar · yük tabloları · nakliye</div>
            </div>
            <Btn onClick={()=>setFleetForm({name:"",manufacturer:"",crane_type:"mobile",max_capacity:"",serial_number:"",year_of_manufacture:"",notes:""})} color={C.green}>+ Vinç Ekle</Btn>
          </div>

          {fleetLoading&&<div style={{textAlign:"center",color:C.g400,padding:40}}>Yükleniyor...</div>}

          {!fleetLoading&&fleetCranes.length===0&&(
            <Card><div style={{textAlign:"center",padding:"30px 0"}}>
              <div style={{fontSize:40,marginBottom:8}}>🏗️</div>
              <div style={{fontSize:14,fontWeight:700,color:C.white,marginBottom:6}}>Henüz vinç eklenmemiş</div>
              <div style={{fontSize:11,color:C.g400,marginBottom:12}}>Filonuzdaki vinçleri ekleyin, her biri için konfigürasyon ve yük tablosu tanımlayın.</div>
              <Btn onClick={()=>setFleetForm({name:"",manufacturer:"",crane_type:"mobile",max_capacity:"",serial_number:"",year_of_manufacture:"",notes:""})} color={C.yellow} style={{color:"#000"}}>İlk Vincini Ekle</Btn>
            </div></Card>
          )}

          {/* Fleet crane list */}
          {fleetCranes.map(fc=>{
            const isExp=fleetExpanded===fc.id;
            const cfgs=fc.configs||[];
            const tl=({mobile:"Mobil",crawler:"Paletli",rough:"Arazi",truck:"Kamyon"})[fc.crane_type]||fc.crane_type;
            return(
              <div key={fc.id} style={{background:C.surface||"#132E1C",border:`1px solid ${isExp?C.green+"60":C.g500+"30"}`,borderRadius:12,marginBottom:10,overflow:"hidden"}}>
                {/* Crane header row */}
                <div onClick={()=>setFleetExpanded(isExp?null:fc.id)} style={{padding:"12px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:10,color:C.g400,transform:isExp?"rotate(90deg)":"none",transition:"transform 0.2s"}}>▶</span>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                      <span style={{fontSize:14,fontWeight:700,color:C.white}}>{fc.name}</span>
                      <span style={{fontSize:9,padding:"2px 8px",borderRadius:10,background:C.green+"20",color:C.greenLight}}>{tl}</span>
                      {fc.max_capacity&&<span style={{fontSize:12,fontWeight:800,color:C.yellow}}>{fc.max_capacity}t</span>}
                    </div>
                    <div style={{fontSize:10,color:C.g500,marginTop:2}}>
                      {fc.manufacturer||""}{fc.year_of_manufacture?` · ${fc.year_of_manufacture}`:""} · {cfgs.length} konfigürasyon
                    </div>
                  </div>
                  <div style={{display:"flex",gap:4}} onClick={e=>e.stopPropagation()}>
                    <button onClick={()=>setFleetForm(fc)} style={{padding:"4px 10px",background:C.g500+"30",color:C.g400,border:"none",borderRadius:6,fontSize:10,cursor:"pointer"}}>✏️</button>
                    <button onClick={()=>fleetDeleteCrane(fc.id)} style={{padding:"4px 10px",background:"#EF444415",color:"#EF4444",border:"none",borderRadius:6,fontSize:10,cursor:"pointer"}}>🗑️</button>
                  </div>
                </div>

                {/* Expanded: configs */}
                {isExp&&(
                  <div style={{borderTop:`1px solid ${C.g500}25`,padding:"10px 14px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                      <span style={{fontSize:12,fontWeight:700,color:C.greenLight}}>Konfigürasyonlar</span>
                      <button onClick={()=>setCfgForm({craneId:fc.id,name:"",description:"",counterweight:"",boom_type:"telescopic",max_boom:"",max_capacity_at_config:"",outrigger_config:"full",load_chart_id:"",transport_vehicles:[]})} style={{padding:"4px 12px",background:C.yellow+"15",color:C.yellow,border:`1px solid ${C.yellow}30`,borderRadius:6,fontSize:10,fontWeight:600,cursor:"pointer"}}>+ Konfigürasyon Ekle</button>
                    </div>

                    {cfgs.length===0&&<div style={{textAlign:"center",padding:"16px 0",color:C.g500,fontSize:10}}>Henüz konfigürasyon yok.</div>}

                    {cfgs.map((cf,ci2)=>{
                      const veh=cf.transport_vehicles||[];
                      const totV=veh.reduce((s,v)=>s+(v.count||0),0);
                      const bLbl=({telescopic:"Teleskopik",lattice:"Kafes",luffing:"Luffing",fixed:"Sabit"})[cf.boom_type]||cf.boom_type;
                      const oLbl=({full:"100%","75":"75%","50":"50%","0":"Kapalı",on_tracks:"Palet üzeri"})[cf.outrigger_config]||cf.outrigger_config;
                      const lc=(fc._charts||[]).find(x=>x.id===cf.load_chart_id);
                      return(
                        <div key={cf.id} style={{padding:"10px 12px",background:C.dark+"AA",borderRadius:10,marginBottom:ci2<cfgs.length-1?8:0,border:`1px solid ${C.g500}20`}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                            <div>
                              <div style={{fontSize:12,fontWeight:700,color:C.yellow}}>{cf.name}</div>
                              {cf.description&&<div style={{fontSize:9,color:C.g400,marginTop:1}}>{cf.description}</div>}
                            </div>
                            <div style={{display:"flex",gap:4}}>
                              <button onClick={()=>setCfgForm({...cf,craneId:fc.id})} style={{padding:"3px 7px",background:C.g500+"25",color:C.g400,border:"none",borderRadius:5,fontSize:9,cursor:"pointer"}}>✏️</button>
                              <button onClick={()=>fleetDeleteConfig(cf.id)} style={{padding:"3px 7px",background:"#EF444412",color:"#EF4444",border:"none",borderRadius:5,fontSize:9,cursor:"pointer"}}>🗑️</button>
                            </div>
                          </div>
                          {/* Tags */}
                          <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:6}}>
                            {cf.counterweight&&<span style={{fontSize:8,padding:"2px 7px",borderRadius:7,background:"#FF6B3515",color:"#FF6B35",fontWeight:600}}>CW: {cf.counterweight}</span>}
                            <span style={{fontSize:8,padding:"2px 7px",borderRadius:7,background:C.greenLight+"15",color:C.greenLight,fontWeight:600}}>{bLbl}</span>
                            {cf.max_boom&&<span style={{fontSize:8,padding:"2px 7px",borderRadius:7,background:"#4FC3F715",color:"#4FC3F7",fontWeight:600}}>Boom: {cf.max_boom}m</span>}
                            {cf.max_capacity_at_config&&<span style={{fontSize:8,padding:"2px 7px",borderRadius:7,background:C.yellow+"15",color:C.yellow,fontWeight:600}}>Kap: {cf.max_capacity_at_config}t</span>}
                            <span style={{fontSize:8,padding:"2px 7px",borderRadius:7,background:"#AB47BC15",color:"#AB47BC",fontWeight:600}}>Ayak: {oLbl}</span>
                          </div>
                          {/* Load chart */}
                          <div style={{fontSize:9,color:C.g500,marginBottom:veh.length>0?4:0}}>
                            📊 Yük Tablosu: {lc?<span style={{color:C.greenLight,fontWeight:600}}>{lc.name} ({lc.max_capacity}t / {lc.max_boom}m)</span>:<span style={{fontStyle:"italic"}}>Bağlı değil</span>}
                          </div>
                          {/* Transport */}
                          {veh.length>0&&(
                            <div style={{marginTop:4,padding:"6px 8px",background:(C.surface||"#132E1C"),borderRadius:7,border:`1px solid ${C.g500}15`}}>
                              <div style={{fontSize:8,fontWeight:700,color:C.g400,marginBottom:3,textTransform:"uppercase",letterSpacing:1}}>Nakliye — {totV} araç</div>
                              {veh.map((v,vi)=>{
                                const ic=({lowbed:"🚛",salkasa:"🚚",other:"📦"})[v.type]||"📦";
                                const nl=({lowbed:"Lowbed",salkasa:"Salkasa",other:"Diğer"})[v.type]||v.type;
                                return <div key={vi} style={{display:"flex",alignItems:"center",gap:5,fontSize:10,color:C.white,marginBottom:1}}>
                                  <span>{ic}</span><span style={{fontWeight:600,color:C.yellow,minWidth:20,textAlign:"center"}}>{v.count}×</span><span>{nl}</span>
                                  {v.notes&&<span style={{color:C.g500,fontSize:8}}>— {v.notes}</span>}
                                </div>;
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* ═══ CRANE FORM MODAL ═══ */}
          {fleetForm&&(
            <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:16}} onClick={e=>{if(e.target===e.currentTarget)setFleetForm(null)}}>
              <div style={{background:C.surface||"#132E1C",borderRadius:16,padding:20,width:"100%",maxWidth:480,maxHeight:"90vh",overflowY:"auto",border:`1px solid ${C.green}30`}} onClick={e=>e.stopPropagation()}>
                <div style={{fontSize:16,fontWeight:800,color:C.yellow,marginBottom:14}}>{fleetForm.id?"✏️ Vinç Düzenle":"🏗️ Yeni Vinç Ekle"}</div>
                {[{k:"name",l:"Vinç Adı *",p:"LTM 1300-6.2"},{k:"manufacturer",l:"Üretici",p:"Liebherr"}].map(f=>
                  <div key={f.k} style={{marginBottom:10}}><label style={{display:"block",fontSize:9,fontWeight:700,color:C.g400,marginBottom:3,textTransform:"uppercase"}}>{f.l}</label>
                  <input value={fleetForm[f.k]||""} onChange={e=>setFleetForm(p=>({...p,[f.k]:e.target.value}))} placeholder={f.p} style={{width:"100%",padding:"7px 10px",background:C.dark,border:`1px solid ${C.g500}40`,borderRadius:8,color:C.white,fontSize:12,boxSizing:"border-box"}}/></div>
                )}
                <div style={{marginBottom:10}}><label style={{display:"block",fontSize:9,fontWeight:700,color:C.g400,marginBottom:3,textTransform:"uppercase"}}>Vinç Tipi</label>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                    {[["mobile","Mobil"],["crawler","Paletli"],["rough","Arazi"],["truck","Kamyon"]].map(([id,lb])=>
                      <button key={id} onClick={()=>setFleetForm(p=>({...p,crane_type:id}))} style={{padding:"5px 12px",borderRadius:7,border:`1px solid ${fleetForm.crane_type===id?C.yellow:C.g500}40`,background:fleetForm.crane_type===id?C.yellow+"15":"transparent",color:fleetForm.crane_type===id?C.yellow:C.g400,fontSize:11,cursor:"pointer",fontWeight:fleetForm.crane_type===id?700:400}}>{lb}</button>
                    )}
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                  {[{k:"max_capacity",l:"Maks Kapasite (t)",p:"300"},{k:"serial_number",l:"Seri No",p:"ABC-1234"},{k:"year_of_manufacture",l:"Üretim Yılı",p:"2019"}].map(f=>
                    <div key={f.k} style={{marginBottom:10}}><label style={{display:"block",fontSize:9,fontWeight:700,color:C.g400,marginBottom:3,textTransform:"uppercase"}}>{f.l}</label>
                    <input value={fleetForm[f.k]||""} onChange={e=>setFleetForm(p=>({...p,[f.k]:e.target.value}))} placeholder={f.p} style={{width:"100%",padding:"7px 10px",background:C.dark,border:`1px solid ${C.g500}40`,borderRadius:8,color:C.white,fontSize:12,boxSizing:"border-box"}}/></div>
                  )}
                </div>
                <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:14}}>
                  <button onClick={()=>setFleetForm(null)} style={{padding:"7px 18px",background:"transparent",color:C.g400,border:`1px solid ${C.g500}40`,borderRadius:8,fontSize:11,cursor:"pointer"}}>İptal</button>
                  <Btn onClick={()=>{if(!fleetForm.name?.trim())return alert("Vinç adı gerekli");fleetSaveCrane({...fleetForm,max_capacity:fleetForm.max_capacity?Number(fleetForm.max_capacity):null,year_of_manufacture:fleetForm.year_of_manufacture?Number(fleetForm.year_of_manufacture):null});}} color={C.green}>Kaydet</Btn>
                </div>
              </div>
            </div>
          )}

          {/* ═══ CONFIG FORM MODAL ═══ */}
          {cfgForm&&(
            <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:16}} onClick={e=>{if(e.target===e.currentTarget)setCfgForm(null)}}>
              <div style={{background:C.surface||"#132E1C",borderRadius:16,padding:20,width:"100%",maxWidth:540,maxHeight:"90vh",overflowY:"auto",border:`1px solid ${C.green}30`}} onClick={e=>e.stopPropagation()}>
                <div style={{fontSize:16,fontWeight:800,color:C.yellow,marginBottom:14}}>{cfgForm.id?"✏️ Konfigürasyon Düzenle":"⚙️ Yeni Konfigürasyon"}</div>
                {/* Name + desc */}
                {[{k:"name",l:"Konfigürasyon Adı *",p:"Teleskopik 87.5t CW — 84m boom"},{k:"description",l:"Açıklama",p:"Notlar..."}].map(f=>
                  <div key={f.k} style={{marginBottom:10}}><label style={{display:"block",fontSize:9,fontWeight:700,color:C.g400,marginBottom:3,textTransform:"uppercase"}}>{f.l}</label>
                  <input value={cfgForm[f.k]||""} onChange={e=>setCfgForm(p=>({...p,[f.k]:e.target.value}))} placeholder={f.p} style={{width:"100%",padding:"7px 10px",background:C.dark,border:`1px solid ${C.g500}40`,borderRadius:8,color:C.white,fontSize:12,boxSizing:"border-box"}}/></div>
                )}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  <div style={{marginBottom:10}}><label style={{display:"block",fontSize:9,fontWeight:700,color:C.g400,marginBottom:3,textTransform:"uppercase"}}>Counterweight</label>
                    <input value={cfgForm.counterweight||""} onChange={e=>setCfgForm(p=>({...p,counterweight:e.target.value}))} placeholder="87.5t" style={{width:"100%",padding:"7px 10px",background:C.dark,border:`1px solid ${C.g500}40`,borderRadius:8,color:C.white,fontSize:12,boxSizing:"border-box"}}/></div>
                  <div style={{marginBottom:10}}><label style={{display:"block",fontSize:9,fontWeight:700,color:C.g400,marginBottom:3,textTransform:"uppercase"}}>Boom Tipi</label>
                    <select value={cfgForm.boom_type||"telescopic"} onChange={e=>setCfgForm(p=>({...p,boom_type:e.target.value}))} style={{width:"100%",padding:"7px 10px",background:C.dark,border:`1px solid ${C.g500}40`,borderRadius:8,color:C.white,fontSize:12,cursor:"pointer",boxSizing:"border-box"}}>
                      <option value="telescopic">Teleskopik</option><option value="lattice">Kafes (Lattice)</option><option value="luffing">Luffing Jib</option><option value="fixed">Sabit Jib</option>
                    </select></div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                  <div style={{marginBottom:10}}><label style={{display:"block",fontSize:9,fontWeight:700,color:C.g400,marginBottom:3,textTransform:"uppercase"}}>Maks Boom (m)</label>
                    <input value={cfgForm.max_boom||""} onChange={e=>setCfgForm(p=>({...p,max_boom:e.target.value}))} placeholder="84" style={{width:"100%",padding:"7px 10px",background:C.dark,border:`1px solid ${C.g500}40`,borderRadius:8,color:C.white,fontSize:12,boxSizing:"border-box"}}/></div>
                  <div style={{marginBottom:10}}><label style={{display:"block",fontSize:9,fontWeight:700,color:C.g400,marginBottom:3,textTransform:"uppercase"}}>Maks Kapasite (t)</label>
                    <input value={cfgForm.max_capacity_at_config||""} onChange={e=>setCfgForm(p=>({...p,max_capacity_at_config:e.target.value}))} placeholder="300" style={{width:"100%",padding:"7px 10px",background:C.dark,border:`1px solid ${C.g500}40`,borderRadius:8,color:C.white,fontSize:12,boxSizing:"border-box"}}/></div>
                  <div style={{marginBottom:10}}><label style={{display:"block",fontSize:9,fontWeight:700,color:C.g400,marginBottom:3,textTransform:"uppercase"}}>Ayak Açıklığı</label>
                    <select value={cfgForm.outrigger_config||"full"} onChange={e=>setCfgForm(p=>({...p,outrigger_config:e.target.value}))} style={{width:"100%",padding:"7px 10px",background:C.dark,border:`1px solid ${C.g500}40`,borderRadius:8,color:C.white,fontSize:12,cursor:"pointer",boxSizing:"border-box"}}>
                      <option value="full">100% Açık</option><option value="75">75%</option><option value="50">50%</option><option value="0">Kapalı</option><option value="on_tracks">Palet üzeri</option>
                    </select></div>
                </div>

                {/* ═══ YÜK TABLOSU — CSV YÜKLEME ═══ */}
                <div style={{marginBottom:14,padding:12,background:C.dark,borderRadius:10,border:`1px solid ${C.greenLight}30`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <span style={{fontSize:10,fontWeight:700,color:C.greenLight,textTransform:"uppercase",letterSpacing:1}}>📊 Yük Tablosu</span>
                  </div>
                  {/* Mevcut tablolardan seç */}
                  <select value={cfgForm.load_chart_id||""} onChange={e=>setCfgForm(p=>({...p,load_chart_id:e.target.value}))} style={{width:"100%",padding:"7px 10px",background:C.surface||"#132E1C",border:`1px solid ${C.g500}40`,borderRadius:8,color:C.white,fontSize:11,cursor:"pointer",boxSizing:"border-box",marginBottom:8}}>
                    <option value="">— Mevcut tablodan seç —</option>
                    {Object.entries(allCharts).map(([k,ch])=><option key={k} value={k}>{ch.name} ({ch.maxCap}t)</option>)}
                  </select>
                  {cfgForm.load_chart_id&&allCharts[cfgForm.load_chart_id]&&<div style={{fontSize:10,color:C.greenLight,marginBottom:8,fontWeight:600}}>✓ Bağlı: {allCharts[cfgForm.load_chart_id].name}</div>}
                  {/* VEYA CSV yükle */}
                  <div style={{textAlign:"center",padding:"6px 0",fontSize:9,color:C.g500,fontWeight:700}}>— veya yeni CSV yükle —</div>
                  <label style={{display:"block",padding:"10px 14px",background:C.green+"20",border:`2px dashed ${C.green}50`,borderRadius:8,color:C.greenLight,fontWeight:700,fontSize:11,textAlign:"center",cursor:"pointer",marginTop:4}}>
                    📄 CSV Dosyası Seç ve Yükle
                    <input type="file" accept=".csv,.txt" onChange={async(e)=>{
                      const file=e.target.files?.[0];if(!file)return;
                      const reader=new FileReader();
                      reader.onload=async(ev)=>{
                        try{
                          const text=ev.target.result;
                          const sections=text.trim().split(/\n---\s*\n|\n---$/);
                          for(const section of sections){
                            const lines=section.trim().split("\n").map(l=>l.split(",").map(s=>s.trim()));
                            if(lines.length<3)continue;
                            const tName=lines[0][0]||"Özel Tablo";
                            let configLine={};let dataStart=1;
                            if(lines[1]&&lines[1][0]&&lines[1][0].toLowerCase().startsWith("config:")){
                              const cfgStr=lines[1].join(",").replace(/^config:\s*/i,"");
                              cfgStr.split(",").forEach(p2=>{const[k,v]=p2.split("=").map(s=>s.trim());if(k&&v)configLine[k]=v;});
                              dataStart=2;
                            }
                            const boomLengths=lines[dataStart].slice(1).map(v=>{const n=parseFloat(v.replace(",","."));return isNaN(n)?null:n;}).filter(v=>v!==null&&v>0);
                            const rows=[];
                            for(let i=dataStart+1;i<lines.length;i++){
                              if(!lines[i]||!lines[i][0])continue;
                              const r=parseFloat(lines[i][0].replace(",","."));if(isNaN(r))continue;
                              const caps=lines[i].slice(1).map(v=>{const n=parseFloat((v||"").replace(",","."));return isNaN(n)||n<=0?null:n;});
                              rows.push({r,caps});
                            }
                            if(boomLengths.length===0||rows.length===0){alert("CSV formatı hatalı");return;}
                            const maxCap=Math.max(...rows.flatMap(r2=>r2.caps.filter(v=>v!==null)));
                            const maxBoom=Math.max(...boomLengths);
                            // Save to Supabase
                            if(supabaseRef.current){
                              const row={user_id:userIdRef.current||null,name:tName,max_capacity:Number(maxCap),max_boom:Number(maxBoom),
                                pivot_height:parseFloat(configLine.pivotH)||3,boom_lengths:boomLengths,chart_data:rows,
                                outrigger_config:String(configLine.outrigger||"full"),counterweight_config:configLine.cw?String(configLine.cw):null,source:"csv_import"};
                              const{data:saved,error}=await supabaseRef.current.from("load_charts").insert(row).select();
                              if(error){alert("Kayıt hatası: "+error.message);return;}
                              if(saved&&saved[0]){
                                const r2=saved[0];
                                const dbChart={name:r2.name,maxCap:r2.max_capacity,maxBoom:r2.max_boom,pivotH:r2.pivot_height||3,
                                  boomLengths:r2.boom_lengths||[],rows:Array.isArray(r2.chart_data)?r2.chart_data:r2.chart_data,
                                  config:{outrigger:r2.outrigger_config,cw:r2.counterweight_config},isPreset:false};
                                setCustomCharts(p2=>({...p2,[r2.id]:dbChart}));
                                setCfgForm(p2=>({...p2,load_chart_id:r2.id}));
                                alert("✅ Yük tablosu yüklendi: "+tName);
                              }
                            }
                            break; // İlk tabloyu al
                          }
                        }catch(err){alert("CSV parse hatası: "+err.message);}
                      };
                      reader.readAsText(file);e.target.value="";
                    }} style={{display:"none"}}/>
                  </label>
                  <div style={{fontSize:8,color:C.g500,marginTop:4,lineHeight:1.4}}>
                    Format: Satır 1: Tablo adı | Satır 2: ,boom1,boom2,... | Satır 3+: menzil,kap1,kap2,...
                  </div>
                </div>

                {/* Transport vehicles */}
                <div style={{marginBottom:14,padding:12,background:C.dark,borderRadius:10,border:`1px solid ${C.g500}20`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <span style={{fontSize:9,fontWeight:700,color:C.g400,textTransform:"uppercase",letterSpacing:1}}>🚛 Nakliye Araçları</span>
                    <button onClick={()=>setCfgForm(p=>({...p,transport_vehicles:[...(p.transport_vehicles||[]),{type:"lowbed",count:1,notes:""}]}))} style={{padding:"3px 10px",background:C.yellow+"15",color:C.yellow,border:`1px solid ${C.yellow}30`,borderRadius:6,fontSize:9,cursor:"pointer",fontWeight:600}}>+ Araç Ekle</button>
                  </div>
                  {(!cfgForm.transport_vehicles||cfgForm.transport_vehicles.length===0)&&<div style={{textAlign:"center",padding:"10px 0",color:C.g500,fontSize:9}}>Nakliye için gerekli araçları ekleyin.</div>}
                  {(cfgForm.transport_vehicles||[]).map((v,vi)=>(
                    <div key={vi} style={{display:"flex",gap:5,alignItems:"center",marginBottom:5}}>
                      <select value={v.type} onChange={e=>{const nv=[...(cfgForm.transport_vehicles||[])];nv[vi]={...nv[vi],type:e.target.value};setCfgForm(p=>({...p,transport_vehicles:nv}));}} style={{padding:"5px 6px",background:C.dark,border:`1px solid ${C.g500}40`,borderRadius:6,color:C.white,fontSize:10,flex:"0 0 120px",boxSizing:"border-box"}}>
                        {[["lowbed","🚛 Lowbed"],["salkasa","🚚 Salkasa"],["other","📦 Diğer"]].map(([id,lb])=><option key={id} value={id}>{lb}</option>)}
                      </select>
                      <input type="number" value={v.count} min={1} onChange={e=>{const nv=[...(cfgForm.transport_vehicles||[])];nv[vi]={...nv[vi],count:Number(e.target.value)};setCfgForm(p=>({...p,transport_vehicles:nv}));}} style={{width:42,padding:"5px 4px",background:C.dark,border:`1px solid ${C.g500}40`,borderRadius:6,color:C.yellow,fontSize:11,textAlign:"center",fontWeight:700,boxSizing:"border-box"}}/>
                      <span style={{fontSize:9,color:C.g500}}>adet</span>
                      <input value={v.notes||""} onChange={e=>{const nv=[...(cfgForm.transport_vehicles||[])];nv[vi]={...nv[vi],notes:e.target.value};setCfgForm(p=>({...p,transport_vehicles:nv}));}} placeholder="Not..." style={{flex:1,padding:"5px 6px",background:C.dark,border:`1px solid ${C.g500}40`,borderRadius:6,color:C.white,fontSize:9,boxSizing:"border-box"}}/>
                      <button onClick={()=>{const nv=[...(cfgForm.transport_vehicles||[])];nv.splice(vi,1);setCfgForm(p=>({...p,transport_vehicles:nv}));}} style={{padding:"3px 7px",background:"#EF444415",color:"#EF4444",border:"none",borderRadius:5,fontSize:9,cursor:"pointer"}}>✕</button>
                    </div>
                  ))}
                  {(cfgForm.transport_vehicles||[]).length>0&&<div style={{textAlign:"right",fontSize:9,color:C.yellow,fontWeight:700,marginTop:4}}>Toplam: {(cfgForm.transport_vehicles||[]).reduce((s,v)=>s+(v.count||0),0)} araç</div>}
                </div>
                <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
                  <button onClick={()=>setCfgForm(null)} style={{padding:"7px 18px",background:"transparent",color:C.g400,border:`1px solid ${C.g500}40`,borderRadius:8,fontSize:11,cursor:"pointer"}}>İptal</button>
                  <Btn onClick={()=>{
                    if(!cfgForm.name?.trim())return alert("Konfigürasyon adı gerekli");
                    fleetSaveConfig(cfgForm,cfgForm.craneId);
                  }} color={C.green}>Kaydet</Btn>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══ EXPORT TAB ═══ */}
      {tab==="export"&&(
        <div style={{maxWidth:600,margin:"0 auto",padding:20}}>
          <Card>
            <Title>Range Chart Ekran Görüntüsü</Title>
            <p style={{fontSize:10,color:C.g400,marginBottom:12}}>Menzil diyagramını PNG olarak indirin. Paylaşmak veya raporlara eklemek için kullanabilirsiniz.</p>
            <Btn onClick={exportScreenshot} color={C.yellow} style={{width:"100%",padding:12}}>📸 Ekran Görüntüsü İndir (PNG)</Btn>
          </Card>
          <Card>
            <Title>Kaldırma Planı PDF</Title>
            <p style={{fontSize:10,color:C.g400,marginBottom:12}}>Kaldırma planını yazdırılabilir PDF formatında önizleyin.</p>
            <Btn onClick={()=>setShowPDF(true)} color={C.greenLight} style={{width:"100%",padding:12,color:"white"}}>📋 Kaldırma Planı Önizle & Yazdır</Btn>
          </Card>
          <Card>
            <Title>Proje Verisi</Title>
            <p style={{fontSize:10,color:C.g400,marginBottom:12}}>Tüm proje verisini JSON olarak indirin. Yedekleme veya paylaşma için.</p>
            <Btn onClick={()=>{
              const data=JSON.stringify({config:cfg,objects,rulers,lift_plan:lp},null,2);
              const blob=new Blob([data],{type:"application/json"});
              const url=URL.createObjectURL(blob);
              const a=document.createElement("a");a.href=url;a.download=`Hangle-${new Date().toISOString().split("T")[0]}.json`;a.click();
              URL.revokeObjectURL(url);
            }} color={C.cyan} style={{width:"100%",padding:12,color:"white"}}>💾 Proje JSON İndir</Btn>
          </Card>
          <Card>
            <Title>Proje Yükle (JSON)</Title>
            <p style={{fontSize:10,color:C.g400,marginBottom:12}}>Daha önce indirdiğiniz JSON dosyasını yükleyerek projeyi geri açın.</p>
            <label style={{display:"block",width:"100%",padding:12,background:C.orange+"20",border:`2px dashed ${C.orange}50`,borderRadius:8,textAlign:"center",cursor:"pointer",fontSize:11,fontWeight:700,color:C.orange,fontFamily:F}}>
              📂 JSON Dosyası Seç
              <input type="file" accept=".json" style={{display:"none"}} onChange={e=>{
                const file=e.target.files?.[0];if(!file)return;
                const reader=new FileReader();
                reader.onload=(ev)=>{
                  try{
                    const data=JSON.parse(ev.target.result);
                    if(data.config)setCfg(p=>({...p,...data.config}));
                    if(data.objects)setObjects(data.objects);
                    if(data.rulers)setRulers(data.rulers);
                    if(data.lift_plan)setLp(p=>({...p,...data.lift_plan}));
                    setTab("chart");
                  }catch(err){alert("JSON dosyası okunamadı: "+err.message);}
                };
                reader.readAsText(file);
                e.target.value="";
              }}/>
            </label>
          </Card>
          <Card>
            <Title>CSV Yük Tablosu Yükle</Title>
            <p style={{fontSize:10,color:C.g400,marginBottom:12}}>Üretici yük tablosunu CSV olarak yükleyin. Biçim: Satır 1=İsim, Satır 2=,boom1,boom2..., Satır 3+=menzil,kap1,kap2...</p>
            <label style={{display:"block",width:"100%",padding:12,background:C.orange,borderRadius:6,color:"white",fontWeight:700,fontSize:10,textAlign:"center",cursor:"pointer",fontFamily:F}}>
              📄 CSV Tablo Yükle
              <input type="file" accept=".csv,.txt" onChange={importChartCSV} style={{display:"none"}}/>
            </label>
          </Card>
        </div>
      )}
    </div>
  );
}
