import mongoose from "mongoose";
const {Schema} = mongoose;

const userSchema = new Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String
    },
    emailId:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    age:{
        type: Number
    },
    gender:{
        type: String,
        required: true
    },
    avatar:{
        type: String, 
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDXHyqEEcIEQzggUF5RIBe8g37M9n1guqKhg&s"
    },
    description: {
        type: String,
        default: 'This is default description'
    },
    skills: {
        type: [String]  
    }
}, {timestamps: true})

const User = mongoose.model("User", userSchema);

export default User;