import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {chromium,devices} from '@playwright/test';
const browser=await chromium.launch(); const results=[];
try {
  for(const mobile of [false,true]) {
    const context=await browser.newContext(mobile?devices['Pixel 7']:{}); const page=await context.newPage();
    const response=await page.goto('http://127.0.0.1:3190'); assert.ok(!response.headers()['access-control-allow-origin']);
    const headers=(await page.request.get('http://127.0.0.1:3190/frame.html')).headers();
    assert.ok(headers['content-security-policy'].includes('connect-src blob:')); assert.ok(!headers['access-control-allow-origin']);
    for(const [name,code,state,output] of [
      ['wrong job discarded','import js\njs.eval(\'globalThis.postMessage=((original)=>m=>{original({...m,job:"old"});original(m)})(postMessage)\')\nprint("real")','completed','real\n'],
      ['invalid stream','import js\njs.eval(\'globalThis.postMessage=((original)=>m=>original({...m,stream:"html"}))(postMessage)\')\nprint(1)','protocol-error',undefined],
      ['recovery','print("fresh")','completed','fresh\n']
    ]) { const result=await page.evaluate(code=>window.spike.execute(code),code); assert.equal(result.state,state); if(output!==undefined) assert.equal(result.stdout,output); results.push({mobile,name,...result}); }
    assert.equal(await page.evaluate(()=>document.querySelectorAll('iframe').length),0); await context.close();
  }
} finally {await writeFile(new URL('./protocol-results.json',import.meta.url),JSON.stringify(results,null,2)+'\n'); await browser.close();}
console.log('Six desktop/mobile protocol/recovery checks and header assertions passed.');
