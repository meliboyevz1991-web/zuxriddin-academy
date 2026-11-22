const crypto=require('node:crypto');
const {json,auth,origin}=require('../lib/auth');
const subjects=new Set(['reading','listening','speaking','grammar','vocabulary']),levels=new Set(['a1','a2','b1','b2','c1','c2']);
module.exports=async(req,res)=>{
if(req.method!=='POST')return json(res,405,{error:'POST only'});
if(!origin(req))return json(res,403,{error:'Origin rejected'});
if(!auth(req))return json(res,401,{error:'Admin sifatida kiring'});
const token=process.env.GITHUB_TOKEN;if(!token)return json(res,503,{error:'GITHUB_TOKEN sozlamalari mavjud emas'});
const {title,subject,level,html}=req.body||{};
if(typeof title!=='string'||title.trim().length<3||title.length>130||!subjects.has(subject)||!levels.has(level)||typeof html!=='string'||html.length<50||Buffer.byteLength(html,'utf8')>900000||!/<html(?:\s|>)/i.test(html)||!/<\/head\s*>/i.test(html))return json(res,400,{error:'Test ma’lumotlarini tekshiring (HTML 900 KB dan kichik)'});
const slug=title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,42).replace(/-+$/g,'')||'test';
const filename=`${subject}-${level}-${new Date().toISOString().slice(0,10)}-${slug}-${crypto.randomBytes(3).toString('hex')}.html`;
const safeTitle=title.trim().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const markup=`<title>${safeTitle} | Zuxriddin Academy</title>`;
const text=/<title\b[^>]*>[\s\S]*?<\/title>/i.test(html)?html.replace(/<title\b[^>]*>[\s\S]*?<\/title>/i,markup):html.replace(/<\/head\s*>/i,`${markup}\n</head>`);
try{const response=await fetch(`https://api.github.com/repos/meliboyevz1991-web/zuxriddin-academy/contents/${filename}`,{method:'PUT',headers:{Authorization:`Bearer ${token}`,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','Content-Type':'application/json'},body:JSON.stringify({message:`Publish ${subject} ${level}: ${title.trim()}`,content:Buffer.from(text).toString('base64'),branch:'main'})});
if(!response.ok)return json(res,502,{error:response.status===401||response.status===403?'GitHub token ruxsatini tekshiring':`GitHub xatosi: ${response.status}`});
return json(res,201,{ok:true,filename,catalogUrl:`https://meliboyevz1991-web.github.io/zuxriddin-academy/${subject}.html?level=${level.toUpperCase()}`,note:'GitHub Actions nashridan keyin ko‘rinadi'});}
catch{return json(res,502,{error:'GitHubga ulanishda xatolik'})}
};