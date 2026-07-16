import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true},
    email: {type: String,required: true,unique: true,lowercase: true,trim: true},
    password: {type: String,required: true,select: false},
    phone: {type: String,default: "",trim: true},
    role: {type: String, enum: ["customer", "dealer", "admin"], default: "customer"},
    status: { type: String, enum: ["pending", "active", "banned", "inactive"], default: "pending"},
    isApproved: {  type: Boolean,default: false },
    profileImage: {type: String, default: ""}},{
    timestamps: true,
  }
);

const userModel = mongoose.models.user || mongoose.model("user", UserSchema);

export default userModel;