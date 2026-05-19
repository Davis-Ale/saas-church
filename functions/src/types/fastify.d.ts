import 'fastify'

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: string
      email: string
      churchId: string
    }
    churchId?: string
  }
}

export {}
