/* ===== 🐟 붕어빵 동네 (3D 아이소메트릭 블록): 바둑판 길 + 블록 4개(2×2) × 가게 3곳 = 12곳 =====
   STREET(cx,A) → {SK, size, LOTS, scene(t,list,o), preview(t,d,top,bottom), center(), drag(dx,dy), zoom(f), hit(hits,x,y), T}
   list[i]가 LOTS[i] 자리에 들어가요. LOTS는 동네 가운데(사거리)에서 가까운 순서 → list[0] = 내 가게.
   가게는 비스듬히 보이는 두 방향으로만 향해요: 'F' = 아래쪽 길(앞면이 왼쪽 아래), 'R' = 오른쪽 길(앞면이 오른쪽 아래) → 모든 간판·문이 보여요.
   건물: 바닥 크기 = 가게 크기(4×4 노점은 수레), 7×7부터 2층, 9×9부터 3층. 외관 스킨 SK 7종 */
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
function size(room){const r=Math.max(4,Math.min(10,room|0));return{w:[1.9,2.6,3.0,3.4,3.8,4.2,4.6][r-4],d:[1.1,2.2,2.4,2.6,2.8,3.0,3.2][r-4],fl:r>=9?3:r>=7?2:1}}
/* ---------- 동네 배치 (칸 단위) ---------- */
const BX=12,BY=10,RB_=3.4,SW=.9; /* 블록 크기, 길 폭(인도 포함), 인도 폭 */
const TX=2*BX+2*RB_,TY=2*BY+2*RB_;
const blocks=[];for(let j=0;j<2;j++)for(let i=0;i<2;i++)blocks.push({x:i*(BX+RB_),y:j*(BY+RB_)});
/* 자리: F = 블록 아래쪽(앞선 gy=블록 아래), R = 블록 오른쪽 위(앞선 gx=블록 오른쪽). a0 = 자리 시작, L = 자리 길이 */
const LOTS=[];blocks.forEach(b=>{LOTS.push({o:'F',fx:b.y+BY,a0:b.x+.7,L:5,bx:b});LOTS.push({o:'F',fx:b.y+BY,a0:b.x+6.2,L:5,bx:b});LOTS.push({o:'R',fx:b.x+BX,a0:b.y+5.6,L:5,bx:b})});
/* 내 가게 = 맨 앞줄(앞에 가리는 건물이 없는) 오른쪽 아래 블록의 왼쪽 자리. 나머지는 내 가게에서 가까운 순서 */
LOTS.forEach(l=>{const c=l.o==='F'?{x:l.a0+l.L/2,y:l.fx}:{x:l.fx,y:l.a0-l.L/2};l.cx=c.x;l.cy=c.y});
const ME=LOTS[9],CX0=ME.cx,CY0=ME.cy;LOTS.forEach(l=>{l.dist=Math.hypot(l.cx-CX0,l.cy-CY0)});LOTS.sort((a,b)=>a.dist-b.dist);
/* ---------- 카메라 ---------- */
let T=40,OX=0,OY=0,CGX=CX0,CGY=CY0-2;
const P=(gx,gy,z=0)=>({x:OX+(gx-gy)*T/2,y:OY+(gx+gy)*T/4-z});
function cam(){OX=225-(CGX-CGY)*T/2;OY=400-(CGX+CGY)*T/4}
function drag(dx,dy){CGX-=(dx+2*dy)/T;CGY-=(-dx+2*dy)/T;CGX=Math.max(3,Math.min(TX-3,CGX));CGY=Math.max(3,Math.min(TY-3,CGY))}
function zoom(f){T=Math.max(26,Math.min(72,T*f))}
function center(i){const l=LOTS[i|0];CGX=l.cx-2.5;CGY=l.cy-4}
/* ---------- 그리기 도구 ---------- */
const poly=(pts,f,s,lw=2)=>{cx.beginPath();pts.forEach((p,i)=>i?cx.lineTo(p.x,p.y):cx.moveTo(p.x,p.y));cx.closePath();if(f){cx.fillStyle=f;cx.fill()}if(s){cx.strokeStyle=s;cx.lineWidth=lw;cx.stroke()}};
function face(o,len,sl,fn){cx.save();cx.translate(o.x,o.y);cx.transform(1,sl,0,1,0,0);fn(len);cx.restore()}
const box=(x,y,w,h,f,r=3,lw=1.8)=>{rr(x,y,w,h,r,f);cx.strokeStyle=OL;cx.lineWidth=lw;cx.beginPath();cx.roundRect(x,y,w,h,r);cx.stroke()};
function awning(x,y,w,h,ai){const ac=AWC[ai|0]||AWC[0],n=Math.max(4,Math.round(w/12));for(let i=0;i<n;i++){const c=ac[0]==='rb'?RB[i%6]:i%2?ac[1]:ac[0];const x0=x+w*i/n,x1=x+w*(i+1)/n;cx.fillStyle=c;cx.beginPath();cx.moveTo(x0,y);cx.lineTo(x1,y);cx.lineTo(x1,y+h);cx.arc((x0+x1)/2,y+h,(x1-x0)/2,0,Math.PI);cx.closePath();cx.fill()}
 cx.strokeStyle=OL;cx.lineWidth=1.6;cx.beginPath();cx.moveTo(x,y);cx.lineTo(x+w,y);cx.stroke()}
