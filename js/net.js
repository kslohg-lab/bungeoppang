/* 가게 순위·구경 연결 (Firebase 익명 로그인 + Firestore). 챌린지와 같은 익명 사용자예요.
   shops/{uid}: 가게 모습 요약 + 꾸미기 점수(sc) + 좋아요 수(lk). 좋아요는 shops/{uid}/likes/{방문자} = {t, d 날짜}, 날짜가 바뀌면 덮어써서 하루 한 번.
   💌 방명록 스티커: shops/{uid}/notes/{방문자} = {s 스티커 번호, n·nk 남긴 사람 가게 이름·닉네임, d 날짜, t} (하루 한 번 덮어쓰기, 주인만 목록 보기) */
import {CFG} from './firebase-config.js';
import {presence} from './stat.js?v=2';
window.NET={off:true};
if(CFG&&CFG.apiKey&&CFG.projectId){window.NET={off:true,pending:true};
 (async()=>{
  const V='10.8.0',base='https://www.gstatic.com/firebasejs/'+V+'/';
  try{
   const [{initializeApp},{getAuth,signInAnonymously,onAuthStateChanged},F]=await Promise.all([import(base+'firebase-app.js'),import(base+'firebase-auth.js'),import(base+'firebase-firestore.js')]);
   const {getFirestore,doc,getDoc,setDoc,collection,query,orderBy,limit,getDocs,writeBatch,serverTimestamp,increment,where,Timestamp}=F;
   /* 한국 시간 날짜 번호 (규칙과 같은 계산) */const day=()=>Math.floor((Date.now()+32400000)/86400000);
   const app=initializeApp(CFG),auth=getAuth(app),db=getFirestore(app);
   let authP=null;/* 구글로 로그인해 둔 사람이면 그 계정 그대로 (익명으로 새로 들어가면 안 돼요) */
   const ready=new Promise(r=>{const u=onAuthStateChanged(auth,x=>{u();r(x)})});
   const login=()=>authP||(authP=ready.then(u=>auth.currentUser?auth.currentUser.uid:signInAnonymously(auth).then(c=>c.user.uid)).catch(e=>{authP=null;throw e}));
   const cache=new Map();
   /* 🙈 숨김 목록 · ⏳ 무료 한도(resource-exhausted)에 걸렸는지 기억 */
   const hid=async()=>{try{if(window.HIDE)await window.HIDE.load()}catch(e){}return u=>!!(window.HIDE&&window.HIDE.has(u))};
   const full=e=>{if(e&&e.code==='resource-exhausted')N.full=Date.now();throw e};
   const N={off:false,uid:null,
    /* 저장 (11/8): 🛡️ 점수는 지난 저장 뒤 지난 시간만큼만 올려 보내요(규칙과 같은 계산, 조금 덜) · 📈 이번 주 성장 칸(gw<주>) 같이
       → 저장할 때마다 내 가게 문서를 한 번 읽어요. 돌려주는 값 = 실제로 올린 점수 */
    async save(d){const uid=await login();N.uid=uid;const r=doc(db,'shops',uid),o=await getDoc(r),wk=Math.floor((day()+3)/7);
     const body=Object.assign({},d,{ts:serverTimestamp(),w:wk});
     if(!o.exists()){body.sc=Math.min(body.sc,60000);body.lk=0;body.s0=body.sc;body.wp=0;body.gwp=0;body.hi=body.sc}
     else{const x=o.data(),t0=x.ts&&x.ts.toMillis?x.ts.toMillis():Date.now(),el=Math.max(0,(Date.now()-t0)/1000-120);
      body.sc=Math.min(body.sc,(x.sc|0)+Math.min(150000,Math.floor(el*2.2)));body.lk=x.lk|0;N.myLk=x.lk|0;/* 🏔️ 11/14 주 시작 점수 = 지금까지 최고 점수 (떼었다 다시 놓기로 성장 부풀리기 막기) */const hi0=Number.isInteger(x.hi)?x.hi:(x.sc|0);body.hi=Math.max(hi0,body.sc);body.s0=x.w===wk&&Number.isInteger(x.s0)?x.s0:hi0;
      /* 🏆 11/14 지난 주 성장 옮기기 (규칙이 그대로 옮기는지 확인해요) */if(x.w===wk){body.wp=x.wp|0;body.gwp=x.gwp|0}else{body.wp=x.w|0;body.gwp=x.gw|0}}
     /* 11/8 5.6.7: 주마다 칸 이름을 바꾸던 gw<주> → gw 한 칸 + w(주 번호) (규칙의 string()이 거절을 일으켜서) */body.gw=body.sc-body.s0;await setDoc(r,body);cache.clear();return body.sc},
    async top(by){const k='top:'+by,c=cache.get(k);if(c&&Date.now()-c.t<600000)return c.v; /* 10분 */
     const wk=Math.floor((day()+3)/7),f=by==='lk'?'lk':by==='wk'?'gw':'sc';
     const H=await hid();const snap=await getDocs(query(collection(db,'shops'),orderBy(f,'desc'),limit(by==='wk'?80:40))).catch(full);
     /* 같은 가게 이름 + 같은 사장님 닉네임(같은 사람이 여러 기기에서 만든 가게)은 위쪽 하나만 */
     const seen=new Set(),v=[];for(const x of snap.docs){const d=x.data(),k=String(d.n||'').trim()+'|'+String(d.nk||'').trim();if(H(x.id)||seen.has(k))continue;seen.add(k);if(by==='wk'&&!(d.w===wk&&d.gw>0))continue;v.push({u:x.id,n:d.n,nk:d.nk,g:d.g,sc:d.sc,lk:d.lk|0,room:d.room,gw:d[f]|0});if(v.length>=30)break}cache.set(k,{t:Date.now(),v});return v},
    /* 🏆 11/14 지난 주 꾸미기 성장 상위 30: 아직 이번 주에 저장 안 한 가게(w·gw) + 저장한 가게(wp·gwp) → 읽기 최대 160, 한 주에 한 번 */
    async lastWk(){const wk=Math.floor((day()+3)/7),W=wk-1,H=await hid(),col=collection(db,'shops');
     const [a,b]=await Promise.all([getDocs(query(col,orderBy('gw','desc'),limit(80))),getDocs(query(col,orderBy('gwp','desc'),limit(80)))]).catch(full);
     const m=new Map();for(const x of a.docs.concat(b.docs)){if(H(x.id)||m.has(x.id))continue;const d=x.data(),v=d.w===W?d.gw|0:d.wp===W?d.gwp|0:0;if(v>0)m.set(x.id,{u:x.id,n:d.n,nk:d.nk,v})}
     const seen=new Set(),rows=[];for(const r of [...m.values()].sort((p,q)=>q.v-p.v)){const k=String(r.n||'').trim()+'|'+String(r.nk||'').trim();if(seen.has(k))continue;seen.add(k);rows.push(r);if(rows.length>=30)break}
     return{W,rows}},
    /* 🐟 붕어빵 동네 후보: 비슷한 가게(위·아래 12씩) + 큰 가게(내 점수 3배 이상 8) + 상위권 8 → 최대 읽기 40, 하루 한 번 */
    async pool(sc,me){const uid=await login().catch(()=>null),col=collection(db,'shops'),big=Math.max(sc*3,sc+5000),H=await hid();
     const [a,b,c,d]=await Promise.all([getDocs(query(col,where('sc','>',sc),orderBy('sc','asc'),limit(20))),getDocs(query(col,where('sc','<=',sc),orderBy('sc','desc'),limit(20))),
      getDocs(query(col,where('sc','>=',big),orderBy('sc','asc'),limit(10))),getDocs(query(col,orderBy('sc','desc'),limit(10)))]).catch(full);
     const seen=new Set(me?[me]:[]),o=[],add=(ds,top)=>{for(const x of ds){const v=x.data(),k=String(v.n||'').trim()+'|'+String(v.nk||'').trim();if(H(x.id))continue;if(x.id===uid||seen.has(k)){if(top){const f=o.find(r=>r.u===x.id);if(f)f.top=1}continue}seen.add(k);o.push({u:x.id,n:v.n,nk:v.nk,g:v.g|0,sc:v.sc|0,room:v.room|0,eq:v.eq||{},top:top?1:0})}};
     add(d.docs,1);add(a.docs);add(b.docs);add(c.docs);return o},
    async get(uid){const s=await getDoc(doc(db,'shops',uid)).catch(full);return s.exists()?s.data():null},
    async liked(uid){const me=await login();N.uid=me;const s=await getDoc(doc(db,'shops',uid,'likes',me));return s.exists()&&s.data().d===day()},
    async like(uid){const me=await login();N.uid=me;if(me===uid)return false;const b=writeBatch(db);
     b.set(doc(db,'shops',uid,'likes',me),{t:serverTimestamp(),d:day()});b.update(doc(db,'shops',uid),{lk:increment(1)});await b.commit();cache.clear();return true},
    /* 💌 오늘 이 가게에 남긴 스티커 (없으면 -1) */
    async noteMine(uid){const me=await login();N.uid=me;const s=await getDoc(doc(db,'shops',uid,'notes',me));if(!s.exists())return -1;const v=s.data();return v.d===day()?v.s|0:-1},
    async note(uid,st){const me=await login();N.uid=me;if(me===uid)return false;const my=await getDoc(doc(db,'shops',me));if(!my.exists())throw new Error('noshop');const m=my.data();
     await setDoc(doc(db,'shops',uid,'notes',me),{s:st|0,n:m.n,nk:m.nk||'',d:day(),t:serverTimestamp()});return true},
    /* 내 가게 방명록: 최근 20개 · 새 것 개수(since 이후, 최대 9) */
    async notes(){const me=await login();N.uid=me;const q=await getDocs(query(collection(db,'shops',me,'notes'),orderBy('t','desc'),limit(20))).catch(full);return q.docs.map(x=>{const v=x.data();return{u:x.id,s:v.s|0,n:v.n||'',nk:v.nk||'',t:v.t&&v.t.toMillis?v.t.toMillis():0}})},
    /* 새 것 세기: 최근 20개를 받아 폰에서 비교 (서버 시간 비교는 1ms보다 잘게 저장돼 어긋날 수 있어서) */
    async newNotes(since){const me=await login();N.uid=me;const q=await getDocs(query(collection(db,'shops',me,'notes'),orderBy('t','desc'),limit(20)));N.noteFrom=q.docs.map(x=>{const t=x.data().t;return{u:x.id,t:t&&t.toMillis?Math.floor(t.toMillis()):0}});return q.docs.filter(x=>{const t=x.data().t;return t&&t.toMillis&&Math.floor(t.toMillis())>since}).length},
    /* 🚩 신고 (가게 구경): r 0 이름 · 1 점수 · 2 기타. 한 사람이 한 대상에 한 번 */
    async report(u,r){const me=await login();N.uid=me;if(me===u)return false;await setDoc(doc(db,'reports',me+'_'+u),{u,r:r|0,k:'s',t:serverTimestamp()});return true},
    bust(){cache.clear()}};
   presence(db,login,F,'s');
   window.NET=N;login().then(u=>{N.uid=u;window.dispatchEvent(new Event('net-ready'))}).catch(e=>console.warn('NET login',e&&e.code||e));
  }catch(e){console.warn('NET init',e);window.NET={off:true}}
 })();
}
