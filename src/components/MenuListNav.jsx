import { Link } from 'react-router-dom';
import NavItem from "./NavItem";
import { faHome, faUtensils, faCamera, faStar, faEnvelope, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
const NavListBar = () => {
    return (
        <div className="menuList">
            <ul className="list">
                <NavItem to="/" itemIcon={faHome}>Domov</NavItem>
                <NavItem to="/" itemIcon={faUtensils}>Menu</NavItem>
                <NavItem to="/" itemIcon={faCamera}>Fotogaléria</NavItem>
                <NavItem to="/" itemIcon={faStar}>Recenzie</NavItem>
                <NavItem to="/" itemIcon={faEnvelope}>Kontakt</NavItem>
                <NavItem to="/about-us" itemIcon={faInfoCircle}>o nás</NavItem>
            </ul>
        </div>
    )
}

export default NavListBar;