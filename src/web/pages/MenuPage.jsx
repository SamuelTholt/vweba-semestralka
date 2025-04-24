import NavigationBar from "../components/NavigationBar";
import HeaderWithImage from "../components/HeaderWithImage";
import imageMenu from "../../assets/images/menu.jpg"


const MenuPage = () => {
  return (
      <div className="menu">
        <NavigationBar/>
        <HeaderWithImage
                title="Menu"
                bgImage={imageMenu}
                shapeDivider="shapedivider_line"
            />
      </div>
  );
}

export default MenuPage;