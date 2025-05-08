import { body, validationResult, query } from "express-validator";
import menuModel from "../models/menu.model.js";

const getMenuItemsByCategory = [
    query("category").optional().isIn(["pizza", "starter", "salad", "dessert", "drink", "soup", "all"]).withMessage("Neplatná kategória!"),
    async(req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { category } = req.query;
        
        try {
            let query = {};
            if (category && category !== "all") {
                query = { category };
            }

            const menuItems = await menuModel.find(query).sort({ category: 1, numberOrder: 1 });
            res.status(200).json(menuItems);
        } catch (error) {
            console.error("Error fetching menu items:", error);
            res.status(500).json({ error: "Nastala chyba pri získavaní položiek menu" });
        }
    }
];

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
            const lastItemInCategory = await menuModel.findOne({ category })
              .sort({ numberOrder: -1 })
              .limit(1);
            
            const nextNumberOrder = lastItemInCategory ? lastItemInCategory.numberOrder + 1 : 1;

            const newMenuItem = new menuModel({
                name,
                description,
                price,
                category,
                ingredients,
                numberOrder: nextNumberOrder
            });
            await newMenuItem.save();
            res.status(201).json(newMenuItem);
        } catch (error) {
            res.status(500).json({ error: "Niečo sa pokazilo a nepridal sa item do menu!" });

        }
        
    }
];

const editMenuItem = [
    body("name").optional().not().isEmpty().withMessage("Názov nemôže byť prázdny!"),
    body("description").optional(),
    body("price").optional().isFloat({ min: 0 }).withMessage("Cena musí byť väčšia ako 0!"),
    body("category").optional().isIn(["pizza", "starter", "salad", "dessert", "drink", "soup"]).withMessage("Neplatná kategória!"),
    body("ingredients").optional(),
    body("numberOrder").optional().isInt({ min: 1 }).withMessage("Poradové číslo musí byť kladné celé číslo!"),
    async(req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const updateData = req.body;
        
        try {
            const menuItem = await menuModel.findById(id);
            if (!menuItem) {
                return res.status(404).json({ error: "Položka menu nebola nájdená!" });
            }

            const oldCategory = menuItem.category;
            const oldNumberOrder = menuItem.numberOrder;
            const newNumberOrder = updateData.numberOrder || oldNumberOrder;
            const newCategory = updateData.category || oldCategory;

            if (oldCategory !== newCategory) {
                await menuModel.updateMany(
                    { category: oldCategory, numberOrder: { $gt: oldNumberOrder } },
                    { $inc: { numberOrder: -1 } }
                );

                if (updateData.numberOrder) {
                    await menuModel.updateMany(
                        { category: newCategory, numberOrder: { $gte: newNumberOrder } },
                        { $inc: { numberOrder: 1 } }
                    );
                } else {
                    const lastInNewCategory = await menuModel.findOne({ category: newCategory })
                        .sort({ numberOrder: -1 })
                        .limit(1);
                    
                    updateData.numberOrder = lastInNewCategory ? lastInNewCategory.numberOrder + 1 : 1;
                }
            } 
            else if (newNumberOrder !== oldNumberOrder) {
                if (newNumberOrder > oldNumberOrder) {
                    await menuModel.updateMany(
                        { 
                            category: oldCategory, 
                            numberOrder: { $gt: oldNumberOrder, $lte: newNumberOrder } 
                        },
                        { $inc: { numberOrder: -1 } }
                    );
                } else {
                    await menuModel.updateMany(
                        { 
                            category: oldCategory, 
                            numberOrder: { $gte: newNumberOrder, $lt: oldNumberOrder } 
                        },
                        { $inc: { numberOrder: 1 } }
                    );
                }
            }

            const updatedMenuItem = await menuModel.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            );

            res.status(200).json(updatedMenuItem);
        } catch (error) {
            console.error("Error updating menu item:", error);
            res.status(500).json({ error: "Nastala chyba pri úprave položky menu" });
        }
    }
];

const deleteMenuItem = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    
    try {
        const menuItem = await menuModel.findById(id);
        if (!menuItem) {
            return res.status(404).json({ error: "Položka menu nebola nájdená!" });
        }

        const { category, numberOrder } = menuItem;

        await menuModel.findByIdAndDelete(id);

        await menuModel.updateMany(
            { category, numberOrder: { $gt: numberOrder } },
            { $inc: { numberOrder: -1 } }
        );

        res.status(200).json({ message: "Položka menu bola úspešne odstránená" });
    } catch (error) {
        console.error("Error deleting menu item:", error);
        res.status(500).json({ error: "Nastala chyba pri odstraňovaní položky menu" });
    }
};

export default {
    getMenuItemsByCategory,
    createMenuItem,
    editMenuItem,
    deleteMenuItem
};