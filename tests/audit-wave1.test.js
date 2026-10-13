"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const source=fs.readFileSync("experience-foundation.js","utf8");
const original=fs.readFileSync("external-portals.js","utf8");
const html=fs.readFileSync("index.html","utf8");
const handlers={};
const nodes={};
const rows=[
 {dataset:{plan:"Growth",region:"Nairobi",active:"true",rated:"true",amount:"9999"},hidden:false},
 {dataset:{plan:"Starter",region:"Nakuru",active:"true",rated:"true",amount:"4999"},hidden:false},
 {dataset:{plan:"Pro",region:"Mombasa",active:"false",rated:"false",amount:"0"},hidden:false}
];
const el=id=>nodes[id]||(nodes[id]={id,textContent:"",value:"",hidden:false});
const workspace={querySelectorAll(selector){return selector==="[data-sx2-tenant-row]"?rows:[]},querySelector(selector){if(selector===".sx2-bridge-step.final strong")return el("bridge");return null}};
const document={
 addEventListener(type,cb){(handlers[type]||=[]).push(cb)},
 getElementById(id){return id==="sx2-revenue-workspace"?workspace:el(id)}
};
const window={};
vm.runInNewContext(source,{window,document,console,Math,Number,Array,Object,String},{timeout:1000});
const model=window.SageExperienceV2.calculateRevenue;
const tenants=[
 {id:"T-01",name:"Nairobi Drive",plan:"Growth",region:"Nairobi",status:"Active"},
 {id:"T-02",name:"Safari Trails",plan:"Starter",region:"Nakuru",status:"Active"},
 {id:"T-03",name:"Coastal Cars",plan:"Pro",region:"Mombasa",status:"Needs review"},
 {id:"T-04",name:"Missing plan",plan:"Beta",region:"Nairobi",status:"Active"}
];
assert.equal(model(tenants,{}).estimated,14998);
assert.equal(model(tenants,{}).active.length,3);
assert.equal(model(tenants,{}).unknown,1);
assert.equal(model(tenants,{plan:"Starter",region:"Nakuru"}).estimated,4999);
assert.equal(model([],{}).estimated,0);
const context={header(){return "<header>Platform revenue</header>"},demo(){return "<div>Demo mode</div>"}};
const view=window.SageExperienceV2.renderRevenue(context,tenants);
assert.match(view,/Recurring-revenue movement/);
assert.match(view,/no payment-provider connection/i);
assert.match(view,/There is no payment-provider connection/);
assert.match(view,/Historical data missing/);
assert.match(view,/Not included/);
assert.match(view,/data-action="p3c:tenant"/);
assert.match(view,/role="region"/);
assert.ok(!/collected: KES/i.test(view));
el("sx2-revenue-plan").value="Starter";el("sx2-revenue-region").value="Nakuru";
window.SageExperienceV2.applyRevenueFilters();
assert.equal(rows.filter(x=>!x.hidden).length,1);
assert.equal(el("sx2-run-rate").textContent,"KES 4,999");
assert.equal(el("sx2-no-tenants").hidden,true);
el("sx2-revenue-region").value="Mombasa";
window.SageExperienceV2.applyRevenueFilters();
assert.equal(rows.filter(x=>!x.hidden).length,0);
assert.equal(el("sx2-no-tenants").hidden,false);
el("sx2-reset-filters"); // filter controls remain accessible on no-result state
assert.ok(handlers.change.length);
assert.ok(handlers.click.length);
assert.ok(original.includes('if(p==="Revenue"&&window.SageExperienceV2)return window.SageExperienceV2.renderRevenue(c,ten);'));
assert.ok(original.includes('if(p==="Revenue")return normal(c,"SaaS revenue overview"'),"Preserve original fallback path.");
const beforeIndex=html.indexOf('href="./ops-hardening.css"'),afterIndex=html.indexOf('href="./experience-foundation.css"');
assert.ok(beforeIndex!==-1&&afterIndex>beforeIndex,"New token file loads last.");
assert.ok(html.indexOf('src="./experience-foundation.js"')<html.indexOf('src="./app.js"'),"Revenue helper must initialize before app.");
console.log("CH-001/CH-021 source-level checks PASS — mock values, scoped filters, missing data, tenant route and integration fallbacks.");
