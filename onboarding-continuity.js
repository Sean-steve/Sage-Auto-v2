/* Sage Auto — CH-006 | browser-local onboarding continuity, not authentication. */
(function(root){
 "use strict";
 var recoveryPreview=false;
 function escape(v){return String(v==null?"":v).replace(/[&<>"']/g,function(x){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[x]})}
 var pages=["Tour & setup","Verify email","Business setup","Choose plan","First-run setup"];
 var labels=["Account","Email example","Company profile","Sample plan","Review setup"];
 function complete(s){
  return [Boolean(s.accountCreated),Boolean(s.accountCreated&&s.emailVerified),Boolean(s.company&&s.contact),Boolean(s.accountCreated&&s.emailVerified&&s.company&&s.plan&&s.planSelected),false];
 }
 function resume(s){
  if(!s.accountCreated)return "Tour & setup";
  if(!s.emailVerified)return "Verify email";
  if(!s.company||!s.contact)return "Business setup";
  if(!s.plan||!s.planSelected)return "Choose plan";
  return "First-run setup";
 }
 function stepPage(title){return pages.indexOf(title)>=0;}
 function previewBanner(){
  return '<aside class="sx2-note warning sx2-onboard-disclaimer" role="note"><strong>Simulation only.</strong> This experience does not create a company, send verification or recovery emails, authenticate a user, collect payment, or activate a plan. Do not enter real passwords or personal credentials.</aside>';
 }
 function pill(label,ok){return '<span class="sx2-journey-pill '+(ok?"done":"")+'">'+(ok?"✓ ":"◦ ")+escape(label)+'</span>'}
 function control(action,label,primary){
  return '<button type="button" class="sx2-action '+(primary?"":"secondary")+'" data-action="p3d2:setup:'+action+'">'+escape(label)+'</button>';
 }
 function decorate(ctx,page,html){
  if(!ctx||!ctx.db)return html;
  var signup=ctx.db.signup||{},done=complete(signup),step=pages.indexOf(page);
  var chips=labels.map(function(label,index){return pill(label,done[index])}).join("");
  var progress=done.slice(0,4).filter(Boolean).length;
  var lastPage=resume(signup);
  var intro='<section class="sx2-onboard-status" aria-label="Illustrative signup progress"><div><span class="sx2-eyebrow">ONBOARDING PATH · BROWSER-LOCAL DEMO</span>'+
   '<h2 class="sx2-section-title">Setup continuity</h2><p class="sx2-muted">Progress is stored on this device only. Returning here does not mean you have a real Sage Auto account.</p></div>'+
   '<div class="sx2-journey-chips">'+chips+'</div><div class="sx2-journey-controls">'+
   '<span class="sx2-source">'+progress+' of 4 example preparation steps saved</span>'+
   control("resume","Continue sample setup",true)+
   control("reset","Reset only this demo setup",false)+'</div></section>';
  var extra="";
  if(page==="Verify email"){
   extra='<section class="sx2-helper-card" aria-label="Verification help"><h3 class="sx2-section-title">Can’t access the sample code?</h3>'+
    '<p class="sx2-muted">No email or code is actually delivered. The example verification code is <strong>123456</strong>; it is not an OTP.</p>'+
    '<div class="sx2-helper-actions">'+control("resend","Show example code",false)+
    '<button type="button" class="sx2-action secondary" data-action="p3d2:page:Tour & setup">Edit demo account</button></div></section>';
  }else if(page==="Choose plan"){
   extra='<section class="sx2-helper-card" aria-label="Plan selection guidance"><h3 class="sx2-section-title">Compare, then return when ready</h3>'+
    '<p class="sx2-muted">Sample plan: <strong>'+escape(signup.plan||"None")+'</strong>. This is a preference only; billing and entitlement enforcement are not connected.</p>'+
    '<div class="sx2-helper-actions"><button type="button" class="sx2-action secondary" data-action="p3d2:page:Business setup">← Back to company details</button>'+
    control("resume","Resume from saved details",false)+'</div></section>';
  }else if(page==="Sign in & recovery"){
   intro="";
   extra='<section class="sx2-helper-card" aria-label="Account recovery demonstration"><h3 class="sx2-section-title">Password recovery preview</h3>'+
    (recoveryPreview?'<div class="sx2-note" role="status"><strong>No email was sent.</strong> In a connected product, this would request a one-time recovery link and confirm delivery without exposing whether an account exists. Here it is only a design preview.</div>':
    '<p class="sx2-muted">Choose “Preview recovery” above to view a safe example of the recovery state. There is no authentication service.</p>')+
    '<div class="sx2-helper-actions">'+control("resume","Return to saved setup",false)+'</div></section>';
  }else if(page==="Business setup"){
   extra='<div class="sx2-helper-actions">'+
    '<button type="button" class="sx2-action secondary" data-action="p3d2:page:Verify email">← Back to example verification</button></div>';
  }else if(page==="First-run setup"){
   extra='<div class="sx2-helper-actions"><button type="button" class="sx2-action secondary" data-action="p3d2:page:Choose plan">← Revisit sample plan</button></div>';
  }else if(page==="Tour & setup"&&signup.accountCreated){
   extra='<div class="sx2-note" role="status">A previously started sample setup was found on this browser. '+control("resume","Continue at "+lastPage,true)+'</div>';
  }
  return '<div class="sx2-onboarding" data-contract="CH-006">'+previewBanner()+intro+html+extra+'</div>';
 }
 function errorField(input,message){
  if(!input)return;
  input.setAttribute("aria-invalid","true");
  var container=input.closest(".field")||input.parentElement;
  if(container){
   var p=container.querySelector("[data-sx2-error]");
   if(!p){p=document.createElement("p");p.setAttribute("data-sx2-error","true");p.setAttribute("role","alert");p.className="sx2-error-message";container.appendChild(p)}
   p.textContent=message;
   if(!p.id)p.id="sx2-error-"+input.name;
   input.setAttribute("aria-describedby",p.id);
  }
  input.focus();
 }
 function field(name){return typeof document==="undefined"?null:document.getElementById("d2-"+name)}
 function action(act,node,ctx){
  if(!act.startsWith("p3d2:"))return false;
  var signup=ctx.db&&ctx.db.signup||{};
  if(act==="p3d2:setup:resume"){ctx.navigate("marketing",resume(signup));return true;}
  if(act==="p3d2:setup:resend"){ctx.showToast("Sample code: 123456. No message has been sent.");return true;}
  if(act==="p3d2:setup:reset"){
   if(typeof confirm==="function"&&!confirm("Reset only the browser-local sample signup? Other demo workspaces will be preserved."))return true;
   ctx.db.signup={email:"",company:"",contact:"",region:"Nairobi",plan:"Growth",planSelected:false,step:1,emailVerified:false,accountCreated:false};
   ctx.save();recoveryPreview=false;ctx.navigate("marketing","Tour & setup");
   ctx.showToast("Sample signup reset. No real account was affected.");return true;
  }
  if(act==="p3d2:auth-recovery"){
   recoveryPreview=true;ctx.render();ctx.showToast("Recovery example displayed. No email or link sent.");return true;
  }
  if(act==="p3d2:auth-preview"){
   ctx.showToast("Sign-in is a preview only. No credentials verified.");return true;
  }
  if(act==="p3d2:verify-demo"){
   var code=field("verification");
   if(!code||code.value.trim()!=="123456"){errorField(code,"Use the clearly displayed sample code 123456; no email was delivered.");return true;}
   if(!signup.accountCreated){ctx.showToast("Save a demo account first, then continue verification.");ctx.navigate("marketing","Tour & setup");return true;}
   return false; // existing demo verification handler saves progression.
  }
  if(act==="p3d2:save-business"){
   var c=field("company"),t=field("contact");
   if(!c||!c.value.trim()){errorField(c,"Add a sample business name before continuing.");return true;}
   if(!t||!t.value.trim()){errorField(t,"Add a sample contact detail before continuing.");return true;}
   return false; // retain existing company state transition and storage.
  }
  return false;
 }
 if(typeof document!=="undefined"&&document.addEventListener){
  document.addEventListener("input",function(event){
   var field=event.target;if(!field||!field.matches||!field.matches('[aria-invalid="true"]'))return;
   field.removeAttribute("aria-invalid");
   var msg=field.closest(".field")?.querySelector("[data-sx2-error]");
   if(msg)msg.remove();
   field.removeAttribute("aria-describedby");
  });
 }
 root.SageOnboardingContinuity={decorate:decorate,action:action,resume:resume,complete:complete};
})(window);
