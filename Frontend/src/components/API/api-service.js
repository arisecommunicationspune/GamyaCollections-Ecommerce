import axios from "axios";
import API_CONFIG from "./api-config";

// Always send cookies for cross-site requests
axios.defaults.withCredentials = true;

const BASEURL = API_CONFIG.baseURL;

// Normalize list responses coming from different backends
function normalizeListResponse(resp) {
  const data = resp?.data ?? {};
  // Common shapes we support
  const rows =
    data?.rows ||
    data?.data?.rows ||
    data?.items ||
    data?.data?.items ||
    data?.list ||
    data?.data?.list ||
    Array.isArray(data)
      ? data
      : [];

  const pages =
    data?.pages_count ||
    data?.data?.pages_count ||
    data?.totalPages ||
    data?.data?.totalPages ||
    undefined;

  return { rows, pages_count: pages };
}

const ApiService = {
  // ==================== REVIEW APIs ====================
  async addReview(reviewData) {
    try {
      const response = await axios.post(
        `${BASEURL}/api/review/add`,
        reviewData,
        {
          headers: this.getHeaders(),
        }
      );
      return response;
    } catch (error) {
      console.error("Error adding review:", error);
      throw error;
    }
  },

  async getReviews() {
    try {
      const response = await axios.get(`${BASEURL}/api/review`, {
        headers: this.getHeaders(),
      });
      return response;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      throw error;
    }
  },
  // ==================== CATEGORY APIs ====================
  async getCategories(page = 1, limit = 10) {
    try {
      const response = await axios.get(
        `${BASEURL}/api/category?page=${page}&limit=${limit}`,
        {
          headers: this.getHeaders(),
        }
      );
      return response;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  // Fetch a single category by ID
  async getCategoryById(id) {
    try {
      const response = await axios.get(`${BASEURL}/api/category/${id}`, {
        headers: this.getHeaders(),
      });
      return response;
    } catch (error) {
      console.error("Error fetching category by id:", error);
      throw error;
    }
  },

  // Create a new category (multipart form-data for image upload)
  async createCategory(formData) {
    try {
      const response = await axios.post(`${BASEURL}/api/category`, formData, {
        headers: this.getMultipartHeaders(),
      });
      return response;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  },

  // Update an existing category by ID (multipart form-data for image upload)
  async updateCategory(id, formData) {
    try {
      const response = await axios.put(
        `${BASEURL}/api/category/${id}`,
        formData,
        {
          headers: this.getMultipartHeaders(),
        }
      );
      return response;
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  },


 getHeaders() {
    const token = localStorage.getItem('token');
    return {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    };
  },

  async deleteCategory(id) {
    try {
      const response = await axios.delete(`${BASEURL}/api/category/${id}`, {
        headers: this.getHeaders(),
      });
      return response;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },




  // ==================== SUBCATEGORY APIs ====================
  async getSubcategories(page = 1, limit = 10) {
    try {
      const response = await axios.get(
        `${BASEURL}/api/subcategory?page=${page}&limit=${limit}`,
        {
          headers: this.getHeaders(),
        }
      );
      return response;
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      throw error;
    }
  },

  async getSubcategoryById(id) {
    try {
      const response = await axios.get(`${BASEURL}/api/subcategory/${id}`, {
        headers: this.getHeaders(),
      });
      return response;
    } catch (error) {
      console.error("Error fetching subcategory by id:", error);
      throw error;
    }
  },

  async createSubcategory(formData) {
    try {
      const response = await axios.post(
        `${BASEURL}/api/subcategory`,
        formData,
        {
          headers: this.getMultipartHeaders(),
        }
      );
      return response;
    } catch (error) {
      console.error("Error creating subcategory:", error);
      throw error;
    }
  },

  async updateSubcategory(id, formData) {
    try {
      const response = await axios.put(
        `${BASEURL}/api/subcategory/${id}`,
        formData,
        {
          headers: this.getMultipartHeaders(),
        }
      );
      return response;
    } catch (error) {
      console.error("Error updating subcategory:", error);
      throw error;
    }
  },

  async deleteSubcategory(id) {
    try {
      const response = await axios.delete(`${BASEURL}/api/subcategory/${id}`, {
        headers: this.getHeaders(),
      });
      return response;
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      throw error;
    }
  },

  // ==================== PRODUCT APIs ====================
  async getProducts(page = 1, limit = 10, filters = {}) {
    try {
      const params = new URLSearchParams();
      params.set("page", page);
      params.set("limit", limit);
      if (filters.size) params.set("size", filters.size);
      if (filters.color) params.set("color", filters.color);
      if (filters.category) params.set("category", filters.category);
      if (filters.search) params.set("search", filters.search);
      // Added support for bestseller/featured flags
      if (filters.bestseller === true || filters.bestseller === "true") {
        params.set("bestseller", "true");
      }
      if (filters.featured === true || filters.featured === "true") {
        params.set("featured", "true");
      }
      const qs = params.toString();
      const response = await axios.get(`${BASEURL}/api/products?${qs}`, {
        headers: this.getHeaders(),
      });
      return response;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },
  // No auth headers needed when using HTTP-only cookies
  getHeaders() {
    return {};
  },

  // Get headers for multipart form data
  getMultipartHeaders() {
    return {
      "Content-Type": "multipart/form-data",
    };
  },

  // ==================== TESTIMONIAL APIs ====================
  async getTestimonials() {
    try {
      const response = await axios.get(`${BASEURL}/api/testimonials`, {
        headers: this.getHeaders(),
      });
      return response;
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      throw error;
    }
  },
  
  // ==================== VIDEO APIs (separate from testimonials) ====================
  async addVideo({ videoUrl, description }) {
    try {
      const response = await axios.post(
        `${BASEURL}/api/videos`,
        { videoUrl, description },
        { headers: this.getHeaders() }
      );
      return response;
    } catch (error) {
      console.error("Error adding video:", error);
      throw error;
    }
  },
  async getVideos() {
    try {
      const response = await axios.get(`${BASEURL}/api/videos`, {
        headers: this.getHeaders(),
      });
      return response;
    } catch (error) {
      console.error("Error fetching videos:", error);
      throw error;
    }
  },
  async deleteVideo(id) {
    try {
      const response = await axios.delete(`${BASEURL}/api/videos/${id}`, {
        headers: this.getHeaders(),
      });
      return response;
    } catch (error) {
      console.error("Error deleting video:", error);
      throw error;
    }
  },

  async getProductById(id) {
    try {
      const response = await axios.get(`${BASEURL}/api/products/${id}`, {
        headers: this.getHeaders(),
      });
      return response;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  },

  async createProduct(formData) {
    try {
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
      const response = await axios.post(`${BASEURL}/api/products`, formData, {
        headers: this.getMultipartHeaders(),
      });
      return response;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  async updateProduct(id, formData) {
    try {
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
      const response = await axios.put(
        `${BASEURL}/api/products/${id}`,
        formData,
        {
          headers: this.getMultipartHeaders(),
        }
      );
      return response;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  },

  async deleteProduct(id) {
    try {
      const response = await axios.delete(`${BASEURL}/api/products/${id}`, {
        headers: this.getHeaders(),
      });
      return response;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  },

  async getProductFilters() {
    try {
      const response = await axios.get(
        `${BASEURL}/api/products/filters/options`,
        {
          headers: this.getHeaders(),
        }
      );
      return response;
    } catch (error) {
      console.error("Error fetching product filters:", error);
      throw error;
    }
  },

  async getFeaturedProducts(page = 1, limit = 10) {
    try {
      const response = await axios.get(
        `${BASEURL}/api/products/featured?page=${page}&limit=${limit}`,
        {
          headers: this.getHeaders(),
        }
      );
      return response;
    } catch (error) {
      console.error("Error fetching featured products:", error);
      throw error;
    }
  },

  async getBestsellerProducts(page = 1, limit = 10) {
    try {
      const response = await axios.get(
        `${BASEURL}/api/products/bestseller?page=${page}&limit=${limit}`,
        {
          headers: this.getHeaders(),
        }
      );
      return response;
    } catch (error) {
      console.error("Error fetching bestseller products:", error);
      throw error;
    }
  },

  // ==================== USER APIs ====================
  async getUsers(page = 1, limit = 10) {
    try {
      const response = await axios.get(
        `${BASEURL}/api/users?page=${page}&limit=${limit}`,
        {
          headers: this.getHeaders(),
        }
      );
      return response;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  // ==================== ORDER APIs ====================
  async placeOrder(orderData) {
    try {
      const response = await axios.post(
        `${BASEURL}/api/orders/place`,
        orderData,
        {
          headers: this.getHeaders(),
        }
      );
      return response;
    } catch (error) {
      console.error("Error placing order:", error);
      throw error;
    }
  },

  async getUserOrders(page = 1, limit = 10) {
    try {
      console.log(`Fetching orders - page: ${page}, limit: ${limit}`);
      const response = await axios.get(
        `${BASEURL}/api/orders/myorders`,
        {
          params: { page, limit },
          headers: this.getHeaders(),
        }
      );
      console.log('Raw API response:', response);
      
      // Check if the response has the expected structure
      if (response.data && response.data.success) {
        console.log('Orders data:', response.data);
        return response.data; // Return the data directly
      } else {
        console.error('Unexpected response format:', response.data);
        throw new Error('Unexpected response format from server');
      }
    } catch (error) {
      console.error("Error in getUserOrders:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },

  async getOrderById(orderId) {
    try {
      const response = await axios.get(`${BASEURL}/api/orders/${orderId}`, {
        headers: this.getHeaders(),
      });
      return response;
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error;
    }
  },

  async getAllOrders() {
    try {
      const response = await axios.get(`${BASEURL}/api/orders`, {
        headers: this.getHeaders(),
      });
      return response;
    } catch (error) {
      console.error("Error fetching all orders:", error);
      throw error;
    }
  },

  async getOrdersByUser(userId) {
    try {
      const response = await axios.get(`${BASEURL}/api/orders/user/${userId}`, {
        headers: this.getHeaders(),
      });
      return response;
    } catch (error) {
      console.error("Error fetching orders by user:", error);
      throw error;
    }
  },

  async updateOrderStatus(orderId, statusData) {
    try {
      const response = await axios.put(
        `${BASEURL}/api/orders/${orderId}/status`,
        statusData,
        {
          headers: this.getHeaders(),
        }
      );
      return response;
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  },

  async markOrdersAsSeen(userId) {
    try {
      const response = await axios.put(
        `${BASEURL}/api/orders/user/${userId}/mark-seen`,
        {},
        {
          headers: this.getHeaders(),
        }
      );
      return response;
    } catch (error) {
      console.error("Error marking orders as seen:", error);
      throw error;
    }
  },

  async getUnseenOrdersCount() {
    try {
      const response = await axios.get(
        `${BASEURL}/api/orders/admin/unseen-count`,
        {
          headers: this.getHeaders(),
        }
      );
      return response;
    } catch (error) {
      console.error("Error fetching unseen orders count:", error);
      throw error;
    }
  },

  async downloadReceipt(orderId) {
    try {
      const response = await axios.get(
        `${BASEURL}/api/orders/receipt/${orderId}`,
        {
          headers: this.getHeaders(),
          responseType: "blob",
        }
      );
      return response;
    } catch (error) {
      console.error("Error downloading receipt:", error);
      throw error;
    }
  },

  // ==================== CART APIs ====================
  async getCart() {
    try {
      const response = await axios.get(`${BASEURL}/api/cart`, {
        headers: this.getHeaders(),
      });
      return response;
    } catch (error) {
      console.error("Error fetching cart:", error);
      throw error;
    }
  },

  async addToCart(productOrId, quantity = 1, size = "M", color = "Default") {
    try {
      // Support both call styles:
      // 1) addToCart({ productId, quantity, size, color })
      // 2) addToCart(productId, quantity, size, color)
      let payload = {};

      if (
        productOrId &&
        typeof productOrId === "object" &&
        (productOrId.productId || productOrId._id || productOrId.id)
      ) {
        // If full object provided, normalize to expected shape
        payload = {
          productId: productOrId.productId || productOrId._id || productOrId.id,
          quantity: Number.parseInt(productOrId.quantity ?? quantity) || 1,
          size: productOrId.size || size || "M",
          color: productOrId.color || color || "Default",
        };
      } else {
        // Positional args
        payload = {
          productId: productOrId,
          quantity: Number.parseInt(quantity) || 1,
          size: size || "M",
          color: color || "Default",
        };
      }

      const response = await axios.post(`${BASEURL}/api/cart/add`, payload, {
        headers: this.getHeaders(),
      });
      return response;
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  },

  async updateCartItem(itemId, quantity) {
    try {
      const response = await axios.put(
        `${BASEURL}/api/cart/update/${itemId}`,
        { quantity },
        {
          headers: this.getHeaders(),
        }
      );
      return response;
    } catch (error) {
      console.error("Error updating cart item:", error);
      throw error;
    }
  },

  async removeFromCart(itemId) {
    try {
      const response = await axios.delete(
        `${BASEURL}/api/cart/remove/${itemId}`,
        {
          headers: this.getHeaders(),
        }
      );
      return response;
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    }
  },

  async clearCart() {
    try {
      const response = await axios.delete(`${BASEURL}/api/cart/clear`, {
        headers: this.getHeaders(),
      });
      return response;
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  },

  // ==================== CONTACT APIs ====================
  async createContact(contactData) {
    try {
      const response = await axios.post(`${BASEURL}/api/contact`, contactData, {
        headers: this.getHeaders(),
      });
      return response;
    } catch (error) {
      console.error("Error creating contact:", error);
      throw error;
    }
  },

  async getContacts() {
    try {
      const response = await axios.get(`${BASEURL}/api/contact`, {
        headers: this.getHeaders(),
      });
      return response;
    } catch (error) {
      console.error("Error fetching contacts:", error);
      throw error;
    }
  },

  async getContactsByEmail(email) {
    try {
      const response = await axios.get(`${BASEURL}/api/contact/user/${email}`, {
        headers: this.getHeaders(),
      });
      return response;
    } catch (error) {
      console.error("Error fetching contacts by email:", error);
      throw error;
    }
  },

  async markContactsAsRead(email) {
    try {
      const response = await axios.put(
        `${BASEURL}/api/contact/user/${email}/read`,
        {},
        {
          headers: this.getHeaders(),
        }
      );
      return response;
    } catch (error) {
      console.error("Error marking contacts as read:", error);
      throw error;
    }
  },

  // ==================== RAZORPAY APIs ====================
  async createRazorpayOrder(orderData) {
    try {
      const response = await axios.post(
        `${BASEURL}/api/razorpay/create-order`,
        orderData,
        {
          headers: this.getHeaders(),
        }
      );
      return response;
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      throw error;
    }
  },

  async verifyRazorpayPayment(paymentData) {
    try {
      const response = await axios.post(
        `${BASEURL}/api/razorpay/verify-payment`,
        paymentData,
        {
          headers: this.getHeaders(),
        }
      );
      return response;
    } catch (error) {
      console.error("Error verifying Razorpay payment:", error);
      throw error;
    }
  },

  async handlePaymentFailure(errorData) {
    try {
      const response = await axios.post(
        `${BASEURL}/api/razorpay/payment-failed`,
        errorData,
        {
          headers: this.getHeaders(),
        }
      );
      return response;
    } catch (error) {
      console.error("Error handling payment failure:", error);
      throw error;
    }
  },

  async getPaymentDetails(paymentId) {
    try {
      const response = await axios.get(
        `${BASEURL}/api/razorpay/payment/${paymentId}`,
        {
          headers: this.getHeaders(),
        }
      );
      return response;
    } catch (error) {
      console.error("Error fetching payment details:", error);
      throw error;
    }
  },

  async testRazorpay() {
    try {
      const response = await axios.get(`${BASEURL}/api/razorpay/test`, {
        headers: this.getHeaders(),
      });
      return response;
    } catch (error) {
      console.error("Error testing Razorpay:", error);
      throw error;
    }
  },

  // ==================== SHIPROCKET APIs ====================
  async createShiprocketOrder(orderData) {
    try {
      const response = await axios.post(
        `${BASEURL}/api/orders/shiprocket-order`,
        orderData,
        {
          headers: this.getHeaders(),
        }
      );
      return response;
    } catch (error) {
      console.error("Error creating Shiprocket order:", error);
      throw error;
    }
  },

  // ==================== AUTH APIs ====================
  async login(credentials) {
    try {
      const response = await axios.post(
        `${BASEURL}/api/auth/login`,
        credentials
      );
      return response;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  },

  async register(userData) {
    try {
      const response = await axios.post(
        `${BASEURL}/api/auth/register`,
        userData,
        { withCredentials: true } // only if you’re setting cookies in backend
      );
      return response;
    } catch (error) {
      console.error("Error registering:", error);
      throw error;
    }
  },

  // Forgot password - send email
  async forgotPassword(email) {
    try {
      return await axios.post(`${BASEURL}/api/auth/forgot-password`, { email });
    } catch (error) {
      throw error;
    }
  },

  // Verify OTP
  async verifyOtp(data) {
    try {
      return await axios.post(`${BASEURL}/api/auth/verify-otp`, data);
    } catch (error) {
      throw error;
    }
  },

  // Reset password
  async resetPassword(data) {
    try {
      return await axios.post(`${BASEURL}/api/auth/reset-password`, data);
    } catch (error) {
      throw error;
    }
  },

  async getProfile() {
    try {
      const response = await axios.get(`${BASEURL}/api/auth/profile`, {
        headers: this.getHeaders(),
      });
      return response;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  },

  async updateProfile(profileData) {
    try {
      const response = await axios.put(
        `${BASEURL}/api/auth/profile`,
        profileData,
        {
          headers: this.getHeaders(),
        }
      );
      return response;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },

  // ==================== UPLOAD APIs ====================

  async uploadTestimonialVideo(formData) {
    try {
      const response = await axios.post(
        `${BASEURL}/api/upload/testimonial-video`,
        formData,
        {
          headers: this.getMultipartHeaders(),
        }
      );
      return response;
    } catch (error) {
      console.error("Error uploading testimonial video:", error);
      throw error;
    }
  },

  async uploadMultipleImages(formData) {
    try {
      const response = await axios.post(
        `${BASEURL}/api/upload/multiple`,
        formData,
        {
          headers: this.getMultipartHeaders(),
        }
      );
      return response;
    } catch (error) {
      console.error("Error uploading multiple images:", error);
      throw error;
    }
  },

  // ==================== TESTIMONIAL APIs ====================
  async addTestimonial({ videoUrl, description }) {
    try {
      const response = await axios.post(
        `${BASEURL}/api/testimonials`,
        { videoUrl, description },
        { headers: this.getHeaders() }
      );
      return response;
    } catch (error) {
      console.error("Error adding testimonial:", error);
      throw error;
    }
  },
  async deleteTestimonial(id) {
    try {
      const response = await axios.delete(
        `${BASEURL}/api/testimonials/${id}`,
        { headers: this.getHeaders() }
      );
      return response;
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      throw error;
    }
  },
  async getTestimonials() {
    try {
      const response = await axios.get(`${BASEURL}/api/testimonials`, {
        headers: this.getHeaders(),
      });
      return response;
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      throw error;
    }
  },

  // ==================== TESTIMONIAL APIs ====================
  async addTestimonial({ videoUrl, description }) {
    try {
      const response = await axios.post(
        `${BASEURL}/api/testimonials`,
        { videoUrl, description },
        { headers: this.getHeaders() }
      );
      return response;
    } catch (error) {
      console.error("Error adding testimonial:", error);
      throw error;
    }
  },
};

export default ApiService;
