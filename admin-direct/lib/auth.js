const crypto=require('node:crypto');
const duration=8*60*60*1000;
function cookies(req){return Object.fromEntries(String(req.headers.cookie||'').split(';').map(x=>x.trim().split('=').slice(0,2)).filter(x=>x.length===2))}
function equal(a,b){const x=Buffer.from(String(a)),y=Buffer.from(String(b));return x.length===y.length&&crypto.timingSafeEqual(x,y)}
function configured(){return (process.env.ADMIN_PASSWORD||'').length>=16&&(process.env.SESSION_SECRET||'').length>=48}
function auth(req){if(!configured())return false;const cookie=cookies(req).za_session||'',n=cookie.lastIndexOf('.');if(n<1)return false;const value=cookie.slice(0,n),exp=Number(value.split('.')[0]);if(!Number.isSafeInteger(exp)||exp<Date.now()||exp>Date.now()+duration)return false;return equal(cookie.slice(n+1),crypto.createHmac('sha256',process.env.SESSION_SECRET).update(value).digest('hex'))}
function origin(req){try{const u=new URL(req.headers.origin||'');return u.protocol==='https:'&&u.host===req.headers.host}catch{return false}}
function json(res,n,obj){res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');return res.status(n).json(obj)}
function cookie(res){const v=(Date.now()+duration)+'.'+crypto.randomBytes(18).toString('hex'),s=crypto.createHmac('sha256',process.env.SESSION_SECRET).update(v).digest('hex');res.setHeader('Set-Cookie',`za_session=${v}.${s}; Path=/; Max-Age=28800; Secure; HttpOnly; SameSite=Strict`)}
module.exports={equal,configured,auth,origin,json,cookie};