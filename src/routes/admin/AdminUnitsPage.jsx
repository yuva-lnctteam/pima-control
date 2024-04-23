import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

// My components
import Card from "../../components/admin/Card";
import { CardGrid } from "../../components/common/CardGrid";
import Loader from "../../components/common/Loader";

import { SERVER_ORIGIN } from "../../utilities/constants";
import {
    getVideoThumbnail,
    refreshScreen,
} from "../../utilities/helper_functions";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/solid";

///////////////////////////////////////////////////////////////////////////////////////////////////////////

const UnitsPage = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [allUnits, setAllUnits] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const navigate = useNavigate();
    const params = useParams();
    const { verticalId, courseId } = params;

    useEffect(() => {
        async function getAllUnits() {
            setIsLoading(true);
            const { verticalId, courseId } = params;

            try {
                const adminId = process.env.REACT_APP_ADMIN_ID;
                const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;
                const basicAuth = btoa(`${adminId}:${adminPassword}`);
                const response = await fetch(
                    `${SERVER_ORIGIN}/api/admin/auth/verticals/${verticalId}/courses/${courseId}/units/all`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "auth-token": localStorage.getItem("token"),
                            Authorization: `Basic ${basicAuth}`,
                        },
                    }
                );

                const result = await response.json();
                // (result);

                setIsLoading(false);

                if (response.status >= 400 && response.status < 600) {
                    if (response.status === 401) {
                        navigate("/admin/login"); // login or role issue
                    } else if (response.status === 404) {
                        toast.error(result.statusText);
                    } else if (response.status === 500) {
                        toast.error(result.statusText);
                    }
                } else if (response.ok && response.status === 200) {
                    setAllUnits(result.allUnits);
                } else {
                    // for future
                }
            } catch (err) {
                setIsLoading(false);
            }
        }

        getAllUnits();
    }, []);

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    async function redirectToAddUnitPage(e) {
        const { verticalId, courseId } = params;
        // (params);

        navigate(
            `/admin/verticals/${verticalId}/courses/${courseId}/units/add`
        );
    }

    /////////////////////////////////////// Delete Course Modal //////////////////////////////////////////////////

    const ref = useRef(null);
    const refClose = useRef(null);
    const [toDeleteUnitId, setToDeleteUnitId] = useState("");
    const [confirmText, setConfirmText] = useState("");

    function onConfirmTextChange(e) {
        setConfirmText(e.target.value);
    }

    function openDeleteModal(e) {
        // (e.target);
        ref.current.click();
        setToDeleteUnitId(e.target.id);
    }

    async function handleDeleteUnit() {
        const { verticalId, courseId } = params;
        const unitId = toDeleteUnitId;
        // (courseId);

        // todo: validate input
        setDeleteLoading(true);
        try {
            const adminId = process.env.REACT_APP_ADMIN_ID;
            const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;
            const basicAuth = btoa(`${adminId}:${adminPassword}`);
            const response = await fetch(
                `${SERVER_ORIGIN}/api/admin/auth/verticals/${verticalId}/courses/${courseId}/units/${unitId}/delete`,
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
            // (result);

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
            } else {
                // for future
            }

            setDeleteLoading(false);
            setConfirmText("");
        } catch (err) {
            setDeleteLoading(false);
            setConfirmText("");
        }

        refClose.current.click();
    }

    function handleCreateUnit() {
        const { verticalId, courseId } = params;
        navigate(
            `/admin/content/verticals/${verticalId}/courses/${courseId}/units/add`
        );
    }

    const loader = <Loader />;

    const element = (
        <section className="mt-8">
            {allUnits.length > 0 ? (
                <CardGrid>
                    {allUnits.map((unit) => {
                        const vdoThumbnail = getVideoThumbnail(
                            unit.video.vdoSrc
                        );
                        unit.vdoThumbnail = vdoThumbnail;

                        return (
                            <Card
                                data={unit}
                                key={unit._id}
                                type="unit"
                                onDeleteClick={() => {
                                    setIsDeleteModalOpen(true);
                                    // setToDeleteVerticalId(vertical._id);
                                }}
                            />
                        );
                    })}
                </CardGrid>
            ) : (
                <h1 className="text-3xl font-bold text-center">
                    No units to show!
                </h1>
            )}
        </section>
    );

    return (
        <div className="relative">
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
                                onChange={onConfirmTextChange}
                                value={confirmText}
                                autoComplete="off"
                                className="w-full px-5 py-3 bg-[#efefef] rounded-[5px] placeholder:text-[#5a5a5a] placeholder:text-sm"
                                placeholder="Please type 'delete' to confirm deletion."
                            />

                            <button
                                onClick={handleDeleteUnit}
                                type="button"
                                disabled={
                                    confirmText !== "delete" || deleteLoading
                                }
                                className={`w-fit px-10 text-center py-2.5 bg-pima-red hover:bg-[#f14c52] transition-all duration-150 text-white rounded-[5px] uppercase font-medium self-center text-sm ${
                                    confirmText !== "delete" || deleteLoading
                                        ? "bg-stone-400 cursor-not-allowed"
                                        : "hover:bg-pima-red"
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
                <h1 className="text-4xl font-extrabold">Manage Units</h1>
                <div className="flex flex-col gap-2">
                    <p className="text-stone-600">
                        You can View / Add / Delete verticals from here. Note:
                        Deleting a vertical is irreversible. Do it at your own
                        risk.
                    </p>
                </div>
                <button
                    onClick={handleCreateUnit}
                    className="px-8 border-2 bg-pima-gray text-center hover:bg-white hover:text-pima-gray hover:border-2 border-pima-gray transition-all text-white rounded-[5px] flex w-fit py-2 uppercase text-sm font-medium"
                >
                    Create a Unit
                </button>

                {isLoading ? loader : element}

                {/* {deleteModal} */}
            </div>
        </div>
    );
};

export default UnitsPage;
