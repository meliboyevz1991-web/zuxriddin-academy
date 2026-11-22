(function(){
"use strict";
const $=id=>document.getElementById(id);
const subjects=[["reading","📖 Reading"],["listening","🎧 Listening"],["speaking","🎤 Speaking"],["grammar","✍️ Grammar"],["vocabulary","📚 Vocabulary"]];
function el(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e}
function render(){
const data=window.ZUX_PROGRESS?window.ZUX_PROGRESS.get():[];
$("uniqueTests").textContent=String(new Set(data.map(r=>r.id)).size);
$("attempts").textContent=String(data.length);
$("average").textContent=data.length?Math.round(data.reduce((a,b)=>a+b.score/b.total*100,0)/data.length)+"%":"—";
$("best").textContent=data.length?Math.max(...data.map(r=>Math.round(r.score/r.total*100)))+"%":"—";
$("subjectSummary").replaceChildren();
subjects.forEach(([key,title])=>{
 const records=data.filter(r=>r.subject===key),pct=records.length?Math.round(records.reduce((a,b)=>a+b.score/b.total*100,0)/records.length):0;
 const block=el("div","summary-row"),head=el("div","row-space");
 head.append(el("strong","",title),el("span","subtle",records.length?"O‘rtacha "+pct+"%":"Hozircha yo‘q"));
 const rail=el("div","summary-rail"),fill=el("div","summary-fill");fill.style.width=pct+"%";rail.append(fill);block.append(head,rail);$("subjectSummary").append(block);
});
$("history").replaceChildren();
$("empty").hidden=data.length>0;
document.querySelector(".results-table-wrap").hidden=!data.length;
data.forEach(r=>{
 const tr=document.createElement("tr"),tdTitle=document.createElement("td");
 const safe=/^[a-z0-9][a-z0-9/_-]*\.html$/i.test(r.id)&&!r.id.includes("..");
 if(safe){const a=el("a","",r.title||r.id);a.href=r.id;tdTitle.append(a)}
 else tdTitle.textContent=r.title||r.id;
 const tdSubject=el("td","",r.subject.toUpperCase()+" / "+r.level);
 const scorePct=Math.round(r.score/r.total*100);
 const tdScore=el("td","");tdScore.append(el("span","score-tag "+(scorePct>=70?"score-good":"score-try"),r.score+"/"+r.total+" · "+scorePct+"%"));
 const tdDate=el("td","",new Date(r.date).toLocaleString("uz-UZ",{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}));
 tr.append(tdTitle,tdSubject,tdScore,tdDate);$("history").append(tr);
});
}
$("clearResults").addEventListener("click",()=>{
 if(!window.ZUX_PROGRESS.get().length)return;
 if(confirm("Hamma natijalar o‘chiriladi. Davom etasizmi?")){window.ZUX_PROGRESS.clear();render();}
});
render();
})();