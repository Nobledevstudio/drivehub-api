import bookingModel from "../models/bookingModel.js";
import carModel from "../models/carModel.js";
import purchaseModel from "../models/purchaseModel.js";
import userModel from "../models/userModel.js";
export const getDealerDashboardStats = async (userId) => {

    
    const dealerCars = await carModel.find({ dealer: userId }).select("_id");

    const carIds = dealerCars.map((car) => car._id);

    const [cars, bookings, purchases, bookingCustomers, purchaseCustomers] = await Promise.all([
            carModel.countDocuments({ dealer: userId }),

            bookingModel.countDocuments({
                car: { $in: carIds },
            }),

            purchaseModel.countDocuments({
                car: { $in: carIds },
            }),

            bookingModel.distinct("customer", {
                car: { $in: carIds },
            }),

            purchaseModel.distinct("customer", {
                car: { $in: carIds },
            }),
        ]);

    const customerIds = [ ...new Set([
            ...bookingCustomers.map((id) => id.toString()),
            ...purchaseCustomers.map((id) => id.toString()),
        ]),
    ];

    const customers = await userModel.countDocuments({
        _id: { $in: customerIds },
        role: "customer",
    });

    return {
        cars,
        customers,
        bookings,
        purchases,
    };
};