import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  Bike, 
  Package, 
  MapPin, 
  Clock,
  DollarSign,
  CheckCircle,
  Navigation,
  Phone,
  AlertCircle
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

  // Mock data for demonstration
  useEffect(() => {
    // TODO: Replace with actual API calls
    setTimeout(() => {
      setAvailableOrders([
        {
          id: 1,
          restaurant: 'Pizza Palace',
          restaurant_address: '123 Main St',
          customer_name: 'John Doe',
          customer_address: '456 Oak Ave',
          customer_phone: '+1 234-567-8900',
          total: 32.99,
          delivery_fee: 4.99,
          distance: '2.5 km',
          estimated_time: '15 mins'
        },
        {
          id: 2,
          restaurant: 'Burger House',
          restaurant_address: '789 Elm St',
          customer_name: 'Jane Smith',
          customer_address: '321 Pine Rd',
          customer_phone: '+1 234-567-8901',
          total: 24.50,
          delivery_fee: 3.99,
          distance: '1.8 km',
          estimated_time: '12 mins'
        }
      ]);

      setActiveDeliveries([
        {
          id: 3,
          restaurant: 'Sushi Bar',
          restaurant_address: '555 Cedar Ln',
          customer_name: 'Bob Wilson',
          customer_address: '888 Maple Dr',
          customer_phone: '+1 234-567-8902',
          total: 45.00,
          delivery_fee: 5.99,
          status: 'PICKED_UP',
          pickup_time: '2024-01-15T11:00:00Z'
        }
      ]);

      setCompletedDeliveries([
        {
          id: 4,
          restaurant: 'Taco Town',
          customer_name: 'Alice Brown',
          total: 18.99,
          delivery_fee: 3.50,
          completed_at: '2024-01-15T10:30:00Z',
          rating: 5
        },
        {
          id: 5,
          restaurant: 'Pasta Place',
          customer_name: 'Charlie Davis',
          total: 28.50,
          delivery_fee: 4.50,
          completed_at: '2024-01-15T09:45:00Z',
          rating: 4
        }
      ]);

      setLoading(false);
    }, 500);
  }, []);

  const handleAcceptOrder = (orderId) => {
    // TODO: Implement API call to accept order
    console.log(`Accepting order ${orderId}`);
    const order = availableOrders.find(o => o.id === orderId);
    if (order) {
      setActiveDeliveries([...activeDeliveries, { ...order, status: 'ACCEPTED' }]);
      setAvailableOrders(availableOrders.filter(o => o.id !== orderId));
    }
  };

  const handlePickup = (orderId) => {
    // TODO: Implement API call to mark as picked up
    console.log(`Marking order ${orderId} as picked up`);
    setActiveDeliveries(activeDeliveries.map(order =>
      order.id === orderId ? { ...order, status: 'PICKED_UP', pickup_time: new Date().toISOString() } : order
    ));
  };

  const handleDeliver = (orderId) => {
    // TODO: Implement API call to mark as delivered
    console.log(`Marking order ${orderId} as delivered`);
    const order = activeDeliveries.find(o => o.id === orderId);
    if (order) {
      setCompletedDeliveries([
        { ...order, completed_at: new Date().toISOString(), rating: null },
        ...completedDeliveries
      ]);
      setActiveDeliveries(activeDeliveries.filter(o => o.id !== orderId));
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
      value: `$${completedDeliveries.reduce((sum, d) => sum + d.delivery_fee, 0).toFixed(2)}`,
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
        <h1 className="text-3xl font-bold text-dark-900 mb-2">
          Rider Dashboard
        </h1>
        <p className="text-dark-600">
          Welcome back, {user?.name || 'Rider'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dark-600 text-sm mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-dark-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-light-300">
        <div className="flex space-x-8">
          {['available', 'active', 'history'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-2 font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-dark-600 hover:text-dark-900'
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
            <Card>
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-dark-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-dark-900 mb-2">No Available Orders</h3>
                <p className="text-dark-600">Check back soon for new delivery opportunities.</p>
              </div>
            </Card>
          ) : (
            availableOrders.map((order) => (
              <Card key={order.id}>
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-dark-900">Order #{order.id}</h3>
                        <Badge variant="warning">New</Badge>
                      </div>
                      <p className="text-primary-600 font-semibold">{order.restaurant}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-semibold text-dark-900 mb-1">Pickup From:</p>
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-dark-500 mt-0.5 flex-shrink-0" />
                          <p className="text-dark-700 text-sm">{order.restaurant_address}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-dark-900 mb-1">Deliver To:</p>
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-dark-700 text-sm">{order.customer_address}</p>
                            <p className="text-dark-600 text-sm">{order.customer_name}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-1 text-dark-600">
                        <Navigation className="w-4 h-4" />
                        <span>{order.distance}</span>
                      </div>
                      <div className="flex items-center gap-1 text-dark-600">
                        <Clock className="w-4 h-4" />
                        <span>{order.estimated_time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between lg:w-48">
                    <div className="text-right">
                      <p className="text-sm text-dark-600 mb-1">Order Total</p>
                      <p className="text-2xl font-bold text-dark-900">${order.total}</p>
                      <p className="text-lg font-semibold text-green-600 mt-1">
                        Earn ${order.delivery_fee}
                      </p>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => handleAcceptOrder(order.id)}
                    >
                      <CheckCircle className="w-4 h-4" />
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
              <Card key={order.id}>
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-dark-900">Order #{order.id}</h3>
                        <Badge variant={order.status === 'PICKED_UP' ? 'info' : 'success'}>
                          {order.status === 'PICKED_UP' ? 'In Transit' : 'Accepted'}
                        </Badge>
                      </div>
                      <p className="text-primary-600 font-semibold">{order.restaurant}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-semibold text-dark-900 mb-1">
                          {order.status === 'ACCEPTED' ? 'Pickup From:' : 'Picked Up From:'}
                        </p>
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-dark-500 mt-0.5 flex-shrink-0" />
                          <p className="text-dark-700 text-sm">{order.restaurant_address}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-dark-900 mb-1">Deliver To:</p>
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-dark-700 text-sm">{order.customer_address}</p>
                            <p className="text-dark-600 text-sm">{order.customer_name}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-light-100 rounded-lg">
                      <Phone className="w-4 h-4 text-primary-600" />
                      <a href={`tel:${order.customer_phone}`} className="text-primary-600 font-medium">
                        {order.customer_phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between lg:w-48">
                    <div className="text-right">
                      <p className="text-sm text-dark-600 mb-1">Delivery Fee</p>
                      <p className="text-2xl font-bold text-green-600">${order.delivery_fee}</p>
                    </div>
                    {order.status === 'ACCEPTED' ? (
                      <Button
                        className="w-full"
                        onClick={() => handlePickup(order.id)}
                      >
                        <Package className="w-4 h-4" />
                        Mark Picked Up
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        variant="primary"
                        onClick={() => handleDeliver(order.id)}
                      >
                        <CheckCircle className="w-4 h-4" />
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
              <Card key={delivery.id}>
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-dark-900">Order #{delivery.id}</h3>
                      <Badge variant="success">Delivered</Badge>
                    </div>
                    <p className="text-dark-700 mb-1">{delivery.restaurant}</p>
                    <p className="text-sm text-dark-600">Customer: {delivery.customer_name}</p>
                    <p className="text-sm text-dark-500 mt-2">
                      {new Date(delivery.completed_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-dark-600 mb-1">Earned</p>
                    <p className="text-2xl font-bold text-green-600">${delivery.delivery_fee}</p>
                    {delivery.rating && (
                      <p className="text-sm text-yellow-600 mt-2">★ {delivery.rating}/5</p>
                    )}
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
