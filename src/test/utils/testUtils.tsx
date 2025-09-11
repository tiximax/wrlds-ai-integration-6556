import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'

// Mock i18next
import '../mocks/i18nMock'

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[]
}

const AllTheProviders: React.FC<{ children: React.ReactNode; initialEntries?: string[] }> = ({
  children,
  initialEntries = ['/']
}) => {
  return (
    <HelmetProvider>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </HelmetProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { initialEntries, ...renderOptions } = options
  
  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders initialEntries={initialEntries}>
        {children}
      </AllTheProviders>
    ),
    ...renderOptions,
  })
}

export * from '@testing-library/react'
export { customRender as render }
