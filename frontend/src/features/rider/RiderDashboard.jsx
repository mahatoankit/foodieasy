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
  AlertCircle,
  Truck,
  Store
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
    <div className="min-h-screen bg-light-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-12 px-4 mb-8 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Bike className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-1 drop-shadow-md">
                Rider Dashboard
              </h1>
              <p className="text-primary-50 text-lg">
                Welcome back, {user?.name || 'Rider'}!
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8">

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-dark-600 text-sm font-medium mb-2">{stat.label}</p>
                    <p className="text-3xl font-bold text-dark-900">{stat.value}</p>
                  </div>
                  <div className={`p-4 rounded-xl ${stat.bgColor} shadow-md`}>
                    <Icon className={`w-7 h-7 ${stat.color}`} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="mb-8 bg-white rounded-xl shadow-md p-2">
          <div className="flex space-x-2">
            {['available', 'active', 'history'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold text-base capitalize transition-all ${
                  activeTab === tab
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'text-dark-600 hover:bg-light-100'
                }`}
              >
                {tab === 'available' ? 'Available Orders' : tab === 'active' ? 'Active Deliveries' : 'History'}
              </button>
            ))}
          </div>
        </div>

        {/* Available Orders Tab */}
        {activeTab === 'available' && (
          <div className="space-y-4">
            {availableOrders.length === 0 ? (
              <Card className="bg-white shadow-lg">
                <div className="text-center py-16">
                  <div className="p-4 bg-light-100 rounded-full inline-block mb-4">
                    <Package className="w-16 h-16 text-dark-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-dark-900 mb-2">No Available Orders</h3>
                  <p className="text-dark-600">Check back soon for new delivery opportunities.</p>
                </div>
              </Card>
          ) : (
            availableOrders.map((order) => (
              <Card key={order.id} className="bg-white hover:shadow-xl transition-all duration-300 border border-light-300">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="border-b border-light-200 pb-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-2xl font-bold text-dark-900">Order #{order.id}</h3>
                        <Badge variant="warning">New</Badge>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Store className="w-5 h-5 text-primary-600" />
                        <p className="text-primary-600 font-semibold text-lg">{order.restaurant_name}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-dark-600">
                        <Package className="w-4 h-4" />
                        <span>{order.item_count} {order.item_count === 1 ? 'item' : 'items'}</span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-primary-50 p-4 rounded-lg border border-primary-100">
                        <p className="text-xs font-semibold text-primary-700 mb-3 uppercase tracking-wider">Pickup Location</p>
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            <MapPin className="w-5 h-5 text-primary-600" />
                          </div>
                          <p className="text-dark-900 font-medium">{order.restaurant_name}</p>
                        </div>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                        <p className="text-xs font-semibold text-green-700 mb-3 uppercase tracking-wider">Delivery Location</p>
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            <MapPin className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-dark-900 font-medium">{order.delivery_address}</p>
                            <p className="text-dark-600 text-sm mt-1">{order.customer_name}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-light-100 p-4 rounded-lg">
                      <p className="text-xs font-semibold text-dark-700 mb-3 uppercase tracking-wider">Order Summary</p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-dark-600 text-sm">Order Total:</span>
                          <span className="text-dark-900 font-semibold">NPR {Math.round(order.total_amount)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-dark-600">Customer:</span>
                          <span className="text-dark-700">{order.customer_email}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between lg:w-64 border-l border-light-200 lg:pl-6">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 mb-4">
                      <p className="text-xs font-semibold text-green-700 mb-2 uppercase tracking-wider">Your Earnings</p>
                      <div className="flex items-baseline gap-2 mb-3">
                        <DollarSign className="w-6 h-6 text-green-600" />
                        <p className="text-4xl font-bold text-green-600">50</p>
                        <span className="text-green-700 font-medium">NPR</span>
                      </div>
                      <div className="text-xs text-green-700">
                        <p>Fixed delivery fee</p>
                      </div>
                    </div>
                    <Button
                      className="w-full text-base py-3 shadow-lg"
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
              <Card className="bg-white shadow-lg">
                <div className="text-center py-16">
                  <div className="p-4 bg-light-100 rounded-full inline-block mb-4">
                    <Bike className="w-16 h-16 text-dark-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-dark-900 mb-2">No Active Deliveries</h3>
                  <p className="text-dark-600">Accept an order to start delivering.</p>
                </div>
              </Card>
          ) : (
            activeDeliveries.map((order) => (
              <Card key={order.id} className="bg-white hover:shadow-xl transition-all duration-300 border border-light-300">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="border-b border-light-200 pb-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-2xl font-bold text-dark-900">Order #{order.id}</h3>
                        <Badge variant={order.status === 'OUT_FOR_DELIVERY' ? 'info' : 'success'}>
                          {order.status === 'OUT_FOR_DELIVERY' ? 'In Transit' : 'Ready for Pickup'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Store className="w-5 h-5 text-primary-600" />
                        <p className="text-primary-600 font-semibold text-lg">{order.restaurant_name}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-dark-600">
                        <Package className="w-4 h-4" />
                        <span>{order.item_count} {order.item_count === 1 ? 'item' : 'items'}</span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className={`p-4 rounded-lg border ${order.status === 'READY_FOR_PICKUP' ? 'bg-primary-50 border-primary-100' : 'bg-light-100 border-light-200'}`}>
                        <p className={`text-xs font-semibold mb-3 uppercase tracking-wider ${order.status === 'READY_FOR_PICKUP' ? 'text-primary-700' : 'text-dark-600'}`}>
                          {order.status === 'READY_FOR_PICKUP' ? 'Pickup Location' : 'Picked Up From'}
                        </p>
                        <div className="flex items-start gap-3">
                          <div className={`p-2 bg-white rounded-lg shadow-sm ${order.status === 'OUT_FOR_DELIVERY' ? 'opacity-60' : ''}`}>
                            {order.status === 'READY_FOR_PICKUP' ? (
                              <MapPin className="w-5 h-5 text-primary-600" />
                            ) : (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            )}
                          </div>
                          <p className="text-dark-900 font-medium">{order.restaurant_name}</p>
                        </div>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                        <p className="text-xs font-semibold text-green-700 mb-3 uppercase tracking-wider">Delivery Location</p>
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            <MapPin className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-dark-900 font-medium">{order.delivery_address}</p>
                            <p className="text-dark-600 text-sm mt-1">{order.customer_name}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-light-100 p-4 rounded-lg">
                      <p className="text-xs font-semibold text-dark-700 mb-3 uppercase tracking-wider">Order Summary</p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-dark-600 text-sm">Order Total:</span>
                          <span className="text-dark-900 font-semibold">NPR {Math.round(order.total_amount)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-dark-600">Customer:</span>
                          <span className="text-dark-700">{order.customer_email}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between lg:w-64 border-l border-light-200 lg:pl-6">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 mb-4">
                      <p className="text-xs font-semibold text-green-700 mb-2 uppercase tracking-wider">Delivery Fee</p>
                      <div className="flex items-baseline gap-2">
                        <DollarSign className="w-6 h-6 text-green-600" />
                        <p className="text-4xl font-bold text-green-600">50</p>
                        <span className="text-green-700 font-medium">NPR</span>
                      </div>
                    </div>
                    {order.status === 'READY_FOR_PICKUP' ? (
                      <Button
                        className="w-full text-base py-3 shadow-lg"
                        onClick={() => handlePickup(order.id)}
                      >
                        <Truck className="w-5 h-5 mr-2" />
                        Mark Picked Up
                      </Button>
                    ) : (
                      <Button
                        className="w-full text-base py-3 shadow-lg"
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
              <Card className="bg-white shadow-lg">
                <div className="text-center py-16">
                  <div className="p-4 bg-light-100 rounded-full inline-block mb-4">
                    <Package className="w-16 h-16 text-dark-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-dark-900 mb-2">No Delivery History</h3>
                  <p className="text-dark-600">Your completed deliveries will appear here.</p>
                </div>
              </Card>
          ) : (
            completedDeliveries.map((delivery) => (
              <Card key={delivery.id} className="bg-white hover:shadow-lg transition-all duration-300 border border-light-300">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <div className="border-b border-light-200 pb-4 mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-2xl font-bold text-dark-900">Order #{delivery.id}</h3>
                        <Badge variant="success">Delivered</Badge>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Store className="w-5 h-5 text-primary-600" />
                        <p className="text-primary-600 font-semibold text-lg">{delivery.restaurant_name}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 bg-light-50 p-3 rounded-lg">
                        <MapPin className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-dark-600 mb-1">Delivered To</p>
                          <p className="text-sm font-medium text-dark-900">{delivery.delivery_address}</p>
                          <p className="text-sm text-dark-600 mt-1">{delivery.customer_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-dark-500">
                        <Clock className="w-4 h-4" />
                        <p>{new Date(delivery.updated_at).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between md:w-64 border-l border-light-200 md:pl-6">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 mb-4">
                      <p className="text-xs font-semibold text-green-700 mb-2 uppercase tracking-wider">You Earned</p>
                      <div className="flex items-baseline gap-2 mb-3">
                        <DollarSign className="w-6 h-6 text-green-600" />
                        <p className="text-4xl font-bold text-green-600">50</p>
                        <span className="text-green-700 font-medium">NPR</span>
                      </div>
                    </div>
                    <div className="bg-light-100 p-4 rounded-lg">
                      <p className="text-xs text-dark-600 mb-1">Order Total</p>
                      <p className="text-2xl font-bold text-dark-900">NPR {Math.round(delivery.total_amount)}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
        )}
      </div>
    </div>
  );
};

export default RiderDashboard;
