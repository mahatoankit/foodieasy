import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Store, 
  Package, 
  Clock, 
  DollarSign,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import MenuItemModal from './MenuItemModal';
import CreateRestaurantModal from './CreateRestaurantModal';
import { fetchMyRestaurant, createRestaurant } from './restaurantSlice';
import { fetchRestaurantOrders, updateOrderStatus } from './ownerOrdersSlice';
import { fetchMyMenu, createMenuItem, updateMenuItem, deleteMenuItem } from '../menu/menuSlice';

const OwnerDashboard = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('overview');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [createRestaurantModalOpen, setCreateRestaurantModalOpen] = useState(false);

  // Redux state
  const { data: restaurant, loading: restaurantLoading, updateLoading } = useSelector(state => state.ownerRestaurant);
  const { orders, loading: ordersLoading } = useSelector(state => state.ownerOrders);
  const { items: menuItems, loading: menuLoading, actionLoading } = useSelector(state => state.menu);

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchMyRestaurant());
    dispatch(fetchMyMenu());
  }, [dispatch]);

  // Fetch orders when restaurant is loaded
  useEffect(() => {
    if (restaurant?.id) {
      dispatch(fetchRestaurantOrders(restaurant.id));
    }
  }, [dispatch, restaurant?.id]);

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
    dispatch(updateOrderStatus({ orderId, status: newStatus }));
  };

  const handleAddMenuItem = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleEditMenuItem = (item) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleDeleteMenuItem = (itemId) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      dispatch(deleteMenuItem(itemId));
    }
  };

  const handleModalSubmit = (formData) => {
    if (editingItem) {
      dispatch(updateMenuItem({ id: editingItem.id, data: formData }))
        .unwrap()
        .then(() => {
          setModalOpen(false);
          setEditingItem(null);
        })
        .catch((error) => {
          console.error('Failed to update menu item:', error);
        });
    } else {
      dispatch(createMenuItem(formData))
        .unwrap()
        .then(() => {
          setModalOpen(false);
        })
        .catch((error) => {
          console.error('Failed to create menu item:', error);
        });
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingItem(null);
  };

  const handleCreateRestaurant = () => {
    setCreateRestaurantModalOpen(true);
  };

  const handleCreateRestaurantSubmit = (formData) => {
    dispatch(createRestaurant(formData))
      .unwrap()
      .then(() => {
        setCreateRestaurantModalOpen(false);
        // Refresh restaurant data
        dispatch(fetchMyRestaurant());
      })
      .catch((error) => {
        console.error('Failed to create restaurant:', error);
        alert(error?.message || 'Failed to create restaurant. Please try again.');
      });
  };

  const handleCreateRestaurantClose = () => {
    setCreateRestaurantModalOpen(false);
  };

  // Calculate today's stats
  const todayOrders = orders.filter(order => {
    const orderDate = new Date(order.created_at);
    const today = new Date();
    return orderDate.toDateString() === today.toDateString();
  });

  const todayRevenue = todayOrders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);
  const pendingCount = orders.filter(o => o.status === 'PENDING').length;

  const stats = [
    {
      label: 'Today\'s Orders',
      value: todayOrders.length,
      icon: Package,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50'
    },
    {
      label: 'Pending Orders',
      value: pendingCount,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      label: 'Today\'s Revenue',
      value: `$${todayRevenue.toFixed(2)}`,
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

  const loading = restaurantLoading || ordersLoading || menuLoading;

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
          Welcome back{restaurant?.name ? `, ${restaurant.name}` : ''}!
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
          {restaurant ? (
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
                <p><strong>Cuisine:</strong> {restaurant.cuisine_type || 'N/A'}</p>
                <p><strong>Delivery Time:</strong> {restaurant.delivery_time || 'N/A'}</p>
              </div>
              <div className="mt-4">
                <Button variant="secondary" size="sm">
                  <Edit2 className="w-4 h-4" />
                  Edit Restaurant Profile
                </Button>
              </div>
            </Card>
          ) : (
            <Card>
              <div className="text-center py-8">
                <Store className="w-12 h-12 text-dark-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-dark-900 mb-2">No Restaurant Found</h3>
                <p className="text-dark-600 mb-4">You need to create a restaurant first.</p>
                <Button variant="primary" size="sm" onClick={handleCreateRestaurant}>
                  <Plus className="w-4 h-4" />
                  Create Restaurant
                </Button>
              </div>
            </Card>
          )}

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
                      <p className="text-sm text-dark-600">{order.customer?.email || 'Customer'}</p>
                    </div>
                    <Badge variant={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-dark-700 mb-2">
                    {order.items?.length || 0} item(s)
                  </p>
                  <p className="font-bold text-primary-600">${order.total_amount}</p>
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
                      <p className="text-dark-600 mb-1">Customer: {order.customer?.email || 'Customer'}</p>
                      <p className="text-dark-700 mb-2">{order.items?.length || 0} item(s)</p>
                      <p className="text-sm text-dark-500">
                        {new Date(order.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <p className="text-2xl font-bold text-primary-600">${order.total_amount}</p>
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
            <Button onClick={handleAddMenuItem}>
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
                    <Button variant="ghost" size="sm" onClick={() => handleEditMenuItem(item)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteMenuItem(item.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Menu Item Modal */}
      <MenuItemModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        initialData={editingItem}
        loading={actionLoading}
      />

      {/* Create Restaurant Modal */}
      <CreateRestaurantModal
        isOpen={createRestaurantModalOpen}
        onClose={handleCreateRestaurantClose}
        onSubmit={handleCreateRestaurantSubmit}
        loading={updateLoading}
      />
    </div>
  );
};

export default OwnerDashboard;
