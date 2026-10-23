const encoder=new TextEncoder();
const COOKIE='__Host-furia_admin';
const TTL=8*3600;
const digest=async value=>new Uint8Array(await crypto.subtle.digest('SHA-256',encoder.encode(value)));
const encode=value=>btoa(String.fromCharCode(...encoder.encode(JSON.stringify(value)))).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,'');
const b64=bytes=>btoa(String.fromCharCode(...bytes)).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,'');
const decode=value=>Uint8Array.from(atob(value.replaceAll('-','+').replaceAll('_','/')),c=>c.charCodeAt(0));
const configured=env=>typeof env.ADMIN_PASSWORD==='string'&&env.ADMIN_PASSWORD.length>=16;
// Native form POSTs need their same-origin Origin header for CSRF validation.
const headers={'Cache-Control':'no-store','X-Robots-Tag':'noindex','X-Content-Type-Options':'nosniff','Referrer-Policy':'same-origin'};
async function key(env){return crypto.subtle.importKey('raw',await digest('furia-admin-session-v1:'+env.ADMIN_PASSWORD),{name:'HMAC',hash:'SHA-256'},false,['sign','verify']);}
function cookie(value,age=TTL){return `${COOKIE}=${value}; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=${age}`;}
function page(message='',status=200){
 return new Response(`<!doctype html><html lang="id"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="/assets/furia-favicon.ico" type="image/vnd.microsoft.icon"><title>Masuk — Admin Furia</title><style>body{margin:0;min-height:100svh;display:grid;place-items:center;background:#112923;color:#f2f0e9;font:16px/1.6 system-ui}main{width:min(380px,calc(100% - 64px));padding:32px}small{color:#c7d6c9}h1{font-size:34px;line-height:1.15}label{display:block;margin:24px 0 8px}input,button{box-sizing:border-box;width:100%;font:inherit;padding:14px;border-radius:10px}input{background:#f2f0e9;color:#112923;border:1px solid #80958b}button{margin-top:16px;background:#ee7845;color:#112923;border:0;font-weight:700;cursor:pointer}a{color:inherit}p[role=alert]{color:#ffcbb5}.logout{position:fixed;right:20px;top:16px}</style><main><small>FURIA SPORTS CENTER · PENGELOLA</small><h1>Dashboard pribadi.</h1><p>Masuk untuk melihat statistik dan mengelola ulasan.</p>${message?`<p role="alert">${message}</p>`:''}<form method="post" action="/admin/login"><label for="password">Kata sandi admin</label><input id="password" name="password" type="password" autocomplete="current-password" required maxlength="512"><button>Masuk</button></form><p><small>Sesi berakhir otomatis setelah 8 jam.</small></p><a href="/">← Kembali ke website</a></main></html>`,{status,headers:{...headers,'Content-Type':'text/html; charset=utf-8','Content-Security-Policy':"default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'"}});
}
export async function passwordIdentity(request,env){
 try{
  if(!configured(env))return null;
  const value=(request.headers.get('cookie')||'').split(';').map(x=>x.trim()).find(x=>x.startsWith(COOKIE+'='))?.slice(COOKIE.length+1)||'';
  if(value.length>2048)return null;
  const parts=value.split('.');if(parts.length!==2)return null;
  if(!await crypto.subtle.verify('HMAC',await key(env),decode(parts[1]),encoder.encode(parts[0])))return null;
  const claims=JSON.parse(new TextDecoder().decode(decode(parts[0])));
  const now=Math.floor(Date.now()/1000);
  if(claims.sub!=='heriyawan25032004@gmail.com'||!Number.isFinite(claims.exp)||claims.exp<=now||claims.exp>now+TTL)return null;
  return {email:claims.sub};
 }catch{return null;}
}
export async function passwordRoute(request,env){
 const path=new URL(request.url).pathname;
 if(!['/admin/login','/admin/logout'].includes(path))return null;
 if(request.method==='GET'&&path==='/admin/login')return page(configured(env)?'':'Login belum diaktifkan. Pengembang perlu mengatur kata sandi admin.',configured(env)?200:503);
 if(request.method!=='POST')return new Response('Method not allowed',{status:405,headers});
 if(request.headers.get('origin')!==new URL(request.url).origin)return new Response('Origin tidak valid.',{status:403,headers});
 if(path==='/admin/logout')return new Response(null,{status:303,headers:{...headers,Location:'/admin/login','Set-Cookie':cookie('',0)}});
 if(!configured(env)||!env.DB)return page('Login belum diaktifkan.',503);
 if(Number(request.headers.get('content-length')||0)>2048)return page('Permintaan terlalu besar.',413);
 try{
  const window=new Date(Math.floor(Date.now()/900000)*900000).toISOString();
  const fingerprint=Array.from(await digest(window+':admin:'+request.headers.get('cf-connecting-ip')),b=>b.toString(16).padStart(2,'0')).join('');
  // Atomic D1 counter: at most ten attempts per network in fifteen minutes.
  const attempts=await env.DB.prepare('INSERT INTO rate_limits(fingerprint,day,kind,count) VALUES(?,?,?,1) ON CONFLICT(fingerprint,day,kind) DO UPDATE SET count=count+1 RETURNING count').bind(fingerprint,window,'admin_login').first();
  if(attempts.count>10)return page('Terlalu banyak percobaan. Tunggu 15 menit sebelum mencoba lagi.',429);
  const raw=await request.text();if(raw.length>2048)return page('Permintaan terlalu besar.',413);
  const supplied=new URLSearchParams(raw).get('password')||'';
  const a=await digest(supplied),b=await digest(env.ADMIN_PASSWORD);
  let difference=0;for(let i=0;i<a.length;i++)difference|=a[i]^b[i];
  if(difference||supplied.length>512)return page('Kata sandi tidak cocok.',401);
  const payload=encode({sub:'heriyawan25032004@gmail.com',exp:Math.floor(Date.now()/1000)+TTL,nonce:crypto.randomUUID()});
  const signature=b64(new Uint8Array(await crypto.subtle.sign('HMAC',await key(env),encoder.encode(payload))));
  return new Response(null,{status:303,headers:{...headers,Location:'/admin','Set-Cookie':cookie(payload+'.'+signature)}});
 }catch{return page('Login belum dapat diproses. Silakan coba lagi.',503);}
}
