/* 순위표 연결 (Firebase 익명 로그인 + Firestore). 설정이 비어 있으면 꺼진 채로 둡니다. */
import {CFG} from './firebase-config.js';
import {presence} from './stat.js?v=2';
const SIMV=typeof BP2!=='undefined'?BP2.SIMV:1;

if(!CFG||!CFG.apiKey||!CFG.projectId){window.LB={off:true}}
else{
 (async()=>{
  const V='10.8.0',base='https://www.gstatic.com/firebasejs/'+V+'/';
  try{
   const [{initializeApp},{getAuth,signInAnonymously},{getFirestore,doc,collection,query,orderBy,limit,getDocs,setDoc,serverTimestamp,where,getCountFromServer}]=
     await Promise.all([import(base+'firebase-app.js'),import(base+'firebase-auth.js'),import(base+'firebase-firestore.js')]);
   const app=initializeApp(CFG),auth=getAuth(app),db=getFirestore(app);
   let authP=null;
   const login=()=>authP||(authP=signInAnonymously(auth).then(c=>c.user.uid).catch(e=>{authP=null;throw e}));
   const cache=new Map();
   const b64=u8=>{let s='';for(let i=0;i<u8.length;i+=0x8000)s+=String.fromCharCode.apply(null,u8.subarray(i,i+0x8000));return btoa(s)};
   async function pack(lg){const j=JSON.stringify(lg);
    if(typeof CompressionStream==='undefined')return j.length<390000?'j:'+j:null;
    const cs=new Blob([j]).stream().pipeThrough(new CompressionStream('gzip'));
    const buf=new Uint8Array(await new Response(cs).arrayBuffer());const out='g:'+b64(buf);return out.length<390000?out:null}
   let chain=Promise.resolve();
   const LBo={
    off:false,uid:null,
    bust(){cache.clear()},
    /* 이번 주(또는 지난 주) 위쪽 30명 */
    async top(w){const c=cache.get(w);if(c&&Date.now()-c.t<120000)return c.rows; /* 2분 동안은 다시 안 읽어요 */
     const q=query(collection(db,'weeks',String(w),'scores'),orderBy('sc','desc'),limit(36));
     const snap=await getDocs(q);
     /* 같은 닉네임(같은 사람이 여러 기기에서 한 기록)은 제일 높은 것 하나만 */
     const seen=new Set(),rows=[];for(const d of snap.docs){const x=d.data(),k=String(x.n||'').trim();if(k&&seen.has(k))continue;seen.add(k);rows.push({u:d.id,n:x.n,st:x.st,net:x.net,live:x.live===true,ts:x.ts&&x.ts.toMillis?x.ts.toMillis():0});if(rows.length>=30)break}
     cache.set(w,{t:Date.now(),rows});return rows},
    /* 점수 보내기 (한 번에 하나씩 순서대로). live=판 진행 중. 점수를 먼저 올리고, lg 가 있으면 검증 기록은 따로(실패해도 점수는 남음) */
    submit(e){chain=chain.then(async()=>{let ok=false;try{
      const uid=await login();LBo.uid=uid;
      await setDoc(doc(db,'weeks',String(e.w),'scores',uid),{w:e.w,n:e.n,st:e.st,net:e.net,sc:e.st*1000000000+e.net,v:SIMV,ts:serverTimestamp(),live:!!e.live});
      ok=true;cache.delete(e.w);
      if(e.lg){const p=await pack(e.lg);if(p)await setDoc(doc(db,'weeks',String(e.w),'proofs',uid),{w:e.w,st:e.st,v:SIMV,p})}
     }catch(err){console.warn('LB submit',err&&err.code||err)}return ok});return chain}
   };
   /* 내 순위 = 나보다 점수 높은 사람 수 + 1 (개수 세기는 읽기 1번) */
   LBo.rank=async(w,sc)=>{const k='rk:'+w+':'+sc,c=cache.get(k);if(c&&Date.now()-c.t<60000)return c.v;
    const n=(await getCountFromServer(query(collection(db,'weeks',String(w),'scores'),where('sc','>',sc)))).data().count;cache.set(k,{t:Date.now(),v:n+1});return n+1};
   /* 내 위·아래 3명씩 (30위 밖일 때 순위표 아래에) */
   LBo.around=async(w,sc)=>{const col=collection(db,'weeks',String(w),'scores'),mp=d=>{const x=d.data();return{u:d.id,n:x.n,st:x.st,net:x.net,live:x.live===true,ts:x.ts&&x.ts.toMillis?x.ts.toMillis():0}};
    const [a,b]=await Promise.all([getDocs(query(col,where('sc','>',sc),orderBy('sc','asc'),limit(3))),getDocs(query(col,where('sc','<',sc),orderBy('sc','desc'),limit(3)))]);
    return{above:a.docs.map(mp).reverse(),below:b.docs.map(mp)}};
   /* 📊 접속 기록 (운영자 통계용): 하루 한 번 + 보고 있는 동안 5분마다 '지금 접속' */
   presence(db,login,{doc,setDoc,serverTimestamp},'c');
   window.LB=LBo;
   login().then(u=>{LBo.uid=u}).catch(e=>console.warn('LB login',e&&e.code||e));
  }catch(e){console.warn('LB init',e);window.LB={off:true}}
 })();
}
