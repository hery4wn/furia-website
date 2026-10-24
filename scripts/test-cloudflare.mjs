import {createAssets} from './static-local.mjs';
import assert from 'node:assert/strict';
import worker from '../cloudflare/index.mjs';
import {createDB} from './sqlite-local.mjs';
const DB=createDB();
const env={DB,ASSETS:createAssets(),CF_ACCESS_TEAM_DOMAIN:'https://furia-test.cloudflareaccess.com',CF_ACCESS_AUD:'furia-test-admin'};
const pair=await crypto.subtle.generateKey({name:'RSASSA-PKCS1-v1_5',modulusLength:2048,publicExponent:new Uint8Array([1,0,1]),hash:'SHA-256'},true,['sign','verify']);
const jwk=await crypto.subtle.exportKey('jwk',pair.publicKey);jwk.kid='test-key';
const originalFetch=globalThis.fetch;
globalThis.fetch=async url=>{assert.equal(url,env.CF_ACCESS_TEAM_DOMAIN+'/cdn-cgi/access/certs');return Response.json({keys:[jwk]});};
const b64=value=>Buffer.from(typeof value==='string'?value:JSON.stringify(value)).toString('base64url');
async function token(changes={}){
 const now=Math.floor(Date.now()/1000);
 const payload={iss:env.CF_ACCESS_TEAM_DOMAIN,aud:[env.CF_ACCESS_AUD],email:'heriyawan25032004@gmail.com',iat:now,exp:now+300,...changes};
 const body=b64({alg:'RS256',kid:'test-key'})+'.'+b64(payload);
 const sig=await crypto.subtle.sign('RSASSA-PKCS1-v1_5',pair.privateKey,new TextEncoder().encode(body));
 return body+'.'+Buffer.from(sig).toString('base64url');
}
async function call(path,headers={},config=env){return worker.fetch(new Request('https://furia.example'+path,{headers}),config,{});}
try{
 assert.equal((await call('/')).status,200);
 for(const path of ['/admin','/api/admin/metrics','/api/admin/reviews']){
  assert.equal((await call(path,{'oai-authenticated-user-email':'heriyawan25032004@gmail.com','Cf-Access-Authenticated-User-Email':'heriyawan25032004@gmail.com'})).status,path==='/admin'?303:403);
 }
 assert.equal((await call('/admin',{'Cf-Access-Jwt-Assertion':await token()})).status,200);
 assert.equal((await call('/api/admin/metrics',{'Cf-Access-Jwt-Assertion':await token()})).status,200);
 for(const changes of [{aud:['wrong-app']},{iss:'https://evil.example'},{email:'other@example.com'},{exp:1},{nbf:Math.floor(Date.now()/1000)+3600}]){
  assert.equal((await call('/admin',{'Cf-Access-Jwt-Assertion':await token(changes)})).status,303);
 }
 const jwt=await token();
 assert.equal((await call('/admin',{'Cf-Access-Jwt-Assertion':jwt.slice(0,-12)+'AAAAAAAAAAAA'})).status,303);
 assert.equal((await call('/admin',{'Cf-Access-Jwt-Assertion':jwt},{DB})).status,303);
 console.log('PASS: Cloudflare admin rejects spoofed identity headers, wrong audience/issuer/account, expired/future/tampered tokens, and missing config; signed owner identity works.');
}finally{globalThis.fetch=originalFetch;DB.sql.close();}
