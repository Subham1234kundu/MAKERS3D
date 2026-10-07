import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const work=path.resolve('tmp/social-motion-review');await mkdir(work,{recursive:true});
const browser=spawn('C:/Program Files/Google/Chrome/Application/chrome.exe',[
  '--headless=new','--disable-gpu','--disable-accelerated-video-decode','--enable-unsafe-swiftshader','--window-size=1440,1000',
  '--no-first-run','--no-default-browser-check','--remote-debugging-port=9336',`--user-data-dir=${path.join(work,'profile')}`,'about:blank'
],{windowsHide:true,stdio:'ignore'});
await writeFile(path.join(work,'chrome-pid.txt'),String(browser.pid));
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const report={checks:[],errors:[],passed:false};let ws;let sequence=0;const pending=new Map();
function send(method,params={}){const id=++sequence;return new Promise((resolve,reject)=>{const timer=setTimeout(()=>{pending.delete(id);reject(new Error(`CDP timeout: ${method}`));},15000);pending.set(id,{resolve,reject,timer});ws.send(JSON.stringify({id,method,params}));});}
async function evaluate(expression){const result=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(result.exceptionDetails)throw new Error(result.exceptionDetails.exception?.description||result.exceptionDetails.text);return result.result.value;}
async function waitFor(expression,timeout=30000){const end=Date.now()+timeout;while(Date.now()<end){if(await evaluate(`Boolean(${expression})`))return;await pause(30);}throw new Error(`Wait failed: ${expression}`);}
function assert(value,label){if(!value)throw new Error(label);console.log(`PASS ${label}`);}
const phase=name=>waitFor(`document.querySelector('.chat-fab')?.dataset.chatState==='${name}'`);
const click=()=>evaluate(`document.querySelector('.chat-fab button').click();true`);
const settled=()=>waitFor(`[...document.querySelectorAll('.chat-social-item')].every(el=>Number(getComputedStyle(el).opacity)===1&&new DOMMatrix(getComputedStyle(el).transform).m42===0&&el.getAnimations().every(animation=>animation.playState!=='running'))`);
const snapshot=()=>evaluate(`(() => {
 const root=document.querySelector('.chat-fab'),button=root.querySelector('button'),options=root.querySelector('.chat-social-options');
 const rect=node=>{const r=node.getBoundingClientRect();return {top:r.top,bottom:r.bottom,left:r.left,right:r.right,width:r.width,height:r.height,centerX:(r.left+r.right)/2,centerY:(r.top+r.bottom)/2};};
 return {phase:root.dataset.chatState,width:innerWidth,height:innerHeight,expanded:button.getAttribute('aria-expanded'),button:rect(button),root:rect(root),
   pulse:getComputedStyle(button).animationName,pulseDuration:getComputedStyle(button).animationDuration,ring:getComputedStyle(button,'::before').animationName,
   pulseScale:new DOMMatrix(getComputedStyle(button).transform).m11,icon:button.querySelector('path').getAttribute('d'),
   hidden:options.getAttribute('aria-hidden'),inert:options.inert,text:root.textContent.trim(),optionsBackground:getComputedStyle(options).backgroundColor,
   items:[...options.children].map(item=>{const css=getComputedStyle(item),link=item.querySelector('a');return {opacity:Number(css.opacity),visibility:css.visibility,y:new DOMMatrix(css.transform).m42,scale:new DOMMatrix(css.transform).m11,transitionDuration:css.transitionDuration,delay:css.transitionDelay,svgCount:link.querySelectorAll('svg').length,href:link.getAttribute('href'),...rect(link)};}),
   overflow:document.documentElement.scrollWidth>innerWidth};
})()`);
async function navigate(width,height,reduced){
 await send('Page.navigate',{url:'about:blank'});await pause(150);
 await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<1024});
 await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:reduced?'reduce':'no-preference'}]});
 const marker=`review${Date.now()}`;const script=await send('Page.addScriptToEvaluateOnNewDocument',{source:`window.__motionReview='${marker}';`});
 await send('Page.navigate',{url:'http://localhost:3000/about'});
 await waitFor(`window.__motionReview==='${marker}'&&document.readyState==='complete'&&Object.keys(document.querySelector('.chat-fab button')||{}).some(key=>key.startsWith('__reactProps$'))`,60000);
 await send('Page.removeScriptToEvaluateOnNewDocument',{identifier:script.identifier});
 await pause(2200);
}
async function screenshot(name){const clip=await evaluate(`(() => {const r=document.querySelector('.chat-fab').getBoundingClientRect();return {x:r.left-12,y:r.top-180,width:r.width+24,height:r.height+192,scale:2};})()`);const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false,clip});await mkdir('docs/previews',{recursive:true});await writeFile(`docs/previews/${name}.png`,Buffer.from(shot.data,'base64'));}
try{
 let targets;for(let i=0;i<100;i++){try{targets=await(await fetch('http://127.0.0.1:9336/json/list')).json();if(targets.some(t=>t.type==='page'))break;}catch{}await pause(150);}
 ws=new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true});});
 ws.addEventListener('message',event=>{const message=JSON.parse(event.data);if(message.id){const waiter=pending.get(message.id);if(!waiter)return;clearTimeout(waiter.timer);pending.delete(message.id);if(message.error)waiter.reject(new Error(JSON.stringify(message.error)));else waiter.resolve(message.result);}else if(message.method==='Runtime.exceptionThrown')report.errors.push(message.params.exceptionDetails.exception?.description||message.params.exceptionDetails.text);});
 await send('Page.enable');await send('Runtime.enable');await send('Network.enable');await send('Network.setCacheDisabled',{cacheDisabled:true});
 for(const [width,height,reduced] of [[1440,1000,false],[390,844,false],[390,844,true]]){
  await navigate(width,height,reduced);const data={width,height,reduced};report.checks.push(data);data.closed=await snapshot();
  assert(await evaluate(`!document.querySelector('.about-hero').textContent.includes('Established MMXXIV')&&!document.querySelector('.about-hero').textContent.includes('Makers 3D Studio')`),`${width}px About hero no longer shows the two studio labels`);
  assert(data.closed.phase==='closed'&&data.closed.inert&&data.closed.items.every(i=>i.opacity===0&&i.visibility==='hidden'),`${width}px closed social logos are hidden and noninteractive`);
  if(!reduced){assert(data.closed.pulse==='heartbeat'&&data.closed.pulseDuration==='2s'&&data.closed.ring==='chat-contact-ping',`${width}px original heartbeat and ping pulse restored`);await waitFor(`new DOMMatrix(getComputedStyle(document.querySelector('.chat-toggle')).transform).m11>1.01`,2500);data.pulsing=await snapshot();}
  else assert(data.closed.pulse==='none'&&data.closed.ring==='none','reduced motion disables continuous blinking');
  await click();await phase('open');await evaluate(`new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve(true))))`);data.opening=await snapshot();
  if(!reduced)assert(data.opening.items[0].y>0&&data.opening.items[1].y>=0,`${width}px logos rise from message button with staggered entry`);
  await settled();data.open=await snapshot();
  assert(data.open.items.every(i=>i.opacity===1&&i.visibility==='visible'&&i.y===0&&i.svgCount===1)&&data.open.text===''&&data.open.optionsBackground==='rgba(0, 0, 0, 0)',`${width}px open logos stay clear with no labels, duplicate logos or panel`);
  assert(data.open.pulse==='none'&&data.open.ring==='none'&&Math.abs(data.open.root.centerX-data.closed.root.centerX)<.1&&Math.abs(data.open.root.centerY-data.closed.root.centerY)<.1&&!data.open.overflow,`${width}px cross stays in position and does not pulse while open`);
  if(!reduced)await screenshot(`social-buttons-animated-${width}`);
  await click();
  if(!reduced){await phase('closing');await pause(90);data.closing=await snapshot();assert(data.closing.items.every(i=>i.y>0&&i.opacity<1)&&data.closing.icon.startsWith('m6')&&data.closing.inert&&data.closing.pulse==='none',`${width}px logos slide down before cross changes to message`);}
  await phase('closed');await waitFor(`[...document.querySelectorAll('.chat-social-item')].every(el=>getComputedStyle(el).visibility==='hidden')`);data.finished=await snapshot();
  assert(data.finished.icon.startsWith('M21')&&(reduced?data.finished.pulse==='none':data.finished.pulse==='heartbeat'),`${width}px message returns and blinking resumes after exit`);
  if(!reduced){
   await click();await settled();await click();await phase('closing');await pause(70);await click();await phase('open');await settled();await pause(420);data.reopened=await snapshot();assert(data.reopened.phase==='open'&&data.reopened.items.every(i=>i.opacity===1),`${width}px quick reopen cancels pending close`);
   await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await phase('closed');assert(await evaluate(`document.activeElement===document.querySelector('.chat-toggle')`),`${width}px Escape closes smoothly and restores focus`);
  }
 }
 assert(report.errors.length===0,'browser recorded no runtime exceptions');report.passed=true;
}catch(error){report.failure=error.stack;console.error(error.stack);process.exitCode=1;}
finally{await writeFile('docs/social-buttons-motion-validation.json',JSON.stringify(report,null,2)+'\n');if(ws?.readyState===WebSocket.OPEN){try{await send('Browser.close');}catch{}ws.close();}if(browser.exitCode===null)browser.kill();}
