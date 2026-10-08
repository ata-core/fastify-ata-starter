import { defineSchema } from 'ata-validator'

// One definition. fastify-ata validates with it, the type provider types the
// handler from it, and @fastify/swagger writes it into the document as it is.
export const User = defineSchema({
  $id: 'User',
  title: 'User',
  description: 'A user as the API accepts it',
  type: 'object',
  required: ['email', 'name', 'age'],
  additionalProperties: false,
  properties: {
    email: { type: 'string', format: 'email', maxLength: 128 },
    name: { type: 'string', minLength: 1, maxLength: 80, description: 'Display name' },
    age: { type: 'integer', minimum: 13, maximum: 130 },
    newsletter: { type: 'boolean', default: false },
  },
})

export const Created = defineSchema({
  $id: 'Created',
  type: 'object',
  required: ['id'],
  properties: { id: { type: 'string', format: 'uuid' } },
})
