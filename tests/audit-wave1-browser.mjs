import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
const base=process.env.SAGE_BASE_URL||"http://127.0.0.1:4173";
const output=path.resolve("artifacts/audit-wave1");
mkdirSync(output,{recursive:true});
const sizes=[
 {name:"mobile360",width:360,height:760},{name:"mobile390",width:390,height:844},
 {name:"tablet768",width:768,height:1024},{name:"laptop1024",width:1024,height:768},
 {name:"desktop1440",width:1440,height:900}
];
const errors=[],results=[];
const browser=await chromium.launch({headless:true});
try{
 for(const size of sizes){
  const page=await browser.newPage({viewport:{width:size.width,height:size.height},reducedMotion:"reduce"});
  page.on("pageerror",err=>errors.push(size.name+": "+err.message));
  for(const [portal,view] of [["platform","Revenue"],["company","Overview"]]){
   const route=portal+"/"+encodeURIComponent(view);
   try{
    await page.goto(base+"/#"+route,{waitUntil:"load",timeout:20000});
    await page.waitForSelector("main",{timeout:12000});
    await page.evaluate(()=>document.fonts.ready);
    if(portal==="platform"){
     await page.locator("#sx2-revenue-workspace").waitFor({timeout:12000});
     if(!(await page.locator("#sx2-revenue-workspace").innerText()).includes("Financial data boundary"))throw Error("Financial disclaimer missing");
     if(await page.locator("#sx2-revenue-plan").count()!==1)throw Error("Revenue filters missing");
     const options=await page.locator("#sx2-revenue-plan option").allTextContents();
     if(options.includes("Starter")){
      await page.locator("#sx2-revenue-plan").selectOption({label:"Starter"});
      if(!(await page.locator("#sx2-filter-summary").innerText()).includes("sample companies in scope"))throw Error("Filter summary missing");
      await page.locator("#sx2-reset-filters").click();
      if((await page.locator("#sx2-revenue-plan").inputValue())!=="All plans")throw Error("Reset filters failed");
     }
    } else {
      const mode=await page.evaluate(()=>document.body.classList.contains("ops-active"));
      if(!mode)throw Error("Company Work Mode not active");
    }
    const width=await page.evaluate(()=>({viewport:innerWidth,scroll:document.documentElement.scrollWidth}));
    if(width.scroll>width.viewport+3)throw Error("Document overflow of "+(width.scroll-width.viewport)+"px; scoped table scroll is allowed");
    const name=portal+"-"+view.toLowerCase()+"-"+size.name+".png";
    await page.screenshot({path:path.join(output,name),fullPage:true});
    results.push({portal,view,size:size.name,status:"PASS",screenshot:name,overflowPx:Math.max(0,width.scroll-width.viewport)});
   }catch(error){errors.push(route+" at "+size.name+": "+error.message);
    results.push({portal,view,size:size.name,status:"FAIL",error:error.message});}
  }
  await page.close();
 }
}finally{
 await browser.close();
 writeFileSync(path.join(output,"results.json"),JSON.stringify({source:"GitHub PR CI runner",results,errors},null,2));
}
console.log("Audit Wave1 browser routes:",results.length,"failures:",errors.length);
if(errors.length){console.error(errors.join("\n"));process.exitCode=1}
