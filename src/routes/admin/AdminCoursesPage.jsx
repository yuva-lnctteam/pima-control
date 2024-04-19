import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

// My components
import Card from "../../components/admin/Card";
import { CardGrid } from "../../components/common/CardGrid";
import Loader from "../../components/common/Loader";

import { SERVER_ORIGIN, validation } from "../../utilities/constants";
import { refreshScreen } from "../../utilities/helper_functions";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/solid";

const CoursesPage = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [verticalInfo, setverticalInfo] = useState({ name: "", desc: "" });
    const [isSaveBtnDisabled, setIsSaveBtnDisabled] = useState(false);
    const [allCourses, setAllCourses] = useState([]);
    const [newCourse, setNewCourse] = useState({ name: "", desc: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [addCourseLoading, setAddCourseLoading] = useState(false);
    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        async function getAllCourses() {
            setIsLoading(true);
            const { verticalId } = params;

            try {
                const adminId = process.env.REACT_APP_ADMIN_ID;
                const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;
                const basicAuth = btoa(`${adminId}:${adminPassword}`);
                const response = await fetch(
                    `${SERVER_ORIGIN}/api/admin/auth/verticals/${verticalId}/courses/all`,
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
                    setverticalInfo(result.verticalInfo);
                    setAllCourses(result.allCourses);
                } else {
                    // for future
                }
            } catch (err) {
                setIsLoading(false);
            }
        }

        getAllCourses();
    }, []);

    // const saveVInfoChanges = async () => {
    //   setIsSaveBtnDisabled(true);

    //   try {
    //     const { verticalId } = params;
    //     const response = await fetch(
    //       `${SERVER_ORIGIN}/api/admin/auth/verticals/${verticalId}/edit`,
    //       {
    //         method: "PATCH",
    //         headers: {
    //           "Content-Type": "application/json",
    //           "auth-token": localStorage.getItem("token"),
    //         },
    //       }
    //     );

    //     const result = await response.json();
    //     // (result);

    //     setIsSaveBtnDisabled(false);

    //     if (response.status >= 400 && response.status < 600) {
    //       if (response.status === 401) {
    //         navigate("/admin/login"); // login or role issue
    //       } else if (response.status === 404) {
    //         toast.error(result.statusText);
    //       } else if (response.status === 500) {
    //         toast.error(result.statusText);
    //       }
    //     } else if (response.ok && response.status === 200) {
    //       refreshScreen();
    //     } else {
    //       // for future
    //     }
    //   } catch (err) {
    //     (err.message);
    //   }
    // };

    ////////////////////////////////////////////// Add Course Modal ///////////////////////////////////////////////////

    const ref = useRef(null);
    const refClose = useRef(null);

    async function openModal() {
        ref.current.click();
    }

    function onChange(e) {
        const updatedCourse = { ...newCourse, [e.target.name]: e.target.value };
        setNewCourse(updatedCourse);

        // (updatedCourse);
    }

    async function handleAddCourse() {
        const { verticalId } = params;

        // todo: validate input
        setAddCourseLoading(true);
        try {
            const adminId = process.env.REACT_APP_ADMIN_ID;
            const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;
            const basicAuth = btoa(`${adminId}:${adminPassword}`);
            const response = await fetch(
                `${SERVER_ORIGIN}/api/admin/auth/verticals/${verticalId}/courses/add`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": localStorage.getItem("token"),
                        Authorization: `Basic ${basicAuth}`,
                    },
                    body: JSON.stringify(newCourse),
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

            setAddCourseLoading(false);
            refClose.current.click();
        } catch (err) {
            setAddCourseLoading(false);
        }
    }

    /////////////////////////////////////// Delete Course Modal //////////////////////////////////////////////////

    const ref2 = useRef(null);
    const refClose2 = useRef(null);
    const [toDeleteCourseId, setToDeleteCourseId] = useState("");
    const [confirmText, setConfirmText] = useState("");

    function onConfirmTextChange(e) {
        setConfirmText(e.target.value);
    }

    function openDeleteModal(e) {
        ref2.current.click();
        setToDeleteCourseId(e.target.id);
    }

    async function handleDeleteCourse() {
        const { verticalId } = params;
        const courseId = toDeleteCourseId;
        // (courseId);

        // todo: validate input
        try {
            const adminId = process.env.REACT_APP_ADMIN_ID;
            const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;
            const basicAuth = btoa(`${adminId}:${adminPassword}`);
            const response = await fetch(
                `${SERVER_ORIGIN}/api/admin/auth/verticals/${verticalId}/courses/${courseId}/delete`,
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

            refClose2.current.click();
        } catch (err) {}
    }

    const deleteModal = (
        <>
            <button
                ref={ref2}
                type="button"
                className="btn btn-primary d-none"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal3"
            >
                Launch demo modal
            </button>

            <div
                className="modal fade"
                id="exampleModal3"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5
                                className="modal-title text-ff1"
                                id="exampleModalLabel"
                            >
                                Delete course
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            />
                        </div>
                        <div className="modal-body">
                            <div style={{ marginBottom: "0.8rem" }}>
                                <label htmlFor="name" className="modalLabel">
                                    Confirmation
                                </label>
                                <input
                                    type="text"
                                    className="modalInput"
                                    id="confirm"
                                    name="confirm"
                                    minLength={3}
                                    required
                                    placeholder="Type 'Confirm' to delete"
                                    value={confirmText}
                                    onChange={onConfirmTextChange}
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="modalCloseBtn"
                                data-bs-dismiss="modal"
                                ref={refClose2}
                            >
                                Close
                            </button>
                            <button
                                onClick={handleDeleteCourse}
                                type="button"
                                className="modalDltBtn"
                                disabled={confirmText !== "Confirm"}
                            >
                                Delete course
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

    async function handleAddOrViewUnits(e) {
        const { verticalId } = params;
        const courseId = e.target.id;

        navigate(
            `/admin/content/verticals/${verticalId}/courses/${courseId}/units/all`
        );
    }

    const loader = <Loader />;

    const element = (
        <section className="mt-8">
            {allCourses.length > 0 ? (
                <CardGrid>
                    {allCourses.map((course) => (
                        <div key={course._id}>
                            <Card
                                data={course}
                                type="course"
                                onAddViewClick={handleAddOrViewUnits}
                                onDeleteClick={openDeleteModal}
                            />
                        </div>
                    ))}
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
            <AnimatePresence>
                {isAddModalOpen && (
                    <motion.div
                        className="fixed bg-white flex flex-col items-center gap-6 border p-6 px-10 m-auto left-0 right-0 top-0 bottom-0 w-[900px] h-fit rounded-[5px] z-[999]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <XMarkIcon
                            className="w-6 h-6 absolute right-4 top-4 cursor-pointer"
                            onClick={() => setIsAddModalOpen(false)}
                        />
                        <h3 className="text-4xl font-bold text-center">
                            Add a Course
                        </h3>

                        <div className="flex flex-col gap-6 w-full">
                            <input
                                type="text"
                                id="name"
                                name="name"
                                minLength={1}
                                maxLength={validation.verticalModal.name.maxLen}
                                onChange={onChange}
                                value={newCourse.name}
                                autoComplete="off"
                                className="w-full px-5 py-3 bg-[#efefef] rounded-[5px] placeholder:text-[#5a5a5a] placeholder:text-sm"
                                placeholder="Title of the Course"
                            />
                            <textarea
                                type="text"
                                id="desc"
                                name="desc"
                                onChange={onChange}
                                maxLength={validation.verticalModal.desc.maxLen}
                                value={newCourse.desc}
                                autoComplete="off"
                                className="w-full px-5 py-3 bg-[#efefef] rounded-[5px] placeholder:text-[#5a5a5a] resize-none placeholder:text-sm"
                                placeholder="Description of the Course"
                            />
                            <button
                                onClick={handleAddCourse}
                                disabled={addCourseLoading}
                                type="button"
                                className="w-fit px-10 text-center py-2.5 bg-pima-red hover:bg-[#f14c52] transition-all duration-150 text-white rounded-[5px] uppercase font-medium self-center"
                            >
                                Add Course
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div
                className={`px-pima-x py-pima-y flex flex-col gap-6 transition-all duration-[250] ${
                    isAddModalOpen ? "blur-md pointer-events-none" : ""
                }`}
            >
                <h1 className="text-4xl font-extrabold">Manage Courses</h1>
                <div className="flex flex-col gap-2">
                    <p className="text-stone-600">
                        You can View / Add / Delete verticals from here. Note:
                        Deleting a vertical is irreversible. Do it at your own
                        risk.
                    </p>
                </div>
                {/* <div className="">
                <div style={{ marginBottom: "0.8rem" }} className="text-ff2">
                    <label>Vertical name</label>
                    <p className="headerSubtitle" contentEditable="true">
                        {verticalInfo.name}
                    </p>
                </div>
                <div style={{ marginBottom: "0.8rem" }} className="text-ff2">
                    <label>Description</label>
                    <p className="headerSubtitle" contentEditable="true">
                        {verticalInfo.desc}
                    </p>
                </div>
                <div style={{ textAlign: "center" }}>
                    <button
                        className={`${css.editBtn} commonBtn`}
                        // onClick={saveVInfoChanges}
                        disabled={isSaveBtnDisabled}
                    >
                        Save changes
                    </button>
                </div>
            </div> */}

                <button
                    onClick={() => setIsAddModalOpen((prev) => !prev)}
                    className="px-10 bg-pima-gray text-white rounded-[5px] flex w-fit py-2"
                >
                    Create a Course
                </button>

                {isLoading ? loader : element}
                {/* {deleteModal} */}
            </div>
        </div>
    );
};

export default CoursesPage;