function sign(x,y,w,h,name,si,t){const sb=SB[si|0]||SB[0];box(x,y,w,h,sb[0],4,1.6);let fs=Math.min(h*.66,16);cx.font='bold '+fs+'px "Jua","Noto Sans KR",sans-serif';while(cx.measureText(name).width>w-6&&fs>7){fs-=.5;cx.font='bold '+fs+'px "Jua","Noto Sans KR",sans-serif'}tx(name,x+w/2,y+h/2+1,fs,sb[1],'center',sb[0]);
 if((si|0)===7)for(let i=0;i<3;i++){cx.globalAlpha=.4+.6*Math.abs(Math.sin(t*2+i));em('✨',x+w*(.15+i*.35),y-5,9);cx.globalAlpha=1}}
function wallPat(st,len,h){if(!st.pat&&!st.l)return;cx.save();cx.beginPath();cx.rect(0,-h,len,h);cx.clip();cx.strokeStyle=st.l;cx.lineWidth=1;const s=T/40;
 if(st.pat==='brick'||st.pat==='stone'){const bh=(st.pat==='brick'?6:9)*s,bw=(st.pat==='brick'?13:18)*s;for(let y=-bh,r=0;y>-h;y-=bh,r++){cx.beginPath();cx.moveTo(0,y);cx.lineTo(len,y);cx.stroke();for(let x=(r%2?bw/2:0);x<len;x+=bw){cx.beginPath();cx.moveTo(x,y);cx.lineTo(x,y+bh);cx.stroke()}}}
 else if(st.pat==='log'){cx.lineWidth=1.6;for(let y=-8*s;y>-h;y-=8*s){cx.beginPath();cx.moveTo(0,y);cx.lineTo(len,y);cx.stroke()}}
 else if(st.pat==='hanok'){cx.lineWidth=3*s;cx.strokeStyle=st.l;for(const u of[0,.5,1]){cx.beginPath();cx.moveTo(len*u,0);cx.lineTo(len*u,-h);cx.stroke()}cx.beginPath();cx.moveTo(0,-h+2);cx.lineTo(len,-h+2);cx.stroke()}
 else if(st.pat==='candy'){for(let i=0;i<10;i++){cx.fillStyle=['#ff6a8a','#7ed8ff','#ffe066','#9ad870'][i%4];cx.beginPath();cx.arc(((i*37)%100)/100*len,-((i*61)%100)/100*h*.85-4,2*s,0,7);cx.fill()}}
 else{for(let x=10*s;x<len;x+=10*s){cx.beginPath();cx.moveTo(x,0);cx.lineTo(x,-h);cx.stroke()}}
 cx.restore()}
function steam(x,y,t,s){for(let i=0;i<2;i++){const ph=(t*.8+i*.5)%1;cx.fillStyle='rgba(255,255,255,'+(.6*(1-ph))+')';cx.beginPath();cx.ellipse(x+i*8*s,y-ph*14*s,(2+ph*3)*s,(1.5+ph*2)*s,0,0,7);cx.fill()}}
function win(x,y,w,h,hanok){box(x,y,w,h,'#ffeeaa',2,1.4);cx.fillStyle='rgba(255,255,255,.55)';cx.fillRect(x+2,y+2,w*.3,h*.3);cx.strokeStyle=OL;cx.lineWidth=1.1;cx.beginPath();cx.moveTo(x+w/2,y);cx.lineTo(x+w/2,y+h);if(hanok){cx.moveTo(x,y+h/2);cx.lineTo(x+w,y+h/2)}cx.stroke()}
/* ---------- 방향 있는 건물 ----------
   로컬 좌표 (a = 앞면을 따라, b = 안쪽 깊이, z = 높이). Q(a,b,z) → 화면.
   F: gx = ox+a, gy = oy-b   (앞면 = 왼쪽 아래 면, 옆면 = a=W 쪽 오른쪽 아래 면)
   R: gx = ox-b, gy = oy-a   (앞면 = 오른쪽 아래 면, 옆면 = a=0 쪽 왼쪽 아래 면) */
