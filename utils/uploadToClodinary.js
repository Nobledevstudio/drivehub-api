import { v2 as cloudinary } from "cloudinary";

const uploadToCloudinary = async (files = []) => {
  const uploads = await Promise.all(
    files.map((file) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "drivehub/cars",
          },
          (error, result) => {
            if (error) return reject(error);

            resolve({
              url: result.secure_url,
              public_id: result.public_id,
            });
          }
        );

        stream.end(file.buffer);
      });
    })
  );

  return uploads;
};

export default uploadToCloudinary;