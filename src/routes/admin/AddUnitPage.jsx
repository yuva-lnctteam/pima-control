import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckmarkIcon, toast } from "react-hot-toast";
import ReactPlayer from "react-player/youtube";

import { SERVER_ORIGIN } from "../../utilities/constants";
import { XMarkIcon } from "@heroicons/react/24/outline";

// TODO: VALIDATION
// ! check response codes

const AdminAddUnit = () => {
    const [isAddUnitBtnDisabled, setIsAddUnitBtnDisabled] = useState(true);
    const [unitDet, setUnitDet] = useState({
        title: String,
        vdoSrc: null,
        desc: String,
    });
    const [unitPdf, setUnitPdf] = useState(null);

    const [quizArr, setQuizArr] = useState([]);
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState([
        { text: "", isChecked: false },
        { text: "", isChecked: false },
        { text: "", isChecked: false },
        { text: "", isChecked: false },
    ]);
    const [validQuiz, setValidQuiz] = useState(false);

    const navigate = useNavigate();
    const params = useParams();

    async function handleAddUnit() {
        setIsAddUnitBtnDisabled(true);
        const { verticalId, courseId } = params;

        try {
            const adminId = process.env.REACT_APP_ADMIN_ID;
            const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;
            const basicAuth = btoa(`${adminId}:${adminPassword}`);

            let pdfResponse;
            let unit;
            let unitDetails;

            if (unitDet.vdoSrc === null || unitDet.vdoSrc === "") {
                unitDetails = {
                    title: unitDet.title,
                    desc: unitDet.desc,
                };
            } else {
                unitDetails = {
                    title: unitDet.title,
                    vdoSrc: unitDet.vdoSrc,
                    desc: unitDet.desc,
                };
            }

            console.log(unitDetails)

            if (unitPdf) {
                pdfResponse = await handlePdfUpload();
                unit = {
                    video: unitDetails,
                    quiz: quizArr,
                    pdf: pdfResponse?.pdf,
                };
            } else {
                unit = {
                    video: unitDetails,
                    quiz: quizArr,
                };
            }

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
                setUnitDet({
                    title: "",
                    vdoSrc: null,
                    desc: "",
                });
                // navigate(-1);
                setUnitDet({
                    title: "",
                    vdoSrc: null,
                    desc: "",
                });
            } else {
                // for future
            }

            // navigate(`/admin/verticals/${verticalId}/courses/${courseId}/units/all`);
        } catch (err) {}
    }

    async function handlePdfUpload() {
        try {
            const adminId = process.env.REACT_APP_ADMIN_ID;
            const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;
            const basicAuth = btoa(`${adminId}:${adminPassword}`);

            const formData = new FormData();
            formData.append("pdf", unitPdf);

            const response = await fetch(
                `${SERVER_ORIGIN}/api/admin/auth/upload-pdf`,
                {
                    method: "POST",
                    headers: {
                        "auth-token": localStorage.getItem("token"),
                        Authorization: `Basic ${basicAuth}`,
                    },
                    body: formData,
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
                console.log(response);
                return result;
            } else {
                // for future
            }
        } catch (err) {}
    }

    function handleCheck(index, option) {
        const updatedOptions = [...options];
        updatedOptions[index].isChecked = !option.isChecked;
        setOptions(updatedOptions);

        setValidQuiz(
            updatedOptions.reduce(function (prev, op) {
                return prev | op.isChecked;
            }, 0)
        );
    }

    function handlePdfChange(e) {
        setUnitPdf(e.target.files[0]);
    }

    function handleQuizSubmit(e) {
        e.preventDefault();
        setIsAddUnitBtnDisabled(false);
        setValidQuiz(false);

        // To display only the options which have text in an orderly manner
        // const filteredOptions = options.filter((op) => op.text.trim() !== "");

        const quizDet = {
            question: question,
            opArr: options,
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

    return (
        <>
            <div className="py-pima-y px-pima-x flex flex-col">
                <h1 className="text-4xl font-bold">Add Unit Here</h1>
                <div className="flex py-pima-y w-full flex-col-reverse md:flex-row items-center gap-6 md:gap-0">
                    <form
                        className="flex flex-col gap-6 w-full md:w-1/2 md:pr-pima-x items-center"
                        action=""
                        onChange={() => setIsAddUnitBtnDisabled(false)}
                    >
                        <label
                            className="text-sm text-stone-500 w-full"
                            htmlFor="unitTitle"
                        >
                            Unit Title
                            <input
                                className="border-2 px-4 py-3 rounded border-none bg-[#ededed] placeholder:text-[#828282] placeholder:text-[0.8rem] mt-1 text-black text-base w-full"
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
                            className="text-sm text-stone-500 w-full"
                            htmlFor="videoUrl"
                        >
                            Video URL
                            <input
                                className="border-2 w-full px-4 py-3 rounded border-none bg-[#ededed] placeholder:text-[#828282] placeholder:text-[0.8rem] mt-1 text-black text-base"
                                type="url"
                                id="videoUrl"
                                placeholder="Paste the related video URL"
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
                            className="text-sm text-stone-500 w-full"
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
                        <label
                            htmlFor="pdfFile"
                            className="text-sm text-stone-500 w-full"
                        >
                            Import PDF
                            <input
                                onChange={handlePdfChange}
                                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-[5px] file:border-0 file:text-sm file:font-semibold file:bg-[#efefef] file:text-black hover:file:bg-stone-200 transition-all mt-1 cursor-pointer"
                                type="file"
                                name="unitImg"
                                id="pdfFile"
                            />
                        </label>
                    </form>

                    {/* --------------------- INPUT VIDEO PREVIEW -------------------- */}

                    <div className="bg-pima-gray w-full min-h-[400px] h-[400px] md:w-1/2 rounded flex justify-center items-center">
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
                    <div className="flex py-pima-y w-full gap-8 md:flex-row flex-col">
                        <form
                            className="flex flex-col gap-6 w-full md:w-1/2"
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
                                    <div
                                        className="flex flex-col w-full"
                                        key={index}
                                    >
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
                                                onChange={() =>
                                                    handleCheck(index, option)
                                                }
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
                                className={` px-10 text-center py-1.5 text-sm bg-pima-gray text-white rounded font-light self-center ${
                                    validQuiz && !(question.trim() === "")
                                        ? `cursor-pointer`
                                        : "cursor-not-allowed bg-[#565656]"
                                }`}
                                disabled={!validQuiz || question.trim() === ""}
                            >
                                Add
                            </button>
                        </form>

                        {/* ------------------------- ALL QUESTIONS DISPLAY ------------------------- */}

                        <div className="max-h-[70vh] overflow-y-auto w-full mt-10 md:mt-0 md:w-1/2 pr-3">
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
                </div>
            </div>
            <div className="py-2 w-full bg-white  sticky bottom-0 flex justify-center shadow-xl border-t inset-3">
                <button
                    onClick={handleAddUnit}
                    className={` px-10 text-center self-center py-1.5 text-sm bg-pima-gray text-white rounded mx-auto 
                            ${
                                isAddUnitBtnDisabled
                                    ? "cursor-not-allowed"
                                    : "cursor-pointer"
                            }`}
                    disabled={isAddUnitBtnDisabled}
                >
                    Upload Unit
                </button>
            </div>
        </>
    );
};

export default AdminAddUnit;
