import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";

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

        fetchMenu();
    }, []);

    const renderItemsByCategory = (categoryId) => {
        const items = menuItems.filter(item => item.category === categoryId);
        return items.length === 0 ? (
        <p>Žiadne položky.</p>
        ) : (
        <ul className="list-group list-group-flush">
            {items.map(item => (
            <li key={item._id} className="list-group-item">
                <div className="d-flex justify-content-between">
                <div>
                    <strong>{item.name}</strong>
                    {item.description && <div className="text-muted">{item.description}</div>}
                    {item.ingredients && <div><em>{item.ingredients.join(", ")}</em></div>}
                </div>
                <div>{item.price.toFixed(2)} €</div>
                </div>
            </li>
            ))}
        </ul>
        );
    };

    return (
        <section className="py-5">
        {categories.map(cat => (
            <div className="container my-5 whiteColor shapedivider_menu" key={cat.id}>
            <div className="row justify-content-center">
                <div className="col-lg-10">
                <div className="card">
                    <div className="card-body">
                    <h2 className="big-text">{cat.name}</h2>
                    {renderItemsByCategory(cat.id)}
                    </div>
                </div>
                </div>
            </div>
            </div>
        ))}
        </section>
    );
};

export default MenuSection;
