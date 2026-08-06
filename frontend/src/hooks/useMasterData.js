import { useState, useEffect, useCallback } from 'react'
import apiClient from '../api/client'

export function useModelos() {
  const [modelos, setModelos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  const cargar = useCallback(() => {
    let isMounted = true
    setLoading(true)
    setError(null)

    apiClient
      .get('/api/modelos')
      .then(res => { if (isMounted) setModelos(res.data) })
      .catch(err => { if (isMounted) setError(err) })
      .finally(() => { if (isMounted) setLoading(false) })

    return () => { isMounted = false }
  }, [])

  useEffect(() => {
    const cleanup = cargar()
    return cleanup
  }, [cargar])

  const crearModelo = async (nombre) => {
    const res = await apiClient.post('/api/modelos', { nombre })
    await cargar()
    return res.data
  }

  const actualizarModelo = async (id, nombre, activo) => {
    const res = await apiClient.put(`/api/modelos/${id}`, { nombre, activo })
    await cargar()
    return res.data
  }

  const alternarEstadoModelo = async (id, activoActual) => {
    const res = await apiClient.put(`/api/modelos/${id}`, {
      nombre: modelos.find(m => m.id === id)?.nombre || '',
      activo: !activoActual
    })
    await cargar()
    return res.data
  }

  return { modelos, loading, error, recargar: cargar, crearModelo, actualizarModelo, alternarEstadoModelo }
}

export function useVendedores() {
  const [vendedores, setVendedores] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)

  const cargar = useCallback(() => {
    let isMounted = true
    setLoading(true)
    setError(null)

    apiClient
      .get('/api/vendedores')
      .then(res => { if (isMounted) setVendedores(res.data) })
      .catch(err => { if (isMounted) setError(err) })
      .finally(() => { if (isMounted) setLoading(false) })

    return () => { isMounted = false }
  }, [])

  useEffect(() => {
    const cleanup = cargar()
    return cleanup
  }, [cargar])

  const crearVendedor = async (nombre) => {
    const res = await apiClient.post('/api/vendedores', { nombre })
    await cargar()
    return res.data
  }

  const actualizarVendedor = async (id, nombre, activo) => {
    const res = await apiClient.put(`/api/vendedores/${id}`, { nombre, activo })
    await cargar()
    return res.data
  }

  const alternarEstadoVendedor = async (id, activoActual) => {
    const res = await apiClient.put(`/api/vendedores/${id}`, {
      nombre: vendedores.find(v => v.id === id)?.nombre || '',
      activo: !activoActual
    })
    await cargar()
    return res.data
  }

  return { vendedores, loading, error, recargar: cargar, crearVendedor, actualizarVendedor, alternarEstadoVendedor }
}
