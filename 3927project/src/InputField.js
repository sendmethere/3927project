import React, { useState } from 'react';

const InputField = ({ input, onInputChange, theme }) => {
  return (
    <div className="w-full">
      <input
        type="text"
        value={input}
        className={`form-input mt-1 mx-auto block w-full p-2 rounded-full border bg-[#ffffff4d] theme-${theme}-text theme-${theme}-line`}
        placeholder="예: 요3:16-17"
        onChange={(e) => onInputChange(e.target.value)}
      />
    </div>
  );
};

export default InputField;