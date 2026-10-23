import { describe, expect, test, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import CheckoutForm from '../components/CheckoutForm'

describe('Prueba Unitaria CheckoutForm', () => {

  const datos = {
    nombre: 'Cliente Demo',
    run: '222222222',
    correo: 'cliente@gmail.com',
    comuna: 'Santiago',
    direccion: 'Dirección demostrativa 300',
    metodoPago: 'Tarjeta de débito'
  }

  test('debe mostrar los datos recibidos en el formulario', () => {
    render(
      <CheckoutForm
        datos={datos}
        cambiarDato={vi.fn()}
        enviarCompra={vi.fn()}
      />
    )

    expect(screen.getByLabelText(/nombre/i)).toHaveValue('Cliente Demo')
    expect(screen.getByLabelText(/run/i)).toHaveValue('222222222')
    expect(screen.getByLabelText(/correo/i)).toHaveValue('cliente@gmail.com')
    expect(screen.getByLabelText(/comuna/i)).toHaveValue('Santiago')
    expect(screen.getByLabelText(/dirección/i)).toHaveValue('Dirección demostrativa 300')
    expect(screen.getByLabelText(/método de pago/i)).toHaveValue('Tarjeta de débito')
  })

  test('debe ejecutar los eventos al modificar y enviar el formulario', () => {
    const cambiarDato = vi.fn()
    const enviarCompra = vi.fn((e) => e.preventDefault())

    render(
      <CheckoutForm
        datos={datos}
        cambiarDato={cambiarDato}
        enviarCompra={enviarCompra}
      />
    )

    const nombreInput = screen.getByLabelText(/nombre/i)
    const boton = screen.getByRole('button', { name: /confirmar compra/i })

    fireEvent.change(nombreInput, {
      target: { value: 'Otro Nombre' }
    })

    expect(cambiarDato).toHaveBeenCalledTimes(1)

    fireEvent.click(boton)

    expect(enviarCompra).toHaveBeenCalledTimes(1)
  })

})