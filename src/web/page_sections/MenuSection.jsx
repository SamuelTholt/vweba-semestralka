import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import CategorySection from "./MenuCategorySection";

const categories = [
  { id: "pizza", name: "🍕 Pizza – Tradičné & Originálne Recepty" },
  { id: "starter", name: "🧄 Predjedlá & Snacky" },
  { id: "salad", name: "🥗 Šaláty" },
  { id: "dessert", name: "🍰 Dezerty" },
  { id: "drink", name: "☕ Nápoje" },
  { id: "soup", name: "🍲 Polievky" },
];

const MenuSection = () => {
    const { token } = useContext(AuthContext);
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
    fetchMenu();
    }, []);

    const fetchMenu = async () => {
        try {
        const res = await axios.get("http://localhost:5000/menu?category=all", {
            headers: {
            "x-access-token": token,
            }
        });
        
        setMenuItems(res.data);
        } catch (err) {
        console.error("Chyba pri načítaní menu:", err);
        }
    };
    const handleEdit = (item) => {
    // Tu príde logika pre úpravu položky
    console.log("Upraviť položku:", item);
    // Napríklad otvoriť modálne okno pre úpravu alebo presmerovať na stránku úpravy
  };
  
    const handleDelete = async (itemId) => {
        if (window.confirm("Naozaj chcete vymazať túto položku?")) {
        try {
            await axios.delete(`http://localhost:5000/menu/${itemId}`, {
            headers: {
                "x-access-token": token,
            }
            });
            
            // Aktualizovať zoznam po vymazaní
            fetchMenu();
        } catch (err) {
            console.error("Chyba pri vymazávaní položky:", err);
        }
        }
    };

    const getItemsByCategory = (categoryId) => {
        return menuItems.filter(item => item.category === categoryId);
    };

    return (
        <section className="py-5">
        {categories.map(category => (
            <CategorySection 
            key={category.id}
            category={category}
            items={getItemsByCategory(category.id)}
            onEdit={handleEdit}
            onDelete={handleDelete}
            />
        ))}
        </section>
    );
};

export default MenuSection;
