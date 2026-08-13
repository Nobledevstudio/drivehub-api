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

export const getAllPucharsesForAdmin = (user) => {
  if (user.role === "admin") {
    return purchaseModel.find({})
      .populate("car")
      .populate("user", "name email")
      .sort({ createdAt: -1 });
  }
}


export const getUsers = async (user) => {
  if (user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const users = await userModel.find({
    role: { $in: ["customer", "dealer"] },
  })
    .select("-password -__v").lean();

  const formattedUsers = users.map((user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone ?? "",
    status: user.isApproved ? "active" : "pending",
    joinedDate: user.createdAt,
  }));

  return formattedUsers;
};


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

  return activities.sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);

}

export const getRecentCars = (limit = 5) => {

  const recentCars = carModel.find().sort({ createdAt: -1 }).limit(limit).populate("dealer", "name email");

  return recentCars
}


export const getUserStats = async () => {
  const [totalUsers, customers, dealers, admins] = await Promise.all([
    userModel.countDocuments(),
    userModel.countDocuments({ role: 'customer' }),
    userModel.countDocuments({ role: 'dealer' }),
    userModel.countDocuments({ role: 'admin' }),
  ])


  return {
    totalUsers,
    customers,
    dealers,
    admins
  }
}

export const getCarsStats = async () => {
  //console.log("========== GET VEHICLE STATS SERVICE ==========");

  // Collection
  //console.log("Collection:", carModel.collection.name);

  // Mongoose counts
  const totalCars = await carModel.countDocuments();
  //console.log("Total Cars:", totalCars);

  const activeCars = await carModel.countDocuments({
    approvalStatus: "approved",
    status: { $ne: "sold" },
  });

  // console.log("Active Cars:", activeCars);

  const pendingApproval = await carModel.countDocuments({
    approvalStatus: "pending",
  });
  // console.log("Pending Count:", pendingApproval);

  const soldCars = await carModel.countDocuments({
    status: "sold",
  });

  // console.log("Sold Cars:", soldCars);

  const rejectedCars = await carModel.countDocuments({
    approvalStatus: "rejected",
  });

  //console.log("Rejected Cars:", rejectedCars);

  //console.log("\n========== MONGOOSE FIND ==========");

  const pendingCars = await carModel.find({
    approvalStatus: "pending",
  });

  //console.log("Pending Cars Found:", pendingCars.length);
  //console.log(JSON.stringify(pendingCars, null, 2));

  //console.log("\n========== ALL CARS ==========");

  //const allCars = await carModel.find().lean();

  //console.log(JSON.stringify(allCars, null, 2));

  //console.log("\n========== APPROVAL STATUS DETAILS ==========");

  /*
  allCars.forEach((car) => {
    console.log({
      id: car._id,
      value: car.approvalStatus,
      type: typeof car.approvalStatus,
      length: car.approvalStatus?.length,
      chars: car.approvalStatus
        ? [...car.approvalStatus].map((c) => c.charCodeAt(0))
        : [],
    });
  });

  console.log("\n========== EXISTS QUERY ==========");

  const exists = await carModel.find({
    approvalStatus: { $exists: true },
  });

  console.log("Exists Count:", exists.length);

  console.log("\n========== RAW MONGODB ==========");

  const raw = await carModel.collection.find({}).toArray();

  console.log("Raw Count:", raw.length);
  console.log(JSON.stringify(raw, null, 2));

  const rawPending = await carModel.collection.find({
    approvalStatus: "pending",
  }).toArray();

  console.log("Raw Pending Count:", rawPending.length);
  console.log(JSON.stringify(rawPending, null, 2));

  console.log("\n========== RAW COUNT ==========");

  const rawPendingCount = await carModel.collection.countDocuments({
    approvalStatus: "pending",
  });

  console.log("Raw Pending CountDocuments:", rawPendingCount);
*/

  return {
    totalCars,
    activeCars,
    pendingApproval,
    soldCars,
    rejectedCars,
  };
};

export const FectchAllCars = async (user) => {

  if (!user || user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  //console.log(user)

  const cars = await carModel.find().populate("dealer", "name email").sort({ createdAt: -1 }).select("-__v");

  return cars

}


export const getRentalsStats = async () => {

  const [completed, approved, cancelled, pending] = await Promise.all([
    bookingModel.countDocuments({ status: 'completed' }),
    bookingModel.countDocuments({ status: 'approved' }),
    bookingModel.countDocuments({ status: 'cancelled' }),
    bookingModel.countDocuments({ status: 'pending' })
  ])

  return {
    completed,
    approved,
    cancelled,
    pending
  }

}
export const getPurchasesStats = async () => {

  const [completed, approved, cancelled, pending] = await Promise.all([
    purchaseModel.countDocuments({ status: 'completed' }),
    purchaseModel.countDocuments({ status: 'approved' }),
    purchaseModel.countDocuments({ status: 'cancelled' }),
    purchaseModel.countDocuments({ status: 'pending' })
  ])

  return {
    completed,
    approved,
    cancelled,
    pending
  }

}

export const getBookingsForAdmin = (user) => {

  if (user.role === "admin") {

    return bookingModel.find({})
      .populate("car")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

  }
};


export const getAdminPurchases = async (user) => {


  if (user.role === "admin") {
    const purchases = await purchaseModel
      .find({}).populate("car")
      .populate("user", "name email")
      .populate("dealer", "name email")
      .sort({ createdAt: -1 })


    return purchases
  }


}
