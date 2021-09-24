const express = require('express');
const ProductData = require('./src/model/Productdata');
const cors = require('cors');
var bodyparser = require('body-parser');
var app = new express();
var path = require('path');
app.use(cors());
var jwt = require('jsonwebtoken');
require('dotenv').config()


const register = require('../backend/src/model/register');
const { RSA_PKCS1_OAEP_PADDING } = require('constants');
const { userInfo } = require('os');
app.use(express.json())



app.get('/products', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS");
    ProductData.find()
        .then(function(products) {
            res.send(products);
        });
});
app.post('/insert', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS");
    console.log(req.body);
    var product = {
        productId: req.body.product.productId,
        productName: req.body.product.productName,
        productType: req.body.product.productType,
        price: req.body.product.price,
        quantity: req.body.product.quantity,
        description: req.body.product.description,
        location: req.body.product.location,
        imageUrl: req.body.product.imageUrl,

    }
    var product = new ProductData(product);
    product.save();

});
app.get('/products', function(req, res) {

    ProductData.find()
        .then(function(products) {
            res.send(products);
        });
});
app.get('/:id', (req, res) => {

    const id = req.params.id;
    ProductData.findOne({ "_id": id })
        .then((product) => {
            res.send(product);
        });
})

// app.post('/login', (req, res) => {
//     let userData = req.body


//         if (!username) {
//           res.status(401).send('Invalid Username')
//         } else 
//         if ( password !== userData.password) {
//           res.status(401).send('Invalid Password')
//         } else {
//           let payload = {subject: username+password}
//           let token = jwt.sign(payload, 'secretKey')
//           res.status(200).send({token})
//         }

//     })

app.put('/update', (req, res) => {
    console.log(req.body)
    id = req.body._id,
        productId = req.body.productId,
        productName = req.body.productName,
        productType = req.body.productType,
        price = req.body.price,
        quantity = req.body.quantity,
        description = req.body.description,
        location = req.body.location,
        imageUrl = req.body.imageUrl
    ProductData.findByIdAndUpdate({ "_id": id }, {
            $set: {
                "productId": productId,
                "productName": productName,
                "productType": productType,
                "price": price,
                "quantity": quantity,
                "description": description,

                "location": location,
                "imageUrl": imageUrl
            }
        })
        .then(function() {
            res.send();
        })
})

app.delete('/remove/:id', (req, res) => {

    id = req.params.id;
    ProductData.findByIdAndDelete({ "_id": id })
        .then(() => {
            console.log('success')
            res.send();
        })
})
app.post('/register', function(req, res) {
    res.header('Access-Control-Allow-Origin', "*") // use of this that from any orgin u are getting the request of productapp then u they can acess
    res.header('Access-Control-Allow-Methds : GET , POST, PATCH , PUT ,DELETE ,OPTIONS');
    console.log(req.body);

    var data1 = {
        name: req.body.data.name,
        email: req.body.data.email,
        pass: register.hashPassword(req.body.data.pass),
        num: req.body.data.num,
        address: req.body.data.address,
        state: req.body.data.state,
        district: req.body.data.district,
        pincode: req.body.data.pincode
    }


    let promise = register.findOne({ email: req.body.data.email })

    promise.then(function(doc) {
        if (doc) {
            res.json({ msg: "already there" })
        } else {
            var data = new register(data1);
            res.json({ msg: "suc" })
            data.save();
        }
    });


});



app.post('/login', function(req, res, next) {
    let promise = register.findOne({ email: req.body.data.email })

    promise.then(function(doc) {
        if (doc) {
            if (doc.isValid(req.body.data.pass)) {
                let token = jwt.sign({ name: doc._id }, 'secret', { expiresIn: '5h' });
                if (doc.role == "user") {

                    if (doc.email == "admin123@gmail.com") {
                        return res.status(200).send({
                            token: token,
                            msg: "user and admin"
                        })
                    } else {
                        return res.status(200).send({
                            token: token,
                            msg: "user"
                        })
                    }
                } else {

                    return res.status(200).send({
                        token: token,
                        msg: "baker"
                    })

                }
            } else {
                let abc = "Invalid password"
                res.json(abc);
            }
        } else {
            let abc = "User not resgistered"
            res.json(abc);
        }
    });
})

app.listen(process.env.PORT || 2222)