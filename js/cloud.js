/* ☁️ 기록 지키기 — 구글 로그인(선택) + 서버 저장
   - 지금 익명 계정을 구글 계정에 "연결"해요 (uid 그대로 → 좋아요·방명록·순위 유지)
   - 로그인하면 이 기기의 기록(localStorage bp*·bungeoppang*)을 saves/{uid} 에 저장: {v,t,r(바뀜 번호),c(코인),m(메달),g(선물 받음),d(기록 JSON)}
   - 다른 기기에서 바뀐 걸 알아보는 건 시계가 아니라 r(무작위 번호)로: 내가 마지막으로 맞춘 r과 다르면 서버가 바뀐 것
   - 서버 기록을 불러올 땐 코인·메달을 규칙을 통과한 c·m 보다 크게 못 가져와요 (조작 방지)
   - 계정 지우기: 서버 기록·가게·이번 주 순위를 지우고 구글 계정 연결도 지워요 (이 기기 기록은 남아요)
   - 앱(안드로이드) 안에서는 구글이 웹 로그인 창을 막아서, 앱 부품(FirebaseAuthentication)으로 계정을 고르고 그 토큰으로 연결해요 (부품 없는 옛 앱은 안내만)
   window.CLOUD = {ready, isG(), email(), link(), save(), render()} */
import {CFG} from './firebase-config.js';
const ls=(k,v)=>{try{if(v===undefined)return localStorage.getItem(k);if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v)}catch(e){return null}};
const EXC=/^(bpNewsMute|bpCloud|bpAds|bpShopMade:|bpXferOut|bpMoveBak|bpMoved|bpAudio|bpLoginAsk|T_FUT)/;
const GIFT=5;
const snap=()=>{const k={};try{for(let i=0;i<localStorage.length;i++){const n=localStorage.key(i);if(/^(bp|bungeoppang)/.test(n)&&!EXC.test(n))k[n]=localStorage.getItem(n)}}catch(e){}return k};
const hash=s=>{let h=5381;for(let i=0;i<s.length;i++)h=((h*33)^s.charCodeAt(i))>>>0;return h.toString(36)+':'+s.length};
const J=s=>{try{return JSON.parse(s)}catch(e){return null}};
const coinsOf=k=>{const s=J(k.bpShopPubV1);return s?Math.max(0,Math.floor(Number(s.coins)||0)):0};
const medalsOf=k=>{const m=J(k.bpMedal);return m?Math.max(0,m.n|0):0};
const sum=k=>{const s=J(k.bpShopPubV1)||{},c=J(k.bungeoppang2Pub1)||{},m=J(k.bpMedal)||{};return{name:s.name||'(가게 없음)',coins:coinsOf(k),days:s.days|0,served:s.served|0,room:s.room|0,medal:medalsOf(k),mt:m.t|0,runs:c.runs|0}};
const st=()=>J(ls('bpCloud'))||{};
const setSt=o=>ls('bpCloud',JSON.stringify(Object.assign(st(),o)));
const fmt=n=>Math.round(n).toLocaleString('ko-KR');
const native=()=>!!(window.Capacitor&&typeof Capacitor.isNativePlatform==='function'&&Capacitor.isNativePlatform());
/* 📱 앱: 안드로이드 구글 로그인 부품 (@capacitor-firebase/authentication, skipNativeAuth) — 없으면 안내만 */
const NFA=()=>native()&&window.Capacitor.Plugins&&Capacitor.Plugins.FirebaseAuthentication||null;
const canLogin=()=>!native()||!!NFA();
const toast=t=>{if(window.JUICE&&JUICE.toast)JUICE.toast(t);else{const b=document.createElement('div');b.textContent=t;b.style.cssText='position:fixed;left:50%;bottom:90px;transform:translateX(-50%);background:rgba(60,40,25,.92);color:#fff;padding:10px 16px;border-radius:14px;z-index:99999;font:15px system-ui;max-width:86%;text-align:center';document.body.appendChild(b);setTimeout(()=>b.remove(),2600)}};

window.CLOUD={off:true,isG:()=>false,render(){}};

