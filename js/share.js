/* ===== 자랑하기: 그림 카드 만들기 + 공유 (챌린지·가게 공용) =====
   SHARE.challenge({nick,stage,net,rank,wk,url}) / SHARE.shop({name,lv,sc,lk,snap,url}) → 카드 캔버스를 만들고 공유 창을 열어요.
   공유가 안 되는 브라우저(카톡 안 브라우저 등)는 카드 그림 + '길게 눌러 저장' + 링크 복사로 대신해요. */
const SHARE=(()=>{
const F='"Jua","Noto Sans KR","Malgun Gothic","Apple SD Gothic Neo",sans-serif',E='"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
const IM=k=>{const i=window.ART_IMG&&window.ART_IMG[k];return i&&i.complete&&i.naturalWidth?i:null};
function rr(c,x,y,w,h,r,f){c.beginPath();c.roundRect(x,y,w,h,r);c.fillStyle=f;c.fill()}
function tx(c,t,x,y,z,col,al='center',st=null,sw=0){c.font='bold '+z+'px '+F;c.textAlign=al;c.textBaseline='middle';if(st){c.lineWidth=sw||z/6;c.strokeStyle=st;c.lineJoin='round';c.strokeText(t,x,y)}c.fillStyle=col;c.fillText(t,x,y)}
function em(c,e,x,y,z){c.font=z+'px '+E;c.textAlign='center';c.textBaseline='middle';c.fillText(e,x,y)}
function base(c,W,H,top,bot){const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,top);g.addColorStop(1,bot);c.fillStyle=g;c.fillRect(0,0,W,H);
 c.fillStyle='rgba(255,255,255,.18)';for(let i=0;i<18;i++){c.beginPath();c.arc((i*173)%W,(i*311)%H,10+(i*7)%22,0,7);c.fill()}}
function chars(c,list,y,h,W){const ims=list.map(IM).filter(Boolean);if(!ims.length)return;const gap=W/(ims.length+1);
 ims.forEach((im,i)=>{const hh=h*(i===Math.floor(ims.length/2)?1.08:.92),ww=hh*im.naturalWidth/im.naturalHeight;c.drawImage(im,gap*(i+1)-ww/2,y-hh+(i%2?8:0),ww,hh)})}
function foot(c,W,H,url){rr(c,60,H-128,W-120,84,42,'rgba(255,255,255,.92)');tx(c,url.replace(/^https?:\/\//,'').replace(/\/$/,''),W/2,H-86,34,'#8a4a1a')}
function challenge(o){const W=1080,H=1350,cv=document.createElement('canvas');cv.width=W;cv.height=H;const c=cv.getContext('2d');
 base(c,W,H,'#ff9a52','#ffe2b0');
 tx(c,'🔥 붕어빵 챌린지',W/2,96,64,'#fff8ec','center','#a8461a',12);tx(c,'이번 주 판 #'+o.wk,W/2,170,34,'#7a3410');
 rr(c,90,226,W-180,590,48,'rgba(255,255,255,.94)');
 tx(c,'🙂 '+o.nick,W/2,300,48,'#5a3a22');
 tx(c,o.stage+'단계',W/2,440,170,'#ff7a2a','center','#7a3410',14);
 tx(c,o.rank?'🏆 이번 주 '+o.rank:'이번 주 도전 중!',W/2,575,58,'#c0601a');
 tx(c,'누적 순수익 '+String(o.net).replace(/\B(?=(\d{3})+(?!\d))/g,',')+'원',W/2,650,36,'#8a6a4a');
 rr(c,170,700,W-340,90,45,'#5a3a22');tx(c,'내 기록을 넘어 봐! 😎',W/2,745,46,'#fff6d0');
 chars(c,['🐱','🐰','cook','🐶','🦊'],1190,340,W);
 foot(c,W,H,o.url);return cv}
function shop(o){const W=1080,H=1350,cv=document.createElement('canvas');cv.width=W;cv.height=H;const c=cv.getContext('2d');
 base(c,W,H,'#8fd0ff','#fff1dc');
 tx(c,'🏪 '+o.name,W/2,100,72,'#fff8ec','center','#3a6a8a',12);tx(c,'Lv'+o.lv+' · ✨ 꾸미기 '+String(o.sc).replace(/\B(?=(\d{3})+(?!\d))/g,',')+(o.lk?' · ❤️ '+o.lk:''),W/2,178,38,'#2a4a6a');
 rr(c,60,226,W-120,820,40,'#fff');
 if(o.snap){const s=o.snap,k=Math.min((W-150)/s.width,790/s.height),w=s.width*k,h=s.height*k;c.save();c.beginPath();c.roundRect(75,241,W-150,790,30);c.clip();c.drawImage(s,(W-w)/2,241+(790-h)/2,w,h);c.restore()}
 rr(c,170,1080,W-340,96,48,'#5a3a22');tx(c,'내 가게 구경 와! 🐟',W/2,1128,48,'#fff6d0');
 foot(c,W,H,o.url);return cv}
/* ---------- 공유 ---------- */
let ov=null;
function overlay(cv,text,url){if(!ov){ov=document.createElement('div');ov.style.cssText='position:absolute;inset:0;background:rgba(40,24,14,.72);z-index:50;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:16px;box-sizing:border-box';(document.getElementById('box')||document.body).appendChild(ov)}
 ov.innerHTML='';const im=document.createElement('img');im.src=cv.toDataURL('image/jpeg',.9);im.style.cssText='width:300px;border-radius:18px;box-shadow:0 6px 20px rgba(0,0,0,.4);user-select:auto;-webkit-user-select:auto;-webkit-touch-callout:default';
 const p=document.createElement('div');p.style.cssText='color:#fff;font-size:16px;text-align:center;line-height:1.45';p.innerHTML='그림을 <b>길게 눌러 저장</b>한 뒤 카톡에 보내 주세요<br>링크도 같이 보내면 바로 들어와요!';
 const b1=document.createElement('button');b1.textContent='🔗 자랑 글 + 링크 복사';b1.style.cssText='width:300px;height:52px;font-size:19px;background:#ffc94a;box-shadow:0 4px 0 #d9a020';
 b1.onclick=()=>copy(text+'\n'+url).then(()=>{b1.textContent='✅ 복사했어요! 카톡에 붙여넣기'});
 const b2=document.createElement('button');b2.textContent='닫기';b2.style.cssText='width:300px;height:46px;font-size:18px';b2.onclick=()=>{ov.remove();ov=null};
 ov.append(im,p,b1,b2)}
function copy(t){return new Promise(res=>{try{navigator.clipboard.writeText(t).then(res,fb)}catch(e){fb()}function fb(){const a=document.createElement('textarea');a.value=t;a.style.cssText='position:fixed;opacity:0';document.body.appendChild(a);a.select();try{document.execCommand('copy')}catch(e){}a.remove();res()}})}
async function send(cv,text,url,title){
 try{const blob=await new Promise(r=>cv.toBlob(r,'image/jpeg',.9));const file=new File([blob],'bungeoppang.jpg',{type:'image/jpeg'});
  if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title,text:text+'\n'+url});return 'shared'}}catch(e){if(e&&e.name==='AbortError')return 'cancel'}
 overlay(cv,text,url);return 'overlay'}
return{challenge,shop,send,copy}})();
