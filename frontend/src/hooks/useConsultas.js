import { useState, useEffect, useCallback } from 'react'
import apiClient from '../api/client'

/**
 * Fetches dropdown catalog options from the API once on mount.
 * Returns static lists: canales, modelos, asesores, ciudades.
 * Prevents memory leaks if unmounted during fetch.
 */
export function useCatalogos() {
  const [catalogos, setCatalogos] = useState({
    canales:  [],
    modelos:  [],
    asesores: [],
    ciudades: [],
  })
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    apiClient
      .get('/api/catalogos', { signal: controller.signal })
      .then(res => {
        if (isMounted) setCatalogos(res.data)
      })
      .catch(err => {
        if (err.name !== 'CanceledError' && err.name !== 'AbortError' && isMounted) {
          console.error('Error cargando catálogos:', err)
          setError(err)
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [])

  return { catalogos, loading, error }
}

/**
 * Fetches and re-fetches consultas whenever any filter changes.
 * Handles request cancellation (AbortController) to avoid race conditions.
 * @param {object} filtros - { canal, asesorAsignado, fechaDesde, fechaHasta }
 */
export function useConsultas(filtros) {
  const [consultas, setConsultas] = useState([])
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState(null)

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    setLoading(true)
    setError(null)

    const params = new URLSearchParams()
    if (filtros.canal)          params.append('canal',          filtros.canal)
    if (filtros.asesorAsignado) params.append('asesorAsignado', filtros.asesorAsignado)
    if (filtros.fechaDesde)     params.append('fechaDesde',     filtros.fechaDesde)
    if (filtros.fechaHasta)     params.append('fechaHasta',     filtros.fechaHasta)

    apiClient
      .get(`/api/consultas?${params}`, { signal: controller.signal })
      .then(res => {
        if (isMounted) setConsultas(res.data)
      })
      .catch(err => {
        if (err.name !== 'CanceledError' && err.name !== 'AbortError' && isMounted) {
          console.error('Error cargando consultas:', err)
          setError(err)
          setConsultas([])
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [filtros.canal, filtros.asesorAsignado, filtros.fechaDesde, filtros.fechaHasta])

  return { consultas, loading, error }
}
