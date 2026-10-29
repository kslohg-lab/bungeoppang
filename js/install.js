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
 const bs=document.createElement('div');bs.style.cssText='display:flex;flex-direction:column;gap:8px;margin-top:12px';
 const mk=(t,fn,main)=>{const b=document.createElement('button');b.textContent=t;b.style.cssText='height:52px;font-size:19px;border:0;border-radius:18px;font-family:inherit;color:#5a3a22;'+(main?'background:#ffc94a;box-shadow:0 4px 0 #d9a020':'background:#fff6e6;box-shadow:0 4px 0 #e0c4a0');b.onclick=fn;bs.appendChild(b)};
 if(btn)mk(btn[0],btn[1],true);mk('닫기',close);c.appendChild(bs);ov.appendChild(c);(document.getElementById('box')||document.body).appendChild(ov)}
const step=(n,t)=>'<div style="display:flex;gap:10px;align-items:flex-start;margin:6px 0"><b style="flex:0 0 28px;height:28px;border-radius:14px;background:#ffc94a;text-align:center;font-weight:400">'+n+'</b><span>'+t+'</span></div>';
const IOSNOTE='<div style="background:#fff1e0;border-radius:14px;padding:8px 12px;margin-top:10px;font-size:14px;line-height:1.45">⚠️ 아이폰은 홈 화면 앱의 기록이 사파리와 <b>따로</b> 저장돼요. 앱에서는 처음부터 시작하고, 사파리에서 하던 기록은 사파리에 그대로 남아 있어요.</div>';
function open(){
 if(standalone()){card('이미 앱으로 쓰고 있어요! 🎉','<p style="margin:0;text-align:center">홈 화면의 🐟 붕어빵 가게 아이콘으로 열면 돼요.</p>');return}
 if(deferred){const d=deferred;deferred=null;d.prompt();(d.userChoice||Promise.resolve()).then(()=>sync()).catch(()=>{});return}
 if(kakao){card('카톡 안에서는 설치가 안 돼요','<p style="margin:0 0 6px">크롬이나 사파리로 열면 홈 화면에 앱으로 설치할 수 있어요.</p>'+step(1,'아래 버튼을 눌러 다른 브라우저로 열어요')+step(2,'열린 화면에서 ⚙️ 설정 → 📲 앱으로 설치'),['🌐 크롬/사파리로 열기',()=>{location.href='kakaotalk://web/openExternal?url='+encodeURIComponent(location.href)}]);return}
 if(ios&&iosOther){card('사파리에서 설치할 수 있어요','<p style="margin:0">아이폰은 <b>사파리</b>에서만 홈 화면에 추가할 수 있어요. 주소를 복사해서 사파리에 붙여 넣어 주세요.</p>'+IOSNOTE,['🔗 주소 복사',()=>{try{navigator.clipboard.writeText(location.origin+'/')}catch(e){}close()}]);return}
 if(ios){card('홈 화면에 추가해요','<p style="margin:0 0 6px">사파리에서 세 번만 누르면 앱처럼 쓸 수 있어요.</p>'+step(1,'화면 아래 가운데 <b>공유 버튼</b> (네모에 위 화살표 ⬆️)')+step(2,'목록을 내려서 <b>홈 화면에 추가</b>')+step(3,'오른쪽 위 <b>추가</b>')+IOSNOTE);return}
 if(android){card('앱으로 설치해요','<p style="margin:0 0 6px">크롬에서 이렇게 하면 돼요.</p>'+step(1,'오른쪽 위 <b>⋮</b> 메뉴')+step(2,'<b>앱 설치</b> 또는 <b>홈 화면에 추가</b>')+'<p style="margin:8px 0 0;font-size:14px;opacity:.75">안드로이드는 지금 하던 기록이 앱에서도 그대로 이어져요.</p>');return}
 card('앱으로 설치해요','<p style="margin:0">컴퓨터 크롬이면 주소창 오른쪽의 <b>설치</b> 아이콘을 눌러요. 폰에서는 크롬(안드로이드)이나 사파리(아이폰)로 열어 주세요.</p>')}
return{bind,open,close,standalone,kakao,ios,android}})();
