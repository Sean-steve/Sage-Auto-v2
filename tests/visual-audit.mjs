import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const output = path.resolve("artifacts/visual-audit");
fs.mkdirSync(output, { recursive: true });
const base = process.env.SAGE_BASE_URL || "http://127.0.0.1:4173";
const surfaces = [
 ["marketing","Home"],["platform","Overview"],["company","Overview"],["branded","Explore vehicles"],
 ["renter","Overview"],["owner","Overview"],["driver","Overview"],["corporate","Overview"],
 ["agent","Overview"],["service","Overview"],["marketplace","Discover"]
];
const gaps = {
 company:["Booking changes","Dispatch & assignments","Availability policy","Offers & promotions","Refund approvals","Invoice detail","Company launch checklist","Subscription status"],
 platform:["Tenant provisioning","Entitlement review","Subscription recovery","Integration health","Jobs & events","Platform incidents","Platform roles","Support access","Compliance policies","Platform notifications"],
 marketing:["Tour & setup","Verify email","Business setup","Choose plan","First-run setup","Sign in & recovery"],
 branded:["Checkout & review"]
};
const routes=[...surfaces,...Object.entries(gaps).flatMap(([p,pages])=>pages.map(name=>[p,name]))];
const sizes=[{name:"desktop",width:1440,height:900},{name:"mobile",width:390,height:844}];
const report={testedAt:new Date().toISOString(),base,routes:routes.length,viewports:sizes,results:[]};
const browser=await chromium.launch({headless:true});
try {
 for(const size of sizes) {
  const page=await browser.newPage({viewport:{width:size.width,height:size.height},deviceScaleFactor:1,reducedMotion:"reduce"});
  const errors=[];
  page.on("pageerror",err=>errors.push(err.message));
  for (const [surface,screen] of routes) {
   const slug=surface+"-"+screen.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
   const url=base+"/#"+surface+"/"+encodeURIComponent(screen);
   const before=errors.length;
   try {
    await page.goto(url,{waitUntil:"load",timeout:20000});
    await page.waitForSelector("main",{timeout:7000});
    await page.evaluate(()=>document.fonts?.ready);
    const metrics=await page.evaluate(()=>{
      const main=document.querySelector("main");
      const w=window.innerWidth,full=document.documentElement.scrollWidth;
      const h1=document.querySelector("main h1");
      return {main:Boolean(main),heading:h1?.innerText?.trim()||"",viewportWidth:w,documentWidth:full,overflowPx:Math.max(0,full-w),bodyHeight:document.body.scrollHeight,buttons:document.querySelectorAll("button").length};
    });
    const filename=size.name+"-"+slug+".png";
    await page.screenshot({path:path.join(output,filename),fullPage:false,animations:"disabled"});
    report.results.push({surface,screen,viewport:size.name,screenshot:filename,...metrics,errors:errors.slice(before)});
   } catch(err) {
    report.results.push({surface,screen,viewport:size.name,failed:String(err),errors:errors.slice(before)});
   }
  }
  await page.close();
 }
} finally {await browser.close();}
fs.writeFileSync(path.join(output,"results.json"),JSON.stringify(report,null,2));
const failures=report.results.filter(x=>x.failed||x.errors?.length||!x.main||x.overflowPx>3||!x.heading);
const summary={screens:routes.length,viewports:sizes.length,checks:report.results.length,failures:failures.length,details:failures.map(x=>({surface:x.surface,screen:x.screen,viewport:x.viewport,overflowPx:x.overflowPx,errors:x.errors,failed:x.failed,heading:x.heading}))};
fs.writeFileSync(path.join(output,"summary.json"),JSON.stringify(summary,null,2));
console.log("Visual audit:",JSON.stringify(summary,null,2));
if(failures.length)process.exitCode=1;
