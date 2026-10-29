/* ===== 📲 앱으로 설치 (홈 화면에 추가) — 챌린지·가게 공용 =====
   안드로이드 크롬: 바로 설치 창 / 아이폰 사파리: '공유 → 홈 화면에 추가' 안내 / 카톡 안: 다른 브라우저로 열기 */
const INSTALL=(()=>{
const ua=navigator.userAgent||'',kakao=/KAKAOTALK/i.test(ua),ios=/iPhone|iPad|iPod/i.test(ua)||(/Macintosh/.test(ua)&&navigator.maxTouchPoints>1),
 iosOther=ios&&/CriOS|FxiOS|EdgiOS|NAVER|Whale|DaumApps/i.test(ua),android=/Android/i.test(ua);
const standalone=()=>{try{return matchMedia('(display-mode: standalone)').matches||navigator.standalone===true}catch(e){return false}};
let deferred=null;const btns=[];
addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;sync()});
addEventListener('appinstalled',()=>{deferred=null;sync()});
if('serviceWorker' in navigator){addEventListener('load',()=>{navigator.serviceWorker.register('sw.js').catch(()=>{})})}
function sync(){btns.forEach(b=>{b.style.display=standalone()?'none':''})}
function bind(el){if(!el)return;btns.push(el);el.onclick=open;sync()}
let ov=null;
function close(){if(ov){ov.remove();ov=null}}
function card(title,html,btn){close();ov=document.createElement('div');ov.style.cssText='position:absolute;inset:0;background:rgba(40,24,14,.6);z-index:45;display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box';
 const c=document.createElement('div');c.style.cssText='background:#fff;border-radius:26px;width:100%;box-sizing:border-box;padding:18px;text-align:left;color:#5a3a22;font-size:17px;line-height:1.55';
 c.innerHTML='<div style="text-align:center"><img src="img/icon-192.png" alt="" style="width:72px;height:72px;border-radius:18px;box-shadow:0 3px 10px rgba(0,0,0,.2)"></div><div style="font-size:24px;text-align:center;margin:8px 0 10px">'+title+'</div>'+html;
 const bs=document.createElement('div');bs.className='icb';bs.style.cssText='display:flex;flex-direction:column;gap:8px;margin-top:12px';
 const mk=(t,fn,main)=>{const b=document.createElement('button');b.textContent=t;b.style.cssText='height:52px;font-size:19px;border:0;border-radius:18px;font-family:inherit;color:#5a3a22;'+(main?'background:#ffc94a;box-shadow:0 4px 0 #d9a020':'background:#fff6e6;box-shadow:0 4px 0 #e0c4a0');b.onclick=fn;bs.appendChild(b)};
 if(btn)mk(btn[0],btn[1],true);mk('닫기',close);c.appendChild(bs);ov.appendChild(c);(document.getElementById('box')||document.body).appendChild(ov)}
