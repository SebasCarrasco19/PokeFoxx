import { describe, expect, test } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProductCard from '../components/ProductCard'

describe('Prueba Unitaria ProductCard', () => {

  test('debe mostrar el producto sin permitir agregar si no tiene stock', () => {
    const producto = {
      id: 1,
      nombre: 'Pikachu',
      precio: 15000,
      categoria: 'Cartas individuales',
      juego: 'Pokémon',
      stock: 0
    }

    render(
      <MemoryRouter>
        <ProductCard producto={producto} />
      </MemoryRouter>
    )

    expect(screen.getByText('Pikachu')).toBeInTheDocument()
    expect(screen.getByText('$15.000')).toBeInTheDocument()

    const boton = screen.getByRole('button', { name: /sin stock/i })

    expect(boton).toBeDisabled()
  })

  test('debe agregar el producto al carrito', () => {
    localStorage.clear()

    const producto = {
      id: 2,
      nombre: 'Charizard',
      precio: 25000,
      categoria: 'Cartas individuales',
      juego: 'Pokémon',
      stock: 3
    }

    render(
      <MemoryRouter>
        <ProductCard producto={producto} />
      </MemoryRouter>
    )

    const boton = screen.getByRole('button', {
      name: /añadir al carrito/i
    })

    fireEvent.click(boton)

    const carrito =
      JSON.parse(localStorage.getItem('carrito'))

    expect(carrito).toHaveLength(1)
    expect(carrito[0].id).toBe(2)
    expect(carrito[0].cantidad).toBe(1)

    expect(
      screen.getByText(/producto añadido al carrito/i)
    ).toBeInTheDocument()
  })

})