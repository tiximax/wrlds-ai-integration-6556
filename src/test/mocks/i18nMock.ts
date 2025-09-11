import { vi } from 'vitest'

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
      language: 'vi'
    },
  }),
  Trans: ({ children }: { children: React.ReactNode }) => children,
}))

// Mock i18n config
vi.mock('@/i18n/config', () => ({
  default: {
    language: 'vi',
    changeLanguage: vi.fn(),
    t: (key: string) => key
  }
}))
