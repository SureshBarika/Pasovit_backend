// backend/seedProducts.js
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Product = require('./models/Product');

const products = [
  {
    name: 'Classic White T-Shirt',
    description: 'Comfortable cotton tee, perfect for everyday wear.',
    price: 399,
    image: 'https://picsum.photos/seed/t1/600/600',
    category: 'Men',
    sizes: ['S','M','L','XL'],
    stock: 50
  },
  {
    name: 'Black Slim Fit Jeans',
    description: 'Stretchable and durable slim fit jeans.',
    price: 1499,
    image: 'https://picsum.photos/seed/t2/600/600',
    category: 'Men',
    sizes: ['30','32','34','36'],
    stock: 30
  },
  {
    name: 'Blue Denim Jacket',
    description: 'Classic denim jacket with soft lining.',
    price: 2499,
    image: 'https://picsum.photos/seed/t3/600/600',
    category: 'Men',
    sizes: ['M','L','XL'],
    stock: 20
  },
  {
    name: 'Floral Summer Dress',
    description: 'Light and breezy floral dress for warm days.',
    price: 1299,
    image: 'https://picsum.photos/seed/t4/600/600',
    category: 'Women',
    sizes: ['S','M','L'],
    stock: 25
  },
  {
    name: 'Women Casual Tee',
    description: 'Soft fabric with modern fit.',
    price: 499,
    image: 'https://picsum.photos/seed/t5/600/600',
    category: 'Women',
    sizes: ['S','M','L'],
    stock: 40
  },
  {
    name: 'Running Shorts',
    description: 'Lightweight shorts for running and workouts.',
    price: 599,
    image: 'https://picsum.photos/seed/t6/600/600',
    category: 'Sports',
    sizes: ['S','M','L'],
    stock: 60
  },
  {
    name: 'Hooded Sweatshirt',
    description: 'Warm hoodie with front pocket.',
    price: 1799,
    image: 'https://picsum.photos/seed/t7/600/600',
    category: 'Men',
    sizes: ['M','L','XL'],
    stock: 35
  },
  {
    name: 'Formal Shirt',
    description: 'Cotton formal shirt, slim fit.',
    price: 1199,
    image: 'https://picsum.photos/seed/t8/600/600',
    category: 'Men',
    sizes: ['M','L','XL'],
    stock: 45
  },
  {
    name: 'Elegant Blazer',
    description: 'Perfect for parties and office looks.',
    price: 3499,
    image: 'https://picsum.photos/seed/t9/600/600',
    category: 'Women',
    sizes: ['S','M','L'],
    stock: 12
  },
  {
    name: 'Cargo Pants',
    description: 'Multi-pocket durable cargo pants.',
    price: 1599,
    image: 'https://picsum.photos/seed/t10/600/600',
    category: 'Men',
    sizes: ['30','32','34','36'],
    stock: 28
  },
  {
    name: 'Pleated Skirt',
    description: 'Stylish pleated skirt.',
    price: 899,
    image: 'https://picsum.photos/seed/t11/600/600',
    category: 'Women',
    sizes: ['S','M','L'],
    stock: 22
  },
  {
    name: 'Leather Belt',
    description: 'Genuine leather belt for men.',
    price: 499,
    image: 'https://picsum.photos/seed/t12/600/600',
    category: 'Accessories',
    sizes: ['M','L'],
    stock: 80
  },
  {
    name: 'Ankle Socks (Pack of 3)',
    description: 'Comfortable cotton socks.',
    price: 199,
    image: 'https://picsum.photos/seed/t13/600/600',
    category: 'Accessories',
    sizes: ['Free'],
    stock: 120
  },
  {
    name: 'Casual Loafers',
    description: 'Comfortable casual loafers.',
    price: 2199,
    image: 'https://picsum.photos/seed/t14/600/600',
    category: 'Men',
    sizes: ['8','9','10','11'],
    stock: 15
  },
  {
    name: 'Summer Sandals',
    description: 'Breathable sandals for warm weather.',
    price: 799,
    image: 'https://picsum.photos/seed/t15/600/600',
    category: 'Women',
    sizes: ['6','7','8','9'],
    stock: 30
  },
  {
    name: 'Yoga Pants',
    description: 'Stretchable yoga pants.',
    price: 699,
    image: 'https://picsum.photos/seed/t16/600/600',
    category: 'Sports',
    sizes: ['S','M','L'],
    stock: 50
  },
  {
    name: 'Winter Coat',
    description: 'Heavy coat for cold winters.',
    price: 4499,
    image: 'https://picsum.photos/seed/t17/600/600',
    category: 'Men',
    sizes: ['M','L','XL'],
    stock: 8
  },
  {
    name: 'Denim Skirt',
    description: 'Trendy denim skirt.',
    price: 999,
    image: 'https://picsum.photos/seed/t18/600/600',
    category: 'Women',
    sizes: ['S','M','L'],
    stock: 18
  },
  {
    name: 'Printed Hoodie',
    description: 'Stylish printed hoodie.',
    price: 1699,
    image: 'https://picsum.photos/seed/t19/600/600',
    category: 'Men',
    sizes: ['M','L','XL'],
    stock: 27
  },
  {
    name: 'Casual Cap',
    description: 'Adjustable casual cap.',
    price: 299,
    image: 'https://picsum.photos/seed/t20/600/600',
    category: 'Accessories',
    sizes: ['Free'],
    stock: 200
  }
];

const importData = async () => {
  try {
    await connect();
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('Products seeded!');
    process.exit();
  } catch (err) {
    console.error('Seeding error', err);
    process.exit(1);
  }
};

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected for seeding"))
    .catch((err) => {
    console.error("Mongo connection error:", err);
    process.exit(1);
  });

    console.log('Connected to DB for seeding');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

importData();
