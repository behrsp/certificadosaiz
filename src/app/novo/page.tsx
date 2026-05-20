'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCertificate } from '../actions'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'

export default function NovoCertificado() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    
    const installDateStr = formData.get('installDate') as string;
    const expirationDateStr = formData.get('expirationDate') as string;

    const data = {
      name: formData.get('name') as string,
      branch: formData.get('branch') as string,
      password: formData.get('password') as string,
      // Adding T00:00:00 to avoid timezone shifting issues when parsing YYYY-MM-DD
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
            <label className="form-label" htmlFor="name">Nome do Certificado</label>
            <input 
              id="name"
              name="name" 
              type="text" 
              required 
              className="form-input" 
              placeholder="Ex: Certificado A1 - Empresa"
            />
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
