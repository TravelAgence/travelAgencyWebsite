import User from "../models/User.js"
import bcrypt from "bcryptjs" 
import jwt from "jsonwebtoken" 

//User registration
export const register = async (req, res) => {
    try{
        // function for  creat activation code 
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let activationCode = "";
        for (let i = 0; i < 25; i++) {
            activationCode += characters.charAt(Math.floor(Math.random() * characters.length));
        }


        // hashing the password
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(req.body.password, salt)

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash,  
            photo: req.body.photo,
            activationCode: activationCode,
        })
    
        await newUser.save()

        res.status(200).json({
            success: true,
            message: "Successfully created"
        })
    }catch(err){
        res.status(500).json({
            success: false,
            message: "Failed to create. Try again"
        })
    }
}

//User login
export const login = async (req, res) => {

    const email = req.body.email
    const password = req.body.password

    try{

        const user = await User.findOne({email})

        //if user doesnt exist
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        //if user exist then check the password or compare the password
        const checkCorrectPassword = await bcrypt.compare(
            req.body.password, 
            user.password
        )

        //if password is wrong
        if(!checkCorrectPassword){
            return res.status(401).json({
                success: false,
                message: "Incorrect email or password"
            })
        }

        const {password: hashedPassword, role, ...rest} = user._doc

        //create jwt token
        const token = jwt.sign(
            {id: user._id, role: user.role},
            process.env.JWT_SECRET_KEY,
            {expiresIn: "15d"}
        )

        // set token in the browser cookies and send the response to the client
        res
        .cookie("accessToken", token, {
            httpOnly: true,
            expires: token.expiresIn,
        })
        .status(200)
        .json({
            token,
            data:{...rest},
            role,
        })

    }catch(err){
        console.error(err);  // log the error
        res
        .status(500)
        .json({success: false, message: "Failed to log in"})
    }
}

