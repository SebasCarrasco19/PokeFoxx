import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProductosCriticos from '../pages/admin/ProductosCriticos'

describe('Prueba Unitaria ProductosCriticos', () => {

  test('debe considerar crítico un producto con stock cero', () => {
    localStorage.clear()

    const productos = [
      {
        id: 1,
        name: 'Sanji',
        category: 'Cartas individuales',
        game: 'One Piece',
        stock: 0,
        criticalStock: null
      },
      {
        id: 2,
        name: 'Pikachu',
        category: 'Cartas individuales',
        game: 'Pokémon',
        stock: 3,
        criticalStock: null
      }
    ]

    localStorage.setItem(
      'productos',
      JSON.stringify(productos)
    )

    render(<ProductosCriticos />)

    expect(
      screen.getByText('1 producto(s) con stock crítico.')
    ).toBeInTheDocument()

    expect(
      screen.queryByText('Sin productos críticos')
    ).not.toBeInTheDocument()
  })

  test('debe mostrar mensaje cuando no existen productos críticos', () => {
    localStorage.clear()

    const productos = [
      {
        id: 1,
        name: 'Charizard',
        category: 'Cartas individuales',
        game: 'Pokémon',
        stock: 10,
        criticalStock: 5
      }
    ]

    localStorage.setItem(
      'productos',
      JSON.stringify(productos)
    )

    render(<ProductosCriticos />)

    expect(
      screen.getByText('0 producto(s) con stock crítico.')
    ).toBeInTheDocument()

    expect(
      screen.getByText('Sin productos críticos')
    ).toBeInTheDocument()
  })

})