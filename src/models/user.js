import mongoose from "mongoose";
import validator from 'validator';
const {Schema} = mongoose;
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new Schema({
    firstName:{
        type: String,
        required: true,
        maxLength: 50,
        minLength: 3,
        index: true
    },
    lastName:{
        type: String,
        maxLength: 50,
        minLength: 2
    },
    emailId:{
        type: String,
        required: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid email address: '+ value    )
            }
        }
    },
    password:{
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error('Enter strong password: '+ value    )
            }
        }
    },
    age:{
        type: Number
    },
    gender:{
        type: String,
        required: true,
        enum:{
            values: ['male', 'female', 'other'],
            message: `{VALUE} is not a gender type`
        }
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

userSchema.index({firstName: 1, lastName: 1});

userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const hashPassword = user.password;
    const isPasswordValid = await bcryptjs.compare(passwordInputByUser, hashPassword);

    return isPasswordValid;
}

const User = mongoose.model("User", userSchema);

export default User;