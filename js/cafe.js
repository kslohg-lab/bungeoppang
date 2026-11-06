/* ===== ☕ 음료 만들기 (가게 '도와주기' 전용 · 챌린지와 상관없음) — 2판: 기계 돌려 놓고 동시에 =====
   작업대에 컵 3개까지 올려 두고 번갈아 만들어요.
   ☕ 샷: 머신이 2.4초 동안 혼자 내려요(한 번에 한 잔) · 🥛 스팀: 우유를 데워 알맞은 온도(초록)에서 멈춰요
   🍦 시럽·가루: 톡 한 번 · 🥛/💧 꾹 눌러 점선까지 붓기 · 완성된 컵을 고르고 손님을 톡 = 내기. 90초.
   🔔 러시 타임(28~38초·62~72초): 손님 더 빨리, 값 +20% · 👨‍👩‍👧 단체 주문(8명 중 1명꼴 2잔): 다 주면 +15%, 참을성 1.5배.
   CAFE(cx,A,O) O={snd(k),toast(t),onServe(an),coins()} → {start(o),step(dt),draw(t),down(x,y),up(),res(),get done} */
const CAFE_ING={shot:{n:'샷',e:'☕',c:'#5a2e14',r:.16},milk:{n:'우유',e:'🥛',c:'#fbf3e4',r:.34},water:{n:'물',e:'💧',c:'rgba(140,195,235,.75)',r:.34},
 van:{n:'바닐라',e:'🍦',c:'#f0d27a',r:.16},choco:{n:'초코',e:'🍫',c:'#6b3a1f',r:.16},straw:{n:'딸기',e:'🍓',c:'#ff7fa6',r:.16},matcha:{n:'말차',e:'🍵',c:'#7fbf5a',r:.16}};
