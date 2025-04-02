import NavItem from "./NavItem";
import { faHome, faUtensils, faCamera, faStar, faEnvelope, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
const NavListBar = () => {
    return (
        <div className="menuList">
            <ul className="list">
                <NavItem itemIcon={faHome}>Domov</NavItem>
                <NavItem itemIcon={faUtensils}>Menu</NavItem>
                <NavItem itemIcon={faCamera}>Fotogaléria</NavItem>
                <NavItem itemIcon={faStar}>Recenzie</NavItem>
                <NavItem itemIcon={faEnvelope}>Kontakt</NavItem>
                <NavItem itemIcon={faInfoCircle}>o nás</NavItem>
            </ul>
        </div>
    )
}

export default NavListBar;