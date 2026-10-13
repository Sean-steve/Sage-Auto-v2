"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const source=fs.readFileSync("onboarding-continuity.js","utf8");
const gap=fs.readFileSync("gap-closure.js","utf8");
const html=fs.readFileSync("index.html","utf8");
const listeners={};const elements={};
function elem(name,value){return {
 name,value,flags:{},focused:false,setAttribute(k,v){this.flags[k]=v},
 removeAttribute(k){delete this.flags[k]},focus(){this.focused=true},
 closest(){return null},matches(){return false}
}}
const document={addEventListener(n,cb){listeners[n]=cb},getElementById(k){return elements[k]||null}};
const window={};
let confirmed=true;const callbacks={};
vm.runInNewContext(source,{document,window,confirm(){return confirmed}}, {timeout:2000});
const control=window.SageOnboardingContinuity;
assert.ok(control);
const u={email:"demo@example.test",accountCreated:true,emailVerified:false,company:"",contact:"",plan:"Growth",planSelected:false};
const ctx={db:{signup:u},navigate(p,page){callbacks.route=[p,page]},render(){callbacks.render=true},save(){callbacks.saved=true},showToast(s){callbacks.toast=s}};
assert.equal(control.resume(u),"Verify email");
assert.equal(control.resume({...u,emailVerified:true}),"Business setup");
assert.equal(control.resume({...u,emailVerified:true,company:"Example",contact:"Demo"}),"Choose plan");
assert.equal(control.resume({...u,emailVerified:true,company:"Example",contact:"Demo",planSelected:true}),"First-run setup");
assert.match(control.decorate(ctx,"Verify email","<div>existing screen</div>"),/No email or code is actually delivered/);
assert.match(control.decorate(ctx,"Choose plan","<div>existing screen</div>"),/Back to company details/);
assert.match(control.decorate(ctx,"Sign in & recovery","<div>existing screen</div>"),/Simulation only/);
assert.equal(control.action("p3d2:setup:resume",{},ctx),true);
assert.deepEqual(callbacks.route,["marketing","Verify email"]);
assert.equal(control.action("p3d2:setup:resend",{},ctx),true);
assert.match(callbacks.toast,/No message has been sent/);
const badCode=elem("verification","111111");elements["d2-verification"]=badCode;
assert.equal(control.action("p3d2:verify-demo",{},ctx),true);
assert.equal(badCode.flags["aria-invalid"],"true");
assert.equal(badCode.focused,true);
badCode.value="123456";
assert.equal(control.action("p3d2:verify-demo",{},ctx),false,"Allow legacy verification to persist demo state");
const badCompany=elem("company",""),contact=elem("contact","Demo");
elements["d2-company"]=badCompany;elements["d2-contact"]=contact;
assert.equal(control.action("p3d2:save-business",{},ctx),true);
assert.equal(badCompany.flags["aria-invalid"],"true");
badCompany.value="Demo Ltd";
assert.equal(control.action("p3d2:save-business",{},ctx),false,"Allow legacy save-business handler");
assert.equal(control.action("p3d2:auth-recovery",{},ctx),true);
assert.match(control.decorate(ctx,"Sign in & recovery","<div>existing screen</div>"),/No email was sent/);
confirmed=false;
assert.equal(control.action("p3d2:setup:reset",{},ctx),true);
assert.equal(ctx.db.signup.email,"demo@example.test","Cancel reset must preserve state");
confirmed=true;
assert.equal(control.action("p3d2:setup:reset",{},ctx),true);
assert.equal(ctx.db.signup.accountCreated,false);
assert.equal(ctx.db.signup.planSelected,false);
assert.equal(callbacks.saved,true);
assert.ok(gap.includes('window.SageOnboardingContinuity.decorate(c,p,body)'));
assert.ok(gap.includes('window.SageOnboardingContinuity.action(action,node,c)'));
assert.ok(html.includes('src="./onboarding-continuity.js"'));
console.log("CH-006 onboarding tests passed: interrupted steps, plan selection, invalid code, inline errors, loss/recovery, reset and original handler delegation.");
