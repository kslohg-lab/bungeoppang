/* ===== 🎵 소리: 배경음악(파일) + 효과음(코드로 만든 소리) — 챌린지·가게 공용 =====
   설정 저장: localStorage bpAudio = {mu:1|0 음악, fx:1|0 효과음}
   음악은 snd/*.mp3 (Pixabay Music, 게임 안 사용 허용). 들을 때만 받아요.
   AUDIO.music('menu'|'chal'|'shop'|null)  AUDIO.sfx(이름,{combo})  AUDIO.vib(ms)  AUDIO.set('mu'|'fx',bool)  AUDIO.get() */
const AUDIO=(()=>{
const KEY='bpAudio';
let cfg={mu:1,fx:1};try{const v=JSON.parse(localStorage.getItem(KEY));if(v&&typeof v==='object')cfg=Object.assign(cfg,v)}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(cfg))}catch(e){}};
let AC=null,MG=null,FG=null,NB=null;
function ctx(){if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)();MG=AC.createGain();MG.gain.value=cfg.mu?1:0;MG.connect(AC.destination);FG=AC.createGain();FG.gain.value=.9;FG.connect(AC.destination)}catch(e){AC=null}}
 if(AC&&AC.state==='suspended'&&!document.hidden){try{AC.resume()}catch(e){}}return AC}
/* 하얀 소음 (치익·쭈욱·휙 소리 재료) */
function noise(){if(NB)return NB;const a=ctx();if(!a)return null;NB=a.createBuffer(1,a.sampleRate*1,a.sampleRate);const d=NB.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;return NB}
/* ---------- 효과음 재료 ---------- */
function tone(f,d,ty='sine',v=.14,t0=0,f2,atk=.005){const a=ctx();if(!a)return;const o=a.createOscillator(),g=a.createGain(),t=a.currentTime+t0;o.type=ty;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);
 g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+atk);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(FG);o.start(t);o.stop(t+d+.02)}
function nz(d,v,t0,type,f1,f2,q=1){const a=ctx(),b=noise();if(!a||!b)return;const s=a.createBufferSource(),fl=a.createBiquadFilter(),g=a.createGain(),t=a.currentTime+t0;s.buffer=b;s.loop=true;fl.type=type;fl.Q.value=q;fl.frequency.setValueAtTime(f1,t);if(f2)fl.frequency.exponentialRampToValueAtTime(f2,t+d);
 g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(fl);fl.connect(g);g.connect(FG);s.start(t,Math.random()*.5);s.stop(t+d+.02)}
/* 종소리: 맑은 배음 몇 개 */
function bell(f,d,v,t0=0){tone(f,d,'sine',v,t0);tone(f*2.01,d*.6,'sine',v*.35,t0);tone(f*3.02,d*.35,'triangle',v*.12,t0)}
const NOTE=n=>440*Math.pow(2,(n-69)/12);
const S={
 ui(){tone(720,.05,'sine',.06,0,560)},
 tap(){tone(620,.06,'triangle',.09,0,420);nz(.03,.04,0,'highpass',3000)},
 pour(){nz(.28,.09,0,'lowpass',350,1400,2);tone(180,.22,'sine',.08,0,260,.03)},
 sizzle(){nz(.45,.07,0,'highpass',4200,2600,.7);nz(.3,.05,.05,'bandpass',6000,3500,2)},
 flip(){nz(.16,.12,0,'bandpass',600,2600,1.5);tone(150,.12,'sine',.14,.1,90)},
 perf(o){const k=Math.pow(2,Math.min(12,(o&&o.combo)|0)/24);bell(1046*k,.5,.11);[1318,1568,2093].forEach((f,i)=>tone(f*k,.18,'triangle',.06,.06+i*.05))},
 ready(){bell(784,.32,.08)},
 coin(o){const k=Math.pow(2,Math.min(14,(o&&o.combo)|0)/24);tone(1976*k,.09,'square',.035);tone(2637*k,.22,'triangle',.07,.05)},
 coins(){for(let i=0;i<7;i++){const f=1800+Math.random()*1200;tone(f,.12,'triangle',.05,i*.06+Math.random()*.03)}},
 burn(){nz(.4,.12,0,'lowpass',900,200,1);tone(140,.4,'sawtooth',.07,0,60)},
 angry(){tone(260,.12,'square',.06,0,200);tone(220,.18,'square',.06,.12,150)},
 no(){tone(240,.08,'square',.05);tone(180,.12,'square',.05,.08)},
 hi(){tone(880,.07,'sine',.05,0,1320);tone(1320,.06,'sine',.035,.06)},
 win(){[72,76,79,84].forEach((n,i)=>{tone(NOTE(n),.28,'triangle',.1,i*.09);tone(NOTE(n)*2,.12,'sine',.03,i*.09)})},
 buy(){S.coins();bell(1568,.4,.07,.12)},
 combo(o){const n=(o&&(o.n||o.combo))|0,b=n>=20?84:n>=10?79:76;[0,4,7,12].forEach((x,i)=>tone(NOTE(b+x),.14,'square',.035,i*.05));bell(NOTE(b+12),.5,.07,.2)},
 fanfare(){const m=[[67,0],[72,.12],[76,.24],[79,.36],[84,.54]];m.forEach(([n,t])=>{tone(NOTE(n),.3,'triangle',.11,t);tone(NOTE(n)/2,.3,'square',.025,t)});[72,76,79,84].forEach(n=>tone(NOTE(n),1.1,'triangle',.05,.54));for(let i=0;i<6;i++)tone(2400+Math.random()*1600,.1,'sine',.03,.6+i*.07)},
 pop(){tone(500,.07,'sine',.08,0,900)},
 place(){tone(300,.08,'sine',.12,0,160);nz(.05,.05,0,'lowpass',800)}};
