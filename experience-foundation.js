/* Sage Auto V2 — Wave 1/2. Additive UI layer, no API or financial mutation. */
(function(root){
 "use strict";
 var prices=Object.freeze({Starter:4999,Growth:9999,Pro:19999,Enterprise:40000});
 var selections={plan:"All plans",region:"All regions"};
 function escape(value){return String(value==null?"":value).replace(/[&<>"']/g,function(k){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[k]})}
 function money(n){return "KES "+Number(n||0).toLocaleString("en-KE",{maximumFractionDigits:0})}
 function calculate(tenants,filters){
  var f=filters||{},selected=(Array.isArray(tenants)?tenants:[]).filter(function(t){
   return (!f.plan||f.plan==="All plans"||t.plan===f.plan)&&(!f.region||f.region==="All regions"||t.region===f.region);
  });
  var active=selected.filter(function(t){return t.status==="Active"});
  var known=active.filter(function(t){return Object.prototype.hasOwnProperty.call(prices,t.plan)});
  return {selected:selected,active:active,known:known,unknown:active.length-known.length,
   estimated:known.reduce(function(s,t){return s+prices[t.plan]},0),
   values:known.map(function(t){return {name:t.name,amount:prices[t.plan],plan:t.plan,region:t.region}})};
 }
 function option(value,selected){return '<option value="'+escape(value)+'"'+(selected===value?' selected':'')+'>'+escape(value)+'</option>'}
 function metric(name,value,detail){
  return '<div class="sx2-card sx2-metric"><small>'+escape(name)+'</small><strong>'+escape(value)+'</strong><em>'+escape(detail)+'</em></div>';
 }
 function bridge(name,value,final){
  return '<div class="sx2-bridge-step'+(final?' final':'')+'"><span>'+escape(name)+'</span><strong>'+escape(value)+'</strong></div>';
 }
 function revenue(ctx,tenants){
  var t=Array.isArray(tenants)?tenants:[],model=calculate(t,selections);
  var plans=["All plans"].concat(Array.from(new Set(t.map(function(x){return x.plan}).filter(Boolean))).sort());
  var regions=["All regions"].concat(Array.from(new Set(t.map(function(x){return x.region}).filter(Boolean))).sort());
  var controls='<div class="sx2-revenue-filters" role="group" aria-label="Illustrative revenue filters">'+
   '<label class="sx2-filter"><span class="sx2-label">Subscription plan</span><select class="sx2-input" id="sx2-revenue-plan">'+plans.map(function(p){return option(p,selections.plan)}).join("")+'</select></label>'+
   '<label class="sx2-filter"><span class="sx2-label">Operator region</span><select class="sx2-input" id="sx2-revenue-region">'+regions.map(function(p){return option(p,selections.region)}).join("")+'</select></label>'+
   '<button class="sx2-action secondary" type="button" id="sx2-reset-filters">Clear filters</button></div>';
  var rowHtml=t.map(function(item){
   var applicable=item.status==="Active"&&Object.prototype.hasOwnProperty.call(prices,item.plan);
   var amount=applicable?prices[item.plan]:0;
   return '<tr data-sx2-tenant-row data-plan="'+escape(item.plan)+'" data-region="'+escape(item.region)+'" data-active="'+(item.status==="Active"?"true":"false")+'" data-rated="'+(applicable?"true":"false")+'" data-amount="'+amount+'">'+
    '<td><strong>'+escape(item.name)+'</strong><small>'+escape(item.region)+'</small></td>'+
    '<td>'+escape(item.plan||"Unknown")+'</td>'+
    '<td><span class="sx2-badge '+(item.status==="Active"?"success":"warning")+'">'+escape(item.status||"Unknown")+'</span></td>'+
    '<td class="numeric">'+(applicable?money(amount):"Not included")+'</td>'+
    '<td><button type="button" data-action="p3c:tenant" data-id="'+escape(item.id)+'" aria-label="Review '+escape(item.name)+'">Review company →</button></td></tr>';
  }).join("");
  var table='<section class="sx2-card sx2-table-panel" aria-labelledby="sx2-tenant-heading">'+
   '<div class="sx2-panel-head"><div><h2 id="sx2-tenant-heading" class="sx2-section-title">Subscription run-rate by company</h2>'+
   '<p>Active sample tenant plans only · click a company to inspect its existing account details.</p></div>'+
   '<span class="sx2-badge neutral" id="sx2-visible-count">'+model.selected.length+' companies</span></div>'+
   '<div class="sx2-mobile-summary">Scroll within the tenant table to see all columns. Select Review company to inspect the sample tenant record.</div>'+
   '<div class="sx2-table-scroll" tabindex="0" role="region" aria-label="Tenant subscription estimates, horizontally scrollable">'+
   '<table class="sx2-table"><caption class="sr-only">Illustrative operator subscription plan estimates; no verified billing or collections</caption>'+
   '<thead><tr><th scope="col">Company</th><th scope="col">Plan</th><th scope="col">Account status</th><th scope="col" class="numeric">Monthly run-rate assumption</th><th scope="col">Actions</th></tr></thead>'+
   '<tbody>'+rowHtml+'<tr id="sx2-no-tenants"'+(model.selected.length?' hidden':'')+'><td colspan="5" class="sx2-empty">No companies match these filters. Try another plan or region.</td></tr></tbody></table></div></section>';
  var bridgePanel='<section class="sx2-card sx2-revenue-bridge" aria-labelledby="sx2-movement-title">'+
   '<div class="sx2-panel-head" style="padding:0"><div><h2 id="sx2-movement-title" class="sx2-section-title">Recurring-revenue movement</h2>'+
   '<p>Historical opening balance and changes are not available in this static prototype.</p></div><span class="sx2-badge warning">Historical data missing</span></div>'+
   '<div class="sx2-bridge-grid">'+bridge("Opening MRR","Unavailable")+bridge("New + expansion","Unavailable")+
   bridge("Contraction + churn","Unavailable")+bridge("Net movement","Unavailable")+bridge("Current indicative run-rate",money(model.estimated),true)+'</div>'+
   '<p class="sx2-bridge-caption">This is <strong>not a reconciled MRR bridge</strong>. Historical amounts cannot be computed from the current tenant list. The final figure is a plan-rate estimate, not a statement of subscription revenue.</p></section>';
  return ctx.header("Subscription revenue intelligence","Sage Auto platform subscriptions · illustrative demo, not operator rental income",
   "Review subscriptions","p3c:page:Subscriptions")+ctx.demo()+
   '<div class="sx2-workspace sx2-revenue" id="sx2-revenue-workspace" data-contract="S02-18" data-change="CH-001">'+
   '<section class="sx2-revenue-head"><div><span class="sx2-eyebrow">PLATFORM FINANCE / OCTOBER 2026 EXAMPLE</span>'+
   '<h2 class="sx2-heading">Know what is estimated.<br>Know what is missing.</h2>'+
   '<p class="sx2-muted">Subscription plan assumptions are kept separate from actual invoices, card payments, collections and operator rental transactions.</p></div>'+controls+'</section>'+
   '<div class="sx2-note warning" role="status"><strong>Financial data boundary:</strong> There is no payment-provider connection, invoice ledger, transaction history or verified collection in this prototype. Do not use these estimates for accounting or investor reporting.</div>'+
   '<section class="sx2-revenue-overview" aria-label="Subscription indicators">'+
   '<div class="sx2-card sx2-feature"><div class="sx2-eyebrow">CURRENT ILLUSTRATIVE ACTIVE-PLAN RUN RATE</div>'+
   '<div class="sx2-big-number" id="sx2-run-rate">'+money(model.estimated)+'</div>'+
   '<div class="sx2-source" id="sx2-run-rate-desc">'+model.known.length+' sample active companies with known illustrative rates; '+model.unknown+' active plans without an assigned rate.</div>'+
   '<div class="sx2-source" style="margin-top:23px">Snapshot of sample companies, not recognized revenue.</div></div>'+
   '<div class="sx2-metric-stack">'+metric("Sample active companies",String(model.active.length),"Status from local demo tenant list")+
   metric("Invoiced / billed","Unavailable","No billing ledger connected")+
   metric("Collected / overdue","Unavailable","No processor or reconciled receipts")+'</div></section>'+
   bridgePanel+table+
   '<div class="sx2-revenue-footer">'+
   '<section class="sx2-card"><h2 class="sx2-section-title">What this view can tell you</h2>'+
   '<p class="sx2-muted">Which sample operators have active plans and the illustrative monthly list-price run rate implied by those plans. Use the company action to inspect records without losing your navigation context.</p></section>'+
   '<section class="sx2-card"><h2 class="sx2-section-title">What must connect next</h2>'+
   '<p class="sx2-muted">Subscription events, invoices, actual payments, refunds, dunning, cancellations, opening balances and source timestamps are required for meaningful reconciliation. None are simulated as collected money.</p></section></div>'+
   '<p class="sx2-source" aria-live="polite" id="sx2-filter-summary">'+model.selected.length+' sample companies in scope · '+model.active.length+' active. Filters do not change underlying records.</p>'+
   '</div>';
 }
 function applyFilters(){
  var rootNode=document.getElementById("sx2-revenue-workspace");if(!rootNode)return;
  var a=document.getElementById("sx2-revenue-plan"),b=document.getElementById("sx2-revenue-region");
  if(!a||!b)return;
  selections.plan=a.value;selections.region=b.value;
  var rows=Array.from(rootNode.querySelectorAll("[data-sx2-tenant-row]")),active=0,known=0,amount=0,count=0;
  rows.forEach(function(row){
   var show=(selections.plan==="All plans"||row.dataset.plan===selections.plan)&&
    (selections.region==="All regions"||row.dataset.region===selections.region);
   row.hidden=!show;if(!show)return;
   count++;if(row.dataset.active==="true"){active++;if(row.dataset.rated==="true"){known++;amount+=Number(row.dataset.amount)||0;}}
  });
  function set(id,value){var node=document.getElementById(id);if(node)node.textContent=value;}
  set("sx2-run-rate",money(amount));set("sx2-visible-count",count+" companies");
  set("sx2-run-rate-desc",known+" sample active companies with known illustrative rates; "+(active-known)+" active companies with unknown plan rates.");
  set("sx2-filter-summary",count+" sample companies in scope · "+active+" active. Filters do not change underlying records.");
  var bridgeFinal=rootNode.querySelector(".sx2-bridge-step.final strong");if(bridgeFinal)bridgeFinal.textContent=money(amount);
  var emptyRow=document.getElementById("sx2-no-tenants");if(emptyRow)emptyRow.hidden=count>0;
 }
 if(typeof document!=="undefined"&&document.addEventListener){
  document.addEventListener("change",function(event){
   if(event.target&&["sx2-revenue-plan","sx2-revenue-region"].includes(event.target.id))applyFilters();
  });
  document.addEventListener("click",function(event){
   if(!event.target||event.target.id!=="sx2-reset-filters")return;
   var a=document.getElementById("sx2-revenue-plan"),b=document.getElementById("sx2-revenue-region");
   if(a&&b){a.value="All plans";b.value="All regions";applyFilters();}
  });
 }
 root.SageExperienceV2={calculateRevenue:calculate,renderRevenue:revenue,applyRevenueFilters:applyFilters};
})(window);
