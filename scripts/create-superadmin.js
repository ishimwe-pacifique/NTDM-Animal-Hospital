const { MongoClient } = require('mongodb');

// MongoDB connection string - update this with your actual connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://pacifishimwe150:Ishimwe%4025517@cluster0.5impn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const DB_NAME = 'ntdm_animal_hospital';

async function createSuperAdmin() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    const usersCollection = db.collection('users');
    
    // Check if super admin already exists
    const existingSuperAdmin = await usersCollection.findOne({ role: 'superadmin' });
    
    if (existingSuperAdmin) {
      console.log('Super admin already exists:');
      console.log(`Email: ${existingSuperAdmin.email}`);
      console.log(`Name: ${existingSuperAdmin.name}`);
      console.log(`Status: ${existingSuperAdmin.status}`);
      return;
    }
    
    // Create super admin user
    const superAdminData = {
      name: 'Super Administrator',
      email: 'admin@ntdm.com',
      password: 'admin123', // Change this to a secure password
      phone: '+250 123 456 789',
      role: 'superadmin',
      status: 'active',
      permissions: ['manage_users', 'view_consultations', 'manage_system'],
      lastLoginAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await usersCollection.insertOne(superAdminData);
    
    if (result.insertedId) {
      console.log('✅ Super admin created successfully!');
      console.log('📧 Email: admin@ntdm.com');
      console.log('🔑 Password: admin123');
      console.log('⚠️  IMPORTANT: Change the password after first login!');
      console.log('\nYou can now login at: http://localhost:3000/login');
    } else {
      console.log('❌ Failed to create super admin');
    }
    
  } catch (error) {
    console.error('Error creating super admin:', error);
  } finally {
    await client.close();
  }
}

// Run the script
createSuperAdmin();
