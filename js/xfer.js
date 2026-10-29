/* 📦 기록 옮기기 (카톡·사파리·다른 브라우저 → 설치한 앱 / 다른 폰)
   보내기: 이 기기의 챌린지·가게 기록을 압축해서 Firestore xfer/{6자리}에 잠깐 올려요 (15분 안에 쓰기, 한 번 쓰면 지워요).
   받기: 번호로 읽어서 이 기기 기록을 바꾸고 새로고침. window.XFER = {send(), recv(code)} */
import {CFG} from './firebase-config.js';
const KEYS=['bungeoppang2Pub1','bpShopPubV1','bpNewsSeen'],TTL=15*60*1000;
window.XFER={off:true};
if(CFG&&CFG.apiKey&&CFG.projectId){window.XFER={off:true,pending:true};
 (async()=>{
  const V='10.8.0',base='https://www.gstatic.com/firebasejs/'+V+'/';
  try{
   const [{initializeApp,getApps},{getAuth,signInAnonymously},{getFirestore,doc,getDoc,setDoc,deleteDoc,serverTimestamp}]=await Promise.all([import(base+'firebase-app.js'),import(base+'firebase-auth.js'),import(base+'firebase-firestore.js')]);
   const app=(getApps().find(a=>a.name==='xfer'))||initializeApp(CFG,'xfer'),auth=getAuth(app),db=getFirestore(app);
   let authP=null;const login=()=>authP||(authP=signInAnonymously(auth).then(c=>c.user.uid).catch(e=>{authP=null;throw e}));
   const b64=u8=>{let s='';for(let i=0;i<u8.length;i+=0x8000)s+=String.fromCharCode.apply(null,u8.subarray(i,i+0x8000));return btoa(s)};
   const unb64=s=>{const b=atob(s),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u};
   async function pack(o){const j=JSON.stringify(o);if(typeof CompressionStream==='undefined')return'j:'+j;
    const cs=new Blob([j]).stream().pipeThrough(new CompressionStream('gzip'));return'g:'+b64(new Uint8Array(await new Response(cs).arrayBuffer()))}
   async function unpack(p){if(p.startsWith('j:'))return JSON.parse(p.slice(2));
    const ds=new Blob([unb64(p.slice(2))]).stream().pipeThrough(new DecompressionStream('gzip'));return JSON.parse(await new Response(ds).text())}
   const X={off:false,
    /* 이 기기 기록이 있는지 */
    has(){try{const c=JSON.parse(localStorage.getItem(KEYS[0])||'null'),s=JSON.parse(localStorage.getItem(KEYS[1])||'null');return!!((c&&c.nick)||(s&&s.name))}catch(e){return false}},
    async send(){const uid=await login();const o={};KEYS.forEach(k=>{try{const v=localStorage.getItem(k);if(v!=null)o[k]=v}catch(e){}});
     if(!X.has())throw new Error('empty');const p=await pack(o);if(p.length>900000)throw new Error('big');
     for(let i=0;i<6;i++){const code=String(Math.floor(100000+Math.random()*900000));
      try{await setDoc(doc(db,'xfer',code),{p,u:uid,ts:serverTimestamp()});return code}catch(e){if(i===5)throw e}}},
    async recv(code){code=String(code||'').replace(/\D/g,'');if(code.length!==6)throw new Error('code');await login();
     const r=doc(db,'xfer',code),s=await getDoc(r);if(!s.exists())throw new Error('none');const d=s.data();
     const t=d.ts&&d.ts.toMillis?d.ts.toMillis():0;if(t&&Date.now()-t>TTL){deleteDoc(r).catch(()=>{});throw new Error('old')}
     const o=await unpack(d.p);window.__noStore=true;
     try{KEYS.forEach(k=>{if(o[k]!=null)localStorage.setItem(k,o[k]);else if(k!=='bpNewsSeen')localStorage.removeItem(k)});
      /* 가게 이어서: 순위 다시 올리기 */try{const sh=JSON.parse(localStorage.getItem('bpShopPubV1'));if(sh){delete sh.upH;localStorage.setItem('bpShopPubV1',JSON.stringify(sh))}}catch(e){}
     }catch(e){window.__noStore=false;throw e}
     await deleteDoc(r).catch(()=>{});return true}};
   window.XFER=X;
  }catch(e){console.warn('XFER init',e);window.XFER={off:true}}
 })();
}
