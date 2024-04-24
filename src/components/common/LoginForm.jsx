import { useState } from "react";
import { Link } from "react-router-dom";
import Spinloader from "./Spinloader";

// My css
// ! Disable login button when loading by creating isLoading state, so user cannot press it again and again

import { validation } from "../../utilities/constants";

export const LoginForm = (props) => {
    const [modal, setModalOpen] = useState(false);
    const [loader, setLoader] = useState(false);
    const [emailSuccess, setEmailSuccess] = useState(false);

    const handleChange = (e) => {
        props.onChange(e); // Need to pass the whole event, passing updatedField just gives the last entered character of the input
    };

    const handleLogInClick = () => {
        props.onClick();
    };

    function handleForgotPassClick() {
        setTimeout(() => {
            setModalOpen(true);
        }, 1000);

        setLoader(true);
        setTimeout(() => {
            setLoader(false);
        }, 1000);
    }

    function handleModalClose() {
        setModalOpen(false);
        setEmailSuccess(false);
    }

    function handleSubmitClick() {
        if (Response.code === 200) setEmailSuccess(true);
    }

    // const modalStyles = {
    //     content: {
    //         position: "relative",
    //         width: "30rem",
    //         height: "30rem",
    //         backgroundColor: "red",
    //         left: "30vw",
    //         top: "10%",
    //     },
    // };

    return (
        <div className="flex-1 justify-center flex">
            <div className="w-full justify-center flex">
                <form className="w-full max-w-[500px]">
                    <h1
                        className={`font-inter font-extrabold text-5xl text-center`}
                    >
                        {props.role === "user" ? "User" : "Admin"} Login
                    </h1>
                    <div className="mt-12 flex flex-col gap-6">
                        <input
                            className={
                                "w-full px-5 py-3.5 bg-[#efefef] rounded placeholder:text-[#5a5a5a]"
                            }
                            type="text"
                            placeholder={
                                props.role === "user"
                                    ? "UserId / Email"
                                    : "Admin Id"
                            }
                            name={props.role === "user" ? "userId" : "adminId"}
                            value={
                                props.role === "user"
                                    ? props.userId
                                    : props.adminId
                            }
                            onChange={handleChange}
                            maxLength={validation.authForm.userId.maxLen}
                            autoComplete="off"
                        />

                        <input
                            className={
                                "w-full px-5 py-3.5 bg-[#efefef] rounded placeholder:text-[#5a5a5a]"
                            }
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={props.password}
                            onChange={handleChange}
                            maxLength={validation.authForm.password.maxLen}
                            autoComplete="off"
                        />
                        <button
                            className={`w-full text-center py-3.5 border-2 bg-pima-red hover:bg-white hover:text-pima-red hover:border-2 border-pima-red transition-all duration-150 text-white rounded font-medium`}
                            onClick={handleLogInClick}
                            disabled={props.isBtnDisabled}
                        >
                            {props.isBtnDisabled ? "Logging in..." : "LOGIN"}
                        </button>
                    </div>
                    {props.role === "user" ? (
                        <div className="flex items-center w-full gap-2 justify-center mt-3.5 text-sm">
                            <p className={"text-center"}>Are you an Admin?</p>
                            <Link className={`text-pima-red underline font-semibold`} to="/admin/login">
                                Login
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center w-full gap-2 justify-center mt-3.5 text-sm">
                            <p className={"text-sm"}>Are you a User?</p>
                            <Link className={`text-pima-red underline font-semibold`} to="/user/login">
                                Login
                            </Link>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};
