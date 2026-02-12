
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { checkConnection } from './config/config.js';
import createAllTables from './utils/dbUtils.js';
// User Routes
const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());

import registerRoute from './routes/userVerificationRoute/authRoute.js';
import customerRoute from './routes/customerMasterRoutes/customerRoute.js';
import materialRoute from './routes/materialMasterRoutes/materialRoute.js';
import machineryRoute from './routes/machineryMasterRoutes/machineryRoute.js';
import quotationRoute from './routes/quotationMasterRoutes/quotationRoute.js';

app.use("/api/auth", registerRoute);
app.use("/customer_registration", customerRoute);
app.use("/materials", materialRoute);
app.use("/machinery-master", machineryRoute);
app.use("/quotations", quotationRoute);

// App Server
app.listen(process.env.PORT || 8081, async () => {
    console.log(`Server Started Successfully on port ${process.env.PORT || 8081}!`);
    try {
        await checkConnection();
        await createAllTables();
    } catch (error) {
        console.log("Failed to connect!", error);
    }
});