/* 서버 연결 (진짜 Firebase, 시험 때는 window.__cloudFake) */
async function backend(){
 if(window.__cloudFake)return window.__cloudFake;
 const V='10.8.0',base='https://www.gstatic.com/firebasejs/'+V+'/';
 const [{initializeApp,getApps,getApp},A,F]=await Promise.all([import(base+'firebase-app.js'),import(base+'firebase-auth.js'),import(base+'firebase-firestore.js')]);
 const {getAuth,onAuthStateChanged,GoogleAuthProvider,linkWithPopup,linkWithCredential,signInWithCredential,signInAnonymously,reauthenticateWithPopup,reauthenticateWithCredential,deleteUser}=A;
 const {getFirestore,doc,getDoc,setDoc,deleteDoc,collection,getDocs,serverTimestamp}=F;
 const app=getApps().length?getApp():initializeApp(CFG),auth=getAuth(app),db=getFirestore(app);
 await new Promise(r=>{const u=onAuthStateChanged(auth,()=>{u();r()})});
 const prov=()=>{const p=new GoogleAuthProvider();p.setCustomParameters({prompt:'select_account'});return p};
 /* 앱: 안드로이드 계정 고르기 창 → 구글 토큰 → 웹 Firebase 자격 */
 const ncred=async()=>{const r=await NFA().signInWithGoogle({skipNativeAuth:true});const t=r&&r.credential&&r.credential.idToken;if(!t){const e=new Error('no token');e.code='auth/popup-closed-by-user';throw e}return GoogleAuthProvider.credential(t)};
 const wk=()=>Math.floor((Math.floor((Date.now()+9*3600e3)/864e5)+3)/7);
 return{
  user(){const u=auth.currentUser;return u?{uid:u.uid,g:u.providerData.some(p=>p.providerId==='google.com'),email:(u.providerData.find(p=>p.providerId==='google.com')||{}).email||u.email||''}:null},
  async anon(){if(!auth.currentUser)await signInAnonymously(auth)},
  /* 연결: 성공 'linked' · 이미 다른 기기에서 쓰던 구글 계정이면 그 계정으로 들어가고 'switched' */
  async link(){if(!auth.currentUser)await signInAnonymously(auth);
   const nc=NFA()?await ncred():null;
   try{if(nc)await linkWithCredential(auth.currentUser,nc);else await linkWithPopup(auth.currentUser,prov());await auth.currentUser.getIdToken(true);return'linked'}
   catch(e){if(e&&e.code==='auth/credential-already-in-use'){const c=GoogleAuthProvider.credentialFromError(e)||nc;if(!c)throw e;await signInWithCredential(auth,c);await auth.currentUser.getIdToken(true);return'switched'}throw e}},
  async get(){const s=await getDoc(doc(db,'saves',auth.currentUser.uid));return s.exists()?s.data():null},
  async put(o){await setDoc(doc(db,'saves',auth.currentUser.uid),Object.assign({},o,{t:serverTimestamp()}))},
  async wipe(){const u=auth.currentUser,uid=u.uid;if(NFA())await reauthenticateWithCredential(u,await ncred());else await reauthenticateWithPopup(u,prov());
   const del=async p=>{try{await deleteDoc(p)}catch(e){}};
   for(const sub of ['notes','likes']){try{const q=await getDocs(collection(db,'shops',uid,sub));for(const d of q.docs)await del(d.ref)}catch(e){}}
   await del(doc(db,'shops',uid));await del(doc(db,'saves',uid));
   for(const w of [wk(),wk()-1]){await del(doc(db,'weeks',String(w),'scores',uid));await del(doc(db,'weeks',String(w),'proofs',uid))}
   await deleteUser(u);try{await signInAnonymously(auth)}catch(e){}}
 }}

