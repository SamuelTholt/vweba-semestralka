import { useState } from "react"

const RegisterForm = () => {
    const [formRegisterData, setFormRegisterData] = useState({
        name: "",
        email: "",
        password: "",
        password_repeat: ""
    });

    const [err, setErr] = useState("");
    const [success, setSuccess] = useState("");

    
}