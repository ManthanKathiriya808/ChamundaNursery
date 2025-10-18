import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Download,
  MessageCircle,
  Star,
  Calendar
} from 'lucide-react';

const OrderDetail = () => {
  const { orderId } = useParams();
  const [activeTab, setActiveTab] = useState('details');

  // Mock order data - in a real app, this would come from an API
  const order = {
    id: orderId || 'ORD-2024-001',
    orderNumber: 'ORD-2024-001',
    status: 'shipped',
    orderDate: '2024-01-15T10:30:00Z',
    estimatedDelivery: '2024-01-22T18:00:00Z',
    total: 156.47,
    subtotal: 142.98,
    shipping: 9.99,
    tax: 11.43,
    discount: 7.93,
    paymentMethod: 'Credit Card ending in 4242',
    shippingAddress: {
      name: 'Sarah Johnson',
      street: '123 Garden Street',
      city: 'Plant City',
      state: 'PC',
      zipCode: '12345',
      phone: '+1 (555) 123-4567',
      email: 'sarah@example.com'
    },
    billingAddress: {
      name: 'Sarah Johnson',
      street: '123 Garden Street',
      city: 'Plant City',
      state: 'PC',
      zipCode: '12345'
    },
    items: [
      {
        id: 1,
        name: 'Monstera Deliciosa',
        image: '/api/placeholder/100/100',
        price: 45.99,
        quantity: 2,
        size: 'Medium',
        sku: 'MON-DEL-MED'
      },
      {
        id: 2,
        name: 'Snake Plant',
        image: '/api/placeholder/100/100',
        price: 29.99,
        quantity: 1,
        size: 'Large',
        sku: 'SNK-PLT-LRG'
      },
      {
        id: 3,
        name: 'Pothos Golden',
        image: '/api/placeholder/100/100',
        price: 21.01,
        quantity: 3,
        size: 'Small',
        sku: 'POT-GOL-SML'
      }
    ],
    tracking: {
      carrier: 'FedEx',
      trackingNumber: '1234567890123456',
      updates: [
        {
          date: '2024-01-18T14:30:00Z',
          status: 'Out for delivery',
          location: 'Plant City, PC',
          description: 'Package is out for delivery and will arrive today'
        },
        {
          date: '2024-01-17T09:15:00Z',
          status: 'In transit',
          location: 'Distribution Center, PC',
          description: 'Package has departed from distribution center'
        },
        {
          date: '2024-01-16T16:45:00Z',
          status: 'Processed',
          location: 'Fulfillment Center, PC',
          description: 'Package has been processed at fulfillment center'
        },
        {
          date: '2024-01-15T11:00:00Z',
          status: 'Order confirmed',
          location: 'Chamunda Nursery',
          description: 'Order has been confirmed and is being prepared'
        }
      ]
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-green-100 text-green-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const statusIcons = {
      pending: Clock,
      confirmed: CheckCircle,
      processing: Package,
      shipped: Truck,
      delivered: CheckCircle,
      cancelled: Clock
    };
    return statusIcons[status] || Clock;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const StatusIcon = getStatusIcon(order.status);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/account/orders"
            className="inline-flex items-center text-green-600 hover:text-green-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Order {order.orderNumber}
              </h1>
              <p className="text-gray-600 mt-1">
                Placed on {formatDate(order.orderDate)}
              </p>
            </div>
            
            <div className="mt-4 sm:mt-0 flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(order.status)}`}>
                <StatusIcon className="w-4 h-4" />
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Invoice
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'details', label: 'Order Details' },
              { id: 'tracking', label: 'Tracking' },
              { id: 'support', label: 'Support' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Order Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-600">Size: {item.size}</p>
                          <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            {formatCurrency(item.price)}
                          </p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
                      <p className="text-gray-600">{order.shippingAddress.street}</p>
                      <p className="text-gray-600">
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                      </p>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {order.shippingAddress.phone}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {order.shippingAddress.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">{formatCurrency(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-gray-900">{formatCurrency(order.shipping)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="text-gray-900">{formatCurrency(order.tax)}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-{formatCurrency(order.discount)}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between font-semibold text-lg">
                        <span className="text-gray-900">Total</span>
                        <span className="text-gray-900">{formatCurrency(order.total)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-medium text-gray-900 mb-2">Payment Method</h3>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{order.paymentMethod}</span>
                    </div>
                  </div>

                  {order.status === 'shipped' && (
                    <div className="mt-6 pt-6 border-t">
                      <h3 className="font-medium text-gray-900 mb-2">Estimated Delivery</h3>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formatDate(order.estimatedDelivery)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tracking' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Package Tracking</h2>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Tracking Number</p>
                  <p className="font-mono text-sm font-medium text-gray-900">
                    {order.tracking.trackingNumber}
                  </p>
                  <p className="text-xs text-gray-500">via {order.tracking.carrier}</p>
                </div>
              </div>

              <div className="space-y-6">
                {order.tracking.updates.map((update, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                      {index < order.tracking.updates.length - 1 && (
                        <div className="w-px h-12 bg-gray-200 mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-gray-900">{update.status}</h3>
                        <span className="text-sm text-gray-500">
                          {formatDate(update.date)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{update.description}</p>
                      <p className="text-xs text-gray-500">{update.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'support' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                    <MessageCircle className="w-5 h-5 text-green-600 mt-1" />
                    <div>
                      <h3 className="font-medium text-gray-900">Contact Support</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Get help with your order from our customer service team.
                      </p>
                      <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                        Start Chat
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                    <Star className="w-5 h-5 text-yellow-500 mt-1" />
                    <div>
                      <h3 className="font-medium text-gray-900">Leave a Review</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Share your experience with the products you purchased.
                      </p>
                      <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                        Write Review
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Frequently Asked Questions</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• How can I track my order?</li>
                      <li>• What is your return policy?</li>
                      <li>• How do I care for my plants?</li>
                      <li>• Can I change my delivery address?</li>
                    </ul>
                    <button className="text-green-600 hover:text-green-700 text-sm font-medium mt-3">
                      View All FAQs
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default OrderDetail;