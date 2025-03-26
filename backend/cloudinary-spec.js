const cloudinary = require('./config/cloudinary');

async function testUpload() {
    try {
        const result = await cloudinary.uploader.upload('https://res.cloudinary.com/demo/image/upload/sample.jpg');
        console.log('Imagen subida con éxito:', result.secure_url);
    } catch (error) {
        console.error('Error al subir imagen:', error);
    }
}

testUpload();
