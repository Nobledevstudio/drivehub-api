import carModel from "../models/carModel.js";
import purchaseModel from "../models/purchaseModel.js";


export const createPurchase = async({carId,userId})=>{
 
     const car  = await carModel.findById(carId);
     
     if (!car) throw new Error("Car Not Found")

    if (car.status === 'sold' || car.status === 'rented') {
        throw new Error('Car not Available for Purchase')
    }

    const existingPurchase = await purchaseModel.findOne({
        car: carId,
        status: { $in: ["pending", "approved"] }
    });

    if (existingPurchase) {
        throw new Error("Car is currently reserved for purchase");
    }

    const carPurchase = await purchaseModel.create({
        user: userId,
        car: carId,
        dealer: car.dealer,
        status: "pending",
        paymentStatus: "pending"
    })

    return carPurchase
    
}

export const userPurchase=async(userId)=>{


    const purchases = await purchaseModel.find({user: userId}).populate("car").populate("dealer", "name email")

    return purchases

}


export const cancelPurchase = async (purchaseId, userId) => {
     
     // Find the purchase by ID and populate the car details
    const purchase = await purchaseModel.findById(purchaseId).populate("car");

    if (!purchase) throw new Error("Purchase not found");

    // Only pending purchases can be cancelled
    if (purchase.status !== "pending") {
        throw new Error("Only pending purchases can be cancelled");
    }

    // Optional: Only the user who created it can cancel
    if (purchase.user.toString() !== userId.toString()) {
        throw new Error("Not authorized to cancel this purchase");
    }

    // Update the purchase status to cancelled
    purchase.status = "cancelled";
    
    await purchase.save();

    // Make the car available again
    purchase.car.status = "available";

    await purchase.car.save();

    return purchase;
}



export const viewPurchases = (user) => {
    
  // Otherwise, if dealer, return only their purchases
  return purchaseModel.find({ dealer: user._id })
    .populate("car")
    .populate("user", "name email");
};

