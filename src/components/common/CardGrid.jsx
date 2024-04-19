import React from "react";

export const CardGrid = (props) => {
    return <div className="grid grid-cols-3 gap-y-12 gap-x-8">{props.children}</div>;
};
