import { useEffect, useState } from "react";
import { SERVER_ORIGIN, validation } from "../../utilities/constants";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/common/Loader";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/solid";

function capitalizeFirstLetter(str) {
    return str?.charAt(0).toUpperCase() + str?.substr(1);
}

const AdminUserPage = () => {
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
    const [confirmText, setConfirmText] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false);

    let keys = [];

    if (!isLoading && user) {
        keys = Object.keys(user?.activity);
    }

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
                    body: { password: resetPassword },
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

    console.log(resetPassword, confirmResetPassword);

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
                        className={`px-pima-x py-pima-y flex flex-col gap-10  ${
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
                            <div className="mb-6">
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
                                        <span className="font-semibold">
                                            Email
                                        </span>
                                        <span className="text-right text-[#434343]">
                                            {user?.email}
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
                                <div className="flex flex-col gap-3 border p-6 rounded-[5px]"></div>
                            </div>
                        </div>
                        {/* Buttons */}
                        <div className="flex justify-between">
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
