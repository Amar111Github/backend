
const cloudinary = require('cloudinary').v2
const fs = require('fs')

cloudinary.config({
    cloud_name: 'drbqemmjk',
    api_key: '237434138471526',
    api_secret: 'iq18yfUDh86gR20TtFI83ZEmF9U'
});


// upload image file in cloud 
const cloudinaryFileUploder = async (localFilePath) => {
    console.log("localFilePath ============ ", localFilePath);
    try {
        if (!localFilePath) {
            return null
        } else {
            const response = await cloudinary.uploader.upload(localFilePath, { resource_type: "auto" })
            await fs.unlinkSync(localFilePath);
            return await { image_url: response.url, publicId: response.public_id }
        }
    } catch (err) {
        fs.unlinkSync(localFilePath);
        console.log('cloudinary error', err);
    }
}

const uplodeImagesCloudinary = async (filePath) => {
    console.log("filePath ============ >>>>>>>>>>>>>>", filePath);
    if (filePath) {
        const image = await cloudinary.uploader.upload(filePath)
        if (image) {
            fs.unlinkSync(filePath)
            return await{image_url: image.url, publicId: image.public_id }
        } else {
            fs.unlinkSync(filePath)
            return null;
        }
    } else {
        return null;
    }

}


// remove the user cloud image file 
const removeCloudinaryImage = async (publicId) => {
    const imageStatus = await cloudinary.uploader.destroy(publicId)

    return imageStatus
}


module.exports = { cloudinaryFileUploder, removeCloudinaryImage, uplodeImagesCloudinary }