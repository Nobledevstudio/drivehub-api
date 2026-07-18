import carModel from "../models/carModel.js"
import uploadToCloudinary from "../utils/uploadToClodinary.js";


export const createCar = async ({ carData, user, images }) => {

    if (!user || user.role !== "dealer") {
        throw new Error("Only dealers can create cars.");
    }

    const newCar = await carModel.create({
        ...carData,
        dealer: user._id,
        images
    });

    console.log(newCar);

    return newCar

}

export const ViewAllCar = async ({ }) => {

    const cars = await carModel.find({})

    return cars

}
export const viewCarById = async ({ carId }) => {

    const car = await carModel.findById(carId)

    if (!car) {
        throw new Error("Car Not Found")
    }

    return car

}

export const updateCar = async ({ carId, updateData, user }) => {

    if (!user || user.role !== "dealer") {
        throw new Error("Only dealers can update Cars");
    }


    const car = await carModel.findById(carId);

    if (!car) {
        throw new Error("Car not found");
    }

    const isDealer = car.dealer.toString() === user._id.toString();

    console.log("Dealer check:", car.dealer.toString(), user._id.toString(), "=>", isDealer);

    if (!isDealer) {
        throw new Error("You are not authorized to update this car");
    }

    const updatedCar = await carModel.findByIdAndUpdate(carId, updateData, { new: true });

    return updatedCar;
}


export const deleteCar = async ({ carId, user }) => {

    if (!user || (user.role !== "dealer" && user.role !== "admin")) {
        throw new Error("Only dealers and admins can delete cars");
    }

    const car = await carModel.findById(carId);

    if (!car) {

        throw new Error("Car Not Found")
    }

    const isDealer = car.dealer.toString() === user._id.toString();


    if (!isDealer && user.role !== "admin") {

        throw new Error("You are not authorized to delete this car");
    }

    const deleteCar = await carModel.findByIdAndDelete(carId)

    return deleteCar

}