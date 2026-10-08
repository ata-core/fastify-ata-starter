# fastify-ata-starter

A Fastify API where one JSON Schema gives the request validation, the TypeScript types of the handler's input and reply, and the OpenAPI document. Nothing is converted and nothing is generated: Fastify routes already take JSON Schema, [fastify-ata](https://github.com/ata-core/fastify-ata) validates with it through [ata-validator](https://github.com/ata-core/ata-validator), the type provider reads the types off it, and `@fastify/swagger` writes it into the document as it is.

```text
src/schemas/user.ts  (defineSchema, plain JSON Schema with its literal types kept)
   │
   ├─ fastify-ata ────────► validates the body, Fastify's usual 400 on failure
   ├─ AtaTypeProvider ────► req.body and reply.send typed from the schema
   └─ @fastify/swagger ───► /openapi.json, the schema verbatim
```

## Run it

```sh
npm install
npm run dev        # tsx --watch, listens on :3000, document at /openapi.json
npm test           # the three tests below
npm run doc        # prints the OpenAPI document
npm run measure    # startup cost, see below
```

Change `src/schemas/user.ts` and the validator, the types and the document follow. There is no build step and no second definition.

## What is in it

`src/app.ts` is the whole app. The route declares `schema: { body: User, response: { 201: Created } }`; `req.body.name` is a `string` and `reply.send` only accepts what `Created` describes, both from the schema. An invalid body gets Fastify's standard `400` with `FST_ERR_VALIDATION` and a message naming every violation, `body/age must be >= 13` and so on.

## What it costs

Measured with `npm run measure` (Apple M4 Pro, Node 25), a fresh process from the first import to the first validated response, median of 11:

| | ms |
|---|---|
| this template, schemas on the route | 96.5 |
| the same route with no schema | 79.2 |

The 17 ms is fastify-ata loading and compiling the two schemas at startup. For a process that starts often, `fastify-ata/standalone` compiles them at build time and loads the generated code instead, the same way `@fastify/ajv-compiler/standalone` does; this template keeps the simpler form.

## Tests

`test/app.test.ts`: a valid body is accepted with a typed reply, an invalid one gets the 400 with the violations named, and the document carries the schema as written, `description`, `format` and `minLength` included.

## License

MIT
