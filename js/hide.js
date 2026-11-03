/* 🙈 숨김 목록 (hidden.json · 운영자가 깃허브에서 고쳐요): 챌린지 순위표 · 가게 순위 · 붕어빵 동네 · 등수 보상에서 빼요.
   Vercel 파일이라 Firebase 사용량이 들지 않아요. 10분마다 새로 받아요. */
window.HIDE=(()=>{let S=null,P=null,T=0;
 const load=()=>{if(P&&Date.now()-T<600000)return P;T=Date.now();P=fetch('hidden.json?'+Math.floor(Date.now()/600000),{cache:'no-store'}).then(r=>r.ok?r.json():{uids:[]}).then(j=>{S=new Set(Array.isArray(j.uids)?j.uids:[]);return S}).catch(()=>{S=S||new Set();return S});return P};
 load();return{load,has:u=>!!(S&&S.has(u)),list:()=>S?[...S]:[]}})();
