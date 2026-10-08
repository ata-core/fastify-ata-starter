// A fresh process from the first import to the first validated response,
// with the schemas on the route and with the same route carrying none.
import { execFileSync } from 'node:child_process'
const probe = (validated: boolean) => `
  const t0 = performance.now()
  const { buildApp } = await import(${validated ? "'./src/app.ts'" : "'./scripts/bare.ts'"})
  const app = await buildApp(); await app.ready()
  const res = await app.inject({ method: 'POST', url: '/users', payload: { email: 'ada@example.com', name: 'Ada', age: 36 } })
  if (res.statusCode !== 201) throw new Error(String(res.statusCode))
  console.log((performance.now() - t0).toFixed(2))
`
const median = (runs: number[]) => runs.sort((a, b) => a - b)[runs.length >> 1]
const time = (validated: boolean) => median(Array.from({ length: 11 }, () => parseFloat(execFileSync(process.execPath, ['--import', 'tsx', '--input-type=module', '-e', probe(validated)], { encoding: 'utf8' }).trim())))
console.log(`fresh process to first validated response: ${time(true).toFixed(1)} ms`)
console.log(`same route with no schema:                 ${time(false).toFixed(1)} ms`)
