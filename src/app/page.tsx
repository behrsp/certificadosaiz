import { getCertificates, deleteCertificate } from './actions'
import Link from 'next/link'
import { PlusCircle, Trash2, Edit2, ShieldAlert, ShieldCheck, AlertTriangle, Building2, BadgeCheck } from 'lucide-react'
import { differenceInCalendarDays, format } from 'date-fns'

export const dynamic = 'force-dynamic';

export default async function Home() {
  const certs = await getCertificates()
  const today = new Date()

  const statsByCnpj = certs.reduce((acc, cert) => {
    const key = `${cert.company.name} (${cert.company.cnpj})`
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const maxCount = Math.max(...Object.values(statsByCnpj), 1)

  return (
    <div>
      <div className="header">
        <h1 className="title">Monitor de Certificados</h1>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link href="/empresas" className="btn btn-outline">
            <Building2 size={20} />
            Empresas
          </Link>
          <Link href="/certificadoras" className="btn btn-outline">
            <BadgeCheck size={20} />
            Certificadoras
          </Link>
          <Link href="/novo" className="btn btn-primary">
            <PlusCircle size={20} />
            Novo Certificado
          </Link>
        </div>
      </div>

      {certs.length > 0 && (
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '1.25rem', color: '#f8fafc' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
            Certificados por Empresa
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Object.entries(statsByCnpj).sort((a, b) => b[1] - a[1]).map(([label, count]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '220px', fontSize: '0.875rem', color: '#cbd5e1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: '500' }} title={label}>
                  {label}
                </div>
                <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${(count / maxCount) * 100}%`, backgroundColor: '#8b5cf6', height: '100%', borderRadius: '4px' }} />
                </div>
                <div style={{ width: '30px', textAlign: 'right', fontWeight: 'bold', color: '#f8fafc' }}>
                  {count}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {certs.length === 0 ? (
        <div className="glass-panel empty-state">
          <ShieldCheck size={48} className="empty-icon" />
          <h2>Nenhum certificado cadastrado</h2>
          <p>Adicione sua primeira Empresa e Certificadora para começar o monitoramento.</p>
        </div>
      ) : (
        <div className="dashboard-grid">
          {certs.map(cert => {
            const daysLeft = differenceInCalendarDays(cert.expirationDate, today)
            
            let status = 'normal'
            if (daysLeft < 0) status = 'expired'
            else if (daysLeft <= 15) status = 'critical'
            else if (daysLeft <= 30) status = 'warning'

            return (
              <div key={cert.id} className={`glass-panel cert-card ${status === 'expired' ? 'expired' : ''}`}>
                <div className={`status-indicator indicator-${status === 'expired' ? 'critical' : status}`} />
                
                <div className="cert-header">
                  <div>
                    <h3 className="cert-name">{cert.company.name}</h3>
                    <div className="cert-branch">Filial: {cert.branch}</div>
                  </div>
                  
                  {status === 'expired' && (
                    <span className="status-badge status-critical">
                      <ShieldAlert size={14} /> Vencido
                    </span>
                  )}
                  {status === 'critical' && (
                    <span className="status-badge status-critical">
                      <AlertTriangle size={14} /> Crítico ({daysLeft} dias)
                    </span>
                  )}
                  {status === 'warning' && (
                    <span className="status-badge status-warning">
                      <AlertTriangle size={14} /> Atenção ({daysLeft} dias)
                    </span>
                  )}
                  {status === 'normal' && (
                    <span className="status-badge status-normal">
                      <ShieldCheck size={14} /> Normal
                    </span>
                  )}
                </div>

                <div className="cert-details">
                  <div className="detail-row">
                    <span className="detail-label">CNPJ:</span>
                    <span>{cert.company.cnpj}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Certificadora:</span>
                    <span>{cert.issuer.name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Senha:</span>
                    <span>{cert.password}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Instalação:</span>
                    <span>{format(cert.installDate, 'dd/MM/yyyy')}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Vencimento:</span>
                    <span style={status === 'expired' ? { color: '#f87171', fontWeight: 'bold' } : {}}>
                      {format(cert.expirationDate, 'dd/MM/yyyy')}
                    </span>
                  </div>
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                  <Link href={`/editar/${cert.id}`} className="btn btn-outline" style={{ padding: '0.5rem', borderRadius: '6px' }} title="Editar">
                    <Edit2 size={16} />
                  </Link>
                  <form action={async () => {
                    'use server'
                    await deleteCertificate(cert.id)
                  }}>
                    <button type="submit" className="btn btn-danger" style={{ padding: '0.5rem', borderRadius: '6px' }} title="Excluir">
                      <Trash2 size={16} />
                    </button>
                  </form>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
