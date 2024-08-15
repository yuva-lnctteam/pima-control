import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckmarkIcon, toast } from "react-hot-toast";
import ReactPlayer from "react-player/youtube";

import { SERVER_ORIGIN } from "../../utilities/constants";
import { PencilIcon, XMarkIcon } from "@heroicons/react/24/outline";

// TODO: VALIDATION
// ! check response codes

const AdminEditUnitPage = () => {
    const [unit, setUnit] = useState({
        video: null,
        text: "",
        activities: [],
    });
    // const [isQuizBtnDisabled, setIsQuizBtnDisabled] = useState(true);
    const [oldPdf, setOldPdf] = useState(null);
    const [newPdf, setNewPdf] = useState(null);
    // const [courseInfo, setCourseInfo] = useState(null);
    // const [userInfo, setUserInfo] = useState(null);
    // const [certId, setCertId] = useState("");
    // const [storedWatchPercentage, setStoredWatchPercentage] = useState(0);
    // const [videoWatchTimeCutoffPercentage, setVideoWatchTimeCutoffPercentage] =
    //     useState(0);

    const [isLoading, setIsLoading] = useState(false);
    const [videoInfo, setVideoInfo] = useState({});
    // const [quizAvailable, setQuizAvailable] = useState(false);
    const [isEditUnitBtnDisabled, setIsEditUnitBtnDisabled] = useState(true);
    const [currentEditingIndex, setCurrentEditingIndex] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
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

    useEffect(() => {
        async function getUnit() {
            setIsLoading(true);
            const { verticalId, courseId, unitId } = params;

            try {
                const adminId = process.env.REACT_APP_ADMIN_ID;
                const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;
                const basicAuth = btoa(`${adminId}:${adminPassword}`);
                const response = await fetch(
                    `${SERVER_ORIGIN}/api/admin/auth/verticals/${verticalId}/courses/${courseId}/units/${unitId}`,
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

                if (response.status >= 400 && response.status < 600) {
                    if (response.status === 401) {
                        navigate("/user/login"); // login or role issue
                    } else if (response.status === 404) {
                        navigate("/user/resource-not-found");
                    } else {
                        toast.error(result.statusText);
                    }
                } else if (response.ok && response.status === 200) {
                    // console.log(result);
                    setUnit(result.unit);
                    setVideoInfo(result.unit.video);
                    // setQuizAvailable(result.unit.quiz?.length > 0);
                    // setIsQuizBtnDisabled(!result.isEligibleToTakeQuiz);
                    // setStoredWatchPercentage(result.storedWatchPercentage);
                    // setVideoWatchTimeCutoffPercentage(
                    //     result.videoWatchTimeCutoffPercentage
                    // );
                    setOldPdf(result.unit.pdf);
                    setQuizArr(result.unit.quiz);

                    if (
                        result.storedWatchPercentage >=
                        result.videoWatchTimeCutoffPercentage
                    ) {
                        // setIsQuizBtnDisabled((prev) => false);
                    } else {
                        // setIsQuizBtnDisabled((prev) => true);
                    }
                    // setCourseInfo(result.courseInfo);
                    // setUserInfo(result.userInfo);

                    // setCertId(result.certId);

                    // setIsCertBtnDisabled(!result.isCertGenerated);

                    // we also have userDoc here
                } else {
                    // for future
                }
            } catch (err) {
                // (err.message);
                setIsLoading(false);
            }
            setIsLoading(false);
        }
        getUnit();
    }, []);

    async function handleEditUnit() {
        setIsEditUnitBtnDisabled(true);
        setIsLoading(true);
        const { verticalId, courseId, unitId } = params;

        try {
            const adminId = process.env.REACT_APP_ADMIN_ID;
            const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;
            const basicAuth = btoa(`${adminId}:${adminPassword}`);

            let pdfResponse;
            let unit;
            let unitDetails;

            if (videoInfo.vdoSrc === null || videoInfo.vdoSrc === "") {
                unitDetails = {
                    title: videoInfo.title,
                    desc: videoInfo.desc,
                };
            } else {
                unitDetails = {
                    title: videoInfo.title,
                    vdoSrc: videoInfo.vdoSrc,
                    desc: videoInfo.desc,
                };
            }

            if (newPdf) {
                pdfResponse = await handlePdfUpload();
                unit = {
                    _id: unitId,
                    video: unitDetails,
                    quiz: quizArr,
                    pdf: pdfResponse?.pdf,
                };
            } else {
                unit = {
                    _id: unitId,
                    video: unitDetails,
                    quiz: quizArr,
                    pdf: oldPdf,
                };
            }

            const response = await fetch(
                `${SERVER_ORIGIN}/api/admin/auth/verticals/${verticalId}/courses/${courseId}/units/${unitId}/edit?pdf=${
                    newPdf ? "true" : "false"
                }`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": localStorage.getItem("token"),
                        Authorization: `Basic ${basicAuth}`,
                    },
                    body: JSON.stringify(unit),
                }
            );

            setIsEditUnitBtnDisabled(false);

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
                setVideoInfo({
                    title: "",
                    vdoSrc: null,
                    desc: "",
                });
                navigate(-1);
                setVideoInfo({
                    title: "",
                    vdoSrc: null,
                    desc: "",
                });
            } else {
                // for future
            }
            setIsLoading(false);
            // navigate(`/admin/verticals/${verticalId}/courses/${courseId}/units/all`);
        } catch (err) {}
    }

    async function handlePdfUpload() {
        try {
            const adminId = process.env.REACT_APP_ADMIN_ID;
            const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;
            const basicAuth = btoa(`${adminId}:${adminPassword}`);

            const formData = new FormData();
            formData.append("file", newPdf);

            const response = await fetch(
                `${SERVER_ORIGIN}/api/admin/auth/upload-pdf`,
                {
                    method: "POST",
                    headers: {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                        "auth-token": localStorage.getItem("token"),
                        Authorization: `Basic ${basicAuth}`,
                    },
                    body: formData,
                }
            );

            setIsEditUnitBtnDisabled(false);

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
                // console.log(response);
                return result;
            } else {
                // for future
            }
        } catch (err) {}
    }

    function handlePdfChange(e) {
        setNewPdf(e.target.files[0]);
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

    function handleQuizSubmit(e) {
        e.preventDefault();
        setIsEditUnitBtnDisabled(false);
        setValidQuiz(false);

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

    function handleQuizEdit() {
        setQuizArr((prevQuizArr) =>
            prevQuizArr.map((item, idx) =>
                idx === parseInt(currentEditingIndex)
                    ? { ...item, question, opArr: [...options] }
                    : item
            )
        );
        setQuestion("");
        setOptions([
            { text: "", isChecked: false },
            { text: "", isChecked: false },
            { text: "", isChecked: false },
            { text: "", isChecked: false },
        ]);
        setIsEditing(false);
        setIsEditUnitBtnDisabled(false);
    }

    return (
        <>
            <div className="py-pima-y px-pima-x flex flex-col">
                <h1 className="text-4xl font-bold">Edit Unit</h1>
                <div className="flex py-pima-y w-full flex-col-reverse md:flex-row items-center gap-6 md:gap-0">
                    <form
                        className="flex flex-col gap-6 w-full md:w-1/2 md:pr-pima-x"
                        action=""
                        onChange={() => setIsEditUnitBtnDisabled(false)}
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
                                value={videoInfo.title}
                                placeholder="Enter The Unit Title"
                                onChange={(e) => {
                                    setVideoInfo((prevVal) => {
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
                                value={videoInfo.vdoSrc}
                                id="videoUrl"
                                placeholder="Paste the related video URL"
                                onChange={(e) => {
                                    setVideoInfo((prevVal) => {
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
                                value={videoInfo.desc}
                                id="unitDescription"
                                placeholder="Enter The Unit Description"
                                rows="8"
                                onChange={(e) => {
                                    setVideoInfo((prevVal) => {
                                        return {
                                            title: prevVal.title,
                                            vdoSrc: prevVal.vdoSrc,
                                            desc: e.target.value,
                                        };
                                    });
                                }}
                            />
                        </label>
                        <div className="flex  gap-2">
                            <label
                                htmlFor="pdfFile"
                                className="w-fit py-2 px-4 file:rounded-[5px] rounded-[5px] text-sm font-semibold bg-[#efefef] text-black hover:bg-stone-200 transition-all cursor-pointer"
                            >
                                {newPdf
                                    ? "File Uploaded - Click to Change again"
                                    : oldPdf && !newPdf
                                    ? "Change File"
                                    : "Add File"}
                                <input
                                    onChange={handlePdfChange}
                                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-[5px] file:border-0 file:text-sm file:font-semibold file:bg-[#efefef] file:text-black hover:file:bg-stone-200 transition-all mt-2 cursor-pointer hidden"
                                    type="file"
                                    name="unitImg"
                                    id="pdfFile"
                                />
                            </label>
                            {oldPdf && !newPdf && (
                                <a
                                    rel="noreferrer"
                                    href={oldPdf?.url}
                                    className="px-4 border-2 bg-pima-gray border-pima-gray transition-all text-white rounded-[5px] flex w-fit py-2 text-sm font-medium"
                                    target="_blank"
                                >
                                    View Uploaded File
                                </a>
                            )}
                        </div>
                    </form>

                    {/* --------------------- INPUT VIDEO PREVIEW -------------------- */}

                    <div className="bg-pima-gray w-full min-h-[400px] h-[400px] md:w-1/2 rounded flex justify-center items-center">
                        {videoInfo.vdoSrc ? (
                            <ReactPlayer
                                width="100%"
                                height="100%"
                                url={videoInfo.vdoSrc}
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
                            // onSubmit={handleQuizSubmit}
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
                            {isEditing ? (
                                <button
                                    type="button"
                                    className={` px-10 text-center py-1.5 text-sm bg-pima-gray text-white rounded font-light self-center ${
                                        validQuiz && !(question.trim() === "")
                                            ? `cursor-pointer`
                                            : "cursor-not-allowed bg-[#565656]"
                                    }`}
                                    disabled={
                                        !validQuiz || question.trim() === ""
                                    }
                                    onClick={handleQuizEdit}
                                >
                                    Edit
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className={` px-10 text-center py-1.5 text-sm bg-pima-gray text-white rounded font-light self-center ${
                                        validQuiz && !(question.trim() === "")
                                            ? `cursor-pointer`
                                            : "cursor-not-allowed bg-[#565656]"
                                    }`}
                                    disabled={
                                        !validQuiz || question.trim() === ""
                                    }
                                    onClick={handleQuizSubmit}
                                >
                                    Add
                                </button>
                            )}
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
                                                <div className="flex items-center gap-4">
                                                    <PencilIcon
                                                        className="w-6 h-6 border rounded-full px-1 border-yellow-500 hover:bg-yellow-500 hover:text-white text-red-500 hover:cursor-pointer stroke-2  transition-all duration-100"
                                                        onClick={() => {
                                                            setQuestion(
                                                                item.question
                                                            );
                                                            setIsEditing(true);
                                                            setOptions(
                                                                item.opArr.map(
                                                                    (
                                                                        option
                                                                    ) => ({
                                                                        ...option,
                                                                    })
                                                                )
                                                            );
                                                            setCurrentEditingIndex(
                                                                index
                                                            );
                                                            setValidQuiz(true);
                                                            setIsEditUnitBtnDisabled(
                                                                true
                                                            );
                                                        }}
                                                    />
                                                    <XMarkIcon
                                                        className="w-6 h-6 border rounded-full px-1 border-red-500 hover:bg-red-500 hover:text-white text-red-500 hover:cursor-pointer stroke-2  transition-all duration-100"
                                                        onClick={() => {
                                                            setQuizArr(
                                                                (prevVal) => {
                                                                    return prevVal.filter(
                                                                        (
                                                                            _,
                                                                            idx
                                                                        ) =>
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
                    onClick={handleEditUnit}
                    className={` px-10 text-center self-center py-1.5 text-sm bg-pima-gray text-white rounded mx-auto 
                            ${
                                isEditUnitBtnDisabled
                                    ? "cursor-not-allowed"
                                    : "cursor-pointer"
                            }`}
                    disabled={isEditUnitBtnDisabled}
                >
                    {isLoading ? "Editing..." : "Edit Unit"}
                </button>
            </div>
        </>
    );
};

export default AdminEditUnitPage;
