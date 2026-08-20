import cloudinary from '../../config/cloudinary.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return sendError(res, 400, 'No file uploaded');
    }

    // Streams multer file buffer directly to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'surangi_naar',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary Upload Error:', error);
          return sendError(res, 500, 'Image upload to Cloudinary failed', error);
        }
        return sendSuccess(res, 200, { url: result.secure_url }, 'Image uploaded successfully');
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (error) {
    console.error('Upload Error:', error);
    return sendError(res, 500, error.message);
  }
};
