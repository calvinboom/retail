/**
 * Database Seed Script
 *
 * Usage:
 *   npm run seed           - Seed all data
 *   npm run seed:admin     - Seed admin user only
 *   npm run seed:items     - Seed sample items only
 *   npm run seed:reset     - Reset and seed all data (WARNING: deletes existing data)
 *
 * Environment:
 *   Set MONGODB_URI in .env file or config.json
 */

require('dotenv').config({ path: './.env' });

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Load config with fallback
let config = {};
try {
    config = require('../config.json');
} catch (e) {
    console.log('config.json not found, using environment variables');
}

// Models
const User = require('../api/models/users');
const Item = require('../api/models/items');
const Customer = require('../api/models/customers');
const Seller = require('../api/models/sellers');

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || config.db?.MONGOOSE_CONNECTION_STR;

if (!MONGODB_URI) {
    console.error('ERROR: MONGODB_URI is not set');
    console.error('Please set MONGODB_URI in .env file or config.json');
    process.exit(1);
}

// ===========================================
// SEED DATA
// ===========================================

const adminUser = {
    email: 'admin@retail.com',
    password: 'admin123', // Will be hashed
    fname: 'Admin',
    lname: 'User',
    role: 'admin',
    phone: '0812345678'
};

const defaultUsers = [
    {
        email: 'cashier@retail.com',
        password: 'cashier123',
        fname: 'Cashier',
        lname: 'Staff',
        role: 'user',
        phone: '0823456789'
    },
    {
        email: 'manager@retail.com',
        password: 'manager123',
        fname: 'Manager',
        lname: 'Staff',
        role: 'manager',
        phone: '0834567890'
    }
];

const sampleItems = [
    {
        name: 'น้ำดื่ม',
        type: 'beverage',
        buy_price: 5,
        sell_price: 10,
        qty: 100,
        barcode: '8850999220017'
    },
    {
        name: 'ขนมปัง',
        type: 'food',
        buy_price: 15,
        sell_price: 25,
        qty: 50,
        barcode: '8850999220024'
    },
    {
        name: 'นม UHT',
        type: 'beverage',
        buy_price: 12,
        sell_price: 18,
        qty: 80,
        barcode: '8850999220031'
    },
    {
        name: 'มาม่า',
        type: 'food',
        buy_price: 5,
        sell_price: 8,
        qty: 200,
        barcode: '8850999220048'
    },
    {
        name: 'สบู่',
        type: 'household',
        buy_price: 20,
        sell_price: 35,
        qty: 30,
        barcode: '8850999220055'
    }
];

const sampleCustomers = [
    {
        customer_id: 'CUST001',
        fname: 'สมชาย',
        lname: 'ใจดี',
        phone: '0891234567',
        address: '123 ถ.สุขุมวิท กรุงเทพฯ',
        rank: 'bronze',
        point: 0,
        sp_detail: 3
    },
    {
        customer_id: 'CUST002',
        fname: 'สมหญิง',
        lname: 'มั่งมี',
        phone: '0892345678',
        address: '456 ถ.พหลโยธิน กรุงเทพฯ',
        rank: 'silver',
        point: 1500,
        sp_detail: 4
    }
];

const sampleSellers = [
    {
        seller_id: 'SELL001',
        email: 'supplier1@example.com',
        line_id: 'supplier1',
        fname: 'บริษัท',
        lname: 'ส่งของดี',
        shop_name: 'ร้านส่งของดี จำกัด',
        phone: '0211234567',
        address: '789 ถ.รามคำแหง กรุงเทพฯ'
    }
];

// ===========================================
// SEED FUNCTIONS
// ===========================================

async function hashPassword(password) {
    return bcrypt.hash(password, 10);
}

