import { Router } from "express";
import * as UserController from "../controllers/user.controllers.js";
import { auth } from "../middleware/auth.middleware.js";
import { authToken } from "../middleware/jwt.middleware.js";
import { passportCall } from '../middleware/passport.middleware.js';

const router = new Router();

router.post("/", UserController.createUser);
router.get(
  "/:email",
  passportCall('jwtCookie'),
  UserController.getUser,
);
router.put("/updateUser/:email", authToken, UserController.updateUser);
router.put("/updatePassword/:email", auth, UserController.updatePassword);

export default router;