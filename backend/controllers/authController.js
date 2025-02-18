import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../nodeMailer/nodeMailer.js"; // Import the sendEmail function

// User registration
export const register = async (req, res) => {
    try {
        // Function to create activation code
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let activationCode = "";
        for (let i = 0; i < 25; i++) {
            activationCode += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        // Hashing the password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash,
            photo: req.body.photo,
            activationCode: activationCode,
        });

        await newUser.save();

        // Send activation email
        await sendEmail(newUser.email, newUser.activationCode);

        res.status(200).json({
            success: true,
            message: "Successfully created. Please check your email to activate your account.",
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to create. Try again",
        });
    }
};

// User login
export const login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await User.findOne({ email });

        // If user doesn't exist
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Check if user is active or not
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: "Please activate your account. Go to your email and click on the activation link.",
            });
        }

        // If user exists then check the password or compare the password
        const checkCorrectPassword = await bcrypt.compare(req.body.password, user.password);

        // If password is wrong
        if (!checkCorrectPassword) {
            return res.status(401).json({
                success: false,
                message: "Incorrect email or password",
            });
        }

        const { password: hashedPassword, role, ...rest } = user._doc;

        // Create JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "15d" }
        );

        // Set token in the browser cookies and send the response to the client
        res
            .cookie("accessToken", token, {
                httpOnly: true,
                expires: token.expiresIn,
            })
            .status(200)
            .json({
                token,
                data: { ...rest },
                role,
            });
    } catch (err) {
        console.error(err); // Log the error
        res.status(500).json({ success: false, message: "Failed to log in" });
    }
};