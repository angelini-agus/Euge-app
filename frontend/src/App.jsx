import { useState, useEffect, Suspense, lazy } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'

// Lazy load pages for faster initial load
const NuevaConsulta = lazy(() => import('./pages/NuevaConsulta'))
const BaseDeDatos   = lazy(() => import('./pages/BaseDeDatos'))

function PageLoader() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '60vh', color: '#9CA3AF', fontSize: '0.9rem', gap: '10px'
    }}>
      <i className="pi pi-spin pi-spinner" style={{ fontSize: '1.2rem' }} />
      Cargando...
    </div>
  )
}

function Layout() {
  const { pathname } = useLocation()
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('autoleads_sidebar_collapsed') === 'true'
  })

  const toggleSidebar = () => {
    setCollapsed(prev => {
      const next = !prev
      localStorage.setItem('autoleads_sidebar_collapsed', String(next))
      return next
    })
  }

  // NuevaConsulta usa su propio layout 100vh — no queremos overflow en page-content
  const noScroll = pathname === '/nueva-consulta' || pathname === '/'

  return (
    <div className="app-layout">
      <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />
      <div className={`main-content${collapsed ? ' collapsed' : ''}`}>
        <TopBar collapsed={collapsed} onToggle={toggleSidebar} />
        <main className={`page-content${noScroll ? ' page-no-scroll' : ''}`}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/"               element={<Navigate to="/nueva-consulta" replace />} />
              <Route path="/nueva-consulta" element={<NuevaConsulta />} />
              <Route path="/base-de-datos"  element={<BaseDeDatos />} />
              <Route path="*"               element={<Navigate to="/nueva-consulta" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return <Layout />
}
