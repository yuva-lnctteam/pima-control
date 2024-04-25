import React from "react";

function Card(props) {
    console.log(props);
    return (
        <div className="cardDiv flex rounded-[5px] h-[200px] card-shadow min-w-[200px] max-sm:flex-col max-sm:h-fit transition-all duration-150 border-[1px]">
            <div className="bg-pima-red text-white flex flex-col rounded-l-[5px] w-[220px] gap-4 max-sm:w-full max-sm:h-[140px] grad relative">
                <span className="absolute uppercase text-[10px] underline underline-offset-[3px] font-semibold mt-2 ml-2 z-[900]">
                    {props.type}
                </span>
                {(props?.data?.image?.src ||
                    props?.data?.vdoThumbnail !==
                        "https://img.youtube.com/vi/false/hqdefault.jpg") && (
                    <img
                        src={
                            props?.data?.image?.src || props?.data?.vdoThumbnail
                        }
                        alt=""
                        className="w-full h-full object-cover rounded-t-[5px]"
                    />
                )}
            </div>
            <div className="flex flex-col p-4 rounded-r-[5px] flex-1 items-end justify-between max-sm:gap-4 bg-[#fcfcfc]">
                <span className="text-[10px] uppercase font-medium">
                    {props.type === "vertical"
                        ? props.data?.courseCount + " Courses"
                        : props?.type === "course"
                        ? props.data?.unitCount + " Units"
                        : props.data?.activityCount +
                          " Activities • " +
                          props.data?.quizCount +
                          " Questions"}
                </span>
                <span className="text-xl font-bold max-sm:text-2xl line-clamp-3 self-start">
                    {props.type === "unit"
                        ? props.data.video.title
                        : props.data?.name}
                </span>
                <p className="text-sm line-clamp-3 self-start">
                    {props.type === "unit"
                        ? props.data?.video.desc
                        : props.data?.desc}
                </p>
                <button
                    className="text-pima-red text-[11px] font-semibold flex items-center gap-1 border-b-[1px] border-pima-red uppercase group transition-all"
                    id={props.data?._id}
                    onClick={(e) => props.onClick(e)}
                >
                    {props.type === "vertical"
                        ? "Explore courses"
                        : props.type === "course"
                        ? "Explore units"
                        : "Study unit"}{" "}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4 stroke-[2px] transition-all group-hover:translate-x-1"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default Card;
