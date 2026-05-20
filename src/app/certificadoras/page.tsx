'use client'

import { useState, useTransition, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Save, Trash2, BadgeCheck } from 'lucide-react'
import { createIssuer, deleteIssuer, getIssuers } from '../actions'

interface Issuer {
  id: string
  name: string
}

export default function Certificadoras() {
  const [isPending, startTransition] = useTransition()
  const [issuers, setIssuers] = useState<Issuer[]>([])

  useEffect(() => {
    getIssuers().then(setIssuers)
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name') as string,
    }

    startTransition(async () => {
      await createIssuer(data)
      const updated = await getIssuers()
      setIssuers(updated)
      ;(e.target as HTMLFormElement).reset()
    })
  }

  async function handleDelete(id: string) {
    if (!confirm('Deseja realmente excluir esta certificadora?')) return
    startTransition(async () => {
      await deleteIssuer(id)
      const updated = await getIssuers()
      setIssuers(updated)
    })
  }

  return (
    <div>
      <div className="header">
        <h1 className="title">Certificadoras</h1>
        <Link href="/" className="btn btn-outline">
          <ArrowLeft size={20} />
          Voltar
        </Link>
      </div>

      <div className="dashboard-grid">
        {/* Formulário de Cadastro */}
        <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BadgeCheck size={20} /> Nova Certificadora
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Nome (Ex: A1 SafeWeb, A3...)</label>
              <input 
                id="name"
                name="name" 
                type="text" 
                required 
                className="form-input" 
                placeholder="Ex: A1 SafeWeb"
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isPending}>
              <Save size={20} />
              {isPending ? 'Salvando...' : 'Salvar Certificadora'}
            </button>
          </form>
        </div>

        {/* Lista de Certificadoras */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {issuers.length === 0 ? (
            <div className="glass-panel empty-state">
              <p>Nenhuma certificadora cadastrada ainda.</p>
            </div>
          ) : (
            issuers.map(issuer => (
              <div key={issuer.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>{issuer.name}</h3>
                <button 
                  onClick={() => handleDelete(issuer.id)} 
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
