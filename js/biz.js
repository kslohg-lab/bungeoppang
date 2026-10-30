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
 {k:'barista',n:'바리스타',e:'☕',an:'🐼',d:'음료를 만들어요',cafe:1}];
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
const SMAX=12,SCOST=[2000,6000,15000,36000,80000,170000,350000,700000,700000,1100000,1500000,2000000],WAGE=[0,100,250,500,900,1600,2800,4800,8000,10000,11500,13000,14500];
/* 가게 크기 = 꾸미기의 넓히기와 같은 칸 수. 사면 그 크기 월세가 0원 */
const PLACE={4:{n:'노점',e:'🛒',rent:0,buy:0,mul:1},5:{n:'작은 점포',e:'🏚️',rent:250,buy:30000,mul:1.15},6:{n:'아담한 가게',e:'🏠',rent:800,buy:100000,mul:1.3},7:{n:'넓은 가게',e:'🏬',rent:2000,buy:250000,mul:1.45},8:{n:'큰 매장',e:'🏢',rent:5000,buy:600000,mul:1.6},9:{n:'대형 매장',e:'🏬',rent:8000,buy:1600000,mul:1.7},10:{n:'붕어빵 본점',e:'🏰',rent:12000,buy:4000000,mul:1.8}};
const st=save=>{if(!save.st||typeof save.st!=='object')save.st={bake:0,serve:0,promo:0};return save.st};
const lvOf=(save,k)=>st(save)[k]|0;
const hireCost=(save,k)=>{const l=lvOf(save,k);return l>=SMAX?null:SCOST[l]};
const canHire=(save,k)=>k!=='barista'||cafeOn(save);
const wageOf=l=>WAGE[l|0]||0;
const place=save=>PLACE[save.room]||PLACE[4];
const owned=save=>Array.isArray(save.bought)&&save.bought.includes(save.room|0);
const rentOf=save=>owned(save)?0:place(save).rent;
function rates(save,ctx){ctx=ctx||{};const s=st(save),lv=ctx.lv||1,debt=save.debt>0?.5:1;
 const loc=R.loc[(save.up&&save.up.loc)|0]||R.loc[0];
 const co=cafeOn(save),pb=prB(save),pd=prD(save),arrive=5*(1+.05*(lv-1))*(1+.15*(s.promo|0))*loc.sp*place(save).mul*(1+(ctx.charm||0))*(co?1.1:1)*pb.a;
 const bake=4+2.5*(s.bake|0)*debt,serve=4+2.5*(s.serve|0)*debt;
 const cust=Math.min(arrive,bake,serve);
 const nu=Math.max(1,Math.min(save.nfUse||1,save.nf||1));let p=0,c=0;for(let f=0;f<nu;f++){p+=B.price(save,f);c+=R.menu[f].c}p/=nu;c/=nu;
 const seatB=Math.min(.3,(ctx.seats|0)*.03);
 const perCust=BPC*p*loc.pm*(1+seatB)*pb.p;
 /* 카페: 손님 중 일부가 음료도 사요 (음료 종류가 많을수록 많이). 바리스타가 만들 수 있는 만큼만 */
 const md=myDrinks(save);let drk=0,dPer=0,dMat=0,dWant=0,dCap=0;
 if(md.length){const dr=Math.min(.6,Math.min(.5,.25+.04*md.length)+(cafe(save).set?.1:0))*Math.min(1.2,pd.a);dWant=cust*dr;dCap=(2+3*(s.barista|0)*debt);drk=Math.min(dWant,dCap);dPer=md.reduce((a,d)=>a+dPrice(save,d),0)/md.length*beanMul(save)*loc.pm*pd.p;dMat=md.reduce((a,d)=>a+d.c,0)/md.length}
 const rev=cust*perCust+drk*dPer,mat=cust*BPC*c+drk*dMat,tax=Math.max(0,(rev-mat)*TAX);
 const rent=rentOf(save),wage=STAFF.reduce((a,x)=>a+wageOf(s[x.k]),0)*debt; /* 밀린 돈이 있으면 알바가 절반만 일하고 월급도 절반 */
 const neck=cust>=arrive-1e-9?'arrive':Math.abs(bake-serve)<1e-9?'both':bake<serve?'bake':'serve';
 return{arrive,bake,serve,cust,perCust,rev,mat,tax,rent,wage,net:rev-mat-tax-rent-wage,neck,seatB,debt:debt<1,drk,dPer,dWant,dCap,dNeck:md.length>0&&dWant>dCap+1e-9}}
/* 장부: 오늘(한국 날짜) 합계. 날짜가 바뀌면 어제로 */
const dayKey=ms=>Math.floor((ms+9*3600e3)/864e5);
function ledger(save,ms){const dk=dayKey(ms);if(!save.led||save.led.k!==dk){if(save.led&&save.led.k===dk-1)save.ledY=save.led;else if(save.led&&save.led.k<dk-1)save.ledY=null;save.led={k:dk,cust:0,drk:0,rev:0,mat:0,tax:0,rent:0,wage:0,help:0,h:0}}return save.led}
/* 지난 시간만큼 정산. 돌아온 결과(자리 비운 동안 화면용)를 줘요 */
function settle(save,ms,ctx){if(!(save.lt>0)){save.lt=ms;return null}
 let dt=(ms-save.lt)/3600e3;save.lt=ms;if(!(dt>0))return null;const capped=dt>CAP_H;dt=Math.min(dt,CAP_H);
 const r=rates(save,ctx),g={h:dt,capped,cust:r.cust*dt,drk:r.drk*dt,rev:r.rev*dt,mat:r.mat*dt,tax:r.tax*dt,rent:r.rent*dt,wage:r.wage*dt};g.net=g.rev-g.mat-g.tax-g.rent-g.wage;
 save.acc=(save.acc||0)+g.net;const whole=Math.trunc(save.acc);save.acc-=whole;
 let c=save.coins+whole;if(c<0){save.debt=(save.debt||0)-c;c=0}else if(save.debt>0){const p=Math.min(c,save.debt);save.debt-=p;c-=p;g.paid=p}save.coins=c;
 save.custAcc=(save.custAcc||0)+g.cust;const wc=Math.floor(save.custAcc);save.custAcc-=wc;save.bizCust=(save.bizCust||0)+wc;
 const L=ledger(save,ms);L.cust+=g.cust;L.drk=(L.drk||0)+g.drk;L.rev+=g.rev;L.mat+=g.mat;L.tax+=g.tax;L.rent+=g.rent;L.wage+=g.wage;L.h+=dt;g.whole=whole;g.custWhole=wc;return g}
function hire(save,k){const c=hireCost(save,k);if(c==null||!canHire(save,k)||save.coins<c)return false;save.coins-=c;st(save)[k]=lvOf(save,k)+1;return true}
function buyPlace(save){const p=place(save);if(!p.buy||owned(save)||save.coins<p.buy)return false;save.coins-=p.buy;if(!Array.isArray(save.bought))save.bought=[];save.bought.push(save.room|0);return true}
return{PRICE,prB,prD,setPrice,ING,ING_MUL,ingLv,ingCost,buyIng,dPrice,SET_COST,buySet,DRINKS,DK,MACHINE,BEAN,cafe,cafeOn,myDrinks,beanMul,beanCost,buyMachine,buyDrink,buyBean,canHire,CAP_H,TAX,STAFF,SMAX,SCOST,WAGE,PLACE,st,lvOf,hireCost,wageOf,place,owned,rentOf,rates,settle,ledger,hire,buyPlace,dayKey}})();
if(typeof module!=='undefined')module.exports=BIZ;
