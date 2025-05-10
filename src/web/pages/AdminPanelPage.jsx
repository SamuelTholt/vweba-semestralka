import imageRole from "../../assets/images/users.jpg";
import NavigationBar from "../components/navigationBar/NavigationBar";
import HeaderWithImage from "../components/HeaderWithImage";
import { useEffect, useState } from "react";
import axios from "axios";

const AdminPanelPage = () => {
    const [users, setUsers] = useState([]);  
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(8);

    useEffect(() => {
        const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/public/users', {
            headers: {
                "x-access-token": token,
            }
            });
            
            if (Array.isArray(response.data)) {
            setUsers(response.data);
            } else if (response.data && Array.isArray(response.data.users)) {

            setUsers(response.data.users);
            } else {
            console.error('API nevrátilo očakávané pole používateľov:', response.data);
            setError('Neplatný formát dát z API');
            }
            
            setLoading(false);
        } catch (err) {
            setError('Nepodarilo sa načítať používateľov');
            setLoading(false);
            console.error('Error fetching users:', err);
        }
        };

        fetchUsers();
    }, []);

    const changeUserRole = async (userId, newRole) => {
        try {
        const token = localStorage.getItem('token');
        await axios.put(`http://localhost:5000/public/users/${userId}/role`, 
            { role: newRole },
            {
            headers: {
                "x-access-token": token,
            }
            }
        );
        
        setUsers(users.map(user => 
            user._id === userId ? { ...user, role: newRole } : user
        ));
        
        setEditingUser(null);
        } catch (err) {
        setError('Nepodarilo sa zmeniť práva používateľa');
        console.error('Error changing user role:', err);
        }
    };

    const filteredUsers = Array.isArray(users) 
        ? users.filter(user => 
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];
    
    // Get current users for pagination
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    // Calculate total pages
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    
    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    
    // Next and previous page handlers
    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };
    
    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="oNas">
            <NavigationBar/>
            <HeaderWithImage
                title="Users - úprava rolí"
                bgImage={imageRole}
                shapeDivider="shapedivider-special-waves"
            />

             <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1070 }}>
                {loading && (
                    <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                        <div className="toast-header bg-info text-white">
                            <strong className="me-auto">Informácia</strong>
                            <button type="button" className="btn-close" aria-label="Close"></button>
                        </div>
                        <div className="toast-body">
                            Načítavam používateľov...
                        </div>
                    </div>
                )}
                
                {error && (
                    <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                        <div className="toast-header bg-danger text-white">
                            <strong className="me-auto">Chyba</strong>
                            <button type="button" className="btn-close" aria-label="Close" 
                                onClick={() => setError(null)}></button>
                        </div>
                        <div className="toast-body">
                            {error}
                        </div>
                    </div>
                )}
            </div>

            <div className="container mt-4">

                {/* Vyhľadávanie */}
                <div className="mb-4">
                    <input
                    type="text"
                    placeholder="Vyhľadávanie podľa mena alebo emailu"
                    className="form-control"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1); // Reset to first page when searching
                    }}
                    />
                </div>

                {/* Tabuľka používateľov */}
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                    <thead className="table-light">
                        <tr>
                        <th>Meno</th>
                        <th>Email</th>
                        <th>Rola</th>
                        <th>Vytvorené</th>
                        <th>Akcie</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map(user => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                            {editingUser === user._id ? (
                                <select 
                                className="form-select form-select-sm" 
                                defaultValue={user.role}
                                onChange={(e) => changeUserRole(user._id, e.target.value)}
                                >
                                <option value="user">Používateľ</option>
                                <option value="admin">Admin</option>
                                </select>
                            ) : (
                                <span className={
                                  user.role === 'admin' ? 'text-success fw-bold' : 
                                  user.role === 'hl.admin' ? 'text-danger fw-bold' : ''
                                }>
                                {user.role === 'admin' ? 'Admin' : 
                                 user.role === 'hl.admin' ? 'Hl.Admin' : 'Používateľ'}
                                </span>
                            )}
                            </td>
                            <td>
                            {user.createdAt && new Date(user.createdAt).toLocaleDateString('sk-SK')}
                            </td>
                            <td>
                            {editingUser === user._id ? (
                                <button 
                                className="btn btn-sm btn-secondary"
                                onClick={() => setEditingUser(null)}
                                >
                                Zrušiť
                                </button>
                            ) : (
                                <button 
                                className="btn btn-sm btn-primary"
                                onClick={() => setEditingUser(user._id)}
                                >
                                Upraviť
                                </button>
                            )}
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>

                {filteredUsers.length === 0 && (
                    <div className="alert alert-info" role="alert">
                    Neboli nájdení žiadni používatelia
                    </div>
                )}
                
                {/* Pagination */}
                {filteredUsers.length > 0 && (
                    <nav aria-label="Navigácia stránkovania">
                        <ul className="pagination justify-content-center mt-4">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button 
                                    className="page-link" 
                                    onClick={goToPreviousPage}
                                    aria-label="Predchádzajúca"
                                >
                                    <span aria-hidden="true">&laquo;</span>
                                </button>
                            </li>
                            
                            {[...Array(totalPages).keys()].map(number => (
                                <li key={number + 1} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
                                    <button
                                        onClick={() => paginate(number + 1)}
                                        className="page-link"
                                    >
                                        {number + 1}
                                    </button>
                                </li>
                            ))}
                            
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button 
                                    className="page-link" 
                                    onClick={goToNextPage}
                                    aria-label="Nasledujúca"
                                >
                                    <span aria-hidden="true">&raquo;</span>
                                </button>
                            </li>
                        </ul>
                    </nav>
                )}
                
                {/* Informácia o zobrazených používateľoch */}
                <div className="text-center mt-2">
                    {filteredUsers.length > 0 && (
                        <p className="text-muted">
                            Zobrazujem {indexOfFirstUser + 1} - {Math.min(indexOfLastUser, filteredUsers.length)} z {filteredUsers.length} používateľov
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AdminPanelPage;