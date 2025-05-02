import User from '../models/User.js';
import axios from 'axios';

export const userProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: 'User not found',
        code: 'USER_NOT_FOUND',
      });
    }
    res.json(user);
  } catch (err) {
    console.error(`[SERVER_ERROR] ${err.message}`);
    res.status(500).json({
      status: 500,
      message: 'Failed to fetch user profile',
      code: 'SERVER_ERROR',
    });
  }
};

//Added by Bavi for need in the Order Service
export const getUserByparam = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: 'User not found',
        code: 'USER_NOT_FOUND',
      });
    }
    res.json(user);
  } catch (err) {
    console.error(`[SERVER_ERROR] ${err.message}`);
    res.status(500).json({
      status: 500,
      message: 'Failed to fetch user profile',
      code: 'SERVER_ERROR',
    });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (
      ![
        'customer',
        'restaurant_admin',
        'delivery_personnel',
        'system_admin',
      ].includes(role)
    ) {
      return res.status(400).json({ message: 'Invalid role provided' });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User role updated successfully', user });
  } catch (err) {
    console.error(`[SERVER_ERROR] ${err.message}`);
    res.status(500).json({ message: 'Failed to update user role' });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { menuItem, quantity, price, restaurant } = req.body;
    const userId = req.user._id; // From auth middleware

    if (!menuItem || !quantity || !price || !restaurant) {
      return res.status(400).json({
        success: false,
        error: 'Menu item, quantity, price, and restaurant are required',
      });
    }

    // Fetch user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Ensure cart items are from the same restaurant
    if (
      user.cart.length > 0 &&
      user.cart[0].restaurant.toString() !== restaurant
    ) {
      return res.status(400).json({
        success: false,
        error: 'Cart can only contain items from one restaurant',
      });
    }

    // Check if item already exists in cart
    const existingItemIndex = user.cart.findIndex(
      (item) => item.menuItem.toString() === menuItem
    );

    if (existingItemIndex >= 0) {
      user.cart[existingItemIndex].quantity += quantity;
    } else {
      user.cart.push({
        menuItem,
        quantity,
        price,
        restaurant,
      });
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: {
        cart: user.cart,
      },
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add item to cart',
    });
  }
};
export const getCart = async (req, res) => {
  try {
    const userId = req.user._id; // From auth middleware

    // Fetch user
    const user = await User.findById(userId).select('cart');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Enrich cart items with name and image
    const enrichedCart = await Promise.all(
      user.cart.map(async (item) => {
        try {
          const menuItemResponse = await axios.get(
            `${process.env.RESTAURANT_SERVICE_URL}/menu/${item.menuItem}`,
            {
              headers: { Authorization: req.headers.authorization },
            }
          );
          console.log('Menu item response:', menuItemResponse.data);

          // Access the menu item object directly (not as an array)
          const menuItemDoc = menuItemResponse.data.data;

          if (!menuItemDoc) {
            throw new Error('Menu item not found in response');
          }

          return {
            menuItem: item.menuItem,
            quantity: item.quantity,
            price: item.price,
            restaurant: item.restaurant,
            name: menuItemDoc.name || 'Unknown Item',
            image: menuItemDoc.image || '',
          };
        } catch (error) {
          console.error(
            `Error fetching menu item ${item.menuItem}:`,
            error.message
          );
          return {
            ...item.toObject(),
            name: 'Unknown Item',
            image: '',
          };
        }
      })
    );

    res.status(200).json({
      success: true,
      data: enrichedCart,
    });
  } catch (error) {
    console.error('Error fetching cart:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cart',
    });
  }
};
