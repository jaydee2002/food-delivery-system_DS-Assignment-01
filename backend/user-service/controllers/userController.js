import User from '../models/userModel.js';

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
