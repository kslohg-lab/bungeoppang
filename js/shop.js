/* ===== 붕어빵 가게: 화면·저장·꾸미기 (굽기 규칙은 위의 BP2 그대로) ===== */
(()=>{
if(typeof CanvasRenderingContext2D!=='undefined'&&!CanvasRenderingContext2D.prototype.roundRect)CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){r=Math.min(r||0,w/2,h/2);this.moveTo(x+r,y);this.arcTo(x+w,y,x+w,y+h,r);this.arcTo(x+w,y+h,x,y+h,r);this.arcTo(x,y+h,x,y,r);this.arcTo(x,y,x+w,y,r);this.closePath()};
const B=BP2,R=B.R,W=450,H=800,$=id=>document.getElementById(id),cv=$('cv'),cx=cv.getContext('2d'),fmt=B.fmt,KEY='bpShopPubV1';
/* ---------- 꾸미기 목록 (p=가격, g=필요한 가게 등급, st=필요한 ⭐, 가격 0이고 st가 있으면 ⭐ 보상) ---------- */
const SIGN=[{n:'나무 간판',e:'🪵',p:0,g:0},{n:'리본 간판',e:'🎀',p:900,g:0},{n:'칠판 간판',e:'📝',p:2800,g:1},{n:'네온 간판',e:'💜',p:9000,g:2},{n:'금박 간판',e:'🥇',p:32000,g:3},{n:'무지개 간판',e:'🌈',p:95000,g:4},{n:'황금 왕관 간판',e:'👑',p:300000,g:5},{n:'별빛 간판',e:'✨',p:0,g:0,st:60}];
const AWN=[{n:'빨강 줄무늬',e:'🟥',p:0,g:0},{n:'파랑 줄무늬',e:'🟦',p:700,g:0},{n:'초록 줄무늬',e:'🟩',p:700,g:0},{n:'분홍 물방울',e:'🩷',p:2200,g:1},{n:'노랑 줄무늬',e:'🟨',p:2200,g:1},{n:'무지개 차양',e:'🌈',p:11000,g:2},{n:'별빛 차양',e:'⭐',p:45000,g:3},{n:'벚꽃 차양',e:'🌸',p:140000,g:4},{n:'황금 장막',e:'🏅',p:380000,g:5}];
const WALL=[{n:'크림 벽',e:'⬜',p:0,g:0,c:'#fff3dc'},{n:'하늘색 벽',e:'🟦',p:600,g:0,c:'#d8ecff'},{n:'민트 벽',e:'🟩',p:600,g:0,c:'#d8f5e4'},{n:'분홍 벽',e:'🩷',p:1500,g:0,c:'#ffdce8'},{n:'벽돌 벽',e:'🧱',p:3800,g:1,c:'#c8664a'},{n:'나무판자 벽',e:'🪵',p:9500,g:2,c:'#c89a64'},{n:'타일 벽',e:'🔲',p:28000,g:3,c:'#f2f2ee'},{n:'대리석 벽',e:'🏛️',p:90000,g:4,c:'#ece8e4'},{n:'황금빛 벽',e:'🌟',p:260000,g:5,c:'#f6dc7a'}];
const FLOOR=[{n:'시멘트 바닥',e:'⬜',p:0,g:0},{n:'체크무늬 바닥',e:'🏁',p:1400,g:0},{n:'나무 바닥',e:'🪵',p:4800,g:1},{n:'잔디',e:'🌱',p:11000,g:2},{n:'돌길',e:'🪨',p:36000,g:3},{n:'레드카펫',e:'🟥',p:110000,g:4},{n:'별빛 유리 바닥',e:'💎',p:320000,g:5}];
const SIDE=[{n:'없음',e:'➖',p:0,g:0},{n:'화분',e:'🪴',p:700,g:0,sz:56},{n:'벤치',e:'🪑',p:2600,g:1,sz:60},{n:'등불',e:'🏮',p:5200,g:1,sz:66},{n:'나무',e:'🌳',p:9800,g:2,sz:96},{n:'자전거',e:'🚲',p:14000,g:2,sz:64},{n:'분수',e:'⛲',p:42000,g:3,sz:96},{n:'회전목마',e:'🎠',p:150000,g:4,sz:104},{n:'작은 타워',e:'🗼',p:320000,g:5,sz:124},{n:'대관람차',e:'🎡',p:600000,g:6,sz:134}];
const MAS=[{n:'없음',e:'➖',p:0,g:0},{n:'강아지',e:'🐶',p:2400,g:0},{n:'고양이',e:'🐱',p:2400,g:0},{n:'토끼',e:'🐰',p:5200,g:1},{n:'판다',e:'🐼',p:16000,g:2},{n:'여우',e:'🦊',p:26000,g:2},{n:'사자',e:'🦁',p:52000,g:3},{n:'용',e:'🐉',p:210000,g:4},{n:'유니콘',e:'🦄',p:420000,g:5},{n:'황금 붕어',e:'🌟',p:0,g:0,st:100}];
const LIT=[{n:'없음',e:'➖',p:0,g:0},{n:'전구줄',e:'💡',p:3200,g:1},{n:'별 조명',e:'⭐',p:12000,g:2},{n:'네온 불빛',e:'🌃',p:41000,g:3},{n:'샹들리에',e:'🔮',p:150000,g:4},{n:'오로라 조명',e:'🌌',p:520000,g:6}];
const SKY=[{n:'맑은 낮',e:'☀️',p:0,g:0},{n:'노을',e:'🌇',p:3000,g:0},{n:'별밤',e:'🌙',p:10500,g:1},{n:'눈 내리는 거리',e:'❄️',p:36000,g:2},{n:'벚꽃 거리',e:'🌸',p:72000,g:3},{n:'단풍 거리',e:'🍁',p:72000,g:3},{n:'오로라 밤',e:'🌌',p:250000,g:5},{n:'무지개 낮',e:'🌈',p:0,g:0,st:40}];
const TOP=[{n:'없음',e:'➖',p:0,g:0},{n:'잉어 깃발 줄',e:'🎏',p:2000,g:0},{n:'풍선 아치',e:'🎈',p:6500,g:1},{n:'대형 붕어 조형물',e:'🐟',p:24000,g:2},{n:'LED 전광판',e:'🪧',p:60000,g:3},{n:'황금 왕관 장식',e:'👑',p:200000,g:4},{n:'불꽃놀이',e:'🎆',p:450000,g:5}];
const MSH=[{n:'붕어 틀',e:'🐟',p:0,g:0},{n:'동그라미 틀',e:'⚪',p:800,g:0},{n:'네모 틀',e:'🟧',p:1500,g:0},{n:'세모 틀',e:'🔺',p:2600,g:1},{n:'하트 틀',e:'💗',p:6000,g:1},{n:'별 틀',e:'⭐',p:14000,g:2},{n:'곰돌이 틀',e:'🐻',p:38000,g:3},{n:'구름 틀',e:'☁️',p:90000,g:4},{n:'왕관 틀',e:'👑',p:240000,g:5}];
const SLOTS=[{k:'sign',n:'간판',L:SIGN},{k:'shape',n:'틀 모양',L:MSH},{k:'top',n:'지붕 장식',L:TOP},{k:'awn',n:'차양',L:AWN},{k:'wall',n:'벽',L:WALL},{k:'floor',n:'바닥',L:FLOOR},{k:'sL',n:'왼쪽 장식',L:SIDE},{k:'sR',n:'오른쪽 장식',L:SIDE},{k:'mas',n:'마스코트',L:MAS},{k:'lit',n:'조명',L:LIT},{k:'sky',n:'하늘',L:SKY}];
const GR=[{n:'노점',e:'🛒',at:0},{n:'골목 가게',e:'🏠',at:60},{n:'동네 맛집',e:'🍴',at:250},{n:'줄 서는 가게',e:'🚶',at:700},{n:'소문난 명가',e:'🏮',at:1500},{n:'전국구 맛집',e:'🌏',at:3000},{n:'전설의 가게',e:'👑',at:6000}];
const charmOf=it=>{const v=it.p>0?it.p:(it.st?it.st*1500:0);return v>0?Math.floor(Math.log2(v/200+1)):0};
/* ---------- 저장 ---------- */
const DEF=()=>({v:1,name:'',seed:(Math.random()*4294967296)>>>0,coins:0,day:1,up:{mold:0,speed:0,auto:0,pat:0,deco:0,loc:0},nf:1,nfUse:1,fu:[0,0,0,0,0,0],served:0,days:0,stars:0,dex:{},dexS:{},dexAll:0,own:{shape:[0],top:[0],sign:[0],awn:[0],wall:[0],floor:[0],sL:[0],sR:[0],mas:[0],lit:[0],sky:[0]},eq:{shape:0,top:0,sign:0,awn:0,wall:0,floor:0,sL:0,sR:0,mas:0,lit:0,sky:0},avg:0,bestNet:0,bestCombo:0,snd:true,fur:null,inv:{},room:4});
let save=DEF();try{const o=JSON.parse(localStorage.getItem(KEY));if(o&&typeof o==='object'){save=Object.assign(DEF(),o);save.up=Object.assign(DEF().up,o.up);save.own=Object.assign(DEF().own,o.own);save.eq=Object.assign(DEF().eq,o.eq);if(!save.dex)save.dex={};if(!Array.isArray(save.fu))save.fu=[0,0,0,0,0,0];if(!save.inv||typeof save.inv!=='object')save.inv={};if(!(save.room>=4))save.room=4;if(!save.dexS)save.dexS={}}}catch(e){}
const store=()=>{try{localStorage.setItem(KEY,JSON.stringify(save))}catch(e){}};
/* 처음 가구: 새 가게(또는 업데이트 전 가게)에 탁자·의자 2개·화분을 놓아 드려요 */
const starter=()=>{if(Array.isArray(save.fur))return;save.inv=Object.assign({chair:2,table:1,plant:1},save.inv);save.fur=[{k:'table',x:0,y:2,d:0},{k:'chair',x:0,y:3,d:1},{k:'chair',x:1,y:2,d:1},{k:'plant',x:0,y:1,d:0}];store()};starter();
const gradeOf=n=>{let g=0;for(let i=0;i<GR.length;i++)if(n>=GR[i].at)g=i;return g};
const grade=()=>gradeOf(save.served);
const eqIt=(k,pv)=>{const sl=SLOTS.find(x=>x.k===k);const id=pv&&pv.k===k?pv.id:save.eq[k];return sl.L[id]||sl.L[0]};
const charm=()=>SLOTS.reduce((a,s)=>a+charmOf(eqIt(s.k)),0)+(save.fur||[]).reduce((a,it)=>{const f=IS.FK[it.k];return a+(f?charmOf(f):0)},0);
const charmBonus=()=>Math.min(.25,charm()*.0023);
const nm=()=>save.name||'붕어빵';
/* ---------- 상태 ---------- */
let scr='home',paused=false,acc=0,last=0,run=null,s=null,ui={ft:[],pa:[],rb:0,ma:[],tp:[],fly:[],coin:[],shake:0,hud:0},prev=null,dtab=0,goals=[],bg=null;
const walk=[0,1,2,3].map(i=>({off:i*131,sp:22+i*7,an:R.an[(i*3+1)%12]}));
const show=n=>{['hm','dc','up','res','pause','set','col','nm'].forEach(i=>$(i).style.display=i===n?'block':'none');$('home2').style.display=scr==='game'?'block':'none'};
function toast(t){const e=$('toast');e.textContent=t;e.style.opacity=1;clearTimeout(toast.h);toast.h=setTimeout(()=>e.style.opacity=0,1800)}
const esc=t=>String(t).replace(/[<>&"]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]));
function ask(btn,label,fn){if(btn.dataset.a!=='1'){btn.dataset.a='1';btn.dataset.o=btn.textContent;btn.textContent=label;setTimeout(()=>{if(btn.dataset.a==='1'){btn.dataset.a='0';btn.textContent=btn.dataset.o}},3000)}else{btn.dataset.a='0';btn.textContent=btn.dataset.o;fn()}}
/* ---------- 소리 ---------- */
let AC;const au=()=>{if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}}if(AC&&AC.state==='suspended')AC.resume();return AC};
function tone(f,d,ty='sine',v=.14,t0=0,f2){if(!save.snd)return;const a=au();if(!a)return;const o=a.createOscillator(),g=a.createGain(),t=a.currentTime+t0;o.type=ty;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+d)}
const SND={tap(){tone(500,.08,'triangle',.1)},pour(){tone(300,.18,'sine',.12,0,180)},flip(){tone(700,.1,'square',.07,0,1000)},coin(){tone(988,.1,'triangle',.12);tone(1319,.2,'triangle',.12,.08)},perf(){[784,988,1319].forEach((f,i)=>tone(f,.16,'triangle',.12,i*.07))},burn(){tone(160,.4,'sawtooth',.16,0,60)},angry(){tone(220,.3,'square',.1,0,110)},ready(){tone(1200,.08,'sine',.07)},win(){[523,659,784,1047].forEach((f,i)=>tone(f,.25,'triangle',.14,i*.13))},no(){tone(200,.12,'square',.08)}};
const snd=k=>{try{SND[k]&&SND[k]()}catch(e){}};
/* ---------- 그리기 도구 ---------- */
const A=ART(cx,{shape:()=>save.eq.shape|0,toast:t=>toast(t),snd:k=>snd(k)});
const IS=ISO(cx,A);
const {E,em,tx,rr,m2,fish,rgbOf,mix,lite,dark,animal,fish2,shapePath,bread,bakeCol,steam,mold,custDraw,mpos,hit,at}=A;
/* 계절: 14일마다 바뀌어요 (봄→여름→가을→겨울) */
const seasonOf=d=>Math.floor((d-1)/14)%4,SEAS=['🌸 봄','☀️ 여름','🍂 가을','❄️ 겨울'];
function seasonFx(t,W_,H_,dens=1){const se=seasonOf(save.day);
 if(se===0){cx.fillStyle='rgba(255,160,190,.9)';for(let i=0;i<Math.round(22*dens);i++){const x=m2(i*61+Math.sin(t*1.2+i)*24+t*12,W_+20)-10,y=m2(i*89+t*34,H_);cx.beginPath();cx.ellipse(x,y,4.4,2.6,t*1.5+i,0,7);cx.fill()}}
 else if(se===2){for(let i=0;i<Math.round(14*dens);i++){const x=m2(i*79+Math.sin(t*1.1+i)*30+t*8,W_+20)-10,y=m2(i*111+t*38,H_);cx.save();cx.translate(x,y);cx.rotate(t*1.4+i);em(i%2?'🍁':'🍂',0,0,18);cx.restore()}}
 else if(se===3){cx.fillStyle='rgba(255,255,255,.92)';for(let i=0;i<Math.round(34*dens);i++){const x=m2(i*53+Math.sin(t*1.5+i)*16,W_+10),y=m2(i*97+t*(34+(i%5)*8),H_);cx.beginPath();cx.arc(x,y,i%3?2.2:3.2,0,7);cx.fill()}}}