function mk(ori,ox,oy){return ori==='F'?(a,b,z=0)=>P(ox+a,oy-b,z):(a,b,z=0)=>P(ox-b,oy-a,z)}
function cart(Q,ori,d,t,st){const S=size(4),Wd=S.w,D=S.d,h=T*.62,s=T/40,fsl=ori==='F'?.5:-.5;
 poly([Q(-.1,-.15),Q(Wd+.1,-.15),Q(Wd+.1,D+.1),Q(-.1,D+.1)],'rgba(0,0,0,.14)');
 const wood=st.pat==='stone'?'#a8a49c':st.w==='#fff1d6'?'#c88a4e':st.w;
 const fr=[Q(0,0),Q(Wd,0),Q(Wd,0,h),Q(0,0,h)],sd=ori==='F'?[Q(Wd,0),Q(Wd,D),Q(Wd,D,h),Q(Wd,0,h)]:[Q(0,0),Q(0,D),Q(0,D,h),Q(0,0,h)];
 poly(sd,dark(wood,ori==='F'?.22:.05),OL);poly(fr,dark(wood,ori==='F'?.05:.22),OL);poly([Q(0,0,h),Q(Wd,0,h),Q(Wd,D,h),Q(0,D,h)],lite(wood,.12),OL);
 for(const u of[.25,.8]){const q=Q(Wd*u,-.05);cx.fillStyle='#4a3a30';cx.beginPath();cx.ellipse(q.x,q.y-5*s,7*s,8*s,0,0,7);cx.fill();cx.strokeStyle=OL;cx.lineWidth=1.6;cx.stroke()}
 for(let i=0;i<3;i++){const q=Q(.4+i*.5,.45,h);A.bread(q.x,q.y-3*s,.16*s,'#e8a840',{plain:true})}{const q=Q(.8,.5,h);steam(q.x,q.y-8*s,t,s)}
 const ph=T*1.3;cx.strokeStyle=OL;cx.lineWidth=2.2*s;for(const u of[.08,.92]){const a=Q(Wd*u,.05,h),b=Q(Wd*u,.05,ph);cx.beginPath();cx.moveTo(a.x,a.y);cx.lineTo(b.x,b.y);cx.stroke()}
 face(Q(-.1,-.15,ph),(Wd+.2)*T/2,fsl,len=>{awning(0,-6*s,len,9*s,d.awn);sign(len*.08,-24*s,len*.84,15*s,d.n||'붕어빵',d.sign,t)});
 return{Wd,D,h:ph+24*s}}
