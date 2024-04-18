import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

// My components
import Card from "../../components/user/Card";
import HeaderCard from "../../components/common/HeaderCard";
import Loader from "../../components/common/Loader";
import { CardGrid } from "../../components/common/CardGrid";

// My css
import homeCss from "../../css/user/home-page.module.css";
import vCss from "../../css/user/verticals-page.module.css";

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
    <>
      <hero>
        <div className="flex flex-col-reverse md:flex-row justify-around p-10">
          <div className="w-full md:w-2/5">
            <p className="font-bold  md:text-4xl lg:text-6xl pb-4 md:pb-8 text-2xl">
              Data driven career planning for every student{" "}
            </p>
            <p className="md:pb-12 text-sm md:text-base  pb-6 text-sm md:text-base">
              Pima's 40-year experience working with numerous sectors and
              processes has given it a deep understanding of technology,
              customer needs, and the problems, what Automation and Electrical
              solutions can solve.
            </p>

            <button className="py-2 px-10 bg-pima-red text-white rounded mt-4">
              Explore Policies
            </button>
          </div>
          <div className="w-full md:w-3/5 lg:w-2/5">
            <img src={logo} />
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center md:justify-around w-4/5 md:w-full pb-12 text-sm md:text-base">
          {" "}
          <img className="w-[200px] h-[78px]" src={colgate} />
          <img className="w-[120px] h-[78px]" src={balaji} />{" "}
          <img className="w-[153px] h-[100px]" src={marathon} />{" "}
          <img className="w-[150px] h-[70px]" src={nkp} />{" "}
          <img className="w-[150px] h-[110px]" src={bkt} />{" "}
        </div>
      </hero>
      {/* black */}
      <div className="bg-black flex flex-col gap-5 lg:flex-row py-20 justify-around w-full mb-5">
        <div className="px-10 w-full lg:w-1/3">
          <p className="text-white md:text-4xl font-bold pb-12 text-sm">
            How to use the website
          </p>
          <p className="text-white text-sm md:text-base pb-5">
            With this intuitive interface, employees can easily navigate through
            courses, track their progress, and assess their understanding
            through interactive quizzes and tests.
          </p>
          <p className="text-white text-sm md:text-base pb-5">
            Our platform not only equips employees with the necessary knowledge
            but also provides employers with valuable insights into employee
            comprehension and areas for improvement. Join us on a journey
            towards a more informed and empowered workforce.
          </p>
        </div>
        <div className="p-8 flex justify-center">
          <img src={about} />
        </div>
      </div>

      {/* policies */}
      <div className="flex flex-col ">
        <div className="flex flex-col w-max p-4 ml-10 md:ml-20 ">
          <p className="text-4xl font-bold">Learn Policies</p>
          <div className="border-2 border-pima-red w-3/4"></div>
        </div>

        <div className="flex p-1 md:p-10 md:m-10 gap-8 flex-col lg:flex-row">
          <card className="flex shadow-lg">
            <div className="bg-pima-red p-5">
              <p className="text-white text-underline text-sm font-semibold">
                VERTICAL
              </p>
              <div className="flex justify-center items-center h-full">
                {" "}
                <p className="text-white font-bold text-xl md:text-4xl">
                  How to use the Machines
                </p>
              </div>
            </div>
            <div className="flex flex-col p-5">
              <p className="ml-auto pb-4">4 COURSES</p>
              <p className="pb-12 text-sm md:text-base">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Dignissim cras tincidunt lobortis feugiat vivamus at augue eget
                arcu. Ut sem nulla pharetra diam{" "}
              </p>
              <p className="ml-auto text-pima-red">EXPLORE COURSE →</p>
            </div>
          </card>

          <card className="flex shadow-lg">
            <div className="bg-pima-red p-5">
              <p className="text-white text-underline text-sm font-semibold">
                VERTICAL
              </p>
              <div className="flex justify-center items-center h-full">
                {" "}
                <p className="text-white font-bold text-xl md:text-4xl">
                  How to use the Machines
                </p>    
              </div>
            </div>
            <div className="flex flex-col p-5">
              <p className="ml-auto pb-4">4 COURSES</p>
              <p className="pb-12 text-sm md:text-base">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Dignissim cras tincidunt lobortis feugiat vivamus at augue eget
                arcu. Ut sem nulla pharetra diam{" "}
              </p>
              <p className="ml-auto text-pima-red">EXPLORE COURSE →</p>
            </div>
          </card>
        </div>
      </div>

      <div className="flex flex-col ">
        <div className="flex flex-col w-max p-4 ml-10 md:ml-20 ">
          <p className="text-2xl md:text-4xl font-bold">
            Our Terms & Conditions
          </p>
          <div className="border-2 border-pima-red w-3/4"></div>
        </div>

        <div className="flex flex-col lg:flex-row p-1 md:p-10 md:m-10 gap-8">
          <card className="flex shadow-lg">
            <div className="bg-pima-red p-5">
              <p className="text-white text-underline text-sm font-semibold">
                VERTICAL
              </p>
              <div className="flex justify-center items-center h-full">
                {" "}
                <p className="text-white font-bold text-xl md:text-4xl">
                  How to use the Machines
                </p>
              </div>
            </div>
            <div className="flex flex-col p-5">
              <p className="ml-auto pb-4">4 COURSES</p>
              <p className="pb-12 text-sm md:text-base">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Dignissim cras tincidunt lobortis feugiat vivamus at augue eget
                arcu. Ut sem nulla pharetra diam{" "}
              </p>
              <p className="ml-auto text-pima-red">EXPLORE COURSE →</p>
            </div>
          </card>

          <card className="flex shadow-lg">
            <div className="bg-pima-red p-5">
              <p className="text-white text-underline text-sm font-semibold">
                VERTICAL
              </p>
              <div className="flex justify-center items-center h-full">
                {" "}
                <p className="text-white font-bold text-xl md:text-4xl">
                  How to use the Machines
                </p>
              </div>
            </div>
            <div className="flex flex-col p-5">
              <p className="ml-auto pb-4">4 COURSES</p>
              <p className="pb-12 text-sm md:text-base">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Dignissim cras tincidunt lobortis feugiat vivamus at augue eget
                arcu. Ut sem nulla pharetra diam{" "}
              </p>
              <p className="ml-auto text-pima-red">EXPLORE COURSE →</p>
            </div>
          </card>
        </div>
      </div>

      {/* <HeaderCard>
        <p className={vCss.headerText}>Here's what we have got for you !</p>
      </HeaderCard> */}
      {/* <div className={`${homeCss.outerDiv} row hero`}>
                <div
                    className={`col-lg-8 col-md-8 col-sm-8 ${homeCss.introDiv}`}
                >
                    <p className={homeCss.introHeading}>
                        Welcome to YUVA Portal
                    </p>
                    <p className={homeCss.introSubheading}>
                        We Are The Voice Of Young Indians Globally
                    </p>
                    <p className={homeCss.introDesc}>
                        YUVA is one of the most active focus areas within Young
                        Indians by which Yi members engage students from across
                        the country in various initiatives that the students
                        conceptualize, plan and execute. The objective is to
                        create a bridge, a platform for the students to work in
                        cross functional teams with a broad objective of
                        enhancing their leadership skills and giving back to the
                        nation.
                    </p>
                    <button
                        className={homeCss.aboutBtn}
                        onClick={() => {
                            navigate("/about");
                        }}
                    >
                        More about Yuva
                    </button>
                    <a href="#verticals" style={{ textDecoration: "none" }}>
                        <button className={homeCss.exploreBtn}>
                            Explore Verticals
                        </button>
                    </a>
                </div>
                <div
                    style={{
                        textAlign: "right",
                        display: "flex",
                        alignItems: "center",
                    }}
                    className="col-lg-4 col-md-4 col-sm-4"
                >
                    <img
                        src={logo}
                        className={homeCss.yuvaImg}
                        alt="yuva-big-img"
                    ></img>
                </div>
            </div>

            <section id="projects" className="d-flex flex-column gap-2">
                <h1 className={homeCss.headerText}>Our Initiatives</h1>
                <div className="horizontal"></div>
                <CardGrid className={homeCss["card-grid-verticals"]}>
                    {projectVerticals.map((vertical) => (
                        <div
                            className="col-lg-6 col-md-6 col-sm-12 text-sm md:text-base cardOuterDiv"
                            key={vertical._id}
                        >
                            <Card
                                data={vertical}
                                type="vertical"
                                onClick={handleViewCourses}
                            />
                        </div>
                    ))}
                </CardGrid>
            </section>

            <section id="initiatives" className="mt-5 d-flex flex-column gap-2">
                <h1 className={homeCss.headerText}>Our Projects</h1>
                <div className="horizontal"></div>
                <CardGrid className={homeCss["card-grid-verticals"]}>
                    {initiativeVerticals.map((vertical) => (
                        <div
                            className="col-lg-6 col-md-6 col-sm-12 text-sm md:text-base cardOuterDiv"
                            key={vertical._id}
                        >
                            <Card
                                data={vertical}
                                type="vertical"
                                onClick={handleViewCourses}
                            />
                        </div>
                    ))}
                </CardGrid>
            </section> */}

      {/* {allVerticals.length > 0 ? (
        <section id="verticals">
          <CardGrid>
            {allVerticals.map((vertical) => (
              <div
                className="col-lg-4 col-md-6 col-sm-12 text-sm md:text-base cardOuterDiv"
                key={vertical._id}
              >
                <Card
                  data={vertical}
                  type="vertical"
                  onClick={handleViewCourses}
                />
              </div>
            ))}
          </CardGrid>
        </section>
      ) : (
        <h1 className="nothingText">Sorry, we found nothing</h1>
      )} */}
    </>
  );

  return <>{isLoading ? <Loader /> : element}</>;
};

export default HomePage;
