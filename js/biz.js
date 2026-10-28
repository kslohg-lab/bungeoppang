/* ===== 가게 경영: 직원 · 월세 · 세금 · 자리 비운 동안 장사 =====
   BIZ.rates(save,ctx) → 시간당 손님·매출·비용, BIZ.settle(save,ms,ctx) → 지난 시간만큼 정산(최대 8시간).
   ctx = {lv: 가게 Lv, charm: 매력 보너스(0~0.25), seats: 앉을 자리 수} */
const BIZ=(()=>{
const B=typeof BP2!=='undefined'?BP2:require('./sim.js'),R=B.R;
const CAP_H=8,TAX=.1,BPC=1.6; /* BPC: 손님 한 명이 사는 붕어빵 수(평균) */
const STAFF=[
 {k:'bake',n:'굽기 알바',e:'🍞',an:'🐻',d:'붕어빵을 대신 구워요'},
 {k:'serve',n:'계산 알바',e:'🧾',an:'🐰',d:'손님 주문을 받고 계산해요'},
 {k:'promo',n:'홍보 알바',e:'📣',an:'🦊',d:'전단지를 돌려 손님을 불러와요'}];
const SMAX=8,SCOST=[2000,6000,15000,36000,80000,170000,350000,700000],WAGE=[0,100,250,500,900,1600,2800,4800,8000];
/* 가게 크기 = 꾸미기의 넓히기와 같은 칸 수. 사면 그 크기 월세가 0원 */
const PLACE={4:{n:'노점',e:'🛒',rent:0,buy:0,mul:1},5:{n:'작은 점포',e:'🏚️',rent:250,buy:30000,mul:1.15},6:{n:'아담한 가게',e:'🏠',rent:800,buy:100000,mul:1.3},7:{n:'넓은 가게',e:'🏬',rent:2000,buy:250000,mul:1.45},8:{n:'큰 매장',e:'🏢',rent:5000,buy:600000,mul:1.6}};
const st=save=>{if(!save.st||typeof save.st!=='object')save.st={bake:0,serve:0,promo:0};return save.st};
const lvOf=(save,k)=>st(save)[k]|0;
const hireCost=(save,k)=>{const l=lvOf(save,k);return l>=SMAX?null:SCOST[l]};
const wageOf=l=>WAGE[l|0]||0;
const place=save=>PLACE[save.room]||PLACE[4];
const owned=save=>Array.isArray(save.bought)&&save.bought.includes(save.room|0);
const rentOf=save=>owned(save)?0:place(save).rent;
function rates(save,ctx){ctx=ctx||{};const s=st(save),lv=ctx.lv||1,debt=save.debt>0?.5:1;
 const loc=R.loc[(save.up&&save.up.loc)|0]||R.loc[0];
 const arrive=5*(1+.05*(lv-1))*(1+.15*(s.promo|0))*loc.sp*place(save).mul*(1+(ctx.charm||0));
 const bake=4+2.5*(s.bake|0)*debt,serve=4+2.5*(s.serve|0)*debt;
 const cust=Math.min(arrive,bake,serve);
 const nu=Math.max(1,Math.min(save.nfUse||1,save.nf||1));let p=0,c=0;for(let f=0;f<nu;f++){p+=B.price(save,f);c+=R.menu[f].c}p/=nu;c/=nu;
 const seatB=Math.min(.3,(ctx.seats|0)*.03);
 const perCust=BPC*p*loc.pm*(1+seatB),rev=cust*perCust,mat=cust*BPC*c,tax=Math.max(0,(rev-mat)*TAX);
 const rent=rentOf(save),wage=STAFF.reduce((a,x)=>a+wageOf(s[x.k]),0)*debt; /* 밀린 돈이 있으면 알바가 절반만 일하고 월급도 절반 */
 const neck=cust>=arrive-1e-9?'arrive':Math.abs(bake-serve)<1e-9?'both':bake<serve?'bake':'serve';
 return{arrive,bake,serve,cust,perCust,rev,mat,tax,rent,wage,net:rev-mat-tax-rent-wage,neck,seatB,debt:debt<1}}
/* 장부: 오늘(한국 날짜) 합계. 날짜가 바뀌면 어제로 */
const dayKey=ms=>Math.floor((ms+9*3600e3)/864e5);
function ledger(save,ms){const dk=dayKey(ms);if(!save.led||save.led.k!==dk){if(save.led&&save.led.k===dk-1)save.ledY=save.led;else if(save.led&&save.led.k<dk-1)save.ledY=null;save.led={k:dk,cust:0,rev:0,mat:0,tax:0,rent:0,wage:0,help:0,h:0}}return save.led}
/* 지난 시간만큼 정산. 돌아온 결과(자리 비운 동안 화면용)를 줘요 */
function settle(save,ms,ctx){if(!(save.lt>0)){save.lt=ms;return null}
 let dt=(ms-save.lt)/3600e3;save.lt=ms;if(!(dt>0))return null;const capped=dt>CAP_H;dt=Math.min(dt,CAP_H);
 const r=rates(save,ctx),g={h:dt,capped,cust:r.cust*dt,rev:r.rev*dt,mat:r.mat*dt,tax:r.tax*dt,rent:r.rent*dt,wage:r.wage*dt};g.net=g.rev-g.mat-g.tax-g.rent-g.wage;
 save.acc=(save.acc||0)+g.net;const whole=Math.trunc(save.acc);save.acc-=whole;
 let c=save.coins+whole;if(c<0){save.debt=(save.debt||0)-c;c=0}else if(save.debt>0){const p=Math.min(c,save.debt);save.debt-=p;c-=p;g.paid=p}save.coins=c;
 save.custAcc=(save.custAcc||0)+g.cust;const wc=Math.floor(save.custAcc);save.custAcc-=wc;save.bizCust=(save.bizCust||0)+wc;
 const L=ledger(save,ms);L.cust+=g.cust;L.rev+=g.rev;L.mat+=g.mat;L.tax+=g.tax;L.rent+=g.rent;L.wage+=g.wage;L.h+=dt;g.whole=whole;g.custWhole=wc;return g}
function hire(save,k){const c=hireCost(save,k);if(c==null||save.coins<c)return false;save.coins-=c;st(save)[k]=lvOf(save,k)+1;return true}
function buyPlace(save){const p=place(save);if(!p.buy||owned(save)||save.coins<p.buy)return false;save.coins-=p.buy;if(!Array.isArray(save.bought))save.bought=[];save.bought.push(save.room|0);return true}
return{CAP_H,TAX,STAFF,SMAX,SCOST,WAGE,PLACE,st,lvOf,hireCost,wageOf,place,owned,rentOf,rates,settle,ledger,hire,buyPlace,dayKey}})();
if(typeof module!=='undefined')module.exports=BIZ;
