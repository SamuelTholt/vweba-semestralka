import logo from "../assets/images/LK_pizza_logo_v2.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from "@fortawesome/free-solid-svg-icons";
import NavListBar from "./MenuListNav";

const navigateBar = () => { 
  return (
    <nav className="navigationBar">
      <a href="/" className="logo">
        <img src={logo}></img>
      </a>
      <input type="checkbox" id="toggler"></input>
      <label htmlFor="toggler"><FontAwesomeIcon icon={faBars} /></label>
      <NavListBar />
    </nav>
  )
};

export default navigateBar;