const step=(n,t)=>'<div style="display:flex;gap:10px;align-items:flex-start;margin:6px 0"><b style="flex:0 0 28px;height:28px;border-radius:14px;background:#ffc94a;text-align:center;font-weight:400">'+n+'</b><span>'+t+'</span></div>';
const NOTE=t=>'<div style="background:#fff1e0;border-radius:14px;padding:8px 12px;margin-top:10px;font-size:14px;line-height:1.45">'+t+'</div>';
const IOSNOTE=NOTE('📦 아이폰은 앱의 기록이 사파리와 <b>따로</b>예요. 설치 전에 ⚙️ 설정 → <b>📦 기록 옮기기</b>에서 번호를 받아 두고, 앱을 처음 열 때 넣으면 그대로 이어져요.');
const ANDNOTE=NOTE('📦 크롬에서 하던 기록은 그대로 이어져요. <b>카톡·삼성 인터넷</b>에서 하던 기록은 ⚙️ 설정 → <b>📦 기록 옮기기</b>로 번호를 받아 앱에서 넣어 주세요.');
function open(){
 if(standalone()){card('이미 앱으로 쓰고 있어요! 🎉','<p style="margin:0;text-align:center">홈 화면의 🐟 붕어빵 가게 아이콘으로 열면 돼요.</p>');return}
 if(deferred){const d=deferred;deferred=null;d.prompt();(d.userChoice||Promise.resolve()).then(()=>sync()).catch(()=>{});return}
 if(kakao){card('카톡 안에서는 설치가 안 돼요','<p style="margin:0 0 6px">크롬이나 사파리로 열면 홈 화면에 앱으로 설치할 수 있어요.</p>'+step(1,'아래 버튼을 눌러 다른 브라우저로 열어요')+step(2,'열린 화면에서 ⚙️ 설정 → 📲 앱으로 설치')+NOTE('📦 지금 카톡에서 하던 기록은 먼저 ⚙️ 설정 → <b>📦 기록 옮기기</b>에서 번호를 받아 두세요. 앱에서 넣으면 그대로 이어져요.'),['🌐 크롬/사파리로 열기',()=>{location.href='kakaotalk://web/openExternal?url='+encodeURIComponent(location.href)}]);return}
 if(ios&&iosOther){card('사파리에서 설치할 수 있어요','<p style="margin:0">아이폰은 <b>사파리</b>에서만 홈 화면에 추가할 수 있어요. 주소를 복사해서 사파리에 붙여 넣어 주세요.</p>'+IOSNOTE,['🔗 주소 복사',()=>{try{navigator.clipboard.writeText(location.origin+'/')}catch(e){}close()}]);return}
 if(ios){card('홈 화면에 추가해요','<p style="margin:0 0 6px">사파리에서 세 번만 누르면 앱처럼 쓸 수 있어요.</p>'+step(1,'화면 아래 가운데 <b>공유 버튼</b> (네모에 위 화살표 ⬆️)')+step(2,'목록을 내려서 <b>홈 화면에 추가</b>')+step(3,'오른쪽 위 <b>추가</b>')+IOSNOTE);return}
 if(android){card('앱으로 설치해요','<p style="margin:0 0 6px">크롬에서 이렇게 하면 돼요.</p>'+step(1,'오른쪽 위 <b>⋮</b> 메뉴')+step(2,'<b>앱 설치</b> 또는 <b>홈 화면에 추가</b>')+ANDNOTE);return}
 card('앱으로 설치해요','<p style="margin:0">컴퓨터 크롬이면 주소창 오른쪽의 <b>설치</b> 아이콘을 눌러요. 폰에서는 크롬(안드로이드)이나 사파리(아이폰)로 열어 주세요.</p>')}
/* ---------- 📦 기록 옮기기 ---------- */
const X=()=>window.XFER&&!window.XFER.off?window.XFER:null;
function whenX(fn,n=0){const x=X();if(x)return fn(x);if(window.XFER&&window.XFER.pending&&n<40)return setTimeout(()=>whenX(fn,n+1),300);card('지금은 연결할 수 없어요','<p style="margin:0;text-align:center">인터넷 연결을 확인하고 잠시 뒤에 다시 해 주세요.</p>')}
function xfer(){card('📦 기록 옮기기','<p style="margin:0 0 6px">카톡·사파리에서 하던 기록을 <b>설치한 앱</b>이나 <b>다른 폰</b>으로 옮겨요.</p>'+step(1,'기록이 있는 곳에서 <b>📤 번호 받기</b>')+step(2,'옮길 곳(앱)에서 <b>📥 번호 넣기</b>')+NOTE('🚚 기록은 <b>이사</b>해요: 옮긴 뒤엔 보낸 쪽 기록이 잠기고 받은 곳에서만 이어져요. 번호는 15분 동안, 한 번만, 한 번에 하나만 쓸 수 있어요.'),['📤 이 기기 기록 보내기 (번호 받기)',xsend]);
 const bs=ov.querySelector('.icb'),b=document.createElement('button');b.textContent='📥 번호 넣어서 받아오기';b.style.cssText='height:52px;font-size:19px;border:0;border-radius:18px;font-family:inherit;color:#1f5a4a;background:#bfeedd;box-shadow:0 4px 0 #8fcdb5';b.onclick=xrecv;bs.insertBefore(b,bs.children[1])}
function xsend(){card('번호 만드는 중…','<p style="margin:0;text-align:center">잠깐만요 ⏳</p>');whenX(x=>{x.send().then(code=>{
  card('옮기기 번호','<div style="font-size:52px;letter-spacing:8px;text-align:center;font-weight:400;margin:4px 0;color:#c0601a">'+code.slice(0,3)+' '+code.slice(3)+'</div><p style="margin:0;text-align:center">옮길 곳(앱)에서 ⚙️ 설정 → 📦 기록 옮기기 →<br><b>📥 번호 넣어서 받아오기</b>에 넣어 주세요.</p>'+NOTE('⏰ 15분 안에, 한 번만 쓸 수 있어요.<br>🚚 옮기면 <b>이 기기의 기록은 잠기고</b> 새로 시작해요. 번호를 받은 뒤엔 여기서 더 하지 마세요 (번호 받은 때까지의 기록이 넘어가요).'),['🔢 번호 복사',()=>{try{navigator.clipboard.writeText(code)}catch(e){}}])})
 .catch(e=>{if(e&&e.message==='moved')return;card('번호를 만들지 못했어요','<p style="margin:0;text-align:center">'+(e&&e.message==='empty'?'이 기기에는 옮길 기록이 없어요.':'잠시 뒤에 다시 해 주세요.')+'</p>')})})}
