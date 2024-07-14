import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/common/Loader";
import { SERVER_ORIGIN, validation } from "../../utilities/constants";
import toast from "react-hot-toast";
import { PencilIcon } from "@heroicons/react/24/solid";

function capitalizeFirstLetter(str) {
    return str?.charAt(0).toUpperCase() + str?.substr(1);
}

const UserProfile = () => {
    const navigate = useNavigate();
    useState(false);
    const params = useParams();
    const { userId } = params;
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [userImg, setUserImg] = useState(null);
    const [verticalData, setVerticalData] = useState([]);
    const [status, setStatus] = useState("Not started yet.");

    for (let i = 0; i < verticalData.length; i++) {
        for (let j = 0; j < verticalData[i].coursesData.length; j++) {}
    }

    function handleUserImgChange(e) {
        setUserImg(URL.createObjectURL(e.target.files[0]));
        setUser((prevState) => ({
            ...prevState,
            userImg: e.target.files[0],
        }));
    }

    const handleProfilePhotoChange = async (e) => {
        e.preventDefault();

        try {
            const userId = process.env.REACT_APP_USER_ID;
            const userPassword = process.env.REACT_APP_USER_PASSWORD;
            const basicAuth = btoa(`${userId}:${userPassword}`);

            let formData = new FormData();
            formData.append("userImg", user.userImg);
            const response = await fetch(
                `${SERVER_ORIGIN}/api/user/auth/edit-profile-pic`,
                {
                    method: "POST",
                    headers: {
                        "auth-token": localStorage.getItem("token"),
                        Authorization: `Basic ${basicAuth}`,
                    },
                    body: formData,
                }
            );

            const result = await response.json();
            // (result);

            if (response.status >= 400 && response.status < 600) {
                if (response.status === 401) {
                    navigate("/admin/login");
                }
            } else if (response.ok && response.status === 200) {
                toast.success("Profile Photo Updated Successfully");
                window.location.reload();
            } else {
                // for future
            }

            setIsLoading(false);
        } catch (err) {
            // (err.message);
            // console.log(err.message);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        async function getUser() {
            try {
                setIsLoading(true);
                const userId = process.env.REACT_APP_USER_ID;
                const userPassword = process.env.REACT_APP_USER_PASSWORD;
                const basicAuth = btoa(`${userId}:${userPassword}`);
                const response = await fetch(
                    `${SERVER_ORIGIN}/api/user/auth/profile`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Basic ${basicAuth}`, // Include Basic Authentication
                            "auth-token": localStorage.getItem("token"),
                        },
                    }
                );
                const result = await response.json();
                if (response.status >= 400 && response.status < 600) {
                    if (response.status === 401) {
                        navigate("/admin/login");
                    } else if (response.status === 500) {
                        toast.error(result.statusText);
                    }
                } else if (response.ok && response.status === 200) {
                    setUser(result?.data?.user);
                    setVerticalData(result?.data.allVerticalsData);
                    console.log(
                        "---------------------",
                        result?.data.allVerticalsData
                    );
                    // console.log(">>>>>>>>>>>>>>", result?.data.);

                    result?.data.allVerticalsData?.forEach(
                        (vertical, index) => {
                            vertical?.coursesData.forEach((course, idx) => {
                                course?.unitsData?.forEach((unit, ix) => {
                                    let status = ""; // Accumulate status in a variable

                                    if (
                                        unit.progress.video.watchTimeInPercent >
                                            0.0 &&
                                        unit.progress.quiz.scoreInPercent === -1
                                    ) {
                                        status = "Started Unit.";
                                    } else if (
                                        unit.progress.quiz.scoreInPercent >=
                                        40.0
                                    ) {
                                        status = "Passed Quiz!";
                                    } else if (
                                        unit.progress.quiz.scoreInPercent < 40.0
                                    ) {
                                        status = "Requires retaking the quiz.";
                                    }
                                    setStatus(status); // Set the status outside the loops
                                });
                            });
                        }
                    );

                    setIsLoading(false);
                } else {
                    // for future
                }
            } catch (err) {
                // (err.message);
                setIsLoading(false);
            }
        }
        getUser();
    }, [userId, navigate]);

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div
                    className={`p-6 md:px-pima-x md:py-pima-y flex flex-col gap-10`}
                >
                    <div className="w-full relative">
                        <div className="flex gap-4 mb-6 justify-between items-center">
                            <div className="flex gap-4 items-center">
                                <label htmlFor="upload">
                                    <div className="relative cursor-pointer group">
                                        <img
                                            src={
                                                userImg ||
                                                user?.image?.src ||
                                                "https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png"
                                            }
                                            className="w-[60px] h-[60px] border rounded-full group-hover:brightness-50 object-cover"
                                            alt=""
                                        />
                                        <PencilIcon className="w-5 h-5 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-white hidden group-hover:block" />
                                        <input
                                            className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-[5px] file:border-0 file:text-sm file:font-semibold file:bg-[#efefef] file:text-black hover:file:bg-stone-200 transition-all hidden"
                                            onChange={handleUserImgChange}
                                            type="file"
                                            name=""
                                            id="upload"
                                            placeholder="Upload Image"
                                        />
                                    </div>
                                </label>
                                {userImg && (
                                    <button
                                        className="px-8 border-2 bg-pima-red text-center hover:bg-white hover:text-pima-red hover:border-2 border-pima-red transition-all text-white rounded-[5px] flex w-fit py-2 uppercase text-sm font-medium"
                                        onClick={handleProfilePhotoChange}
                                    >
                                        Save
                                    </button>
                                )}
                                <h1 className="text-3xl font-extrabold">
                                    {capitalizeFirstLetter(user?.fName)}{" "}
                                    {capitalizeFirstLetter(user?.lName)}
                                </h1>
                            </div>
                            <button
                                className="px-8 border-2 bg-pima-gray text-center hover:bg-white hover:text-pima-gray hover:border-2 border-pima-gray transition-all text-white rounded-[5px] flex w-fit py-2 uppercase text-sm font-medium"
                                onClick={() =>
                                    navigate("/user/profile/update-user")
                                }
                            >
                                Edit Profile
                            </button>
                        </div>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-3 border p-6 rounded-[5px]">
                                <h1 className="text-2xl font-bold text-center mb-4">
                                    User Details
                                </h1>
                                <div className="flex justify-between md:flex-row flex-col md:gap-4">
                                    <span className="font-semibold">
                                        User Id
                                    </span>
                                    <span className="text-[#434343] break-words">
                                        #{user?.userId}
                                    </span>
                                </div>
                                <div className="bg-[#e4e4e4] w-full h-[1px]"></div>
                                <div className="flex justify-between md:flex-row flex-col md:gap-4">
                                    <span className="font-semibold">Email</span>
                                    <span className=" text-[#434343] break-words">
                                        {user?.email}
                                    </span>
                                </div>
                                <div className="bg-[#e4e4e4] w-full h-[1px]"></div>
                                <div className="flex justify-between md:flex-row flex-col md:gap-4">
                                    <span className="font-semibold">
                                        Password
                                    </span>
                                    <span className=" text-[#434343] break-words">
                                        {user?.password}
                                    </span>
                                </div>
                                <div className="bg-[#e4e4e4] w-full h-[1px]"></div>
                                <div className="flex justify-between md:flex-row flex-col md:gap-4">
                                    <span className="font-semibold">
                                        Mobile No.
                                    </span>
                                    <span className=" text-[#434343] break-words">
                                        {user?.phone}
                                    </span>
                                </div>
                                <div className="bg-[#e4e4e4] w-full h-[1px]"></div>
                                <div className="flex justify-between md:flex-row flex-col md:gap-4">
                                    <span className="font-semibold">
                                        Job Position
                                    </span>
                                    <span className=" text-[#434343] break-words">
                                        {user?.jobPosition}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 border p-6 rounded-[5px]">
                                <h1 className="text-2xl font-bold text-center mb-4">
                                    User Progress
                                </h1>
                                {verticalData.map((vertical, index) => (
                                    <div className="flex flex-col" key={index}>
                                        <h1>
                                            <span className="uppercase font-bold">
                                                Vertical:
                                            </span>{" "}
                                            {vertical?.verticalData?.name}
                                        </h1>

                                        <div className="ml-8">
                                            {vertical?.coursesData.map(
                                                (course, index) => (
                                                    <div key={index}>
                                                        <h1>
                                                            {" "}
                                                            <span className="uppercase font-bold">
                                                                Course:
                                                            </span>{" "}
                                                            {
                                                                course
                                                                    ?.courseData
                                                                    ?.name
                                                            }
                                                        </h1>
                                                        <div className="ml-8">
                                                            <ul>
                                                                {course?.unitsData?.map(
                                                                    (
                                                                        unit,
                                                                        index
                                                                    ) => (
                                                                        <li
                                                                            className="list-disc"
                                                                            key={
                                                                                index
                                                                            }
                                                                        >
                                                                            <div
                                                                                key={
                                                                                    index
                                                                                }
                                                                            >
                                                                                <span className="uppercase font-bold">
                                                                                    Unit:
                                                                                </span>{" "}
                                                                                {
                                                                                    unit.name
                                                                                }
                                                                                <br />
                                                                                &rarr;{" "}
                                                                                <span className="capitalize font-bold">
                                                                                    Status:
                                                                                </span>{" "}
                                                                                {
                                                                                    status
                                                                                }
                                                                            </div>
                                                                        </li>
                                                                    )
                                                                )}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserProfile;
