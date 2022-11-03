const mongoose = require('mongoose');

const mongoDbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log('Database connection successful');
      } catch (err) {
        console.log(err);
        process.exit(1);
      }
};

module.exports = {
    mongoDbConnect,
};
