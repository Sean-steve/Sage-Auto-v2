import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const base=process.env.SAGE_BASE_URL||"http://127.0.0.1:4173";
const output=path.resolve("artifacts/audit-wave1/onboarding");
mkdirSync(output,{recursive:true});
const sizes=[["mobile360",360,760],["mobile390",390,844],["tablet768",768,1024],["laptop1024",1024,768],["desktop1440",1440,900]];
const pages=[
 ["Tour & setup","tour"],["Verify email","verify"],["Business setup","business"],
 ["Choose plan","plan"],["First-run setup","first-run"],["Sign in & recovery","recovery"]
];
const browser=await chromium.launch({headless:true});
const results=[],failures=[];
try{
 for(const [device,width,height] of sizes){
  const page=await browser.newPage({viewport:{width,height},reducedMotion:"reduce"});
  page.on("pageerror",error=>failures.push(device+" pageerror: "+error.message));
  for(const [screen,slug] of pages){
   try{
    await page.goto(base+"/#marketing/"+encodeURIComponent(screen),{waitUntil:"load",timeout:20000});
    await page.locator("[data-contract='CH-006']").waitFor({timeout:12000});
    if(!await page.locator(".sx2-onboard-disclaimer").isVisible())throw Error("Honest simulation disclaimer missing");
    const message=(await page.locator(".sx2-onboard-disclaimer").innerText());
    if(!message.includes("does not create a company"))throw Error("Mock-only claim lost");
    if(slug==="verify"){
     await page.locator("#d2-verification").fill("000000");
     await page.locator('[data-action="p3d2:verify-demo"]').click();
     if(await page.locator("#d2-verification").getAttribute("aria-invalid")!=="true")throw Error("Invalid demo code lacks inline accessible error");
     await page.locator('[data-action="p3d2:setup:resend"]').click();
    }
    if(slug==="recovery"){
     await page.locator('[data-action="p3d2:auth-recovery"]').click();
     if(!await page.getByText("No email was sent.",{exact:false}).isVisible())throw Error("Recovery still implies real link delivery");
    }
    const widths=await page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth}));
    if(widths.document>widths.viewport+3)throw Error("Whole-page horizontal overflow "+(widths.document-widths.viewport)+"px");
    const screenshot=slug+"-"+device+".png";
    await page.screenshot({path:path.join(output,screenshot),fullPage:true});
    results.push({screen,device,status:"PASS",screenshot});
   }catch(error){
    results.push({screen,device,status:"FAIL",reason:error.message});
    failures.push(slug+" "+device+": "+error.message);
   }
  }
  await page.close();
 }
}finally{
 await browser.close();
 writeFileSync(path.join(output,"results.json"),JSON.stringify({results,failures},null,2));
}
console.log("CH-006 browser checks: "+results.length+" routes, failures: "+failures.length);
if(failures.length){console.error(failures.join("\n"));process.exitCode=1}
