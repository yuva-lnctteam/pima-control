function Card(props) {
    console.log(props);
    return (
        <div className="admin-card rounded-[5px] border flex flex-col relative">
            <div className="flex flex-col gap-5 bg-pima-red text-white rounded-t-[5px] h-[200px]">
                <span className="absolute uppercase text-[10px] underline underline-offset-[3px] font-semibold top-3 left-3">
                    {props.type}
                </span>
                <p className="absolute uppercase text-[10px] underline underline-offset-[3px] font-semibold text-right top-3 right-3">
                    {props.type === "vertical"
                        ? props.data.courseCount + " Courses"
                        : props.type === "course"
                        ? props.data.unitCount + " Units"
                        : props.data.activityCount +
                          " Activities • " +
                          props.data.quizCount +
                          " Questions"}
                </p>
                <img
                    src={props?.data?.image?.src || props.data.vdoThumbnail}
                    alt=""
                    className="w-full h-full object-cover rounded-t-[5px] grad"
                />
            </div>
            <div className="flex flex-col gap-14 rounded-b-[5px] p-6 flex-grow justify-between">
                <p className="text-2xl font-bold break-words">
                    {props.type === "unit"
                        ? props.data.video.title
                        : props.data.name}
                </p>
                <p className="text-stone-600 line-clamp-[4] text-sm text-justify ">
                    {props.type === "unit"
                        ? props.data.video.desc
                        : props.data.desc}
                </p>
                <div className="flex justify-between">
                    {props.type === "unit" ? null : (
                        <button
                            className="text-black text-[11px] font-semibold flex items-center gap-1 border-b-[1px] border-black uppercase group transition-all"
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
                    )}
                    <button
                        className="bg-pima-red text-white p-1.5 rounded-[5px] flex uppercase text-xs items-center px-2.5 gap-1 font-medium"
                        id={props.data._id}
                        onClick={props.onDeleteClick}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Card;
