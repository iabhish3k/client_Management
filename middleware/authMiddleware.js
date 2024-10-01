const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.verifyToken = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token provided required'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      where: {
        email: decoded.email,
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token is no longer valid'
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};


exports.verifyAdmin = (req, res, next) => {
  if (req.user?.userRole !== 'admin') return res.status(403).json({ message: 'Access forbidden' });
  next();
};

exports.verifyAdminOrClient = (req, res, next) => {

  const userRole = req.user?.userRole;

  if (!userRole) {
    return res.status(401).json({ message: 'Unauthorized: No user role found' });
  }

  // Check if the user role is either 'admin' or 'client'
  if (userRole === 'admin' || userRole === 'client') {
    return next();
  } else {
    return res.status(403).json({ message: 'Forbidden: You do not have access to this resource' });
  }
};
