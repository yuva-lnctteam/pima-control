import React from "react";

function Card(props) {
    return (
        <div className="admin-card rounded-[5px] border">
            {/* {props.type === "course" ? null : (
                <img
                    className={css.cardImg}
                    src={
                        props.type === "vertical"
                            ? props.data.imgSrc
                            : props.data.vdoThumbnail
                    }
                    alt={props.data.name}
                />
            )} */}
            <div className="flex flex-col gap-5 bg-pima-red text-white p-6 pb-[100px] rounded-t-[5px]">
                <div className="flex justify-between">
                    <p className="text-xs uppercase underline underline-offset-4">
                        verticals
                    </p>
                    <p className="text-xs uppercase">
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
            <div className="flex flex-col gap-14 rounded-b-[5px] p-6">
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
                        {/* <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                            />
                        </svg>  */}
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Card;
