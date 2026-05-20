'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { getCertificateById, updateCertificate, getCompanies, getIssuers } from '../../actions'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'

// Define the type to match the expected structure
interface Certificate {
  id: string
  companyId: string
  issuerId: string
  branch: string
  password: string
  installDate: Date
  expirationDate: Date
}

export default function EditarCertificado({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const resolvedParams = use(params)
  const [loading, setLoading] = useState(false)
  const [cert, setCert] = useState<Certificate | null>(null)
  
  const [companies, setCompanies] = useState<{id: string, name: string, cnpj: string}[]>([])
  const [issuers, setIssuers] = useState<{id: string, name: string}[]>([])

  useEffect(() => {
    getCompanies().then(setCompanies)
    getIssuers().then(setIssuers)
  }, [])
  
  useEffect(() => {
    async function loadData() {
      const data = await getCertificateById(resolvedParams.id)
      if (data) {
        setCert(data)
      } else {
        router.push('/')
      }
    }
    loadData()
  }, [resolvedParams.id, router])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    
    const installDateStr = formData.get('installDate') as string;
    const expirationDateStr = formData.get('expirationDate') as string;

    const data = {
      companyId: formData.get('companyId') as string,
      issuerId: formData.get('issuerId') as string,
      branch: formData.get('branch') as string,
      password: formData.get('password') as string,
      installDate: new Date(installDateStr + 'T00:00:00'),
      expirationDate: new Date(expirationDateStr + 'T00:00:00')
    }

    try {
      await updateCertificate(resolvedParams.id, data)
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error(error)
      setLoading(false)
      alert('Erro ao atualizar o certificado. Tente novamente.')
    }
  }

  if (!cert) return <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>Carregando...</div>

  // Convert dates to YYYY-MM-DD for the input fields
  const installDateFormatted = cert.installDate.toISOString().split('T')[0]
  const expirationDateFormatted = cert.expirationDate.toISOString().split('T')[0]

  return (
    <div>
      <div className="header">
        <h1 className="title">Editar Certificado</h1>
        <Link href="/" className="btn btn-outline">
          <ArrowLeft size={20} />
          Voltar
        </Link>
      </div>

      <div className="glass-panel form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="companyId">Empresa</label>
            <select id="companyId" name="companyId" required className="form-input" defaultValue={cert.companyId}>
              <option value="" disabled>Selecione uma Empresa</option>
              {companies.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.cnpj})</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="issuerId">Certificadora</label>
            <select id="issuerId" name="issuerId" required className="form-input" defaultValue={cert.issuerId}>
              <option value="" disabled>Selecione uma Certificadora</option>
              {issuers.map(i => (
                <option key={i.id} value={i.id}>{i.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="branch">Filial</label>
            <input 
              id="branch"
              name="branch" 
              type="text" 
              required 
              defaultValue={cert.branch}
              className="form-input" 
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Senha</label>
            <input 
              id="password"
              name="password" 
              type="text" 
              required 
              defaultValue={cert.password}
              className="form-input" 
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="installDate">Data da Instalação/Entrega</label>
            <input 
              id="installDate"
              name="installDate" 
              type="date" 
              required 
              defaultValue={installDateFormatted}
              className="form-input" 
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="expirationDate">Data de Validade</label>
            <input 
              id="expirationDate"
              name="expirationDate" 
              type="date" 
              required 
              defaultValue={expirationDateFormatted}
              className="form-input" 
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={20} />
              {loading ? 'Salvando...' : 'Atualizar Certificado'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
