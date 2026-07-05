import express from 'express'
import { protect } from '../middleware/protect.js'
import { authorizeRoles } from '../middleware/authorizeRole.js'
import { approveDealerController, deleteUserContoller, fetchAdminDashboardStatsController, getAllBookingsForAdminController, getUsersController } from '../controllers/adminController.js'

const adminRouter = express.Router()

adminRouter.get('/users', protect , authorizeRoles('admin'), getUsersController )
adminRouter.get('/bookings', protect , authorizeRoles('admin'),getAllBookingsForAdminController)
adminRouter.delete('/users/:id', protect, authorizeRoles('admin'), deleteUserContoller)
adminRouter.patch('/users/approve-dealer/:id',protect, authorizeRoles('admin'), approveDealerController)
adminRouter.get("/stats", protect, authorizeRoles('admin'), fetchAdminDashboardStatsController);

export default adminRouter