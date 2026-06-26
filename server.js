const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

dotenv.config();

const app = express();

// -----------------------------
// Middleware
// -----------------------------
app.use(cors());
app.use(express.json());

// -----------------------------
// MongoDB Connection
// -----------------------------
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log("✅ MongoDB Connected");
})
.catch((err) => {
    console.log("❌ MongoDB Error");
    console.log(err);
});

// -----------------------------
// Order Model
// -----------------------------
const Order = require("./models/Order");

// -----------------------------
// Home
// -----------------------------
app.get("/", (req,res)=>{
    res.send("Deecuts Backend Running");
});

// -----------------------------
// Create Order
// -----------------------------
app.post("/api/orders", async(req,res)=>{

    try{

        const order = await Order.create(req.body);

        res.status(201).json(order);

    }catch(err){

        console.log(err);

        res.status(500).json({
            success:false,
            message:err.message
        });

    }

});

// -----------------------------
// Get All Orders
// -----------------------------
app.get("/api/orders", async(req,res)=>{

    try{

        const orders = await Order.find()
        .sort({createdAt:-1});

        res.json(orders);

    }catch(err){

        res.status(500).json({
            success:false,
            message:err.message
        });

    }

});

// -----------------------------
// Get Single Order
// -----------------------------
app.get("/api/orders/:id", async(req,res)=>{

    try{

        const order = await Order.findById(req.params.id);

        if(!order){

            return res.status(404).json({
                success:false,
                message:"Order Not Found"
            });

        }

        res.json(order);

    }catch(err){

        res.status(500).json({
            success:false,
            message:err.message
        });

    }

});

// -----------------------------
// Update Order
// -----------------------------
app.put("/api/orders/:id", async(req,res)=>{

    try{

        const updated = await Order.findByIdAndUpdate(

            req.params.id,

            req.body,

            {
                new:true
            }

        );

        res.json({

            success:true,

            order:updated

        });

    }catch(err){

        res.status(500).json({

            success:false,

            message:err.message

        });

    }

});

// -----------------------------
// Delete Order
// -----------------------------
app.delete("/api/orders/:id", async(req,res)=>{

    try{

        await Order.findByIdAndDelete(req.params.id);

        res.json({

            success:true,

            message:"Order Deleted"

        });

    }catch(err){

        res.status(500).json({

            success:false,

            message:err.message

        });

    }

});
// -----------------------------
// Admin Login
// -----------------------------
app.post("/api/admin/login", async (req, res) => {

    const { username, password } = req.body;

    if (
        username !== process.env.ADMIN_USERNAME ||
        password !== process.env.ADMIN_PASSWORD
    ) {
        return res.status(401).json({
            success: false,
            message: "Invalid Username or Password"
        });
    }

    const token = jwt.sign(
        {
            username: process.env.ADMIN_USERNAME
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );

    res.json({
        success: true,
        token
    });

});
// -----------------------------
// Dashboard API
// -----------------------------
app.get("/api/dashboard", async(req,res)=>{

    try{

        const totalOrders = await Order.countDocuments();

        const deliveredOrders =
        await Order.countDocuments({
            orderStatus:"Delivered"
        });

        const pendingOrders =
        await Order.countDocuments({
            orderStatus:"Pending"
        });

        const sales =
        await Order.aggregate([
            {
                $group:{
                    _id:null,
                    total:{
                        $sum:"$totalAmount"
                    }
                }
            }
        ]);

        res.json({

            totalOrders,

            deliveredOrders,

            pendingOrders,

            totalSales:
            sales.length
            ?
            sales[0].total
            :
            0

        });

    }catch(err){

        res.status(500).json({

            success:false,

            message:err.message

        });

    }

});


// -----------------------------
// Server
// -----------------------------
const PORT =
process.env.PORT
||
5000;

app.listen(PORT,()=>{

    console.log(

        `🚀 Server Running on ${PORT}`

    );

});
