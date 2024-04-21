import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

// My components
import SecCard from "../../components/common/SecCard";
import VideoInput from "../../components/admin/VideoInput";
import Loader from "../../components/common/Loader";

import { SERVER_ORIGIN } from "../../utilities/constants";

// TODO: VALIDATION
// ! check response codes

const AdminAddUnit = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isAddUnitBtnDisabled, setIsAddUnitBtnDisabled] = useState(true);

    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        async function canVisitPage() {
            setIsLoading(true);

            const { verticalId, courseId, unitId } = params;

            try {
                const adminId = process.env.REACT_APP_ADMIN_ID;
                const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;
                const basicAuth = btoa(`${adminId}:${adminPassword}`);
                const response = await fetch(
                    `${SERVER_ORIGIN}/api/admin/auth/verify-token`,
                    {
                        method: "POST",
                        headers: {
                            // "Content-Type": "application/json",
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
                        navigate("/user/login"); // login or role issue
                    } else {
                        toast.error(result.statusText);
                    }
                } else if (response.ok && response.status === 200) {
                }
            } catch (err) {
                // (err.message);
            }
        }

        canVisitPage();
    }, []);

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
        vdoSrc: URL,
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
            <div className=" py-pima-y px-pima-x">
                <h1 className="text-4xl">Add Unit Here</h1>
                <div className="flex py-pima-y">
                    <form
                        className="flex flex-col gap-6 w-[50%] pr-pima-x"
                        action=""
                        onChange={() => setIsAddUnitBtnDisabled(false)}
                    >
                        <label
                            className="text-sm font-light"
                            htmlFor="unitTitle"
                        >
                            Unit Title:
                            <input
                                className="border-2 w-full px-2 py-3 rounded border-none bg-[#ededed] text-[0.8rem] placeholder:text-[#828282] placeholder:text-[0.8rem]"
                                type="text"
                                id="unitTitle"
                                placeholder="Enter The Unit Title"
                                onChange={(e) => {
                                    setUnitDet((prevVal) => {
                                        return {
                                            title: e.target.value,
                                            vdoUrl: prevVal.vdoUrl,
                                            desc: prevVal.desc,
                                        };
                                    });
                                }}
                            />
                        </label>

                        <label
                            className="text-sm font-light"
                            htmlFor="videoUrl"
                        >
                            Video URL:
                            <input
                                className="border-2 w-full px-2 py-3 rounded border-none bg-[#ededed] text-[0.8rem] placeholder:text-[#828282] placeholder:text-[0.8rem]"
                                type="url"
                                id="videoUrl"
                                placeholder="Paste the related video url"
                                onChange={(e) => {
                                    setUnitDet((prevVal) => {
                                        return {
                                            title: prevVal.title,
                                            vdoUrl: e.target.value,
                                            desc: prevVal.desc,
                                        };
                                    });
                                }}
                            />
                        </label>

                        <label
                            className="text-sm font-light"
                            htmlFor="unitDescription"
                        >
                            Unit Text-to-Read:
                            <textarea
                                className="border-2 w-full px-2 py-3 rounded border-none bg-[#ededed] text-[0.8rem] placeholder:text-[#828282] placeholder:text-[0.8rem] "
                                type="text"
                                id="unitDescription"
                                placeholder="Enter The Unit Description"
                                rows="8"
                                onChange={(e) => {
                                    setUnitDet((prevVal) => {
                                        return {
                                            title: prevVal.title,
                                            vdoUrl: prevVal.vdoUrl,
                                            desc: e.target.value,
                                        };
                                    });
                                }}
                            />
                        </label>
                    </form>
                    <div className="flex-1 h-screen/2 bg-red-300"></div>
                </div>

                <hr />

                <div className="py-pima-y">
                    {/* -------------------------------QUIZ QUESTION------------------------------- */}

                    <h1 className="text-4xl">Edit Quiz Here</h1>
                    <div className="flex py-pima-y">
                        <form
                            className="flex flex-col gap-6 w-[50%] pr-pima-x"
                            action=""
                            onSubmit={handleQuizSubmit}
                        >
                            <label>
                                Question:
                                <input
                                    className="border-2 w-full px-2 py-3 rounded border-none bg-[#ededed] text-[0.8rem] placeholder:text-[#828282] placeholder:text-[0.8rem]"
                                    type="text"
                                    value={question}
                                    onChange={(e) =>
                                        setQuestion(e.target.value)
                                    }
                                />
                            </label>
                            <br />
                            <div className="grid grid-cols-2">
                                {options.map((option, index) => (
                                    <div className="flex" key={index}>
                                        <input
                                            className=" w-4 mr-4"
                                            type="checkbox"
                                            checked={option.isChecked}
                                            onChange={() => {
                                                const updatedOptions = [
                                                    ...options,
                                                ];
                                                updatedOptions[
                                                    index
                                                ].isChecked = !option.isChecked;
                                                setOptions(updatedOptions);
                                            }}
                                        />
                                        <label className="text-sm" htmlFor="">
                                            Option {index + 1}:
                                            <input
                                                className="border-2 w-full px-2 py-3 rounded border-none bg-[#ededed] text-[0.8rem] placeholder:text-[#828282] placeholder:text-[0.8rem]"
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
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <button
                                type="submit"
                                className=" px-10 text-center py-1.5 text-sm bg-pima-gray text-white rounded font-light self-center"
                            >
                                Add
                            </button>
                        </form>

                        {/* ------------------------- ALL QUESTIONS DISPLAY ------------------------- */}

                        <div className="flex-1 ">
                            {quizArr.map((item, index) => (
                                <div className="mb-6 flex gap-2" key={index}>
                                    <p
                                        className="border-1 bg-red-200 rounded px-1 py-0 text-red-500 text-sm h-fit hover:cursor-pointer"
                                        onClick={() => {
                                            setQuizArr((prevVal) => {
                                                return prevVal.filter(
                                                    (_, idx) => idx !== index
                                                );
                                            });
                                        }}
                                        key={index}
                                        value={index}
                                    >
                                        x
                                    </p>

                                    <div>
                                        <p className="font-semibold mb-4">
                                            Q. {item.question}
                                        </p>

                                        {item.opArr.map((op, opIndex) => (
                                            <p
                                                className="text-sm"
                                                key={opIndex}
                                            >
                                                {opIndex + 1}.{"\u0029"}{" "}
                                                {op.text}{" "}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={handleAddUnit}
                        className={
                            isAddUnitBtnDisabled
                                ? "px-10 text-center py-1.5 text-sm bg-pima-gray text-white rounded font-light self-center cursor-not-allowed"
                                : "px-10 text-center py-1.5 text-sm bg-pima-gray text-white rounded font-light self-center"
                        }
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
