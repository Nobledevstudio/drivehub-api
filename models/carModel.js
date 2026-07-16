import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
    title: {type: String, required: true,trim: true},
    brand: { type: String,required: true,trim: true},
    model: {type: String,required: true,trim: true},
    year: {type: Number,required: true},
    description: {type: String,default: ""},
    images: { type: [String],required: true,default: []},
    type: { type: String, required: true,trim: true},
    color: { type: String,required: true},
    location: {type: String, required: true},
    fuel: {
      type: String,
      enum: ["petrol", "diesel", "electric", "hybrid"],
      required: true,
    },
    transmission: {
      type: String,
      enum: ["automatic", "manual"],
      required: true,
    },
    seats: {type: Number, required: true},
    airConditioning: {   type: Boolean, default: true},
    rating: { type: Number,default: 0, min: 0, max: 5 },
    isHotDeal: { type: Boolean,default: false},
    pricing: {
       rent: {
        type: Number,
      },
      buy: {
        type: Number,
      },
    },
    listingType: {
      type: String,
      enum: ["buy", "rent", "both"],
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "reserved", "rented", "sold"],
      default: "available",
    },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    dealer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.car || mongoose.model("car", carSchema);