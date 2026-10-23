import { describe, expect, test, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import CartItem from '../components/CartItem'

describe('Prueba Unitaria CartItem', () => {

  const item = {
    id: 1,
    name: 'Pikachu',
    category: 'Cartas individuales',
    price: 10000,
    cantidad: 2,
    image: 'pikachu.jpg'
  }

  test('debe mostrar los datos y calcular el subtotal', () => {
    render(
      <CartItem
        item={item}
        aumentar={vi.fn()}
        disminuir={vi.fn()}
        eliminar={vi.fn()}
      />
    )

    expect(screen.getByText('Pikachu')).toBeInTheDocument()
    expect(screen.getByText('Cartas individuales')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('$20.000')).toBeInTheDocument()
  })

  test('debe ejecutar aumentar y eliminar con el id del producto', () => {
    const aumentar = vi.fn()
    const eliminar = vi.fn()

    render(
      <CartItem
        item={item}
        aumentar={aumentar}
        disminuir={vi.fn()}
        eliminar={eliminar}
      />
    )

    const botonAumentar = screen.getByRole('button', { name: '+' })
    const botonEliminar = screen.getByRole('button', { name: /eliminar/i })

    fireEvent.click(botonAumentar)
    fireEvent.click(botonEliminar)

    expect(aumentar).toHaveBeenCalledWith(1)
    expect(eliminar).toHaveBeenCalledWith(1)
  })

})