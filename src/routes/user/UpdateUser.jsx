import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SERVER_ORIGIN } from "../../utilities/constants";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";

const UpdateUser = () => {
    const navigate = useNavigate();

    const [entryLoading, setEntryLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        jobPosition: "",
        userId: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            !user.fullName ||
            !user.email ||
            !user.password ||
            !user.phone ||
            !user.jobPosition ||
            !user.userId
        ) {
            toast.error("Please fill all the fields");
            return;
        }

        if (user.password.length < 8 || user.password.includes(" ")) {
            toast.error(
                "Password should be atleast 8 characters long and should not contain spaces"
            );
            return;
        }

        if (user.phone.length !== 10 || isNaN(user.phone)) {
            toast.error("Phone number should be valid and 10 digits long");
            return;
        }

        if (user.userId.length < 6 || user.userId.includes(" ")) {
            toast.error(
                "UserId should be atleast 6 characters long and should not contain spaces"
            );
            return;
        }

        setIsLoading(true);

        try {
            setIsLoading(true);
            const userId = process.env.REACT_APP_USER_ID;
            const userPassword = process.env.REACT_APP_USER_PASSWORD;
            const basicAuth = btoa(`${userId}:${userPassword}`);

            let modifiedUser = {
                email: user.email.toLowerCase(),
                password: user.password,
                phone: user.phone,
                jobPosition: user.jobPosition,
                userId: user.userId.toLowerCase(),
                fName: user.fullName.split(" ")[0],
                lName: user.fullName.split(" ")?.[1] || "",
            };

            let formData = new FormData();
            formData.append("email", user.email.toLowerCase());
            formData.append("password", user.password);
            formData.append("phone", user.phone);
            formData.append("jobPosition", user.jobPosition);
            formData.append("userId", user.userId);
            formData.append("fName", user.fullName.split(" ")[0]);
            formData.append("lName", user.fullName.split(" ")?.[1] || "");

            const response = await fetch(
                `${SERVER_ORIGIN}/api/user/auth/update-user`,
                {
                    method: "POST",
                    body: JSON.stringify(modifiedUser),
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": localStorage.getItem("token"),
                        Authorization: `Basic ${basicAuth}`,
                    },
                }
            );

            const result = await response.json();
            // (result);

            if (response.status >= 400 && response.status < 600) {
                if (response.status === 401) {
                    navigate("/admin/login");
                }
            } else if (response.ok && response.status === 200) {
                navigate("/user/profile");
                toast.success("User updated successfully");
            } else {
                // for future
            }

            setIsLoading(false);
        } catch (err) {
            // (err.message);
            // console.log(err.message);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        async function getUser() {
            try {
                setIsLoading(true);
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
                    setEntryLoading(false);
                    setUser({
                        fullName:
                            result?.data?.user?.fName +
                            " " +
                            result?.data?.user?.lName,
                        email: result?.data?.user?.email,
                        password: result?.data?.user?.password,
                        phone: result?.data?.user?.phone,
                        jobPosition: result?.data?.user?.jobPosition,
                        userId: result?.data?.user?.userId,
                    });
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
    }, [navigate]);

    return (
        <div className="py-pima-y create-user flex flex-col gap-6 w-full justify-center mt-14 px-14 lg:px-pima-x">
            <h3 className="text-5xl font-extrabold text-center">Update User</h3>
            {entryLoading ? (
                <Loader />
            ) : (
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-6 justify-center"
                >
                    <div className="flex gap-8 justify-center flex-col md:flex-row mt-8">
                        <input
                            value={user.fullName}
                            onChange={(e) =>
                                setUser({ ...user, fullName: e.target.value })
                            }
                            type="text"
                            placeholder="Full Name"
                            className={
                                "w-full max-w-[700px] px-4 py-3 bg-[#efefef] rounded placeholder:text-[#5a5a5a]"
                            }
                        />
                        <input
                            type="text"
                            value={user.userId}
                            onChange={(e) =>
                                setUser({ ...user, userId: e.target.value })
                            }
                            placeholder="User Id"
                            className={
                                "w-full px-4 py-3 max-w-[700px] bg-[#efefef] rounded placeholder:text-[#5a5a5a]"
                            }
                        />
                    </div>
                    <div className="flex gap-8 justify-center flex-col md:flex-row">
                        <input
                            type="email"
                            placeholder="Email"
                            value={user.email}
                            onChange={(e) =>
                                setUser({ ...user, email: e.target.value })
                            }
                            className={
                                "w-full px-4 py-3 max-w-[700px] bg-[#efefef] rounded placeholder:text-[#5a5a5a]"
                            }
                        />
                        <input
                            type="text"
                            placeholder="Password"
                            value={user.password}
                            onChange={(e) =>
                                setUser({ ...user, password: e.target.value })
                            }
                            className={
                                "w-full px-4 py-3 max-w-[700px] bg-[#efefef] rounded placeholder:text-[#5a5a5a]"
                            }
                        />
                    </div>
                    <div className="flex gap-8 justify-center flex-col md:flex-row">
                        <input
                            type="text"
                            placeholder="Phone Number"
                            value={user.phone}
                            onChange={(e) =>
                                setUser({ ...user, phone: e.target.value })
                            }
                            className={
                                "w-full px-4 py-3 max-w-[700px] bg-[#efefef] rounded placeholder:text-[#5a5a5a]"
                            }
                        />
                        <input
                            type="text"
                            value={user.jobPosition}
                            onChange={(e) =>
                                setUser({
                                    ...user,
                                    jobPosition: e.target.value,
                                })
                            }
                            placeholder="Job Position"
                            className={
                                "w-full px-4 py-3 max-w-[700px] bg-[#efefef] rounded placeholder:text-[#5a5a5a]"
                            }
                        />
                    </div>
                    <div className="flex">
                        <button
                            onClick={() => navigate("/user/profile")}
                            disabled={isLoading}
                            type="submit"
                            className={`px-10 border-2 bg-pima-gray text-center hover:bg-white hover:text-pima-light-gray hover:border-2  transition-all text-white rounded-[5px] py-2 uppercase font-semibold mx-auto text-sm`}
                        >
                            Cancel
                        </button>
                        <button
                            disabled={isLoading}
                            type="submit"
                            className={`px-10 border-2 bg-pima-red text-center hover:bg-white hover:text-pima-red hover:border-2 border-pima-red transition-all text-white rounded-[5px] py-2 uppercase font-semibold mx-auto text-sm`}
                        >
                            {isLoading ? "Updating User" : "Save"}
                            {/* {isLoading && (
                            <div className="ml-2">
                                <div className="loader"></div>
                            </div>
                        )} */}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default UpdateUser;
