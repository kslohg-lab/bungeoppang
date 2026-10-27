/* ===== 화면·저장·조작 (규칙은 위의 BP2에서만 계산) ===== */
(()=>{
const B=BP2,R=B.R,W=450,H=800,$=id=>document.getElementById(id),cv=$('cv'),cx=cv.getContext('2d'),fmt=B.fmt,KEY='bungeoppang2Pub1',VER='1.1';
let save={};try{save=JSON.parse(localStorage.getItem(KEY))||{}}catch(e){}
save=Object.assign({nick:'',sub:{id:0,stage:0,net:0},snd:true,runs:0,clears:0,best:{stage:0,net:0},week:{id:0,stage:0,net:0},free:{stage:0,net:0},run:null},save);
/* 규칙이 바뀌기 전에 하던 판은 이어서 할 수 없어요 (순위표 검증이 맞지 않아서) */
let oldRun=false;if(save.run&&save.run.run&&save.run.run.sv!==B.SIMV){save.run=null;oldRun=true}
const store=()=>{try{localStorage.setItem(KEY,JSON.stringify(save))}catch(e){}};
const wid=()=>B.weekId(Date.now()),weekSeed=()=>B.weekSeed(wid());
let run=null,s=null,scr='menu',paused=false,acc=0,last=0,ui=null;
const MODE=m=>m==='week'?'이번 주 판':'연습 판';
let A=null;

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
 if(sr&&sr.run&&!sr.run.over&&sr.run.mode==='week'&&sr.run.wid===wid()){$('m1').textContent='▶ 이어서 하기 · '+sr.run.day+'일차';$('m5').style.display='block';$('m5').textContent='🆕 처음부터 다시 시작'}
 else{$('m1').textContent='▶ 이번 주 판 시작';$('m5').style.display='none'}}
function toMenu(){scr='menu';s=null;paused=false;renderMenu();show('menu')}

/* ---------- 판 · 하루 흐름 ---------- */
function startRun(mode){au();run=B.newRun(mode==='week'?weekSeed():(Math.random()*4294967296)>>>0,mode);run.wid=wid();run.sv=B.SIMV;save.runs++;save.run={run};store();startDay()}
function startDay(){s=B.newDay(run);ui=A.newUi();A.use(s,run,ui);scr='game';paused=false;acc=0;last=0;show('none')}
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
function sumHtml(res,kind){let h=(kind==='revive'?'🎫 <b>부활권을 썼어요!</b> 같은 날을 한 번 더 해요<br>':'')+'💰 순수익 <b>'+fmt(res.net)+'원</b> / 컷트라인 '+fmt(res.cut)+(res.pass?' ✅':' ❌')+'<br>🐾 손님 '+res.served+'명 · 😡 놓침 '+res.lost+' · ✨ PERFECT '+res.perf+' · 👍 GREAT '+(res.good|0)+' · 😵 BURNT '+res.burnt+' · 🔥 콤보 '+res.bc;return h}
let lastR=null;
function goShop(res,kind){lastR=res;scr='shop';$('st').textContent=kind==='revive'?'🎫 한 번 더!':'🌙 '+(run.day-1)+'단계 통과!';$('ss').innerHTML=sumHtml(res,kind);renderShop();
 const ev=B.evOf(run.day),c=B.cutline(run.day);$('s1').textContent=(kind==='revive'?'▶ '+run.day+'일차 다시 시작':'▶ '+run.day+'일차 시작')+' (컷트라인 '+fmt(c)+')';show('shop')}
function renderShop(){
 $('sw').innerHTML='<span class="pill">🪙 '+fmt(run.coins)+'</span><span class="pill">'+(B.evOf(run.day)?R.ev[B.evOf(run.day)].e+' '+run.day+'일차 '+R.ev[B.evOf(run.day)].n:'📅 '+run.day+'일차')+'</span>';
 const L=$('shl');L.innerHTML='';
 const row=(e,n,d,label,can,fn,rec)=>{const r=document.createElement('div');r.className='it'+(rec?' rec':'');r.innerHTML='<b>'+e+'</b><div>'+(String(n).startsWith('<span')?n:'<span>'+n+'</span>')+'<br>'+d+'</div>';const b=document.createElement('button');b.textContent=label;if(!can)b.className='no';b.onclick=fn;r.appendChild(b);L.appendChild(r)};
 const buyK=k=>{if(!B.buy(run,k)){toast('코인이 부족해요!');snd('no');return}save.run={run};store();snd('win');renderShop()};
 const sec=h=>{const p=document.createElement('p');p.className='ht';p.innerHTML='<b>'+h+'</b>';L.appendChild(p)};
 const FU=[0,1,2,3,4,5].filter(f=>f<run.nf).map(f=>'fu'+f),ALL=['fl','mold','rack','speed','auto','pat','deco','loc',...FU];
 const rc=B.recUp(run,ALL,lastR&&Object.assign({},lastR,{cut:B.cutline(run.day)}));
 const one=k=>{const c=B.upCost(run,k),d=B.upInfo(run,k),isR=rc&&rc.k===k,nm='<span>'+d[1]+'</span> <small>'+d[3]+'</small>';
  if(c==null){row(d[0],nm,d[2],'완료 ✅',false,()=>{});return}
  row(d[0],nm,d[2]+(isR?'<br><b class="why">👍 추천 · '+rc.why+'</b>':''),fmt(c)+'🪙',run.coins>=c,()=>buyK(k),isR)};
 if(rc){sec('👍 지금 추천');one(rc.k)}
 sec('🔥 굽기');['fl','mold','rack','speed','auto'].filter(k=>!rc||rc.k!==k).forEach(one);
 sec('🫘 맛 강화 (값이 올라요 · 싼 맛일수록 많이)');FU.filter(k=>!rc||rc.k!==k).forEach(one);
 sec('🏪 손님');['pat','deco','loc'].filter(k=>!rc||rc.k!==k).forEach(one);
 sec('🎫 부활권');
 const tc=B.ticketCost(run);
 if(run.ticket)row('🎫','부활권','탈락할 때 같은 날을 한 번 더 해요','보유 ✅',false,()=>{});
 else row('🎫','부활권 (한 판에 한 번)','컷트라인에 못 미쳐도 같은 날을 한 번 더 해요',fmt(tc)+'🪙',run.coins>=tc,()=>{if(!B.buyTicket(run)){toast('코인이 부족해요!');snd('no');return}save.run={run};store();snd('win');renderShop()})}
function goOver(res,kind){scr='over';const st=run.stage;$('ot').textContent=run.clear?'🎉 '+R.maxStage+'단계 완주!':(run.giveUp?'🏳️ 포기했어요':'💥 '+(st+1)+'일차에서 탈락');
 let h=run.clear?'모든 단계를 통과했어요!':(run.giveUp?'':sumHtml(res,kind)+'<br>');
 h+='<br>🏅 도달 단계 <b>'+st+'</b> · 누적 순수익 '+fmt(run.tot)+'원';
 const w=save.week.id===run.wid?save.week:null;if(run.mode==='week'&&w)h+='<br>이번 주 내 최고 <b>'+w.stage+'단계</b>';
 $('obd').innerHTML=h;$('o1').textContent='🔁 이번 주 판 다시 도전';show('over')}
function giveUp(){if(!run||run.over)return;run.over=true;run.giveUp=true;record();save.run=null;store();paused=false;$('pause').style.display='none';goOver(null,'over')}

/* ---------- 연결: 버튼 ---------- */
$('m1').onclick=()=>{au();const sr=save.run;if(sr&&sr.run&&!sr.run.over&&sr.run.mode==='week'&&sr.run.wid===wid()){run=sr.run;startDay()}else startRun('week')};
$('m5').onclick=()=>ask($('m5'),'⚠️ 지금 판이 사라져요. 한 번 더!',()=>startRun('week'));
function renderHow(){const wk=save.week.id===wid()?save.week:{stage:0,net:0};
 $('hw').innerHTML='<p class="ht"><b>🏅 내 기록</b></p><div class="sum">이번 주 판: <b>'+wk.stage+'단계</b> ('+fmt(wk.net)+'원)<br>전체 최고: <b>'+save.best.stage+'단계</b> · 도전 '+save.runs+'번 · 완주 '+save.clears+'번</div>'+
 '<p class="ht"><b>📖 이렇게 해요</b></p><div class="sum">• 하루는 90초! 번 돈이 <b>컷트라인</b>을 넘어야 다음 단계로 가요. 못 넘으면 끝!<br>• 빈 틀을 톡 → 속 넣기 → 덮개 톡 → 앞면 굽기 → 뒤집기 → 꺼내기. 노란 구간에 누르면 좋은 빵이 돼요.<br>• <b>빵 등급</b>: 양면 모두 노란 구간 ✨<b>PERFECT</b>(값 ×1.4) · 한 면만 👍<b>GREAT</b>(×1.15) · 둘 다 초록 🙂<b>GOOD</b> · 빨강은 😵<b>BURNT</b>(버려요)<br>• 손님을 톡 하면 좋은 빵부터 줘요. 평론가🎩는 PERFECT만 받아요. PERFECT를 이어서 주면 🔥콤보!<br>• 번 돈으로 업그레이드를 사요. <b>새 메뉴</b>는 비싸지만 굽기가 어렵고, <b>🫘 맛 강화</b>로 쉬운 맛의 값을 올릴 수도 있어요. 팥 하나만 키워서 멀리 가는 것도 가능해요!<br>• 틀은 최대 8개, 🍽️ 접시를 넓히면 미리 많이 구워 둘 수 있어요.<br>• 🎫 부활권은 한 판에 한 번, 탈락한 날을 다시 해 볼 수 있어요.<br>• 이번 주 판은 모두 같은 손님·날씨·이벤트로 겨뤄요. 🏆 순위표에서 친구들과 비교해요 (월요일 0시에 새로 시작).</div>'}
$('m4').onclick=()=>{au();renderHow();show('how')};$('hx').onclick=()=>show('menu');
$('m6').onclick=()=>{au();openLb(0)};$('m7').onclick=share;
$('m3').onclick=()=>{au();$('sn').textContent=save.snd?'🔊 소리 켜짐':'🔇 소리 꺼짐';$('sk').textContent='✏️ 닉네임 바꾸기 ('+save.nick+')';$('rs').textContent='🗑️ 기록·저장 지우기';show('set')};
$('sk').onclick=()=>openNick(false);
$('sn').onclick=()=>{save.snd=!save.snd;store();$('sn').textContent=save.snd?'🔊 소리 켜짐':'🔇 소리 꺼짐'};
$('sc').onclick=()=>show('menu');
$('rs').onclick=()=>ask($('rs'),'⚠️ 정말 지울까요? 한 번 더!',()=>{save={snd:save.snd,runs:0,clears:0,best:{stage:0,net:0},week:{id:0,stage:0,net:0},free:{stage:0,net:0},run:null};store();renderMenu();toast('모두 지웠어요')});
$('s1').onclick=()=>{au();startDay()};
$('o4').onclick=()=>openLb(0);$('o1').onclick=()=>{startRun('week')};$('o3').onclick=toMenu;
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
 const txt='🔥 붕어빵 챌린지 — 이번 주 '+(wk.stage?wk.stage+'단계까지 갔어요! 내 기록을 넘어 봐 😎':'같이 도전해요! 누가 제일 멀리 가는지 겨뤄요 🏆');
 if(navigator.share){navigator.share({title:'붕어빵 챌린지',text:txt,url}).catch(()=>{});return}
 const full=txt+'\n'+url;const done=()=>toast('복사했어요! 카톡에 붙여넣기 하세요');
 try{navigator.clipboard.writeText(full).then(done,()=>fb())}catch(e){fb()}
 function fb(){const t=document.createElement('textarea');t.value=full;t.style.cssText='position:fixed;opacity:0;left:0;top:0';document.body.appendChild(t);t.select();try{document.execCommand('copy');done()}catch(e){toast(full)}t.remove()}}
