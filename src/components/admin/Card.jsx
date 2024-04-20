import React from "react";

function Card(props) {
    return (
        <div className="admin-card rounded-[5px] border flex flex-col items-stretch">
            <div className="flex flex-col gap-5 bg-pima-red text-white p-6 pb-[100px] rounded-t-[5px]">
                <div className="flex justify-between">
                    <p className="text-xs uppercase underline underline-offset-4">
                        {props.type}
                    </p>
                    <p className="text-xs uppercase text-right">
                        {props.type === "vertical"
                            ? props.data.courseCount + " Courses"
                            : props.type === "course"
                            ? props.data.unitCount + " Units"
                            : props.data.activityCount +
                              " Activities • " +
                              props.data.quizCount +
                              " Questions"}
                    </p>
                </div>
                <p className="text-3xl font-bold">
                    {props.type === "unit"
                        ? props.data.video.title
                        : props.data.name}
                </p>
            </div>
            <div className="flex flex-col gap-14 rounded-b-[5px] p-6 items-stretch">
                <p className="text-stone-600 line-clamp-[4] text-sm text-justify">
                    {props.type === "unit"
                        ? props.data.video.desc
                        : props.data.desc}
                </p>
                <div className="flex justify-between">
                    {props.type === "unit" ? null : (
                        <button
                            className="uppercase underline underline-offset-4 text-xs font-medium"
                            id={props.data._id}
                            onClick={(e) => {
                                props.onAddViewClick(e);
                            }}
                        >
                            Manage{" "}
                            {props.type === "vertical"
                                ? "courses"
                                : props.type === "course"
                                ? "units"
                                : "unit"}{" "}
                            →
                        </button>
                    )}
                    <button
                        className="bg-pima-red text-white p-1 rounded-[5px] flex uppercase text-xs items-center px-2 gap-1 font-medium"
                        id={props.data._id}
                        onClick={(e) => {
                            props.onDeleteClick(e);
                        }}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Card;
