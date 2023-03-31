// src/server/db/client.ts
import { PrismaClient } from '@prisma/client'
import { env } from '../../env/server.mjs'

declare global {
  var prisma: PrismaClient | undefined
}

//todo export client per tenant, customers must also pick the tenant/Business account they are trying to use, (tenantId = 'public') =>
export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['warn', 'error'],
    // log: ['query', 'info', 'warn', 'error'],
  })

if (env.NODE_ENV !== 'production') {
  global.prisma = prisma
}
