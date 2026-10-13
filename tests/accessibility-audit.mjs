import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const base=process.env.SAGE_BASE_URL||"http://127.0.0.1:4173";
const pages=[
 ["marketing","Home"],["platform","Overview"],["company","Overview"],["branded","Explore vehicles"],
 ["renter","Overview"],["owner","Overview"],["driver","Overview"],["corporate","Overview"],
 ["agent","Overview"],["service","Overview"],["marketplace","Discover"],
 ["company","Booking changes"],["company","Refund approvals"],["platform","Subscription recovery"],
 ["marketing","Tour & setup"],["branded","Checkout & review"]
];
const out=path.resolve("artifacts/visual-audit");fs.mkdirSync(out,{recursive:true});
const summary={inspectedAt:new Date().toISOString(),pages:[],seriousOrCritical:0,moderateOrMinor:0,inspectionErrors:0};
const browser=await chromium.launch({headless:true});
try{
 for(const view of [{name:"desktop",width:1440,height:900},{name:"mobile",width:390,height:844}]){
  const context=await browser.newContext({viewport:{width:view.width,height:view.height},reducedMotion:"reduce"});
  const page=await context.newPage();
  for(const [portal,route] of pages){
   const url=base+"/#"+portal+"/"+encodeURIComponent(route);
   try{
    await page.goto(url,{waitUntil:"load",timeout:20000});
    await page.waitForSelector("main",{timeout:7000});
    const results=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa"]).analyze();
    const problems=results.violations.map(v=>({id:v.id,impact:v.impact,help:v.help,url:v.helpUrl,nodes:v.nodes.length,selectors:v.nodes.slice(0,3).flatMap(n=>n.target)}));
    summary.seriousOrCritical+=problems.filter(v=>v.impact==="serious"||v.impact==="critical").length;
    summary.moderateOrMinor+=problems.filter(v=>v.impact!=="serious"&&v.impact!=="critical").length;
    summary.pages.push({portal,route,viewport:view.name,passes:results.passes.length,violations:problems});
   }catch(e){summary.inspectionErrors++;summary.pages.push({portal,route,viewport:view.name,failed:String(e)})}
  }
  await context.close();
 }
}finally{await browser.close()}
fs.writeFileSync(path.join(out,"accessibility.json"),JSON.stringify(summary,null,2));
const grouped=new Map();
for(const inspected of summary.pages)for(const v of inspected.violations||[]){
 const prev=grouped.get(v.id)||{rule:v.id,impact:v.impact,pages:0,selectors:[]};
 prev.pages++;
 for(const selector of v.selectors||[])if(prev.selectors.length<4&&!prev.selectors.includes(selector))prev.selectors.push(selector);
 grouped.set(v.id,prev);
}
console.log("Axe actionable rules:",JSON.stringify([...grouped.values()].sort((a,b)=>b.pages-a.pages).slice(0,15)));
const failingNodes=new Map();
for(const page of summary.pages)for(const violation of page.violations||[]){
 for(const selector of violation.selectors||[]){
  const key=Array.isArray(selector)?selector.join(" > "):String(selector);
  failingNodes.set(key,(failingNodes.get(key)||0)+1);
 }
}
console.log("Axe common failing selectors:",JSON.stringify([...failingNodes].sort((a,b)=>b[1]-a[1]).slice(0,75)));

console.log("Axe audit:",summary.pages.length,"cases,",summary.seriousOrCritical,"serious/critical and",summary.moderateOrMinor,"other violations.");
const inspectionFailures=summary.pages.filter(p=>p.failed);
const causes=[...new Set(inspectionFailures.map(p=>p.failed))];
console.log("Axe inspection errors:",summary.inspectionErrors,"distinct causes:",JSON.stringify(causes.slice(0,6)));
if(summary.seriousOrCritical||summary.inspectionErrors)process.exitCode=1;
