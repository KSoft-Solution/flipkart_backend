const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

mongoose
  .connect(process.env.MONGO_URI)
  .then((uri) =>
    console.log(
      `database connected successfully with ${uri.connection.port}-${uri.connection.name}`
        .cyan.bold
    )
  )
  .catch((err) => {
    console.log(`${err}`.red.bold);
    process.exit(1);
  });
