import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { ArrowLeft, MapPin, Clock, User, Bike, Package, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('access_token');
        const response = await axios.get(
          `http://localhost:8000/api/orders/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrder(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch order details:', err);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const handleCancelOrder = async () => {
    if (!cancellationReason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }

    try {
      setCancelling(true);
      const token = localStorage.getItem('access_token');
      await axios.post(
        `http://localhost:8000/api/orders/${id}/update_status/`,
        {
          status: 'CANCELLED',
          cancellation_reason: cancellationReason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      toast.success('Order cancelled successfully');
      setShowCancelModal(false);
      
      // Refresh order details
      const response = await axios.get(
        `http://localhost:8000/api/orders/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrder(response.data);
    } catch (err) {
      console.error('Failed to cancel order:', err);
      toast.error(err.response?.data?.error || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const canCancelOrder = (status) => {
    return ['PENDING', 'PREPARING'].includes(status);
  };

  const getStatusConfig = (status) => {
    const configs = {
      PENDING: {
        variant: 'warning',
        icon: <Clock size={18} />,
        label: 'Pending',
        description: 'Waiting for restaurant to confirm',
      },
      PREPARING: {
        variant: 'info',
        icon: <Package size={18} />,
        label: 'Preparing',
        description: 'Restaurant is preparing your order',
      },
      READY_FOR_PICKUP: {
        variant: 'info',
        icon: <CheckCircle size={18} />,
        label: 'Ready for Pickup',
        description: 'Order is ready, waiting for rider',
      },
      OUT_FOR_DELIVERY: {
        variant: 'primary',
        icon: <Bike size={18} />,
        label: 'Out for Delivery',
        description: 'Rider is on the way',
      },
      DELIVERED: {
        variant: 'success',
        icon: <CheckCircle size={18} />,
        label: 'Delivered',
        description: 'Order has been delivered',
      },
      CANCELLED: {
        variant: 'error',
        icon: <Package size={18} />,
        label: 'Cancelled',
        description: 'Order was cancelled',
      },
    };
    return configs[status] || configs.PENDING;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading order details...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-light-200 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="text-center py-12">
            <Package size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-dark-900 mb-4">Order Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The order you are looking for does not exist.'}</p>
            <Button variant="primary" onClick={() => navigate('/orders')}>
              Back to Orders
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(order.status);

  return (
    <div className="min-h-screen bg-light-200 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/orders')}
            className="flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Orders
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-dark-900">Order #{order.id}</h1>
              <p className="text-gray-600 mt-1">
                Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div className="text-right">
              <Badge variant={statusConfig.variant} className="text-base px-4 py-2">
                {statusConfig.label}
              </Badge>
            </div>
          </div>
        </div>

        {/* Order Status Timeline */}
        <Card className="mb-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold text-dark-900">Order Status</h2>
            {canCancelOrder(order.status) && (
              <Button
                variant="danger"
                size="sm"
                icon={<XCircle size={16} />}
                onClick={() => setShowCancelModal(true)}
              >
                Cancel Order
              </Button>
            )}
          </div>
          <div className="flex items-center gap-3 p-4 bg-light-200 rounded-lg">
            <div className="flex-shrink-0 text-primary-600">
              {statusConfig.icon}
            </div>
            <div>
              <div className="font-semibold text-dark-900">{statusConfig.label}</div>
              <div className="text-sm text-gray-600">{statusConfig.description}</div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card>
              <h2 className="text-xl font-semibold text-dark-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items && order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start pb-4 border-b last:border-0">
                    <div className="flex-1">
                      <h3 className="font-semibold text-dark-900">{item.menu_item_name}</h3>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-sm text-gray-600">Price: NPR {parseFloat(item.price).toFixed(0)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-dark-900">
                        NPR {parseFloat(item.subtotal).toFixed(0)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-dark-900">Total Amount</span>
                  <span className="text-2xl font-bold text-primary-600">
                    NPR {parseFloat(order.total_amount).toFixed(0)}
                  </span>
                </div>
              </div>
            </Card>

            {/* Delivery Address */}
            <Card>
              <h2 className="text-xl font-semibold text-dark-900 mb-4">Delivery Address</h2>
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-primary-600 flex-shrink-0 mt-1" />
                <p className="text-gray-700">{order.delivery_address}</p>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Restaurant Info */}
            <Card>
              <h2 className="text-lg font-semibold text-dark-900 mb-4">Restaurant</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Package size={20} className="text-primary-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium text-dark-900">{order.restaurant_name}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Rider Info */}
            {order.rider_name && (
              <Card>
                <h2 className="text-lg font-semibold text-dark-900 mb-4">Delivery Rider</h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Bike size={20} className="text-primary-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-dark-900">{order.rider_name}</p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Customer Info */}
            <Card>
              <h2 className="text-lg font-semibold text-dark-900 mb-4">Customer</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User size={20} className="text-primary-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium text-dark-900">{order.customer_name}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Timestamps */}
            <Card>
              <h2 className="text-lg font-semibold text-dark-900 mb-4">Timeline</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Clock size={16} className="text-gray-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-600">Ordered</p>
                    <p className="font-medium text-dark-900">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                {order.prepared_at && (
                  <div className="flex items-start gap-2">
                    <Clock size={16} className="text-gray-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-gray-600">Prepared</p>
                      <p className="font-medium text-dark-900">
                        {new Date(order.prepared_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
                {order.picked_up_at && (
                  <div className="flex items-start gap-2">
                    <Clock size={16} className="text-gray-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-gray-600">Picked Up</p>
                      <p className="font-medium text-dark-900">
                        {new Date(order.picked_up_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
                {order.delivered_at && (
                  <div className="flex items-start gap-2">
                    <Clock size={16} className="text-gray-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-gray-600">Delivered</p>
                      <p className="font-medium text-dark-900">
                        {new Date(order.delivered_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Cancel Order Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-dark-900 mb-2">
                    Cancel Order #{order.id}?
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Are you sure you want to cancel this order? This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-dark-900 mb-2">
                  Reason for cancellation <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  placeholder="Please provide a reason..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    setShowCancelModal(false);
                    setCancellationReason('');
                  }}
                  disabled={cancelling}
                >
                  Keep Order
                </Button>
                <Button
                  variant="danger"
                  className="flex-1"
                  onClick={handleCancelOrder}
                  loading={cancelling}
                  disabled={cancelling}
                >
                  {cancelling ? 'Cancelling...' : 'Yes, Cancel Order'}
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
