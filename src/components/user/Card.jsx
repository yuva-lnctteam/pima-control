import React from "react";

function Card(props) {
    return (
        <div className="flex rounded-[5px] h-[160px] card-shadow min-w-[200px] max-sm:flex-col max-sm:h-fit ">
            <div className="bg-pima-red text-white flex flex-col p-4 rounded-l-[5px] w-[140px] gap-4 max-sm:w-full max-sm:h-[140px]">
                <span className="uppercase text-[10px] underline underline-offset-[3px] font-semibold">
                    {props.type}
                </span>
                <span className="text-xl font-semibold max-sm:text-2xl">
                    {props.type === "unit"
                        ? props.data.video.title
                        : props.data?.name}
                </span>
            </div>
            <div className="flex flex-col p-4 rounded-r-[5px] flex-1 items-end justify-between max-sm:gap-4">
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
                <p className="text-sm line-clamp-3 self-start">
                    {props.type === "unit"
                        ? props.data?.video.desc
                        : props.data?.desc}
                </p>
                <button
                    className="text-[10px] uppercase text-pima-red underline underline-offset-[3px] font-semibold"
                    id={props.data?._id}
                    onClick={(e) => props.onClick(e)}
                >
                    Explore{" "}
                    {props.type === "vertical"
                        ? "courses"
                        : props.type === "course"
                        ? "units"
                        : "unit"}{" "}
                    →
                </button>
            </div>
        </div>
    );
}

export default Card;
