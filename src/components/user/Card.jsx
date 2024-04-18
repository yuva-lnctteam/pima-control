import React from "react";

function Card() {
    return (
        <div className="flex rounded-[5px] h-[160px] card-shadow">
            <div className="bg-pima-red text-white flex flex-col p-4 rounded-l-[5px] w-[140px] gap-4">
                <span className="uppercase text-[10px] underline underline-offset-[3px] font-semibold">
                    vertical
                </span>
                <span className="text-xl font-semibold">
                    How to use the machines
                </span>
            </div>
            <div className="flex flex-col p-4 rounded-r-[5px] flex-1 items-end justify-between">
                <span className="text-[10px] uppercase font-medium">
                    4 courses
                </span>
                <p className="text-sm line-clamp-3">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Veritatis dicta provident maiores ad eveniet, sed nostrum at
                    perspiciatis molestiae repellendus
                </p>
                <button className="text-[10px] uppercase text-pima-red underline underline-offset-[3px] font-semibold">
                    Explore Course →
                </button>
            </div>
        </div>
    );
}

export default Card;
