import { NavLink } from 'react-router-dom'

const NAV_GROUPS = [
  {
    section: 'GESTIÓN DIARIA',
    items: [
      {
        to:    '/nueva-consulta',
        label: 'Ingresar Consulta',
        icon:  'pi pi-plus-circle',
      },
      {
        to:    '/base-de-datos',
        label: 'Base de Datos',
        icon:  'pi pi-database',
      },
    ],
  },
  {
    section: 'ADMINISTRACIÓN',
    items: [
      {
        to:       null,
        label:    'Vendedores',
        icon:     'pi pi-users',
        disabled: true,
      },
      {
        to:       null,
        label:    'Métricas (Próximamente)',
        icon:     'pi pi-chart-bar',
        disabled: true,
      },
    ],
  },
]

function NavItem({ item }) {
  if (item.disabled) {
    return (
      <div
        className="sidebar-nav-item"
        style={{ opacity: 0.38, cursor: 'not-allowed', userSelect: 'none' }}
        title="Próximamente"
      >
        <span className="nav-icon-wrap">
          <i className={item.icon} />
        </span>
        {item.label}
      </div>
    )
  }

  return (
    <NavLink
      to={item.to}
      className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`}
    >
      <span className="nav-icon-wrap">
        <i className={item.icon} />
      </span>
      {item.label}
    </NavLink>
  )
}

export default function Sidebar() {
  return (
    <aside className="sidebar">
      {/* ── Logo ── */}
      <div className="sidebar-logo">
        <span className="sidebar-logo-icon">🚗</span>
        <span className="sidebar-logo-text">
          Auto<em>Leads</em>
        </span>
      </div>

      {/* ── Navigation ── */}
      <nav className="sidebar-nav">
        {NAV_GROUPS.map(group => (
          <div key={group.section}>
            <div className="sidebar-section-label">{group.section}</div>
            {group.items.map(item => (
              <NavItem key={item.label} item={item} />
            ))}
          </div>
        ))}
      </nav>

      {/* ── User Footer ── */}
      <div className="sidebar-footer">
        <div className="user-avatar">SJ</div>
        <div className="user-info">
          <div className="user-name">Sarah Johnson</div>
          <div className="user-role">Administradora</div>
        </div>
        <button className="btn-icon-ghost" title="Cerrar sesión">
          <i className="pi pi-sign-out" style={{ fontSize: '0.9rem' }} />
        </button>
      </div>
    </aside>
  )
}
