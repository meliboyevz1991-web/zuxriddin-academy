(function(){
"use strict";
const lesson=document.getElementById("topicLesson"),quiz=document.getElementById("quiz");
if(!lesson||!quiz)return;
const start=document.getElementById("startTopicQuiz"),back=document.getElementById("backTopicLesson");
start.addEventListener("click",function(){lesson.hidden=true;quiz.hidden=false;quiz.scrollIntoView({behavior:"smooth",block:"start"});});
back.addEventListener("click",function(){quiz.hidden=true;lesson.hidden=false;lesson.scrollIntoView({behavior:"smooth",block:"start"});});
})();