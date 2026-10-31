/* ===== 🎨 테마: 기본(크림) · 화이트 · 블랙 — 챌린지·가게 공용 =====
   <head>에서 먼저 불러서 깜빡임 없이 <html data-th="..."> 를 달아요. 저장: localStorage bpTheme.
   게임 그림(캔버스)은 그대로, 화면 위 메뉴·창·버튼 색만 바뀌어요.
   글자 속(인라인 스타일)로 색을 준 창은 class 로 맞춰요: thc = 창 바탕, ths = 옅은 칸, thh = 강조 칸, thb = 흰 버튼.
   설정 화면의 [data-thb="cream|white|black"] 버튼을 누르면 바뀌어요. window.THEME = {get, set, list} */
const THEME=(()=>{
const KEY='bpTheme',L=[{k:'cream',n:'🍞 기본'},{k:'white',n:'🤍 화이트'},{k:'black',n:'🖤 블랙'}];
const get=()=>{try{const v=localStorage.getItem(KEY);return L.some(x=>x.k===v)?v:'cream'}catch(e){return'cream'}};
const V={
 white:{pg:'#e9eaee',bx:'#f3f4f6',cd:'#ffffff',so:'#f1f2f5',so2:'#e3e5ea',tx:'#33343a',sh:'#d3d6dd',pill:'#eceef2',hi:'#fff6cc',eq:'#dff5e3',pn:'rgba(255,255,255,.95)',menu:'linear-gradient(#ffe7c2,#f3f4f6)',tbg:'#33343a',ttx:'#fff',ov:'rgba(30,32,40,.5)',on:'#33343a',ontx:'#fff'},
 black:{pg:'#121010',bx:'#1e1a17',cd:'#2b2420',so:'#3a302a',so2:'#4a3e36',tx:'#f2e2cf',sh:'#120e0b',pill:'#3a302a',hi:'#4a3d1e',eq:'#24452e',pn:'rgba(43,36,32,.95)',menu:'linear-gradient(#3a2a1e,#1e1a17)',tbg:'#f2e2cf',ttx:'#2b2420',ov:'rgba(0,0,0,.62)',on:'#f2e2cf',ontx:'#2b2420'}};
function css(k,v){const h='html[data-th="'+k+'"] ';return[
 h+'body{background:'+v.pg+';color:'+v.tx+'}',
 h+'#box{background:'+v.bx+'}',
 h+'button{background:'+v.cd+';color:'+v.tx+';box-shadow:0 4px 0 '+v.sh+'}',h+'button:active{box-shadow:0 1px 0 '+v.sh+'}',
 h+'.card{background:'+v.cd+';color:'+v.tx+'}',h+'.sh{background:'+v.ov+'}',
 h+'.big.sm,'+h+'.tab,'+h+'.rtabs button,'+h+'#dtabs button{background:'+v.cd+';box-shadow:0 4px 0 '+v.sh+'}',
 /* 노란 주 버튼은 그대로 (글자는 진하게) */
 h+'.big:not(.sm):not(.alt):not(.no),'+h+'.tab.on,'+h+'.rtabs button.on,'+h+'#dtabs button.on,'+h+'#dact button.go{background:#ffc94a;color:#4a3010;box-shadow:0 4px 0 #d9a020}',
 h+'.big.alt{color:#1f3a4a}',h+'.big.no,'+h+'.it button.no{background:'+v.so2+';color:#8a8a8a;box-shadow:0 4px 0 '+v.sh+'}',
 h+'.pill{background:'+v.pill+'}',
 h+'.sum,'+h+'.it,'+h+'.lr,'+h+'.rr,'+h+'.dx div{background:'+v.so+'}',
 h+'.it.rec,'+h+'.lr.me,'+h+'.rr.me{background:'+v.hi+'}',
 h+'.card input{background:'+v.so+';color:'+v.tx+';border-color:'+v.so2+'}',
 h+'#hm .pn,'+h+'#stbot,'+h+'#stnm,'+h+'#vbot,'+h+'#vnm,'+h+'#zf{background:'+v.pn+';color:'+v.tx+'}',
 h+'#dc .pn{background:'+v.cd+'}',h+'#dsub button{background:'+v.so+';box-shadow:0 2px 0 '+v.sh+'}',h+'#dsub button.on{background:'+v.on+';color:'+v.ontx+'}',
 h+'.cd.eq{background:'+v.eq+'}',h+'.cd.on{background:'+v.hi+'}',h+'.bar{background:'+v.so2+'}',
 h+'#menu{background:'+v.menu+'}',h+'#toast{background:'+v.tbg+';color:'+v.ttx+'}',
 h+'.thc{background:'+v.cd+'!important;color:'+v.tx+'!important}',h+'.ths{background:'+v.so+'!important;color:'+v.tx+'!important}',h+'.thh{background:'+v.hi+'!important;color:'+v.tx+'!important}',
 h+'.thb{background:'+v.cd+'!important;color:'+v.tx+'!important;box-shadow:0 4px 0 '+v.sh+'!important}',
 h+'.nk div{background:'+v.so+'}',
 /* 새 UI 칸들 */
 h+'.flow,'+h+'.prc,'+h+'.uc,'+h+'.srow,'+h+'.cur,'+h+'.lgb,'+h+'.gl3 div,'+h+'.chip{background:'+v.so+'}',h+'.flow .nd,'+h+'.inf{background:'+v.cd+';color:'+v.tx+'}',h+'.seg{background:'+v.so2+'}',h+'.uc.hot,'+h+'.flow .nd.red{background:'+v.hi+'}',h+'.gl3 div.ok,'+h+'.chip.ok{background:'+v.eq+';color:'+v.tx+'}',h+'.nx{border-color:'+v.so2+'}',h+'.dots i{background:'+v.so2+'}',h+'.lbar{background:'+v.so2+'}',h+'.hero{background:'+v.so+'}',h+'.more{background:transparent;box-shadow:none}',h+'.seg button{background:transparent;box-shadow:none}',h+'.seg button.on{background:#ffc94a;color:#4a3010}',h+'.ub{background:#ffc94a;box-shadow:0 3px 0 #d9a020;color:#4a3010}',h+'.ub.no{background:'+v.so2+';box-shadow:0 3px 0 '+v.sh+';color:#8a8a8a}',h+'.ub.done{background:'+v.eq+';box-shadow:0 3px 0 '+v.sh+';color:'+v.tx+'}',h+'.nk div.on{background:'+v.hi+'}',
 /* 연한 색 버튼(초록·분홍·노랑)은 바탕을 그대로 두고 글자만 진하게 */
 h+'.bkg,'+h+'#biz,'+h+'#happ,'+h+'#nbs,'+h+'#nst,'+h+'#str,'+h+'#vlk,'+h+'.big.alt,'+h+'#bk,'+h+'.debt{color:#4a3010}',
 h+'[data-thb]{box-shadow:0 3px 0 '+v.sh+'}'].join('\n')}
/* 테마 고르기 줄 (설정 화면) */
const base='.throw{display:flex;gap:6px;margin-top:10px;align-items:center}.throw span{font-size:17px;white-space:nowrap}.throw button{flex:1;height:44px;font-size:16px;padding:0;border-radius:14px}.throw button.on{outline:3px solid #ffc94a}';
function apply(k){document.documentElement.setAttribute('data-th',k);document.querySelectorAll('[data-thb]').forEach(b=>b.classList.toggle('on',b.getAttribute('data-thb')===k));
 const mt=document.querySelector('meta[name="theme-color"]');if(mt)mt.setAttribute('content',k==='black'?'#1e1a17':k==='white'?'#f3f4f6':'#ffd9a0')}
function set(k){if(!L.some(x=>x.k===k))return;try{localStorage.setItem(KEY,k)}catch(e){}apply(k)}
(function init(){const st=document.createElement('style');st.textContent=base+'\n'+css('white',V.white)+'\n'+css('black',V.black);(document.head||document.documentElement).appendChild(st);apply(get());
 const bind=()=>{document.querySelectorAll('[data-thb]').forEach(b=>{b.onclick=()=>{set(b.getAttribute('data-thb'))}});apply(get())};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind()})();
/* 게임 화면 위쪽 정보 바 색 (캔버스) */
const hud=()=>({white:'#4b5160',black:'#231d1a'})[get()]||'#8a5a3a';
return{get,set,list:L,hud}})();
