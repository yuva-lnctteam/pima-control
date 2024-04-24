import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/common/Loader";
import { SERVER_ORIGIN, validation } from "../../utilities/constants";
import toast from "react-hot-toast";

function capitalizeFirstLetter(str) {
    return str?.charAt(0).toUpperCase() + str?.substr(1);
}

const UserProfile = () => {
    const navigate = useNavigate();
    useState(false);
    const params = useParams();
    const { userId } = params;
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [verticalData, setVerticalData] = useState([]);

    useEffect(() => {
        async function getUser() {
            try {
                const userId = process.env.REACT_APP_USER_ID;
                const userPassword = process.env.REACT_APP_USER_PASSWORD;
                const basicAuth = btoa(`${userId}:${userPassword}`);
                const response = await fetch(
                    `${SERVER_ORIGIN}/api/user/auth/profile`,
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
                    setUser(result?.data?.user);
                    setVerticalData(result?.data.allVerticalsData);
                    console.log(result);
                    setIsLoading(false);
                } else {
                    // for future
                }
            } catch (err) {
                // (err.message);
                setIsLoading(false);
            }
        }
        getUser();
    }, [userId, navigate]);

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div className={`px-pima-x py-pima-y flex flex-col gap-10`}>
                    <div className="w-full relative">
                        <div className="flex gap-4 mb-6 items-center">
                            <img
                                src="https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png"
                                className="w-[60px] border rounded-full p-2"
                                alt=""
                            />
                            <h1 className="text-3xl font-extrabold">
                                {capitalizeFirstLetter(user?.fName)}{" "}
                                {capitalizeFirstLetter(user?.lName)}
                            </h1>
                        </div>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-3 border p-6 rounded-[5px]">
                                <div className="flex justify-between gap-4">
                                    <span className="font-semibold">
                                        User Id
                                    </span>
                                    <span className="text-right text-[#434343]">
                                        #{user?.userId}
                                    </span>
                                </div>
                                <div className="bg-[#e4e4e4] w-full h-[1px]"></div>
                                <div className="flex justify-between">
                                    <span className="font-semibold">Email</span>
                                    <span className="text-right text-[#434343]">
                                        {user?.email}
                                    </span>
                                </div>
                                <div className="bg-[#e4e4e4] w-full h-[1px]"></div>
                                <div className="flex justify-between gap-4">
                                    <span className="font-semibold">
                                        Password
                                    </span>
                                    <span className="text-right text-[#434343]">
                                        {user?.password}
                                    </span>
                                </div>
                                <div className="bg-[#e4e4e4] w-full h-[1px]"></div>
                                <div className="flex justify-between">
                                    <span className="font-semibold">
                                        Mobile No.
                                    </span>
                                    <span className="text-right text-[#434343]">
                                        {user?.phone}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 border p-6 rounded-[5px]">
                                {verticalData.map((vertical, index) => (
                                    <div></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserProfile;
