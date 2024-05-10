const express = require('express');
const dotenv = require('dotenv');
require('dotenv').config()
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User, Account } = require('../Databases/database');
const {authMiddleware} = require('../middlewares/middleware');
const { signupBody, signinBody, updateBody } = require('../validation/inputValidation');

// zod input validation



// signup route
router.post("/signup", async (req, res) => {
    // Implement user signup logic
    const  success  = signupBody.safeParse(req.body);
    if(!success) {
      return res.status(411).json({
            message: "Incorrect inputs"
        })
    } 

    // check if a user with this username already exists
    const userExisting = await User.findOne({
        username: req.body.username,
    })

    if(userExisting) {
       return res.status(411).json({
            message: "Email already taken"
        })
    }

    //  create new user
    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    })

    // get the id
    const userId = user._id;

    //  ----create new account -----

     await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
     })

    //  create the token
    const token = jwt.sign({
        userId
    }, process.env.JWT_SECRET);
    
    // return the response
    res.json({
        message: "User SignUp Sucessfully",
        token: token
    })

})

// input validation zod


router.post("/signin", async (req, res) => {

    const success = signinBody.safeParse(req.body)

//  check input is correct or not
    if(!success) {
        return res.status(411).json({
            message: "Incorrect Inputs"
        })
    }
    // take input in body and check user exist
    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    })
 
    // create the token
    if(user) {
        const token = jwt.sign({
            userId: user._id,
        }, process.env.JWT_SECRET);
    //   sending the response
        res.json({
            message: "User Signin Successfully",
            token: token
        }) 
        return;
    };

    res.status(411).json({
        message: "Error while logging in"
    })

})
// other auth routes

router.put("/update", authMiddleware, async(req, res) => {
     
    // zod validation
    const {success} = updateBody.safeParse(req.body);

    if(!success) {
        return res.status(411).json({
            message: "Error while updating information" 
       })
    }

    await User.updateOne(req.body, { 
        _id: req.userId 
     });

    res.json({
        message: "Updated successfully"
    })
    
})
  
 
 router.get("/bulk", async(req, res) => {

    const filter  = req.query.filter || "";
    const users = await User.find({
        $or: [{
            firstName : {
                "$regex" : filter
            }
        }, {
            lastName : {
                "$regex" : filter
            }
        }]
    })
        res.json({
            user: users.map(user => ({
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                _id: user._id
                
            }))
        })

    })
 

module.exports = router;