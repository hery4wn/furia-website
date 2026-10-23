import site from '../dist/server/index.js';
import {verifyAccess} from './access.mjs';
export default {
 async fetch(request,env,ctx){
  const path=new URL(request.url).pathname;
  const headers=new Headers(request.headers);
  // Clients can send these headers themselves outside Sites. Strip them always.
  headers.delete('oai-authenticated-user-email');
  headers.delete('oai-authenticated-user-id');
  if(path==='/admin'||path.startsWith('/api/admin/')){
   const user=await verifyAccess(request,env);
   if(!user)return new Response(path.startsWith('/api/')?JSON.stringify({error:'Login admin belum valid.'}):'Akses admin memerlukan login Cloudflare Access untuk akun pemilik.',{status:403,headers:{'Content-Type':path.startsWith('/api/')?'application/json; charset=utf-8':'text/plain; charset=utf-8','Cache-Control':'no-store','X-Robots-Tag':'noindex'}});
   headers.set('oai-authenticated-user-email',user.email);
  }
  return site.fetch(new Request(request,{headers}),env,ctx);
 }
};
