import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import Loader from "../../components/common/Loader";

import { SERVER_ORIGIN, validation } from "../../utilities/constants";
import HeaderCard from "../../components/common/HeaderCard";
// import { refreshScreen } from "../../utilities/helper_functions";

import css from "../../css/admin/users-page.module.css";

// localhost:800/users/all?page=1&limit=10&search=abhishek&sortBy=fName&sortType=desc

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.substr(1);
}

const AdminUsers = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [allUsers, setAllUsers] = useState([
        {
            _id: "24324",
            fName: "Abhishek",
            lName: "Kumar",
            email: "abc@gmail.com",
            phone: "1234567890",
            userId: "PULKITJI",
        },
    ]);

    const [page, setPage] = useState(1);
    const [sortType, setSortType] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [totalPages, setTotalPages] = useState(0);
    const [colleges, setColleges] = useState([]);
    const [searchCollege, setSearchCollege] = useState("");
    const [isDropDownOpen, setIsDropDownOpen] = useState(false);
    const [rerender, setRerender] = useState(true);

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
        async function getCollegeName() {
            setIsLoading(true);

            try {
                const adminId = process.env.REACT_APP_ADMIN_ID;
                const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;
                const basicAuth = btoa(`${adminId}:${adminPassword}`);
                const response = await fetch(
                    `${SERVER_ORIGIN}/api/admin/auth/users/college-names`,
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
                    setColleges(result.collegeNames);
                } else {
                    // for future
                }
            } catch (err) {
                setIsLoading(false);
            }
        }

        getCollegeName();
    }, [navigate]);

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
                    }&collegeName=${searchCollege}`,
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
    }, [page, sortType, searchQuery, rerender, navigate]);

    return (
        <div className="px-pima-x py-pima-y">
            <h1 className="text-4xl font-extrabold">Manage Users</h1>

            <div className="flex justify-between mt-8">
                <input className="border-[1px] border-[#202020] placeholder:text-sm  rounded-[5px] px-[10px] py-2 w-[220px]" type="text" name="" id="" placeholder="Search by Name"/>
                <button onClick={() => navigate('/admin/users/register-user')}  className="px-10 bg-pima-gray text-white rounded-[5px] flex w-fit py-2">
                            Create User
                        </button>
            </div>

            <div className="bg-[#dcdcdc] h-screen mt-8 rounded-[5px]"></div>
            {/* <div className={css.filterBtns}>
                <button
                    className={css.sortTypeBtn}
                    onClick={() => setSortType(!sortType)}
                >
                    Sort Type - ({sortType ? "Ascending" : "Descending"})
                </button>
                <div className={css.searchInputs}>
                    <div>
                        <input
                            type="text"
                            value={searchQuery}
                            placeholder="Search First Name"
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setPage(1);
                            }}
                            className={css.searchInput}
                        />
                    </div>
                    <div className={css.collegeSearch}>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                setRerender((p) => !p);
                            }}
                        >
                            <input
                                type="text"
                                value={searchCollege}
                                className={css.searchInput}
                                onChange={(e) => {
                                    setSearchCollege(e.target.value);
                                    setIsDropDownOpen(true);
                                }}
                                placeholder="Search Colleges"
                            />
                        </form>
                        {isDropDownOpen && (
                            <div className={css.searchCollegeDropdown}>
                                {colleges
                                    ?.filter((item) => {
                                        const searchTerm =
                                            searchCollege.toLowerCase();
                                        const college = item.toLowerCase();

                                        return (
                                            searchTerm &&
                                            college.startsWith(searchTerm)
                                        );
                                    })
                                    .slice(0, 10)
                                    .map((college) => (
                                        <div
                                            value={college}
                                            className={
                                                css.searchCollegeDropdownRow
                                            }
                                            onClick={() => {
                                                setSearchCollege(college);
                                                setRerender((p) => !p);
                                                setIsDropDownOpen(false);
                                            }}
                                            key={college}
                                        >
                                            {college}
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {isLoading ? (
                <Loader />
            ) : (
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Sr no.</th>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Mobile no.</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {allUsers?.map((user, idx) => (
                                <tr key={user._id}>
                                    <td>
                                        {page === 1
                                            ? idx + 1
                                            : idx + 1 + (page - 1) * 20}
                                    </td>
                                    <td>
                                        {capitalizeFirstLetter(user.fName)}{" "}
                                        {capitalizeFirstLetter(user.lName)}
                                    </td>
                                    <td>{user.email}</td>
                                    <td>{user.phone}</td>
                                    <td>
                                        <button
                                            className={css.viewBtn}
                                            onClick={() =>
                                                navigate(
                                                    `/admin/users/${user.userId}`
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
                    <div className={css.paginationBtns}>
                        <button
                            className={css.prevBtn}
                            onClick={() => decrement()}
                        >
                            Prev
                        </button>
                        <span>
                            Page: {page} of {totalPages}
                        </span>
                        <button
                            className={css.nextBtn}
                            onClick={() => increment()}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )} */}
        </div>
    );
};

export default AdminUsers;
