import express, { urlencoded, json } from "express";
import cors from "cors";

import bookRoute from "./routes/bookRoute.js";
import userRoute from "./routes/userRoute.js";
import purchaseRoute from "./routes/purchaseRoute.js";

const app = express();

app.use(cors());
app.use(urlencoded({ extended: true }));
app.use(json());

app.use(bookRoute);
app.use(userRoute);
app.use(purchaseRoute);

app.listen(3000, () => {
  console.log("Server Runnig on port 3000");
});