async function seedAdminUser() {
    console.log('\n--- Seeding Admin User ---');

    const existingAdmin = await User.findOne({ email: adminUser.email });
    if (existingAdmin) {
        console.log(`Admin user already exists: ${adminUser.email}`);
        return existingAdmin;
    }

    const hashedPassword = await hashPassword(adminUser.password);
    const admin = await User.create({
        ...adminUser,
        password: hashedPassword
    });

    console.log(`Created admin user: ${admin.email}`);
    console.log(`  - Password: ${adminUser.password} (please change after first login)`);
    return admin;
}

async function seedUsers() {
    console.log('\n--- Seeding Users ---');

    for (const userData of defaultUsers) {
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            console.log(`User already exists: ${userData.email}`);
            continue;
        }

        const hashedPassword = await hashPassword(userData.password);
        const user = await User.create({
            ...userData,
            password: hashedPassword
        });
        console.log(`Created user: ${user.email} (role: ${user.role})`);
    }
}

async function seedItems() {
    console.log('\n--- Seeding Items ---');

    for (const itemData of sampleItems) {
        const existingItem = await Item.findOne({ barcode: itemData.barcode });
        if (existingItem) {
            console.log(`Item already exists: ${itemData.name}`);
            continue;
        }

        const item = await Item.create(itemData);
        console.log(`Created item: ${item.name} (qty: ${item.qty})`);
    }
}

async function seedCustomers() {
    console.log('\n--- Seeding Customers ---');

    for (const customerData of sampleCustomers) {
        const existingCustomer = await Customer.findOne({ customer_id: customerData.customer_id });
        if (existingCustomer) {
            console.log(`Customer already exists: ${customerData.customer_id}`);
            continue;
        }

        const customer = await Customer.create(customerData);
        console.log(`Created customer: ${customer.fname} ${customer.lname} (${customer.customer_id})`);
    }
}

async function seedSellers() {
    console.log('\n--- Seeding Sellers ---');

    for (const sellerData of sampleSellers) {
        const existingSeller = await Seller.findOne({ email: sellerData.email });
        if (existingSeller) {
            console.log(`Seller already exists: ${sellerData.email}`);
            continue;
        }

        const seller = await Seller.create(sellerData);
        console.log(`Created seller: ${seller.shop_name}`);
    }
}

async function resetDatabase() {
    console.log('\n!!! WARNING: Resetting Database !!!');
    console.log('Deleting all existing data...');

    await User.deleteMany({});
    await Item.deleteMany({});
    await Customer.deleteMany({});
    await Seller.deleteMany({});

    console.log('All data deleted.');
}

// ===========================================
// MAIN
// ===========================================

async function main() {
    const args = process.argv.slice(2);
    const command = args[0] || 'all';

    console.log('===========================================');
    console.log('  Retail POS - Database Seed Script');
    console.log('===========================================');
    console.log(`Command: ${command}`);

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        switch (command) {
            case 'admin':
                await seedAdminUser();
                break;

            case 'users':
                await seedAdminUser();
                await seedUsers();
                break;

            case 'items':
                await seedItems();
                break;

            case 'customers':
                await seedCustomers();
                break;

            case 'sellers':
                await seedSellers();
                break;

            case 'reset':
                await resetDatabase();
                await seedAdminUser();
                await seedUsers();
                await seedItems();
                await seedCustomers();
                await seedSellers();
                break;

            case 'all':
            default:
                await seedAdminUser();
                await seedUsers();
                await seedItems();
                await seedCustomers();
                await seedSellers();
                break;
        }

        console.log('\n===========================================');
        console.log('  Seed completed successfully!');
        console.log('===========================================');

        console.log('\n--- Login Credentials ---');
        console.log(`Admin:   ${adminUser.email} / ${adminUser.password}`);
        console.log(`Cashier: ${defaultUsers[0].email} / ${defaultUsers[0].password}`);
        console.log(`Manager: ${defaultUsers[1].email} / ${defaultUsers[1].password}`);

    } catch (error) {
        console.error('Seed failed:', error.message);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('\nDatabase connection closed.');
    }
}

main();
