import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import { SERVER_ORIGIN } from "../../utilities/constants";
import { getVideoThumbnail } from "../../utilities/helper_functions";

// My components
import Loader from "../../components/common/Loader";
import Card from "../../components/user/Card";

import { CardGrid } from "../../components/common/CardGrid";

//! If allVerticals is empty, then it will throw an error when using map function on an empty array because the accessed fields like vertical.name/vertical.desc will not be present, so make a check
//! make handleAddView Courses/Verticals/Units functions non async

const UserUnits = () => {
    const [allUnits, setAllUnits] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [courseInfo, setCourseInfo] = useState({ name: "", desc: "" });
    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        async function getAllUnits() {
            const { verticalId, courseId } = params;

            setIsLoading(true);
            try {
                const userId = process.env.REACT_APP_USER_ID;
                const userPassword = process.env.REACT_APP_USER_PASSWORD;
                const basicAuth = btoa(`${userId}:${userPassword}`);
                const response = await fetch(
                    `${SERVER_ORIGIN}/api/user/auth/verticals/${verticalId}/courses/${courseId}/units/all`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "auth-token": localStorage.getItem("token"),
                            Authorization: `Basic ${basicAuth}`,
                        },
                    }
                );

                // (response);
                const result = await response.json();
                console.log(">>>>>>>>>>", result);
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
                    setCourseInfo(result.courseInfo);
                    setAllUnits(result.allUnits);
                } else {
                    // for future
                }
            } catch (err) {}
            setIsLoading(false);
        }

        getAllUnits();
    }, []);

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    function handleViewUnit(e) {
        const { verticalId, courseId } = params;
        const unitId = e.target.id;
        // (unitId);

        navigate(
            `/user/verticals/${verticalId}/courses/${courseId}/units/${unitId}`
        );
    }

    const loader = <Loader />;

    const element = (
        <div className="px-pima-x py-pima-y flex flex-col gap-10 mt-8">
            <h2
                className="text-4xl font-extrabold underline-offset-[10px] underline leading-relaxed"
                style={{
                    textDecorationColor: "#ed3237",
                }}
            >
                Units
            </h2>
            <CardGrid>
                {allUnits.length > 0 ? (
                    allUnits.map((unit) => {
                        const vdoThumbnail = getVideoThumbnail(
                            unit.video.vdoSrc
                        );
                        unit.vdoThumbnail = vdoThumbnail;

                        return (
                            <div key={unit._id}>
                                <Card
                                    data={unit}
                                    type="unit"
                                    onClick={handleViewUnit}
                                />
                            </div>
                        );
                    })
                ) : (
                    <h1 className="nothingText">Sorry, we found nothing</h1>
                )}
            </CardGrid>
        </div>
    );

    return <>{isLoading ? loader : element}</>;
};

export default UserUnits;
