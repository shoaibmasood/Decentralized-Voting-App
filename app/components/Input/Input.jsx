import React from "react";

function Input({ name, placeholder, type, handleClick }) {
  console.log(handleClick);
  return (
    <div>
      <label className="mb-2 text-slate-500" htmlFor="lname">
        {name}
      </label>
      <input
        type={type}
        className="text-lg bg-transparent"
        name={name}
        id={name}
        placeholder={placeholder}
        required
        onChange={handleClick}
      />
    </div>
  );
}

export default Input;
