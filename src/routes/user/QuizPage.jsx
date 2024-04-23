import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Countdown from "react-countdown";
import { toast } from "react-hot-toast";

// My components
import SecCard from "../../components/common/SecCard";
import Loader from "../../components/common/Loader";
import Party from "../../components/user/Party";

// My css
import css from "../../css/user/quiz-page.module.css";

import { SERVER_ORIGIN, vars } from "../../utilities/constants";
import {
    roundOffDecimalPlaces,
    refreshScreen,
    generateQuizInstructions,
} from "../../utilities/helper_functions";

// todo: a user must not be able to leave any question unanswered in the quiz

const UserQuiz = () => {
    const [quiz, setQuiz] = useState([]);
    const [storedQuizScore, setStoredQuizScore] = useState(-1);
    const [isEligibleToTakeQuiz, setIsEligibleToTakeQuiz] = useState(false);
    const [responseQuiz, setResponseQuiz] = useState([]);
    const [response, setResponse] = useState([]);
    const [currQuizScore, setCurrQuizScore] = useState(0);
    const [showQuiz, setShowQuiz] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [showQuizScore, setShowQuizScore] = useState(false);
    const [hasPassedQuiz, setHasPassedQuiz] = useState(false);
    const [hasPassedQuizFirstTime, setHasPassedQuizFirstTime] = useState(false);
    const [rerender, setRerender] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const params = useParams();

    //FOR COUNTDOWN COMPONENT
    const renderer = ({ hours, minutes, seconds, completed }) => {
        if (completed) {
            // Render a completed state
            //   document.getElementById("quiz-submit-btn").click(); // auto submit
            toast("Time is up. calculating results");
            handleSubmitQuiz();
            // ! error here, see console
        } else {
            // Render a countdown
            return (
                <span>
                    {minutes}:{seconds}
                </span>
            );
        }
    };

    useEffect(() => {
        async function getQuiz() {
            setIsLoading(true);

            const { verticalId, courseId, unitId } = params;

            try {
                const userId = process.env.REACT_APP_USER_ID;
                const userPassword = process.env.REACT_APP_USER_PASSWORD;
                const basicAuth = btoa(`${userId}:${userPassword}`);
                const response = await fetch(
                    `${SERVER_ORIGIN}/api/user/auth/verticals/${verticalId}/courses/${courseId}/units/${unitId}/quiz`,
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
                console.log(result);
                // (result);

                setIsLoading(false);

                if (response.status >= 400 && response.status < 600) {
                    if (response.status === 401) {
                        navigate("/user/login"); // login or role issue
                    } else if (response.status === 403) {
                        setIsEligibleToTakeQuiz(false);
                    } else if (response.status === 404) {
                        navigate("/user/resource-not-found");
                    } else {
                        toast.error(result.statusText);
                    }
                } else if (response.ok && response.status === 200) {
                    if (!result.quiz || result.quiz.length === 0) {
                        navigate("/user/resource-not-found");
                    }

                    console.log(result.quiz);
                    setQuiz(result.quiz);
                    setResponseQuiz(
                        result.quiz.map((question) => {
                            return {
                                question: question.question,
                                opArr: question.opArr.map((op) => ({
                                    text: op.text,
                                    isChecked: false,
                                })),
                            };
                        })
                    );
                    setStoredQuizScore(result.quizScoreInPercent);
                    setIsEligibleToTakeQuiz(result.isEligibleToTakeQuiz);

                    // (result.quiz);

                    let initialResponse = [];
                    for (
                        var counter = 0;
                        counter < result.quiz.length;
                        counter++
                    ) {
                        initialResponse.push([false, false, false, false]);
                    }

                    setResponse(initialResponse);
                } else {
                    // for future
                }
            } catch (err) {}
        }

        getQuiz();
        console.log(quiz);
    }, []);

    useEffect(() => {}, [rerender]);

    console.log(response);
    async function handleSubmitQuiz() {
        // calculating the result
        let correctRespCnt = 0; // count of correct responses
        // (response);

        for (let quizItemIdx = 0; quizItemIdx < quiz.length; quizItemIdx++) {
            let isRespCorrect = true;
            /* if default value of isRespCorrect is true, then this handles all the cases including the edge case when the user doesnot enter
      any response for a question, then it would be correct only if all the options of that question are false */
            // quiz[quizIdx].options.length
            for (
                let optIdx = 0;
                optIdx < quiz[quizItemIdx].opArr.length;
                optIdx++
            ) {
                console.log(
                    ">>>>>>>>>>>>>",
                    quiz[quizItemIdx].opArr[optIdx].isChecked
                );
                isRespCorrect =
                    isRespCorrect &&
                    quiz[quizItemIdx].opArr[optIdx].isChecked ===
                        response[quizItemIdx][optIdx];
            }

            correctRespCnt += isRespCorrect === true;
        }

        // (correctRespCnt);

        let calculatedCurrQuizScore = (correctRespCnt * 100) / quiz.length;

        calculatedCurrQuizScore = roundOffDecimalPlaces(
            calculatedCurrQuizScore,
            2
        ); // round off to two decimal places
        // (calculatedCurrQuizScore);

        // submitting result to server
        setIsLoading(true);

        const { verticalId, courseId, unitId } = params;

        try {
            const userId = process.env.REACT_APP_USER_ID;
            const userPassword = process.env.REACT_APP_USER_PASSWORD;
            const basicAuth = btoa(`${userId}:${userPassword}`);
            const response = await fetch(
                `${SERVER_ORIGIN}/api/user/auth/verticals/${verticalId}/courses/${courseId}/units/${unitId}/quiz/submit`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": localStorage.getItem("token"),
                        Authorization: `Basic ${basicAuth}`,
                    },
                    body: JSON.stringify({
                        quizScoreInPercent: calculatedCurrQuizScore,
                    }),
                }
            );

            const result = await response.json();
            // (result);

            if (response.status >= 400 && response.status < 600) {
                if (response.status === 401) {
                    navigate("/user/login"); // login or role issue
                } else if (response.status === 403) {
                    navigate(-1);
                } else if (response.status === 404) {
                    navigate("/user/resource-not-found");
                } else {
                    toast.error(result.statusText); // todo: toast notify, dont redirect, allow user to re-press submit button
                }
            } else if (response.ok && response.status === 200) {
                setCurrQuizScore(calculatedCurrQuizScore);
                setHasPassedQuiz(result.hasPassedQuiz);
                setHasPassedQuizFirstTime(result.hasPassedQuizFirstTime);
                setShowQuiz(false);
                setShowQuizScore(true);
            } else {
                // for future
            }

            setIsLoading(false);
            setShowQuiz(false);
            setShowResult(true);
        } catch (error) {
            setIsLoading(false);
            // (error.message);
        }
    }

    function handleResponseChange(e, quizItemIdx, optIdx) {
        setResponse((prevResponse) => {
            let newResponse = prevResponse;
            newResponse[quizItemIdx][optIdx] =
                !responseQuiz[quizItemIdx].opArr[optIdx].isChecked;
            // (newResponse);
            // (isChecked, quizItemIdx, optIdx);

            return newResponse;
        });

        setResponseQuiz((prev) => {
            prev[quizItemIdx].opArr[optIdx].isChecked =
                !prev[quizItemIdx].opArr[optIdx].isChecked;
            return prev;
        });

        setRerender(!rerender);
    }

    function handleStartQuizClick() {
        setShowQuiz(true);
    }

    // const handleGetCertificate = async () => {
    //     ("Get certificate");
    //     const userId = process.env.REACT_APP_USER_ID;
    //     const userPassword = process.env.REACT_APP_USER_PASSWORD;
    //     const basicAuth = btoa(`${userId}:${userPassword}`);
    //     const { verticalId, courseId, unitId } = params;
    //     const response = await fetch(
    //         `${SERVER_ORIGIN}/api/user/auth/verticals/${verticalId}/courses/${courseId}/units/${unitId}/get-cert-id`,
    //         {
    //             method: "GET",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 "auth-token": localStorage.getItem("token"),
    //                 Authorization: `Basic ${basicAuth}`,
    //             },
    //         }
    //     );
    //     const result = await response.json();
    //     const certId = result.certId;
    //     if (result.success === true) {
    //         navigate(`/user/certificate/${certId}`);
    //     }
    // };

    const instructionsElement = (
        <div className="px-pima-x py-pima-y fixed right-0 w-[40%] flex flex-col gap-4">
            <div className="">
                <div className="">
                    <div className="flex justify-between items-center">
                        <h2 className=" font-extrabold text-3xl">
                            Instructions
                        </h2>
                        {showQuiz ? (
                            <div className=" text-2xl">
                                <strong className="flex items-center">
                                    <i className="fa-regular fa-clock"></i>{" "}
                                    &nbsp;
                                    <Countdown
                                        date={
                                            Date.now() +
                                            quiz.length *
                                                vars.quiz.TIME_PER_QUE_IN_MIN *
                                                60 *
                                                1000
                                        }
                                        renderer={renderer}
                                    />
                                </strong>
                            </div>
                        ) : (
                            <p className="">
                                Duration: {quiz.length * 2} minutes
                            </p>
                        )}
                    </div>

                    <ul className="mt-8 list-disc">
                        {generateQuizInstructions(quiz.length).map(
                            (instruction, index) => {
                                return (
                                    <li className="" key={index}>
                                        {instruction}
                                    </li>
                                );
                            }
                        )}
                    </ul>
                </div>
            </div>
            <div>
                {!showQuiz && (
                    <button
                        className="px-10 bg-pima-gray text-white rounded-[5px] flex w-fit py-2"
                        onClick={handleStartQuizClick}
                        disabled={!isEligibleToTakeQuiz ? true : false}
                    >
                        {isEligibleToTakeQuiz
                            ? "Click to start quiz"
                            : "Quiz Locked"}
                    </button>
                )}
                {storedQuizScore === -1 ? (
                    <p>You never took this quiz before</p>
                ) : (
                    <p>
                        Your latest quiz score is {" "}
                        <span className="font-bold">{storedQuizScore}%</span>
                    </p>
                )}
            </div>
            {showQuiz && (
                <div className="flex justify-between mt-4">
                    <div>
                        <button
                            className="px-10 bg-pima-gray text-white rounded-[5px] flex w-fit py-2"
                            onClick={handleSubmitQuiz}
                        >
                            Submit Quiz
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    const resultElement = (
        <div>
            <SecCard>
                <h1>Your score: {currQuizScore}%</h1>
                <h5>
                    {hasPassedQuiz
                        ? hasPassedQuizFirstTime
                            ? "Congratulations! You have passed the quiz"
                            : "You have already passed the quiz"
                        : `Note: You need to score atleast ${vars.quiz.CUT_OFF_IN_PERCENT}% to pass the quiz`}
                </h5>

                {hasPassedQuiz && (
                    <div>
                        <button className="border" onClick={refreshScreen}>
                            Retake Quiz
                        </button>
                        {/* <button
                        className={css.certBtn}
                        onClick={handleGetCertificate}
                    >
                        Get certificate
                    </button> */}
                        <button
                            className={css.btn}
                            onClick={() => {
                                navigate(-1);
                            }}
                        >
                            Go back to Unit
                        </button>
                    </div>
                )}
            </SecCard>

            {hasPassedQuizFirstTime ? <Party /> : null}
        </div>
    );

    const quizElement = (
        <div
            className={` ${
                showQuiz ? `` : `blur-sm pointer-events-none`
            } w-[60%]`}
        >
            {responseQuiz.length === 0 ? (
                <h1 className="nothingText">
                    There are currently no questions in this quiz.
                </h1>
            ) : (
                <>
                    <div className={css.quizTimerDiv}>
                        <SecCard>
                            <h4
                                style={{
                                    fontFamily: "var(--font-family-1)",
                                }}
                            >
                                All the best! Quiz has been started. Tick the
                                correct answers before the timer runs out.
                            </h4>
                            <div
                                style={{ textAlign: "right", fontSize: "3rem" }}
                            ></div>
                        </SecCard>
                    </div>

                    <div>
                        <SecCard>
                            {responseQuiz.map((quizItem, quizItemIdx) => {
                                return (
                                    <div
                                        key={quizItemIdx}
                                        className={css.quizItemDiv}
                                    >
                                        <p
                                            className="border-2 w-full px-4 py-3 rounded border-none bg-[#ededed] placeholder:text-[#828282] placeholder:text-[0.8rem] mt-1 text-black text-base"
                                            placeholder="Enter The Question"
                                        >
                                            {quizItemIdx + 1}.{" "}
                                            {quizItem.question}
                                        </p>

                                        {quizItem.opArr.map(
                                            (option, optIdx) => {
                                                return (
                                                    <div
                                                        key={
                                                            quizItemIdx * 11 +
                                                            optIdx +
                                                            1
                                                        }
                                                        // style={{ display: "block" }}
                                                    >
                                                        <p
                                                            className={`px-4 py-2 hover:cursor-pointer flex rounded-[5px] h-auto gap-2 justify-between break-words items-center flex-1 hover:border-green-500 hover:border-2  ${
                                                                option.isChecked
                                                                    ? "bg-green-100 border-2 border-green-500"
                                                                    : "border-2"
                                                            }`}
                                                            type="text"
                                                            id={
                                                                quizItemIdx *
                                                                    11 +
                                                                optIdx +
                                                                1
                                                            }
                                                            // defaultChecked={response[quizItemIdx][optIdx]}
                                                            // checked={response[quizItemIdx][optIdx]}
                                                            value={
                                                                response[
                                                                    quizItemIdx
                                                                ][optIdx]
                                                            }
                                                            // checked={true}
                                                            onClick={(e) => {
                                                                handleResponseChange(
                                                                    e,
                                                                    quizItemIdx,
                                                                    optIdx
                                                                );
                                                            }}
                                                        >
                                                            {optIdx}{" "}
                                                            {option.isChecked}
                                                            {option.text}
                                                        </p>
                                                        {/* <label style={{ border: "2px solid red" }}>
                            {option.text}
                          </label> */}
                                                        {/* <p
                                                        // style={{
                                                        //     border: "2px solid white",
                                                        //     display: "inline",
                                                        //     marginLeft: "0.7rem",
                                                        // }}
                                                        >
                                                            {option.text}
                                                        </p> */}
                                                    </div>
                                                );
                                            }
                                        )}

                                        <hr />
                                    </div>
                                );
                            })}
                        </SecCard>
                    </div>
                </>
            )}
        </div>
    );

    return (
        <>
            {/* {isLoading && <Loader />} */}
            {/* {instructionsElement}
            {quizElement} */}
            {/* {isLoading ? (
                <Loader />
            ) : showQuiz ? (
                quizElement
            ) : showQuizScore ? (
                resultElement
            ) : (
                instructionsElement
            )} */}

            {isLoading && <Loader />}
            {showResult ? (
                <div>{resultElement}</div>
            ) : (
                <div className="flex px-pima-x py-pima-y">
                    {quizElement}
                    {instructionsElement}
                </div>
            )}

            {/* {showResult ? { resultElement } : <div></div>} */}

            {/* {isEligibleToTakeQuiz ? (
                <div className=" px-pima-x py-pima-y">
                    <h1 className=" text-3xl">Quiz</h1>
                    {quiz.map((q, index) => {
                        return (
                            <div key={index} className=" mt-8">
                                <strong>
                                    <p>Q. {q.question}</p>
                                </strong>

                                {q.opArr.map((op, opIdx) => {
                                    return (
                                        <p key={opIdx} className=" mt-2">
                                            {opIdx + 1}. {op.text}
                                        </p>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p>Not eligible</p>
            )} */}
            {/* {quizElement} */}
        </>
    );
};

export default UserQuiz;
