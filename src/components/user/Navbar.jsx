import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-hot-toast";
import logo from "../../assets/images/LOGO.png";
import hamburgerImg from "../../assets/images/hamburger.png";
import { motion, AnimatePresence } from "framer-motion";
// My css
import { SERVER_ORIGIN } from "../../utilities/constants";

const navLinks = [
    { name: "Home", path: "/" },
    { name: "Verticals", path: "/user/verticals/all" },
    { name: "About", path: "/about" },
];

const Navbar = () => {
    const navigate = useNavigate();
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = useLocation().pathname;

    useEffect(() => {
        const verifyToken = async () => {
            const userId = process.env.REACT_APP_USER_ID;
            const userPassword = process.env.REACT_APP_USER_PASSWORD;
            const basicAuth = btoa(`${userId}:${userPassword}`);
            const response = await fetch(
                `${SERVER_ORIGIN}/api/user/auth/verity-token`,
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
            if (result.userDoc) {
                setIsUserLoggedIn(true);
            }
        };
    }, []);

    const handleLoginClick = (e) => {
        navigate("/user/login");
    };

    const handleLogoutClick = (e) => {
        localStorage.removeItem("token");
        navigate("/user/login");
        toast.success("Logged out successfully");
    };

    const handleRegisterClick = (e) => {
        localStorage.removeItem("token");
        navigate("/user/register");
    };

    const handleProfileClick = () => {
        navigate("/user/profile");
    };

    const listItemStyle = { fontSize: "0.9rem", fontWeight: "400" };

    return (
        <nav className="flex w-full flex-col md:flex-row justify-between px-10 md:px-pima-x py-4 items-center relative">
            <div className="flex items-center justify-between max-md:w-full">
                <img
                    src={logo}
                    alt="pima-logo"
                    onClick={() => navigate("/")}
                    className="cursor-pointer w-18"
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
                    <ul className="hidden md:flex gap-12 md:items-center">
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
                        <li className="flex ml-12">
                            {localStorage.getItem("token") ? (
                                <>
                                    {/* <button
                                className="rounded w-32 font-medium text-pima-red py-2 justify-center items-center border border-pima-red gap-2 flex hover:bg-pima-red hover:text-white hover:border-pima-red transition-all duration-150"
                                onClick={handleProfileClick}
                            >
                                <FontAwesomeIcon
                                    icon={faUser}
                                    className="ml-1"
                                />
                                {"   "}
                                My Profile
                            </button> */}
                                    <button
                                        className="rounded font-medium w-32 ml-8 transition-all duration-150 bg-pima-red py-2 text-center text-white hover:bg-white hover:text-pima-red border-2 text-base hover:border-2 border-pima-red"
                                        onClick={handleLogoutClick}
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        className="rounded font-medium w-40 border-2 transition-all duration-150 bg-pima-red py-2 text-center text-white hover:bg-white hover:text-pima-red hover:border-2 border-pima-red"
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
             flex-col md:hidden gap-10 mt-6 items-center fixed right-0 shadow-xl -top-6 bg-white w-[20rem] z-[10000] h-screen text-lg`}
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
                                <li className="flex mt-2 flex-col gap-4 ml-4">
                                    {localStorage.getItem("token") ? (
                                        <>
                                            <button
                                                className="rounded w-32 transition-all duration-150 bg-pima-red text-center text-white hover:bg-white hover:text-pima-red hover:border py-2 text-base hover:border-pima-red"
                                                onClick={handleLogoutClick}
                                            >
                                                Logout
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                className="rounded w-32 transition-all duration-150 bg-pima-red text-center text-white hover:bg-white hover:text-pima-red py-2 text-base hover:border hover:border-pima-red"
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
