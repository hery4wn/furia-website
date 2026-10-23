import {DatabaseSync} from 'node:sqlite';
import fs from 'node:fs';
export function createDB(filename=':memory:'){
 const sql=new DatabaseSync(filename);
 sql.exec(fs.readFileSync('drizzle/0000_furia.sql','utf8').replaceAll('--> statement-breakpoint',''));
 return {sql,prepare(query){return {bind(...args){const statement=sql.prepare(query);return {async first(){return statement.get(...args)||null;},async all(){return {results:statement.all(...args)};},async run(){const r=statement.run(...args);return {meta:{changes:Number(r.changes)}};}};},async first(){return sql.prepare(query).get()||null;},async all(){return {results:sql.prepare(query).all()};},async run(){const r=sql.prepare(query).run();return {meta:{changes:Number(r.changes)}};}};}};
}
