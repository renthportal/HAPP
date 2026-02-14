"use client";
import{useState,useEffect,useRef,useCallback,useMemo}from"react";

// ═══ COLORS ═══
const C={dark:"#0A1F12",darkSurf:"#132E1C",greenBg:"#0D2818",greenDark:"#004D2A",green:"#006838",greenLight:"#00A86B",yellow:"#FFC72C",yellowDark:"#B8860B",orange:"#FF6B35",cyan:"#00BCD4",red:"#DC2626",white:"#F0F4F1",g100:"#D9E5DD",g200:"#B8C9BE",g300:"#94A89A",g400:"#6B7E70",g500:"#475950",g600:"#2A3B30"};
const F="'Fira Code','SF Mono',monospace";
const LOGO_DATA="data:image/jpeg;base64,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HHp0PLYjnu02zOONXSDVzR6j3CslquvCGY+B9irMIiLnasiIiws5lcdg8TZy2Wtx1KVZhfLLIdg0fUnoAOZPIL61pcQ1oxJXwkAYlM5lcdg8TZy2Wtx1KVZhfLLIdg0fUnoAOZPIKlvHDipkeIWW8iDzKmBrPJq1Sdi89PMk26uPYdGg7DuS44cVMjxCy3kQeZUwNZ5NWqTsXnp5km3Vx7Do0HYdyY2XVNm9mxRAVFQMZDwH7fn0VSudzM57OP8AT6/CIiK4qFREREREREREREREREREREREREREREREREREREREREREREREREREREREREVkPZz40+T7to/WFv7rlHj8hK74OwikJ7dg49Oh5bEWYXmurF+z7xxix9VmmNb3S2rCzankZN3FjQP4cncj8J/I9tue7TbMb2NVRtz/AOzR6j3CsdruuGEMx8D7FWSzWToYbE2crk7LKtOrGZJpXnk1o/yfQDmTyCpXxw4qZHiFlvIg8ypgazyatUnYvPTzJNurj2HRoOw7k/fjtxYva/yZo0TLV09WfvBATs6dw/3JPn6Dt/XcqL1IbNbNiiAqagf3DwH7fn0WvdLmZz2UR7vr8IiIrkoRERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERf//Z";
const FB="'Inter','SF Pro',-apple-system,sans-serif";

// ═══ 12 CRANE TYPES (Crangle-style) ═══
const CRANES=[
  {id:"mobile",name:"Mobil Vinç",maxBoom:60,maxCap:100,pivotH:2.5,cat:"mobile"},
  {id:"truck",name:"Kamyon Vinç",maxBoom:40,maxCap:60,pivotH:3,cat:"mobile"},
  {id:"crawler",name:"Paletli Vinç",maxBoom:100,maxCap:200,pivotH:3.5,cat:"crawler"},
  {id:"tower",name:"Kule Vinç",maxBoom:80,maxCap:120,pivotH:40,cat:"tower"},
  {id:"rough",name:"Arazi Vinç",maxBoom:50,maxCap:80,pivotH:2.8,cat:"mobile"},
  {id:"allterrain",name:"All Terrain Vinç",maxBoom:70,maxCap:150,pivotH:3,cat:"mobile"},
  {id:"mini",name:"Mini/Örümcek Vinç",maxBoom:20,maxCap:10,pivotH:1.5,cat:"spider"},
  {id:"telescopic",name:"Teleskopik Handler",maxBoom:25,maxCap:5,pivotH:2,cat:"telescopic"},
  {id:"knuckle",name:"Eklemli Vinç (Boom Truck)",maxBoom:35,maxCap:40,pivotH:2,cat:"knuckle"},
  {id:"franna",name:"Pick & Carry Vinç",maxBoom:28,maxCap:25,pivotH:2.2,cat:"franna"},
  {id:"floating",name:"Yüzer Vinç",maxBoom:120,maxCap:500,pivotH:10,cat:"floating"},
  {id:"gantry",name:"Portal Vinç",maxBoom:40,maxCap:150,pivotH:15,cat:"gantry"},
];

// ═══ CRANE VISUAL CONFIGS ═══
// Colors for each crane part (user-customizable)
const DEFAULT_CRANE_COLORS={
  body:"#2D5A3D",boom:"#FFC72C",jib:"#FF6B35",cab:"#1A3D25",
  tracks:"#333333",outriggers:"#444444",counterweight:"#555555",
  hook:"#888888",wheels:"#222222",base:"#1A3D25"
};

