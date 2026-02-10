import express from "express";
import cors from 'cors'
import cookieParser from "cookie-parser";

//swagger docs
import swaggerUi from 'swagger-ui-express';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const swaggerFile = require('../swagger-output.json');




const app = express();
app.use(express.json());
app.use(cors())
app.use(cookieParser())


app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.get('/test', (req, res) => {
    res.send("If you see this, the server is working!");
});

app.get('/',(req,res)=>{
    console.log("Request received!");
    res.json({ message: "Here is your data" });
})


//import routers
import UserRouter from '../src/routes/user.routes.js'
import adminRouter from '../src/routes/admin.routes.js'

app.use('/api/v1/user',UserRouter)
app.use('/api/v1/admin',adminRouter)

export { app } 

