// Import the Cloudinary SDK and initialize it with your configuration
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  secure: true, // Use HTTPS for secure communication
  api_key: process.env.API_KEY, // Your Cloudinary API key stored in environment variables
  api_secret: process.env.API_SECRET, // Your Cloudinary API secret stored in environment variables
  cloud_name: process.env.CLOUD_NAME, // Your Cloudinary cloud name stored in environment variables
});

// Function to upload an image to Cloudinary
const uploadImage = async (imagePath) => {
  // Options for uploading the image
  const options = {
    use_filename: true, // Use the original filename of the image
    unique_filename: false, // Allow Cloudinary to generate unique filenames if there are conflicts
    overwrite: true, // Overwrite existing files with the same name
  };

  try {
    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(imagePath, options);
    // Return the public ID of the uploaded image
    return result.public_id;
  } catch (error) {
    // If an error occurs during the upload, log the error
    console.error(error);
  }
};

// Export the function to make it accessible to other parts of your code
module.exports = uploadImage;