/* ---------- 가게 그림 (논리 크기 450×420) ---------- */
const SKYC=[['#9fd8ff','#e8f7ff'],['#ff9a6a','#ffe0a8'],['#141c4a','#3d4c8c'],['#b5c4d8','#f0f4fa'],['#ffcfe0','#fff2f7'],['#ffc67a','#ffeccc'],['#0c1440','#1d3a6a'],['#9fd8ff','#e8f7ff']];
const id_=(k,pv)=>pv&&pv.k===k?pv.id:save.eq[k];
function drawSky(k,t){let c=SKYC[k]||SKYC[0];if(k===0){const se=seasonOf(save.day);if(se===2)c=['#ffc890','#ffe8c8'];else if(se===3)c=['#b8cde4','#eef4fb'];else if(se===0)c=['#b6e0ff','#f4f9ff']}const g=cx.createLinearGradient(0,0,0,420);g.addColorStop(0,c[0]);g.addColorStop(1,c[1]);cx.fillStyle=g;cx.fillRect(0,0,450,420);if(k===0)seasonFx(t,450,420,1);
 if(k===0||k===7){em('☀️',385,42,54);cx.fillStyle='rgba(255,255,255,.85)';for(let i=0;i<3;i++){const x=m2(t*7+i*170,560)-70,y=30+i*24;cx.beginPath();cx.ellipse(x,y,38,13,0,0,7);cx.ellipse(x+22,y-8,24,12,0,0,7);cx.fill()}}
 if(k===7){const cl=['#ff5a5a','#ff9a3a','#ffd93a','#6ccf5a','#4aa8ff','#4a5aff','#a85aff'];cx.lineWidth=9;for(let i=0;i<7;i++){cx.strokeStyle=cl[i];cx.globalAlpha=.8;cx.beginPath();cx.arc(225,215,200-i*9,Math.PI,Math.PI*2);cx.stroke()}cx.globalAlpha=1}
 if(k===1){cx.fillStyle='#ff7a3a';cx.beginPath();cx.arc(370,60,34,0,7);cx.fill();cx.fillStyle='rgba(255,255,255,.5)';for(let i=0;i<2;i++){const x=m2(t*5+i*220,560)-70;cx.beginPath();cx.ellipse(x,36+i*26,36,10,0,0,7);cx.fill()}}
 if(k===2||k===6){for(let i=0;i<30;i++){cx.globalAlpha=.35+.65*Math.abs(Math.sin(t*1.7+i*2.3));cx.fillStyle='#fff';cx.fillRect((i*83)%450,(i*47)%150,2.4,2.4)}cx.globalAlpha=1;if(k===2)em('🌙',62,46,46)}
 if(k===6){for(let b=0;b<3;b++){const g2=cx.createLinearGradient(0,0,0,200);g2.addColorStop(0,b%2?'rgba(120,255,200,.0)':'rgba(180,120,255,.0)');g2.addColorStop(.5,b%2?'rgba(120,255,200,.5)':'rgba(180,120,255,.45)');g2.addColorStop(1,'rgba(0,0,0,0)');cx.fillStyle=g2;cx.beginPath();cx.moveTo(0,40+b*20);for(let x=0;x<=450;x+=30)cx.lineTo(x,50+b*22+Math.sin(x/70+t*.9+b)*22);cx.lineTo(450,200);cx.lineTo(0,200);cx.closePath();cx.fill()}}
 if(k===3){cx.fillStyle='rgba(255,255,255,.95)';for(let i=0;i<40;i++){const x=m2(i*53+Math.sin(t*1.5+i)*16,450),y=m2(i*97+t*38,420);cx.beginPath();cx.arc(x,y,2.4,0,7);cx.fill()}}
 if(k===4){cx.fillStyle='rgba(255,150,185,.9)';for(let i=0;i<30;i++){const x=m2(i*61+Math.sin(t*1.2+i)*22+t*10,450),y=m2(i*89+t*30,420);cx.beginPath();cx.ellipse(x,y,4,2.4,t+i,0,7);cx.fill()}}
 if(k===5){for(let i=0;i<12;i++){const x=m2(i*79+Math.sin(t+i)*26,450),y=m2(i*111+t*34,420);em('🍂',x,y,18)}}}
