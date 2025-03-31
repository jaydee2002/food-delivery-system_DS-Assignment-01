import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (
      decoded.role !== 'customer' &&
      decoded.role !== 'system_admin' &&
      decoded.role !== 'restaurant_admin' &&
      decoded.role !== 'delivery_personnel'
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }
    req.user = decoded;
    console.log('Decoded User:', req.user);
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    // Ensure user is attached (in case middleware is used incorrectly)
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    console.log('User Role:', req.user.role);
    console.log('Allowed Roles:', allowedRoles);
    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: 'Access denied: Insufficient permissions' });
    }

    next();
  };
};
