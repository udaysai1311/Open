
import express from 'express';
import { register, login } from '../../controllers/userVerificationController/authController.js';

const registerRoute = express.Router();

registerRoute.post('/register', register);
registerRoute.post('/login', login);

export default registerRoute;
