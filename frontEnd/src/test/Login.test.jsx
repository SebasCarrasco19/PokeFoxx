import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Login from '../pages/Login'

describe('Prueba Unitaria Login', () => {

  test('debe mostrar error cuando las credenciales son incorrectas', async () => {
    localStorage.clear()

    localStorage.setItem(
      'usuarios',
      JSON.stringify([
        {
          run: '222222222',
          firstName: 'Cliente',
          lastName: 'Demo',
          email: 'cliente@gmail.com',
          password: 'Clie123',
          role: 'Cliente'
        }
      ])
    )

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )

    const correoInput = screen.getByLabelText(/correo/i)
    const passwordInput = screen.getByLabelText(/contraseña/i)
    const boton = screen.getByRole('button', { name: /iniciar sesión/i })

    await userEvent.type(correoInput, 'cliente@gmail.com')
    await userEvent.type(passwordInput, 'incorrecta')
    await userEvent.click(boton)

    expect(
      screen.getByText(/correo o contraseña incorrectos/i)
    ).toBeInTheDocument()

    expect(
      localStorage.getItem('sesion')
    ).toBeNull()
  })

  test('debe guardar la sesión cuando las credenciales son correctas', async () => {
    localStorage.clear()

    localStorage.setItem(
      'usuarios',
      JSON.stringify([
        {
          run: '222222222',
          firstName: 'Cliente',
          lastName: 'Demo',
          email: 'cliente@gmail.com',
          password: 'Clie123',
          role: 'Cliente'
        }
      ])
    )

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )

    const correoInput = screen.getByLabelText(/correo/i)
    const passwordInput = screen.getByLabelText(/contraseña/i)
    const boton = screen.getByRole('button', { name: /iniciar sesión/i })

    await userEvent.type(correoInput, 'cliente@gmail.com')
    await userEvent.type(passwordInput, 'Clie123')
    await userEvent.click(boton)

    const sesion =
      JSON.parse(localStorage.getItem('sesion'))

    expect(sesion).not.toBeNull()
    expect(sesion.email).toBe('cliente@gmail.com')
    expect(sesion.role).toBe('Cliente')
    expect(sesion.firstName).toBe('Cliente')
  })

})