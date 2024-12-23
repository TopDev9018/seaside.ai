const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const userModel = require('../models/user.model')
const asyncHandler = require("express-async-handler");


const register = asyncHandler(async (req, res) => {

    //Destructuing the inputs from req.body 
    const { fullName, email, password } = req.body;

    //Verifying the email address inputed is not used already 
    const verifyEmail = await userModel.findOne({ email: email })
    try {
        if (verifyEmail) {
            return res.status(403).json({
                message: "Email already used"
            })
        } else {
            const salt = await bcrypt.genSalt(10); // Generate a salt
            const hashedPassword = await bcrypt.hash(password, salt); // Hash the password with 
            //Registering the user
            const user = new userModel({
                fullName: fullName,
                email: email,
                password: hashedPassword,
            });

            //saving the data to the mongodb user collection
            user.save()
                .then((response) => {
                    return res.status(201).json({
                        message: 'user successfully created!',
                        result: response,
                        success: true
                    })
                })
                .catch((error) => {
                    res.status(500).json({
                        error: error,
                    })
                })
        }
    } catch (error) {
        return res.status(412).send({
            success: false,
            message: error.message
        })
    }

})


const login = asyncHandler(async (req, res) => {

    const { email, password } = req.body
    userModel.findOne({
        email: email
    }).then(async (user) => {
        if (!user) {
            return res.status(401).json({
                message: "User doesn't exist!",
            })

        }
        if (!await bcrypt.compare(password, user.password))
            return res.status(403).json({
                message: "Password is incorrect!",
            })

        let jwtToken = jwt.sign(
            {
                email: user.email,
                userId: user.userId
            },
            //Signign the token with the JWT_SECRET in the .env
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        )
        return res.status(200).json({
            accessToken: jwtToken,
            userId: user._id,
        })

    })
        .catch((err) => {
            return res.status(401).json({
                messgae: err.message,
                success: false
            })
        })
})

module.exports = {
    register,
    login
}