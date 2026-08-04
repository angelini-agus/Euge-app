import { Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
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

export default function App() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <TopBar />
        <main className="page-content">
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
