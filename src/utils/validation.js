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