(function(){
'use strict';
const exam=window.ZUX_READING_EXAM,root=document.getElementById('readingExam');
if(!exam||!root)return;
const parts=exam.parts||[],questions=parts.flatMap(p=>p.questions||[]);
const make=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
const startTime=Date.now();let completed=false;
function textBlock(text){
 const p=make('p','reading-paragraph',text);
 return p;
}
function renderPart(part,partNum){
 const section=make('section','reading-part');
 section.id='reading-part-'+(partNum+1);
 const head=make('header','reading-part-header');
 head.append(make('span','reading-part-number','PART '+String(partNum+1).padStart(2,'0')));
 head.append(make('h2','',part.title));
 head.append(make('p','reading-part-instructions',part.instruction));
 section.append(head);
 if(Array.isArray(part.passages)&&part.passages.length){
  const content=make('div','reading-passages');
  part.passages.forEach((b,i)=>{
   const article=make('article','reading-passage');
   if(b.heading)article.append(make('h3','',b.heading));
   if(b.body){String(b.body).split(/\n\n+/).forEach(t=>article.append(textBlock(t)))}
   content.append(article);
  });
  section.append(content);
 }
 if(part.note){section.append(make('p','reading-source-note',part.note))}
 const list=make('div','reading-questions');
 part.questions.forEach((q,i)=>{
  const qNum=parts.slice(0,partNum).reduce((n,p)=>n+p.questions.length,0)+i+1;
  const field=make('fieldset','reading-question');
  const legend=make('legend','',qNum+'. '+q.text);field.append(legend);
  if(q.source){field.append(make('blockquote','reading-question-source',q.source))}
  q.options.forEach((option,j)=>{
   const letter='ABCDEFGH'[j],label=make('label','reading-option');
   const input=document.createElement('input');input.type='radio';input.name='rq'+(qNum-1);input.value=letter;
   const tag=make('span','reading-option-key',letter);
   const copy=make('span','reading-option-label',option);
   label.append(input,tag,copy);field.append(label);
  });
  const feedback=make('div','reading-answer-feedback');feedback.hidden=true;field.append(feedback);
  list.append(field);
 });
 section.append(list);
 return section;
}
parts.forEach((p,i)=>root.append(renderPart(p,i)));
const progress=document.getElementById('readingProgress'),count=document.getElementById('readingAnswered');
const result=document.getElementById('readingResult'),button=document.getElementById('readingSubmit');
const reset=document.getElementById('readingReset');
function update(){
 const answered=questions.filter((q,i)=>root.querySelector('input[name="rq'+i+'"]:checked')).length;
 count.textContent=answered+' / '+questions.length+' savolga javob berildi';
 progress.style.width=(answered/questions.length*100)+'%';
}
root.addEventListener('change',update);update();
document.getElementById('readingForm').addEventListener('submit',function(ev){
 ev.preventDefault();if(completed)return;
 const missing=questions.filter((q,i)=>!root.querySelector('input[name="rq'+i+'"]:checked')).length;
 if(missing&&!confirm(missing+' ta savolga javob berilmagan. Baribir yakunlaysizmi?'))return;
 completed=true;let total=0,offset=0;const byParts=[];
 parts.forEach((part,idx)=>{
  let partScore=0;
  const fields=root.querySelectorAll('.reading-part')[idx].querySelectorAll('fieldset.reading-question');
  part.questions.forEach((q,i)=>{
   const field=fields[i],selected=field.querySelector('input:checked');
   const chosen=selected?selected.value:null,success=chosen===q.answer;
   if(success){total++;partScore++}
   field.querySelectorAll('.reading-option').forEach(label=>{
    const letter=label.querySelector('input').value;
    if(letter===q.answer)label.classList.add('is-correct');
    if(letter===chosen&&letter!==q.answer)label.classList.add('is-wrong');
   });
   const feedback=field.querySelector('.reading-answer-feedback');
   feedback.textContent=(success?'✓ To‘g‘ri! ':'✗ Javob: '+q.answer+'. ')+q.explanation;
   feedback.classList.add(success?'feedback-good':'feedback-review');
   feedback.hidden=false;
   field.querySelectorAll('input').forEach(e=>e.disabled=true);
  });
  byParts.push({title:part.title,score:partScore,count:part.questions.length});
  offset+=part.questions.length;
 });
 button.disabled=true;
 result.hidden=false;result.replaceChildren();
 const score=make('div','reading-result-score');
 score.append(make('strong','',total+' / '+questions.length));
 score.append(make('span','',Math.round(total/questions.length*100)+'%'));
 result.append(make('h2','','Sizning natijangiz'),score);
 result.append(make('p','reading-result-message','Har bir savolning to‘g‘ri javobi va izohi yuqorida ko‘rsatildi.'));
 const breakdown=make('div','reading-breakdown');
 byParts.forEach(p=>{
  const row=make('div','reading-breakdown-row');
  row.append(make('span','',p.title),make('strong','',p.score+'/'+p.count));breakdown.append(row);
 });
 result.append(breakdown);
 const a=make('a','reading-primary-link','📊 Natijalarimni ko‘rish');a.href='results.html';result.append(a);
 try{if(window.ZUX_PROGRESS)window.ZUX_PROGRESS.save({id:location.pathname.split('/').pop(),subject:'reading',level:exam.level,title:exam.title,score:total,total:questions.length})}catch(e){}
 result.scrollIntoView({behavior:'smooth',block:'start'});
});
reset.addEventListener('click',function(){
 document.getElementById('readingForm').reset();completed=false;button.disabled=false;result.hidden=true;
 root.querySelectorAll('.reading-option').forEach(e=>e.classList.remove('is-correct','is-wrong'));
 root.querySelectorAll('.reading-answer-feedback').forEach(e=>{e.hidden=true;e.classList.remove('feedback-good','feedback-review')});
 root.querySelectorAll('input').forEach(e=>e.disabled=false);
 update();document.querySelector('.reading-exam-intro').scrollIntoView({behavior:'smooth'});
});
})();