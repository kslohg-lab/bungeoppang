/* ===== ✨ 손맛: 꽃가루 · 버튼 말랑 · 창 부드럽게 열기 · 숫자 또르륵 — 챌린지·가게 공용 =====
   JUICE.confetti(n)  JUICE.count(el, from, to, fmt)  JUICE.burst(x,y,emoji) */
const JUICE=(()=>{
const st=document.createElement('style');
st.textContent=[
 /* 버튼: 누르면 살짝 눌리고(말랑) 놓으면 통 */
 'button,a.big,#bk{transition:transform .09s ease-out,box-shadow .09s ease-out}',
 'button:active,#bk:active{transform:translateY(3px) scale(.96)!important}',
 /* 창: 뒤가 어두워지며 카드가 톡 튀어나와요 */
 '.ov.sh{animation:jfade .18s ease-out}',
 '.ov.sh>.card{animation:jpop .26s cubic-bezier(.2,1.4,.45,1)}',
 '@keyframes jfade{from{opacity:0}}',
 '@keyframes jpop{from{opacity:0;transform:translateY(14px) scale(.92)}}',
 '#menu>.card{animation:jpop .3s cubic-bezier(.2,1.3,.45,1)}',
 /* 꽃가루 */
 '#jcf{position:absolute;inset:0;pointer-events:none;z-index:60}',
 '.jnum{display:inline-block;animation:jnum .35s ease-out}@keyframes jnum{30%{transform:scale(1.25)}}'].join('\n');
(document.head||document.documentElement).appendChild(st);
/* 버튼 누를 때: 작은 '톡' 소리 + 안드로이드 짧은 진동 */
addEventListener('pointerdown',e=>{const b=e.target&&e.target.closest&&e.target.closest('button,#bk');if(!b||b.disabled)return;if(window.AUDIO){AUDIO.sfx('ui');AUDIO.vib(8)}},{capture:true,passive:true});
/* ---------- 꽃가루 ---------- */
let cv=null,cx=null,P=[],raf=0;
const COL=['#ff6a5a','#ffc94a','#5ad07a','#5ab4ff','#c07aff','#ff9ad0'];
function host(){return document.getElementById('box')||document.body}
function confetti(n=90){const h=host();if(!cv){cv=document.createElement('canvas');cv.id='jcf';cv.width=450;cv.height=800}if(cv.parentNode!==h)h.appendChild(cv);cx=cv.getContext('2d');
 for(let i=0;i<n;i++){const L=i%2;P.push({x:L?-10:460,y:520+Math.random()*120,vx:(L?1:-1)*(160+Math.random()*260),vy:-(420+Math.random()*380),r:Math.random()*6.28,vr:(Math.random()-.5)*14,w:6+Math.random()*6,h:9+Math.random()*7,c:COL[i%COL.length],l:2.2+Math.random()*.8})}
 if(!raf){let last=performance.now();const step=t=>{const dt=Math.min(.05,(t-last)/1000);last=t;cx.clearRect(0,0,450,800);
  for(const p of P){p.vy+=620*dt;p.vx*=.985;p.vy=Math.min(p.vy,260);p.x+=p.vx*dt;p.y+=p.vy*dt;p.r+=p.vr*dt;p.l-=dt;cx.save();cx.globalAlpha=Math.min(1,p.l*1.5);cx.translate(p.x,p.y);cx.rotate(p.r);cx.fillStyle=p.c;cx.fillRect(-p.w/2,-p.h/2*Math.abs(Math.cos(p.r*1.7)),p.w,p.h*Math.abs(Math.cos(p.r*1.7))+1);cx.restore()}
  P=P.filter(p=>p.l>0&&p.y<860);if(P.length)raf=requestAnimationFrame(step);else{raf=0;cx.clearRect(0,0,450,800)}};raf=requestAnimationFrame(step)}}
/* ---------- 이모지 팡 (화면 좌표, 450×800 기준) ---------- */
function burst(x,y,e='✨',n=8){const h=host();for(let i=0;i<n;i++){const d=document.createElement('div'),a=i/n*6.28+Math.random()*.5,r=50+Math.random()*40;d.textContent=e;d.style.cssText='position:absolute;left:'+x+'px;top:'+y+'px;font-size:'+(18+Math.random()*12)+'px;pointer-events:none;z-index:61;transform:translate(-50%,-50%);transition:transform .6s cubic-bezier(.2,.8,.3,1),opacity .6s';h.appendChild(d);
 requestAnimationFrame(()=>{d.style.transform='translate(calc(-50% + '+Math.cos(a)*r+'px),calc(-50% + '+Math.sin(a)*r+'px)) scale(.6)';d.style.opacity='0'});setTimeout(()=>d.remove(),650)}}
/* ---------- 숫자 또르륵 ---------- */
function count(el,from,to,fmt,ms=600){if(!el)return;fmt=fmt||(v=>String(v));if(from===to||!isFinite(from)){el.textContent=fmt(to);return}const t0=performance.now();el.classList.remove('jnum');void el.offsetWidth;el.classList.add('jnum');
 const k=()=>{const u=Math.min(1,(performance.now()-t0)/ms),e=1-Math.pow(1-u,3);el.textContent=fmt(Math.round(from+(to-from)*e));if(u<1)requestAnimationFrame(k)};requestAnimationFrame(k)}
return{confetti,burst,count}})();
window.JUICE=JUICE;
