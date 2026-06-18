import { loginUser, registerUser } from "../services/authServices.js"


export const registerController = async (req, res) => {

      try {
         const data = req.body
            const { user, token } = await loginUser(data)
            return res.status(201).json({
                  success: true,
                  user,
                  token,
            });
      } catch (error) {
            res.status(400).json({ success: false, message: error.message })
      }
}

export const loginController = async (req, res) => {
      try {
            const data = req.body
            const { user, token } = await loginUser(data)
            return res.status(200).json({
                  success: true,
                  user,
                  token,
            });
      } catch (error) {
            res.status(400).json({ success: false, message: error.message })
      }
} 
