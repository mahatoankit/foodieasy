import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchMyOrders } from './orderSlice';
import { Package, Clock, CheckCircle, XCircle, Truck, ChefHat, Eye, RefreshCw } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';

const OrderHistory = () => {
  const dispatch = useDispatch();
  const { list: orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const getStatusVariant = (status) => {
    const variants = {
      PENDING: 'warning',
      PREPARING: 'info',
      READY_FOR_PICKUP: 'secondary',
      OUT_FOR_DELIVERY: 'info',
      DELIVERED: 'success',
      CANCELLED: 'error',
    };
    return variants[status] || 'secondary';
  };

  const getStatusIcon = (status) => {
    const icons = {
      PENDING: <Clock size={20} />,
      PREPARING: <ChefHat size={20} />,
      READY_FOR_PICKUP: <Package size={20} />,
      OUT_FOR_DELIVERY: <Truck size={20} />,
      DELIVERED: <CheckCircle size={20} />,
      CANCELLED: <XCircle size={20} />,
    };
    return icons[status] || <Package size={20} />;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-600">Error loading orders</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-200 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-dark-900 mb-8">My Orders</h1>

        {!orders || orders.length === 0 ? (
          <EmptyState
            icon={<Package size={64} />}
            title="No Orders Yet"
            description="You haven't placed any orders yet. Start ordering from your favorite restaurants!"
            actionLabel="Browse Restaurants"
            onAction={() => window.location.href = '/restaurants'}
          />
        ) : (
          <div className="space-y-6">
            {orders.filter(order => order && order.id).map((order, index) => (
              <Card key={order.id} hover className="relative">
                {/* Timeline connector */}
                {index !== orders.length - 1 && (
                  <div className="absolute left-8 top-full w-0.5 h-6 bg-gray-200 z-0"></div>
                )}
                
                <div className="flex gap-4">
                  {/* Status Icon */}
                  <div className="flex-shrink-0 relative z-10">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      order.status === 'DELIVERED' ? 'bg-green-100 text-green-600' :
                      order.status === 'CANCELLED' ? 'bg-red-100 text-red-600' :
                      'bg-primary-100 text-primary-600'
                    }`}>
                      {getStatusIcon(order.status || 'PENDING')}
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-dark-900">
                            Order #{order.id}
                          </h3>
                          <Badge variant={getStatusVariant(order.status)}>
                            {order.status_display || (order.status ? order.status.replace(/_/g, ' ') : 'Unknown')}
                          </Badge>
                        </div>
                        <p className="text-gray-600 font-medium">{order.restaurant_name || 'Restaurant'}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {order.created_at ? new Date(order.created_at).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'Date unavailable'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary-600">
                          NPR {order.total_amount ? parseFloat(order.total_amount).toFixed(0) : '0'}
                        </p>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="border-t border-gray-200 pt-3 mb-4">
                      <p className="text-sm text-gray-600 mb-2 font-medium">
                        {order.item_count || 0} item{order.item_count !== 1 ? 's' : ''}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {order.items && order.items.slice(0, 3).map((item) => (
                          <span key={item.id} className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-700">
                            {item.quantity}× {item.menu_item_name}
                          </span>
                        ))}
                        {order.items && order.items.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-600">
                            +{order.items.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Link to={`/orders/${order.id}`}>
                        <Button
                          variant="primary"
                          size="sm"
                          icon={<Eye size={16} />}
                        >
                          View Details
                        </Button>
                      </Link>
                      {order.status === 'DELIVERED' && (
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={<RefreshCw size={16} />}
                          onClick={(e) => {
                            e.preventDefault();
                            // TODO: Implement reorder functionality
                            toast.info('Reorder functionality coming soon!');
                          }}
                        >
                          Reorder
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
