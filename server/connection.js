const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb://localhost/ChatSystem';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(`MongoDB connection error: ${err}`));