// ═══ VISUAL DRAWING: each type draws differently ═══
function drawCraneVisual(ctx,type,SC,VS,pivotX,pivotY,boomTipX,boomTipY,colors,cfg,jibTipX,jibTipY){
  const cr=CRANES.find(c=>c.id===type);
  if(!cr) return;
  const cat=cr.cat;
  const groundY=pivotY+cfg.pivotHeight*VS;
  const bodyW=cfg.craneEnd*SC;
  const bodyH=Math.min(2.5*VS,40);
  const cabW=2*SC;
  const cabH=2*VS;
  const s=Math.max(0.5,Math.min(VS/8,1.8)); // detail scale factor
  
  ctx.save();
  
  // Helper: draw a detailed wheel
  const drawWheel=(wx,wy,r)=>{
    // Tire
    ctx.fillStyle="#1a1a1a";
    ctx.beginPath();ctx.arc(wx,wy,r,0,Math.PI*2);ctx.fill();
    // Tire tread pattern
    ctx.strokeStyle="#333";ctx.lineWidth=Math.max(1,r*0.15);
    ctx.beginPath();ctx.arc(wx,wy,r*0.88,0,Math.PI*2);ctx.stroke();
    // Rim
    ctx.fillStyle="#888";
    ctx.beginPath();ctx.arc(wx,wy,r*0.55,0,Math.PI*2);ctx.fill();
    // Hub
    ctx.fillStyle="#aaa";
    ctx.beginPath();ctx.arc(wx,wy,r*0.3,0,Math.PI*2);ctx.fill();
    // Axle dot
    ctx.fillStyle="#666";
    ctx.beginPath();ctx.arc(wx,wy,r*0.12,0,Math.PI*2);ctx.fill();
  };
  
  // Helper: draw cab with window detail
  const drawCab=(cx,cy,cw,ch,facingLeft)=>{
    const r=Math.min(4,ch*0.15);
    // Cab body
    ctx.fillStyle=colors.cab;
    ctx.beginPath();
    if(facingLeft){
      ctx.moveTo(cx+r,cy);ctx.lineTo(cx+cw,cy);ctx.lineTo(cx+cw,cy+ch);
      ctx.lineTo(cx,cy+ch);ctx.lineTo(cx,cy+r);ctx.quadraticCurveTo(cx,cy,cx+r,cy);
    } else {
      ctx.moveTo(cx,cy);ctx.lineTo(cx+cw-r,cy);
      ctx.quadraticCurveTo(cx+cw,cy,cx+cw,cy+r);
      ctx.lineTo(cx+cw,cy+ch);ctx.lineTo(cx,cy+ch);
    }
    ctx.closePath();ctx.fill();
    // Cab outline
    ctx.strokeStyle="rgba(0,0,0,0.3)";ctx.lineWidth=1;ctx.stroke();
    // Window
    const wp=0.12;
    ctx.fillStyle="rgba(120,200,240,0.45)";
    ctx.beginPath();
    const wx=cx+cw*wp, wy=cy+ch*0.12, ww=cw*(1-2*wp), wh=ch*0.42;
    ctx.roundRect(wx,wy,ww,wh,Math.min(2,r*0.5));
    ctx.fill();
    // Window frame
    ctx.strokeStyle="rgba(0,0,0,0.2)";ctx.lineWidth=0.8;
    ctx.strokeRect(wx,wy,ww,wh);
    // Window divider
    ctx.beginPath();ctx.moveTo(wx+ww*0.55,wy);ctx.lineTo(wx+ww*0.55,wy+wh);ctx.stroke();
  };
  
  // Helper: draw outrigger
  const drawOutrigger=(ox,oy,ex,ey,padW)=>{
    // Leg
    ctx.strokeStyle=colors.outriggers;ctx.lineWidth=Math.max(2,3*s);
    ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(ex,ey);ctx.stroke();
    // Pad
    ctx.fillStyle=colors.outriggers;
    const ph=Math.max(3,4*s);
    ctx.fillRect(ex-padW/2,ey-ph/2,padW,ph);
    // Pad ground contact
    ctx.fillStyle="rgba(0,0,0,0.2)";
    ctx.fillRect(ex-padW/2,ey+ph/2-1,padW,2);
  };

  // Helper: draw counterweight
  const drawCW=(cx,cy,cw,ch)=>{
    ctx.fillStyle=colors.counterweight;
    ctx.beginPath();ctx.roundRect(cx,cy,cw,ch,Math.min(3,ch*0.2));ctx.fill();
    ctx.strokeStyle="rgba(0,0,0,0.25)";ctx.lineWidth=1;ctx.stroke();
    // Weight lines
    ctx.strokeStyle="rgba(0,0,0,0.15)";ctx.lineWidth=0.8;
    const lines=Math.max(2,Math.floor(cw/8));
    for(let i=1;i<lines;i++){
      const lx=cx+i*(cw/lines);
      ctx.beginPath();ctx.moveTo(lx,cy+2);ctx.lineTo(lx,cy+ch-2);ctx.stroke();
    }
  };

  // Helper: draw body panel with subtle shading
  const drawBody=(bx,by,bw,bh,r)=>{
    ctx.fillStyle=colors.body;
    ctx.beginPath();ctx.roundRect(bx,by,bw,bh,r||3);ctx.fill();
    // Top highlight
    const hlGrad=ctx.createLinearGradient(bx,by,bx,by+bh);
    hlGrad.addColorStop(0,"rgba(255,255,255,0.12)");
    hlGrad.addColorStop(0.5,"rgba(255,255,255,0)");
    hlGrad.addColorStop(1,"rgba(0,0,0,0.08)");
    ctx.fillStyle=hlGrad;
    ctx.beginPath();ctx.roundRect(bx,by,bw,bh,r||3);ctx.fill();
    // Outline
    ctx.strokeStyle="rgba(0,0,0,0.2)";ctx.lineWidth=0.8;
    ctx.beginPath();ctx.roundRect(bx,by,bw,bh,r||3);ctx.stroke();
  };

  // ═══ CRANE BODIES BY CATEGORY ═══
  
  if(cat==="mobile"||cat==="franna"){
    const wheelR=Math.max(6,Math.min(1*VS,14));
    const chassisH=bodyH*0.28;
    const chassisY=groundY-wheelR*2-chassisH;
    
    // Determine wheel config per type
    let wheelPositions=[];
    const totalW=bodyW+cabW*0.3;
    if(type==="allterrain"){
      // 5 axles
      for(let i=0;i<5;i++) wheelPositions.push(pivotX-bodyW+totalW*0.08+i*(totalW*0.84/4));
    } else if(type==="truck"){
      // Front 1 + rear tandem 2
      wheelPositions=[pivotX-bodyW+totalW*0.1, pivotX-bodyW+totalW*0.7, pivotX-bodyW+totalW*0.85];
    } else if(type==="rough"){
      // 2 axles, big wheels
      wheelPositions=[pivotX-bodyW+totalW*0.15, pivotX-bodyW+totalW*0.8];
    } else if(type==="franna"){
      // 2 axles compact
      wheelPositions=[pivotX-bodyW+totalW*0.15, pivotX-bodyW+totalW*0.75];
    } else {
      // mobile default: 4 axles
      for(let i=0;i<4;i++) wheelPositions.push(pivotX-bodyW+totalW*0.08+i*(totalW*0.88/3));
    }
    
    // Draw wheels
    wheelPositions.forEach(wx=>drawWheel(wx,groundY-wheelR*0.05,wheelR));
    
    // Axle beam
    ctx.fillStyle="#444";
    const axleY=groundY-wheelR*1.3;
    ctx.fillRect(pivotX-bodyW-wheelR*0.3,axleY,totalW+wheelR*0.6,wheelR*0.35);
    
    // Chassis
    drawBody(pivotX-bodyW,chassisY,totalW,chassisH,4);
    
    // Turntable ring
    const ringX=pivotX-cabW*0.2;
    const ringR=Math.max(4,cabW*0.25);
    ctx.fillStyle="#555";
    ctx.beginPath();ctx.arc(ringX,chassisY,ringR,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle="#666";ctx.lineWidth=1.5;
    ctx.beginPath();ctx.arc(ringX,chassisY,ringR*0.7,0,Math.PI*2);ctx.stroke();
    
    // Upper body / superstructure
    const upperH=bodyH*0.4;
    const upperY=chassisY-upperH;
    drawBody(pivotX-bodyW*0.75,upperY,bodyW*0.7,upperH,3);
    
    // Counterweight
    const cwW=bodyW*0.35;
    const cwH=upperH*0.85;
    drawCW(pivotX-bodyW*0.72,upperY+upperH*0.08,cwW,cwH);
    
    // Cab
    const cabX=pivotX-cabW*0.6;
    drawCab(cabX,upperY-cabH*0.9,cabW*1.1,cabH*0.95,true);
    
    // Outriggers (not for franna/rough)
    if(type!=="franna"&&type!=="rough"){
      const outY=chassisY+chassisH*0.5;
      const padW=Math.max(8,12*s);
      // Front
      drawOutrigger(pivotX+cabW*0.15,outY,pivotX+cabW*1.0,groundY,padW);
      // Rear
      drawOutrigger(pivotX-bodyW*0.85,outY,pivotX-bodyW*1.3,groundY,padW);
    }
    
    // Engine grille detail (rear)
    ctx.fillStyle="rgba(0,0,0,0.15)";
    const grX=pivotX-bodyW*0.72+bodyW*0.03;
    for(let i=0;i<3;i++){
      ctx.fillRect(grX,chassisY-chassisH*0.1+i*chassisH*0.22,bodyW*0.08,chassisH*0.12);
    }

  } else if(cat==="crawler"){
    const trackH=Math.max(10,1.8*VS);
    const trackW=bodyW*1.15;
    const trackX=pivotX-trackW*0.65;
    const trackY=groundY-trackH;
    
    // Track body
    ctx.fillStyle=colors.tracks;
    ctx.beginPath();
    const tR=trackH*0.35;
    ctx.roundRect(trackX,trackY,trackW,trackH,tR);
    ctx.fill();
    // Track outline
    ctx.strokeStyle="rgba(0,0,0,0.3)";ctx.lineWidth=1.5;
    ctx.beginPath();ctx.roundRect(trackX,trackY,trackW,trackH,tR);ctx.stroke();
    
    // Track pad segments
    ctx.fillStyle="rgba(0,0,0,0.2)";
    const padCount=Math.max(8,Math.floor(trackW/8));
    const padW=trackW/padCount;
    for(let i=0;i<padCount;i++){
      if(i%2===0){
        ctx.fillRect(trackX+i*padW+1,trackY+trackH*0.08,padW-2,trackH*0.84);
      }
    }
    
    // Track rollers
    const rollerR=trackH*0.15;
    ctx.fillStyle="#555";
    // Drive sprocket (front)
    ctx.beginPath();ctx.arc(trackX+tR*0.8,trackY+trackH*0.5,rollerR*1.4,0,Math.PI*2);ctx.fill();
    // Idler (rear)
    ctx.beginPath();ctx.arc(trackX+trackW-tR*0.8,trackY+trackH*0.5,rollerR*1.4,0,Math.PI*2);ctx.fill();
    // Bottom rollers
    for(let i=0;i<5;i++){
      const rx=trackX+trackW*0.2+i*(trackW*0.6/4);
      ctx.beginPath();ctx.arc(rx,trackY+trackH*0.75,rollerR*0.7,0,Math.PI*2);ctx.fill();
    }
    
    // Upper body
    const upperH=bodyH*0.55;
    const upperY=trackY-upperH;
    drawBody(pivotX-bodyW*0.55,upperY,bodyW*0.85,upperH,4);
    
    // Counterweight
    const cwW=bodyW*0.32;
    drawCW(pivotX-bodyW*0.5,upperY+upperH*0.1,cwW,upperH*0.8);
    
    // Cab
    const cabX=pivotX-cabW*0.5;
    drawCab(cabX,upperY-cabH*0.85,cabW*1.3,cabH*0.85,true);
    
    // A-frame / gantry at pivot
    ctx.strokeStyle=colors.body;ctx.lineWidth=Math.max(2,2.5*s);
    ctx.beginPath();ctx.moveTo(pivotX-cabW*0.3,upperY);ctx.lineTo(pivotX,pivotY);ctx.stroke();
    ctx.beginPath();ctx.moveTo(pivotX+cabW*0.3,upperY);ctx.lineTo(pivotX,pivotY);ctx.stroke();
    
  } else if(cat==="tower"){
    const mastW=Math.max(8,2*SC);
    const mastL=pivotX-mastW/4;
    const mastR=pivotX+mastW/4;
    
    // Tower base plate
    ctx.fillStyle=colors.base;
    ctx.fillRect(pivotX-mastW*0.8,groundY-3,mastW*1.6,5);
    
    // Tower legs
    ctx.strokeStyle=colors.body;ctx.lineWidth=Math.max(3,3*s);
    ctx.beginPath();ctx.moveTo(pivotX-mastW*0.6,groundY-3);ctx.lineTo(mastL,pivotY);ctx.stroke();
    ctx.beginPath();ctx.moveTo(pivotX+mastW*0.6,groundY-3);ctx.lineTo(mastR,pivotY);ctx.stroke();
    
    // Cross braces (lattice pattern)
    const nBraces=Math.max(4,Math.floor((groundY-pivotY)/22));
    ctx.strokeStyle=colors.body;ctx.lineWidth=Math.max(0.8,1.2*s);
    for(let i=0;i<nBraces;i++){
      const t1=i/nBraces;const t2=(i+1)/nBraces;
      const y1=pivotY+t1*(groundY-3-pivotY);
      const y2=pivotY+t2*(groundY-3-pivotY);
      const xL1=mastL+(pivotX-mastW*0.6-mastL)*t1;
      const xR1=mastR+(pivotX+mastW*0.6-mastR)*t1;
      const xL2=mastL+(pivotX-mastW*0.6-mastL)*t2;
      const xR2=mastR+(pivotX+mastW*0.6-mastR)*t2;
      // Horizontal
      ctx.beginPath();ctx.moveTo(xL1,y1);ctx.lineTo(xR1,y1);ctx.stroke();
      // X-brace
      ctx.beginPath();ctx.moveTo(xL1,y1);ctx.lineTo(xR2,y2);ctx.stroke();
      ctx.beginPath();ctx.moveTo(xR1,y1);ctx.lineTo(xL2,y2);ctx.stroke();
    }
    
    // Slew ring at top
    ctx.fillStyle="#555";
    ctx.beginPath();ctx.arc(pivotX,pivotY,mastW*0.4,0,Math.PI*2);ctx.fill();
    
    // Cab
    const tcabW=mastW*1.3;
    const tcabH=cabH*0.6;
    drawCab(pivotX-tcabW/2,pivotY-tcabH*0.8,tcabW,tcabH,false);
    
    // Counter-jib with counterweight
    ctx.strokeStyle=colors.body;ctx.lineWidth=Math.max(2,2*s);
    ctx.beginPath();ctx.moveTo(pivotX,pivotY);ctx.lineTo(pivotX-mastW*3,pivotY-mastW*0.3);ctx.stroke();
    drawCW(pivotX-mastW*3.5,pivotY-mastW*0.8,mastW*1.5,mastW*0.8);
    
  } else if(cat==="spider"){
    // Spider crane - compact body with deployed legs
    const legSpread=bodyW*0.9;
    const bodyCenter=pivotX;
    const smallBodyH=bodyH*0.35;
    const smallBodyW=cabW*1.2;
    const baseY=groundY-smallBodyH*2;
    
    // Deployed spider legs with pads
    ctx.strokeStyle=colors.outriggers;ctx.lineWidth=Math.max(1.5,2*s);
    const legAngles=[0.2,0.45,0.55,0.8];
    legAngles.forEach((a,i)=>{
      const dir=i<2?-1:1;
      const endX=bodyCenter+dir*legSpread*(0.6+a*0.4);
      // Upper leg
      ctx.beginPath();ctx.moveTo(bodyCenter+dir*smallBodyW*0.3,baseY+smallBodyH);
      ctx.lineTo(bodyCenter+dir*legSpread*0.3,groundY-8*s);ctx.stroke();
      // Lower leg
      ctx.beginPath();ctx.moveTo(bodyCenter+dir*legSpread*0.3,groundY-8*s);
      ctx.lineTo(endX,groundY);ctx.stroke();
      // Pad
      ctx.fillStyle=colors.outriggers;
      ctx.fillRect(endX-4*s,groundY-2,8*s,3);
    });
    
    // Small compact body
    drawBody(bodyCenter-smallBodyW/2,baseY,smallBodyW,smallBodyH,3);
    
    // Mini cab
    const mcW=smallBodyW*0.6;
    drawCab(bodyCenter-mcW/2,baseY-cabH*0.5,mcW,cabH*0.5,true);
    
  } else if(cat==="knuckle"){
    // Boom truck / knuckle boom - long truck with crane mounted behind cab
    const truckW=bodyW*1.6;
    const wheelR=Math.max(5,Math.min(0.8*VS,11));
    const chassisH=bodyH*0.22;
    const chassisY=groundY-wheelR*2-chassisH;
    const truckX=pivotX-truckW*0.25;
    
    // Truck wheels: front 2, rear tandem 4
    const wPositions=[
      truckX+truckW*0.1, // front
      truckX+truckW*0.72, truckX+truckW*0.82, // rear tandem 1
      truckX+truckW*0.88, truckX+truckW*0.95, // rear tandem 2
    ];
    wPositions.forEach(wx=>drawWheel(wx,groundY-wheelR*0.05,wheelR));
    
    // Truck frame
    ctx.fillStyle="#444";
    ctx.fillRect(truckX-wheelR*0.3,chassisY+chassisH*0.3,truckW+wheelR*0.6,chassisH*0.4);
    
    // Truck bed/body
    drawBody(truckX+truckW*0.25,chassisY-bodyH*0.15,truckW*0.72,bodyH*0.15+chassisH,3);
    
    // Truck cab at front
    const tcW=truckW*0.2;
    const tcH=cabH*1.1;
    drawCab(truckX-tcW*0.15,chassisY-tcH+chassisH*0.2,tcW,tcH,true);
    
    // Crane pedestal
    ctx.fillStyle=colors.body;
    const pedX=pivotX-cabW*0.3;
    const pedY=chassisY-bodyH*0.4;
    ctx.fillRect(pedX,pedY,cabW*0.6,chassisY-pedY+chassisH*0.2);
    ctx.strokeStyle="rgba(0,0,0,0.2)";ctx.lineWidth=1;
    ctx.strokeRect(pedX,pedY,cabW*0.6,chassisY-pedY+chassisH*0.2);
    
  } else if(cat==="telescopic"){
    // Telehandler - compact with large wheels
    const wheelR=Math.max(7,Math.min(1.1*VS,15));
    const chassisH=bodyH*0.35;
    const chassisY=groundY-wheelR*1.8;
    
    // 2 large wheels
    drawWheel(pivotX-bodyW*0.35,groundY-wheelR*0.05,wheelR);
    drawWheel(pivotX+bodyW*0.25,groundY-wheelR*0.05,wheelR);
    
    // Compact body
    drawBody(pivotX-bodyW*0.45,chassisY-chassisH,bodyW*0.8,chassisH+wheelR*0.3,4);
    
    // Cab (enclosed)
    const tcW=cabW*1.3;
    const tcH=cabH*1.0;
    drawCab(pivotX-bodyW*0.42,chassisY-chassisH-tcH*0.85,tcW,tcH,true);
    
    // Counterweight rear
    drawCW(pivotX+bodyW*0.05,chassisY-chassisH+2,bodyW*0.25,chassisH*0.7);
    
  } else if(cat==="floating"){
    // Floating crane - barge with crane on deck
    const bargeW=bodyW*2.2;
    const bargeH=bodyH*0.5;
    const bargeX=pivotX-bargeW*0.55;
    const deckY=groundY-bargeH;
    
    // Water / waves
    ctx.strokeStyle="rgba(30,120,200,0.3)";ctx.lineWidth=1.5;
    for(let w=0;w<4;w++){
      ctx.beginPath();
      const wy=groundY+4+w*6;
      for(let i=0;i<8;i++){
        const wx=bargeX-10+i*(bargeW+20)/7;
        const wamp=3+Math.sin(i+w)*2;
        if(i===0) ctx.moveTo(wx,wy);
        else ctx.quadraticCurveTo(wx-bargeW/14,wy-wamp,wx,wy);
      }
      ctx.stroke();
    }
    
    // Barge hull
    ctx.fillStyle="#6b7b8d";
    ctx.beginPath();
    ctx.moveTo(bargeX+bargeW*0.02,deckY);
    ctx.lineTo(bargeX-bargeW*0.03,groundY+2);
    ctx.lineTo(bargeX+bargeW*1.03,groundY+2);
    ctx.lineTo(bargeX+bargeW*0.98,deckY);
    ctx.closePath();ctx.fill();
    ctx.strokeStyle="rgba(0,0,0,0.3)";ctx.lineWidth=1;ctx.stroke();
    
    // Deck
    ctx.fillStyle="#8b9bad";
    ctx.fillRect(bargeX,deckY-3,bargeW,5);
    
    // Deck structure / house
    drawBody(bargeX+bargeW*0.55,deckY-bargeH*0.8-3,bargeW*0.35,bargeH*0.8,3);
    
    // Crane house on deck
    drawBody(pivotX-cabW*0.8,deckY-bodyH*0.5-3,cabW*1.6,bodyH*0.5,3);
    drawCab(pivotX-cabW*0.5,deckY-bodyH*0.5-cabH*0.7-3,cabW,cabH*0.7,true);
    drawCW(pivotX+cabW*0.3,deckY-bodyH*0.45-3,cabW*0.5,bodyH*0.4);
    
    // Waterline mark
    ctx.strokeStyle="rgba(200,50,50,0.4)";ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(bargeX+1,groundY-bargeH*0.3);
    ctx.lineTo(bargeX+bargeW-1,groundY-bargeH*0.3);ctx.stroke();
    
  } else if(cat==="gantry"){
    // Gantry / portal crane - two legs + crossbeam + trolley
    const gantryW=bodyW*1.6;
    const legW=Math.max(4,SC*0.6);
    
    // Rail / ground beam
    ctx.fillStyle="#666";
    ctx.fillRect(pivotX-gantryW*0.6,groundY-2,gantryW*1.2,4);
    
    // Left leg (A-frame)
    ctx.fillStyle=colors.body;
    ctx.beginPath();
    ctx.moveTo(pivotX-gantryW/2-legW,groundY-2);
    ctx.lineTo(pivotX-gantryW/2+legW,groundY-2);
    ctx.lineTo(pivotX-gantryW*0.35+legW/2,pivotY+2);
    ctx.lineTo(pivotX-gantryW*0.35-legW/2,pivotY+2);
    ctx.closePath();ctx.fill();
    ctx.strokeStyle="rgba(0,0,0,0.2)";ctx.lineWidth=1;ctx.stroke();
    
    // Right leg
    ctx.fillStyle=colors.body;
    ctx.beginPath();
    ctx.moveTo(pivotX+gantryW/2-legW,groundY-2);
    ctx.lineTo(pivotX+gantryW/2+legW,groundY-2);
    ctx.lineTo(pivotX+gantryW*0.35+legW/2,pivotY+2);
    ctx.lineTo(pivotX+gantryW*0.35-legW/2,pivotY+2);
    ctx.closePath();ctx.fill();
    ctx.strokeStyle="rgba(0,0,0,0.2)";ctx.lineWidth=1;ctx.stroke();
    
    // Cross braces on legs
    ctx.strokeStyle=colors.body;ctx.lineWidth=Math.max(1,1.5*s);
    for(let side=-1;side<=1;side+=2){
      const nB=Math.max(3,Math.floor((groundY-pivotY)/30));
      for(let i=1;i<nB;i++){
        const t=i/nB;
        const y=pivotY+t*(groundY-pivotY);
        const xC=pivotX+side*gantryW*0.35;
        const xO=pivotX+side*gantryW/2;
        const xl=xC+(xO-xC)*t-legW*(1-t);
        const xr=xC+(xO-xC)*t+legW*(1-t);
        ctx.beginPath();ctx.moveTo(xl,y);ctx.lineTo(xr,y);ctx.stroke();
      }
    }
    
    // Top girder / crossbeam
    const girderH=Math.max(6,bodyH*0.25);
    drawBody(pivotX-gantryW*0.38,pivotY-girderH,gantryW*0.76,girderH,2);
    
    // Trolley on girder
    const trolleyW=cabW*0.8;
    const trolleyH=girderH*0.6;
    ctx.fillStyle=colors.cab;
    ctx.fillRect(pivotX-trolleyW/2,pivotY-girderH-trolleyH,trolleyW,trolleyH);
    // Trolley wheels
    ctx.fillStyle="#666";
    ctx.beginPath();ctx.arc(pivotX-trolleyW*0.3,pivotY-girderH,3,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(pivotX+trolleyW*0.3,pivotY-girderH,3,0,Math.PI*2);ctx.fill();
    
    // Rail wheels on ground
    for(let side=-1;side<=1;side+=2){
      for(let i=0;i<3;i++){
        ctx.fillStyle="#555";
        const rwx=pivotX+side*(gantryW/2-legW+i*legW);
        ctx.beginPath();ctx.arc(rwx,groundY-1,Math.max(3,4*s),0,Math.PI*2);ctx.fill();
      }
    }
  }
  
  // ═══ BOOM ═══
  const boomW=Math.max(3,1.5*SC*0.15);
  if(cat==="crawler"||cat==="tower"||cat==="gantry"){
    // Lattice boom - detailed
    ctx.strokeStyle=colors.boom;
    const dx=boomTipX-pivotX;const dy=boomTipY-pivotY;
    const len=Math.sqrt(dx*dx+dy*dy);
    if(len<1){ctx.restore();return;}
    const nx=-dy/len*boomW;const ny=dx/len*boomW;
    // Top & bottom chords
    ctx.lineWidth=Math.max(1.5,2*s);
    ctx.beginPath();ctx.moveTo(pivotX+nx,pivotY+ny);ctx.lineTo(boomTipX+nx,boomTipY+ny);ctx.stroke();
    ctx.beginPath();ctx.moveTo(pivotX-nx,pivotY-ny);ctx.lineTo(boomTipX-nx,boomTipY-ny);ctx.stroke();
    // Lattice diagonals
    ctx.lineWidth=Math.max(0.8,1*s);
    const segments=Math.max(6,Math.floor(len/18));
    for(let i=0;i<segments;i++){
      const t1=i/segments;const t2=(i+1)/segments;
      const x1=pivotX+dx*t1;const y1=pivotY+dy*t1;
      const x2=pivotX+dx*t2;const y2=pivotY+dy*t2;
      // Horizontals
      ctx.beginPath();ctx.moveTo(x1+nx,y1+ny);ctx.lineTo(x1-nx,y1-ny);ctx.stroke();
      // X diagonals
      ctx.beginPath();ctx.moveTo(x1+nx,y1+ny);ctx.lineTo(x2-nx,y2-ny);ctx.stroke();
      ctx.beginPath();ctx.moveTo(x1-nx,y1-ny);ctx.lineTo(x2+nx,y2+ny);ctx.stroke();
    }
    // End cap
    ctx.beginPath();ctx.moveTo(boomTipX+nx,boomTipY+ny);ctx.lineTo(boomTipX-nx,boomTipY-ny);ctx.stroke();
  } else {
    // Telescopic boom - multi-section
    const dx=boomTipX-pivotX;const dy=boomTipY-pivotY;
    const len=Math.sqrt(dx*dx+dy*dy);
    if(len<1){ctx.restore();return;}
    // Base section (widest)
    ctx.strokeStyle=colors.boom;
    ctx.lineWidth=boomW*2.5;ctx.lineCap="round";
    ctx.beginPath();ctx.moveTo(pivotX,pivotY);ctx.lineTo(pivotX+dx*0.4,pivotY+dy*0.4);ctx.stroke();
    // Mid section
    ctx.lineWidth=boomW*1.8;
    ctx.beginPath();ctx.moveTo(pivotX+dx*0.15,pivotY+dy*0.15);ctx.lineTo(pivotX+dx*0.7,pivotY+dy*0.7);ctx.stroke();
    // Tip section (narrowest)
    ctx.strokeStyle=C.yellowDark;
    ctx.lineWidth=boomW*1.2;
    ctx.beginPath();ctx.moveTo(pivotX+dx*0.35,pivotY+dy*0.35);ctx.lineTo(boomTipX,boomTipY);ctx.stroke();
    // Section lines
    ctx.strokeStyle="rgba(0,0,0,0.2)";ctx.lineWidth=boomW*2.5;
    [0.35,0.55].forEach(t=>{
      ctx.beginPath();
      ctx.moveTo(pivotX+dx*t-(-dy/len)*boomW*0.3,pivotY+dy*t-(dx/len)*boomW*0.3);
      ctx.lineTo(pivotX+dx*t+(-dy/len)*boomW*0.3,pivotY+dy*t+(dx/len)*boomW*0.3);
      ctx.stroke();
    });
    ctx.lineWidth=1; // reset
  }
  
  // ═══ JIB ═══
  if(cfg.jibEnabled&&jibTipX!==undefined){
    const jDx=jibTipX-boomTipX;const jDy=jibTipY-boomTipY;
    const jLen=Math.sqrt(jDx*jDx+jDy*jDy);
    if(jLen>1){
      const jW=boomW*0.6;
      const jnx=-jDy/jLen*jW;const jny=jDx/jLen*jW;
      ctx.strokeStyle=colors.jib;ctx.lineWidth=Math.max(1,1.5*s);
      // Lattice jib
      ctx.beginPath();ctx.moveTo(boomTipX+jnx,boomTipY+jny);ctx.lineTo(jibTipX+jnx,jibTipY+jny);ctx.stroke();
      ctx.beginPath();ctx.moveTo(boomTipX-jnx,boomTipY-jny);ctx.lineTo(jibTipX-jnx,jibTipY-jny);ctx.stroke();
      const jSegs=Math.max(3,Math.floor(jLen/20));
      ctx.lineWidth=Math.max(0.6,0.8*s);
      for(let i=0;i<jSegs;i++){
        const t=i/jSegs;
        const x=boomTipX+jDx*t;const y=boomTipY+jDy*t;
        ctx.beginPath();ctx.moveTo(x+jnx,y+jny);ctx.lineTo(x-jnx,y-jny);ctx.stroke();
        const t2=(i+1)/jSegs;
        const x2=boomTipX+jDx*t2;const y2=boomTipY+jDy*t2;
        ctx.beginPath();ctx.moveTo(x+jnx,y+jny);ctx.lineTo(x2-jnx,y2-jny);ctx.stroke();
      }
    }
    // Jib tip marker
    ctx.fillStyle=colors.jib;
    ctx.beginPath();ctx.arc(jibTipX,jibTipY,4,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle="rgba(255,255,255,0.6)";ctx.lineWidth=1;
    ctx.beginPath();ctx.arc(jibTipX,jibTipY,4,0,Math.PI*2);ctx.stroke();
  }
  
  // ═══ BOOM TIP MARKER (drag handle) ═══
  ctx.fillStyle=colors.boom;
  ctx.beginPath();ctx.arc(boomTipX,boomTipY,5,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle="white";ctx.lineWidth=1.5;
  ctx.beginPath();ctx.arc(boomTipX,boomTipY,5,0,Math.PI*2);ctx.stroke();
  // Inner dot
  ctx.fillStyle="white";
  ctx.beginPath();ctx.arc(boomTipX,boomTipY,2,0,Math.PI*2);ctx.fill();
  
  // ═══ PIVOT POINT ═══
  ctx.fillStyle=C.red;
  ctx.beginPath();ctx.arc(pivotX,pivotY,4,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle="rgba(255,255,255,0.5)";ctx.lineWidth=1;
  ctx.beginPath();ctx.arc(pivotX,pivotY,4,0,Math.PI*2);ctx.stroke();
  
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
  if(cfg.jibEnabled){
    const effJA=Math.min(cfg.jibAngle,cfg.boomAngle);
    r+=cfg.jibLength*Math.cos(toRad(effJA));
  }
  return Math.max(0,r);
}

function calcHookHeight(cfg){
  const bRad=toRad(cfg.boomAngle);
  let h=cfg.pivotHeight+cfg.boomLength*Math.sin(bRad);
  if(cfg.jibEnabled){
    const effJA=Math.min(cfg.jibAngle,cfg.boomAngle);
    h+=cfg.jibLength*Math.sin(toRad(effJA));
  }
  return h;
}

function calcCap(crane,boomLen,radius){
  if(!crane)return 0;
  const base=crane.maxCap;const maxR=boomLen*1.1;
  if(radius>maxR)return 0;
  const rFactor=1-Math.pow(radius/maxR,1.3);
  const bFactor=1-Math.pow(boomLen/crane.maxBoom,0.8)*0.3;
  return Math.max(0,base*rFactor*bFactor);
}

function calcSlingAngle(slingLength,loadWidth,legs){
  if(legs<2||slingLength<=0||loadWidth<=0)return 0;
  const halfSpan=loadWidth/2;
  if(slingLength<=halfSpan)return 90;
  return toDeg(Math.asin(halfSpan/slingLength));
}

function ptLoad(force,padW,padL){
  const area=padW*padL;
  return area>0?force/area:0;
}

// ═══ UI COMPONENTS ═══
const Card=({children,style,...p})=><div style={{background:C.darkSurf+"E0",borderRadius:10,padding:12,marginBottom:10,border:`1px solid ${C.green}15`,backdropFilter:"blur(8px)",...style}} {...p}>{children}</div>;
const Title=({children,color=C.yellow,style,...p})=><div style={{fontSize:10,fontWeight:800,letterSpacing:2,color,marginBottom:8,fontFamily:F,textTransform:"uppercase",...style}} {...p}>{children}</div>;
const Lbl=({children})=><span style={{fontSize:9,color:C.g300,fontFamily:F}}>{children}</span>;
const Sli=({value,min,max,step=1,onChange,color=C.yellow})=><input type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(+e.target.value)} style={{width:"100%",accentColor:color,height:4}}/>;
const Num=({value,onChange,min,max,step=1,style:s})=><input type="number" value={value} min={min} max={max} step={step} onChange={e=>onChange(+e.target.value)} style={{width:50,background:C.dark,border:`1px solid ${C.green}30`,borderRadius:4,color:C.yellow,textAlign:"center",padding:"2px 4px",fontSize:10,fontFamily:F,...s}}/>;
const Sel=({value,onChange,children,style:s})=><select value={value} onChange={e=>onChange(e.target.value)} style={{width:"100%",background:C.dark,border:`1px solid ${C.green}30`,borderRadius:6,color:C.white,padding:"8px 10px",fontSize:10,fontFamily:F,...s}}>{children}</select>;
const Btn=({children,onClick,color=C.yellow,small,disabled,style:s})=><button onClick={onClick} disabled={disabled} style={{padding:small?"3px 8px":"6px 14px",background:color,border:"none",borderRadius:6,color:C.greenDark,fontWeight:700,fontSize:small?9:10,cursor:disabled?"not-allowed":"pointer",fontFamily:F,opacity:disabled?0.5:1,...s}}>{children}</button>;
const Badge=({children,color=C.yellow})=><span style={{display:"inline-block",padding:"2px 8px",borderRadius:10,background:color+"20",color,fontSize:9,fontWeight:600,fontFamily:F}}>{children}</span>;
const Row=({children,style})=><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6,...style}}>{children}</div>;

// ═══ PDF PREVIEW (simplified) ═══
function PDFPreview({cfg,crane,cap,lp,totalW,hookH,radius,onClose}){
  return(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={onClose}>
    <div style={{background:C.white,borderRadius:12,padding:30,maxWidth:700,width:"100%",maxHeight:"90vh",overflow:"auto",color:"#222"}} onClick={e=>e.stopPropagation()}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div><div style={{fontSize:28,fontWeight:900,color:C.greenDark,letterSpacing:4,fontFamily:F}}>Hangel</div><div style={{fontSize:10,color:"#666"}}>Kaldırma Planı</div></div>
        <div style={{textAlign:"right",fontSize:10,color:"#888"}}><div>{new Date().toLocaleDateString("tr-TR")}</div></div>
      </div>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
        <tbody>
          {[["Tedarikçi",lp.supplier],["Müşteri",lp.client],["İş No",lp.jobNumber],["Proje",lp.jobName],["Adres",lp.jobAddress],["Tarih",lp.jobDate],["Vinç",`${crane?.name} — ${lp.craneMake} ${lp.craneModel}`],["Boom",`${cfg.boomLength}m @ ${cfg.boomAngle}°`],["Menzil / Yükseklik",`${radius.toFixed(1)}m / ${hookH.toFixed(1)}m`],["Kapasite",`${cap.toFixed(1)}t`],["Toplam Yük",`${totalW.toFixed(1)}t`],["Kullanım",`${(cap>0?(totalW/cap*100):0).toFixed(0)}%`]].map(([k,v])=>(
            <tr key={k}><td style={{padding:"6px 8px",borderBottom:"1px solid #eee",fontWeight:600,width:"40%"}}>{k}</td><td style={{padding:"6px 8px",borderBottom:"1px solid #eee"}}>{v}</td></tr>
          ))}
        </tbody>
      </table>
      {lp.notes&&<div style={{marginTop:15,padding:10,background:"#f5f5f5",borderRadius:6,fontSize:10}}><strong>Notlar:</strong> {lp.notes}</div>}
      <div style={{textAlign:"center",marginTop:20}}><Btn onClick={()=>{window.print()}} color={C.green} style={{color:"white"}}>Yazdır / PDF</Btn> <Btn onClick={onClose} color="#ddd" style={{marginLeft:8}}>Kapat</Btn></div>
    </div>
  </div>);
}

// ═══ RANGE CHART CANVAS ═══
function RangeChart({cfg,crane,skin,objects,selObj,setSelObj,rulers,setRulers,tool,setTool,addObj,updObj,delObj,isMobile,craneColors,setDragTarget}){
  const canvasRef=useRef(null);
  const [drag,setDrag]=useState(null);
  const [magnifier,setMagnifier]=useState(null);

  const realRadius=useMemo(()=>calcRadius(cfg),[cfg]);
  const realHookH=useMemo(()=>calcHookHeight(cfg),[cfg]);
  const effectiveJibAngle=cfg.jibEnabled?Math.min(cfg.jibAngle,cfg.boomAngle):0;

  const draw=useCallback(()=>{
    const canvas=canvasRef.current;if(!canvas)return;
    const ctx=canvas.getContext("2d");
    const W=canvas.width=canvas.offsetWidth*(window.devicePixelRatio||1);
    const H=canvas.height=canvas.offsetHeight*(window.devicePixelRatio||1);
    ctx.scale(window.devicePixelRatio||1,window.devicePixelRatio||1);
    const w=canvas.offsetWidth;const h=canvas.offsetHeight;

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
      // Endpoints
      ctx.fillStyle=C.cyan;
      ctx.beginPath();ctx.arc(x1,y1,4,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(x2,y2,4,0,Math.PI*2);ctx.fill();
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

    // Capacity from chart
    const chartInDraw=cfg.chartId?LOAD_CHARTS[cfg.chartId]:null;
    const capVal=chartInDraw?(lookupChart(chartInDraw,cfg.boomLength,realRadius)||calcCap(crane,cfg.boomLength,realRadius)):calcCap(crane,cfg.boomLength,realRadius);
    const capSource=chartInDraw?"chart":"formula";

    // Info box
    ctx.fillStyle=C.dark+"D0";ctx.fillRect(10,10,220,90);
    ctx.strokeStyle=C.green+"40";ctx.lineWidth=1;ctx.strokeRect(10,10,220,90);
    ctx.fillStyle=C.yellow;ctx.font=`bold 11px ${F}`;ctx.textAlign="left";
    ctx.fillText("Hangel",18,28);
    ctx.fillStyle=C.g200;ctx.font=`9px ${F}`;
    ctx.fillText(`${crane?.name||""}`,70,28);
    ctx.fillText(`Boom: ${cfg.boomLength}m @ ${cfg.boomAngle}°`,18,44);
    ctx.fillText(`Menzil: ${realRadius.toFixed(1)}m  Kanca H: ${realHookH.toFixed(1)}m`,18,58);
    ctx.fillText(`Kapasite: ${capVal.toFixed(1)}t`,18,72);
    // Source badge
    if(capSource==="chart"){
      ctx.fillStyle=C.greenLight;ctx.fillText("✓ Yük Tablosundan",18,86);
    } else {
      ctx.fillStyle=C.orange;ctx.fillText("⚠ YAKLAŞIK — Üretici tablosunu kullanın",18,86);
    }

    // Status bar
    const barY=h-22;
    ctx.fillStyle=C.dark+"E0";ctx.fillRect(0,barY,w,22);
    ctx.fillStyle=C.g300;ctx.font=`9px ${F}`;ctx.textAlign="left";
    const items=[`${crane?.name}`,`Boom: ${cfg.boomLength}m @ ${cfg.boomAngle}°`,`R: ${realRadius.toFixed(1)}m`,`H: ${realHookH.toFixed(1)}m`,`Kap: ${capVal.toFixed(1)}t`];
    items.forEach((item,i)=>{
      const badge=i===1;
      ctx.fillStyle=badge?C.yellow:C.g300;
      ctx.fillText(item,10+i*140,barY+14);
    });
    // Interaction hint
    ctx.textAlign="right";ctx.fillStyle=C.g500;
    ctx.fillText("Gövde=Açı | Uç=Uzunluk | Nesne=Taşı/Boyut/Döndür",w-10,barY+14);

  },[cfg,crane,skin,objects,selObj,rulers,tool,magnifier,craneColors,realRadius,realHookH,effectiveJibAngle]);

  useEffect(()=>{draw();},[draw]);
  useEffect(()=>{const onResize=()=>draw();window.addEventListener("resize",onResize);return()=>window.removeEventListener("resize",onResize);},[draw]);

  // ═══ MOUSE/TOUCH INTERACTION ═══
  const getPos=(e)=>{
    const rect=canvasRef.current.getBoundingClientRect();
    const t=e.touches?e.touches[0]:e;
    return{x:t.clientX-rect.left,y:t.clientY-rect.top};
  };

  const handleDown=(e)=>{
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

    // Ruler tool
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
    const pos=getPos(e);

    if(drag.type==="boomTip"){
      // Drag tip = change boom length (distance from pivot)
      const dx=pos.x-drag.pivotX;const dy=drag.pivotY-pos.y;
      const dist=Math.sqrt(dx*dx+dy*dy)/drag.SC;
      const crane=CRANES.find(c=>c.id===cfg.craneType);
      const newLen=clamp(Math.round(dist),5,crane?.maxBoom||100);
      const newAngle=clamp(Math.round(toDeg(Math.atan2(dy,dx))),0,85);
      if(setDragTarget)setDragTarget("boomTip");
      // Update both length and angle when dragging tip
      updFromCanvas({boomLength:newLen,boomAngle:newAngle});
    } else if(drag.type==="jibTip"){
      const dx=pos.x-drag.btX;const dy=drag.btY-pos.y;
      const dist=Math.sqrt(dx*dx+dy*dy)/drag.SC;
      const newLen=clamp(Math.round(dist),2,30);
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
    } else if(drag.type==="moveObj"){
      const newX=(pos.x-drag.offX-drag.pivotX)/drag.SC;
      updObj(drag.objId,{x:Math.max(-10,newX)});
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
    if(window._happCfgUpdate) window._happCfgUpdate(updates);
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

  return(
    <canvas ref={canvasRef} style={{width:"100%",height:"100%",cursor:tool==="ruler"?"crosshair":drag?"grabbing":"default",touchAction:"none",borderRadius:8}}
      onMouseDown={handleDown} onMouseMove={handleMove} onMouseUp={handleUp} onMouseLeave={handleUp}
      onTouchStart={handleDown} onTouchMove={handleMove} onTouchEnd={handleUp}
    />
  );
}

// ═══ MAIN APP COMPONENT ═══
export default function App({onSave,initialData,projectName:extProjectName}){
  const [tab,setTab]=useState("chart");
  const [cfg,setCfg]=useState(initialData?.config||{craneType:"mobile",boomLength:30,boomAngle:45,jibEnabled:false,jibLength:10,jibAngle:15,pivotHeight:2.5,pivotDist:1.2,craneEnd:4,loadWeight:5,counterweight:20,windSpeed:0,skinId:"default",
    loadW:3,loadH:2,loadShape:"box",slingType:"2leg",slingLength:4,slingLegs:2,hookBlockH:1.2,
    chartId:""
  });
  const [objects,setObjects]=useState(initialData?.objects||[]);
  const [selObj,setSelObj]=useState(null);
  const [rulers,setRulers]=useState(initialData?.rulers||[]);
  const [tool,setTool]=useState("select");
  const [lp,setLp]=useState(initialData?.lift_plan||{supplier:"",supplierContact:"",supplierPhone:"",client:"",clientContact:"",clientPhone:"",jobNumber:"",jobName:"",jobAddress:"",jobDate:new Date().toISOString().split("T")[0],craneMake:"",craneModel:"",craneRego:"",linePull:"",partsOfLine:4,cwConfig:"",loadDesc:"",loadWeight:0,riggingWeight:0,hookBlockWeight:0,addWeight:0,wll:0,notes:"",outForce:0,padW:1,padL:1});
  const [calcTab,setCalcTab]=useState("pct");
  const [ci,setCi]=useState({load:0,rigging:0,wll:0,pct:75,outF:0,padW:1,padL:1});
  const [showPDF,setShowPDF]=useState(false);
  const [saveStatus,setSaveStatus]=useState("idle");
  const [mobilePanel,setMobilePanel]=useState("controls");
  const [isMobile,setIsMobile]=useState(typeof window!=="undefined"&&window.innerWidth<768);
  const [craneColors,setCraneColors]=useState({...DEFAULT_CRANE_COLORS});
  const [colorEditPart,setColorEditPart]=useState(null);
  const [dragTarget,setDragTarget]=useState(null);
  const [showObjPanel,setShowObjPanel]=useState(false);

  useEffect(()=>{
    const onResize=()=>setIsMobile(window.innerWidth<768);
    window.addEventListener("resize",onResize);return()=>window.removeEventListener("resize",onResize);
  },[]);

  // Bridge for canvas to update config
  useEffect(()=>{window._happCfgUpdate=(u)=>setCfg(p=>({...p,...u}));return()=>{delete window._happCfgUpdate};},[]);

  const crane=CRANES.find(c2=>c2.id===cfg.craneType);
  const skin=SKINS.find(s=>s.id===cfg.skinId)||SKINS[0];
  const realRadius=useMemo(()=>calcRadius(cfg),[cfg]);
  const realHookH=useMemo(()=>calcHookHeight(cfg),[cfg]);
  const activeChart=cfg.chartId?LOAD_CHARTS[cfg.chartId]:null;
  const cap=activeChart?(lookupChart(activeChart,cfg.boomLength,realRadius)||calcCap(crane,cfg.boomLength,realRadius)):calcCap(crane,cfg.boomLength,realRadius);
  const capSource=activeChart?"chart":"formula";
  const totalW=lp.loadWeight+lp.riggingWeight+lp.hookBlockWeight+lp.addWeight;
  const selObjData=objects.find(o=>o.id===selObj);

  const up=(u)=>setCfg(p=>({...p,...u}));
  const upLP=(k,v)=>setLp(p=>({...p,[k]:v}));
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

  // Calculations
  const pctCalc=ci.wll>0?(ci.load+ci.rigging)/ci.wll*100:0;
  const maxLoadCalc=ci.wll*ci.pct/100;
  const minWllCalc=ci.pct>0?(ci.load+ci.rigging)/ci.pct*100:0;
  const pl=ptLoad(ci.outF,ci.padW,ci.padL);

  // Export: canvas screenshot
  const exportScreenshot=()=>{
    const canvas=document.querySelector("canvas");if(!canvas)return;
    const link=document.createElement("a");
    link.download=`Hangel-${new Date().toISOString().split("T")[0]}.png`;
    link.href=canvas.toDataURL("image/png");
    link.click();
  };

  return(
    <div style={{fontFamily:FB,background:`linear-gradient(135deg,${C.dark} 0%,${C.greenBg} 40%,${C.dark} 100%)`,minHeight:"100vh",color:C.white}}>
      {showPDF&&<PDFPreview cfg={cfg} crane={crane} cap={cap} lp={lp} totalW={totalW} hookH={realHookH} radius={realRadius} onClose={()=>setShowPDF(false)}/>}

      {/* HEADER */}
      <header style={{background:`linear-gradient(90deg,${C.greenDark},${C.green})`,borderBottom:`3px solid ${C.yellow}`,padding:isMobile?"8px 12px":"10px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:6}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <img src={LOGO_DATA} alt="Hangel" style={{width:isMobile?32:42,height:isMobile?32:42,borderRadius:6,objectFit:"contain",flexShrink:0}}/>
          <div>
            <div style={{fontSize:isMobile?16:24,fontWeight:900,letterSpacing:isMobile?3:5,color:C.yellow,fontFamily:F}}>Hangel</div>
            {!isMobile&&<div style={{fontSize:8,color:C.greenLight,letterSpacing:2,fontFamily:F}}>AĞIR YÜK & VİNÇ PLANLAMA SİSTEMİ v4.0</div>}
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          {onSave&&<div onClick={handleSave} style={{display:"flex",alignItems:"center",gap:4,cursor:"pointer",padding:"4px 10px",borderRadius:6,background:saveStatus==="saved"?C.greenLight+"25":saveStatus==="saving"?C.yellow+"25":C.g500+"25"}}>
            <span style={{fontSize:10}}>{saveStatus==="saved"?"✅":saveStatus==="saving"?"🔄":"💾"}</span>
            <span style={{fontSize:9,fontWeight:600,color:saveStatus==="saved"?C.greenLight:saveStatus==="saving"?C.yellow:C.g300,fontFamily:F}}>
              {saveStatus==="saved"?"Kaydedildi":saveStatus==="saving"?"Kaydediliyor...":"Kaydet"}
            </span>
          </div>}
        </div>
        <nav style={{display:"flex",gap:2,background:C.greenDark,borderRadius:8,padding:3,overflowX:"auto",width:"100%",WebkitOverflowScrolling:"touch"}}>
          {TABS.map(t=>(<button key={t.id} onClick={()=>setTab(t.id)} style={{padding:isMobile?"5px 8px":"6px 12px",border:"none",borderRadius:6,background:tab===t.id?C.yellow:"transparent",color:tab===t.id?C.greenDark:C.g300,fontWeight:tab===t.id?700:500,fontSize:isMobile?9:10,cursor:"pointer",fontFamily:F,whiteSpace:"nowrap",flexShrink:0}}>{t.icon}{isMobile?"":" "+t.label}</button>))}
        </nav>
      </header>

      {/* ═══ CHART TAB ═══ */}
      {tab==="chart"&&(
        isMobile?(
        <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 95px)"}}>
          <div style={{flex:1,position:"relative"}}>
            <RangeChart cfg={cfg} crane={crane} skin={skin} objects={objects} selObj={selObj} setSelObj={setSelObj} rulers={rulers} setRulers={setRulers} tool={tool} setTool={setTool} addObj={addObj} updObj={updObj} delObj={delObj} isMobile={isMobile} craneColors={craneColors} setDragTarget={setDragTarget}/>
          </div>
          {/* Mobile panel tabs */}
          <div style={{display:"flex",gap:2,padding:"4px 6px",background:C.darkSurf}}>
            {["controls","objects","capacity"].map(p=>(<button key={p} onClick={()=>setMobilePanel(p)} style={{flex:1,padding:"4px",border:"none",borderRadius:4,background:mobilePanel===p?C.yellow:"transparent",color:mobilePanel===p?C.greenDark:C.g400,fontSize:8,fontWeight:600,cursor:"pointer",fontFamily:F}}>{p==="controls"?"Kontroller":p==="objects"?"Nesneler":"Kapasite"}</button>))}
          </div>
          <div style={{height:220,overflow:"auto",padding:8,background:C.dark}}>
            {mobilePanel==="controls"&&(
              <div>
                <Row><Lbl>Vinç</Lbl></Row>
                <Sel value={cfg.craneType} onChange={v=>up({craneType:v})}>{CRANES.map(c2=><option key={c2.id} value={c2.id}>{c2.name} ({c2.maxCap}t)</option>)}</Sel>
                <Row style={{marginTop:8}}><Lbl>Boom: {cfg.boomLength}m</Lbl><Num value={cfg.boomLength} onChange={v=>up({boomLength:v})} min={5} max={crane?.maxBoom||100}/></Row>
                <Sli value={cfg.boomLength} min={5} max={crane?.maxBoom||100} onChange={v=>up({boomLength:v})}/>
                <Row><Lbl>Açı: {cfg.boomAngle}°</Lbl><Num value={cfg.boomAngle} onChange={v=>up({boomAngle:v})} min={0} max={85}/></Row>
                <Sli value={cfg.boomAngle} min={0} max={85} onChange={v=>up({boomAngle:v})} color={C.greenLight}/>
                <Row><Lbl>Jib</Lbl><input type="checkbox" checked={cfg.jibEnabled} onChange={e=>up({jibEnabled:e.target.checked})}/></Row>
              </div>
            )}
            {mobilePanel==="objects"&&(
              <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                {OBJ_TYPES.map(o=><button key={o.id} onClick={()=>addObj(o.id)} style={{padding:"4px 8px",background:C.green+"30",border:`1px solid ${C.green}40`,borderRadius:6,color:C.g200,fontSize:8,cursor:"pointer"}}>{o.icon} {o.name}</button>)}
              </div>
            )}
            {mobilePanel==="capacity"&&(
              <div>
                <Row><Lbl>Menzil</Lbl><span style={{color:C.yellow,fontSize:10,fontFamily:F}}>{realRadius.toFixed(1)}m</span></Row>
                <Row><Lbl>Kanca H</Lbl><span style={{color:C.yellow,fontSize:10,fontFamily:F}}>{realHookH.toFixed(1)}m</span></Row>
                <Row><Lbl>Kapasite</Lbl><span style={{color:capSource==="chart"?C.greenLight:C.orange,fontSize:10,fontFamily:F}}>{cap.toFixed(1)}t</span></Row>
              </div>
            )}
          </div>
        </div>
        ):(
        /* ═══ DESKTOP LAYOUT ═══ */
        <div style={{display:"flex",height:"calc(100vh - 95px)"}}>
          {/* LEFT PANEL */}
          <div style={{width:280,overflow:"auto",padding:12,background:C.dark+"80",borderRight:`1px solid ${C.green}15`}}>
            {/* Crane type */}
            <Card>
              <Title>Vinç Tipi</Title>
              <Sel value={cfg.craneType} onChange={v=>up({craneType:v})}>{CRANES.map(c2=><option key={c2.id} value={c2.id}>{c2.name} ({c2.maxCap}t)</option>)}</Sel>
              <div style={{marginTop:8}}><Title color={capSource==="chart"?C.greenLight:C.orange}>Yük Tablosu</Title></div>
              <Sel value={cfg.chartId} onChange={v=>up({chartId:v})}>
                <option value="">Yaklaşık Formül</option>
                {Object.entries(LOAD_CHARTS).map(([k,ch])=><option key={k} value={k}>{ch.name} ({ch.maxCap}t)</option>)}
              </Sel>
              {cfg.chartId&&<div style={{fontSize:8,color:C.greenLight,marginTop:4}}>✓ Gerçek yük tablosu aktif</div>}
            </Card>

            {/* Boom */}
            <Card>
              <Title>Boom</Title>
              <Row><Lbl>Uzunluk</Lbl><Num value={cfg.boomLength} onChange={v=>up({boomLength:v})} min={5} max={crane?.maxBoom||100}/></Row>
              <Sli value={cfg.boomLength} min={5} max={crane?.maxBoom||100} onChange={v=>up({boomLength:v})}/>
              <Row><Lbl>Açı</Lbl><Num value={cfg.boomAngle} onChange={v=>up({boomAngle:v})} min={0} max={85}/></Row>
              <Sli value={cfg.boomAngle} min={0} max={85} onChange={v=>up({boomAngle:v})} color={C.greenLight}/>
              <Row><Lbl>Jib Aktif</Lbl><input type="checkbox" checked={cfg.jibEnabled} onChange={e=>up({jibEnabled:e.target.checked})}/></Row>
              {cfg.jibEnabled&&(<>
                <Row><Lbl>Jib Uzunluk</Lbl><Num value={cfg.jibLength} onChange={v=>up({jibLength:v})} min={2} max={30}/></Row>
                <Sli value={cfg.jibLength} min={2} max={30} onChange={v=>up({jibLength:v})} color={C.orange}/>
                <Row><Lbl>Jib Açı</Lbl><Num value={cfg.jibAngle} onChange={v=>up({jibAngle:v})} min={0} max={cfg.boomAngle}/></Row>
                <Sli value={cfg.jibAngle} min={0} max={cfg.boomAngle} onChange={v=>up({jibAngle:v})} color={C.orange}/>
              </>)}
            </Card>

            {/* Crane Geometry */}
            <Card>
              <Title>Vinç Geometrisi</Title>
              <Row><Lbl>Pivot Yüksekliği</Lbl><Num value={cfg.pivotHeight} onChange={v=>up({pivotHeight:v})} min={0.5} max={50} step={0.1}/></Row>
              <Sli value={cfg.pivotHeight} min={0.5} max={crane?.cat==="tower"?50:5} step={0.1} onChange={v=>up({pivotHeight:v})} color={C.g400}/>
              <Row><Lbl>Pivot Mesafesi</Lbl><Num value={cfg.pivotDist} onChange={v=>up({pivotDist:v})} min={0} max={5} step={0.1}/></Row>
              <Sli value={cfg.pivotDist} min={0} max={5} step={0.1} onChange={v=>up({pivotDist:v})} color={C.cyan}/>
              <Row><Lbl>Vinç Sonu</Lbl><Num value={cfg.craneEnd} onChange={v=>up({craneEnd:v})} min={0} max={15} step={0.5}/></Row>
              <Sli value={cfg.craneEnd} min={0} max={15} step={0.5} onChange={v=>up({craneEnd:v})} color={C.red}/>
            </Card>

            {/* Crane Color Customization */}
            <Card>
              <Title>Vinç Renkleri</Title>
              <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                {Object.entries(craneColors).map(([part,color])=>(
                  <div key={part} onClick={()=>setColorEditPart(colorEditPart===part?null:part)} 
                    style={{padding:"3px 8px",borderRadius:4,background:colorEditPart===part?C.yellow+"30":C.dark,border:`2px solid ${color}`,cursor:"pointer",fontSize:8,color:C.g300}}>
                    {part}
                  </div>
                ))}
              </div>
              {colorEditPart&&(
                <div style={{marginTop:6}}>
                  <input type="color" value={craneColors[colorEditPart]} onChange={e=>setCraneColors(p=>({...p,[colorEditPart]:e.target.value}))} style={{width:"100%",height:30,border:"none",borderRadius:4,cursor:"pointer"}}/>
                  <Btn small onClick={()=>{setCraneColors({...DEFAULT_CRANE_COLORS});setColorEditPart(null);}} style={{marginTop:4,width:"100%"}} color={C.g500}>Sıfırla</Btn>
                </div>
              )}
            </Card>

            {/* Yük & Koşullar */}
            <Card>
              <Title>Yük & Koşullar</Title>
              <Row><Lbl>Yük Ağırlığı (t)</Lbl><Num value={cfg.loadWeight} onChange={v=>up({loadWeight:v})} min={0} max={999} step={0.5}/></Row>
              <Row><Lbl>Rüzgar (km/h)</Lbl><Num value={cfg.windSpeed} onChange={v=>up({windSpeed:v})} min={0} max={100}/></Row>
              <Row><Lbl>Karşı Ağırlık (t)</Lbl><Num value={cfg.counterweight} onChange={v=>up({counterweight:v})} min={0} max={200}/></Row>
            </Card>

            {/* Tema */}
            <Card>
              <Title>Tema</Title>
              <Sel value={cfg.skinId} onChange={v=>up({skinId:v})}>{SKINS.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</Sel>
            </Card>
          </div>

          {/* CENTER: CANVAS */}
          <div style={{flex:1,position:"relative"}}>
            <RangeChart cfg={cfg} crane={crane} skin={skin} objects={objects} selObj={selObj} setSelObj={setSelObj} rulers={rulers} setRulers={setRulers} tool={tool} setTool={setTool} addObj={addObj} updObj={updObj} delObj={delObj} isMobile={isMobile} craneColors={craneColors} setDragTarget={setDragTarget}/>
            {/* Drag hint */}
            {dragTarget==="boomTip"&&<div style={{position:"absolute",top:10,left:"50%",transform:"translateX(-50%)",background:C.yellow+"DD",color:C.greenDark,padding:"4px 12px",borderRadius:20,fontSize:10,fontWeight:700,fontFamily:F,pointerEvents:"none"}}>Boom ucu sürükleniyor — bırak için bırak</div>}
            {/* Tool bar */}
            <div style={{position:"absolute",bottom:30,left:"50%",transform:"translateX(-50%)",display:"flex",gap:4,background:C.dark+"E0",borderRadius:8,padding:4,border:`1px solid ${C.green}30`}}>
              <Btn small onClick={()=>setTool("select")} color={tool==="select"?C.yellow:C.g500}>Seç</Btn>
              <Btn small onClick={()=>setTool("ruler")} color={tool==="ruler"?C.cyan:C.g500}>📏 Cetvel</Btn>
              <Btn small onClick={()=>setShowObjPanel(!showObjPanel)} color={showObjPanel?C.orange:C.g500}>📦 Nesne</Btn>
              {rulers.length>0&&<Btn small onClick={()=>setRulers([])} color={C.red}>🗑 Cetvelleri Sil</Btn>}
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
                {OBJ_TYPES.slice(0,8).map(o=><button key={o.id} onClick={()=>addObj(o.id)} style={{padding:"3px 8px",background:C.green+"20",border:`1px solid ${C.green}30`,borderRadius:6,color:C.g200,fontSize:8,cursor:"pointer"}}>+{o.name}</button>)}
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
                    <label style={{fontSize:8,color:C.g300,display:"flex",alignItems:"center",gap:3}}>
                      <input type="checkbox" checked={selObjData.showTop||false} onChange={e=>updObj(selObj,{showTop:e.target.checked})}/> Üst Çizgide Göster
                    </label>
                  </Row>
                  <Row>
                    <label style={{fontSize:8,color:C.g300,display:"flex",alignItems:"center",gap:3}}>
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

            {/* Capacity Table */}
            <Card>
              <Title color={capSource==="chart"?C.greenLight:C.orange}>Kapasite Tablosu</Title>
              {capSource==="formula"&&<div style={{fontSize:8,color:C.orange,marginBottom:6}}>⚠ YAKLAŞIK — Üretici tablosu ile doğrulayın</div>}
              <div style={{maxHeight:200,overflow:"auto"}}>
                <table style={{width:"100%",fontSize:8,borderCollapse:"collapse"}}>
                  <thead><tr><th style={{textAlign:"left",color:C.g400,padding:2}}>Menzil</th><th style={{textAlign:"right",color:C.g400,padding:2}}>Kapasite</th></tr></thead>
                  <tbody>{[5,10,15,20,25,30,35,40,45,50].filter(r=>r<=cfg.boomLength*1.2).map(r=>{
                    const c2=activeChart?(lookupChart(activeChart,cfg.boomLength,r)||calcCap(crane,cfg.boomLength,r)):calcCap(crane,cfg.boomLength,r);
                    const isNear=Math.abs(r-realRadius)<2.5;
                    return<tr key={r} style={{background:isNear?C.yellow+"15":"transparent"}}><td style={{padding:"2px 4px",color:isNear?C.yellow:C.g300}}>{r}m</td><td style={{padding:"2px 4px",textAlign:"right",color:c2<cfg.loadWeight?C.red:C.greenLight,fontWeight:isNear?700:400}}>{c2.toFixed(1)}t</td></tr>;
                  })}</tbody>
                </table>
              </div>
            </Card>

            {/* Safety */}
            <Card>
              <Title>Güvenlik</Title>
              {[
                ["Kapasite",cap>=cfg.loadWeight],
                ["Rüzgar",cfg.windSpeed<50],
                ["Sapan Açısı",calcSlingAngle(cfg.slingLength,cfg.loadW,cfg.slingLegs)<=45],
              ].map(([name,ok])=>(
                <Row key={name}><Lbl>{name}</Lbl><span style={{fontSize:9,color:ok?C.greenLight:C.red,fontWeight:700}}>{ok?"✅ GÜVENLİ":"❌ TEHLİKE"}</span></Row>
              ))}
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

      {/* ═══ LIFT PLAN TAB ═══ */}
      {tab==="liftplan"&&(
        <div style={{maxWidth:800,margin:"0 auto",padding:20}}>
          <Card><Title>Tedarikçi Bilgileri</Title>
            {[["supplier","Firma"],["supplierContact","İlgili Kişi"],["supplierPhone","Telefon"]].map(([k,l])=>(
              <Row key={k}><Lbl>{l}</Lbl><input value={lp[k]} onChange={e=>upLP(k,e.target.value)} style={{flex:1,background:C.dark,border:`1px solid ${C.green}30`,borderRadius:4,color:C.white,padding:"4px 8px",fontSize:10,fontFamily:F}}/></Row>
            ))}
          </Card>
          <Card><Title>Müşteri Bilgileri</Title>
            {[["client","Firma"],["clientContact","İlgili Kişi"],["clientPhone","Telefon"]].map(([k,l])=>(
              <Row key={k}><Lbl>{l}</Lbl><input value={lp[k]} onChange={e=>upLP(k,e.target.value)} style={{flex:1,background:C.dark,border:`1px solid ${C.green}30`,borderRadius:4,color:C.white,padding:"4px 8px",fontSize:10,fontFamily:F}}/></Row>
            ))}
          </Card>
          <Card><Title>İş Bilgileri</Title>
            {[["jobNumber","İş No"],["jobName","Proje Adı"],["jobAddress","Adres"],["jobDate","Tarih"]].map(([k,l])=>(
              <Row key={k}><Lbl>{l}</Lbl><input value={lp[k]} onChange={e=>upLP(k,e.target.value)} type={k==="jobDate"?"date":"text"} style={{flex:1,background:C.dark,border:`1px solid ${C.green}30`,borderRadius:4,color:C.white,padding:"4px 8px",fontSize:10,fontFamily:F}}/></Row>
            ))}
          </Card>
          <Card><Title>Vinç Bilgileri</Title>
            {[["craneMake","Marka"],["craneModel","Model"],["craneRego","Plaka/Seri No"]].map(([k,l])=>(
              <Row key={k}><Lbl>{l}</Lbl><input value={lp[k]} onChange={e=>upLP(k,e.target.value)} style={{flex:1,background:C.dark,border:`1px solid ${C.green}30`,borderRadius:4,color:C.white,padding:"4px 8px",fontSize:10,fontFamily:F}}/></Row>
            ))}
            <Row><Lbl>Hat Çekme Kuvveti</Lbl><Num value={lp.linePull} onChange={v=>upLP("linePull",v)} min={0} max={100} step={0.1}/></Row>
            <Row><Lbl>Parts of Line</Lbl><Num value={lp.partsOfLine} onChange={v=>upLP("partsOfLine",v)} min={1} max={16}/></Row>
            <Row><Lbl>Karşı Ağ. Konfig</Lbl><input value={lp.cwConfig} onChange={e=>upLP("cwConfig",e.target.value)} style={{flex:1,background:C.dark,border:`1px solid ${C.green}30`,borderRadius:4,color:C.white,padding:"4px 8px",fontSize:10,fontFamily:F}}/></Row>
          </Card>
          <Card><Title>Yük Detayları</Title>
            <Row><Lbl>Yük Tanımı</Lbl></Row>
            <input value={lp.loadDesc} onChange={e=>upLP("loadDesc",e.target.value)} style={{width:"100%",background:C.dark,border:`1px solid ${C.green}30`,borderRadius:4,color:C.white,padding:"6px 8px",fontSize:10,fontFamily:F,marginBottom:8,boxSizing:"border-box"}}/>
            <Row><Lbl>Yük Ağırlığı (t)</Lbl><Num value={lp.loadWeight} onChange={v=>upLP("loadWeight",v)} min={0} max={999} step={0.1}/></Row>
            <Row><Lbl>Rigging Ağırlığı (t)</Lbl><Num value={lp.riggingWeight} onChange={v=>upLP("riggingWeight",v)} min={0} max={50} step={0.1}/></Row>
            <Row><Lbl>Hook Block (t)</Lbl><Num value={lp.hookBlockWeight} onChange={v=>upLP("hookBlockWeight",v)} min={0} max={20} step={0.1}/></Row>
            <Row><Lbl>Ek Yükler (t)</Lbl><Num value={lp.addWeight} onChange={v=>upLP("addWeight",v)} min={0} max={50} step={0.1}/></Row>
            <div style={{padding:8,background:C.yellow+"15",borderRadius:6,marginTop:8}}>
              <Row><span style={{fontSize:10,fontWeight:700,color:C.yellow}}>Toplam: {totalW.toFixed(1)}t</span><span style={{fontSize:10,fontWeight:700,color:cap>=totalW?C.greenLight:C.red}}>Kap: {cap.toFixed(1)}t ({(cap>0?(totalW/cap*100):0).toFixed(0)}%)</span></Row>
            </div>
          </Card>
          <Card><Title>Notlar</Title>
            <textarea value={lp.notes} onChange={e=>upLP("notes",e.target.value)} rows={3} style={{width:"100%",background:C.dark,border:`1px solid ${C.green}30`,borderRadius:6,color:C.white,padding:"8px",fontSize:10,fontFamily:F,resize:"vertical",boxSizing:"border-box"}}/>
          </Card>
          <Btn onClick={()=>setShowPDF(true)} color={C.yellow} style={{width:"100%",padding:12,fontSize:12}}>📋 Kaldırma Planı Önizle</Btn>
        </div>
      )}

      {/* ═══ CALCULATIONS TAB ═══ */}
      {tab==="calc"&&(
        <div style={{maxWidth:600,margin:"0 auto",padding:20}}>
          <div style={{display:"flex",gap:4,marginBottom:16}}>
            {[["pct","% Tablosu"],["maxload","Max Yük"],["minwll","Min WLL"],["ptload","Zemin Basıncı"]].map(([id,label])=>(
              <Btn key={id} onClick={()=>setCalcTab(id)} color={calcTab===id?C.yellow:C.g500} small>{label}</Btn>
            ))}
          </div>
          {calcTab==="pct"&&(
            <Card>
              <Title>Tablonun Yüzde Kaçında Çalışıyorsunuz?</Title>
              <Row><Lbl>Yük + Rigging (t)</Lbl><Num value={ci.load} onChange={v=>upCI("load",v)} min={0} max={999} step={0.1}/></Row>
              <Row><Lbl>Rigging (t)</Lbl><Num value={ci.rigging} onChange={v=>upCI("rigging",v)} min={0} max={100} step={0.1}/></Row>
              <Row><Lbl>WLL (t)</Lbl><Num value={ci.wll} onChange={v=>upCI("wll",v)} min={0} max={999} step={0.1}/></Row>
              <div style={{padding:12,background:pctCalc>100?C.red+"20":pctCalc>75?C.yellow+"20":C.greenLight+"20",borderRadius:8,marginTop:12,textAlign:"center"}}>
                <span style={{fontSize:24,fontWeight:900,color:pctCalc>100?C.red:pctCalc>75?C.yellow:C.greenLight,fontFamily:F}}>{pctCalc.toFixed(1)}%</span>
              </div>
            </Card>
          )}
          {calcTab==="maxload"&&(
            <Card>
              <Title>Max Yük @ Derating (%)</Title>
              <Row><Lbl>WLL (t)</Lbl><Num value={ci.wll} onChange={v=>upCI("wll",v)} min={0} max={999} step={0.1}/></Row>
              <Row><Lbl>Tablo Yüzdesi (%)</Lbl><Num value={ci.pct} onChange={v=>upCI("pct",v)} min={1} max={100}/></Row>
              <div style={{padding:12,background:C.yellow+"20",borderRadius:8,marginTop:12,textAlign:"center"}}>
                <span style={{fontSize:10,color:C.g300}}>Max Yük =</span><br/>
                <span style={{fontSize:24,fontWeight:900,color:C.yellow,fontFamily:F}}>{maxLoadCalc.toFixed(1)}t</span>
              </div>
            </Card>
          )}
          {calcTab==="minwll"&&(
            <Card>
              <Title>Min WLL @ Derating (%)</Title>
              <Row><Lbl>Yük + Rigging (t)</Lbl><Num value={ci.load} onChange={v=>upCI("load",v)} min={0} max={999} step={0.1}/></Row>
              <Row><Lbl>Rigging (t)</Lbl><Num value={ci.rigging} onChange={v=>upCI("rigging",v)} min={0} max={100} step={0.1}/></Row>
              <Row><Lbl>Tablo Yüzdesi (%)</Lbl><Num value={ci.pct} onChange={v=>upCI("pct",v)} min={1} max={100}/></Row>
              <div style={{padding:12,background:C.orange+"20",borderRadius:8,marginTop:12,textAlign:"center"}}>
                <span style={{fontSize:10,color:C.g300}}>Min WLL =</span><br/>
                <span style={{fontSize:24,fontWeight:900,color:C.orange,fontFamily:F}}>{minWllCalc.toFixed(1)}t</span>
              </div>
            </Card>
          )}
          {calcTab==="ptload"&&(
            <Card>
              <Title>Zemin Basıncı (Point Load)</Title>
              <Row><Lbl>Outrigger Kuvveti (t)</Lbl><Num value={ci.outF} onChange={v=>upCI("outF",v)} min={0} max={500} step={0.5}/></Row>
              <Row><Lbl>Pad Genişliği (m)</Lbl><Num value={ci.padW} onChange={v=>upCI("padW",v)} min={0.1} max={5} step={0.1}/></Row>
              <Row><Lbl>Pad Uzunluğu (m)</Lbl><Num value={ci.padL} onChange={v=>upCI("padL",v)} min={0.1} max={5} step={0.1}/></Row>
              <div style={{padding:12,background:C.cyan+"20",borderRadius:8,marginTop:12,textAlign:"center"}}>
                <span style={{fontSize:10,color:C.g300}}>Zemin Basıncı =</span><br/>
                <span style={{fontSize:24,fontWeight:900,color:C.cyan,fontFamily:F}}>{pl.toFixed(1)} t/m²</span>
                <br/><span style={{fontSize:10,color:C.g400}}>{(pl*9.81).toFixed(1)} kPa</span>
              </div>
            </Card>
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
              const a=document.createElement("a");a.href=url;a.download=`Hangel-${new Date().toISOString().split("T")[0]}.json`;a.click();
              URL.revokeObjectURL(url);
            }} color={C.cyan} style={{width:"100%",padding:12,color:"white"}}>💾 Proje JSON İndir</Btn>
          </Card>
        </div>
      )}
    </div>
  );
}
