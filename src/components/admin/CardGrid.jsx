import React from "react";

export const CardGrid = (props) => {
    return (
        <div className="grid grid-cols-3 gap-y-12 gap-x-8 max-[1000px]:grid-cols-2 max-md:grid-cols-1 items-stretch">
            {props.children}
        </div>
    );
};
