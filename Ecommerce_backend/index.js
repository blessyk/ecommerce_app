require("dotenv").config()
const express = require("express")
const connectDB = require("./config/dbConnection")
const cors = require("cors")
const helmet = require("helmet")
const errorHandler = require("./middleware/errorHandler");

//const mongoSanitize = require("express-mongo-sanitize")

const app = express();
connectDB();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(errorHandler);
//app.use(mongoSanitize());

app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = process.env.PORT || 5000;

app.use("/api/auth", require("./routes/authenticationRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/users", require("./routes/userProfileRoutes"));
app.use("/api/recommendations", require("./routes/recommandationRoute"));
app.listen(process.env.PORT,()=>{
    console.log(`Server running on ${PORT}`)
});