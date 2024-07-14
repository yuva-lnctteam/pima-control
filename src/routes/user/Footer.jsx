import React from "react";
import { Link } from "react-router-dom";

const navLinks = [
    { name: "Home", path: "/" },
    { name: "Verticals", path: "/user/verticals/all" },
    // { name: "Pima", path: "https://thebrandprojects.in/pima/" },
];

const Footer = () => {
    return (
        <div className="bg-pima-gray text-white flex flex-col mt-auto">
            <div className="px-pima-x py-pima-y flex flex-col items-center">
                <ul className="flex gap-4">
                    {navLinks.map((link) => (
                        <li key={link.name}>
                            <Link to={link.path} className="">
                                {link.name}
                            </Link>
                        </li>
                    ))}
                    <li>
                        <a href="https://thebrandprojects.in/pima/">Pima</a>
                    </li>
                </ul>
            </div>
            <div className="border-t-[1px] border-black py-4 w-full px-pima-x flex justify-center">
                <span className="text-center">
                    Copyright Pima © {new Date().getFullYear()}
                </span>
            </div>
        </div>
    );
};

export default Footer;
