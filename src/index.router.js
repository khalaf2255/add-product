import connectDB from "../DB/connection.js"
import userRouter from "./modules/user/user.router.js"
import authRouter from "./modules/auth/auth.router.js"
import productsRouter from "./modules/products/products.router.js"
import { globalError } from "./uitls/errorHandling.js"
import cors from 'cors'


const bootstrap = (app, express) => {
    app.use(express.json())
    app.use(cors())

    app.use("/auth", authRouter)
    app.use("/users", userRouter)
    app.use("/products", productsRouter)
    app.use("*", (req, res, next) => {
        return res.send({ message: "In-valid Routing" });
    })

    app.use(globalError)
    connectDB()

}
 
export default bootstrap;