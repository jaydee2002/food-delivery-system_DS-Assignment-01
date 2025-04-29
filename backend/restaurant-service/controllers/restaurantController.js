import mongoose from 'mongoose';
import Restaurant from '../models/Restaurant.js';
import sanitizeHtml from 'sanitize-html';
import validator from 'validator';
// Create new restaurant
export async function createRestaurant(req, res) {
  try {
    const restaurantData = {
      ...req.body,
      owner: req.user._id,
    };

    const restaurant = await Restaurant.create(restaurantData);

    res.status(201).json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create restaurant',
    });
  }
}

// Get all restaurants
export async function getAllRestaurants(req, res) {
  try {
    const restaurants = await Restaurant.find().populate('owner', 'name email');

    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'An unexpected error occurred',
    });
  }
}

// Get single restaurant by ID
export async function getRestaurantById(req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid restaurant ID',
      });
    }

    const restaurant = await Restaurant.findById(req.params.id).populate(
      'owner',
      'name email'
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        error: 'Restaurant not found',
      });
    }

    res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'An unexpected error occurred',
    });
  }
}

// Update restaurant
export async function updateRestaurant(req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid restaurant ID',
      });
    }

    // Validate and format phone number
    let updateData = { ...req.body };
    if (req.body.phoneNumber) {
      if (!req.body.countryCode) {
        return res.status(400).json({
          success: false,
          error: 'Country code is required when providing a phone number',
        });
      }
      if (!req.body.phoneNumber.startsWith('+')) {
        updateData.phoneNumber =
          `${req.body.countryCode}${req.body.phoneNumber}`.replace(/\s/g, '');
      }
    }

    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        error: 'Restaurant not found',
      });
    }

    res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: Object.values(error.errors)
          .map((err) => err.message)
          .join(', '),
      });
    }
    res.status(500).json({
      success: false,
      error: 'An unexpected error occurred',
    });
  }
}

// Delete restaurant
export async function deleteRestaurant(req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid restaurant ID',
      });
    }

    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        error: 'Restaurant not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { id: req.params.id },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'An unexpected error occurred',
    });
  }
}
