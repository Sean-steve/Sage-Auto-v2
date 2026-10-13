/* SAGE AUTO / MOTION STUDIO — UI shell and experience direction.
 * Original editorial concept, not a purchased admin template.
 * Frontend only: all numbers and actions use existing fictional mock state.
 */
(function(){"use strict";
const Studio={};
const K="sage-auto-studio-prefs-v1";
const state={theme:"light",branch:"All",range:"7 days",lane:"All",fleet:"All",favourites:["Overview","Bookings","Fleet"],compact:false};
const themes=["light","night"];
const unit=(v)=>Number(v||0);
function esc(c,v){return c.esc(v==null?"":String(v))}
function icon(c,n,k){return c.ic(n,k||17)}
function m(c,n){return c.money(n)}
function act(c,text,action,cls="sx-button sx-secondary",id){return '<button type="button" class="'+cls+'" data-action="'+action+'"'+(id?' data-id="'+esc(c,id)+'"':'')+'>'+text+'</button>'}
function link(c,text,page,cls="sx-button sx-secondary"){return act(c,text,"studio:go:"+page,cls)}
function overline(text){return '<span class="sx-overline">'+text+'</span>'}
function save(){try{localStorage.setItem(K,JSON.stringify({theme:state.theme,branch:state.branch,range:state.range,favourites:state.favourites,compact:state.compact}))}catch(e){}}
function load(){try{const d=JSON.parse(localStorage.getItem(K)||"null");if(!d)return;for(const k of ["theme","branch","range","favourites","compact"])if(k in d)state[k]=d[k];if(!themes.includes(state.theme))state.theme="light"}catch(e){}}
function getVehicle(c,id){return c.db.vehicles.find(v=>v.id===id)}
function scope(c){return c.db.vehicles.filter(v=>state.branch==="All"||v.location===state.branch)}
function relevant(c){let allowed=new Set(scope(c).map(v=>v.id));return c.db.bookings.filter(b=>allowed.has(b.vehicle))}
function statusCount(bs,k){return bs.filter(b=>b.status===k).length}
function plate(c,v){return '<span class="sx-plate">'+esc(c,v.plate)+'</span>'}
function tag(c,s){return '<span class="sx-status sx-status-'+(s==="Active"?"active":s==="Awaiting payment"?"warning":s==="Confirmed"?"confirmed":s==="Completed"?"done":s==="Maintenance"?"off":"neutral")+'"><i></i>'+esc(c,s)+'</span>'}
function chart(c,bs){
 // The prototype's business sample is anchored to 13 October 2026, not to a payment ledger.
 const span={"Today":1,"7 days":7,"30 days":30,"90 days":90}[state.range]||7;
 const sampleStart=Date.UTC(2026,9,13),dayMs=86400000;
 const labels=[],series=Array(7).fill(0),buckets=Array.from({length:7},()=>[]);
 const monthNames=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
 for(let i=0;i<7;i++){const offset=Math.min(span-1,Math.floor((i+.35)*span/7)),d=new Date(sampleStart+offset*dayMs);labels.push(span===1?String(i*4).padStart(2,"0")+":00":d.getUTCDate()+" "+monthNames[d.getUTCMonth()])}
 bs.forEach(b=>{const match=String(b.date||"").match(/(\d{1,2})\s+([a-z]{3})/i);if(!match)return;const month=monthNames.findIndex(m=>m.toLowerCase()===match[2].toLowerCase());if(month<0)return;
 const start=Date.UTC(2026,month,Number(match[1])),offset=Math.round((start-sampleStart)/dayMs);
 if(offset<0||offset>=span)return;
 const tm=String(b.date||"").match(/(\d{1,2}):(\d{2})/),hour=tm?Number(tm[1]):12;const bucket=span===1?Math.min(6,Math.floor(hour*7/24)):Math.min(6,Math.floor(offset*7/span));series[bucket]+=unit(b.total);buckets[bucket].push(b)});
 const gross=series.reduce((a,b)=>a+b,0),maximum=Math.max(...series,1),w=690,h=218,pad=22;
 const pts=series.map((v,i)=>[pad+i*(w-2*pad)/6,h-28-(v/maximum)*148]);
 const area="M"+pts[0][0]+","+(h-28)+" L"+pts.map(p=>p.join(",")).join(" L")+" L"+pts[6][0]+","+(h-28)+" Z";
 const selector=["Today","7 days","30 days","90 days"].map(x=>act(c,x,"studio:range:"+x,"sx-time-tab"+(x===state.range?" is-on":""))).join("");
 const detail=state.chartBucket==null?"<span>Select a date marker below to inspect which example bookings are included.</span>":buckets[state.chartBucket].length?
 '<span>'+esc(c,labels[state.chartBucket])+' · '+buckets[state.chartBucket].length+' example booking(s): '+buckets[state.chartBucket].map(b=>esc(c,b.id)).join(", ")+'</span>':
 '<span>No example bookings in the selected period segment.</span>';
 return '<section class="sx-panel sx-chart-panel"><div class="sx-panel-heading"><div>'+overline("THE COMMERCIAL PICTURE")+'<h2>Momentum, not just metrics<span class="sx-title-dot">.</span></h2><p>Example booking value by pickup date · never live payment revenue.</p></div><div class="sx-time-selector" aria-label="Select illustrative reporting period" role="group">'+selector+'</div></div>'+
 '<div class="sx-chart-caption"><strong>'+m(c,gross)+'</strong><span>Illustrative bookings in selected period</span><span class="sx-data-chip">'+esc(c,state.range)+' sample · from 13 Oct</span></div>'+
 '<div class="sx-chart-wrap"><svg viewBox="0 0 '+w+' '+h+'" role="img" aria-label="Example booking value trend for '+esc(c,state.range)+'" preserveAspectRatio="none" class="sx-spark-figure"><defs><linearGradient id="sxChartFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7365E7" stop-opacity=".24"/><stop offset="1" stop-color="#7365E7" stop-opacity="0"/></linearGradient></defs>'+
 [0,1,2,3].map(j=>'<line x1="'+pad+'" y1="'+(38+j*50)+'" x2="'+(w-pad)+'" y2="'+(38+j*50)+'" class="sx-gridline"/>').join("")+
 series.map((v,i)=>'<rect x="'+(pts[i][0]-20)+'" y="'+(h-28-v/maximum*140)+'" width="40" height="'+Math.max(3,(v/maximum*140))+'" rx="9" fill="'+(i===1?"#F6AF8E":"#D5D4F8")+'" opacity="'+(v?1:.3)+'"><title>'+labels[i]+': '+m(c,v)+' illustrative booking value</title></rect>').join("")+
 '<path d="'+area+'" fill="url(#sxChartFill)"/><polyline points="'+pts.map(p=>p.join(",")).join(" ")+'" fill="none" stroke="#5F58D5" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>'+pts.map((p,i)=>'<circle cx="'+p[0]+'" cy="'+p[1]+'" r="4.8" fill="#fff" stroke="#5F58D5" stroke-width="3"><title>'+labels[i]+' '+m(c,series[i])+'</title></circle>').join("")+'</svg>'+
 '<div class="sx-chart-labels">'+labels.map((d,i)=>act(c,d,"studio:chartbucket:"+i,"sx-chart-date"+(i===state.chartBucket?" active":""))).join("")+'</div><div class="sx-chart-drill">'+icon(c,"info",13)+detail+'</div></div></section>'
}
function branchControl(c){const branches=["All",...new Set(c.db.vehicles.map(v=>v.location))];
return '<label class="sx-branch-chooser"><span>VIEW LOCATION</span><select name="studio-branch" id="studio-branch" aria-label="Filter overview by location">'+branches.map(x=>'<option value="'+esc(c,x)+'" '+(state.branch===x?"selected":"")+'>'+esc(c,x==="All"?"All locations":x)+'</option>').join("")+'</select></label>'}
function welcome(c,bs){const active=statusCount(bs,"Active"),due=statusCount(bs,"Confirmed"),needs=statusCount(bs,"Awaiting payment"),vehicles=scope(c),ready=vehicles.filter(v=>v.status==="Available"&&v.compliant).length;
return '<section class="sx-hero" aria-label="Business welcome"><div class="sx-hero-ink"><div class="sx-hero-micro"><span class="sx-neon-pin">✳</span> TUESDAY / 13 OCTOBER 2026 <span class="sx-hero-separator"></span> WORKSPACE PREVIEW</div><h1>Make every<br><em>journey count.</em></h1><p>Your business has moving parts. Here’s how they move together—starting with what needs you today.</p><div class="sx-hero-actions">'+act(c,icon(c,"plus",17)+' Start a booking','new-booking',"sx-button sx-acid")+link(c,"Explore availability ↗","Availability","sx-button sx-glass")+'</div></div><div class="sx-hero-shape" aria-hidden="true"><div class="sx-track sx-track-a"></div><div class="sx-track sx-track-b"></div><span class="sx-number-art">S<span>∕</span>A</span><div class="sx-vehicle-silhouette">'+c.vehicleSvg("#B7C8DA")+'</div><div class="sx-sticker"><b>SA</b><small>RENTAL<br>INTELLIGENCE</small></div></div><div class="sx-hero-numbers"><div><b>'+active+'</b><span>Out on rental</span></div><div><b>'+due+'</b><span>Handovers ahead</span></div><div><b>'+needs+'</b><span>Payments to chase</span></div><div><b>'+ready+'<small>/'+vehicles.length+'</small></b><span>Fleet ready</span></div></div></section>'}
function tab(c,label,k){return act(c,label,"studio:lane:"+k,"sx-filter-tab"+(state.lane===k?" active":""))}
function journey(c,bs){let remaining=bs.filter(b=>state.lane==="All"||b.status===state.lane);
const priorities=["Awaiting payment","Confirmed","Active","Completed"];remaining=remaining.slice().sort((a,b)=>priorities.indexOf(a.status)-priorities.indexOf(b.status));
return '<section class="sx-panel sx-journeys"><div class="sx-panel-heading"><div>'+overline("THE DEPARTURE BOARD")+'<h2>What’s moving next<span class="sx-title-dot">.</span></h2><p>Follow real workflow states in the example booking cycle.</p></div>'+link(c,"All reservations ↗","Bookings","sx-text-link")+'</div><div class="sx-lane-tabs" role="group" aria-label="Filter operations">'+tab(c,"All", "All")+tab(c,"To collect","Confirmed")+tab(c,"On the road","Active")+tab(c,"Needs payment","Awaiting payment")+'</div><div class="sx-journey-table"><div class="sx-table-heading"><span>RENTER / VEHICLE</span><span>COLLECTION</span><span>STATUS</span><span>NEXT ACTION</span></div>'+
 (remaining.length?remaining.slice(0,5).map((b,i)=>{const v=getVehicle(c,b.vehicle);let next=b.status==="Awaiting payment"?"Review payment":b.status==="Confirmed"?"Prepare collection":b.status==="Active"?"Open rental":"View record";
 return '<div class="sx-journey-row"><div class="sx-journey-person"><span class="sx-order">'+String(i+1).padStart(2,"0")+'</span><div><strong>'+esc(c,b.customer)+'</strong><small>'+esc(c,v?.name||"Vehicle")+' · '+esc(c,b.id)+'</small></div></div><div class="sx-collection"><strong>'+esc(c,b.date)+'</strong><small>'+esc(c,b.days)+' day(s)</small></div><div>'+tag(c,b.status)+'</div>'+act(c,next+' ↗',"booking-action","sx-inline-link",b.id)+'</div>'}).join(""):'<div class="sx-empty">All clear in this lane. Try another filter to see more activity.</div>')+'</div></section>'}
function fleet(c){const vs=scope(c),ready=vs.filter(v=>v.status==="Available").length,rented=vs.filter(v=>v.status==="On rental").length,service=vs.filter(v=>v.status==="Maintenance").length;let total=Math.max(1,vs.length);
 return '<section class="sx-fleet-stage"><div class="sx-fleet-stage-top">'+overline("YOUR FLEET, IN FOCUS")+'<span class="sx-sunburst">✳</span></div><div class="sx-fleet-title"><h2>'+vs.length+' assets.<br><em>Infinite potential.</em></h2><p>Every vehicle carries a different story—and an operational status.</p></div><div class="sx-fleet-disc"><span>FLEET</span><strong>'+vs.length+'</strong><small>ASSETS</small></div><div class="sx-fleet-track" role="list">'+vs.slice(0,4).map(v=>'<button type="button" role="listitem" class="sx-fleet-pill" data-action="vehicle" data-id="'+esc(c,v.id)+'"><span class="sx-car-icon" aria-hidden="true">'+c.vehicleSvg(v.color)+'</span><span><strong>'+esc(c,v.name)+'</strong><small>'+esc(c,v.plate)+'</small></span><span class="sx-car-indicator '+(v.status==="Available"?"on":v.status==="On rental"?"travel":"off")+'"></span></button>').join("")+'</div><div class="sx-fleet-status"><span>AVAILABLE <b>'+ready+'</b></span><span>ON RENTAL <b>'+rented+'</b></span><span>SERVICE <b>'+service+'</b></span></div>'+link(c,"Explore fleet ↗","Fleet","sx-button sx-dark")+'</section>'}
function priority(c,bs){let first=bs.find(b=>b.status==="Awaiting payment")||bs.find(b=>b.status==="Confirmed");let incidents=(c.db.incidents||[]).filter(x=>x.status==="Open").length;
let content=first?'<div class="sx-alert-order"><span class="sx-alert-icon">↗</span><div>'+overline(first.status==="Awaiting payment"?"ACTION / PAYMENT":"ACTION / HANDOVER")+'<h3>'+esc(c,first.customer)+'</h3><p>'+esc(c,first.id)+' · '+esc(c,getVehicle(c,first.vehicle)?.name)+'</p></div></div>'+act(c,first.status==="Awaiting payment"?"Review booking ↗":"Prepare handover ↗","booking-action","sx-button sx-dark",first.id):'<div class="sx-alert-order"><span class="sx-alert-icon">✓</span><div><h3>All caught up</h3><p>No urgent sample bookings.</p></div></div>';
return '<section class="sx-priority"><div class="sx-priority-heading">'+overline("A NOTE FROM YOUR OPERATIONS DESK")+'<span class="sx-priority-tag">TODAY</span></div><h2>One thing<br><em>at a time.</em></h2><div class="sx-priority-content">'+content+'</div><div class="sx-priority-bottom"><span>'+esc(c,incidents?incidents+" open incident(s)":"No urgent incidents logged")+'</span>'+act(c,"View all tasks →","studio:go:Incidents & assistance","sx-inline-link")+'</div></section>'}
function lower(c,bs){const ready=scope(c).filter(v=>v.status==="Available").length;
return '<div class="sx-mini-rail"><div><span class="sx-kicker-dot"></span> <strong>Keep the operation moving.</strong><small>Visualize vehicles, then execute the next handoff.</small></div>'+link(c,"Bookings","Bookings")+link(c,"Inspect vehicle","Inspections")+link(c,"Finance","Finance & payments")+link(c,"Owner settlements","Owner settlements")+'</div>'}
function company(c){if(!["Overview","Today's operations"].includes(c.state.page))return null;const bs=relevant(c);return '<div class="sx-cockpit">'+
 '<div class="sx-canvas-head"><div><span class="sx-edition">SAGE AUTO <i>✳</i> OPERATIONS STUDIO</span><h2>Good to see you, <em>team.</em></h2></div><div class="sx-canvas-controls">'+branchControl(c)+act(c,icon(c,"sliders",14)+' Customize view',"studio:preferences","sx-button sx-quiet")+'</div></div>'+
 welcome(c,bs)+'<div class="sx-mosaic"><div class="sx-mosaic-primary">'+journey(c,bs)+chart(c,bs)+'</div><div class="sx-mosaic-secondary">'+fleet(c)+priority(c,bs)+'</div></div>'+lower(c,bs)+'</div>'}
const roleMap={
 renter:{eyebrow:"THE OPEN ROAD",h1:"Your next chapter<br><em>starts here.</em>",sub:"A simpler way to plan the drive, follow the rental, and keep every detail close.",cta:"My rentals",route:"My rentals",tone:"apricot",stat:"READY TO ROLL",other:"Explore vehicles"},
 owner:{eyebrow:"THE OWNER'S CLUB",h1:"Good assets.<br><em>Better perspective.</em>",sub:"Every kilometre, every agreement, every settlement—now in clear view.",cta:"Your vehicles",route:"My vehicles",tone:"lavender",stat:"YOUR ASSET PORTFOLIO",other:"Statements"},
 driver:{eyebrow:"THE DRIVER'S SEAT",h1:"Next stop:<br><em>everything handled.</em>",sub:"From dispatch to passenger pickup, spend your energy on the drive.",cta:"Assignments",route:"Assignments",tone:"sky",stat:"YOUR NEXT MOVE",other:"Availability"},
 corporate:{eyebrow:"BUSINESS, IN MOTION",h1:"Move people.<br><em>Move business.</em>",sub:"A more human way to manage travel requests, approvals, and company journeys.",cta:"Travel requests",route:"Travel requests",tone:"steel",stat:"BUSINESS MOBILITY",other:"Approvals"},
 agent:{eyebrow:"THE PARTNERSHIP DESK",h1:"Create demand.<br><em>Make connections.</em>",sub:"Your clients, your referrals, your commissions. Nothing lost between them.",cta:"New referral",route:"New referral",tone:"lime",stat:"BUILD MORE MOMENTUM",other:"Commissions"},
 service:{eyebrow:"THE WORKSHOP",h1:"Expert work.<br><em>Clear progress.</em>",sub:"Know the next job, capture proof and hand vehicles back with confidence.",cta:"Assigned jobs",route:"Assigned jobs",tone:"coral",stat:"SERVICE OPERATIONS",other:"Job evidence"},
 platform:{eyebrow:"THE PLATFORM PERSPECTIVE",h1:"Every operator.<br><em>One powerful network.</em>",sub:"People, companies, subscriptions and support connected in one calm command space.",cta:"Companies",route:"Companies",tone:"purple",stat:"NETWORK AT A GLANCE",other:"Approvals"}
};
function role(c,base){if(c.state.page!=="Overview")return null;const cfg=roleMap[c.state.portal];if(!cfg)return null;
let right="";if(c.state.portal==="renter"){const b=c.db.bookings.find(b=>b.customer===c.db.renterProfile?.name&&b.status==="Active");const v=b?getVehicle(c,b.vehicle):null;right='<div class="sx-role-car">'+(v?c.vehicleSvg(v.color):icon(c,"car",95))+'</div><span class="sx-role-small">'+esc(c,v?.name||"Browse the fleet")+'</span>'}
else if(c.state.portal==="owner"){const pending=c.db.payouts.filter(p=>p.owner==="Mary Wambui"&&p.status==="Pending").reduce((a,b)=>a+unit(b.amount),0);right='<div class="sx-big-figure">'+m(c,pending)+'</div><span class="sx-role-small">Illustrative pending settlement</span>'}
else if(c.state.portal==="driver"){const job=c.db.driverJobs.find(j=>j.status!=="Completed");right='<div class="sx-big-figure">'+esc(c,job?.start||"On call")+'</div><span class="sx-role-small">'+esc(c,job?.pickup||"Your assignment")+'</span>'}
else {right='<div class="sx-role-car">'+c.vehicleSvg("#707EA1")+'</div><span class="sx-role-small">CONNECTED WORKSPACE</span>'}
return '<div class="sx-role-page sx-role-'+cfg.tone+'"><div class="sx-role-hero"><div class="sx-role-left">'+overline(cfg.eyebrow)+'<h1>'+cfg.h1+'</h1><p>'+cfg.sub+'</p><div class="sx-role-actions">'+act(c,cfg.cta+" ↗","studio:go:"+cfg.route,"sx-button sx-dark")+link(c,cfg.other+" →",cfg.other,"sx-button sx-white")+'</div></div><div class="sx-role-right"><div class="sx-role-orbit"></div>'+right+'</div><div class="sx-role-footer">'+cfg.stat+' <span>DESIGN PREVIEW / FICTIONAL DATA</span></div></div><div class="sx-role-original">'+base+'</div></div>'}
function publicPage(c,html){if(!["marketing","branded","marketplace"].includes(c.state.portal))return null;let home=(c.state.portal==="marketing"&&c.state.page==="Home")||(c.state.portal==="branded"&&c.state.page==="Explore vehicles")||(c.state.portal==="marketplace"&&c.state.page==="Discover");if(!home)return null;
// Existing menu, footer, feature catalogue and CTA handlers retained; replace only the original hero presentation.
const label=c.state.portal==="marketing"?"THE FUTURE OF FLEET OPERATIONS":c.state.portal==="branded"?"DISCOVER YOUR NEXT DRIVE":"THE FUTURE MARKETPLACE";
const head=c.state.portal==="marketing"?"Less admin.<br><em>More open road.</em>":c.state.portal==="branded"?"Your next drive<br><em>looks good.</em>":"The road is yours.<br><em>Go discover.</em>";
const sub=c.state.portal==="marketing"?"Where people, vehicles and business finally move together. A different kind of car-hire operating system.":c.state.portal==="branded"?"Beautiful cars, simple choices and a rental experience that makes sense.": "Explore a future concept for connected rental discovery.";
const primary=c.state.portal==="marketing"?"Features":c.state.portal==="branded"?"Checkout & review":"Browse cars";
const hero='<section class="sx-public-stage"><div class="sx-public-inner"><div class="sx-public-copy">'+overline(label)+'<h1>'+head+'</h1><p>'+sub+'</p><div class="sx-role-actions">'+act(c,"Explore now ↗","studio:go:"+primary,"sx-button sx-acid")+act(c,"See the experience","switcher","sx-button sx-glass")+'</div><small>Visual preview · No live bookings or payments</small></div><div class="sx-public-visual" aria-hidden="true"><span class="sx-public-number">01</span><div class="sx-public-wheel"><i></i></div><span class="sx-public-direction">GO FURTHER ↗</span></div></div></section>';
let s=html;
const p=s.indexOf('<section class="p-public-cover">');
if(p>=0){let end=s.indexOf("</section>",p);if(end>=0)s=s.slice(0,p)+hero+s.slice(end+10)}
else {let q=s.indexOf('<main id="main-content">');if(q>=0)s=s.slice(0,q+24)+hero+s.slice(q+24)}
return s}
function toolbar(c,s){if(window.SageOpsV2&&c.state.portal==="company")return window.SageOpsV2.toolbar(c,s);if(["marketing","branded","marketplace"].includes(c.state.portal))return s;
 const isOperator=c.state.portal==="company",pinned=isOperator?state.favourites.slice(0,5):[];
 const pins=isOperator?'<div class="sx-pins" aria-label="Pinned modules">'+pinned.map(n=>act(c,esc(c,n),"studio:go:"+n,"sx-pin"+(c.state.page===n?" active":""))).join("")+'</div>':"";
 const isPinned=state.favourites.includes(c.state.page);
 const pinBtn=isOperator?act(c,(isPinned?"★":"☆")+" "+(isPinned?"Pinned":"Pin page"),"studio:pin","sx-context-link",""):"";
 const quick='<div class="sx-context-strip" aria-label="Workspace shortcuts"><div class="sx-location-note"><span class="sx-live-pulse"></span><span>YOUR STUDIO</span><b>'+esc(c,c.state.page)+'</b></div><div class="sx-context-actions">'+pins+pinBtn+act(c,"⌕ Find","command","sx-context-link")+act(c,icon(c,"plus",14)+" Create booking","new-booking","sx-context-link sx-strong")+act(c,state.theme==="night"?"☼ Day":"☾ Night","studio:theme","sx-context-link")+'</div></div>';
 return s.replace('<main class="page" id="main-content">','<main class="page" id="main-content">'+quick)}
function shell(c){try{document.body.setAttribute("data-studio-theme",state.theme);document.body.classList.add("sage-studio")}catch(e){}}
function action(name,node,c){if(!name.startsWith("studio:"))return false;const cmd=name.slice(7);
if(cmd==="pin"){const item=c.state.page;if(state.favourites.includes(item)){state.favourites=state.favourites.filter(x=>x!==item)}else{state.favourites=[...state.favourites,item].slice(-5)}save();c.render();return true}
if(cmd==="theme"){state.theme=state.theme==="night"?"light":"night";save();c.render();return true}
if(cmd.startsWith("go:")){c.navigate(c.state.portal,cmd.slice(3));return true}
if(cmd.startsWith("lane:")){state.lane=cmd.slice(5);c.render();return true}
if(cmd.startsWith("range:")){state.range=cmd.slice(6);state.chartBucket=null;save();c.render();return true}
if(cmd.startsWith("chartbucket:")){state.chartBucket=Number(cmd.slice(12));c.render();return true}
if(cmd==="preferences"){state.theme=state.theme==="light"?"night":"light";save();c.render();c.showToast("Appearance switched to "+(state.theme==="night"?"Night Shift":"Studio Day"));return true}
return false}
function init(){load();if(document.addEventListener)document.addEventListener("change",e=>{if(e.target?.id!=="studio-branch")return;state.branch=e.target.value;const fn=window.SageStudioV2?._render;if(fn)fn()})}
Studio.company=company;Studio.role=role;Studio.public=publicPage;Studio.decorate=toolbar;Studio.action=action;Studio.shell=shell;Studio.prefs=state;Studio.connect=c=>{Studio._render=c.render};
init();window.SageStudioV2=Studio;
})();