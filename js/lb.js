/* 순위표 연결 (Firebase 익명 로그인 + Firestore). 설정이 비어 있으면 꺼진 채로 둡니다. */
import {CFG} from './firebase-config.js';
import {presence} from './stat.js?v=2';
const SIMV=typeof BP2!=='undefined'?BP2.SIMV:1;

if(!CFG||!CFG.apiKey||!CFG.projectId){window.LB={off:true}}
else{
 (async()=>{
  const V='10.8.0',base='https://www.gstatic.com/firebasejs/'+V+'/';
  try{
   const [{initializeApp},{getAuth,signInAnonymously,onAuthStateChanged},{getFirestore,doc,getDoc,collection,query,orderBy,limit,getDocs,setDoc,serverTimestamp,where,getCountFromServer}]=
     await Promise.all([import(base+'firebase-app.js'),import(base+'firebase-auth.js'),import(base+'firebase-firestore.js')]);
   const app=initializeApp(CFG),auth=getAuth(app),db=getFirestore(app);
   let authP=null;
   /* 구글로 로그인해 둔 사람이면 그 계정 그대로 (익명으로 새로 들어가면 안 돼요) */
   const ready=new Promise(r=>{const u=onAuthStateChanged(auth,x=>{u();r(x)})});
   const login=()=>authP||(authP=ready.then(u=>auth.currentUser?auth.currentUser.uid:signInAnonymously(auth).then(c=>c.user.uid)).catch(e=>{authP=null;throw e}));
   const cache=new Map();
   const b64=u8=>{let s='';for(let i=0;i<u8.length;i+=0x8000)s+=String.fromCharCode.apply(null,u8.subarray(i,i+0x8000));return btoa(s)};
   async function pack(lg){const j=JSON.stringify(lg);
    if(typeof CompressionStream==='undefined')return j.length<390000?'j:'+j:null;
    const cs=new Blob([j]).stream().pipeThrough(new CompressionStream('gzip'));
    const buf=new Uint8Array(await new Response(cs).arrayBuffer());const out='g:'+b64(buf);return out.length<390000?out:null}
   let chain=Promise.resolve();
   /* 🙈 숨김 목록 (hide.js) · ⏳ 무료 한도에 걸렸는지(resource-exhausted) */
   const hid=async()=>{try{if(window.HIDE)await window.HIDE.load()}catch(e){}return u=>!!(window.HIDE&&window.HIDE.has(u))};
   const full=e=>{if(e&&e.code==='resource-exhausted')LBo.full=Date.now();throw e};
   /* 📮 못 보낸 점수: 폰에 기억했다가 다음에 다시 보내요 (이번 주 것만 · 규칙상 지난 주는 못 보냄) */
   const PK='bpLbPend',pend=v=>{try{if(v===undefined)return JSON.parse(localStorage.getItem(PK)||'null');if(v===null)localStorage.removeItem(PK);else localStorage.setItem(PK,JSON.stringify(v))}catch(e){return null}};
   const wkNow=()=>typeof BP2!=='undefined'&&BP2.weekId?BP2.weekId(Date.now()):-1;
   const LBo={
    off:false,uid:null,
    bust(){cache.clear()},
    /* 이번 주(또는 지난 주) 위쪽 30명 */
    async top(w){const c=cache.get(w);if(c&&Date.now()-c.t<600000)return c.rows; /* 10분 동안은 다시 안 읽어요 (무료 한도 아끼기) */
     const q=query(collection(db,'weeks',String(w),'scores'),orderBy('sc','desc'),limit(40));const H=await hid();
     const snap=await getDocs(q).catch(full);
     /* 같은 닉네임(같은 사람이 여러 기기에서 한 기록)은 제일 높은 것 하나만 */
     const seen=new Set(),rows=[];for(const d of snap.docs){const x=d.data(),k=String(x.n||'').trim();if(H(d.id))continue;if(k&&seen.has(k))continue;seen.add(k);rows.push({u:d.id,n:x.n,st:x.st,net:x.net,live:x.live===true,ts:x.ts&&x.ts.toMillis?x.ts.toMillis():0});if(rows.length>=30)break}
     cache.set(w,{t:Date.now(),rows});return rows},
    /* 점수 보내기 (한 번에 하나씩 순서대로). live=판 진행 중. 점수를 먼저 올리고, lg 가 있으면 검증 기록은 따로(실패해도 점수는 남음) */
    submit(e){chain=chain.then(async()=>{let ok=false;try{
      const uid=await login();LBo.uid=uid;
      await setDoc(doc(db,'weeks',String(e.w),'scores',uid),{w:e.w,n:e.n,st:e.st,net:e.net,sc:e.st*1000000000+e.net,v:SIMV,ts:serverTimestamp(),live:!!e.live});
      ok=true;cache.delete(e.w);
      if(e.lg){const p=await pack(e.lg);if(p)await setDoc(doc(db,'weeks',String(e.w),'proofs',uid),{w:e.w,st:e.st,v:SIMV,p})}
     }catch(err){console.warn('LB submit',err&&err.code||err);if(err&&err.code==='resource-exhausted')LBo.full=Date.now();
      /* 못 보냈으면 기억 (더 높은 점수만) */if(!e.retry){const o=pend(),sc=e.st*1000000000+e.net;if(!o||o.w!==e.w||o.st*1000000000+o.net<=sc){const v=Object.assign({},e,{live:false});if(v.lg&&JSON.stringify(v.lg).length>300000)delete v.lg;pend(v)}}}
     if(ok){const o=pend();if(o&&o.w===e.w&&o.st*1000000000+o.net<=e.st*1000000000+e.net)pend(null)}return ok});return chain},
    /* 다시 보내기: 열 때 · 인터넷이 다시 연결될 때 */
    retry(){const o=pend();if(!o)return;if(o.w!==wkNow()){pend(null);return}LBo.submit(Object.assign({},o,{retry:true})).then(ok=>{if(ok){pend(null);dispatchEvent(new CustomEvent('lb-sent',{detail:o}))}})},
    /* 🚩 신고 (챌린지 순위표): 한 사람이 한 대상에 한 번 */
    async report(u,r){const me=await login();LBo.uid=me;if(me===u)return false;await setDoc(doc(db,'reports',me+'_'+u),{u,r:r|0,k:'c',t:serverTimestamp()});return true}
   };
   /* 내 순위 = 나보다 점수 높은 사람 수 + 1 (개수 세기는 읽기 1번) */
   /* 숨김 목록에 있는 사람이 나보다 위면 빼고 세요 (숨김 인원만큼 읽기) */
   LBo.rank=async(w,sc)=>{const k='rk:'+w+':'+sc,c=cache.get(k);if(c&&Date.now()-c.t<300000)return c.v;
    let n=(await getCountFromServer(query(collection(db,'weeks',String(w),'scores'),where('sc','>',sc))).catch(full)).data().count;
    await hid();const hs=window.HIDE?window.HIDE.list().slice(0,40):[];if(n&&hs.length){const ds=await Promise.all(hs.map(u=>getDoc(doc(db,'weeks',String(w),'scores',u)).catch(()=>null)));n-=ds.filter(d=>d&&d.exists()&&Number(d.data().sc)>sc).length;n=Math.max(0,n)}
    cache.set(k,{t:Date.now(),v:n+1});return n+1};
   /* 내 위·아래 3명씩 (30위 밖일 때 순위표 아래에) */
   LBo.around=async(w,sc)=>{const ck='ar:'+w+':'+sc,cc=cache.get(ck);if(cc&&Date.now()-cc.t<300000)return cc.v;const H=await hid();const col=collection(db,'weeks',String(w),'scores'),mp=d=>{const x=d.data();return{u:d.id,n:x.n,st:x.st,net:x.net,live:x.live===true,ts:x.ts&&x.ts.toMillis?x.ts.toMillis():0}};
    const [a,b]=await Promise.all([getDocs(query(col,where('sc','>',sc),orderBy('sc','asc'),limit(4))),getDocs(query(col,where('sc','<',sc),orderBy('sc','desc'),limit(4)))]).catch(full);
    const v={above:a.docs.filter(d=>!H(d.id)).slice(0,3).map(mp).reverse(),below:b.docs.filter(d=>!H(d.id)).slice(0,3).map(mp)};cache.set(ck,{t:Date.now(),v});return v};
   /* 📊 접속 기록 (운영자 통계용): 하루 한 번 + 보고 있는 동안 5분마다 '지금 접속' */
   presence(db,login,{doc,setDoc,serverTimestamp},'c');
   window.LB=LBo;
   login().then(u=>{LBo.uid=u;setTimeout(()=>LBo.retry(),3000)}).catch(e=>console.warn('LB login',e&&e.code||e));
   addEventListener('online',()=>LBo.retry());
  }catch(e){console.warn('LB init',e);window.LB={off:true}}
 })();
}
