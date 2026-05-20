'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getCertificates() {
  return await prisma.certificate.findMany({
    orderBy: { expirationDate: 'asc' }
  })
}

export async function getCertificateById(id: string) {
  return await prisma.certificate.findUnique({
    where: { id }
  })
}

export async function createCertificate(data: {
  name: string
  branch: string
  cnpj: string
  type: string
  password: string
  installDate: Date
  expirationDate: Date
}) {
  await prisma.certificate.create({
    data
  })
  revalidatePath('/')
}

export async function updateCertificate(id: string, data: {
  name: string
  branch: string
  cnpj: string
  type: string
  password: string
  installDate: Date
  expirationDate: Date
}) {
  await prisma.certificate.update({
    where: { id },
    data
  })
  revalidatePath('/')
}

export async function deleteCertificate(id: string) {
  await prisma.certificate.delete({
    where: { id }
  })
  revalidatePath('/')
}
