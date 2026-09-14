import path from 'node:path';
import {chromium} from 'playwright';
import {campaign,storage,loadJSON,atomicJSON,digest,writerLease} from './factory.mjs';
import {fingerprint} from './assembly.mjs';
import {serveFiles} from './review3d.mjs';

const indexPath=path.join(campaign,'goals/G02/candidate-index.json');
const output=path.join(campaign,'goals/G03/independent-performance.json');
export async function measureG03Performance(){
 const index=await loadJSON(indexPath),source=await fingerprint();
 if(index.sourceHashes?.[0]!==source||index.candidates.length<3)throw Error('Current candidate index required');
 const server=await serveFiles(storage),browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const results=[];try{for(const c of index.candidates){const page=await browser.newPage({viewport:{width:1100,height:780}});page.setDefaultTimeout(15000);const origin='http://127.0.0.1:'+server.address().port;await page.goto(`${origin}/${c.id}/index.html`);await page.waitForFunction(()=>!!window.render_game_to_text);await page.click('#start');await page.evaluate(()=>advanceTime(0));const sample=await page.evaluate(async()=>{const before=performance.now();for(let i=0;i<60;i++)await new Promise(requestAnimationFrame);const after=performance.now();return {render:window.__renderEvidence(),animationMs:after-before,memoryBytes:performance.memory?.usedJSHeapSize??null};});results.push({id:c.id,deviceProfile:'Chromium 1100x780 headless SwiftShader reference',viewport:{width:1100,height:780},...sample});await page.close();}}finally{await browser.close();server.close();}
 const report={version:1,goalId:'G03',status:'REFERENCE_ONLY',sourceHash:source,method:'Independent Chromium render and animation sample',deviceProfile:'Chromium 1100x780 headless SwiftShader reference',results,interpretation:'Reference software-rendering evidence only; target hardware performance remains OPEN.',created:Date.now()};const release=await writerLease('g03-performance');try{await atomicJSON(output,report);return {report,ref:{path:'campaigns/reliable-arcade-factory/goals/G03/independent-performance.json',sha256:digest(JSON.stringify(report,null,2)+'\n'),independent:true}};}finally{await release();}
}
