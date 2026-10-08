import { buildApp } from './app.ts'
const app = await buildApp()
await app.listen({ port: Number(process.env.PORT ?? 3000) })
console.log(`listening on http://localhost:${process.env.PORT ?? 3000}, document at /openapi.json`)
