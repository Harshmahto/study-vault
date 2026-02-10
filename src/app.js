import express from "express";
import cors from 'cors'
import cookieParser from "cookie-parser";


const app = express();
app.use(express.json());
app.use(cors())
app.use(cookieParser())


app.get('/docs', (req, res) => {
  res.redirect('https://documenter.getpostman.com/view/36793388/2sBXcAHhU5');
});

app.get('/test', (req, res) => {
    res.send("If you see this, the server is working!");
});

app.get('/',(req,res)=>{
    // console.log("Request received!");
    res.json({ message: "you can go /docs for all the endpoints" });
})


//import routers
import UserRouter from '../src/routes/user.routes.js'
import adminRouter from '../src/routes/admin.routes.js'

app.use('/api/v1/user',UserRouter)
app.use('/api/v1/admin',adminRouter)

export { app } 