function bldg(Q,ori,d,t){const st=SK[d.skin|0]||SK[0];if((d.room|0)<=4)return cart(Q,ori,d,t,st);
 const S=size(d.room),Wd=S.w,D=S.d,s=T/40,gh=T*1.32,fh=T*.92,h=gh+fh*(S.fl-1),F=ori==='F',fsl=F?.5:-.5,ssl=F?-.5:.5,aS=F?Wd:0,lite_=c=>c,drk=c=>dark(c,.16);
 const fcol=F?st.w:drk(st.w),scol=F?drk(st.w):st.w;
 poly([Q(-.15,-.2),Q(Wd+.2,-.2),Q(Wd+.2,D+.15),Q(-.15,D+.15)],'rgba(0,0,0,.13)');
 const tower=(q)=>{const tw=.62*T/2,th=h*1.32,base=q;poly([{x:base.x-tw,y:base.y},{x:base.x,y:base.y+tw/2},{x:base.x,y:base.y+tw/2-th},{x:base.x-tw,y:base.y-th}],st.w,OL);poly([{x:base.x,y:base.y+tw/2},{x:base.x+tw,y:base.y},{x:base.x+tw,y:base.y-th},{x:base.x,y:base.y+tw/2-th}],dark(st.w,.18),OL);
  const top={x:base.x,y:base.y-th},r=tw*1.25;cx.fillStyle='#5a6ab8';cx.beginPath();cx.moveTo(top.x-r,top.y+2);cx.lineTo(top.x,top.y-r*1.5);cx.lineTo(top.x+r,top.y+2);cx.closePath();cx.fill();cx.strokeStyle=OL;cx.lineWidth=1.8;cx.stroke();
  const fy=top.y-r*1.5;cx.beginPath();cx.moveTo(top.x,fy);cx.lineTo(top.x,fy-12*s);cx.stroke();cx.fillStyle=base.x>OX?'#ffd23a':'#ff6a6a';cx.beginPath();cx.moveTo(top.x,fy-12*s);cx.lineTo(top.x+(9+Math.sin(t*4+base.x)*1.5)*s,fy-9*s);cx.lineTo(top.x,fy-6*s);cx.closePath();cx.fill()};
 if(st.roof==='castle'){tower(Q(0,D));tower(Q(Wd,D))}
 /* 옆면 (창문) */
 const so=F?Q(Wd,0):Q(0,D);poly(F?[Q(Wd,0),Q(Wd,D),Q(Wd,D,h),Q(Wd,0,h)]:[Q(0,D),Q(0,0),Q(0,0,h),Q(0,D,h)],scol,OL);
 face(so,D*T/2,ssl,len=>{wallPat(st,len,h);for(let f=0;f<S.fl;f++){const wy=-(f===0?gh*.62:gh+fh*(f-1)+fh*.72),ww=len*.36,wh=(f===0?gh*.3:fh*.42);win(len*.32,wy,ww,wh,st.pat==='hanok')}});
 /* 앞면 (길 쪽) */
 poly([Q(0,0),Q(Wd,0),Q(Wd,0,h),Q(0,0,h)],fcol,OL);
 face(Q(0,0),Wd*T/2,fsl,len=>{wallPat(st,len,h);
  for(let f=1;f<S.fl;f++){const n=Wd>=4?3:2,y=-(gh+fh*(f-1))-fh*.78;for(let i=0;i<n;i++){const ww=len*.18;win(len*(i+.5)/n-ww/2,y,ww,fh*.5,st.pat==='hanok')}if(st.roof!=='castle')rr(0,-(gh+fh*(f-1))-2,len,3,1,dark(st.w,.3))}
  const dw=len*.24,wx=len*.07,ww=len*.52;box(wx,-gh*.58,ww,gh*.5,'#bfe6ff',3,1.6);for(let i=0;i<3;i++)A.bread(wx+ww*(.2+i*.3),-gh*.18,.0034*ww,'#e8a840',{plain:true});
  cx.strokeStyle='rgba(255,255,255,.7)';cx.lineWidth=1.6;cx.beginPath();cx.moveTo(wx+4,-gh*.53);cx.lineTo(wx+ww*.3,-gh*.53);cx.stroke();
  const dx=len-dw-len*.07;box(dx,-gh*.62,dw,gh*.62,'#8a5a3a',3,1.6);rr(dx+dw*.18,-gh*.54,dw*.64,gh*.2,2,'#bfe6ff');cx.fillStyle='#ffd23a';cx.beginPath();cx.arc(dx+dw*.8,-gh*.3,1.8*s,0,7);cx.fill();
  awning(len*.03,-gh*.76,len*.94,gh*.13,d.awn);sign(len*.08,-gh*.98,len*.84,gh*.19,d.n||'붕어빵',d.sign,t);steam(wx+ww*.3,-gh*.6,t,s)});
 /* 지붕 */
 const top=[Q(0,0,h),Q(Wd,0,h),Q(Wd,D,h),Q(0,D,h)];
 if(st.roof==='flat'){poly(top,st.r,OL);const e=.12;poly([Q(-e,-e,h),Q(Wd+e,-e,h),Q(Wd+e,-e,h+4*s),Q(-e,-e,h+4*s)],dark(st.r,.25),OL,1.4);
  if(st.terrace){for(let i=0;i<3;i++){const q=Q(.5+i*(Wd-1)/2,D*.5,h);em('🌿',q.x,q.y-6*s,16*s)}}}
 else if(st.roof==='gable'||st.roof==='candy'||st.roof==='hanok'){const rh=(st.roof==='hanok'?.9:1.15)*T,o=st.roof==='hanok'?.45:.25,og=st.roof==='hanok'?.2:.12;
  const rL=Q(-o,D/2,h+rh),rR=Q(Wd+o,D/2,h+rh),eL=Q(-o,-og,h-2*s),eR=Q(Wd+o,-og,h-2*s);
  poly([Q(aS,0,h),Q(aS,D,h),Q(aS,D/2,h+rh)],dark(st.w,.24),OL);
  if(st.roof==='hanok'){const lift=10*s,mid={x:(eL.x+eR.x)/2,y:(eL.y+eR.y)/2+3*s},sx=F?6:-6;cx.beginPath();cx.moveTo(rL.x,rL.y);cx.lineTo(rR.x,rR.y);cx.lineTo(eR.x+sx*s,eR.y-lift);cx.quadraticCurveTo(mid.x,mid.y,eL.x-sx*s,eL.y-lift);cx.closePath();cx.fillStyle=st.r;cx.fill();cx.strokeStyle=OL;cx.lineWidth=2;cx.stroke();
   cx.strokeStyle='rgba(255,255,255,.16)';cx.lineWidth=1.2;for(let i=1;i<12;i++){const u=i/12,a={x:rL.x+(rR.x-rL.x)*u,y:rL.y+(rR.y-rL.y)*u},b={x:eL.x+(eR.x-eL.x)*u,y:eL.y+(eR.y-eL.y)*u+Math.sin(u*Math.PI)*3*s-lift*(1-Math.sin(u*Math.PI))};cx.beginPath();cx.moveTo(a.x,a.y);cx.lineTo(b.x,b.y);cx.stroke()}
   cx.strokeStyle='#2a2a32';cx.lineWidth=4*s;cx.beginPath();cx.moveTo(rL.x,rL.y);cx.lineTo(rR.x,rR.y);cx.stroke()}
  else{poly([rL,rR,eR,eL],st.r,OL);if(st.roof==='gable'){cx.fillStyle=dark(st.r,.22);for(let i=0;i<6;i++){const q=Q(.3+i*(Wd-.6)/5,D*.15+(i%2)*.2,h+rh*.55);cx.beginPath();cx.arc(q.x,q.y,3.2*s,0,7);cx.fill()}const c=Q(F?Wd-.5:.5,D*.3,h+rh*.7);box(c.x-4*s,c.y-16*s,8*s,16*s,'#7a5a4a',1,1.4)}
   else{cx.fillStyle='#fff';cx.beginPath();cx.moveTo(eL.x,eL.y);const n=10;for(let i=0;i<=n;i++){const u=i/n,x=eL.x+(eR.x-eL.x)*u,y=eL.y+(eR.y-eL.y)*u;cx.lineTo(x,y+(i%2?7:2)*s)}cx.lineTo(eR.x,eR.y);cx.lineTo(eR.x+(rR.x-eR.x)*.18,eR.y+(rR.y-eR.y)*.18);cx.lineTo(eL.x+(rL.x-eL.x)*.18,eL.y+(rL.y-eL.y)*.18);cx.closePath();cx.fill();
    const q1=Q(.6,D*.3,h+rh*.6),q2=Q(Wd-.6,D*.3,h+rh*.6),q3=Q(Wd/2,D*.45,h+rh*.85);em('🍭',q1.x,q1.y,16*s);em('🍬',q2.x,q2.y,14*s);em('🍩',q3.x,q3.y,16*s)}}}
 else if(st.roof==='castle'){poly(top,lite(st.w,.08),OL);for(let i=0;i<Math.round(Wd*2);i+=2){const a=i*.5;poly([Q(a,0,h),Q(a+.5,0,h),Q(a+.5,0,h+7*s),Q(a,0,h+7*s)],fcol,OL,1.2)}
  for(let i=0;i<Math.round(D*2);i+=2){const b=i*.5;poly([Q(aS,b,h),Q(aS,b+.5,h),Q(aS,b+.5,h+7*s),Q(aS,b,h+7*s)],scol,OL,1.2)}}
 if(st.terrace){const q=Q(.55,-.55);cx.fillStyle='rgba(0,0,0,.15)';cx.beginPath();cx.ellipse(q.x,q.y,12*s,5*s,0,0,7);cx.fill();cx.strokeStyle=OL;cx.lineWidth=1.8*s;cx.beginPath();cx.moveTo(q.x,q.y);cx.lineTo(q.x,q.y-42*s);cx.stroke();
  cx.fillStyle='#ff8ab0';cx.beginPath();cx.moveTo(q.x-22*s,q.y-34*s);cx.quadraticCurveTo(q.x,q.y-56*s,q.x+22*s,q.y-34*s);cx.closePath();cx.fill();cx.stroke();rr(q.x-10*s,q.y-16*s,20*s,4*s,2,'#fff')}
 const roofTop=st.roof==='castle'?h*1.32+T*.7:st.roof==='flat'?h+6*s:h+T*1.15;
 if((d.g|0)>=6){const q=Q(Wd/2,D/2,roofTop);em('👑',q.x,q.y-8*s,18*s)}
 return{Wd,D,h:roofTop}}
