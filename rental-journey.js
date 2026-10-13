/* Sage Auto V2 — CH-003..CH-010 cross-screen, additive operational experience.
 * Existing company modules / drawers / state transitions remain authoritative.
 */
(function(global){
"use strict";
const core=global.SageRentalCoreV2;
if(!core)return;
const UI={vehicle:"All vehicles",date:"2026-10-15",days:2,assessment:null,lastCheck:null};
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[x]));
const money=(c,n)=>c.money(Number(n||0));
const btn=(label,action,id,primary=false)=>'<button type="button" class="rj-btn '+(primary?'primary':'')+'" data-action="journey:'+esc(action)+'"'+(id?' data-id="'+esc(id)+'"':'')+'>'+esc(label)+'</button>';
const badge=(text,kind)=>'<span class="rj-status '+(kind||"neutral")+'">'+esc(text)+'</span>';
const head=(code,title,sub)=>'<div class="rj-title"><div><span class="sx2-eyebrow">'+esc(code)+' · CONNECTED RENTAL DEMO</span><h2>'+esc(title)+'</h2><p>'+esc(sub)+'</p></div>'+badge("Browser-local · Not live","muted")+'</div>';
const panel=(title,description,body)=>'<section class="rj-panel"><div class="rj-panel-head"><h3>'+esc(title)+'</h3><p>'+esc(description)+'</p></div>'+body+'</section>';
const row=(label,value)=>'<div class="rj-detail"><span>'+esc(label)+'</span><strong>'+esc(value)+'</strong></div>';
const cars=c=>c.db.vehicles||[];
const namedVehicle=(c,b)=>cars(c).find(x=>x.id===b?.vehicle);
const quote=(c,b)=>core.receiptSummary(c.db,b);
const activeBookings=c=>(c.db.bookings||[]).filter(b=>["Active","Confirmed","Awaiting payment","Completed"].includes(b.status));
const nav=[
 ["Availability","Fleet dates"],
 ["Bookings","Reservations"],
 ["Booking changes","Amendments"],
 ["Contracts & handover","Handover"],
 ["Rentals","On rental"],
 ["Returns & charges","Returns"],
 ["Finance & payments","Money"],
 ["Owner settlements","Owner share"]
];
const supported=new Set(nav.map(x=>x[0]).concat(["Deposits & refunds","Invoice detail"]));
function journeyNav(c){
 return '<nav class="rj-journey-nav" aria-label="Connected rental workflow">'+nav.map(([page,name],i)=>
 '<button type="button" class="'+(page===c.state.page?'active':'')+'" aria-current="'+(page===c.state.page?'step':'false')+
 '" data-action="journey:goto:'+esc(page)+'"><span class="rj-num">'+(i+1)+'</span>'+esc(name)+'</button>').join("")+'</nav>';
}
function availabilityContent(c){
 const db=c.db,vehicles=cars(c);
 const days=Number(UI.days)||2,start=core.dateOnly(UI.date),end=core.plus(start,days);
 const picked=UI.vehicle==="All vehicles"?vehicles:vehicles.filter(v=>v.id===UI.vehicle);
 const options='<option value="All vehicles">All fleet vehicles</option>'+vehicles.map(v=>'<option value="'+esc(v.id)+'"'+(v.id===UI.vehicle?' selected':'')+'>'+esc(v.name)+' · '+esc(v.plate)+'</option>').join('');
 const controls='<div class="rj-filters"><label>Vehicle<select id="rj-vehicle" class="sx2-input">'+options+'</select></label>'+
 '<label>Pickup date<input class="sx2-input" id="rj-date" type="date" value="'+esc(UI.date)+'"></label>'+
 '<label>Days<select class="sx2-input" id="rj-days">'+[1,2,3,5,7,14].map(x=>'<option value="'+x+'"'+(x===days?' selected':'')+'>'+x+' day'+(x>1?'s':'')+'</option>').join('')+'</select></label>'+
 btn("Check selected dates","availabilityCheck",null,true)+btn("Add operational hold","existingHold")+'</div>';
 const matrix='<div class="rj-grid">'+picked.map(v=>{
  const outcome=core.availability(db,v.id,start,end);
  return '<article class="rj-slot '+(outcome.ok?'ok':'blocked')+'"><div><strong>'+esc(v.name)+'</strong><small>'+esc(v.plate)+' · '+esc(v.location)+'</small></div>'+
  '<div>'+badge(outcome.ok?"No demo conflict":outcome.code.replace(/-/g," "),outcome.ok?"success":"warning")+
  '<small>'+esc(outcome.message)+'</small></div>'+btn("Inspect dates","inspectSlot",v.id)+'</article>';
 }).join('')+'</div>';
 return head("CH-003","Availability decision board","Start with every vehicle and narrow down without losing the fleet context.")+
 panel("Vehicle eligibility · "+esc(start||"select dates")+" → "+esc(end||"return"),"Overlaps use the existing sample holds and bookings; dates are illustrative, never real-time availability.",controls+
 (picked.length?matrix:'<p class="rj-empty">No vehicles match your selection. Choose the full fleet.</p>')+
 '<div class="rj-notice">A green result is only a conflict check against sample browser records. The live availability and allocation service is not connected.</div>');
}
function bookingContent(c){
 const list=activeBookings(c).slice(0,12);
 return head("CH-004","Booking → contract continuity","Each reservation keeps its payment, agreement, possession and return states visible.")+
 panel("Reservation handoff","Move between booking details, finance and contract preparation without silently advancing a status.",
 '<div class="rj-grid">'+list.map(b=>{
  const v=namedVehicle(c,b),moneyData=quote(c,b);
  const next=b.status==="Awaiting payment"?"Record example receipt":b.status==="Confirmed"?"Review contract / handover":b.status==="Active"?"Open return workflow":"Review finance assessment";
  return '<article class="rj-slot"><div><strong>'+esc(b.customer)+'</strong><small>'+esc(b.id)+' · '+esc(v?.name||"Vehicle")+'</small></div>'+
  '<div>'+badge(b.status,b.status==="Completed"?"success":"neutral")+'<small>'+esc(moneyData.state)+' · '+money(c,moneyData.remaining)+' remaining in demo</small></div>'+
  btn(next,"nextBooking",b.id)+'</article>';
 }).join('')+'</div>'+(list.length?'':'<p class="rj-empty">No demo reservations available.</p>'));
}
function changesContent(c){
 const changes=(c.db.bookingChanges||[]).slice(0,8);
 return head("CH-004","Original vs proposed terms","Approvals in principle do not change vehicle allocations, prices or signed agreements.")+
 panel("Pending and reviewed amendments","Inspect the original record and proposed change before deciding.",
 changes.length?'<div class="rj-grid">'+changes.map(x=>{
  const b=(c.db.bookings||[]).find(z=>z.id===x.booking);
  return '<article class="rj-slot"><div><strong>'+esc(b?.customer||"Reservation")+'</strong><small>'+esc(x.booking)+' · '+esc(x.changeType)+'</small></div>'+
   '<div>'+badge(x.status||"Pending review","warning")+'<small>Original date '+esc(b?.date||"—")+' → requested '+esc(x.date||"—")+'</small></div>'+
   btn("Compare terms","compare",x.booking)+'</article>';
 }).join('')+'</div>':'<p class="rj-empty">No amendment requests recorded. Use the existing “New change request” action below.</p>');
}
function handoverContent(c){
 const confirmed=(c.db.bookings||[]).filter(b=>b.status==="Confirmed");
 return head("CH-007","Physical handover gate","Contract acknowledgment, 12 inspection categories, no unresolved defect and fleet eligibility are required.")+
 panel("Ready for review · "+confirmed.length+" confirmed","Completing all inspection sections with no defects is valid, but possession changes only on explicit handover.",
 '<div class="rj-grid">'+confirmed.map(b=>{const v=namedVehicle(c,b);
  const ok=Boolean(v&&v.compliant&&v.status!=="Maintenance");
  return '<article class="rj-slot"><div><strong>'+esc(b.customer)+'</strong><small>'+esc(b.id)+' · '+esc(v?.name)+'</small></div>'+
   '<div>'+badge(ok?"Ready for inspection":"Fleet readiness needs review",ok?"success":"warning")+
   '<small>Possession '+esc(b.handover?"handover recorded":"not transferred")+' · vehicle '+esc(v?.status||"unknown")+'</small></div>'+
   btn("Open 12-area checklist","existingHandover",b.id)+'</article>';
 }).join('')+'</div><div class="rj-notice">The existing handover form enforces each checklist acknowledgment, contract review, defect blocking and concurrent active-rental checks. This workbench does not bypass it.</div>');
}
function rentalsContent(c){
 const active=(c.db.bookings||[]).filter(b=>b.status==="Active");
 return head("CH-007 / CH-008","Vehicle possession ledger","A confirmed booking is not a rental. Only explicit handover places a vehicle with the renter.")+
 panel("In renter possession · "+active.length,"Only active bookings belong in rental operations.",
 '<div class="rj-grid">'+active.map(b=>'<article class="rj-slot"><div><strong>'+esc(namedVehicle(c,b)?.name||"Vehicle")+'</strong><small>'+esc(b.customer)+' · '+esc(b.id)+'</small></div>'+
 '<div>'+badge("Handover recorded · demo","success")+'<small>Rental '+esc(b.days)+' days · pickup '+esc(b.date)+'</small></div>'+
 btn("Open guided return","existingReturn",b.id)+'</article>').join('')+
 '</div>'+(active.length?'':'<p class="rj-empty">No active possessions. Return to contracts and complete a valid handover first.</p>'));
}
function returnsContent(c){
 const completed=(c.db.bookings||[]).filter(b=>b.status==="Completed");
 const active=(c.db.bookings||[]).filter(b=>b.status==="Active");
 return head("CH-008","Return ≠ financial closure","Confirm possession back first; charge review, invoice review, refund decisions and owner share remain separate.")+
 panel("Returns requiring attention","Physical possession is derived from booking state. Charge review is a separate auditable browser-local decision.",
 '<div class="rj-grid">'+active.map(b=>'<article class="rj-slot"><div><strong>'+esc(b.customer)+'</strong><small>'+esc(b.id)+' · '+esc(namedVehicle(c,b)?.name)+'</small></div><div>'+
 badge("Vehicle still with renter","warning")+'<small>Do not close finances before physical return.</small></div>'+
 btn("Record inspection & return","existingReturn",b.id)+'</article>').join('')+
 completed.map(b=>{const r=core.returnsState(c.db,b);
 return '<article class="rj-slot"><div><strong>'+esc(b.customer)+'</strong><small>'+esc(b.id)+' · extras '+money(c,r.assessedCharge)+'</small></div><div>'+
 badge(r.review,r.review==="Reviewed"?"success":r.review==="Disputed"?"warning":"neutral")+
 '<small>'+esc(r.finalFinance)+'</small></div>'+btn("Review charges","returnReview",b.id)+'</article>';
 }).join('')+'</div>'+(active.length+completed.length?'':'<p class="rj-empty">No returns recorded in this browser.</p>')+
 '<div class="rj-notice">Reviewing return charges never records a receipt, issues a refund, or marks an owner paid.</div>');
}
function financeContent(c){
 const bookings=(c.db.bookings||[]).slice(0,15);
 return head("CH-009","Payment allocation and invoice review","Keep assessed, recorded, reversed and outstanding amounts visible for each booking.")+
 panel("Booking-level financial assessments","Amounts reflect manual demo receipts and example charges. No real transaction or invoice has been issued.",
 '<div class="rj-grid">'+bookings.map(b=>{const s=quote(c,b),invoice=c.db.rentalJourney?.invoices?.[b.id]?.status||"Not reviewed";
 return '<article class="rj-slot"><div><strong>'+esc(b.customer)+'</strong><small>'+esc(b.id)+' · '+esc(b.status)+'</small></div><div>'+
 badge(s.remaining>0?"Unallocated "+money(c,s.remaining):"No remainder in demo",s.remaining>0?"warning":"success")+
 '<small>Assessed '+money(c,s.assessed)+' · receipts '+money(c,s.received)+' · reversals '+s.reversalCount+'</small>'+
 '<small>Invoice: '+esc(invoice)+' · '+esc(s.state)+'</small></div>'+btn("Inspect invoice","invoice",b.id)+'</article>';
 }).join('')+'</div><div class="rj-notice">Duplicate receipt references are rejected in this mock. Reversed items are excluded from the sum. A fully recorded demo amount is not a bank-confirmed payment.</div>');
}
function payoutContent(c){
 const payouts=(c.db.payouts||[]);
 return head("CH-010","Owner share and payout lifecycle","Estimated → approved → sent for simulation → simulated confirmation / failure. No bank transfer is performed.")+
 panel("Owner settlement queue","Agreement percentage and illustrative amounts are not a reconciled payable until deductions and source receipts are verified.",
 '<div class="rj-grid">'+payouts.map(p=>{const s=core.settlementView(c.db,p);
 return '<article class="rj-slot"><div><strong>'+esc(p.owner)+'</strong><small>'+esc(p.id)+' · '+esc(p.vehicle)+'</small></div><div>'+
 badge(s.stage,s.stage==="Transfer confirmed (demo)"?"success":s.stage==="Failed (demo)"?"warning":"neutral")+
 '<small>Sample recorded due '+money(c,p.amount)+' · owner share '+(s.share===null?"unknown":s.share+"%")+'</small>'+
 '<small>'+esc(s.message)+'</small></div>'+btn("Review settlement","settlement",p.id)+'</article>';
 }).join('')+'</div><div class="rj-notice">“Sent for simulation” and “Transfer confirmed (demo)” are local review examples only. No payout processor, transaction ID, confirmation callback or ledger reconciliation exists.</div>');
}
function supportedPage(c){return c&&c.state?.portal==="company"&&supported.has(c.state.page);}
function decorateCompany(c,original){
 if(!supportedPage(c))return original;
 core.initialize(c.db);
 const page=c.state.page;
 let details=page==="Availability"?availabilityContent(c):page==="Bookings"?bookingContent(c):
  page==="Booking changes"?changesContent(c):page==="Contracts & handover"?handoverContent(c):
  page==="Rentals"?rentalsContent(c):page==="Returns & charges"?returnsContent(c):
  page==="Finance & payments"||page==="Invoice detail"||page==="Deposits & refunds"?financeContent(c):
  page==="Owner settlements"?payoutContent(c):"";
 return '<section class="rj-workspace" aria-label="Connected rental workbench" data-journey="'+esc(page)+'">'+
 journeyNav(c)+'<div class="rj-context">'+details+'</div><details class="rj-existing" open><summary><span>Complete existing '+esc(page)+' tools and records</span><span class="rj-existing-hint">All prior forms, actions, filters and history retained ↓</span></summary><div class="rj-existing-content" tabindex="0" role="region" aria-label="Original operator forms and records; scroll horizontally to see all columns">'+original+'</div></details></section>';
}
function decorateExternal(c,html){
 if(!html||!["renter","owner"].includes(c.state.portal))return html;
 const db=c.db;core.initialize(db);
 if(c.state.portal==="renter"){
  const mine=(db.bookings||[]).filter(b=>b.customer===db.renterProfile?.name);
  const active=mine.filter(b=>b.status==="Active").length,back=mine.filter(b=>b.status==="Completed").length;
  return '<div class="rj-external-line" role="status"><strong>Rental state · demo</strong><span>'+active+' example vehicle(s) in your possession · '+back+' returned · payments and any refund remain separate review tasks.</span></div>'+html;
 }
 const name=(db.owners||[]).find(o=>o.name==="Mary Wambui")?.name;
 const mine=(db.payouts||[]).filter(p=>p.owner===name),reviewed=mine.filter(p=>db.rentalJourney.settlements[p.id]?.stage==="Transfer confirmed (demo)").length;
 return '<div class="rj-external-line" role="status"><strong>Owner settlements · demo</strong><span>'+mine.length+' example statement(s) · '+reviewed+' simulated confirmation(s). No actual funds transferred or payout evidenced.</span></div>'+html;
}
function decorateCheckout(c,html){
 if(c.state.portal!=="branded"||c.state.page!=="Checkout & review"||!html)return html;
 const q=c.db.checkout||{},d=core.checkoutDecision(c.db,q);
 const text='<aside class="rj-checkout-note" role="note"><h2>Before a booking can be confirmed</h2>'+
 '<p>1. Check real-time availability and vehicle compliance. 2. Verify driver and rental terms. 3. Complete operator confirmation. 4. Authorize and reconcile payment. 5. Sign contract before handover.</p>'+
 '<strong>'+esc(d.ok?"Sample vehicle eligible to request; no live reservation held.":"Sample conflict: "+d.message)+'</strong>'+
 '<p>Submitting this prototype checkout creates only an enquiry. It does not reserve a car or process M-Pesa/card payments.</p></aside>';
 return html.replace("</main>",text+"</main>");
}
function modal(c,title,body,actions){
 return '<div class="modal-backdrop" data-action="close-outside"><section class="drawer rj-drawer" role="dialog" aria-modal="true" aria-label="'+esc(title)+'"><div class="drawer-header">'+
 '<div><span class="sx2-eyebrow">CONNECTED JOURNEY · DEMO</span><h2>'+esc(title)+'</h2></div>'+
 '<button class="icon-button" aria-label="Close" data-action="journey:close">✕</button></div>'+
 '<div class="drawer-body">'+body+'</div><div class="drawer-footer">'+btn("Close","close")+(actions||"")+'</div></section></div>';
}
function drawer(c){
 if(!c.state.modal||!c.state.modal.startsWith("journey:"))return null;
 const [kind,...parts]=c.state.modal.slice(8).split(":"),id=parts.join(":");
 const b=(c.db.bookings||[]).find(x=>x.id===id);
 if(kind==="slot"||kind==="inspectSlot"){
  const v=cars(c).find(v=>v.id===id),start=core.dateOnly(UI.date),end=core.plus(start,Number(UI.days)||2);
  if(!v)return null;
  const check=core.availability(c.db,id,start,end),alt=core.alternatives(c.db,start,end,id);
  const body='<div class="rj-explain">'+badge(check.ok?"No example conflict":check.code.replace(/-/g," "),check.ok?"success":"warning")+
   '<p>'+esc(check.message)+'</p>'+row("Example period",start+" → "+end)+row("Vehicle",v.name+" · "+v.plate)+
   (check.ok?'<p>No booking was made. Use the existing booking form to make a demo reservation.</p>':
   '<h3>Available sample alternatives</h3>'+(alt.length?alt.map(x=>'<div class="rj-detail">'+esc(x.vehicle.name)+' · '+esc(x.vehicle.location)+'</div>').join(""):'<p>No alternative vehicle found for these example dates.</p>'))+'</div>';
  return modal(c,"Vehicle availability decision",body);
 }
 if(kind==="compare"){
  const change=(c.db.bookingChanges||[]).find(x=>x.booking===id&&x.status==="Pending review")||(c.db.bookingChanges||[]).find(x=>x.booking===id);
  if(!b||!change)return null;
  const outcome=core.requestChange(c.db,id,{date:change.date,days:change.days});
  return modal(c,"Review booking amendment",'<div class="rj-explain">'+row("Reservation",b.id+" · "+b.customer)+
   row("Original pickup",outcome.original.pickup||"Unknown")+row("Requested pickup",outcome.proposed.pickup||"Unknown")+
   row("Original duration",outcome.original.days+" days")+row("Requested duration",outcome.proposed.days+" days")+
   row("Original assessed amount",money(c,outcome.original.total))+row("Requested amount","Repricing required")+
   row("Requested change",change.changeType)+row("Review status",change.status)+
   badge("Contract unchanged","warning")+'<p>'+esc(outcome.state)+'</p>'+
   (outcome.availability.ok?"":'<p>'+esc(outcome.availability.message)+'</p>')+'</div>');
 }
 if(kind==="returnReview"){
  if(!b)return null;const status=core.returnsState(c.db,b),refund=core.refundDecision(c.db,b);
  return modal(c,"Return charges review",'<div class="rj-explain">'+row("Reservation",b.id+" · "+b.customer)+
   row("Physical possession",status.possession)+row("Additional assessed charges",money(c,status.assessedCharge))+
   row("Review status",status.review)+row("Demo deposits",money(c,refund.total))+
   row("Deposit decision",refund.state)+'<p>'+esc(refund.warning)+'</p>'+
   '<div class="rj-actions">'+btn("Confirm assessment · demo","reviewReturn:Reviewed",b.id,true)+
   btn("Dispute charges","reviewReturn:Disputed",b.id)+'</div></div>');
 }
 if(kind==="invoice"){
  if(!b)return null;const s=quote(c,b),r=core.returnsState(c.db,b);
  const review=c.db.rentalJourney?.invoices?.[b.id]?.status||"Not reviewed";
  return modal(c,"Invoice and allocations",'<div class="rj-explain">'+row("Booking",b.id+" · "+b.customer)+
   row("Rental base",money(c,b.total))+row("Return charges",money(c,b.returnCharge))+
   row("Total assessed",money(c,s.assessed))+row("Recorded receipts",money(c,s.received))+
   row("Unallocated balance",money(c,s.remaining))+row("Reversed / voided records",String(s.reversalCount))+
   row("Physical return",r.possession)+row("Charge review",r.review)+row("Invoice review",review)+
   '<p>'+esc(s.state)+' — no actual collection confirmed.</p>'+
   '<div class="rj-actions">'+btn("Review invoice assessment","reviewInvoice:Reviewed",b.id,true)+
   btn("Dispute invoice","reviewInvoice:Disputed",b.id)+btn("Open existing payment form","existingPayment",b.id)+'</div></div>');
 }
 if(kind==="settlement"){
  const p=(c.db.payouts||[]).find(x=>x.id===id);if(!p)return null;
  const r=core.settlementView(c.db,p);
  const state=r.stage;
  const next=state==="Pending"?btn("Approve review (demo)","payout:Approved (demo)",id,true):
   state==="Approved (demo)"?btn("Send for simulation","payout:Sent for simulation",id,true):
   state==="Sent for simulation"?btn("Confirm simulation","payout:Transfer confirmed (demo)",id,true)+btn("Mark simulated failure","payout:Failed (demo)",id):
   state==="Failed (demo)"?btn("Retry simulated send","payout:Sent for simulation",id):"";
  return modal(c,"Owner settlement waterfall",'<div class="rj-explain">'+row("Settlement",p.id)+
   row("Owner",p.owner)+row("Agreement share",r.share==null?"Unknown":r.share+"%")+
   row("Base value of linked sample bookings",money(c,r.eligible))+row("Illustrative owner share",r.ownerShare==null?"Cannot derive":money(c,r.ownerShare))+
   row("Recorded sample settlement amount",money(c,r.illustrativeAmount))+row("Process stage",state)+
   '<p>'+esc(r.message)+' No transfer or reconciliation result has been obtained from any payment system.</p>'+
   '<div class="rj-actions">'+next+'</div></div>');
 }
 return null;
}
function action(cmd,node,c){
 if(!cmd.startsWith("journey:"))return false;
 if(c.state?.portal!=="company"){c.showToast("This operator action is only available in the company demo workspace.");return true;}
 const raw=cmd.slice(8),id=node.getAttribute("data-id");
 if(raw.startsWith("goto:")){c.navigate("company",raw.slice(5));return true;}
 if(raw==="close"){c.state.modal=null;c.render();return true;}
 if(raw==="availabilityCheck"){const a=document.getElementById("rj-vehicle"),d=document.getElementById("rj-date"),n=document.getElementById("rj-days");
  UI.vehicle=a?.value||"All vehicles";UI.date=d?.value||UI.date;UI.days=Number(n?.value)||2;
  if(!core.dateOnly(UI.date)){c.showToast("Choose a valid start date.");return true;}
  c.render();return true;}
 if(raw==="inspectSlot"||raw==="compare"||raw==="returnReview"||raw==="invoice"||raw==="settlement"){
  c.state.modal="journey:"+raw+":"+id;c.render();return true;
 }
 if(raw==="existingHold"){c.state.modal="v2:hold:";c.render();return true;}
 if(raw==="existingHandover"){c.state.modal="v2:handover:"+id;c.render();return true;}
 if(raw==="existingReturn"){c.state.modal="v2:return:"+id;c.render();return true;}
 if(raw==="existingPayment"){c.state.modal="v2:payment:"+id;c.render();return true;}
 if(raw==="nextBooking"){
  const b=(c.db.bookings||[]).find(x=>x.id===id);
  if(!b)return true;
  c.navigate("company",b.status==="Awaiting payment"?"Finance & payments":
   b.status==="Confirmed"?"Contracts & handover":
   b.status==="Active"?"Returns & charges":"Finance & payments");return true;
 }
 if(raw.startsWith("reviewReturn:")){
  const res=core.reviewReturn(c.db,id,raw.slice("reviewReturn:".length));
  if(res.ok){c.save();c.state.modal=null;c.render();}c.showToast(res.message);return true;
 }
 if(raw.startsWith("reviewInvoice:")){
  const res=core.reviewInvoice(c.db,id,raw.slice("reviewInvoice:".length));
  if(res.ok){c.save();c.state.modal=null;c.render();}c.showToast(res.message);return true;
 }
 if(raw.startsWith("payout:")){
  const stage=raw.slice(7);
  const acknowledged=stage!=="Transfer confirmed (demo)"||(
   typeof confirm==="function"&&confirm("Only simulate this transfer outcome? No bank transfer occurred, and no actual payout can be confirmed."));
  if(!acknowledged)return true;
  const res=core.payoutNext(c.db,id,stage,{acknowledged});
  if(res.ok){c.save();c.state.modal=null;c.render();}c.showToast(res.message);return true;
 }
 return true;
}
function overrideLegacyPayout(c,p,ack){
 if(c.state?.portal!=="company"){c.showToast("Owner payout changes require the company operator workspace.");return true;}
 if(!ack){c.showToast("Acknowledge the simulated review first.");return true;}
 const res=core.payoutNext(c.db,p.id,"Approved (demo)");
 if(res.ok){c.save();c.state.modal=null;c.render();}c.showToast(res.message);
 return true;
}
function checkoutGuard(c,q){return core.checkoutDecision(c.db,q);}
if(typeof document!=="undefined"&&document.addEventListener){
 document.addEventListener("change",e=>{
  if(e.target?.id==="rj-vehicle")UI.vehicle=e.target.value;
  if(e.target?.id==="rj-date")UI.date=e.target.value;
  if(e.target?.id==="rj-days")UI.days=Number(e.target.value)||2;
 });
}
global.SageRentalJourneyV2={decorateCompany,decorateExternal,decorateCheckout,drawer,action,
 overrideLegacyPayout,checkoutGuard,ui:UI};
})(window);