function sfx(k,o){if(!cfg.fx||!S[k])return;try{if(!ctx())return;S[k](o)}catch(e){}}
/* ---------- 진동 (안드로이드만, 아이폰은 조용히 무시) ---------- */
function vib(ms){if(!cfg.fx)return;try{navigator.vibrate&&navigator.vibrate(ms)}catch(e){}}
/* ---------- 배경음악: 곡 목록을 돌아가며, 바꿀 땐 살짝 줄였다 키워요 ---------- */
const LIST={menu:['m1'],chal:['c1','c2','c3','c4'],shop:['s1','s2','s3','s4','s5']};
const VOL={menu:.32,chal:.3,shop:.28};
const xmas=()=>{const d=new Date();return d.getMonth()===11&&d.getDate()<=26};
let el=null,src=null,EG=null,cur=null,want=null,idx={},fadeT=null,unlocked=false;
function pick(n){let L=LIST[n].slice();if(n==='shop'&&xmas())L=['x1',...L];if(n==='chal'){return L[Math.floor(Math.random()*L.length)]}
 let i=idx[n];if(i==null){try{i=+(localStorage.getItem('bpMusI_'+n))||0}catch(e){i=0}}i=i%L.length;idx[n]=i+1;try{localStorage.setItem('bpMusI_'+n,String((i+1)%L.length))}catch(e){}return L[i]}
function mk(){if(el)return;el=new Audio();el.preload='auto';el.loop=false;el.setAttribute('playsinline','');
 el.addEventListener('ended',()=>{if(cur)play(cur,true)});
 const a=ctx();if(a){try{src=a.createMediaElementSource(el);EG=a.createGain();EG.gain.value=0;src.connect(EG);EG.connect(MG)}catch(e){src=null}}}
function setVol(v,sec){if(EG&&AC){const t=AC.currentTime;EG.gain.cancelScheduledValues(t);EG.gain.setValueAtTime(EG.gain.value,t);EG.gain.linearRampToValueAtTime(v,t+sec)}else if(el){try{el.volume=Math.max(0,Math.min(1,v))}catch(e){}}}
function play(n,next){mk();cur=n;clearTimeout(fadeT);const f=pick(n);
 const go=()=>{if(cur!==n)return;el.src='snd/'+f+'.mp3';try{el.currentTime=0}catch(e){}const p=el.play();if(p&&p.catch)p.catch(()=>{});setVol(VOL[n]||.3,next?.3:1.2)};
 if(!next&&el.src&&!el.paused){setVol(0,.4);fadeT=setTimeout(go,420)}else go()}
function stop(){cur=null;clearTimeout(fadeT);if(el&&!el.paused){setVol(0,.5);fadeT=setTimeout(()=>{try{el.pause()}catch(e){}},520)}}
function music(n){want=n||null;if(!unlocked)return;if(!cfg.mu||!want){stop();return}if(cur===want&&el&&!el.paused)return;play(want)}
/* 첫 터치 때 소리 열기 (휴대폰은 손가락이 닿아야 소리가 나요) */
function unlock(){if(unlocked){ctx();return}unlocked=true;ctx();if(want&&cfg.mu)play(want)}
['pointerdown','touchend','keydown'].forEach(ev=>addEventListener(ev,unlock,{capture:true,passive:true}));
document.addEventListener('visibilitychange',()=>{if(document.hidden){if(el&&!el.paused){try{el.pause()}catch(e){}}if(AC)try{AC.suspend()}catch(e){}}
 else{if(AC)try{AC.resume()}catch(e){}if(el&&cur&&cfg.mu&&unlocked){const p=el.play();if(p&&p.catch)p.catch(()=>{})}}});
function set(k,v){cfg[k]=v?1:0;save();if(k==='mu'){if(MG)MG.gain.value=v?1:0;if(v){if(want)music(want)}else stop()}}
return{sfx,vib,music,set,get:()=>Object.assign({},cfg),unlock,ctx}})();
window.AUDIO=AUDIO;