/* ---------- 땅·길·공원 ---------- */
function ground(night){const G=(x0,y0,x1,y1,c)=>poly([P(x0,y0),P(x1,y0),P(x1,y1),P(x0,y1)],c);
 G(-30,-30,TX+30,TY+30,night?'#5f8a56':'#a8d890');
 blocks.forEach(b=>G(b.x-.2,b.y-.2,b.x+BX,b.y+BY,night?'#6f9a62':'#bfe3a4'));
 /* 길 (가로: 블록 아래, 세로: 블록 오른쪽) */
 const lane=Math.max(1.5,T*.05);
 for(let j=0;j<2;j++){const y=j*(BY+RB_)+BY;G(-4,y,TX+4,y+SW,'#e4d8c2');G(-4,y+SW,TX+4,y+RB_-SW,'#8f8a85');G(-4,y+RB_-SW,TX+4,y+RB_,'#e4d8c2')}
 for(let i=0;i<2;i++){const x=i*(BX+RB_)+BX;G(x,-4,x+SW,TY+4,'#e4d8c2');G(x+SW,-4,x+RB_-SW,TY+4,'#8f8a85');G(x+RB_-SW,-4,x+RB_,TY+4,'#e4d8c2')}
 /* 사거리: 아스팔트 + 횡단보도 */
 for(let j=0;j<2;j++)for(let i=0;i<2;i++){const x=i*(BX+RB_)+BX,y=j*(BY+RB_)+BY;G(x+SW,y+SW,x+RB_-SW,y+RB_-SW,'#8f8a85');
  cx.fillStyle='rgba(255,255,255,.85)';for(let k=0;k<4;k++){const u=x+SW+.15+k*.42;poly([P(u,y-.05+SW*.1),P(u+.22,y-.05+SW*.1),P(u+.22,y+SW*.9),P(u,y+SW*.9)],'rgba(255,255,255,.85)');const v=y+SW+.15+k*.42;poly([P(x+SW*.1,v),P(x+SW*.9,v),P(x+SW*.9,v+.22),P(x+SW*.1,v+.22)],'rgba(255,255,255,.85)')}}
 /* 가운데 점선 */cx.strokeStyle='rgba(255,255,255,.8)';cx.lineWidth=lane;
 for(let j=0;j<2;j++){const y=j*(BY+RB_)+BY+RB_/2;for(let x=-4;x<TX+4;x+=1.4){if(x>BX-.5&&x<BX+RB_+.5||x>2*BX+RB_-.5&&x<TX+.5)continue;const p=P(x,y),q=P(x+.7,y);cx.beginPath();cx.moveTo(p.x,p.y);cx.lineTo(q.x,q.y);cx.stroke()}}
 for(let i=0;i<2;i++){const x=i*(BX+RB_)+BX+RB_/2;for(let y=-4;y<TY+4;y+=1.4){if(y>BY-.5&&y<BY+RB_+.5||y>2*BY+RB_-.5&&y<TY+.5)continue;const p=P(x,y),q=P(x,y+.7);cx.beginPath();cx.moveTo(p.x,p.y);cx.lineTo(q.x,q.y);cx.stroke()}}}
