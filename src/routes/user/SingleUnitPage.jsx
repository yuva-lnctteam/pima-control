import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

// My components
import VideoPlayer from "../../components/user/VideoPlayer";
// import UnitText from "../../components/user/UnitText";
// import SecCard from "../../components/common/SecCard";
// import UnitActivity from "../../components/user/UnitActivity";
// import HeaderCard from "../../components/common/HeaderCard";
import Loader from "../../components/common/Loader";

import { SERVER_ORIGIN, vars } from "../../utilities/constants";

///////////////////////////////////////////////////////////////////////////////////////////////////

const UserSingleUnit = () => {
    const [unit, setUnit] = useState({
        video: null,
        text: "",
        activities: [],
    });
    const [isQuizBtnDisabled, setIsQuizBtnDisabled] = useState(true);
    const [pdf, setPdf] = useState(null);
    // const [courseInfo, setCourseInfo] = useState(null);
    // const [userInfo, setUserInfo] = useState(null);
    // const [certId, setCertId] = useState("");
    const [storedWatchPercentage, setStoredWatchPercentage] = useState(0);
    const [videoWatchTimeCutoffPercentage, setVideoWatchTimeCutoffPercentage] =
        useState(0);

    const [isLoading, setIsLoading] = useState(false);
    const [videoInfo, setVideoInfo] = useState({});
    const [quizAvailable, setQuizAvailable] = useState(false);

    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        async function getUnit() {
            setIsLoading(true);
            const { verticalId, courseId, unitId } = params;

            try {
                const userId = process.env.REACT_APP_USER_ID;
                const userPassword = process.env.REACT_APP_USER_PASSWORD;
                const basicAuth = btoa(`${userId}:${userPassword}`);
                const response = await fetch(
                    `${SERVER_ORIGIN}/api/user/auth/verticals/${verticalId}/courses/${courseId}/units/${unitId}`,
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
                        navigate("/user/login"); // login or role issue
                    } else if (response.status === 404) {
                        navigate("/user/resource-not-found");
                    } else {
                        toast.error(result.statusText);
                    }
                } else if (response.ok && response.status === 200) {
                    console.log("*************", result);
                    setUnit(result.unit);
                    setVideoInfo(result.unit.video);
                    setQuizAvailable(result.unit.quiz?.length > 0);
                    setIsQuizBtnDisabled(!result.isEligibleToTakeQuiz);
                    setStoredWatchPercentage(result.storedWatchPercentage);
                    setVideoWatchTimeCutoffPercentage(
                        result.videoWatchTimeCutoffPercentage
                    );
                    setPdf(result.unit.pdf.url);

                    if (
                        result.storedWatchPercentage >=
                        result.videoWatchTimeCutoffPercentage
                    ) {
                        setIsQuizBtnDisabled((prev) => false);
                    } else {
                        setIsQuizBtnDisabled((prev) => true);
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
        }

        getUnit();
    }, []);

    function handleChangeQuizState() {
        if (storedWatchPercentage < videoWatchTimeCutoffPercentage) {
            setIsQuizBtnDisabled((prev) => false);
        }
    }

    function handleOpenQuizClick() {
        const { verticalId, courseId, unitId } = params;

        navigate(
            `/user/verticals/${verticalId}/courses/${courseId}/units/${unitId}/quiz`
        );
    }

    // function handleGetCertificate() {
    //     // const userMongoId = userInfo._id;
    //     // const { verticalId, courseId, unitId } = params;

    //     // (certId);
    //     navigate(`/user/certificate/${certId}`);
    // }

    const element = (
        <div className="flex px-10 md:px-pima-x py-pima-y flex-col mb-[75px] gap-12">
            <h1 className="text-3xl font-extrabold capitalize break-words">
                {videoInfo.title}
            </h1>
            <div className="flex max-lg:flex-col-reverse w-full justify-between gap-10">
                <div className="flex w-1/2 max-lg:w-full flex-col gap-10">
                    <p className="font-light text-justify overflow-y-scroll h-[500px] max-md:max-h-[500px] overflow-hidden pr-4">
                        {videoInfo.desc}
                    </p>
                    {quizAvailable && (
                        <button
                            onClick={handleOpenQuizClick}
                            className={`rounded-[5px] flex uppercase  font-medium self-end underline underline-offset-2
                        ${
                            videoInfo.vdoSrc && isQuizBtnDisabled
                                ? " text-gray-500  cursor-not-allowed"
                                : ""
                        }`}
                            disabled={videoInfo.vdoSrc && isQuizBtnDisabled}
                        >
                            Take Quiz →
                        </button>
                    )}
                </div>
                <div className="flex flex-col w-1/2 max-lg:w-full gap-8">
                    {videoInfo.vdoSrc ? (
                        <VideoPlayer
                            url={videoInfo.vdoSrc}
                            storedWatchPercentage={storedWatchPercentage}
                            handleChangeQuizState={handleChangeQuizState}
                            videoWatchTimeCutoffPercentage={
                                videoWatchTimeCutoffPercentage
                            }
                        />
                    ) : (
                        <div className="bg-pima-gray h-[300px] w-full flex text-white justify-center items-center rounded-[5px]">
                            No Video available for this Unit
                        </div>
                    )}

                    {pdf !== null && (
                        <a
                            rel="noreferrer"
                            href={pdf}
                            className="px-8 border-2 bg-pima-gray text-center hover:bg-white hover:text-pima-gray hover:border-2 border-pima-gray transition-all text-white rounded-[5px] flex w-fit py-2 uppercase text-sm font-medium"
                            target="_blank"
                        >
                            Open Attached File
                        </a>
                    )}
                </div>
            </div>
        </div>
    );

    return <>{isLoading ? <Loader /> : element}</>;
};

export default UserSingleUnit;
