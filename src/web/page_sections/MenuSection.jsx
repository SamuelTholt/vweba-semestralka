import { useContext } from "react";
import CategorySection from "./MenuCategorySection";
import EditMenuModal from "../components/modals/EditMenuModal";
import { categories, MenuContext } from "../contexts/MenuContext";

const MenuSection = () => {
    const { 
        getItemsByCategory, 
        handleEdit, 
        deleteMenuItem, 
        isEditModalOpen, 
        closeEditModal, 
        selectedItem 
    } = useContext(MenuContext);

    return (
        <section className="py-5">
            {categories.map(category => (
                <CategorySection 
                    key={category.id}
                    category={category}
                    items={getItemsByCategory(category.id)}
                    onEdit={handleEdit}
                    onDelete={deleteMenuItem}
                />
            ))}

            {/* Modálne okno pre úpravu */}
            <EditMenuModal
                isOpen={isEditModalOpen}
                onRequestClose={closeEditModal}
                menuItem={selectedItem}
            />
        </section>
    );
};

export default MenuSection;
