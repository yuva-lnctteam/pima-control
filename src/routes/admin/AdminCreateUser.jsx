import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SERVER_ORIGIN } from "../../utilities/constants";

const AdminCreateUser = () => {
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    // useEffect(() => {
    //     async function canVisitPage() {
    //         setIsLoading(true);

    //         try {
    //             const adminId = process.env.REACT_APP_ADMIN_ID;
    //             const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;
    //             const basicAuth = btoa(`${adminId}:${adminPassword}`);
    //             const response = await fetch(
    //                 `${SERVER_ORIGIN}/api/admin/auth/verify-token`,
    //                 {
    //                     method: "POST",
    //                     headers: {
    //                         "Content-Type": "application/json",
    //                         "auth-token": localStorage.getItem("token"),
    //                         Authorization: `Basic ${basicAuth}`,
    //                     },
    //                 }
    //             );

    //             const result = await response.json();
    //             // (result);

    //             if (response.status >= 400 && response.status < 600) {
    //                 if (response.status === 401) {
    //                     navigate("/admin/login");
    //                 }
    //             } else if (response.ok && response.status === 200) {
    //             } else {
    //                 // for future
    //             }
    //         } catch (err) {
    //             // (err.message);
    //         }

    //         setIsLoading(false);
    //     }

    //     canVisitPage();
    // }, []);

    return (
        <div className="create-user flex flex-col gap-6 w-full justify-center mt-14 px-14 lg:px-pima-x">
            <h3 className="text-5xl font-bold text-center">Create User</h3>
            <form className="flex flex-col gap-8 justify-center">
                <div className="flex gap-8 justify-center flex-col md:flex-row mt-8">
                    <input
                        type="text"
                        placeholder="First Name"
                        className={
                            "w-full max-w-[700px] px-5 py-5 bg-[#efefef] rounded placeholder:text-[#5a5a5a]"
                        }
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        className={
                            "w-full px-5 py-5 max-w-[700px] bg-[#efefef] rounded placeholder:text-[#5a5a5a]"
                        }
                    />
                </div>
                <div className="flex gap-8 justify-center flex-col md:flex-row">
                    <input
                        type="email"
                        placeholder="Email"
                        className={
                            "w-full px-5 max-w-[700px] py-5 bg-[#efefef] rounded placeholder:text-[#5a5a5a]"
                        }
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className={
                            "w-full px-5 py-5 max-w-[700px] bg-[#efefef] rounded placeholder:text-[#5a5a5a]"
                        }
                    />
                </div>
                <div className="flex gap-8 justify-center flex-col md:flex-row">
                    <input
                        type="text"
                        placeholder="Phone Number"
                        className={
                            "w-full px-5 py-5 max-w-[700px] bg-[#efefef] rounded placeholder:text-[#5a5a5a]"
                        }
                    />
                    <input
                        type="text"
                        placeholder="Job Position"
                        className={
                            "w-full px-5 py-5 max-w-[700px] bg-[#efefef] rounded placeholder:text-[#5a5a5a]"
                        }
                    />
                </div>

                <button
                    className={`w-full max-w-[600px] self-center text-center py-4 bg-pima-red hover:bg-[#f14c52] transition-all duration-150 text-white rounded mt-8`}
                >
                    Register User
                </button>
            </form>
        </div>
    );
};

export default AdminCreateUser;
