import { Router } from "express";
const userRouter = Router();

import { validateSchema } from "../joi/validateSchema.js";
import { createSchema, updateSchema } from "../joi/user.js";

import { validateInt } from "../middlewares/validateInt.js";
import { userController } from "../controllers/userController.js";

userRouter.post("/user", validateSchema(createSchema), userController.post);

userRouter.route("/user/:id")
  .get(validateInt, userController.getOne)
  .patch(validateInt, validateSchema(updateSchema), userController.update)
  .delete(validateInt, userController.delete);

export { userRouter };
