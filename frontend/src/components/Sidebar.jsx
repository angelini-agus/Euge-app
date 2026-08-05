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

function NavItem({ item, collapsed }) {
  if (item.disabled) {
    return (
      <div
        className="sidebar-nav-item"
        style={{ opacity: 0.38, cursor: 'not-allowed', userSelect: 'none' }}
        title={`${item.label} (Próximamente)`}
      >
        <span className="nav-icon-wrap">
          <i className={item.icon} />
        </span>
        {!collapsed && <span className="nav-label-text">{item.label}</span>}
      </div>
    )
  }

  return (
    <NavLink
      to={item.to}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`}
    >
      <span className="nav-icon-wrap">
        <i className={item.icon} />
      </span>
      {!collapsed && <span className="nav-label-text">{item.label}</span>}
    </NavLink>
  )
}

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      {/* ── Logo + Toggle Button ── */}
      <div className="sidebar-logo">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="sidebar-logo-icon">🚗</span>
          {!collapsed && (
            <span className="sidebar-logo-text">
              Auto<em>Leads</em>
            </span>
          )}
        </div>
        <button
          className="btn-toggle-sidebar"
          onClick={onToggle}
          title={collapsed ? "Ampliar menú" : "Guardar menú"}
          aria-label={collapsed ? "Ampliar menú lateral" : "Guardar menú lateral"}
          type="button"
        >
          <i className={collapsed ? "pi pi-chevron-right" : "pi pi-chevron-left"} />
        </button>
      </div>

      {/* ── Navigation ── */}
      <nav className="sidebar-nav">
        {NAV_GROUPS.map(group => (
          <div key={group.section}>
            {!collapsed && <div className="sidebar-section-label">{group.section}</div>}
            {group.items.map(item => (
              <NavItem key={item.label} item={item} collapsed={collapsed} />
            ))}
          </div>
        ))}
      </nav>

      {/* ── User Footer ── */}
      <div className="sidebar-footer">
        <div className="user-avatar" title="Sarah Johnson (Administradora)">SJ</div>
        {!collapsed && (
          <>
            <div className="user-info">
              <div className="user-name">Sarah Johnson</div>
              <div className="user-role">Administradora</div>
            </div>
            <button className="btn-icon-ghost" title="Cerrar sesión" type="button">
              <i className="pi pi-sign-out" style={{ fontSize: '0.9rem' }} />
            </button>
          </>
        )}
      </div>
    </aside>
  )
}
