/* ===== 그림 도구 (가게·챌린지 공용) — 코드로 그려서 외부 그림 파일이 없어요 =====
   ART(cx,{shape:()=>틀모양번호,toast,snd}) 로 만들고, 그리기 전에 A.use(s,run,ui) 로 지금 하루를 알려 줘요 */
window.ART_IMG=window.ART_IMG||{};
const ART_LOAD=(map)=>{for(const k in map){const im=new Image();im.decoding='async';im.src=map[k];window.ART_IMG[k]=im}};
const ART=(cx,OPT)=>{
if(typeof CanvasRenderingContext2D!=='undefined'&&!CanvasRenderingContext2D.prototype.roundRect)CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){r=Math.min(r||0,w/2,h/2);this.moveTo(x+r,y);this.arcTo(x+w,y,x+w,y+h,r);this.arcTo(x+w,y+h,x,y+h,r);this.arcTo(x,y+h,x,y,r);this.arcTo(x,y,x+w,y,r);this.closePath()};
OPT=Object.assign({shape:()=>0,toast:()=>{},snd:()=>{}},OPT||{});
let s=null,run=null,ui=null;const use=(S,RUN,UI)=>{s=S;run=RUN;ui=UI};
const E='"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
const EC={};function spr(e,z){const k=e+z;let c=EC[k];if(!c){c=document.createElement('canvas');c.width=c.height=Math.ceil(z*1.4);const x=c.getContext('2d');x.font=z+'px '+E;x.textAlign='center';x.textBaseline='middle';x.fillText(e,c.width/2,c.height/2);EC[k]=c}return c}
function em(e,x,y,z,a=1){z=Math.round(z);const c=spr(e,z);cx.globalAlpha=a;cx.drawImage(c,x-c.width/2,y-c.height/2);cx.globalAlpha=1}
function tx(t,x,y,z,c='#fff',al='center',o='#7a4a22'){cx.font='bold '+z+'px "Jua","Noto Sans KR","Malgun Gothic",sans-serif';cx.textAlign=al;cx.textBaseline='middle';cx.lineWidth=z/5;cx.strokeStyle=o;cx.lineJoin='round';cx.strokeText(t,x,y);cx.fillStyle=c;cx.fillText(t,x,y)}
function rr(x,y,w,h,r,f){cx.beginPath();cx.roundRect(x,y,Math.max(0,w),h,r);cx.fillStyle=f;cx.fill()}
const m2=(a,n)=>((a%n)+n)%n;
function fish(x,y,z,col,rim='#7a4a22'){cx.save();cx.translate(x,y);cx.scale(z,z);cx.lineWidth=3;cx.strokeStyle=rim;cx.fillStyle=col;
 cx.beginPath();cx.moveTo(34,0);cx.lineTo(56,-17);cx.lineTo(56,17);cx.closePath();cx.fill();cx.stroke();
 cx.beginPath();cx.ellipse(0,0,40,21,0,0,7);cx.fill();cx.stroke();
 cx.lineWidth=1.6;cx.strokeStyle='rgba(0,0,0,.22)';cx.beginPath();for(let i=0;i<3;i++){cx.moveTo(2+i*11+5,-8);cx.arc(2+i*11,0,8,-1.1,1.1)}cx.stroke();
 cx.fillStyle='#3a2a1a';cx.beginPath();cx.arc(-24,-6,3.4,0,7);cx.fill();cx.restore()}
