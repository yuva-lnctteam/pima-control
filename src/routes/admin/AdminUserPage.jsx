import { useEffect, useState } from "react";
import { SERVER_ORIGIN, validation } from "../../utilities/constants";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/common/Loader";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { v4 } from "uuid";

function capitalizeFirstLetter(str) {
    return str?.charAt(0).toUpperCase() + str?.substr(1);
}

const AdminUserPage = () => {
    let index = 1;
    const navigate = useNavigate();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
        useState(false);
    const [resetPassword, setResetPassword] = useState("");
    const [confirmResetPassword, setConfirmResetPassword] = useState("");
    const params = useParams();
    const { userId } = params;
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [verticalData, setVerticalData] = useState([]);
    const [confirmText, setConfirmText] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [status, setStatus] = useState("Not started yet.");

    async function handleDeleteUser() {
        try {
            const adminId = process.env.REACT_APP_ADMIN_ID;
            const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;
            const basicAuth = btoa(`${adminId}:${adminPassword}`);
            const response = await fetch(
                `${SERVER_ORIGIN}/api/admin/auth/users/delete-user/${userId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": localStorage.getItem("token"),
                        Authorization: `Basic ${basicAuth}`,
                    },
                }
            );

            const result = await response.json();

            if (response.status >= 400 && response.status < 600) {
                if (response.status === 401) {
                    navigate("/admin/login"); // login or role issue
                } else if (response.status === 404) {
                    toast.error(result.statusText);
                } else if (response.status === 500) {
                    toast.error(result.statusText);
                }
            } else if (response.ok && response.status === 200) {
                toast.success("User deleted successfully");
                navigate("/admin/manage-users");
                // set fields in modal to empty if not refreshing scrn
            } else {
                // for future
            }
        } catch (error) {}
    }

    async function handleResetPassword() {
        if (resetPassword !== confirmResetPassword) {
            toast.error("Password does not match.");
            return;
        }

        try {
            const adminId = process.env.REACT_APP_ADMIN_ID;
            const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;
            const basicAuth = btoa(`${adminId}:${adminPassword}`);
            const response = await fetch(
                `${SERVER_ORIGIN}/api/admin/auth/users/reset-password/${userId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": localStorage.getItem("token"),
                        Authorization: `Basic ${basicAuth}`,
                    },
                    body: JSON.stringify({ password: resetPassword }),
                }
            );

            const result = await response.json();

            if (response.status >= 400 && response.status < 600) {
                if (response.status === 401) {
                    navigate("/admin/login"); // login or role issue
                } else if (response.status === 404) {
                    toast.error(result.statusText);
                } else if (response.status === 500) {
                    toast.error(result.statusText);
                }
            } else if (response.ok && response.status === 200) {
                toast.success("Password reset successfully");
                // set fields in modal to empty if not refreshing scrn
            } else {
                // for future
            }
            setIsResetPasswordModalOpen(false);
        } catch (error) {
            // (error.message);
        }
    }

    useEffect(() => {
        async function getUser() {
            try {
                setIsLoading(true);
                const adminId = process.env.REACT_APP_ADMIN_ID;
                const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;
                const basicAuth = btoa(`${adminId}:${adminPassword}`);
                const response = await fetch(
                    `${SERVER_ORIGIN}/api/admin/auth/users/profile/${userId}`,
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
                    setUser(result.data.user);
                    setVerticalData(result.data.allUnitsData);

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
                <div className="relative">
                    <AnimatePresence>
                        {isResetPasswordModalOpen && (
                            <motion.div
                                className="fixed bg-white flex flex-col items-center gap-6 border p-6 px-10 m-auto left-0 right-0 top-0 bottom-0 max-w-[900px] h-fit rounded-[5px] z-[999]"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <XMarkIcon
                                    className="w-6 h-6 absolute right-4 top-4 cursor-pointer"
                                    onClick={() =>
                                        setIsResetPasswordModalOpen(false)
                                    }
                                />
                                <h3 className="text-4xl font-bold text-center max-md:text-3xl">
                                    Reset Password
                                </h3>

                                <div className="flex flex-col gap-5 w-full items-center">
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        minLength={1}
                                        onChange={(e) =>
                                            setResetPassword(e.target.value)
                                        }
                                        value={resetPassword}
                                        autoComplete="off"
                                        className="w-full px-5 py-3 bg-[#efefef] rounded-[5px] placeholder:text-[#5a5a5a] placeholder:text-sm"
                                        placeholder="New Password"
                                    />
                                    <input
                                        type="text"
                                        id="desc"
                                        name="desc"
                                        onChange={(e) =>
                                            setConfirmResetPassword(
                                                e.target.value
                                            )
                                        }
                                        maxLength={
                                            validation.verticalModal.desc.maxLen
                                        }
                                        value={confirmResetPassword}
                                        autoComplete="off"
                                        className="w-full px-5 py-3 bg-[#efefef] rounded-[5px] placeholder:text-[#5a5a5a] placeholder:text-sm"
                                        placeholder="Confirm New Password"
                                    />
                                    <button
                                        onClick={handleResetPassword}
                                        type="button"
                                        className="px-8 border-2 bg-pima-red text-center hover:bg-white hover:text-pima-red hover:border-2 border-pima-red transition-all text-white rounded-[5px] flex w-fit py-2 uppercase font-semibold text-sm"
                                    >
                                        Reset Password
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <AnimatePresence>
                        {isDeleteModalOpen && (
                            <motion.div
                                className="fixed bg-white flex flex-col items-center gap-6 border p-6 px-10 m-auto left-0 right-0 top-0 bottom-0 max-w-[700px] h-fit rounded-[5px] z-[999]"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <XMarkIcon
                                    className="w-6 h-6 absolute right-4 top-4 cursor-pointer"
                                    onClick={() => setIsDeleteModalOpen(false)}
                                />
                                <h3 className="text-4xl font-bold text-center max-md:text-3xl">
                                    Confirm delete
                                </h3>

                                <div className="flex flex-col gap-5 w-full">
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        minLength={1}
                                        // maxLength={validation.verticalModal.name.maxLen}
                                        onChange={(e) =>
                                            setConfirmText(e.target.value)
                                        }
                                        value={confirmText}
                                        autoComplete="off"
                                        className="w-full px-5 py-3 bg-[#efefef] rounded-[5px] placeholder:text-[#5a5a5a] placeholder:text-sm"
                                        placeholder="Please type 'delete' to confirm deletion."
                                    />

                                    <button
                                        onClick={handleDeleteUser}
                                        disabled={
                                            confirmText !== "delete" ||
                                            deleteLoading
                                        }
                                        type="button"
                                        className={`w-fit px-10 text-center py-2.5 bg-pima-red hover:bg-[#f14c52] transition-all duration-150 text-white rounded-[5px] uppercase font-medium self-center text-sm ${
                                            confirmText !== "delete"
                                                ? "opacity-50 cursor-not-allowed"
                                                : ""
                                        }`}
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div
                        className={`p-6 md:px-pima-x md:py-pima-y flex flex-col gap-10  ${
                            isResetPasswordModalOpen || isDeleteModalOpen
                                ? "blur-lg pointer-events-none"
                                : ""
                        }`}
                    >
                        <div className="w-full relative">
                            {/* <img
                            src={userPP}
                            alt=""
                            className="w-[60px] absolute top-0 -translate-y-1/2 right-1/2 translate-x-1/2 bg-white  rounded-full p-2"
                        /> */}
                            <div className="flex gap-4 mb-6 items-center">
                                <img
                                    src={
                                        user?.image?.src ||
                                        "https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png"
                                    }
                                    className="w-[60px] h-[60px] border rounded-full object-cover"
                                    alt=""
                                />
                                <h1 className="text-3xl font-extrabold">
                                    {capitalizeFirstLetter(user?.fName)}{" "}
                                    {user?.mName &&
                                        capitalizeFirstLetter(user?.mName)}{" "}
                                    {capitalizeFirstLetter(user?.lName)}
                                </h1>
                            </div>
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col gap-3 border p-6 rounded-[5px]">
                                    <h1 className="text-2xl font-bold text-center mb-4">
                                        User Details
                                    </h1>
                                    <div className="flex justify-between md:flex-row flex-col md:gap-4">
                                        <span className="font-semibold">
                                            User Id
                                        </span>
                                        <span className=" text-[#434343] break-words">
                                            #{user?.userId}
                                        </span>
                                    </div>
                                    <div className="bg-[#e4e4e4] w-full h-[1px]"></div>
                                    <div className="flex justify-between md:flex-row flex-col md:gap-4">
                                        <span className="font-semibold">
                                            Email
                                        </span>
                                        <span className=" text-[#434343] break-words">
                                            {user?.email}
                                        </span>
                                    </div>
                                    <div className="bg-[#e4e4e4] w-full h-[1px]"></div>
                                    <div className="flex justify-between md:flex-row flex-col md:gap-4">
                                        <span className="font-semibold">
                                            Mobile No.
                                        </span>
                                        <span className=" text-[#434343] break-words">
                                            {user?.phone}
                                        </span>
                                    </div>
                                    <div className="bg-[#e4e4e4] w-full h-[1px]"></div>
                                    <div className="flex justify-between md:flex-row flex-col md:gap-4">
                                        <span className="font-semibold">
                                            Job Position
                                        </span>
                                        <span className=" text-[#434343] break-words">
                                            {user?.jobPosition}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3 border p-6 rounded-[5px]">
                                    <h1 className="text-2xl font-bold text-center mb-4">
                                        User Progress
                                    </h1>
                                    <span className=" bg-gray-100 rounded-lg py-2 px-6 text-sm inline w-fit self-end">
                                        🚀 - Started Unit &nbsp; | &nbsp; ✅ -
                                        Passed Quiz &nbsp; | &nbsp; ❌ -
                                        Requires Retaking the Quiz
                                    </span>
                                    <div className="flex flex-col gap-8 overflow-x-scroll">
                                        <table>
                                            <thead className="bg-pima-gray">
                                                <tr className="text-base">
                                                    <th>Sr no.</th>
                                                    <th>Vertical</th>
                                                    <th>Course</th>
                                                    <th>Unit</th>
                                                    <th>
                                                        Last Attempted / Finish
                                                        Date
                                                    </th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {verticalData.map((data) => (
                                                    <tr key={v4()}>
                                                        <td>{index++}</td>
                                                        <td>
                                                            {
                                                                data
                                                                    ?.verticalData
                                                                    ?.name
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                data?.courseData
                                                                    ?.name
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                data?.unitData
                                                                    ?.name
                                                            }
                                                        </td>
                                                        <td>
                                                            {new Date(
                                                                data?.unitData?.progress?.lastVisited
                                                            ).toDateString()}
                                                        </td>
                                                        <td>
                                                            {data?.unitData
                                                                ?.progress?.quiz
                                                                ?.scoreInPercent >
                                                                0.0 &&
                                                            data?.unitData
                                                                ?.progress?.quiz
                                                                ?.scoreInPercent ===
                                                                -1
                                                                ? "🚀"
                                                                : data?.unitData
                                                                      ?.progress
                                                                      ?.quiz
                                                                      ?.scoreInPercent >=
                                                                  75.0
                                                                ? "✅"
                                                                : "❌"}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Buttons */}
                        <div className="flex flex-col justify-between items-center md:flex-row gap-4">
                            <button
                                className="px-8 border-2 bg-pima-gray text-center hover:bg-white hover:text-pima-gray hover:border-2 border-pima-gray transition-all text-white rounded-[5px] flex w-fit py-2 uppercase text-sm font-medium"
                                onClick={() =>
                                    setIsResetPasswordModalOpen(true)
                                }
                            >
                                Reset Password
                            </button>
                            <button
                                className="px-8 border-2 bg-pima-red text-center hover:bg-white hover:text-pima-red hover:border-2 border-pima-red transition-all text-white rounded-[5px] flex w-fit py-2 uppercase text-sm font-medium"
                                onClick={() => setIsDeleteModalOpen(true)}
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminUserPage;
