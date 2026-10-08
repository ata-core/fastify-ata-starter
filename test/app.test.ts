import { describe, expect, it } from 'vitest'
import { buildApp } from '../src/app.ts'

const app = await buildApp()
await app.ready()
const post = (payload: Record<string, unknown>) => app.inject({ method: 'POST', url: '/users', payload })

describe('users', () => {
  it('accepts a valid body and types it', async () => {
    const res = await post({ email: 'ada@example.com', name: 'Ada', age: 36 })
    expect(res.statusCode).toBe(201)
    expect((res.json() as { id: string }).id).toMatch(/^[0-9a-f-]{36}$/)
  })

  it('refuses an invalid body with the usual 400', async () => {
    const res = await post({ email: 'not-an-email', name: '', age: 7 })
    expect(res.statusCode).toBe(400)
    const body = res.json() as { code: string; message: string }
    expect(body.code).toBe('FST_ERR_VALIDATION')
    expect(body.message).toContain('body/age must be >= 13')
    expect(body.message).toContain('body/name')
  })

  it('documents the route from the same schema', async () => {
    const res = await app.inject({ method: 'GET', url: '/openapi.json' })
    const doc = res.json() as any
    const body = doc.paths['/users'].post.requestBody.content['application/json'].schema
    const user = body.$ref ? doc.components.schemas['def-0'] ?? doc.components.schemas['User'] : body
    expect(user.properties.name).toEqual({ type: 'string', minLength: 1, maxLength: 80, description: 'Display name' })
    expect(doc.paths['/users'].post.responses['201']).toBeTruthy()
  })
})
