require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const customerRoutes = require('./routes/customerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const menuRoutes = require('./routes/menuRoutes');
const adminRoutes = require('./routes/adminRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const ownerRoutes = require('./routes/ownerRoutes');

app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/owner', ownerRoutes);

// Shared IO instance
app.set('io', io);

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;

async function seedDatabase() {
    const MenuItem = require('./models/MenuItem');
    const count = await MenuItem.countDocuments();
    if (count > 0) return; // Already seeded

    const seedItems = [
        {
            name: 'Classic Burger',
            description: 'Juicy beef patty with fresh lettuce, ripe tomato, melted cheddar cheese, and our signature sauce on a toasted brioche bun.',
            price: 199,
            category: 'Burgers',
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=500&fit=crop'
        },
        {
            name: 'Margherita Pizza',
            description: 'Classic Italian pizza with San Marzano tomatoes, fresh buffalo mozzarella, fragrant basil, and extra virgin olive oil on a thin, crispy crust.',
            price: 299,
            category: 'Pizza',
            image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a30536?w=500&h=500&fit=crop'
        },
        {
            name: 'French Fries',
            description: 'Hand-cut golden crispy fries seasoned with sea salt, served with house-made ketchup and garlic aioli.',
            price: 129,
            category: 'Sides',
            image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=500&h=500&fit=crop'
        },
        {
            name: 'Fresh Orange Juice',
            description: 'Cold-pressed daily from premium Valencia oranges. 100% natural with no added sugar.',
            price: 99,
            category: 'Beverages',
            image: 'https://images.unsplash.com/photo-1622597467836-f38240662c8c?w=500&h=500&fit=crop'
        },
        {
            name: 'Caesar Salad',
            description: 'Crisp romaine lettuce, shaved parmesan, crunchy croutons, and creamy Caesar dressing. Add grilled chicken for extra protein.',
            price: 179,
            category: 'Salads',
            image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500&h=500&fit=crop'
        },
        {
            name: 'Chocolate Brownie',
            description: 'Rich, fudgy dark chocolate brownie topped with vanilla ice cream and drizzled with warm chocolate sauce.',
            price: 149,
            category: 'Desserts',
            image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=500&h=500&fit=crop'
        },
        {
            name: 'Chicken Wings',
            description: 'Crispy fried chicken wings tossed in your choice of buffalo, BBQ, or honey garlic sauce. Served with ranch dip and celery sticks.',
            price: 249,
            category: 'Starters',
            image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=500&h=500&fit=crop'
        },
        {
            name: 'Iced Coffee',
            description: 'Smooth cold brew coffee served over ice with your choice of whole milk, oat milk, or black. Lightly sweetened.',
            price: 119,
            category: 'Beverages',
            image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=500&h=500&fit=crop'
        }
    ];

    await MenuItem.insertMany(seedItems);
    console.log('Database seeded with menu items!');
}

async function start() {
    // Start in-memory MongoDB
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    console.log('In-memory MongoDB started at:', uri);

    await mongoose.connect(uri);
    console.log('Connected to in-memory MongoDB');

    // Seed data
    await seedDatabase();

    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

start().catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
