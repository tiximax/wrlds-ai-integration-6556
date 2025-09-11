import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll } from 'vitest'

// TODO: Add MSW server setup if needed for API mocking
// import { server } from './mocks/server'

// Establish API mocking before all tests
// beforeAll(() => server.listen())

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests
// afterEach(() => server.resetHandlers())

// Clean up after the tests are finished
// afterAll(() => server.close())

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  
  observe() {
    return null;
  }

  disconnect() {
    return null;
  }

  unobserve() {
    return null;
  }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  
  observe() {
    return null;
  }

  disconnect() {
    return null;
  }

  unobserve() {
    return null;
  }
};

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: () => {},
  writable: true
});
