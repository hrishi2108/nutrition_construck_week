const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json()); // Important to parse JSON

connectDB(); // Connect to MongoDB

//  Register auth routes
app.use("/api/auth", require("./routes/auth.routes")); 
app.use("/api/meals", require("./routes/meal.routes"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
