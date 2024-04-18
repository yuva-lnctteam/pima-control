import React, { useState } from "react";
import { Link } from "react-router-dom";
import Spinloader from "./Spinloader";

// My css
import css from "../../css/common/login-form.module.css";
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
                {/* {modal && <Modal isOpen={modal} style={modalStyles} />} */}
                {modal ? (
                    <div className={css.loginModal}>
                        <p className={css.passHeading}>Recover Password</p>
                        {/* <label htmlFor="newPassEmail"> */}
                        <input
                            type="email"
                            name=""
                            id="newPassEmail"
                            placeholder="Recovery E-mail"
                            className={css.forgotPassInput}
                        />
                        {emailSuccess && (
                            <p className={css.EmailSuccessText}>
                                A mail has been sent to your e-mail address.
                            </p>
                        )}
                        {/* </label> */}
                        <div className={css.forgotPassBtnWrapper}>
                            <button
                                className={css.forgotPassCancelBtn}
                                onClick={handleModalClose}
                            >
                                Cancel
                            </button>
                            <button
                                className={css.forgotPassBtn}
                                onClick={handleSubmitClick}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                ) : (
                    <form className="w-full max-w-[500px]">
                        <h1 className={`font-inter font-extrabold text-5xl text-center`}>
                            Login
                        </h1>
                        <div className="mt-12 flex flex-col gap-6">
                            <input
                                className={"w-full px-5 py-5 bg-[#efefef] rounded placeholder:text-[#5a5a5a]"}
                                type="text"
                                placeholder={
                                    props.role === "user"
                                        ? "UserId / Email"
                                        : "Admin Id"
                                }
                                name={
                                    props.role === "user" ? "userId" : "adminId"
                                }
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
                                className={"w-full px-5 py-5 bg-[#efefef] rounded placeholder:text-[#5a5a5a]"}
                                type="password"
                                placeholder="Password"
                                name="password"
                                value={props.password}
                                onChange={handleChange}
                                maxLength={validation.authForm.password.maxLen}
                                autoComplete="off"
                            />

                        {loader && (
                            <div className={css.forgotPassLoaderWrapper}>
                                <div className={css.forgotPassLoader}>
                                    <Spinloader />
                                </div>
                            </div>
                        )}
                        <button
                            className={`w-full text-center py-4 bg-pima-red hover:bg-[#f14c52] transition-all duration-150 text-white rounded`}
                            onClick={handleLogInClick}
                            disabled={props.isBtnDisabled}
                        >
                            {props.isBtnDisabled ? "Logging in..." : "LOGIN"}
                        </button>
                        </div>
                        {props.role === "user" ? (
                            <div className="flex items-center w-full gap-2 justify-center mt-6">
                                <p className={"text-center"}>
                                    Is Admin?
                                </p>
                                <Link
                                    className={`font-bold`}
                                    to="/admin/login"
                                >
                                    LOGIN
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center w-full gap-2 justify-center mt-6">
                                <p className={"text-sm"}>
                                    Is User?
                                </p>
                                <Link
                                    className={`font-bold`}
                                    to="/user/login"
                                >
                                    LOGIN
                                </Link>
                            </div>
                        )}
                    </form>
                )}
            </div>
        </div>
    );
};
