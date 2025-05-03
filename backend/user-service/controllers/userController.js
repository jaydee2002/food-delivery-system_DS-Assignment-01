import User from '../models/User.js';

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