function xrecv(){card('📥 번호 넣기','<input id="xin" inputmode="numeric" maxlength="7" placeholder="6자리 번호" style="width:100%;box-sizing:border-box;height:62px;border:3px solid #f0c890;border-radius:16px;font:inherit;font-size:32px;letter-spacing:6px;text-align:center;color:#5a3a22;background:#fffaf0;user-select:text;-webkit-user-select:text;outline:none"><div id="xer" style="color:#d03030;min-height:22px;font-size:15px;text-align:center;margin-top:4px"></div>'+NOTE('⚠️ 이 기기의 지금 기록은 받아 온 기록으로 <b>바뀌어요</b>.'),['📥 받아오기',()=>{}]);
 const inp=ov.querySelector('#xin'),er=ov.querySelector('#xer'),go=ov.querySelector('.icb button');let armed=false;
 setTimeout(()=>{try{inp.focus()}catch(e){}},50);
 go.onclick=()=>{const v=inp.value.replace(/\D/g,'');if(v.length!==6){er.textContent='6자리 숫자를 넣어 주세요';return}
  if(!armed&&X()&&X().has()){armed=true;go.textContent='⚠️ 지금 기록이 바뀌어요. 한 번 더!';return}
  go.textContent='받아오는 중… ⏳';whenX(x=>x.recv(v).then(()=>{go.textContent='✅ 받았어요! 다시 여는 중…';try{localStorage.setItem('bpXferAsk','1')}catch(e){}setTimeout(()=>location.reload(),600)})
   .catch(e=>{armed=false;go.textContent='📥 받아오기';er.textContent={none:'번호를 찾을 수 없어요. 다시 확인해 주세요',old:'15분이 지난 번호예요. 다시 받아 주세요',code:'6자리 숫자를 넣어 주세요'}[e&&e.message]||'받아오지 못했어요. 잠시 뒤에 다시 해 주세요'}))}}
/* ---------- 안내 (페이지마다 한 번 불러요) hasSave: 이 기기에 기록이 있나 ---------- */
const ls=(k,v)=>{try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}};
function nudge(hasSave){
 if(ls('bpMovedNote')){ls('bpMovedNote','');try{localStorage.removeItem('bpMovedNote')}catch(e){}setTimeout(()=>card('🚚 기록이 이사 갔어요','<p style="margin:0;text-align:center">이 기기의 기록은 <b>다른 기기(앱)로 옮겨졌어요</b>.<br>거기서 이어서 해 주세요. 여기서는 새로 시작해요.</p>'),600);return}
 /* 방문한 날 수 */const dk=String(Math.floor((Date.now()+9*3600e3)/864e5));let vd=[];try{vd=JSON.parse(ls('bpVisitDays')||'[]')}catch(e){}if(!vd.includes(dk)){vd.push(dk);vd=vd.slice(-30);ls('bpVisitDays',JSON.stringify(vd))}
 setTimeout(()=>{if(document.querySelector('#box > div[style*="z-index: 4"]'))return;/* 다른 안내(새 소식 등)가 떠 있으면 다음에 */
  if(standalone()){if(!hasSave&&!ls('bpXferAsk')){ls('bpXferAsk','1');card('앱에 오신 걸 환영해요! 🎉','<p style="margin:0">카톡·사파리 등에서 하던 기록이 있나요?<br>거기서 ⚙️ 설정 → 📦 기록 옮기기 → <b>📤 번호 받기</b>를 하고, 여기에 번호를 넣으면 그대로 이어져요.</p>',['📥 번호 넣어서 받아오기',xrecv])}return}
  if(kakao&&hasSave&&!sessionStorage.getItem('bpKakaoNote')){try{sessionStorage.setItem('bpKakaoNote','1')}catch(e){}
   if(ls('bpAppAsk')){card('카톡 안에서 열렸어요','<p style="margin:0">앱을 설치하셨다면 <b>홈 화면의 🐟 붕어빵 가게</b>로 열어 주세요. 카톡 안의 기록은 앱과 따로예요.</p>');return}}
  if(hasSave&&vd.length>=2&&!ls('bpAppAsk')){ls('bpAppAsk','1');card('📲 앱으로 설치해 보세요!','<p style="margin:0">홈 화면에서 바로 열고, 전체 화면으로 즐길 수 있어요. 지금 기록도 <b>📦 기록 옮기기</b>로 그대로 가져갈 수 있어요.</p>',['📲 설치 방법 보기',open])}},1600)}
return{bind,open,close,standalone,kakao,ios,android,xfer,xsend,xrecv,nudge}})();
