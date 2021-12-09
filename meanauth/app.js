const express = require("express");
const path = require("path");
const cors = require("cors");
const passport = require("passport");
const mongoose = require("mongoose");
const users = require("./routes/users");
const config = require("./config/database");
const exp = require("constants");

// Connect to Database
mongoose.connect(config.database);

// on Connection
mongoose.connection.on("connected", () => {
    console.log("Connected to Database " + config.database);
});

// on Error
mongoose.connection.on("error", (err) => {
    console.log("Database error: " + err);
});

const app = express();

// port number
const port = process.env.PORT || 3000;

// // 미들웨어
// // 클라이언트의 요청시간을 콘솔에 표시하도록 하는 미들웨어
// app.use(function (req, res, next) {
//     console.log("Time:", Date.now());
//     next();
// });

// CORS 미들웨어
app.use(cors());
// JSON 활용을 위한 미들웨어
app.use(express.json());
// URL 인코딩된 데이터의 활용을 위한 미들웨어
app.use(express.urlencoded({ extended: true }));
// Set Static Folder 를 사용하도록 설정하는 미들웨어
app.use(express.static(path.join(__dirname, "public")));
// Passport 미들웨어
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport.js")(passport);
// 라우팅 설정 (맨 뒤에 넣을 것)
app.use("/users", users);

// Set Static Folder
app.use(express.static(path.join(__dirname, "public")));

// app.get('/', (req, res) => {
//     res.send('<h1>서비스 준비중입니다...</h1>');
// });

// start server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