function pauseGame(){if(scr!=='game'||!s||paused||s.ph!=='play')return;paused=true;$('pause').style.display='block'}
function resumeGame(){if(!paused)return;paused=false;$('pause').style.display='none';last=0}
$('home').onclick=pauseGame;$('p1').onclick=resumeGame;$('p2').onclick=()=>ask($('p2'),'⚠️ 판이 끝나요. 한 번 더!',giveUp);

/* ---------- 조작 ---------- */
A=ART(cx,{shape:()=>0,toast:t=>toast(t),snd:k=>snd(k)});const {em,tx,rr,m2,lite,dark}=A;
cv.addEventListener('pointerdown',e=>{e.preventDefault();au();if(scr!=='game'||paused||!s||s.ph!=='play')return;const r=cv.getBoundingClientRect();tap((e.clientX-r.left)/r.width*W,(e.clientY-r.top)/r.height*H)});
cv.addEventListener('contextmenu',e=>e.preventDefault());
function tap(x,y){A.tapPlay(x,y);drain()}
function drain(){A.drainFx()}

/* ---------- 그리기 (가게와 같은 그림 도구, 배경만 챌린지 노점) ---------- */
function awning(t){const n=15,w=W/n;for(let i=0;i<n;i++){const c=i%2?'#fff6ec':'#e8584a';cx.fillStyle=c;cx.fillRect(i*w,60,w,16);cx.beginPath();cx.arc(i*w+w/2,76,w/2,0,Math.PI);cx.fill()}
 cx.fillStyle='rgba(0,0,0,.12)';cx.fillRect(0,60,W,3)}
