const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://admin1:admin@chatsystem.dokiswi.mongodb.net/db_chat?retryWrites=true&w=majority";
//const MONGODB_URI="mongodb://130.65.254.14:27017"
//const MONGODB_URI="mongodb://34.228.79.83:27017"


mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(`MongoDB connection error: ${err}`));
