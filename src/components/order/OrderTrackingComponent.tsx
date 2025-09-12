import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  AlertCircle, 
  Eye, 
  Download,
  Mail,
  Phone,
  Copy,
  ExternalLink,
  Calendar,
  User,
  CreditCard,
  Star,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { Order, ShippingUpdate, getOrderService } from '@/services/orderService';

interface OrderTrackingComponentProps {
  orderId?: string;
  orderNumber?: string;
  embedded?: boolean;
  showCustomerInfo?: boolean;
  onOrderUpdate?: (order: Order) => void;
  className?: string;
}

interface TrackingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'completed' | 'current' | 'pending' | 'failed';
  timestamp?: Date;
  location?: string;
  details?: string;
}

const OrderTrackingComponent: React.FC<OrderTrackingComponentProps> = ({
  orderId,
  orderNumber,
  embedded = false,
  showCustomerInfo = true,
  onOrderUpdate,
  className = ''
}) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'tracking' | 'details' | 'receipt'>('tracking');
  const [trackingSteps, setTrackingSteps] = useState<TrackingStep[]>([]);

  const orderService = getOrderService();

  useEffect(() => {
    loadOrder();
  }, [orderId, orderNumber]);

  useEffect(() => {
    if (order) {
      generateTrackingSteps(order);
    }
  }, [order]);

  const loadOrder = async () => {
    setLoading(true);
    setError(null);

    try {
      let foundOrder: Order | null = null;

      if (orderId) {
        foundOrder = await orderService.getOrder(orderId);
      } else if (orderNumber) {
        // Search by order number
        const searchResult = await orderService.searchOrders({
          search: orderNumber
        });
        foundOrder = searchResult.orders.find(o => o.orderNumber === orderNumber) || null;
      }

      if (!foundOrder) {
        setError('Order not found');
        return;
      }

      setOrder(foundOrder);
      onOrderUpdate?.(foundOrder);
    } catch (err) {
      setError('Failed to load order');
      console.error('Order loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateTrackingSteps = (order: Order) => {
    const steps: TrackingStep[] = [
      {
        id: 'confirmed',
        title: 'Order Confirmed',
        description: 'Your order has been confirmed and is being prepared',
        icon: <CheckCircle className="h-5 w-5" />,
        status: order.confirmedAt ? 'completed' : 'pending',
        timestamp: order.confirmedAt
      },
      {
        id: 'processing',
        title: 'Processing',
        description: 'Your items are being picked and packed',
        icon: <Package className="h-5 w-5" />,
        status: ['processing', 'shipped', 'delivered'].includes(order.status) ? 'completed' : 'pending'
      },
      {
        id: 'shipped',
        title: 'Shipped',
        description: 'Your package is on its way',
        icon: <Truck className="h-5 w-5" />,
        status: order.shippedAt ? 'completed' : 
               order.status === 'processing' ? 'current' : 'pending',
        timestamp: order.shippedAt,
        details: order.shippingDetails.trackingNumber ? 
                `Tracking: ${order.shippingDetails.trackingNumber}` : undefined
      },
      {
        id: 'delivered',
        title: 'Delivered',
        description: 'Your package has been delivered',
        icon: <CheckCircle className="h-5 w-5" />,
        status: order.deliveredAt ? 'completed' : 
               ['shipped', 'in_transit', 'out_for_delivery'].includes(order.shippingDetails.status) ? 'current' : 'pending',
        timestamp: order.deliveredAt
      }
    ];

    // Handle cancelled/refunded orders
    if (order.status === 'cancelled') {
      steps.forEach(step => {
        if (step.status === 'current' || step.status === 'pending') {
          step.status = 'failed';
        }
      });
      steps.push({
        id: 'cancelled',
        title: 'Order Cancelled',
        description: order.cancellationReason || 'Order has been cancelled',
        icon: <AlertCircle className="h-5 w-5" />,
        status: 'failed',
        timestamp: order.cancelledAt
      });
    }

    setTrackingSteps(steps);
  };

  const copyTrackingNumber = () => {
    if (order?.shippingDetails.trackingNumber) {
      navigator.clipboard.writeText(order.shippingDetails.trackingNumber);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-100',
      confirmed: 'text-blue-600 bg-blue-100',
      processing: 'text-purple-600 bg-purple-100',
      shipped: 'text-indigo-600 bg-indigo-100',
      delivered: 'text-green-600 bg-green-100',
      completed: 'text-green-600 bg-green-100',
      cancelled: 'text-red-600 bg-red-100',
      refunded: 'text-orange-600 bg-orange-100',
      returned: 'text-gray-600 bg-gray-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 text-center ${className}`}>
        <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {error || 'Order Not Found'}
        </h3>
        <p className="text-gray-600 mb-4">
          We couldn't find the order you're looking for. Please check the order number and try again.
        </p>
        <button
          onClick={loadOrder}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      {/* Header */}
      {!embedded && (
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Order Tracking</h2>
              <p className="text-sm text-gray-500 mt-1">
                Track your order status and shipping information
              </p>
            </div>
            
            <div className="text-right">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Order Information</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number:</span>
                  <span className="font-medium">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date:</span>
                  <span>{order.createdAt.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-semibold">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Shipping Information</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Method:</span>
                  <span className="capitalize">{order.shippingDetails.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated:</span>
                  <span>{order.shippingDetails.estimatedDelivery}</span>
                </div>
                {order.shippingDetails.trackingNumber && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tracking:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs">
                        {order.shippingDetails.trackingNumber}
                      </span>
                      <button
                        onClick={copyTrackingNumber}
                        className="text-blue-600 hover:text-blue-700"
                        title="Copy tracking number"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {showCustomerInfo && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Delivery Address</h3>
                <div className="text-sm text-gray-600">
                  <div>{order.shippingDetails.address.firstName} {order.shippingDetails.address.lastName}</div>
                  <div>{order.shippingDetails.address.address}</div>
                  {order.shippingDetails.address.apartment && (
                    <div>{order.shippingDetails.address.apartment}</div>
                  )}
                  <div>
                    {order.shippingDetails.address.city}, {order.shippingDetails.address.state} {order.shippingDetails.address.zipCode}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'tracking', label: 'Tracking', icon: <Package className="h-4 w-4" /> },
            { id: 'details', label: 'Order Details', icon: <Eye className="h-4 w-4" /> },
            { id: 'receipt', label: 'Receipt', icon: <Download className="h-4 w-4" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.icon}
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'tracking' && (
            <motion.div
              key="tracking"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Tracking Steps */}
              <div className="space-y-6">
                {trackingSteps.map((step, index) => (
                  <div key={step.id} className="flex items-start gap-4">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 flex-shrink-0 ${
                      step.status === 'completed' 
                        ? 'bg-green-100 border-green-500 text-green-600'
                        : step.status === 'current'
                        ? 'bg-blue-100 border-blue-500 text-blue-600'
                        : step.status === 'failed'
                        ? 'bg-red-100 border-red-500 text-red-600'
                        : 'bg-gray-100 border-gray-300 text-gray-400'
                    }`}>
                      {step.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-medium ${
                          step.status === 'completed' ? 'text-green-900' :
                          step.status === 'current' ? 'text-blue-900' :
                          step.status === 'failed' ? 'text-red-900' :
                          'text-gray-900'
                        }`}>
                          {step.title}
                        </h4>
                        {step.timestamp && (
                          <span className="text-xs text-gray-500">
                            {step.timestamp.toLocaleDateString()} {step.timestamp.toLocaleTimeString()}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                      
                      {step.details && (
                        <p className="text-xs text-gray-500 mt-1">{step.details}</p>
                      )}
                    </div>

                    {index < trackingSteps.length - 1 && step.status === 'completed' && (
                      <div className="absolute left-5 mt-10 w-0.5 h-6 bg-green-300" style={{
                        marginLeft: '1.25rem'
                      }}></div>
                    )}
                  </div>
                ))}
              </div>

              {/* Shipping Updates */}
              {order.shippingDetails.updates.length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Shipping Updates</h3>
                  <div className="space-y-3">
                    {order.shippingDetails.updates.map((update) => (
                      <motion.div
                        key={update.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">
                              {update.message}
                            </p>
                            <span className="text-xs text-gray-500">
                              {update.timestamp.toLocaleDateString()} {update.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          {update.location && (
                            <p className="text-xs text-gray-600 mt-1">{update.location}</p>
                          )}
                          {update.carrier && (
                            <p className="text-xs text-gray-500 mt-1">via {update.carrier}</p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tracking Actions */}
              {order.shippingDetails.trackingNumber && (
                <div className="flex gap-4 pt-4 border-t">
                  <button
                    onClick={() => window.open(`https://www.ups.com/track?loc=en_US&tracknum=${order.shippingDetails.trackingNumber}`, '_blank')}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Track on {order.shippingDetails.carrier}
                  </button>
                  
                  <button
                    onClick={() => {
                      // Implement delivery preferences
                    }}
                    className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    <MapPin className="h-4 w-4" />
                    Delivery Preferences
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <img
                        src={item.image || '/placeholder-product.jpg'}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        {item.variant && (
                          <p className="text-sm text-gray-500">
                            {Object.entries(item.variant).map(([key, value]) => 
                              `${key}: ${value}`
                            ).join(', ')}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          {formatCurrency(item.price * item.quantity)}
                        </div>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <div className="text-sm text-gray-500 line-through">
                            {formatCurrency(item.originalPrice * item.quantity)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatCurrency(order.subtotal)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-{formatCurrency(order.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{formatCurrency(order.shipping)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>{formatCurrency(order.tax)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Payment Information</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="font-medium capitalize">
                        {order.payment.method.replace('_', ' ')}
                      </div>
                      <div className="text-sm text-gray-600">
                        Status: <span className="capitalize">{order.payment.status}</span>
                      </div>
                      {order.payment.transactionId && (
                        <div className="text-xs text-gray-500">
                          Transaction: {order.payment.transactionId}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'receipt' && (
            <motion.div
              key="receipt"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Order Receipt</h3>
                <button
                  onClick={async () => {
                    const receipt = await orderService.generateReceipt(order.id);
                    // In a real app, this would generate and download a PDF
                    console.log('Receipt generated:', receipt);
                  }}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </button>
              </div>

              {/* Receipt Preview */}
              <div className="border rounded-lg p-6 bg-white shadow-sm">
                <div className="text-center border-b pb-4 mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Your Store Name</h2>
                  <p className="text-gray-600">123 Business St, City, State 12345</p>
                  <p className="text-gray-600">support@yourstore.com | +1-555-123-4567</p>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Bill To:</h4>
                    <div className="text-sm text-gray-600">
                      <div>{order.shippingDetails.address.firstName} {order.shippingDetails.address.lastName}</div>
                      <div>{order.customerEmail}</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Order Details:</h4>
                    <div className="text-sm text-gray-600">
                      <div>Order #: {order.orderNumber}</div>
                      <div>Date: {order.createdAt.toLocaleDateString()}</div>
                      <div>Payment: {order.payment.method}</div>
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Qty</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {order.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-2">
                            <div className="font-medium text-gray-900">{item.name}</div>
                            {item.description && (
                              <div className="text-sm text-gray-600">{item.description}</div>
                            )}
                          </td>
                          <td className="px-4 py-2 text-center">{item.quantity}</td>
                          <td className="px-4 py-2 text-right">{formatCurrency(item.price)}</td>
                          <td className="px-4 py-2 text-right font-medium">
                            {formatCurrency(item.price * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="mt-6 flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(order.subtotal)}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount:</span>
                        <span>-{formatCurrency(order.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span>Shipping:</span>
                      <span>{formatCurrency(order.shipping)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax:</span>
                      <span>{formatCurrency(order.tax)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                      <span>Total:</span>
                      <span>{formatCurrency(order.total)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center text-sm text-gray-600">
                  <p>Thank you for your business!</p>
                  <p>Questions? Contact us at support@yourstore.com</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OrderTrackingComponent;
