import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import Loader from "../../components/common/Loader";

import { SERVER_ORIGIN } from "../../utilities/constants";
// import { refreshScreen } from "../../utilities/helper_functions";

// localhost:800/users/all?page=1&limit=10&search=abhishek&sortBy=fName&sortType=desc

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.substr(1);
}

const AdminUsers = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [allUsers, setAllUsers] = useState([]);

    const [page, setPage] = useState(1);
    const [sortType, setSortType] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [totalPages, setTotalPages] = useState(0);

    const navigate = useNavigate();

    const increment = () => {
        if (page < totalPages) setPage((prev) => prev + 1);
    };

    const decrement = () => {
        if (page > 1) {
            setPage((prev) => prev - 1);
        }
    };

    useEffect(() => {
        async function getAllUsers() {
            setIsLoading(true);

            try {
                const adminId = process.env.REACT_APP_ADMIN_ID;
                const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;
                const basicAuth = btoa(`${adminId}:${adminPassword}`);
                const response = await fetch(
                    `${SERVER_ORIGIN}/api/admin/auth/users/all?page=${page}&limit=20&search=${searchQuery}&sortBy=fName&sortType=${
                        sortType === true ? "asc" : "desc"
                    }`,
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

                setIsLoading(false);

                if (response.status >= 400 && response.status < 600) {
                    if (response.status === 401) {
                        navigate("/admin/login");
                    } else if (response.status === 500) {
                        toast.error(result.statusText);
                    }
                } else if (response.ok && response.status === 200) {
                    setAllUsers(result.filteredUsers);
                    setTotalPages(result.totalPages);
                } else {
                    // for future
                }
            } catch (err) {
                setIsLoading(false);
            }
        }

        getAllUsers();
    }, [page, sortType, searchQuery, navigate]);

    return (
        <div className="px-pima-x py-pima-y flex flex-col gap-8 max-md:px-10">
            <h1 className="text-4xl font-extrabold">Manage Users</h1>
            <div className="flex justify-between flex-wrap gap-4">
                <button
                    onClick={() => navigate("/admin/users/register-user")}
                    className="px-8 border-2 bg-pima-gray text-center hover:bg-white hover:text-pima-gray hover:border-2 border-pima-gray transition-all text-white rounded-[5px] flex w-fit py-2 uppercase text-sm font-medium"
                >
                    Create User
                </button>
            </div>
            <div className="flex flex-col gap-8">
                <div className="flex justify-between flex-wrap gap-4 mt-6">
                    <button
                        className="px-8 border-2 bg-pima-gray text-center hover:bg-white hover:text-pima-gray hover:border-2 border-pima-gray transition-all text-white rounded-[5px] flex w-fit py-2 uppercase text-sm font-medium"
                        onClick={() => setSortType(!sortType)}
                    >
                        Sort Type - ({sortType ? "Ascending" : "Descending"})
                    </button>
                    <div className="flex flex-wrap gap-4">
                        <input
                            type="text"
                            value={searchQuery}
                            placeholder="Search First Name"
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setPage(1);
                            }}
                            className="border-2 border-[#202020] placeholder:text-sm  rounded-[5px] px-[10px] py-2 w-[220px]"
                        />
                    </div>
                </div>
                {isLoading ? (
                    <Loader />
                ) : (
                    <div className="flex flex-col gap-8 overflow-x-scroll">
                        <table className="">
                            <thead className="bg-pima-gray">
                                <tr className="text-base">
                                    <th>Sr no.</th>
                                    <th>Full Name</th>
                                    <th>Email</th>
                                    <th>Mobile no.</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody className="w-full">
                                {allUsers?.map((user, idx) => (
                                    <tr key={user?._id}>
                                        <td>
                                            {page === 1
                                                ? idx + 1
                                                : idx + 1 + (page - 1) * 20}
                                        </td>
                                        <td>
                                            {capitalizeFirstLetter(user?.fName)}{" "}
                                            {capitalizeFirstLetter(user?.lName)}
                                        </td>
                                        <td>{user?.email}</td>
                                        <td>{user?.phone}</td>
                                        <td>
                                            <button
                                                className="border-2 border-pima-gray py-1.5 px-4 rounded-[5px] text-black text-xs uppercase font-medium hover:bg-black hover:text-white transition-all"
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/users/${user?.userId}`
                                                    )
                                                }
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="flex justify-between items-center">
                    <button
                        className="px-8 border-2 bg-pima-red text-center hover:bg-white hover:text-pima-red hover:border-2 border-pima-red transition-all text-white rounded-[5px] flex w-fit py-1.5"
                        onClick={() => decrement()}
                    >
                        Prev
                    </button>
                    <span className="font-medium">
                        Page: {page} of {totalPages}
                    </span>
                    <button
                        className="px-8 border-2 bg-pima-red text-center hover:bg-white hover:text-pima-red hover:border-2 border-pima-red transition-all text-white rounded-[5px] flex w-fit py-1.5"
                        onClick={() => increment()}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;
