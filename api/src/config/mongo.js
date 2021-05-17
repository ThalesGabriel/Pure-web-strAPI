const mongoose = require("mongoose");

const mongooseConnect = () => {
  mongoose
    .connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      poolSize: 10,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    .then(() => console.log("📙 DB connection successful!"))
    .catch(() => console.error.bind(console, "connection error:"));
};

const mongooseDisconnect = () => {
  mongoose.disconnect()
};

module.exports = { mongooseConnect, mongooseDisconnect };
