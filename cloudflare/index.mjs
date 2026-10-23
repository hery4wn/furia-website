import site from '../dist/server/index.js';
import {verifyAccess} from './access.mjs';
import {passwordIdentity,passwordRoute} from './password.mjs';
export default {
 async fetch(request,env,ctx){
  const path=new URL(request.url).pathname;
  const headers=new Headers(request.headers);
  // Clients can send these headers themselves outside Sites. Strip them always.
  headers.delete('oai-authenticated-user-email');
  headers.delete('oai-authenticated-user-id');
  const login=await passwordRoute(request,env);
  if(login)return login;
  if(path==='/admin'||path.startsWith('/api/admin/')){
   const user=await passwordIdentity(request,env)||await verifyAccess(request,env);
   if(!user){
    if(path==='/admin')return new Response(null,{status:303,headers:{Location:'/admin/login','Cache-Control':'no-store','X-Robots-Tag':'noindex'}});
    return Response.json({error:'Silakan masuk sebagai admin.'},{status:403,headers:{'Cache-Control':'no-store','X-Robots-Tag':'noindex'}});
   }
   headers.set('oai-authenticated-user-email',user.email);
  }
  if(path==='/admin'){
   const response=await site.fetch(new Request(request,{headers}),env,ctx);
   const html=(await response.text()).replace('</body>','<form method="post" action="/admin/logout" style="position:fixed;right:16px;bottom:16px;z-index:100"><button style="padding:10px 16px;border:1px solid #88998c;border-radius:8px;background:#112923;color:#f2f0e9;cursor:pointer">Keluar</button></form></body>');
   return new Response(html,{status:response.status,headers:response.headers});
  }
  return site.fetch(new Request(request,{headers}),env,ctx);
 }
};
