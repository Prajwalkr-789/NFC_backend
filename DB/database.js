const mongoose = require('mongoose');

const connection = async () => {
    try {
            await mongoose.connect('mongodb+srv://prajwalkrp07:prajwal7899@cluster0.jpkht3e.mongodb.net/Nfc_database?retryWrites=true&w=majority&appName=Cluster0', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => console.log('MongoDB connected....')) ;
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1); 
    }
};

module.exports = connection;
