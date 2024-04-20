import React, { useEffect, useState, useRef } from "react";
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
    const [allUnits, setAllUnits] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const params = useParams();

    console.log(1);
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
                refreshScreen();
            } else {
                // for future
            }
        } catch (err) {}

        refClose.current.click();
    }

    function handleCreateUnit() {
        navigate(
            "/admin/content/verticals/:verticalId/courses/:courseId/units/add"
        );
    }

    // const deleteModal = (
    //     <>
    //         <button
    //             ref={ref}
    //             type="button"
    //             className="btn btn-primary d-none"
    //             data-bs-toggle="modal"
    //             data-bs-target="#exampleModal3"
    //         >
    //             Launch demo modal
    //         </button>

    //         <div
    //             className="modal fade"
    //             id="exampleModal3"
    //             tabIndex="-1"
    //             aria-labelledby="exampleModalLabel"
    //             aria-hidden="true"
    //         >
    //             <div className="modal-dialog">
    //                 <div className="modal-content">
    //                     <div className="modal-header">
    //                         <h5
    //                             className="modal-title text-ff1"
    //                             id="exampleModalLabel"
    //                         >
    //                             Delete Unit
    //                         </h5>
    //                         <button
    //                             type="button"
    //                             className="btn-close"
    //                             data-bs-dismiss="modal"
    //                             aria-label="Close"
    //                         />
    //                     </div>
    //                     <div className="modal-body">
    //                         <div style={{ marginBottom: "0.8rem" }}>
    //                             <label htmlFor="name" className="modalLabel">
    //                                 Confirmation
    //                             </label>
    //                             <input
    //                                 type="text"
    //                                 className="modalInput"
    //                                 id="confirm"
    //                                 name="confirm"
    //                                 minLength={3}
    //                                 required
    //                                 placeholder="Type 'Confirm' to delete"
    //                                 value={confirmText}
    //                                 onChange={onConfirmTextChange}
    //                                 autoComplete="off"
    //                             />
    //                         </div>
    //                     </div>
    //                     <div className="modal-footer">
    //                         <button
    //                             type="button"
    //                             className="modalCloseBtn"
    //                             data-bs-dismiss="modal"
    //                             ref={refClose}
    //                         >
    //                             Close
    //                         </button>
    //                         <button
    //                             onClick={handleDeleteUnit}
    //                             type="button"
    //                             className="modalDltBtn"
    //                             disabled={confirmText !== "Confirm"}
    //                         >
    //                             Delete unit
    //                         </button>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     </>
    // );

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
                            <div key={unit._id}>
                                <Card
                                    data={unit}
                                    type="unit"
                                    onDeleteClick={openDeleteModal}
                                />
                            </div>
                        );
                    })}
                </CardGrid>
            ) : (
                <h1 className="text-3xl font-bold text-center">
                    No courses to show!
                </h1>
            )}
        </section>
    );

    return (
        <div className="relative">
            {/* <AnimatePresence>
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
                            Create Unit
                        </h3>

                        <div className="flex flex-col gap-6 w-full">
                            <input
                                type="text"
                                id="name"
                                name="name"
                                minLength={1}
                                // maxLength={validation.verticalModal.name.maxLen}
                                // onChange={onAddChange}
                                // value={newVertical.name}
                                autoComplete="off"
                                className="w-full px-5 py-3 bg-[#efefef] rounded-[5px] placeholder:text-[#5a5a5a] placeholder:text-sm"
                                placeholder="Title of the Unit"
                            />
                            <textarea
                                type="text"
                                id="desc"
                                name="desc"
                                // onChange={onAddChange}
                                // maxLength={validation.verticalModal.desc.maxLen}
                                // value={newVertical.desc}
                                autoComplete="off"
                                className="w-full px-5 py-3 bg-[#efefef] rounded-[5px] placeholder:text-[#5a5a5a] resize-none placeholder:text-sm h-[200px]"
                                placeholder="Description of the Unit"
                            />
                            <button
                                // onClick={handleAddVertical}
                                type="button"
                                className="w-fit px-10 text-center py-2.5 bg-pima-red hover:bg-[#f14c52] transition-all duration-150 text-white rounded-[5px] uppercase font-medium self-center"
                            >
                                Add Unit
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence> */}

            <div
                className={`px-pima-x max-md:px-8 py-pima-y flex flex-col gap-6 transition-all duration-[250] ${
                    isAddModalOpen ? "blur-md pointer-events-none" : ""
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
                    className="px-10 bg-pima-gray text-white rounded-[5px] flex w-fit py-2"
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
