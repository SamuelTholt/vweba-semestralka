import NavigationBar from "../components/navigationBar/NavigationBar";
import HeaderWithImage from "../components/HeaderWithImage";
import imageMenu from "../../assets/images/menu-min.jpg"
import MenuSection from "../page_sections/MenuSection";
import AddMenuSection from "../page_sections/ButtonAddMenuSection";


const MenuPage = () => {
  return (
      <div className="menu">
        <NavigationBar/>
        <HeaderWithImage
                title="Menu"
                bgImage={imageMenu}
                shapeDivider="shapedivider_line"
        />
        <AddMenuSection/>
        <MenuSection />
      </div>
  );
}

export default MenuPage;