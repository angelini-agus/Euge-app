import { useState, useRef } from 'react'
import { DataTable }  from 'primereact/datatable'
import { Column }     from 'primereact/column'
import { Dialog }     from 'primereact/dialog'
import { InputText }  from 'primereact/inputtext'
import { Toast }      from 'primereact/toast'
import { useModelos, useVendedores } from '../hooks/useMasterData'

export default function Configuracion() {
  const { modelos, loading: loadingModelos, crearModelo, actualizarModelo, alternarEstadoModelo } = useModelos()
  const { vendedores, loading: loadingVendedores, crearVendedor, actualizarVendedor, alternarEstadoVendedor } = useVendedores()

  const toast = useRef(null)

  // Dialog State
  const [modelDialog, setModelDialog] = useState(false)
  const [vendorDialog, setVendorDialog] = useState(false)

  const [currentModel, setCurrentModel] = useState({ id: null, nombre: '', activo: true })
  const [currentVendor, setCurrentVendor] = useState({ id: null, nombre: '', activo: true })
  const [saving, setSaving] = useState(false)

  // Handlers for Modelos
  const openNewModel = () => {
    setCurrentModel({ id: null, nombre: '', activo: true })
    setModelDialog(true)
  }
  const openEditModel = (mod) => {
    setCurrentModel({ ...mod })
    setModelDialog(true)
  }
  const saveModel = async () => {
    if (!currentModel.nombre.trim()) {
      toast.current.show({ severity: 'warn', summary: 'Campo requerido', detail: 'Ingresá el nombre del modelo.', life: 3000 })
      return
    }
    setSaving(true)
    try {
      if (currentModel.id) {
        await actualizarModelo(currentModel.id, currentModel.nombre, currentModel.activo)
        toast.current.show({ severity: 'success', summary: 'Modelo actualizado', detail: `El modelo "${currentModel.nombre}" fue modificado.`, life: 3000 })
      } else {
        await crearModelo(currentModel.nombre)
        toast.current.show({ severity: 'success', summary: 'Modelo creado', detail: `Se creó el modelo "${currentModel.nombre}".`, life: 3000 })
      }
      setModelDialog(false)
    } catch (err) {
      const msg = err.response?.data?.error || 'No se pudo guardar el modelo.'
      toast.current.show({ severity: 'error', summary: 'Error', detail: msg, life: 4000 })
    } finally {
      setSaving(false)
    }
  }
  const handleToggleModel = async (mod) => {
    try {
      await alternarEstadoModelo(mod.id, mod.activo)
      toast.current.show({
        severity: 'info',
        summary: mod.activo ? 'Modelo oculto' : 'Modelo activado',
        detail: `El modelo "${mod.nombre}" fue ${mod.activo ? 'desactivado' : 'activado'}.`,
        life: 3000
      })
    } catch {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo cambiar el estado del modelo.', life: 4000 })
    }
  }

  // Handlers for Vendedores
  const openNewVendor = () => {
    setCurrentVendor({ id: null, nombre: '', activo: true })
    setVendorDialog(true)
  }
  const openEditVendor = (ven) => {
    setCurrentVendor({ ...ven })
    setVendorDialog(true)
  }
  const saveVendor = async () => {
    if (!currentVendor.nombre.trim()) {
      toast.current.show({ severity: 'warn', summary: 'Campo requerido', detail: 'Ingresá el nombre del vendedor.', life: 3000 })
      return
    }
    setSaving(true)
    try {
      if (currentVendor.id) {
        await actualizarVendedor(currentVendor.id, currentVendor.nombre, currentVendor.activo)
        toast.current.show({ severity: 'success', summary: 'Vendedor actualizado', detail: `El vendedor "${currentVendor.nombre}" fue modificado.`, life: 3000 })
      } else {
        await crearVendedor(currentVendor.nombre)
        toast.current.show({ severity: 'success', summary: 'Vendedor creado', detail: `Se creó el vendedor "${currentVendor.nombre}".`, life: 3000 })
      }
      setVendorDialog(false)
    } catch (err) {
      const msg = err.response?.data?.error || 'No se pudo guardar el vendedor.'
      toast.current.show({ severity: 'error', summary: 'Error', detail: msg, life: 4000 })
    } finally {
      setSaving(false)
    }
  }
  const handleToggleVendor = async (ven) => {
    try {
      await alternarEstadoVendedor(ven.id, ven.activo)
      toast.current.show({
        severity: 'info',
        summary: ven.activo ? 'Vendedor oculto' : 'Vendedor activado',
        detail: `El vendedor "${ven.nombre}" fue ${ven.activo ? 'desactivado' : 'activado'}.`,
        life: 3000
      })
    } catch {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo cambiar el estado del vendedor.', life: 4000 })
    }
  }

  // Cell Renderers
  const statusBodyTemplate = (rowData) => {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: '12px',
          fontSize: '0.78rem',
          fontWeight: 600,
          background: rowData.activo ? '#E8F5E9' : '#F3F4F6',
          color: rowData.activo ? '#2E7D32' : '#6B7280'
        }}
      >
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: rowData.activo ? '#22C55E' : '#9CA3AF' }} />
        {rowData.activo ? 'Activo' : 'Oculto (Inactivo)'}
      </span>
    )
  }

  const modelActionTemplate = (rowData) => {
    return (
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <button
          className="btn-secondary"
          onClick={() => openEditModel(rowData)}
          type="button"
          style={{ padding: '6px 12px', fontSize: '0.8rem' }}
          title="Editar nombre"
        >
          <i className="pi pi-pencil" />
          Editar
        </button>
        <button
          className={rowData.activo ? "btn-secondary" : "btn-primary"}
          onClick={() => handleToggleModel(rowData)}
          type="button"
          style={{ padding: '6px 12px', fontSize: '0.8rem' }}
          title={rowData.activo ? "Desactivar / Ocultar" : "Reactivar"}
        >
          <i className={rowData.activo ? "pi pi-eye-slash" : "pi pi-eye"} />
          {rowData.activo ? 'Ocultar' : 'Activar'}
        </button>
      </div>
    )
  }

  const vendorActionTemplate = (rowData) => {
    return (
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <button
          className="btn-secondary"
          onClick={() => openEditVendor(rowData)}
          type="button"
          style={{ padding: '6px 12px', fontSize: '0.8rem' }}
          title="Editar nombre"
        >
          <i className="pi pi-pencil" />
          Editar
        </button>
        <button
          className={rowData.activo ? "btn-secondary" : "btn-primary"}
          onClick={() => handleToggleVendor(rowData)}
          type="button"
          style={{ padding: '6px 12px', fontSize: '0.8rem' }}
          title={rowData.activo ? "Desactivar / Ocultar" : "Reactivar"}
        >
          <i className={rowData.activo ? "pi pi-eye-slash" : "pi pi-eye"} />
          {rowData.activo ? 'Ocultar' : 'Activar'}
        </button>
      </div>
    )
  }

  return (
    <>
      <Toast ref={toast} position="top-right" />

      {/* Header */}
      <div className="page-header" style={{ marginBottom: 24 }}>
        <h1>Administración de Datos Maestros</h1>
        <p>Gestioná los Vendedores y Modelos de vehículos disponibles en los formularios del CRM.</p>
      </div>

      {/* Grid 2 Columnas para Vendedores y Modelos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px' }}>

        {/* Card 1: Gestión de Vendedores */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="section-icon" style={{ background: '#EDE7F6', color: '#673AB7' }}>
                <i className="pi pi-users" />
              </span>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Vendedores / Asesores</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{vendedores.length} vendedores registrados</span>
              </div>
            </div>
            <button className="btn-primary" onClick={openNewVendor} type="button" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
              <i className="pi pi-plus" />
              Nuevo Vendedor
            </button>
          </div>

          <DataTable value={vendedores} loading={loadingVendedores} paginator rows={6} tableStyle={{ width: '100%' }}>
            <Column field="nombre" header="Nombre del Asesor" sortable style={{ fontWeight: 600 }} />
            <Column field="activo" header="Estado" body={statusBodyTemplate} style={{ width: '150px' }} />
            <Column body={vendorActionTemplate} style={{ width: '210px', textAlign: 'right' }} />
          </DataTable>
        </div>

        {/* Card 2: Gestión de Modelos */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="section-icon" style={{ background: '#E8F5E9', color: '#2E7D32' }}>
                <i className="pi pi-car" />
              </span>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Modelos de Vehículos</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{modelos.length} modelos registrados</span>
              </div>
            </div>
            <button className="btn-primary" onClick={openNewModel} type="button" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
              <i className="pi pi-plus" />
              Nuevo Modelo
            </button>
          </div>

          <DataTable value={modelos} loading={loadingModelos} paginator rows={6} tableStyle={{ width: '100%' }}>
            <Column field="nombre" header="Modelo" sortable style={{ fontWeight: 600 }} />
            <Column field="activo" header="Estado" body={statusBodyTemplate} style={{ width: '150px' }} />
            <Column body={modelActionTemplate} style={{ width: '210px', textAlign: 'right' }} />
          </DataTable>
        </div>

      </div>

      {/* Modal Dialog: Crear/Editar Modelo */}
      <Dialog
        visible={modelDialog}
        style={{ width: '420px' }}
        header={currentModel.id ? "Editar Modelo" : "Nuevo Modelo de Vehículo"}
        modal
        className="p-fluid"
        onHide={() => setModelDialog(false)}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '10px' }}>
          <div className="nc-field">
            <label className="field-label field-required" htmlFor="modeloNombre">Nombre del Modelo</label>
            <InputText
              id="modeloNombre"
              value={currentModel.nombre}
              onChange={e => setCurrentModel(prev => ({ ...prev, nombre: e.target.value }))}
              placeholder="Ej. TANK 700"
              className="nc-input"
              autoFocus
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <button className="btn-secondary" onClick={() => setModelDialog(false)} type="button">
              Cancelar
            </button>
            <button className="btn-primary" onClick={saveModel} disabled={saving} type="button">
              <i className={saving ? "pi pi-spin pi-spinner" : "pi pi-check"} />
              {saving ? 'Guardando...' : 'Guardar Modelo'}
            </button>
          </div>
        </div>
      </Dialog>

      {/* Modal Dialog: Crear/Editar Vendedor */}
      <Dialog
        visible={vendorDialog}
        style={{ width: '420px' }}
        header={currentVendor.id ? "Editar Vendedor" : "Nuevo Vendedor / Asesor"}
        modal
        className="p-fluid"
        onHide={() => setVendorDialog(false)}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '10px' }}>
          <div className="nc-field">
            <label className="field-label field-required" htmlFor="vendedorNombre">Nombre del Asesor</label>
            <InputText
              id="vendedorNombre"
              value={currentVendor.nombre}
              onChange={e => setCurrentVendor(prev => ({ ...prev, nombre: e.target.value }))}
              placeholder="Ej. Santiago Benítez"
              className="nc-input"
              autoFocus
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <button className="btn-secondary" onClick={() => setVendorDialog(false)} type="button">
              Cancelar
            </button>
            <button className="btn-primary" onClick={saveVendor} disabled={saving} type="button">
              <i className={saving ? "pi pi-spin pi-spinner" : "pi pi-check"} />
              {saving ? 'Guardando...' : 'Guardar Vendedor'}
            </button>
          </div>
        </div>
      </Dialog>
    </>
  )
}
