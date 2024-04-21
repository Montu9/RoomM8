const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// @desc Handle user login
// @access Public
// @route POST: /auth/login
const handleLogin = async (req, res) => {
    const { email, passwd } = req.body;

    try {
        const foundUser = await User.findOne({ email }).exec();
        if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

        const matchPasswd = await bcrypt.compare(passwd, foundUser.passwd_hash);
        if (!matchPasswd) return res.status(401).json({ message: "Unauthorized" });

        const accessToken = foundUser.generateAccessToken();
        const refreshToken = foundUser.generateRefreshToken();

        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
        });
        const { passwd_hash, groups, createdAt, updatedAt, ...user } = foundUser._doc;
        return res.status(200).json({ accessToken, user: user });
    } catch (err) {
        return res.sendStatus(500);
    }
};

// @desc Handle user refresh token
// @access Public
// GET: /auth/refresh
const refresh = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized. No refresh token" });

    const refreshToken = cookies.jwt;
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
        if (err) return res.status(403).json({ message: "Forbidden" });
        const foundUser = await User.findOne({ _id: decoded._id }).exec();

        if (!foundUser) return res.status(401).json({ message: "Unauthorized" });
        const accessToken = foundUser.generateAccessToken();
        res.json({ accessToken });
    });
};

// @desc Handle user logout
// @access Public
// GET: /auth/logout
const logout = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    res.json({ message: "Cookie cleared" });
};

module.exports = {
    handleLogin,
    refresh,
    logout,
};