/* ---------- 그림 도구 모음 (캐릭터·붕어빵·계절) — 코드로 그려서 외부 그림 파일이 없어요 ---------- */
function rgbOf(c){if(c[0]==='#'){const h=c.length===4?c.replace(/#(.)(.)(.)/,'#$1$1$2$2$3$3'):c;return[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)]}const m=c.match(/\d+/g);return m?[+m[0],+m[1],+m[2]]:[200,200,200]}
function mix(c,t,k){const a=rgbOf(c),b=rgbOf(t);return'rgb('+a.map((v,i)=>Math.round(v+(b[i]-v)*k)).join(',')+')'}
const lite=(c,k=.35)=>mix(c,'#ffffff',k),dark=(c,k=.3)=>mix(c,'#000000',k);
/* 동물 모양표: c=몸색, ear=귀 종류, mz=주둥이색, nose=코색 */
const SP={
 '🐶':{c:'#e2aa6a',ear:'drop',ec:'#a8703a',mz:'#f7e4c8',nose:'#3a2a1a',patch:1},
 '🐱':{c:'#f2bb7c',ear:'tri',ec:'#f2bb7c',ei:'#ffb6c0',mz:'#fff1dc',nose:'#e8808a',stripe:1,wh:1},
 '🐰':{c:'#f6f2f0',ear:'long',ec:'#f6f2f0',ei:'#ffb6c8',mz:'#fff',nose:'#f08a9a',wh:1},
 '🐻':{c:'#a8754a',ear:'round',ec:'#a8754a',ei:'#d6a878',mz:'#e8c8a0',nose:'#2a1a12'},
 '🐼':{c:'#fbfbf8',ear:'round',ec:'#2a2a2a',mz:'#fff',nose:'#2a2a2a',panda:1},
 '🦊':{c:'#f08a3a',ear:'tri',ec:'#f08a3a',ei:'#3a2a20',mz:'#fff4e6',nose:'#2a1a12',fox:1},
 '🐯':{c:'#f4ab3c',ear:'round',ec:'#f4ab3c',ei:'#fff1d8',mz:'#fff1d8',nose:'#e8808a',stripe:1},
 '🐸':{c:'#6cc86a',ear:'none',mz:null,nose:null,frog:1},
 '🐵':{c:'#a8754a',ear:'bigRound',ec:'#a8754a',ei:'#f0cfa0',mz:'#f0cfa0',nose:'#3a2a1a',monkey:1},
 '🐧':{c:'#2a3a5a',ear:'none',mz:null,nose:null,peng:1},
 '🐹':{c:'#f2c892',ear:'round',ec:'#f2c892',ei:'#ffd0c0',mz:'#fff2e0',nose:'#e8808a',patch:0},
 '🦁':{c:'#e8b458',ear:'round',ec:'#e8b458',ei:'#c88a38',mz:'#fff0cc',nose:'#3a2a1a',mane:'#a65a20'},
 '🐉':{c:'#62d17a',ear:'horn',ec:'#ffe066',mz:'#c8f5c0',nose:'#2a6a3a',wing:1},
 '🦄':{c:'#fff',ear:'uni',ec:'#ffd23a',mz:'#ffe8f4',nose:'#f08ac0',unic:1},
 '🧐':{c:'#ffd9b0',ear:'none',mz:null,nose:null,critic:1},
 'cook':{c:'#ffd9b0',ear:'none',mz:null,nose:null,cook:1}};
function eyes(r,mood,blink,sp){const ex=r*.36,ey=-r*.05;
 for(const sx of[-1,1]){cx.save();cx.translate(sx*ex,ey);
  if(mood==='h'||blink){cx.strokeStyle='#2a1a12';cx.lineWidth=r*.07;cx.lineCap='round';cx.beginPath();if(mood==='h')cx.arc(0,r*.04,r*.1,Math.PI*1.1,Math.PI*1.9);else{cx.moveTo(-r*.1,0);cx.lineTo(r*.1,0)}cx.stroke()}
  else{cx.fillStyle='#2a1a12';cx.beginPath();cx.ellipse(0,0,r*.09,mood==='a'?r*.09:r*.12,0,0,7);cx.fill();cx.fillStyle='#fff';cx.beginPath();cx.arc(-r*.03,-r*.04,r*.035,0,7);cx.fill()}
  cx.restore()}
 if(mood==='a'){cx.strokeStyle='#4a2a14';cx.lineWidth=r*.07;cx.lineCap='round';cx.beginPath();cx.moveTo(-ex-r*.16,ey-r*.22);cx.lineTo(-ex+r*.14,ey-r*.1);cx.moveTo(ex+r*.16,ey-r*.22);cx.lineTo(ex-r*.14,ey-r*.1);cx.stroke()}
 else if(mood==='w'){cx.strokeStyle='#4a2a14';cx.lineWidth=r*.06;cx.lineCap='round';cx.beginPath();cx.moveTo(-ex-r*.14,ey-r*.1);cx.lineTo(-ex+r*.14,ey-r*.2);cx.moveTo(ex+r*.14,ey-r*.1);cx.lineTo(ex-r*.14,ey-r*.2);cx.stroke()}}
function mouth(r,mood,y){cx.strokeStyle='#4a2a14';cx.lineWidth=r*.06;cx.lineCap='round';cx.lineJoin='round';
 if(mood==='h'){cx.fillStyle='#c0405a';cx.beginPath();cx.moveTo(-r*.2,y);cx.quadraticCurveTo(0,y+r*.38,r*.2,y);cx.closePath();cx.fill();cx.stroke();cx.fillStyle='#ff8a9a';cx.beginPath();cx.ellipse(0,y+r*.17,r*.09,r*.06,0,0,7);cx.fill()}
 else if(mood==='a'){cx.beginPath();cx.moveTo(-r*.14,y+r*.1);cx.quadraticCurveTo(0,y-r*.06,r*.14,y+r*.1);cx.stroke()}
 else if(mood==='w'){cx.beginPath();cx.moveTo(-r*.14,y+r*.05);cx.quadraticCurveTo(-r*.07,y-r*.03,0,y+r*.05);cx.quadraticCurveTo(r*.07,y+r*.13,r*.14,y+r*.05);cx.stroke()}
 else{cx.beginPath();cx.moveTo(-r*.14,y);cx.quadraticCurveTo(-r*.07,y+r*.1,0,y);cx.quadraticCurveTo(r*.07,y+r*.1,r*.14,y);cx.stroke()}}
/* 동물/사람 반신 그리기: kind(이모지 키), 중심(x,y)=얼굴 중심, 얼굴 지름 s */
/* 그림 파일이 있으면 코드 그림 대신 사용 (ART_IMG[kind]=Image) */
function animal(kind,x,y,s,o={}){const im=window.ART_IMG&&window.ART_IMG[kind];if(im&&im.complete&&im.naturalWidth){const h=s*1.62,w=h*im.naturalWidth/im.naturalHeight,bob=Math.sin((o.t||0)*2.2+(o.ph||0))*s*.03;
  cx.save();cx.translate(x,y+s*.9+bob);if(o.tilt)cx.rotate(o.tilt);/* 뒤뚱 걷기: 발을 축으로 좌우로 기울고 걸음마다 살짝 눌려요 */if(o.walk!=null){cx.rotate(Math.sin(o.walk)*.13);const k=1-.06*Math.abs(Math.cos(o.walk));cx.scale(1+(1-k)*.6,k)}if(o.mood==='a'){cx.filter='saturate(1.3) hue-rotate(-12deg)'}const sq=o.mood==='h'?1+.03*Math.sin((o.t||0)*9):1;cx.scale(1/sq,sq);cx.drawImage(im,-w/2,-h,w,h);cx.restore();return}
 return animalCode(kind,x,y,s,o)}
function animalCode(kind,x,y,s,o={}){const sp=SP[kind]||SP['🐶'],r=s/2,t=o.t||0,ph=o.ph||0,mood=o.mood||'n',bob=Math.sin(t*2.2+ph)*r*.04,blink=((t*1.0+ph)%3.7)<.12;
 cx.save();cx.translate(x,y+bob);if(o.tilt)cx.rotate(o.tilt);
 if(sp.wing){cx.fillStyle='#46b062';for(const sx of[-1,1]){cx.beginPath();cx.moveTo(sx*r*.7,r*.4);cx.quadraticCurveTo(sx*r*1.5,-r*.2+Math.sin(t*4)*r*.1,sx*r*1.2,r*.9);cx.quadraticCurveTo(sx*r*1.0,r*.7,sx*r*.7,r*.8);cx.fill()}}
 if(o.shirt!==null&&!o.bust){const sc=o.shirt||'#7ec8ff';const g=cx.createLinearGradient(0,r*.7,0,r*1.7);g.addColorStop(0,lite(sc,.2));g.addColorStop(1,sc);cx.fillStyle=g;cx.beginPath();cx.roundRect(-r*.86,r*.66,r*1.72,r*1.1,r*.5);cx.fill();cx.strokeStyle=dark(sc,.35);cx.lineWidth=r*.05;cx.stroke();
  if(sp.peng){cx.fillStyle='#fff'}
  cx.fillStyle=dark(sc,.18);cx.beginPath();cx.moveTo(-r*.2,r*.66);cx.lineTo(0,r*.92);cx.lineTo(r*.2,r*.66);cx.closePath();cx.fill()}
 if(sp.mane){const g=cx.createRadialGradient(0,0,r*.5,0,0,r*1.35);g.addColorStop(0,sp.mane);g.addColorStop(1,dark(sp.mane,.25));cx.fillStyle=g;cx.beginPath();for(let i=0;i<14;i++){const a=i/14*Math.PI*2;cx.lineTo(Math.cos(a)*r*1.3,Math.sin(a)*r*1.3);const b=a+Math.PI/14;cx.lineTo(Math.cos(b)*r*1.12,Math.sin(b)*r*1.12)}cx.closePath();cx.fill()}
 if(sp.unic){const cl=['#ff7a9a','#ffb04a','#ffe066','#7ed88a','#7ec8ff','#a88aff'];cl.forEach((c,i)=>{cx.fillStyle=c;cx.beginPath();cx.ellipse(-r*.92+i*.02*r,-r*.1+i*r*.2,r*.28,r*.2,0.5,0,7);cx.fill()})}
 /* 귀 */
 const ec=sp.ec||sp.c,ei=sp.ei;
 const ear=(sx)=>{cx.save();cx.scale(sx,1);
  if(sp.ear==='drop'){cx.fillStyle=ec;cx.beginPath();cx.ellipse(r*.86,-r*.1,r*.3,r*.55,.35,0,7);cx.fill();cx.strokeStyle=dark(ec,.3);cx.lineWidth=r*.04;cx.stroke()}
  else if(sp.ear==='tri'){cx.fillStyle=ec;cx.beginPath();cx.moveTo(r*.28,-r*.8);cx.lineTo(r*.62,-r*1.28);cx.lineTo(r*.95,-r*.4);cx.closePath();cx.fill();cx.strokeStyle=dark(ec,.3);cx.lineWidth=r*.05;cx.lineJoin='round';cx.stroke();cx.fillStyle=ei||ec;cx.beginPath();cx.moveTo(r*.42,-r*.78);cx.lineTo(r*.62,-r*1.06);cx.lineTo(r*.8,-r*.52);cx.closePath();cx.fill()}
  else if(sp.ear==='round'||sp.ear==='bigRound'){const rr_=sp.ear==='bigRound'?r*.34:r*.28,px=sp.ear==='bigRound'?r*.95:r*.7,py=sp.ear==='bigRound'?-r*.1:-r*.78;cx.fillStyle=ec;cx.beginPath();cx.arc(px,py,rr_,0,7);cx.fill();cx.strokeStyle=dark(ec,.3);cx.lineWidth=r*.04;cx.stroke();if(ei&&!sp.panda){cx.fillStyle=ei;cx.beginPath();cx.arc(px,py,rr_*.55,0,7);cx.fill()}}
  else if(sp.ear==='long'){cx.save();cx.translate(r*.4,-r*.9);cx.rotate(.18+Math.sin(t*2+ph)*.04);cx.fillStyle=ec;cx.beginPath();cx.ellipse(0,-r*.5,r*.2,r*.62,0,0,7);cx.fill();cx.strokeStyle=dark(ec,.25);cx.lineWidth=r*.04;cx.stroke();cx.fillStyle=ei;cx.beginPath();cx.ellipse(0,-r*.48,r*.1,r*.46,0,0,7);cx.fill();cx.restore()}
  else if(sp.ear==='horn'){cx.fillStyle=ec;cx.beginPath();cx.moveTo(r*.3,-r*.85);cx.lineTo(r*.5,-r*1.4);cx.lineTo(r*.7,-r*.7);cx.closePath();cx.fill()}
  cx.restore()};
 if(sp.ear!=='none'&&sp.ear!=='uni'){ear(-1);ear(1)}
 if(sp.ear==='uni'){cx.fillStyle='#fff';for(const sx of[-1,1]){cx.beginPath();cx.moveTo(sx*r*.34,-r*.8);cx.lineTo(sx*r*.55,-r*1.2);cx.lineTo(sx*r*.7,-r*.62);cx.closePath();cx.fill();cx.strokeStyle='#d8d0e0';cx.lineWidth=r*.04;cx.stroke()}
  const g=cx.createLinearGradient(0,-r*1.7,0,-r*.8);g.addColorStop(0,'#fff6a0');g.addColorStop(1,'#ffb830');cx.fillStyle=g;cx.beginPath();cx.moveTo(-r*.12,-r*.88);cx.lineTo(0,-r*1.7);cx.lineTo(r*.12,-r*.88);cx.closePath();cx.fill();cx.strokeStyle='#c88010';cx.lineWidth=r*.03;cx.stroke()}
 /* 얼굴 바탕 */
 const hg=cx.createRadialGradient(-r*.3,-r*.4,r*.1,0,0,r*1.1);hg.addColorStop(0,lite(sp.c,.3));hg.addColorStop(1,sp.c);
 cx.fillStyle=hg;cx.strokeStyle=dark(sp.c,.38);cx.lineWidth=r*.06;cx.beginPath();cx.ellipse(0,0,r,r*.94,0,0,7);cx.fill();cx.stroke();
 if(sp.peng){cx.fillStyle='#fff';cx.beginPath();cx.ellipse(0,r*.16,r*.74,r*.66,0,0,7);cx.fill()}
 if(sp.panda){cx.fillStyle='#2a2a2a';for(const sx of[-1,1]){cx.save();cx.translate(sx*r*.36,-r*.04);cx.rotate(sx*.45);cx.beginPath();cx.ellipse(0,0,r*.22,r*.3,0,0,7);cx.fill();cx.restore()}}
 if(sp.fox){cx.fillStyle='#fff4e6';cx.beginPath();cx.moveTo(-r*.95,r*.1);cx.quadraticCurveTo(-r*.5,r*.3,0,r*.95);cx.quadraticCurveTo(r*.5,r*.3,r*.95,r*.1);cx.quadraticCurveTo(r*.5,r*.62,0,r*.86);cx.quadraticCurveTo(-r*.5,r*.62,-r*.95,r*.1);cx.fill()}
 if(sp.monkey){cx.fillStyle='#f0cfa0';cx.beginPath();cx.ellipse(-r*.3,r*.0,r*.42,r*.42,0,0,7);cx.ellipse(r*.3,r*.0,r*.42,r*.42,0,0,7);cx.ellipse(0,r*.36,r*.52,r*.46,0,0,7);cx.fill()}
 if(sp.stripe){cx.strokeStyle=dark(sp.c,.5);cx.lineWidth=r*.07;cx.lineCap='round';for(const sx of[-1,1]){for(let i=0;i<3;i++){cx.beginPath();cx.moveTo(sx*(r*.12+i*r*.14),-r*.92+i*r*.04);cx.lineTo(sx*(r*.14+i*r*.14),-r*.62+i*r*.04);cx.stroke()}}}
 if(sp.patch===1){cx.fillStyle=dark(sp.c,.28);cx.beginPath();cx.ellipse(r*.4,-r*.15,r*.26,r*.3,.2,0,7);cx.fill()}
 if(sp.critic){cx.fillStyle='#f4c8a0';cx.beginPath();cx.ellipse(0,r*.12,r*.86,r*.72,0,0,7);cx.fill()}
 if(sp.cook){cx.fillStyle='#ffc8a0';cx.beginPath();cx.ellipse(0,r*.12,r*.9,r*.76,0,0,7);cx.fill()}
 /* 이목구비 */
 if(sp.frog){for(const sx of[-1,1]){cx.fillStyle='#6cc86a';cx.strokeStyle=dark('#6cc86a',.35);cx.lineWidth=r*.05;cx.beginPath();cx.arc(sx*r*.42,-r*.7,r*.3,0,7);cx.fill();cx.stroke();cx.fillStyle='#fff';cx.beginPath();cx.arc(sx*r*.42,-r*.7,r*.2,0,7);cx.fill();cx.fillStyle='#2a1a12';cx.beginPath();cx.arc(sx*r*.42,-r*.68,mood==='h'||blink?r*.04:r*.1,0,7);cx.fill()}
  cx.strokeStyle='#2a6a2a';cx.lineWidth=r*.07;cx.lineCap='round';cx.beginPath();if(mood==='a'){cx.moveTo(-r*.5,r*.42);cx.quadraticCurveTo(0,r*.28,r*.5,r*.42)}else{cx.moveTo(-r*.55,r*.3);cx.quadraticCurveTo(0,r*(mood==='h'?.85:.62),r*.55,r*.3)}cx.stroke();
  cx.fillStyle='rgba(255,130,130,.45)';for(const sx of[-1,1]){cx.beginPath();cx.ellipse(sx*r*.62,r*.22,r*.16,r*.1,0,0,7);cx.fill()}}
 else{
  if(sp.mz){cx.fillStyle=sp.mz;cx.beginPath();cx.ellipse(0,r*.3,r*.42,r*.3,0,0,7);cx.fill()}
  eyes(r,mood,blink,sp);
  if(sp.peng){cx.fillStyle='#ffb83a';cx.beginPath();cx.moveTo(-r*.14,r*.12);cx.lineTo(r*.14,r*.12);cx.lineTo(0,r*.3);cx.closePath();cx.fill();cx.strokeStyle='#b87010';cx.lineWidth=r*.03;cx.stroke();if(mood==='h'){cx.fillStyle='#c0405a';cx.beginPath();cx.moveTo(-r*.1,r*.3);cx.lineTo(r*.1,r*.3);cx.lineTo(0,r*.4);cx.fill()}}
  else if(sp.critic||sp.cook){cx.fillStyle='#3a2a20';if(sp.critic){cx.beginPath();cx.moveTo(-r*.34,r*.28);cx.quadraticCurveTo(-r*.18,r*.18,0,r*.28);cx.quadraticCurveTo(r*.18,r*.18,r*.34,r*.28);cx.quadraticCurveTo(r*.18,r*.4,0,r*.34);cx.quadraticCurveTo(-r*.18,r*.4,-r*.34,r*.28);cx.fill()}
   mouth(r,mood,r*.5)}
  else{if(sp.nose){cx.fillStyle=sp.nose;cx.beginPath();cx.ellipse(0,r*.2,r*.1,r*.07,0,0,7);cx.fill()}mouth(r,mood,r*.36)}
  if(sp.wh){cx.strokeStyle='rgba(60,40,30,.55)';cx.lineWidth=r*.025;cx.lineCap='round';for(const sx of[-1,1])for(let i=0;i<2;i++){cx.beginPath();cx.moveTo(sx*r*.3,r*.3+i*r*.07);cx.lineTo(sx*r*.8,r*.22+i*r*.16);cx.stroke()}}
  cx.fillStyle='rgba(255,120,130,'+(mood==='h'?.5:.28)+')';for(const sx of[-1,1]){cx.beginPath();cx.ellipse(sx*r*.62,r*.2,r*.15,r*.09,0,0,7);cx.fill()}}
 if(sp.critic){cx.strokeStyle='#c89a30';cx.lineWidth=r*.06;cx.beginPath();cx.arc(r*.36,-r*.05,r*.2,0,7);cx.stroke();cx.beginPath();cx.moveTo(r*.5,r*.1);cx.quadraticCurveTo(r*.7,r*.5,r*.6,r*.9);cx.stroke();
  cx.fillStyle='#2a2a2a';cx.fillRect(-r*.7,-r*.95,r*1.4,r*.14);cx.beginPath();cx.roundRect(-r*.46,-r*1.55,r*.92,r*.66,r*.1);cx.fill();cx.fillStyle='#c0394a';cx.fillRect(-r*.46,-r*1.0,r*.92,r*.1)}
 if(sp.cook){cx.fillStyle='#fff';cx.strokeStyle='#d8d0c8';cx.lineWidth=r*.04;cx.beginPath();cx.roundRect(-r*.62,-r*1.0,r*1.24,r*.3,r*.1);cx.fill();cx.stroke();cx.beginPath();cx.arc(-r*.36,-r*1.22,r*.34,0,7);cx.arc(0,-r*1.42,r*.4,0,7);cx.arc(r*.36,-r*1.22,r*.34,0,7);cx.fill();cx.stroke();cx.fillStyle='#fff';cx.beginPath();cx.roundRect(-r*.62,-r*1.0,r*1.24,r*.3,r*.1);cx.fill()}
 cx.restore()}
/* ---------- 붕어빵 ---------- */
function fish2(x,y,z,col,o={}){cx.save();cx.translate(x,y+(o.dy||0));cx.scale(z*(o.sx||1),z*(o.sy===undefined?1:o.sy));if(o.rot)cx.rotate(o.rot);
 const rim=o.rim||dark(col,.5);
 if(o.glow){cx.shadowColor=o.glow;cx.shadowBlur=16}
 const body=()=>{cx.beginPath();cx.moveTo(34,0);cx.lineTo(58,-18);cx.quadraticCurveTo(54,0,58,18);cx.closePath();cx.moveTo(40,0);cx.ellipse(0,0,40,21,0,0,7)};
 const g=cx.createLinearGradient(0,-21,0,21);g.addColorStop(0,lite(col,.32));g.addColorStop(.5,col);g.addColorStop(1,dark(col,.18));
 cx.fillStyle=g;cx.strokeStyle=rim;cx.lineWidth=3;cx.lineJoin='round';
 cx.beginPath();cx.moveTo(34,0);cx.lineTo(58,-18);cx.quadraticCurveTo(54,0,58,18);cx.closePath();cx.fill();cx.stroke();cx.shadowBlur=0;
 cx.beginPath();cx.ellipse(0,0,40,21,0,0,7);cx.fill();cx.stroke();
 if(!o.plain){cx.strokeStyle='rgba(0,0,0,.2)';cx.lineWidth=1.6;cx.beginPath();for(let i=0;i<3;i++){for(let j=-1;j<=1;j++){cx.moveTo(-4+i*13,j*10-7);cx.arc(-8+i*13,j*10,8,-1.1,1.1)}}cx.stroke();
  cx.beginPath();cx.moveTo(44,-6);cx.lineTo(54,-12);cx.moveTo(45,0);cx.lineTo(56,0);cx.moveTo(44,6);cx.lineTo(54,12);cx.stroke();
  cx.strokeStyle='rgba(0,0,0,.28)';cx.lineWidth=2;cx.beginPath();cx.arc(-12,0,18,-1.2,1.2);cx.stroke();
  cx.fillStyle='rgba(255,255,255,.3)';cx.beginPath();cx.ellipse(-4,-12,22,5,-.05,0,7);cx.fill()}
 cx.fillStyle='#fff';cx.beginPath();cx.arc(-24,-6,5.2,0,7);cx.fill();cx.fillStyle='#2a1a12';cx.beginPath();cx.arc(-23.4,-5.6,3.2,0,7);cx.fill();cx.fillStyle='#fff';cx.beginPath();cx.arc(-24.4,-6.8,1.1,0,7);cx.fill();
 cx.restore()}
/* 붕어빵 틀 모양 (꾸미기 '틀 모양'): 0은 원래 붕어, 나머지는 같은 크기로 그려요 */
function shapePath(k){cx.beginPath();
 if(k===1)cx.ellipse(0,0,31,26,0,0,7);
 else if(k===2)cx.roundRect(-30,-24,60,48,10);
 else if(k===3){cx.moveTo(0,-29);cx.lineTo(34,25);cx.lineTo(-34,25);cx.closePath()}
 else if(k===4){cx.moveTo(0,26);cx.bezierCurveTo(-46,-2,-28,-38,0,-16);cx.bezierCurveTo(28,-38,46,-2,0,26);cx.closePath()}
 else if(k===5){for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?14:32;i?cx.lineTo(Math.cos(a)*r,Math.sin(a)*r+3):cx.moveTo(Math.cos(a)*r,Math.sin(a)*r+3)}cx.closePath()}
 else if(k===6){cx.arc(-19,-17,10,0,7);cx.moveTo(29,-17);cx.arc(19,-17,10,0,7);cx.moveTo(26,2);cx.arc(0,2,26,0,7)}
 else if(k===7){cx.moveTo(-20,10);cx.arc(-18,2,15,0,7);cx.moveTo(22,-6);cx.arc(0,-6,21,0,7);cx.moveTo(35,4);cx.arc(19,4,16,0,7);cx.moveTo(-34,8);cx.roundRect(-34,4,68,18,9)}
 else{cx.moveTo(-32,22);cx.lineTo(-32,-12);cx.lineTo(-16,4);cx.lineTo(0,-26);cx.lineTo(16,4);cx.lineTo(32,-12);cx.lineTo(32,22);cx.closePath()}}
function bread(x,y,z,col,o={}){const k=o.shp!==undefined?o.shp:OPT.shape();if(!k||k>8)return fish2(x,y,z,col,o);
 cx.save();cx.translate(x,y+(o.dy||0));cx.scale(z*(o.sx||1),z*(o.sy===undefined?1:o.sy));if(o.rot)cx.rotate(o.rot);
 const rim=o.rim||dark(col,.5);if(o.glow){cx.shadowColor=o.glow;cx.shadowBlur=16}
 const g=cx.createLinearGradient(0,-26,0,26);g.addColorStop(0,lite(col,.32));g.addColorStop(.5,col);g.addColorStop(1,dark(col,.18));
 cx.fillStyle=g;cx.strokeStyle=rim;cx.lineWidth=3;cx.lineJoin='round';shapePath(k);cx.fill();cx.shadowBlur=0;cx.stroke();
 if(!o.plain){cx.fillStyle='rgba(255,255,255,.3)';cx.beginPath();cx.ellipse(-6,-10,14,4,-.1,0,7);cx.fill();
  cx.strokeStyle='rgba(0,0,0,.18)';cx.lineWidth=1.6;cx.beginPath();cx.moveTo(-12,8);cx.lineTo(-4,8);cx.moveTo(4,8);cx.lineTo(12,8);cx.stroke()}
 cx.restore()}

/* ---------- 굽는 화면 (가게·챌린지 공용) ---------- */
const BST=[[0,[247,232,196]],[.5,[240,205,130]],[.85,[232,170,70]],[1,[222,140,40]],[1.15,[190,100,30]],[1.3,[130,66,24]],[1.5,[40,26,20]]];
function bakeCol(p){p=Math.max(0,Math.min(1.5,p));for(let i=1;i<BST.length;i++)if(p<=BST[i][0]){const a=BST[i-1],b=BST[i],t=(p-a[0])/(b[0]-a[0]);return'rgb('+a[1].map((v,k)=>Math.round(v+(b[1][k]-v)*t)).join(',')+')'}return'rgb(40,26,20)'}
function steam(x,y,k,p){for(let j=0;j<3;j++){const ph=(s.t*.8+j/3+k*.17)%1;cx.fillStyle='rgba(255,255,255,'+((1-ph)*.42*Math.min(1,p*3))+')';cx.beginPath();cx.ellipse(x-16+j*16+Math.sin(ph*6+j)*4,y-20-ph*26,4+ph*4,3+ph*3,0,0,7);cx.fill()}}
/* 틀 8칸: 2칸씩 4줄 (가로 205, 세로 66) */
const MW=205,MH=66,mpos=i=>({x:15+(i%2)*215,y:400+(i>>1)*72});
const QC={p:'#f0b850',o:'#ecae4a',g:'#e8aa46'};
function hit(x,y){if(y>=64&&y<330)return{k:'c',i:Math.max(0,Math.min(2,Math.floor(x/150)))};
 if(y>=400&&y<686){const rw=Math.floor((y-400)/72),i=rw*2+(x<225?0:1);if(rw<4&&y-400-rw*72<MH+4)return{k:'m',i};return null}
 if(y>=698){const n=run.nf;return{k:'f',i:Math.max(0,Math.min(n-1,Math.floor(x/(450/n))))}}return null}
function at(f){return f.a==='m'?{x:mpos(f.i).x+64,y:mpos(f.i).y+4}:{x:f.i*150+75,y:(STM?286:156)-(f.dy||0)}}
function mold(i){const X=mpos(i).x,Y=mpos(i).y;
 if(i>=BP2.nMold(run)){rr(X,Y,MW,MH,16,'rgba(60,40,30,.35)');em('🔒',X+MW/2,Y+MH/2,28,.8);return}
 const m=s.mold[i];let A=ui.ma[i];if(!A||A.s!==m.s){A=ui.ma[i]={s:m.s,t0:s.t}}const a=s.t-A.t0,tp=Math.max(0,1-(s.t-(ui.tp[i]===undefined?-9:ui.tp[i]))/.18);
 const ox=m.sh>0?Math.sin(s.t*70)*3:0,fx=X+64+ox,fy=Y+29,z0=.74,sc=z0*(1+.08*tp);
 rr(X,Y,MW,MH,16,'#5a4638');rr(X+4,Y+4,MW-8,MH-8,13,'#3f3029');let lab='',lc='#fff';
 const cav=()=>bread(fx,fy,z0,'#2c211c',{rim:'#6a5547',plain:true});
 if(m.s===0){cav();lab='빈 틀';if(s.d<=2)tx('톡!',fx,fy,20)}
 else if(m.s===1){cav();const f=Math.min(1,a/.35);cx.save();cx.beginPath();cx.rect(fx-40,fy+20-f*40,96,f*40+3);cx.clip();bread(fx,fy,sc,'#f6dfa0',{rim:'#b8905a',plain:true});cx.restore();
   if(a<.35){cx.fillStyle='#f6dfa0';cx.fillRect(fx-8,fy-30,5,30*Math.min(1,a/.12)+2)}else{cx.strokeStyle='rgba(255,255,255,.5)';cx.lineWidth=1.5;cx.beginPath();cx.ellipse(fx-3,fy-2,8+Math.sin(a*6)*1,4,0,0,7);cx.stroke()}lab='속 넣기'}
 else if(m.s===2){bread(fx,fy,sc,'#f6dfa0',{rim:'#b8905a',plain:true});const u=Math.min(1,a/.3),bz=1+.25*Math.sin(u*Math.PI);cx.fillStyle=BP2.R.menu[m.f].col;cx.strokeStyle='rgba(0,0,0,.25)';cx.lineWidth=1.5;cx.beginPath();cx.ellipse(fx-5,fy,13*u*bz,7*u*bz,0,0,7);cx.fill();cx.stroke();lab='덮개 톡!'}
 else if(m.s===5){bread(fx,fy,z0,'#2a1a12',{rim:'#000'});for(let j=0;j<3;j++){const ph=(s.t*.7+j/3)%1;cx.fillStyle='rgba(90,90,90,'+(.55*(1-ph))+')';cx.beginPath();cx.arc(fx-10+j*12+Math.sin(ph*5+j)*4,fy-14-ph*26,6+ph*6,0,7);cx.fill()}lab='치우기'}
 else{const M=BP2.R.menu[m.f],rd=m.p>=.85;let col=bakeCol(m.p),sy=1,dy=0;
  if(m.s===4&&a<.4){const ang=a/.4*Math.PI;sy=Math.cos(ang);dy=-Math.sin(ang)*18;if(ang<Math.PI/2)col='#e8aa46'}
  const Mw=BP2.wOf?BP2.wOf(run,m.f):M.w,inP=m.p>=1-Mw&&m.p<=1+Mw,glow=inP&&Math.floor(s.t*6)%2?'rgba(110,240,130,.95)':null;
  bread(fx,fy,sc,col,{sy:sy===0?.02:sy,dy,glow});
  if(!(m.s===4&&a<.4)){cx.fillStyle=M.col;cx.globalAlpha=.9;cx.beginPath();cx.arc(fx-11,fy+2,3,0,7);cx.fill();cx.globalAlpha=1}
  em(M.e,X+18,Y+17,18);lab=BP2.tossable(run,m)?'탔어요! 버리기':m.s===3?(rd?'뒤집어!':'앞면 굽는 중'):(rd?'꺼내!':'뒷면 굽는 중');steam(fx,fy,i,Math.min(1,m.p/.5));
  if(m.s===4&&m.qa==='p')em('✨',X+MW-16,Y+14,14);
  if(inP&&Math.floor(s.t*6)%2)lc='#8dffa0';if(m.p>=M.bad)lc='#ff8a80';
  const gx=X+12,gw=MW-24,gy=Y+MH-14,mx=M.burn,Z=[[0,.85,'#8a7a6a'],[.85,1-Mw,'#ffd23a'],[1-Mw,1+Mw,'#3fd46a'],[1+Mw,M.bad,'#ffd23a'],[M.bad,mx,'#e0503a']];
  for(const z of Z){cx.fillStyle=z[2];cx.fillRect(gx+gw*z[0]/mx,gy,gw*(z[1]-z[0])/mx,8)}rr(gx+gw*Math.min(m.p,mx)/mx-2,gy-3,4,14,2,'#fff')}
 tx(lab,X+146,Y+24,m.s>=3?16:18,lc,'center','#2a1a12');if(m.s===1||m.s===2)em(BP2.R.menu[s.sel].e,X+MW-24,Y+MH-22,20,m.s===1?.6:0)}
/* 손님 말풍선 (리액션) */
const RXP={p:['😍 최고예요!','🤩 PERFECT!','😍 이 맛이야!'],o:['😋 맛있어요!','😊 GREAT!','😋 좋아요!'],g:['🙂 고마워요','🙂 잘 먹을게요','🙂 GOOD']};
const HELLO={n:'안녕하세요!',reg:'또 왔어요 😊',hurry:'빨리 주세요! ⏱️',vip:'특별 주문이에요 👑',group:'단체 주문이요! 🚌',critic:'평가하러 왔소 🎩'};
function bub(x,y,t,bg='#fff',fg='#5a3a22'){cx.font='bold 13px "Jua","Noto Sans KR",sans-serif';const w=cx.measureText(t).width+16;rr(x-w/2,y-12,w,24,12,bg);cx.beginPath();cx.moveTo(x-5,y+11);cx.lineTo(x,y+18);cx.lineTo(x+5,y+11);cx.closePath();cx.fillStyle=bg;cx.fill();tx(t,x,y,13,fg,'center',bg)}
function custDraw(c,i){const x0=i*150;rr(x0+8,76,134,244,18,'rgba(255,255,255,.35)');if(!c)return;
 const lv=c.leave>0?1-c.leave/.8:0,a=Math.min(1,c.in)*(c.leave>0?Math.max(0,1-lv*lv):1);
 let ox=c.sh>0?Math.sin(s.t*70)*3:0,oy=0;const r=c.pat/c.max,ag=c.ag||0;
 if(c.leave>0&&c.angry)ox+=(i===2?1:-1)*lv*70;else if(c.leave>0&&c.happy)oy-=Math.sin(lv*Math.PI)*28+lv*20;
 else if(c.rxT>0){const u=1.4-c.rxT;oy-=Math.abs(Math.sin(u*12))*8*Math.max(0,1-u)}
 else if(r<.3)ox+=Math.sin(s.t*30)*1.6;
 cx.globalAlpha=a;
 const L=[];for(let f=0;f<6;f++)if(c.ord[f]>0)L.push(f);const hb=14+24*L.length;
 if(c.leave<=0){rr(x0+14,82,122,hb,14,'#fff');cx.beginPath();cx.moveTo(x0+62,82+hb);cx.lineTo(x0+75,82+hb+12);cx.lineTo(x0+88,82+hb);cx.closePath();cx.fillStyle='#fff';cx.fill();
  if(c.ty==='critic')tx('✨만!',x0+112,82+hb-9,13,'#c0392b','center','#fff');
  L.slice(0,6).forEach((f,k)=>{const rm=c.ord[f]-c.got[f],y=82+19+k*24;if(rm>0){em(BP2.R.menu[f].e,x0+44,y,22);tx('×'+rm,x0+90,y,22,'#6a3a1a','center','#fff')}else{em('✅',x0+44,y,20,.7)}})}
 const ay=262,ez=1-Math.pow(1-Math.min(1,c.in),3),mood=c.angry?'a':c.happy||c.rxT>0?'h':r<.3?'w':'n',X=x0+75+ox,Y=ay-22+(1-ez)*30+oy;
 if(c.an==='🧐')em('🧐',X,Y+12,64);else
 animal(c.an,X,Y,62,{t:s.t,ph:i*1.9+(c.an.codePointAt(0)%7),mood,shirt:{vip:'#b48aff',reg:'#7ed88a',hurry:'#ff9a6a',group:'#ffd23a',critic:'#3a3a4a'}[c.ty]||['#7ec8ff','#ff9ab0','#9ad870'][i%3],tilt:mood==='w'?Math.sin(s.t*9)*.04:c.rxT>0?Math.sin(s.t*14)*.06:0});
 const bd={vip:'👑',reg:'⭐',hurry:'⏱️',group:'🚌',critic:'🎩'}[c.ty];if(bd)em(bd,X-45,Y-36,26);
 /* 리액션 */
 const by=Y-52;
 if(c.leave>0&&c.angry){bub(X,by,'흥! 안 살래요 😤','#ffdcd6','#a0281a');em('💢',X+40,Y-8,22)}
 else if(c.leave>0&&c.happy){bub(X,by,c.ty==='critic'?'🎩 별 다섯 개!':'또 올게요! 💖','#ffe9f2','#a03060');for(let k=0;k<3;k++){const ph=(s.t*1.5+k/3)%1;em('💖',X-24+k*24,Y-20-ph*40,14,1-ph)}}
 else if(c.nb>0)bub(X,by,c.nbt||'아직 없어요? 🥺','#ffefd6','#8a4a10');
 else if(c.rxT>0){const q=c.rxQ||'g',L2=RXP[q]||RXP.g;let w=L2[(c.an.codePointAt(0)+(c.rxN|0))%L2.length];if(c.ty==='critic'&&q==='p')w='🎩 브라보!';bub(X,by,w,q==='p'?'#fff3b0':'#fff',q==='p'?'#a06000':'#5a3a22');if(q==='p'&&c.rxT>1)em('✨',X+36,Y-24,18)}
 else if(ag<1.8&&ez>=1)bub(X,by,HELLO[c.ty]||HELLO.n);
 else if(r<.3){bub(X,by,c.ty==='hurry'?'빨리요!! 😫':'아직이에요? 😥','#ffefd6');em('💦',X+30,Y-20+Math.sin(s.t*8)*3,18)}
 else if(r<.5&&c.ty==='hurry')em('💦',X+30,Y-20+Math.sin(s.t*8)*3,16);
 if(c.leave<=0){rr(x0+20,303,110,9,4,'rgba(0,0,0,.25)');rr(x0+20,303,110*Math.max(0,r),9,4,r>.5?'#7ed88a':r>.25?'#ffd23a':'#ff6a5a')}cx.globalAlpha=1}
/* ---------- 가게 앞 거리 (원근감): 손님이 멀리서 걸어와 카운터 앞에 서요 ---------- */
const HZ=112,NEAR=240,SLX=[75,225,375],WALK=1.1;
const dep=d=>({y:HZ+18+(NEAR-HZ-18)*d,k:.34+.66*d});
const SHIRT=c=>({vip:'#b48aff',reg:'#7ed88a',hurry:'#ff9a6a',group:'#ffd23a',critic:'#3a3a4a'}[c.ty]||['#7ec8ff','#ff9ab0','#9ad870'][(c.an.codePointAt(0))%3]);
function streetBg(o){const t=s.t,lc=BP2.L(run),wea=s.wea.e;
 const sky=cx.createLinearGradient(0,64,0,HZ+20);const sc=wea==='🌧️'?['#9fb0c8','#d6dde8']:wea==='❄️'?['#c8d6e8','#f2f6fb']:['#8fd0ff','#e6f6ff'];sky.addColorStop(0,sc[0]);sky.addColorStop(1,sc[1]);cx.fillStyle=sky;cx.fillRect(0,64,450,HZ-44);
 if(wea==='☀️'){cx.fillStyle='rgba(255,255,255,.85)';for(let i=0;i<3;i++){const x=m2(t*6+i*170,560)-60,y=82+i*9;cx.beginPath();cx.ellipse(x,y,26,8,0,0,7);cx.ellipse(x+16,y-5,16,7,0,0,7);cx.fill()}}
 /* 건물 줄 (지평선) */
 const BC=[lite(lc.wall,.1),dark(lc.wall,.12),'#e9d7c0','#d9c7e8','#cfe3d2','#f2d0c0'];
 for(let i=0;i<9;i++){const w=46+(i*37)%30,h=26+(i*53)%34,x=-10+i*54;cx.fillStyle=BC[i%BC.length];cx.fillRect(x,HZ+20-h,w,h);cx.fillStyle='rgba(255,255,255,.55)';for(let r=0;r<2;r++)for(let q=0;q<3;q++)if((i+r+q)%3)cx.fillRect(x+6+q*13,HZ+24-h+r*12,7,7);cx.fillStyle='rgba(0,0,0,.08)';cx.fillRect(x,HZ+20-h,w,3)}
 /* 인도 + 길 */
 const g=cx.createLinearGradient(0,HZ+18,0,330);g.addColorStop(0,'#cbbfae');g.addColorStop(1,'#e8dccb');cx.fillStyle=g;cx.fillRect(0,HZ+18,450,330-HZ-18);
 cx.fillStyle='#9a9590';cx.beginPath();cx.moveTo(196,HZ+18);cx.lineTo(254,HZ+18);cx.lineTo(450,HZ+64);cx.lineTo(0,HZ+64);cx.closePath();cx.fill();
 cx.strokeStyle='rgba(255,255,255,.7)';cx.lineWidth=2;cx.setLineDash([10,9]);cx.lineDashOffset=0;cx.beginPath();cx.moveTo(225,HZ+20);cx.lineTo(225,HZ+62);cx.stroke();cx.setLineDash([]);
 cx.strokeStyle='rgba(120,100,80,.18)';cx.lineWidth=1.5;for(let i=-6;i<=6;i++){cx.beginPath();cx.moveTo(225+i*16,HZ+64);cx.lineTo(225+i*80,330);cx.stroke()}
 for(let r=0;r<5;r++){const y=HZ+64+(r*r+r)*6;cx.beginPath();cx.moveTo(0,y);cx.lineTo(450,y);cx.stroke()}
 /* 가로등 */
 for(const sx of[-1,1]){const x=225+sx*150;cx.fillStyle='#5a5048';cx.fillRect(x-2,HZ-18,4,58);cx.fillStyle=wea==='❄️'||wea==='🌧️'?'#ffe9a0':'#fff6d0';cx.beginPath();cx.arc(x,HZ-20,6,0,7);cx.fill()}
 /* 지나가는 사람들 (꾸밈) */
 for(let i=0;i<3;i++){const sp=18+i*7,dir=i%2?-1:1,u=m2(t*sp+i*190,560)-55,x=dir>0?u:450-u,y=HZ+40+i*7;const an=BP2.R.an[(i*5+3)%12];
  cx.globalAlpha=.8;animal(an,x,y-Math.abs(Math.sin(t*8+i))*2,20+i*3,{t,ph:i,mood:'n',shirt:['#c8b0e0','#b0d8c0','#f0c0a0'][i]});cx.globalAlpha=1}
 /* 줄 서서 기다리는 손님: 세 자리가 다 찼을 때 */
 const full=s.cust.every(c=>c&&c.leave<=0);if(full){const n=1+Math.floor(m2(s.t*.15,1)*2);for(let k=0;k<n;k++){const d=.22-k*.08,p=dep(d),x=225+(k?-22:18);animal(BP2.R.an[(s.d*3+k*7)%12],x,p.y+Math.sin(t*3+k)*1.5,62*p.k,{t,ph:k*2,mood:'n',shirt:['#e8c0a0','#b8d0f0'][k]})}
  bub(225,dep(.22).y-34,'줄 서는 중…','rgba(255,255,255,.9)','#7a5a3a')}
}
/* 거리 버전 손님: 걸어와서(ag) 카운터 앞에 서고, 떠날 때 걸어가요 */
function custStreet(c,i){if(!c)return;const ag=c.ag||0,R=BP2.R;
 let d=Math.min(1,ag/WALK);d=1-Math.pow(1-d,2);
 const lv=c.leave>0?1-c.leave/.8:0,r=c.pat/c.max;let x,y,k,a=1;
 const sx=SLX[i],fx=225+(sx-225)*.25;
 if(c.leave>0&&c.happy){const e=lv;const p=dep(1-e*.7);k=p.k;y=p.y-Math.abs(Math.sin(e*14))*6*(1-e);x=sx+(sx===225?70:(sx-225)*.55)*e;a=1-e*e}
 else if(c.leave>0&&c.angry){const p=dep(1-lv*.6);k=p.k;y=p.y-Math.abs(Math.sin(lv*20))*4;x=sx+(sx===225?-70:(sx-225)*.55)*lv+Math.sin(s.t*40)*2;a=1-lv*lv}
 else{const p=dep(d);k=p.k;y=p.y-(d<1?Math.abs(Math.sin(ag*11))*5:0);x=fx+(sx-fx)*d;
  if(c.rxT>0){const u=1.4-c.rxT;y-=Math.abs(Math.sin(u*12))*8*Math.max(0,1-u)}else if(r<.3)x+=Math.sin(s.t*30)*1.6;if(c.sh>0)x+=Math.sin(s.t*70)*3}
 const sz=62*k,arrived=d>=1&&c.leave<=0;
 cx.globalAlpha=a*.25;cx.fillStyle='#000';cx.beginPath();cx.ellipse(x,y+sz*.86,sz*.42,sz*.1,0,0,7);cx.fill();cx.globalAlpha=a;
 const mood=c.angry?'a':c.happy||c.rxT>0?'h':r<.3?'w':'n';
 if(c.an==='🧐')em('🧐',x,y+sz*.2,sz*1.05);else animal(c.an,x,y,sz,{walk:(c.leave>0||!arrived)?s.t*11+i:null,t:s.t,ph:i*1.9+(c.an.codePointAt(0)%7),mood,shirt:SHIRT(c),tilt:mood==='w'?Math.sin(s.t*9)*.04:c.rxT>0?Math.sin(s.t*14)*.06:0});
 const bd={vip:'👑',reg:'⭐',hurry:'⏱️',group:'🚌',critic:'🎩'}[c.ty];if(bd)em(bd,x-sz*.72,y-sz*.58,26*k);
 /* 주문 말풍선: 도착하면 */
 if(c.leave<=0&&d>.75){const L=[];for(let f=0;f<6;f++)if(c.ord[f]>0)L.push(f);const hb=12+22*L.length,bx=sx-58,top=Math.max(80,y-sz*.62-hb-40);cx.globalAlpha=Math.min(1,(d-.75)*4);
  rr(bx,top,116,hb,14,'#fff');cx.beginPath();cx.moveTo(sx-10,top+hb);cx.lineTo(sx,top+hb+10);cx.lineTo(sx+10,top+hb);cx.closePath();cx.fillStyle='#fff';cx.fill();
  if(c.ty==='critic')tx('✨만!',bx+98,top+hb-9,12,'#c0392b','center','#fff');
  L.slice(0,6).forEach((f,q)=>{const rm=c.ord[f]-c.got[f],yy=top+17+q*22;if(rm>0){em(R.menu[f].e,bx+30,yy,20);tx('×'+rm,bx+72,yy,20,'#6a3a1a','center','#fff')}else em('✅',bx+30,yy,18,.7)});cx.globalAlpha=a}
 /* 리액션 말풍선 */
 const by=y-sz*.62-16;
 if(c.leave>0&&c.angry){bub(x,by,'흥! 안 살래요 😤','#ffdcd6','#a0281a');em('💢',x+sz*.6,y-sz*.2,22)}
 else if(c.leave>0&&c.happy){bub(x,by,c.ty==='critic'?'🎩 별 다섯 개!':'또 올게요! 💖','#ffe9f2','#a03060');for(let q=0;q<3;q++){const ph=(s.t*1.5+q/3)%1;em('💖',x-20+q*20,y-sz*.3-ph*36,13,1-ph)}}
 else if(arrived&&c.nb>0)bub(x,by,c.nbt||'아직 없어요? 🥺','#ffefd6','#8a4a10');
 else if(arrived&&c.rxT>0){const q=c.rxQ||'g',L2=RXP[q]||RXP.g;let w=L2[(c.an.codePointAt(0)+(c.rxN|0))%L2.length];if(c.ty==='critic'&&q==='p')w='🎩 브라보!';bub(x,by,w,q==='p'?'#fff3b0':'#fff',q==='p'?'#a06000':'#5a3a22');if(q==='p'&&c.rxT>1)em('✨',x+sz*.6,y-sz*.3,18)}
 else if(!arrived&&c.leave<=0&&d>.3){if(d<1)bub(x,by,HELLO[c.ty]||HELLO.n,'rgba(255,255,255,.92)')}
 else if(arrived&&ag<WALK+1.2)bub(x,by,HELLO[c.ty]||HELLO.n);
 else if(arrived&&r<.3){bub(x,by,c.ty==='hurry'?'빨리요!! 😫':'아직이에요? 😥','#ffefd6');em('💦',x+sz*.5,y-sz*.25+Math.sin(s.t*8)*3,18)}
 else if(arrived&&r<.5&&c.ty==='hurry')em('💦',x+sz*.5,y-sz*.25+Math.sin(s.t*8)*3,16);
 if(arrived){rr(sx-55,312,110,8,4,'rgba(0,0,0,.25)');rr(sx-55,312,110*Math.max(0,r),8,4,r>.5?'#7ed88a':r>.25?'#ffd23a':'#ff6a5a')}
 cx.globalAlpha=1}
/* 접시 줄: 맛마다 개수, ✨완벽·👍좋음 */
function rackRow(){const B=BP2,R=B.R,nf=run.nf,rw=(450-50)/nf,lv=B.rackLv(run),cap=B.rackCap(run);
 tx('접시',24,338,14,'#fff','center','#7a4a22');tx(lv>=2?'맛별10':s.rack.length+'/'+cap,24,358,lv>=2?11:13,s.rack.length>=cap&&lv<2?'#ff9a8a':'#ffe9a0','center','#7a4a22');
 for(let f=0;f<nf;f++){let ps=0,os=0,n=0;for(const r of s.rack)if(r.f===f){n++;if(r.q==='p')ps++;else if(r.q==='o')os++}const rx=48+f*rw+rw/2,sm=nf>4;
  rr(rx-rw/2+3,346,rw-6,42,12,lv>=2&&n>=10?'rgba(255,120,100,.35)':'rgba(255,255,255,.28)');
  bread(rx-rw/2+(sm?18:22),362,sm?.24:.3,n?(ps?QC.p:QC.g):'rgba(60,40,30,.5)',{plain:true,rim:n?undefined:'rgba(0,0,0,.2)'});em(R.menu[f].e,rx-rw/2+(sm?34:46),354,sm?12:16);
  tx('×'+n,rx+rw/2-(sm?14:20),362,sm?15:20,'#fff');let q='';if(ps)q+='✨'+ps;if(os)q+=(q?' ':'')+'👍'+os;if(q)tx(q,rx,381,sm?10:12,'#ffe066','center','#7a4a22')}}
/* 아래 맛 고르기 */
function menuBar(){const B=BP2,R=B.R,n=run.nf,bw=(450-20-(n-1)*6)/n;for(let i=0;i<n;i++){const x=10+i*(bw+6),sel=s.sel===i,M=R.menu[i],lv=B.fuLv(run,i);rr(x,700,bw,88,16,sel?'#ffd76a':'#fff');if(sel){cx.lineWidth=4;cx.strokeStyle='#e8584a';cx.beginPath();cx.roundRect(x,700,bw,88,16);cx.stroke()}
  em(M.e,x+bw/2,722,n>4?26:30);if(lv)tx('★'+lv,x+bw-10,712,11,'#ff8a2a','right','#fff');tx(M.n,x+bw/2,748,n>4?12:14,'#5a3a22','center','#fff');tx(B.fmt(B.price(run,i)),x+bw/2,768,n>4?12:14,'#5a3a22','center','#fff');tx('재료 '+B.fmt(M.c),x+bw/2,782,10,'#a4701f','center','#fff')}}
function hints(){if(s.d>2||s.ph!=='play'||s.noHint)return;let h='';const B=BP2,act=s.mold.slice(0,B.nMold(run));
 if(act.some(m=>(m.s===3||m.s===4)&&m.p>=1-B.R.menu[m.f].w&&m.p<=1+B.R.menu[m.f].w))h='✨ 초록 구간에 누르면 PERFECT! (한 면만 맞으면 GREAT)';
 else if(s.rack.length&&s.cust.some(c=>c))h='완성된 붕어빵은 손님을 톡! 해서 줘요';
 else if(act.some(m=>m.s===2))h='③ 덮개를 톡! 굽기 시작';else if(act.some(m=>m.s===1))h='② 아래에서 맛을 고르고 틀을 톡';
 else if(act.some(m=>m.s===0))h=run.up.auto?'빈 틀을 톡!':'① 빈 틀을 톡! 반죽을 부어요';if(h)tx(h,225,692,14,'#fff0c8','center','#4a3020')}
function weather(){if(s.wea.e==='🌧️'){cx.strokeStyle='rgba(120,160,220,.55)';cx.lineWidth=2;cx.beginPath();for(let i=0;i<24;i++){const x=m2(i*47-s.t*60,470)-10,y=m2(i*131+s.t*500,700)+64;cx.moveTo(x,y);cx.lineTo(x-4,y+14)}cx.stroke()}
 else if(s.wea.e==='❄️'){cx.fillStyle='rgba(255,255,255,.85)';for(let i=0;i<22;i++){const x=m2(i*53+Math.sin(s.t*2+i)*14,460),y=m2(i*97+s.t*70,700)+64;cx.beginPath();cx.arc(x,y,2.6,0,7);cx.fill()}}}
function fxDraw(){for(const q of ui.rg){const u=1-q.l/.5;cx.strokeStyle='rgba(90,230,120,'+(1-u)+')';cx.lineWidth=5*(1-u)+1;cx.beginPath();cx.arc(q.x,q.y,18+u*46,0,7);cx.stroke();for(let k=0;k<6;k++){const a=k/6*6.28+u;em('✦',q.x+Math.cos(a)*(20+u*50),q.y+Math.sin(a)*(20+u*50),14,1-u)}}
 for(const f of ui.fly){const u=Math.min(1,f.t),e=1-Math.pow(1-u,3),x=f.x0+(f.x1-f.x0)*e,y=f.y0+(f.y1-f.y0)*e-Math.sin(u*Math.PI)*60;bread(x,y,.42-.14*u,QC[f.q]||QC.g,{rot:u*6.28,plain:true,glow:f.q==='p'?'#ffe066':null})}
 for(const c of ui.coin){const u=Math.min(1,c.t),e=u*u*(3-2*u),x=c.x+(c.x1-c.x)*e,y=c.y+(c.y1-c.y)*e-Math.sin(u*Math.PI)*40;em('🪙',x,y,20,1)}
 for(const q of ui.pa)em(q.e,q.x,q.y,q.s,Math.min(1,q.l*2));
 for(const q of ui.ft){cx.globalAlpha=Math.min(1,q.l*2);tx(q.t,q.x,q.y,22,q.c);cx.globalAlpha=1}}
/* 마감 시간 바: 남은 초를 크게 보여 주고 10초 전에 알려요 */
function timeBar(){const R=BP2.R,rem=Math.max(0,R.len-s.t),tr=rem/R.len,sec=Math.ceil(rem),hot=rem<=10&&s.ph==='play',bl=hot&&Math.floor(s.t*4)%2;
 if(hot&&!ui.w10){ui.w10=1;OPT.toast('⏰ 10초 남았어요! 곧 마감!');OPT.snd('ready')}
 rr(0,58,450,16,0,'rgba(40,24,14,.55)');rr(0,58,450*tr,16,0,hot?(bl?'#ff3a2a':'#ff8a5a'):s.rushed?'#ff9a4a':'#7ec8ff');
 tx(s.ph==='end'?'🌙 영업 종료':'⏰ 마감까지 '+sec+'초',225,66,hot?16:14,'#fff','center',hot?'#a01a10':'#3a2a1a');
 /* 콤보: 손님 주문을 가리지 않게 시간 줄 오른쪽 끝에 */
 if(STM&&s.combo>=2){rr(330,58,120,16,0,'#d0501f');tx('🔥 콤보 ×'+s.combo+' +'+Math.round(Math.min(.5,s.combo*.05)*100)+'%',390,66,13,'#fff0a0','center','#7a2a0f')}}
/* 화면 전체: o.bg() 배경, o.head() 위쪽 줄, o.mid() 손님 아래 장식, o.sub 시작 배너 둘째 줄 */
let STM=false;
function drawPlay(o){STM=!!o.street;const B=BP2,R=B.R,t=performance.now()/1000;cx.save();if(ui.shake>0){const k=ui.shake/.3*4;cx.translate((Math.random()-.5)*k,(Math.random()-.5)*k)}
 o.bg(t);o.head(t);
 if(o.street){streetBg(o);if(o.front)o.front(t);const ord=[0,1,2].sort((p,q)=>((s.cust[p]&&s.cust[p].ag)||9)-((s.cust[q]&&s.cust[q].ag)||9));for(const i of ord)custStreet(s.cust[i],i)}else s.cust.forEach((c,i)=>custDraw(c,i));if(o.mid)o.mid(t);
 if(s.combo>=2&&!o.street)tx('🔥 콤보 ×'+s.combo+' (+'+Math.round(Math.min(.5,s.combo*.05)*100)+'%)',225,316,18,'#fff0a0','center','#a4401f');
 rackRow();for(let i=0;i<B.MOLDS;i++)mold(i);
 {const pg=Math.max(0,Math.min(1,(s.t/R.len-.55)/.45));if(pg>0){cx.fillStyle='rgba(255,140,50,'+(.2*pg)+')';cx.fillRect(0,64,450,640)}const vg=cx.createRadialGradient(225,380,260,225,380,520);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(40,20,10,.28)');cx.fillStyle=vg;cx.fillRect(0,64,450,640)}
 hints();menuBar();weather();if(o.fx)o.fx(t);fxDraw();
 if(s.ban>0){cx.globalAlpha=Math.min(1,s.ban);rr(40,330,370,120,24,'rgba(90,58,34,.85)');tx((o.title||s.d+'일차 시작!')+' '+s.wea.e,225,362,30);tx(o.sub,225,400,19,'#ffe9a0');if(s.ev)tx(R.ev[s.ev].e+' '+R.ev[s.ev].n+' · '+R.ev[s.ev].d,225,428,15,'#ffe066');else tx(s.wea.sp>1?'손님이 많아요!':s.wea.sp<1?'손님이 적어요, 팁은 두둑해요':'평범한 하루',225,428,16,'#fff');cx.globalAlpha=1}
 if(ui.rb>0)tx('🔥 퇴근 시간 피크! 손님이 몰려와요',225,120,22,'#fff0a0','center','#c0392b');
 timeBar();comboFx(t);if(s.ph==='end')tx('🌙 영업 종료!',225,380,52,'#fff','center','#8a5a3a');cx.restore()}
/* 🔥 콤보 5·10·20: 화면 테두리가 달아올라요 */
function comboFx(t){const c=s.combo|0;if(c>=5&&s.ph==='play'){const tier=c>=20?2:c>=10?1:0,col=[[255,150,40],[255,70,90],[190,90,255]][tier],pu=.55+.45*Math.sin(t*(6+tier*3)),w=8+tier*5;
  for(let k=0;k<3;k++){cx.strokeStyle='rgba('+col.join(',')+','+(pu*(.5-k*.15))+')';cx.lineWidth=w-k*3;cx.strokeRect(w/2+k*2,64+w/2+k*2,450-w-k*4,800-64-w-k*4)}
  if(tier===2){cx.strokeStyle='hsla('+((t*200)%360)+',90%,65%,'+pu*.6+')';cx.lineWidth=3;cx.strokeRect(2,66,446,732)}}
 if(ui.cb&&ui.cb.l>0){const u=1-ui.cb.l/1.3,k=u<.15?u/.15*1.25:1.25-.25*Math.min(1,(u-.15)/.2);cx.save();cx.globalAlpha=Math.min(1,ui.cb.l*2);cx.translate(225,470);cx.scale(k,k);tx('🔥 콤보 '+ui.cb.n+'!',0,0,44,ui.cb.n>=20?'#e0b0ff':ui.cb.n>=10?'#ffb0b8':'#ffd890','center','#7a2a0f');cx.restore()}}
/* 탭 처리 공용: 손님/틀/맛. 꺼낸 빵은 접시로 날아가요 */
function tapPlay(x,y){const B=BP2,h=hit(x,y);if(!h)return null;
 if(h.k==='c')B.serve(s,run,h.i);
 else if(h.k==='m'){const i=h.i;if(i<B.nMold(run)){const m=s.mold[i],pre=m.s,pr=s.rack.length,f=m.f;ui.tp[i]=s.t;B.moldTap(s,run,i);if(m.s===3&&pre!==3&&pre!==4)OPT.snd('sizzle');if(pre===4&&m.s===0&&s.rack.length>pr){const it=s.rack[s.rack.length-1],rw=(450-50)/run.nf;ui.fly.push({x0:mpos(i).x+64,y0:mpos(i).y+29,x1:48+f*rw+30,y1:362,t:0,q:it.q})}}}
 else B.selFl(s,run,h.i);return h}
/* 효과 큐 처리 공용 */
function drainFx(){const q=s.fx;s.fx=[];for(const f of q){
 if(f.k==='snd'){OPT.snd(f.n);if(f.n==='burn')ui.shake=.3}else if(f.k==='toast')OPT.toast(f.t);else if(f.k==='rx'){const c=s.cust[f.i];if(c){if(f.q){c.rxT=1.4;c.rxQ=f.q;c.rxN=(c.rxN|0)+1}}}else if(f.k==='rush')ui.rb=2.2;else if(f.k==='nob'){const c=s.cust[f.i];if(c){c.nb=1.3;c.nbt=f.t}}else if(f.k==='asrv'){const p=at({a:'c',i:f.i});ui.ft.push({t:'🙋 척척!',x:p.x,y:p.y-10,c:'#bfe8ff',l:.9})}
 else if(f.k==='ft'){const p=at(f);ui.ft.push({t:f.t,x:p.x,y:p.y,c:f.c,l:1.1});if(f.t.indexOf('PERFECT')===0){ui.rg.push({x:p.x,y:p.y+24,l:.5});ui.shake=Math.max(ui.shake,.14);if(window.AUDIO)AUDIO.vib(18)}if(/^\+\d/.test(f.t)&&f.a==='c'&&ui.coin.length<14)ui.coin.push({x:p.x,y:p.y,x1:366,y1:18,t:0})}
 else if(f.k==='pf'){if(ui.pa.length>40)continue;const p=at(f);for(let i=0;i<f.n;i++)ui.pa.push({e:f.e,x:p.x+(Math.random()*24-12),y:p.y+24,vx:Math.random()*80-40,vy:-40-Math.random()*70,l:.5+Math.random()*.4,s:18+Math.random()*10})}}}
/* 매 프레임 효과 움직이기 */
function tickFx(dt){for(const q of ui.rg)q.l-=dt;ui.rg=ui.rg.filter(q=>q.l>0);if(ui.cb)ui.cb.l-=dt;
 if(s){const cb=s.combo|0;for(const T of[5,10,20])if(cb>=T&&(ui.lc|0)<T){ui.cb={n:T,l:1.3};OPT.snd('combo');if(window.AUDIO)AUDIO.vib(30)}ui.lc=cb}
 if(s)for(const c of s.cust)if(c){if(c.ag==null&&!s.noHint)OPT.snd('hi');c.ag=(c.ag||0)+dt;if(c.nb>0)c.nb-=dt;if(c.rxT>0)c.rxT-=dt}for(const q of ui.ft){q.y-=40*dt;q.l-=dt}ui.ft=ui.ft.filter(q=>q.l>0);for(const q of ui.pa){q.x+=q.vx*dt;q.y+=q.vy*dt;q.vy+=200*dt;q.l-=dt}ui.pa=ui.pa.filter(q=>q.l>0);if(ui.rb>0)ui.rb-=dt;if(ui.shake>0)ui.shake-=dt;if(ui.hud>0)ui.hud-=dt;for(const f of ui.fly)f.t+=dt/.4;ui.fly=ui.fly.filter(f=>f.t<1);for(const c of ui.coin){c.t+=dt/.6;if(c.t>=1)ui.hud=.2}ui.coin=ui.coin.filter(c=>c.t<1)}
const newUi=()=>({ft:[],pa:[],rb:0,ma:[],tp:[],fly:[],coin:[],shake:0,hud:0,rg:[],cb:null,lc:0});

return{use,E,em,tx,rr,m2,fish,rgbOf,mix,lite,dark,animal,fish2,shapePath,bread,bakeCol,steam,mold,custDraw,mpos,hit,at,rackRow,menuBar,hints,weather,fxDraw,timeBar,drawPlay,tapPlay,drainFx,tickFx,newUi,QC}};
/* 손님 동물 그림 (img/an_*.webp, AI 일러스트) */
ART_LOAD({'🐶':'img/an_dog.webp','🐱':'img/an_cat.webp','🐰':'img/an_rabbit.webp','🐻':'img/an_bear.webp','🐼':'img/an_panda.webp','🦊':'img/an_fox.webp','🐯':'img/an_tiger.webp','🐸':'img/an_frog.webp','🐵':'img/an_monkey.webp','🐧':'img/an_penguin.webp','🐹':'img/an_hamster.webp','🦁':'img/an_lion.webp'});
