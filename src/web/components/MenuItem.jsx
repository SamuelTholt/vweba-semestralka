import React from "react";

const MenuItemos = ({ item, onEdit, onDelete }) => {
    return (
        <div className="menu-item d-flex justify-content-between align-items-center py-2 border-bottom">
            <div>
                <h5 className="mb-1">{item.name} – {item.price}€</h5>
                <p className="mb-0">{item.description}</p>
                {item.ingredients && (
                    <small className="text-muted">Ingrediencie: {item.ingredients.join(", ")}</small>
                )}
            </div>
            <div>
                <button className="btn btn-sm btn-warning me-2" onClick={() => onEdit(item)}>Editovať</button>
                <button className="btn btn-sm btn-danger" onClick={() => onDelete(item._id)}>Odstrániť</button>
            </div>
        </div>
    );
};

export default MenuItemos;
