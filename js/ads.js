/* ===== 📺 보상형 광고 (앱에서만) =====
   안드로이드 앱(Capacitor + AdMob 플러그인) 안에서만 켜져요. 웹 브라우저에서는 ADS.on = false 라서 버튼이 안 보여요.
   - 하루 MAX번 (한국 날짜 기준), 끝까지 보면 true
   - 광고 단위 ID: 지금은 구글 시험용. AdMob에서 '보상형' 광고 단위를 만들면 UNIT을 바꿔요. */
window.ADS=(()=>{
const UNIT='ca-app-pub-3940256099942544/5224354917';  // 🧪 구글 시험용 보상형
const MAX=3,KEY='bpAds';
const C=window.Capacitor,P=C&&typeof C.isNativePlatform==='function'&&C.isNativePlatform()&&C.Plugins&&C.Plugins.AdMob||null;
const dk=()=>Math.floor((Date.now()+9*3600e3)/864e5);
const st=()=>{let s=null;try{s=JSON.parse(localStorage.getItem(KEY))}catch(e){}if(!s||s.d!==dk())s={d:dk(),n:0};return s};
const put=s=>{try{localStorage.setItem(KEY,JSON.stringify(s))}catch(e){}};
let init=null,ready=null,busy=false,wait=null;
function boot(){if(!P)return Promise.resolve(false);if(init)return init;
 init=(async()=>{try{
  await P.initialize({tagForChildDirectedTreatment:false,tagForUnderAgeOfConsent:false,maxAdContentRating:'Teen'});
  try{const ci=await P.requestConsentInfo();if(ci&&ci.status==='REQUIRED'&&ci.isConsentFormAvailable)await P.showConsentForm()}catch(e){}
  const end=ok=>{if(wait){const w=wait;wait=null;w(ok)}};let got=false;
  P.addListener('onRewardedVideoAdReward',()=>{got=true});
  P.addListener('onRewardedVideoAdShowed',()=>{got=false});
  P.addListener('onRewardedVideoAdDismissed',()=>{setTimeout(()=>end(got),350)});
  P.addListener('onRewardedVideoAdFailedToShow',()=>end(false));
  return true}catch(e){init=null;return false}})();
 return init}
function load(){if(ready)return ready;ready=P.prepareRewardVideoAd({adId:UNIT}).then(()=>true,()=>{ready=null;return false});return ready}
const left=()=>P?Math.max(0,MAX-st().n):0;
async function show(){if(!P||busy||!left())return false;busy=true;
 try{if(!await boot())return false;if(!await load())return false;ready=null;
  const ok=await new Promise(res=>{wait=res;P.showRewardVideoAd().then(()=>{if(wait){/* 보상 받음 → 닫힐 때 마무리 */}},()=>{if(wait){wait=null;res(false)}})});
  if(ok){const s=st();s.n++;put(s)}
  setTimeout(()=>{load()},1500);return ok}
 catch(e){return false}finally{busy=false}}
function warm(){if(P&&left())boot().then(o=>{if(o)load()})}
return{on:!!P,MAX,left,show,warm}})();
