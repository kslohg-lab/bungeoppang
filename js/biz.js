/* ===== 가게 경영: 직원 · 월세 · 세금 · 자리 비운 동안 장사 =====
   BIZ.rates(save,ctx) → 시간당 손님·매출·비용, BIZ.settle(save,ms,ctx) → 지난 시간만큼 정산(최대 8시간).
   ctx = {lv: 가게 Lv, charm: 매력 보너스(0~0.25), seats: 앉을 자리 수} */
const BIZ=(()=>{
const B=typeof BP2!=='undefined'?BP2:require('./sim.js'),R=B.R;
const CAP_H=8,TAX=.1,BPC=1.6; /* BPC: 손님 한 명이 사는 붕어빵 수(평균) */
const STAFF=[
 {k:'bake',n:'굽기 알바',e:'🍞',an:'🐶',d:'붕어빵을 대신 구워요'},
 {k:'serve',n:'계산 알바',e:'🧾',an:'🐰',d:'손님 주문을 받고 계산해요'},
 {k:'promo',n:'홍보 알바',e:'📣',an:'🦊',d:'전단지를 돌려 손님을 불러와요'},
 {k:'barista',n:'바리스타',e:'☕',an:'🐼',d:'음료를 만들어요',cafe:1},
 /* 🏢 2층이 생기면 굽기·계산 알바를 한 명씩 더 (11/10 VOC '알바 인원 늘리기'). 최대 레벨은 2층 크기로 */
 {k:'bake2',n:'굽기 알바 2호',e:'🍞',an:'🐶',d:'2층이 생기면 한 명 더! 같이 구워요',f2:1},
 {k:'serve2',n:'계산 알바 2호',e:'🧾',an:'🐰',d:'2층이 생기면 한 명 더! 같이 계산해요',f2:1}];
/* ☕ 카페: 커피머신을 사면 열려요. st = [재료, 붓는 선(컵 높이 비율)] 순서대로, cup = ice/hot */
const DRINKS=[
 {k:'ame',n:'아이스 아메리카노',s:'아아',e:'🧊',cup:'ice',p:1200,c:250,un:0,st:[['shot',.2],['water',.8]]},
 {k:'latte',n:'카페라떼',s:'라떼',e:'☕',cup:'hot',p:1500,c:400,un:0,st:[['shot',.2],['milk',.85]]},
 {k:'van',n:'바닐라라떼',s:'바닐라',e:'🍦',cup:'hot',p:1900,c:500,un:8000,st:[['van',.12],['shot',.32],['milk',.85]]},
 {k:'choco',n:'핫초코',s:'핫초코',e:'🍫',cup:'hot',p:1700,c:450,un:15000,st:[['choco',.25],['milk',.85]]},
 {k:'straw',n:'딸기라떼',s:'딸기',e:'🍓',cup:'ice',p:2200,c:600,un:30000,st:[['straw',.28],['milk',.85]]},
 {k:'matcha',n:'녹차라떼',s:'녹차',e:'🍵',cup:'ice',p:2400,c:650,un:50000,st:[['matcha',.22],['milk',.85]]}];
const DK={};DRINKS.forEach(d=>DK[d.k]=d);
/* 💰 가격: p = 값 배율, a = 오는 손님 배율. 손님이 넘칠 때(막힘) 올리면 이득, 모자랄 때 내리면 이득 */
const PRICE=[{n:'싸게',e:'🏷️',p:.85,a:1.25},{n:'보통',e:'🪙',p:1,a:1},{n:'비싸게',e:'💰',p:1.2,a:.78},{n:'아주 비싸게',e:'💎',p:1.45,a:.55}];
const prB=save=>PRICE[(save.pr&&save.pr.b!=null)?save.pr.b:1]||PRICE[1],prD=save=>PRICE[(save.pr&&save.pr.d!=null)?save.pr.d:1]||PRICE[1];
function setPrice(save,k,i){if(!PRICE[i]||(k!=='b'&&k!=='d'))return false;if(!save.pr||typeof save.pr!=='object')save.pr={b:1,d:1};save.pr[k]=i;return true}
/* ☕ 음료 재료 3단계: 값 +8% · +16% · +25%. 비용 = [2만, 6만, 15만] × (1 + 음료 순서×0.25) */
const ING={ame:{e:'🫘',n:'스페셜티 원두'},latte:{e:'🥛',n:'목장 우유'},van:{e:'🍦',n:'바닐라 빈 시럽'},choco:{e:'🍫',n:'벨기에 초콜릿'},straw:{e:'🍓',n:'생딸기 청'},matcha:{e:'🍵',n:'제주 말차'}};
const ING_MUL=[0,.08,.16,.25],ING_C=[20000,60000,150000];
const ingLv=(save,k)=>{const c=cafe(save);return(c.ing&&c.ing[k])|0};
const ingCost=(save,k)=>{const l=ingLv(save,k),i=DRINKS.findIndex(d=>d.k===k);return l>=3||i<0?null:Math.round(ING_C[l]*(1+i*.25))};
function buyIng(save,k){const c=cafe(save),cost=ingCost(save,k);if(!c.on||!c.dr.includes(k)||cost==null||save.coins<cost)return false;save.coins-=cost;if(!c.ing||typeof c.ing!=='object')c.ing={};c.ing[k]=ingLv(save,k)+1;return true}
const dPrice=(save,d)=>d.p*(1+ING_MUL[ingLv(save,d.k)]);
/* 🎁 세트 메뉴(붕어빵+음료): 음료 사는 손님 +10%p */
const SET_COST=80000;
function buySet(save){const c=cafe(save);if(!c.on||c.set||save.coins<SET_COST)return false;save.coins-=SET_COST;c.set=1;return true}
const MACHINE=15000,BEAN=[10000,30000,80000,200000,500000];
const cafe=save=>{if(!save.cafe||typeof save.cafe!=='object')save.cafe={on:0,dr:[],bean:0};if(!Array.isArray(save.cafe.dr))save.cafe.dr=[];return save.cafe};
const cafeOn=save=>!!cafe(save).on;
const myDrinks=save=>cafeOn(save)?DRINKS.filter(d=>cafe(save).dr.includes(d.k)):[];
const beanMul=save=>1+.15*(cafe(save).bean|0);
const beanCost=save=>{const b=cafe(save).bean|0;return b>=BEAN.length?null:BEAN[b]};
function buyMachine(save){const c=cafe(save);if(c.on||save.coins<MACHINE)return false;save.coins-=MACHINE;c.on=1;c.dr=['ame','latte'];return true}
function buyDrink(save,k){const c=cafe(save),d=DK[k];if(!c.on||!d||c.dr.includes(k)||save.coins<d.un)return false;save.coins-=d.un;c.dr.push(k);return true}
function buyBean(save){const c=cafe(save),cost=beanCost(save);if(!c.on||cost==null||save.coins<cost)return false;save.coins-=cost;c.bean=(c.bean|0)+1;return true}
/* 알바 최대 50레벨. 11/10 VOC '알바가 너무 비싸다' → 값·월급 다시 정함:
   한 레벨 올렸을 때 늘어나는 이득으로 본전이 중반 2~3일·후반 5~7일(자리 비움 수입 기준)이 되게, 월급 인상은 이득의 20% 정도.
   대신 가게 크기가 알바 최대 레벨을 정해요(STCAP) → 넓히기가 알바 성장의 열쇠. */
const SMAX=80,SCOST=[2000,6000,15000,36000,51000,73000,100000,140000,170000,210000,250000,280000,300000,330000,370000,410000,450000,460000,470000,480000,490000,500000,510000,520000,530000,550000,570000,590000,610000,630000,650000,670000,690000,710000,730000,750000,780000,800000,820000,840000,860000,880000,900000,920000,940000,960000,980000,1000000,1020000,1040000],
 WAGE=[0,100,300,500,800,1200,1600,2100,2700,3400,4200,5100,6000,7000,8200,9500,10900,12500,14100,15700,17300,18900,20500,22100,23700,25300,26900,28500,30100,31700,33300,34900,36500,38100,39700,41300,42900,44500,46100,47700,49300,50900,52500,54100,55700,57300,58900,60500,62100,63700,65300];
/* 👑 11/28 Lv51~80 (사용자 승인): 1층·2층 모두 11×11이면 열려요. 끝판 가게는 오는 손님이 처리량보다 많아서(실측 286.7 > 254) 레벨이 수입으로 이어져요.
   값 = Lv51 200만부터 ×1.05씩(만 원 단위, Lv80 약 820만) → 굽기·계산 한 쌍 본전 Lv51 약 7일 · Lv80 약 29일. 월급 = Lv50 65,300 + 레벨마다 1,600 */
while(SCOST.length<SMAX)SCOST.push(Math.round(2e6*Math.pow(1.05,SCOST.length-50)/1e4)*1e4);
while(WAGE.length<=SMAX)WAGE.push(WAGE[WAGE.length-1]+1600);
/* 가게 크기 → 알바 최대 레벨 · 매력 상한 */
const STCAP={5:8,6:12,7:16,8:22,9:30,10:40,11:50},CHCAP={5:.15,6:.18,7:.21,8:.25,9:.30,10:.35,11:.40};
/* 🏢 2층 (11/10): 1층이 11×11이면 올릴 수 있어요. 5×5부터 11×11까지 넓혀요 (사는 방식, 월세 없음). 크기마다 매력 상한·손님이 더 올라요 */
const F2ROOM=[{n:5,p:10000000},{n:6,p:15000000},{n:7,p:25000000},{n:8,p:40000000},{n:9,p:60000000},{n:10,p:90000000},{n:11,p:130000000}],
 F2CH={5:.02,6:.03,7:.04,8:.05,9:.06,10:.08,11:.10},F2MUL={5:.05,6:.07,7:.09,8:.11,9:.13,10:.16,11:.20};
const f2Of=save=>{const v=save.f2|0;return v>=5&&v<=11?v:0},f2Next=save=>{const v=f2Of(save);return(save.room|0)>=11?F2ROOM.find(q=>q.n===(v?v+1:5))||null:null};
function buyF2(save){const q=f2Next(save);if(!q||save.coins<q.p)return false;save.coins-=q.p;save.f2=q.n;if(!Array.isArray(save.fur2))save.fur2=[];return true}
const rmOf=save=>Math.min(11,Math.max(5,save.room|0)),XCAP=save=>rmOf(save)>=11&&f2Of(save)>=11?30:0,capOf=(save,k)=>(k==='bake2'||k==='serve2'?(f2Of(save)?STCAP[f2Of(save)]:0):STCAP[rmOf(save)])+XCAP(save),charmCap=save=>CHCAP[rmOf(save)]+(F2CH[f2Of(save)]||0);
/* 예전(5.7.2까지) 알바 값 → 차액 돌려주기(ec2) */
const OLD_SCOST=[2000,6000,15000,36000,80000,170000,350000,700000,700000,1100000,1500000,2000000,2600000,3300000,4200000,5200000,6500000,8000000,10000000,12500000];
while(OLD_SCOST.length<50){const c=OLD_SCOST[OLD_SCOST.length-1]*1.1,m=c>=1e8?1e6:1e5;OLD_SCOST.push(Math.round(c/m)*m)}
/* 가게 크기 = 꾸미기의 넓히기와 같은 칸 수. 사면 그 크기 월세가 0원 (11/8부터 5×5 노점 ~ 11×11 본점) */
const PLACE={5:{n:'노점',e:'🛒',rent:0,buy:0,mul:1},6:{n:'작은 점포',e:'🏚️',rent:250,buy:30000,mul:1.15},7:{n:'아담한 가게',e:'🏠',rent:800,buy:100000,mul:1.3},8:{n:'넓은 가게',e:'🏬',rent:2000,buy:250000,mul:1.45},9:{n:'큰 매장',e:'🏢',rent:5000,buy:600000,mul:1.6},10:{n:'대형 매장',e:'🏬',rent:8000,buy:1600000,mul:1.7},11:{n:'붕어빵 본점',e:'🏰',rent:12000,buy:4000000,mul:1.8}};
/* 📍 11/17 상권(가게 자리): 동네 어디에 가게를 두느냐. A = 손님 배율, P = 객단가(붕어빵·음료 값) 배율, bp = 붐비지 않을 때 객단가, r = 임대료(순이익의 %, 코인 0 밑으로 안 감), key = 권리금
   붐비는 시간(pk)은 한국 시각 기준. 이사할 때 옛 자리 권리금 절반 돌려받고, 이사비 = 1시간 순이익 정도 */
const ZONES=[
 {k:'alley',n:'골목',e:'🏘️',d:'처음 자리 · 지금 숫자 그대로',A:1,P:1,bp:1,r:0,key:0,pk:null},
 {k:'school',n:'학교 앞',e:'🏫',d:'평일 오후 3~6시 손님 ×2 · 값 ×1.25',A:2,P:1.25,bp:1.05,r:.03,key:3000000,kd:.25,pk:(w,h)=>w>=1&&w<=5&&h>=15&&h<18},
 {k:'station',n:'역 앞',e:'🚉',d:'평일 아침 7~9시·저녁 6~8시 손님 ×2 · 값 ×1.25',A:2,P:1.25,bp:1.05,r:.03,key:3000000,kd:.25,pk:(w,h)=>w>=1&&w<=5&&((h>=7&&h<9)||(h>=18&&h<20))},
 {k:'park',n:'공원 옆',e:'🌳',d:'주말 하루 종일 손님 ×1.5 · 값 ×1.25',A:1.5,P:1.25,bp:1.05,r:.04,key:10000000,kd:.4,pk:w=>w===0||w===6},
 {k:'night',n:'야시장',e:'🌙',d:'매일 저녁 7~11시 손님 ×1.6 · 값 ×1.25',A:1.6,P:1.25,bp:1.05,r:.03,key:3000000,kd:.25,pk:(w,h)=>h>=19&&h<23},
 {k:'mall',n:'상가 거리',e:'🛍️',d:'늘 손님 ×1.25 · 값 ×1.12',A:1.25,P:1.12,bp:1.12,r:.05,key:50000000,kd:.75,pk:()=>true},
 {k:'prime',n:'사거리 1등지',e:'👑',d:'늘 손님 ×1.4 · 값 ×1.25',A:1.4,P:1.25,bp:1.25,r:.08,key:200000000,kd:5,pk:()=>true}];
const ZK={};ZONES.forEach(z=>ZK[z.k]=z);
const zoneOf=save=>ZK[save.zn&&save.zn.k]||ZONES[0];
const kst=ms=>{const d=new Date(ms+9*3600e3);return{w:d.getUTCDay(),h:d.getUTCHours()}};
const zPeak=(z,ms)=>!!(z.pk&&(()=>{const t=kst(ms);return z.pk(t.w,t.h)})());
const zMul=(save,ms)=>{const z=zoneOf(save);return zPeak(z,ms)?{a:z.A,p:z.P,pk:1}:{a:1,p:z.bp,pk:0}};
/* 도와주기 결과 배율: 판 시작 시각의 값 배율 × (1 − 임대료) */
const zHelp=(save,ms)=>{const z=zoneOf(save);if(!z.r)return{m:1,pk:0,z};const pk=zPeak(z,ms);return{m:(pk?z.P:z.bp)*(1-z.r),pk:pk&&z.A!==1&&z.k!=='mall'&&z.k!=='prime'?1:0,z}};
/* 이사비: 1시간 순이익(최소 5천) + 새 자리 권리금 − 옛 자리 권리금 절반 */
/* 💰 11/17 권리금은 가게 규모에 맞춰요: max(기본 권리금, 하루 수입 × kd일). 하루 수입 = 장부의 자동 영업 순이익 + 도와주기, 오늘·어제 중 큰 쪽 */
const ledNet=x=>x?Math.max(0,(x.rev||0)-(x.mat||0)-(x.tax||0)-(x.rent||0)-(x.wage||0)-(x.zr||0))+(x.help||0):0;
const dayInc=(save,ms)=>{const dk=dayKey(ms||Date.now()),L=save.led&&save.led.k===dk?save.led:null,Y=save.led&&save.led.k===dk-1?save.led:save.ledY&&save.ledY.k===dk-1?save.ledY:null;return Math.max(ledNet(L),ledNet(Y))};
const zKey=(save,k,ms)=>{const z=ZK[k];if(!z||!z.key)return 0;return Math.max(z.key,Math.round(dayInc(save,ms)*(z.kd||0)/100000)*100000)};
/* 이사 비용: 다른 구역 = 이사비(1시간 순이익, 최소 5천) + 새 권리금 − 옛 권리금(실제 낸 돈) 절반. 같은 구역 안에서 칸만 옮기기 = 무료 */
function zMoveCost(save,k,ctx){const z=ZK[k],cur=zoneOf(save);if(!z)return null;if(z===cur)return{fee:0,key:0,back:0,total:0,same:1};const r=rates(save,Object.assign({},ctx,{noZ:1,noEv:1}));const fee=Math.round(Math.max(5000,r.net)/1000)*1000,back=Math.floor(((save.zn&&save.zn.paid)|0)/2),key=zKey(save,k);return{fee,key,back,total:fee+key-back}}
/* 실제 이사(서버에서 칸을 잡은 뒤에 불러요): 코인 빼고 save.zn = {k 상권, paid 낸 권리금, l 칸 번호, c 서버에 잡음, t} */
function zMove(save,k,ctx,ms,lot,c){c=c||zMoveCost(save,k,ctx);if(!c||save.coins<c.total)return false;save.coins-=c.total;const pd=c.same?((save.zn&&save.zn.paid)|0):c.key;save.zn={k,paid:pd,t:ms||Date.now(),l:lot,c:1};return c}
const st=save=>{if(!save.st||typeof save.st!=='object')save.st={bake:0,serve:0,promo:0};return save.st};
const lvOf=(save,k)=>st(save)[k]|0;
/* 👥 일하는 레벨: 고용한 레벨보다 낮춰서 쓸 수 있어요(월급도 그만큼). save.su[k] 없으면 고용한 레벨 그대로 */
const useOf=(save,k)=>{const l=lvOf(save,k),u=save.su&&save.su[k];return u==null||!(u>=0)?l:Math.min(l,u|0)};
function setUse(save,k,v){const l=lvOf(save,k);v=Math.max(0,Math.min(l,v|0));if(!save.su||typeof save.su!=='object')save.su={};if(v>=l)delete save.su[k];else save.su[k]=v;return v}
const useSt=save=>{const o={};STAFF.forEach(x=>o[x.k]=useOf(save,x.k));return o};
const hireCost=(save,k)=>{const l=lvOf(save,k);return l>=SMAX?null:SCOST[l]};
const canHire=(save,k)=>k==='barista'?cafeOn(save):k==='bake2'||k==='serve2'?f2Of(save)>0:true;
const wageOf=l=>WAGE[l|0]||0;
/* 11/10 값 내림: 예전 값으로 이미 올린 만큼의 차액을 한 번 계산해 save.rfd {l 남은 돈, t 전체}에 담아요 (코인은 shop.js가 나눠서 줘요) */
function ec2(save){if(save.ec2)return 0;save.ec2=1;const s=st(save);let r=0;STAFF.forEach(x=>{const l=Math.min(50,s[x.k]|0);for(let i=0;i<l;i++)r+=Math.max(0,OLD_SCOST[i]-SCOST[i])});r=Math.round(r);if(r>0)save.rfd={l:r,t:r};return r}
const place=save=>PLACE[save.room]||PLACE[5];
const owned=save=>Array.isArray(save.bought)&&save.bought.includes(save.room|0);
const rentOf=save=>owned(save)?0:place(save).rent;
function rates(save,ctx){ctx=ctx||{};const s=useSt(save),lv=ctx.lv||1,debt=save.debt>0?.5:1;
 const loc=R.loc[(save.up&&save.up.loc)|0]||R.loc[0];
 const co=cafeOn(save),pb=prB(save),pd=prD(save),em=evMul(save,ctx.ms||Date.now(),ctx.noEv),zm=ctx.noZ?{a:1,p:1,pk:0}:zMul(save,ctx.ms||Date.now()),arrive=zm.a*5*(1+.05*(lv-1))*(1+.15*(s.promo|0))*loc.sp*place(save).mul*(1+(F2MUL[f2Of(save)]||0))*(1+(ctx.charm||0))*(co?1.1:1)*pb.a*(ctx.noRt?1:rtMul(save))*em.a;
 const bake=4+2.5*((s.bake|0)+(s.bake2|0))*debt,serve=4+2.5*((s.serve|0)+(s.serve2|0))*debt;
 const cust=Math.min(arrive,bake,serve);
 const nu=Math.max(1,Math.min(save.nfUse||1,save.nf||1));let p=0,c=0;for(let f=0;f<nu;f++){p+=B.price(save,f);c+=R.menu[f].c}p/=nu;c/=nu;
 const seatB=Math.min(.3,(ctx.seats|0)*.03);
 const perCust=BPC*p*loc.pm*(1+seatB)*pb.p*em.p*zm.p;
 /* 카페: 손님 중 일부가 음료도 사요 (음료 종류가 많을수록 많이). 바리스타가 만들 수 있는 만큼만 */
 const md=myDrinks(save);let drk=0,dPer=0,dMat=0,dWant=0,dCap=0;
 if(md.length){const dr=Math.min(.6,Math.min(.5,.25+.04*md.length)+(cafe(save).set?.1:0))*Math.min(1.2,pd.a);dWant=cust*dr;dCap=(2+3*(s.barista|0)*debt);drk=Math.min(dWant,dCap);dPer=md.reduce((a,d)=>a+dPrice(save,d),0)/md.length*beanMul(save)*loc.pm*pd.p*zm.p;dMat=md.reduce((a,d)=>a+d.c,0)/md.length}
 const rev=cust*perCust+drk*dPer,mat=cust*BPC*c+drk*dMat,tax=Math.max(0,(rev-mat)*TAX);
 const rent=rentOf(save),wage=STAFF.reduce((a,x)=>a+wageOf(s[x.k]),0)*debt; /* 밀린 돈이 있으면 알바가 절반만 일하고 월급도 절반 */
 const neck=cust>=arrive-1e-9?'arrive':Math.abs(bake-serve)<1e-9?'both':bake<serve?'bake':'serve';
 const n0=rev-mat-tax-rent-wage,zr=ctx.noZ?0:Math.max(0,n0)*zoneOf(save).r;
 return{arrive,bake,serve,cust,perCust,rev,mat,tax,rent,wage,zr,zpk:zm.pk,net:n0-zr,neck,seatB,debt:debt<1,drk,dPer,dWant,dCap,dNeck:md.length>0&&dWant>dCap+1e-9}}
/* ---------- ⭐ 가게 평점 (1.0~5.0, 처음 3.5) ----------
   하루에 한 번(날짜가 바뀔 때) 목표 점수 쪽으로 35%씩 다가가요. 목표 = 3.5 + 기다림 + 값 + 꾸미기 + 메뉴 + 도와주기 솜씨.
   손님 수: 3.5보다 높으면 +10%/점(5.0 = +15%), 낮으면 −4%/점(1.0 = −10%). 가게 순위에는 안 들어가요. */
const rt=(save,ms)=>{if(!save.rt||typeof save.rt!=='object'||!(save.rt.v>0))save.rt={v:3.5,d:dayKey(ms||Date.now()),why:[],rv:[]};return save.rt};
const rtMul=save=>{const v=rt(save).v;return v>=3.5?1+(v-3.5)*.1:1+(v-3.5)*.04};
const rtAdd=(save,x)=>{const r=rt(save);r.v=Math.max(1,Math.min(5,Math.round((r.v+x)*100)/100))};
/* 도와주기 솜씨: 최근 이틀 판의 ✨완벽 비율 */
function rtHelp(save,ms,perf,served){const dk=dayKey(ms);let h=save.rtH;if(!h||typeof h!=='object'||h.dk!==dk)h=save.rtH={dk,p:0,s:0,pp:h&&h.dk===dk-1?h.p:0,ps:h&&h.dk===dk-1?h.s:0};h.p+=perf|0;h.s+=served|0}
const RV={wait:['너무 오래 기다렸어요 😡','줄이 너무 길어요 😥'],fast:['금방 나와요 👍','줄 서도 금방이에요 😊'],cheap:['가격이 착해요 💸','싸고 맛있어요 😋'],pricey:['조금 비싸요 😅','값이 좀 세네요 🤔'],deco:['가게가 예뻐요 🥰','사진 찍기 좋아요 📸'],menu:['맛 고르는 재미가 있어요 🍡','메뉴가 다양해요 😍'],crisp:['바삭바삭 최고예요 😋','굽기 장인이에요 ✨']};
function rtDaily(save,ms,ctx){const R0=rt(save,ms),dk=dayKey(ms);if(R0.d>=dk)return null;const days=Math.min(3,dk-R0.d);
 const r=rates(save,Object.assign({},ctx,{ms,noEv:1})),pi=(save.pr&&save.pr.b!=null)?save.pr.b:1,nu=Math.max(1,Math.min(save.nfUse||1,save.nf||1));
 const h=save.rtH||{},hp=(h.dk===dk-1?h.p:0)+(h.dk===dk-1?h.pp:h.dk===dk-2?h.p:0),hs=(h.dk===dk-1?h.s:0)+(h.dk===dk-1?h.ps:h.dk===dk-2?h.s:0);
 const C=[['wait',r.neck==='arrive'?.2:-.6],['price',[.4,0,-.4,-.8][pi]||0],['deco',Math.min(.6,(ctx&&ctx.charm||0)*2.4)],['menu',Math.min(.4,.1*(nu-1))],['help',hs>=5?Math.min(.5,.6*hp/hs):0]];
 const T=Math.max(1,Math.min(5,3.5+C.reduce((a,c)=>a+c[1],0))),old=R0.v;R0.v=Math.max(1,Math.min(5,Math.round((old+(T-old)*(1-Math.pow(.65,days)))*100)/100));
 R0.why=C.filter(c=>Math.abs(c[1])>=.05).map(c=>[c[0],Math.round(c[1]*100)/100]);R0.d=dk;R0.dv=Math.round((R0.v-old)*100)/100;
 const pick=(k,i)=>RV[k][(dk+i)%RV[k].length],L=[];C.forEach(([k,v])=>{if(k==='wait')L.push(pick(v>0?'fast':'wait',0));else if(k==='price'&&v)L.push(pick(v>0?'cheap':'pricey',1));else if(v>=.15)L.push(pick(k==='help'?'crisp':k,2))});
 R0.rv=L.slice(0,3);return R0}
/* ---------- 📅 하루 한 번 사건: 매일 첫 접속 때 카드 1장 → 둘 중 하나 고르기 ----------
   폰 시계를 되돌려도 이미 받은 날보다 앞 날짜 사건은 다시 안 와요(evMax). 고른 건 바로 저장. */
const EVS=['group','rival','influ','rain','fest'];
function evNew(save,ms){const dk=dayKey(ms);if((save.evMax|0)>=dk)return null;save.evMax=dk;
 let x=((save.seed|0)^Math.imul(dk,2654435761))>>>0;x^=x>>>15;x=Math.imul(x,2246822519)>>>0;x=(x^(x>>>13))>>>0;const k=EVS[x%EVS.length];
 save.ev={dk,k,ch:-1};return save.ev}
/* 지금 사건이 손님(a)·값(p)에 주는 효과 */
function evMul(save,ms,off){let a=1,p=1;if(off)return{a,p};const dk=dayKey(ms),e=save.ev;
 if(e&&e.dk===dk){if(e.k==='rival'){if(e.ch===0){a*=1.25;p*=.85}else if(e.ch===1)a*=.85}
  if(e.k==='rain'&&e.ch!==0)a*=.8;if(e.k==='fest'&&e.ch===0)a*=1.35}
 const t=save.evT;if(t&&t.dk===dk)a*=t.a||1;return{a,p}}
/* 고를 때 드는 돈·받는 돈 (지금 장사 규모에 맞춰요) */
function evCost(save,ctx){const r=rates(save,Object.assign({},ctx,{noEv:1}));const hr=Math.max(0,r.rev),hn=Math.max(0,r.net),pc=Math.max(200,r.perCust);
 return{free:Math.round(Math.max(500,pc*4)),paid:Math.round(Math.max(300,pc*2)),umb:Math.round(Math.max(1000,hr*.5)),fest:Math.round(Math.max(2000,hn*1)),grp:Math.round(Math.max(3000,hn*1.5))}}
const GRP_NEED=30,GRP_H=3;
function evChoose(save,i,ms,ctx){const e=save.ev;if(!e||e.dk!==dayKey(ms)||e.ch!==-1||(i!==0&&i!==1))return null;const c=evCost(save,ctx);let msg='';
 if(i===0){if(e.k==='influ'&&save.coins<c.free)return{err:'코인이 부족해요'};if(e.k==='rain'&&save.coins<c.umb)return{err:'코인이 부족해요'};if(e.k==='fest'&&save.coins<c.fest)return{err:'코인이 부족해요'}}
 e.ch=i;
 if(e.k==='group'){if(i===0){e.until=ms+GRP_H*3600e3;e.got=0;e.need=GRP_NEED;e.rw=c.grp;msg='🚌 단체 주문을 받았어요! 3시간 안에 도와주기로 손님 '+GRP_NEED+'명'}else msg='단체 주문을 정중히 거절했어요'}
 if(e.k==='rival')msg=i===0?'🏷️ 할인 행사 시작! 오늘 손님 +25% · 값 −15%':'💪 버티기! 오늘 손님 −15%';
 if(e.k==='influ'){if(i===0){save.coins-=c.free;rtAdd(save,.25);save.evT={dk:e.dk+1,a:1.15};msg='📸 공짜로 드렸어요! 평점 +0.25 · 내일 손님 +15%'}else{save.coins+=c.paid;msg='정가를 받았어요 +'+c.paid+'🪙'}}
 if(e.k==='rain')msg=i===0?(save.coins-=c.umb,'☂️ 우산을 빌려줘요! 비가 와도 손님이 그대로'):'🌧️ 오늘은 손님 −20%';
 if(e.k==='fest')msg=i===0?(save.coins-=c.fest,'🎪 축제 노점! 오늘 손님 +35%'):'오늘은 쉬어 가요';
 e.msg=msg;return{msg}}
/* 도와주기 한 판 끝: 단체 주문 진행 */
function evHelp(save,served,ms){const e=save.ev;if(!e||e.k!=='group'||e.ch!==0||e.res)return null;if(ms>e.until)return null;e.got=(e.got|0)+(served|0);
 if(e.got>=e.need){e.res='ok';save.coins+=e.rw|0;rtAdd(save,.2);return{ok:1,rw:e.rw|0}}return{got:e.got,need:e.need}}
/* 시간이 지나면: 단체 주문 실패 확인 */
function evCheck(save,ms){const e=save.ev;if(e&&e.k==='group'&&e.ch===0&&!e.res&&ms>e.until){e.res='fail';rtAdd(save,-.3);return{fail:1}}return null}
/* 장부: 오늘(한국 날짜) 합계. 날짜가 바뀌면 어제로 */
const dayKey=ms=>Math.floor((ms+9*3600e3)/864e5);
function ledger(save,ms){const dk=dayKey(ms);if(!save.led||save.led.k!==dk){if(save.led&&save.led.k===dk-1)save.ledY=save.led;else if(save.led&&save.led.k<dk-1)save.ledY=null;save.led={k:dk,cust:0,drk:0,rev:0,mat:0,tax:0,rent:0,wage:0,help:0,h:0}}return save.led}
/* 지난 시간만큼 정산. 돌아온 결과(자리 비운 동안 화면용)를 줘요 */
function settle(save,ms,ctx){if(!(save.lt>0)){save.lt=ms;return null}
 let dt=(ms-save.lt)/3600e3;save.lt=ms;if(!(dt>0))return null;const capped=dt>CAP_H;dt=Math.min(dt,CAP_H);
 const g={h:dt,capped,cust:0,drk:0,rev:0,mat:0,tax:0,rent:0,wage:0,zr:0};
 /* 📍 붐비는 시간이 있는 자리는 지나간 시간을 한 시간 단위로 나눠 그 시각의 손님·값으로 계산 */
 const z=zoneOf(save),seg=z.pk&&z.A!==1&&z.k!=='mall'&&z.k!=='prime';let t1=ms-dt*3600e3;
 while(t1<ms-1){const t2=seg?Math.min(ms,(Math.floor((t1+9*3600e3)/3600e3)+1)*3600e3-9*3600e3):ms,h=(t2-t1)/3600e3,r=rates(save,Object.assign({},ctx,{ms:(t1+t2)/2}));
  g.cust+=r.cust*h;g.drk+=r.drk*h;g.rev+=r.rev*h;g.mat+=r.mat*h;g.tax+=r.tax*h;g.rent+=r.rent*h;g.wage+=r.wage*h;g.zr+=r.zr*h;t1=t2}
 g.net=g.rev-g.mat-g.tax-g.rent-g.wage-g.zr;
 save.acc=(save.acc||0)+g.net;const whole=Math.trunc(save.acc);save.acc-=whole;
 let c=save.coins+whole;if(c<0){save.debt=(save.debt||0)-c;c=0}else if(save.debt>0){const p=Math.min(c,save.debt);save.debt-=p;c-=p;g.paid=p}save.coins=c;
 save.custAcc=(save.custAcc||0)+g.cust;const wc=Math.floor(save.custAcc);save.custAcc-=wc;save.bizCust=(save.bizCust||0)+wc;
 const L=ledger(save,ms);L.cust+=g.cust;L.drk=(L.drk||0)+g.drk;L.rev+=g.rev;L.mat+=g.mat;L.tax+=g.tax;L.rent+=g.rent;L.wage+=g.wage;L.zr=(L.zr||0)+g.zr;L.h+=dt;g.whole=whole;g.custWhole=wc;return g}
function hire(save,k){const c=hireCost(save,k);if(c==null||!canHire(save,k)||lvOf(save,k)>=capOf(save,k)||save.coins<c)return false;save.coins-=c;st(save)[k]=lvOf(save,k)+1;if(save.su)delete save.su[k];return true}
function buyPlace(save){const p=place(save);if(!p.buy||owned(save)||save.coins<p.buy)return false;save.coins-=p.buy;if(!Array.isArray(save.bought))save.bought=[];save.bought.push(save.room|0);return true}
return{XCAP,ZONES,ZK,zoneOf,zHelp,zKey,dayInc,zPeak,zMul,zMoveCost,zMove,rt,rtMul,rtAdd,rtHelp,rtDaily,EVS,evNew,evMul,evCost,evChoose,evHelp,evCheck,GRP_NEED,PRICE,prB,prD,setPrice,ING,ING_MUL,ingLv,ingCost,buyIng,dPrice,SET_COST,buySet,DRINKS,DK,MACHINE,BEAN,cafe,cafeOn,myDrinks,beanMul,beanCost,buyMachine,buyDrink,buyBean,canHire,CAP_H,TAX,STAFF,SMAX,SCOST,WAGE,STCAP,CHCAP,capOf,charmCap,ec2,F2ROOM,F2CH,F2MUL,f2Of,f2Next,buyF2,PLACE,st,lvOf,useOf,setUse,useSt,hireCost,wageOf,place,owned,rentOf,rates,settle,ledger,hire,buyPlace,dayKey}})();
if(typeof module!=='undefined')module.exports=BIZ;
