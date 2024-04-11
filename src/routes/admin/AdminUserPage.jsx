import React, { useEffect, useState } from "react";
import { SERVER_ORIGIN, validation } from "../../utilities/constants";
import { toast } from "react-hot-toast";

import css from "../../css/admin/user-single-page.module.css";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/common/Loader";

function capitalizeFirstLetter(str) {
    return str?.charAt(0).toUpperCase() + str?.substr(1);
}

const AdminUserPage = () => {
    const params = useParams();
    const { userId } = params;
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    let keys = [];

    if (!isLoading && user) {
        keys = Object.keys(user?.activity);
    }

    const navigate = useNavigate();

    useEffect(() => {
        async function getAllUsers() {
            try {
                const adminId = process.env.REACT_APP_ADMIN_ID;
                const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;
                const basicAuth = btoa(`${adminId}:${adminPassword}`);
                const response = await fetch(
                    `${SERVER_ORIGIN}/api/admin/auth/users/${userId}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Basic ${basicAuth}`, // Include Basic Authentication
                            "auth-token": localStorage.getItem("token"),
                        },
                    }
                );

                const result = await response.json();

                if (response.status >= 400 && response.status < 600) {
                    if (response.status === 401) {
                        navigate("/admin/login");
                    } else if (response.status === 500) {
                        toast.error(result.statusText);
                    }
                } else if (response.ok && response.status === 200) {
                    setUser(result.user);
                    setIsLoading(false);
                } else {
                    // for future
                }
            } catch (err) {
                // (err.message);
                setIsLoading(false);
            }
        }

        getAllUsers();
    }, [userId, navigate]);

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div className={css.outerDiv}>
                    <div className={css.userDetailsDiv}>
                        <div className={css.userHeading}>
                            <h1>
                                {capitalizeFirstLetter(user?.fName)}{" "}
                                {capitalizeFirstLetter(user?.lName)}
                            </h1>
                        </div>
                        <div className={css.allUserInfo}>
                            <div className={css.userInfo}>
                                <span className={css.userInfoHeading}>
                                    User Id
                                </span>
                                <span className={css.userInfoDesc}>
                                    #{user?.userId}
                                </span>
                            </div>
                            <div className={css.hr}></div>
                            <div className={css.userInfo}>
                                <span className={css.userInfoHeading}>
                                    Email
                                </span>
                                <span className={css.userInfoDesc}>
                                    {user?.email}
                                </span>
                            </div>
                            <div className={css.hr}></div>
                            <div className={css.userInfo}>
                                <span className={css.userInfoHeading}>
                                    Mobile No.
                                </span>
                                <span className={css.userInfoDesc}>
                                    {user?.phone}
                                </span>
                            </div>
                            <div className={css.hr}></div>

                            <div className={css.userInfo}>
                                <span className={css.userInfoHeading}>
                                    Branch
                                </span>
                                <span className={css.userInfoDesc}>
                                    {user?.branch}
                                </span>
                            </div>
                            <div className={css.hr}></div>

                            <div className={css.userInfo}>
                                <span className={css.userInfoHeading}>
                                    College Name
                                </span>
                                <span className={css.userInfoDesc}>
                                    {user?.collegeName}
                                </span>
                            </div>
                            <div className={css.hr}></div>

                            <div className={css.userInfo}>
                                <span className={css.userInfoHeading}>
                                    Address
                                </span>
                                <span className={css.userInfoDesc}>
                                    <span>{user?.addLine1}</span>
                                    <span>{user?.addLine2}</span>
                                </span>
                            </div>
                            <div className={css.hr}></div>

                            <div className={css.userInfo}>
                                <span className={css.userInfoHeading}>
                                    City
                                </span>
                                <span className={css.userInfoDesc}>
                                    {user?.city}
                                </span>
                            </div>
                            <div className={css.hr}></div>

                            <div className={css.userInfo}>
                                <span className={css.userInfoHeading}>
                                    Pincode
                                </span>
                                <span className={css.userInfoDesc}>
                                    {user?.pincode}
                                </span>
                            </div>
                            <div className={css.hr}></div>

                            <div className={css.userInfo}>
                                <span className={css.userInfoHeading}>
                                    Region
                                </span>
                                <span className={css.userInfoDesc}>
                                    {user?.region}
                                </span>
                            </div>
                            <div className={css.hr}></div>

                            <div className={css.userInfo}>
                                <span className={css.userInfoHeading}>
                                    Country
                                </span>
                                <span className={css.userInfoDesc}>
                                    {user?.country}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className={css.userCertDiv}>
                        <div className={css.userCertHeading}>
                            <h1>Certifications Unlocked</h1>
                        </div>
                        <div className={css.userCertCount}>
                            {keys.map((k) => (
                                <>
                                    <div className={css.userCertItem}>
                                        <span
                                            className={css.userCertItemHeading}
                                        >
                                            {k}
                                        </span>
                                        <span className={css.userCertDesc}>
                                            {user?.activity[k]}
                                        </span>
                                    </div>
                                    <div className={css.hr}></div>
                                </>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminUserPage;
