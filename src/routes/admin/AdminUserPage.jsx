import { useEffect, useState } from "react";
import { SERVER_ORIGIN } from "../../utilities/constants";
import { toast } from "react-hot-toast";

import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/common/Loader";
import { NewspaperIcon } from "@heroicons/react/24/outline";


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
                <div className="px-pima-x py-pima-y flex gap-10">
                    <div className="w-full border p-6 rounded-[5px] text-center relative">
                        {/* <img
                            src={userPP}
                            alt=""
                            className="w-[60px] absolute top-0 -translate-y-1/2 right-1/2 translate-x-1/2 bg-white  rounded-full p-2"
                        /> */}
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold">
                                {capitalizeFirstLetter(user?.fName)}{" "}
                                {capitalizeFirstLetter(user?.lName)}
                            </h1>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between">
                                <span className="font-semibold">User Id</span>
                                <span className="text-right text-[#696969]">
                                    #{user?.userId}
                                </span>
                            </div>
                            <div className="bg-[#e4e4e4] w-full h-[1px]"></div>
                            <div className="flex justify-between">
                                <span className="font-semibold">Email</span>
                                <span className="text-right text-[#696969]">
                                    {user?.email}
                                </span>
                            </div>
                            <div className="bg-[#e4e4e4] w-full h-[1px]"></div>
                            <div className="flex justify-between">
                                <span className="font-semibold">Password</span>
                                <span className="text-right text-[#696969]">
                                    {user?.password}
                                </span>
                            </div>
                            <div className="bg-[#e4e4e4] w-full h-[1px]"></div>
                            <div className="flex justify-between">
                                <span className="font-semibold">
                                    Mobile No.
                                </span>
                                <span className="text-right text-[#696969]">
                                    {user?.phone}
                                </span>
                            </div>
                            <div className="bg-[#e4e4e4] w-full h-[1px]"></div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminUserPage;
