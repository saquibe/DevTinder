import mongoose from "mongoose";

const connectDb = async () => {
  await mongoose.connect('mongodb+srv://saquibe143:OvxWXOiZvC9y0m9F@namastenodejs.cldid.mongodb.net/devTinder')
}

export default connectDb;