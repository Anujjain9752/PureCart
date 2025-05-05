import Order from "../models/Order.js";
import Product from "../models/Product.js";
import stripe from "stripe";
import User from "../models/User.js"

// ───────────────────────────────────────────────
// 1. Place Order - COD
export const placeOrderCOD = async (req, res) => {
  try {
    const userId = req.userId;
    const {  items, address } = req.body;

    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }

    let amount = 0;

    for (let item of items) {
      const product = await Product.findById(item.product);
      amount += product.offerPrice * item.quantity;
    }

    amount += Math.floor(amount * 0.02); // 2% tax

    await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "COD",
    });

    res.json({ success: true, message: "COD order placed successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// ───────────────────────────────────────────────
// 2. Place Order - Stripe
export const placeOrderStripe = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, address } = req.body;
    const { origin } = req.headers;

    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }

    let amount = 0;
    let productData = [];

    for (let item of items) {
      const product = await Product.findById(item.product);
      productData.push({
        name: product.name,
        price: product.offerPrice,
        quantity: item.quantity,
      });
      amount += product.offerPrice * item.quantity;
    }

    amount += Math.floor(amount * 0.02); // 2% tax

    const order = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "Online",
    });

    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    const line_items = productData.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: Math.floor(item.price + item.price * 0.02) * 100, // cents
      },
      quantity: item.quantity,
    }));

    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader?next=my-orders`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: order._id.toString(),
        userId,
      },
    });

    res.json({ success: true, url: session.url });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


// stripe webhooks to verify payments action: /stripe

export const stripeWebhooks = async (req,res)=> {


const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)

const sig = req.headers["stripe-signature"];

let event;
try {
  event = stripeInstance.webhooks.constructEvent(
    req.body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET
  )
} catch (error) {
   res.status(400).send(`webhook error  : ${error.message}`)
}


//hande the event 

switch(event.type){
  case "payment_intent.succeeded":{
    const paymentIntent = event.data.object;
    const paymentIntentId = paymentIntent.id;

    //getting session metadata
    const session = await stripeInstance.checkout.sessions.list({
        payment_intent : paymentIntentId,
    }) 

    const {orderId, userId} = session.data[0].metadata;
  // mark payemnt as paid

  await Order.findByIdAndUpdate(orderId, {isPaid: true})


  await User.findByIdAndUpdate(userId, {cartItems: {}});

  break;
    }

  case "payment_intent.payemnt_failed":{
    const paymentIntent = event.data.object;
    const paymentIntentId = paymentIntent.id;

    //getting session metadata
    const session = await stripeInstance.checkout.sessions.list({
        payment_intent : paymentIntentId,
    }) 

    const {orderId} = session.data[0].metadata;
     
    await Order.findByIdAndDelete(orderId);
    break;

  }

    default:
      console.error(`Unhandled event type ${event.type}`)
      break;
  }

  res.json({received: true})
}



















// ───────────────────────────────────────────────
// 3. Get Orders by User ID
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;

    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// ───────────────────────────────────────────────
// 4. Get All Orders for Seller/Admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
