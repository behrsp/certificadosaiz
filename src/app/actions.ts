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

function formatCnpj(value: string) {
  if (!value) return ''
  const numbers = value.replace(/\D/g, '')
  if (numbers.length !== 14) return value
  return numbers.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")
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
  const formattedCnpj = formatCnpj(data.cnpj)
  await prisma.certificate.create({
    data: { ...data, cnpj: formattedCnpj }
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
  const formattedCnpj = formatCnpj(data.cnpj)
  await prisma.certificate.update({
    where: { id },
    data: { ...data, cnpj: formattedCnpj }
  })
  revalidatePath('/')
}

export async function deleteCertificate(id: string) {
  await prisma.certificate.delete({
    where: { id }
  })
  revalidatePath('/')
}
