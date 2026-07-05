import mongoose, { model } from 'mongoose';

const carSchema = new mongoose.Schema({
      title: { type: String,  required: true, trim: true},
      model: {type: String, required: true},
      brand: {type: String, required: true},
      year: {type: Number, required: true},
      price: {type: Number, required: true},
      description: {type: String},
      images: {type: String}, 
      listingType: {type: String, enum: ['buy','rent', "both"] , default: 'both'},
      status: {type: String, enum: ["available", "reserved","rented", "sold"], default: "available"},
      dealer: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true}
}, {timestamps: true})


const carModel = mongoose.models.car || mongoose.model('car', carSchema);

export default carModel