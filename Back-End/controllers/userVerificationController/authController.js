
import UserModel from "../../model/userModel.js";
import { registerUser, loginUser } from "../../services/userVerificationServices/authServices.js";

const register = async (req, res) => {
    const { username, companyCode, email, mobile, password } = req.body;

    if (!username || !companyCode || !email || !mobile || !password) {
        return res.status(400).json({ success: false, message: "All fields are required!" });
    }

    const user = new UserModel({ username, companyCode, email, mobile, password });

    try {
        const response = await registerUser(user);
        if (response.success) {
            res.status(201).json(response);
        } else {
            res.status(400).json(response);
        }
    } catch (error) {
        console.log("Unhandled error in register controller:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const login = async (req, res) => {
    const { email, password, companyCode } = req.body;

    if (!email || !password || !companyCode) {
        return res.status(400).json({ success: false, message: "Email, password and company code are required!" });
    }

    try {
        const response = await loginUser(email, password, companyCode);
        if (response.success) {
            res.status(200).json(response);
        } else {
            res.status(401).json(response);
        }
    } catch (error) {
        console.log("Unhandled error in login controller:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export { register, login };
