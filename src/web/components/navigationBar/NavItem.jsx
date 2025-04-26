import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom';

const navigateItem = ({ children, itemIcon, to }) => {
     return (
        <li>
            <Link className="nav-link" to={to}>
                <FontAwesomeIcon icon={itemIcon} /> {children}
            </Link>
        </li>
    )
}

export default navigateItem;