/* ===== 화면·저장·조작 (규칙은 위의 BP2에서만 계산) ===== */
(()=>{
if(typeof CanvasRenderingContext2D!=='undefined'&&!CanvasRenderingContext2D.prototype.roundRect)CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){r=Math.min(r||0,w/2,h/2);this.moveTo(x+r,y);this.arcTo(x+w,y,x+w,y+h,r);this.arcTo(x+w,y+h,x,y+h,r);this.arcTo(x,y+h,x,y,r);this.arcTo(x,y,x+w,y,r);this.closePath()};
const B=BP2,R=B.R,W=450,H=800,$=id=>document.getElementById(id),cv=$('cv'),cx=cv.getContext('2d'),fmt=B.fmt,KEY='bungeoppang2Pub1',VER='0.1';
let save={};try{save=JSON.parse(localStorage.getItem(KEY))||{}}catch(e){}
save=Object.assign({nick:'',sub:{id:0,stage:0,net:0},snd:true,runs:0,clears:0,best:{stage:0,net:0},week:{id:0,stage:0,net:0},free:{stage:0,net:0},run:null},save);
const store=()=>{try{localStorage.setItem(KEY,JSON.stringify(save))}catch(e){}};
const wid=()=>B.weekId(Date.now()),weekSeed=()=>B.weekSeed(wid());
let run=null,s=null,scr='menu',paused=false,acc=0,last=0,ui={ft:[],pa:[],rb:0};
const MODE=m=>m==='week'?'이번 주 판':'연습 판';

/* ---------- 소리 ---------- */
let AC;const au=()=>{if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}}if(AC&&AC.state==='suspended')AC.resume();return AC};
function tone(f,d,ty='sine',v=.14,t0=0,f2){if(!save.snd)return;const a=au();if(!a)return;const o=a.createOscillator(),g=a.createGain(),t=a.currentTime+t0;o.type=ty;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+d)}
const SND={tap(){tone(500,.08,'triangle',.1)},pour(){tone(300,.18,'sine',.12,0,180)},flip(){tone(700,.1,'square',.07,0,1000)},coin(){tone(988,.1,'triangle',.12);tone(1319,.2,'triangle',.12,.08)},perf(){[784,988,1319].forEach((f,i)=>tone(f,.16,'triangle',.12,i*.07))},burn(){tone(160,.4,'sawtooth',.16,0,60)},angry(){tone(220,.3,'square',.1,0,110)},ready(){tone(1200,.08,'sine',.07)},win(){[523,659,784,1047].forEach((f,i)=>tone(f,.25,'triangle',.14,i*.13))},no(){tone(200,.12,'square',.08)}};
const snd=k=>{try{SND[k]&&SND[k]()}catch(e){}};

