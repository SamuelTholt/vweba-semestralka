import React, { useState, useEffect, useContext } from "react";
import Modal from "react-modal";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";


Modal.setAppElement("#root"); // aby nevyhadzovalo warningy

const EditMenuModal = ({ isOpen, onRequestClose, menuItem }) => {
    const { user, token } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: 0,
        category: "",
        numberOrder: 0
    });
    const [ingredients, setIngredients] = useState([]);
    const [ingredientInput, setIngredientInput] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    
    const isAdmin = user?.role === "admin";
    
    // Načítanie dát z menu itemu pri otvorení modalu
    useEffect(() => {
        if (menuItem) {
            setFormData({
                name: menuItem.name || "",
                description: menuItem.description || "",
                price: menuItem.price || 0,
                category: menuItem.category || "",
                numberOrder: menuItem.numberOrder || 0
            });
            setIngredients(menuItem.ingredients || []);
        }
    }, [menuItem]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === "price" || name === "numberOrder" ? 
                parseFloat(value) : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAdmin) {
            setError("Nemáte oprávnenie upravovať položky menu!");
            return;
        }

        setIsSubmitting(true);
        setError("");
    
        const formSubmitData = new FormData();
        formSubmitData.append("name", formData.name);
        formSubmitData.append("description", formData.description);
        formSubmitData.append("price", formData.price);
        formSubmitData.append("category", formData.category);
        formSubmitData.append("numberOrder", formData.numberOrder);
        
        // Pridať všetky ingrediencie do FormData
        ingredients.forEach((ingredient) => {
            formSubmitData.append("ingredients", ingredient);
        });

        const jsonData = {
            name: formData.name,
            description: formData.description,
            price: formData.price,
            category: formData.category,
            numberOrder: formData.numberOrder,
            ingredients: ingredients
        };
    
        try {
            const res = await axios.put(`http://localhost:5000/menu/edit/${menuItem._id}`, jsonData, {
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token
                }
            });
            
            console.log("Menu item úspešne upravený:", res.data);
            onRequestClose();
            
            // Obnovenie stránky pre aktualizáciu zoznamu
            window.location.reload();
        } catch (error) {
            console.error("Chyba pri úprave menu itemu:", error);
            if (error.response) {
                const data = error.response.data;
                setError(data.errors ? data.errors.map(e => e.msg).join(", ") : data.error || "Neznáma chyba");
            } else {
                setError("Nepodarilo sa upraviť menu item. Skontrolujte pripojenie k internetu.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Upraviť menu item"
            className="Modal__content"
            overlayClassName="Modal__overlay"
        >
            <div className="Modal__header">
                <h2>Upraviť menu item</h2>
                <button 
                    onClick={onRequestClose}
                    className="Modal__close-button"
                >
                    &times;
                </button>
            </div>

            {error && (
                <div className="Modal__error">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="Modal__form-group">
                    <label>
                        Poradie
                    </label>
                    <input
                        type="number"
                        name="numberOrder"
                        value={formData.numberOrder}
                        onChange={handleChange}
                        placeholder="Poradie v menu"
                        className="Modal__textarea"
                    />
                </div>

                <div className="Modal__form-group">
                    <label>
                        Názov <span className="required">*</span>
                    </label>
                    <textarea
                        required
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Napíšte názov menu itemu"
                        className="Modal__textarea"
                    />
                </div>

                <div className="Modal__form-group">
                    <label>
                        Popis:
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Napíšte popis"
                        className="Modal__textarea"
                    />
                </div>

                <div className="Modal__form-group">
                    <label>
                        Cena <span className="required">*</span>
                    </label>
                    <input
                        type="number"
                        required
                        step="0.01"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="Napíšte cenu"
                        className="Modal__textarea"
                    />
                </div>

                <div className="Modal__form-group">
                    <label>
                        Kategória <span className="required">*</span>
                    </label>
                    <select
                        required
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="Modal__select"
                    >
                        <option value="">-- Vyber kategóriu --</option>
                        {["pizza", "starter", "salad", "dessert", "drink", "soup"].map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="Modal__form-group">
                    <label>Ingrediencie:</label>
                    <div className="Modal__ingredients-input">
                        <input
                            type="text"
                            value={ingredientInput}
                            onChange={(e) => setIngredientInput(e.target.value)}
                            placeholder="Napíšte ingredienciu"
                            className="Modal__textarea"
                        />
                        <button
                            type="button"
                            onClick={() => {
                                if (ingredientInput.trim()) {
                                    setIngredients([...ingredients, ingredientInput.trim()]);
                                    setIngredientInput("");
                                }
                            }}
                            className="Modal__button Modal__button--small"
                        >
                            Pridať
                        </button>
                    </div>

                    {/* Zoznam ingrediencií */}
                    <ul className="Modal__ingredients-list">
                        {ingredients.map((ing, index) => (
                            <li key={index} className="ingredient-item">
                                {ing}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIngredients(ingredients.filter((_, i) => i !== index));
                                    }}
                                    className="Modal__remove-ingredient"
                                    title="Odstrániť ingredienciu"
                                >
                                    ×
                                </button>
                            </li>
                        ))}
                    </ul>
                    
                    {ingredients.length === 0 && (
                        <div className="no-ingredients-message">
                            Žiadne ingrediencie neboli pridané
                        </div>
                    )}
                </div>

                <div className="Modal__buttons">
                    <button 
                        type="button" 
                        onClick={onRequestClose}
                        className="Modal__button Modal__button--cancel"
                        disabled={isSubmitting}
                    >
                        Zrušiť
                    </button>
                    <button 
                        type="submit"
                        className="Modal__button Modal__button--submit"
                        disabled={isSubmitting || error}
                    >
                        {isSubmitting ? "Ukladám..." : "Uložiť zmeny"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default EditMenuModal;