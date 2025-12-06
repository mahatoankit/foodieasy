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
import EditRestaurantModal from './EditRestaurantModal';
import { fetchMyRestaurant, createRestaurant, updateRestaurant } from './restaurantSlice';
import { fetchRestaurantOrders, updateOrderStatus } from './ownerOrdersSlice';
import { fetchMyMenu, createMenuItem, updateMenuItem, deleteMenuItem } from '../menu/menuSlice';

const OwnerDashboard = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('overview');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [createRestaurantModalOpen, setCreateRestaurantModalOpen] = useState(false);
  const [editRestaurantModalOpen, setEditRestaurantModalOpen] = useState(false);

  // Redux state
  const { data: restaurant, loading: restaurantLoading } = useSelector(state => state.ownerRestaurant);
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
      READY_FOR_PICKUP: 'success',
      OUT_FOR_DELIVERY: 'info',
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

  const handleEditRestaurant = () => {
    setEditRestaurantModalOpen(true);
  };

  const handleEditRestaurantSubmit = (formData) => {
    dispatch(updateRestaurant({ id: restaurant.id, data: formData }))
      .unwrap()
      .then(() => {
        setEditRestaurantModalOpen(false);
        // Refresh restaurant data
        dispatch(fetchMyRestaurant());
      })
      .catch((error) => {
        console.error('Failed to update restaurant:', error);
        alert(error?.message || 'Failed to update restaurant. Please try again.');
      });
  };

  const handleEditRestaurantClose = () => {
    setEditRestaurantModalOpen(false);
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
      value: `NPR ${Math.round(todayRevenue)}`,
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
    <div className="min-h-screen bg-light-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-12 px-4 mb-8 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Store className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-1 drop-shadow-md">
                Restaurant Dashboard
              </h1>
              <p className="text-primary-50 text-lg">
                Welcome back{restaurant?.name ? `, ${restaurant.name}` : ''}!
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
          {['overview', 'orders', 'menu'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-6 font-semibold capitalize rounded-lg transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'text-dark-600 hover:bg-light-100'
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
            <Card className="shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary-50 rounded-xl">
                    <Store className="w-6 h-6 text-primary-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-dark-900">Restaurant Status</h2>
                </div>
                <Badge variant={restaurant.is_open ? 'success' : 'error'} className="text-sm px-4 py-2">
                  {restaurant.is_open ? 'Open' : 'Closed'}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-light-50 p-4 rounded-lg">
                  <p className="text-dark-500 text-sm mb-1">Restaurant Name</p>
                  <p className="text-dark-900 font-semibold text-lg">{restaurant.name}</p>
                </div>
                <div className="bg-light-50 p-4 rounded-lg">
                  <p className="text-dark-500 text-sm mb-1">Cuisine Type</p>
                  <p className="text-dark-900 font-semibold text-lg">{restaurant.cuisine_type || 'N/A'}</p>
                </div>
                <div className="bg-light-50 p-4 rounded-lg">
                  <p className="text-dark-500 text-sm mb-1">Address</p>
                  <p className="text-dark-900 font-semibold">{restaurant.address}</p>
                </div>
                <div className="bg-light-50 p-4 rounded-lg">
                  <p className="text-dark-500 text-sm mb-1">Delivery Time</p>
                  <p className="text-dark-900 font-semibold">{restaurant.delivery_time || 'N/A'}</p>
                </div>
              </div>
              <Button variant="secondary" onClick={handleEditRestaurant} className="w-full md:w-auto">
                <Edit2 className="w-4 h-4" />
                Edit Restaurant Profile
              </Button>
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
          <Card className="shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary-50 rounded-xl">
                  <Package className="w-6 h-6 text-primary-600" />
                </div>
                <h2 className="text-2xl font-bold text-dark-900">Recent Orders</h2>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setActiveTab('orders')} className="text-primary-600 hover:text-primary-700">
                View All →
              </Button>
            </div>
            <div className="space-y-3">
              {orders.slice(0, 3).map((order) => (
                <div key={order.id} className="p-5 bg-light-50 rounded-xl border border-light-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold text-lg text-dark-900">Order #{order.id}</p>
                      <p className="text-sm text-dark-600 mt-1">{order.customer?.email || 'Customer'}</p>
                    </div>
                    <Badge variant={getStatusColor(order.status)} className="text-xs px-3 py-1">
                      {order.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-dark-700">
                      {order.items?.length || 0} item(s)
                    </p>
                    <p className="text-xl font-bold text-primary-600">NPR {Math.round(order.total_amount)}</p>
                  </div>
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
                <Card key={order.id} className="hover:shadow-xl transition-all duration-300">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold text-dark-900">Order #{order.id}</h3>
                        <Badge variant={getStatusColor(order.status)} className="text-sm px-3 py-1">
                          {order.status}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <p className="text-dark-600"><span className="font-medium">Customer:</span> {order.customer?.email || 'Customer'}</p>
                        <p className="text-dark-700"><span className="font-medium">Items:</span> {order.items?.length || 0} item(s)</p>
                        <p className="text-sm text-dark-500">
                          <span className="font-medium">Time:</span> {new Date(order.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-4">
                      <p className="text-3xl font-bold text-primary-600">NPR {Math.round(order.total_amount)}</p>
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
                          onClick={() => handleStatusUpdate(order.id, 'READY_FOR_PICKUP')}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="h-40 bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 rounded-t-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                  <div className="absolute bottom-3 left-3">
                    <Badge variant={item.is_available ? 'success' : 'error'} className="backdrop-blur-sm">
                      {item.is_available ? '✓ Available' : '✗ Out of Stock'}
                    </Badge>
                  </div>
                </div>
                <div className="p-5">
                  <div className="mb-3">
                    <h3 className="font-bold text-lg text-dark-900 mb-1">{item.name}</h3>
                    <p className="text-xs text-primary-600 font-medium">{item.category?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                  </div>
                  <p className="text-sm text-dark-600 mb-4 line-clamp-2 min-h-[40px]">{item.description}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-light-200">
                    <p className="text-2xl font-bold text-primary-600">NPR {Math.round(item.price)}</p>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditMenuItem(item)} className="hover:bg-primary-50 hover:text-primary-600">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteMenuItem(item.id)} className="hover:bg-red-50 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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
        loading={restaurantLoading}
      />

      {/* Edit Restaurant Modal */}
      <EditRestaurantModal
        isOpen={editRestaurantModalOpen}
        onClose={handleEditRestaurantClose}
        onSubmit={handleEditRestaurantSubmit}
        initialData={restaurant}
        loading={restaurantLoading}
      />
      </div>
    </div>
  );
};

export default OwnerDashboard;
