import { Router } from "express";
const userRouter = Router();

import { validateSchema } from "../joi/validateSchema.js";
import { createSchema, updateSchema } from "../joi/user.js";

import { validateInt } from "../middlewares/validateInt.js";
import { encryptMail } from "../middlewares/encryptMail.js";
import { hashPassword } from "../middlewares/hashPassword.js";
import { htmlSanitizer } from "../middlewares/htmlSanitizer.js";
import { userController } from "../controllers/userController.js";

userRouter.post("/user",
    htmlSanitizer,
    validateSchema(createSchema),
    hashPassword,
    encryptMail,
    userController.post
  );

userRouter.route("/user/:id")
  .get(validateInt, userController.getOne)
  .patch(validateInt,
      htmlSanitizer,
      validateSchema(updateSchema),
      hashPassword,
      encryptMail,
      userController.update
  )
  .delete(validateInt, userController.delete);

export { userRouter };