/* ---------- 화면 전환 ---------- */
const show=n=>{['menu','shop','over','pause','set','how','nick','lb'].forEach(i=>$(i).style.display=i===n?'block':'none');$('home').style.display=scr==='game'?'block':'none'};
function toast(t){const e=$('toast');e.textContent=t;e.style.opacity=1;clearTimeout(toast.h);toast.h=setTimeout(()=>e.style.opacity=0,1700)}
function ask(btn,label,fn){if(btn.dataset.a!=='1'){btn.dataset.a='1';btn.dataset.o=btn.textContent;btn.textContent=label;setTimeout(()=>{if(btn.dataset.a==='1'){btn.dataset.a='0';btn.textContent=btn.dataset.o}},3000)}else{btn.dataset.a='0';btn.textContent=btn.dataset.o;fn()}}
const esc=t=>String(t).replace(/[<>&"]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]));
function renderMenu(){
 const sr=save.run,wk=save.week.id===wid()?save.week:{stage:0,net:0};
 $('mw').innerHTML='<span class="pill">🙂 '+esc(save.nick)+'</span><span class="pill">🏅 이번 주 '+wk.stage+'단계</span>';$('ver').textContent='시험판 v'+VER+' · 이번 주 판 #'+wid();
 $('mi').innerHTML='컷트라인을 못 넘으면 탈락!<br>몇 단계까지 갈 수 있을까요? (최고 '+R.maxStage+'단계 완주)<br>⭐ 이번 주 판은 모두 같은 손님! 순위표에서 겨뤄요';
 if(sr&&sr.run&&!sr.run.over){$('m1').textContent='▶ 이어서 하기 · '+sr.run.day+'일차 ('+MODE(sr.run.mode)+')';$('m5').style.display='block';$('m5').textContent='🆕 이번 주 판 새로 시작'}
 else{$('m1').textContent='▶ 이번 주 판 시작';$('m5').style.display='none'}
 $('m2').textContent='🎲 연습 판 (랜덤 손님)'}
function toMenu(){scr='menu';s=null;paused=false;renderMenu();show('menu')}

/* ---------- 판 · 하루 흐름 ---------- */
function startRun(mode){au();run=B.newRun(mode==='week'?weekSeed():(Math.random()*4294967296)>>>0,mode);run.wid=wid();save.runs++;save.run={run};store();startDay()}
function startDay(){s=B.newDay(run);ui={ft:[],pa:[],rb:0};scr='game';paused=false;acc=0;last=0;show('none')}
/* ---------- 순위표 보내기 ---------- */
const LB=()=>window.LB&&!window.LB.off?window.LB:null;
function submit(withProof){if(!run||run.mode!=='week'||run.wid!==wid()||!save.nick||run.stage<1)return;const lb=LB();if(!lb)return;
 const st=run.stage,net=run.tot,sb=save.sub;if(sb.id===run.wid&&(st<sb.stage||(st===sb.stage&&net<=sb.net)))return;
 lb.submit({w:run.wid,n:save.nick,st,net,lg:withProof?run.lg:null}).then(ok=>{if(ok){save.sub={id:run.wid,stage:st,net};store()}})}
function record(){const st=run.stage,net=run.tot,m=run.mode,gt=(a,b)=>st>a.stage||(st===a.stage&&net>a.net);
 if(gt(save.best,0)){save.best={stage:st,net}}
 if(m==='week'){if(save.week.id!==run.wid)save.week={id:run.wid,stage:0,net:0};if(gt(save.week,0))save.week={id:run.wid,stage:st,net}}
 else if(gt(save.free,0))save.free={stage:st,net};
 if(run.clear)save.clears++;submit(true)}
function finishDay(){const res=B.dayResult(s,run),kind=B.endDay(run,res);
 if(kind==='pass'||kind==='revive'){save.run={run};store();if(kind==='pass'&&run.stage%5===0)submit(true);goShop(res,kind)}
 else{record();save.run=null;store();goOver(res,kind)}}
function sumHtml(res,kind){let h=(kind==='revive'?'🎫 <b>부활권을 썼어요!</b> 같은 날을 한 번 더 해요<br>':'')+'💰 순수익 <b>'+fmt(res.net)+'원</b> / 컷트라인 '+fmt(res.cut)+(res.pass?' ✅':' ❌')+'<br>🐾 손님 '+res.served+'명 · 😡 놓침 '+res.lost+' · ✨ 완벽 '+res.perf+' · 😵 태움 '+res.burnt+' · 🔥 콤보 '+res.bc;return h}
function goShop(res,kind){scr='shop';$('st').textContent=kind==='revive'?'🎫 한 번 더!':'🌙 '+(run.day-1)+'단계 통과!';$('ss').innerHTML=sumHtml(res,kind);renderShop();
 const ev=B.evOf(run.day),c=B.cutline(run.day);$('s1').textContent=(kind==='revive'?'▶ '+run.day+'일차 다시 시작':'▶ '+run.day+'일차 시작')+' (컷트라인 '+fmt(c)+')';show('shop')}
function renderShop(){
 $('sw').innerHTML='<span class="pill">🪙 '+fmt(run.coins)+'</span><span class="pill">'+(B.evOf(run.day)?R.ev[B.evOf(run.day)].e+' '+run.day+'일차 '+R.ev[B.evOf(run.day)].n:'📅 '+run.day+'일차')+'</span>';
 const L=$('shl');L.innerHTML='';
 const row=(e,n,d,label,can,fn)=>{const r=document.createElement('div');r.className='it';r.innerHTML='<b>'+e+'</b><div><span>'+n+'</span><br>'+d+'</div>';const b=document.createElement('button');b.textContent=label;if(!can)b.className='no';b.onclick=fn;r.appendChild(b);L.appendChild(r)};
 const buyK=k=>{if(!B.buy(run,k)){toast('코인이 부족해요!');snd('no');return}save.run={run};store();snd('win');renderShop()};
 const D={
  fl:()=>{const m=R.menu[run.nf];return['🆕','새 메뉴',m.e+' '+m.n+' · 판매가 '+fmt(m.p)+'원 (더 비싸고 더 어려워요)']},
  mold:()=>['🔥','틀 늘리기','틀 '+B.nMold(run)+'개 → '+(B.nMold(run)+1)+'개'],
  speed:()=>['⏱️','불 조절','굽는 시간 -6% (지금 -'+6*run.up.speed+'%)'],
  auto:()=>['🤖','자동 반죽기','빈 틀을 한 번 톡! 하면 반죽+속+덮기'],
  pat:()=>['💬','친절 교육','손님 참을성 +8% (지금 +'+8*run.up.pat+'%)'],
  deco:()=>['🏮','가게 간판','손님이 +6% 더 와요 (지금 +'+6*run.up.deco+'%)'],
  loc:()=>{const n=R.loc[run.up.loc+1];return['🗺️','장사 터',n.e+' '+n.n+' · 가격 ×'+n.pm+' · 손님 +'+Math.round((n.sp-1)*100)+'%']}};
 ['fl','mold','speed','auto','pat','deco','loc'].forEach(k=>{const c=B.upCost(run,k);
  if(c==null){const nm=k==='fl'?'새 메뉴':R.up[k].n;row(k==='fl'?'🆕':R.up[k].e,nm,'모두 열었어요!','완료 ✅',false,()=>{});return}
  const d=D[k]();row(d[0],d[1],d[2],fmt(c)+'🪙',run.coins>=c,()=>buyK(k))});
 const tc=B.ticketCost(run);
 if(run.ticket)row('🎫','부활권','탈락할 때 같은 날을 한 번 더 해요','보유 ✅',false,()=>{});
 else row('🎫','부활권 (한 판에 한 번)','컷트라인에 못 미쳐도 같은 날을 한 번 더 해요',fmt(tc)+'🪙',run.coins>=tc,()=>{if(!B.buyTicket(run)){toast('코인이 부족해요!');snd('no');return}save.run={run};store();snd('win');renderShop()})}
function goOver(res,kind){scr='over';const st=run.stage;$('ot').textContent=run.clear?'🎉 '+R.maxStage+'단계 완주!':(run.giveUp?'🏳️ 포기했어요':'💥 '+(st+1)+'일차에서 탈락');
 let h=run.clear?'모든 단계를 통과했어요!':(run.giveUp?'':sumHtml(res,kind)+'<br>');
 h+='<br>🏅 도달 단계 <b>'+st+'</b> · 누적 순수익 '+fmt(run.tot)+'원<br>('+MODE(run.mode)+')';
 const w=save.week.id===run.wid?save.week:null;if(run.mode==='week'&&w)h+='<br>이번 주 내 최고 <b>'+w.stage+'단계</b>';
 $('obd').innerHTML=h;$('o1').textContent=run.mode==='week'?'🔁 이번 주 판 다시 도전':'🎲 연습 판 다시';show('over')}
function giveUp(){if(!run||run.over)return;run.over=true;run.giveUp=true;record();save.run=null;store();paused=false;$('pause').style.display='none';goOver(null,'over')}

/* ---------- 연결: 버튼 ---------- */
$('m1').onclick=()=>{au();const sr=save.run;if(sr&&sr.run&&!sr.run.over){run=sr.run;startDay()}else startRun('week')};
$('m5').onclick=()=>ask($('m5'),'⚠️ 지금 판이 사라져요. 한 번 더!',()=>startRun('week'));
$('m2').onclick=()=>{const sr=save.run;if(sr&&sr.run&&!sr.run.over)ask($('m2'),'⚠️ 지금 판이 사라져요. 한 번 더!',()=>startRun('free'));else startRun('free')};
function renderHow(){const wk=save.week.id===wid()?save.week:{stage:0,net:0};
 $('hw').innerHTML='<p class="ht"><b>🏅 내 기록</b></p><div class="sum">이번 주 판: <b>'+wk.stage+'단계</b> ('+fmt(wk.net)+'원)<br>연습 판 최고: <b>'+save.free.stage+'단계</b><br>전체 최고: <b>'+save.best.stage+'단계</b> · 도전 '+save.runs+'번 · 완주 '+save.clears+'번</div>'+
 '<p class="ht"><b>📖 이렇게 해요</b></p><div class="sum">• 하루는 90초! 번 돈이 <b>컷트라인</b>을 넘어야 다음 단계로 가요. 못 넘으면 끝!<br>• 빈 틀을 톡 → 속 넣기 → 덮개 톡 → 앞면 굽기 → 뒤집기 → 꺼내기. 노란 구간에 누르면 <b>완벽 ✨</b><br>• 손님을 톡 하면 완성된 붕어빵을 줘요. 평론가🎩는 ✨만 받아요.<br>• 번 돈으로 <b>새 메뉴</b>와 업그레이드를 사요. 비싼 메뉴는 많이 벌지만 굽기가 어려워요. 팥만으로는 어느 단계부터 컷트라인을 못 넘어요!<br>• 🎫 부활권은 한 판에 한 번, 탈락한 날을 다시 해 볼 수 있어요.<br>• 이번 주 판은 모두 같은 손님·날씨·이벤트로 겨뤄요. 🏆 순위표에서 친구들과 비교해요 (월요일 0시에 새로 시작).</div>'}
$('m4').onclick=()=>{au();renderHow();show('how')};$('hx').onclick=()=>show('menu');
$('m6').onclick=()=>{au();openLb(0)};$('m7').onclick=share;
$('m3').onclick=()=>{au();$('sn').textContent=save.snd?'🔊 소리 켜짐':'🔇 소리 꺼짐';$('sk').textContent='✏️ 닉네임 바꾸기 ('+save.nick+')';$('rs').textContent='🗑️ 기록·저장 지우기';show('set')};
$('sk').onclick=()=>openNick(false);
$('sn').onclick=()=>{save.snd=!save.snd;store();$('sn').textContent=save.snd?'🔊 소리 켜짐':'🔇 소리 꺼짐'};
$('sc').onclick=()=>show('menu');
$('rs').onclick=()=>ask($('rs'),'⚠️ 정말 지울까요? 한 번 더!',()=>{save={snd:save.snd,runs:0,clears:0,best:{stage:0,net:0},week:{id:0,stage:0,net:0},free:{stage:0,net:0},run:null};store();renderMenu();toast('모두 지웠어요')});
$('s1').onclick=()=>{au();startDay()};
$('o4').onclick=()=>openLb(0);$('o1').onclick=()=>{startRun(run&&run.mode==='free'?'free':'week')};$('o3').onclick=toMenu;
/* ---------- 닉네임 ---------- */
let nickFrom=null;
function cleanNick(t){return String(t).replace(/[\u0000-\u001f\u007f<>&"\\]/g,'').replace(/\s+/g,' ').trim().slice(0,10)}
function openNick(first){nickFrom=first?'first':scr==='over'?'over':'menu';$('nkx').style.display=first?'none':'block';$('nkh').textContent=first?'처음이네요! 순위표에 보일 이름을 정해요':'닉네임 바꾸기';
 $('nki').value=save.nick||'붕어빵'+(10+Math.floor(Math.random()*90));$('nke').textContent='';show('nick');setTimeout(()=>{try{$('nki').focus();$('nki').select()}catch(e){}},50)}
$('nk1').onclick=()=>{const n=cleanNick($('nki').value);if(n.length<1){$('nke').textContent='한 글자 이상 써 주세요';return}
 const ch=n!==save.nick;save.nick=n;store();
 const lb=LB();if(ch&&lb&&save.sub.id===wid())lb.submit({w:save.sub.id,n,st:save.sub.stage,net:save.sub.net,lg:null});
 toMenu();if(ch)toast('닉네임: '+n)};
$('nki').addEventListener('keydown',e=>{if(e.key==='Enter')$('nk1').click()});
$('nkx').onclick=()=>toMenu();
/* ---------- 순위표 ---------- */
let lbWk=0,lbBusy=false;
function openLb(wk){lbWk=wk;show('lb');renderLb()}
async function renderLb(){const L=$('lbl'),w=wid()-lbWk;$('lbt0').className='tab'+(lbWk===0?' on':'');$('lbt1').className='tab'+(lbWk===1?' on':'');
 $('lbh').textContent=lbWk===0?'이번 주 판 #'+w+' · 월요일 0시에 새로 시작':'지난 주 판 #'+w+' 최종 순위';
 const lb=LB();if(!lb){L.innerHTML='<p class="ht">순위표를 아직 연결하지 않았어요.<br>(firebase-config.js 설정 후 열려요)</p>';return}
 L.innerHTML='<p class="ht">불러오는 중…</p>';if(lbBusy)return;lbBusy=true;
 let rows=null;try{rows=await lb.top(w)}catch(e){rows=null}lbBusy=false;if(scr==='game')return;
 if(w!==wid()-lbWk)return;
 if(!rows){L.innerHTML='<p class="ht">불러오지 못했어요. 잠시 뒤에 다시 눌러 주세요.</p>';return}
 if(!rows.length){L.innerHTML='<p class="ht">'+(lbWk===0?'아직 아무도 없어요. 첫 번째 주인공이 되어 보세요! 🏆':'지난 주 기록이 없어요.')+'</p>';return}
 const me=lb.uid;L.innerHTML='';
 rows.forEach((r,i)=>{const d=document.createElement('div');d.className='lr'+(r.u===me?' me':'');
  d.innerHTML='<b>'+(i<3?['🥇','🥈','🥉'][i]:(i+1))+'</b><span class="ln"></span><span class="ls"><i>'+r.st+'단계</i><small>'+fmt(r.net)+'원</small></span>';
  d.querySelector('.ln').textContent=r.n;L.appendChild(d)});
 const f=document.createElement('p');f.className='ht';f.style.textAlign='center';f.textContent=(rows.length>=30?'위쪽 30명만 보여요 · ':rows.length+'명 · ')+'같은 단계면 번 돈이 많은 순서';L.appendChild(f)}
$('lbt0').onclick=()=>openLb(0);$('lbt1').onclick=()=>openLb(1);$('lbr').onclick=()=>{const lb=LB();if(lb&&lb.bust)lb.bust();renderLb()};$('lbx').onclick=()=>{if(scr==='over')show('over');else show('menu')};
/* ---------- 공유 ---------- */
function share(){const wk=save.week.id===wid()?save.week:{stage:0};const url=location.origin+location.pathname;
 const txt='🐟 붕어빵 서바이벌 — 이번 주 '+(wk.stage?wk.stage+'단계까지 갔어요! 내 기록을 넘어 봐 😎':'같이 도전해요! 누가 제일 멀리 가는지 겨뤄요 🏆');
 if(navigator.share){navigator.share({title:'붕어빵 서바이벌',text:txt,url}).catch(()=>{});return}
 const full=txt+'\n'+url;const done=()=>toast('복사했어요! 카톡에 붙여넣기 하세요');
 try{navigator.clipboard.writeText(full).then(done,()=>fb())}catch(e){fb()}
 function fb(){const t=document.createElement('textarea');t.value=full;t.style.cssText='position:fixed;opacity:0;left:0;top:0';document.body.appendChild(t);t.select();try{document.execCommand('copy');done()}catch(e){toast(full)}t.remove()}}
function pauseGame(){if(scr!=='game'||!s||paused||s.ph!=='play')return;paused=true;$('pause').style.display='block'}
function resumeGame(){if(!paused)return;paused=false;$('pause').style.display='none';last=0}
$('home').onclick=pauseGame;$('p1').onclick=resumeGame;$('p2').onclick=()=>ask($('p2'),'⚠️ 판이 끝나요. 한 번 더!',giveUp);

/* ---------- 조작 ---------- */
const mpos=i=>({x:15+(i%2)*215,y:400+(i>>1)*95});
cv.addEventListener('pointerdown',e=>{e.preventDefault();au();if(scr!=='game'||paused||!s||s.ph!=='play')return;const r=cv.getBoundingClientRect();tap((e.clientX-r.left)/r.width*W,(e.clientY-r.top)/r.height*H)});
cv.addEventListener('contextmenu',e=>e.preventDefault());
function tap(x,y){
 if(y>=64&&y<330){B.serve(s,run,Math.max(0,Math.min(2,Math.floor(x/150))));drain();return}
 if(y>=400&&y<686){const rw=Math.floor((y-400)/95),i=rw*2+(x<225?0:1);if(rw<3&&i<B.nMold(run))B.moldTap(s,run,i);drain();return}
 if(y>=698){const n=run.nf;B.selFl(s,run,Math.max(0,Math.min(n-1,Math.floor(x/(W/n)))));drain()}}
function at(f){return f.a==='m'?{x:mpos(f.i).x+72,y:mpos(f.i).y+6}:{x:f.i*150+75,y:200-(f.dy||0)}}
function drain(){const q=s.fx;s.fx=[];for(const f of q){
 if(f.k==='snd')snd(f.n);else if(f.k==='toast')toast(f.t);else if(f.k==='rush')ui.rb=2.2;
 else if(f.k==='ft'){const p=at(f);ui.ft.push({t:f.t,x:p.x,y:p.y,c:f.c,l:1.1})}
 else if(f.k==='pf'){if(ui.pa.length>40)continue;const p=at(f);for(let i=0;i<f.n;i++)ui.pa.push({e:f.e,x:p.x+(Math.random()*24-12),y:p.y+24,vx:Math.random()*80-40,vy:-40-Math.random()*70,l:.5+Math.random()*.4,s:18+Math.random()*10})}}}

/* ---------- 그리기 ---------- */
const E='"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
const EC={};function spr(e,z){const k=e+z;let c=EC[k];if(!c){c=document.createElement('canvas');c.width=c.height=Math.ceil(z*1.4);const x=c.getContext('2d');x.font=z+'px '+E;x.textAlign='center';x.textBaseline='middle';x.fillText(e,c.width/2,c.height/2);EC[k]=c}return c}
function em(e,x,y,z,a=1){z=Math.round(z);const c=spr(e,z);cx.globalAlpha=a;cx.drawImage(c,x-c.width/2,y-c.height/2);cx.globalAlpha=1}
function tx(t,x,y,z,c='#fff',al='center',o='#7a4a22'){cx.font='bold '+z+'px "Jua","Noto Sans KR","Malgun Gothic",sans-serif';cx.textAlign=al;cx.textBaseline='middle';cx.lineWidth=z/5;cx.strokeStyle=o;cx.lineJoin='round';cx.strokeText(t,x,y);cx.fillStyle=c;cx.fillText(t,x,y)}
function rr(x,y,w,h,r,f){cx.beginPath();cx.roundRect(x,y,Math.max(0,w),h,r);cx.fillStyle=f;cx.fill()}
const BST=[[0,[247,232,196]],[.5,[240,205,130]],[.85,[232,170,70]],[1,[222,140,40]],[1.15,[190,100,30]],[1.3,[130,66,24]],[1.5,[40,26,20]]];
function bakeCol(p){p=Math.max(0,Math.min(1.5,p));for(let i=1;i<BST.length;i++)if(p<=BST[i][0]){const a=BST[i-1],b=BST[i],t=(p-a[0])/(b[0]-a[0]);return'rgb('+a[1].map((v,k)=>Math.round(v+(b[1][k]-v)*t)).join(',')+')'}return'rgb(40,26,20)'}
function fish(x,y,z,col,rim='#7a4a22'){cx.save();cx.translate(x,y);cx.scale(z,z);cx.lineWidth=3;cx.strokeStyle=rim;cx.fillStyle=col;
 cx.beginPath();cx.moveTo(34,0);cx.lineTo(56,-17);cx.lineTo(56,17);cx.closePath();cx.fill();cx.stroke();
 cx.beginPath();cx.ellipse(0,0,40,21,0,0,7);cx.fill();cx.stroke();
 cx.lineWidth=1.6;cx.strokeStyle='rgba(0,0,0,.22)';cx.beginPath();for(let i=0;i<3;i++){cx.moveTo(2+i*11+5,-8);cx.arc(2+i*11,0,8,-1.1,1.1)}cx.stroke();
 cx.fillStyle='#3a2a1a';cx.beginPath();cx.arc(-24,-6,3.4,0,7);cx.fill();cx.restore()}
function mold(i){const X=mpos(i).x,Y=mpos(i).y;
 if(i>=B.nMold(run)){rr(X,Y,205,88,18,'rgba(60,40,30,.35)');em('🔒',X+102,Y+44,34,.8);return}
 const m=s.mold[i],ox=m.sh>0?Math.sin(s.t*70)*3:0,fx=X+72+ox,fy=Y+34;
 rr(X,Y,205,88,18,'#5a4638');rr(X+4,Y+4,197,80,15,'#3f3029');let lab='',lc='#fff';
 if(m.s===0){fish(fx,fy,.95,'#2c211c','#6a5547');lab='빈 틀';if(s.d<=2)tx('톡!',fx,fy,22)}
 else if(m.s===1){fish(fx,fy,.95,'#ffe9a8');lab='속 넣기'}
 else if(m.s===2){fish(fx,fy,.95,'#ffe9a8');cx.fillStyle=R.menu[m.f].col;cx.beginPath();cx.ellipse(fx-6,fy,16,9,0,0,7);cx.fill();lab='덮개 톡!'}
 else if(m.s===5){fish(fx,fy,.95,'#2a1a12','#000');em('💨',fx,fy-26,30);lab='치우기'}
 else{const M=R.menu[m.f];fish(fx,fy,.95,bakeCol(m.p));em(M.e,X+22,Y+22,22);const rd=m.p>=.85;lab=m.s===3?(rd?'뒤집어!':'앞면 굽는 중'):(rd?'꺼내!':'뒷면 굽는 중');
  if(rd&&m.p<M.bad&&Math.floor(s.t*6)%2)lc='#ffe066';if(m.p>=M.bad)lc='#ff8a80';
  const gx=X+14,gw=177,gy=Y+68,mx=M.burn,Z=[[0,.85,'#8a7a6a'],[.85,1-M.w,'#7ed88a'],[1-M.w,1+M.w,'#ffd23a'],[1+M.w,M.bad,'#7ed88a'],[M.bad,mx,'#e0503a']];
  for(const z of Z){cx.fillStyle=z[2];cx.fillRect(gx+gw*z[0]/mx,gy,gw*(z[1]-z[0])/mx,10)}rr(gx+gw*Math.min(m.p,mx)/mx-2,gy-3,4,16,2,'#fff')}
 tx(lab,X+150,Y+26,m.s>=3?17:19,lc,'center','#2a1a12');if(m.s===1||m.s===2)em(R.menu[s.sel].e,X+172,Y+54,24,m.s===1?.6:0)}
function custDraw(c,i){const x0=i*150;rr(x0+8,70,134,250,18,'rgba(255,255,255,.35)');if(!c)return;
 const a=Math.min(1,c.in)*(c.leave>0?Math.max(0,c.leave/.8):1),ox=c.sh>0?Math.sin(s.t*70)*3:0;cx.globalAlpha=a;
 const L=[];for(let f=0;f<6;f++)if(c.ord[f]>0)L.push(f);const hb=14+24*L.length;
 rr(x0+14,78,122,hb,14,'#fff');cx.beginPath();cx.moveTo(x0+62,78+hb);cx.lineTo(x0+75,78+hb+12);cx.lineTo(x0+88,78+hb);cx.closePath();cx.fillStyle='#fff';cx.fill();
 if(c.ty==='critic')tx('✨만!',x0+112,78+hb-9,13,'#c0392b','center','#fff');
 L.slice(0,6).forEach((f,k)=>{const rm=c.ord[f]-c.got[f],y=78+19+k*24;if(rm>0){em(R.menu[f].e,x0+44,y,22);tx('×'+rm,x0+90,y,22,'#6a3a1a','center','#fff')}else{em('✅',x0+44,y,20,.7)}});
 const ay=262;em(c.an,x0+75+ox,ay,64);
 const bd={vip:'👑',reg:'⭐',hurry:'⏱️',group:'🚌',critic:'🎩'}[c.ty];if(bd)em(bd,x0+36,ay-28,24);
 const r=c.pat/c.max;if(c.angry)em('😡',x0+112,ay-22,26);else if(c.happy)em('😊',x0+112,ay-22,26);else if(r<.3)em('💢',x0+112,ay-22,24);
 rr(x0+20,303,110,9,4,'rgba(0,0,0,.25)');rr(x0+20,303,110*Math.max(0,r),9,4,r>.5?'#7ed88a':r>.25?'#ffd23a':'#ff6a5a');cx.globalAlpha=1}
const m2=(a,n)=>((a%n)+n)%n;
function draw(){cx.save();const lc=B.L(run);
 cx.fillStyle='#ffe0b5';cx.fillRect(0,0,W,H);cx.fillStyle=lc.wall;cx.fillRect(0,64,W,258);
 for(let i=0;i<15;i++){cx.fillStyle=i%2?'#fff':'#e8584a';cx.fillRect(i*30,62,30,12)}
 cx.fillStyle='#c9935f';cx.fillRect(0,322,W,78);cx.fillStyle='#a4703f';cx.fillRect(0,322,W,8);cx.fillStyle='#6b5344';cx.fillRect(0,396,W,310);
 rr(0,0,W,58,0,'#8a5a3a');tx(s.d+'일차 '+s.wea.e,50,22,24,'#fff','left');
 const dc=['','🏮','🏮⛱️','🏮⛱️✨'][run.up.deco];tx(lc.e+(dc||''),170,22,18,'#fff','left');
 tx('🪙 '+fmt(run.coins+s.net),385,22,22,'#ffe9a0','right');
 const gr=Math.max(0,Math.min(1.25,s.net/s.cut));rr(128,36,258,12,6,'rgba(0,0,0,.35)');rr(128,36,258*gr/1.25,12,6,gr>=1?'#ffd23a':'#7ed88a');rr(128+258/1.25-1.5,34,3,16,1,'#fff');tx('컷트라인 '+fmt(s.cut),122,43,13,'#fff','right');
 const tr=Math.max(0,1-s.t/R.len);rr(0,58,W,5,0,'rgba(0,0,0,.2)');rr(0,58,W*tr,5,0,s.rushed?'#ff6a5a':'#7ec8ff');
 s.cust.forEach((c,i)=>custDraw(c,i));
 if(s.combo>=2)tx('🔥 콤보 ×'+s.combo+' (+'+Math.round(Math.min(.5,s.combo*.05)*100)+'%)',225,311,18,'#fff0a0','center','#a4401f');
 tx('접시',26,342,14,'#fff','center','#7a4a22');const nf=run.nf,rw=(W-50)/nf;
 for(let f=0;f<nf;f++){const ps=s.rack.filter(r=>r.f===f&&r.q==='p').length,gd=s.rack.filter(r=>r.f===f&&r.q==='g').length,rx=48+f*rw+rw/2;
  em(R.menu[f].e,rx-rw/2+14,366,nf>4?18:22);tx('×'+(ps+gd),rx+(nf>4?6:4),366,nf>4?16:20,'#fff');if(ps)tx('✨'+ps,rx+rw/2-12,382,12,'#ffe066','center','#7a4a22')}
 for(let i=0;i<6;i++)mold(i);
 if(s.d<=2&&s.ph==='play'){let h='';const act=s.mold.slice(0,B.nMold(run));
  if(act.some(m=>(m.s===3||m.s===4)&&m.p>=.85&&m.p<R.menu[m.f].bad))h='✨ 노란 구간에 누르면 완벽!';
  else if(s.rack.length&&s.cust.some(c=>c))h='완성된 붕어빵은 손님을 톡! 해서 줘요';
  else if(act.some(m=>m.s===2))h='③ 덮개를 톡! 굽기 시작';
  else if(act.some(m=>m.s===1))h='② 아래에서 맛을 고르고 틀을 톡';
  else if(act.some(m=>m.s===0))h=run.up.auto?'빈 틀을 톡!':'① 빈 틀을 톡! 반죽을 부어요';
  if(h)tx(h,225,690,16,'#fff0c8','center','#4a3020')}
 {const n=nf,bw=(W-20-(n-1)*6)/n;for(let i=0;i<n;i++){const x=10+i*(bw+6),sel=s.sel===i,M=R.menu[i];rr(x,700,bw,88,16,sel?'#ffd76a':'#fff');if(sel){cx.lineWidth=4;cx.strokeStyle='#e8584a';cx.beginPath();cx.roundRect(x,700,bw,88,16);cx.stroke()}
  em(M.e,x+bw/2,722,n>4?26:30);tx(M.n,x+bw/2,748,n>4?12:14,'#5a3a22','center','#fff');tx(fmt(M.p),x+bw/2,768,n>4?12:14,'#5a3a22','center','#fff');tx('재료 '+fmt(M.c),x+bw/2,782,10,'#a4701f','center','#fff')}}
 if(s.wea.e==='🌧️'){cx.strokeStyle='rgba(120,160,220,.55)';cx.lineWidth=2;cx.beginPath();for(let i=0;i<24;i++){const x=m2(i*47-s.t*60,470)-10,y=m2(i*131+s.t*500,700)+64;cx.moveTo(x,y);cx.lineTo(x-4,y+14)}cx.stroke()}
 else if(s.wea.e==='❄️'){cx.fillStyle='rgba(255,255,255,.85)';for(let i=0;i<22;i++){const x=m2(i*53+Math.sin(s.t*2+i)*14,460),y=m2(i*97+s.t*70,700)+64;cx.beginPath();cx.arc(x,y,2.6,0,7);cx.fill()}}
 for(const q of ui.pa)em(q.e,q.x,q.y,q.s,Math.min(1,q.l*2));
 for(const q of ui.ft){cx.globalAlpha=Math.min(1,q.l*2);tx(q.t,q.x,q.y,22,q.c);cx.globalAlpha=1}
 if(s.ban>0){cx.globalAlpha=Math.min(1,s.ban);rr(40,330,370,120,24,'rgba(90,58,34,.85)');tx(s.d+'일차 시작! '+s.wea.e,225,362,30);tx(s.wea.n+' · 컷트라인 '+fmt(s.cut)+'원',225,400,19,'#ffe9a0');if(s.ev)tx(R.ev[s.ev].e+' '+R.ev[s.ev].n+' · '+R.ev[s.ev].d,225,428,15,'#ffe066');else tx(s.wea.sp>1?'손님이 많아요!':s.wea.sp<1?'손님이 적어요, 팁은 두둑해요':'평범한 하루',225,428,16,'#fff');cx.globalAlpha=1}
 if(ui.rb>0)tx('🔥 퇴근 시간 피크! 손님이 몰려와요',225,120,22,'#fff0a0','center','#c0392b');
 if(s.ph==='end')tx('🌙 영업 종료!',225,380,52,'#fff','center','#8a5a3a');
 cx.restore()}

/* ---------- 반복 ---------- */
function loop(ts){const dt=Math.min(.05,(ts-last)/1000||0);last=ts;
 if(s&&scr==='game'){if(!paused){acc+=dt;let n=0;while(acc>=B.DT&&n++<4){B.step(s,run,B.DT);acc-=B.DT;drain();if(s.done)break}
  for(const q of ui.ft){q.y-=40*dt;q.l-=dt}ui.ft=ui.ft.filter(q=>q.l>0);for(const q of ui.pa){q.x+=q.vx*dt;q.y+=q.vy*dt;q.vy+=200*dt;q.l-=dt}ui.pa=ui.pa.filter(q=>q.l>0);if(ui.rb>0)ui.rb-=dt;
  if(s.done){draw();finishDay();requestAnimationFrame(loop);return}}draw()}
 requestAnimationFrame(loop)}
function fit(){const b=document.body,sc=Math.min(b.clientWidth/W,b.clientHeight/H);$('box').style.transform='translate('+(b.clientWidth-W*sc)/2+'px,'+(b.clientHeight-H*sc)/2+'px) scale('+sc+')'}
addEventListener('resize',fit);addEventListener('orientationchange',()=>setTimeout(fit,200));
document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseGame();if(AC){if(document.hidden)AC.suspend();else AC.resume()}});
addEventListener('pagehide',pauseGame);
window.__bp2={save,B,get run(){return run},get s(){return s},startRun,startDay,tap,drain,finishDay,get scr(){return scr}};
fit();renderMenu();show('menu');if(!save.nick)openNick(true);requestAnimationFrame(loop);
})();