/* 블록 안 공원 (가게 뒤쪽 빈 곳) */
const PARK=[];blocks.forEach((b,k)=>{const it=[['🌳',2,2,1.2],['🌳',4.6,1.3,1.1],['🌸',3.2,3.6,.7],['🌳',1.3,5.2,1.15],['⛲',5.4,3.8,1],['🌷',6.8,1.6,.6],['🪑',2.6,6.4,.6],['🌼',4.2,5.6,.55]];it.forEach((p,i)=>{if((i+k)%3===2&&p[0]!=='⛲'&&p[0]!=='🌳')return;PARK.push({e:k===1&&p[0]==='⛲'?'🎠':p[0],x:b.x+p[1],y:b.y+p[2],s:p[3]})})});
/* 동네 바깥 (위·왼쪽 빈 들판): 나무·꽃 */
for(let k=0;k<26;k++){const side=k%2,u=((k*37)%100)/100;const x=side?-3-((k*7)%5):u*TX,y=side?u*TY:-3-((k*11)%5);PARK.push({e:['🌳','🌲','🌳','🌸','🌼'][k%5],x,y,s:k%5>2?.6:1.1})}
/* 걷는 손님: 인도를 따라 */
const walkers=[];for(let i=0;i<10;i++){const hz=i%2===0,k=(i>>1)%2;walkers.push({hz,line:hz?k*(BY+RB_)+BY+.45:k*(BX+RB_)+BX+.45,p:Math.random()*(hz?TX:TY),v:(Math.random()<.5?-1:1)*(.4+Math.random()*.3),an:null,ph:i*1.7})}
/* ---------- 장면 ---------- */
function scene(t,list,o={}){cam();const g=cx.createLinearGradient(0,0,0,800);g.addColorStop(0,o.night?'#1a2450':'#9fd8ff');g.addColorStop(1,o.night?'#4a4a7a':'#fff1d6');cx.fillStyle=g;cx.fillRect(0,0,W,800);
 ground(o.night);
 const D=[],hits=[],lab=[];
 /* 가게: 자리·크기로 미리 칸을 재서, 내 가게를 가리는 앞 건물은 반투명(엑스레이) */
 const est=(Q,d)=>{const S=size(d.room),st=SK[d.skin|0]||SK[0],s=T/40,h=d.room<=4?T*1.3+24*s:T*1.32+T*.92*(S.fl-1),top=d.room<=4?h:st.roof==='castle'?h*1.32+T*.7:st.roof==='flat'?h+6*s:h+T*1.15,Wd=d.room<=4?1.9:S.w,Dd=S.d;
  const pts=[Q(-.3,-.4),Q(Wd+.3,-.4),Q(Wd,Dd,top),Q(0,Dd,top),Q(0,0,top),Q(Wd,0,top)];return{x0:Math.min(...pts.map(p=>p.x)),x1:Math.max(...pts.map(p=>p.x)),y0:Math.min(...pts.map(p=>p.y)),y1:Math.max(...pts.map(p=>p.y))}};
 const PL=list.map((it,i)=>{const l=LOTS[i];if(!l)return null;const S=size(it.d.room),w=it.d.room<=4?1.9:S.w,pad=(l.L-w)/2,ox=l.o==='F'?l.a0+pad:l.fx,oy=l.o==='F'?l.fx-.15:l.a0-pad,Q=l.o==='F'?mk('F',ox,oy):mk('R',ox-.15,oy);return{l,Q,bb:est(Q,it.d)}});
 const mi=list.findIndex(it=>it.me),mb=mi>=0&&PL[mi]?PL[mi].bb:null,mz=mb?PL[mi].l.cx+PL[mi].l.cy:0;
 list.forEach((it,i)=>{const pl=PL[i];if(!pl)return;const {l,Q}=pl;
  const ctr=P(l.cx,l.cy);if(ctr.x<-260||ctr.x>W+260||ctr.y<-200||ctr.y>1000)return;
  const xr=mb&&!it.me&&l.cx+l.cy>mz&&pl.bb.x0<mb.x1&&pl.bb.x1>mb.x0&&pl.bb.y0<mb.y1&&pl.bb.y1>mb.y0;
  D.push({z:l.cx+l.cy-1,f:()=>{if(xr)cx.globalAlpha=.38;const r=bldg(Q,l.o,it.d,t);cx.globalAlpha=1;const pts=[Q(-.3,-.4),Q(r.Wd+.3,-.4),Q(r.Wd,r.D,r.h),Q(0,r.D,r.h),Q(0,0,r.h),Q(r.Wd,0,r.h)];hits.push({i,xr,x0:Math.min(...pts.map(p=>p.x)),x1:Math.max(...pts.map(p=>p.x)),y0:Math.min(...pts.map(p=>p.y))-10,y1:Math.max(...pts.map(p=>p.y))+22});
   lab.push(()=>{const q=l.o==='F'?P(l.cx,l.fx+.55):P(l.fx+.55,l.cy);const nm=it.d.n||'붕어빵',sub=it.me?'⭐ 내 가게':(it.d.nk?it.d.nk+' 사장님':''),k=Math.max(.75,Math.min(1.15,T/40)),f1=13*k,f2=11*k;
    cx.font='bold '+f1+'px "Jua","Noto Sans KR",sans-serif';const bw=Math.max(cx.measureText(nm).width,cx.measureText(sub).width*.85)+16*k;rr(q.x-bw/2,q.y,bw,34*k,10*k,it.me?'#ffc94a':'rgba(255,255,255,.93)');
    tx(nm,q.x,q.y+11*k,f1,'#5a3a22','center',it.me?'#ffc94a':'#fff');tx(sub,q.x,q.y+25*k,f2,it.me?'#7a4a10':'#8a6a4a','center',it.me?'#ffc94a':'#fff');
    if(it.me){const p=Q(r.Wd/2,r.D/2,r.h);em('📍',p.x,p.y-20-Math.abs(Math.sin(t*3))*5,24)}})}})});
 /* 공원 */PARK.forEach(p=>D.push({z:p.x+p.y,f:()=>{const q=P(p.x,p.y);if(q.x<-60||q.x>W+60||q.y<-60||q.y>860)return;cx.fillStyle='rgba(0,0,0,.12)';cx.beginPath();cx.ellipse(q.x,q.y,T*.45*p.s,T*.18*p.s,0,0,7);cx.fill();em(p.e,q.x,q.y-T*.5*p.s,T*1.05*p.s)}}));
 /* 가로등 (사거리 모퉁이) */for(let j=0;j<2;j++)for(let i=0;i<2;i++){const x=i*(BX+RB_)+BX-.35,y=j*(BY+RB_)+BY-.35;D.push({z:x+y,f:()=>{const q=P(x,y);cx.strokeStyle='#4a4a52';cx.lineWidth=Math.max(2,T*.07);cx.beginPath();cx.moveTo(q.x,q.y);cx.lineTo(q.x,q.y-T*1.4);cx.stroke();cx.fillStyle=o.night?'#ffe680':'#fff6c0';cx.beginPath();cx.arc(q.x,q.y-T*1.45,T*.14,0,7);cx.fill();cx.strokeStyle=OL;cx.lineWidth=1;cx.stroke()}})}
 /* 걷는 손님 */const AN=o.an||['🐱','🐰','🐻','🐶'],dt=o.dt||0;for(const wk of walkers){wk.p+=wk.v*dt;const mx=wk.hz?TX:TY;if(wk.p<-3)wk.p=mx+2;if(wk.p>mx+3)wk.p=-2;if(!wk.an)wk.an=AN[Math.floor(Math.random()*AN.length)];
  const gx=wk.hz?wk.p:wk.line,gy=wk.hz?wk.line:wk.p;D.push({z:gx+gy+.3,f:()=>{const q=P(gx,gy),sz=T*.6;if(q.x<-40||q.x>W+40||q.y<-40||q.y>860)return;cx.fillStyle='rgba(0,0,0,.14)';cx.beginPath();cx.ellipse(q.x,q.y,sz*.3,sz*.12,0,0,7);cx.fill();
   const left=wk.hz?wk.v<0:wk.v>0;cx.save();if(left){cx.translate(q.x*2,0);cx.scale(-1,1)}animal(wk.an,q.x,q.y-sz*.9,sz,{walk:t*10+wk.ph,t,ph:wk.ph});cx.restore()}})}
 D.sort((a,b)=>a.z-b.z).forEach(q=>q.f());lab.forEach(f=>f());
 return{hits}}
