import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

// My components
import SecCard from "../../components/common/SecCard";

// My css
import regisCss from "../../css/user/regis-page.module.css";

import { SERVER_ORIGIN, validation } from "../../utilities/constants";
import { isRegisFormValid } from "../../utilities/helper_functions";

const GreenMsg = (props) => {
    return (
        <>
            {" "}
            |{" "}
            <span style={{ color: "green", fontWeight: "600" }}>
                {props.children}
            </span>
        </>
    );
};

const RedMsg = (props) => {
    return (
        <>
            {" "}
            |{" "}
            <span style={{ color: "red", fontWeight: "600" }}>
                {props.children}
            </span>
        </>
    );
};

const UserRegis = (props) => {
    const [regisForm, setRegisForm] = useState({
        userId: "",
        password: "",
        cnfrmPassword: "",
        email: "",
        fName: "",
        mName: "",
        lName: "",
        collegeName: "",
        region: "",
        branch: "",
        phone: "",
        addLine1: "",
        addLine2: "",
        city: "",
        pincode: "",
        country: "",
    });

    const navigate = useNavigate();

    const [isRegistering, setIsRegistering] = useState(false);
    const [isBtnDisabled, setIsBtnDisabled] = useState(false);

    const [isUserIdAvailable, setIsUserIdAvailable] = useState(false);
    const [wasUserIdAvailabilityChecked, setWasUserIdAvailabilityChecked] =
        useState(false);
    let userIdAvailabilityCheckTimer = null;
    const userIdAvailabilityCheckDelayInMilliSec = 1000;

    const checkUserIdAvailability = async () => {
        // ("checking user id availability");
        if (regisForm.userId === "") {
            return;
        }

        try {
            const userId = process.env.REACT_APP_USER_ID;
            const userPassword = process.env.REACT_APP_USER_PASSWORD;
            const basicAuth = btoa(`${userId}:${userPassword}`);
            const response = await fetch(
                `${SERVER_ORIGIN}/api/user/auth/check-userid-availability`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Basic ${basicAuth}`,
                    },
                    body: JSON.stringify({ userId: regisForm.userId }),
                }
            );

            const result = await response.json();
            // (result);
            if (response.status >= 400 && response.status < 600) {
                if (response.status === 500) {
                    toast.error(result.statusText); // todo: toast notify
                }
            } else if (response.ok && response.status === 200) {
                setWasUserIdAvailabilityChecked(true);
                setIsUserIdAvailable(result.isUserIdAvailable);
            } else {
                // for future
            }
        } catch (err) {
            // (err.message);
        }
    };

    const handleRegisterClick = async () => {
        // todo: trim fields, validate
        // (regisForm);
        const { isValid, desc } = isRegisFormValid(regisForm);
        if (!isValid) {
            toast.error(desc);
            return;
        }

        try {
            setIsRegistering(true);
            setIsBtnDisabled(true);
            const userId = process.env.REACT_APP_USER_ID;
            const userPassword = process.env.REACT_APP_USER_PASSWORD;
            const basicAuth = btoa(`${userId}:${userPassword}`);

            const response = await fetch(
                `${SERVER_ORIGIN}/api/user/auth/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Basic ${basicAuth}`,
                    },
                    body: JSON.stringify(regisForm),
                }
            );

            const result = await response.json();
            // (response);
            // (result);

            setIsRegistering(false);
            setIsBtnDisabled(false);

            if (response.status >= 400 && response.status < 600) {
                if (response.status === 500) {
                    toast.error(result.statusText); // todo: toast notify
                    setIsBtnDisabled(false); // can reclick on register btn
                } else if (response.status === 403) {
                    toast.error(result.statusText);
                }
            } else if (response.ok && response.status === 200) {
                toast.success(result.statusText); // registered therefore regis btn remains disabled
                navigate("/user/login");
            } else {
                // for future
            }
        } catch (err) {
            // (err.message);
            setIsBtnDisabled(false); // can reclick on register btn
        }
    };

    const onChange = (e) => {
        setRegisForm((prevregisForm) => {
            const newregisForm = {
                ...prevregisForm,
                [e.target.name]: e.target.value,
            };
            // (newregisForm);

            return newregisForm;
        });
    };

    const UserIdAvailabilityMsg = (props) => {
        return wasUserIdAvailabilityChecked ? (
            isUserIdAvailable ? (
                <GreenMsg>Available</GreenMsg>
            ) : (
                <RedMsg>Not available</RedMsg>
            )
        ) : null;
    };

    return (
        <div className={regisCss.outerDiv}>
            <SecCard>
                <h2 className="text-ff1">Registration</h2>

                <div className="text-ff2" autoComplete="off">
                    <div style={{ marginBottom: "0.8rem" }}>
                        <label className={regisCss.regisLabel} htmlFor="userId">
                            User ID <span style={{ color: "red" }}>*</span>{" "}
                            <UserIdAvailabilityMsg />
                        </label>
                        <input
                            className={regisCss.regisInput}
                            type="text"
                            id="userId"
                            name="userId"
                            placeholder="Enter a unique username"
                            autoComplete="off"
                            maxLength={validation.authForm.userId.maxLen}
                            value={regisForm.userId}
                            onChange={onChange}
                            onKeyDown={() => {
                                clearTimeout(userIdAvailabilityCheckTimer);
                                setWasUserIdAvailabilityChecked(false);
                            }}
                            onKeyUp={() => {
                                clearTimeout(userIdAvailabilityCheckTimer);
                                userIdAvailabilityCheckTimer = setTimeout(
                                    checkUserIdAvailability,
                                    userIdAvailabilityCheckDelayInMilliSec
                                );
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: "0.8rem" }}>
                        <label
                            className={regisCss.regisLabel}
                            htmlFor="password"
                        >
                            Password <span style={{ color: "red" }}>*</span> |{" "}
                            <span
                                className={regisCss.passPolicy}
                                onClick={() => {
                                    toast(
                                        `${validation.authForm.password.policy}`,
                                        {
                                            duration: 5000,
                                        }
                                    );
                                }}
                            >
                                View password policy
                            </span>
                        </label>
                        <input
                            className={regisCss.regisInput}
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter a strong password"
                            autoComplete="off"
                            maxLength={validation.authForm.password.maxLen}
                            value={regisForm.password}
                            onChange={onChange}
                        />
                    </div>

                    <div style={{ marginBottom: "0.8rem" }}>
                        <label
                            className={regisCss.regisLabel}
                            htmlFor="cnfrmPassword"
                        >
                            Confirm Password{" "}
                            <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            className={regisCss.regisInput}
                            type="password"
                            id="cnfrmPassword"
                            name="cnfrmPassword"
                            placeholder="Confirm the password you've entered"
                            autoComplete="off"
                            maxLength={validation.authForm.cnfrmPassword.maxLen}
                            value={regisForm.cnfrmPassword}
                            onChange={onChange}
                        />
                    </div>

                    <div style={{ marginBottom: "0.8rem" }}>
                        <label className={regisCss.regisLabel} htmlFor="email">
                            Email <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            className={regisCss.regisInput}
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            value={regisForm.email}
                            onChange={onChange}
                            autoComplete="off"
                        />
                    </div>

                    <div style={{ marginBottom: "0.8rem" }}>
                        <label className={regisCss.regisLabel} htmlFor="fName">
                            First name <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            className={regisCss.regisInput}
                            type="text"
                            id="fName"
                            name="fName"
                            placeholder="Enter your first name"
                            autoComplete="off"
                            maxLength={validation.authForm.fName.maxLen}
                            value={regisForm.fName}
                            onChange={onChange}
                        />
                    </div>

                    <div style={{ marginBottom: "0.8rem" }}>
                        <label className={regisCss.regisLabel} htmlFor="mName">
                            Middle name
                        </label>
                        <input
                            className={regisCss.regisInput}
                            type="text"
                            id="mName"
                            name="mName"
                            placeholder="Enter your middle name"
                            autoComplete="off"
                            maxLength={validation.authForm.mName.maxLen}
                            value={regisForm.mName}
                            onChange={onChange}
                        />
                    </div>

                    <div style={{ marginBottom: "0.8rem" }}>
                        <label className={regisCss.regisLabel} htmlFor="lName">
                            Last name <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            className={regisCss.regisInput}
                            type="text"
                            id="lName"
                            name="lName"
                            placeholder="Enter your last name"
                            autoComplete="off"
                            maxLength={validation.authForm.lName.maxLen}
                            value={regisForm.lName}
                            onChange={onChange}
                        />
                    </div>

                    <div style={{ marginBottom: "0.8rem" }}>
                        <label
                            className={regisCss.regisLabel}
                            htmlFor="collegeName"
                        >
                            College name
                        </label>
                        <input
                            className={regisCss.regisInput}
                            type="text"
                            id="collegeName"
                            name="collegeName"
                            placeholder="Enter your college name"
                            autoComplete="off"
                            maxLength={validation.authForm.collegeName.maxLen}
                            value={regisForm.collegeName}
                            onChange={onChange}
                        />
                    </div>

                    <div style={{ marginBottom: "0.8rem" }}>
                        <label className={regisCss.regisLabel} htmlFor="region">
                            Region
                        </label>
                        <input
                            className={regisCss.regisInput}
                            type="text"
                            id="region"
                            name="region"
                            placeholder="Region"
                            autoComplete="off"
                            maxLength={validation.authForm.region.maxLen}
                            value={regisForm.region}
                            onChange={onChange}
                        />
                    </div>

                    <div style={{ marginBottom: "0.8rem" }}>
                        <label className={regisCss.regisLabel} htmlFor="branch">
                            Branch
                        </label>
                        <input
                            className={regisCss.regisInput}
                            type="text"
                            id="branch"
                            name="branch"
                            placeholder="Enter your branch"
                            autoComplete="off"
                            maxLength={validation.authForm.branch.maxLen}
                            value={regisForm.branch}
                            onChange={onChange}
                        />
                    </div>

                    <div style={{ marginBottom: "0.8rem" }}>
                        <label className={regisCss.regisLabel} htmlFor="phone">
                            Phone <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            className={regisCss.regisInput}
                            type="tel"
                            id="phone"
                            name="phone"
                            placeholder="Enter your phone number"
                            autoComplete="off"
                            maxLength={validation.authForm.phone.maxLen}
                            value={regisForm.phone}
                            onChange={onChange}
                        />
                    </div>

                    <div style={{ marginBottom: "0.8rem" }}>
                        <label
                            className={regisCss.regisLabel}
                            htmlFor="addLine1"
                        >
                            Address line 1
                        </label>
                        <input
                            className={regisCss.regisInput}
                            type="text"
                            id="addLine1"
                            name="addLine1"
                            placeholder="Address line 1"
                            autoComplete="off"
                            maxLength={validation.authForm.addLine1.maxLen}
                            pattern="[0-9]{3} [0-9]{3} [0-9]{4}"
                            value={regisForm.addLine1}
                            onChange={onChange}
                        />
                    </div>

                    <div style={{ marginBottom: "0.8rem" }}>
                        <label
                            className={regisCss.regisLabel}
                            htmlFor="addLine2"
                        >
                            Address line 2
                        </label>
                        <input
                            className={regisCss.regisInput}
                            type="text"
                            id="addLine2"
                            name="addLine2"
                            placeholder="Address line 2"
                            autoComplete="off"
                            maxLength={validation.authForm.addLine2.maxLen}
                            value={regisForm.addLine2}
                            onChange={onChange}
                        />
                    </div>

                    <div style={{ marginBottom: "0.8rem" }}>
                        <label className={regisCss.regisLabel} htmlFor="city">
                            City
                        </label>
                        <input
                            className={regisCss.regisInput}
                            type="text"
                            id="city"
                            name="city"
                            placeholder="Enter your city name"
                            autoComplete="off"
                            maxLength={validation.authForm.city.maxLen}
                            value={regisForm.city}
                            onChange={onChange}
                        />
                    </div>

                    <div style={{ marginBottom: "0.8rem" }}>
                        <label
                            className={regisCss.regisLabel}
                            htmlFor="pincode"
                        >
                            Pincode
                        </label>
                        <input
                            className={regisCss.regisInput}
                            type="text"
                            id="pincode"
                            name="pincode"
                            placeholder="Enter your city's pincode"
                            autoComplete="off"
                            maxLength={validation.authForm.pincode.maxLen}
                            value={regisForm.pincode}
                            onChange={onChange}
                        />
                    </div>

                    <div style={{ marginBottom: "0.8rem" }}>
                        <label
                            className={regisCss.regisLabel}
                            htmlFor="country"
                        >
                            Country
                        </label>
                        <input
                            className={regisCss.regisInput}
                            type="text"
                            id="country"
                            name="country"
                            placeholder="Enter your country name"
                            autoComplete="off"
                            maxLength={validation.authForm.country.maxLen}
                            value={regisForm.country}
                            onChange={onChange}
                        />
                    </div>
                    <div style={{ textAlign: "center", marginTop: "2rem" }}>
                        <button
                            onClick={handleRegisterClick}
                            className={regisCss.regisBtn}
                            disabled={isBtnDisabled}
                        >
                            {isRegistering ? "Registering ..." : "Register"}
                        </button>
                    </div>
                </div>
            </SecCard>
        </div>
    );
};

export default UserRegis;
