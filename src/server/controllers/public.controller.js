import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";

import userModel from "../models/user.model.js"


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
        const result = validationResult(req);
        const validationErrors = result.array().map(err => ({ msg: err.msg }));
        const customErrors = [];

        const { email, name, password, password_repeat } = req.body;

        const existUser = await userModel.findOne({ email });
        if (existUser) {
          console.log("Taký email už existuje!");
          customErrors.push({ msg: "Taký email už existuje!" });
          
        }

        if(password !== password_repeat) {
          console.log("Heslá sa nezhodujú!");
          customErrors.push({ msg: "Heslá sa nezhodujú!" });
          //throw new HttpError("Heslá sa nezhodujú", 400);
          //return res.status(400).json({  errors: [{ msg: "Heslá sa nezhodujú!" }] });
        }

        const allErrors = [...validationErrors, ...customErrors];

        if (allErrors.length > 0) {
          console.log("Validation or auth errors:", allErrors);
          return res.status(400).json({ errors: allErrors });
        }

        const userRecord = new userModel({ name, email });
        userRecord.nastavitHeslo(password);
        await userRecord.save();

        res.status(201).send({ email: userRecord.email });
    }
];

const signIn = [
    body("email").isEmail().not().isEmpty().withMessage("Neplatný email!"),
    body("password").not().isEmpty().withMessage("Heslo nemôže byť prázdne!"),
    async (req, res) => {
      const result = validationResult(req);
      const validationErrors = result.array().map(err => ({ msg: err.msg }));
      const customErrors = [];

      const { email, password } = req.body;
      const existingUser = await userModel.findOne({ email });

      if (!existingUser) {
        console.log( "Neplatný email alebo taký email neexistuje!" );
        customErrors.push({ msg:  "Neplatný email alebo taký email neexistuje!" });
      }
      if (!existingUser.checkHeslo(password)) {
        console.log( "Zlé zadané heslo!" );
        customErrors.push({ msg:  "Zlé zadané heslo!" });
      }

      const allErrors = [...validationErrors, ...customErrors];

      if (allErrors.length > 0) {
        console.log("Validation or auth errors:", allErrors);
        return res.status(400).json({ errors: allErrors });
      }

      const token = jwt.sign(
        {
          userId: existingUser._id,
          userName: existingUser.name,
          userRole: existingUser.role
        },
        process.env.API_KEY,
          { expiresIn: '3h' }
      );
      res.status(200).send({ token });
    },
];

export default {
    signIn,
    signUp
};