'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createCertificate, getCompanies, getIssuers } from '../actions'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'

export default function NovoCertificado() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [companies, setCompanies] = useState<{id: string, name: string, cnpj: string}[]>([])
  const [issuers, setIssuers] = useState<{id: string, name: string}[]>([])

  useEffect(() => {
    getCompanies().then(setCompanies)
    getIssuers().then(setIssuers)
  }, [])

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
      await createCertificate(data)
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error(error)
      setLoading(false)
      alert('Erro ao salvar o certificado. Tente novamente.')
    }
  }

  return (
    <div>
      <div className="header">
        <h1 className="title">Novo Certificado</h1>
        <Link href="/" className="btn btn-outline">
          <ArrowLeft size={20} />
          Voltar
        </Link>
      </div>

      <div className="glass-panel form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="companyId">Empresa</label>
            <select id="companyId" name="companyId" required className="form-input" defaultValue="">
              <option value="" disabled>Selecione uma Empresa</option>
              {companies.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.cnpj})</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="issuerId">Certificadora</label>
            <select id="issuerId" name="issuerId" required className="form-input" defaultValue="">
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
              className="form-input" 
              placeholder="Ex: Matriz / Filial 01"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Senha</label>
            <input 
              id="password"
              name="password" 
              type="text" 
              required 
              className="form-input" 
              placeholder="Senha do certificado"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="installDate">Data da Instalação/Entrega</label>
            <input 
              id="installDate"
              name="installDate" 
              type="date" 
              required 
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
              className="form-input" 
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={20} />
              {loading ? 'Salvando...' : 'Salvar Certificado'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
