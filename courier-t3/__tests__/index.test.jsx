// __tests__/index.test.jsx

import { render, screen } from '@testing-library/react'
import Home from '../src/pages/index'
import '@testing-library/jest-dom'
import RegistrationFormMain from '@/components/RegistrationFormMain'

describe('Home', () => {
  it('renders a heading', () => {
    render(<RegistrationFormMain />)

    const heading = screen.getByRole('heading', {
      name: /welcome to next\.js!/i,
    })

    expect(heading).toBeInTheDocument()
  })
})
