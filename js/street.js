/* ===== 🐟 붕어빵 거리: 가게 겉모습(외관 스킨)과 옆 가게들 =====
   STREET(cx,A) → {SK, size, bldg, scene, preview}
   d = {room, skin, awn, sign, wall, n(가게 이름), nk(사장님), g(등급), me}
   건물 크기 = 가게 크기(넓히기): 4×4 노점은 수레, 7×7부터 2층, 9×9부터 3층 */
const STREET=(cx,A)=>{
const {em,tx,rr,lite,dark,animal}=A;const W=450,OL='#5a3a22';
/* 외관 스킨별 색 (벽, 벽 줄무늬, 지붕, 테두리) */
const SK=[
 {w:'#fff1d6',l:'rgba(150,110,70,.18)',r:'#8a5a3a',t:'#6a4024',roof:'flat'},          /* 0 기본 가게 */
 {w:'#c8583a',l:'rgba(90,30,15,.35)',r:'#5a3a32',t:'#3a2420',roof:'flat',brick:1},   /* 1 벽돌집 */
 {w:'#b07840',l:'rgba(80,45,15,.4)',r:'#5a7a3a',t:'#5a3a1a',roof:'tri',log:1},        /* 2 통나무 오두막 */
 {w:'#f6f0e2',l:'#7a4a2a',r:'#4a4a52',t:'#7a4a2a',roof:'hanok'},                       /* 3 한옥 */
 {w:'#cfeee0',l:'rgba(60,120,100,.25)',r:'#3a8a6a',t:'#2a6a50',roof:'flat',terrace:1}, /* 4 카페 테라스 */
 {w:'#c8864a',l:'rgba(255,255,255,.0)',r:'#ffb8d0',t:'#8a4a2a',roof:'candy'},         /* 5 과자집 */
 {w:'#b8b4ac',l:'rgba(80,80,80,.3)',r:'#5a6ab8',t:'#6a6660',roof:'castle'}];           /* 6 성 */
const AWC=[['#e8584a','#fff6ec'],['#4a8ae8','#fff6ec'],['#4ab86a','#fff6ec'],['#ff8ab0','#fff0f6'],['#ffcf3a','#fff6ec'],['rb'],['#2a3a7a','#ffd23a'],['#ffb0c8','#fff0f6'],['#d4a020','#fff3c0']];
const RB=['#ff5a5a','#ff9a3a','#ffd93a','#6ccf5a','#4aa8ff','#a85aff'];
const SB=[['#8a5a3a','#fff3c0'],['#ff8ab0','#fff'],['#2a3a32','#f0f0e0'],['#2a1a3a','#e8b0ff'],['#d4a020','#fff6d0'],['#a85aff','#fff'],['#d4a020','#fff6d0'],['#1a2a5a','#fff6c0']];
function size(room){const r=Math.max(4,Math.min(10,room|0));return{w:[96,104,118,132,146,160,176][r-4],h:[0,112,128,170,186,232,250][r-4],fl:r>=9?3:r>=7?2:1}}
const box=(x,y,w,h,f,r=4,lw=2.2)=>{rr(x,y,w,h,r,f);cx.strokeStyle=OL;cx.lineWidth=lw;cx.beginPath();cx.roundRect(x,y,w,h,r);cx.stroke()};
function awning(x,y,w,h,ai){const ac=AWC[ai|0]||AWC[0],n=Math.max(5,Math.round(w/16));for(let i=0;i<n;i++){const c=ac[0]==='rb'?RB[i%6]:i%2?ac[1]:ac[0];const x0=x+w*i/n,x1=x+w*(i+1)/n;cx.fillStyle=c;cx.beginPath();cx.moveTo(x0,y);cx.lineTo(x1,y);cx.lineTo(x1,y+h);cx.arc((x0+x1)/2,y+h,(x1-x0)/2,0,Math.PI);cx.closePath();cx.fill()}
 cx.strokeStyle=OL;cx.lineWidth=2;cx.beginPath();cx.moveTo(x,y);cx.lineTo(x+w,y);cx.stroke()}
function signBoard(x,y,w,h,name,si,t){const sb=SB[si|0]||SB[0];box(x,y,w,h,sb[0],6);let fs=Math.min(h*.62,15);cx.font='bold '+fs+'px "Jua","Noto Sans KR",sans-serif';while(cx.measureText(name).width>w-10&&fs>8){fs-=1;cx.font='bold '+fs+'px "Jua","Noto Sans KR",sans-serif'}tx(name,x+w/2,y+h/2+1,fs,sb[1],'center',sb[0]);
 if((si|0)===7)for(let i=0;i<3;i++){cx.globalAlpha=.4+.6*Math.abs(Math.sin(t*2+i));em('✨',x+w*(.15+i*.35),y-6,10);cx.globalAlpha=1}}
function shopFront(x,y,w,h,d,t,s){/* 1층 가게: 진열창(붕어빵) + 문 + 차양 + 간판 */
 const dw=w*.26,wx=x+w*.08,ww=w*.5;box(wx,y+h*.42,ww,h*.5,'#bfe6ff',4,2);
 for(let i=0;i<3;i++)A.bread(wx+ww*(.2+i*.3),y+h*.8,.0019*w*s,'#e8a840',{plain:true});
 cx.strokeStyle='rgba(255,255,255,.7)';cx.lineWidth=2;cx.beginPath();cx.moveTo(wx+6,y+h*.48);cx.lineTo(wx+ww*.35,y+h*.48);cx.stroke();
 const dx=x+w-dw-w*.08;box(dx,y+h*.4,dw,h*.6,'#8a5a3a',4,2);rr(dx+dw*.18,y+h*.48,dw*.64,h*.22,3,'#bfe6ff');cx.fillStyle='#ffd23a';cx.beginPath();cx.arc(dx+dw*.8,y+h*.72,2.4,0,7);cx.fill();
 awning(x+w*.04,y+h*.26,w*.92,h*.12,d.awn);
 signBoard(x+w*.1,y+h*.02,w*.8,h*.2,d.n||'붕어빵',d.sign,t);
 /* 김 */for(let i=0;i<2;i++){const ph=(t*.8+i*.5)%1;cx.fillStyle='rgba(255,255,255,'+(.6*(1-ph))+')';cx.beginPath();cx.ellipse(wx+ww*(.35+i*.3),y+h*.42-ph*h*.25,3+ph*4,2+ph*3,0,0,7);cx.fill()}}
function cart(x,gy,d,t,sc,st){/* 노점 수레 */const w=96*sc,h=70*sc,y=gy-h;
 const wood=st.roof==='castle'?'#9a968e':st.w==='#fff1d6'?'#c88a4e':st.w;
 for(const u of[.22,.78]){cx.fillStyle='#4a3a30';cx.beginPath();cx.arc(x-w/2+w*u,gy-8*sc,9*sc,0,7);cx.fill();cx.strokeStyle=OL;cx.lineWidth=2;cx.stroke()}
 box(x-w/2,y+h*.45,w,h*.42,wood,6);rr(x-w/2+6,y+h*.5,w-12,h*.08,2,'rgba(255,255,255,.35)');
 for(let i=0;i<3;i++)A.bread(x-w*.25+i*w*.25,y+h*.42,.0019*w,'#e8a840',{plain:true});
 cx.strokeStyle=OL;cx.lineWidth=3;cx.beginPath();cx.moveTo(x-w*.42,y+h*.45);cx.lineTo(x-w*.42,y-h*.15);cx.moveTo(x+w*.42,y+h*.45);cx.lineTo(x+w*.42,y-h*.15);cx.stroke();
 awning(x-w*.52,y-h*.25,w*1.04,h*.22,d.awn);signBoard(x-w*.4,y-h*.62,w*.8,h*.32,d.n||'붕어빵',d.sign,t);
 for(let i=0;i<2;i++){const ph=(t*.8+i*.5)%1;cx.fillStyle='rgba(255,255,255,'+(.6*(1-ph))+')';cx.beginPath();cx.ellipse(x-w*.15+i*w*.3,y+h*.3-ph*h*.3,3+ph*4,2+ph*3,0,0,7);cx.fill()}
 return{x0:x-w*.55,x1:x+w*.55,y0:y-h*.65,y1:gy}}
/* 건물 하나: x=가운데, gy=땅 높이, sc=크기 배율 → 차지한 칸(톡 판정) */
function bldg(x,gy,d,t,sc=1){const st=SK[d.skin|0]||SK[0];if((d.room|0)<=4)return cart(x,gy,d,t,sc,st);
 const S=size(d.room),w=S.w*sc,h=S.h*sc,x0=x-w/2,y0=gy-h,fh=Math.min(h/S.fl,92*sc),gh=h-fh*(S.fl-1);
 cx.fillStyle='rgba(0,0,0,.15)';cx.beginPath();cx.ellipse(x,gy,w*.56,7*sc,0,0,7);cx.fill();
 /* 탑(성): 벽 뒤에 */
 if(st.roof==='castle'){for(const u of[0,1]){const tx0=u?x0+w-w*.1:x0-w*.1,tw=w*.2;box(tx0,y0-h*.18,tw,h*1.18,'#a8a49c',3);cx.fillStyle='#5a6ab8';cx.strokeStyle=OL;cx.lineWidth=2.2;cx.beginPath();cx.moveTo(tx0-4,y0-h*.18);cx.lineTo(tx0+tw/2,y0-h*.18-tw*1.2);cx.lineTo(tx0+tw+4,y0-h*.18);cx.closePath();cx.fill();cx.stroke();
  const fx=tx0+tw/2,fy=y0-h*.18-tw*1.2;cx.beginPath();cx.moveTo(fx,fy);cx.lineTo(fx,fy-14*sc);cx.stroke();cx.fillStyle=u?'#ffd23a':'#ff6a6a';cx.beginPath();cx.moveTo(fx,fy-14*sc);cx.lineTo(fx+10*sc+Math.sin(t*4+u)*2,fy-11*sc);cx.lineTo(fx,fy-8*sc);cx.closePath();cx.fill()}}
 box(x0,y0,w,h,st.w,3);
 /* 벽 무늬 */
 cx.save();cx.beginPath();cx.rect(x0+1,y0+1,w-2,h-2);cx.clip();cx.strokeStyle=st.l;cx.lineWidth=1.2;
 if(st.brick){for(let yy=y0+8,r=0;yy<gy;yy+=8,r++){cx.beginPath();cx.moveTo(x0,yy);cx.lineTo(x0+w,yy);cx.stroke();for(let xx=x0+(r%2?8:0);xx<x0+w;xx+=16){cx.beginPath();cx.moveTo(xx,yy-8);cx.lineTo(xx,yy);cx.stroke()}}}
 else if(st.log){cx.lineWidth=2;for(let yy=y0+10;yy<gy;yy+=10){cx.beginPath();cx.moveTo(x0,yy);cx.lineTo(x0+w,yy);cx.stroke()}cx.fillStyle=dark(st.w,.25);for(let yy=y0+5;yy<gy;yy+=10){cx.beginPath();cx.arc(x0+3,yy,4,0,7);cx.arc(x0+w-3,yy,4,0,7);cx.fill()}}
 else if(st.roof==='hanok'){cx.lineWidth=4;cx.strokeStyle=st.l;for(const u of[0,.33,.66,1]){cx.beginPath();cx.moveTo(x0+w*u,y0);cx.lineTo(x0+w*u,gy);cx.stroke()}for(let f=1;f<S.fl;f++){cx.beginPath();cx.moveTo(x0,gy-gh-fh*(f-1));cx.lineTo(x0+w,gy-gh-fh*(f-1));cx.stroke()}}
 else if(st.roof==='castle'){for(let yy=y0+12,r=0;yy<gy;yy+=12,r++){cx.beginPath();cx.moveTo(x0,yy);cx.lineTo(x0+w,yy);cx.stroke();for(let xx=x0+(r%2?12:0);xx<x0+w;xx+=24){cx.beginPath();cx.moveTo(xx,yy-12);cx.lineTo(xx,yy);cx.stroke()}}}
 else if(st.roof==='candy'){for(let i=0;i<14;i++){const px=x0+((i*37)%100)/100*w,py=y0+((i*61)%100)/100*h*.9+8;cx.fillStyle=['#ff6a8a','#7ed8ff','#ffe066','#9ad870'][i%4];cx.beginPath();cx.arc(px,py,2.6,0,7);cx.fill()}}
 else{for(let xx=x0+12;xx<x0+w;xx+=12){cx.beginPath();cx.moveTo(xx,y0);cx.lineTo(xx,gy);cx.stroke()}}
 cx.restore();
 /* 위층 창문 */
 for(let f=1;f<S.fl;f++){const fy=y0+fh*(S.fl-1-f),n=S.w>=150?3:2;for(let i=0;i<n;i++){const ww=w*.2,wx=x0+w*(i+.5)/n-ww/2,wy=fy+fh*.22,wh=fh*.5;box(wx,wy,ww,wh,'#ffeeaa',3,1.8);cx.fillStyle='rgba(255,255,255,.5)';cx.fillRect(wx+3,wy+3,ww*.3,wh*.3);cx.strokeStyle=OL;cx.lineWidth=1.4;cx.beginPath();cx.moveTo(wx+ww/2,wy);cx.lineTo(wx+ww/2,wy+wh);cx.stroke();
   if(st.roof==='hanok'){cx.strokeStyle='#7a4a2a';cx.beginPath();cx.moveTo(wx,wy+wh/2);cx.lineTo(wx+ww,wy+wh/2);cx.stroke()}}
  if(f===1&&st.roof!=='castle')rr(x0,fy+fh-4,w,4,1,st.t)}
 shopFront(x0,gy-gh,w,gh,d,t,sc);
 /* 지붕 */
 cx.strokeStyle=OL;cx.lineWidth=2.4;
 if(st.roof==='flat'){box(x0-6,y0-12*sc,w+12,14*sc,st.r,3);if(st.terrace){for(let i=0;i<4;i++)em('🌿',x0+w*(.15+i*.23),y0-18*sc,14*sc)}}
 else if(st.roof==='tri'){cx.fillStyle=st.r;cx.beginPath();cx.moveTo(x0-12,y0+2);cx.lineTo(x,y0-h*.42);cx.lineTo(x0+w+12,y0+2);cx.closePath();cx.fill();cx.stroke();cx.fillStyle=dark(st.r,.2);for(let i=0;i<5;i++){cx.beginPath();cx.arc(x0+w*(.15+i*.18),y0-h*.08-(i%2)*6,5,0,7);cx.fill()}rr(x+w*.18,y0-h*.36,w*.1,h*.2,2,'#7a5a4a')}
 else if(st.roof==='hanok'){const ry=y0-h*.2;cx.fillStyle=st.r;cx.beginPath();cx.moveTo(x0-22,y0-2);cx.quadraticCurveTo(x0-6,y0-h*.04,x0+6,ry);cx.lineTo(x0+w-6,ry);cx.quadraticCurveTo(x0+w+6,y0-h*.04,x0+w+22,y0-2);cx.quadraticCurveTo(x,y0+6,x0-22,y0-2);cx.closePath();cx.fill();cx.stroke();
  cx.strokeStyle='rgba(255,255,255,.18)';cx.lineWidth=1.5;for(let i=1;i<10;i++){const u=i/10;cx.beginPath();cx.moveTo(x0+w*u,ry+2);cx.lineTo(x0-16+(w+32)*u,y0);cx.stroke()}rr(x0+4,ry-5,w-8,6,2,'#2a2a32')}
 else if(st.roof==='candy'){cx.fillStyle=st.r;cx.beginPath();cx.moveTo(x0-12,y0+4);cx.lineTo(x,y0-h*.4);cx.lineTo(x0+w+12,y0+4);cx.closePath();cx.fill();cx.stroke();
  cx.fillStyle='#fff';cx.beginPath();cx.moveTo(x0-12,y0+4);for(let i=0;i<=8;i++){const u=i/8;cx.lineTo(x0-12+(w+24)*u,y0+4+(i%2?10:4))}cx.lineTo(x0+w+12,y0+4);cx.closePath();cx.fill();
  em('🍭',x0+6,y0-6,18*sc);em('🍬',x0+w-8,y0-4,16*sc);em('🍩',x,y0-h*.22,18*sc)}
 else if(st.roof==='castle'){for(let i=0;i<6;i++){if(i%2)continue;rr(x0+w*i/6,y0-12*sc,w/6,12*sc,1,'#a8a49c')}cx.strokeStyle=OL;cx.lineWidth=2;cx.beginPath();cx.moveTo(x0,y0);cx.lineTo(x0+w,y0);cx.stroke()}
 if(st.terrace){/* 테라스 파라솔 */const px=x0-14*sc;cx.strokeStyle=OL;cx.lineWidth=2;cx.beginPath();cx.moveTo(px,gy);cx.lineTo(px,gy-48*sc);cx.stroke();cx.fillStyle='#ff8ab0';cx.beginPath();cx.moveTo(px-24*sc,gy-40*sc);cx.quadraticCurveTo(px,gy-62*sc,px+24*sc,gy-40*sc);cx.closePath();cx.fill();cx.stroke();rr(px-10*sc,gy-18*sc,20*sc,5,2,'#fff')}
 /* 등급 표시 */if((d.g|0)>=6)em('👑',x,y0-(st.roof==='tri'||st.roof==='candy'?h*.48:st.roof==='hanok'?h*.28:22*sc),20*sc);
 return{x0:x0-(st.roof==='castle'?w*.1:st.terrace?40*sc:12),x1:x0+w+(st.roof==='castle'?w*.1:12),y0:y0-h*.5,y1:gy}}
/* 거리 배경 */
const GY=520;
function back(t,night){const g=cx.createLinearGradient(0,0,0,GY);g.addColorStop(0,night?'#1a2450':'#9fd8ff');g.addColorStop(1,night?'#5a5a8a':'#fff1d6');cx.fillStyle=g;cx.fillRect(0,0,W,GY);
 if(night){em('🌙',380,100,32)}else{em('☀️',385,110,40);cx.fillStyle='rgba(255,255,255,.85)';for(let i=0;i<3;i++){const x=((t*6+i*170)%560)-60;cx.beginPath();cx.ellipse(x,120+i*22,32,10,0,0,7);cx.fill()}}}
function ground(cam){cx.fillStyle='#d8cbb6';cx.fillRect(0,GY,W,46);cx.fillStyle='#bba98e';cx.fillRect(0,GY+46,W,6);
 cx.strokeStyle='rgba(120,100,80,.25)';cx.lineWidth=1;for(let x=-((cam%40)+40)%40;x<W;x+=40){cx.beginPath();cx.moveTo(x,GY);cx.lineTo(x,GY+46);cx.stroke()}
 cx.fillStyle='#8f8a85';cx.fillRect(0,GY+52,W,110);cx.strokeStyle='rgba(255,255,255,.75)';cx.lineWidth=3;cx.setLineDash([18,14]);cx.lineDashOffset=cam%32;cx.beginPath();cx.moveTo(0,GY+107);cx.lineTo(W,GY+107);cx.stroke();cx.setLineDash([]);
 cx.fillStyle='#a8d890';cx.fillRect(0,GY+162,W,200)}
/* 뒤쪽 먼 건물(실루엣) */
function far(cam){cx.fillStyle='rgba(120,140,170,.22)';for(let i=-2;i<14;i++){const x=i*70-(cam*.4)%70,h=60+((i*53)%5)*18;cx.fillRect(x,GY-h-40,56,h+40)}}
const walkers=[];for(let i=0;i<5;i++)walkers.push({x:Math.random()*900-200,v:(Math.random()<.5?-1:1)*(18+Math.random()*16),an:null,ph:i*1.7});
/* 장면: list = [{d,me}], cam = 거리 위 카메라 x(왼쪽 끝) → 톡 판정용 칸 목록 */
function scene(t,list,cam,o={}){back(t,o.night);far(cam);ground(cam);
 const hits=[],lab=[];let x=0;const pos=list.map(it=>{const S=size(it.d.room),w=(it.d.room<=4?96:S.w)+58;const c=x+w/2;x+=w;return c});
 list.forEach((it,i)=>{const cxp=pos[i]-cam;if(cxp<-160||cxp>W+160)return;const r=bldg(cxp,GY,it.d,t,1);
  lab.push(()=>{/* 이름표 */const nm=it.d.n||'붕어빵',sub=(it.me?'⭐ 내 가게':(it.d.nk?it.d.nk+' 사장님':''));cx.font='bold 13px "Jua","Noto Sans KR",sans-serif';const bw=Math.max(cx.measureText(nm).width,cx.measureText(sub).width*.85)+18;
  rr(cxp-bw/2,GY+6,bw,36,10,it.me?'#ffc94a':'rgba(255,255,255,.92)');tx(nm,cxp,GY+18,13,'#5a3a22','center',it.me?'#ffc94a':'#fff');tx(sub,cxp,GY+33,11,it.me?'#7a4a10':'#8a6a4a','center',it.me?'#ffc94a':'#fff');
  if(it.me){const b=Math.sin(t*3)*3;em('📍',cxp,r.y0-14+b,24)}});
  hits.push({i,x0:r.x0,x1:r.x1,y0:r.y0,y1:GY+44})});
 const AN=o.an||['🐱','🐰','🐻','🐶'];for(const wk of walkers){wk.x+=wk.v*(o.dt||0);if(wk.x<-120)wk.x=W+100;if(wk.x>W+120)wk.x=-100;if(!wk.an)wk.an=AN[Math.floor(Math.random()*AN.length)];
  cx.save();if(wk.v<0){cx.translate(wk.x*2,0);cx.scale(-1,1)}animal(wk.an,wk.x,GY+2,28,{walk:t*10+wk.ph,t,ph:wk.ph});cx.restore()}
 lab.forEach(f=>f());return{hits,total:x,pos}}
/* 꾸미기 미리보기: 내 건물 하나를 크게 */
function preview(t,d,top,bottom){const g=cx.createLinearGradient(0,top,0,bottom);g.addColorStop(0,'#9fd8ff');g.addColorStop(1,'#fff1d6');cx.fillStyle=g;cx.fillRect(0,top,W,bottom-top);
 const gy=bottom-40;cx.fillStyle='#d8cbb6';cx.fillRect(0,gy,W,40);cx.fillStyle='#bba98e';cx.fillRect(0,gy,W,5);
 const S=size(d.room),sc=Math.min(1.5,(bottom-top-90)/((d.room<=4?110:S.h)*1.5),300/(d.room<=4?100:S.w));bldg(W/2,gy,d,t,sc)}
return{SK,size,bldg,scene,preview,GY}};
if(typeof module!=='undefined')module.exports=STREET;
