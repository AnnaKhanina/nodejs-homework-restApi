const app = require('./app');
const PORT = process.env.PORT || 3000;
require('dotenv').config();

const { mongoDbConnect } = require('./db/connect');

const runConnection = async () => {
  try {
    await mongoDbConnect();
    app.listen(PORT, () => {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

runConnection();
