// Validate signed Cloudflare Access identity, never just an email header.
let keyCache={url:'',until:0,keys:[]};
function decode(segment){return Uint8Array.from(atob(segment.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));}
export async function verifyAccess(request,env){
 try{
  const team=String(env.CF_ACCESS_TEAM_DOMAIN||'').replace(/\/$/,'');
  const audiences=String(env.CF_ACCESS_AUD||'').split(',').map(x=>x.trim()).filter(Boolean);
  if(!/^https:\/\/[a-z0-9-]+\.cloudflareaccess\.com$/.test(team)||!audiences.length)return null;
  const token=request.headers.get('Cf-Access-Jwt-Assertion')||'';
  if(token.length>16384)return null;
  const parts=token.split('.');if(parts.length!==3)return null;
  const header=JSON.parse(new TextDecoder().decode(decode(parts[0])));
  const claims=JSON.parse(new TextDecoder().decode(decode(parts[1])));
  const now=Math.floor(Date.now()/1000);
  if(header.alg!=='RS256'||typeof header.kid!=='string'||claims.iss!==team)return null;
  const aud=Array.isArray(claims.aud)?claims.aud:[claims.aud];
  if(!aud.some(a=>audiences.includes(a))||!Number.isFinite(claims.exp)||claims.exp<=now)return null;
  if(claims.nbf!==undefined&&(!Number.isFinite(claims.nbf)||claims.nbf>now+30))return null;
  if(claims.iat!==undefined&&(!Number.isFinite(claims.iat)||claims.iat>now+30))return null;
  if(claims.email!=='heriyawan25032004@gmail.com')return null;
  const url=team+'/cdn-cgi/access/certs';
  if(keyCache.url!==url||keyCache.until<Date.now()){
   const response=await fetch(url,{signal:AbortSignal.timeout(8000)});if(!response.ok)return null;
   const body=await response.json();if(!Array.isArray(body.keys))return null;
   keyCache={url,keys:body.keys,until:Date.now()+300000};
  }
  const jwk=keyCache.keys.find(k=>k.kid===header.kid&&k.kty==='RSA');if(!jwk)return null;
  const key=await crypto.subtle.importKey('jwk',jwk,{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['verify']);
  const verified=await crypto.subtle.verify('RSASSA-PKCS1-v1_5',key,decode(parts[2]),new TextEncoder().encode(parts[0]+'.'+parts[1]));
  return verified?{email:claims.email}:null;
 }catch{return null;}
}
