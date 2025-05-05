import mongoose from "mongoose"

const connectDB = async () => {
  try {
     mongoose.connection.on('connected', ()=> console.log('MongoDB connected'));
     await mongoose.connect(`${process.env.MONGODB_URI}/purecure`)
  } catch (error) {
    console.error(error.message);
  }
}



export default connectDB;