function wallPat(id,c,t){const x=30,y=72,w=390,h=270;
 rr(x,y,w,h,8,id===8?(()=>{const g=cx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,'#fbe58a');g.addColorStop(.5,'#f0c850');g.addColorStop(1,'#e8b832');return g})():c);
 cx.save();cx.beginPath();cx.roundRect(x,y,w,h,8);cx.clip();
 if(id===4){cx.strokeStyle='rgba(60,20,10,.4)';cx.lineWidth=2;for(let r=0;r<16;r++){const yy=y+r*18;cx.beginPath();cx.moveTo(x,yy);cx.lineTo(x+w,yy);cx.stroke();const o=r%2?0:36;for(let xx=x+o;xx<x+w;xx+=72){cx.beginPath();cx.moveTo(xx,yy);cx.lineTo(xx,yy+18);cx.stroke()}}}
 else if(id===5){cx.strokeStyle='rgba(80,50,20,.35)';cx.lineWidth=2;for(let xx=x;xx<x+w;xx+=26){cx.beginPath();cx.moveTo(xx,y);cx.lineTo(xx,y+h);cx.stroke()}}
 else if(id===6){for(let r=0;r<9;r++)for(let q=0;q<13;q++){if((r+q)%2){cx.fillStyle='rgba(120,160,200,.16)';cx.fillRect(x+q*30,y+r*30,30,30)}}cx.strokeStyle='rgba(150,150,140,.5)';cx.lineWidth=1.5;for(let r=0;r<=9;r++){cx.beginPath();cx.moveTo(x,y+r*30);cx.lineTo(x+w,y+r*30);cx.stroke()}for(let q=0;q<=13;q++){cx.beginPath();cx.moveTo(x+q*30,y);cx.lineTo(x+q*30,y+h);cx.stroke()}}
 else if(id===7){cx.strokeStyle='rgba(140,130,130,.28)';cx.lineWidth=2;for(let i=0;i<9;i++){cx.beginPath();cx.moveTo(x+i*50,y);cx.bezierCurveTo(x+i*50+40,y+90,x+i*50-30,y+170,x+i*50+20,y+h);cx.stroke()}}
 else if(id===8){for(let i=0;i<5;i++){cx.globalAlpha=.4+.6*Math.abs(Math.sin(t*1.5+i*1.7));em('✨',x+50+i*80,y+30+(i%3)*80,18)}cx.globalAlpha=1}
 cx.restore()}
function signDraw(id,t){const x=115,y=92,w=220,h=50,name=nm();rr(x+4,y+7,w,h,12,'rgba(0,0,0,.22)');cx.strokeStyle='#6a4a2a';cx.lineWidth=3;cx.beginPath();cx.moveTo(150,80);cx.lineTo(150,y+4);cx.moveTo(300,80);cx.lineTo(300,y+4);cx.stroke();
 const fs=name.length>6?24:28,cy=y+h/2;
 if(id===0){rr(x,y,w,h,10,'#b9824f');cx.lineWidth=4;cx.strokeStyle='#7a4a22';cx.beginPath();cx.roundRect(x,y,w,h,10);cx.stroke();tx(name,225,cy,fs,'#fff8e0','center','#6a3a14')}
 else if(id===1){cx.fillStyle='#e0607f';cx.beginPath();cx.moveTo(x-16,y+8);cx.lineTo(x+6,y+8);cx.lineTo(x+6,y+h-8);cx.lineTo(x-16,y+h-8);cx.lineTo(x-6,y+h/2);cx.closePath();cx.fill();cx.beginPath();cx.moveTo(x+w+16,y+8);cx.lineTo(x+w-6,y+8);cx.lineTo(x+w-6,y+h-8);cx.lineTo(x+w+16,y+h-8);cx.lineTo(x+w+6,y+h/2);cx.closePath();cx.fill();rr(x,y,w,h,12,'#ffb3c6');tx(name,225,cy,fs,'#fff','center','#d0486a')}
 else if(id===2){rr(x,y,w,h,8,'#2f3a33');cx.lineWidth=5;cx.strokeStyle='#caa66a';cx.beginPath();cx.roundRect(x,y,w,h,8);cx.stroke();tx(name,225,cy,fs,'#f6f6e8','center','#2f3a33');cx.fillStyle='rgba(255,255,255,.25)';cx.fillRect(x+12,y+h-9,w-24,2)}
 else if(id===3){rr(x,y,w,h,12,'#1a1030');cx.save();cx.shadowColor='#ff4fd8';cx.shadowBlur=10+6*Math.sin(t*3);cx.lineWidth=4;cx.strokeStyle='#ff4fd8';cx.beginPath();cx.roundRect(x+2,y+2,w-4,h-4,12);cx.stroke();cx.restore();cx.save();cx.shadowColor='#ff8ae8';cx.shadowBlur=14;tx(name,225,cy,fs,'#ffc0f4','center','rgba(0,0,0,0)');cx.restore()}
 else if(id===4){const g=cx.createLinearGradient(x,y,x,y+h);g.addColorStop(0,'#fff0a0');g.addColorStop(.5,'#f0c030');g.addColorStop(1,'#c89010');rr(x,y,w,h,10,g);cx.lineWidth=4;cx.strokeStyle='#8a6a10';cx.beginPath();cx.roundRect(x,y,w,h,10);cx.stroke();tx(name,225,cy,fs,'#5a3a00','center','#ffe99a')}
 else if(id===5){rr(x,y,w,h,12,'#fff');const g=cx.createLinearGradient(x,0,x+w,0);['#ff5a5a','#ff9a3a','#ffd93a','#6ccf5a','#4aa8ff','#a85aff'].forEach((c,i)=>g.addColorStop(i/5,c));cx.lineWidth=6;cx.strokeStyle=g;cx.beginPath();cx.roundRect(x+3,y+3,w-6,h-6,10);cx.stroke();tx(name,225,cy,fs,'#5a3a22','center','#fff')}
 else if(id===6){cx.save();cx.shadowColor='#ffd23a';cx.shadowBlur=14+6*Math.sin(t*2);const g=cx.createLinearGradient(x,y,x,y+h);g.addColorStop(0,'#fff0a0');g.addColorStop(.5,'#f0c030');g.addColorStop(1,'#b88008');rr(x,y,w,h,12,g);cx.restore();cx.lineWidth=4;cx.strokeStyle='#8a6a10';cx.beginPath();cx.roundRect(x,y,w,h,12);cx.stroke();tx(name,225,cy,fs,'#5a3a00','center','#ffe99a');em('👑',225,y-4,34)}
 else{rr(x,y,w,h,12,'#1c2a6a');cx.lineWidth=3;cx.strokeStyle='#ffe066';cx.beginPath();cx.roundRect(x+2,y+2,w-4,h-4,12);cx.stroke();tx(name,225,cy,fs,'#fff6c0','center','#1c2a6a');for(let i=0;i<4;i++){cx.globalAlpha=.4+.6*Math.abs(Math.sin(t*2+i*1.4));em('✨',x+8+i*66,i%2?y+h+2:y-2,16)}cx.globalAlpha=1}}