function draw(){A.use(s,run,ui);const lc=B.L(run);A.drawPlay({sub:s.wea.n+' · 컷트라인 '+fmt(s.cut)+'원',
 bg:t=>{cx.fillStyle='#ffe0b5';cx.fillRect(0,0,W,H);const g=cx.createLinearGradient(0,64,0,322);g.addColorStop(0,lite(lc.wall,.3));g.addColorStop(1,dark(lc.wall,.06));cx.fillStyle=g;cx.fillRect(0,64,W,258);
  cx.fillStyle='rgba(255,255,255,.18)';for(let i=0;i<6;i++)cx.fillRect(i*80+10,90,2,220);
  awning(t);cx.fillStyle='#c9935f';cx.fillRect(0,322,W,78);cx.fillStyle='#d9a873';cx.fillRect(0,322,W,6);cx.fillStyle='rgba(0,0,0,.14)';cx.fillRect(0,328,W,4);cx.fillStyle='#6b5344';cx.fillRect(0,394,W,310)},
 head:t=>{rr(0,0,W,58,0,'#8a5a3a');tx(s.d+'일차 '+s.wea.e,50,20,22,'#fff','left');
  const dc=['','🏮','🏮⛱️','🏮⛱️✨'][run.up.deco|0];tx(lc.e+(dc||''),160,20,16,'#fff','left');
  tx('🪙 '+fmt(run.coins+s.net),385,20,ui.hud>0?26:22,ui.hud>0?'#fff6c0':'#ffe9a0','right');
  const gr=Math.max(0,Math.min(1.25,s.net/s.cut));rr(128,38,258,12,6,'rgba(0,0,0,.35)');rr(128,38,258*gr/1.25,12,6,gr>=1?'#ffd23a':'#7ed88a');rr(128+258/1.25-1.5,36,3,16,1,'#fff');tx('컷트라인 '+fmt(s.cut),122,45,13,'#fff','right')}})}

