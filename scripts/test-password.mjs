import assert from 'node:assert/strict';
import worker from '../cloudflare/index.mjs';
import {createDB} from './sqlite-local.mjs';
const DB=createDB(),env={DB,ADMIN_PASSWORD:'local-test-password-32-characters'};
const call=(path,options={},config=env)=>worker.fetch(new Request('https://furia.example'+path,options),config,{});
const login=(password,origin='https://furia.example')=>call('/admin/login',{method:'POST',headers:{Origin:origin,'Content-Type':'application/x-www-form-urlencoded','Cf-Connecting-IP':'192.0.2.1'},body:new URLSearchParams({password})});
try{
 assert.equal((await call('/admin/login')).status,200);
 assert.equal((await call('/admin')).status,303);
 assert.equal((await login(env.ADMIN_PASSWORD,'https://evil.example')).status,403);
 assert.equal((await login('incorrect')).status,401);
 const response=await login(env.ADMIN_PASSWORD);assert.equal(response.status,303);
 const set=response.headers.get('set-cookie');assert.match(set,/Secure; HttpOnly; SameSite=Strict/);
 const cookie=set.split(';')[0];
 assert.equal((await call('/api/admin/metrics',{headers:{Cookie:cookie}})).status,200);
 assert.match(await (await call('/admin',{headers:{Cookie:cookie}})).text(),/\/admin\/logout/);
 assert.equal((await call('/api/admin/metrics',{headers:{Cookie:cookie+'x'}})).status,403);
 assert.equal((await call('/api/admin/metrics',{headers:{Cookie:cookie}},{DB,ADMIN_PASSWORD:'rotated-password-another-long-value'})).status,403);
 assert.equal((await call('/api/admin/metrics',{headers:{Cookie:cookie}},{DB})).status,403);
 const logout=await call('/admin/logout',{method:'POST',headers:{Origin:'https://furia.example',Cookie:cookie}});assert.equal(logout.status,303);assert.match(logout.headers.get('set-cookie'),/Max-Age=0/);
 for(let i=0;i<8;i++)await login('incorrect');
 assert.equal((await login(env.ADMIN_PASSWORD)).status,429);
 assert.equal((await call('/admin/login',{}, {DB,ADMIN_PASSWORD:'short'})).status,503);
 console.log('PASS: password login, signed session, logout, rotation, missing secret, CSRF, tampering and rate limiting.');
}finally{DB.sql.close();}
