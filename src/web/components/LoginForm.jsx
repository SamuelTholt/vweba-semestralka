import { useState } from "react";
import axios from "axios";

const LoginForm = () => {
    const [formLoginData, setFormLoginData] = useState({
        email: "",
        password: ""
    });

    const [err, setErr] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormLoginData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErr([]);
        setSuccess("");

        try {
            const resData = await axios.post("http://localhost:5000/public/signIn", formLoginData);
            console.log(resData.data);
            localStorage.setItem("token", resData.data.token);
            setSuccess("Prihlásenie bolo úspešné!");
            window.location.href = "/";
        } catch (error) {
            console.log("Server response error:", error.response?.data);
            // Spracovanie chýb zo servera
            if (error.response && error.response.data.errors) {
                // Ak server posiela chyby v poli `errors`
                const errorMessages = error.response.data.errors.map(err => err.msg);
                setErr(errorMessages);  // Uložíme chyby ako pole
            } else {
                setErr(["Chyba pri prihlásení."]);  // Ak chyba neexistuje alebo je neznáma
            }
        }
    };
    return (
        <div className="registracia">
            <div className="container">
                <div className="row">
                    <div className="col-lg-10 col-xl-9 mx-auto ">
                        <div className="card flex-row my-5 border-0 shadow rounded-3 overflow-hidden whiteColor">
                            <div className="card-img-left d-none d-md-flex">
                            </div>
                            <div className="card-body p-4 p-sm-5">
                                <h5 className="card-title text-center mb-5 fw-light fs-5"></h5>
                                <form onSubmit={handleSubmit}>

                                <div className="form-floating mb-3">
                                    <input type="email" className="form-control" id="floatingInputEmail" name="email" placeholder="name@example.com" onChange={handleChange} required/>
                                    <label htmlFor="floatingInputEmail">Email</label>
                                </div>

                                <div className="form-floating mb-3">
                                    <input type="password" className="form-control" id="floatingInputPassword" name="password" placeholder="Password" onChange={handleChange} required/>
                                    <label htmlFor="floatingInputPassword">Password</label>
                                </div>

                                <div className="d-grid mb-2">
                                    <button className="btn btn-lg btn-primary btn-login fw-bold text-uppercase text-black bg-blue-400"
                                    type="submit">Prihlásiť sa</button>
                                </div>

                                <div className="flex items-center justify-end mt-4">
                                    {err && (
                                        <ul style={{ color: "red" }}>
                                            {err.map((error, index) => (
                                                <li key={index}>{error}</li> 
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
