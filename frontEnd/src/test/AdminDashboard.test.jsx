import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AdminDashboard from '../pages/admin/AdminDashboard'

describe('Prueba Unitaria AdminDashboard', () => {

  test('debe mostrar los datos calculados para el Administrador', () => {
    localStorage.clear()

    localStorage.setItem(
      'sesion',
      JSON.stringify({
        firstName: 'Seba',
        role: 'Administrador'
      })
    )

    localStorage.setItem(
      'productos',
      JSON.stringify([
        { id: 1, stock: 0, criticalStock: null },
        { id: 2, stock: 10, criticalStock: 5 }
      ])
    )

    localStorage.setItem(
      'usuarios',
      JSON.stringify([
        { id: 1 },
        { id: 2 }
      ])
    )

    localStorage.setItem(
      'ordenes',
      JSON.stringify([
        { id: 1, total: 10000 },
        { id: 2, total: 5000 }
      ])
    )

    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    )

    expect(screen.getByText('Hola, Seba')).toBeInTheDocument()

    const productos = screen
      .getByText('Productos')
      .closest('.stat-card')

    const usuarios = screen
      .getByText('Usuarios')
      .closest('.stat-card')

    const ordenes = screen
      .getByText('Órdenes')
      .closest('.stat-card')

    expect(productos).toHaveTextContent('2')
    expect(usuarios).toHaveTextContent('2')
    expect(ordenes).toHaveTextContent('2')

    expect(
      screen.getByText('Ver productos críticos')
    ).toBeInTheDocument()
  })

  test('no debe mostrar la tarjeta Usuarios al Vendedor', () => {
    localStorage.clear()

    localStorage.setItem(
      'sesion',
      JSON.stringify({
        firstName: 'Daniel',
        role: 'Vendedor'
      })
    )

    localStorage.setItem(
      'productos',
      JSON.stringify([])
    )

    localStorage.setItem(
      'usuarios',
      JSON.stringify([
        { id: 1 },
        { id: 2 }
      ])
    )

    localStorage.setItem(
      'ordenes',
      JSON.stringify([])
    )

    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    )

    expect(
      screen.getByText('Hola, Daniel')
    ).toBeInTheDocument()

    expect(
      screen.queryByText('Usuarios')
    ).not.toBeInTheDocument()

    expect(
      screen.getByText('Productos')
    ).toBeInTheDocument()

    expect(
      screen.getByText('Órdenes')
    ).toBeInTheDocument()
  })

})