import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

function Register() {
    const navigate = useNavigate();
    const MySwal = withReactContent(Swal);

    const [inputs, setInputs] = useState({
        fname: '',
        lname: '',
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }));
    }

    const validate = () => {
        let errors = {};
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const specialCharsPattern = /[!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~]/g;

        if (!inputs.email) {
            errors.email = "Email is required.";
        } else if (!emailPattern.test(inputs.email)) {
            errors.email = "Invalid email format.";
        }

        if (!inputs.password) {
            errors.password = "Password is required.";
        } else {
            const passwordErrors = [];
            if (!/[A-Z]/.test(inputs.password)) passwordErrors.push("at least one uppercase letter");
            if (!/[a-z]/.test(inputs.password)) passwordErrors.push("at least one lowercase letter");
            if (!/\d/.test(inputs.password)) passwordErrors.push("at least one number");
            if ((inputs.password.match(specialCharsPattern) || []).length > 1) 
                passwordErrors.push("at least three special characters");
            if (inputs.password.length < 8) passwordErrors.push("at least 8 characters long");

            if (passwordErrors.length > 0) {
                errors.password = `Password must include ${passwordErrors.join(', ')}.`;
            }
        }

        console.log("Password validation errors:", errors.password);
        return errors;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "fname": inputs.fname,
            "lname": inputs.lname,
            "email": inputs.email,
            "password": inputs.password,
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch("http://localhost:3333/register", requestOptions) // URL ที่ตรงกับ backend
            .then((response) => response.json())
            .then((result) => {
                if (result.status === 'ok') {
                    MySwal.fire({
                        html: <i>{result.message}</i>,
                        icon: 'success'
                    }).then(() => {
                        navigate('/');
                    });
                } else {
                    MySwal.fire({
                        html: <i>{result.message}</i>,
                        icon: 'error'
                    });
                }
            })
            .catch((error) => console.error(error));
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>First name:
                    <input
                        type="text"
                        name="fname"
                        value={inputs.fname || ""}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>Last name:
                    <input
                        type="text"
                        name="lname"
                        value={inputs.lname || ""}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>Email:
                    <input
                        type="text"
                        name="email"
                        value={inputs.email || ""}
                        onChange={handleChange}
                    />
                </label>
                {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
                <br />
                <label>Password:
                    <input
                        type="password"
                        name="password"
                        value={inputs.password || ""}
                        onChange={handleChange}
                    />
                </label>
                {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
                <br />
                <input type="submit" />
            </form>
        </div>
    )
}

export default Register;
