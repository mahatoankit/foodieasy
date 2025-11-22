import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  Store, 
  Package, 
  Clock, 
  DollarSign,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

const OwnerDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    // TODO: Replace with actual API calls
    setTimeout(() => {
      setRestaurant({
        id: 1,
        name: 'Your Restaurant Name',
        address: '123 Food Street',
        cuisine: 'Italian',
        delivery_time: '30-45 mins',
        is_open: true
      });

      setOrders([
        {
          id: 1,
          customer_name: 'John Doe',
          items: ['Margherita Pizza', 'Caesar Salad'],
          total: 32.99,
          status: 'PENDING',
          created_at: '2024-01-15T10:30:00Z'
        },
        {
          id: 2,
          customer_name: 'Jane Smith',
          items: ['Pasta Carbonara'],
          total: 18.50,
          status: 'PREPARING',
          created_at: '2024-01-15T10:45:00Z'
        }
      ]);

      setMenuItems([
        {
          id: 1,
          name: 'Margherita Pizza',
          category: 'Pizza',
          price: 15.99,
          description: 'Classic tomato and mozzarella',
          available: true
        },
        {
          id: 2,
          name: 'Caesar Salad',
          category: 'Salads',
          price: 12.99,
          description: 'Fresh romaine with caesar dressing',
          available: true
        }
      ]);

      setLoading(false);
    }, 500);
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'warning',
      PREPARING: 'info',
      READY: 'success',
      DELIVERED: 'secondary',
      CANCELLED: 'error'
    };
    return colors[status] || 'secondary';
  };

  const handleStatusUpdate = (orderId, newStatus) => {
    // TODO: Implement API call to update order status
    console.log(`Updating order ${orderId} to ${newStatus}`);
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const stats = [
    {
      label: 'Today\'s Orders',
      value: '12',
      icon: Package,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50'
    },
    {
      label: 'Pending Orders',
      value: orders.filter(o => o.status === 'PENDING').length,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      label: 'Today\'s Revenue',
      value: '$456.80',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Menu Items',
      value: menuItems.length,
      icon: Store,
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
          Restaurant Dashboard
        </h1>
        <p className="text-dark-600">
          Welcome back, {restaurant?.name}
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
          {['overview', 'orders', 'menu'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-2 font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-dark-600 hover:text-dark-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Restaurant Status */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-dark-900">Restaurant Status</h2>
              <Badge variant={restaurant.is_open ? 'success' : 'error'}>
                {restaurant.is_open ? 'Open' : 'Closed'}
              </Badge>
            </div>
            <div className="space-y-2 text-dark-600">
              <p><strong>Name:</strong> {restaurant.name}</p>
              <p><strong>Address:</strong> {restaurant.address}</p>
              <p><strong>Cuisine:</strong> {restaurant.cuisine}</p>
              <p><strong>Delivery Time:</strong> {restaurant.delivery_time}</p>
            </div>
            <div className="mt-4">
              <Button variant="secondary" size="sm">
                <Edit2 className="w-4 h-4" />
                Edit Restaurant Profile
              </Button>
            </div>
          </Card>

          {/* Recent Orders Preview */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-dark-900">Recent Orders</h2>
              <Button variant="ghost" size="sm" onClick={() => setActiveTab('orders')}>
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {orders.slice(0, 3).map((order) => (
                <div key={order.id} className="p-4 bg-light-100 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-dark-900">Order #{order.id}</p>
                      <p className="text-sm text-dark-600">{order.customer_name}</p>
                    </div>
                    <Badge variant={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-dark-700 mb-2">
                    {order.items.join(', ')}
                  </p>
                  <p className="font-bold text-primary-600">${order.total}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-dark-900">Order Management</h2>
          </div>

          {orders.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-dark-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-dark-900 mb-2">No Orders Yet</h3>
                <p className="text-dark-600">Orders will appear here when customers place them.</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-dark-900">Order #{order.id}</h3>
                        <Badge variant={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-dark-600 mb-1">Customer: {order.customer_name}</p>
                      <p className="text-dark-700 mb-2">{order.items.join(', ')}</p>
                      <p className="text-sm text-dark-500">
                        {new Date(order.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <p className="text-2xl font-bold text-primary-600">${order.total}</p>
                      {order.status === 'PENDING' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleStatusUpdate(order.id, 'PREPARING')}
                          >
                            <CheckCircle className="w-4 h-4" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleStatusUpdate(order.id, 'CANCELLED')}
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </Button>
                        </div>
                      )}
                      {order.status === 'PREPARING' && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(order.id, 'READY')}
                        >
                          Mark Ready
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'menu' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-dark-900">Menu Management</h2>
            <Button>
              <Plus className="w-4 h-4" />
              Add Menu Item
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {menuItems.map((item) => (
              <Card key={item.id}>
                <div className="h-32 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg mb-4"></div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-dark-900">{item.name}</h3>
                    <p className="text-sm text-dark-600">{item.category}</p>
                  </div>
                  <Badge variant={item.available ? 'success' : 'error'}>
                    {item.available ? 'Available' : 'Out of Stock'}
                  </Badge>
                </div>
                <p className="text-sm text-dark-700 mb-3">{item.description}</p>
                <div className="flex justify-between items-center">
                  <p className="text-lg font-bold text-primary-600">${item.price}</p>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
