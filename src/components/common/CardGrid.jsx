import React from "react";

export const CardGrid = (props) => {
    return (
        <div className={`${props.className}`}>
            <div className="">{props.children}</div>
        </div>
    );
};
