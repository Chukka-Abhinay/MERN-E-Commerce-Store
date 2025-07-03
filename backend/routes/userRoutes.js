import express from "express";
import {createUser,loginUser, logoutCurrentUser, getAllUser, 
    getCurrentUserProfile, updateCurrentUserProfile,deleteUserById,
    getUserById, updateUserById} from "../controllers/userController.js"
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
const routes = express.Router();

routes.route("/").post(createUser).get(authenticate, authorizeAdmin, getAllUser);
routes.post("/auth", loginUser);
routes.post("/logout", logoutCurrentUser);
routes.route("/profile").get( authenticate, getCurrentUserProfile).put(authenticate,updateCurrentUserProfile);
routes.route("/:id").delete(authenticate,authorizeAdmin,deleteUserById).get(authenticate,authorizeAdmin,getUserById)
                    .put(authenticate,authorizeAdmin, updateUserById);
export default routes;