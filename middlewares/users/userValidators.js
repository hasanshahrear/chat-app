// external imports

const {check, validationResult} = require("express-validator")
const createHttpError = require("http-errors")
const path = require("path")
const {unlink} = require("fs")

// internal imports
const User = require("../../models/People");


// add user

const addUserValidators = [
    check("name")
    .isLength({min: 1})
    .withMessage("Name is required")
    .isAlpha("en-US", {ignore: " -"})
    .withMessage("Name must not contain anything other than alphabet")
    .trim(),

    check("email")
    .isEmail()
    .withMessage("Invalid email address")
    .trim()
    .custom(async (value) => {
        try{
            const user = await User.findOne({email: value})
            if(user){
                throw createHttpError("Email is already in use!")
            }
        }catch(err){
            throw createHttpError(err.message)
        }
    }),

    check("mobile")
    .isMobilePhone("bn-BD", {
        strictMode: true
    })
    .withMessage("Mobile Must be a valid Bangladeshi number")
    .custom(async (value) => {
        try{
            const user = await User.findOne({mobile: value})
            if(user){
                throw createHttpError("Mobile already in use!")
            }
        }catch(err){
            throw createHttpError(err.message)
        }
    }),

    check("password")
    .isStrongPassword()
    .withMessage("8 char lowercase, uppercase, number & symbol")
]

const addUserValidationHandler = function(req, res, next){
    const errors = validationResult(req)
    const mappedErrors = errors.mapped()

    if(Object.keys(mappedErrors).length ===0){
        next()
    }else{
        // remove uploadfiles
        if(req.files.length > 0){
            const {filename} = req.files[0]
            unlink(
                path.join(__dirname, `/../public/uploads/${filename}`),
                (err)=> {
                    if(err) console.log(err)
                }
            )
        }

        // response the errors

        res.status(500).json({
            errors: mappedErrors
        })
    }
}

module.exports = {addUserValidators, addUserValidationHandler}