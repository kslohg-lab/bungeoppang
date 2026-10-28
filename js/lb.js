/* 순위표 연결 (Firebase 익명 로그인 + Firestore). 설정이 비어 있으면 꺼진 채로 둡니다. */
import {CFG} from './firebase-config.js';
const SIMV=typeof BP2!=='undefined'?BP2.SIMV:1;
if(!CFG||!CFG.apiKey||!CFG.projectId){window.LB={off:true}}
else{
 (async()=>{
  const V='10.8.0',base='https://www.gstatic.com/firebasejs/'+V+'/';
  try{
   const [{initializeApp},{getAuth,signInAnonymously},{getFirestore,doc,collection,query,orderBy,limit,getDocs,setDoc,serverTimestamp}]=
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
    async top(w){const c=cache.get(w);if(c&&Date.now()-c.t<45000)return c.rows;
     const q=query(collection(db,'weeks',String(w),'scores'),orderBy('sc','desc'),limit(30));
     const snap=await getDocs(q);const rows=snap.docs.map(d=>{const x=d.data();return{u:d.id,n:x.n,st:x.st,net:x.net,live:x.live===true,ts:x.ts&&x.ts.toMillis?x.ts.toMillis():0}});
     cache.set(w,{t:Date.now(),rows});return rows},
    /* 점수 보내기 (한 번에 하나씩 순서대로). live=판 진행 중. 점수를 먼저 올리고, lg 가 있으면 검증 기록은 따로(실패해도 점수는 남음) */
    submit(e){chain=chain.then(async()=>{let ok=false;try{
      const uid=await login();LBo.uid=uid;
      await setDoc(doc(db,'weeks',String(e.w),'scores',uid),{w:e.w,n:e.n,st:e.st,net:e.net,sc:e.st*1000000000+e.net,v:SIMV,ts:serverTimestamp(),live:!!e.live});
      ok=true;cache.delete(e.w);
      if(e.lg){const p=await pack(e.lg);if(p)await setDoc(doc(db,'weeks',String(e.w),'proofs',uid),{w:e.w,st:e.st,v:SIMV,p})}
     }catch(err){console.warn('LB submit',err&&err.code||err)}return ok});return chain}
   };
   window.LB=LBo;
   login().then(u=>{LBo.uid=u}).catch(e=>console.warn('LB login',e&&e.code||e));
  }catch(e){console.warn('LB init',e);window.LB={off:true}}
 })();
}
