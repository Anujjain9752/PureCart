import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import 'dotenv/config.js'
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import { stripeWebhooks } from './controllers/orderController.js';

const app = express();

const PORT = process.env.PORT || 4000;


await connectDB();
await connectCloudinary();


//allow multiple origins
const allowedOrigins = ['http://localhost:5173'];  

app.post('/stripe', express.raw({type: "application/json"}), stripeWebhooks)

 
app.use(cookieParser());
//Middleware configuration
app.use(express.json());

app.use(cors({origin: allowedOrigins, credentials: true}))


app.get('/',(req,res)=> {
    res.send('ApI is working !')
})



app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
} )