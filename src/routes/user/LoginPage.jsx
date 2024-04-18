import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// My components
import { LoginForm } from "../../components/common/LoginForm";

// My css
import loginCss from "../../css/common/login-page.module.css";

import loginImg from "../../assets/images/loginImg.jpg";
import { SERVER_ORIGIN } from "../../utilities/constants";

// todo: validation of creds on frontend side

///////////////////////////////////////////////////////////////////////////////////////////////////////////
const LoginPage = () => {
    const params = useLocation();
    const [creds, setCreds] = useState({ userId: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        // as of now there's no login form validation
        setIsLoading(true);

        try {
            const userId = process.env.REACT_APP_USER_ID;
            const userPassword = process.env.REACT_APP_USER_PASSWORD;
            const basicAuth = btoa(`${userId}:${userPassword}`);
            const response = await fetch(
                `${SERVER_ORIGIN}/api/user/auth/login`,
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
            // (response);

            setIsLoading(false);

            if (response.status >= 400 && response.status < 600) {
                if (response.status === 401) {
                    toast.error(result.statusText);
                } else {
                    toast.error(result.statusText);
                }
            } else if (response.ok && response.status === 200) {
                if ("token" in result) {
                    const token = result.token;
                    localStorage.setItem("token", token);
                    navigate("/");
                }
            } else {
                // for future
            }
        } catch (err) {}
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
                role="user"
                userId={creds.userId}
                password={creds.password}
                onChange={updateCreds}
                onClick={handleSubmit}
                isBtnDisabled={isLoading}
            />
            <img
                src={loginImg}
                alt="login"
                className={`${loginCss.loginImg} hidden lg:block w-1/2`}
            />
        </div>
    );
};

export default LoginPage;
