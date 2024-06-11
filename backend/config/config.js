const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT,
  mongoose: {
    url: process.env.MONGODB_URI || 'mongodb+srv://aryan:aryan@cluster0.mwu3of2.mongodb.net/',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: process.env.SECRET_KEY || 'your_secret_key',
  },
};
