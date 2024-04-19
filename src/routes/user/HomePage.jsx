import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

// My components
import Card from "../../components/user/Card";
import Loader from "../../components/common/Loader";

import { SERVER_ORIGIN } from "../../utilities/constants";
import logo from "../../assets/images/home.png";
import bkt from "../../assets/images/bkt.jpg";
import colgate from "../../assets/images/colgate.png";
import balaji from "../../assets/images/balaji.jpg";
import marathon from "../../assets/images/marathon.jpg";
import nkp from "../../assets/images/nkp.jpg";
import about from "../../assets/images/about.png";

///////////////////////////////////////////////////////////////////////////////////////////////////

const HomePage = () => {
    const params = useLocation();
    // const [allVerticals, setAllVerticals] = useState([]);
    const [projectVerticals, setProjectVerticals] = useState([]); // [vertical1, vertical2]
    const [initiativeVerticals, setInitiativeVerticals] = useState([]); // [vertical3, vertical4, vertical5, vertical6]
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);

        async function getAllVerticals() {
            try {
                const userId = process.env.REACT_APP_USER_ID;
                const userPassword = process.env.REACT_APP_USER_PASSWORD;
                const basicAuth = btoa(`${userId}:${userPassword}`);
                const response = await fetch(
                    `${SERVER_ORIGIN}/api/user/auth/verticals/all`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Basic ${basicAuth}`,
                        },
                    }
                );

                const result = await response.json();
                // (result);

                if (response.status >= 400 && response.status < 600) {
                    if (response.status === 500) {
                        toast.error(result.statusText);
                    }
                } else if (response.ok && response.status === 200) {
                    setProjectVerticals(result.allVerticals?.slice(0, 2));
                    setInitiativeVerticals(result.allVerticals?.slice(2));
                    // setAllVerticals(result.allVerticals);
                } else {
                    // for future
                }
            } catch (err) {}

            setIsLoading(false);
        }

        getAllVerticals();
    }, []);

    async function handleViewCourses(e) {
        const verticalId = e.target.id;
        // if (localStorage.getItem("token")) {
        // } else
        try {
            const userId = process.env.REACT_APP_USER_ID;
            const userPassword = process.env.REACT_APP_USER_PASSWORD;
            const basicAuth = btoa(`${userId}:${userPassword}`);
            const response = await fetch(
                `${SERVER_ORIGIN}/api/user/auth/check-authorized`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": localStorage.getItem("token"),
                        Authorization: `Basic ${basicAuth}`,
                    },
                }
            );
            // (result);

            if (response.status >= 400 && response.status < 600) {
                navigate("/user/login");
            } else if (response.ok && response.status === 200) {
                navigate(`/user/verticals/${verticalId}/courses/all`);
            } else {
                // for future
            }
        } catch (error) {}
    }

    const element = (
        <main className="mt-10 min-h-screen">
            <section className="flex flex-col">
                <div className="flex flex-col-reverse  md:flex-row px-pima-x w-full items-center">
                    <div className="basis-1/2 md:w-2/5 flex flex-col gap-10 flex-1 mb-12">
                        <p className="font-black md:text-4xl lg:text-6xl pr-[100px]">
                            Data driven career planning for every student
                        </p>
                        <p className="text-sm md:text-base pr-[140px]">
                            Pima's 40-year experience working with numerous
                            sectors and processes has given it a deep
                            understanding of technology, customer needs, and the
                            problems, what Automation and Electrical solutions
                            can solve.
                        </p>
                        <button className="px-10 bg-pima-red text-white rounded flex w-fit py-2">
                            Explore Policies
                        </button>
                    </div>
                    <div className="basis-1/2 md:w-3/5 lg:w-2/5 flex-1">
                        <img src={logo} alt="" />
                    </div>
                </div>
                {/* Brands */}
                <div className="flex flex-col md:flex-row items-center md:justify-between px-pima-x md:w-full py-10 gap-6">
                    <img className="w-[200px] h-[78px]" src={colgate} alt="" />
                    <img className="w-[120px] h-[78px]" src={balaji} alt="" />
                    <img
                        className="w-[153px] h-[100px]"
                        src={marathon}
                        alt=""
                    />
                    <img className="w-[150px] h-[70px]" src={nkp} alt="" />
                    <img className="w-[150px] h-[110px]" src={bkt} alt="" />
                </div>
            </section>
            {/* How to use the website */}
            <section className="bg-pima-gray flex flex-col gap-12 md:flex-row py-20 justify-between w-full px-pima-x">
                <div className="md:w-1/2">
                    <p className="text-white text-4xl font-extrabold pb-12">
                        How to use the website?
                    </p>
                    <p className="text-white text-sm md:text-base pb-5">
                        With this intuitive interface, employees can easily
                        navigate through courses, track their progress, and
                        assess their understanding through interactive quizzes
                        and tests.
                    </p>
                    <p className="text-white text-sm md:text-base pb-5">
                        Our platform not only equips employees with the
                        necessary knowledge but also provides employers with
                        valuable insights into employee comprehension and areas
                        for improvement. Join us on a journey towards a more
                        informed and empowered workforce.
                    </p>
                </div>
                <div className="flex justify-end md:w-1/2">
                    <img src={about} alt="" />
                </div>
            </section>
            {/* Verticals */}
            <section className="px-pima-x py-20 flex flex-col gap-14">
                <div className="flex flex-col">
                    <div className="mb-12">
                        <h2
                            className="text-3xl font-extrabold underline-offset-[10px] underline"
                            style={{
                                textDecorationColor: "#ed3237",
                            }}
                        >
                            Learn Policies
                        </h2>
                    </div>
                    <div className="flex gap-8">
                        <Card />
                        <Card />
                        <Card />
                    </div>
                    <button className="text-sm uppercase text-pima-red underline underline-offset-[3px] font-semibold self-end mt-6">
                        All Course →
                    </button>
                </div>
                <div className="flex flex-col">
                    <div className="mb-12">
                        <h2
                            className="text-3xl font-extrabold underline-offset-[10px] underline"
                            style={{
                                textDecorationColor: "#ed3237",
                            }}
                        >
                            Learn Terms & Conditions
                        </h2>
                    </div>
                    <div className="flex gap-8">
                        <Card />
                        <Card />
                        <Card />
                    </div>
                    <button className="text-sm uppercase text-pima-red underline underline-offset-[3px] font-semibold self-end mt-6">
                        All Policies →
                    </button>
                </div>
            </section>
        </main>
    );

    return <>{isLoading ? <Loader /> : element}</>;
};

export default HomePage;
