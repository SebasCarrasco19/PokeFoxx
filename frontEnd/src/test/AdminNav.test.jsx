import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AdminNav from '../components/AdminNav'

describe('Prueba Unitaria AdminNav', () => {

  test('debe mostrar las opciones exclusivas al Administrador', () => {
    localStorage.setItem(
      'sesion',
      JSON.stringify({
        role: 'Administrador'
      })
    )

    render(
      <MemoryRouter>
        <AdminNav />
      </MemoryRouter>
    )

    expect(screen.getByText('Usuarios')).toBeInTheDocument()
    expect(screen.getByText('Nuevo usuario')).toBeInTheDocument()
    expect(screen.getByText('Categorías')).toBeInTheDocument()
    expect(screen.getByText('Reportes')).toBeInTheDocument()
  })

  test('no debe mostrar las opciones exclusivas al Vendedor', () => {
    localStorage.setItem(
      'sesion',
      JSON.stringify({
        role: 'Vendedor'
      })
    )

    render(
      <MemoryRouter>
        <AdminNav />
      </MemoryRouter>
    )

    expect(screen.queryByText('Usuarios')).not.toBeInTheDocument()
    expect(screen.queryByText('Nuevo usuario')).not.toBeInTheDocument()
    expect(screen.queryByText('Categorías')).not.toBeInTheDocument()
    expect(screen.queryByText('Reportes')).not.toBeInTheDocument()

    expect(screen.getByText('Productos')).toBeInTheDocument()
    expect(screen.getByText('Órdenes')).toBeInTheDocument()
  })

})