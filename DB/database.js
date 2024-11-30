const mongoose = require('mongoose');

const connection = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/nfc_system', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected....');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1); 
    }
};

module.exports = connection;
