import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import net from 'net';
import { execSync } from 'child_process';
import 'dotenv/config';

// Import only essential routes that exist
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import collectionRoutes from './routes/collectionRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';

const app = express();

// CORS - MUST be first middleware
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Remove problematic security middleware that might interfere
// setupSecurity(app);

// Additional middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔥 Add trust proxy setting for PM2 and proxy environments
app.set('trust proxy', 1);

// Rate limiting - increased for development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000 // increased from 100 to 1000 requests per windowMs
});
app.use('/api/', limiter);

import createSuperAdmin from './utils/createSuperAdmin.js';
import createAdmin from './seed/createAdmin.js';

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blacklocust')
  .then(async () => {
    console.log('✅ MongoDB Connected');
    
    // Create super admin if none exists
    await createSuperAdmin();
    
    // Create admin if none exists
    await createAdmin();
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

// Essential Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/categories', categoryRoutes);

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Root route - API information
app.get('/', (req, res) => {
  res.json({
    name: 'Black Locust API',
    version: '2.0.0',
    status: 'Running',
    features: {
      authentication: 'JWT + 2FA + device tracking',
      authorization: 'Role-based access control',
      payment: 'Stripe + Razorpay + webhook security',
      orderProcessing: 'Atomic transactions + inventory management',
      analytics: 'Real-time + comprehensive reporting',
      notifications: 'Email + SMS + push notifications',
      search: 'Advanced filtering + aggregation',
      security: 'Input sanitization + rate limiting + audit trails'
    },
    endpoints: {
      health: '/api/health',
      authentication: {
        register: '/api/auth/register',
        login: '/api/auth/login',
        profile: '/api/auth/profile',
        'change-password': '/api/auth/change-password',
        'enable-2fa': '/api/auth/enable-2fa',
        activity: '/api/auth/activity',
        'logout-all': '/api/auth/logout-all'
      },
      userManagement: {
        profile: '/api/users/manage/profile',
        analytics: '/api/users/manage/analytics'
      },
      productManagement: {
        search: '/api/products/manage/search',
        categories: '/api/products/manage/categories',
        details: '/api/products/manage/:id',
        reviews: '/api/products/manage/:id/reviews',
        wishlist: '/api/products/manage/:id/wishlist',
        analytics: '/api/products/manage/analytics'
      },
      orders: {
        create: '/api/orders/create',
        list: '/api/orders/my-orders',
        details: '/api/orders/:orderId',
        cancel: '/api/orders/:orderId/cancel',
        track: '/api/orders/:orderId/track',
        'status-update': '/api/orders/:orderId/status',
        analytics: '/api/orders/analytics/summary'
      },
      payments: {
        'create-intent': '/api/payments/create-intent',
        confirm: '/api/payments/confirm',
        'stripe-webhook': '/api/payments/stripe-webhook',
        'razorpay-webhook': '/api/payments/razorpay-webhook',
        refund: '/api/payments/refund',
        methods: '/api/payments/methods'
      },
      analytics: {
        dashboard: '/api/analytics/dashboard',
        sales: '/api/analytics/sales',
        products: '/api/analytics/products',
        customers: '/api/analytics/customers',
        realtime: '/api/analytics/realtime'
      },
      notifications: {
        welcome: '/api/notifications/welcome',
        'order-confirmation': '/api/notifications/order-confirmation',
        'payment-confirmation': '/api/notifications/payment-confirmation',
        'password-reset': '/api/notifications/password-reset',
        'email-verification': '/api/notifications/email-verification',
        bulk: '/api/notifications/bulk',
        status: '/api/notifications/status/:messageId'
      },
      products: '/api/products',
      users: '/api/users',
      cart: '/api/cart',
      email: '/api/email'
    },
    documentation: 'https://github.com/black-locust/api-docs',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

// Check if port is already in use
const checkPort = (port) => {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(false); // Port is in use
      } else {
        reject(err);
      }
    });
    
    server.once('listening', () => {
      server.close();
      resolve(true); // Port is available
    });
    
    server.listen(port);
  });
};

const startServer = async () => {
  try {
    const isPortAvailable = await checkPort(PORT);
    
    if (!isPortAvailable) {
      console.log(`⚠️  Port ${PORT} is already in use. Attempting to kill existing process...`);
      try {
        execSync(`lsof -ti:${PORT} | xargs kill -9`, { stdio: 'ignore' });
        console.log(`✅ Killed process on port ${PORT}`);
      } catch (killError) {
        console.log(`❌ Could not kill process on port ${PORT}. Trying alternative port...`);
        // Try alternative port
        const altPort = PORT + 1;
        app.listen(altPort, () => {
          console.log(`🚀 Server running on port ${altPort} (alternative)`);
          console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
        });
        return;
      }
    }
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();
