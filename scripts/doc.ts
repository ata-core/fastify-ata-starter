import { buildApp } from '../src/app.ts'
const app = await buildApp()
await app.ready()
console.log(JSON.stringify(app.swagger(), null, 2))
await app.close()
