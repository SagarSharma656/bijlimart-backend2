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

const getImageIdFromUrl = (secureUrl) => {
    const parts = secureUrl.split('/');
    const fileName = parts[parts.length - 1]; // e.g., "image_name.jpg"
    return fileName.split('.')[0]; // e.g., "image_name"
};


const deteteFromCloudinary = async (folder, imageId) => {
    try {
        const result = await cloudinary.uploader.destroy(`${folder}/${imageId}`);
        return result;

    } catch (error) {
        console.log('Error in delete image from cloudiary : ', error.message);
    }
}


module.exports = { fileUploadToCloudinary, getImageIdFromUrl, deteteFromCloudinary }