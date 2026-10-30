/* 가게 순위·구경 연결 (Firebase 익명 로그인 + Firestore). 챌린지와 같은 익명 사용자예요.
   shops/{uid}: 가게 모습 요약 + 꾸미기 점수(sc) + 좋아요 수(lk). 좋아요는 shops/{uid}/likes/{방문자}로 한 사람 한 번 */
import {CFG} from './firebase-config.js';
import {presence} from './stat.js?v=1';
window.NET={off:true};
if(CFG&&CFG.apiKey&&CFG.projectId){window.NET={off:true,pending:true};
 (async()=>{
  const V='10.8.0',base='https://www.gstatic.com/firebasejs/'+V+'/';
  try{
   const [{initializeApp},{getAuth,signInAnonymously},F]=await Promise.all([import(base+'firebase-app.js'),import(base+'firebase-auth.js'),import(base+'firebase-firestore.js')]);
   const {getFirestore,doc,getDoc,setDoc,collection,query,orderBy,limit,getDocs,writeBatch,serverTimestamp,increment}=F;
   const app=initializeApp(CFG),auth=getAuth(app),db=getFirestore(app);
   let authP=null;const login=()=>authP||(authP=signInAnonymously(auth).then(c=>c.user.uid).catch(e=>{authP=null;throw e}));
   const cache=new Map();
   const N={off:false,uid:null,
    async save(d){const uid=await login();N.uid=uid;const r=doc(db,'shops',uid),mk='bpShopMade:'+uid;let made=false;try{made=localStorage.getItem(mk)==='1'}catch(e){}
     /* 처음 한 번만 있는지 확인 (그다음부턴 읽지 않고 바로 저장) */let ex=made;if(!made){ex=(await getDoc(r)).exists();try{localStorage.setItem(mk,'1')}catch(e){}}
     const body=Object.assign({},d,{ts:serverTimestamp()});if(!ex)body.lk=0;await setDoc(r,body,{merge:true});cache.clear();return true},
    async top(by){const k='top:'+by,c=cache.get(k);if(c&&Date.now()-c.t<120000)return c.v;
     const snap=await getDocs(query(collection(db,'shops'),orderBy(by==='lk'?'lk':'sc','desc'),limit(36)));
     /* 같은 가게 이름 + 같은 사장님 닉네임(같은 사람이 여러 기기에서 만든 가게)은 위쪽 하나만 */
     const seen=new Set(),v=[];for(const x of snap.docs){const d=x.data(),k=String(d.n||'').trim()+'|'+String(d.nk||'').trim();if(seen.has(k))continue;seen.add(k);v.push({u:x.id,n:d.n,nk:d.nk,g:d.g,sc:d.sc,lk:d.lk|0,room:d.room});if(v.length>=30)break}cache.set(k,{t:Date.now(),v});return v},
    async get(uid){const s=await getDoc(doc(db,'shops',uid));return s.exists()?s.data():null},
    async liked(uid){const me=await login();N.uid=me;const s=await getDoc(doc(db,'shops',uid,'likes',me));return s.exists()},
    async like(uid){const me=await login();N.uid=me;if(me===uid)return false;const b=writeBatch(db);
     b.set(doc(db,'shops',uid,'likes',me),{t:serverTimestamp()});b.update(doc(db,'shops',uid),{lk:increment(1)});await b.commit();cache.clear();return true},
    bust(){cache.clear()}};
   presence(db,login,F,'s');
   window.NET=N;login().then(u=>{N.uid=u;window.dispatchEvent(new Event('net-ready'))}).catch(e=>console.warn('NET login',e&&e.code||e));
  }catch(e){console.warn('NET init',e);window.NET={off:true}}
 })();
}
