import userModel from "../../../../DB/model/auth.model.js"
import { asyncHendler } from "../../../uitls/errorHandling.js"
import bcrypt from "bcrypt";
import sendEmail from "../../../uitls/email.js";
import jwt from "jsonwebtoken";

export const getUsers = asyncHendler(async (req, res, next) => {
    const users = await userModel.find({})
    return res.send({ message: "Done", users })

})
// SIGNUP -------------------------------------------------------->
export const signup = asyncHendler(async (req, res, next) => {
    const { firstname, lastname, username, email, password, cPassword } = req.body

    if (password != cPassword) return next(new Error("passwords aren't matched"))

    const checkUSer = await userModel.findOne({ email })
    if (checkUSer) return next(new Error("This email is already exist"))

    const hashPAssword = bcrypt.hashSync(password, 8)
    const user = await userModel.create({ firstname, lastname, username, email, password: hashPAssword, cPassword })

    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.EMAIL_SIGNTURE
    )
    const reConfirmToken = jwt.sign(
        { id: user._id, email: user.email },
        process.env.EMAIL_SIGNTURE
    )
    const html = `
    <a href="${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}">Confirm Email</a> 
    <br> <br>
    <a href="${req.protocol}://${req.headers.host}/auth/reConfirmEmail/${reConfirmToken}"> Re-Confirm Email</a> `
    await sendEmail({ to: user.email, subject: "Confirmation", html })
    return res.send({ message: "Done", user })
})

// CONFIRM EMAIL -------------------------------------------------------->
export const confirmEmail = asyncHendler(async (req, res, next) => {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.EMAIL_SIGNTURE)
    const user = await userModel.findByIdAndUpdate(decoded.id, { confirmEmail: true }, { new: true })
    return user ?
        res.redirect("http://127.0.0.1:5500/login.html") :
        res.send(`<a href="http://127.0.0.1:5500/signup.html">Opps you need signup again</a>`)
})

// RE-CONFIRM EMAIL -------------------------------------------------------->
export const reConfirmEmail = asyncHendler(async (req, res, next) => {
    const { token } = req.params
    const decoded = jwt.verify(token, process.env.EMAIL_SIGNTURE)

    const user = await userModel.findById(decoded.id)
    if (!user) return res.send(`<a href="http://127.0.0.1:5500/signup.html">plz register again</a>`)

    if (user.confirmEmail) return res.redirect("http://127.0.0.1:5500/login.html")

    const newToken = jwt.sign(
        { id: user._id, email: user.email },
        process.env.EMAIL_SIGNTURE
    )
    const html = `
    <a href="${req.protocol}://${req.headers.host}/auth/confirmEmail/${newToken}"> Re-Confirm Email</a> `
    await sendEmail({ to: user.email, subject: "Confirmation", html })
    return res.send(`<h2>Check your inbox now</h2>`)
})

// LOGIN USER -------------------------------------------------------->
export const login = asyncHendler(async (req, res, next) => {
    const { email, password } = req.body

    const user = await userModel.findOne({ email })
    if (!user) return next(new Error("This email dosen't exist"))

    const match = bcrypt.compareSync(password, user.password)
    if (!match) return next(new Error("password or email is in-correct"))

    if (!user.confirmEmail) return next(new Error("You should to confirm this email first"))

    const token = process.env.TOKEN_BEARER + jwt.sign(
        { id: user._id, email: user.email },
        process.env.TOKEN_SIGNTURE,
        { expiresIn: "1d" }
    )
    return res.send({ message: "Done", token, user })
})

// UPDATE USER -------------------------------------------------------->
export const updateUser = asyncHendler(async (req, res, next) => {
    const { id } = req.params
    const { email, username } = req.body
    const checkUser = await userModel.find({ email })
    if (checkUser.length > 0) return next(new Error("This email is already exist"))
    const user = await userModel.findOneAndUpdate({ _id: id }, { email, username }, { new: true })
    const html = `<p>Your data is updated: <ul>
        <li>New username is: ${user.username}</li>
        <li>New email is: ${user.email}</li>
    </ul></p>`
    await sendEmail({ to: user.email, subject: "Edit information", html })
    return res.send({ message: "Done", user })
})

// DELETE USER -------------------------------------------------------->
export const deleteUser = asyncHendler(async (req, res, next) => {
    const { id } = req.params
    const userEmail = await userModel.findOne({ _id: id })
    console.log(userEmail.email);
    const html = `<p>Your  account is deleted</p>`
    await sendEmail({ to: userEmail.email, subject: "Delete account", html })

    const user = await userModel.deleteOne({ _id: id })

    return user.deletedCount ? res.send({ message: "Done", user }) : res.send({ message: "Done", user })

})