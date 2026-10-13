import {chromium} from "playwright";
import {mkdirSync,writeFileSync} from "node:fs";
import path from "node:path";
const base=process.env.SAGE_BASE_URL||"http://127.0.0.1:4173";
const output=path.resolve("artifacts/audit-wave3");
mkdirSync(output,{recursive:true});
const viewports=[["mobile",390,844],["tablet",768,1024],["desktop",1440,900]];
const paths=[
 ["Availability","CH-003"],["Bookings","CH-004"],["Booking changes","CH-004"],
 ["Contracts & handover","CH-007"],["Rentals","CH-007"],
 ["Returns & charges","CH-008"],["Finance & payments","CH-009"],
 ["Owner settlements","CH-010"],["Deposits & refunds","CH-009"]
];
const results=[],failures=[];
const browser=await chromium.launch({headless:true});
try{
 for(const [device,width,height] of viewports){
  const page=await browser.newPage({viewport:{width,height},reducedMotion:"reduce"});
  const errors=[];page.on("pageerror",err=>errors.push(err.message));
  for(const [screen,contract] of paths){
   const url=base+"/#company/"+encodeURIComponent(screen);
   try{
    await page.goto(url,{waitUntil:"load",timeout:20000});
    await page.locator(".rj-workspace").waitFor({timeout:9000});
    const section=page.locator(".rj-context");
    if(!await section.isVisible())throw Error("Rental context missing");
    if(!await page.locator(".rj-existing").count())throw Error("Legacy controls removed");
    if(!await page.getByText("All prior forms, actions, filters and history retained").count())throw Error("Legacy control disclosure missing");
    if(await page.locator(".rj-journey-nav button").count()!==8)throw Error("Journey routing lost");
    const wc=await page.evaluate(()=>({width:window.innerWidth,body:document.documentElement.scrollWidth}));
    if(wc.body>wc.width+4)throw Error("Document horizontal overflow: "+(wc.body-wc.width)+"px");
    if(screen==="Availability"){
     await page.locator("#rj-vehicle").selectOption("All vehicles");
     await page.locator("#rj-date").fill("2026-10-16");
     await page.locator("#rj-days").selectOption("2");
     await page.locator('[data-action="journey:availabilityCheck"]').click();
     if(!await page.getByText("No demo conflict",{exact:false}).count() &&
        !await page.getByText("reserved during those dates",{exact:false}).count())
       throw Error("Availability decision not recalculated");
     const first=page.locator('[data-action="journey:inspectSlot"]').first();
     await first.click();
     if(!await page.locator(".rj-drawer").isVisible())throw Error("Hold/availability decision drawer missing");
     if(!await page.getByText("not live availability",{exact:false}).count())throw Error("Missing live-availability disclaimer");
     await page.locator('.rj-drawer [data-action="journey:close"]').click();
    }
    if(screen==="Contracts & handover"){
     const count=await page.locator('[data-action="journey:existingHandover"]').count();
     if(count){await page.locator('[data-action="journey:existingHandover"]').first().click();
       if(!await page.locator(".vehicle-check").count())throw Error("12-section checklist lost");
       if((await page.locator(".vehicle-check").count())<10)throw Error("Incomplete handover checklist");
       await page.locator("[data-action='close']").first().click().catch(()=>{});
     }
    }
    if(screen==="Finance & payments"){
     await page.locator('[data-action="journey:invoice"]').first().click();
     const modal=page.locator(".rj-drawer");
     await modal.waitFor();
     const text=await modal.innerText();
     if(!text.includes("Recorded receipts")||!text.includes("Unallocated balance"))throw Error("Receipt allocation context missing");
     await modal.locator('[data-action="journey:close"]').click();
    }
    if(screen==="Owner settlements"){
     await page.locator('[data-action="journey:settlement"]').first().click();
     if(!await page.getByText("No transfer or reconciliation result",{exact:false}).count())throw Error("Unverified transfer disclaimer absent");
     await page.locator('.rj-drawer [data-action="journey:close"]').click();
    }
    const shot=screen.toLowerCase().replace(/[^a-z0-9]+/g,"-")+"-"+device+".png";
    await page.screenshot({path:path.join(output,shot),fullPage:true});
    results.push({device,screen,contract,status:"PASS",screenshot:shot});
   }catch(err){
    failures.push(contract+" "+screen+" "+device+": "+err.message);
    results.push({device,screen,contract,status:"FAIL",reason:err.message});
   }
  }
  for(const [portal,screen,expected] of [["branded","Checkout & review","Before a booking can be confirmed"],
                                         ["renter","Overview","Rental state"],
                                         ["owner","Overview","Owner settlements"]]){
   try{
    await page.goto(base+"/#"+portal+"/"+encodeURIComponent(screen),{waitUntil:"load",timeout:20000});
    await page.waitForSelector("main",{timeout:8000});
    if(!await page.getByText(expected,{exact:false}).count())throw Error("Connected persona context missing");
    const shot=portal+"-"+device+".png";
    await page.screenshot({path:path.join(output,shot),fullPage:true});
    results.push({portal,device,status:"PASS",screenshot:shot});
   }catch(err){
    failures.push(portal+" "+device+": "+err.message);
    results.push({portal,device,status:"FAIL",reason:err.message});
   }
  }
  for(const text of errors)failures.push(device+" javascript: "+text);
  await page.close();
 }
}finally{
 await browser.close();
 writeFileSync(path.join(output,"results.json"),JSON.stringify({results,failures},null,2));
}
console.log("CH-003..010 browser checks:",results.length,"cases, failures:",failures.length);
if(failures.length){console.error(failures.join("\n"));process.exitCode=1;}
