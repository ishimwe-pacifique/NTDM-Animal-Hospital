const { MongoClient } = require('mongodb');

// Test MongoDB connection
async function testMongoConnection() {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://username:password@cluster0.5impn.mongodb.net/ntdm_animal_hospital?retryWrites=true&w=majority';
  
  console.log('Testing MongoDB connection...');
  console.log('URI:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials
  
  const client = new MongoClient(MONGODB_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
    retryWrites: true,
    retryReads: true,
  });

  try {
    await client.connect();
    console.log('✅ Successfully connected to MongoDB!');
    
    // Test database access
    const db = client.db('ntdm_animal_hospital');
    const collections = await db.listCollections().toArray();
    console.log('📁 Available collections:', collections.map(c => c.name));
    
    // Test users collection
    const usersCount = await db.collection('users').countDocuments();
    console.log(`👥 Users in database: ${usersCount}`);
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error('Error type:', error.name);
    console.error('Error message:', error.message);
    
    if (error.message.includes('ETIMEOUT')) {
      console.log('\n🔧 Troubleshooting tips:');
      console.log('1. Check if your MongoDB Atlas cluster is running');
      console.log('2. Verify your connection string is correct');
      console.log('3. Check your IP whitelist in MongoDB Atlas');
      console.log('4. Ensure your database user has proper permissions');
    }
  } finally {
    await client.close();
  }
}

testMongoConnection();
