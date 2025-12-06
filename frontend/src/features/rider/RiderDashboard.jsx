import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { 
  Bike, 
  Package, 
  MapPin, 
  Clock,
  DollarSign,
  CheckCircle,
  Navigation,
  Phone,
  AlertCircle,
  Truck
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

const RiderDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('available');
  const [availableOrders, setAvailableOrders] = useState([]);
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [completedDeliveries, setCompletedDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real data from API
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch available orders (READY_FOR_PICKUP)
      const availableResponse = await fetch('http://localhost:8000/api/orders/pending_orders/', { headers });
      if (availableResponse.ok) {
        const availableData = await availableResponse.json();
        console.log('📦 Available Orders:', availableData);
        setAvailableOrders(availableData);
      }

      // Fetch rider's orders (assigned to this rider)
      const myOrdersResponse = await fetch('http://localhost:8000/api/orders/my_orders/', { headers });
      if (myOrdersResponse.ok) {
        const myOrdersData = await myOrdersResponse.json();
        console.log('🚴 My Orders:', myOrdersData);
        // Active deliveries: orders assigned to rider that are READY_FOR_PICKUP or OUT_FOR_DELIVERY
        const active = myOrdersData.filter(o => 
          o.status === 'READY_FOR_PICKUP' || o.status === 'OUT_FOR_DELIVERY'
        );
        const completed = myOrdersData.filter(o => o.status === 'DELIVERED');
        console.log('✅ Active Deliveries:', active);
        console.log('📋 Completed Deliveries:', completed);
        setActiveDeliveries(active);
        setCompletedDeliveries(completed);
      }
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOrder = async (orderId) => {
    console.log(`🎯 Accepting Order #${orderId}...`);
    const loadingToast = toast.loading('Accepting order...');
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/orders/${orderId}/assign_rider/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log('📥 Accept Order Response:', data);

      if (response.ok) {
        toast.success(`Order #${orderId} accepted! Switching to Active Deliveries...`, { id: loadingToast });
        console.log('✅ Order accepted, refreshing data...');
        // Refresh orders after accepting
        await fetchOrders();
        // Switch to Active Deliveries tab to show the accepted order
        console.log('🔄 Switching to Active Deliveries tab');
        setActiveTab('active');
      } else {
        const errorMessage = data.error || 'Failed to accept order';
        console.error('❌ Failed to accept order:', errorMessage);
        toast.error(errorMessage, { id: loadingToast });
      }
    } catch (error) {
      console.error('❌ Error accepting order:', error);
      toast.error('Network error. Please try again.', { id: loadingToast });
    }
  };

  const handlePickup = async (orderId) => {
    const loadingToast = toast.loading('Marking as picked up...');
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/orders/${orderId}/update_status/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'OUT_FOR_DELIVERY' })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Order picked up! Ready for delivery.', { id: loadingToast });
        // Refresh orders after pickup
        fetchOrders();
      } else {
        const errorMessage = data.error || 'Failed to update order status';
        toast.error(errorMessage, { id: loadingToast });
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Network error. Please try again.', { id: loadingToast });
    }
  };

  const handleDeliver = async (orderId) => {
    const loadingToast = toast.loading('Marking as delivered...');
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/orders/${orderId}/update_status/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'DELIVERED' })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Order delivered successfully! 🎉', { id: loadingToast });
        // Refresh orders after delivery
        fetchOrders();
      } else {
        const errorMessage = data.error || 'Failed to update order status';
        toast.error(errorMessage, { id: loadingToast });
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Network error. Please try again.', { id: loadingToast });
    }
  };

  const stats = [
    {
      label: 'Today\'s Deliveries',
      value: completedDeliveries.length,
      icon: Package,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50'
    },
    {
      label: 'Active Deliveries',
      value: activeDeliveries.length,
      icon: Bike,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      label: 'Today\'s Earnings',
      value: `NPR ${completedDeliveries.length * 50}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Available Orders',
      value: availableOrders.length,
      icon: AlertCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    }
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-dark-900 mb-3">
          🚴 Rider Dashboard
        </h1>
        <p className="text-dark-600 text-lg">
          Welcome back, <span className="font-semibold text-primary-600">{user?.name || 'Rider'}</span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow border-2 border-light-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dark-600 text-sm mb-2 uppercase tracking-wide font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-dark-900">{stat.value}</p>
                </div>
                <div className={`p-4 rounded-xl ${stat.bgColor}`}>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="mb-8 border-b-2 border-light-200">
        <div className="flex gap-2">
          {['available', 'active', 'history'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-6 font-semibold text-base capitalize transition-all rounded-t-lg ${
                activeTab === tab
                  ? 'text-primary-600 border-b-3 border-primary-600 bg-primary-50'
                  : 'text-dark-600 hover:text-dark-900 hover:bg-light-100'
              }`}
            >
              {tab === 'available' ? '📦 Available Orders' : tab === 'active' ? '🚴 Active Deliveries' : '📋 History'}
            </button>
          ))}
        </div>
      </div>

      {/* Available Orders Tab */}
      {activeTab === 'available' && (
        <div className="space-y-4">
          {availableOrders.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-dark-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-dark-900 mb-2">No Available Orders</h3>
                <p className="text-dark-600">Check back soon for new delivery opportunities.</p>
              </div>
            </Card>
          ) : (
            availableOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow border-2 border-light-200 hover:border-primary-300">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-dark-900">Order #{order.id}</h3>
                        <Badge variant="warning" className="text-sm">🔥 New Order</Badge>
                      </div>
                      <p className="text-primary-600 font-semibold text-lg">{order.restaurant_name}</p>
                      <p className="text-dark-600 text-sm mt-1">{order.item_count} item(s)</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-light-50 p-4 rounded-lg">
                        <p className="text-sm font-semibold text-dark-900 mb-2 uppercase tracking-wide">📍 Pickup From</p>
                        <div className="flex items-start gap-2">
                          <MapPin className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                          <p className="text-dark-700 font-medium">{order.restaurant_name}</p>
                        </div>
                      </div>

                      <div className="bg-light-50 p-4 rounded-lg">
                        <p className="text-sm font-semibold text-dark-900 mb-2 uppercase tracking-wide">🚚 Deliver To</p>
                        <div className="flex items-start gap-2">
                          <MapPin className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-dark-700 font-medium">{order.delivery_address}</p>
                            <p className="text-dark-600 text-sm mt-1">{order.customer_name}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
                      <p className="text-sm font-semibold text-dark-900 mb-2">Order Details</p>
                      <div className="space-y-1">
                        <p className="text-dark-700 text-sm"><span className="font-medium">Total Amount:</span> NPR {Math.round(order.total_amount)}</p>
                        <p className="text-dark-700 text-sm"><span className="font-medium">Customer:</span> {order.customer_email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between lg:w-52 border-l border-light-200 lg:pl-6">
                    <div className="text-right mb-4 w-full">
                      <p className="text-sm text-dark-600 mb-1 uppercase tracking-wide">You'll Earn</p>
                      <p className="text-4xl font-bold text-green-600 mb-2">NPR 50</p>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm text-dark-700"><span className="font-medium">Order Total:</span></p>
                        <p className="text-lg font-bold text-dark-900">NPR {Math.round(order.total_amount)}</p>
                      </div>
                    </div>
                    <Button
                      className="w-full lg:w-48 text-base py-3"
                      onClick={() => handleAcceptOrder(order.id)}
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Accept Order
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Active Deliveries Tab */}
      {activeTab === 'active' && (
        <div className="space-y-4">
          {activeDeliveries.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <Bike className="w-16 h-16 text-dark-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-dark-900 mb-2">No Active Deliveries</h3>
                <p className="text-dark-600">Accept an order to start delivering.</p>
              </div>
            </Card>
          ) : (
            activeDeliveries.map((order) => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-dark-900">Order #{order.id}</h3>
                        <Badge variant={order.status === 'OUT_FOR_DELIVERY' ? 'info' : 'success'} className="text-sm">
                          {order.status === 'OUT_FOR_DELIVERY' ? 'In Transit' : 'Ready for Pickup'}
                        </Badge>
                      </div>
                      <p className="text-primary-600 font-semibold text-lg">{order.restaurant_name}</p>
                      <p className="text-dark-600 text-sm mt-1">{order.item_count} item(s)</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-light-50 p-4 rounded-lg">
                        <p className="text-sm font-semibold text-dark-900 mb-2 uppercase tracking-wide">
                          {order.status === 'READY_FOR_PICKUP' ? '📍 Pickup From' : '✓ Picked Up From'}
                        </p>
                        <div className="flex items-start gap-2">
                          <MapPin className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                          <p className="text-dark-700 font-medium">{order.restaurant_name}</p>
                        </div>
                      </div>

                      <div className="bg-light-50 p-4 rounded-lg">
                        <p className="text-sm font-semibold text-dark-900 mb-2 uppercase tracking-wide">🚚 Deliver To</p>
                        <div className="flex items-start gap-2">
                          <MapPin className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-dark-700 font-medium">{order.delivery_address}</p>
                            <p className="text-dark-600 text-sm mt-1">{order.customer_name}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
                      <p className="text-sm font-semibold text-dark-900 mb-2">Order Details</p>
                      <div className="space-y-1">
                        <p className="text-dark-700 text-sm"><span className="font-medium">Total Amount:</span> NPR {Math.round(order.total_amount)}</p>
                        <p className="text-dark-700 text-sm"><span className="font-medium">Customer:</span> {order.customer_email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between lg:w-52 border-l border-light-200 lg:pl-6">
                    <div className="text-right mb-4 w-full">
                      <p className="text-sm text-dark-600 mb-1 uppercase tracking-wide">Delivery Fee</p>
                      <p className="text-3xl font-bold text-green-600">NPR 50</p>
                    </div>
                    {order.status === 'READY_FOR_PICKUP' ? (
                      <Button
                        className="w-full lg:w-48 text-base py-3"
                        onClick={() => handlePickup(order.id)}
                      >
                        <Truck className="w-5 h-5 mr-2" />
                        Mark Picked Up
                      </Button>
                    ) : (
                      <Button
                        className="w-full lg:w-48 text-base py-3"
                        variant="success"
                        onClick={() => handleDeliver(order.id)}
                      >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Mark Delivered
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {completedDeliveries.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-dark-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-dark-900 mb-2">No Delivery History</h3>
                <p className="text-dark-600">Your completed deliveries will appear here.</p>
              </div>
            </Card>
          ) : (
            completedDeliveries.map((delivery) => (
              <Card key={delivery.id} className="bg-light-50">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-dark-900">Order #{delivery.id}</h3>
                      <Badge variant="success" className="text-sm">✓ Delivered</Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-dark-700 font-semibold text-lg">{delivery.restaurant_name}</p>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-dark-500" />
                        <p className="text-sm text-dark-600">{delivery.delivery_address}</p>
                      </div>
                      <p className="text-sm text-dark-600">Customer: {delivery.customer_name}</p>
                      <div className="flex items-center gap-2 mt-3 text-sm text-dark-500">
                        <Clock className="w-4 h-4" />
                        <p>{new Date(delivery.updated_at).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right border-l border-light-200 md:pl-6">
                    <p className="text-sm text-dark-600 mb-1 uppercase tracking-wide">You Earned</p>
                    <p className="text-3xl font-bold text-green-600">NPR 50</p>
                    <div className="mt-4 bg-white p-3 rounded-lg">
                      <p className="text-xs text-dark-600">Order Total</p>
                      <p className="text-lg font-bold text-dark-900">NPR {Math.round(delivery.total_amount)}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default RiderDashboard;