(async()=>{
 if(!(CFG&&CFG.apiKey&&CFG.projectId)&&!window.__cloudFake)return;
 let B;try{B=await backend()}catch(e){return}
 let busy=false,lastUp=0;
 const isG=()=>{const u=B.user();return!!(u&&u.g)};
 const payload=()=>{const k=snap(),s=JSON.stringify(k);return{k,s,h:hash(s)}};
 const dirty=()=>payload().h!==st().h;
 async function upload(force){if(!isG()||busy)return false;const p=payload();if(!force&&p.h===st().h)return true;busy=true;
  try{const r=Math.random().toString(36).slice(2,12);await B.put({v:1,r,c:coinsOf(p.k),m:medalsOf(p.k),g:st().g?1:0,d:p.s});setSt({r,h:p.h,at:Date.now()});lastUp=Date.now();render();return true}
  catch(e){setSt({err:Date.now()});if(force)toast('☁️ 서버에 저장하지 못했어요. 잠시 뒤 다시 해 볼게요');return false}finally{busy=false}}
 function apply(doc){window.__noStore=true;/* 게임이 닫히면서 옛 기록으로 덮어쓰지 않게 */const k=J(doc.d)||{};for(const n in k)ls(n,k[n]);
  /* 규칙을 통과한 코인·메달보다 많이는 못 가져와요 */
  const s=J(ls('bpShopPubV1'));if(s&&(Number(s.coins)||0)>doc.c){s.coins=doc.c|0;ls('bpShopPubV1',JSON.stringify(s))}
  const m=J(ls('bpMedal'));if(m&&(m.n|0)>doc.m){m.n=doc.m|0;ls('bpMedal',JSON.stringify(m))}
  setSt({r:doc.r,h:payload().h,g:doc.g?1:0,at:Date.now()});location.reload()}
 /* 이 기기 기록 vs 서버 기록 고르기 */
 function choose(doc,why){return new Promise(res=>{const a=sum(snap()),b=sum(J(doc.d)||{});
  const card=(t,x)=>'<div style="flex:1;background:#fff8ee;border:2px solid #f0d6b0;border-radius:14px;padding:10px 8px;text-align:left;font-size:14px;line-height:1.55"><b style="font-size:15px">'+t+'</b><br>🏪 '+x.name+'<br>🪙 '+fmt(x.coins)+'<br>📅 '+x.days+'일 · 🐾 '+fmt(x.served)+'명<br>🏅 '+x.medal+' · 🔥 '+x.runs+'판</div>';
  const o=document.createElement('div');o.style.cssText='position:fixed;inset:0;background:rgba(40,25,15,.55);z-index:99998;display:flex;align-items:center;justify-content:center;padding:16px;font-family:system-ui,sans-serif';
  o.innerHTML='<div style="background:#fff;border-radius:22px;max-width:420px;width:100%;padding:18px 14px;color:#4a3020;text-align:center;word-break:keep-all"><div style="font-size:20px;font-weight:700;margin-bottom:4px">☁️ 어떤 기록으로 할까요?</div><div style="font-size:14px;color:#8a6a50;margin-bottom:12px">'+why+'</div><div style="display:flex;gap:8px">'+card('📱 이 기기',a)+card('☁️ 서버',b)+'</div>'
   +'<button data-k="l" style="margin-top:12px;width:100%;padding:12px;border:0;border-radius:14px;background:#ffd36b;font-size:16px;font-weight:700;color:#4a3020">📱 이 기기 기록 쓰기</button><button data-k="c" style="margin-top:8px;width:100%;padding:12px;border:0;border-radius:14px;background:#cfe8ff;font-size:16px;font-weight:700;color:#24405a">☁️ 서버 기록 불러오기</button><div style="font-size:12px;color:#a08670;margin-top:8px">고르지 않은 쪽 기록은 사라져요</div></div>';
  o.onclick=e=>{const k=e.target&&e.target.dataset&&e.target.dataset.k;if(!k)return;o.remove();res(k)};document.body.appendChild(o)})}
 /* 서버와 맞추기 (페이지 열 때 · 로그인한 뒤) */
 async function sync(first){if(!isG())return;let doc=null;try{doc=await B.get()}catch(e){return}
  if(!doc){await upload(true);return}
  const s=st();
  if(doc.r===s.r){if(dirty())await upload(false);return}
  /* 서버가 다른 기기에서 바뀜 */
  const local=sum(snap());
  if(!dirty()&&s.r){apply(doc);return}
  if(!local.days&&!local.coins&&!local.runs){apply(doc);return}
  /* 11/8 VOC: 앱·웹을 오가면 켤 때마다 물어봐서 불편 → 한쪽이 모든 면에서 같거나 앞서면 알아서 골라요.
     (켜자마자 쌓이는 자리 비움 수입 때문에 '이 기기도 바뀜'이 거의 항상 생겨요) 서로 다른 데서 따로 진행했을 때만 물어봐요 */
  if(!first){const R=sum(J(doc.d)||{}),F=['days','served','runs','mt'],le=F.every(f=>(local[f]|0)<=(R[f]|0)),ge=F.every(f=>(local[f]|0)>=(R[f]|0));
   if(le){setSt({note:'☁️ 다른 기기에서 한 기록을 불러왔어요'});apply(doc);return}
   if(ge){setSt({g:doc.g?1:0});await upload(true);return}}
  const k=await choose(doc,first?'이 구글 계정에 이미 저장된 기록이 있어요':'다른 기기에서 기록이 바뀌었어요');
  if(k==='c')apply(doc);else{setSt({g:doc.g?1:0});const ok=await upload(true);if(!ok)toast('☁️ 서버 기록과 차이가 너무 커서 이 기기 기록을 올리지 못했어요')}}
 async function link(){if(!canLogin()){toast('📱 앱을 새 버전으로 업데이트하면 로그인할 수 있어요 · 지금은 📦 기록 옮기기를 써 주세요');return}
  if(busy)return;busy=true;let how;try{how=await B.link()}catch(e){busy=false;const c=e&&e.code||'';
   if(c==='auth/popup-closed-by-user'||c==='auth/cancelled-popup-request')return;
   toast(c==='auth/popup-blocked'?'🔐 팝업이 막혔어요 · 브라우저에서 팝업을 허용해 주세요':'🔐 로그인하지 못했어요 ('+(c||'오류')+')');return}
  busy=false;
  if(how==='linked'){let had=null;try{had=await B.get()}catch(e){}
   if(!had&&!st().g){/* 🎁 첫 로그인 선물 */if(window.MEDAL&&MEDAL.add)MEDAL.add(GIFT);else{const m=J(ls('bpMedal'))||{};m.n=(m.n|0)+GIFT;m.t=(m.t|0)+GIFT;ls('bpMedal',JSON.stringify(m))}setSt({g:1});if(window.JUICE&&JUICE.confetti)JUICE.confetti(80);toast('🔐 기록을 지켰어요! 🏅 메달 '+GIFT+'개 선물')}
   else toast('🔐 구글 계정에 연결했어요');
   setSt({r:null,h:null});await sync(true);render();if(window.CLOUD.onChange)window.CLOUD.onChange();return}
  toast('🔐 이미 쓰던 구글 계정이에요 · 기록을 확인할게요');setSt({r:null,h:null});await sync(true);render();if(window.CLOUD.onChange)window.CLOUD.onChange()}
 async function wipe(){const o=document.createElement('div');o.style.cssText='position:fixed;inset:0;background:rgba(40,25,15,.55);z-index:99998;display:flex;align-items:center;justify-content:center;padding:16px;font-family:system-ui,sans-serif';
  o.innerHTML='<div style="background:#fff;border-radius:22px;max-width:400px;width:100%;padding:18px 16px;color:#4a3020;text-align:center;word-break:keep-all"><div style="font-size:20px;font-weight:700">🗑️ 계정을 지울까요?</div><p style="font-size:14px;line-height:1.6;color:#6a4a30">서버에 저장된 기록, 동네에 보이는 가게, 받은 좋아요·방명록, 이번 주 순위 기록을 지우고 구글 계정 연결을 끊어요. <b>되돌릴 수 없어요.</b><br>이 기기의 게임 기록은 남아요.</p><button data-k="y" style="width:100%;padding:12px;border:0;border-radius:14px;background:#ff8a7a;color:#fff;font-size:16px;font-weight:700">지울게요</button><button data-k="n" style="margin-top:8px;width:100%;padding:12px;border:0;border-radius:14px;background:#eee;font-size:16px">그만둘래요</button></div>';
  const k=await new Promise(r=>{o.onclick=e=>{const v=e.target&&e.target.dataset&&e.target.dataset.k;if(v){o.remove();r(v)}};document.body.appendChild(o)});
  if(k!=='y')return;try{await B.wipe();ls('bpCloud',null);ls('bpLoginAsk','1');toast('🗑️ 계정을 지웠어요 · 이 기기 기록은 그대로예요');render();if(window.CLOUD.onChange)window.CLOUD.onChange()}
  catch(e){const c=e&&e.code||'';if(c==='auth/popup-closed-by-user'||c==='auth/cancelled-popup-request')return;toast('🗑️ 지우지 못했어요 ('+(c||'오류')+') · 문의 메일로 알려 주세요')}}
 /* 설정 칸 (#cloudBox) */
 function render(){const box=document.getElementById('cloudBox');if(!box)return;const u=B.user(),s=st();
  if(!canLogin()&&!isG()){box.innerHTML='<div style="font-size:13px;color:#8a6a50;margin:4px 0 8px">🔐 앱을 새 버전으로 업데이트하면 구글 로그인을 할 수 있어요 · 지금은 📦 기록 옮기기를 써 주세요</div>';return}
  if(!isG()){box.innerHTML='<button class="big sm" data-c="link" style="background:#d9f0ff">🔐 기록 지키기 (구글 로그인) · 🏅'+GIFT+'</button><div style="font-size:12.5px;color:#8a6a50;margin:-2px 0 8px">폰을 바꾸거나 앱을 지워도 기록이 돌아와요</div>'}
  else{const em=(u.email||'').replace(/^(.{2}).*(@.*)$/,'$1***$2'),at=s.at?new Date(s.at):null;
   box.innerHTML='<div style="font-size:13.5px;color:#4a6a30;margin:2px 0 6px">🔐 '+em+' 에 저장 중'+(at?' · ☁️ '+at.getHours()+':'+String(at.getMinutes()).padStart(2,'0'):'')+'</div><div class="throw" style="margin-bottom:8px"><button data-c="save">☁️ 지금 저장</button><button data-c="wipe">🗑️ 계정 지우기</button></div>'}
  box.onclick=async e=>{const c=e.target&&e.target.closest&&e.target.closest('[data-c]');if(!c)return;const k=c.dataset.c;
   if(k==='link')link();if(k==='save'){const ok=await upload(true);if(ok)toast('☁️ 저장했어요')}if(k==='wipe')wipe()}}
 window.CLOUD={off:false,isG,email:()=>(B.user()||{}).email||'',link,save:()=>upload(true),render,sync,onChange:null,GIFT};
 render();
 {const n=st().note;if(n){setSt({note:null});setTimeout(()=>toast(n),1200)}}
 await sync(false);
 /* 자동 저장: 1분마다 바뀐 게 있고 2분 지났으면 · 화면을 떠날 때 */
 setInterval(()=>{if(isG()&&Date.now()-lastUp>120000&&dirty())upload(false)},60000);
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&isG()&&dirty())upload(false)});
 /* 💡 3일째 한 번: 기록 지키기 권유 (가게 화면, 앱 제외) */
 if(canLogin()&&!isG()&&!ls('bpLoginAsk')&&/shop/.test(location.pathname)){
  const s=J(ls('bpShopPubV1'))||{},dk=Math.floor((Date.now()+9*3600e3)/864e5),age=s.d0?dk-s.d0:99;
  if((s.d0&&age>=2)||(!s.d0&&(s.days|0)>=3)){let n=0;const iv=setInterval(()=>{if(++n>40){clearInterval(iv);return}
    const busyOv=[...document.querySelectorAll('.ov')].some(x=>x.offsetParent!==null&&x.id!=='hm');if(busyOv||document.hidden)return;clearInterval(iv);ls('bpLoginAsk','1');
    if(window.JUICE&&JUICE.ask)JUICE.ask('🔐 기록을 지켜 두세요','구글 로그인을 해 두면 폰을 바꾸거나 앱을 지워도 가게가 그대로 돌아와요. 처음 한 번 🏅 메달 '+GIFT+'개 선물!','나중에',()=>{},'🔐 지금 지키기 (🏅'+GIFT+')',()=>link());
   },2000)}}
})();
