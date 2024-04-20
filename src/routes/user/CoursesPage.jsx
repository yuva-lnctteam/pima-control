import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { SERVER_ORIGIN } from "../../utilities/constants";

// My components
import Loader from "../../components/common/Loader";
import Card from "../../components/user/Card";
import HeaderCard from "../../components/common/HeaderCard";
import { CardGrid } from "../../components/common/CardGrid";

// My css
import css from "../../css/user/courses-page.module.css";
import { toast } from "react-hot-toast";

//! If allVerticals is empty, then it will throw an error when using map function on an empty array because the accessed fields like vertical.name/vertical.desc will not be present, so make a check
//! make handleAddView Courses/Verticals/Units functions non async

//////////////////////////////////////////////////////////////////////////////////////////////////////////

const CoursesPage = () => {
    const [allCourses, setAllCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [verticalInfo, setVerticalInfo] = useState({ name: "", desc: "" });
    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        async function getAllCourses() {
            const { verticalId } = params;
            setIsLoading(true);

            try {
                const userId = process.env.REACT_APP_USER_ID;
                const userPassword = process.env.REACT_APP_USER_PASSWORD;
                const basicAuth = btoa(`${userId}:${userPassword}`);
                const response = await fetch(
                    `${SERVER_ORIGIN}/api/user/auth/verticals/${verticalId}/courses/all`,
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
                        localStorage.removeItem("token");
                        navigate("/user/login"); // login or role issue
                    } else if (response.status === 404) {
                        navigate("/user/resource-not-found");
                    } else {
                        toast.error(result.statusText);
                    }
                } else if (response.ok && response.status === 200) {
                    setAllCourses(result.allCourses);
                    setVerticalInfo(result.verticalDoc);
                } else {
                    // for future
                }

                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
            }
        }

        getAllCourses();
    }, []);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////

    function handleViewUnits(e) {
        const { verticalId } = params;
        const courseId = e.target.id;
        // (courseId);

        navigate(`/user/verticals/${verticalId}/courses/${courseId}/units/all`);
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
                Courses
            </h2>
            {allCourses.length > 0 ? (
                <CardGrid>
                    {allCourses.map((course) => (
                        <div key={course._id}>
                            <Card
                                data={course}
                                type="course"
                                onClick={handleViewUnits}
                            />
                        </div>
                    ))}
                </CardGrid>
            ) : (
                <h1 className="nothingText">Sorry, we found nothing</h1>
            )}
        </div>
    );

    return <>{isLoading ? loader : element}</>;
};

export default CoursesPage;
