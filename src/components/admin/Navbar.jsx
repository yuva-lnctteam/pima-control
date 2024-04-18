import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import img from "../../assets/images/yi_logo.png";
import hamburgerImg from "../../assets/images/hamburger.png";
// My css
import css from "../../css/admin/navbar.module.css";
import { AnimatePresence, motion } from "framer-motion";
import logo from "../../assets/images/LOGO.png";

const navLinks = [
    { name: "Users", path: "/admin/manage-users" },
    { name: "Content", path: "/user/manage-content" },
];

const Navbar = () => {
    const navigate = useNavigate();
    const pathname = useLocation().pathname;

    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const handleLoginClick = (e) => {
        navigate("/admin/login");
    };

    const handleLogoutClick = (e) => {
        localStorage.removeItem("token");
        navigate("/admin/login");
    };
    function handleImgClick() {
        navigate("/");
    }

    const listItemStyle = { fontSize: "0.9rem", fontWeight: "400" };

    return (
        <nav className="flex w-full flex-col md:flex-row justify-between px-10 md:px-pima-x py-4 items-center relative">
            <div className="flex items-center justify-between max-md:w-full">
                <img
                    src={logo}
                    alt="pima-logo"
                    onClick={handleImgClick}
                    className="cursor-pointer w-24"
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
                    <ul className="hidden md:flex gap-16 md:items-center ">
                        {navLinks.map((link, index) => (
                            <li key={index} className="hover:underline">
                                <Link to={link.path} className="font-inter">
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                        <li className="flex">
                            {localStorage.getItem("token") ? (
                                <>
                                    <button
                                        className="rounded w-32 ml-8 transition-all duration-150 bg-pima-red py-2 text-center text-white text-base hover:bg-white hover:text-pima-red hover:border hover:border-pima-red"
                                        onClick={handleLogoutClick}
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        className="rounded w-40 transition-all duration-150 bg-pima-red py-2 text-center text-white py-2 text-base hover:bg-white hover:text-pima-red hover:border hover:border-pima-red"
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
