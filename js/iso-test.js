/* ===== 가게 꾸미기 시험판: 비스듬히 내려다보는(아이소메트릭) 가게 + 가구 놓기 + 걸어다니는 손님 =====
   진짜 가게(shop.html)와 저장이 따로예요 (키 bpIsoTestV1). 그림은 모두 코드로 그려요. */
(()=>{
const W=450,H=800,$=id=>document.getElementById(id),cv=$('cv'),cx=cv.getContext('2d');
const A=ART(cx,{});const {em,tx,rr,m2,lite,dark,animal}=A;const R=BP2.R;
const KEY='bpIsoTestV1';
/* ---------- 데이터 ---------- */
const FUR=[
 {k:'table',n:'탁자',e:'🍽️'},{k:'chair',n:'의자',e:'🪑',rot:1,seat:1},{k:'sofa',n:'소파',e:'🛋️',rot:1,seat:1},{k:'plant',n:'화분',e:'🪴'},
 {k:'tree',n:'나무 화분',e:'🌳'},{k:'lamp',n:'등불',e:'🏮'},{k:'shelf',n:'빵 진열대',e:'🥐',rot:1},{k:'tank',n:'어항',e:'🐠'},
 {k:'piano',n:'피아노',e:'🎹',rot:1},{k:'rug',n:'러그',e:'🟥',flat:1},{k:'bear',n:'곰 인형',e:'🧸'},{k:'stand',n:'붕어 입간판',e:'🐟'}];
const FK={};FUR.forEach(f=>FK[f.k]=f);
const WALLS=[{n:'크림',c:'#fff1d8',p:0},{n:'민트',c:'#d6f2e4',p:1},{n:'하늘',c:'#d8ebff',p:2},{n:'벽돌',c:'#d9826a',p:3},{n:'분홍',c:'#ffe0ea',p:1}];
const FLOORS=[{n:'나무',a:'#d8a86c',b:'#c99a5e',p:0},{n:'체크',a:'#f4ede0',b:'#c9a27a',p:1},{n:'타일',a:'#e8eef0',b:'#d4dde0',p:1},{n:'분홍',a:'#f6d4dc',b:'#ecc2cc',p:0},{n:'잔디',a:'#9ed27a',b:'#8cc46a',p:0}];
let st={n:4,wall:0,floor:0,items:[]};
try{const o=JSON.parse(localStorage.getItem(KEY));if(o&&Array.isArray(o.items))st=Object.assign(st,o)}catch(e){}
const store=()=>{try{localStorage.setItem(KEY,JSON.stringify(st))}catch(e){}};
/* ---------- 좌표 ---------- */
let N,TW,TH,OX=225,OY,WH;
function layout(){N=st.n;TW=N<=4?96:N===5?80:68;TH=TW/2;WH=Math.round(TW*1.25);OY=Math.round(250-(N-4)*12)}
const iso=(gx,gy)=>({x:OX+(gx-gy)*TW/2,y:OY+(gx+gy)*TH/2});
const toTile=(x,y)=>{const a=(x-OX)/(TW/2),b=(y-OY)/(TH/2);return{gx:Math.floor((a+b)/2),gy:Math.floor((b-a)/2)}};
const inRoom=(gx,gy)=>gx>=0&&gy>=0&&gx<N&&gy<N;
const isCounter=(gx,gy)=>gy===0&&(gx===1||gx===2);
const isPath=(gx,gy)=>(gy===1&&gx>=1&&gx<=N-1)||(gx===N-1&&gy>=1&&gy<=N-1);
const itemAt=(gx,gy)=>st.items.find(it=>it.x===gx&&it.y===gy);
/* ---------- 그리기 도구 ---------- */
function poly(pts,fill,stroke,lw=1.5){cx.beginPath();pts.forEach((p,i)=>i?cx.lineTo(p.x,p.y):cx.moveTo(p.x,p.y));cx.closePath();if(fill){cx.fillStyle=fill;cx.fill()}if(stroke){cx.strokeStyle=stroke;cx.lineWidth=lw;cx.stroke()}}
const up=(p,h)=>({x:p.x,y:p.y-h});
/* 타일 위 상자: m=안쪽 여백(0~.5), h=높이 */
function box(gx,gy,m,h,col,o={}){const T=iso(gx+m,gy+m),Rr=iso(gx+1-m,gy+m),B=iso(gx+1-m,gy+1-m),L=iso(gx+m,gy+1-m);
 const z=o.z||0;const T0=up(T,z),R0=up(Rr,z),B0=up(B,z),L0=up(L,z);const T1=up(T,z+h),R1=up(Rr,z+h),B1=up(B,z+h),L1=up(L,z+h);
 const ln=o.line||dark(col,.45);poly([L0,B0,B1,L1],dark(col,.12),ln);poly([B0,R0,R1,B1],dark(col,.24),ln);poly([T1,R1,B1,L1],o.top||lite(col,.08),ln);return{T:T1,R:R1,B:B1,L:L1,c:{x:(T1.x+B1.x)/2,y:(T1.y+B1.y)/2}}}
/* 타일의 한 변에 세운 판 (등받이 등). d: 0=오른쪽 뒤, 1=왼쪽 뒤, 2=오른쪽 앞, 3=왼쪽 앞 */
function panel(gx,gy,d,m,z,h,col){const T=iso(gx+m,gy+m),Rr=iso(gx+1-m,gy+m),B=iso(gx+1-m,gy+1-m),L=iso(gx+m,gy+1-m);const E=[[T,Rr],[L,T],[Rr,B],[B,L]][d];
 poly([up(E[0],z),up(E[1],z),up(E[1],z+h),up(E[0],z+h)],d>=2?dark(col,.1):col,dark(col,.45))}
function shadow(x,y,w){cx.fillStyle='rgba(0,0,0,.16)';cx.beginPath();cx.ellipse(x,y,w,w*.45,0,0,7);cx.fill()}
/* ---------- 가구 그리기 ---------- */
function drawItem(it,t,sel){const gx=it.x,gy=it.y,d=it.d|0,c=iso(gx+.5,gy+.5),s=TW/78;
 switch(it.k){
 case'table':{shadow(c.x,c.y+2,TW*.28);const p=box(gx,gy,.36,TW*.22,'#8a5a3a');cx.fillStyle='#c98a54';cx.strokeStyle='#6a4024';cx.lineWidth=1.5;cx.beginPath();cx.ellipse(p.c.x,p.c.y-2,TW*.32,TH*.32,0,0,7);cx.fill();cx.stroke();em('☕',p.c.x+6*s,p.c.y-8*s,16*s);em('🐟',p.c.x-8*s,p.c.y-4*s,13*s);break}
 case'chair':{shadow(c.x,c.y+2,TW*.2);const back=d<2;if(back)panel(gx,gy,d,.28,TW*.14,TW*.22,'#b0703f');box(gx,gy,.28,TW*.14,'#d08a4e');if(!back)panel(gx,gy,d,.28,TW*.14,TW*.18,'#b0703f');break}
 case'sofa':{shadow(c.x,c.y+2,TW*.34);if(d<2)panel(gx,gy,d,.1,TW*.12,TW*.2,'#d0607a');box(gx,gy,.12,TW*.13,'#e8788f');if(d>=2)panel(gx,gy,d,.1,TW*.12,TW*.14,'#d0607a');break}
 case'plant':{shadow(c.x,c.y+2,TW*.18);const p=box(gx,gy,.34,TW*.14,'#c8643a');em('🪴',p.c.x,p.c.y-TW*.22,TW*.5);break}
 case'tree':{shadow(c.x,c.y+2,TW*.24);const p=box(gx,gy,.3,TW*.16,'#a85a34');em('🌳',p.c.x,p.c.y-TW*.42+Math.sin(t*1.5+gx)*1,TW*.9);break}
 case'lamp':{shadow(c.x,c.y+2,TW*.14);cx.fillStyle='#5a4638';cx.fillRect(c.x-2,c.y-TW*.62,4,TW*.62);const gl=cx.createRadialGradient(c.x,c.y-TW*.7,2,c.x,c.y-TW*.7,TW*.6);gl.addColorStop(0,'rgba(255,220,140,'+(.45+.1*Math.sin(t*3))+')');gl.addColorStop(1,'rgba(255,220,140,0)');cx.fillStyle=gl;cx.beginPath();cx.arc(c.x,c.y-TW*.7,TW*.6,0,7);cx.fill();em('🏮',c.x,c.y-TW*.72,TW*.42);break}
 case'shelf':{shadow(c.x,c.y+2,TW*.34);const p=box(gx,gy,.12,TW*.5,'#9a6a40',{top:'#b88456'});for(let r=0;r<2;r++)for(let q=0;q<3;q++){const u=(q+.5)/3,a=d%2?iso(gx+.12,gy+.12+u*.76):iso(gx+.12+u*.76,gy+.88);em(['🥐','🍞','🐟'][(q+r)%3],a.x+(d%2?TW*.1:-TW*.04),a.y-TW*(.14+r*.18),TW*.2)}break}
 case'tank':{shadow(c.x,c.y+2,TW*.3);box(gx,gy,.16,TW*.08,'#5a4a40');const p=box(gx,gy,.18,TW*.36,'#9fd8f0',{z:TW*.08,top:'rgba(200,240,255,.9)',line:'#5a9ab8'});em('🐠',c.x+Math.sin(t*1.2+gx)*TW*.14,c.y-TW*.28,TW*.22);em('🐟',c.x-Math.sin(t*1.5)*TW*.1,c.y-TW*.18,TW*.16);break}
 case'piano':{shadow(c.x,c.y+2,TW*.34);const p=box(gx,gy,.12,TW*.34,'#2e2a2e',{top:'#3e3a40'});const E=[[p.T,p.R],[p.L,p.T],[p.R,p.B],[p.B,p.L]][d];cx.strokeStyle='#fff';cx.lineWidth=TW*.07;cx.beginPath();cx.moveTo((E[0].x*3+p.c.x)/4,(E[0].y*3+p.c.y)/4);cx.lineTo((E[1].x*3+p.c.x)/4,(E[1].y*3+p.c.y)/4);cx.stroke();em('🎵',p.c.x+Math.sin(t*2)*6,p.c.y-TW*.35-m2(t*20,14),TW*.18,.8);break}
 case'rug':{const T=iso(gx+.06,gy+.06),Rr=iso(gx+.94,gy+.06),B=iso(gx+.94,gy+.94),L=iso(gx+.06,gy+.94);poly([T,Rr,B,L],'#d85a5a','#a83a3a',2);const T2=iso(gx+.22,gy+.22),R2=iso(gx+.78,gy+.22),B2=iso(gx+.78,gy+.78),L2=iso(gx+.22,gy+.78);poly([T2,R2,B2,L2],'#f0b060');break}
 case'bear':{shadow(c.x,c.y+2,TW*.16);em('🧸',c.x,c.y-TW*.2,TW*.46);break}
 case'stand':{shadow(c.x,c.y+2,TW*.18);cx.fillStyle='#6a4024';cx.fillRect(c.x-TW*.16,c.y-TW*.2,3,TW*.2);cx.fillRect(c.x+TW*.14,c.y-TW*.2,3,TW*.2);rr(c.x-TW*.24,c.y-TW*.62,TW*.48,TW*.44,8,'#fff3dc');cx.strokeStyle='#8a5a3a';cx.lineWidth=2;cx.strokeRect(c.x-TW*.24,c.y-TW*.62,TW*.48,TW*.44);A.fish2(c.x,c.y-TW*.42,TW*.0042,'#f0b850',{plain:true});tx('붕어빵',c.x,c.y-TW*.26,Math.max(9,TW*.13),'#8a3a1a','center','#fff3dc');break}
 }
 if(sel){const T=iso(gx,gy),Rr=iso(gx+1,gy),B=iso(gx+1,gy+1),L=iso(gx,gy+1);cx.globalAlpha=.6+.4*Math.sin(t*6);poly([T,Rr,B,L],null,'#ffc94a',3);cx.globalAlpha=1}}
/* ---------- 손님 ---------- */
let cust=[],spawnT=1,nid=1;
function pathOut(){return[{x:N-.5,y:1.5},{x:N-.5,y:N-.5},{x:N+1.3,y:N-.5}]}
function queuePts(){const pts=[];const poly_=[{x:2,y:1.5},{x:N-.5,y:1.5},{x:N-.5,y:N-.5},{x:N+1.3,y:N-.5}];let k=0;
 for(let i=0;i<8;i++){let dist=i*.9,p=null;for(let j=0;j<poly_.length-1;j++){const a=poly_[j],b=poly_[j+1],L=Math.hypot(b.x-a.x,b.y-a.y);if(dist<=L){p={x:a.x+(b.x-a.x)*dist/L,y:a.y+(b.y-a.y)*dist/L};break}dist-=L}pts.push(p||poly_[poly_.length-1])}return pts}
function freeChair(){const chairs=st.items.filter(it=>FK[it.k]&&FK[it.k].seat);for(const ch of chairs)if(!cust.some(c=>c.seat===ch))return ch;return null}
function spawn(){if(cust.length>=6)return;const an=R.an[Math.floor(Math.random()*R.an.length)];
 cust.push({id:nid++,an,x:N+1.6,y:N-.5,st:'q',route:[],t:0,sh:['#7ec8ff','#ff9ab0','#9ad870','#ffd23a','#b48aff'][nid%5],bub:null,bt:0})}
function step(dt){spawnT-=dt;if(spawnT<=0){spawn();spawnT=2.6+Math.random()*2.6}
 const Q=queuePts();const inQ=cust.filter(c=>c.st==='q');
 inQ.forEach((c,i)=>{const tg=Q[Math.min(i,Q.length-1)];c.route=[tg]});
 for(const c of cust){c.t+=dt;if(c.bt>0)c.bt-=dt;
  if(c.st==='q'){const tg=c.route[0];if(inQ[0]===c&&Math.hypot(c.x-tg.x,c.y-tg.y)<.05){c.wait=(c.wait||0)+dt;if(c.wait>.3&&!c.asked){c.asked=1;say(c,'🐟 하나 주세요!')}if(c.wait>1.8){c.st='buy';c.wait=0}}}
  else if(c.st==='buy'){c.wait=(c.wait||0)+dt;if(c.wait>.6&&!c.paid){c.paid=1;say(c,'💖 고마워요!');pf(c,'🪙')}
   if(c.wait>1.2){const ch=freeChair();if(ch){c.seat=ch;c.st='go';c.route=[{x:c.x,y:ch.y+.5},{x:ch.x+.5,y:ch.y+.5}]}else{c.st='out';c.route=pathOut()}}}
  else if(c.st==='go'&&!c.route.length){c.st='sit';c.wait=0;say(c,['😋 맛있다!','😊 여기 좋네요','🥰 분위기 최고'][c.id%3])}
  else if(c.st==='sit'){c.wait+=dt;if(c.wait>4.5){c.st='out';const s=c.seat;c.seat=null;c.route=[{x:c.x,y:1.5},{x:N-.5,y:1.5},...pathOut().slice(1)];if(s)say(c,'또 올게요 👋')}}
  if(c.st!=='sit'&&c.route.length){const tg=c.route[0],dx=tg.x-c.x,dy=tg.y-c.y,L=Math.hypot(dx,dy),sp=1.6*dt;if(L<=sp){c.x=tg.x;c.y=tg.y;if(c.st!=='q')c.route.shift()}else{c.x+=dx/L*sp;c.y+=dy/L*sp;c.mv=1}}else c.mv=0}
 cust=cust.filter(c=>!(c.st==='out'&&!c.route.length))}
function say(c,t){c.bub=t;c.bt=2}
const fx=[];function pf(c,e){const p=iso(c.x,c.y);fx.push({e,x:p.x,y:p.y-TW*.9,l:1})}
function drawCust(c,t){const p=iso(c.x,c.y),sz=TW*.62,bob=c.mv?Math.abs(Math.sin(c.t*11))*3:0;let y=p.y-sz*.88-bob;
 if(c.st==='sit'&&c.seat){y-=TW*.12}
 shadow(p.x,p.y,sz*.34);
 animal(c.an,p.x,y,sz,{t,ph:c.id,mood:c.st==='sit'||c.paid?'h':'n',shirt:c.sh});
 if(c.st==='sit')em('🐟',p.x+sz*.42,y+sz*.5,sz*.32);
 if(c.bub&&c.bt>0)bubble(p.x,y-sz*.75,c.bub,Math.min(1,c.bt*3))}
function bubble(x,y,t,a){cx.globalAlpha=a;cx.font='bold 13px "Jua","Noto Sans KR",sans-serif';const w=cx.measureText(t).width+16;rr(x-w/2,y-12,w,24,12,'#fff');cx.beginPath();cx.moveTo(x-5,y+11);cx.lineTo(x,y+17);cx.lineTo(x+5,y+11);cx.closePath();cx.fillStyle='#fff';cx.fill();tx(t,x,y,13,'#5a3a22','center','#fff');cx.globalAlpha=1}
/* ---------- 방 그리기 ---------- */
function drawRoom(t){const wl=WALLS[st.wall]||WALLS[0],fl=FLOORS[st.floor]||FLOORS[0];
 /* 바깥: 하늘·길 */
 const g=cx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#bfe6ff');g.addColorStop(.32,'#e6f6ff');g.addColorStop(.33,'#b8dfa0');g.addColorStop(1,'#9ccf84');cx.fillStyle=g;cx.fillRect(0,0,W,H);
 for(let i=0;i<5;i++){cx.fillStyle='rgba(255,255,255,.8)';const x=m2(t*5+i*120,560)-60;cx.beginPath();cx.ellipse(x,70+i*14,30,9,0,0,7);cx.fill()}
 const Rc=iso(N,0),Bc=iso(N,N),Lc=iso(0,N);
 /* 인도: 가게 앞 오른쪽 아래로 */
 poly([iso(N,N-1),iso(N+3,N-1),iso(N+3,N),iso(N,N)],'#d8cbb6','#bba98e');
 for(let k=0;k<3;k++)poly([iso(N+k,N-1),iso(N+k+1,N-1),iso(N+k+1,N),iso(N+k,N)],null,'rgba(120,100,80,.25)',1);
 /* 아래쪽 찻길 */const ry=Math.max(iso(N,N).y+70,560);cx.fillStyle='#8f8a85';cx.fillRect(0,ry,W,60);cx.fillStyle='#d8cbb6';cx.fillRect(0,ry-10,W,10);cx.strokeStyle='rgba(255,255,255,.75)';cx.lineWidth=3;cx.setLineDash([18,14]);cx.beginPath();cx.moveTo(0,ry+30);cx.lineTo(W,ry+30);cx.stroke();cx.setLineDash([]);
 em('🌳',iso(-0.6,N+.4).x,iso(-0.6,N+.4).y-30,56);em('🌷',iso(N+.6,N+.8).x,iso(N+.6,N+.8).y-8,26);em('🌼',iso(1.2,N+1.2).x,iso(1.2,N+1.2).y-6,22);
 /* 벽 (뒤 두 면) */
 const T=iso(0,0);
 const wa=lite(wl.c,.05),wb=dark(wl.c,.08);
 poly([T,Rc,up(Rc,WH),up(T,WH)],wb,dark(wl.c,.35));poly([Lc,T,up(T,WH),up(Lc,WH)],wa,dark(wl.c,.35));
 if(wl.p===1){cx.strokeStyle='rgba(255,255,255,.5)';cx.lineWidth=3;for(let i=1;i<N*2;i++){const u=i/(N*2),a=iso(u*N,0),b=iso(0,u*N);cx.beginPath();cx.moveTo(a.x,a.y);cx.lineTo(a.x,a.y-WH);cx.stroke();cx.beginPath();cx.moveTo(b.x,b.y);cx.lineTo(b.x,b.y-WH);cx.stroke()}}
 if(wl.p===2){cx.fillStyle='rgba(255,255,255,.55)';for(let i=0;i<N*2;i++)for(let r=0;r<3;r++){const u=(i+.5)/(N*2),a=iso(u*N,0),b=iso(0,u*N);cx.beginPath();cx.arc(a.x,a.y-WH*(.25+r*.28),2.2,0,7);cx.fill();cx.beginPath();cx.arc(b.x,b.y-WH*(.25+r*.28),2.2,0,7);cx.fill()}}
 if(wl.p===3){cx.strokeStyle='rgba(120,50,30,.35)';cx.lineWidth=1.2;for(let r=1;r<6;r++){const h=WH*r/6;cx.beginPath();cx.moveTo(T.x,T.y-h);cx.lineTo(Rc.x,Rc.y-h);cx.moveTo(T.x,T.y-h);cx.lineTo(Lc.x,Lc.y-h);cx.stroke()}}
 /* 벽 위 테두리, 창문 */
 poly([up(Lc,WH),up(T,WH),up(Rc,WH),up(Rc,WH+6),up(T,WH+6),up(Lc,WH+6)],'#8a5a3a');
 const win=(gx0,gy0,gx1,gy1)=>{const a=iso(gx0,gy0),b=iso(gx1,gy1);const p=[up(a,WH*.38),up(b,WH*.38),up(b,WH*.82),up(a,WH*.82)];poly(p,'#bfe6ff','#8a5a3a',3);cx.strokeStyle='#8a5a3a';cx.lineWidth=2;cx.beginPath();cx.moveTo((p[0].x+p[1].x)/2,(p[0].y+p[1].y)/2);cx.lineTo((p[2].x+p[3].x)/2,(p[2].y+p[3].y)/2);cx.stroke()};
 win(0,N-1.7,0,N-.6);win(N-1.8,0,N-.7,0);
 /* 메뉴판 (오른쪽 벽, 카운터 위) */
 {const a=iso(1.1,0),b=iso(2.9,0);const p=[up(a,WH*.5),up(b,WH*.5),up(b,WH*.86),up(a,WH*.86)];poly(p,'#3a3a3a','#6a4a2a',3);const c={x:(a.x+b.x)/2,y:(a.y+b.y)/2-WH*.68};tx('붕어빵 🐟',c.x,c.y-2,Math.max(10,TW*.16),'#fff3c0','center','#3a3a3a')}
 /* 바닥 */
 for(let gx=0;gx<N;gx++)for(let gy=0;gy<N;gy++){const c=(gx+gy)%2&&fl.p?fl.b:fl.a;poly([iso(gx,gy),iso(gx+1,gy),iso(gx+1,gy+1),iso(gx,gy+1)],c,fl.p?null:'rgba(0,0,0,.08)',1);
  if(!fl.p&&st.floor===0){cx.strokeStyle='rgba(120,70,30,.18)';cx.lineWidth=1;const a=iso(gx,gy+.5),b=iso(gx+1,gy+.5);cx.beginPath();cx.moveTo(a.x,a.y);cx.lineTo(b.x,b.y);cx.stroke()}}
 /* 손님 길 표시 (꾸미는 중에만 진하게) */
 for(let gx=0;gx<N;gx++)for(let gy=0;gy<N;gy++)if(isPath(gx,gy)){cx.globalAlpha=editing()?.32:.12;poly([iso(gx+.12,gy+.12),iso(gx+.88,gy+.12),iso(gx+.88,gy+.88),iso(gx+.12,gy+.88)],'#fff');cx.globalAlpha=1}
 /* 앞 테두리(바닥 두께) + 문 매트 */
 poly([Lc,Bc,up(Bc,-8),up(Lc,-8)],dark(fl.a,.3));poly([Bc,Rc,up(Rc,-8),up(Bc,-8)],dark(fl.a,.42));
 poly([iso(N-.08,N-.9),iso(N+.4,N-.9),iso(N+.4,N-.1),iso(N-.08,N-.1)],'#c84a3a');tx('어서 오세요',iso(N+.3,N-.5).x+8,iso(N+.3,N-.5).y-2,11,'#fff','center','#c84a3a')}
function editing(){return !$('pn').classList.contains('hide')}
/* 카운터 + 사장님 */
function drawCounter(t){const c=iso(2,.35);animal('cook',c.x,c.y-TW*.95,TW*.66,{t,ph:0,mood:'h',shirt:'#ffffff'});
 box(1,0,.06,TW*.34,'#b97d4a',{top:'#d9a06a'});box(2,0,.06,TW*.34,'#b97d4a',{top:'#d9a06a'});
 const p=iso(2,.5);for(let i=0;i<3;i++)A.fish2(p.x-TW*.32+i*TW*.3,p.y-TW*.36,TW*.0032,'#e8a840',{plain:true});
 for(let i=0;i<2;i++){const ph=m2(t*.9+i*.5,1);cx.fillStyle='rgba(255,255,255,'+(.5*(1-ph))+')';cx.beginPath();cx.ellipse(p.x-TW*.2+i*TW*.4,p.y-TW*.5-ph*TW*.4,4+ph*5,3+ph*4,0,0,7);cx.fill()}}
/* ---------- 화면 ---------- */
let sel=null,pick=null,tab=0;
function draw(t){layout();drawRoom(t);
 const L=[];for(const it of st.items)L.push({z:it.x+it.y+1+(FK[it.k].flat?-0.9:0),f:()=>drawItem(it,t,sel===it)});
 L.push({z:1.4,f:()=>drawCounter(t)});
 for(const c of cust)L.push({z:c.x+c.y+(c.st==='sit'?.05:0),f:()=>drawCust(c,t)});
 L.sort((a,b)=>a.z-b.z).forEach(o=>o.f());
 for(const f of fx){cx.globalAlpha=Math.max(0,f.l);em(f.e,f.x,f.y-(1-f.l)*30,22);cx.globalAlpha=1}
 if(editing()&&pick){tx('놓을 칸을 톡!',W/2,H-246,16,'#fff','center','#5a3a22')}}
function toast(t){const e=$('toast');e.textContent=t;e.style.opacity=1;clearTimeout(toast.h);toast.h=setTimeout(()=>e.style.opacity=0,1600)}
/* ---------- 아래 판 ---------- */
function renderPal(){const P=$('pal');P.innerHTML='';[0,1,2].forEach(i=>$('t'+i).className=i===tab?'on':'');
 const add=(e,n,on,fn)=>{const b=document.createElement('button');b.innerHTML='<b>'+e+'</b>'+n;if(on)b.className='on';b.onclick=fn;P.appendChild(b)};
 if(tab===0)FUR.forEach(f=>add(f.e,f.n,pick===f.k,()=>{pick=pick===f.k?null:f.k;sel=null;renderPal();msg()}));
 else if(tab===1){WALLS.forEach((w,i)=>add('<span style="display:inline-block;width:30px;height:30px;border-radius:8px;background:'+w.c+';border:2px solid #c9a27a"></span>','벽 '+w.n,st.wall===i,()=>{st.wall=i;store();renderPal()}));
  FLOORS.forEach((f,i)=>add('<span style="display:inline-block;width:30px;height:30px;border-radius:8px;background:linear-gradient(135deg,'+f.a+' 50%,'+f.b+' 50%);border:2px solid #c9a27a"></span>','바닥 '+f.n,st.floor===i,()=>{st.floor=i;store();renderPal()}))}
 else [4,5,6].forEach(n=>add('📐',n+'×'+n+(n===4?' (처음)':''),st.n===n,()=>setN(n)));
 msg()}
function msg(){const m=$('msg');const has=!!sel;$('rot').className=has&&FK[sel.k].rot?'':'dis';$('del').className=has?'':'dis';
 m.textContent=tab===2?'가게 등급이 오르면 넓어지는 느낌을 미리 봐요':tab===1?'벽지와 바닥을 골라 보세요':sel?FK[sel.k].n+' 선택됨 · 돌리거나 치울 수 있어요':pick?FK[pick].n+'을(를) 놓을 칸을 톡! 하세요':'가구를 고르고 칸을 톡! (흰 칸은 손님 길)'}
function setN(n){const drop=st.items.filter(it=>it.x>=n||it.y>=n||isPathN(it.x,it.y,n));st.n=n;st.items=st.items.filter(it=>!drop.includes(it));sel=null;cust=[];store();renderPal();if(drop.length)toast('밖으로 나간 가구 '+drop.length+'개는 치웠어요')}
const isPathN=(gx,gy,n)=>(gy===1&&gx>=1&&gx<=n-1)||(gx===n-1&&gy>=1&&gy<=n-1);
$('t0').onclick=()=>{tab=0;renderPal()};$('t1').onclick=()=>{tab=1;sel=null;renderPal()};$('t2').onclick=()=>{tab=2;sel=null;renderPal()};
$('rot').onclick=()=>{if(sel&&FK[sel.k].rot){sel.d=((sel.d|0)+1)%4;store()}};
$('del').onclick=()=>{if(sel){st.items=st.items.filter(it=>it!==sel);sel=null;store();msg()}};
$('done').onclick=()=>{pick=null;sel=null;$('pn').classList.add('hide');$('eye').textContent='🪑 꾸미기';renderPal()};
$('eye').onclick=()=>{const h=$('pn').classList.toggle('hide');$('eye').textContent=h?'🪑 꾸미기':'👀 구경';if(h){pick=null;sel=null}renderPal()};
cv.addEventListener('pointerdown',e=>{e.preventDefault();if(!editing())return;const r=cv.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*W,y=(e.clientY-r.top)/r.height*H;if(y>H-230)return;
 layout();const {gx,gy}=toTile(x,y);if(!inRoom(gx,gy)){sel=null;msg();return}
 const it=itemAt(gx,gy);
 if(it){sel=sel===it?null:it;pick=null;if(tab!==0){tab=0}renderPal();return}
 if(pick){if(isCounter(gx,gy)){toast('여기는 카운터예요');return}if(isPath(gx,gy)){toast('흰 칸은 손님이 다니는 길이에요');return}
  const n={k:pick,x:gx,y:gy,d:0};st.items.push(n);sel=n;store();msg();return}
 sel=null;msg()});
cv.addEventListener('contextmenu',e=>e.preventDefault());
/* ---------- 반복 ---------- */
let last=0;function loop(ts){const t=ts/1000,dt=Math.min(.05,(ts-last)/1000||0);last=ts;layout();step(dt);for(const f of fx)f.l-=dt;for(let i=fx.length-1;i>=0;i--)if(fx[i].l<=0)fx.splice(i,1);
 cx.clearRect(0,0,W,H);draw(t);requestAnimationFrame(loop)}
function fit(){const b=document.body,sc=Math.min(b.clientWidth/W,b.clientHeight/H);$('box').style.transform='translate('+(b.clientWidth-W*sc)/2+'px,'+(b.clientHeight-H*sc)/2+'px) scale('+sc+')'}
addEventListener('resize',fit);addEventListener('orientationchange',()=>setTimeout(fit,200));
/* 처음이면 예시 배치 */
if(!st.items.length&&!localStorage.getItem(KEY+'x')){st.items=[{k:'table',x:0,y:2,d:0},{k:'chair',x:0,y:3,d:1},{k:'chair',x:1,y:2,d:1},{k:'plant',x:0,y:1,d:0},{k:'lamp',x:3,y:0,d:0},{k:'rug',x:1,y:3,d:0},{k:'bear',x:2,y:3,d:0}];try{localStorage.setItem(KEY+'x','1')}catch(e){}store()}
window.__iso={get st(){return st},get cust(){return cust},spawn,toTile,layout,iso:(a,b)=>{layout();return iso(a,b)}};
fit();renderPal();requestAnimationFrame(loop);
})();
