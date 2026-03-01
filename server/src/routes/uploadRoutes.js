import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Define storage configuration
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Images only!');
    }
}

// Init upload component
const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

// Route
router.post('/', upload.single('image'), (req, res) => {
    // req.file.path returns "uploads\image-12345.jpg" (on windows)
    // we should format it consistently.
    const imagePath = `/${req.file.path.replace(/\\/g, '/')}`;
    res.send({ message: 'Image uploaded successfully', image: imagePath });
});

export default router;
