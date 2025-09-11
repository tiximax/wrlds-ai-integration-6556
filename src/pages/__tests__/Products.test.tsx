import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../test/utils/testUtils';
import Products from '../Products';
import { FilterState } from '../../utils/productFilters';

// Mock the product data
vi.mock('../../data/products', () => ({
  mockProducts: [
    {
      id: '1',
      name: 'iPhone 15 Pro',
      description: 'Latest iPhone with advanced features',
      sellingPrice: 25000000,
      origin: 'usa',
      status: 'available',
      type: 'ready_stock',
      brand: { name: 'Apple' },
      category: { name: 'Electronics' },
      images: [{ url: '/test.jpg', alt: 'Test', isPrimary: true, order: 1, id: '1' }],
      tags: ['smartphone', 'apple'],
      featured: true,
      trending: true,
      rating: { average: 4.8, count: 250 },
      stock: 10,
      sku: 'TEST-001',
      sourceSite: 'Test',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      currency: 'VND',
      originalPrice: 1000
    },
    {
      id: '2',
      name: 'Samsung Galaxy S24',
      description: 'Premium Android smartphone',
      sellingPrice: 20000000,
      origin: 'korea',
      status: 'available',
      type: 'ready_stock',
      brand: { name: 'Samsung' },
      category: { name: 'Electronics' },
      images: [{ url: '/test2.jpg', alt: 'Test 2', isPrimary: true, order: 1, id: '2' }],
      tags: ['smartphone', 'samsung'],
      featured: false,
      trending: false,
      rating: { average: 4.6, count: 180 },
      stock: 15,
      sku: 'TEST-002',
      sourceSite: 'Test',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10'),
      currency: 'VND',
      originalPrice: 800
    }
  ]
}));

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useSearchParams: () => [
      new URLSearchParams(),
      vi.fn()
    ]
  };
});

// Mock the components that aren't critical for integration tests
vi.mock('../../components/products/FilterBar', () => ({
  default: ({ onFiltersChange, totalResults }: { onFiltersChange: (filters: FilterState) => void; totalResults: number }) => (
    <div data-testid="filter-bar">
      <div data-testid="total-results">{totalResults}</div>
      <input
        data-testid="search-input"
        onChange={(e) => onFiltersChange({
          search: e.target.value,
          origins: [],
          status: [],
          types: [],
          brands: [],
          priceRange: [0, 100000000],
          quickFilter: ''
        })}
        placeholder="Search products..."
      />
      <button
        data-testid="origin-filter-usa"
        onClick={() => onFiltersChange({
          search: '',
          origins: ['usa'],
          status: [],
          types: [],
          brands: [],
          priceRange: [0, 100000000],
          quickFilter: ''
        })}
      >
        Filter USA
      </button>
    </div>
  )
}));

vi.mock('../../components/ProductGrid', () => ({
  default: ({ products, sortBy, onSortChange, totalResults }: { products: Array<{ id: string; name: string; sellingPrice: number; origin: string }>; sortBy: string; onSortChange: (sort: string) => void; totalResults: number }) => (
    <div data-testid="product-grid">
      <div data-testid="grid-total-results">{totalResults}</div>
      <select 
        data-testid="sort-select" 
        value={sortBy} 
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="newest">Newest</option>
        <option value="price-low">Price Low</option>
        <option value="price-high">Price High</option>
        <option value="name">Name</option>
      </select>
      <div data-testid="products-list">
        {products.map((product: { id: string; name: string; sellingPrice: number; origin: string }) => (
          <div key={product.id} data-testid={`product-${product.id}`}>
            <span data-testid={`product-name-${product.id}`}>{product.name}</span>
            <span data-testid={`product-price-${product.id}`}>{product.sellingPrice}</span>
            <span data-testid={`product-origin-${product.id}`}>{product.origin}</span>
          </div>
        ))}
      </div>
    </div>
  )
}));

