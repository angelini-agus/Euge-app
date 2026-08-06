import { useState, useEffect, useCallback, useRef } from 'react'
import apiClient from '../api/client'

// ── useModelos ─────────────────────────────────────────────────────────────────

export function useModelos() {
  const [modelos, setModelos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true
    return () => { isMountedRef.current = false }
  }, [])

  const cargar = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiClient.get('/api/modelos')
      if (isMountedRef.current) setModelos(res.data)
    } catch (err) {
      if (isMountedRef.current) setError(err)
      throw err
    } finally {
      if (isMountedRef.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    cargar()
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
    const modelo = modelos.find(m => m.id === id)
    const res = await apiClient.put(`/api/modelos/${id}`, {
      nombre: modelo?.nombre || '',
      activo: !activoActual
    })
    await cargar()
    return res.data
  }

  return { modelos, loading, error, recargar: cargar, crearModelo, actualizarModelo, alternarEstadoModelo }
}

// ── useVendedores ──────────────────────────────────────────────────────────────

export function useVendedores() {
  const [vendedores, setVendedores] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true
    return () => { isMountedRef.current = false }
  }, [])

  const cargar = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiClient.get('/api/vendedores')
      if (isMountedRef.current) setVendedores(res.data)
    } catch (err) {
      if (isMountedRef.current) setError(err)
      throw err
    } finally {
      if (isMountedRef.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    cargar()
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
    const vendedor = vendedores.find(v => v.id === id)
    const res = await apiClient.put(`/api/vendedores/${id}`, {
      nombre: vendedor?.nombre || '',
      activo: !activoActual
    })
    await cargar()
    return res.data
  }

  return { vendedores, loading, error, recargar: cargar, crearVendedor, actualizarVendedor, alternarEstadoVendedor }
}
