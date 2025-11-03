import express from 'express';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import addressRoutes from './routes/address.routes.js';
import orderRoutes from './routes/order.routes.js';
import Constants from './constant.js';
import cors from 'cors';
import connectDB from './db/connect_db.js';
import bodyParser from 'body-parser';
import { stripeWebhook } from './controllers/order.controller.js';

const app = express();

app.use(
  "/order/api/webhook",
  bodyParser.raw({ type: "application/json" }),
  stripeWebhook
);


app.use(cors());
app.use(express.json());
connectDB(Constants.DB_URI); 

app.use('/auth/api', authRoutes);  
 app.get('/', (req, res) => {
    res.send('Hello from Express with ES6 modules!');
});
app.use('/auth/api', authRoutes);
app.use('/order/api', orderRoutes);
app.use('/product/api', productRoutes);
app.use('/address/api', addressRoutes);

const PORT = Constants.PORT;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});                 // ✅ server end mein


