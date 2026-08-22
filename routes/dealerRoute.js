import express from 'express'
import { protect } from '../middleware/protect.js'
import { authorizeRoles } from '../middleware/authorizeRole.js'
import { getDealerStatsController } from '../controllers/dealerController.js'

const dealerRouter = express.Router()


dealerRouter.get('/stats', protect, authorizeRoles('dealer'), getDealerStatsController)

export default dealerRouter