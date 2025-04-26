import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../contexts/AuthContext";

const UserDropdown = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="dropdown">
      <button
        className="btn btn-secondary dropdown-toggle"
        type="button"
        id="dropdownMenuButton1"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <FontAwesomeIcon icon={faRightToBracket} />{" "}
        {user ? user.name : "Login/Register"}
        {user && (
          <span className="text-sm text-gray-500 ms-2">
            <span >[{user.role}]</span>
          </span>
        )}
      </button>
      <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
        {user ? (
          <>
            <li>
                <button className="dropdown-item" onClick={() => navigate("/profile")}>
                    Profil
                </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={logout}>
                Odhlásiť sa
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <button className="dropdown-item" onClick={() => navigate("/login")}>
                Prihlásiť sa
              </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={() => navigate("/register")}>
                Zaregistrovať sa
              </button>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default UserDropdown;
