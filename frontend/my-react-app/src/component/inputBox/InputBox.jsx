import React from "react";

function InputBox({type, placeholder, value, onChange}){
    return(
        <div className="input-div">
        <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="input-field"
        />            
        </div>
    )
}

export default InputBox;