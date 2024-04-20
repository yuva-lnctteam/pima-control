import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

// My components
import SecCard from "../../components/common/SecCard";
import VideoInput from "../../components/admin/VideoInput";
import TextInput from "../../components/admin/TextInput";
import ActivityInput from "../../components/admin/ActivityInput";
import QuizInput from "../../components/admin/QuizInput";
import Loader from "../../components/common/Loader";

// My css
import css from "../../css/admin/add-unit-page.module.css";

import { SERVER_ORIGIN } from "../../utilities/constants";

// TODO: VALIDATION
// ! check response codes

////////////////////////////////////////////////////////////////////////////////////////////////

function AddActivityBtn(props) {
    return (
        <div style={{ marginBottom: "2rem", textAlign: "center" }}>
            <button
                className={css.addBtn}
                type="button"
                onClick={() => props.handleAddActivity()}
            >
                Add activity
            </button>
        </div>
    );
}
//////////////////////////////////////// QUIZ ///////////////////////////////////////////////////

function AddQuizItemBtn(props) {
    return (
        <div style={{ marginBottom: "2rem", textAlign: "center" }}>
            <button
                className={css.addBtn}
                type="button"
                onClick={() => props.handleAddQuizItem()}
            >
                Add question
            </button>
        </div>
    );
}

/////////////////////////////////////////////////////////////////////////////////////////////////