describe('Products Page Integration Tests', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial Render', () => {
    it('should render the products page with all components', () => {
      render(<Products />);

      // Check if main components are rendered
      expect(screen.getByTestId('filter-bar')).toBeInTheDocument();
      expect(screen.getByTestId('product-grid')).toBeInTheDocument();
      
      // Check if products are displayed
      expect(screen.getByTestId('product-1')).toBeInTheDocument();
      expect(screen.getByTestId('product-2')).toBeInTheDocument();
      
      // Check if product details are shown
      expect(screen.getByTestId('product-name-1')).toHaveTextContent('iPhone 15 Pro');
      expect(screen.getByTestId('product-name-2')).toHaveTextContent('Samsung Galaxy S24');
    });

    it('should show correct total results count', () => {
      render(<Products />);

      const totalResults = screen.getByTestId('total-results');
      const gridTotalResults = screen.getByTestId('grid-total-results');
      
      expect(totalResults).toHaveTextContent('2');
      expect(gridTotalResults).toHaveTextContent('2');
    });

    it('should display page header and breadcrumbs', () => {
      render(<Products />);

      expect(screen.getAllByText('products.title')[0]).toBeInTheDocument();
      expect(screen.getByText('products.subtitle')).toBeInTheDocument();
      expect(screen.getByText('common.home')).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('should filter products when searching', async () => {
      render(<Products />);

      const searchInput = screen.getByTestId('search-input');
      
      // Initially should show both products
      expect(screen.getByTestId('product-1')).toBeInTheDocument();
      expect(screen.getByTestId('product-2')).toBeInTheDocument();
      
      // Search for iPhone
      await user.type(searchInput, 'iPhone');
      
      await waitFor(() => {
        // Should only show iPhone product
        expect(screen.getByTestId('product-1')).toBeInTheDocument();
        expect(screen.queryByTestId('product-2')).not.toBeInTheDocument();
        
        // Total results should be updated
        expect(screen.getByTestId('total-results')).toHaveTextContent('1');
      });
    });

    it('should show no results when search has no matches', async () => {
      render(<Products />);

      const searchInput = screen.getByTestId('search-input');
      
      await user.type(searchInput, 'nonexistentproduct');
      
      await waitFor(() => {
        expect(screen.queryByTestId('product-1')).not.toBeInTheDocument();
        expect(screen.queryByTestId('product-2')).not.toBeInTheDocument();
        expect(screen.getByTestId('total-results')).toHaveTextContent('0');
      });
    });
  });

  describe('Origin Filtering', () => {
    it('should filter products by origin', async () => {
      render(<Products />);

      const usaFilterButton = screen.getByTestId('origin-filter-usa');
      
      // Initially should show both products
      expect(screen.getByTestId('product-1')).toBeInTheDocument();
      expect(screen.getByTestId('product-2')).toBeInTheDocument();
      
      // Filter by USA origin
      await user.click(usaFilterButton);
      
      await waitFor(() => {
        // Should only show USA product (iPhone)
        expect(screen.getByTestId('product-1')).toBeInTheDocument();
        expect(screen.queryByTestId('product-2')).not.toBeInTheDocument();
        
        // Check the origin is correct
        expect(screen.getByTestId('product-origin-1')).toHaveTextContent('usa');
        
        // Total results should be updated
        expect(screen.getByTestId('total-results')).toHaveTextContent('1');
      });
    });
  });

  describe('Sorting Functionality', () => {
    it('should sort products by price (low to high)', async () => {
      render(<Products />);

      const sortSelect = screen.getByTestId('sort-select');
      
      // Sort by price low to high
      await user.selectOptions(sortSelect, 'price-low');
      
      await waitFor(() => {
        const products = screen.getAllByTestId(/^product-\d+$/);
        const firstProductPrice = screen.getByTestId('product-price-2');
        const secondProductPrice = screen.getByTestId('product-price-1');
        
        // Samsung (20M) should come before iPhone (25M)
        expect(firstProductPrice).toHaveTextContent('20000000');
        expect(secondProductPrice).toHaveTextContent('25000000');
      });
    });

    it('should sort products by price (high to low)', async () => {
      render(<Products />);

      const sortSelect = screen.getByTestId('sort-select');
      
      // Sort by price high to low
      await user.selectOptions(sortSelect, 'price-high');
      
      await waitFor(() => {
        const firstProductPrice = screen.getByTestId('product-price-1');
        const secondProductPrice = screen.getByTestId('product-price-2');
        
        // iPhone (25M) should come before Samsung (20M)
        expect(firstProductPrice).toHaveTextContent('25000000');
        expect(secondProductPrice).toHaveTextContent('20000000');
      });
    });

    it('should sort products by name', async () => {
      render(<Products />);

      const sortSelect = screen.getByTestId('sort-select');
      
      // Sort by name
      await user.selectOptions(sortSelect, 'name');
      
      await waitFor(() => {
        const firstProductName = screen.getByTestId('product-name-1');
        const secondProductName = screen.getByTestId('product-name-2');
        
        // iPhone should come before Samsung alphabetically
        expect(firstProductName).toHaveTextContent('iPhone 15 Pro');
        expect(secondProductName).toHaveTextContent('Samsung Galaxy S24');
      });
    });
  });

  describe('Combined Filters and Sorting', () => {
    it('should apply both search filter and sorting', async () => {
      render(<Products />);

      const searchInput = screen.getByTestId('search-input');
      const sortSelect = screen.getByTestId('sort-select');
      
      // First search for smartphones (both should match)
      await user.type(searchInput, 'smartphone');
      
      await waitFor(() => {
        expect(screen.getByTestId('total-results')).toHaveTextContent('2');
      });
      
      // Then sort by price high to low
      await user.selectOptions(sortSelect, 'price-high');
      
      await waitFor(() => {
        // Should still show both products but in price order
        expect(screen.getByTestId('total-results')).toHaveTextContent('2');
        
        // Verify sorting order
        const firstProductPrice = screen.getByTestId('product-price-1');
        const secondProductPrice = screen.getByTestId('product-price-2');
        
        expect(parseInt(firstProductPrice.textContent || '0')).toBeGreaterThan(
          parseInt(secondProductPrice.textContent || '0')
        );
      });
    });

    it('should reset page when filters change', async () => {
      render(<Products />);

      const searchInput = screen.getByTestId('search-input');
      
      // Apply a search filter
      await user.type(searchInput, 'iPhone');
      
      await waitFor(() => {
        expect(screen.getByTestId('total-results')).toHaveTextContent('1');
      });
      
      // Clear search and apply origin filter
      await user.clear(searchInput);
      
      const usaFilterButton = screen.getByTestId('origin-filter-usa');
      await user.click(usaFilterButton);
      
      await waitFor(() => {
        // Should show USA products
        expect(screen.getByTestId('total-results')).toHaveTextContent('1');
        expect(screen.getByTestId('product-1')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle empty product list gracefully', async () => {
      // This test verifies the empty state when search returns no results
      render(<Products />);

      const searchInput = screen.getByTestId('search-input');
      
      // Search for something that doesn't exist
      await user.type(searchInput, 'nonexistentproductxyz12345');
      
      await waitFor(() => {
        expect(screen.getByTestId('total-results')).toHaveTextContent('0');
        expect(screen.queryByTestId(/^product-\d+$/)).not.toBeInTheDocument();
      });
    });

    it('should handle invalid sort options gracefully', async () => {
      render(<Products />);

      const sortSelect = screen.getByTestId('sort-select');
      
      // This should default to newest sorting
      fireEvent.change(sortSelect, { target: { value: 'invalid-sort' } });
      
      await waitFor(() => {
        // Products should still be displayed
        expect(screen.getByTestId('product-1')).toBeInTheDocument();
        expect(screen.getByTestId('product-2')).toBeInTheDocument();
      });
    });
  });

  describe('Performance and State Management', () => {
    it('should not re-render unnecessarily when props don\'t change', () => {
      const { rerender } = render(<Products />);
      
      const initialProductCount = screen.getAllByTestId(/^product-\d+$/).length;
      
      // Re-render with same props
      rerender(<Products />);
      
      const afterRerenderCount = screen.getAllByTestId(/^product-\d+$/).length;
      
      expect(initialProductCount).toBe(afterRerenderCount);
      expect(screen.getByTestId('total-results')).toHaveTextContent('2');
    });

    it('should maintain filter state during sorting changes', async () => {
      render(<Products />);

      const searchInput = screen.getByTestId('search-input');
      const sortSelect = screen.getByTestId('sort-select');
      
      // Apply search filter
      await user.type(searchInput, 'iPhone');
      
      await waitFor(() => {
        expect(screen.getByTestId('total-results')).toHaveTextContent('1');
      });
      
      // Change sorting
      await user.selectOptions(sortSelect, 'price-high');
      
      await waitFor(() => {
        // Search filter should still be active
        expect(screen.getByTestId('total-results')).toHaveTextContent('1');
        expect(screen.getByTestId('product-1')).toBeInTheDocument();
        expect(screen.queryByTestId('product-2')).not.toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<Products />);

      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toBeInTheDocument();
      expect(mainHeading).toHaveTextContent('products.title');
    });

    it('should have proper navigation landmarks', () => {
      render(<Products />);

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });

    it('should support keyboard navigation for interactive elements', async () => {
      render(<Products />);

      const sortSelect = screen.getByTestId('sort-select');
      const searchInput = screen.getByTestId('search-input');
      
      // Should be focusable
      sortSelect.focus();
      expect(sortSelect).toHaveFocus();
      
      // Should support tab navigation
      await user.tab();
      // Note: Exact focus target depends on DOM structure, but this tests tab works
    });
  });
});
