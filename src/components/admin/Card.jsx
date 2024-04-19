import React from "react";

function Card(props) {
    return (
        <div className="rounded-[5px]">
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
            <div className="bg-pima-red text-white p-6 rounded-t-[5px]">
                <div className="flex justify-between">
                    <p className="text-sm uppercase">verticals</p>
                    <p className="text-sm uppercase">
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
                <p className="text-4xl font-semibold">
                    {props.type === "unit"
                        ? props.data.video.title
                        : props.data.name}
                </p>
            </div>
            <div className="rounded-b-[5px] p-6">
                <p className="">
                    {props.type === "unit"
                        ? props.data.video.desc
                        : props.data.desc}
                </p>

                <div className="">
                    {props.type === "unit" ? null : (
                        <button
                            onClick={(e) => {
                                props.onAddViewClick(e);
                            }}
                        >
                            Add / View{" "}
                            {props.type === "vertical"
                                ? "courses"
                                : props.type === "course"
                                ? "units"
                                : "unit"}
                        </button>
                    )}
                    <button
                        className=""
                        id={props.data._id}
                        onClick={(e) => {
                            props.onDeleteClick(e);
                        }}
                    ></button>
                </div>
            </div>
        </div>
    );
}

export default Card;
