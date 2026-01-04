import api from './api';

/**
 * Review Service
 * Handles all API calls related to restaurant and menu item reviews
 */

// ========== Restaurant Reviews ==========

/**
 * Get all restaurant reviews with optional filters
 * @param {Object} params - Query parameters (restaurant_id, rating, etc.)
 * @returns {Promise} - Review list
 */
export const getRestaurantReviews = async (params = {}) => {
  const response = await api.get('/restaurant-reviews/', { params });
  return response.data;
};

/**
 * Get a specific restaurant review
 * @param {number} reviewId - Review ID
 * @returns {Promise} - Review details
 */
export const getRestaurantReview = async (reviewId) => {
  const response = await api.get(`/restaurant-reviews/${reviewId}/`);
  return response.data;
};

/**
 * Create a new restaurant review
 * @param {Object} reviewData - Review data (restaurant, rating, comment)
 * @returns {Promise} - Created review
 */
export const createRestaurantReview = async (reviewData) => {
  const response = await api.post('/restaurant-reviews/', reviewData);
  return response.data;
};

/**
 * Update an existing restaurant review
 * @param {number} reviewId - Review ID
 * @param {Object} reviewData - Updated review data
 * @returns {Promise} - Updated review
 */
export const updateRestaurantReview = async (reviewId, reviewData) => {
  const response = await api.put(`/restaurant-reviews/${reviewId}/`, reviewData);
  return response.data;
};

/**
 * Partially update a restaurant review
 * @param {number} reviewId - Review ID
 * @param {Object} reviewData - Partial review data
 * @returns {Promise} - Updated review
 */
export const patchRestaurantReview = async (reviewId, reviewData) => {
  const response = await api.patch(`/restaurant-reviews/${reviewId}/`, reviewData);
  return response.data;
};

/**
 * Delete a restaurant review
 * @param {number} reviewId - Review ID
 * @returns {Promise}
 */
export const deleteRestaurantReview = async (reviewId) => {
  const response = await api.delete(`/restaurant-reviews/${reviewId}/`);
  return response.data;
};

/**
 * Get current user's restaurant reviews
 * @returns {Promise} - User's reviews
 */
export const getMyRestaurantReviews = async () => {
  const response = await api.get('/restaurant-reviews/my_reviews/');
  return response.data;
};

/**
 * Check if user can review a restaurant
 * @param {number} restaurantId - Restaurant ID
 * @returns {Promise} - { can_review, already_reviewed, has_ordered }
 */
export const canReviewRestaurant = async (restaurantId) => {
  const response = await api.get(`/restaurant-reviews/can-review/${restaurantId}/`);
  return response.data;
};

// ========== Menu Item Reviews ==========

/**
 * Get all menu item reviews with optional filters
 * @param {Object} params - Query parameters (menu_item_id, rating, etc.)
 * @returns {Promise} - Review list
 */
export const getMenuItemReviews = async (params = {}) => {
  const response = await api.get('/menu-item-reviews/', { params });
  return response.data;
};

/**
 * Get a specific menu item review
 * @param {number} reviewId - Review ID
 * @returns {Promise} - Review details
 */
export const getMenuItemReview = async (reviewId) => {
  const response = await api.get(`/menu-item-reviews/${reviewId}/`);
  return response.data;
};

/**
 * Create a new menu item review
 * @param {Object} reviewData - Review data (menu_item, rating, comment)
 * @returns {Promise} - Created review
 */
export const createMenuItemReview = async (reviewData) => {
  const response = await api.post('/menu-item-reviews/', reviewData);
  return response.data;
};

/**
 * Update an existing menu item review
 * @param {number} reviewId - Review ID
 * @param {Object} reviewData - Updated review data
 * @returns {Promise} - Updated review
 */
export const updateMenuItemReview = async (reviewId, reviewData) => {
  const response = await api.put(`/menu-item-reviews/${reviewId}/`, reviewData);
  return response.data;
};

/**
 * Partially update a menu item review
 * @param {number} reviewId - Review ID
 * @param {Object} reviewData - Partial review data
 * @returns {Promise} - Updated review
 */
export const patchMenuItemReview = async (reviewId, reviewData) => {
  const response = await api.patch(`/menu-item-reviews/${reviewId}/`, reviewData);
  return response.data;
};

/**
 * Delete a menu item review
 * @param {number} reviewId - Review ID
 * @returns {Promise}
 */
export const deleteMenuItemReview = async (reviewId) => {
  const response = await api.delete(`/menu-item-reviews/${reviewId}/`);
  return response.data;
};

/**
 * Get current user's menu item reviews
 * @returns {Promise} - User's reviews
 */
export const getMyMenuItemReviews = async () => {
  const response = await api.get('/menu-item-reviews/my_reviews/');
  return response.data;
};

/**
 * Check if user can review a menu item
 * @param {number} menuItemId - Menu item ID
 * @returns {Promise} - { can_review, already_reviewed, has_ordered }
 */
export const canReviewMenuItem = async (menuItemId) => {
  const response = await api.get(`/menu-item-reviews/can-review/${menuItemId}/`);
  return response.data;
};

const reviewService = {
  // Restaurant reviews
  getRestaurantReviews,
  getRestaurantReview,
  createRestaurantReview,
  updateRestaurantReview,
  patchRestaurantReview,
  deleteRestaurantReview,
  getMyRestaurantReviews,
  canReviewRestaurant,
  
  // Menu item reviews
  getMenuItemReviews,
  getMenuItemReview,
  createMenuItemReview,
  updateMenuItemReview,
  patchMenuItemReview,
  deleteMenuItemReview,
  getMyMenuItemReviews,
  canReviewMenuItem,
};

export default reviewService;
