import { getDealerDashboardStats } from "../services/dealerServices.js"

export const getDealerStatsController = async (req, res) => {
    try {
        console.log("AUTH USER:", req.user);

        const userId = req.user.id;

        console.log("DEALER ID:", userId);

        const stats = await getDealerDashboardStats(userId);

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