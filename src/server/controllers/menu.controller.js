import { body, validationResult } from "express-validator";
import menuModel from "../models/menu.model.js";

const createMenuItem = [
    body("name").not().isEmpty().withMessage("Názov nemôže byť prázdny!"),
    body("description").optional(),
    body("price").not().isEmpty().isFloat({ min: 0 }).withMessage("Cena musí byť zadaná a cena musí byť väčšia ako 0!"),
    body("category").not().isEmpty().withMessage("Kategória nemôže byť prázdna!").isIn(["pizza", "starter", "salad", "dessert", "drink", "soup"]).withMessage("Neplatná kategória!"),
    body("ingredients").optional(),
    async(req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            console.log("Validation errors:", errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, description, price, category, ingredients } = req.body;

        try {
            const newMenuItem = new menuModel({
                name,
                description,
                price,
                category,
                ingredients
            });
            await newMenuItem.save();
            res.status(201).json(newMenuItem);
        } catch (error) {
            res.status(500).json({ error: "Niečo sa pokazilo a nepridal sa item do menu!" });

        }
        
    }
];

export default {
    createMenuItem
};