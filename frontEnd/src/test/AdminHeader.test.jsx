import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import AdminHeader from '../components/AdminHeader'

describe('Prueba Unitaria AdminHeader', () => {

  test('debe mostrar los datos del usuario cuando existe sesión', () => {
    localStorage.clear()

    localStorage.setItem(
      'sesion',
      JSON.stringify({
        firstName: 'Seba',
        lastName: 'Carrasco',
        role: 'Administrador'
      })
    )

    render(<AdminHeader />)

    expect(
      screen.getByText('Administración')
    ).toBeInTheDocument()

    expect(
      screen.getByText('Seba Carrasco · Administrador')
    ).toBeInTheDocument()
  })

  test('debe mostrar usuario no identificado cuando no existe sesión', () => {
    localStorage.clear()

    render(<AdminHeader />)

    expect(
      screen.getByText('Usuario no identificado')
    ).toBeInTheDocument()
  })

})