/* ===== 🏅 메달: 챌린지에서 모으고, 가게 '메달 스킨'에만 써요 — 챌린지·가게 공용 =====
   저장: localStorage bpMedal = {n:가진 메달, w:{주번호:[받은 단계…]}, t:모은 합계}
   참여 보상(이번 주 판, 2966주=11/2부터): 10·20·30·40단계 +5 · 50단계 +10 · 60단계(완주) +20 → 한 주 최대 50
   (등수 보상은 11/9부터, 숨김 목록과 함께) */
const MEDAL=(()=>{
const KEY='bpMedal',WK=2966,MS=[[10,5],[20,5],[30,5],[40,5],[50,10],[60,20]],MS6=[[10,5],[20,10],[30,15],[40,20]],WK6=2967,msOf=w=>(w|0)>=WK6?MS6:MS; /* 2967주(11/9)부터 40단계: 10 +5 · 20 +10 · 30 +15 · 40 완주 +20 (한 주 최대 50 그대로) */
const load=()=>{let v=null;try{v=JSON.parse(localStorage.getItem(KEY))}catch(e){}if(!v||typeof v!=='object')v={};v.n=v.n|0;v.t=v.t|0;if(!v.w||typeof v.w!=='object')v.w={};return v};
const save=v=>{try{localStorage.setItem(KEY,JSON.stringify(v))}catch(e){}};
/* 지난 주 기록은 4주만 남겨요 */
function trim(v,wid){for(const k in v.w)if(+k<wid-4)delete v.w[k]}
/* 이번 주 도달 단계로 받을 수 있는 메달을 받아요 → [{st,n}] */
function claim(wid,stage){wid=wid|0;stage=stage|0;if(wid<WK||stage<10)return[];const v=load(),got=v.w[wid]||[],out=[];
 for(const [st,n] of msOf(wid))if(stage>=st&&!got.includes(st)){got.push(st);v.n+=n;v.t+=n;out.push({st,n})}
 if(out.length){v.w[wid]=got;trim(v,wid);save(v)}return out}
/* 다음 목표: {st,n} 또는 null */
function next(wid,stage){const got=(load().w[wid|0])||[];for(const [st,n] of msOf(wid))if(stage<st&&!got.includes(st))return{st,n};return null}
/* 🏆 지난 주 등수 보상: 1위 50 · 2~3위 30 · 4~10위 20 · 11~30위 10 · 31위부터 참가상 5 (주마다 한 번, 2965주부터) */
const RK=r=>!(r>=1)?0:r===1?50:r<=3?30:r<=10?20:r<=30?10:5;
const rankPaid=w=>{const v=load();return!!(v.r&&v.r[w])};
function payRank(w,rank){const v=load();if(!v.r||typeof v.r!=='object')v.r={};if(v.r[w])return 0;const n=RK(rank);v.r[w]=rank||-1;for(const k in v.r)if(+k<w-8)delete v.r[k];if(n){v.n+=n;v.t+=n}save(v);return n}
/* 출석 선물 등으로 메달 받기 (합계 t에도 더해요) */
function add(n){n|=0;if(n<=0)return;const v=load();v.n+=n;v.t+=n;save(v)}
function spend(n){const v=load();if(v.n<n)return false;v.n-=n;save(v);return true}
return{get:()=>load(),claim,next,spend,add,MS,msOf,WK,RWK:2965,RK,rankPaid,payRank}})();
window.MEDAL=MEDAL;
