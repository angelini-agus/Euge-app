import { useState, useRef } from 'react'
import { Dropdown }       from 'primereact/dropdown'
import { InputText }      from 'primereact/inputtext'
import { InputTextarea }  from 'primereact/inputtextarea'
import { Toast }          from 'primereact/toast'
import { useCatalogos }   from '../hooks/useConsultas'
import apiClient          from '../api/client'

const EMPTY_FORM = {
  canal:          null,
  modelo:         null,
  nombreCliente:  '',
  telefono:       '',
  ciudad:         '',
  asesorAsignado: null,
  observaciones:  '',
}

const toOptions = (arr) => arr.map(v => ({ label: v, value: v }))

/** Icon + Input sin superposición — posicionamiento manual */
function IconInput({ icon, id, value, onChange, placeholder, keyfilter }) {
  return (
    <div className="icon-input-wrap">
      <i className={`icon-input-icon ${icon}`} />
      <InputText
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        keyfilter={keyfilter}
        className="icon-input-field"
      />
    </div>
  )
}

export default function NuevaConsulta() {
  const [form,    setForm]    = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(false)
  const { catalogos }         = useCatalogos()
  const toast                 = useRef(null)

  const set = (field, val) => setForm(prev => ({ ...prev, [field]: val }))

  const validate = () => {
    const missing = []
    if (!form.canal)              missing.push('Canal de ingreso')
    if (!form.modelo)             missing.push('Modelo de interés')
    if (!form.telefono?.trim()) {
      missing.push('Teléfono')
    } else {
      const digits = form.telefono.replace(/\D/g, '')
      if (digits.length < 7 || digits.length > 15) {
        missing.push('Teléfono válido (7 a 15 dígitos)')
      }
    }
    if (!form.asesorAsignado)     missing.push('Asesor asignado')
    return missing
  }

  const handleSubmit = async () => {
    const missing = validate()
    if (missing.length) {
      toast.current.show({ severity: 'warn', summary: 'Campos requeridos',
        detail: `Completá: ${missing.join(', ')}.`, life: 4000 })
      return
    }
    setLoading(true)
    try {
      await apiClient.post('/api/consultas', {
        canal:          form.canal,
        modelo:         form.modelo,
        nombreCliente:  form.nombreCliente.trim(),
        telefono:       form.telefono.trim(),
        ciudad:         form.ciudad.trim() || null,
        asesorAsignado: form.asesorAsignado,
        observaciones:  form.observaciones.trim() || null,
      })
      toast.current.show({ severity: 'success', summary: '¡Lead guardado!',
        detail: `Consulta de ${form.nombreCliente || 'cliente'} registrada correctamente.`, life: 3500 })
      setForm(EMPTY_FORM)
    } catch (err) {
      const msg = err.response?.data?.error || 'No se pudo guardar. Verificá la conexión.'
      toast.current.show({ severity: 'error', summary: 'Error al guardar', detail: msg, life: 5000 })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Toast ref={toast} position="top-right" />

      {/* Contenedor principal que ocupa exactamente el espacio disponible sin scroll */}
      <div className="nc-layout">

        {/* ── Header ── */}
        <div className="nc-header">
          <h1>Nueva Consulta</h1>
          <p>Registrá rápidamente un nuevo contacto para derivarlo a ventas.</p>
        </div>

        {/* ── Fila superior: Sección 1 + Sección 2 lado a lado ── */}
        <div className="nc-top-row">

          {/* Sección 1 — Origen */}
          <div className="card nc-card">
            <div className="card-section-header">
              <span className="section-icon" style={{ background: '#EDE7F6', color: '#673AB7' }}>
                <i className="pi pi-filter" />
              </span>
              1. Origen de la Consulta
            </div>
            <div className="form-grid-2">
              <div className="nc-field">
                <label className="field-label field-required">Canal de Ingreso</label>
                <Dropdown
                  id="canal"
                  value={form.canal}
                  options={toOptions(catalogos.canales)}
                  onChange={e => set('canal', e.value)}
                  placeholder="Seleccione el canal..."
                  className="nc-dropdown"
                  filter
                />
              </div>
              <div className="nc-field">
                <label className="field-label field-required">Modelo de Interés</label>
                <Dropdown
                  id="modelo"
                  value={form.modelo}
                  options={toOptions(catalogos.modelos)}
                  onChange={e => set('modelo', e.value)}
                  placeholder="Seleccione vehículo..."
                  className="nc-dropdown"
                  filter
                />
              </div>
            </div>
          </div>

          {/* Sección 2 — Datos del cliente */}
          <div className="card nc-card">
            <div className="card-section-header">
              <span className="section-icon" style={{ background: '#E8F5E9', color: '#2E7D32' }}>
                <i className="pi pi-user" />
              </span>
              2. Datos del Cliente
            </div>
            <div className="form-grid-2">
              <div className="nc-field" style={{ gridColumn: '1 / -1' }}>
                <label className="field-label" htmlFor="nombreCliente">Nombre Completo</label>
                <InputText
                  id="nombreCliente"
                  value={form.nombreCliente}
                  onChange={e => set('nombreCliente', e.target.value)}
                  placeholder="Ej. Fabián Davalle"
                  className="nc-input"
                />
              </div>
              <div className="nc-field">
                <label className="field-label field-required" htmlFor="telefono">Teléfono</label>
                <IconInput
                  id="telefono"
                  icon="pi pi-phone"
                  value={form.telefono}
                  onChange={e => set('telefono', e.target.value)}
                  placeholder="3415061333"
                  keyfilter={/[\d\-\+\s\(\)]/}
                />
              </div>
              <div className="nc-field">
                <label className="field-label" htmlFor="ciudad">Ciudad / Localidad</label>
                <IconInput
                  id="ciudad"
                  icon="pi pi-map-marker"
                  value={form.ciudad}
                  onChange={e => set('ciudad', e.target.value)}
                  placeholder="Ej. Rosario"
                />
              </div>
            </div>
          </div>

        </div>

        {/* ── Sección 3 — Derivación y notas (flex-grow) ── */}
        <div className="card nc-card nc-section3">
          <div className="card-section-header">
            <span className="section-icon" style={{ background: '#FFF3E0', color: '#E65100' }}>
              <i className="pi pi-share-alt" />
            </span>
            3. Derivación y Notas
          </div>
          <div className="nc-section3-body">
            <div className="nc-field" style={{ flex: '0 0 260px' }}>
              <label className="field-label field-required" htmlFor="asesor">Asesor Asignado</label>
              <Dropdown
                id="asesor"
                value={form.asesorAsignado}
                options={toOptions(catalogos.asesores)}
                onChange={e => set('asesorAsignado', e.value)}
                placeholder="Seleccione vendedor..."
                className="nc-dropdown"
              />
            </div>
            <div className="nc-field nc-obs-field">
              <label className="field-label" htmlFor="observaciones">Observaciones</label>
              <InputTextarea
                id="observaciones"
                value={form.observaciones}
                onChange={e => set('observaciones', e.target.value)}
                placeholder="Ej. Cliente solicita cotización de usado por WhatsApp y plazos de financiación..."
                className="nc-textarea"
                autoResize={false}
              />
            </div>
          </div>
        </div>

        {/* ── Acciones ── */}
        <div className="nc-actions">
          <button
            className="btn-secondary"
            onClick={() => setForm(EMPTY_FORM)}
            disabled={loading}
            type="button"
          >
            Limpiar Formulario
          </button>
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={loading}
            type="button"
            id="guardar-lead-btn"
          >
            <i className={loading ? 'pi pi-spin pi-spinner' : 'pi pi-check'} />
            {loading ? 'Guardando...' : 'Guardar Lead'}
          </button>
        </div>

      </div>
    </>
  )
}
