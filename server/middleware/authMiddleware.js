import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  console.log('--- ENTERING PROTECT MIDDLEWARE ---');
  console.log('Request Headers:', req.headers.authorization);

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (e.g., "Bearer eyJhbGciOi...")
      token = req.headers.authorization.split(' ')[1];
      console.log('Token Found:', token);

      // Verify token
      console.log('Verifying with secret:', process.env.JWT_SECRET);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token Decoded:', decoded);

      // Get user from the token's ID and attach it to the request object
      req.user = await User.findById(decoded.id).select('-password');
      console.log('User Found in DB:', req.user);

      next(); // Move to the next function
    } catch (error) {
      console.error('--- TOKEN VERIFICATION FAILED ---', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    console.log('No token found in headers.');
    res.status(401).json({ message: 'Not authorized, no token' });
    return;
  }
};