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
                        toast.error(result.statusText);
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
            <div className="flex px-pima-x py-pima-y min-h-[80vh] max-lg:flex-col-reverse">
                <div className="flex w-[50%] max-lg:w-full flex-col justify-between pt-16 pr-16">
                    <div>
                        <h1 className="text-4xl font-extrabold capitalize">
                            {videoInfo.title}
                        </h1>
                        <p className="font-light text-justify text-sm mt-10 lg:h-[65%] border-b-2 lg:overflow-y-scroll">
                            {videoInfo.desc} Lorem ipsum dolor sit amet
                            consectetur adipisicing elit. Atque itaque optio
                            iure id, exercitationem ea asperiores adipisci
                            officiis necessitatibus nihil quae iste,
                            consequuntur voluptatem vero aliquam? Voluptatum ab
                            omnis sapiente. Lorem ipsum dolor, sit amet
                            consectetur adipisicing elit. Incidunt iste mollitia
                            sunt quibusdam recusandae omnis, itaque fugit
                            voluptatibus dolorum quia delectus nulla voluptatum
                            eum dicta earum repellat culpa consequatur. Magnam.
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Ipsam, corporis culpa mollitia, sunt fugit
                            reiciendis dolor, expedita et porro repudiandae
                            totam dolore quas iusto assumenda delectus debitis
                            sapiente distinctio consequatur.
                        </p>
                    </div>

                    <div className="relative">
                        <button
                            onClick={handleOpenQuizClick}
                            className={
                                isQuizBtnDisabled
                                    ? " text-gray-500 absolute bottom-0 right-0 underline underline-offset-2 cursor-not-allowed"
                                    : "absolute bottom-0 right-0 underline underline-offset-2"
                            }
                            disabled={isQuizBtnDisabled}
                        >
                            Take Quiz →
                        </button>
                    </div>
                </div>
                <div className="flex-1 lg:pl-10">
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
