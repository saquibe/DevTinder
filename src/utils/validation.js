import validator from 'validator';

export const validateSignUpData = (req) => {
    const {firstName, lastName, emailId, password} = req.body;
    if (!firstName || !lastName) {
        throw new Error('Enter valid name')
    }else if(!validator.isEmail(emailId)){
        throw new Error('Enter valid email')
    }else if (!validator.isStrongPassword(password)) {
        throw new Error('Enter strong password')
    }
}

export const validateEditProfileData = (req) => {
    const allowedEditFields = ['firstName', 'lastName', 'gender', 'description', 'avatar', 'skills', 'age'];
    const isEditAllowed  = Object.keys(req.body).every((field) => allowedEditFields.includes(field));

    return isEditAllowed;
}