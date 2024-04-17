import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// My components
import { LoginForm } from "../../components/common/LoginForm";

// My css
import loginCss from "../../css/common/login-page.module.css";

import logo from "../../assets/images/yuva_logo.png";
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
            // (response);

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
                    navigate("/admin/services");
                }
            } else {
                // for future
            }
        } catch (error) {}
    };

    const updateCreds = (e) => {
        setCreds((prevCreds) => {
            const newCreds = { ...prevCreds, [e.target.name]: e.target.value };
            // (newCreds);

            return newCreds;
        });
    };

    return (
        <div className={"flex items-center mt-4 w-full justify-between px-14 lg:px-pima-x"}>
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
                className={`${loginCss.loginImg} hidden lg:block xl:w-[56rem] w-[48rem]`}
            />
        </div>
    );
};

export default LoginPage;
