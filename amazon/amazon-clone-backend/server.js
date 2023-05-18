

// const express = require('express');
const multer = require('multer');
const path = require('path');
// const mongoose = require('mongoose');
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Products = require("./Products");
const Users = require("./Users");
const Orders = require("./Orders");
// const Merchant =require ("./Merchant")
const stripe = require("stripe")(
  "sk_test_51KUDBXSE1AGsrDtwPrEyIlUO6MdKE5YUC77sdqUjLmrwjiEXxcGQPtkEDYlKmlaT6Ll0IIfMtBxaRYoWTEfdXYAh00tng8EKHY"
);


const app = express();
const port = process.env.PORT || 8000;

// Middlewares
app.use(express.json());
app.use(cors());

// connection url
// bOcEyRXkc0ri8jAf

const connection_url ="mongodb+srv://admin:pSfIa0Yfkg4IWcL6@cluster0.20goy10.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(connection_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// API

app.get("/", (req, res) => res.status(200).send("Home Page"));

// add product

app.post("/products/add", (req, res) => {
  const productDetail = req.body;

  console.log("Product Detail >>>>", productDetail);

  Products.create(productDetail, (err, data) => {
    if (err) {
      res.status(500).send(err.message);
      console.log(err);
    } else {
      res.status(201).send(data);
    }
  });
});

app.get("/products/get", (req, res) => {
  Products.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

// API for SIGNUP

app.post("/auth/signup", async (req, res) => {
  const { email, password, fullName } = req.body;

  const encrypt_password = await bcrypt.hash(password, 10);

  const userDetail = {
    email: email,
    password: encrypt_password,
    fullName: fullName,
  };

  const user_exist = await Users.findOne({ email: email });

  if (user_exist) {
    res.send({ message: "The Email is already in use !" });
  } else {
    Users.create(userDetail, (err, result) => {
      if (err) {
        res.status(500).send({ message: err.message });
      } else {
        res.send({ message: "User Created Succesfully" });
      }
    });
  }
});

// API for LOGIN

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const userDetail = await Users.findOne({ email: email });

  if (userDetail) {
    if (await bcrypt.compare(password, userDetail.password)) {
      res.send(userDetail);
    } else {
      res.send({ error: "invaild Password" });
    }
  } else {
    res.send({ error: "user is not exist" });
  }
});

// API for PAYMENT

app.post("/payment/create", async (req, res) => {
  const total = req.body.amount;
  console.log("Payment Request recieved for this ruppess", total);

  const payment = await stripe.paymentIntents.create({
    amount: total * 100,
    currency: "inr",
  });

  res.status(201).send({
    clientSecret: payment.client_secret,
  });
});

// API TO add ORDER DETAILS

app.post("/orders/add", (req, res) => {
  const products = req.body.basket;
  const price = req.body.price;
  const email = req.body.email;
  const address = req.body.address;

  const orderDetail = {
    products: products,
    price: price,
    address: address,
    email: email,
  };

  Orders.create(orderDetail, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("order added to database >> ", result);
    }
  });
});

app.post("/orders/get", (req, res) => {
  const email = req.body.email;

  Orders.find((err, result) => {
    if (err) {
      console.log(err);
    } else {
      const userOrders = result.filter((order) => order.email === email);
      res.send(userOrders);
    }
  });
});


//Api for merchant

const merchantSchema = new mongoose.Schema({
  businessName: String,
  businessAddress: String,
  nationalIdDocumentPath: String,
  orgDocumentPath: String,
});

const Merchant = mongoose.model('Merchant', merchantSchema);

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// API endpoint for handling merchant registration
app.post('/merchant-registration', upload.fields([
  { name: 'nationalIdDocument', maxCount: 1 },
  { name: 'orgDocument', maxCount: 1 }
]), async (req, res) => {
  const { businessName, businessAddress } = req.body;
  const nationalIdDocumentPath = req.files.nationalIdDocument[0].path;
  const orgDocumentPath = req.files.orgDocument[0].path;

  // Perform any additional validation or processing on the form data here

  // Save the form data to the database
  try {
    const merchant = new Merchant({
      businessName,
      businessAddress,
      nationalIdDocumentPath,
      orgDocumentPath,
    });
    await merchant.save();
    // Send a response indicating success
    res.status(200).json({ message: 'Merchant registration successful' });
  } catch (error) {
    console.error(error);
    // Send a response indicating failure
    res.status(500).json({ error: 'Failed to save merchant registration data' });
  }
});





























app.listen(port, () => console.log("listening on the port", port));
