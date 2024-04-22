import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
    // const [courseInfo, setCourseInfo] = useState(null);
    // const [userInfo, setUserInfo] = useState(null);
    // const [certId, setCertId] = useState("");
    const [storedWatchPercentage, setStoredWatchPercentage] = useState(0);
    const [videoWatchTimeCutoffPercentage, setVideoWatchTimeCutoffPercentage] =
        useState(0);

    const [isLoading, setIsLoading] = useState(false);
    const [videoInfo, setVideoInfo] = useState({});

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
                        // toast.error(result.statusText);
                    }
                } else if (response.ok && response.status === 200) {
                    console.log("*************", result);
                    setUnit(result.unit);
                    setVideoInfo(result.unit.video);
                    setIsQuizBtnDisabled(!result.isEligibleToTakeQuiz);
                    setStoredWatchPercentage(result.storedWatchPercentage);
                    setVideoWatchTimeCutoffPercentage(
                        result.videoWatchTimeCutoffPercentage
                    );
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
        setIsQuizBtnDisabled((prev) => !prev);
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
        <div>
            <div className="flex px-pima-x py-pima-y h-[80vh]">
                <div className="flex w-[50%] flex-col justify-between pt-16 pr-16">
                    {/* <h1 className=" text-5xl">{videoInfo.title}</h1> */}
                    {/* <p>{videoInfo.desc}</p> */}
                    <div>
                        <h1 className="text-5xl font-extrabold capitalize">
                            Lorem ipsum dolor sit amet, consectetur
                        </h1>
                        <p className="text-justify mt-10">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit, sed do eiusmod tempor incididunt ut labore et
                            dolore magna aliqua. Viverra tellus in hac habitasse
                            platea dictumst vestibulum. Sed egestas egestas
                            fringilla phasellus faucibus scelerisque eleifend
                            donec. Sapien pellentesque habitant morbi tristique
                            senectus et netus et malesuada. Eget gravida cum
                            sociis natoque penatibus et magnis dis.
                            <br />
                            <br />
                            Sed ullamcorper morbi tincidunt ornare massa eget.
                            Sem fringilla ut morbi tincidunt. Semper quis lectus
                            nulla at volutpat diam. Amet mattis vulputate enim
                            nulla aliquet porttitor lacus. Diam donec adipiscing
                            tristique risus nec feugiat in fermentum.
                        </p>
                    </div>
                    <div className="relative">
                        <button
                            onClick={handleOpenQuizClick}
                            className={`absolute bottom-0 right-0 underline underline-offset-4 font-medium
                                ${
                                    isQuizBtnDisabled
                                        ? "text-gray-500 cursor-not-allowed"
                                        : ""
                                }
                            `}
                            disabled={isQuizBtnDisabled}
                        >
                            Take Quiz →
                        </button>
                    </div>
                </div>

                <div className="flex-1 pl-10">
                    <VideoPlayer
                        url={videoInfo.vdoSrc}
                        storedWatchPercentage={storedWatchPercentage}
                        handleChangeQuizState={handleChangeQuizState}
                        videoWatchTimeCutoffPercentage={
                            videoWatchTimeCutoffPercentage
                        }
                    />
                </div>
            </div>
        </div>
    );

    return <>{isLoading ? <Loader /> : element}</>;
};

export default UserSingleUnit;