/* ---------- 반복 ---------- */
function loop(ts){const dt=Math.min(.05,(ts-last)/1000||0);last=ts;
 if(s&&scr==='game'){if(!paused){acc+=dt;let n=0;while(acc>=B.DT&&n++<4){B.step(s,run,B.DT);acc-=B.DT;drain();if(s.done)break}
  A.tickFx(dt);
  if(s.done){draw();finishDay();requestAnimationFrame(loop);return}}draw()}
 requestAnimationFrame(loop)}
function fit(){const b=document.body,sc=Math.min(b.clientWidth/W,b.clientHeight/H);$('box').style.transform='translate('+(b.clientWidth-W*sc)/2+'px,'+(b.clientHeight-H*sc)/2+'px) scale('+sc+')'}
addEventListener('resize',fit);addEventListener('orientationchange',()=>setTimeout(fit,200));
document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseGame();if(AC){if(document.hidden)AC.suspend();else AC.resume()}});
addEventListener('pagehide',pauseGame);
window.__bp2={save,B,get run(){return run},get s(){return s},startRun,startDay,tap,drain,finishDay,get scr(){return scr}};
fit();renderMenu();show('menu');if(!save.nick)openNick(true);else if(oldRun){store();toast('규칙이 새로 바뀌어서 이번 판은 처음부터 해요')}requestAnimationFrame(loop);
})();
