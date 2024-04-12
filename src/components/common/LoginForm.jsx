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
        <div className="loginWrapper">
            <div className={css.outerDiv}>
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
                    <div>
                        <p className={css.heading}>Login</p>
                        <input
                            className={css.input}
                            type="text"
                            placeholder={
                                props.role === "user"
                                    ? "Username or Email"
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
                            className={css.input}
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={props.password}
                            onChange={handleChange}
                            maxLength={validation.authForm.password.maxLen}
                            autoComplete="off"
                        />

                        <Link
                            onClick={handleForgotPassClick}
                            className={css.forgotPassText}
                        >
                            Forgot Password
                        </Link>
                        {loader && (
                            <div className={css.forgotPassLoaderWrapper}>
                                <div className={css.forgotPassLoader}>
                                    <Spinloader />
                                </div>
                            </div>
                        )}
                        <button
                            className={css.btn}
                            onClick={handleLogInClick}
                            disabled={props.isBtnDisabled}
                        >
                            {props.isBtnDisabled ? "Logging in..." : "Login"}
                        </button>
                        {props.role === "user" ? (
                            <>
                                <p className={css.forgotPassText}>
                                    Are you an Admin?
                                </p>
                                <Link
                                    className={css.registerText}
                                    to="/admin/login"
                                >
                                    Login
                                </Link>
                            </>
                        ) : <>
                                <p className={css.forgotPassText}>
                                    Are you an User?
                                </p>
                                <Link
                                    className={css.registerText}
                                    to="/user/login"
                                >
                                    Login
                                </Link>
                            </>}
                    </div>
                )}
            </div>
        </div>
    );
};
