import React from "react";

function Button({label, onClickFn}){
    return <button className="btn" onClick={onClickFn}>{label}</button>
}

export default Button;