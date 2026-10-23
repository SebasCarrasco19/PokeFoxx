import { describe, expect, test } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Contacto from '../pages/Contacto'

describe('Prueba Unitaria Contacto', () => {

  test('debe enviar el formulario correctamente', async () => {
    render(<Contacto />)

    const nombreInput = screen.getByLabelText(/nombre/i)
    const correoInput = screen.getByLabelText(/correo/i)
    const mensajeInput = screen.getByLabelText(/mensaje/i)
    const boton = screen.getByRole('button', { name: /enviar mensaje/i })

    await userEvent.type(nombreInput, 'Seba Carrasco')
    await userEvent.type(correoInput, 'seba@gmail.com')
    await userEvent.type(mensajeInput, 'Quiero consultar por un producto')

    await userEvent.click(boton)

    expect(
      screen.getByText(/mensaje enviado correctamente/i)
    ).toBeInTheDocument()

    expect(nombreInput).toHaveValue('')
    expect(correoInput).toHaveValue('')
    expect(mensajeInput).toHaveValue('')
  })

  test('debe mostrar error si los campos estan vacios', () => {
    render(<Contacto />)

    const boton = screen.getByRole('button', { name: /enviar mensaje/i })
    const formulario = boton.closest('form')

    fireEvent.submit(formulario)

    expect(
      screen.getByText(/completa todos los campos/i)
    ).toBeInTheDocument()
  })

})