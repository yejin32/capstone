const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const config = require("../config/database");

//1. 사용자 등록
router.post("/register", (req, res, next) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
    });

    User.getUserByUsername(newUser.username, (err, user) => {
        if (err) throw err;
        if (user) {
            return res.json({
                success: false,
                msg: "같은 아이디가 존재합니다. 다른 아이디를 입력하세요.",
            });
        } else {
            User.addUser(newUser, (err, user) => {
                if (err) {
                    res.json({ success: false, msg: "사용자 등록 실패" });
                } else {
                    res.json({ success: true, msg: "사용자 등록 성공" });
                }
            });
        }
    });
});

// 2. 사용자 인증 및 JWT 토큰 발급
router.post("/authenticate", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    User.getUserByUsername(username, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.json({
                success: false,
                msg: "User not found. 등록된 사용자가 없습니다.",
            });
        }
        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                let tokenUser = {
                    _id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                };
                const token = jwt.sign({ data: tokenUser }, config.secret, {
                    expiresIn: 604800, // 1 week = 7*24*60*60
                });
                res.json({
                    success: true,
                    token: token,
                    userNoPW: tokenUser,
                });
            } else {
                return res.json({
                    success: false,
                    msg: "Wrong password. 패스워드가 맞지 않습니다.",
                });
            }
        });
    });
});

// 3. Profile 요청, JWT 이용 필요
router.get(
    "/profile",
    passport.authenticate("jwt", { session: false }),
    (req, res, next) => {
        res.json({
            user: {
                name: req.user.name,
                username: req.user.username,
                email: req.user.email,
            },
        });
    }
);

// 3-1. Profile 요청, JWT 이용 필요
router.get(
    "/product",
    passport.authenticate("jwt", { session: false }),
    (req, res, next) => {
        res.json({
            user: {
                product: "Notebook",
                price: "1,000,000",
            },
        });
    }
);

// 3-2. Profile 요청, JWT 이용 필요
router.get(
    "/balance",
    passport.authenticate("jwt", { session: false }),
    (req, res, next) => {
        res.json({
            user: {
                username: req.user.username,
                balance: "10,000,000",
            },
        });
    }
);

module.exports = router;
