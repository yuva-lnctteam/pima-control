import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

// My components
import Card from "../../components/admin/Card";
import { CardGrid } from "../../components/common/CardGrid";
import Loader from "../../components/common/Loader";

import { SERVER_ORIGIN, validation } from "../../utilities/constants";
import { refreshScreen } from "../../utilities/helper_functions";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/solid";

//////////////////////////////////////////////////////////////////////////////////////////////

const VerticalsPage = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [allVerticals, setAllVerticals] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [addVerticalLoading, setAddVerticalLoading] = useState(false);
    const [newVertical, setNewVertical] = useState({
        name: "",
        desc: "",
        verticalImg: null,
    });
    const [toDeleteVerticalId, setToDeleteVerticalId] = useState("");
    const [confirmText, setConfirmText] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        async function getAllVerticals() {
            setIsLoading(true);

            try {
                const adminId = process.env.REACT_APP_ADMIN_ID;
                const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;
                const basicAuth = btoa(`${adminId}:${adminPassword}`);
                const response = await fetch(
                    `${SERVER_ORIGIN}/api/admin/auth/verticals/all`,
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
                // (result);

                setIsLoading(false);

                if (response.status >= 400 && response.status < 600) {
                    if (response.status === 401) {
                        navigate("/admin/login");
                    } else if (response.status === 500) {
                        toast.error(result.statusText);
                    }
                } else if (response.ok && response.status === 200) {
                    setAllVerticals(result.allVerticals);
                } else {
                    // for future
                }
            } catch (err) {
                // (err.message);
                setIsLoading(false);
            }
        }

        getAllVerticals();
    }, []);

    function onAddChange(e) {
        const updatedVertical = {
            ...newVertical,
            [e.target.name]: e.target.value,
        };
        setNewVertical(updatedVertical);
    }

    function handleImgChange(e) {
        setNewVertical((prevVal) => ({
            ...prevVal,
            verticalImg: e.target.files[0],
        }));
    }

    async function handleAddVertical() {
        console.log("-------------------", newVertical);
        // todo: validate input
        try {
            setAddVerticalLoading(true);
            const adminId = process.env.REACT_APP_ADMIN_ID;
            const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;
            const basicAuth = btoa(`${adminId}:${adminPassword}`);
            const response = await fetch(
                `${SERVER_ORIGIN}/api/admin/auth/verticals/add`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": localStorage.getItem("token"),
                        Authorization: `Basic ${basicAuth}`,
                    },
                    body: JSON.stringify(newVertical),
                }
            );

            const result = await response.json();

            if (response.status >= 400 && response.status < 600) {
                if (response.status === 401) {
                    navigate("/admin/login"); // login or role issue
                } else if (response.status === 500) {
                    toast.error(result.statusText);
                }

                setAddVerticalLoading(false);
            } else if (response.ok && response.status === 200) {
                refreshScreen();
                // set fields in modal to empty if not refreshing scrn
            } else {
                setAddVerticalLoading(false);
                // for future
            }
        } catch (err) {
            // (err.message);
            setAddVerticalLoading(false);
        }
    }

    async function handleAddOrViewCourses(e) {
        const verticalId = e.target.id;
        // (verticalId);
        navigate(`/admin/content/verticals/${verticalId}/courses/all`);
    }

    function onConfirmTextChange(e) {
        setConfirmText(e.target.value);
    }

    async function handleDeleteVertical() {
        const verticalId = toDeleteVerticalId;
        // todo: validate input

        setDeleteLoading(true);
        try {
            const adminId = process.env.REACT_APP_ADMIN_ID;
            const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;
            const basicAuth = btoa(`${adminId}:${adminPassword}`);
            const response = await fetch(
                `${SERVER_ORIGIN}/api/admin/auth/verticals/${verticalId}/delete`,
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
                refreshScreen();
                // set fields in modal to empty if not refreshing scrn
            } else {
                // for future
            }
            setConfirmText("");
            setDeleteLoading(false);
        } catch (error) {
            // (error.message);
            setDeleteLoading(false);
            setConfirmText("");
        }
    }

    const loader = <Loader />;

    const verticalList = (
        <section className="mt-8">
            {allVerticals.length > 0 ? (
                <CardGrid>
                    {allVerticals.map((vertical) => (
                        <Card
                            data={vertical}
                            key={vertical._id}
                            type="vertical"
                            onAddViewClick={handleAddOrViewCourses}
                            onDeleteClick={() => {
                                setIsDeleteModalOpen(true);
                                setToDeleteVerticalId(vertical._id);
                            }}
                        />
                    ))}
                </CardGrid>
            ) : (
                <h1 className="text-3xl font-bold text-center">
                    No verticals to show!
                </h1>
            )}
        </section>
    );

    // add a vertical modal
    return (
        <div className="relative">
            <AnimatePresence>
                {isAddModalOpen && (
                    <motion.div
                        className="fixed bg-white flex flex-col items-center gap-6 border p-6 px-10 m-auto left-0 right-0 top-0 bottom-0 max-w-[900px] h-fit rounded-[5px] z-[999]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <XMarkIcon
                            className="w-6 h-6 absolute right-4 top-4 cursor-pointer"
                            onClick={() => setIsAddModalOpen(false)}
                        />
                        <h3 className="text-4xl font-bold text-center max-md:text-3xl">
                            Add a Vertical
                        </h3>

                        <div className="flex flex-col gap-5 w-full items-center">
                            <input
                                type="text"
                                id="name"
                                name="name"
                                minLength={1}
                                maxLength={validation.verticalModal.name.maxLen}
                                onChange={onAddChange}
                                value={newVertical.name}
                                autoComplete="off"
                                className="w-full px-5 py-3 bg-[#efefef] rounded-[5px] placeholder:text-[#5a5a5a] placeholder:text-sm"
                                placeholder="Title of the Vertical"
                            />
                            <textarea
                                type="text"
                                id="desc"
                                name="desc"
                                onChange={onAddChange}
                                maxLength={validation.verticalModal.desc.maxLen}
                                value={newVertical.desc}
                                autoComplete="off"
                                className="w-full px-5 py-3 bg-[#efefef] rounded-[5px] placeholder:text-[#5a5a5a] resize-none placeholder:text-sm h-[200px]"
                                placeholder="Description of the Vertical"
                                cols={10}
                            />

                            <input
                                className="border"
                                onChange={handleImgChange}
                                type="file"
                                src=""
                                alt=""
                                accept="image/png, image/jpeg, image/jpg, image/webp"
                            />
                            <button
                                onClick={handleAddVertical}
                                type="button"
                                className="px-8 border-2 bg-pima-red text-center hover:bg-white hover:text-pima-red hover:border-2 border-pima-red transition-all text-white rounded-[5px] flex w-fit py-2 uppercase font-semibold text-sm"
                            >
                                Add Vertical
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
                                onChange={(e) => setConfirmText(e.target.value)}
                                value={confirmText}
                                autoComplete="off"
                                className="w-full px-5 py-3 bg-[#efefef] rounded-[5px] placeholder:text-[#5a5a5a] placeholder:text-sm"
                                placeholder="Please type 'delete' to confirm deletion."
                            />

                            <button
                                onClick={handleDeleteVertical}
                                disabled={
                                    confirmText !== "delete" || deleteLoading
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
                className={`px-pima-x max-md:px-8 py-pima-y flex flex-col gap-6 transition-all duration-[250] ${
                    isAddModalOpen || isDeleteModalOpen
                        ? "blur-lg pointer-events-none"
                        : ""
                }`}
            >
                <h1 className="text-4xl font-extrabold">Manage Verticals</h1>
                <div className="flex flex-col gap-2">
                    <p className="text-stone-600">
                        You can View / Add / Delete verticals from here. Note:
                        Deleting a vertical is irreversible. Do it at your own
                        risk.
                    </p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(!isAddModalOpen)}
                    className="px-8 border-2 bg-pima-gray text-center hover:bg-white hover:text-pima-gray hover:border-2 border-pima-gray transition-all text-white rounded-[5px] flex w-fit py-2 uppercase text-sm font-medium"
                >
                    Create a Vertical
                </button>

                {isLoading ? loader : verticalList}
            </div>
        </div>
    );
};

export default VerticalsPage;
