import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const navigateItem = ({ children, itemIcon }) => {
     return (
        <li>
            <a className='nav-link'><FontAwesomeIcon icon={itemIcon}/> {children}</a>
        </li>
    )
}

export default navigateItem;