/* ===== 🐟 붕어빵 거리 (3D 아이소메트릭): 대각선 길 하나를 따라 가게 건물들이 늘어서요 =====
   STREET(cx,A) → {size, scene(t,list,o), preview(t,d,top,bottom), focus(i), drag(dx,dy), zoom(f), hit(x,y)}
   list = [{d:{room,skin,awn,sign,n,nk,g}, me, u}]
   건물: 바닥 크기 = 가게 크기(4×4 노점은 수레), 층수 = 7×7부터 2층, 9×9부터 3층. 앞면(길 쪽) = 문·차양·간판·진열창, 오른쪽 면 = 창문
   외관 스킨 SK: 0 기본 · 1 벽돌 · 2 통나무 · 3 한옥 · 4 카페 테라스 · 5 과자집 · 6 성 */
const STREET=(cx,A)=>{
const {em,tx,rr,lite,dark,animal}=A;const W=450,OL='#5a3a22';
const SK=[
 {w:'#fff1d6',l:'rgba(150,110,70,.16)',r:'#b98a5e',roof:'flat'},
 {w:'#c8583a',l:'rgba(90,30,15,.32)',r:'#5a3a32',roof:'flat',pat:'brick'},
 {w:'#b47c44',l:'rgba(80,45,15,.38)',r:'#5a7a3a',roof:'gable',pat:'log'},
 {w:'#f6f0e2',l:'#7a4a2a',r:'#4a4a56',roof:'hanok',pat:'hanok'},
 {w:'#cfeee0',l:'rgba(60,120,100,.22)',r:'#e8f6ee',roof:'flat',terrace:1},
 {w:'#c8864a',l:'',r:'#ffb0cc',roof:'candy',pat:'candy'},
 {w:'#b8b4ac',l:'rgba(70,70,70,.28)',r:'#a8a49c',roof:'castle',pat:'stone'}];
const AWC=[['#e8584a','#fff6ec'],['#4a8ae8','#fff6ec'],['#4ab86a','#fff6ec'],['#ff8ab0','#fff0f6'],['#ffcf3a','#fff6ec'],['rb'],['#2a3a7a','#ffd23a'],['#ffb0c8','#fff0f6'],['#d4a020','#fff3c0']];
const RB=['#ff5a5a','#ff9a3a','#ffd93a','#6ccf5a','#4aa8ff','#a85aff'];
const SB=[['#8a5a3a','#fff3c0'],['#ff8ab0','#fff'],['#2a3a32','#f0f0e0'],['#2a1a3a','#e8b0ff'],['#d4a020','#fff6d0'],['#a85aff','#fff'],['#d4a020','#fff6d0'],['#1a2a5a','#fff6c0']];
/* 가게 크기 → 길이(길 방향, 칸)·깊이·층수 */
function size(room){const r=Math.max(4,Math.min(10,room|0));return{w:[1.9,2.6,3.0,3.4,3.8,4.2,4.6][r-4],d:[1.1,2.2,2.4,2.6,2.8,3.0,3.2][r-4],fl:r>=9?3:r>=7?2:1}}
/* ---------- 카메라 ---------- */
let T=40,OX=0,OY=0,CG=0,OFF=0;const SY=455; /* 길 앞쪽 선이 화면 SY 근처 */
const P=(gx,gy,z=0)=>({x:OX+(gx-gy)*T/2,y:OY+(gx+gy)*T/4-z});
function cam(){const v={x:-1/Math.sqrt(5),y:2/Math.sqrt(5)};OX=225+OFF*v.x-CG*T/2;OY=SY+OFF*v.y-CG*T/4}
let span=[0,0];
function drag(dx,dy){const al=(dx*2+dy)/Math.sqrt(5);CG-=al/(T*Math.sqrt(5)/4);OFF=Math.max(-70,Math.min(70,OFF+(-dx+2*dy)/Math.sqrt(5)));CG=Math.max(span[0],Math.min(span[1],CG))}
function zoom(f){T=Math.max(30,Math.min(72,T*f))}
/* ---------- 그리기 도구 ---------- */
const poly=(pts,f,s,lw=2)=>{cx.beginPath();pts.forEach((p,i)=>i?cx.lineTo(p.x,p.y):cx.moveTo(p.x,p.y));cx.closePath();if(f){cx.fillStyle=f;cx.fill()}if(s){cx.strokeStyle=s;cx.lineWidth=lw;cx.stroke()}};
/* 벽 한 면을 평평한 2D처럼 그리기: o=면 왼쪽 아래, len=화면 가로 길이, sl=기울기(앞면 .5 / 오른쪽 면 -.5). fn(len)에서 y는 위로 음수 */
function face(o,len,sl,fn){cx.save();cx.translate(o.x,o.y);cx.transform(1,sl,0,1,0,0);fn(len);cx.restore()}
const box=(x,y,w,h,f,r=3,lw=1.8)=>{rr(x,y,w,h,r,f);cx.strokeStyle=OL;cx.lineWidth=lw;cx.beginPath();cx.roundRect(x,y,w,h,r);cx.stroke()};
function awning(x,y,w,h,ai){const ac=AWC[ai|0]||AWC[0],n=Math.max(4,Math.round(w/12));for(let i=0;i<n;i++){const c=ac[0]==='rb'?RB[i%6]:i%2?ac[1]:ac[0];const x0=x+w*i/n,x1=x+w*(i+1)/n;cx.fillStyle=c;cx.beginPath();cx.moveTo(x0,y);cx.lineTo(x1,y);cx.lineTo(x1,y+h);cx.arc((x0+x1)/2,y+h,(x1-x0)/2,0,Math.PI);cx.closePath();cx.fill()}
 cx.strokeStyle=OL;cx.lineWidth=1.6;cx.beginPath();cx.moveTo(x,y);cx.lineTo(x+w,y);cx.stroke()}
function sign(x,y,w,h,name,si,t){const sb=SB[si|0]||SB[0];box(x,y,w,h,sb[0],4,1.6);let fs=Math.min(h*.66,16);cx.font='bold '+fs+'px "Jua","Noto Sans KR",sans-serif';while(cx.measureText(name).width>w-6&&fs>7){fs-=.5;cx.font='bold '+fs+'px "Jua","Noto Sans KR",sans-serif'}tx(name,x+w/2,y+h/2+1,fs,sb[1],'center',sb[0]);
 if((si|0)===7)for(let i=0;i<3;i++){cx.globalAlpha=.4+.6*Math.abs(Math.sin(t*2+i));em('✨',x+w*(.15+i*.35),y-5,9);cx.globalAlpha=1}}
function wallPat(st,len,h){if(!st.pat&&!st.l)return;cx.save();cx.beginPath();cx.rect(0,-h,len,h);cx.clip();cx.strokeStyle=st.l;cx.lineWidth=1;const s=T/40;
 if(st.pat==='brick'){const bh=6*s,bw=13*s;for(let y=-bh,r=0;y>-h;y-=bh,r++){cx.beginPath();cx.moveTo(0,y);cx.lineTo(len,y);cx.stroke();for(let x=(r%2?bw/2:0);x<len;x+=bw){cx.beginPath();cx.moveTo(x,y);cx.lineTo(x,y+bh);cx.stroke()}}}
 else if(st.pat==='log'){cx.lineWidth=1.6;for(let y=-8*s;y>-h;y-=8*s){cx.beginPath();cx.moveTo(0,y);cx.lineTo(len,y);cx.stroke()}}
 else if(st.pat==='stone'){const bh=9*s,bw=18*s;for(let y=-bh,r=0;y>-h;y-=bh,r++){cx.beginPath();cx.moveTo(0,y);cx.lineTo(len,y);cx.stroke();for(let x=(r%2?bw/2:0);x<len;x+=bw){cx.beginPath();cx.moveTo(x,y);cx.lineTo(x,y+bh);cx.stroke()}}}
 else if(st.pat==='hanok'){cx.lineWidth=3*s;cx.strokeStyle=st.l;for(const u of[0,.5,1]){cx.beginPath();cx.moveTo(len*u,0);cx.lineTo(len*u,-h);cx.stroke()}cx.beginPath();cx.moveTo(0,-h+2);cx.lineTo(len,-h+2);cx.stroke()}
 else if(st.pat==='candy'){for(let i=0;i<10;i++){cx.fillStyle=['#ff6a8a','#7ed8ff','#ffe066','#9ad870'][i%4];cx.beginPath();cx.arc(((i*37)%100)/100*len,-((i*61)%100)/100*h*.85-4,2*s,0,7);cx.fill()}}
 else{for(let x=10*s;x<len;x+=10*s){cx.beginPath();cx.moveTo(x,0);cx.lineTo(x,-h);cx.stroke()}}
 cx.restore()}
function steam(x,y,t,s){for(let i=0;i<2;i++){const ph=(t*.8+i*.5)%1;cx.fillStyle='rgba(255,255,255,'+(.6*(1-ph))+')';cx.beginPath();cx.ellipse(x+i*8*s,y-ph*14*s,(2+ph*3)*s,(1.5+ph*2)*s,0,0,7);cx.fill()}}
/* 창문 (면 위 로컬 좌표) */
function win(x,y,w,h,hanok){box(x,y,w,h,'#ffeeaa',2,1.4);cx.fillStyle='rgba(255,255,255,.55)';cx.fillRect(x+2,y+2,w*.3,h*.3);cx.strokeStyle=OL;cx.lineWidth=1.1;cx.beginPath();cx.moveTo(x+w/2,y);cx.lineTo(x+w/2,y+h);if(hanok){cx.moveTo(x,y+h/2);cx.lineTo(x+w,y+h/2)}cx.stroke()}
/* ---------- 노점 수레 ---------- */
function cart(x0,d,t,st){const S=size(4),x1=x0+S.w,dd=S.d,h=T*.62,s=T/40;
 cx.fillStyle='rgba(0,0,0,.14)';poly([P(x0-.1,-dd-.1),P(x1+.1,-dd-.1),P(x1+.1,.15),P(x0-.1,.15)],'rgba(0,0,0,.14)');
 const wood=st.pat==='stone'?'#a8a49c':st.w==='#fff1d6'?'#c88a4e':st.w;
 poly([P(x0,0,0),P(x1,0,0),P(x1,0,h),P(x0,0,h)],dark(wood,.05),OL);poly([P(x1,0,0),P(x1,-dd,0),P(x1,-dd,h),P(x1,0,h)],dark(wood,.22),OL);poly([P(x0,-dd,h),P(x1,-dd,h),P(x1,0,h),P(x0,0,h)],lite(wood,.12),OL);
 for(const u of[.25,.8]){const q=P(x0+S.w*u,.05,0);cx.fillStyle='#4a3a30';cx.beginPath();cx.ellipse(q.x,q.y-5*s,7*s,8*s,0,0,7);cx.fill();cx.strokeStyle=OL;cx.lineWidth=1.6;cx.stroke()}
 for(let i=0;i<3;i++){const q=P(x0+.4+i*.5,-.45,h);A.bread(q.x,q.y-3*s,.16*s,'#e8a840',{plain:true})}steam(P(x0+.8,-.5,h).x,P(x0+.8,-.5,h).y-8*s,t,s);
 /* 기둥 + 차양 + 간판 */const ph=T*1.3;cx.strokeStyle=OL;cx.lineWidth=2.2*s;for(const u of[.08,.92]){const a=P(x0+S.w*u,-.05,h),b=P(x0+S.w*u,-.05,ph);cx.beginPath();cx.moveTo(a.x,a.y);cx.lineTo(b.x,b.y);cx.stroke()}
 face(P(x0-.1,.15,ph),(S.w+.2)*T/2,.5,len=>{awning(0,-6*s,len,9*s,d.awn);sign(len*.08,-24*s,len*.84,15*s,d.n||'붕어빵',d.sign,t)});
 return{x0,x1,dd,h:ph+24*s}}
/* ---------- 건물 ---------- */
function bldg(x0,d,t){const st=SK[d.skin|0]||SK[0];if((d.room|0)<=4)return cart(x0,d,t,st);
 const S=size(d.room),x1=x0+S.w,dd=S.d,s=T/40,gh=T*1.45,fh=T*1.1,h=gh+fh*(S.fl-1);
 poly([P(x0-.15,-dd-.15),P(x1+.2,-dd-.15),P(x1+.2,.2),P(x0-.15,.2)],'rgba(0,0,0,.13)');
 /* 성: 뒤쪽 탑 */const tower=(gx,gy)=>{const tw=.62,th=h*1.32,a=P(gx-tw/2,gy+tw/2,0),b=P(gx+tw/2,gy+tw/2,0),c=P(gx+tw/2,gy-tw/2,0);
  poly([a,b,{x:b.x,y:b.y-th},{x:a.x,y:a.y-th}],st.w,OL);poly([b,c,{x:c.x,y:c.y-th},{x:b.x,y:b.y-th}],dark(st.w,.18),OL);
  const top=P(gx,gy,th),r=tw*T*.62;cx.fillStyle='#5a6ab8';cx.beginPath();cx.moveTo(top.x-r,top.y+2);cx.lineTo(top.x,top.y-r*1.5);cx.lineTo(top.x+r,top.y+2);cx.closePath();cx.fill();cx.strokeStyle=OL;cx.lineWidth=1.8;cx.stroke();
  const fy=top.y-r*1.5;cx.beginPath();cx.moveTo(top.x,fy);cx.lineTo(top.x,fy-12*s);cx.stroke();cx.fillStyle=gx>x0+.1?'#ffd23a':'#ff6a6a';cx.beginPath();cx.moveTo(top.x,fy-12*s);cx.lineTo(top.x+(9+Math.sin(t*4+gx)*1.5)*s,fy-9*s);cx.lineTo(top.x,fy-6*s);cx.closePath();cx.fill()};
 if(st.roof==='castle'){tower(x0,-dd);tower(x1,-dd)}
 /* 오른쪽 면 */
 const B0=P(x1,0,0),R0=P(x1,-dd,0);poly([B0,R0,{x:R0.x,y:R0.y-h},{x:B0.x,y:B0.y-h}],dark(st.w,.16),OL);
 face(B0,dd*T/2,-.5,len=>{wallPat(st,len,h);for(let f=0;f<S.fl;f++){const wy=-(f===0?gh*.62:gh+fh*(f-1)+fh*.72),ww=len*.36,wh=(f===0?gh*.3:fh*.42);win(len*.32,wy,ww,wh,st.pat==='hanok')}});
 /* 앞면 (길 쪽) */
 const L0=P(x0,0,0);poly([L0,B0,{x:B0.x,y:B0.y-h},{x:L0.x,y:L0.y-h}],st.w,OL);
 face(L0,S.w*T/2,.5,len=>{wallPat(st,len,h);
  /* 위층 창문 */for(let f=1;f<S.fl;f++){const n=S.w>=4?3:2,y=-(gh+fh*(f-1))-fh*.78;for(let i=0;i<n;i++){const ww=len*.18;win(len*(i+.5)/n-ww/2,y,ww,fh*.5,st.pat==='hanok')}if(st.roof!=='castle')rr(0,-(gh+fh*(f-1))-2,len,3,1,dark(st.w,.3))}
  /* 1층 가게 */const dw=len*.24,wx=len*.07,ww=len*.52;box(wx,-gh*.58,ww,gh*.5,'#bfe6ff',3,1.6);for(let i=0;i<3;i++)A.bread(wx+ww*(.2+i*.3),-gh*.18,.0034*ww*s/ s,'#e8a840',{plain:true});
  cx.strokeStyle='rgba(255,255,255,.7)';cx.lineWidth=1.6;cx.beginPath();cx.moveTo(wx+4,-gh*.53);cx.lineTo(wx+ww*.3,-gh*.53);cx.stroke();
  const dx=len-dw-len*.07;box(dx,-gh*.62,dw,gh*.62,'#8a5a3a',3,1.6);rr(dx+dw*.18,-gh*.54,dw*.64,gh*.2,2,'#bfe6ff');cx.fillStyle='#ffd23a';cx.beginPath();cx.arc(dx+dw*.8,-gh*.3,1.8*s,0,7);cx.fill();
  awning(len*.03,-gh*.76,len*.94,gh*.13,d.awn);sign(len*.08,-gh*.98,len*.84,gh*.19,d.n||'붕어빵',d.sign,t);
  steam(wx+ww*.3,-gh*.6,t,s)});
 /* 지붕 */
 const top=[P(x0,-dd,h),P(x1,-dd,h),P(x1,0,h),P(x0,0,h)];
 if(st.roof==='flat'){poly(top,st.r,OL);const e=.12;poly([P(x0-e,.0+e,h),P(x1+e,e,h),P(x1+e,e,h+4*s),P(x0-e,e,h+4*s)],dark(st.r,.25),OL,1.4);
  if(st.terrace){for(let i=0;i<3;i++){const q=P(x0+.5+i*(S.w-1)/2,-dd*.5,h);em('🌿',q.x,q.y-6*s,16*s)}}}
 else if(st.roof==='gable'||st.roof==='candy'||st.roof==='hanok'){const rh=(st.roof==='hanok'?.9:1.15)*T,o=st.roof==='hanok'?.45:.25;
  const og=st.roof==='hanok'?.2:.12,rL=P(x0-o,-dd/2,h+rh),rR=P(x1+o,-dd/2,h+rh),eL=P(x0-o,og,h-2*s),eR=P(x1+o,og,h-2*s);
  /* 오른쪽 박공(세모) */poly([P(x1,0,h),P(x1,-dd,h),P(x1,-dd/2,h+rh)],dark(st.w,.24),OL);
  if(st.roof==='hanok'){const lift=10*s,mid={x:(eL.x+eR.x)/2,y:(eL.y+eR.y)/2+3*s};cx.beginPath();cx.moveTo(rL.x,rL.y);cx.lineTo(rR.x,rR.y);cx.lineTo(eR.x+6*s,eR.y-lift);cx.quadraticCurveTo(mid.x,mid.y,eL.x-6*s,eL.y-lift);cx.closePath();cx.fillStyle=st.r;cx.fill();cx.strokeStyle=OL;cx.lineWidth=2;cx.stroke();
   cx.strokeStyle='rgba(255,255,255,.16)';cx.lineWidth=1.2;for(let i=1;i<12;i++){const u=i/12,a={x:rL.x+(rR.x-rL.x)*u,y:rL.y+(rR.y-rL.y)*u},b={x:eL.x+(eR.x-eL.x)*u,y:eL.y+(eR.y-eL.y)*u+Math.sin(u*Math.PI)*3*s-lift*(1-Math.sin(u*Math.PI))};cx.beginPath();cx.moveTo(a.x,a.y);cx.lineTo(b.x,b.y);cx.stroke()}
   cx.strokeStyle='#2a2a32';cx.lineWidth=4*s;cx.beginPath();cx.moveTo(rL.x,rL.y);cx.lineTo(rR.x,rR.y);cx.stroke()}
  else{poly([rL,rR,eR,eL],st.r,OL);if(st.roof==='gable'){cx.fillStyle=dark(st.r,.22);for(let i=0;i<6;i++){const q=P(x0+.3+i*(S.w-.6)/5,-dd*.15-(i%2)*.2,h+rh*.55);cx.beginPath();cx.arc(q.x,q.y,3.2*s,0,7);cx.fill()}const c=P(x1-.5,-dd*.3,h+rh*.7);box(c.x-4*s,c.y-16*s,8*s,16*s,'#7a5a4a',1,1.4)}
   else{/* 과자집: 흰 크림 */cx.fillStyle='#fff';cx.beginPath();cx.moveTo(eL.x,eL.y);const n=10;for(let i=0;i<=n;i++){const u=i/n,x=eL.x+(eR.x-eL.x)*u,y=eL.y+(eR.y-eL.y)*u;cx.lineTo(x,y+(i%2?7:2)*s)}cx.lineTo(eR.x,eR.y);cx.lineTo(eR.x+(rR.x-eR.x)*.18,eR.y+(rR.y-eR.y)*.18);cx.lineTo(eL.x+(rL.x-eL.x)*.18,eL.y+(rL.y-eL.y)*.18);cx.closePath();cx.fill();
    const q1=P(x0+.6,-dd*.3,h+rh*.6),q2=P(x1-.6,-dd*.3,h+rh*.6),q3=P((x0+x1)/2,-dd*.45,h+rh*.85);em('🍭',q1.x,q1.y,16*s);em('🍬',q2.x,q2.y,14*s);em('🍩',q3.x,q3.y,16*s)}}}
 else if(st.roof==='castle'){poly(top,lite(st.w,.08),OL);for(let i=0;i<Math.round(S.w*2);i+=2){const a=x0+i*.5;poly([P(a,0,h),P(a+.5,0,h),P(a+.5,0,h+7*s),P(a,0,h+7*s)],st.w,OL,1.2)}
  for(let i=0;i<Math.round(dd*2);i+=2){const a=-i*.5;poly([P(x1,a,h),P(x1,a-.5,h),P(x1,a-.5,h+7*s),P(x1,a,h+7*s)],dark(st.w,.15),OL,1.2)}
  }
 if(st.terrace){/* 앞마당 파라솔 */const q=P(x0+.55,.55,0);cx.fillStyle='rgba(0,0,0,.15)';cx.beginPath();cx.ellipse(q.x,q.y,12*s,5*s,0,0,7);cx.fill();cx.strokeStyle=OL;cx.lineWidth=1.8*s;cx.beginPath();cx.moveTo(q.x,q.y);cx.lineTo(q.x,q.y-42*s);cx.stroke();
  cx.fillStyle='#ff8ab0';cx.beginPath();cx.moveTo(q.x-22*s,q.y-34*s);cx.quadraticCurveTo(q.x,q.y-56*s,q.x+22*s,q.y-34*s);cx.closePath();cx.fill();cx.stroke();rr(q.x-10*s,q.y-16*s,20*s,4*s,2,'#fff')}
 const roofTop=st.roof==='castle'?h*1.32+T*.7:st.roof==='flat'?h+6*s:h+T*1.15;
 if((d.g|0)>=6){const q=P((x0+x1)/2,-dd/2,roofTop);em('👑',q.x,q.y-8*s,18*s)}
 return{x0,x1,dd,h:roofTop}}
/* ---------- 땅·길 ---------- */
function ground(a,b){const G=(y0,y1,c)=>poly([P(a,y0),P(b,y0),P(b,y1),P(a,y1)],c);
 G(-7,0,'#cfe6b4');poly([P(a,-7),P(b,-7),P(b,-7,T*.5),P(a,-7,T*.5)],'#b8d8a0');G(0,1.1,'#e4d8c2');for(let x=Math.ceil(a);x<b;x++){const p=P(x,0),q=P(x,1.1);cx.strokeStyle='rgba(120,100,80,.18)';cx.lineWidth=1;cx.beginPath();cx.moveTo(p.x,p.y);cx.lineTo(q.x,q.y);cx.stroke()}
 G(1.1,1.25,'#b8a88e');G(1.25,3.45,'#8f8a85');cx.strokeStyle='rgba(255,255,255,.8)';cx.lineWidth=Math.max(1.5,T*.06);for(let x=Math.floor(a);x<b;x+=1.4){const p=P(x,2.35),q=P(x+.7,2.35);cx.beginPath();cx.moveTo(p.x,p.y);cx.lineTo(q.x,q.y);cx.stroke()}
 G(3.45,3.6,'#b8a88e');G(3.6,4.5,'#e4d8c2');G(4.5,30,'#a8d890')}
const walkers=[];for(let i=0;i<6;i++)walkers.push({x:Math.random()*20,v:(Math.random()<.5?-1:1)*(.35+Math.random()*.3),y:.35+Math.random()*.45,an:null,ph:i*1.7});
let LAY=[];
/* 장면 */
function scene(t,list,o={}){const g=cx.createLinearGradient(0,0,0,800);g.addColorStop(0,o.night?'#1a2450':'#9fd8ff');g.addColorStop(1,o.night?'#4a4a7a':'#fff1d6');cx.fillStyle=g;cx.fillRect(0,0,W,800);
 if(o.night)em('🌙',385,110,30);else{em('☀️',385,110,38);cx.fillStyle='rgba(255,255,255,.85)';for(let i=0;i<3;i++){const x=((t*6+i*170)%560)-60;cx.beginPath();cx.ellipse(x,130+i*24,30,9,0,0,7);cx.fill()}}
 /* 자리 잡기 */let x=0;LAY=list.map(it=>{const S=size(it.d.room),r={x0:x,x1:x+S.w,c:x+S.w/2};x+=S.w+1.3;return r});span=[LAY.length?LAY[0].c-1:0,LAY.length?LAY[LAY.length-1].c+1:0];CG=Math.max(span[0],Math.min(span[1],CG));cam();
 ground(-40,x+40);
 /* 길 건너편 가로수 */
 const hits=[];list.forEach((it,i)=>{const r=bldg(LAY[i].x0,it.d,t);const pts=[P(r.x0-.3,.3,0),P(r.x1+.3,.3,0),P(r.x1,-r.dd,r.h),P(r.x0,-r.dd,r.h),P(r.x0,0,r.h)];hits.push({i,x0:Math.min(...pts.map(p=>p.x)),x1:Math.max(...pts.map(p=>p.x)),y0:Math.min(...pts.map(p=>p.y))-10,y1:P(LAY[i].c,1.1).y+18});LAY[i].top=r.h;LAY[i].dd=r.dd});
 /* 걷는 손님 */const AN=o.an||['🐱','🐰','🐻','🐶'],dt=o.dt||0;for(const wk of walkers){wk.x+=wk.v*dt;if(wk.x<-3)wk.x=x+2;if(wk.x>x+3)wk.x=-2;if(!wk.an)wk.an=AN[Math.floor(Math.random()*AN.length)];
  const q=P(wk.x,wk.y,0),sz=T*.62;cx.fillStyle='rgba(0,0,0,.14)';cx.beginPath();cx.ellipse(q.x,q.y,sz*.3,sz*.12,0,0,7);cx.fill();cx.save();if(wk.v<0){cx.translate(q.x*2,0);cx.scale(-1,1)}animal(wk.an,q.x,q.y-sz*.9,sz,{walk:t*10+wk.ph,t,ph:wk.ph});cx.restore()}
 /* 앞쪽 인도 가로수·가로등 */for(let gx=Math.floor(-10);gx<x+10;gx+=4){const q=P(gx+.5,4.05,0);if(q.x<-40||q.x>W+40)continue;if((gx/4)%2){em('🌳',q.x,q.y-T*.55,T*1.1)}else{cx.strokeStyle='#4a4a52';cx.lineWidth=Math.max(2,T*.07);cx.beginPath();cx.moveTo(q.x,q.y);cx.lineTo(q.x,q.y-T*1.3);cx.stroke();cx.fillStyle=o.night?'#ffe680':'#fff6c0';cx.beginPath();cx.arc(q.x,q.y-T*1.35,T*.13,0,7);cx.fill()}}
 /* 이름표 */list.forEach((it,i)=>{const q=P(LAY[i].c,.9,0);if(q.x<-120||q.x>W+120)return;const nm=it.d.n||'붕어빵',sub=it.me?'⭐ 내 가게':(it.d.nk?it.d.nk+' 사장님':'');
  const k=Math.max(.75,Math.min(1.15,T/40)),f1=13*k,f2=11*k;cx.font='bold '+f1+'px "Jua","Noto Sans KR",sans-serif';const bw=Math.max(cx.measureText(nm).width,cx.measureText(sub).width*.85)+16*k;rr(q.x-bw/2,q.y,bw,34*k,10*k,it.me?'#ffc94a':'rgba(255,255,255,.93)');
  tx(nm,q.x,q.y+11*k,f1,'#5a3a22','center',it.me?'#ffc94a':'#fff');tx(sub,q.x,q.y+25*k,f2,it.me?'#7a4a10':'#8a6a4a','center',it.me?'#ffc94a':'#fff');
  if(it.me){const p=P(LAY[i].c,-LAY[i].dd/2,LAY[i].top);em('📍',p.x,p.y-20-Math.abs(Math.sin(t*3))*5,24)}});
 return{hits}}
function focus(i){if(LAY[i])CG=LAY[i].c;else CG=0;OFF=0}
function focusList(list,i){let x=0;const L=list.map(it=>{const S=size(it.d.room),c=x+S.w/2;x+=S.w+1.3;return c});CG=L[i]||0;OFF=0}
/* 꾸미기 미리보기: 내 건물 하나를 크게 */
function preview(t,d,top,bottom){const g=cx.createLinearGradient(0,top,0,bottom);g.addColorStop(0,'#9fd8ff');g.addColorStop(1,'#fff1d6');cx.fillStyle=g;cx.fillRect(0,top,W,bottom-top);
 const sv={T,OX,OY},S=size(d.room);T=Math.min(70,(bottom-top-60)/(((d.room<=4?1.9:1.45+1.1*(S.fl-1))+1.2+S.d*.25+.9)),300/((S.w+S.d)/2+.6));
 const cxm=(S.w-S.d)/2,cym=(S.w+(-S.d))/2;OX=225-((S.w/2)-(-S.d/2))*T/2;OY=bottom-70-(S.w/2+0)*T/4;
 const G=(y0,y1,c)=>poly([P(-3,y0),P(S.w+3,y0),P(S.w+3,y1),P(-3,y1)],c);G(-S.d-2,0,'#cfe6b4');G(0,1.1,'#e4d8c2');G(1.1,4,'#8f8a85');
 bldg(0,d,t);Object.assign({},sv);T=sv.T;OX=sv.OX;OY=sv.OY}
function hit(hits,x,y){return hits.find(q=>x>=q.x0&&x<=q.x1&&y>=q.y0&&y<=q.y1)}
return{SK,size,scene,preview,focus,focusList,drag,zoom,hit,get T(){return T}}};
if(typeof module!=='undefined')module.exports=STREET;
