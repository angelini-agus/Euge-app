import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

export default function TopBar() {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const handleSearch = useCallback(
    (e) => {
      if (e.key === 'Enter' && search.trim()) {
        // Navigate to base-de-datos — future: pass search as query param
        navigate('/base-de-datos')
      }
    },
    [search, navigate]
  )

  return (
    <header className="topbar">
      <div className="topbar-search">
        <i className="pi pi-search" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }} />
        <input
          type="text"
          placeholder="Buscar por cliente o teléfono..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={handleSearch}
          aria-label="Buscar consultas"
        />
      </div>

      <div className="topbar-actions">
        <button className="btn-notif" aria-label="Notificaciones">
          <i className="pi pi-bell" style={{ fontSize: '1.15rem' }} />
          <span className="notif-dot" />
        </button>
      </div>
    </header>
  )
}
