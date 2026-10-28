/* ===== 비스듬히 내려다보는(아이소메트릭) 가게 그리기 — 가게 홈·꾸미기 화면 공용 =====
   ISO(cx,A) 로 만들고, 매 프레임 draw(t,look,items,opt) 를 불러요.
   look: {n, wall:{c,id}, floor, sky:[위,아래], night, awn, sign, name, top, lit, sL:{e,sz}, sR:{e,sz}, mas:{e}}
   items: [{k,x,y,d}] 바닥에 놓은 가구 */
const ISO=(cx,A)=>{
const {em,tx,rr,m2,lite,dark,animal}=A;const W=450;
/* 가구 목록: p=가격, g=필요한 가게 등급, rot=돌릴 수 있음, seat=손님이 앉음, flat=바닥에 깔림 */
const FUR=[
 {k:'chair',n:'의자',e:'🪑',p:600,g:0,rot:1,seat:1},{k:'table',n:'탁자',e:'🍽️',p:1500,g:0},{k:'plant',n:'화분',e:'🪴',p:800,g:0},
 {k:'rug',n:'러그',e:'🟥',p:1200,g:0,flat:1},{k:'bear',n:'곰 인형',e:'🧸',p:2000,g:0},{k:'stand',n:'붕어 입간판',e:'🐟',p:2500,g:1},
 {k:'lamp',n:'등불',e:'🏮',p:3000,g:1},{k:'sofa',n:'소파',e:'🛋️',p:6000,g:1,rot:1,seat:1},{k:'shelf',n:'빵 진열대',e:'🥐',p:9000,g:2,rot:1},
 {k:'tree',n:'나무 화분',e:'🌳',p:12000,g:2},{k:'tank',n:'어항',e:'🐠',p:25000,g:3},{k:'piano',n:'피아노',e:'🎹',p:60000,g:4,rot:1},
 /* 받침 위 장식 (emo: 받침색 b, 크기 z) */
 {k:'cactus',n:'선인장',e:'🌵',p:1000,g:0,emo:1,b:'#c8643a',z:.46},{k:'basket',n:'빵 바구니',e:'🧺',p:1500,g:0,emo:1,b:'#c89a64',z:.44},
 {k:'candle',n:'촛대',e:'🕯️',p:1800,g:0,emo:1,b:'#8a6a50',z:.42,glow:1},{k:'bench',n:'벤치',e:'🪑',p:4000,g:1,rot:1,seat:1},
 {k:'books',n:'책장',e:'📚',p:4500,g:1,emo:1,b:'#7a5030',z:.5,tall:.42},{k:'frame',n:'그림 이젤',e:'🖼️',p:5000,g:1,emo:1,b:'#6a4024',z:.52},
 {k:'koi',n:'잉어 깃발',e:'🎏',p:6500,g:1,emo:1,b:'#5a5048',z:.6,pole:1},{k:'pinata',n:'피냐타',e:'🪅',p:9000,g:2,emo:1,b:'#e8b04a',z:.52},
 {k:'cake',n:'디저트 진열장',e:'🍰',p:15000,g:2,emo:1,b:'#f0d8e0',z:.4,tall:.36,glass:1},{k:'coffee',n:'커피 머신',e:'☕',p:18000,g:2,emo:1,b:'#5a5a62',z:.42,tall:.3},
 {k:'sakura',n:'벚꽃 나무',e:'🌸',p:22000,g:2,emo:1,b:'#a85a34',z:.9,tree:1},{k:'vase',n:'도자기',e:'🏺',p:30000,g:3,emo:1,b:'#d8c8a8',z:.55},
 {k:'slide',n:'미끄럼틀',e:'🛝',p:40000,g:3,emo:1,b:'#7ec8ff',z:.7},{k:'moai',n:'돌 석상',e:'🗿',p:50000,g:3,emo:1,b:'#8a867c',z:.7},
 {k:'carousel',n:'미니 회전목마',e:'🎠',p:70000,g:4,emo:1,b:'#ff9ab0',z:.8},{k:'claw',n:'뽑기 기계',e:'🧸',p:90000,g:4,emo:1,b:'#ff6a8a',z:.4,tall:.6,glass:1},
 {k:'fountain',n:'분수대',e:'⛲',p:120000,g:4,emo:1,b:'#b8c8d8',z:.85},{k:'train',n:'기차 모형',e:'🚂',p:150000,g:4,emo:1,b:'#6a8a5a',z:.62},
 {k:'trophy',n:'황금 트로피',e:'🏆',p:300000,g:5,emo:1,b:'#3a2a3a',z:.62,glow:1},{k:'wheel',n:'미니 관람차',e:'🎡',p:500000,g:5,emo:1,b:'#7a8aa8',z:1},
 {k:'dragon',n:'용 조각상',e:'🐉',p:800000,g:5,emo:1,b:'#4a3a30',z:.86},{k:'throne',n:'왕좌',e:'👑',p:1500000,g:6,rot:1,seat:1},
 {k:'galaxy',n:'은하 수족관',e:'🌌',p:2500000,g:6,emo:1,b:'#1a1a3a',z:.5,tall:.5,glass:1,glow:1}];
const FK={};FUR.forEach(f=>FK[f.k]=f);
/* 넓히기: n칸, g=필요 등급, p=가격 */
const ROOM=[{n:4,g:0,p:0},{n:5,g:1,p:8000},{n:6,g:2,p:30000},{n:7,g:4,p:120000},{n:8,g:5,p:400000}];
let N=4,TW=96,TH=48,WH=120,OX=225,OY=320;
function layout(n,top,bottom){N=n;TW=Math.min(96,420/N,(bottom-top-40)/(N*.5+1.3));TH=TW/2;WH=Math.round(TW*1.25);OY=Math.round(bottom-N*TH-8);if(OY-WH<top+30)OY=top+30+WH}
const iso=(gx,gy)=>({x:OX+(gx-gy)*TW/2,y:OY+(gx+gy)*TH/2});
const toTile=(x,y)=>{const a=(x-OX)/(TW/2),b=(y-OY)/(TH/2);return{gx:Math.floor((a+b)/2),gy:Math.floor((b-a)/2)}};
const inRoom=(gx,gy,n=N)=>gx>=0&&gy>=0&&gx<n&&gy<n;
const isCounter=(gx,gy)=>gy===0&&(gx===1||gx===2);
const isPath=(gx,gy,n=N)=>(gy===1&&gx>=1&&gx<=n-1)||(gx===n-1&&gy>=1&&gy<=n-1);
const canPlace=(gx,gy,n=N)=>inRoom(gx,gy,n)&&!isCounter(gx,gy)&&!isPath(gx,gy,n);
/* ---------- 기본 도형 ---------- */
function poly(pts,fill,stroke,lw=1.5){cx.beginPath();pts.forEach((p,i)=>i?cx.lineTo(p.x,p.y):cx.moveTo(p.x,p.y));cx.closePath();if(fill){cx.fillStyle=fill;cx.fill()}if(stroke){cx.strokeStyle=stroke;cx.lineWidth=lw;cx.stroke()}}
const up=(p,h)=>({x:p.x,y:p.y-h});
function box(gx,gy,m,h,col,o={}){const T=iso(gx+m,gy+m),Rr=iso(gx+1-m,gy+m),B=iso(gx+1-m,gy+1-m),L=iso(gx+m,gy+1-m);const z=o.z||0;
 const T0=up(T,z),R0=up(Rr,z),B0=up(B,z),L0=up(L,z),T1=up(T,z+h),R1=up(Rr,z+h),B1=up(B,z+h),L1=up(L,z+h);const ln=o.line||dark(col,.45);
 poly([L0,B0,B1,L1],dark(col,.12),ln);poly([B0,R0,R1,B1],dark(col,.24),ln);poly([T1,R1,B1,L1],o.top||lite(col,.08),ln);return{T:T1,R:R1,B:B1,L:L1,c:{x:(T1.x+B1.x)/2,y:(T1.y+B1.y)/2}}}
function panel(gx,gy,d,m,z,h,col){const T=iso(gx+m,gy+m),Rr=iso(gx+1-m,gy+m),B=iso(gx+1-m,gy+1-m),L=iso(gx+m,gy+1-m);const E=[[T,Rr],[L,T],[Rr,B],[B,L]][d];
 poly([up(E[0],z),up(E[1],z),up(E[1],z+h),up(E[0],z+h)],d>=2?dark(col,.1):col,dark(col,.45))}
function shadow(x,y,w){cx.fillStyle='rgba(0,0,0,.16)';cx.beginPath();cx.ellipse(x,y,w,w*.45,0,0,7);cx.fill()}
/* ---------- 가구 ---------- */
function drawItem(it,t,sel){const gx=it.x,gy=it.y,d=it.d|0,c=iso(gx+.5,gy+.5),s=TW/78;
 switch(it.k){
 case'table':{shadow(c.x,c.y+2,TW*.28);const p=box(gx,gy,.36,TW*.22,'#8a5a3a');cx.fillStyle='#c98a54';cx.strokeStyle='#6a4024';cx.lineWidth=1.5;cx.beginPath();cx.ellipse(p.c.x,p.c.y-2,TW*.32,TH*.32,0,0,7);cx.fill();cx.stroke();em('☕',p.c.x+6*s,p.c.y-8*s,16*s);em('🐟',p.c.x-8*s,p.c.y-4*s,13*s);break}
 case'chair':{shadow(c.x,c.y+2,TW*.2);const back=d<2;if(back)panel(gx,gy,d,.28,TW*.14,TW*.22,'#b0703f');box(gx,gy,.28,TW*.14,'#d08a4e');if(!back)panel(gx,gy,d,.28,TW*.14,TW*.18,'#b0703f');break}
 case'sofa':{shadow(c.x,c.y+2,TW*.34);if(d<2)panel(gx,gy,d,.1,TW*.12,TW*.2,'#d0607a');box(gx,gy,.12,TW*.13,'#e8788f');if(d>=2)panel(gx,gy,d,.1,TW*.12,TW*.14,'#d0607a');break}
 case'plant':{shadow(c.x,c.y+2,TW*.18);const p=box(gx,gy,.34,TW*.14,'#c8643a');em('🪴',p.c.x,p.c.y-TW*.22,TW*.5);break}
 case'tree':{shadow(c.x,c.y+2,TW*.24);const p=box(gx,gy,.3,TW*.16,'#a85a34');em('🌳',p.c.x,p.c.y-TW*.42+Math.sin(t*1.5+gx)*1,TW*.9);break}
 case'lamp':{shadow(c.x,c.y+2,TW*.14);cx.fillStyle='#5a4638';cx.fillRect(c.x-2,c.y-TW*.62,4,TW*.62);const gl=cx.createRadialGradient(c.x,c.y-TW*.7,2,c.x,c.y-TW*.7,TW*.6);gl.addColorStop(0,'rgba(255,220,140,'+(.45+.1*Math.sin(t*3))+')');gl.addColorStop(1,'rgba(255,220,140,0)');cx.fillStyle=gl;cx.beginPath();cx.arc(c.x,c.y-TW*.7,TW*.6,0,7);cx.fill();em('🏮',c.x,c.y-TW*.72,TW*.42);break}
 case'shelf':{shadow(c.x,c.y+2,TW*.34);box(gx,gy,.12,TW*.5,'#9a6a40',{top:'#b88456'});for(let r=0;r<2;r++)for(let q=0;q<3;q++){const u=(q+.5)/3,a=d%2?iso(gx+.12,gy+.12+u*.76):iso(gx+.12+u*.76,gy+.88);em(['🥐','🍞','🐟'][(q+r)%3],a.x+(d%2?TW*.1:-TW*.04),a.y-TW*(.14+r*.18),TW*.2)}break}
 case'tank':{shadow(c.x,c.y+2,TW*.3);box(gx,gy,.16,TW*.08,'#5a4a40');box(gx,gy,.18,TW*.36,'#9fd8f0',{z:TW*.08,top:'rgba(200,240,255,.9)',line:'#5a9ab8'});em('🐠',c.x+Math.sin(t*1.2+gx)*TW*.14,c.y-TW*.28,TW*.22);em('🐟',c.x-Math.sin(t*1.5)*TW*.1,c.y-TW*.18,TW*.16);break}
 case'piano':{shadow(c.x,c.y+2,TW*.34);const p=box(gx,gy,.12,TW*.34,'#2e2a2e',{top:'#3e3a40'});const E=[[p.T,p.R],[p.L,p.T],[p.R,p.B],[p.B,p.L]][d];cx.strokeStyle='#fff';cx.lineWidth=TW*.07;cx.beginPath();cx.moveTo((E[0].x*3+p.c.x)/4,(E[0].y*3+p.c.y)/4);cx.lineTo((E[1].x*3+p.c.x)/4,(E[1].y*3+p.c.y)/4);cx.stroke();em('🎵',p.c.x+Math.sin(t*2)*6,p.c.y-TW*.35-m2(t*20,14),TW*.18,.8);break}
 case'rug':{poly([iso(gx+.06,gy+.06),iso(gx+.94,gy+.06),iso(gx+.94,gy+.94),iso(gx+.06,gy+.94)],'#d85a5a','#a83a3a',2);poly([iso(gx+.22,gy+.22),iso(gx+.78,gy+.22),iso(gx+.78,gy+.78),iso(gx+.22,gy+.78)],'#f0b060');break}
 case'bear':{shadow(c.x,c.y+2,TW*.16);em('🧸',c.x,c.y-TW*.2,TW*.46);break}
 case'bench':{shadow(c.x,c.y+2,TW*.34);if(d<2)panel(gx,gy,d,.12,TW*.13,TW*.16,'#8a5a3a');box(gx,gy,.14,TW*.12,'#b07a4a');if(d>=2)panel(gx,gy,d,.12,TW*.12,TW*.12,'#8a5a3a');break}
 case'throne':{shadow(c.x,c.y+2,TW*.32);if(d<2)panel(gx,gy,d,.14,TW*.16,TW*.46,'#c8283c');box(gx,gy,.16,TW*.16,'#d4a020',{top:'#e84050'});if(d>=2)panel(gx,gy,d,.14,TW*.16,TW*.2,'#c8283c');em('👑',c.x,c.y-TW*.62,TW*.3);break}
 case'stand':{shadow(c.x,c.y+2,TW*.18);cx.fillStyle='#6a4024';cx.fillRect(c.x-TW*.16,c.y-TW*.2,3,TW*.2);cx.fillRect(c.x+TW*.14,c.y-TW*.2,3,TW*.2);rr(c.x-TW*.24,c.y-TW*.62,TW*.48,TW*.44,8,'#fff3dc');cx.strokeStyle='#8a5a3a';cx.lineWidth=2;cx.strokeRect(c.x-TW*.24,c.y-TW*.62,TW*.48,TW*.44);A.fish2(c.x,c.y-TW*.42,TW*.0042,'#f0b850',{plain:true});tx('붕어빵',c.x,c.y-TW*.26,Math.max(9,TW*.13),'#8a3a1a','center','#fff3dc');break}
 default:{const f=FK[it.k];if(!f||!f.emo)break;shadow(c.x,c.y+2,TW*.3);const h=TW*(f.tall||.1);const p=box(gx,gy,f.tall?.14:.3,h,f.b,f.glass?{top:'rgba(220,240,255,.85)'}:{});
  if(f.pole){cx.fillStyle='#5a5048';cx.fillRect(c.x-2,c.y-TW*.9,4,TW*.9)}
  if(f.glow){const g=cx.createRadialGradient(p.c.x,p.c.y-TW*.3,2,p.c.x,p.c.y-TW*.3,TW*.55);g.addColorStop(0,'rgba(255,230,150,'+(.4+.1*Math.sin(t*3))+')');g.addColorStop(1,'rgba(255,230,150,0)');cx.fillStyle=g;cx.beginPath();cx.arc(p.c.x,p.c.y-TW*.3,TW*.55,0,7);cx.fill()}
  const sway=f.tree||f.pole?Math.sin(t*1.5+gx)*1.2:0;em(f.e,p.c.x+sway,p.c.y-TW*f.z*.5-(f.pole?TW*.5:0)+(f.glass?TW*.12:0),TW*f.z)}
 }
 if(sel){cx.globalAlpha=.6+.4*Math.sin(t*6);poly([iso(gx,gy),iso(gx+1,gy),iso(gx+1,gy+1),iso(gx,gy+1)],null,'#ffc94a',3);cx.globalAlpha=1}}
/* ---------- 손님 (꾸밈용으로 걸어다녀요) ---------- */
let cust=[],spawnT=1.5,nid=1,fx=[];const AN=BP2.R.an;
function pathOut(){return[{x:N-.5,y:1.5},{x:N-.5,y:N-.5},{x:N+1.3,y:N-.5}]}
function queuePts(){const P=[{x:2,y:1.5},{x:N-.5,y:1.5},{x:N-.5,y:N-.5},{x:N+1.3,y:N-.5}],out=[];
 for(let i=0;i<8;i++){let dist=i*.9,p=null;for(let j=0;j<P.length-1;j++){const a=P[j],b=P[j+1],L=Math.hypot(b.x-a.x,b.y-a.y);if(dist<=L){p={x:a.x+(b.x-a.x)*dist/L,y:a.y+(b.y-a.y)*dist/L};break}dist-=L}out.push(p||P[P.length-1])}return out}
function say(c,t){c.bub=t;c.bt=2}
function step(dt,items,rate=1){spawnT-=dt*rate;if(spawnT<=0){if(cust.length<6)cust.push({id:nid++,an:AN[Math.floor(Math.random()*AN.length)],x:N+1.6,y:N-.5,st:'q',route:[],t:0,sh:['#7ec8ff','#ff9ab0','#9ad870','#ffd23a','#b48aff'][nid%5]});spawnT=2.6+Math.random()*2.6}
 const seats=items.filter(it=>FK[it.k]&&FK[it.k].seat&&inRoom(it.x,it.y));const free=()=>seats.find(ch=>!cust.some(c=>c.seat===ch));
 const Q=queuePts(),inQ=cust.filter(c=>c.st==='q');inQ.forEach((c,i)=>c.route=[Q[Math.min(i,Q.length-1)]]);
 for(const c of cust){c.t+=dt;if(c.bt>0)c.bt-=dt;
  if(c.seat&&!items.includes(c.seat)){c.seat=null;if(c.st==='sit'||c.st==='go'){c.st='out';c.route=[{x:c.x,y:1.5},...pathOut()]}}
  if(c.st==='q'){const tg=c.route[0];if(inQ[0]===c&&Math.hypot(c.x-tg.x,c.y-tg.y)<.05){c.w=(c.w||0)+dt;if(c.w>.3&&!c.asked){c.asked=1;say(c,'🐟 하나 주세요!')}if(c.w>1.8){c.st='buy';c.w=0}}}
  else if(c.st==='buy'){c.w+=dt;if(c.w>.6&&!c.paid){c.paid=1;say(c,'💖 고마워요!');const p=iso(c.x,c.y);fx.push({e:'🪙',x:p.x,y:p.y-TW*.9,l:1})}
   if(c.w>1.2){const ch=free();if(ch){c.seat=ch;c.st='go';c.route=[{x:c.x,y:ch.y+.5},{x:ch.x+.5,y:ch.y+.5}]}else{c.st='out';c.route=pathOut()}}}
  else if(c.st==='go'&&!c.route.length){c.st='sit';c.w=0;say(c,['😋 맛있다!','😊 여기 좋네요','🥰 분위기 최고'][c.id%3])}
  else if(c.st==='sit'){c.w+=dt;if(c.w>4.5){c.st='out';c.seat=null;c.route=[{x:c.x,y:1.5},...pathOut()];say(c,'또 올게요 👋')}}
  if(c.st!=='sit'&&c.route.length){const tg=c.route[0],dx=tg.x-c.x,dy=tg.y-c.y,L=Math.hypot(dx,dy),sp=1.6*dt;if(L<=sp){c.x=tg.x;c.y=tg.y;if(c.st!=='q')c.route.shift()}else{c.x+=dx/L*sp;c.y+=dy/L*sp;c.mv=1}}else c.mv=0}
 cust=cust.filter(c=>!(c.st==='out'&&!c.route.length));for(const f of fx)f.l-=dt;fx=fx.filter(f=>f.l>0)}
function reset(){cust=[];spawnT=1.2}
function bubble(x,y,t,a){cx.globalAlpha=a;cx.font='bold 13px "Jua","Noto Sans KR",sans-serif';const w=cx.measureText(t).width+16;rr(x-w/2,y-12,w,24,12,'#fff');cx.beginPath();cx.moveTo(x-5,y+11);cx.lineTo(x,y+17);cx.lineTo(x+5,y+11);cx.closePath();cx.fillStyle='#fff';cx.fill();tx(t,x,y,13,'#5a3a22','center','#fff');cx.globalAlpha=1}
function drawCust(c,t){const p=iso(c.x,c.y),sz=TW*.62,bob=c.mv?Math.abs(Math.sin(c.t*11))*3:0;let y=p.y-sz*.88-bob;if(c.st==='sit')y-=TW*.12;
 shadow(p.x,p.y,sz*.34);animal(c.an,p.x,y,sz,{walk:c.mv?c.t*10+c.id:null,t,ph:c.id,mood:c.st==='sit'||c.paid?'h':'n',shirt:c.sh});if(c.st==='sit')em('🐟',p.x+sz*.42,y+sz*.5,sz*.32);
 if(c.bub&&c.bt>0)bubble(p.x,y-sz*.75,c.bub,Math.min(1,c.bt*3))}
/* ---------- 마스코트: 가게 안을 천천히 돌아다녀요 ---------- */
const pet={x:.5,y:2.5,tx:.5,ty:2.5,w:0};
function petStep(dt,items){const sp=.6*dt,dx=pet.tx-pet.x,dy=pet.ty-pet.y,L=Math.hypot(dx,dy);if(L>sp){pet.x+=dx/L*sp;pet.y+=dy/L*sp;pet.mv=1}else{pet.mv=0;pet.w-=dt;if(pet.w<=0){pet.w=2+Math.random()*3;for(let k=0;k<12;k++){const gx=Math.floor(Math.random()*N),gy=Math.floor(Math.random()*N);if(canPlace(gx,gy)&&!items.some(it=>it.x===gx&&it.y===gy)){pet.tx=gx+.5;pet.ty=gy+.5;break}}}}}
function drawPet(look,t){const p=iso(pet.x,pet.y),b=pet.mv?Math.abs(Math.sin(t*10))*3:Math.sin(t*2)*1.5;if(look.mas.e==='🌟'){A.fish2(p.x,p.y-TW*.4-b,TW*.005,'#ffcf3a',{glow:'#ffe066'});return}shadow(p.x,p.y,TW*.16);em(look.mas.e,p.x,p.y-TW*.24-b,TW*.42)}
/* ---------- 꾸밈 칸 그리기 ---------- */
const WP=[null,null,null,null,'brick','plank','tile','marble','gold'];
const FLR=[['#cfc9bd','#c4beb2',0],['#f6f0e4','#d2a46a',1],['#d8a86c','#c99a5e',2],['#9ed27a','#8cc46a',3],['#bdb7aa','#a8a296',4],['#c8283c','#b01e30',5],['#9ad0ff','#c8a8ff',6]];
const AWC=[['#e8584a','#fff6ec'],['#4a8ae8','#fff6ec'],['#4ab86a','#fff6ec'],['#ff8ab0','#fff0f6'],['#ffcf3a','#fff6ec'],['rb'],['#2a3a7a','#ffd23a'],['#ffb0c8','#fff0f6'],['#d4a020','#fff3c0']];
const RB=['#ff5a5a','#ff9a3a','#ffd93a','#6ccf5a','#4aa8ff','#a85aff'];
function drawSky(look,t){const g=cx.createLinearGradient(0,0,0,OY);g.addColorStop(0,look.sky[0]);g.addColorStop(1,look.sky[1]);cx.fillStyle=g;cx.fillRect(0,0,W,800);
 if(look.night){cx.fillStyle='#fff';for(let i=0;i<30;i++){cx.globalAlpha=.4+.6*Math.abs(Math.sin(t*1.5+i));cx.beginPath();cx.arc((i*97)%W,(i*53)%Math.max(60,OY-WH-20)+60,1.4,0,7);cx.fill()}cx.globalAlpha=1;em('🌙',380,110,34)}
 else{em('☀️',385,120,46);cx.fillStyle='rgba(255,255,255,.8)';for(let i=0;i<4;i++){const x=m2(t*5+i*130,560)-60;cx.beginPath();cx.ellipse(x,100+i*16,30,9,0,0,7);cx.fill()}}
 if(look.lit===5){for(let b=0;b<3;b++){const g2=cx.createLinearGradient(0,60,0,OY);const c=['120,255,200','180,120,255','120,200,255'][b];g2.addColorStop(0,'rgba('+c+',0)');g2.addColorStop(.5,'rgba('+c+','+(.18+.08*Math.sin(t+b))+')');g2.addColorStop(1,'rgba('+c+',0)');cx.fillStyle=g2;const x=60+b*130+Math.sin(t*.7+b)*30;cx.beginPath();cx.moveTo(x,60);cx.lineTo(x+70,60);cx.lineTo(x+120,OY);cx.lineTo(x+20,OY);cx.closePath();cx.fill()}}
 if(look.top===6){const cl=['255,90,120','255,200,60','120,220,255','160,255,140'];for(let b=0;b<4;b++){const ph=m2(t*.6+b*.27,1),bx=60+b*110,by=110+(b%2)*30,cc=cl[b];if(ph<.8){const u=ph/.8,rad=12+u*40;cx.fillStyle='rgba('+cc+','+(1-u)+')';for(let i=0;i<14;i++){const a=i/14*Math.PI*2;cx.beginPath();cx.arc(bx+Math.cos(a)*rad,by+Math.sin(a)*rad+u*u*12,2.4,0,7);cx.fill()}}}}}
function drawGround(look,t){const ground=look.night?'#6f9a62':'#a8d890',Rc=iso(N,0),Bc=iso(N,N),Lc=iso(0,N);
 cx.fillStyle=ground;cx.beginPath();cx.moveTo(0,OY+(Lc.y-OY)*.2);cx.lineTo(W,OY+(Rc.y-OY)*.2);cx.lineTo(W,800);cx.lineTo(0,800);cx.closePath();cx.fill();
 /* 인도 */
 poly([iso(N,N-1),iso(N+3,N-1),iso(N+3,N),iso(N,N)],'#d8cbb6','#bba98e');for(let k=0;k<3;k++)poly([iso(N+k,N-1),iso(N+k+1,N-1),iso(N+k+1,N),iso(N+k,N)],null,'rgba(120,100,80,.25)',1);
 /* 마당 장식 (왼쪽·오른쪽) */
 const side=(it,p)=>{if(it&&it.sz){shadow(p.x,p.y,it.sz*.3);const z=it.sz*TW/96*.8;em(it.e,p.x,p.y-z*.42,z)}};
 side(look.sL,iso(-.9,N-.6));side(look.sR,iso(N+1.5,N-2.6))}
function drawWalls(look,t){const T=iso(0,0),Rc=iso(N,0),Lc=iso(0,N),wc=look.wall.c,wp=WP[look.wall.id];
 poly([T,Rc,up(Rc,WH),up(T,WH)],dark(wc,.08),dark(wc,.35));poly([Lc,T,up(T,WH),up(Lc,WH)],lite(wc,.05),dark(wc,.35));
 const lines=(n,col,lw,vert)=>{cx.strokeStyle=col;cx.lineWidth=lw;for(let i=1;i<n;i++){const u=i/n;if(vert){for(const [a,b] of [[iso(u*N,0),0],[iso(0,u*N),0]]){cx.beginPath();cx.moveTo(a.x,a.y);cx.lineTo(a.x,a.y-WH);cx.stroke()}}else{const h=WH*u;cx.beginPath();cx.moveTo(Lc.x,Lc.y-h);cx.lineTo(T.x,T.y-h);cx.lineTo(Rc.x,Rc.y-h);cx.stroke()}}};
 if(wp==='brick'){lines(7,'rgba(110,40,20,.35)',1.2,0);lines(N*4,'rgba(110,40,20,.18)',1,1)}
 else if(wp==='plank')lines(N*3,'rgba(90,50,20,.3)',1.4,1);
 else if(wp==='tile'){lines(6,'rgba(150,150,140,.4)',1,0);lines(N*3,'rgba(150,150,140,.4)',1,1)}
 else if(wp==='marble'){cx.strokeStyle='rgba(150,140,130,.35)';cx.lineWidth=1.2;for(let i=0;i<8;i++){const a=iso((i*.37%1)*N,0),b=iso(0,(i*.61%1)*N);cx.beginPath();cx.moveTo(a.x,a.y-WH*.2);cx.quadraticCurveTo(a.x+10,a.y-WH*.5,a.x-6,a.y-WH*.9);cx.stroke();cx.beginPath();cx.moveTo(b.x,b.y-WH*.15);cx.quadraticCurveTo(b.x-10,b.y-WH*.5,b.x+6,b.y-WH*.85);cx.stroke()}}
 else if(wp==='gold'){const g=cx.createLinearGradient(Lc.x,0,Rc.x,0);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(m2(t*.2,1),'rgba(255,255,255,.35)');g.addColorStop(1,'rgba(255,255,255,0)');poly([Lc,T,Rc,up(Rc,WH),up(T,WH),up(Lc,WH)],g)}
 else if(look.wall.id===1||look.wall.id===2||look.wall.id===3){cx.fillStyle='rgba(255,255,255,.5)';for(let i=0;i<N*2;i++)for(let r=0;r<3;r++){const u=(i+.5)/(N*2),a=iso(u*N,0),b=iso(0,u*N);cx.beginPath();cx.arc(a.x,a.y-WH*(.22+r*.28),2,0,7);cx.fill();cx.beginPath();cx.arc(b.x,b.y-WH*(.22+r*.28),2,0,7);cx.fill()}}
 const trim=look.wall.id===8?'#b8860b':'#8a5a3a';poly([up(Lc,WH),up(T,WH),up(Rc,WH),up(Rc,WH+6),up(T,WH+6),up(Lc,WH+6)],trim);
 const win=(a,b)=>{const p=[up(a,WH*.36),up(b,WH*.36),up(b,WH*.8),up(a,WH*.8)];poly(p,look.night?'#2a3a6a':'#bfe6ff',trim,3);cx.strokeStyle=trim;cx.lineWidth=2;cx.beginPath();cx.moveTo((p[0].x+p[1].x)/2,(p[0].y+p[1].y)/2);cx.lineTo((p[2].x+p[3].x)/2,(p[2].y+p[3].y)/2);cx.stroke()};
 win(iso(0,N-1.5),iso(0,N-.5));win(iso(N-1.8,0),iso(N-.7,0));
 /* 간판(메뉴판) + 차양: 카운터 위 오른쪽 벽 */
 const a=iso(0,2.2),b=iso(0,.45),sid=look.sign|0;
 const SB=[['#8a5a3a','#fff3c0'],['#ff8ab0','#fff'],['#2a3a32','#f0f0e0'],['#2a1a3a','#e8b0ff'],['#d4a020','#fff6d0'],['rb','#fff'],['#d4a020','#fff6d0'],['#1a2a5a','#fff6c0']][sid]||['#8a5a3a','#fff3c0'];
 const sp=[up(a,WH*.48),up(b,WH*.48),up(b,WH*.8),up(a,WH*.8)];
 if(SB[0]==='rb'){const g=cx.createLinearGradient(a.x,0,b.x,0);RB.forEach((c,i)=>g.addColorStop(i/5,c));poly(sp,g,'#5a3a22',2)}else poly(sp,SB[0],sid===3?'hsl('+((t*60)%360)+',100%,70%)':'#5a3a22',sid===3?3:2);
 const mc={x:(a.x+b.x)/2,y:(a.y+b.y)/2-WH*.64};tx(look.name,mc.x,mc.y,Math.max(11,Math.min(18,TW*.18)),SB[1],'center',SB[0]==='rb'?'#5a3a22':SB[0]);if(sid===6)em('👑',mc.x,mc.y-WH*.24,TW*.3);if(sid===7)for(let i=0;i<3;i++){cx.globalAlpha=.4+.6*Math.abs(Math.sin(t*2+i));em('✨',mc.x-TW*.6+i*TW*.6,mc.y-WH*.2,TW*.14);cx.globalAlpha=1}
 const ac=AWC[look.awn|0]||AWC[0],n=8;for(let i=0;i<n;i++){const u0=i/n,u1=(i+1)/n,p0=iso(1+u0*2,0),p1=iso(1+u1*2,0);const col=ac[0]==='rb'?RB[i%6]:i%2?ac[1]:ac[0];
  const top0=up(p0,WH*.58),top1=up(p1,WH*.58),bo0={x:top0.x+TW*.08,y:top0.y+TW*.2},bo1={x:top1.x+TW*.08,y:top1.y+TW*.2};poly([top0,top1,bo1,bo0],col,'rgba(0,0,0,.15)',1);
  cx.fillStyle=col;cx.beginPath();cx.arc((bo0.x+bo1.x)/2,(bo0.y+bo1.y)/2,Math.hypot(bo1.x-bo0.x,bo1.y-bo0.y)/2,0,Math.PI);cx.fill()}
 /* 지붕 장식 (벽 윗줄) */
 const top=look.top|0;
 if(top===1){const cl=['#ff6a6a','#ffb04a','#6cc8ff','#7ed88a','#c08aff','#ff8ac0'];for(const [p0,p1] of [[Lc,T],[T,Rc]])for(let i=0;i<6;i++){const u=(i+.5)/6,x=p0.x+(p1.x-p0.x)*u,y=p0.y+(p1.y-p0.y)*u-WH-6+Math.sin(u*Math.PI)*8;A.fish2(x,y+8,TW*.0022,cl[i],{rot:Math.PI/2+Math.sin(t*2+i)*.25,plain:true})}}
 if(top===2){for(const p of [up(T,WH+20),up(Lc,WH+14),up(Rc,WH+14)])for(let i=0;i<3;i++){const c=['#ff6a8a','#ffd23a','#6cc8ff'][i];cx.fillStyle=c;cx.beginPath();cx.ellipse(p.x-14+i*14,p.y-i%2*8+Math.sin(t*1.6+i)*3,9,11,0,0,7);cx.fill()}}
 if(top===3){const p=up(T,WH+26);A.fish2(p.x,p.y+Math.sin(t*1.8)*2,TW*.009,'#ffcf3a',{glow:'rgba(255,220,80,.9)'})}
 if(top===4){const p=up(Rc,WH+4),q=up(T,WH+4);poly([p,q,up(q,30),up(p,30)],'#1a1a22','#555',2);cx.save();cx.beginPath();cx.moveTo(p.x,p.y);cx.lineTo(q.x,q.y);cx.lineTo(q.x,q.y-30);cx.lineTo(p.x,p.y-30);cx.closePath();cx.clip();cx.font='bold 16px "Jua",sans-serif';cx.fillStyle='#ffc850';cx.shadowColor='#ffb030';cx.shadowBlur=8;const msg='🐟 갓 구운 붕어빵 '+look.name+' 🐟  ';const w=cx.measureText(msg).width,ox=-m2(t*40,w);for(let k=0;k<3;k++)cx.fillText(msg,q.x+ox+k*w,(p.y+q.y)/2-8);cx.restore()}
 if(top===5){const p=up(T,WH+30);cx.save();cx.shadowColor='#ffd23a';cx.shadowBlur=14+6*Math.sin(t*2);em('👑',p.x,p.y,TW*.6);cx.restore()}
 /* 조명 */
 const lit=look.lit|0;
 if(lit===1){for(const [p0,p1] of [[Lc,T],[T,Rc]])for(let i=0;i<10;i++){const u=(i+.5)/10,x=p0.x+(p1.x-p0.x)*u,y=p0.y+(p1.y-p0.y)*u-WH+8+Math.sin(u*Math.PI)*6,c=['#ff6a5a','#ffd23a','#7ed88a','#7ec8ff'][(i+Math.floor(t*2))%4];cx.fillStyle=c;cx.shadowColor=c;cx.shadowBlur=8;cx.beginPath();cx.arc(x,y,3.4,0,7);cx.fill();cx.shadowBlur=0}}
 if(lit===2){for(let i=0;i<5;i++){const u=(i+.5)/5,p=i%2?iso(0,u*N):iso(u*N,0);em('⭐',p.x,p.y-WH*.88+Math.sin(t*2+i)*3,TW*.18)}}
 if(lit===3){cx.save();const c='hsl('+((t*60)%360)+',100%,65%)';cx.shadowColor=c;cx.shadowBlur=12;cx.strokeStyle=c;cx.lineWidth=3;cx.beginPath();cx.moveTo(Lc.x,Lc.y-WH+4);cx.lineTo(T.x,T.y-WH+4);cx.lineTo(Rc.x,Rc.y-WH+4);cx.stroke();cx.restore()}}
function drawFloor(look,t,edit){const f=FLR[look.floor|0]||FLR[0];
 for(let gx=0;gx<N;gx++)for(let gy=0;gy<N;gy++){const pts=[iso(gx,gy),iso(gx+1,gy),iso(gx+1,gy+1),iso(gx,gy+1)];let c=f[0];
  if(f[2]===1&&(gx+gy)%2)c=f[1];if(f[2]===4)c=(gx*7+gy*3)%3?f[0]:f[1];
  if(f[2]===6){c=(gx+gy)%2?f[0]:f[1]}poly(pts,c,f[2]===0||f[2]===2||f[2]===4?'rgba(0,0,0,.08)':null,1);
  if(f[2]===2){cx.strokeStyle='rgba(120,70,30,.2)';cx.lineWidth=1;for(const v of[.33,.66]){const a=iso(gx,gy+v),b=iso(gx+1,gy+v);cx.beginPath();cx.moveTo(a.x,a.y);cx.lineTo(b.x,b.y);cx.stroke()}}
  if(f[2]===3&&(gx*5+gy)%3===0)em('🌼',iso(gx+.5,gy+.5).x,iso(gx+.5,gy+.5).y,TW*.14)}
 if(f[2]===5){poly([iso(.3,.3),iso(N-.3,.3),iso(N-.3,N-.3),iso(.3,N-.3)],null,'#f0c040',3)}
 if(f[2]===6)for(let i=0;i<8;i++){const p=iso((i*.37%1)*N,(i*.71%1)*N);cx.globalAlpha=.3+.7*Math.abs(Math.sin(t*1.6+i));em('✨',p.x,p.y,TW*.14);cx.globalAlpha=1}
 for(let gx=0;gx<N;gx++)for(let gy=0;gy<N;gy++)if(isPath(gx,gy)){cx.globalAlpha=edit?.34:.1;poly([iso(gx+.12,gy+.12),iso(gx+.88,gy+.12),iso(gx+.88,gy+.88),iso(gx+.12,gy+.88)],'#fff');cx.globalAlpha=1}
 const Lc=iso(0,N),Bc=iso(N,N),Rc=iso(N,0);poly([Lc,Bc,up(Bc,-8),up(Lc,-8)],dark(f[0],.3));poly([Bc,Rc,up(Rc,-8),up(Bc,-8)],dark(f[0],.42));
 poly([iso(N-.08,N-.9),iso(N+.4,N-.9),iso(N+.4,N-.1),iso(N-.08,N-.1)],'#c84a3a')}
/* ---------- 직원 (경영에서 뽑은 알바만 보여요) ---------- */
function apron(x,y,s,col){const w=s*.46,h=s*.4,ty=y+s*.3;cx.globalAlpha=.94;rr(x-w/2,ty,w,h,s*.08,col);cx.globalAlpha=1;rr(x-w*.2,ty+h*.38,w*.4,h*.3,s*.04,'rgba(255,255,255,.5)');cx.strokeStyle=col;cx.lineWidth=Math.max(1.5,s*.03);cx.beginPath();cx.moveTo(x-w*.42,ty+2);cx.lineTo(x-w*.2,ty-s*.12);cx.moveTo(x+w*.42,ty+2);cx.lineTo(x+w*.2,ty-s*.12);cx.stroke()}
function badge(x,y,e,col){const r=TW*.11;cx.fillStyle='#fff';cx.beginPath();cx.arc(x,y,r,0,7);cx.fill();cx.strokeStyle=col;cx.lineWidth=2.5;cx.stroke();em(e,x,y,r*1.35)}
const SCOL={bake:'#e8a840',serve:'#ff8ab0',promo:'#ff9a3a',barista:'#3a8a5a'};
function staffBack(t,look){const S=look.staff||{};
 if(look.cafe&&S.barista>0){const p=iso(.5,.32),s=TW*.5,y=p.y-TW*.78;animal('🐼',p.x,y,s,{t,ph:3,mood:'h'});
  em('☕',p.x+s*.42,y+s*.62,s*.3);const ph=m2(t*.9,1);cx.fillStyle='rgba(255,255,255,'+(.6*(1-ph))+')';cx.beginPath();cx.ellipse(p.x+s*.42,y+s*.42-ph*s*.3,3+ph*3,2+ph*2,0,0,7);cx.fill()}}
function staffBack2(t,look){const S=look.staff||{};
 if(S.bake>0){const p=iso(1.3,.06),s=TW*.5,y=p.y-TW*.86;animal('🐻',p.x,y,s,{t,ph:5,mood:'h'});
  const hop=m2(t*.8,1);if(hop<.5){const u=hop/.5;A.bread(p.x-s*.38,y+s*.5-Math.sin(u*Math.PI)*s*.5,TW*.0026,'#f0b850',{rot:u*Math.PI*2,plain:true})}}}
function staffFront(t,look,L){const S=look.staff||{};
 if(S.serve>0&&N>=4){const gx=3.42,gy=.5;L.push({z:gx+gy+.2,f:()=>{const p=iso(gx,gy),s=TW*.56,y=p.y-s*.88;shadow(p.x,p.y,s*.3);animal('🐰',p.x,y,s,{t,ph:7,mood:'h'});apron(p.x,y,s,SCOL.serve);badge(p.x+s*.46,y-s*.25,'🧾',SCOL.serve);
  const q=iso(gx-.05,gy+.42);rr(q.x-s*.2,q.y-s*.5,s*.4,s*.3,4,'#7a7a86');rr(q.x-s*.16,q.y-s*.46,s*.32,s*.1,2,'#bfe8bf');rr(q.x-s*.24,q.y-s*.22,s*.48,s*.1,3,'#5a5a66')}})}
 if(S.promo>0){const gx=N+1.3,gy=N-2.1-(N-4)*.15;L.push({z:gx+gy,f:()=>{const p=iso(gx,gy),s=TW*.56,w=Math.sin(t*5),y=p.y-s*.88-Math.abs(w)*2;shadow(p.x,p.y,s*.3);animal('🦊',p.x,y,s,{t,ph:9,mood:'h',tilt:w*.05});apron(p.x,y,s,SCOL.promo);
  cx.save();cx.translate(p.x+s*.48,y+s*.35);cx.rotate(-.3+w*.25);em('📄',0,0,s*.34);cx.restore();badge(p.x-s*.56,y-s*.5,'📣',SCOL.promo);
  const ph=t%8;const ms=look.cafe?['🐟 따끈한 붕어빵!','어서 오세요~','☕ 커피도 있어요!','오늘 맛있어요!']:['🐟 따끈한 붕어빵!','어서 오세요~','오늘 맛있어요!'];if(ph<2.4)bubble(p.x,y-s*.82,ms[Math.floor(t/8)%ms.length],Math.min(1,(2.4-ph)*3,ph*3))}})}}
function drawCounter(t,look){const S=(look&&look.staff)||{},c=iso(S.bake>0||S.barista>0?2.35:2,.35);staffBack(t,look||{});staffBack2(t,look||{});animal('cook',c.x,c.y-TW*.95,TW*.66,{t,ph:0,mood:'h',shirt:'#ffffff'});
 box(1,0,.06,TW*.34,'#b97d4a',{top:'#d9a06a'});box(2,0,.06,TW*.34,'#b97d4a',{top:'#d9a06a'});
 const p=iso(2,.5);for(let i=0;i<3;i++)A.bread(p.x-TW*.32+i*TW*.3,p.y-TW*.36,TW*.0032,'#e8a840',{plain:true});
 for(let i=0;i<2;i++){const ph=m2(t*.9+i*.5,1);cx.fillStyle='rgba(255,255,255,'+(.5*(1-ph))+')';cx.beginPath();cx.ellipse(p.x-TW*.2+i*TW*.4,p.y-TW*.5-ph*TW*.4,4+ph*5,3+ph*4,0,0,7);cx.fill()}
 /* ☕ 카페를 열면 왼쪽 카운터에 커피머신 */
 if(look&&look.cafe){const q=iso(1.5,.5),w=TW*.42,h=TW*.5,x=q.x-w/2,y=q.y-TW*.34-h;A.rr(x,y,w,h,5,'#4a4a52');A.rr(x+3,y+3,w-6,h*.3,3,'#8a8a96');A.rr(x+w*.3,y+h*.45,w*.4,h*.22,2,'#2a2a30');A.rr(x+w*.34,y+h*.72,w*.32,h*.22,3,'#fff');const ph=m2(t*.8,1);cx.fillStyle='rgba(255,255,255,'+(.6*(1-ph))+')';cx.beginPath();cx.ellipse(q.x,y-4-ph*TW*.3,3+ph*4,2+ph*3,0,0,7);cx.fill()}}
function drawChandelier(look,t){if((look.lit|0)!==4)return;const c=iso(N/2,N/2);const y=c.y-WH*.95;cx.strokeStyle='#c89010';cx.lineWidth=2;cx.beginPath();cx.moveTo(c.x,y-30);cx.lineTo(c.x,y);cx.stroke();const g=cx.createRadialGradient(c.x,y,4,c.x,y,TW*1.2);g.addColorStop(0,'rgba(255,240,170,.5)');g.addColorStop(1,'rgba(255,240,170,0)');cx.fillStyle=g;cx.beginPath();cx.arc(c.x,y,TW*1.2,0,7);cx.fill();em('🔮',c.x,y+8,TW*.36)}
/* ---------- 전체 ---------- */
function draw(t,look,items,o={}){layout(look.n,o.top||64,o.bottom||520);
 drawSky(look,t);drawGround(look,t);drawWalls(look,t);drawFloor(look,t,o.edit);
 const L=[];for(const it of items)if(FK[it.k]&&inRoom(it.x,it.y))L.push({z:it.x+it.y+1+(FK[it.k].flat?-.9:0),f:()=>drawItem(it,t,o.sel===it)});
 L.push({z:1.4,f:()=>drawCounter(t,look)});staffFront(t,look,L);if(look.mas&&look.mas.e&&look.mas.e!=='➖')L.push({z:pet.x+pet.y,f:()=>drawPet(look,t)});
 if(!o.noCust)for(const c of cust)L.push({z:c.x+c.y+(c.st==='sit'?.05:0),f:()=>drawCust(c,t)});
 L.sort((a,b)=>a.z-b.z).forEach(q=>q.f());drawChandelier(look,t);
 for(const f of fx){cx.globalAlpha=Math.max(0,f.l);em(f.e,f.x,f.y-(1-f.l)*30,22);cx.globalAlpha=1}
 if(o.ghost&&o.ghost.ok!==undefined){const g=o.ghost;cx.globalAlpha=.5+.2*Math.sin(t*6);poly([iso(g.x,g.y),iso(g.x+1,g.y),iso(g.x+1,g.y+1),iso(g.x,g.y+1)],g.ok?'rgba(120,220,120,.5)':'rgba(255,90,90,.5)');cx.globalAlpha=1}}
function tick(dt,items,rate){step(dt,items,rate);petStep(dt,items)}
return{FUR,FK,ROOM,draw,tick,reset,toTile,inRoom,isPath,isCounter,canPlace,iso:(a,b)=>iso(a,b),get N(){return N}}};
