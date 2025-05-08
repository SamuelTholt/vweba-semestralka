import React, { useContext, useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";

Modal.setAppElement("#root"); // aby nevyhadzovalo warningy

const MenuModal = ({ isOpen, onRequestClose }) => {
    const { user, token } = useContext(AuthContext);
    const [name , setName] = useState("");
    const [description , setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [category , setCategory] = useState("");
    const [ingredients , setIngredients] = useState([]);

    const [ingredientInput, setIngredientInput] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");


    const isAdmin = user?.role === "admin";

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAdmin) {
            setError("Nemáte oprávnenie pridávať položky do menu!");
            return;
        }

        setIsSubmitting(true);
        setError("");
    
        const payload = {
            name,
            description,
            price,
            category,
            ingredients,
        };
    
        try {
            const res = await axios.post("http://localhost:5000/menu/create", payload, {
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token
                }
            });
            const data = res.data;
            
            console.log("Menu item úspešne uložený:", data);
            onRequestClose();
            setName("");
            setDescription("");
            setPrice(0);
            setCategory("");
            setIngredients([]);
    
            window.location.reload();
        } catch (error) {
            console.error("Chyba pri ukladaní menu itemu:", error);
            if (error.response) {
                const data = error.response.data;
                setError(data.errors ? data.errors.map(e => e.msg).join(", ") : data.error || "Neznáma chyba");
            } else {
                setError("Nepodarilo sa uložiť menu item. Skontrolujte pripojenie k internetu.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };
    

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Pridať recenziu"
            className="Modal__content"
            overlayClassName="Modal__overlay"
            >
            <div className="Modal__header">
                <h2>Pridať menu item</h2>
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

            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="Modal__form-group">
                <label>
                    Názov <span className="required">*</span>
                </label>
                <textarea
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Napíšte názov menu itemu"
                    className="Modal__textarea"
                />
                </div>

                <div className="Modal__form-group">
                <label>
                    Popis:
                </label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value))}
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
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
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
                    <li key={index}>
                        {ing}
                        <button
                        type="button"
                        onClick={() => {
                            setIngredients(ingredients.filter((_, i) => i !== index));
                        }}
                        className="Modal__remove-ingredient"
                        >
                        ×
                        </button>
                    </li>
                    ))}
                </ul>
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
                    {isSubmitting ? "Odosielam..." : "Odoslať"}
                </button>
                </div>
            </form>
        </Modal>
    );
};

export default MenuModal;