/* 꾸미기 미리보기: 내 건물 하나를 크게 */
function preview(t,d,top,bottom){const g=cx.createLinearGradient(0,top,0,bottom);g.addColorStop(0,'#9fd8ff');g.addColorStop(1,'#fff1d6');cx.fillStyle=g;cx.fillRect(0,top,W,bottom-top);
 const sv={T,OX,OY},S=size(d.room);T=Math.min(70,(bottom-top-60)/((d.room<=4?1.9:1.45+1.1*(S.fl-1))+1.2+S.d*.25+.9),300/((S.w+S.d)/2+.6));
 OX=225-((S.w/2)+(S.d/2))*T/2;OY=bottom-70-(S.w/2)*T/4;
 const G=(y0,y1,c)=>poly([P(-3,y0),P(S.w+3,y0),P(S.w+3,y1),P(-3,y1)],c);G(-S.d-2,0,'#cfe6b4');G(0,1.1,'#e4d8c2');G(1.1,4,'#8f8a85');
 bldg(mk('F',0,0),'F',d,t);T=sv.T;OX=sv.OX;OY=sv.OY}
function hit(hits,x,y){let best=null,see=null;for(const q of hits)if(x>=q.x0&&x<=q.x1&&y>=q.y0&&y<=q.y1){best=q;if(!q.xr)see=q}return see||best}
return{SK,size,LOTS,scene,preview,center,drag,zoom,hit,get T(){return T}}};
if(typeof module!=='undefined')module.exports=STREET;
