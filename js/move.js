/* 🚚 새 주소로 이사 (11/9 월 00:00 KST부터)
   옛 주소(vercel 등)로 들어오면 이 기기의 기록(localStorage)을 # 뒤에 담아 새 주소로 보내요.
   # 뒤는 서버로 가지 않아요. 새 주소는 비어 있거나 옛 기록이 더 많을 때 받아서 넣고(원래 것은 bpMoveBak) 바로 주소창에서 지워요.
   다른 스크립트보다 먼저 (head 맨 앞) 읽혀야 해요. */
(function(){
var NEW='bungeoppang-shop.pages.dev',AT=Date.UTC(2026,10,8,15,0,0),h=location.hostname,ls=null;
try{ls=window.localStorage}catch(e){}
function enc(s){return btoa(unescape(encodeURIComponent(s))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
function dec(s){s=s.replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';return decodeURIComponent(escape(atob(s)))}
var SAVE=['bpShopPubV1','bungeoppang2Pub1'];
function prog(o){var p=0;try{var sh=o.bpShopPubV1&&JSON.parse(o.bpShopPubV1);if(sh)p+=(sh.served|0)+(sh.days|0)*20+Math.min(2000,(sh.coins|0)/1000)}catch(e){}try{var c=o.bungeoppang2Pub1&&JSON.parse(o.bungeoppang2Pub1);if(c)p+=(c.runs|0)*10}catch(e){}return p}
function hasSave(){if(!ls)return false;for(var i=0;i<SAVE.length;i++){try{if(ls.getItem(SAVE[i]))return true}catch(e){}}return false}

if(h===NEW){ /* 받는 쪽 */
 var m=location.hash.match(/[#&]mv=([^&]*)/);if(!m)return;
 var msg='';
 try{var d=JSON.parse(dec(m[1]));
  if(d&&d.k&&ls){
   /* 새 주소에 이미 기록이 있어도, 옛 기록이 더 많이 한 쪽이면 옛 기록으로 (새 기록은 bpMoveBak에 보관) */
   var cur={};for(var i=0;i<SAVE.length;i++){try{var v=ls.getItem(SAVE[i]);if(v)cur[SAVE[i]]=v}catch(e){}}
   if(!hasSave()||prog(d.k)>prog(cur)){
    if(hasSave()){try{ls.setItem('bpMoveBak',JSON.stringify({t:Date.now(),k:cur}))}catch(e){}}
    for(var k in d.k){try{ls.setItem(k,d.k[k])}catch(e){}}try{ls.setItem('bpMoved',String(Date.now()))}catch(e){}msg='🚚 새 주소로 이사 왔어요! 기록은 그대로예요.'}
   else msg='🚚 새 주소예요! 이 기기엔 새 주소 기록이 더 많아서 그걸 그대로 써요.'}
 }catch(e){}
 try{history.replaceState(null,'',location.pathname+location.search)}catch(e){}
 if(msg)document.addEventListener('DOMContentLoaded',function(){
  var b=document.createElement('div');
  b.style.cssText='position:fixed;left:12px;right:12px;top:calc(env(safe-area-inset-top,0px) + 10px);z-index:99999;background:#fff8e6;color:#5a3a22;border:2px solid #f0c060;border-radius:16px;padding:12px 40px 12px 14px;font:15px/1.5 system-ui,sans-serif;box-shadow:0 6px 20px rgba(0,0,0,.18);word-break:keep-all';
  b.innerHTML=msg+'<br><small>홈 화면에 앱으로 깔아 두셨다면, 이 주소에서 다시 설치해 주세요. 📲</small><button aria-label="닫기" style="position:absolute;right:8px;top:8px;border:0;background:none;font-size:20px;color:#8a6a50">✕</button>';
  b.querySelector('button').onclick=function(){b.remove()};
  document.body.appendChild(b);setTimeout(function(){if(b.parentNode)b.remove()},12000)});
 return}

/* 보내는 쪽: 옛 주소 */
if(h==='localhost'||h==='127.0.0.1'||/(^|\.)local$/.test(h)||Date.now()<AT||/[?&]stay=1/.test(location.search))return;
if(window.Capacitor&&typeof Capacitor.isNativePlatform==='function'&&Capacitor.isNativePlatform())return; /* 옛 시험판 앱은 그대로 */
var path=location.pathname;if(/github\.io$/.test(h))path=path.replace(/^\/[^\/]+/,'')||'/';
var url='https://'+NEW+path+location.search.replace(/[?&]mv=[^&]*/,'');
var o={},n=0;
if(ls){try{for(var i=0;i<ls.length;i++){var k=ls.key(i);o[k]=ls.getItem(k);n++}}catch(e){}}
if(n){
 var s=enc(JSON.stringify({v:1,t:Date.now(),k:o}));
 if(s.length>1500000){ /* 너무 크면 기록 말고 큰 것부터 빼요 */
  var ks=Object.keys(o).filter(function(k){return SAVE.indexOf(k)<0}).sort(function(a,b){return (o[b]||'').length-(o[a]||'').length});
  while(s.length>1500000&&ks.length){delete o[ks.shift()];s=enc(JSON.stringify({v:1,t:Date.now(),k:o}))}}
 url+='#mv='+s}
location.replace(url);
})();