const RB=['#ff5a5a','#ff9a3a','#ffd93a','#6ccf5a','#4aa8ff','#4a5aff','#a85aff'];
function awnDraw(id,t){const x0=66,n=14,w=318/n,y=150,h=26;
 {const g=cx.createLinearGradient(0,y+h,0,y+h+34);g.addColorStop(0,'rgba(0,0,0,.28)');g.addColorStop(1,'rgba(0,0,0,0)');cx.fillStyle=g;cx.fillRect(x0,y+h+4,n*w,34)}
 for(let i=0;i<n;i++){let c;if(id===0)c=i%2?'#fff':'#e8584a';else if(id===1)c=i%2?'#fff':'#4a8ae8';else if(id===2)c=i%2?'#fff':'#4ab870';else if(id===3)c=i%2?'#ffd0e0':'#ffb3c9';else if(id===4)c=i%2?'#fff':'#ffc93a';else if(id===5)c=RB[i%7];else if(id===6)c=i%2?'#34459a':'#2a3a7a';else if(id===7)c=i%2?'#ffd6e6':'#ffc0d8';else c=i%2?'#f5c542':'#dba420';
  cx.fillStyle=c;cx.fillRect(x0+i*w,y,w+.6,h);cx.beginPath();cx.arc(x0+i*w+w/2,y+h,w/2,0,Math.PI);cx.fill()}
 {const g=cx.createLinearGradient(0,y,0,y+h+w/2);g.addColorStop(0,'rgba(0,0,0,.16)');g.addColorStop(.35,'rgba(255,255,255,.1)');g.addColorStop(1,'rgba(0,0,0,.14)');cx.fillStyle=g;cx.fillRect(x0,y,n*w,h);cx.beginPath();for(let i=0;i<n;i++){cx.moveTo(x0+i*w,y+h);cx.arc(x0+i*w+w/2,y+h,w/2,Math.PI,0,true)}cx.fill();cx.strokeStyle='rgba(0,0,0,.12)';cx.lineWidth=1;cx.beginPath();for(let i=1;i<n;i++){cx.moveTo(x0+i*w,y);cx.lineTo(x0+i*w,y+h)}cx.stroke()}
 cx.fillStyle='rgba(0,0,0,.14)';cx.fillRect(x0,y,n*w,4);rr(x0-4,y-6,n*w+8,10,4,'#6a4a2a');
 if(id===3){cx.fillStyle='#fff';for(let i=0;i<n;i++){cx.beginPath();cx.arc(x0+i*w+w/2,y+12,3,0,7);cx.fill()}}
 if(id===6){for(let i=0;i<n;i++){cx.globalAlpha=.4+.6*Math.abs(Math.sin(t*2+i));cx.fillStyle='#ffe066';cx.font='13px sans-serif';cx.textAlign='center';cx.fillText('✦',x0+i*w+w/2,y+14)}cx.globalAlpha=1}
 if(id===7){cx.fillStyle='rgba(255,255,255,.85)';for(let i=0;i<n;i+=2){cx.beginPath();cx.ellipse(x0+i*w+w/2,y+12,4,2.4,i,0,7);cx.fill()}}
 if(id===8){for(let i=0;i<4;i++){cx.globalAlpha=.4+.6*Math.abs(Math.sin(t*1.8+i*1.6));em('✨',x0+30+i*85,y+10,14)}cx.globalAlpha=1}}
function floorDraw(id,t){const y=342,h=78;
 if(id===0){cx.fillStyle='#b8b4ac';cx.fillRect(0,y,450,h);cx.fillStyle='rgba(0,0,0,.06)';for(let i=0;i<8;i++)cx.fillRect(i*64,y,2,h)}
 else if(id===1){for(let r=0;r<3;r++)for(let q=0;q<16;q++){cx.fillStyle=(r+q)%2?'#f6f0e4':'#d2a46a';cx.fillRect(q*30,y+r*26,30,26)}}
 else if(id===2){cx.fillStyle='#c89a64';cx.fillRect(0,y,450,h);cx.strokeStyle='rgba(80,50,20,.35)';cx.lineWidth=2;for(let r=0;r<6;r++){cx.beginPath();cx.moveTo(0,y+r*14);cx.lineTo(450,y+r*14);cx.stroke();for(let q=r%2*40;q<450;q+=80){cx.beginPath();cx.moveTo(q,y+r*14);cx.lineTo(q,y+r*14+14);cx.stroke()}}}
 else if(id===3){cx.fillStyle='#6fbf5a';cx.fillRect(0,y,450,h);cx.strokeStyle='#4f9a3e';cx.lineWidth=2;for(let i=0;i<46;i++){const gx=(i*53)%450,gy=y+8+(i*29)%66;cx.beginPath();cx.moveTo(gx,gy);cx.lineTo(gx-3,gy-8);cx.moveTo(gx,gy);cx.lineTo(gx+3,gy-7);cx.stroke()}for(let i=0;i<6;i++)em(['🌼','🌷'][i%2],(i*79+30)%450,y+22+(i*17)%44,14)}
 else if(id===4){cx.fillStyle='#8a867c';cx.fillRect(0,y,450,h);for(let r=0;r<3;r++)for(let q=-1;q<8;q++){rr(q*64+(r%2?32:0)+2,y+r*26+2,60,22,8,'#cfc9bd')}}
 else if(id===5){cx.fillStyle='#9a968e';cx.fillRect(0,y,450,h);rr(110,y,230,h,0,'#c8283c');cx.fillStyle='#f0c040';cx.fillRect(110,y,6,h);cx.fillRect(334,y,6,h);cx.fillStyle='rgba(255,255,255,.12)';for(let i=0;i<4;i++)cx.fillRect(130+i*50,y,12,h)}
 else{const g=cx.createLinearGradient(0,y,450,y+h);g.addColorStop(0,'#7ad8ff');g.addColorStop(.5,'#c8a8ff');g.addColorStop(1,'#7ad8ff');cx.fillStyle=g;cx.fillRect(0,y,450,h);for(let i=0;i<9;i++){cx.globalAlpha=.3+.7*Math.abs(Math.sin(t*1.6+i*1.3));em('✨',(i*57+20)%450,y+14+(i*23)%54,14)}cx.globalAlpha=1}
 cx.fillStyle='rgba(0,0,0,.18)';cx.fillRect(0,y,450,4)}
function litDraw(id,t,front){
 if(id===1&&!front){for(let i=0;i<14;i++){const x=66+i*22.7+11,on=(i+Math.floor(t*2))%4,c=['#ff6a5a','#ffd23a','#7ed88a','#7ec8ff'][on];cx.fillStyle=c;cx.shadowColor=c;cx.shadowBlur=8;cx.beginPath();cx.arc(x,194,4,0,7);cx.fill();cx.shadowBlur=0}}
 if(id===2&&!front){[[84,132,22],[366,128,26],[66,236,20],[388,240,22],[226,152,18]].forEach((p,i)=>em('⭐',p[0],p[1]+Math.sin(t*2+i)*4,p[2]))}
 if(id===3&&!front){cx.save();cx.shadowBlur=14;const c='hsl('+((t*60)%360)+',100%,65%)';cx.shadowColor=c;cx.strokeStyle=c;cx.lineWidth=4;cx.beginPath();cx.roundRect(98,166,254,136,10);cx.stroke();cx.restore()}
 if(id===4&&!front){const g=cx.createRadialGradient(225,215,5,225,215,90);g.addColorStop(0,'rgba(255,240,170,.55)');g.addColorStop(1,'rgba(255,240,170,0)');cx.fillStyle=g;cx.fillRect(120,180,210,120);cx.strokeStyle='#c89010';cx.lineWidth=2;cx.beginPath();cx.moveTo(225,170);cx.lineTo(225,192);cx.stroke();em('🔮',225,208,34)}
 if(id===5&&front){for(let b=0;b<4;b++){const g=cx.createLinearGradient(0,0,0,420);const c=['120,255,200','180,120,255','120,200,255','255,150,220'][b];g.addColorStop(0,'rgba('+c+',0)');g.addColorStop(.4,'rgba('+c+','+(.16+.08*Math.sin(t*1.3+b))+')');g.addColorStop(1,'rgba('+c+',0)');cx.fillStyle=g;const x=40+b*100+Math.sin(t*.8+b*1.7)*30;cx.beginPath();cx.moveTo(x,0);cx.lineTo(x+60,0);cx.lineTo(x+110,420);cx.lineTo(x+20,420);cx.closePath();cx.fill()}for(let i=0;i<8;i++){cx.globalAlpha=.4+.6*Math.abs(Math.sin(t*2+i*1.9));em('✨',(i*61+25)%450,(i*53+40)%330,13)}cx.globalAlpha=1}}
function scene(t,pv,pop){
 drawSky(id_('sky',pv),t);
 topDraw(id_('top',pv),t,false);
 const wi=id_('wall',pv),wl=WALL[wi]||WALL[0];wallPat(wi,wl.c,t);rr(22,60,406,18,6,wi===8?'#b8860b':'#8a5a3a');rr(22,76,406,8,0,'rgba(0,0,0,.14)');topDraw(id_('top',pv),t,true);
 /* 창문 + 가게 안 */
 const g=cx.createLinearGradient(0,168,0,300);g.addColorStop(0,'#fff6dc');g.addColorStop(1,'#ffd9a0');rr(100,168,250,130,10,g);
 animal('cook',190,240,54,{t,ph:0,mood:'h',shirt:'#ffffff'});{const sw=Math.sin(t*2.4);cx.strokeStyle='#d0a070';cx.lineWidth=6;cx.lineCap='round';cx.beginPath();cx.moveTo(214,286);cx.lineTo(246,270+sw*6);cx.stroke();cx.fillStyle='#c8c8c8';cx.beginPath();cx.roundRect(240,262+sw*6,22,12,3);cx.fill()}
 for(let i=0;i<3;i++){const px=262+i*22,py=287;bread(px,py,.2,'#e8a840',{plain:true,shp:id_('shape',pv)})}
 {const hop=m2(t*.7,1);if(hop<.5){const u=hop/.5;bread(282,282-Math.sin(u*Math.PI)*34,.2,'#f0b850',{rot:u*Math.PI*2,plain:true,shp:id_('shape',pv)})}}
 for(let i=0;i<3;i++){const ph=m2(t*14+i*17,50);cx.globalAlpha=Math.max(0,1-ph/50)*.8;em('💨',262+i*14,272-ph,16);cx.globalAlpha=1}
 const mi=id_('mas',pv),mas=MAS[mi]||MAS[0];
 rr(90,292,270,24,8,'#b97d4a');rr(90,292,270,6,3,'#d9a06a');
 litDraw(id_('lit',pv),t,false);
 if(mi>0){const by=Math.sin(t*3)*2;if(mas.e==='🌟'){fish2(318,274+by,.52,'#ffcf3a',{glow:'#ffe066'});cx.globalAlpha=.5+.5*Math.sin(t*3);em('✨',344,246,16);cx.globalAlpha=1}else animal(mas.e,324,262+by,38,{t,ph:2,mood:'h',shirt:null,bust:true})}
 rr(100,166,250,4,2,'rgba(0,0,0,.18)');cx.lineWidth=6;cx.strokeStyle=wi===8?'#b8860b':'#8a5a3a';cx.beginPath();cx.roundRect(100,168,250,130,10);cx.stroke();
 signDraw(id_('sign',pv),t);awnDraw(id_('awn',pv),t);
 floorDraw(id_('floor',pv),t);
 /* 지나가는 손님 */
 const dk=Object.keys(save.dex);walk.forEach((w,i)=>{const dir=i%2?-1:1,x=dir>0?m2(t*w.sp+w.off,520)-35:485-m2(t*w.sp+w.off,520),an=dk.length?dk[i%dk.length]:w.an;em(an,x,386+Math.abs(Math.sin(t*5+i))*-5,36)});
 [['sL',54],['sR',398]].forEach(([k,x])=>{const it=SIDE[id_(k,pv)]||SIDE[0];if(it.sz)em(it.e,x,344-it.sz*.42,it.sz)});
 litDraw(id_('lit',pv),t,true)}
