import { useContext } from "react";
import { MenuContext } from "../contexts/MenuContext";

const MenuItem = ({ item, onEdit, onDelete }) => {
    const { isAdmin } = useContext(MenuContext);
    const isAdminUser = isAdmin();

    return (
        <li className="list-group-item">
            <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1">
                    <strong>{item.numberOrder}. {item.name}</strong>
                    {item.description && <div className="text-muted">{item.description}</div>}
                    {item.ingredients && <div><em>{item.ingredients.join(", ")}</em></div>}
                </div>
                <div className="d-flex flex-column align-items-end">
                    <div className="mb-2">{item.price.toFixed(2)} €</div>
                    {isAdminUser && (
                        <div className="btn-group">
                            <button 
                                className="btn btn-sm btn-outline-primary me-1" 
                                onClick={() => onEdit(item)}
                            >
                                Upraviť
                            </button>
                            <button 
                                className="btn btn-sm btn-outline-danger" 
                                onClick={() => onDelete(item._id)}
                            >
                                Vymazať
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </li>
    );
};

export default MenuItem;