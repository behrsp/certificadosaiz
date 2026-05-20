import { getCertificates, deleteCertificate } from './actions'
import Link from 'next/link'
import { PlusCircle, Trash2, ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react'
import { differenceInDays, format } from 'date-fns'

export const dynamic = 'force-dynamic';

export default async function Home() {
  const certs = await getCertificates()
  const today = new Date()

  return (
    <div>
      <div className="header">
        <h1 className="title">Monitor de Certificados</h1>
        <Link href="/novo" className="btn btn-primary">
          <PlusCircle size={20} />
          Novo Certificado
        </Link>
      </div>

      {certs.length === 0 ? (
        <div className="glass-panel empty-state">
          <ShieldCheck size={48} className="empty-icon" />
          <h2>Nenhum certificado cadastrado</h2>
          <p>Adicione seu primeiro certificado para começar o monitoramento.</p>
        </div>
      ) : (
        <div className="dashboard-grid">
          {certs.map(cert => {
            const daysLeft = differenceInDays(cert.expirationDate, today)
            
            let status = 'normal'
            if (daysLeft < 0) status = 'expired'
            else if (daysLeft <= 15) status = 'critical'
            else if (daysLeft <= 30) status = 'warning'

            return (
              <div key={cert.id} className={`glass-panel cert-card ${status === 'expired' ? 'expired' : ''}`}>
                <div className={`status-indicator indicator-${status === 'expired' ? 'critical' : status}`} />
                
                <div className="cert-header">
                  <div>
                    <h3 className="cert-name">{cert.name}</h3>
                    <div className="cert-branch">{cert.branch}</div>
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

                <form action={async () => {
                  'use server'
                  await deleteCertificate(cert.id)
                }} style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn btn-danger" style={{ padding: '0.5rem', borderRadius: '6px' }} title="Excluir">
                    <Trash2 size={16} />
                  </button>
                </form>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
