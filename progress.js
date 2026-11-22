(function(){
"use strict";
const KEY="zuxriddin-academy-results-v1";
function get(){try{const v=JSON.parse(localStorage.getItem(KEY)||"[]");return Array.isArray(v)?v.filter(x=>x&&typeof x.id==="string"&&Number.isFinite(x.score)&&Number.isFinite(x.total)):[]}catch{return []}}
function save(item){if(!item||!Number.isFinite(item.score)||!Number.isFinite(item.total)||item.total<=0)return false;
const data={id:String(item.id),subject:String(item.subject||""),level:String(item.level||""),title:String(item.title||""),score:item.score,total:item.total,date:new Date().toISOString()};
try{const all=get();all.unshift(data);localStorage.setItem(KEY,JSON.stringify(all.slice(0,200)));return true}catch{return false}}
function clear(){try{localStorage.removeItem(KEY);return true}catch{return false}}
window.ZUX_PROGRESS={get,save,clear};
})();