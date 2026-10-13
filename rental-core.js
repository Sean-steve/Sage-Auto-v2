/* Sage Auto V2 — CH-003..010: pure, browser-local rental journey rules.
 * No network requests; no real availability, payment authorization, identity,
 * fiscal invoice, settlement, or transfer takes place.
 */
(function(global){
"use strict";
const DAY=86400000;
const asNumber=n=>Number.isFinite(Number(n))?Number(n):0;
const normalize=s=>String(s==null?"":s).trim().toLowerCase();
const dateOnly=s=>{
 if(typeof s==="number"){const v=new Date(s);return Number.isNaN(v.getTime())?null:v.toISOString().slice(0,10);}
 if(!s)return null;
 const iso=String(s).match(/^(\d{4}-\d{2}-\d{2})/);
 if(iso){const ms=Date.parse(iso[1]+"T00:00:00Z");return Number.isFinite(ms)&&new Date(ms).toISOString().slice(0,10)===iso[1]?iso[1]:null;}
 const named=String(s).match(/(\d{1,2})\s+([A-Za-z]{3})(?:\s+(\d{4}))?/);
 if(!named)return null;
 const mon="jan feb mar apr may jun jul aug sep oct nov dec".split(" ").indexOf(named[2].toLowerCase());
 if(mon<0)return null;return new Date(Date.UTC(Number(named[3]||2026),mon,Number(named[1]))).toISOString().slice(0,10);
};
const stamp=s=>s?Date.parse(s+"T00:00:00Z"):NaN;
const plus=(s,n)=>{const t=stamp(dateOnly(s));return Number.isFinite(t)?new Date(t+n*DAY).toISOString().slice(0,10):null};
const overlap=(a,b,c,d)=>[a,b,c,d].every(Boolean)&&stamp(a)<stamp(d)&&stamp(c)<stamp(b);
function bookingInterval(b){
 const start=dateOnly(b&&((b.pickup)||b.date));const days=asNumber(b?.days);
 return start&&days>0?{start,end:plus(start,days)}:null;
}
function holdInterval(h){
 const start=dateOnly(h?.start),end=dateOnly(h?.end);
 return start&&end?{start,end:plus(end,1)}:null;
}
function availability(db,vehicleId,startDate,endDate,ignoreBookingId){
 const v=(db.vehicles||[]).find(x=>String(x.id)===String(vehicleId));
 const start=dateOnly(startDate),end=dateOnly(endDate);
 if(!v)return{ok:false,code:"missing-vehicle",message:"Select an existing fleet vehicle."};
 if(!start||!end||stamp(end)<=stamp(start))return{ok:false,code:"bad-dates",message:"Choose a valid pickup and return period."};
 if(v.status==="Maintenance"||v.status==="Out of service"||v.compliant===false)
   return{ok:false,code:"vehicle-blocked",message:v.name+" is unavailable for rental until readiness is reviewed."};
 const hold=(db.holds||[]).find(h=>String(h.vehicle)===String(v.id)&&normalize(h.status)==="active"&&
   (()=>{const it=holdInterval(h);return it&&overlap(start,end,it.start,it.end)})());
 if(hold)return{ok:false,code:"operational-hold",message:v.name+" has an operational hold during those dates.",source:"Hold",label:hold.reason||"Operational hold"};
 const booked=(db.bookings||[]).find(b=>String(b.vehicle)===String(v.id)&&String(b.id)!==String(ignoreBookingId||"")&&
   !["completed","cancelled","rejected"].includes(normalize(b.status))&&
   (()=>{const it=bookingInterval(b);return it&&overlap(start,end,it.start,it.end)})());
 if(booked)return{ok:false,code:"already-booked",message:v.name+" is reserved during those dates.",source:"Booking",label:"Existing customer allocation"};
 return{ok:true,code:"ready",message:v.name+" has no conflicts in this browser's sample records. This is not live availability."};
}
function alternatives(db,start,end,exclude,max=4){
 return (db.vehicles||[]).filter(v=>v.id!==exclude).map(v=>({vehicle:v,decision:availability(db,v.id,start,end)}))
 .filter(x=>x.decision.ok).slice(0,max);
}
function requestChange(db,bookingId,proposed){
 const b=(db.bookings||[]).find(x=>String(x.id)===String(bookingId));
 if(!b)return{ok:false,code:"not-found",message:"Original reservation not found."};
 const start=dateOnly(proposed?.pickup||proposed?.date||b.pickup||b.date),
 days=asNumber(proposed?.days||b.days),total=asNumber(proposed?.total??b.total);
 if(!start||days<=0||total<0)return{ok:false,code:"invalid-terms",message:"Enter a valid requested date, duration and amount."};
 const end=plus(start,days);
 return{ok:true,original:{pickup:dateOnly(b.pickup||b.date),days:asNumber(b.days),total:asNumber(b.total),status:b.status},
 proposed:{pickup:start,days,total},availability:availability(db,b.vehicle,start,end,b.id),
 state:"Review only — the contract, booking dates and prices remain unchanged."};
}
function receiptSummary(db,b){
 const rows=(db.ledger||[]).filter(t=>String(t.booking)===String(b.id));
 const included=rows.filter(t=>!/revers|void|refund|cancel/i.test(String(t.status||""))&&asNumber(t.amount)>0);
 const received=included.reduce((n,t)=>n+asNumber(t.amount),0);
 const assessed=asNumber(b.total)+asNumber(b.returnCharge);
 const remaining=Math.max(0,assessed-received);
 return{assessed,received,remaining,overApplied:Math.max(0,received-assessed),receiptCount:rows.length,
  reversalCount:rows.length-included.length,state:received<=0?"No recorded receipts":remaining>0?"Partially recorded":"Fully recorded in demo; not bank-reconciled"};
}
function uniqueReceipt(db,reference){
 const key=normalize(reference);
 if(!key)return{ok:false,message:"A manual receipt reference is required."};
 return{ok:!(db.ledger||[]).some(t=>normalize(t.ref)===key),message:"This receipt reference was already recorded. Check for duplicate collection."};
}
function refundDecision(db,b){
 const deposits=(db.deposits||[]).filter(d=>String(d.booking)===String(b.id));
 const total=deposits.reduce((n,x)=>n+asNumber(x.amount),0);
 const needsReview=deposits.some(d=>/refund review|held|pending/i.test(d.status||""));
 return{total,state:!deposits.length?"No demo deposit":needsReview?"Awaiting refund review":"Needs ledger reconciliation",warning:"No money is actually held or refunded by this prototype."};
}
function returnsState(db,b){
 const completed=b.status==="Completed",charge=asNumber(b.returnCharge),
 review=db.rentalJourney?.returns?.[b.id]||null;
 return{possession:completed?"Vehicle physically returned (demo)":b.status==="Active"?"Renter has possession (demo)":b.status,
 assessedCharge:charge,
 review:review?.status|| (completed?"Charges awaiting independent review":"Not yet returnable"),
 finalFinance:completed&&review?.status==="Reviewed"?"Review recorded; finance reconciliation still separate":"Not closed"};
}
function initialize(db){
 if(!db.rentalJourney||typeof db.rentalJourney!=="object")db.rentalJourney={};
 const j=db.rentalJourney;
 if(!j.returns||typeof j.returns!=="object")j.returns={};
 if(!j.invoices||typeof j.invoices!=="object")j.invoices={};
 if(!j.settlements||typeof j.settlements!=="object")j.settlements={};
 if(!Array.isArray(j.audit))j.audit=[];
 if(!Array.isArray(j.amendments))j.amendments=[];
 for(const b of db.bookings||[]){
  if(b.status==="Completed"&&!j.returns[b.id])
    j.returns[b.id]={status:"Pending review",updatedAt:null,note:"Return recorded. Charges have not been verified."};
 }
 return j;
}
function reviewReturn(db,bookingId,choice,note){
 const j=initialize(db),b=(db.bookings||[]).find(x=>x.id===bookingId);
 if(!b||b.status!=="Completed")return{ok:false,message:"Record physical return before deciding the charges."};
 if(!["Reviewed","Disputed","Pending review"].includes(choice))return{ok:false,message:"Choose an allowed return review outcome."};
 j.returns[bookingId]={status:choice,note:String(note||"").slice(0,360),updatedAt:new Date().toISOString()};
 audit(j,"Return charges "+choice,bookingId);
 return{ok:true,message:"Charge review updated. No invoice paid or refund sent."};
}
function reviewInvoice(db,bookingId,choice){
 const j=initialize(db),b=(db.bookings||[]).find(x=>x.id===bookingId);
 if(!b)return{ok:false,message:"Reservation not found."};
 if(!["Reviewed","Disputed","Pending review"].includes(choice))return{ok:false,message:"Unsupported invoice review status."};
 if(b.status==="Completed"&&j.returns[b.id]?.status!=="Reviewed"&&choice==="Reviewed")
   return{ok:false,message:"Review the return charges before confirming this invoice assessment."};
 j.invoices[b.id]={status:choice,updatedAt:new Date().toISOString()};
 audit(j,"Invoice "+choice,b.id);
 return{ok:true,message:"Invoice assessment saved in demo; not issued, posted or paid."};
}
const payoutStages=["Pending","Approved (demo)","Sent for simulation","Transfer confirmed (demo)"];
function payoutNext(db,id,next,opts={}){
 const j=initialize(db),p=(db.payouts||[]).find(x=>x.id===id);
 if(!p)return{ok:false,message:"Owner payout record not found."};
 const old=j.settlements[id]?.stage||"Pending";
 const steps={Pending:["Approved (demo)"],"Approved (demo)":["Sent for simulation"],"Sent for simulation":["Transfer confirmed (demo)","Failed (demo)"],"Failed (demo)":["Sent for simulation"]};
 if(!(steps[old]||[]).includes(next))return{ok:false,message:"This payout transition is not allowed from "+old+"."};
 if(next==="Transfer confirmed (demo)"&&!opts.acknowledged)
   return{ok:false,message:"Confirm explicitly that this is only a simulated transfer outcome."};
 const current=j.settlements[id]||{};
 j.settlements[id]={...current,stage:next,updatedAt:new Date().toISOString(),memo:String(opts.memo||"").slice(0,220)};
 // preserve existing payout.amount and payout.status; owner portal can separately
 // display the explicit review lifecycle without a false paid bank-transfer flag.
 audit(j,"Settlement "+next,id);
 return{ok:true,message:"Owner settlement advanced to "+next+". No funds moved."};
}
function settlementView(db,p){
 const owner=(db.owners||[]).find(x=>x.name===p.owner);
 const share=owner&&asNumber(owner.share)>0&&asNumber(owner.share)<100?asNumber(owner.share):null;
 const books=(db.bookings||[]).filter(b=> {
  const v=(db.vehicles||[]).find(v=>v.id===b.vehicle);
  return v&&(v.id===p.vehicle||v.name===p.vehicle||v.plate===p.vehicle);
 });
 const gross=books.reduce((n,b)=>n+asNumber(b.total),0);
 const reviewedCharges=books.filter(b=>db.rentalJourney?.returns?.[b.id]?.status==="Reviewed")
  .reduce((n,b)=>n+asNumber(b.returnCharge),0);
 const eligible=gross+reviewedCharges;
 return{owner:owner?.name||p.owner,share,eligible,
  ownerShare:share!=null?Math.round(eligible*share/100):null,
  illustrativeAmount:asNumber(p.amount),
  stage:db.rentalJourney?.settlements?.[p.id]?.stage||"Pending",
  hasLinkedActivity:books.length>0,
  message:"Illustrative share only; deductions, taxes and actual owner contract must be reviewed."};
}
function audit(j,action,ref){
 j.audit.unshift({id:"RJ-"+Date.now()+"-"+Math.random().toString(36).slice(2,6),
  action,reference:ref,time:new Date().toISOString(),kind:"browser-local-demo"});
 j.audit=j.audit.slice(0,120);
}
function checkoutDecision(db,q){
 const v=(db.vehicles||[]).find(x=>x.id===q.vehicle);
 if(!v)return{ok:false,message:"Choose an existing example vehicle."};
 const start=dateOnly(q.pickup),days=asNumber(q.days);
 if(!start||!Number.isInteger(days)||days<=0)return{ok:false,message:"Choose valid dates and a positive rental duration."};
 const result=availability(db,v.id,start,plus(start,days));
 if(!result.ok)return{...result,message:result.message+" Choose a different vehicle or date before sending your enquiry."};
 return{ok:true,message:"Preview request only. An operator must still confirm availability, identity, agreement and payment."};
}
global.SageRentalCoreV2={dateOnly,plus,overlap,availability,alternatives,bookingInterval,requestChange,receiptSummary,
 uniqueReceipt,refundDecision,returnsState,initialize,reviewReturn,reviewInvoice,payoutNext,settlementView,checkoutDecision,payoutStages};
})(window);