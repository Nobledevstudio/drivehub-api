import carModel from "../models/carModel.js";
import bookingModel from "../models/bookingModel.js";
import userModel from "../models/userModel.js";
import purchaseModel from "../models/purchaseModel.js";

export const getAllBookingsForAdmin = (user) => {

  if (user.role === "admin") {
    return bookingModel.find({})
      .populate("car")
      .populate("user", "name email")
      .sort({ createdAt: -1 });
  }

}

export const getUsers = async (user) => {

  if (user.role !== "admin") {
    throw new Error("Not anuthorized")
  }

  const users = await userModel.find({ role: { $in: ['customer', "dealer"] } });

  return users

}
export const deleteUser = async (id) => {

  const user = await userModel.findByIdAndDelete(id)

  if (user.role === "admin") {
    throw new Error("Admin account cannot be deleted")
  }

  if (!user) {
    throw new Error("User not found")
  }

  return user
}

export const approveDealer = async (dealerId, user) => {

  if (!user) {
    throw new Error("User not authenticated")
  }

  if (user.role !== 'admin') {
    throw new Error("Not authorized")
  }

  const dealer = await userModel.findById(dealerId)

  if (!dealer) {
    throw new Error("Dealer not found")
  }

  if (dealer.role !== 'dealer') {
    throw new Error("This user is not a dealer")
  }

  if (dealer.isApproved === true) {
    throw new Error("Dealer already approved")
  }

  dealer.isApproved = true

  await dealer.save()

  return dealer
}

export const getAdminDashboardStats = async () => {

  const [cars, users, bookings, purchases] = await Promise.all([
    carModel.countDocuments(),
    userModel.countDocuments({ role: { $in: ['customer', 'dealer'] } }),
    bookingModel.countDocuments(),
    purchaseModel.countDocuments()
  ])

  return {
    cars,
    users,
    bookings,
    purchases,
  };
}

export const getCarsStatus = async () => {
  const [available, reserved, rented, sold] = await Promise.all([
    carModel.countDocuments({ status: "available" }),
    carModel.countDocuments({ status: "reserved" }),
    carModel.countDocuments({ status: "rented" }),
    carModel.countDocuments({ status: "sold" }),
  ]);

  return {
    available,
    reserved,
    rented,
    sold
  };

}

export const getRecentActivities = async () => {
  const [bookings, purchases, users] = await Promise.all([
    bookingModel.find().sort({ createdAt: -1 }).limit(5),
    purchaseModel.find().sort({ createdAt: -1 }).limit(5),
    userModel.find().sort({ createdAt: -1 }).limit(5),
  ]);


  const activities = [
    ...bookings.map((booking) => ({
      type: "booking",
      message: `New booking created`,
      createdAt: booking.createdAt,
    })),
    ...purchases.map((purchase) => ({
      type: "purchase",
      message: `Vehicle purchased`,
      createdAt: purchase.createdAt,
    })),

    ...users.map((user) => ({
      type: "user",
      message: `${user.name} joined DriveHub`,
      createdAt: user.createdAt,
    })),
  ]

  return activities.sort((a,b)=> b.createdAt - a.createdAt).slice(0, 5);

}

export const getRecentCars = (limit = 5) => {
   
  const recentCars = carModel.find().sort({ createdAt: -1 }).limit(limit).populate("dealer", "name email");

  return recentCars
}


export const getUserStats = async () => {
   const [totalUsers, customers, dealers, admins ] = await Promise.all([
     userModel.countDocuments(),
     userModel.countDocuments({role: 'customer'}),
     userModel.countDocuments({role: 'dealer'}),
     userModel.countDocuments({role: 'admin'}),
   ])    


   return{
     totalUsers,
     customers,
     dealers,
     admins
   }
}