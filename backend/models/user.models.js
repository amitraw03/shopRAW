import mongoose,{ Schema } from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required:[true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true , 'Password is required'],
        minlength:[6, 'Minimum password length is 6 characters'],
    },
    cartItems:[
        {
            quantity:{
                type: Number,
                default: 1
            },
            product: {
                type: Schema.Types.ObjectId,
                ref: "Product", 
            }
        }
    ],
    role:{
        type:String,
        enum:['customer','admin'],
        default: 'customer',
    }
}
,{ timestamps: true });

// hash password just before save in D.B using pre middleware hook
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    // console.log(this)
    this.password = await bcrypt.hash(this.password, 10)  //password is hashed 
    next();
})

//checking password property we created
userSchema.methods.isPasswordCorrect = async function (password) { //password is input password
    // console.log(this.password) //stored password should be hashed
    // console.log(password)
    return await bcrypt.compare(password, this.password)
}


export const User = mongoose.model("User", userSchema);
