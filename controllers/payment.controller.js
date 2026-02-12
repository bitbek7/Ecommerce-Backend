import Coupon from "../model/coupon.model.js";
import Product from "../model/product.model.js";
import Order from "../model/order.model.js";
import { stripe } from "../config/stripe.js";
import mongoose from "mongoose";

export const createCheckOutSession = async (req, res) => {
    try {
        const { products, couponCode } = req.body;
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "Cart is empty" })
        };

        const dbProducts = await Product.find({ _id: { $in: products.map(p => p._id) } });
        let totalAmount = 0;

        const lineItems = products.map((item) => {
            const dbProduct = dbProducts.find(p => p._id.toString() === item._id.toString());
            if (!dbProduct) throw new Error(`Product ${p._id}Not Found..!!!`);
            if (dbProduct.stock < item.quantity) throw new Error(`Insufficient stock for${dbProduct.name}`);
            const unitAmount = Math.round(dbProduct.price * 100);
            totalAmount += unitAmount * item.quantity;
            return {
                price_data: {
                    currency: "USD",
                    Product_Data: { name: dbProduct.name, images: [dbProduct.image] },
                    unit_Amount: unitAmount,
                },
                quantity: item.quantity
            }
        })
        //Coupon Handeling 
        let stripeDiscounts = [];
        if (couponCode) {
            const coupon = await Coupon.findOne({ code: couponCode, userId: req.user._id, isActive: true });
            if (coupon) {
                const stripCoupon = await stripe.coupons.create({
                    precent_off:    coupon.discountPercentage,
                    duration: "once",
                });
                stripeDiscounts.push({ coupon: stripCoupon.id });
                totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100);
            }
        }
        //Create Stripe Session
        const session = await stripe.checkout.sessions.create({
            automatic_payment_method:{enabled:true},
            line_items: lineItems,
            mode: "payment",
            sucess_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/cart`,
            discounts: stripeDiscounts,
            metadata: {
                userID: req.user._id.toString(),
                couponCode: couponCode || "",
                cartData: JSON.stringify(products.map(p => {
                    return {
                        id: p._id,
                        quantity: p.quantity,
                        price: p.price
                    }
                }))                                                                                     
            },
        });
        if (totalAmount > 20000) {
            await createNewCoupon(req.user._id);
        }
        return res.status(200).json({
            sessionId: session.id,
            url: session.url,
            totalAmount: totalAmount / 100
        })

    } catch (error) {
        console.error("CheckOut Error:", error);
        return res.status(500).json({ message: error.message });
    }
};
//STRIPE WEBHOOK (SOURCE OF TRUTH)
export const handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
        console.log("Webhook Signature Error:", error);
        return res.status(400).send(`WebHook Error:${error.message}`);
    }
    if (event.type === 'checkOut.session.completed') {
        const session = event.data.object;
        const sessionDb = await mongoose.startSession();
        sessionDb.startTransaction();
        try {
            const existingOrder = await Order.findOne({ stripeSessionId: session.id }).session(sessionDb);
            if (existingOrder) {
                await sessionDb.endSession();
                return res.status(200).json({ received: true });
            }
            const cartItems = JSON.parse(session.metadata.cartData);
            for (const item of cartItems) {
                const product = Product.findByIdAndUpdate(
                    item.id,
                    { $inc: { stock: -item.quantity } },
                    { session: sessionDb, new: true }
                );
                if (Product.stock < 0) {
                    console.warn(`Stock Issue:Product ${Product.name} oversold.`);
                }
            }
            if (session.metadata.couponCode) {
                await Coupon.findOneAndUpdate(
                    { code: session.metadata.couponCode, userId: session.metadata.userId },
                    { isActive: false },
                    { session: sessionDb });
            }

        
        const order = new order({
            user: session.metadata.userID,
            products: cartItems.map(p => ({
                product: p.id,
                quantity: p.quantity,
                price: p.price
            })),
            totalAmount: session.amount_total / 100,
            stripeSession: session.id
        });
        await order.save({ session: sessionDb });
        if (session.amount_total > 2000) {
            await createNewCoupon(session.metadata.userId, sessionDb);
        }
        await sessionDb.commitTransaction();
        console.log("Order Fulfillment Complete.");
    } catch (error) {
        await sessionDb.abortTranaction();
        console.error("WebHook fulfillment Error:", error);
    } finally {
        sessionDb.endSession();
    }
return res.status(200).json({ received: true });
};

//Helpers 
async function createNewCoupon(userId) {
    await Coupon.findOneAndDelete({ userId });
    const newCoupon = new Coupon({
        code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        discountPercentage: 10,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        userId: userId
    });
    await newCoupon.save();
    return newCoupon;
}}