const express = require("express");
const cors = require("cors");

const bookRoute = require("./routes/bookRoute");
const userRoute = require("./routes/userRoute");
const purchaseRoute = require("./routes/purchaseRoute");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(bookRoute);
app.use(userRoute);
app.use(purchaseRoute);

app.listen(3000, () => {
  console.log("Server Runnig on port 3000");
});
