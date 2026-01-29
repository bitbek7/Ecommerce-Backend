import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    orderItems: [{
        products: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "productPlural",
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true,
            min: 0
        }
    }],
    totalPrice: {
        type: Number,
        required: true
    },
    shippingAddress: {
        type: Object,   //This defines shipping address as sub-schema object with its own fields (country,city,street,postalCode)
        country: String, //Saved document look like shippingAddress:{country:"India",city:"Punjab",street:"",postalCode:""}
        city: String,
        street: String,
        postalCode: String,
        required: true
    },
    stripeSessionId:{
        type:String,
        unique:true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paidAt: {
        type: Date,
        required: true
    },
    isDelivered: {
        type: Boolean,
        default: false
    },
    deliveredAt: {
        type: Date,
        required: true
    }
}, { timestamps: true });
export const orderModel = mongoose.model('order', orderSchema);