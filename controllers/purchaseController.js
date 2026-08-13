import { cancelPurchase, createPurchase, userPurchase, viewPurchases } from "../services/purchaseServices.js"

export const createPurchaseController=async(req,res)=>{

     try {

        const { carId } = req.body
        const purchase = await createPurchase({
            carId,
            userId: req.user._id
        })
         res.status(201).json({success: true, purchase})
        
     } catch (error) {
          res.status(400).json({success: false , message: error.message})
     }

}

export const userPurchaseController = async(req,res)=>{
   try {
      
        const purchase = await userPurchase(req.user._id)
        res.status(201).json({success: true, purchase})
      
   } catch (error) {
            res.status(400).json({success: false , message: error.message})
   }
}
export const cancelPurchaseController=async(req,res)=>{
        
        try {

            const purchase = await cancelPurchase(req.params.id, req.user._id)
            res.status(201).json({success: true, message: "Purchase successfully cancelled", purchase})
          
        } catch (error) {
             res.status(400).json({success: false , message: error.message})
        }

}

export const ViewPurchasesController = async (req, res) => {
    try {
        const purchases = await viewPurcshases(req.user);
        res.json({ success: true, purchases });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}