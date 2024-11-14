const cloudinary = require('cloudinary').v2

const fileUploadToCloudinary = async (file, folder, quality, height) => {
    const option = { 
        folder,
        resource_type: 'auto',
    };

    if(quality){
        option.quality = quality;
    }

    if(height){
        option.height = height;
    }

    return await cloudinary.uploader.upload(file.tempFilePath, option) 
}

module.exports = fileUploadToCloudinary