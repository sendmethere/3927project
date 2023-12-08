import React, { useState } from 'react';

const InputField = ({ onInputChange }) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        className="form-input mt-1 mx-auto block w-full p-2 rounded-full border border-[#999]"
        placeholder="예: 요3:16-17"
        onChange={(e) => onInputChange(e.target.value)}
      />
    </div>
  );
};

export default InputField;