import Constants from "../constant.js";
import { orderModel } from "../models/order.model.js";
import Stripe from "stripe";
const stripe = new Stripe(Constants.STRIPE_SECRET_KEY);

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      Constants.STRIPE_WEBHOOK_SECRET_KEY
    );
  } catch (err) {
    console.log("⚠️ Webhook signature verify failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`📦 Event received: ${event.type}`);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log("✅ Checkout session completed:", session.id);
    // Yahan tum apna order status update kar sakte ho

    const updateOrder = await orderModel.findOneAndUpdate({stripeSessionId: session.id}, {status: 'Paid'}, {new: true});

    console.log("updatedOrder ----> ", updateOrder);
    
  }

  if (event.type === "checkout.session.async_payment_failed" || event.type === "checkout.session.expired") {
  const session = event.data.object;
  console.log("❌ Checkout session failed/expired:", session.id);

  await orderModel.findOneAndUpdate(
    { stripeSessionId: session.id },
    { status: "Failed" }
  );

  console.log("📦 Order marked as Failed:", session.id);
}

  res.json({ received: true });
};


export const createOrder = async (req, res) => {
    try {
        let { paymentMethod, products, addressId, totalAmount } = req.body;
        let user = req.user;
        if (!paymentMethod || !products?.length || !addressId || !totalAmount) {
            console.log(paymentMethod, products, addressId, totalAmount);
            return res.status(400).json({status: "failed", message: "Payment method, products or address is missing"});
            
        }
        if (paymentMethod === 'Cash On Delivery') {
            console.log(products);
            
            const order = new orderModel({
                userId: user.id,
                products,
                paymentMethod,
                totalAmount,
                addressId,
                status: "Shipping"
            })
            await order.save()
            return res.status(201).json({status: "success", message: "Order Created Successfully", data: order});
        }

        if (paymentMethod === 'card') {
            console.log("products -----------> ", products);
            
              const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: products.map((item) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.title,
                    images: [item.images[0]]
                },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        })),
        mode: 'payment',
        success_url: 'http://localhost:5173/my-orders',
        cancel_url: 'http://localhost:3000/payment-failed',
        metadata: { userId: user._id.toString() }
    });

              const order = new orderModel({
                userId: user._id,
                // products: products.map((item) => ({
                //     id: item.id,
                //     price: item.price,
                //     quantity: item.quantity
                // })),
                products,
                paymentMethod,
                totalAmount,
                status: 'Pending',
                stripeSessionId: session.id,
                addressId
            })
            await order.save()

            return res.status(201).json({status: "success", message: "Order CREATED", data: order, checkoutURL: session.url})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({status: 'failed', message: 'Internal Server Error'});
    }
}

export const getOrders = async (req, res) => {
    try {
        let orders = await orderModel.find();
        res.status(200).json({status: "success", message: 'Orders fetch successfully', data: orders});
    } catch (error) {
        console.log(error);
        res.status(500).json({status: 'failed', message: "Internal Server Error"});
    }
}

export const changeStatusByAdmin = async (req, res) => {
    try {
        let {orderId} = req.params;
        let {status} = req.body;
        const order = await orderModel.findById(orderId);
        if (!status) {
            return res.status(400).json({status: 'failed', message: "status is required"});
        }
        order.status = status;
        await order.save();
        res.status(200).json({status: "success", message: "status change successfully", data: order});
    } catch (error) {
        console.log(error);
        res.status(500).json({status: 'failed', message: "Internal Server Error"});
    }
}

export const getUserOrders = async (req, res) => {
    try {
        let user = req.user;
        let orders = await orderModel.find({userId: user._id});
        res.status(200).json({status: "success", message: 'Orders fetch successfully', data: orders});
    } catch (error) {
        console.log(error);
        res.status(500).json({status: 'failed', message: "Internal Server Error"});
    }
}

// 5. cancel order (option in optimizing)