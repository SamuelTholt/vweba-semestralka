import { Link } from 'react-router-dom';
import NavItem from "./NavItem";
import { faHome, faUtensils, faCamera, faStar, faEnvelope, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import UserDropdown from './UserDropdown';
const NavListBar = () => {
    return (
        <div className="menuList">
            <ul className="list">
                <NavItem to="/" itemIcon={faHome}>Domov</NavItem>
                <NavItem to="/menu" itemIcon={faUtensils}>Menu</NavItem>
                <NavItem to="/gallery" itemIcon={faCamera}>Fotogaléria</NavItem>
                <NavItem to="/reviews" itemIcon={faStar}>Recenzie</NavItem>
                <NavItem to="/contact" itemIcon={faEnvelope}>Kontakt</NavItem>
                <NavItem to="/about-us" itemIcon={faInfoCircle}>O nás</NavItem>
                <UserDropdown/>
            </ul>
        </div>
    )
}

export default NavListBar;