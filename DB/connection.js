import mongoose from "mongoose"

// mongodb://localhost:27017
 
const connectDB = async () => {
    return await mongoose.connect(process.env.DB_URL).then(result => {
        console.log("Connected DB");  
    }).catch(error => {
        console.log('Faild connectedDB', error);
    })
}
export default connectDB