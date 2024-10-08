import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// My components
import { LoginForm } from "../../components/common/LoginForm";

import loginImg from "../../assets/images/loginImg.jpg";

import { SERVER_ORIGIN } from "../../utilities/constants";

// todo: cred validation on frontend

///////////////////////////////////////////////////////////////////////////////////////////////
const LoginPage = () => {
    const [creds, setCreds] = useState({ adminId: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            const adminId = process.env.REACT_APP_ADMIN_ID;
            const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;
            const basicAuth = btoa(`${adminId}:${adminPassword}`);
            const response = await fetch(
                `${SERVER_ORIGIN}/api/admin/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Basic ${basicAuth}`,
                    },
                    body: JSON.stringify(creds),
                }
            );

            const result = await response.json();

            setIsLoading(false);

            if (response.status >= 400 && response.status < 600) {
                if (response.status === 401) {
                    if (
                        !("areCredsInvalid" in result) ||
                        result.areCredsInvalid === true
                    ) {
                        toast.error(result.statusText);
                    }
                } else {
                    toast.error(result.statusText);
                }
            } else if (response.ok && response.status === 200) {
                if ("token" in result) {
                    const token = result.token;
                    localStorage.setItem("token", token);
                    navigate("/admin/manage-users");
                }
            } else {
                // for future
            }
        } catch (error) {
            setIsLoading(false);
        }
    };

    const updateCreds = (e) => {
        setCreds((prevCreds) => {
            const newCreds = { ...prevCreds, [e.target.name]: e.target.value };
            // (newCreds);

            return newCreds;
        });
    };

    return (
        <div
            className={
                "flex items-center w-full justify-between px-14 lg:px-pima-x flex-1"
            }
        >
            <LoginForm
                role="admin"
                adminId={creds.adminId}
                password={creds.password}
                onChange={updateCreds}
                onClick={handleSubmit}
                isBtnDisabled={isLoading}
            />
            <img
                src={loginImg}
                alt="login"
                className={`hidden lg:block w-1/2`}
            />
        </div>
    );
};

export default LoginPage;
