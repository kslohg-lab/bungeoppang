/* ===== 🏅 메달: 챌린지에서 모으고, 가게 '메달 스킨'에만 써요 — 챌린지·가게 공용 =====
   저장: localStorage bpMedal = {n:가진 메달, w:{주번호:[받은 단계…]}, t:모은 합계}
   참여 보상(이번 주 판, 2966주=11/2부터): 10·20·30·40단계 +5 · 50단계 +10 · 60단계(완주) +20 → 한 주 최대 50
   (등수 보상은 11/9부터, 숨김 목록과 함께) */
const MEDAL=(()=>{
const KEY='bpMedal',WK=2966,MS=[[10,5],[20,5],[30,5],[40,5],[50,10],[60,20]];
const load=()=>{let v=null;try{v=JSON.parse(localStorage.getItem(KEY))}catch(e){}if(!v||typeof v!=='object')v={};v.n=v.n|0;v.t=v.t|0;if(!v.w||typeof v.w!=='object')v.w={};return v};
const save=v=>{try{localStorage.setItem(KEY,JSON.stringify(v))}catch(e){}};
/* 지난 주 기록은 4주만 남겨요 */
function trim(v,wid){for(const k in v.w)if(+k<wid-4)delete v.w[k]}
/* 이번 주 도달 단계로 받을 수 있는 메달을 받아요 → [{st,n}] */
function claim(wid,stage){wid=wid|0;stage=stage|0;if(wid<WK||stage<10)return[];const v=load(),got=v.w[wid]||[],out=[];
 for(const [st,n] of MS)if(stage>=st&&!got.includes(st)){got.push(st);v.n+=n;v.t+=n;out.push({st,n})}
 if(out.length){v.w[wid]=got;trim(v,wid);save(v)}return out}
/* 다음 목표: {st,n} 또는 null */
function next(wid,stage){const got=(load().w[wid|0])||[];for(const [st,n] of MS)if(stage<st&&!got.includes(st))return{st,n};return null}
function spend(n){const v=load();if(v.n<n)return false;v.n-=n;save(v);return true}
return{get:()=>load(),claim,next,spend,MS,WK}})();
window.MEDAL=MEDAL;
