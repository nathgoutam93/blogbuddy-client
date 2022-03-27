import React from "react";
import PropTypes from "prop-types";

export default function InputField({ label, value, onChange }) {
  return (
    <div className="relative w-full p-2 pt-6 bg-gray-200 rounded-md">
      <input
        type="text"
        name="name"
        required
        className="peer w-full h-full text-base text-gray-800 bg-gray-200 outline-none border-b-2 border-gray-300"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <label
        html-for="name"
        className="absolute top-6 left-2 pointer-events-none text-sm text-gray-800 peer-valid:top-1 peer-focus:top-1 peer-focus:text-green-500 peer-valid:text-green-500 transition-all"
      >
        {label}
      </label>
    </div>
  );
}

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func
};
