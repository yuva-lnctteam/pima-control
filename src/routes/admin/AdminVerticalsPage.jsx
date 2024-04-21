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
    const [allVerticals, setAllVerticals] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [addVerticalLoading, setAddVerticalLoading] = useState(false);
    const [newVertical, setNewVertical] = useState({
        name: "",
        desc: "",
        imgSrc: "",
    });
    const [toDeleteVerticalId, setToDeleteVerticalId] = useState("");
    const [confirmText, setConfirmText] = useState("");

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

    async function handleAddVertical() {
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
        } catch (error) {}
    }

    const deleteModal = (
        <>
            <button
                type="button"
                className="btn btn-primary d-none"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal3"
            >
                Launch demo modal
            </button>

            <div>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5
                                className="modal-title text-ff1"
                                id="exampleModalLabel"
                            >
                                Delete vertical
                            </h5>
                            <button type="button" className="btn-close" />
                        </div>
                        <div className="modal-body">
                            <div style={{ marginBottom: "1rem" }}>
                                <label htmlFor="confirm" className="modalLabel">
                                    Confirmation
                                </label>
                                <input
                                    type="text"
                                    id="confirm"
                                    autoComplete="off"
                                    name="confirm"
                                    placeholder="Type 'Confirm' to delete"
                                    value={confirmText}
                                    onChange={onConfirmTextChange}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="modalCloseBtn"
                                data-bs-dismiss="modal"
                            >
                                Close
                            </button>
                            <button
                                onClick={handleDeleteVertical}
                                type="button"
                                className="modalDltBtn"
                                disabled={confirmText !== "Confirm"}
                            >
                                Delete Vertical
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

    const loader = <Loader />;

    const verticalList = (
        <section className="mt-8">
            {allVerticals.length > 0 ? (
                <CardGrid>
                    {allVerticals.map((vertical) => (
                        <div className="" key={vertical._id}>
                            <Card
                                data={vertical}
                                type="vertical"
                                onAddViewClick={handleAddOrViewCourses}
                            />
                        </div>
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

                        <div className="flex flex-col gap-5 w-full">
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
                            <input
                                type="text"
                                id="Image Source URL"
                                name="imgSrc"
                                minLength={1}
                                maxLength={validation.verticalModal.name.maxLen}
                                onChange={onAddChange}
                                value={newVertical.imgSrc}
                                autoComplete="off"
                                className="w-full px-5 py-3 bg-[#efefef] rounded-[5px] placeholder:text-[#5a5a5a] placeholder:text-sm"
                                placeholder="Image Source URL"
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
                            <button
                                onClick={handleAddVertical}
                                type="button"
                                className="w-fit px-10 text-center py-2.5 bg-pima-red hover:bg-[#f14c52] transition-all duration-150 text-white rounded-[5px] uppercase font-medium self-center"
                            >
                                Add Vertical
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <div
                className={`px-pima-x max-md:px-8 py-pima-y flex flex-col gap-6 transition-all duration-[250] ${
                    isAddModalOpen ? "blur-md pointer-events-none" : ""
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
                    className="px-10 bg-pima-gray text-white rounded-[5px] flex w-fit py-2"
                >
                    Create a Vertical
                </button>

                {isLoading ? loader : verticalList}
            </div>
        </div>
    );
};

export default VerticalsPage;
