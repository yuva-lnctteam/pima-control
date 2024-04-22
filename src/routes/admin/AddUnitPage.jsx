import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckmarkIcon, toast } from "react-hot-toast";
import ReactPlayer from "react-player/youtube";

// My components
import SecCard from "../../components/common/SecCard";
import VideoInput from "../../components/admin/VideoInput";
import Loader from "../../components/common/Loader";

import { SERVER_ORIGIN } from "../../utilities/constants";
import { XMarkIcon, TicketIcon } from "@heroicons/react/24/outline";

// TODO: VALIDATION
// ! check response codes

const AdminAddUnit = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isAddUnitBtnDisabled, setIsAddUnitBtnDisabled] = useState(true);

    const navigate = useNavigate();
    const params = useParams();

    async function handleAddUnit() {
        setIsAddUnitBtnDisabled(true);
        const { verticalId, courseId } = params;
        // (params);

        try {
            const adminId = process.env.REACT_APP_ADMIN_ID;
            const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;
            const basicAuth = btoa(`${adminId}:${adminPassword}`);
            const unit = {
                video: unitDet,
                quiz: quizArr,
            };

            const response = await fetch(
                `${SERVER_ORIGIN}/api/admin/auth/verticals/${verticalId}/courses/${courseId}/units/add`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": localStorage.getItem("token"),
                        Authorization: `Basic ${basicAuth}`,
                    },
                    body: JSON.stringify(unit),
                }
            );

            setIsAddUnitBtnDisabled(false);

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
                toast.success(result.statusText);
                navigate(-1); // go back to all units page
            } else {
                // for future
            }

            // navigate(`/admin/verticals/${verticalId}/courses/${courseId}/units/all`);
        } catch (err) {}
    }

    const [unitDet, setUnitDet] = useState({
        title: String,
        vdoSrc: null,
        desc: String,
    });

    const [quizArr, setQuizArr] = useState([]);
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState([
        { text: "", isChecked: false },
        { text: "", isChecked: false },
        { text: "", isChecked: false },
        { text: "", isChecked: false },
    ]);

    function handleQuizSubmit(e) {
        e.preventDefault();
        setIsAddUnitBtnDisabled(false);

        // To display only the options which have text in an orderly manner
        const filteredOptions = options.filter((op) => op.text.trim() !== "");

        const quizDet = {
            question: question,
            opArr: filteredOptions,
        };

        setQuizArr([...quizArr, quizDet]);

        setQuestion("");
        setOptions([
            { text: "", isChecked: false },
            { text: "", isChecked: false },
            { text: "", isChecked: false },
            { text: "", isChecked: false },
        ]);
    }
    console.log(quizArr);

    return (
        <>
            <div className="py-pima-y px-pima-x">
                <h1 className="text-4xl font-bold">Add Unit Here</h1>
                <div className="flex py-pima-y w-full">
                    <form
                        className="flex flex-col gap-6 w-1/2 pr-pima-x"
                        action=""
                        onChange={() => setIsAddUnitBtnDisabled(false)}
                    >
                        <label
                            className="text-sm text-stone-500"
                            htmlFor="unitTitle"
                        >
                            Unit Title
                            <input
                                className="border-2 w-full px-4 py-3 rounded border-none bg-[#ededed] placeholder:text-[#828282] placeholder:text-[0.8rem] mt-1 text-black text-base"
                                type="text"
                                id="unitTitle"
                                placeholder="Enter The Unit Title"
                                onChange={(e) => {
                                    setUnitDet((prevVal) => {
                                        return {
                                            title: e.target.value,
                                            vdoSrc: prevVal.vdoSrc,
                                            desc: prevVal.desc,
                                        };
                                    });
                                }}
                            />
                        </label>

                        <label
                            className="text-sm text-stone-500"
                            htmlFor="videoUrl"
                        >
                            Video URL
                            <input
                                className="border-2 w-full px-4 py-3 rounded border-none bg-[#ededed] placeholder:text-[#828282] placeholder:text-[0.8rem] mt-1 text-black text-base"
                                type="url"
                                id="videoUrl"
                                placeholder="Paste the related video url"
                                onChange={(e) => {
                                    setUnitDet((prevVal) => {
                                        return {
                                            title: prevVal.title,
                                            vdoSrc: e.target.value,
                                            desc: prevVal.desc,
                                        };
                                    });
                                }}
                            />
                        </label>

                        <label
                            className="text-sm text-stone-500"
                            htmlFor="unitDescription"
                        >
                            Unit Text-to-Read
                            <textarea
                                className="border-2 w-full px-4 py-3 rounded border-none bg-[#ededed] placeholder:text-[#828282] placeholder:text-[0.8rem] mt-1 text-black text-base"
                                type="text"
                                id="unitDescription"
                                placeholder="Enter The Unit Description"
                                rows="8"
                                onChange={(e) => {
                                    setUnitDet((prevVal) => {
                                        return {
                                            title: prevVal.title,
                                            vdoSrc: prevVal.vdoSrc,
                                            desc: e.target.value,
                                        };
                                    });
                                }}
                            />
                        </label>
                    </form>

                    {/* --------------------- INPUT VIDEO PREVIEW -------------------- */}

                    <div className="bg-pima-gray w-1/2 rounded flex justify-center items-center">
                        {unitDet.vdoSrc ? (
                            <ReactPlayer
                                width="100%"
                                height="100%"
                                url={unitDet.vdoSrc}
                            />
                        ) : (
                            <p className="text-center text-lg text-white">
                                Video Preview Appears Here
                            </p>
                        )}
                    </div>
                </div>

                <hr />

                <div className="py-pima-y flex flex-col">
                    {/* -------------------------------QUIZ QUESTION------------------------------- */}

                    <h1 className="text-4xl font-bold">Edit Quiz Here</h1>
                    <div className="flex py-pima-y w-full gap-8">
                        <form
                            className="flex flex-col gap-6 w-1/2"
                            action=""
                            onSubmit={handleQuizSubmit}
                        >
                            <label className="text-sm text-stone-500">
                                Question
                                <input
                                    className="border-2 w-full px-4 py-3 rounded border-none bg-[#ededed] placeholder:text-[#828282] placeholder:text-[0.8rem] mt-1 text-black text-base"
                                    placeholder="Enter The Question"
                                    type="text"
                                    value={question}
                                    onChange={(e) =>
                                        setQuestion(e.target.value)
                                    }
                                    required
                                />
                            </label>
                            <div className="grid grid-cols-2 gap-6 w-full">
                                {options.map((option, index) => (
                                    <div className="flex flex-col" key={index}>
                                        <div className="flex">
                                            <div className="w-4 mr-3"></div>
                                            <label
                                                className="text-sm self-start text-stone-500"
                                                htmlFor=""
                                            >
                                                Option {index + 1}
                                            </label>
                                        </div>
                                        <div className="flex w-full">
                                            <input
                                                className=" w-4 mr-3"
                                                type="checkbox"
                                                checked={option.isChecked}
                                                onChange={() => {
                                                    const updatedOptions = [
                                                        ...options,
                                                    ];
                                                    updatedOptions[
                                                        index
                                                    ].isChecked =
                                                        !option.isChecked;
                                                    setOptions(updatedOptions);
                                                }}
                                            />
                                            <input
                                                className="border-2 w-full py-2 px-4 rounded border-none bg-[#ededed] placeholder:text-[#828282] placeholder:text-[0.8rem] mt-1 text-black text-base"
                                                type="text"
                                                value={option.text}
                                                onChange={(e) => {
                                                    const updatedOptions = [
                                                        ...options,
                                                    ];
                                                    updatedOptions[index].text =
                                                        e.target.value;
                                                    setOptions(updatedOptions);
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button
                                type="submit"
                                className=" px-10 text-center py-1.5 text-sm bg-pima-gray text-white rounded self-center"
                            >
                                Add
                            </button>
                        </form>

                        {/* ------------------------- ALL QUESTIONS DISPLAY ------------------------- */}

                        <div className="max-h-[70vh] overflow-y-auto w-1/2 pr-3">
                            {quizArr.map((item, index) => (
                                <div
                                    className="mb-8 flex gap-2 w-full"
                                    key={index}
                                >
                                    <div className="flex gap-4 w-full">
                                        <span className="font-bold mt-1">
                                            {index + 1}.
                                        </span>
                                        <div className="flex flex-col gap-4 flex-1">
                                            <div className="flex justify-between w-full items-center">
                                                <span className="text-lg font-normal flex-1">
                                                    {item.question}
                                                </span>
                                                <XMarkIcon
                                                    className="w-6 h-6 border rounded-full px-1 border-red-500 hover:bg-red-500 hover:text-white text-red-500 hover:cursor-pointer stroke-2  transition-all duration-100"
                                                    onClick={() => {
                                                        setQuizArr(
                                                            (prevVal) => {
                                                                return prevVal.filter(
                                                                    (_, idx) =>
                                                                        idx !==
                                                                        index
                                                                );
                                                            }
                                                        );
                                                    }}
                                                    key={index}
                                                    value={index}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-4 overflow-hidden">
                                                {item.opArr.map(
                                                    (op, opIndex) => {
                                                        if (op.text === "") {
                                                            return null;
                                                        }
                                                        return (
                                                            <div
                                                                className={`px-4 py-2 flex rounded-[5px] h-auto gap-2 justify-between break-words items-center flex-1  ${
                                                                    op.isChecked
                                                                        ? "bg-green-100 border-[1px] border-green-500"
                                                                        : "border-[1px]"
                                                                }`}
                                                            >
                                                                <p
                                                                    className={`
                                                                    flex-1 break-words break-all`}
                                                                    key={
                                                                        opIndex
                                                                    }
                                                                >
                                                                    {op.text}
                                                                </p>
                                                                {op.isChecked && (
                                                                    <CheckmarkIcon className="w-5 bg-green-600" />
                                                                )}
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={handleAddUnit}
                        className={` px-10 text-center py-1.5 text-sm bg-pima-gray text-white rounded mx-auto
                            ${
                                isAddUnitBtnDisabled ? "cursor-not-allowed" : ""
                            }`}
                        disabled={isAddUnitBtnDisabled}
                    >
                        Upload Unit
                    </button>
                </div>
            </div>
        </>
    );
};

export default AdminAddUnit;
