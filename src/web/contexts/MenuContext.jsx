// MenuContext.js
import React, { createContext, useState, useContext, useCallback, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const MenuContext = createContext();

export const categories = [
  { id: "pizza", name: "🍕 Pizza – Tradičné & Originálne Recepty" },
  { id: "starter", name: "🧄 Predjedlá & Snacky" },
  { id: "salad", name: "🥗 Šaláty" },
  { id: "dessert", name: "🍰 Dezerty" },
  { id: "drink", name: "☕ Nápoje" },
  { id: "soup", name: "🍲 Polievky" },
];

export const MenuProvider = ({ children }) => {
    const { token, user } = useContext(AuthContext);
    const [menuItems, setMenuItems] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // Fetch menu data
    const fetchMenu = useCallback(async () => {
        try {
            const res = await axios.get("http://localhost:5000/menu?category=all");
            setMenuItems(res.data);
        } catch (err) {
            console.error("Chyba pri načítaní menu:", err);
        }
    }, []);

    // Load menu data on component mount
    useEffect(() => {
        fetchMenu();
    }, [fetchMenu]);

    // Delete menu item
    const deleteMenuItem = useCallback(async (itemId) => {
        if (!token) return false;

        if (window.confirm("Naozaj chcete vymazať túto položku?")) {
            try {
                await axios.delete(`http://localhost:5000/menu/delete/${itemId}`, {
                    headers: {
                        "x-access-token": token,
                    }
                });
                
                // Update the list after deletion
                alert("Podarilo sa vymazať item z menu!");
                await fetchMenu();
                return true;
            } catch (err) {
                console.error("Chyba pri vymazávaní položky:", err);
                alert("Nepodarilo sa vymazať item z menu!");
                return false;
            }
        }
        return false;
    }, [token, fetchMenu]);

    // Open edit modal
    const handleEdit = useCallback((item) => {
        setSelectedItem(item);
        setIsEditModalOpen(true);
    }, []);

    // Close edit modal
    const closeEditModal = useCallback(() => {
        setIsEditModalOpen(false);
        setSelectedItem(null);
    }, []);

    // Check if user is admin
    const isAdmin = useCallback(() => {
        return user && user.role === "admin";
    }, [user]);

    // Get items by category
    const getItemsByCategory = useCallback((categoryId) => {
        return menuItems.filter(item => item.category === categoryId);
    }, [menuItems]);

    return (
        <MenuContext.Provider
            value={{
                menuItems,
                fetchMenu,
                deleteMenuItem,
                isAdmin,
                isEditModalOpen,
                selectedItem,
                handleEdit,
                closeEditModal,
                getItemsByCategory,
                categories
            }}
        >
            {children}
        </MenuContext.Provider>
    );
};

export default MenuProvider;