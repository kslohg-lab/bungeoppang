/* 앱 설치용 서비스 워커: 항상 인터넷에서 새 파일을 먼저 받고(업데이트 바로 반영), 끊겼을 때만 저장해 둔 파일로 열어요. */
const C='bp-v2';
self.addEventListener('install',e=>{self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);
 if(r.method!=='GET'||u.origin!==location.origin)return; /* Firebase 등 다른 곳은 건드리지 않아요 */
 if(u.pathname.indexOf('/snd/')>=0)return; /* 음악은 저장하지 않고 그때그때 받아요 (용량) */
 /* 11/26 VOC '아이폰 앱을 켜면 화면이 이상하고, 껐다 켜면 괜찮아요': 앱을 막 켤 때 인터넷이 아직 안 깨어나 받기가 실패하면
    예전엔 저장 안 된 파일 자리에 첫 화면(HTML)을 넣어 줘서 스크립트가 깨졌어요 → ① 잠깐 기다렸다 한 번 더 받기
    ② 그래도 안 되면 같은 파일의 저장본(버전 번호 무시) ③ 첫 화면(HTML)은 페이지를 열 때만 */
 const get=()=>fetch(r).then(res=>{if(res&&res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp)).catch(()=>{})}return res});
 e.respondWith(get().catch(()=>new Promise(ok=>setTimeout(ok,700)).then(get)).catch(()=>caches.match(r).then(m=>m||caches.match(r,{ignoreSearch:true})).then(m=>m||(r.mode==='navigate'?caches.match('./'):Response.error()))))});