function CAFE(cx,A,O){
const {rr,tx,em,animal}=A,W=450,H=800,D=BIZ.DK,SX=[80,225,370];
const SH=['#7ec8ff','#ff9ab0','#9ad870','#ffd23a','#b48aff','#ffb070'];
const RUSH=[[28,38],[62,72]],inRush=t=>RUSH.some(w=>t>=w[0]&&t<w[1]),BASES=['van','choco','straw','matcha'],SLX=[172,272,372],CT=376,CB=486,CTW=74,CBW=54,BREW=2.4,MILK_HOT=[55,72];
let g=null;
/* 음료 레시피 → {cup, base, shot, liq, tg, bl(시럽 높이)} */
const rec=d=>{const b=d.st.find(s=>BASES.includes(s[0])),l=d.st[d.st.length-1];return{cup:d.cup,base:b?b[0]:null,bl:b?b[1]:0,shot:d.st.some(s=>s[0]==='shot'),liq:l[0],tg:l[1]}};
const ingIcons=d=>{const r=rec(d);return(r.base?CAFE_ING[r.base].e:'')+(r.shot?'☕':'')+CAFE_ING[r.liq].e};
function layout(){const B=[],m=10,gp=8;let y=514;
 const row=(items,h)=>{const w=(W-m*2-gp*(items.length-1))/items.length;items.forEach((it,i)=>B.push(Object.assign({x:m+i*(w+gp),y,w,h},it)));y+=h+8};
 row([{k:'ice',ty:'cup',l:'🧊 아이스 컵'},{k:'hot',ty:'cup',l:'🔥 따뜻한 컵'},{k:'trash',ty:'trash',l:'🗑️ 버리기'}],44);
 const bs=BASES.filter(k=>g.need.base.has(k));if(bs.length)row(bs.map(k=>({k,ty:'base',l:CAFE_ING[k].e+' '+CAFE_ING[k].n})),46);
 const mc=[{k:'shot',ty:'shot',l:'☕ 샷 내리기'}];if(g.need.steam)mc.push({k:'steam',ty:'steam',l:'🥛 스팀'});row(mc,60);
 const lq=[];if(g.need.milk)lq.push({k:'milk',ty:'pour',l:'🥛 우유 꾹'});if(g.need.water)lq.push({k:'water',ty:'pour',l:'💧 물 꾹'});row(lq,64);
 g.btn=B}
function start(o){const dr=BIZ.myDrinks(o.save);g={t:0,len:90,o,dr:dr.length?dr:[D.ame],cust:[null,null,null],spawn:1.2,cups:[null,null,null],sel:-1,pour:null,
  mach:{i:-1,t:0},stm:{amt:0,temp:0,on:false},rev:0,mat:0,served:0,lost:0,perf:0,great:0,good:0,wrong:0,spill:0,combo:0,bc:0,rushN:0,grpN:0,rush0:false,fx:[],done:false,shake:0,seq:0,tut:(o.save&&o.save.cafeN|0)<2};
 const R=g.dr.map(rec);g.need={base:new Set(R.map(r=>r.base).filter(Boolean)),steam:R.some(r=>r.cup==='hot'&&r.liq==='milk'),milk:R.some(r=>r.liq==='milk'),water:R.some(r=>r.liq==='water')};layout()}
const lvl=c=>c?c.lay.reduce((a,l)=>a+l.a,0):0;
const selCup=()=>g.sel>=0?g.cups[g.sel]:null;
function fx(t,x,y,c,l=1.2){g.fx.push({t,x,y,c,l,m:l})}
function dropCup(i,cost){const c=g.cups[i];if(!c)return;if(cost&&c.lay.length)g.mat+=cost;if(g.mach.i===i){g.mach.i=-1;g.mach.t=0}g.cups[i]=null;if(g.sel===i)g.sel=-1;if(g.pour&&g.pour.i===i)g.pour=null}
function addLay(c,k,a){const top=c.lay[c.lay.length-1];if(top&&top.k===k)top.a+=a;else c.lay.push({k,a})}
function step(dt){if(!g||g.done)return;g.t+=dt;if(g.shake>0)g.shake-=dt;
 /* 손님 */
 g.spawn-=dt;if(g.spawn<=0){const fr=g.cust.map((c,i)=>c?-1:i).filter(i=>i>=0);if(fr.length&&g.t<g.len-5){const i=fr[Math.floor(Math.random()*fr.length)],dd=g.dr[Math.floor(Math.random()*g.dr.length)],an=BP2.R.an[Math.floor(Math.random()*BP2.R.an.length)];
  /* 👨‍👩‍👧 단체 주문: 8명 중 1명꼴로 2잔 (절반은 같은 음료) · 참을성 1.5배 */const grp=g.t>8&&Math.random()<.12,d2=grp?(Math.random()<.5?dd.k:g.dr[Math.floor(Math.random()*g.dr.length)].k):null,pt=grp?48:32;
  g.cust[i]={id:++g.seq,an,d:dd.k,d2,got:[0,0],pay:0,pat:pt,max:pt,ag:0,leave:0,happy:0,ang:0,sh:SH[g.seq%SH.length]}}
  /* 🔔 러시 타임엔 손님이 2배 빨리 와요 */g.spawn=(g.t>g.len-30?3.6+Math.random()*2:4.4+Math.random()*2.4)*(inRush(g.t)?.62:1)}
 {const rn=inRush(g.t);if(rn&&!g.rush0){g.spawn=Math.min(g.spawn,.4);fx('🔔 러시 타임! 값 +20%',W/2,170,'#ffcf6a',1.6);O.snd('fanfare')}g.rush0=rn}
 g.cust.forEach((c,i)=>{if(!c)return;c.ag+=dt;if(c.leave>0){c.leave-=dt;if(c.leave<=0)g.cust[i]=null;return}
  c.pat-=dt;if(c.pat<=0){c.leave=.8;c.ang=1;g.lost++;g.combo=0;fx('😡 가 버렸어요',SX[i],150,'#ff8a8a');O.snd('angry')}});
 /* ☕ 머신: 혼자 내려요 */
 if(g.mach.i>=0){g.mach.t+=dt;if(g.mach.t>=BREW){const c=g.cups[g.mach.i];if(c){c.shot=2;addLay(c,'shot',.2);fx('☕ 샷 완성!',SLX[g.mach.i],360,'#ffe0a0',.9);O.snd('coin')}g.mach.i=-1;g.mach.t=0}}
 /* 🥛 스팀: 켜 두면 온도가 올라가요. 100도 = 탐 */
 const S=g.stm;if(S.on){S.temp+=24*dt;if(S.temp>=100){S.on=false;S.amt=0;S.temp=0;g.mat+=150;g.combo=0;fx('🔥 우유가 탔어요!',W*.72,610,'#ff9a7a',1.3);O.snd('no')}}else if(S.amt>0)S.temp=Math.max(20,S.temp-2*dt);
 /* 붓기 */
 if(g.pour){const c=g.cups[g.pour.i];if(!c){g.pour=null}else{const hot=g.pour.k==='milk'&&c.cup==='hot';let r=CAFE_ING[g.pour.k].r*dt;
  if(hot){if(S.amt<=0||S.temp<40){g.pour=null;O.toast('🥛 데운 우유가 다 떨어졌어요 · 다시 스팀!')}else{r=Math.min(r,S.amt);S.amt-=r;c.mt=c.mt==null?S.temp:c.mt}}
  if(g.pour){addLay(c,g.pour.k,r);c.liq=c.liq||g.pour.k;if(lvl(c)>1.02){g.spill++;g.combo=0;fx('💦 넘쳤어요!',SLX[g.pour.i],CT-10,'#7ec8ff');O.snd('no');dropCup(g.pour.i,150)}}}}
 g.fx.forEach(f=>f.l-=dt);g.fx=g.fx.filter(f=>f.l>0);
 if(g.t>=g.len){g.done=true;g.pour=null}}
/* 손님에게 내기: 고른 컵 → 톡 한 손님 */
function serveTo(i){const c=g.cust[i],cup=selCup();if(!c||c.leave>0)return;if(!cup){O.toast('완성한 컵을 먼저 골라요 (작업대 컵 톡)');O.snd('no');return}
 if(cup.shot===1){O.toast('☕ 샷을 내리는 중이에요');O.snd('no');return}if(lvl(cup)<.3){O.toast('음료를 먼저 만들어요!');O.snd('no');return}
 const base=cup.lay.find(l=>BASES.includes(l.k)),liqs=cup.lay.filter(l=>l.k==='milk'||l.k==='water');
 const fits=dk=>{const r=rec(D[dk]);return cup.cup===r.cup&&(base?base.k:null)===r.base&&(cup.shot===2)===r.shot&&liqs.length>=1&&liqs.every(l=>l.k===r.liq)&&cup.lay.filter(l=>BASES.includes(l.k)).length<=1};
 /* 아직 안 받은 음료 중 맞는 것 */const want=[[0,c.d],[1,c.d2]].filter(([k,dk])=>dk&&!c.got[k]),hitW=want.find(([k,dk])=>fits(dk));
 if(!hitW){g.wrong++;g.combo=0;c.pat=Math.max(1,c.pat-6);g.shake=.4;fx('주문이랑 달라요! 😣',SX[i],150,'#ffb0b0');O.snd('no');dropCup(g.sel,150);return}
 const [wk,dk]=hitW,d=D[dk],r=rec(d),err=Math.abs(lvl(cup)-r.tg);let q=err<=.035?0:err<=.08?1:err<=.15?2:3;
 /* 따뜻한 우유는 온도도 봐요: 초록(55~72도)이 아니면 한 단계 아래 */
 if(r.cup==='hot'&&r.liq==='milk'&&cup.mt!=null&&(cup.mt<MILK_HOT[0]||cup.mt>MILK_HOT[1]))q=Math.min(3,q+1);
 const Q=[['PERFECT',1.5,'#8dffa0'],['GREAT',1.2,'#9fe0ff'],['GOOD',1,'#c8f0b0'],['아쉬워요',.6,'#ffd0c0']][q],rn=inRush(g.t);
 if(Q[1]>=1){g.combo++;g.bc=Math.max(g.bc,g.combo)}else g.combo=0;if(q===0)g.perf++;else if(q===1)g.great++;else if(q===2)g.good++;
 const pay=Math.round((g.o.dp?g.o.dp(d):d.p)*g.o.mul*g.o.pm*Q[1]*(1+Math.min(.5,g.combo*.05))*(rn?1.2:1));g.rev+=pay;g.mat+=d.c;g.served++;if(rn)g.rushN++;
 c.got[wk]=1;c.pay+=pay;g.cups[g.sel]=null;g.sel=-1;O.snd(q===0?'perf':'coin');
 const done=!c.d2||(c.got[0]&&c.got[1]);
 if(done){let bonus=0;if(c.d2){bonus=Math.round(c.pay*.15);g.rev+=bonus;g.grpN++}c.leave=.9;c.happy=1;O.onServe&&O.onServe(c.an);
  fx(Q[0]+'! +'+BP2.fmt(pay+bonus)+(bonus?' 👨‍👩‍👧':'')+(rn?' 🔔':''),SX[i],140,Q[2],1.4)}
 else{c.pat=Math.min(c.max,c.pat+8);fx(Q[0]+'! +'+BP2.fmt(pay)+' · 1잔 더!',SX[i],140,Q[2],1.3)}
 if(g.combo>=3)fx('🔥 '+g.combo+' 콤보',SX[i],112,'#ffb060',1.2)}
function hitB(x,y){return g.btn.find(b=>x>=b.x&&x<=b.x+b.w&&y>=b.y&&y<=b.y+b.h)}
function down(x,y){if(!g||g.done)return;
 /* 손님 톡 = 고른 컵 내기 */
 if(y>60&&y<292){const i=SX.findIndex(sx=>Math.abs(sx-x)<70);if(i>=0&&g.cust[i]&&g.cust[i].leave<=0)serveTo(i);return}
 /* 작업대 컵 톡 = 고르기 */
 if(y>=332&&y<=506){const i=SLX.findIndex(sx=>Math.abs(sx-x)<50);if(i>=0){if(g.cups[i]){g.sel=g.sel===i?-1:i;O.snd('tap')}return}if(x<120)O.toast(g.mach.i>=0?'☕ 샷을 내리는 중이에요':'컵을 고르고 ☕ 샷 내리기를 눌러요');return}
 const b=hitB(x,y);if(!b)return;const c=selCup();
 if(b.ty==='cup'){const i=g.cups.findIndex(v=>!v);if(i<0){O.toast('작업대가 꽉 찼어요! 완성한 컵을 내거나 버려요');O.snd('no');return}g.cups[i]={cup:b.k,lay:[],shot:0,liq:null,mt:null};g.sel=i;O.snd('tap');return}
 if(b.ty==='trash'){if(c){dropCup(g.sel,c.lay.length?150:0);O.snd('tap')}else O.toast('버릴 컵을 먼저 골라요');return}
 if(!c&&b.ty!=='steam'){O.toast('작업대에서 컵을 먼저 골라요!');O.snd('no');return}
 if(b.ty==='base'){if(c.liq){O.toast('시럽·가루는 우유·물보다 먼저 넣어요');O.snd('no');return}if(c.lay.some(l=>BASES.includes(l.k))){O.toast('이미 넣었어요');O.snd('no');return}
  const r=g.dr.map(rec).find(r=>r.base===b.k);addLay(c,b.k,r?r.bl:.15);fx(CAFE_ING[b.k].e+' 톡!',SLX[g.sel],CT-6,'#fff0c0',.7);O.snd('pour');return}
 if(b.ty==='shot'){if(c.shot===2){O.toast('샷은 이미 들어갔어요');O.snd('no');return}if(c.shot===1)return;if(c.liq){O.toast('샷은 우유·물보다 먼저 내려요');O.snd('no');return}
  if(g.mach.i>=0){O.toast('☕ 머신이 다른 샷을 내리는 중이에요');O.snd('no');return}g.mach.i=g.sel;g.mach.t=0;c.shot=1;O.snd('pour');
  /* 샷이 내려가는 동안 다른 컵으로 자동으로 옮겨 가요 */const nx=g.cups.findIndex((v,j)=>v&&j!==g.sel&&v.shot!==1);g.sel=nx;return}
 if(b.ty==='steam'){const S=g.stm;if(S.on){S.on=false;O.snd('tap');fx(Math.round(S.temp)+'°'+(S.temp>=MILK_HOT[0]&&S.temp<=MILK_HOT[1]?' 딱 좋아요!':S.temp<MILK_HOT[0]?' 미지근해요':' 너무 뜨거워요'),W*.72,600,S.temp>=MILK_HOT[0]&&S.temp<=MILK_HOT[1]?'#8dffa0':'#ffd0a0',.9);return}
  if(S.amt<=0){S.amt=1;S.temp=8;g.mat+=60}S.on=true;O.snd('pour');return}
 if(b.ty==='pour'){if(c.shot===1){O.toast('☕ 샷을 내리는 중이에요 · 다른 컵을 먼저 해요');O.snd('no');return}
  if(b.k==='milk'&&c.cup==='hot'&&(g.stm.amt<=0||g.stm.temp<40||g.stm.on)){O.toast(g.stm.on?'🥛 스팀을 먼저 멈춰요 (초록에서 톡)':'따뜻한 컵엔 🥛 스팀으로 데운 우유를 부어요');O.snd('no');return}
  g.pour={i:g.sel,k:b.k};O.snd('pour')}}
function up(){if(g)g.pour=null}
/* ---------- 그리기 ---------- */
const yOf=l=>CB-(CB-CT)*l;
const halfW=y=>{const u=(CB-y)/(CB-CT);return(CBW+(CTW-CBW)*u)/2};
function cupPath(x){cx.beginPath();cx.moveTo(x-CTW/2,CT);cx.lineTo(x+CTW/2,CT);cx.lineTo(x+CBW/2,CB);cx.quadraticCurveTo(x,CB+6,x-CBW/2,CB);cx.closePath()}
function drawCupAt(i,t){const x=SLX[i],c=g.cups[i],sel=g.sel===i;
 if(sel){rr(x-48,336,96,166,16,'#ffefb0');cx.save();cx.lineWidth=3;cx.strokeStyle='#ffb020';cx.beginPath();cx.roundRect(x-48,336,96,166,16);cx.stroke();cx.restore()}
 if(!c){cupPath(x);cx.setLineDash([6,6]);cx.lineWidth=2.5;cx.strokeStyle='#e0cbb0';cx.stroke();cx.setLineDash([]);tx('빈 자리',x,CT+52,13,'#c8ad90','center','#fff6e6');return}
 cx.save();cupPath(x);cx.fillStyle='rgba(255,255,255,.6)';cx.fill();cx.clip();let cum=0;
 c.lay.forEach(l=>{const y0=yOf(cum),y1=yOf(cum+l.a);cx.fillStyle=CAFE_ING[l.k].c;cx.fillRect(x-50,y1,100,y0-y1+.6);cum+=l.a});
 if(c.cup==='ice'){cx.globalAlpha=.5;[[-16,466,15],[10,474,16],[-4,446,13],[16,450,12],[-18,428,12],[6,420,13]].forEach(([dx,y,s],k)=>{cx.save();cx.translate(x+dx,y);cx.rotate(.3*k);cx.fillStyle='#eaf8ff';cx.fillRect(-s/2,-s/2,s,s);cx.strokeStyle='#bfe4f8';cx.lineWidth=1.5;cx.strokeRect(-s/2,-s/2,s,s);cx.restore()});cx.globalAlpha=1}
 if(g.pour&&g.pour.i===i){cx.fillStyle=CAFE_ING[g.pour.k].c;cx.fillRect(x-4,CT-30,8,yOf(lvl(c))-CT+30)}
 cx.restore();cupPath(x);cx.lineWidth=3;cx.strokeStyle=c.cup==='ice'?'#9ccbe6':'#c8a888';cx.stroke();
 if(c.cup==='hot'){cx.lineWidth=6;cx.strokeStyle='#e8d4bc';cx.beginPath();cx.arc(x+CTW/2-5,CT+46,20,-1.2,1.2);cx.stroke()}
 /* 붓는 중: 점선(우유 85% · 물 80%) */
 if(g.pour&&g.pour.i===i){const tg=g.pour.k==='water'?.8:.85,y=yOf(tg),hw=halfW(y);cx.setLineDash([6,4]);cx.lineWidth=2.5;cx.strokeStyle='#ff5a3a';cx.beginPath();cx.moveTo(x-hw-6,y);cx.lineTo(x+hw+6,y);cx.stroke();cx.setLineDash([]);em(CAFE_ING[g.pour.k].e,x,CT-40,24)}
 /* 들어간 것 표시 */
 const ic=(c.lay.find(l=>BASES.includes(l.k))?CAFE_ING[c.lay.find(l=>BASES.includes(l.k)).k].e:'')+(c.shot===2?'☕':'')+(c.liq?CAFE_ING[c.liq].e:'');
 tx((c.cup==='ice'?'🧊':'🔥')+ic,x,350,15,'#5a3a22','center',sel?'#ffefb0':'#fff6e6');
 if(c.shot===1){const u=g.mach.t/BREW;cx.lineWidth=5;cx.strokeStyle='rgba(0,0,0,.15)';cx.beginPath();cx.arc(x,CT+50,18,0,7);cx.stroke();cx.strokeStyle='#8a5a2a';cx.beginPath();cx.arc(x,CT+50,18,-Math.PI/2,-Math.PI/2+u*Math.PI*2);cx.stroke();em('☕',x,CT+50,16)}
 if(c.mt!=null&&c.cup==='hot'){const okT=c.mt>=MILK_HOT[0]&&c.mt<=MILK_HOT[1];tx(Math.round(c.mt)+'°',x+30,CB-6,11,okT?'#3a9a4a':'#d06a30','center','#fff6e6')}}
function drawMachine(t){const x=14,y=340;rr(x,y,96,160,14,'#4a4a52');rr(x+6,y+8,84,30,8,'#6a6a74');tx('☕ 머신',x+48,y+23,13,'#fff','center','#6a6a74');
 rr(x+30,y+44,36,14,4,'#2a2a30');const busy=g.mach.i>=0;
 if(busy){const u=g.mach.t/BREW;cx.fillStyle='#5a2e14';cx.fillRect(x+46,y+58,4,40+Math.sin(t*20)*2);rr(x+14,y+108,68,10,5,'rgba(0,0,0,.35)');rr(x+14,y+108,68*u,10,5,'#ffc94a');tx(['A','B','C'][g.mach.i]+' 컵 내리는 중',x+48,y+134,11,'#ffe9a0','center','#4a4a52')}
 else tx('비었어요',x+48,y+122,12,'#c8c8d0','center','#4a4a52');
 rr(x+18,y+144,60,8,4,'#2a2a30')}
function drawBtns(t){const c=selCup();g.btn.forEach(b=>{let base=b.ty==='trash'?'#f0e4d8':'#fff',lab=b.l,sub='',dis=false;
 if(b.ty==='cup'&&!g.cups.some(v=>!v))dis=true;
 if(b.ty==='shot'){if(g.mach.i>=0){sub='내리는 중 '+Math.ceil(BREW-g.mach.t)+'초';dis=true}else if(!c||c.shot||c.liq)dis=true;base=dis?'#f4ece2':'#ffe2b8'}
 if(b.ty==='base'&&(!c||c.liq||c.lay.some(l=>BASES.includes(l.k))))dis=true;
 if(b.ty==='pour'){if(!c||c.shot===1)dis=true;if(g.pour&&g.pour.k===b.k)base='#ffe9a0'}
 const sh=dis?'#e8dccc':b.ty==='shot'?'#d9a060':'#e0c4a0';rr(b.x,b.y+4,b.w,b.h,16,sh);rr(b.x,b.y+(g.pour&&g.pour.k===b.k?3:0),b.w,b.h,16,dis?'#f4ece2':base);
 if(b.ty==='steam'){const S=g.stm,gx=b.x+12,gw=b.w-24,gy=b.y+b.h-18;rr(gx,gy,gw,9,4,'rgba(0,0,0,.15)');rr(gx+gw*MILK_HOT[0]/100,gy,gw*(MILK_HOT[1]-MILK_HOT[0])/100,9,0,'#8ad88a');
  if(S.amt>0){const px=gx+gw*Math.min(1,S.temp/100);cx.fillStyle=S.temp>MILK_HOT[1]?'#ff5a3a':'#5a3a22';cx.beginPath();cx.moveTo(px,gy-3);cx.lineTo(px-5,gy-10);cx.lineTo(px+5,gy-10);cx.fill()}
  lab=S.on?'⏸ 멈추기 '+Math.round(S.temp)+'°':S.amt>0?'🥛 데운 우유 '+Math.round(S.temp)+'°':'🥛 스팀 시작';
  if(S.on){cx.save();cx.lineWidth=4;cx.strokeStyle='rgba(255,120,60,'+(.5+.5*Math.sin(t*10))+')';cx.beginPath();cx.roundRect(b.x-2,b.y-2,b.w+4,b.h+4,18);cx.stroke();cx.restore();for(let k=0;k<2;k++){const ph=(t*1.2+k*.5)%1;cx.globalAlpha=(1-ph)*.7;em('💨',b.x+b.w-24-k*14,b.y-4-ph*16,14);cx.globalAlpha=1}}
  tx(lab,b.x+b.w/2,b.y+19,17,'#5a3a22','center','#fff');return}
 tx(lab,b.x+b.w/2,b.y+b.h/2+(sub?-8:0)+(g.pour&&g.pour.k===b.k?3:0),b.ty==='base'?17:b.ty==='cup'||b.ty==='trash'?15:18,dis?'#b8a890':'#5a3a22','center',dis?'#f4ece2':base);
 if(sub)tx(sub,b.x+b.w/2,b.y+b.h/2+12,12,'#a07a58','center',base);
 if(b.ty==='pour'&&!dis)tx('꾹',b.x+b.w-14,b.y+12,11,'#c0a080','center',base)})}
/* 처음 두 판만: 지금 할 일 한 줄 */
function tutLine(){const c=selCup();if(!g.cups.some(Boolean))return'① 손님 주문을 보고 컵을 골라요';if(!c)return'작업대의 컵을 톡 해서 골라요';
 if(c.shot===1)return'샷이 내려가는 동안 다른 컵을 만들어요!';if(!c.liq&&g.need.steam&&c.cup==='hot'&&g.stm.amt<=0)return'따뜻한 우유 음료는 🥛 스팀 → 초록에서 멈추기';
 if(!c.liq)return'☕ 샷·🍦 시럽을 넣고 🥛/💧 꾹 눌러 점선까지';return'완성! 같은 주문을 한 손님을 톡 하면 내요'}
function draw(t){if(!g)return;cx.save();if(g.shake>0)cx.translate(Math.sin(t*80)*4,0);
 const bg=cx.createLinearGradient(0,0,0,330);bg.addColorStop(0,'#f6dcc0');bg.addColorStop(1,'#eac9a2');cx.fillStyle=bg;cx.fillRect(0,0,W,H);
 cx.fillStyle='#d9b48c';for(let x=0;x<W;x+=30)cx.fillRect(x,58,2,236);
 rr(0,292,W,34,0,'#a8714a');rr(0,292,W,7,0,'#c8915f');cx.fillStyle='#6b4a3a';cx.fillRect(0,508,W,H-508);
 /* 손님 */
 const cs=selCup();
 g.cust.forEach((c,i)=>{if(!c)return;const x=SX[i],inn=Math.min(1,c.ag/.5),lv=c.leave>0?1-c.leave/.9:0,a=c.leave>0?1-lv:inn,y=212+(1-inn)*20-(c.happy?Math.abs(Math.sin(lv*12))*10:0);
  cx.globalAlpha=Math.max(0,a);const r=c.pat/c.max;animal(c.an,x+(c.ang?-lv*60:0),y,70,{t,ph:i*1.7,mood:c.happy?'h':c.ang?'a':r<.3?'w':'n',shirt:c.sh,tilt:r<.3&&!c.leave?Math.sin(t*9)*.04:0});
  if(c.leave<=0){const nx=!c.got[0]?c.d:c.d2,d=D[nx],hl=cs&&cs.liq&&cs.shot!==1;rr(x-62,62,124,64,16,c.d2?'#fff3d6':'#fff');if(hl){cx.save();cx.lineWidth=2.5;cx.setLineDash([5,4]);cx.strokeStyle='#ffb020';cx.beginPath();cx.roundRect(x-62,62,124,64,16);cx.stroke();cx.restore()}
   cx.fillStyle=c.d2?'#fff3d6':'#fff';cx.beginPath();cx.moveTo(x-8,125);cx.lineTo(x+8,125);cx.lineTo(x,135);cx.fill();
   if(c.d2){/* 단체: 두 잔 모두 보여 주고 받은 건 ✅ */const a0=D[c.d],a1=D[c.d2];em(a0.e,x-42,82,22,c.got[0]?.35:1);if(c.got[0])em('✅',x-30,90,13);em(a1.e,x-14,82,22,c.got[1]?.35:1);if(c.got[1])em('✅',x-2,90,13);tx('2잔',x+34,82,15,'#c06010','center','#fff3d6')}
   else{em(d.e,x-36,84,28);tx(d.s,x+14,82,16,'#5a3a22','center','#fff')}
   tx((d.cup==='ice'?'🧊':'🔥')+' '+ingIcons(d),x,110,15,'#5a3a22','center',c.d2?'#fff3d6':'#fff');
   rr(x-40,140,80,8,4,'rgba(0,0,0,.2)');rr(x-40,140,80*r,8,4,r<.3?'#ff6a5a':r<.6?'#ffc94a':'#7ed88a')}
  cx.globalAlpha=1});
 /* 작업대 */
 rr(8,332,434,174,20,'#fff6e6');drawMachine(t);for(let i=0;i<3;i++)drawCupAt(i,t);
 drawBtns(t);
 /* 위 */
 rr(0,0,W,58,0,'#6b4a3a');tx('☕ 음료 도와주기',12,20,20,'#fff','left','#6b4a3a');tx('🪙 '+BP2.fmt(Math.round(O.coins()+g.rev-g.mat)),386,20,20,'#ffe9a0','right','#6b4a3a');
 const left=Math.max(0,g.len-g.t);rr(12,38,W-24,12,6,'rgba(0,0,0,.3)');rr(12,38,(W-24)*left/g.len,12,6,left<15?'#ff7a5a':'#7ed88a');tx(Math.ceil(left)+'초',W/2,44,12,'#fff','center','#6b4a3a');
 if(g.combo>=2)tx('🔥 '+g.combo,W-60,44,14,'#ffd060','right','#6b4a3a');
 const tl=inRush(g.t)?'':g.tut?tutLine():g.t<4?'컵 여러 개를 번갈아 만들어요 · 완성 컵 고르고 손님 톡!':'';if(tl)tx(tl,W/2,310,14,'#fff','center','#6b4a3a');
 /* 🔔 러시 타임: 깜빡이지 않는 띠 */{const rn=inRush(g.t),nx=RUSH.find(w=>g.t<w[0]);if(rn){const w=RUSH.find(w=>g.t>=w[0]&&g.t<w[1]);cx.fillStyle='rgba(255,170,60,.13)';cx.fillRect(0,58,W,234);rr(W/2-130,296,260,26,13,'#ff9a3a');tx('🔔 러시 타임! 값 +20% · '+Math.ceil(w[1]-g.t)+'초',W/2,309,15,'#fff','center','#ff9a3a')}
  else if(nx&&nx[0]-g.t<4&&nx[0]-g.t>0)tx('🔔 곧 러시 타임!',W/2,280,14,'#fff','center','#a8714a')}
 g.fx.forEach(f=>{const u=1-f.l/f.m;cx.globalAlpha=Math.min(1,f.l*2);tx(f.t,f.x,f.y-u*30,19,f.c,'center','#5a3a22');cx.globalAlpha=1});
 cx.restore()}
function res(){return{net:Math.round(g.rev-g.mat),rev:g.rev,mat:g.mat,served:g.served,lost:g.lost,perf:g.perf,great:g.great,good:g.good,wrong:g.wrong,spill:g.spill,bc:g.bc,rushN:g.rushN,grpN:g.grpN}}
return{start,step,draw,down,up,res,finish(){if(g){g.done=true;g.pour=null}},get done(){return!!(g&&g.done)},get g(){return g}}}