const gradeCol=()=>['#aaa','#c8a070','#7ec8ff','#7ed88a','#ffd23a','#ff9a3a','#ff6aa8'][grade()];
function hud(){rr(0,0,W,64,0,'#8a5a3a');tx(nm(),12,22,24,'#fff','left');tx(GR[grade()].e+' '+GR[grade()].n+' · ✨+'+Math.round(charmBonus()*100)+'%',12,48,15,'#ffe9a0','left');tx('🪙 '+fmt(save.coins),438,22,22,'#ffe9a0','right');tx('📅 '+save.day+'일차 · '+SEAS[seasonOf(save.day)],438,48,15,'#fff','right')}
/* 가게 모습 (아이소메트릭): 꾸밈 칸 + 놓은 가구. pv=꾸미기 미리보기 */
function skyCols(k){let c=SKYC[k]||SKYC[0];if(k===0){const se=seasonOf(save.day);if(se===2)c=['#ffc890','#ffe8c8'];else if(se===3)c=['#b8cde4','#eef4fb'];else if(se===0)c=['#b6e0ff','#f4f9ff']}return c}
function look(pv){const sk=id_('sky',pv),wi=id_('wall',pv);return{n:pv&&pv.k==='room'?pv.id:save.room,wall:{c:(WALL[wi]||WALL[0]).c,id:wi},floor:id_('floor',pv),sky:skyCols(sk),night:sk===2||sk===6,awn:id_('awn',pv),sign:id_('sign',pv),name:nm(),top:id_('top',pv),lit:id_('lit',pv),sL:SIDE[id_('sL',pv)]||SIDE[0],sR:SIDE[id_('sR',pv)]||SIDE[0],mas:MAS[id_('mas',pv)]||MAS[0]}}
function drawHome(t,deco){
 cx.fillStyle='#4a3426';cx.fillRect(0,0,W,H);
 if(deco){IS.draw(t,look(prev),save.fur,{top:56,bottom:H-262,edit:dtabK()==='fur',sel:dsel,ghost:dghost});
  if(dtabK()==='shape'){const sid=id_('shape',prev);rr(W-150,64,138,108,18,'rgba(255,248,236,.95)');bread(W-81,110,.9,'#e8a840',{shp:sid});tx(MSH[sid].n,W-81,154,14,'#5a3a22','center','#fff')}}
 else{IS.draw(t,look(null),save.fur,{top:64,bottom:518});const g=cx.createLinearGradient(0,470,0,H);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(30,18,10,.55)');cx.fillStyle=g;cx.fillRect(0,470,W,330);hud()}}
function gradeFloorBase(){return['#b8b4ac','#d2a46a','#c89a64','#6fbf5a','#8a867c','#9a968e','#9a80d8'][save.eq.floor]||'#b8b4ac'}

/* 지붕 장식: front=false 는 하늘 쪽(불꽃놀이), true 는 건물 앞 */
function topDraw(id,t,front){
 if(id===6&&!front){const cl=['255,90,120','255,200,60','120,220,255','160,255,140','220,140,255'];for(let b=0;b<4;b++){const ph=m2(t*.6+b*.27,1),bx=60+b*110+Math.sin(b*7)*20,by=36+(b%2)*22,cc=cl[b%5];if(ph<.8){const u=ph/.8,rad=14+u*46;cx.fillStyle='rgba('+cc+','+(1-u)+')';for(let i=0;i<16;i++){const a=i/16*Math.PI*2,px=bx+Math.cos(a)*rad,py=by+Math.sin(a)*rad+u*u*14;cx.beginPath();cx.arc(px,py,2.6*(1-u*.5),0,7);cx.fill()}}}}
 if(!front)return;
 if(id===1){cx.strokeStyle='#6a4a2a';cx.lineWidth=2.5;cx.beginPath();cx.moveTo(24,46);cx.quadraticCurveTo(225,74,426,46);cx.stroke();const cl=['#ff6a6a','#ffb04a','#6cc8ff','#7ed88a','#c08aff','#ff8ac0'];for(let i=0;i<6;i++){const u=(i+.5)/6,x=24+u*402,y=46+Math.sin(u*Math.PI)*14*1.2+2;fish2(x,y+10,.2,cl[i],{rot:Math.PI/2+Math.sin(t*2+i)*.25,plain:true})}}
 if(id===2){const cl=['#ff6a8a','#ffd23a','#6cc8ff','#7ed88a','#c08aff','#ff9a4a'];const ball=(x,y,r,c,ph)=>{const by=Math.sin(t*1.6+ph)*3;cx.strokeStyle='rgba(60,40,30,.5)';cx.lineWidth=1.4;cx.beginPath();cx.moveTo(x,y+r+by);cx.lineTo(x+Math.sin(ph)*4,y+r+22+by);cx.stroke();const g=cx.createRadialGradient(x-r*.35,y-r*.35+by,r*.1,x,y+by,r);g.addColorStop(0,lite(c,.55));g.addColorStop(1,c);cx.fillStyle=g;cx.beginPath();cx.ellipse(x,y+by,r*.9,r,0,0,7);cx.fill()};
  for(let i=0;i<7;i++){const a=Math.PI+i/6*Math.PI;ball(225+Math.cos(a)*190,56+Math.sin(a)*26,13,cl[i%6],i)}for(let i=0;i<4;i++){ball(34+i*8,40+i*5,12,cl[(i+2)%6],i+9);ball(416-i*8,40+i*5,12,cl[(i+4)%6],i+3)}}
 if(id===3){const bob=Math.sin(t*1.8)*2;fish2(225,30+bob,.95,'#ffcf3a',{glow:'rgba(255,220,80,.9)'});rr(205,52,40,12,4,'#8a6a10')}
 if(id===4){rr(70,10,310,46,8,'#1a1a22');cx.strokeStyle='#555';cx.lineWidth=3;cx.beginPath();cx.roundRect(70,10,310,46,8);cx.stroke();cx.save();cx.beginPath();cx.rect(76,14,298,38);cx.clip();const msg='🐟 붕어빵 팔아요! 갓 구운 따끈따끈 '+nm()+' 🐟   ';cx.font='bold 26px "Jua","Noto Sans KR",sans-serif';cx.textBaseline='middle';cx.shadowColor='#ffb030';cx.shadowBlur=10;cx.fillStyle='#ffc850';const w=cx.measureText(msg).width,x=-m2(t*60,w);for(let k=0;k<3;k++)cx.fillText(msg,x+k*w+80,33);cx.restore();rr(200,56,50,8,2,'#444')}
 if(id===5){cx.save();cx.shadowColor='#ffd23a';cx.shadowBlur=18+8*Math.sin(t*2);em('👑',225,30,70);cx.restore();for(let i=0;i<5;i++){cx.globalAlpha=.3+.7*Math.abs(Math.sin(t*2.2+i*1.5));em('✨',165+i*30,12+(i%2)*40,14)}cx.globalAlpha=1}}
/* ---------- 하루 목표 · 도감 ---------- */
const GP=[
 {k:'perf',f:d=>Math.min(15,3+Math.floor(d/6)),t:n=>'✨ PERFECT 붕어빵 '+n+'개 굽기',sh:(r,n)=>'✨'+r.perf+'/'+n,ok:(r,n)=>r.perf>=n},
 {k:'serve',f:d=>Math.min(26,6+Math.floor(d/4)),t:n=>'🐾 손님 '+n+'명에게 붕어빵 주기',sh:(r,n)=>'🐾'+r.served+'/'+n,ok:(r,n)=>r.served>=n},
 {k:'combo',f:d=>Math.min(10,3+Math.floor(d/8)),t:n=>'🔥 콤보 '+n+' 만들기',sh:(r,n)=>'🔥'+r.bc+'/'+n,ok:(r,n)=>r.bc>=n},
 {k:'noburn',f:()=>0,t:()=>'😵 하나도 태우지 않기',sh:r=>'😵'+(r.burnt?'✗':'○'),ok:r=>r.burnt===0},
 {k:'nolose',f:()=>1,t:n=>'😊 놓친 손님 '+n+'명 이하',sh:(r,n)=>'😡'+r.lost+'/≤'+n,ok:(r,n)=>r.lost<=n},
 {k:'net',f:()=>Math.max(2000,Math.round(save.avg*.95/100)*100),t:n=>'💰 하루 수익 '+fmt(n)+'원 넘기기',sh:(r,n)=>'💰'+Math.min(100,Math.max(0,Math.round(r.net/n*100)))+'%',ok:(r,n)=>r.net>=n}];
function goalsFor(day){const rng=B.mul(B.hs(save.seed,day*131+7)),idx=GP.map((_,i)=>i);for(let i=idx.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[idx[i],idx[j]]=[idx[j],idx[i]]}
 return idx.slice(0,3).map(i=>{const p=GP[i];return{p,n:p.f(day)}})}
const live=()=>({perf:s.perf,served:s.served,bc:s.bc,burnt:s.burnt,lost:s.lost,net:Math.round(s.net)});
const DXT=[10,30];
/* ---------- 집 화면 ---------- */
function renderHome(){goals=goalsFor(save.day);const ev=B.evOf(save.day);
 $('hg').innerHTML='<b>📋 오늘의 목표</b> (하나 이룰 때마다 ⭐)'+(ev?' · '+R.ev[ev].e+' <b>'+R.ev[ev].n+'</b>':'')+'<br>'+goals.map(g=>'• '+g.p.t(g.n)).join('<br>');
 $('h1').textContent='▶ '+save.day+'일차 장사 시작'}
function toHome(){scr='home';s=null;paused=false;prev=null;renderHome();show('hm')}
/* ---------- 하루 ---------- */
const run0=()=>({seed:save.seed,day:save.day,up:Object.assign({},save.up,{deco:charmBonus()/.06}),fu:save.fu.slice(),nf:Math.min(save.nfUse,save.nf),coins:save.coins,lg:null,mode:'shop'});
function startDay(){au();run=run0();s=B.newDay(run);ui=A.newUi();A.use(s,run,ui);scr='game';paused=false;acc=0;last=0;show('none')}
function finishDay(){const res=B.dayResult(s,run);const gl=goals.map(g=>({g,ok:g.p.ok(res,g.n)}));const got=gl.filter(x=>x.ok).length;let bonus=0,star=got;const g0=grade();
 if(got===3){bonus=300+save.day*40;star+=0}
 const gain=Math.max(0,res.net)+bonus;save.coins+=gain;save.stars+=star;save.served+=res.served;save.days++;save.avg=save.avg?Math.round(save.avg*.7+res.net*.3):Math.max(0,res.net);
 save.bestNet=Math.max(save.bestNet,res.net);save.bestCombo=Math.max(save.bestCombo,res.bc);
 const dn=[];for(const an of Object.keys(save.dex)){const lv=save.dexS[an]||0;if(lv<DXT.length&&save.dex[an]>=DXT[lv]){save.dexS[an]=lv+1;save.stars++;dn.push(an+' 단골 달성! ⭐+1')}}
 if(!save.dexAll&&Object.keys(save.dex).length>=R.an.length){save.dexAll=1;save.stars+=5;dn.push('📖 도감 완성! ⭐+5')}
 save.lr={full:res.full|0,lost:res.lost,idle:res.idle,net:res.net};const nd=s.dxNew||[];const d0=save.day;save.day++;store();
 const g1=grade();let h='<div class="sum"><b>'+(res.net>=0?'💰 순수익 '+fmt(res.net)+'원':'📉 재료비가 더 들었어요 ('+fmt(res.net)+'원)')+'</b>'+(res.net<0?'<br>(손해는 없던 걸로 해 드려요!)':'')+'<br>🐾 손님 '+res.served+'명 · 😡 놓침 '+res.lost+' · ✨ PERFECT '+res.perf+' · 👍 GREAT '+(res.good|0)+' · 😵 BURNT '+res.burnt+' · 🔥 콤보 '+res.bc+'</div>';
 h+='<div class="sum"><b>📋 오늘의 목표</b><br>'+gl.map(x=>(x.ok?'✅ ':'⬜ ')+x.g.p.t(x.g.n)).join('<br>')+'<br>⭐ +'+star+(got===3?' · 🎁 모두 달성! 보너스 🪙 '+fmt(bonus):'')+'</div>';
 if(nd.length)h+='<div class="sum">📖 새 손님 도감 등록! '+nd.join(' ')+'</div>';if(dn.length)h+='<div class="sum">'+dn.join('<br>')+'</div>';
 if(g1>g0)h+='<div class="sum" style="background:#ffeaa8"><b>🎉 가게 등급이 올랐어요!</b><br>'+GR[g1].e+' <b>'+GR[g1].n+'</b> · 새 꾸미기 상품이 열렸어요</div>';
 h+='<div style="text-align:center;font-size:16px">🪙 '+fmt(save.coins)+' · ⭐ '+save.stars+' · '+GR[g1].e+' '+GR[g1].n+'</div>';
 $('rt').textContent='🌙 '+d0+'일차 영업 끝!';$('rb').innerHTML=h;scr='res';s=null;snd('win');show('res')}
$('r1').onclick=()=>{toHome()};
$('r2').onclick=()=>openDeco('res');$('r3').onclick=()=>openUp('res');
$('p2').onclick=()=>ask($('p2'),'⚠️ 여기까지로 정산해요. 한 번 더!',()=>{paused=false;$('pause').style.display='none';finishDay()});
/* ---------- 가게 키우기 (굽기 업그레이드) ---------- */
let backTo='home';
function openUp(from){backTo=from;scr='up';renderUp();show('up')}
function renderUp(){
 $('uw').innerHTML='<span class="pill">🪙 '+fmt(save.coins)+'</span><span class="pill">'+R.loc[save.up.loc].e+' '+R.loc[save.up.loc].n+'</span>';
 const nu=Math.min(save.nfUse,save.nf);$('um').innerHTML='<b>오늘 팔 메뉴</b> '+R.menu.slice(0,nu).map(m=>m.e).join('')+' ('+nu+'종)　<button id="nfm" style="width:44px;height:38px;padding:0;font-size:20px">➖</button> <button id="nfp" style="width:44px;height:38px;padding:0;font-size:20px">➕</button><div style="font-size:13px;opacity:.75;margin-top:2px">어려운 맛이 힘들면 줄여 두세요. 열어 둔 맛은 사라지지 않아요</div>';
 $('nfm').onclick=()=>{if(save.nfUse>1){save.nfUse--;store();renderUp()}};$('nfp').onclick=()=>{if(save.nfUse<save.nf){save.nfUse++;store();renderUp()}};
 const L=$('shl');L.innerHTML='';
 const row=(e,n,d,label,can,fn,rec)=>{const r=document.createElement('div');r.className='it'+(rec?' rec':'');r.innerHTML='<b>'+e+'</b><div>'+(n.startsWith('<span')?n:'<span>'+n+'</span>')+'<br>'+d+'</div>';const b=document.createElement('button');b.textContent=label;if(!can)b.className='no';b.onclick=fn;r.appendChild(b);L.appendChild(r)};
 const sec=h=>{const p=document.createElement('p');p.className='ht';p.innerHTML='<b>'+h+'</b>';L.appendChild(p)};
 const FU=[0,1,2,3,4,5].filter(f=>f<save.nf).map(f=>'fu'+f),ALL=['fl','mold','rack','speed','auto','pat','loc',...FU],rc=B.recUp(save,ALL,save.lr);
 const one=k=>{const c=B.upCost(save,k),d=B.upInfo(save,k),isR=rc&&rc.k===k,nm='<span>'+d[1]+'</span> <small>'+d[3]+'</small>';
  if(c==null){row(d[0],nm,d[2],'완료 ✅',false,()=>{});return}
  row(d[0],nm,d[2]+(isR?'<br><b class="why">👍 추천 · '+rc.why+'</b>':''),fmt(c)+'🪙',save.coins>=c,()=>{if(!B.buy(save,k)){toast('코인이 부족해요!');snd('no');return}if(k==='fl')save.nfUse=save.nf;store();snd('win');renderUp()},isR)};
 if(rc){sec('👍 지금 추천');one(rc.k)}
 sec('🔥 굽기');['fl','mold','rack','speed','auto'].filter(k=>!rc||rc.k!==k).forEach(one);
 sec('🫘 맛 강화 (값이 올라요 · 싼 맛일수록 많이)');FU.filter(k=>!rc||rc.k!==k).forEach(one);
 sec('🏪 손님');['pat','loc'].filter(k=>!rc||rc.k!==k).forEach(one);
 const p=document.createElement('p');p.className='ht';p.style.textAlign='center';p.innerHTML='🎨 코인은 꾸미기에도 쓸 수 있어요!';L.appendChild(p)}
$('ux').onclick=()=>{if(backTo==='res'){scr='res';show('res')}else toHome()};
/* ---------- 꾸미기 (가구 놓기 + 꾸밈 칸 + 넓히기) ---------- */
let dback='home',dsel=null,dpick=null,dghost=null;
const DT=()=>[{k:'fur',n:'🪑 가구'},...SLOTS.map(s=>({k:s.k,n:s.n,sl:s})),{k:'room',n:'📐 넓히기'}];
const dtabK=()=>(DT()[dtab]||{}).k;
function openDeco(from){dback=from;dtab=0;prev=null;dsel=null;dpick=null;dghost=null;scr='deco';renderDeco();show('dc')}
function lockOf(it){if(it.g>grade())return'🔒 '+GR[it.g].e+' '+GR[it.g].n+' 등급';if(it.st&&save.stars<it.st)return'🔒 ⭐ '+it.st;return null}
const placed=k=>save.fur.filter(it=>it.k===k).length,spare=k=>(save.inv[k]||0)-placed(k);
function dbtn(id,label,cls,fn){const b=$(id);b.textContent=label;b.className=cls||'';b.onclick=fn||null}
function renderDeco(){const tabs=DT(),tk=dtabK();
 $('dcw').textContent='🪙 '+fmt(save.coins);$('dci').textContent='✨ 매력 +'+Math.round(charmBonus()*100)+'%';
 const T=$('dtabs');T.innerHTML='';tabs.forEach((x,i)=>{const b=document.createElement('button');b.textContent=x.n;if(i===dtab)b.className='on';b.onclick=()=>{dtab=i;prev=null;dsel=null;dpick=null;dghost=null;$('dl').scrollLeft=0;renderDeco()};T.appendChild(b)});
 const L=$('dl'),sl0=L.scrollLeft;L.innerHTML='';
 const card=(e,n,sub,cls,fn)=>{const b=document.createElement('button');b.className='cd '+(cls||'');b.innerHTML='<b>'+e+'</b>'+n+'<small>'+sub+'</small>';b.onclick=fn;L.appendChild(b)};
 let msg='';
 if(tk==='fur'){
  IS.FUR.forEach(f=>{const lk=lockOf(f),sp=spare(f.k);card(f.e,f.n,lk?lk.replace('🔒 ',''):sp>0?'보관 '+sp+'개':'🪙'+fmt(f.p),(dpick===f.k?'on':'')+(lk?' lk':''),()=>{if(lk){toast(lk.replace('🔒 ','')+'이 되면 살 수 있어요');snd('no');return}dpick=dpick===f.k?null:f.k;dsel=null;renderDeco()})});
  const f=dsel&&IS.FK[dsel.k];
  dbtn('da1','↻ 돌리기',f&&f.rot?'':'dis',()=>{if(dsel&&IS.FK[dsel.k].rot){dsel.d=((dsel.d|0)+1)%4;store();snd('tap')}});
  dbtn('da2','📦 보관함에 넣기',dsel?'':'dis',()=>{if(dsel){save.fur=save.fur.filter(it=>it!==dsel);dsel=null;store();snd('tap');renderDeco()}});
  msg=dsel?f.n+' · 돌리거나 보관함에 넣을 수 있어요 (다시 놓으면 공짜)':dpick?(spare(dpick)>0?IS.FK[dpick].n+' 놓을 칸을 톡! (보관함 '+spare(dpick)+'개)':IS.FK[dpick].n+' 놓을 칸을 톡! 놓으면 🪙'+fmt(IS.FK[dpick].p)):'가구를 고르고 가게 바닥을 톡! · 놓인 가구를 톡 하면 골라져요 · 흰 칸은 손님 길'}
 else if(tk==='room'){
  IS.ROOM.forEach(r=>{const own=save.room>=r.n,lk=!own&&r.g>grade()?'🔒 '+GR[r.g].n:null;card('📐',r.n+'×'+r.n,own?(save.room===r.n?'지금 크기':'✅'):lk?lk.replace('🔒 ',''):'🪙'+fmt(r.p),(prev&&prev.k==='room'&&prev.id===r.n?'on':save.room===r.n?'eq':'')+(lk?' lk':''),()=>{prev=own?null:{k:'room',id:r.n};renderDeco()})});
  const nx=IS.ROOM.find(r=>r.n===save.room+1);
  if(prev&&prev.k==='room'){const r=IS.ROOM.find(q=>q.n===prev.id),lk=r.g>grade(),seq=r.n===save.room+1;
   dbtn('da1',lk?'🔒 '+GR[r.g].n+' 등급':!seq?'먼저 '+(save.room+1)+'×'+(save.room+1):'📐 넓히기 🪙'+fmt(r.p),lk||!seq?'dis':'go',()=>{if(lk||!seq)return;if(save.coins<r.p){toast('코인이 부족해요!');snd('no');return}save.coins-=r.p;save.room=r.n;prev=null;IS.reset();store();snd('win');toast('가게가 '+r.n+'×'+r.n+'로 넓어졌어요! 🎉');renderDeco()});msg='미리 보는 중이에요'}
  else{dbtn('da1',nx?'다음: '+nx.n+'×'+nx.n:'최대 크기예요!','dis');msg=nx?'카드를 눌러 넓어진 모습을 미리 봐요':'가장 넓은 가게예요 🎉'}
  dbtn('da2','✔ 완료','',()=>$('dx').click())}
 else{const sl=tabs[dtab].sl;
  sl.L.forEach((it,id)=>{const own=save.own[sl.k].includes(id),eqd=save.eq[sl.k]===id,lk=own?null:lockOf(it),free=!it.p&&it.st&&!lk;
   card(it.e,it.n,eqd?'사용 중':own?'가지고 있어요':lk?lk.replace('🔒 ',''):free?'⭐ 보상':'🪙'+fmt(it.p),(prev&&prev.k===sl.k&&prev.id===id?'on':eqd?'eq':'')+(lk?' lk':''),()=>{prev={k:sl.k,id};renderDeco()})});
  const id=prev&&prev.k===sl.k?prev.id:save.eq[sl.k],it=sl.L[id],own=save.own[sl.k].includes(id),eqd=save.eq[sl.k]===id,lk=own?null:lockOf(it),free=!it.p&&it.st&&!lk;
  if(eqd)dbtn('da1','✅ 사용 중','dis');
  else if(own)dbtn('da1','바꾸기','go',()=>{save.eq[sl.k]=id;prev=null;store();snd('tap');renderDeco()});
  else if(lk)dbtn('da1',lk,'dis');
  else if(free)dbtn('da1','받기 🎁','go',()=>{save.own[sl.k].push(id);save.eq[sl.k]=id;prev=null;store();snd('win');renderDeco()});
  else dbtn('da1','사기 🪙'+fmt(it.p),save.coins>=it.p?'go':'dis',()=>{if(save.coins<it.p){toast('코인이 부족해요!');snd('no');return}save.coins-=it.p;save.own[sl.k].push(id);save.eq[sl.k]=id;prev=null;store();snd('win');toast(it.n+' 설치 완료!');renderDeco()});
  dbtn('da2',prev?'↩ 되돌리기':'✔ 완료','',()=>{if(prev){prev=null;renderDeco()}else $('dx').click()});
  msg=prev&&!eqd?'미리 보는 중 · 매력 +'+charmOf(it):sl.n+' 고르기'}
 $('dmsg').textContent=msg;L.scrollLeft=sl0}
/* 가게 바닥을 톡: 가구 고르기 / 놓기 */
function decoTap(x,y){if(dtabK()!=='fur'||y>H-262||y<56)return;const n=save.room,{gx,gy}=IS.toTile(x,y);
 if(!IS.inRoom(gx,gy,n)){dsel=null;renderDeco();return}
 const it=save.fur.find(q=>q.x===gx&&q.y===gy);
 if(it){dsel=dsel===it?null:it;dpick=null;renderDeco();return}
 if(!dpick){dsel=null;renderDeco();return}
 if(IS.isCounter(gx,gy)){toast('여기는 카운터예요');snd('no');return}
 if(IS.isPath(gx,gy,n)){toast('흰 칸은 손님이 다니는 길이에요');snd('no');return}
 const f=IS.FK[dpick];
 if(spare(dpick)<=0){if(save.coins<f.p){toast('코인이 부족해요! (🪙'+fmt(f.p)+')');snd('no');return}save.coins-=f.p;save.inv[dpick]=(save.inv[dpick]||0)+1;toast(f.n+' 구입! -🪙'+fmt(f.p))}
 const nw={k:dpick,x:gx,y:gy,d:0};save.fur.push(nw);dsel=nw;store();snd('win');dghost={x:gx,y:gy,ok:true};setTimeout(()=>dghost=null,250);renderDeco()}
cv.addEventListener('pointerdown',e=>{if(scr!=='deco')return;e.preventDefault();const r=cv.getBoundingClientRect();decoTap((e.clientX-r.left)/r.width*W,(e.clientY-r.top)/r.height*H)});
$('dx').onclick=()=>{prev=null;dsel=null;dpick=null;if(dback==='res'){scr='res';show('res')}else toHome()};
/* ---------- 도감 · 별 ---------- */
function renderCol(){const g=grade(),nx=GR[g+1];let h='<span class="pill">⭐ '+save.stars+'</span><span class="pill">'+GR[g].e+' '+GR[g].n+'</span><span class="pill">📖 '+Object.keys(save.dex).length+'/'+R.an.length+'</span>';
 h+='<p class="ht"><b>🏅 가게 등급</b> (손님을 많이 받을수록 올라요)</p><div class="sum">누적 손님 <b>'+fmt(save.served)+'명</b> · 영업 '+save.days+'일'+(nx?'<div class="bar"><i style="width:'+Math.round(100*(save.served-GR[g].at)/(nx.at-GR[g].at))+'%"></i></div>다음 등급 '+nx.e+' '+nx.n+'까지 '+fmt(nx.at-save.served)+'명':'<br>🎉 최고 등급이에요!')+'<br>최고 하루 수익 '+fmt(save.bestNet)+'원 · 최고 콤보 '+save.bestCombo+'</div>';
 const rw=[];SLOTS.forEach(sl=>sl.L.forEach((it,i)=>{if(!it.p&&it.st&&!rw.some(x=>x.n===it.n))rw.push({n:it.n,e:it.e,st:it.st,sl:sl.n,own:save.own[sl.k].includes(i)})}));
 h+='<p class="ht"><b>⭐ 별 보상</b> (목표를 이루고 단골을 모아요)</p>'+rw.sort((a,b)=>a.st-b.st).map(x=>'<div class="it" style="'+(save.stars>=x.st?'':'opacity:.6')+'"><b>'+x.e+'</b><div><span>'+x.n+'</span><br><small>'+x.sl+' · 꾸미기에서 받아요</small></div><span style="font-size:15px;width:70px;text-align:center">'+(x.own?'✅ 받음':save.stars>=x.st?'🎁 받기 가능':'⭐ '+x.st)+'</span></div>').join('');
 h+='<p class="ht"><b>📖 동물 손님 도감</b> (같은 손님이 10번·30번 오면 단골이 되어 ⭐ 선물)</p><div class="dx">'+R.an.map(a=>{const n=save.dex[a];const lv=save.dexS[a]||0;return'<div><b>'+(n!==undefined?a:'❓')+'</b>'+(n!==undefined?n+'번 방문'+(lv?' '+'⭐'.repeat(lv):''):'아직 몰라요')+'</div>'}).join('')+'</div>';
 $('cb').innerHTML=h}
$('cx').onclick=()=>show('hm');
/* ---------- 이름 · 설정 ---------- */
let nmFirst=false;
function cleanName(t){return String(t).replace(/[\u0000-\u001f\u007f<>&"\\]/g,'').replace(/\s+/g,' ').trim().slice(0,8)}
function openName(first){nmFirst=first;$('nmh').textContent=first?'내 붕어빵 가게 이름을 지어요!':'가게 이름 바꾸기';$('nmx').style.display=first?'none':'block';$('nmi').value=save.name||'행복 붕어빵';$('nme').textContent='';show('nm');setTimeout(()=>{try{$('nmi').focus();$('nmi').select()}catch(e){}},50)}
$('nm1').onclick=()=>{const n=cleanName($('nmi').value);if(!n){$('nme').textContent='한 글자 이상 써 주세요';return}save.name=n;store();toHome();if(!nmFirst)toast('간판이 바뀌었어요')};
$('nmi').addEventListener('keydown',e=>{if(e.key==='Enter')$('nm1').click()});$('nmx').onclick=()=>show('set');
$('sn').onclick=()=>{save.snd=!save.snd;store();$('sn').textContent=save.snd?'🔊 소리 켜짐':'🔇 소리 꺼짐'};
$('sr').onclick=()=>openName(false);$('sc').onclick=()=>show('hm');
$('rst').onclick=()=>ask($('rst'),'⚠️ 가게가 모두 사라져요! 한 번 더',()=>{const sn=save.snd;save=DEF();save.snd=sn;store();openName(true);toast('모두 지웠어요')});
$('h1').onclick=startDay;$('h2').onclick=()=>{au();openDeco('home')};$('h3').onclick=()=>{au();openUp('home')};$('h4').onclick=()=>{au();renderCol();show('col')};
$('h5').onclick=()=>{au();$('sn').textContent=save.snd?'🔊 소리 켜짐':'🔇 소리 꺼짐';show('set')};
/* ---------- 일시정지 ---------- */
function pauseGame(){if(scr!=='game'||!s||paused||s.ph!=='play')return;paused=true;$('pause').style.display='block'}
function resumeGame(){if(!paused)return;paused=false;$('pause').style.display='none';last=0}
$('home2').onclick=pauseGame;$('p1').onclick=resumeGame;
/* ---------- 조작 ---------- */
function tap(x,y){const h=A.tapPlay(x,y);if(h&&h.k==='c')count();drain()}
function count(){for(const c of s.cust){if(c&&c.happy&&!c.cnt){c.cnt=1;if(c.an==='🧐')continue;if(save.dex[c.an]===undefined){save.dex[c.an]=0;(s.dxNew=s.dxNew||[]).push(c.an);ui.ft.push({t:'도감 등록! '+c.an,x:225,y:150,c:'#fff',l:1.6})}save.dex[c.an]++}}}
function drain(){A.drainFx()}
cv.addEventListener('pointerdown',e=>{e.preventDefault();au();if(scr!=='game'||paused||!s||s.ph!=='play')return;const r=cv.getBoundingClientRect();tap((e.clientX-r.left)/r.width*W,(e.clientY-r.top)/r.height*H)});
/* ---------- 하루 그리기 (공용 화면 + 내 가게 꾸밈 색) ---------- */
const FLC=['#c9935f','#d2a46a','#c89a64','#7fbf6a','#a8a498','#b8384a','#8ac8e8'];
function drawGame(){A.use(s,run,ui);const lc=B.L(run);A.drawPlay({sub:nm()+' · '+s.wea.n,
 bg:t=>{cx.fillStyle='#ffe0b5';cx.fillRect(0,0,W,H);cx.fillStyle=(WALL[save.eq.wall]||WALL[0]).c;cx.fillRect(0,64,W,258);
  cx.save();cx.translate(0,62);cx.scale(450/318,.4);cx.translate(-66,-150);awnDraw(save.eq.awn,t);cx.restore();
  cx.fillStyle=FLC[save.eq.floor]||FLC[0];cx.fillRect(0,322,W,78);cx.fillStyle='rgba(0,0,0,.16)';cx.fillRect(0,322,W,8);cx.fillStyle='#6b5344';cx.fillRect(0,394,W,310)},
 head:t=>{rr(0,0,W,58,0,'#8a5a3a');tx(s.d+'일차 '+s.wea.e,50,18,22,'#fff','left');tx(lc.e,150,18,18,'#fff','left');tx('🪙 '+fmt(save.coins+s.net),388,18,ui.hud>0?27:22,ui.hud>0?'#fff6c0':'#ffe9a0','right');
  const r=live();goals.forEach((g,i)=>{const ok=g.p.ok(r,g.n),x=8+i*146;rr(x,34,138,20,10,ok?'#4fa860':'rgba(0,0,0,.3)');tx((ok?'✅':'')+g.p.sh(r,g.n),x+69,44,13,'#fff','center','rgba(0,0,0,.4)')})},
 mid:t=>{if(save.eq.mas>0){const M=MAS[save.eq.mas];if(M.e==='🌟')fish(410,336+Math.sin(t*3)*3,.4,'#ffcf3a','#a87010');else em(M.e,414,334+Math.sin(t*3)*3,40)}},
 fx:()=>{if(s.wea.e==='☀️')seasonFx(s.t,W,700,.6)}})}
/* ---------- 반복 ---------- */
function loop(ts){const dt=Math.min(.05,(ts-last)/1000||0);last=ts;const t=ts/1000;
 if(window.__gal){window.__gal(t);requestAnimationFrame(loop);return}
 if(scr==='game'&&s){if(!paused){acc+=dt;let n=0;while(acc>=B.DT&&n++<4){B.step(s,run,B.DT);acc-=B.DT;drain();if(s.done)break}
  A.tickFx(dt);
  if(s.done){drawGame();finishDay();requestAnimationFrame(loop);return}}drawGame()}
 else{IS.tick(dt,save.fur,1);drawHome(t,scr==='deco')}
 requestAnimationFrame(loop)}
function fit(){const b=document.body,sc=Math.min(b.clientWidth/W,b.clientHeight/H);$('box').style.transform='translate('+(b.clientWidth-W*sc)/2+'px,'+(b.clientHeight-H*sc)/2+'px) scale('+sc+')'}
addEventListener('resize',fit);addEventListener('orientationchange',()=>setTimeout(fit,200));
document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseGame();if(AC){if(document.hidden)AC.suspend();else AC.resume()}});
addEventListener('pagehide',pauseGame);
window.__shop={IS,animal,fish2,bakeCol,em,tx,rr,cx,B,get save(){return save},set save(v){save=v},get run(){return run},get s(){return s},get scr(){return scr},startDay,tap,drain,finishDay,toHome,goalsFor,grade,charmBonus,SLOTS,GR};
fit();if(save.name)toHome();else{renderHome();openName(true)}requestAnimationFrame(loop);
})();
