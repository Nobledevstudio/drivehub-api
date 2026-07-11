import { approveDealer, deleteUser, getAllBookingsForAdmin, getCarsStatus, getRecentActivities, getUsers, getUserStats } from "../services/adminServices.js";
import { getAdminDashboardStats } from "../services/adminServices.js";
import { getRecentCars } from "../services/adminServices.js";

export const getAllBookingsForAdminController = async (req, res) => {

  try {

    const bookings = await getAllBookingsForAdmin(req.user);
    res.status(200).json({ success: true, data: bookings })

  } catch (error) {
    console.error(error)
    res.status(400).json({ success: false, message: error.message })
  }
}


export const getUsersController = async (req, res) => {
  try {
    const users = await getUsers(req.user)
    res.status(200).json({ success: true, data: users })

  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

export const deleteUserContoller = async (req, res) => {
  try {

    const { id } = req.params

    await deleteUser(id)

    res.status(200).json({
      success: true,
      message: "User Deleted Successfully"
    })

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
}


export const approveDealerController = async (req, res) => {

  try {

    const dealerId = req.params.id

    await approveDealer(dealerId, req.user)

    res.status(200).json({ success: true, message: "Dealer Sucessfully Approved" })

  } catch (error) {

    res.status(400).json({ success: false, message: error.message })
  }

}

export const fetchAdminDashboardStatsController = async (req, res) => {
  try {
    const stats = await getAdminDashboardStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics.",
    });
  }
};

export const fetchCarStatusController = async (req, res) => {
  try {
    const vehicleStatus = await getCarsStatus();

    res.status(200).json({
      success: true,
      data: vehicleStatus,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicle status.",
    });
  }
};

export const fetchRecentActivitiesController = async (req, res) => {
  try {
    const activities = await getRecentActivities();

    res.status(200).json({
      success: true,
      data: activities,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch recent activities.",
    });
  }
};

export const getRecentCarsController = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 5;

    const cars = await getRecentCars(limit);

    res.status(200).json({
      success: true,
      message: "Recent cars fetched successfully.",
      cars,
    });
  } catch (error) {
    console.error("Get Recent Cars Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch recent cars.",
    });
  }
};


export const getUserStatsController = async (req, res) => {

  try {
    const stats = await getUserStats();

    res.status(200).json({
      success: true,
      message: "User statistics fetched successfully",
      data: stats,
    });
  } catch (error) {
    console.error("Get User Stats Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch Userstats",
    });
  }
};     