const AdminAddUnit = () => {
    const [video, setVideo] = useState({ title: "", desc: "", vdoSrc: "" });
    const [text, setText] = useState("");
    const [activities, setActivities] = useState([]);
    const [quiz, setQuiz] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAddUnitBtnDisabled, setIsAddUnitBtnDisabled] = useState(false);

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

    //////////////////////////////////////////////////////////////////////////////

    function onVideoChange(e) {
        setVideo((prevVideo) => {
            const newVideo = { ...prevVideo, [e.target.name]: e.target.value };
            // (newVideo);
            return newVideo;
        });
    }

    ///////////////////////////////////////////////////////////////////////////////

    function onTextChange(e) {
        // (e.target.value);

        setText(e.target.value);
    }

    ///////////////////////////////////////////////////////////////////////////////

    function handleActivityChange(i, e) {
        setActivities((prevActivities) => {
            let newActivities = [...prevActivities];
            newActivities[i] = e.target.value;
            // (newActivities);

            return newActivities;
        });
    }

    function handleAddActivity() {
        setActivities((prevActivities) => {
            const newActivities = [...prevActivities, ""];
            // (newActivities);

            return newActivities;
        });
    }

    function handleDeleteActivity(i) {
        setActivities((prevActivities) => {
            let newActivities = [...prevActivities];
            newActivities.splice(i, 1);
            // (newActivities);

            return newActivities;
        });
    }

    /////////////////////////////////////////////////////////////////////////////////////////

    let handleQuizItemChange = (quizItemIdx, optIdx, e) => {
        setQuiz((prevQuiz) => {
            let newQuiz = [...prevQuiz];

            if (e.target.name === "question") {
                newQuiz[quizItemIdx][e.target.name] = e.target.value;
            } else if (e.target.name === "optText") {
                newQuiz[quizItemIdx].options[optIdx].text = e.target.value;
            } else {
                newQuiz[quizItemIdx].options[optIdx].isChecked =
                    e.target.checked;
            }

            // (newQuiz);

            return newQuiz;
        });
    };

    let handleAddQuizItem = () => {
        setQuiz((prevQuiz) => {
            let newQuiz = [
                ...prevQuiz,
                {
                    question: "",
                    options: [
                        { text: "", isChecked: false },
                        { text: "", isChecked: false },
                        { text: "", isChecked: false },
                        { text: "", isChecked: false },
                    ],
                },
            ];
            // (newQuiz);

            return newQuiz;
        });
    };

    let handleDeleteQuizItem = (quizItemIdx) => {
        setQuiz((prevQuiz) => {
            let newQuiz = [...prevQuiz];
            newQuiz.splice(quizItemIdx, 1);

            // (newQuiz);

            return newQuiz;
        });
    };

    ///////////////////////////////////////////////////////////////////////////////////////////

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

    // const [quizDet, setQuizDet] = useState({
    //     question: String,
    //     options: [
    //         { text: "", isChecked: false },
    //         { text: "", isChecked: false },
    //         { text: "", isChecked: false },
    //         { text: "", isChecked: false },
    //     ],
    // });

    function handleQue(e) {
        const val = e.target.value;

        setQuestion(val);
    }

    const handleOptionChange = (index) => {
        const updatedOptions = [...options];
        updatedOptions[index].isChecked = !updatedOptions[index].isChecked;
        setOptions(updatedOptions);
    };

    const handleTextChange = (index, newText) => {
        const updatedOptions = [...options];
        updatedOptions[index].text = newText;
        setOptions(updatedOptions);
    };

    // const [quizDet, setQuizDet] = useState({
    //     question: String,
    //     option1: String,
    //     option2: String,
    //     option3: String,
    //     option4: String,
    // });

    // function handleQue(e) {
    //     const q = e.target.value;

    //     setQuizDet((prevVal) => {
    //         return {
    //             question: q,
    //             option1: prevVal.oprtion1,
    //             option2: prevVal.oprtion2,
    //             option3: prevVal.oprtion3,
    //             option4: prevVal.oprtion4,
    //         };
    //     });
    // }

    // function handleOp1(e) {
    //     const o = e.target.value;

    //     setQuizDet((prevVal) => {
    //         return {
    //             question: prevVal.question,
    //             option1: o,
    //             option2: prevVal.option2,
    //             option3: prevVal.option3,
    //             option4: prevVal.option4,
    //         };
    //     });
    // }
    // function handleOp2(e) {
    //     const o = e.target.value;

    //     setQuizDet((prevVal) => {
    //         return {
    //             question: prevVal.question,
    //             option1: prevVal.option1,
    //             option2: o,
    //             option3: prevVal.option3,
    //             option4: prevVal.option4,
    //         };
    //     });
    // }
    // function handleOp3(e) {
    //     const o = e.target.value;

    //     setQuizDet((prevVal) => {
    //         return {
    //             question: prevVal.question,
    //             option1: prevVal.option1,
    //             option2: prevVal.option2,
    //             option3: o,
    //             option4: prevVal.option4,
    //         };
    //     });
    // }
    // function handleOp4(e) {
    //     const o = e.target.value;

    //     setQuizDet((prevVal) => {
    //         return {
    //             question: prevVal.question,
    //             option1: prevVal.option1,
    //             option2: prevVal.option2,
    //             option3: prevVal.option3,
    //             option4: o,
    //         };
    //     });
    // }

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

        console.log(quizArr);

        // console.log("Question:", quizDet.question);
        // console.log("Options:", quizDet.options);

        // console.log(quizDet);

        // const quizDet = {
        //     question:
        // }

        // setQuizArr((prevVal) => {
        //     return [...prevVal, quizDet];
        // });

        // setQuizArr((prevVal) => {
        //     return [...prevVal, quizDet];
        // });
    }

    function handleUnitDetSubmit(e) {
        e.preventDefault();

        console.log(unitDet);
    }

    function handleQueDelete(index) {
        setQuizArr((prevVal) => {
            let newVal = [...prevVal];
            newVal.splice(index, 1);

            // (newQuiz);

            return newVal;
        });
    }

    return (
        <>
            {/* {isLoading ? ( */}
            {/* <Loader /> */}
            {/* ) : ( */}
            <div className=" py-pima-y px-pima-x">
                <h1 className="text-4xl">Add Unit Here</h1>
                <div className="flex py-pima-y">
                    <form
                        className="flex flex-col gap-6 w-[50%] pr-pima-x"
                        action=""
                        onSubmit={handleUnitDetSubmit}
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

                        <button
                            type="submit"
                            className=" px-10 text-center py-1.5 text-sm bg-pima-gray text-white rounded font-light self-center"
                        >
                            Add
                        </button>
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
                            {options.map((option, index) => (
                                <div className="flex" key={index}>
                                    <input
                                        className=" w-4 mr-4"
                                        type="checkbox"
                                        checked={option.isChecked}
                                        onChange={() => {
                                            const updatedOptions = [...options];
                                            updatedOptions[index].isCorrect =
                                                !option.isCorrect;
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
                                        onClick={handleQueDelete}
                                    >
                                        x
                                    </p>

                                    <div>
                                        <p className="font-semibold mb-4">
                                            Q. {item.question}
                                        </p>

                                        {item.opArr.map((opt, optIndex) => (
                                            <p
                                                className="text-sm"
                                                key={optIndex}
                                            >
                                                {optIndex + 1}.{"\u0029"}{" "}
                                                {opt.text}{" "}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={handleAddUnit}
                        className=" px-10 text-center py-1.5 text-sm bg-pima-gray text-white rounded font-light self-center"
                        disabled={isAddUnitBtnDisabled}
                    >
                        Upload Unit
                    </button>
                    {/* {quizArr.map((op, index) => {
                        return (
                            <div key={index}>
                                <p>{op.options[index].text}</p>
                            </div>
                        );
                    })} */}

                    {/* <form action="" onSubmit={handleQuizSubmit}>
                        <input
                            onChange={handleQue}
                            className="border-2"
                            type="text"
                            placeholder="Enter Question"
                        />

                        <div>
                            <input
                                onChange={handleOp1}
                                className="border-2"
                                type="text"
                                placeholder="Option 1"
                            />
                            <input
                                onChange={handleOp2}
                                className="border-2"
                                type="text"
                                placeholder="Option 2"
                            />
                            <input
                                onChange={handleOp3}
                                className="border-2"
                                type="text"
                                placeholder="Option 3"
                            />
                            <input
                                onChange={handleOp4}
                                className="border-2"
                                type="text"
                                placeholder="Option 4"
                            />
                        </div>

                        <button type="submit" className="border-2">
                            Add
                        </button>
                    </form> */}

                    {/* {quizArr.map((q, index) => {
                        return (
                            <div>
                                <p>
                                    {index + 1}. {q.question}
                                </p>
                                <p>{q.option1}</p>
                                <p>{q.option2}</p>
                                <p>{q.option3}</p>
                                <p>{q.option4}</p>
                            </div>
                        );
                    })} */}

                    {/* <div>
                        <p>{quizDet.question}</p>

                        <p>{quizDet.option1}</p>
                        <p>{quizDet.option2}</p>
                        <p>{quizDet.option3}</p>
                        <p>{quizDet.option4}</p>
                    </div> */}
                </div>
            </div>
            {/* )} */}
        </>
    );
};

export default AdminAddUnit;

{
    /* <div className={css.outerDiv}>
                    <h1 className={css.headingText}>
                        Adding a new unit for course
                    </h1>

                    <div className={css.commonDiv}>
                        <SecCard>
                            <h2 className="text-ff1">Video</h2>
                            <VideoInput
                                name="title"
                                id="title"
                                label="Title"
                                placeholder="Title"
                                value={video.title}
                                onChange={onVideoChange}
                            />
                            <VideoInput
                                name="desc"
                                id="desc"
                                label="Description"
                                placeholder="Description"
                                value={video.desc}
                                onChange={onVideoChange}
                            />
                            <VideoInput
                                name="vdoSrc"
                                id="video-src"
                                label="Source"
                                placeholder="https://youtube.com...."
                                value={video.vdoSrc}
                                onChange={onVideoChange}
                            />
                        </SecCard>
                    </div>

                    <div className={css.commonDiv}>
                        <SecCard>
                            <h2 className="text-ff1">Text</h2>
                            <TextInput value={text} onChange={onTextChange} />
                        </SecCard>
                    </div>

                    <div className={css.commonDiv}>
                        <SecCard>
                            <h2 className="text-ff1">Activities</h2>
                            <AddActivityBtn
                                handleAddActivity={handleAddActivity}
                            />

                            {activities.map((activity, index) => (
                                <ActivityInput
                                    key={index}
                                    index={index}
                                    handleActivityChange={handleActivityChange}
                                    handleDeleteActivity={handleDeleteActivity}
                                    value={activity}
                                />
                            ))}
                        </SecCard>
                    </div>

                    <div className={css.commonDiv}>
                        <SecCard>
                            <h2 className="text-ff1">Quiz</h2>

                            <AddQuizItemBtn
                                handleAddQuizItem={handleAddQuizItem}
                            />

                            {quiz.map((quizItem, quizItemIdx) => (
                                <QuizInput
                                    key={quizItemIdx}
                                    quizItemIdx={quizItemIdx}
                                    handleQuizItemChange={handleQuizItemChange}
                                    handleDeleteQuizItem={handleDeleteQuizItem}
                                    quizItem={quizItem}
                                />
                            ))}
                        </SecCard>
                    </div>

                    <div style={{ margin: "2rem", textAlign: "center" }}>
                        <button
                            disabled={isAddUnitBtnDisabled}
                            className={css.addBtn}
                            onClick={handleAddUnit}
                        >
                            Add Unit
                        </button>
                    </div>
                </div> */
}
