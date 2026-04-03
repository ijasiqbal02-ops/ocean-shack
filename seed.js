const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/restaurant_app';

const seedItems = [
    {
        name: 'Classic Burger',
        description: 'Juicy beef patty with lettuce, tomato, and cheese.',
        price: 8.99,
        category: 'Burgers',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=500&fit=crop'
    },
    {
        name: 'Margherita Pizza',
        description: 'Fresh tomatoes, mozzarella, and basil.',
        price: 12.50,
        category: 'Pizza',
        image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a30536?w=500&h=500&fit=crop'
    },
    {
        name: 'French Fries',
        description: 'Crispy golden fries with a side of ketchup.',
        price: 4.50,
        category: 'Sides',
        image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=500&h=500&fit=crop'
    },
    {
        name: 'Fresh Orange Juice',
        description: 'Squeezed daily from fresh oranges.',
        price: 3.99,
        category: 'Beverages',
        image: 'https://images.unsplash.com/photo-1622597467836-f38240662c8c?w=500&h=500&fit=crop'
    }
];

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB. Seeding data...');
        await MenuItem.deleteMany({});
        await MenuItem.insertMany(seedItems);
        console.log('Data seeded successfully!');
        process.exit(0);
    })
    .catch(err => {
        console.error('Seeding error:', err);
        process.exit(1);
    });
