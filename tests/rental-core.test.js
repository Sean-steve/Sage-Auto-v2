"use strict";
const assert=require("node:assert/strict"),vm=require("node:vm"),fs=require("node:fs");
const source=fs.readFileSync("rental-core.js","utf8");
const sandbox={window:{},Date,Math,Number,String,Array,Object,Set};
vm.runInNewContext(source,sandbox,{filename:"rental-core.js",timeout:2500});
const k=sandbox.window.SageRentalCoreV2;
assert.ok(k);
function fixture(){
 return {
  vehicles:[
   {id:"V01",name:"Toyota Harrier",plate:"KDA 101A",status:"Available",compliant:true,location:"Nairobi"},
   {id:"V02",name:"Nissan X-Trail",plate:"KDB 102B",status:"Available",compliant:true,location:"Westlands"},
   {id:"V03",name:"Service van",plate:"KDC 103C",status:"Maintenance",compliant:true,location:"Nairobi"},
   {id:"V04",name:"Unverified van",plate:"KDE 104D",status:"Available",compliant:false,location:"Nairobi"}],
  bookings:[
   {id:"B1",vehicle:"V01",customer:"Amina Wanjiku",date:"16 Oct",days:3,total:15000,status:"Confirmed"},
   {id:"B2",vehicle:"V02",customer:"Ruth Kamau",date:"10 Oct",days:2,total:8000,status:"Completed",returnCharge:500}],
  holds:[{id:"H1",vehicle:"V02",start:"2026-10-22",end:"2026-10-25",status:"Active",reason:"Owner use"}],
  ledger:[
   {id:"T1",booking:"B1",amount:5000,ref:"Mpesa-111",status:"Recorded (demo)"},
   {id:"T2",booking:"B1",amount:2000,ref:"Mpesa-222",status:"Reversed (demo)"}],
  deposits:[{id:"D1",booking:"B2",amount:3000,status:"Refund review"}],
  owners:[{id:"O1",name:"Mary Wambui",share:65,vehicle:"V01"}],
  payouts:[{id:"P1",owner:"Mary Wambui",vehicle:"V01",amount:9750,status:"Pending"}]
 };
}
const db=fixture();
assert.equal(k.dateOnly("16 Oct"),"2026-10-16");
assert.equal(k.dateOnly("2026-10-16"),"2026-10-16");
assert.equal(k.plus("2026-10-16",3),"2026-10-19");
assert.equal(k.availability(db,"V01","2026-10-15","2026-10-18").code,"already-booked");
assert.equal(k.availability(db,"V01","2026-10-19","2026-10-21").ok,true,"Adjacent date should be allowed");
assert.equal(k.availability(db,"V02","2026-10-23","2026-10-25").code,"operational-hold");
assert.equal(k.availability(db,"V03","2026-10-25","2026-10-27").code,"vehicle-blocked");
assert.equal(k.availability(db,"V04","2026-10-25","2026-10-27").code,"vehicle-blocked");
assert.equal(k.availability(db,"404","2026-10-25","2026-10-27").code,"missing-vehicle");
assert.equal(k.availability(db,"V01","2026-11-02","2026-10-30").code,"bad-dates");
assert.equal(k.alternatives(db,"2026-10-16","2026-10-18","V01").some(x=>x.vehicle.id==="V02"),true);
const comparison=k.requestChange(db,"B1",{date:"2026-10-16",days:2,total:12345});
assert.equal(comparison.ok,true);
assert.equal(comparison.availability.ok,true,"Own booking ignored in change-review overlap check");
assert.equal(db.bookings[0].total,15000,"Comparing terms must not mutate original contract");
assert.equal(db.bookings[0].days,3);
assert.equal(comparison.state.includes("unchanged"),true);
assert.equal(k.checkoutDecision(db,{vehicle:"V01",pickup:"2026-10-16",days:2}).ok,false,"Checkout cannot ignore existing booking");
assert.equal(k.checkoutDecision(db,{vehicle:"V02",pickup:"2026-10-16",days:2}).ok,true);
assert.equal(db.bookings.length,2,"Checkout decision is read-only and must never create bookings");
const r=k.receiptSummary(db,db.bookings[0]);
assert.equal(r.assessed,15000);
assert.equal(r.received,5000,"Reversed demo receipt must not count");
assert.equal(r.remaining,10000);
assert.equal(r.reversalCount,1);
assert.equal(r.state.includes("Partially"),true);
assert.equal(k.uniqueReceipt(db," mPeSa-111 ").ok,false);
assert.equal(k.uniqueReceipt(db,"M-PESA-333").ok,true);
assert.equal(k.uniqueReceipt(db,"").ok,false);
assert.equal(k.refundDecision(db,db.bookings[1]).total,3000);
const j=k.initialize(db);
assert.equal(j.returns["B2"].status,"Pending review");
assert.equal(k.returnsState(db,db.bookings[1]).possession,"Vehicle physically returned (demo)");
assert.equal(k.reviewInvoice(db,"B2","Reviewed").ok,false,"Must review return charges before completed invoice review");
assert.equal(k.reviewReturn(db,"B1","Reviewed").ok,false,"No return review for still-confirmed rental");
assert.equal(k.reviewReturn(db,"B2","Disputed").ok,true);
assert.equal(k.reviewInvoice(db,"B2","Reviewed").ok,false,"Disputed charges cannot be approved through invoice shortcut");
assert.equal(k.reviewReturn(db,"B2","Reviewed").ok,true);
assert.equal(k.reviewInvoice(db,"B2","Reviewed").ok,true);
assert.equal(db.bookings[1].status,"Completed","Finance review must not change possession");
assert.equal(db.bookings[1].returnCharge,500,"Invoice review must not change approved assessment");
assert.equal(db.ledger.length,2,"Finance review must not fabricate receipts");
const p=k.settlementView(db,db.payouts[0]);
assert.equal(p.share,65);
assert.equal(p.ownerShare,9750);
assert.equal(p.stage,"Pending");
assert.equal(k.payoutNext(db,"P1","Transfer confirmed (demo)").ok,false,"Cannot jump from pending to transfer");
assert.equal(k.payoutNext(db,"P1","Approved (demo)").ok,true);
assert.equal(k.payoutNext(db,"P1","Sent for simulation").ok,true);
assert.equal(k.payoutNext(db,"P1","Transfer confirmed (demo)").ok,false,"Explicit simulated acknowledgment required");
assert.equal(k.payoutNext(db,"P1","Failed (demo)").ok,true);
assert.equal(k.payoutNext(db,"P1","Sent for simulation").ok,true);
assert.equal(k.payoutNext(db,"P1","Transfer confirmed (demo)",{acknowledged:true}).ok,true);
assert.equal(db.payouts[0].status,"Pending","No real payment state must be fabricated");
assert.equal(db.payouts[0].amount,9750,"Owner payable amount is unchanged");
assert.ok(db.rentalJourney.audit.length>=5);
console.log("CH-003..CH-010 core invariants PASS: conflict/adjacent, amendments, checkout, 2 receipt negative paths, returns, invoices, owner lifecycle.");
