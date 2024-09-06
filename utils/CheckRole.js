import { apiResponseCode, apiResponseStatus } from "../helper.js";

const checkRole = (role) => {
	return (req, res, next) => {
		const userRole = req.headers["role"];

		if (!userRole) {
			return res.status(400).json({
				responseCode: apiResponseCode.BAD_REQUEST,
				responseStatus: apiResponseStatus.FAILED,
				message: "Role header is missing",
			});
		}

		if (userRole !== role) {
			return res.status(403).json({
				responseCode: apiResponseCode.UNAUTHORIZED,
				responseStatus: apiResponseStatus.FAILED,
				message: `Access denied: only ${role} role can gain access `,
			});
		}

		next();
	};
};

export default checkRole;
