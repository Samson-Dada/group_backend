import multer from "multer";
import path from "path";

// Set up storage engine
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/products"); // Directory where the images will be saved
	},
	filename: (req, file, cb) => {
		cb(
			null,
			file.fieldname + "-" + Date.now() + path.extname(file.originalname)
		);
	},
});

// Check file type (optional)
const checkFileType = (file, cb) => {
	const filetypes = /jpeg|jpg|png/;
	const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
	const mimetype = filetypes.test(file.mimetype);

	if (mimetype && extname) {
		return cb(null, true);
	} else {
		cb("Error: Images only!");
	}
};

// Initialize multer
export const upload = multer({
	storage: storage,
	limits: { fileSize: 1000000 }, // Limit file size to 1MB
	fileFilter: (req, file, cb) => {
		checkFileType(file, cb);
	},
});
