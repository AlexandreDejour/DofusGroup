import { Router } from "express";
const userRouter = Router();

import { userController } from "../controllers/userController.js";
import { validateInt } from "../middlewares/validateInt.js";

userRouter.post("/user", userController.post);

userRouter.route("/user/:id")
  .get(validateInt, userController.getOne)
  .patch(validateInt, userController.update)
  .delete(validateInt, userController.delete);

export { userRouter };
