import mongoose from 'mongoose';


export interface IUser extends mongoose.Document{
    name:string;
    email:string;
    password:string;

}

const userSchema=new mongoose.Schema<IUser>({
    name:{
        type:String,
        required:[true,'Please enter your name'],
        trim:true,
        maxlength:[30,'Name cannot be more than 30 characters'],
    },
    email:{
        type:String,
        required:[true,'Plase enter your email'],
        unique:true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password:{
        type:String,
        required:[true,'Please enter your password'],
        minlength:[6,'Password must be at least 6 characters long'],
    }
},{timestamps:true});

const User=mongoose.models.User || mongoose.model<IUser>('User',userSchema);

export default User;
    