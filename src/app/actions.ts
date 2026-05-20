'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// --- Companies ---
export async function getCompanies() {
  return await prisma.company.findMany({ orderBy: { name: 'asc' } })
}

export async function createCompany(data: { name: string, cnpj: string }) {
  const numbers = data.cnpj.replace(/\D/g, '')
  let formattedCnpj = numbers
  if (numbers.length === 14) {
    formattedCnpj = numbers.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")
  }
  await prisma.company.create({ data: { ...data, cnpj: formattedCnpj } })
  revalidatePath('/empresas')
  revalidatePath('/novo')
}

export async function deleteCompany(id: string) {
  await prisma.company.delete({ where: { id } })
  revalidatePath('/empresas')
}

// --- Issuers (Certificadoras) ---
export async function getIssuers() {
  return await prisma.issuer.findMany({ orderBy: { name: 'asc' } })
}

export async function createIssuer(data: { name: string }) {
  await prisma.issuer.create({ data })
  revalidatePath('/certificadoras')
  revalidatePath('/novo')
}

export async function deleteIssuer(id: string) {
  await prisma.issuer.delete({ where: { id } })
  revalidatePath('/certificadoras')
}

// --- Certificates ---
export async function getCertificates() {
  return await prisma.certificate.findMany({
    include: { company: true, issuer: true },
    orderBy: { expirationDate: 'asc' }
  })
}

export async function getCertificateById(id: string) {
  return await prisma.certificate.findUnique({
    where: { id },
    include: { company: true, issuer: true }
  })
}

export async function createCertificate(data: {
  companyId: string
  issuerId: string
  branch: string
  password: string
  installDate: Date
  expirationDate: Date
}) {
  await prisma.certificate.create({ data })
  revalidatePath('/')
}

export async function updateCertificate(id: string, data: {
  companyId: string
  issuerId: string
  branch: string
  password: string
  installDate: Date
  expirationDate: Date
}) {
  await prisma.certificate.update({ where: { id }, data })
  revalidatePath('/')
}

export async function deleteCertificate(id: string) {
  await prisma.certificate.delete({ where: { id } })
  revalidatePath('/')
}
