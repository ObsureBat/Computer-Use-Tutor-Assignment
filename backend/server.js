const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');


dotenv.config();


const app = express();


app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/calendar')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


const eventRoutes = require('./routes/events');


app.use('/api/events', eventRoutes);


app.get('/', (req, res) => {
  res.send('Calendar API is running');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});