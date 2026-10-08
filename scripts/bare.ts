import Fastify from 'fastify'
import swagger from '@fastify/swagger'
export async function buildApp() {
  const app = Fastify()
  await app.register(swagger, { openapi: { info: { title: 'bare', version: '0' } } })
  app.post('/users', async (req, reply) => reply.code(201).send({ id: crypto.randomUUID(), name: (req.body as any).name }))
  app.get('/openapi.json', async () => app.swagger())
  return app
}
