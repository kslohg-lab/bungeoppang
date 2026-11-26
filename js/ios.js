/* 📱 아이폰 맞춤 (11/26 아이폰 점검)
   1) 🪙 11/26 VOC '아이폰은 돈이 은화처럼 보여요': 기기마다 🪙 그림이 달라요(애플 = 은색). 모든 기기에서 같은 금화 그림으로 보여 줘요.
   · 화면 글자: 🪙 글자를 금화 그림으로 바꿔요 (나중에 바뀌는 글자도 지켜보다가 바꿔요)
   · 캔버스 글자: fillText 안의 🪙 자리에 금화 그림을 그려요 (자리 너비는 원래 글자 너비 그대로라 배치가 안 바뀌어요) */
(function(){'use strict';var C='🪙',SRC='img/coin.webp?v=1';
 var IMG=new Image();IMG.src=SRC;var ok=function(){return IMG.complete&&IMG.naturalWidth>0};
 try{var P=CanvasRenderingContext2D.prototype,of=P.fillText,os=P.strokeText,mt=P.measureText;
  var draw=function(ctx,t,x,y,mw,fill){var parts=String(t).split(C),cw=mt.call(ctx,C).width,ws=parts.map(function(p){return mt.call(ctx,p).width}),W=ws.reduce(function(a,b){return a+b},0)+cw*(parts.length-1);
   var al=ctx.textAlign,sx=al==='center'?x-W/2:(al==='right'||al==='end')?x-W:x,m=/(\d+(?:\.\d+)?)px/.exec(ctx.font),fs=m?+m[1]:16,s=Math.min(cw,fs*1.05),bl=ctx.textBaseline,
    top=bl==='middle'?y-s/2:bl==='top'||bl==='hanging'?y:bl==='bottom'||bl==='ideographic'?y-s:y-s*.86;
   ctx.textAlign='left';try{for(var i=0;i<parts.length;i++){if(parts[i]){if(fill)of.call(ctx,parts[i],sx,y);else os.call(ctx,parts[i],sx,y)}sx+=ws[i];if(i<parts.length-1){if(fill)ctx.drawImage(IMG,sx+(cw-s)/2,top,s,s);sx+=cw}}}finally{ctx.textAlign=al}};
  P.fillText=function(t,x,y,mw){if(typeof t==='string'&&t.indexOf(C)>=0&&ok()&&mw===undefined){draw(this,t,x,y,mw,true);return}return of.apply(this,arguments)};
  P.strokeText=function(t,x,y,mw){if(typeof t==='string'&&t.indexOf(C)>=0&&ok()&&mw===undefined){draw(this,t,x,y,mw,false);return}return os.apply(this,arguments)};
 }catch(e){}
 /* 화면 글자 */
 var SKIP={SCRIPT:1,STYLE:1,TEXTAREA:1,OPTION:1,TITLE:1,INPUT:1,NOSCRIPT:1};
 var fix=function(n){if(!n)return;if(n.nodeType===3){var v=n.nodeValue;if(!v||v.indexOf(C)<0)return;var p=n.parentNode;if(!p||SKIP[p.nodeName])return;var f=document.createDocumentFragment(),a=v.split(C);for(var i=0;i<a.length;i++){if(a[i])f.appendChild(document.createTextNode(a[i]));if(i<a.length-1){var im=document.createElement('img');im.src=SRC;im.alt='🪙';im.className='coin';im.draggable=false;f.appendChild(im)}}p.replaceChild(f,n);return}
  if(n.nodeType===1&&!SKIP[n.nodeName]){var w=document.createTreeWalker(n,4,null),L=[],x;while((x=w.nextNode()))if(x.nodeValue.indexOf(C)>=0)L.push(x);L.forEach(fix)}};
 var st=document.createElement('style');st.textContent='img.coin{width:1.05em;height:1.05em;vertical-align:-.16em;display:inline-block;pointer-events:none;-webkit-user-drag:none;margin:0 .03em}';
 var go=function(){document.head.appendChild(st);fix(document.body);new MutationObserver(function(ms){for(var i=0;i<ms.length;i++){var m=ms[i];if(m.type==='characterData')fix(m.target);else for(var j=0;j<m.addedNodes.length;j++)fix(m.addedNodes[j])}}).observe(document.body,{childList:true,subtree:true,characterData:true})};
 if(document.body)go();else document.addEventListener('DOMContentLoaded',go);
 /* 2) 이름 쓰기 등 글자판이 닫힌 뒤 화면이 위로 밀려 있는 아이폰 버릇: 맨 위로 되돌리고 크기를 다시 맞춰요 */
 document.addEventListener('focusout',function(e){var t=e.target;if(!t||(t.nodeName!=='INPUT'&&t.nodeName!=='TEXTAREA'))return;setTimeout(function(){try{if(window.scrollY||document.documentElement.scrollTop||document.body.scrollTop){window.scrollTo(0,0);document.body.scrollTop=0}}catch(_){}try{dispatchEvent(new Event('resize'))}catch(_){}},120)},true);
})();
