(function () {
"use strict";
const q=window.ZUX_QUIZ;
if(!q || !Array.isArray(q.questions)) return;
const root=document.getElementById("questions"),form=document.getElementById("quiz"),progress=document.getElementById("progressFill");
const progressLabel=document.getElementById("progressLabel"),result=document.getElementById("result");
let finished=false;
function make(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e}
q.questions.forEach((question,index)=>{
 const group=make("fieldset","q-question");const legend=make("legend","",String(index+1)+". "+question.text);group.append(legend);
 question.options.forEach((option,i)=>{
  const letter="ABCDEF"[i],label=make("label","q-option"),radio=document.createElement("input");
  radio.type="radio";radio.name="q"+index;radio.value=letter;
  label.append(radio,make("span","",letter+") "+option));group.append(label);
 });
 const note=make("p","q-explanation");note.hidden=true;group.append(note);root.append(group);
});
function update(){
 const n=q.questions.filter((_,i)=>form.querySelector('input[name="q'+i+'"]:checked')).length;
 progress.style.width=(n/q.questions.length*100)+"%";progressLabel.textContent=n+" / "+q.questions.length+" savolga javob berildi";
}
form.addEventListener("change",update);update();
function save(score){
 try{if(window.ZUX_PROGRESS)window.ZUX_PROGRESS.save({
  id:location.pathname.split("/").pop(),subject:q.subject,level:q.level,title:q.title,score,total:q.questions.length
 });}catch(e){}
}
form.addEventListener("submit",function(ev){
 ev.preventDefault();if(finished)return;
 const unanswered=q.questions.filter((_,i)=>!form.querySelector('input[name="q'+i+'"]:checked')).length;
 if(unanswered&&!confirm(unanswered+" ta savol javobsiz qolgan. Baribir yakunlaysizmi?"))return;
 finished=true;let score=0;
 q.questions.forEach((question,i)=>{
  const group=root.children[i],selected=group.querySelector("input:checked"),correct=question.answer;
  if(selected&&selected.value===correct)score++;
  group.querySelectorAll(".q-option").forEach((label,j)=>{
   if("ABCDEF"[j]===correct)label.classList.add("is-correct");
   if(selected&&label.contains(selected)&&selected.value!==correct)label.classList.add("is-wrong");
  });
  const note=group.querySelector(".q-explanation");note.textContent="To‘g‘ri javob: "+correct+". "+question.explanation;note.hidden=false;
 });
 form.querySelectorAll('input[type="radio"]').forEach(i=>i.disabled=true);
 document.getElementById("submitBtn").disabled=true;
 result.hidden=false;result.replaceChildren();
 result.append(make("h2","", "Natija: "+score+" / "+q.questions.length+" — "+Math.round(score/q.questions.length*100)+"%"));
 result.append(make("p","",score===q.questions.length?"Ajoyib! Barcha javoblar to‘g‘ri.":"Javoblar yuqorida belgilandi. Yana mashq qiling!"));
 const a=make("a","q-button","Natijalarimni ko‘rish →");a.href="results.html";result.append(a);
 const transcript=document.getElementById("transcript");if(transcript){transcript.hidden=false;}
 save(score);result.scrollIntoView({behavior:"smooth",block:"nearest"});
});
document.getElementById("resetBtn").addEventListener("click",()=>{
 if(window.speechSynthesis)window.speechSynthesis.cancel();
 finished=false;form.reset();result.hidden=true;root.querySelectorAll("input").forEach(i=>i.disabled=false);
 root.querySelectorAll(".q-option").forEach(e=>e.classList.remove("is-correct","is-wrong"));
 root.querySelectorAll(".q-explanation").forEach(e=>e.hidden=true);
 document.getElementById("submitBtn").disabled=false;update();
 const transcript=document.getElementById("transcript");if(transcript)transcript.hidden=true;
 window.scrollTo({top:0,behavior:"smooth"});
});
if(!q.dialogue)return;
const panel=document.getElementById("audioPanel"),status=document.getElementById("audioStatus"),play=document.getElementById("playAudio"),stop=document.getElementById("stopAudio"),transcript=document.getElementById("transcript");
if(!panel||!status||!play||!stop)return;
panel.hidden=false;
q.dialogue.forEach(l=>transcript.append(make("p","",l.speaker+": "+l.text)));
const supported=!!(window.speechSynthesis&&window.SpeechSynthesisUtterance);
if(!supported){play.disabled=true;stop.disabled=true;status.textContent="Bu brauzer ovozli o‘qishni qo‘llamaydi. Mashqni bajarish uchun transkriptni ko‘rishingiz mumkin.";transcript.hidden=false;return}
let playback=0;
play.addEventListener("click",()=>{
 playback++;const key=playback;window.speechSynthesis.cancel();
 let index=0;play.disabled=true;stop.disabled=false;status.textContent="Suhbat ijro etilyapti…";
 const voices=window.speechSynthesis.getVoices().filter(v=>v.lang&&v.lang.toLowerCase().startsWith("en"));
 function next(){
  if(key!==playback)return;
  if(index>=q.dialogue.length){play.disabled=false;stop.disabled=true;status.textContent="Suhbat tugadi. Yana eshitish uchun Play tugmasini bosing.";return}
  const line=q.dialogue[index++],u=new SpeechSynthesisUtterance(line.text);
  u.lang="en-US";u.rate=.88;u.pitch=line.speaker===q.dialogue[0].speaker?1.12:.94;
  if(voices.length){u.voice=voices[line.speaker===q.dialogue[0].speaker?0:Math.min(1,voices.length-1)]}
  u.onend=next;u.onerror=()=>{if(key===playback){status.textContent="Ovoz ijrosida xato. Brauzer sozlamalarini tekshiring.";play.disabled=false;stop.disabled=true}};
  window.speechSynthesis.speak(u);
 }
 next();
});
stop.addEventListener("click",()=>{playback++;window.speechSynthesis.cancel();play.disabled=false;stop.disabled=true;status.textContent="Ijro to‘xtatildi."});
window.addEventListener("pagehide",()=>{playback++;window.speechSynthesis.cancel()});
})();