'use client'

import { useState, useTransition, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Save, Trash2, Building2 } from 'lucide-react'
import { createCompany, deleteCompany, getCompanies } from '../actions'

interface Company {
  id: string
  name: string
  cnpj: string
}

export default function Empresas() {
  const [isPending, startTransition] = useTransition()
  const [companies, setCompanies] = useState<Company[]>([])

  useEffect(() => {
    getCompanies().then(setCompanies)
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name') as string,
      cnpj: formData.get('cnpj') as string
    }

    startTransition(async () => {
      await createCompany(data)
      const updated = await getCompanies()
      setCompanies(updated)
      ;(e.target as HTMLFormElement).reset()
    })
  }

  async function handleDelete(id: string) {
    if (!confirm('Deseja realmente excluir esta empresa?')) return
    startTransition(async () => {
      await deleteCompany(id)
      const updated = await getCompanies()
      setCompanies(updated)
    })
  }

  return (
    <div>
      <div className="header">
        <h1 className="title">Empresas</h1>
        <Link href="/" className="btn btn-outline">
          <ArrowLeft size={20} />
          Voltar
        </Link>
      </div>

      <div className="dashboard-grid">
        {/* Formulário de Cadastro */}
        <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 size={20} /> Nova Empresa
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Nome da Empresa</label>
              <input 
                id="name"
                name="name" 
                type="text" 
                required 
                className="form-input" 
                placeholder="Ex: Empresa Exemplo LTDA"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="cnpj">CNPJ</label>
              <input 
                id="cnpj"
                name="cnpj" 
                type="text" 
                required 
                className="form-input" 
                placeholder="00.000.000/0000-00"
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isPending}>
              <Save size={20} />
              {isPending ? 'Salvando...' : 'Salvar Empresa'}
            </button>
          </form>
        </div>

        {/* Lista de Empresas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {companies.length === 0 ? (
            <div className="glass-panel empty-state">
              <p>Nenhuma empresa cadastrada ainda.</p>
            </div>
          ) : (
            companies.map(comp => (
              <div key={comp.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{comp.name}</h3>
                  <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>CNPJ: {comp.cnpj}</div>
                </div>
                <button 
                  onClick={() => handleDelete(comp.id)} 
                  className="btn btn-danger" 
                  style={{ padding: '0.5rem', borderRadius: '6px' }}
                  disabled={isPending}
                  title="Excluir"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
