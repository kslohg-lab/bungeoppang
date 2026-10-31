/* ===== ☕ 음료 만들기 (가게 '도와주기' 전용 · 챌린지와 상관없음) =====
   컵 고르기 → 재료 버튼을 꾹 눌러 붓기(점선까지) → 🥤 손님에게 내기. 90초.
   CAFE(cx,A,O) O={snd(k),toast(t),onServe(an),coins()} → {start(o),step(dt),draw(t),down(x,y),up(),res(),get done} */
const CAFE_ING={shot:{n:'샷',e:'☕',c:'#5a2e14',r:.16},milk:{n:'우유',e:'🥛',c:'#fbf3e4',r:.34},water:{n:'물',e:'💧',c:'rgba(140,195,235,.75)',r:.34},
 van:{n:'바닐라',e:'🍦',c:'#f0d27a',r:.16},choco:{n:'초코',e:'🍫',c:'#6b3a1f',r:.16},straw:{n:'딸기',e:'🍓',c:'#ff7fa6',r:.16},matcha:{n:'말차',e:'🍵',c:'#7fbf5a',r:.16}};
function CAFE(cx,A,O){
const {rr,tx,em,animal}=A,W=450,H=800,D=BIZ.DK,SX=[80,225,370],CUP={x:118,top:362,bot:548,tw:134,bw:100};
const SH=['#7ec8ff','#ff9ab0','#9ad870','#ffd23a','#b48aff','#ffb070'];
let g=null;
const ingsOf=dr=>{const u=[];Object.keys(CAFE_ING).forEach(k=>{if(dr.some(d=>d.st.some(s=>s[0]===k)))u.push(k)});return u};
function layout(){const B=[],m=12,gp=8;
 const row=(items,y,h)=>{const w=(W-m*2-gp*(items.length-1))/items.length;items.forEach((it,i)=>B.push(Object.assign({x:m+i*(w+gp),y,w,h},it)))};
 row([{k:'ice',ty:'cup',l:'🧊 아이스 컵'},{k:'hot',ty:'cup',l:'🔥 따뜻한 컵'},{k:'trash',ty:'trash',l:'🗑️ 버리기'}],574,46);
 const ig=g.ings.map(k=>({k,ty:'ing',l:CAFE_ING[k].e+' '+CAFE_ING[k].n}));
 if(ig.length<=4)row(ig,628,52);else{row(ig.slice(0,4),628,46);row(ig.slice(4),680,46)}
 row([{k:'serve',ty:'serve',l:'🥤 손님에게 내기'}],ig.length<=4?690:734,ig.length<=4?60:52);g.btn=B}
function start(o){g={t:0,len:90,o,dr:BIZ.myDrinks(o.save),cust:[null,null,null],spawn:1.2,cup:null,lay:[],pour:null,sel:-1,rev:0,mat:0,served:0,lost:0,perf:0,great:0,good:0,wrong:0,spill:0,combo:0,bc:0,fx:[],done:false,shake:0,seq:0};
 if(!g.dr.length)g.dr=[D.ame];g.ings=ingsOf(g.dr);layout()}
const level=()=>g.lay.reduce((a,l)=>a+l.a,0);
const merged=()=>{const m=[];g.lay.forEach(l=>{if(m.length&&m[m.length-1].k===l.k)m[m.length-1].a+=l.a;else m.push({k:l.k,a:l.a})});return m};
const selC=()=>g.sel>=0?g.cust[g.sel]:null;
function pickSel(){const c=selC();if(c&&c.leave<=0)return;let best=-1;g.cust.forEach((c,i)=>{if(c&&c.leave<=0&&(best<0||c.id<g.cust[best].id))best=i});g.sel=best}
function fx(t,x,y,c,l=1.2){g.fx.push({t,x,y,c,l,m:l})}
function resetCup(cost){if(cost&&g.lay.length){g.mat+=cost}g.cup=null;g.lay=[];g.pour=null}
/* 지금 해야 할 일: 컵 / 재료(점선 높이) / 내기 */
function nextAct(){const c=selC();if(!c)return null;const d=D[c.d];if(!g.cup)return{k:d.cup,ty:'cup'};const m=merged(),lv=level();
 if(g.pour){const i=m.length-1;return{k:g.pour,ty:'ing',tg:d.st[i]&&d.st[i][0]===g.pour?d.st[i][1]:null}}
 if(m.length){const i=m.length-1,s=d.st[i];if(s&&s[0]===m[i].k&&lv<s[1]-.03)return{k:s[0],ty:'ing',tg:s[1]}}
 if(m.length<d.st.length)return{k:d.st[m.length][0],ty:'ing',tg:d.st[m.length][1]};return{k:'serve',ty:'serve'}}
function step(dt){if(!g||g.done)return;g.t+=dt;if(g.shake>0)g.shake-=dt;
 /* 손님 */
 g.spawn-=dt;if(g.spawn<=0){const fr=g.cust.map((c,i)=>c?-1:i).filter(i=>i>=0);if(fr.length&&g.t<g.len-4){const i=fr[Math.floor(Math.random()*fr.length)],dd=g.dr[Math.floor(Math.random()*g.dr.length)],an=BP2.R.an[Math.floor(Math.random()*BP2.R.an.length)];
  g.cust[i]={id:++g.seq,an,d:dd.k,pat:28,max:28,ag:0,leave:0,happy:0,ang:0,sh:SH[g.seq%SH.length]}}
  g.spawn=g.t>g.len-30?3.4+Math.random()*2:4.6+Math.random()*2.6}
 g.cust.forEach((c,i)=>{if(!c)return;c.ag+=dt;if(c.leave>0){c.leave-=dt;if(c.leave<=0){g.cust[i]=null;if(g.sel===i)g.sel=-1}return}
  c.pat-=dt;if(c.pat<=0){c.leave=.8;c.ang=1;g.lost++;g.combo=0;fx('😡 가 버렸어요',SX[i],150,'#ff8a8a');O.snd('angry')}});
 pickSel();
 /* 붓기 */
 if(g.pour&&g.cup){const r=CAFE_ING[g.pour].r*dt,top=g.lay[g.lay.length-1];if(top&&top.k===g.pour)top.a+=r;else g.lay.push({k:g.pour,a:r});
  if(level()>1.02){g.spill++;g.combo=0;fx('💦 넘쳤어요!',CUP.x,CUP.top-10,'#7ec8ff');O.snd('no');resetCup(150)}}
 g.fx.forEach(f=>f.l-=dt);g.fx=g.fx.filter(f=>f.l>0);
 if(g.t>=g.len){g.done=true;g.pour=null}}
function serve(){const c=selC();if(!c){O.toast('기다리는 손님이 없어요');return}if(!g.cup||level()<.25){O.toast('음료를 먼저 만들어요!');O.snd('no');return}
 const d=D[c.d],m=merged(),i=g.sel;
 const ok=g.cup===d.cup&&m.length===d.st.length&&m.every((l,j)=>l.k===d.st[j][0]);
 if(!ok){g.wrong++;g.combo=0;c.pat=Math.max(1,c.pat-6);g.shake=.4;fx('주문이랑 달라요! 😣',SX[i],150,'#ffb0b0');O.snd('no');resetCup(150);return}
 let cum=0,err=0;m.forEach((l,j)=>{cum+=l.a;err=Math.max(err,Math.abs(cum-d.st[j][1]))});
 const q=err<=.035?['PERFECT',1.5,'#8dffa0']:err<=.08?['GREAT',1.2,'#9fe0ff']:err<=.15?['GOOD',1,'#c8f0b0']:['아쉬워요',.6,'#ffd0c0'];
 if(q[1]>=1){g.combo++;g.bc=Math.max(g.bc,g.combo)}else g.combo=0;if(q[0]==='PERFECT')g.perf++;else if(q[0]==='GREAT')g.great++;else if(q[0]==='GOOD')g.good++;
 const pay=Math.round((g.o.dp?g.o.dp(d):d.p)*g.o.mul*g.o.pm*q[1]*(1+Math.min(.5,g.combo*.05)));g.rev+=pay;g.mat+=d.c;g.served++;
 c.leave=.9;c.happy=1;fx(q[0]+'! +'+BP2.fmt(pay),SX[i],140,q[2],1.4);if(g.combo>=3)fx('🔥 '+g.combo+' 콤보',SX[i],112,'#ffb060',1.2);
 O.snd(q[0]==='PERFECT'?'perf':'coin');O.onServe&&O.onServe(c.an);g.cup=null;g.lay=[];g.sel=-1}
function hitB(x,y){return g.btn.find(b=>x>=b.x&&x<=b.x+b.w&&y>=b.y&&y<=b.y+b.h)}
function down(x,y){if(!g||g.done)return;
 if(y>60&&y<300){const i=SX.findIndex(sx=>Math.abs(sx-x)<70);if(i>=0&&g.cust[i]&&g.cust[i].leave<=0){g.sel=i;O.snd('tap')}return}
 const b=hitB(x,y);if(!b)return;
 if(b.ty==='cup'){if(g.lay.length)resetCup(150);g.cup=b.k;O.snd('tap');return}
 if(b.ty==='trash'){if(g.cup){resetCup(g.lay.length?150:0);O.snd('tap')}return}
 if(b.ty==='ing'){if(!g.cup){O.toast('먼저 컵을 골라요!');O.snd('no');return}g.pour=b.k;O.snd('pour');return}
 if(b.ty==='serve')serve()}
function up(){if(g)g.pour=null}
/* ---------- 그리기 ---------- */
const yOf=l=>CUP.bot-(CUP.bot-CUP.top)*l;
const halfW=y=>{const u=(CUP.bot-y)/(CUP.bot-CUP.top);return(CUP.bw+(CUP.tw-CUP.bw)*u)/2};
function cupPath(){cx.beginPath();cx.moveTo(CUP.x-CUP.tw/2,CUP.top);cx.lineTo(CUP.x+CUP.tw/2,CUP.top);cx.lineTo(CUP.x+CUP.bw/2,CUP.bot);cx.quadraticCurveTo(CUP.x,CUP.bot+8,CUP.x-CUP.bw/2,CUP.bot);cx.closePath()}
function drawCup(t){const c=selC(),d=c?D[c.d]:null,na=nextAct();
 rr(12,334,426,232,22,'#fff6e6');
 /* 컵 */
 if(g.cup){cx.save();cupPath();cx.fillStyle='rgba(255,255,255,.55)';cx.fill();cx.clip();
  let cum=0;g.lay.forEach(l=>{const y0=yOf(cum),y1=yOf(cum+l.a);cx.fillStyle=CAFE_ING[l.k].c;cx.fillRect(CUP.x-80,y1,160,y0-y1+.6);cum+=l.a});
  if(g.lay.length){cx.fillStyle='rgba(255,255,255,.35)';cx.fillRect(CUP.x-80,yOf(cum)-2,160,3)}
  if(g.cup==='ice'){cx.globalAlpha=.55;[[-26,500,22],[14,512,24],[-6,472,20],[26,478,18],[-30,450,18],[8,440,20]].forEach(([dx,y,s],i)=>{cx.save();cx.translate(CUP.x+dx,y);cx.rotate(.3*i);cx.fillStyle='#eaf8ff';cx.fillRect(-s/2,-s/2,s,s);cx.strokeStyle='#bfe4f8';cx.lineWidth=2;cx.strokeRect(-s/2,-s/2,s,s);cx.restore()});cx.globalAlpha=1}
  if(g.pour){const ig=CAFE_ING[g.pour];cx.fillStyle=ig.c;cx.fillRect(CUP.x-5,CUP.top-40,10,yOf(level())-CUP.top+40)}
  cx.restore();
  cupPath();cx.lineWidth=4;cx.strokeStyle=g.cup==='ice'?'#9ccbe6':'#c8a888';cx.stroke();
  if(g.cup==='hot'){cx.lineWidth=9;cx.strokeStyle='#e8d4bc';cx.beginPath();cx.arc(CUP.x+CUP.tw/2-6,455,34,-1.2,1.2);cx.stroke();
   if(level()>.3)for(let i=0;i<3;i++){const ph=(t*.8+i*.33)%1;cx.globalAlpha=(1-ph)*.6;em('💨',CUP.x-24+i*24,CUP.top-10-ph*30,18);cx.globalAlpha=1}}
  if(g.pour)em(CAFE_ING[g.pour].e,CUP.x,CUP.top-56,34);
 }else{cupPath();cx.setLineDash([8,7]);cx.lineWidth=3;cx.strokeStyle='#d8bfa0';cx.stroke();cx.setLineDash([]);if(d)tx(d?(d.cup==='ice'?'🧊 아이스 컵':'🔥 따뜻한 컵'):'컵',CUP.x,455,17,'#a07a58','center','#fff6e6');if(d)tx('을 골라요',CUP.x,480,15,'#a07a58','center','#fff6e6')}
 /* 목표 점선 */
 if(g.cup&&na&&na.ty==='ing'&&na.tg!=null){const y=yOf(na.tg),hw=halfW(y);cx.setLineDash([7,5]);cx.lineWidth=3;cx.strokeStyle='#ff5a3a';cx.beginPath();cx.moveTo(CUP.x-hw-10,y);cx.lineTo(CUP.x+hw+10,y);cx.stroke();cx.setLineDash([]);
  tx('◀ 여기까지',CUP.x+hw+14,y,14,'#ff5a3a','left','#fff6e6')}
 /* 레시피 카드 */
 const rx=274,ry=346;rr(rx,ry,156,208,16,'#fff');
 if(!d){tx('손님을 기다려요…',rx+83,ry+100,16,'#a07a58','center','#fff');return}
 em(d.e,rx+26,ry+26,30);tx(d.n.length>5?d.s:d.n,rx+46,ry+26,d.n.length>5?19:17,'#5a3a22','left','#fff');
 const m=merged(),steps=[{l:(d.cup==='ice'?'🧊 아이스 컵':'🔥 따뜻한 컵'),done:g.cup===d.cup}].concat(d.st.map((s,j)=>({l:CAFE_ING[s[0]].e+' '+CAFE_ING[s[0]].n+' 붓기',done:m.length>j&&m[j].k===s[0]&&(m.length>j+1||!(na&&na.ty==='ing'&&na.k===s[0]))})));
 steps.push({l:'🥤 내기',done:false});
 let cur=steps.findIndex(s=>!s.done);steps.forEach((s,j)=>{const y=ry+62+j*30;if(j===cur)rr(rx+5,y-13,146,26,9,'#ffefb0');tx((s.done?'✅ ':j===cur?'👉 ':'　')+s.l,rx+12,y,15,s.done?'#8aa070':'#5a3a22','left','#fff')})}
function drawBtns(t){const na=nextAct();g.btn.forEach(b=>{const hl=na&&na.k===b.k&&!g.pour,on=g.pour===b.k||(b.ty==='cup'&&g.cup===b.k);
 const base=b.ty==='serve'?'#ffc94a':b.ty==='trash'?'#f0e4d8':on?'#ffe9a0':'#fff',sh=b.ty==='serve'?'#d9a020':'#e0c4a0';
 rr(b.x,b.y+4,b.w,b.h,16,sh);rr(b.x,b.y+(g.pour===b.k?3:0),b.w,b.h,16,base);
 if(hl){cx.save();cx.lineWidth=4;cx.strokeStyle='rgba(255,170,40,'+(.55+.45*Math.sin(t*7))+')';cx.beginPath();cx.roundRect(b.x-2,b.y-2,b.w+4,b.h+4,18);cx.stroke();cx.restore()}
 tx(b.l,b.x+b.w/2,b.y+b.h/2+(g.pour===b.k?3:0),b.ty==='serve'?24:b.ty==='ing'?18:16,'#5a3a22','center',base);
 if(b.ty==='ing'&&g.pour!==b.k)tx('꾹',b.x+b.w-12,b.y+11,11,'#c0a080','center',base)})}
function draw(t){if(!g)return;cx.save();if(g.shake>0)cx.translate(Math.sin(t*80)*4,0);
 /* 배경: 카페 벽 + 창 + 메뉴판 */
 const bg=cx.createLinearGradient(0,0,0,330);bg.addColorStop(0,'#f6dcc0');bg.addColorStop(1,'#eac9a2');cx.fillStyle=bg;cx.fillRect(0,0,W,H);
 cx.fillStyle='#d9b48c';for(let x=0;x<W;x+=30)cx.fillRect(x,58,2,250);
 rr(0,298,W,34,0,'#a8714a');rr(0,298,W,7,0,'#c8915f');cx.fillStyle='#6b4a3a';cx.fillRect(0,566,W,H-566);
 /* 손님 */
 g.cust.forEach((c,i)=>{if(!c)return;const x=SX[i],inn=Math.min(1,c.ag/.5),lv=c.leave>0?1-c.leave/.9:0,a=c.leave>0?1-lv:inn,y=210+(1-inn)*20-(c.happy?Math.abs(Math.sin(lv*12))*10:0);
  cx.globalAlpha=Math.max(0,a);const r=c.pat/c.max;animal(c.an,x+(c.ang?-lv*60:0),y,70,{t,ph:i*1.7,mood:c.happy?'h':c.ang?'a':r<.3?'w':'n',shirt:c.sh,tilt:r<.3&&!c.leave?Math.sin(t*9)*.04:0});
  if(c.leave<=0){const d=D[c.d],sel=g.sel===i;rr(x-58,64,116,58,16,sel?'#fff3b8':'#fff');if(sel){cx.lineWidth=4;cx.strokeStyle='#ffb020';cx.beginPath();cx.roundRect(x-58,64,116,58,16);cx.stroke()}
   cx.fillStyle=sel?'#fff3b8':'#fff';cx.beginPath();cx.moveTo(x-8,121);cx.lineTo(x+8,121);cx.lineTo(x,131);cx.fill();
   em(d.e,x-30,92,32);tx(d.s,x+16,86,17,'#5a3a22','center',sel?'#fff3b8':'#fff');tx(d.cup==='ice'?'🧊 차갑게':'🔥 따뜻하게',x+16,106,11,'#8a6a4a','center',sel?'#fff3b8':'#fff');
   rr(x-40,136,80,8,4,'rgba(0,0,0,.2)');rr(x-40,136,80*r,8,4,r<.3?'#ff6a5a':r<.6?'#ffc94a':'#7ed88a');if(sel)tx('▼ 만드는 중',x,154,12,'#c06010','center','#f6dcc0')}
  cx.globalAlpha=1});
 drawCup(t);drawBtns(t);
 /* 위 */
 rr(0,0,W,58,0,'#6b4a3a');tx('☕ 음료 도와주기',12,20,20,'#fff','left','#6b4a3a');tx('🪙 '+BP2.fmt(Math.round(O.coins()+g.rev-g.mat)),386,20,20,'#ffe9a0','right','#6b4a3a');
 const left=Math.max(0,g.len-g.t);rr(12,38,W-24,12,6,'rgba(0,0,0,.3)');rr(12,38,(W-24)*left/g.len,12,6,left<15?'#ff7a5a':'#7ed88a');tx(Math.ceil(left)+'초',W/2,44,12,'#fff','center','#6b4a3a');
 if(g.combo>=2)tx('🔥 '+g.combo,W-60,44,14,'#ffd060','right','#6b4a3a');
 if(g.t<3)tx('주문 확인 → 컵 고르기 → 재료를 꾹 눌러 점선까지!',W/2,320,15,'#fff','center','#6b4a3a');
 g.fx.forEach(f=>{const u=1-f.l/f.m;cx.globalAlpha=Math.min(1,f.l*2);tx(f.t,f.x,f.y-u*30,20,f.c,'center','#5a3a22');cx.globalAlpha=1});
 cx.restore()}
function res(){return{net:Math.round(g.rev-g.mat),rev:g.rev,mat:g.mat,served:g.served,lost:g.lost,perf:g.perf,great:g.great,good:g.good,wrong:g.wrong,spill:g.spill,bc:g.bc}}
return{start,step,draw,down,up,res,finish(){if(g){g.done=true;g.pour=null}},get done(){return!!(g&&g.done)},get g(){return g}}}
