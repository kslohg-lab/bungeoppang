/* 📊 운영자 통계용 접속 기록 (lb.js·net.js가 불러요, 혼자서는 아무것도 안 해요) */
/* 접속 기록: stats_days/{한국 날짜}/u/{uid}(하루 한 번), stats_new/{날짜}/u/{uid}(이 기기 첫 방문), stats_live/{uid}(5분마다) */
export function presence(db,login,F,page){const {doc,setDoc,serverTimestamp}=F,ls=(k,v)=>{try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}};
 const day=()=>String(Math.floor((Date.now()+9*3600e3)/864e5));
 const beat=async()=>{if(document.hidden)return;try{const uid=await login(),d=day();
  if(ls('bpSeen')!==d){await setDoc(doc(db,'stats_days',d,'u',uid),{p:page,t:serverTimestamp()});ls('bpSeen',d);if(!ls('bpFirst')){ls('bpFirst',d);await setDoc(doc(db,'stats_new',d,'u',uid),{p:page,t:serverTimestamp()})}}
  await setDoc(doc(db,'stats_live',uid),{p:page,t:serverTimestamp()})}catch(e){}};
 setTimeout(beat,4000);setInterval(beat,5*60*1000)}
