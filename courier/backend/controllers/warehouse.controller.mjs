// import { prisma } from '../utils/globalPrismaClient.mts'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const getAllWarehousedetails = async (req, res) => {
  const details = await prisma.warehouseDetails.findMany({
    include: {
      containers: true,
      supplies: true,
    },
  })
  res.json(details)
}

export const getAllContainerDetails = async (req, res) => {
  const details = await prisma.containers.findMany({
    include: {
      orders: true,
      warehouseDetails: true,
    },
  })
  res.json(details)
}
