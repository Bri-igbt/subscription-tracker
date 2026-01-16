import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'User Name is required' ] ,
        trim: true,
        minlength: [2, 'User Name must be at least 3 characters'],
        maxlength: [50, 'User Name must be less than 50 characters']
    },
    email: { 
        type: String, 
        required: [true, 'User Email is required' ],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    password: { 
        type: String, 
        required: [true, 'User Password is required' ],
        minlength: [6, 'Password must be at least 6 characters'],
        maxlength: [128, 'Password must be less than 128 characters']
    },

}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;