import express from 'express'
import { protect } from '../middleware/protect.js'
import { authorizeRoles } from '../middleware/authorizeRole.js'
import { approveDealerController, deleteUserContoller, fetchCarStatusController, fetchAdminDashboardStatsController, getAllBookingsForAdminController, getUsersController, fetchRecentActivitiesController, getRecentCarsController, getUserStatsController, getCarsStatsController, FetchAllCarsControllers, getRentalsStatsController, getPurchasesForAdminController, getPurchaesStatsController, getBookingsForAdminController } from '../controllers/adminController.js'
import { getRentalsStats } from '../services/adminServices.js'

const adminRouter = express.Router()

adminRouter.get('/users', protect , authorizeRoles('admin'), getUsersController )
adminRouter.get('/bookings', protect , authorizeRoles('admin'),getAllBookingsForAdminController)
adminRouter.get('/purchases', protect , authorizeRoles('admin'), getPurchasesForAdminController)
adminRouter.delete('/users/:id', protect, authorizeRoles('admin'), deleteUserContoller)
adminRouter.patch('/users/approve-dealer/:id',protect, authorizeRoles('admin'), approveDealerController)
adminRouter.get("/stats", protect, authorizeRoles('admin'), fetchAdminDashboardStatsController);
adminRouter.get("/car-status", protect, authorizeRoles('admin'), fetchCarStatusController);
adminRouter.get("/recent", protect, authorizeRoles('admin'), fetchRecentActivitiesController);
adminRouter.get("/recent-cars", protect, authorizeRoles('admin'),getRecentCarsController);
adminRouter.get("/users/stats", protect, authorizeRoles('admin'),getUserStatsController);
adminRouter.get("/cars/stats", protect, authorizeRoles('admin'),getCarsStatsController);
adminRouter.get("/cars", protect, authorizeRoles('admin'), FetchAllCarsControllers);
adminRouter.get("/bookings/stats", protect, authorizeRoles('admin'), getRentalsStatsController);
adminRouter.get("/bookings", protect, authorizeRoles('admin'), getBookingsForAdminController);
adminRouter.get("/purchases/stats", protect, authorizeRoles('admin'), getPurchaesStatsController);
adminRouter.get("/purchases", protect, authorizeRoles('admin'), getPurchasesForAdminController);

export default adminRouter