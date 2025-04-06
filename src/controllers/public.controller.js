import { body, validationResult } from "express-validator";
import checkValidation from "../utils/Helpers";

import userModel from "../models/user.model.js"
import HttpError from "../utils/HttpError.js";

const signUp = [
    body("name").not().isEmpty().isLength({ min: 4 }).withMessage("Je potrebne zadat meno (minimalne 4 znaky)!"),
    body("email").isEmail().withMessage("Neplatný email!"),
    body("password").not().isEmpty().withMessage("Heslo nemôže byť prázdne"),
    body("password_repeat")
      .not()
      .isEmpty()
      .withMessage("Heslo nemôže byť prázdne"),
    body("password")
      .matches(/[0-9]/)
      .withMessage("Heslo musí obsahovať aspoň jedno číslo"),
    body("password")
      .matches(/[a-z]/)
      .withMessage("Heslo musí obsahovať aspoň jeden malý znak"),
    body("password")
      .matches(/[A-Z]/)
      .withMessage("Heslo musí obsahovať aspoň jeden veľký znak"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Heslo musí mať minimálne 8 znakov"),
    async (req, res) => {
        checkValidation(validationResult(req));
        const { email, name, password, password_repeat } = req.body;

        const existUser = await userModel.findOne({ email });
        if (existUser) {
            throw new HttpError("Email sa už používa", 400);
        }

        if(password !== password_repeat) {
            throw new HttpError("Heslá sa nezhodujú", 400);
        }

        const userRecord = new userModel({ name, email });
        userRecord.nastavitHeslo(password);
        await userRecord.save();

        res.status(201).send({ email: userRecord.email });
    }
];

const signIn = [
    body("email").isEmail().not().isEmpty().withMessage("Neplatný email"),
    body("password").not().isEmpty().withMessage("Heslo nemôže byť prázdne"),
    async (req, res) => {
      checkValidation(validationResult(req));
      const { email, password } = req.body;
      const existingUser = await userModel.findOne({ email });

      if (!existingUser) {
        throw new HttpError("Neplatne meno alebo heslo", 400);
      }
      if (!existingUser.checkHeslo(password)) {
        throw new HttpError("Neplatne meno alebo heslo", 400);
      }
      const token = jwt.sign(
        {
          userId: existingUser._id,
          userName: existingUser.name,
          userRole: existingUser.role
        },
        process.env.API_KEY
      );
      res.status(200).send({ token });
    },
];

export default {
    signIn,
    signUp
};