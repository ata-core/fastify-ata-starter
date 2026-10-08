import Fastify from 'fastify'
import swagger from '@fastify/swagger'
import fastifyAta from 'fastify-ata'
import { Created, User } from './schemas/user.ts'

export async function buildApp() {
  const app = Fastify().withTypeProvider<fastifyAta.AtaTypeProvider>()
  await app.register(swagger, {
    openapi: { info: { title: 'fastify-ata-starter', version: '0.1.0', description: 'Validation, types and this document come from src/schemas' } },
  })
  await app.register(fastifyAta)

  app.post('/users', { schema: { description: 'Create a user', body: User, response: { 201: Created } } }, async (req, reply) => {
    const body = req.body // typed from the schema: email and name are strings, age a number, newsletter optional
    app.log.info(`creating ${body.name}`)
    return reply.code(201).send({ id: crypto.randomUUID() }) // the reply is typed from Created too
  })

  app.get('/openapi.json', async () => app.swagger())
  return app
}
