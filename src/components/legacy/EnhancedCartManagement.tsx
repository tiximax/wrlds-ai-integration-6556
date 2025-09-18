/*
  LEGACY: Enhanced Cart Management (không dùng trong UI hiện tại)
  - Thành phần quản trị giỏ hàng nâng cao, giữ để tham khảo/triển khai sau.
  - Không import vào UI production hiện hành.
*/
// Enhanced Cart Management Component
// React component with UI for advanced cart features including saved carts, sharing, bulk operations

import React, { useState, useEffect, useCallback } from 'react';
import { 
  CartItem, 
  SavedCart, 
  SharedCart, 
  PriceAlert, 
  CartAnalytics, 
  CartRecommendation,
  BulkOperation,
  getEnhancedCartService 
} from '../services/enhancedCartService';

interface EnhancedCartManagementProps {
  currentUser: {
    id: string;
    email: string;
    name: string;
  };
  currentCartItems: CartItem[];
  onCartUpdate: (items: CartItem[]) => void;
}

const EnhancedCartManagement: React.FC<EnhancedCartManagementProps> = ({
  currentUser,
  currentCartItems,
  onCartUpdate
}) => {
  const [activeTab, setActiveTab] = useState<'current' | 'saved' | 'shared' | 'alerts' | 'analytics'>('current');
  const [savedCarts, setSavedCarts] = useState<SavedCart[]>([]);
  const [sharedCarts, setSharedCarts] = useState<SharedCart[]>([]);
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);
  const [analytics, setAnalytics] = useState<CartAnalytics | null>(null);
  const [recommendations, setRecommendations] = useState<CartRecommendation[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showSaveCartModal, setShowSaveCartModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPriceAlertModal, setShowPriceAlertModal] = useState(false);

  const cartService = getEnhancedCartService();

  // Load data on component mount
  useEffect(() => {
    loadSavedCarts();
    loadPriceAlerts();
    loadAnalytics();
    loadRecommendations();
  }, []);

  const loadSavedCarts = useCallback(async () => {
    try {
      const carts = await cartService.getSavedCarts(currentUser.id);
      setSavedCarts(carts);
    } catch (error) {
      console.error('Failed to load saved carts:', error);
    }
  }, [currentUser.id]);

  const loadPriceAlerts = useCallback(async () => {
    try {
      const alerts = await cartService.getPriceAlerts(currentUser.id);
      setPriceAlerts(alerts);
    } catch (error) {
      console.error('Failed to load price alerts:', error);
    }
  }, [currentUser.id]);

  const loadAnalytics = useCallback(async () => {
    try {
      const analyticsData = await cartService.getCartAnalytics();
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  }, []);

  const loadRecommendations = useCallback(async () => {
    if (currentCartItems.length > 0) {
      try {
        const recs = await cartService.getCartRecommendations(currentCartItems);
        setRecommendations(recs);
      } catch (error) {
        console.error('Failed to load recommendations:', error);
      }
    }
  }, [currentCartItems]);

  // Save current cart
  const handleSaveCart = async (name: string, options: { description?: string; tags?: string[]; occasion?: string }) => {
    setIsLoading(true);
    try {
      await cartService.saveCart(currentUser.id, currentCartItems, name, options);
      await loadSavedCarts();
      setShowSaveCartModal(false);
    } catch (error) {
      console.error('Failed to save cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Share cart
  const handleShareCart = async (cartId: string, options: any) => {
    setIsLoading(true);
    try {
      const sharedCart = await cartService.shareCart(cartId, currentUser.id, options);
      alert(`Cart shared! Share link: ${window.location.origin}/shared-cart/${sharedCart.shareToken}`);
      setShowShareModal(false);
    } catch (error) {
      console.error('Failed to share cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Bulk operations
  const handleBulkOperation = async (operation: BulkOperation['type'], data: Record<string, any>) => {
    if (selectedItems.size === 0) return;

    setIsLoading(true);
    try {
      const itemIds = Array.from(selectedItems);
      const result = await cartService.performBulkOperation(operation, itemIds, data, currentUser.id);
      
      if (result.result.success) {
        alert(`Bulk operation completed successfully! ${result.result.affectedItems} items affected.`);
        setSelectedItems(new Set());
        setShowBulkActions(false);
      } else {
        alert(`Bulk operation failed: ${result.result.errors.join(', ')}`);
      }
    } catch (error) {
      console.error('Bulk operation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create price alert
  const handleCreatePriceAlert = async (productId: string, targetPrice: number, currentPrice: number) => {
    setIsLoading(true);
    try {
      await cartService.createPriceAlert(currentUser.id, productId, targetPrice, currentPrice, {
        emailNotifications: true,
        pushNotifications: false,
        maxNotifications: 3
      });
      await loadPriceAlerts();
      setShowPriceAlertModal(false);
    } catch (error) {
      console.error('Failed to create price alert:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Item selection handling
  const handleItemSelect = (itemId: string, selected: boolean) => {
    const newSelection = new Set(selectedItems);
    if (selected) {
      newSelection.add(itemId);
    } else {
      newSelection.delete(itemId);
    }
    setSelectedItems(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === currentCartItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(currentCartItems.map(item => item.id)));
    }
  };

  // Render current cart with enhanced features
  const renderCurrentCart = () => (
    <div className="enhanced-cart-current">
      <div className="cart-header">
        <h3>Current Cart ({currentCartItems.length} items)</h3>
        <div className="cart-actions">
          <button 
            onClick={() => setShowSaveCartModal(true)}
            className="btn btn-primary"
            disabled={currentCartItems.length === 0}
          >
            💾 Save Cart
          </button>
          <button 
            onClick={() => setShowBulkActions(!showBulkActions)}
            className="btn btn-secondary"
            disabled={currentCartItems.length === 0}
          >
            ⚡ Bulk Actions
          </button>
        </div>
      </div>

      {showBulkActions && (
        <div className="bulk-actions-panel">
          <div className="selection-controls">
            <button onClick={handleSelectAll} className="btn btn-sm">
              {selectedItems.size === currentCartItems.length ? 'Deselect All' : 'Select All'}
            </button>
            <span>({selectedItems.size} selected)</span>
          </div>
          
          {selectedItems.size > 0 && (
            <div className="bulk-operation-buttons">
              <button 
                onClick={() => handleBulkOperation('update_quantity', { quantity: 1 })}
                className="btn btn-sm btn-outline"
              >
                Set Qty to 1
              </button>
              <button 
                onClick={() => handleBulkOperation('remove_items', {})}
                className="btn btn-sm btn-danger"
              >
                Remove Selected
              </button>
              <button 
                onClick={() => handleBulkOperation('apply_discount', { discountCode: 'BULK20' })}
                className="btn btn-sm btn-success"
              >
                Apply BULK20
              </button>
            </div>
          )}
        </div>
      )}

      <div className="cart-items">
        {currentCartItems.map(item => (
          <div key={item.id} className="cart-item">
            {showBulkActions && (
              <input
                type="checkbox"
                checked={selectedItems.has(item.id)}
                onChange={(e) => handleItemSelect(item.id, e.target.checked)}
                className="item-checkbox"
              />
            )}
            
            <div className="item-image">
              <img src={item.image || '/placeholder.png'} alt={item.name} />
            </div>
            
            <div className="item-details">
              <h4>{item.name}</h4>
              <p className="item-description">{item.description}</p>
              <div className="item-variant">
                {item.variant?.size && <span>Size: {item.variant.size}</span>}
                {item.variant?.color && <span>Color: {item.variant.color}</span>}
              </div>
            </div>
            
            <div className="item-price">
              {item.originalPrice && item.originalPrice > item.price && (
                <span className="original-price">${item.originalPrice.toFixed(2)}</span>
              )}
              <span className="current-price">${item.price.toFixed(2)}</span>
            </div>
            
            <div className="item-quantity">
              <span>Qty: {item.quantity}</span>
            </div>
            
            <div className="item-actions">
              <button
                onClick={() => setShowPriceAlertModal(true)}
                className="btn btn-sm btn-outline"
                title="Create price alert"
              >
                🔔
              </button>
            </div>
          </div>
        ))}
      </div>

      {recommendations.length > 0 && (
        <div className="cart-recommendations">
          <h4>Recommended for you</h4>
          <div className="recommendations-list">
            {recommendations.map((rec, index) => (
              <div key={index} className="recommendation-item">
                <span className="rec-type">{rec.type.replace('_', ' ')}</span>
                <span className="rec-reason">{rec.reason}</span>
                {rec.discount && <span className="rec-discount">{rec.discount}% off</span>}
                <button className="btn btn-sm btn-primary">Add to Cart</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Render saved carts
  const renderSavedCarts = () => (
    <div className="enhanced-cart-saved">
      <div className="section-header">
        <h3>Saved Carts ({savedCarts.length})</h3>
      </div>
      
      <div className="saved-carts-grid">
        {savedCarts.map(cart => (
          <div key={cart.id} className="saved-cart-card">
            <div className="card-header">
              <h4>{cart.name}</h4>
              <div className="card-actions">
                <button
                  onClick={() => setShowShareModal(true)}
                  className="btn btn-sm btn-outline"
                  title="Share cart"
                >
                  🔗
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  title="Delete cart"
                >
                  🗑️
                </button>
              </div>
            </div>
            
            {cart.description && (
              <p className="card-description">{cart.description}</p>
            )}
            
            <div className="cart-meta">
              <div className="cart-stats">
                <span>{cart.itemCount} items</span>
                <span>${cart.totalValue.toFixed(2)}</span>
              </div>
              <div className="cart-tags">
                {cart.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
              {cart.occasion && (
                <div className="cart-occasion">🎉 {cart.occasion}</div>
              )}
            </div>
            
            <div className="cart-dates">
              <small>Created: {cart.createdAt.toLocaleDateString()}</small>
              <small>Updated: {cart.updatedAt.toLocaleDateString()}</small>
            </div>
            
            <div className="card-actions-bottom">
              <button className="btn btn-primary btn-sm">Load Cart</button>
              <button className="btn btn-secondary btn-sm">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render price alerts
  const renderPriceAlerts = () => (
    <div className="enhanced-cart-alerts">
      <div className="section-header">
        <h3>Price Alerts ({priceAlerts.filter(a => a.isActive).length} active)</h3>
        <button
          onClick={() => setShowPriceAlertModal(true)}
          className="btn btn-primary"
        >
          + Create Alert
        </button>
      </div>
      
      <div className="alerts-list">
        {priceAlerts.map(alert => (
          <div key={alert.id} className={`alert-item ${alert.isActive ? 'active' : 'inactive'}`}>
            <div className="alert-details">
              <h4>Product ID: {alert.productId}</h4>
              <div className="price-comparison">
                <span className="current-price">Current: ${alert.currentPrice.toFixed(2)}</span>
                <span className="target-price">Target: ${alert.targetPrice.toFixed(2)}</span>
                <span className="price-diff">
                  {alert.currentPrice > alert.targetPrice ? 
                    `$${(alert.currentPrice - alert.targetPrice).toFixed(2)} to go` :
                    '🎉 Target reached!'
                  }
                </span>
              </div>
            </div>
            
            <div className="alert-status">
              <div className="status-indicator">
                {alert.isActive ? '🔔 Active' : '⏸️ Inactive'}
              </div>
              <div className="notifications-count">
                {alert.notificationsSent}/{alert.maxNotifications} notifications sent
              </div>
            </div>
            
            <div className="alert-actions">
              <button className="btn btn-sm btn-outline">Edit</button>
              <button className="btn btn-sm btn-danger">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render analytics
  const renderAnalytics = () => (
    <div className="enhanced-cart-analytics">
      <h3>Cart Analytics</h3>
      
      {analytics && (
        <div className="analytics-dashboard">
          <div className="analytics-cards">
            <div className="analytics-card">
              <h4>Total Carts</h4>
              <div className="metric">{analytics.totalCarts}</div>
            </div>
            <div className="analytics-card">
              <h4>Active Carts</h4>
              <div className="metric">{analytics.activeCarts}</div>
            </div>
            <div className="analytics-card">
              <h4>Average Cart Value</h4>
              <div className="metric">${analytics.averageCartValue.toFixed(2)}</div>
            </div>
            <div className="analytics-card">
              <h4>Recovery Rate</h4>
              <div className="metric">{(analytics.recoveryRate * 100).toFixed(1)}%</div>
            </div>
          </div>
          
          <div className="analytics-charts">
            <div className="chart-section">
              <h4>Top Products</h4>
              <div className="products-list">
                {analytics.topProducts.map(product => (
                  <div key={product.productId} className="product-stat">
                    <span className="product-name">{product.name}</span>
                    <span className="product-count">{product.addedCount} times added</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="chart-section">
              <h4>Peak Activity Hours</h4>
              <div className="hours-chart">
                {analytics.peakHours.map(hour => (
                  <div key={hour.hour} className="hour-bar">
                    <div className="bar-label">{hour.hour}:00</div>
                    <div 
                      className="bar" 
                      style={{ height: `${(hour.cartActivity / 80) * 100}%` }}
                    />
                    <div className="bar-value">{hour.cartActivity}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="enhanced-cart-management">
      <div className="cart-tabs">
        <button 
          onClick={() => setActiveTab('current')} 
          className={`tab ${activeTab === 'current' ? 'active' : ''}`}
        >
          Current Cart
        </button>
        <button 
          onClick={() => setActiveTab('saved')} 
          className={`tab ${activeTab === 'saved' ? 'active' : ''}`}
        >
          Saved Carts ({savedCarts.length})
        </button>
        <button 
          onClick={() => setActiveTab('shared')} 
          className={`tab ${activeTab === 'shared' ? 'active' : ''}`}
        >
          Shared Carts
        </button>
        <button 
          onClick={() => setActiveTab('alerts')} 
          className={`tab ${activeTab === 'alerts' ? 'active' : ''}`}
        >
          Price Alerts ({priceAlerts.filter(a => a.isActive).length})
        </button>
        <button 
          onClick={() => setActiveTab('analytics')} 
          className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
        >
          Analytics
        </button>
      </div>

      <div className="cart-content">
        {activeTab === 'current' && renderCurrentCart()}
        {activeTab === 'saved' && renderSavedCarts()}
        {activeTab === 'shared' && <div>Shared carts feature coming soon...</div>}
        {activeTab === 'alerts' && renderPriceAlerts()}
        {activeTab === 'analytics' && renderAnalytics()}
      </div>

      {/* Save Cart Modal */}
      {showSaveCartModal && (
        <SaveCartModal
          onSave={handleSaveCart}
          onClose={() => setShowSaveCartModal(false)}
          isLoading={isLoading}
        />
      )}

      {/* Share Cart Modal */}
      {showShareModal && (
        <ShareCartModal
          onShare={handleShareCart}
          onClose={() => setShowShareModal(false)}
          isLoading={isLoading}
        />
      )}

      {/* Price Alert Modal */}
      {showPriceAlertModal && (
        <PriceAlertModal
          onCreateAlert={handleCreatePriceAlert}
          onClose={() => setShowPriceAlertModal(false)}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

// Save Cart Modal Component
const SaveCartModal: React.FC<{
  onSave: (name: string, options: any) => void;
  onClose: () => void;
  isLoading: boolean;
}> = ({ onSave, onClose, isLoading }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [occasion, setOccasion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(name, {
      description: description || undefined,
      tags: tags.split(',').map(t => t.trim()).filter(t => t),
      occasion: occasion || undefined
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Save Current Cart</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Cart Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g., Holiday Shopping List"
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              rows={3}
            />
          </div>
          
          <div className="form-group">
            <label>Tags</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., holiday, gifts, electronics (comma separated)"
            />
          </div>
          
          <div className="form-group">
            <label>Occasion</label>
            <select value={occasion} onChange={(e) => setOccasion(e.target.value)}>
              <option value="">Select occasion (optional)</option>
              <option value="Birthday">Birthday</option>
              <option value="Christmas">Christmas</option>
              <option value="Wedding">Wedding</option>
              <option value="Anniversary">Anniversary</option>
              <option value="Valentine's Day">Valentine's Day</option>
            </select>
          </div>
          
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading || !name}>
              {isLoading ? 'Saving...' : 'Save Cart'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Share Cart Modal Component
const ShareCartModal: React.FC<{
  onShare: (cartId: string, options: any) => void;
  onClose: () => void;
  isLoading: boolean;
}> = ({ onShare, onClose, isLoading }) => {
  const [accessLevel, setAccessLevel] = useState<'view' | 'edit' | 'admin'>('view');
  const [expiresIn, setExpiresIn] = useState('24');
  const [password, setPassword] = useState('');
  const [customMessage, setCustomMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onShare('current_cart', {
      accessLevel,
      expiresIn: parseInt(expiresIn),
      password: password || undefined,
      customMessage: customMessage || undefined,
      allowAnonymousAccess: true
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Share Cart</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Access Level</label>
            <select value={accessLevel} onChange={(e) => setAccessLevel(e.target.value as any)}>
              <option value="view">View Only</option>
              <option value="edit">View & Edit</option>
              <option value="admin">Full Access</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Expires In (hours)</label>
            <select value={expiresIn} onChange={(e) => setExpiresIn(e.target.value)}>
              <option value="1">1 hour</option>
              <option value="24">24 hours</option>
              <option value="168">1 week</option>
              <option value="720">1 month</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Password Protection (optional)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave empty for no password"
            />
          </div>
          
          <div className="form-group">
            <label>Custom Message</label>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Optional message for recipients"
              rows={3}
            />
          </div>
          
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Creating Link...' : 'Create Share Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Price Alert Modal Component
const PriceAlertModal: React.FC<{
  onCreateAlert: (productId: string, targetPrice: number, currentPrice: number) => void;
  onClose: () => void;
  isLoading: boolean;
}> = ({ onCreateAlert, onClose, isLoading }) => {
  const [productId, setProductId] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateAlert(productId, parseFloat(targetPrice), parseFloat(currentPrice));
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Create Price Alert</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product ID *</label>
            <input
              type="text"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              required
              placeholder="Enter product ID"
            />
          </div>
          
          <div className="form-group">
            <label>Current Price *</label>
            <input
              type="number"
              step="0.01"
              value={currentPrice}
              onChange={(e) => setCurrentPrice(e.target.value)}
              required
              placeholder="0.00"
            />
          </div>
          
          <div className="form-group">
            <label>Target Price *</label>
            <input
              type="number"
              step="0.01"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              required
              placeholder="0.00"
            />
          </div>
          
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isLoading || !productId || !targetPrice || !currentPrice}
            >
              {isLoading ? 'Creating...' : 'Create Alert'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnhancedCartManagement;
