import { cancelBooking, createBooking, getBookingsForDealer, getUserBooking} from "../services/bookingServices.js"

export const createBookingController=async(req,res)=>{
   
       try {

        // Extract booking details from request body
        const {carId,startDate, endDate} = req.body

        // Create the booking using the service function
        const  booking =  await createBooking({
            userId: req.user._id,
            carId,
            startDate,
            endDate
        })

        res.status(201).json({success: true, booking})
        
       } catch (error) {
              res.status(400).json({success: false , message: error.message})
       }

} 


export const getUserBookingController=async(req,res)=>{

    try {
        const booking = await getUserBooking(req.user._id)
        
        res.status(200).json({success: true, booking})

    } catch (error) {
           res.status(400).json({success: false , message: error.message})
    }
    
} 


export const cancelBookingController=async(req,res)=>{

      try {
        
          const booking =  await cancelBooking(req.params.id, req.user._id)
               res.status(200).json({success: true, message: "Booking successfully cancelled", booking});

      } catch (error) {
             res.status(400).json({success: false , message: error.message})
      }
    
} 

export const getBookingsForDealerController = async (req, res) => {
    try {
           
        const bookings = await getBookingsForDealer(req.user);
        res.json({ success: true, bookings });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}
