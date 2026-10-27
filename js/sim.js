/* ===== 붕어빵2 규칙 + 시뮬레이터 (화면·DOM 없음) ===== */
const BP2=(()=>{
/* ---- 규칙 표: 숫자는 여기서만 고친다 ---- */
const R={
 len:90,rush:30,
 menu:[
  {n:'팥',e:'🫘',p:300,c:90,t:5.0,w:.06,bad:1.30,burn:1.50,col:'#8a3b3b',unlock:0},
  {n:'슈크림',e:'🍮',p:460,c:140,t:5.2,w:.055,bad:1.26,burn:1.45,col:'#ffd45a',unlock:4000},
  {n:'치즈',e:'🧀',p:720,c:215,t:5.4,w:.05,bad:1.22,burn:1.40,col:'#ffb830',unlock:9000},
  {n:'고구마',e:'🍠',p:1100,c:330,t:5.6,w:.045,bad:1.18,burn:1.35,col:'#b05ac0',unlock:18000},
  {n:'초코',e:'🍫',p:1700,c:510,t:5.8,w:.04,bad:1.14,burn:1.30,col:'#6a3a1f',unlock:36000},
  {n:'황금',e:'🌟',p:2600,c:780,t:6.0,w:.03,bad:1.10,burn:1.25,col:'#ffcf3a',unlock:72000}],
 cut:[[1,1500],[2,1900],[3,2400],[4,3000],[5,3800],[8,6000],[10,9500],[12,12500],[14,19000],[16,29000],[18,44000],[20,57000],[25,90000],[30,130000],[35,170000],[40,215000]],
 evCut:{fest:1.25,bomb:1.15,critic:1.2},
 up:{
  mold:{n:'틀 늘리기',e:'🔥',max:4,cost:[3000,7000,14000,26000]},
  speed:{n:'불 조절',e:'⏱️',max:5,cost:[2000,3200,5100,8200,13100]},
  auto:{n:'자동 반죽기',e:'🤖',max:1,cost:[5000]},
  pat:{n:'친절 교육',e:'💬',max:3,cost:[3000,6500,13000]},
  deco:{n:'가게 간판',e:'🏮',max:3,cost:[4000,10000,22000]},
  loc:{n:'장사 터',e:'🗺️',max:3,cost:[6000,16000,40000]},
  rack:{n:'접시 넓히기',e:'🍽️',max:2,cost:[3500,9000]}},
 loc:[{n:'골목 가게',e:'🏠',pm:1,sp:1,wall:'#fff3dc'},{n:'공원',e:'🌳',pm:1.15,sp:1.08,wall:'#eaf6dc'},{n:'학교 앞',e:'🏫',pm:1.3,sp:1.18,wall:'#e6eeff'},{n:'놀이공원',e:'🎡',pm:1.5,sp:1.28,wall:'#ffe6f4'}],
 wea:[{e:'☀️',n:'맑은 날',sp:1,pat:1,tp:0,w:50},{e:'🌧️',n:'비 오는 날',sp:.78,pat:1.1,tp:.2,w:25},{e:'❄️',n:'추운 날',sp:1.3,pat:.85,tp:0,w:25}],
 ev:{fest:{e:'🎪',n:'축제의 날',d:'손님이 몰려와요! 팁 ×1.5'},bomb:{e:'💣',n:'폭탄 주문의 날',d:'주문이 커요! 가격 ×1.25'},critic:{e:'🧐',n:'평론가의 날',d:'평론가 출몰! 완벽한 ✨ 준비'}},
 ordG:1.9,ivBase:5.2,ivDay:.06,ivMin:2.9,emptyMax:4,maxStage:40,ticketMul:1.0,
 an:['🐶','🐱','🐰','🐻','🐼','🦊','🐯','🐸','🐵','🐧','🐹','🦁']
};
const DT=1/30;
function mul(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const hs=(s,d)=>{let h=Math.imul(2166136261^s,16777619);h=Math.imul(h^d,2246822507);h^=h>>>15;h=Math.imul(h,3266489917);h^=h>>>13;return h>>>0};
const evOf=d=>d%5?null:d%25===0?'critic':(d/5)%2?'fest':'bomb';
function cutOf(d){const A=R.cut;if(d<=A[0][0])return A[0][1];for(let i=1;i<A.length;i++){if(d<=A[i][0]){const a=A[i-1],b=A[i];return a[1]+(b[1]-a[1])*(d-a[0])/(b[0]-a[0])}}const z=A[A.length-1];return z[1]*Math.pow(1.05,d-z[0])}
const cutline=d=>{const ev=evOf(d);return Math.round(cutOf(d)*(ev?R.evCut[ev]:1)/50)*50};
const fmt=n=>Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g,',');

/* ---- 판(run) ---- */
function newRun(seed,mode){return{lg:[],v:1,seed:seed>>>0,mode:mode||'week',day:1,coins:0,up:{mold:0,speed:0,auto:0,pat:0,deco:0,loc:0,rack:0},nf:1,ticket:0,tused:0,tot:0,bestNet:0,over:false,clear:false,stage:0}}
const nMold=run=>Math.min(6,2+run.up.mold);
const speedF=run=>Math.max(.7,1-.06*run.up.speed);
const tSide=(run,f)=>R.menu[f].t*speedF(run);
const L=run=>R.loc[run.up.loc];
/* 접시: 0단계 전체 10개, 1단계 전체 16개, 2단계 맛마다 10개 */
const rackLv=run=>run.up.rack|0;
const rackCap=run=>[10,16,10][rackLv(run)];
const rackFull=(s,run,f)=>rackLv(run)>=2?s.rack.filter(r=>r.f===f).length>=10:s.rack.length>=rackCap(run);
function upCost(run,k){if(k==='fl')return run.nf>=R.menu.length?null:R.menu[run.nf].unlock;const u=R.up[k],lv=run.up[k]|0;return lv>=u.max?null:u.cost[lv]}
function buy(run,k){if(run.lg)run.lg.push(['B',k]);const c=upCost(run,k);if(c==null||run.coins<c)return false;run.coins-=c;if(k==='fl')run.nf++;else run.up[k]=(run.up[k]|0)+1;return true}
const ticketCost=run=>Math.round(cutline(run.day)*R.ticketMul/100)*100;
function buyTicket(run){if(run.lg)run.lg.push(['T']);const c=ticketCost(run);if(run.ticket||run.coins<c)return false;run.coins-=c;run.ticket=1;return true}

/* ---- 하루 ---- */
function newDay(run){
 if(run.lg)run.lg.push(['D']);
 const d=run.day,rng=mul(hs(run.seed,d*7919+13));let r=rng()*100,wi=0,acc=0;for(let i=0;i<R.wea.length;i++){acc+=R.wea[i].w;if(r<acc){wi=i;break}}
 const ev=evOf(d);if(ev==='fest')wi=0;else if(ev==='bomb')wi=1;
 return{d,ev,wea:R.wea[wi],loc:run.up.loc,rng,t:0,net:0,cut:cutline(d),cust:[null,null,null],mold:Array.from({length:6},()=>({s:0,f:0,p:0,qa:'g',sh:0})),rack:[],sel:0,combo:0,bc:0,spawnT:1.0,emp:0,served:0,lost:0,burnt:0,perf:0,made:0,
  tk:0,ph:'play',endT:0,done:false,rushed:false,idleT:0,busyT:0,fx:[],ban:2.6}}
const qOf=(f,p)=>{const m=R.menu[f];return p>1+m.w+1e-9?(p>m.bad?'b':'g'):p>=1-m.w-1e-9?'p':'g'};
const perfMark=f=>{const m=R.menu[f];return[1-m.w,1+m.w]};
const fx=(s,o)=>s.fx.push(o);
function takeCost(s,run,f){s.net-=R.menu[f].c}
function moldTap(s,run,i){if(run.lg)run.lg.push([s.tk,0,i]);if(s.ph!=='play'||i>=nMold(run))return;const m=s.mold[i];
 if(m.s===0){if(run.up.auto){m.f=s.sel;takeCost(s,run,m.f);m.s=3;m.p=0;m.qa='g';fx(s,{k:'snd',n:'pour'});fx(s,{k:'pf',e:'💨',a:'m',i,n:2})}else{m.s=1;fx(s,{k:'snd',n:'pour'})}}
 else if(m.s===1){m.f=s.sel;takeCost(s,run,m.f);m.s=2;fx(s,{k:'snd',n:'pour'})}
 else if(m.s===2){m.s=3;m.p=0;m.qa='g';fx(s,{k:'snd',n:'tap'})}
 else if(m.s===3){if(m.p<.85){m.sh=.25;fx(s,{k:'ft',t:'아직!',a:'m',i,c:'#fff'});fx(s,{k:'snd',n:'no'});return}m.qa=qOf(m.f,m.p);m.s=4;m.p=0;fx(s,{k:'snd',n:'flip'});fx(s,{k:'pf',e:'✨',a:'m',i,n:2})}
 else if(m.s===4){if(m.p<.85){m.sh=.25;fx(s,{k:'ft',t:'아직!',a:'m',i,c:'#fff'});fx(s,{k:'snd',n:'no'});return}
  if(rackFull(s,run,m.f)){s.full=(s.full|0)+1;fx(s,{k:'toast',t:rackLv(run)>=2?R.menu[m.f].e+' '+R.menu[m.f].n+' 접시가 꽉 찼어요! 먼저 손님에게 주세요':'접시가 꽉 찼어요! 먼저 손님에게 주세요'});fx(s,{k:'snd',n:'no'});return}
  const q=qOf(m.f,m.p),fq=(m.qa==='b'||q==='b')?'b':(m.qa==='p'&&q==='p')?'p':'g';m.s=0;
  if(fq==='b'){s.burnt++;s.combo=0;fx(s,{k:'ft',t:'탔어요! 😵',a:'m',i,c:'#ffb0a0'});fx(s,{k:'snd',n:'burn'})}
  else{s.rack.push({f:m.f,q:fq});s.made++;if(fq==='p'){s.perf++;fx(s,{k:'ft',t:'완벽! ✨',a:'m',i,c:'#ffe066'});fx(s,{k:'snd',n:'perf'});fx(s,{k:'pf',e:'✨',a:'m',i,n:4})}else{fx(s,{k:'ft',t:'good',a:'m',i,c:'#fff'});fx(s,{k:'snd',n:'ready'})}}}
 else if(m.s===5){m.s=0;fx(s,{k:'snd',n:'tap'})}}
function selFl(s,run,f){if(run.lg)run.lg.push([s.tk,2,f]);if(f<run.nf&&f>=0){s.sel=f;fx(s,{k:'snd',n:'tap'})}}
const pickR=(s,c,f)=>{const Rk=s.rack;let k=Rk.findIndex(r=>r.f===f&&r.q==='p');if(k<0&&c.ty!=='critic')k=Rk.findIndex(r=>r.f===f);return k};
function canServe(s,c){return !!c&&c.leave<=0&&c.ord.some((o,f)=>o-c.got[f]>0&&pickR(s,c,f)>=0)}
function serve(s,run,ci){if(run.lg)run.lg.push([s.tk,1,ci]);if(s.ph!=='play')return;const c=s.cust[ci];if(!c||c.leave>0)return;let gave=0;const lc=L(run),nf=R.menu.length;
 for(let f=0;f<nf;f++)while(c.ord[f]-c.got[f]>0){const k=pickR(s,c,f);if(k<0)break;const r=s.rack.splice(k,1)[0];c.got[f]++;gave++;
  const cm=1+Math.min(.5,s.combo*.05),val=Math.round(R.menu[f].p*(r.q==='p'?1.3:1)*cm*({vip:1.5,reg:1.2,group:1.1,critic:3}[c.ty]||1)*lc.pm*(s.ev==='bomb'?1.25:1));
  s.net+=val;fx(s,{k:'ft',t:'+'+fmt(val),a:'c',i:ci,dy:gave*10,c:'#fff0a0'});fx(s,{k:'snd',n:'coin'});if(r.q==='p'){s.combo++;s.bc=Math.max(s.bc,s.combo)}}
 if(!gave){c.sh=.25;fx(s,{k:'toast',t:c.ty==='critic'&&s.rack.length?'평론가는 완벽한 ✨만 받아요!':'줄 붕어빵이 아직 없어요!'});fx(s,{k:'snd',n:'no'});return}
 if(c.ord.every((n,f)=>c.got[f]>=n)){let sum=0;c.ord.forEach((n,f)=>sum+=n*R.menu[f].p);sum*=lc.pm;
  const tp=Math.round(sum*((c.pat/c.max>.5?.15:.05)+s.wea.tp+(s.ev==='fest'?.5:0)));
  let ex=0;if(c.ty==='critic'){ex=1500+s.d*150;fx(s,{k:'ft',t:'평론가 극찬! 🎩 +'+fmt(ex),a:'c',i:ci,dy:-40,c:'#ffe066'})}else if(c.ty==='group')ex=1000+s.d*100;
  s.net+=tp+ex;fx(s,{k:'ft',t:'팁 +'+fmt(tp)+' 💝',a:'c',i:ci,dy:-20,c:'#ffd0e0'});c.leave=.8;c.happy=1;s.served++;fx(s,{k:'pf',e:'💖',a:'c',i:ci,n:3})}}
function spawnC(s,run){const free=[0,1,2].filter(i=>!s.cust[i]);if(!free.length)return false;const rng=s.rng,sl=free[Math.floor(rng()*free.length)],d=s.d,r=rng()*100,lc=run.up.loc,ev=s.ev;
 const crit=d>=10?(ev==='critic'?12:3):0,grp=d>=8?(ev==='bomb'?14:5)+(lc===3?4:0):0,vp=d>=6?5+(lc===3?5:0):0,rg=d>=2?9+(lc===1?8:0):0,hu=d>=3?18+(lc===2?14:0):0;
 let ty='n',c=crit;if(r<c)ty='critic';else if(r<(c+=grp))ty='group';else if(r<(c+=vp))ty='vip';else if(r<(c+=rg))ty='reg';else if(r<(c+=hu))ty='hurry';
 let n=ty==='vip'?3+Math.floor(rng()*3):ty==='group'?6+Math.floor(rng()*3):ty==='critic'?2:1+Math.floor(rng()*(d<5?2:d<12?3:4));
 if(ev==='bomb'&&!['vip','group','critic'].includes(ty))n+=1;
 const ord=[0,0,0,0,0,0],nf=run.nf,wt=[];let tot=0,wv=1;for(let f=0;f<nf;f++){wt.push(wv);tot+=wv;wv*=R.ordG}
 for(let i=0;i<n;i++){let x=rng()*tot,f=0;while(f<nf-1&&x>=wt[f]){x-=wt[f];f++}ord[f]++}
 const an=ty==='critic'?'🧐':R.an[Math.floor(rng()*R.an.length)];
 const base=({n:34,reg:38,hurry:19,vip:52,group:80,critic:42})[ty]*Math.max(.7,1-d*.02)*(1+.08*run.up.pat)*s.wea.pat;
 s.cust[sl]={an,ty,ord,got:[0,0,0,0,0,0],pat:base,max:base,in:0,leave:0,sh:0};return true}
function step(s,run,dt){
 s.tk++;
 if(s.ph==='end'){s.endT-=dt;if(s.endT<=0)s.done=true;return}
 s.t+=dt;if(s.ban>0)s.ban-=dt;const remain=R.len-s.t;
 if(!s.rushed&&remain<R.rush){s.rushed=true;fx(s,{k:'rush'});fx(s,{k:'snd',n:'win'})}
 const present=s.cust.some(c=>c&&c.leave<=0);s.emp=present?0:s.emp+dt;
 const baking=s.mold.some((m,i)=>i<nMold(run)&&(m.s===3||m.s===4||m.s===1||m.s===2));
 if(!present&&!baking)s.idleT+=dt;else s.busyT+=dt;
 s.spawnT-=dt;if(s.emp>R.emptyMax&&s.spawnT>0)s.spawnT=0;
 if(s.spawnT<=0){if(spawnC(s,run)){const iv=Math.max(R.ivMin,R.ivBase-R.ivDay*s.d)/(s.wea.sp*(1+.06*run.up.deco)*L(run).sp*(s.ev==='fest'?1.6:s.ev==='bomb'?.8:1))*(s.rushed?.65:1);s.spawnT=iv*(.8+.4*s.rng())}else s.spawnT=1}
 s.cust.forEach((c,i)=>{if(!c)return;c.in=Math.min(1,c.in+dt*3);if(c.sh>0)c.sh-=dt;
  if(c.leave>0){c.leave-=dt;if(c.leave<=0)s.cust[i]=null;return}
  c.pat-=dt;if(c.pat<=0){c.leave=.8;c.angry=1;s.lost++;s.combo=0;fx(s,{k:'ft',t:'😡',a:'c',i,c:'#ff8080'});fx(s,{k:'snd',n:'angry'})}});
 for(let i=0;i<nMold(run);i++){const m=s.mold[i];if(m.sh>0)m.sh-=dt;if(m.s===3||m.s===4){const b=m.p;m.p+=dt/tSide(run,m.f);if(b<.85&&m.p>=.85)fx(s,{k:'snd',n:'ready'});
  if(m.p>=R.menu[m.f].burn){m.s=5;s.combo=0;s.burnt++;fx(s,{k:'snd',n:'burn'});fx(s,{k:'pf',e:'💨',a:'m',i,n:3})}}}
 if(remain<=0){s.ph='end';s.endT=2.2;fx(s,{k:'snd',n:'win'})}}
function dayResult(s,run){const net=Math.round(s.net);return{net,cut:s.cut,pass:net>=s.cut,full:s.full|0,served:s.served,lost:s.lost,perf:s.perf,burnt:s.burnt,bc:s.bc,made:s.made,idle:s.idleT/Math.max(1,s.idleT+s.busyT)}}
/* 하루가 끝났을 때 판 상태를 갱신하고 결과 종류를 돌려 준다: 'pass' | 'revive' | 'over' | 'clear' */
function endDay(run,res){
 if(run.lg)run.lg.push(['E']);
 if(res.pass){run.coins=Math.max(0,run.coins+res.net);run.tot+=res.net;run.stage=run.day;run.bestNet=Math.max(run.bestNet,res.net);
  if(run.day>=R.maxStage){run.clear=true;run.over=true;return'clear'}run.day++;return'pass'}
 if(run.ticket){run.ticket=0;run.tused++;return'revive'}
 run.over=true;return'over'}
/* 기록(lg)을 처음부터 다시 돌려 결과를 확인 (같은 시드·같은 입력이면 항상 같음) */
function replay(seed,lg){const run=newRun(seed,'week');run.lg=null;let s=null;
 const fin=()=>{while(!s.done)step(s,run,DT);endDay(run,dayResult(s,run));s=null};
 for(const e of lg){if(run.over)break;
  if(e[0]==='B')buy(run,e[1]);else if(e[0]==='T')buyTicket(run);else if(e[0]==='D')s=newDay(run);else if(e[0]==='E'){if(s)fin()}
  else if(s){while(s.tk<e[0])step(s,run,DT);if(e[1]===0)moldTap(s,run,e[2]);else if(e[1]===1)serve(s,run,e[2]);else if(e[1]===2)selFl(s,run,e[2])}}
 return run}
/* 키우기 추천: keys=보여 줄 항목, r=지난 하루 결과(없어도 됨). {k,why} 또는 null */
function recUp(run,keys,r){const can=k=>keys.includes(k)&&upCost(run,k)!=null,pick=(k,why)=>can(k)?{k,why}:null;let x=null;
 if(r){x=(r.full>=2&&pick('rack','접시가 '+r.full+'번 꽉 찼어요'))||(r.lost>=3&&(pick('pat','손님을 '+r.lost+'명 놓쳤어요 → 더 기다려 줘요')||pick('mold','손님을 '+r.lost+'명 놓쳤어요 → 한 번에 더 많이 구워요')))||
  (r.cut&&r.net<r.cut*1.25&&pick('fl','컷트라인이 빠듯해요 → 비싼 메뉴로 더 벌어요'))||(r.idle>.3&&(pick('deco','손님이 없는 시간이 길어요 → 손님을 더 불러요')||pick('loc','손님이 없는 시간이 길어요 → 손님이 많은 곳으로')));if(x)return x}
 const ord=[['mold','틀이 많을수록 한 번에 많이 구워요'],['fl','비싼 메뉴가 돈을 많이 벌어요'],['auto','손이 바쁠 때 큰 도움이 돼요'],['rack','미리 많이 구워 둘 수 있어요'],['speed','빨리 구워서 손님을 덜 기다리게 해요'],['pat','손님이 더 오래 기다려 줘요'],['loc','값을 더 받고 손님도 많아요'],['deco','손님이 더 자주 와요']];
 for(const [k,why] of ord)if(can(k)&&upCost(run,k)<=run.coins)return{k,why};
 for(const [k,why] of ord)if(can(k))return{k,why:why+' (돈을 모아 봐요)'};return null}
const weekId=(ms)=>Math.floor((Math.floor((ms+9*3600e3)/864e5)+3)/7);
const weekSeed=(w)=>hs(20260601,w),SIMV=2; /* SIMV: 규칙 숫자를 바꾸면 올린다 (옛 기록 검증 구분용) */
return{SIMV,weekSeed,R,DT,rackLv,rackCap,rackFull,recUp,mul,hs,evOf,cutline,cutOf,fmt,newRun,nMold,speedF,tSide,upCost,buy,ticketCost,buyTicket,newDay,replay,qOf,perfMark,moldTap,selFl,serve,canServe,pickR,step,dayResult,endDay,weekId,L}})();
if(typeof module!=='undefined')module.exports=BP2;
