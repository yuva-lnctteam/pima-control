import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import hamburgerImg from "../../assets/images/hamburger.png";
import { AnimatePresence, motion } from "framer-motion";
import logo from "../../assets/images/LOGO.png";
import { SERVER_ORIGIN } from "../../utilities/constants";

const navLinks = [
    { name: "Users", path: "/admin/manage-users" },
    { name: "Content", path: "/admin/manage-content" },
];

const Navbar = () => {
    const navigate = useNavigate();
    const pathname = useLocation().pathname;

    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    useEffect(() => {
        const verifyToken = async () => {
            const adminId = process.env.REACT_APP_ADMIN_ID;
            const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;
            const basicAuth = btoa(`${adminId}:${adminPassword}`);
            const response = await fetch(
                `${SERVER_ORIGIN}/api/admin/auth/verify-token`,
                {
                    method: "POST",
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
                    navigate("/admin/login");
                }
            } else if (response.ok && response.status === 200) {
            } else {
                // for future
            }
        };
        verifyToken();
    }, [navigate]);

    const handleLoginClick = (e) => {
        navigate("/admin/login");
    };

    const handleLogoutClick = (e) => {
        localStorage.removeItem("token");
        navigate("/admin/login");
    };

    return (
        <nav className="flex w-full flex-col md:flex-row justify-between px-10 md:px-pima-x py-4  sticky top-0 items-center bg-[#ffffff] z-[999]">
            <div className="flex items-center justify-between max-md:w-full">
                <img
                    src={logo}
                    alt="pima-logo"
                    className="cursor-pointer w-[5rem]"
                />
                {pathname !== "/user/login" && pathname !== "/admin/login" && (
                    <img
                        src={hamburgerImg}
                        alt="hamburger"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden w-12 h-12 p-2 cursor-pointer hover:scale-90 transition-all duration-150"
                    />
                )}
            </div>
            {pathname !== "/user/login" && pathname !== "/admin/login" && (
                <>
                    <ul className="hidden md:flex gap-12 text-base md:items-center ">
                        {navLinks.map((link, index) => (
                            <li
                                key={index}
                                className="hover:border-b-2 border-pima-red transition-all"
                                style={{ textDecorationColor: "#ed3237" }}
                            >
                                <Link to={link.path} className="font-inter">
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                        <li className="flex ml-4">
                            {localStorage.getItem("token") ? (
                                <>
                                    <button
                                        className="rounded w-24 ml-6transition-all duration-150 border-2  bg-pima-red py-1 text-center text-white text-sm hover:bg-white hover:text-pima-red 
                                         hover:border-2 border-pima-red"
                                        onClick={handleLogoutClick}
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        className="rounded w-24 ml-8 transition-all duration-150 border-2  bg-pima-red py-1 text-center text-white 
                                        text-sm hover:bg-white hover:text-pima-red hover:border-2 border-pima-red"
                                        onClick={handleLoginClick}
                                    >
                                        Login
                                    </button>
                                </>
                            )}
                        </li>
                    </ul>
                    <AnimatePresence>
                        {isMobileMenuOpen && (
                            <motion.ul
                                initial={{ x: 500, overflow: "hidden" }}
                                animate={{ x: 0 }}
                                exit={{ x: 500, overflow: "hidden" }}
                                transition={{ duration: 0.5 }}
                                className={`
                ${isMobileMenuOpen ? "flex" : "hidden"}
             flex-col md:hidden gap-10 mt-6 items-center fixed right-0 shadow-xl -top-6 bg-white w-[20rem] z-[10000] h-screen text-base`}
                            >
                                <li className="flex justify-end py-4 px-6 w-full mb-2">
                                    <img
                                        src={hamburgerImg}
                                        alt="hamburger"
                                        onClick={() =>
                                            setIsMobileMenuOpen(
                                                !isMobileMenuOpen
                                            )
                                        }
                                        className="md:hidden w-12 h-12 p-2 cursor-pointer hover:scale-90 transition-all duration-150"
                                    />
                                </li>

                                {navLinks.map((link, index) => (
                                    <li
                                        key={index}
                                        className="hover:font-semibold"
                                    >
                                        <Link
                                            to={link.path}
                                            className="font-inter"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                                <li className="flex mt-2 flex-col gap-4">
                                    {localStorage.getItem("token") ? (
                                        <>
                                            <button
                                                className="rounded w-24 transition-all duration-150 bg-pima-red text-center text-white hover:bg-white hover:text-pima-red border py-1.5 
                                                text-sm border-pima-red"
                                                onClick={handleLogoutClick}
                                            >
                                                Logout
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                className="rounded w-20 transition-all duration-150 bg-pima-red text-center text-white hover:bg-white hover:text-pima-red py-2 text-base hover:border hover:border-pima-red"
                                                onClick={handleLoginClick}
                                            >
                                                Login
                                            </button>
                                        </>
                                    )}
                                </li>
                            </motion.ul>
                        )}
                    </AnimatePresence>
                </>
            )}
        </nav>
    );
};

export default Navbar;
