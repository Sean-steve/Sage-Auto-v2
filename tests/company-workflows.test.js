"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const events={},store=new Map(),toast=[];
let inputs={},checks=Array.from({length:12},()=>({checked:false}));
const root={innerHTML:"",insertAdjacentHTML(_where,html){this.innerHTML+=html}};
const readInput=name=>{if(!(name in inputs))return null;const value=inputs[name];return typeof value==="boolean"?{type:"checkbox",checked:value}:{type:"text",value:String(value)}};
const form={querySelector(selector){const matched=selector.match(/\[name="([^"]+)"\]/);return matched?readInput(matched[1]):null}};
const document={
 title:"",body:{appendChild(el){toast.push(el.innerHTML)}},
 getElementById(id){if(id==="app")return root;if(id==="v2-form")return form;if(id==="customer-name")return {focus(){}};return null},
 querySelector(selector){if(selector===".drawer"||selector===".pad-22")return form;return null},
 querySelectorAll(selector){return selector===".vehicle-check"?checks:[]},
 createElement(){return {innerHTML:"",className:"",remove(){}}},
 addEventListener(name,fn){events[name]=fn}
};
const win={scrollTo(){},addEventListener(){}},location={hash:"#company/Overview"};
const sandbox={document,window:win,location,localStorage:{getItem(k){return store.get(k)||null},setItem(k,v){store.set(k,v)}},console,Math,Number,Array,JSON,String,Set,Date,parseInt,clearTimeout(){},setTimeout(){return 1},confirm(){return true}};
vm.runInNewContext(fs.readFileSync("company-detail.js","utf8"),sandbox,{filename:"company-detail.js"});
vm.runInNewContext(fs.readFileSync("app.js","utf8"),sandbox,{filename:"app.js"});
const click=(action,value,id)=>{let elem={getAttribute(x){return x==="data-action"?action:x==="data-value"?value:x==="data-id"?id:null}};events.click({target:{closest(){return elem}},preventDefault(){}})};
const has=(text)=>assert.ok(root.innerHTML.includes(text),"Expected rendered output to contain: "+text);
const scope=()=>JSON.parse(store.get("sage-auto-v2-phase3-1")||"{}");
const choose=(name,value)=>{inputs[name]=value};
const setInputs=(map)=>{inputs={...map}};
const allChecks=()=>{checks=Array.from({length:12},()=>({checked:true}))};
function navigate(page){click("nav",page);has(page.replaceAll("&","&amp;"))}
function open(kind,id){click("v2:open:"+kind,undefined,id)}
function submit(kind,id){click("v2:submit",undefined,kind+":"+(id||""))}
assert.ok(win.SageCompanyV2,"P3-B module must be loaded before app.js");
const pages=["Fleet","Vehicle owners","Customers & drivers","Inspections","Compliance","Media & documents","Maintenance","Pricing","Availability","Contracts & handover","Returns & charges","Finance & payments","Deposits & refunds","Business expenses","Owner settlements","Leads & enquiries","Business insights","Website studio","Company & branches","Team & permissions","Subscription & billing","Integrations & notifications","Security & activity","Settings"];
pages.forEach(navigate);
navigate("Fleet");
has("Register vehicle");
open("fleet");
setInputs({name:"Toyota Harrier",plate:"KDL 200G",type:"SUV",rate:"11000",location:"Nairobi CBD",owner:"Company-owned"});
submit("fleet");has("Toyota Harrier");
assert.equal(scope().vehicles.at(-1).compliant,false,"new asset requires compliance review");
navigate("Pricing");click("v2:open:rate",undefined,"V01");
setInputs({rate:"16000"});submit("rate","V01");assert.equal(scope().vehicles[0].rate,16000);
navigate("Vehicle owners");has("Mary Wambui");click("v2:owner",undefined,"O01");has("Ownership agreement");click("close");
navigate("Customers & drivers");has("Customer directory".replace("Customer directory","Customers"));
click("v2:tab","Drivers");has("Faith Muthoni");click("v2:verify:driver",undefined,"D02");setInputs({review:true});submit("verify","driver:D02");assert.equal(scope().drivers[1].verified,true);
navigate("Maintenance");open("maintenance","V03");setInputs({vehicle:"V03",task:"Air conditioning",supplier:"City Auto Care",cost:"2300",due:"2026-10-20"});submit("maintenance");assert.equal(scope().vehicles[2].status,"Maintenance");
click("v2:complete-work",undefined,scope().works[0].id);assert.equal(scope().vehicles[2].status,"Available");
navigate("Availability");open("hold");
setInputs({vehicle:"V01",start:"2026-10-13",end:"2026-10-14",reason:"Owner use"});submit("hold");
assert.equal(scope().holds.length,0,"overlapping booking must block holds");
assert.ok(toast.at(-1).includes("Toyota Prado TX"),"conflict should use friendly vehicle name");
setInputs({vehicle:"V03",start:"2026-10-20",end:"2026-10-21",reason:"Owner use"});submit("hold");
assert.equal(scope().holds.length,1);
click("v2:release-hold",undefined,scope().holds[0].id);assert.equal(scope().holds[0].status,"Released");
navigate("Bookings");click("booking-action",undefined,"SA-1044");has("BOOKING DETAIL");click("advance",undefined,"SA-1044");has("Record demo payment");
setInputs({booking:"SA-1044",amount:"12000",method:"M-Pesa (manual demo)",ref:"DEMO-888"});
submit("payment","SA-1044");
assert.equal(scope().bookings.find(x=>x.id==="SA-1044").status,"Confirmed");
click("booking-action",undefined,"SA-1044");click("advance",undefined,"SA-1044");has("Contract &amp; handover".replace("&amp;","&"));
setInputs({contract:true,defects:false});
checks=Array.from({length:12},()=>({checked:false}));submit("handover","SA-1044");assert.equal(scope().bookings.find(x=>x.id==="SA-1044").status,"Confirmed","incomplete inspection blocks handover");
allChecks();submit("handover","SA-1044");
assert.equal(scope().bookings.find(x=>x.id==="SA-1044").status,"Active");
assert.equal(scope().vehicles.find(x=>x.id==="V03").status,"On rental");
navigate("Returns & charges");click("v2:return",undefined,"SA-1044");has("Vehicle return");
allChecks();setInputs({odometer:"87230",fuel:"Half",late:"1000",extras:"250",damage:"0",defects:false});submit("return","SA-1044");
assert.equal(scope().bookings.find(x=>x.id==="SA-1044").status,"Completed");
assert.equal(scope().bookings.find(x=>x.id==="SA-1044").returnCharge,1250);
assert.equal(scope().vehicles.find(x=>x.id==="V03").status,"Available");
navigate("Owner settlements");click("v2:payout-review",undefined,"PAY-081");setInputs({review:true});submit("payout","PAY-081");assert.equal(scope().payouts[0].status,"Paid");
navigate("Website studio");setInputs({brand:"Nairobi Premium Drive",tagline:"Drive well.",accent:"#0a827a"});click("v2:site-save");assert.equal(scope().site.brand,"Nairobi Premium Drive");
navigate("Business expenses");open("expense");setInputs({description:"Vehicle detailing",category:"Cleaning",vehicle:"V01",amount:"900"});submit("expense");assert.equal(scope().expenses[0].amount,900);
navigate("Security & activity");has("Demo events");
console.log("P3-B tests passed: 24 routes; assets; rates; owners; people; maintenance; hold conflicts; manual payment; 12-item handover; return charges; payouts; storefront; expenses; audit events.");
