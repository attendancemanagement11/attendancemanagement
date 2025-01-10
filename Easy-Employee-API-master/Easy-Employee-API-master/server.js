require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 5500;
const cors = require('cors');
const bodyParser = require("body-parser");
const dbConnection = require('./configs/db-config');
const authRoute = require('./routes/auth-route');
const adminRoute = require('./routes/admin-route');
const employeeRoute = require('./routes/employee-route');
const leaderRoute = require('./routes/leader-route');
const errorMiddleware = require('./middlewares/error-middleware');
const ErrorHandler = require('./utils/error-handler');
const {auth, authRole} = require('./middlewares/auth-middleware');
const app = express();

// Database Connection
dbConnection();

const {CLIENT_URL} = process.env;
console.log(CLIENT_URL);

//Cors Option
const corsOption = {
    credentials: true,
    origin: [
        'https://employee.expsolutions.net',
        'http://localhost:3001',
        'http://192.168.29.11:3001'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie']
};
app.use(cors(corsOption));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

//Configuration

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Routes
app.use('/api/auth',authRoute);
app.use('/api/admin',auth,authRole(['admin']),adminRoute);
app.use('/api/employee',auth,authRole(['employee','leader']),employeeRoute);
app.use('/api/leader',auth,authRole(['leader']),leaderRoute);


app.use('/storage',express.static('storage'))
app.get('/',(req,res)=>
{
    res.send('Hello World');
})
//Middlewares;
app.use((req,res,next)=>
{
    return next(ErrorHandler.notFound('The Requested Resources Not Found'));
});

app.use(errorMiddleware)





app.listen(PORT,()=>console.log(`Listening On Port : ${PORT}`));