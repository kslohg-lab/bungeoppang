/* 가게 순위·구경 연결 (Firebase 익명 로그인 + Firestore). 챌린지와 같은 익명 사용자예요.
   shops/{uid}: 가게 모습 요약 + 꾸미기 점수(sc) + 좋아요 수(lk). 좋아요는 shops/{uid}/likes/{방문자}_{날짜}로 한 사람 하루 한 번.
   💌 방명록 스티커: shops/{uid}/notes/{방문자} = {s 스티커 번호, n·nk 남긴 사람 가게 이름·닉네임, d 날짜, t} (하루 한 번 덮어쓰기, 주인만 목록 보기) */
import {CFG} from './firebase-config.js';
import {presence} from './stat.js?v=2';
window.NET={off:true};
if(CFG&&CFG.apiKey&&CFG.projectId){window.NET={off:true,pending:true};
 (async()=>{
  const V='10.8.0',base='https://www.gstatic.com/firebasejs/'+V+'/';
  try{
   const [{initializeApp},{getAuth,signInAnonymously},F]=await Promise.all([import(base+'firebase-app.js'),import(base+'firebase-auth.js'),import(base+'firebase-firestore.js')]);
   const {getFirestore,doc,getDoc,setDoc,collection,query,orderBy,limit,getDocs,writeBatch,serverTimestamp,increment,where,Timestamp}=F;
   /* 한국 시간 날짜 번호 (규칙과 같은 계산) */const day=()=>Math.floor((Date.now()+32400000)/86400000);
   const app=initializeApp(CFG),auth=getAuth(app),db=getFirestore(app);
   let authP=null;const login=()=>authP||(authP=signInAnonymously(auth).then(c=>c.user.uid).catch(e=>{authP=null;throw e}));
   const cache=new Map();
   /* 🙈 숨김 목록 · ⏳ 무료 한도(resource-exhausted)에 걸렸는지 기억 */
   const hid=async()=>{try{if(window.HIDE)await window.HIDE.load()}catch(e){}return u=>!!(window.HIDE&&window.HIDE.has(u))};
   const full=e=>{if(e&&e.code==='resource-exhausted')N.full=Date.now();throw e};
   const N={off:false,uid:null,
    async save(d){const uid=await login();N.uid=uid;const r=doc(db,'shops',uid),mk='bpShopMade:'+uid;let made=false;try{made=localStorage.getItem(mk)==='1'}catch(e){}
     /* 처음 한 번만 있는지 확인 (그다음부턴 읽지 않고 바로 저장) */let ex=made;if(!made){ex=(await getDoc(r)).exists();try{localStorage.setItem(mk,'1')}catch(e){}}
     const body=Object.assign({},d,{ts:serverTimestamp()});if(!ex)body.lk=0;await setDoc(r,body,{merge:true});cache.clear();return true},
    async top(by){const k='top:'+by,c=cache.get(k);if(c&&Date.now()-c.t<600000)return c.v; /* 10분 */
     const H=await hid();const snap=await getDocs(query(collection(db,'shops'),orderBy(by==='lk'?'lk':'sc','desc'),limit(40))).catch(full);
     /* 같은 가게 이름 + 같은 사장님 닉네임(같은 사람이 여러 기기에서 만든 가게)은 위쪽 하나만 */
     const seen=new Set(),v=[];for(const x of snap.docs){const d=x.data(),k=String(d.n||'').trim()+'|'+String(d.nk||'').trim();if(H(x.id)||seen.has(k))continue;seen.add(k);v.push({u:x.id,n:d.n,nk:d.nk,g:d.g,sc:d.sc,lk:d.lk|0,room:d.room});if(v.length>=30)break}cache.set(k,{t:Date.now(),v});return v},
    /* 🐟 붕어빵 동네 후보: 비슷한 가게(위·아래 12씩) + 큰 가게(내 점수 3배 이상 8) + 상위권 8 → 최대 읽기 40, 하루 한 번 */
    async pool(sc,me){const uid=await login().catch(()=>null),col=collection(db,'shops'),big=Math.max(sc*3,sc+5000),H=await hid();
     const [a,b,c,d]=await Promise.all([getDocs(query(col,where('sc','>',sc),orderBy('sc','asc'),limit(12))),getDocs(query(col,where('sc','<=',sc),orderBy('sc','desc'),limit(12))),
      getDocs(query(col,where('sc','>=',big),orderBy('sc','asc'),limit(8))),getDocs(query(col,orderBy('sc','desc'),limit(8)))]).catch(full);
     const seen=new Set(me?[me]:[]),o=[],add=(ds,top)=>{for(const x of ds){const v=x.data(),k=String(v.n||'').trim()+'|'+String(v.nk||'').trim();if(H(x.id))continue;if(x.id===uid||seen.has(k)){if(top){const f=o.find(r=>r.u===x.id);if(f)f.top=1}continue}seen.add(k);o.push({u:x.id,n:v.n,nk:v.nk,g:v.g|0,sc:v.sc|0,room:v.room|0,eq:v.eq||{},top:top?1:0})}};
     add(d.docs,1);add(a.docs);add(b.docs);add(c.docs);return o},
    async get(uid){const s=await getDoc(doc(db,'shops',uid)).catch(full);return s.exists()?s.data():null},
    async liked(uid){const me=await login();N.uid=me;const s=await getDoc(doc(db,'shops',uid,'likes',me+'_'+day()));return s.exists()},
    async like(uid){const me=await login();N.uid=me;if(me===uid)return false;const b=writeBatch(db);
     b.set(doc(db,'shops',uid,'likes',me+'_'+day()),{t:serverTimestamp()});b.update(doc(db,'shops',uid),{lk:increment(1)});await b.commit();cache.clear();return true},
    /* 💌 오늘 이 가게에 남긴 스티커 (없으면 -1) */
    async noteMine(uid){const me=await login();N.uid=me;const s=await getDoc(doc(db,'shops',uid,'notes',me));if(!s.exists())return -1;const v=s.data();return v.d===day()?v.s|0:-1},
    async note(uid,st){const me=await login();N.uid=me;if(me===uid)return false;const my=await getDoc(doc(db,'shops',me));if(!my.exists())throw new Error('noshop');const m=my.data();
     await setDoc(doc(db,'shops',uid,'notes',me),{s:st|0,n:m.n,nk:m.nk||'',d:day(),t:serverTimestamp()});return true},
    /* 내 가게 방명록: 최근 20개 · 새 것 개수(since 이후, 최대 9) */
    async notes(){const me=await login();N.uid=me;const q=await getDocs(query(collection(db,'shops',me,'notes'),orderBy('t','desc'),limit(20))).catch(full);return q.docs.map(x=>{const v=x.data();return{u:x.id,s:v.s|0,n:v.n||'',nk:v.nk||'',t:v.t&&v.t.toMillis?v.t.toMillis():0}})},
    async newNotes(since){const me=await login();N.uid=me;const q=await getDocs(query(collection(db,'shops',me,'notes'),where('t','>',Timestamp.fromMillis(since|0)),orderBy('t','desc'),limit(9)));return q.size},
    /* 🚩 신고 (가게 구경): r 0 이름 · 1 점수 · 2 기타. 한 사람이 한 대상에 한 번 */
    async report(u,r){const me=await login();N.uid=me;if(me===u)return false;await setDoc(doc(db,'reports',me+'_'+u),{u,r:r|0,k:'s',t:serverTimestamp()});return true},
    bust(){cache.clear()}};
   presence(db,login,F,'s');
   window.NET=N;login().then(u=>{N.uid=u;window.dispatchEvent(new Event('net-ready'))}).catch(e=>console.warn('NET login',e&&e.code||e));
  }catch(e){console.warn('NET init',e);window.NET={off:true}}
 })();
}
