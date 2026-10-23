import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Footer from '../components/Footer'

describe('Prueba Unitaria Footer', () => {

  test('debe mostrar iniciar sesión y registrarse cuando no hay sesión', () => {
    localStorage.clear()

    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    )

    expect(
      screen.getByText('Iniciar sesión')
    ).toBeInTheDocument()

    expect(
      screen.getByText('Registrarse')
    ).toBeInTheDocument()

    expect(
      screen.queryByText('Mi perfil')
    ).not.toBeInTheDocument()

    expect(
      screen.queryByText('Administración')
    ).not.toBeInTheDocument()
  })

  test('debe mostrar Mi perfil cuando la sesión corresponde a un Cliente', () => {
    localStorage.clear()

    localStorage.setItem(
      'sesion',
      JSON.stringify({
        role: 'Cliente'
      })
    )

    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    )

    expect(
      screen.getByText('Mi perfil')
    ).toBeInTheDocument()

    expect(
      screen.queryByText('Iniciar sesión')
    ).not.toBeInTheDocument()

    expect(
      screen.queryByText('Registrarse')
    ).not.toBeInTheDocument()

    expect(
      screen.getByText('Carrito')
    ).toBeInTheDocument()
  })

})