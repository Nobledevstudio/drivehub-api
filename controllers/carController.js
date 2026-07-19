import { createCar, deleteCar, updateCar, ViewAllCar, viewCarById } from "../services/carServices.js"
import uploadToCloudinary from "../utils/uploadToClodinary.js";


export const createCarController = async (req, res) => {
    try {
        const images = await uploadToCloudinary(req.files);

        const car = await createCar({
            carData: req.body,
            user: req.user,
            images,
        });

        res.status(201).json({
            success: true,
            data: car,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const viewAllCarController = async (req, res) => {

    try {

        const cars = await ViewAllCar({ user: req.user })
        res.status(200).json({ success: true, data: cars })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }

}

export const viewCarByIdController = async (req, res) => {
    try {
        // console.log("Controller called");
        const carId = req.params.id;
        // console.log("Car ID:", carId);

        const car = await viewCarById({ carId });
        // console.log("Car found:", car);

        res.status(200).json({ success: true, data: car });
    } catch (error) {
        // console.log("Error caught:", error);
        res.status(404).json({ success: false, message: error.message });
    }
}

export const updateCarController = async (req, res) => {

    try {
        const carId = req.params.id;
        const updateData = req.body;
        const updatedCar = await updateCar({ carId, updateData, user: req.user });
        res.status(200).json({ success: true, data: updatedCar });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }

}

export const deleteController = async (req, res) => {

    try {

        const carId = req.params.id;
        await deleteCar({ carId, user: req.user })
        res.status(200).json({ success: true, message: "Car Successfully Deleted" });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }

}


