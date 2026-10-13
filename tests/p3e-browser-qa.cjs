"use strict";
/* P3-E optional browser QA. Run with: npm install --no-save playwright && node tests/p3e-browser-qa.cjs
 * The GitHub visual-review workflow starts the frontend and uploads actual screenshots.
 */
const {chromium}=require("playwright");
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const base=process.env.SAGE_PREVIEW_URL||"http://127.0.0.1:4173";
const folder=path.join(process.cwd(),"visual-artifacts");
fs.mkdirSync(folder,{recursive:true});
const entries=[
 {name:"company-command-centre",hash:"company/Overview",wait:".op-workspace"},
 {name:"company-queue",hash:"company/Today%27s%20operations",wait:".op-workboard"},
 {name:"fleet-showroom",hash:"company/Fleet",wait:".p-gallery"},
 {name:"booking-operations",hash:"company/Bookings",wait:".rx-bookings"},
 {name:"availability-board",hash:"company/Availability",wait:".rx-allocation-grid"},
 {name:"inspection-studio",hash:"company/Inspections",wait:".rx-condition-layout"},
 {name:"finance-workbench",hash:"company/Finance%20%26%20payments",wait:".rx-finance-overview"},
 {name:"pricing-lab",hash:"company/Pricing",wait:".rx-pricing-grid"},
 {name:"rental-returns",hash:"company/Returns%20%26%20charges",wait:".rx-return-list"},
 {name:"owner-settlements",hash:"company/Owner%20settlements",wait:".rx-owner-queue"},
 {name:"renter-garage",hash:"renter/Overview",wait:".sx-role-apricot"},
 {name:"owner-portfolio",hash:"owner/Overview",wait:".sx-role-lavender"},
 {name:"driver-cockpit",hash:"driver/Overview",wait:".sx-role-sky"},
 {name:"platform-network",hash:"platform/Overview",wait:".sx-role-purple"},
 {name:"corporate-mobility",hash:"corporate/Overview",wait:".sx-role-steel"},
 {name:"agent-partners",hash:"agent/Overview",wait:".sx-role-lime"},
 {name:"service-studio",hash:"service/Overview",wait:".sx-role-coral"},
 {name:"marketing-home",hash:"marketing/Home",wait:".sx-public-stage"},
 {name:"branded-showroom",hash:"branded/Explore%20vehicles",wait:".sx-public-stage"}
];
const sizes=[
 {name:"desktop",width:1440,height:900,names:["company-command-centre","company-queue","fleet-showroom","booking-operations","availability-board","inspection-studio","finance-workbench","pricing-lab","rental-returns","owner-settlements","renter-garage","marketing-home","branded-showroom"]},
 {name:"laptop",width:1024,height:768,names:["company-command-centre","platform-network","corporate-mobility","agent-partners","service-studio","fleet-showroom","availability-board","finance-workbench"]},
 {name:"tablet",width:768,height:1024,names:["company-command-centre","fleet-showroom","owner-portfolio","inspection-studio","booking-operations","owner-settlements"]},
 {name:"phone",width:390,height:844,names:["company-command-centre","fleet-showroom","availability-board","booking-operations","inspection-studio","finance-workbench","renter-garage","driver-cockpit","branded-showroom"]},
 {name:"small-phone",width:360,height:800,names:["company-command-centre","booking-operations","pricing-lab","rental-returns","renter-garage"]}
];
(async()=>{
 const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
 const failures=[],results=[];
 for(const size of sizes){
   for(const item of entries.filter(e=>size.names.includes(e.name))){
     const page=await browser.newPage({viewport:{width:size.width,height:size.height},reducedMotion:"reduce",deviceScaleFactor:1});
     const pageErrors=[];
     page.on("pageerror",e=>pageErrors.push(e.message));
     const name=size.name+"-"+item.name;
     try{
       await page.goto(base+"/#"+item.hash,{waitUntil:"domcontentloaded",timeout:30000});
       await page.locator(item.wait).waitFor({state:"visible",timeout:15000});
       await page.waitForTimeout(180);
       const measurements=await page.evaluate(()=>{
         const container=document.querySelector("#main-content")||document.body;
         return {viewport:innerWidth,pageWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,primary:container.getBoundingClientRect().width,heading:document.querySelector("h1")?.textContent?.trim().slice(0,85)||""};
       });
       assert.ok(measurements.pageWidth<=size.width+5,name+" has page-level horizontal overflow "+JSON.stringify(measurements));
       assert.ok(measurements.primary>100,name+" has unreadable primary viewport");
       assert.deepEqual(pageErrors,[],name+" has uncaught script exceptions");
       await page.screenshot({path:path.join(folder,name+".png"),fullPage:true,animations:"disabled"});
       results.push({name,...measurements});
     }catch(e){failures.push({name,error:String(e.message||e),pageErrors});}
     finally{await page.close()}
   }
 }
 await browser.close();
 fs.writeFileSync(path.join(folder,"qa-manifest.json"),JSON.stringify({date:new Date().toISOString(),results,failures},null,2));
 console.log("Captured "+results.length+" responsive UI screenshots. Errors: "+failures.length);
 if(failures.length){for(const f of failures)console.error(f.name,f.error);process.exitCode=1}
})().catch(e=>{console.error(e);process.exitCode=1});
