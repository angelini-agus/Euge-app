import { useState, useEffect, useCallback } from 'react'
import apiClient from '../api/client'

/**
 * Fetches dropdown catalog options from the API once on mount.
 * Returns static lists: canales, modelos, asesores, ciudades.
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
    apiClient
      .get('/api/catalogos')
      .then(res => setCatalogos(res.data))
      .catch(err => {
        console.error('Error cargando catálogos:', err)
        setError(err)
      })
      .finally(() => setLoading(false))
  }, [])

  return { catalogos, loading, error }
}

/**
 * Fetches and re-fetches consultas whenever any filter changes.
 * @param {object} filtros - { canal, asesorAsignado, fechaDesde, fechaHasta }
 */
export function useConsultas(filtros) {
  const [consultas, setConsultas] = useState([])
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState(null)

  const cargar = useCallback(() => {
    setLoading(true)
    setError(null)

    const params = new URLSearchParams()
    if (filtros.canal)          params.append('canal',          filtros.canal)
    if (filtros.asesorAsignado) params.append('asesorAsignado', filtros.asesorAsignado)
    if (filtros.fechaDesde)     params.append('fechaDesde',     filtros.fechaDesde)
    if (filtros.fechaHasta)     params.append('fechaHasta',     filtros.fechaHasta)

    apiClient
      .get(`/api/consultas?${params}`)
      .then(res => setConsultas(res.data))
      .catch(err => {
        console.error('Error cargando consultas:', err)
        setError(err)
        setConsultas([])
      })
      .finally(() => setLoading(false))
  }, [filtros.canal, filtros.asesorAsignado, filtros.fechaDesde, filtros.fechaHasta])

  useEffect(() => { cargar() }, [cargar])

  return { consultas, loading, error, recargar: cargar }
}
