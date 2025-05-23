import MenuItem from "../components/MenuItem";

const CategorySection = ({ category, items, onEdit, onDelete }) => {
  return (
    <div className="container my-5 whiteColor shapedivider_menu">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card rounded-0 border-0 shadow-none shapedividers_btm_menu">
            <div className="card-body"
            style={{ marginTop:"80px", marginBottom: "80px" }}>
              <h2 className="big-text">{category.name}</h2>
              {items.length === 0 ? (
                <p>Žiadne položky.</p>
              ) : (
                <ul className="list-group list-group-flush">
                  {items.map(item => (
                    <MenuItem
                      key={item._id} 
                      item={item} 
                      onEdit={onEdit} 
                      onDelete={onDelete} 
                    />
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySection;