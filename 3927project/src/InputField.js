import React, { useState } from 'react';

const InputField = ({ input, onInputChange, theme }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Tab' || e.key === 'Enter') {
      e.preventDefault();
      e.target.blur();
    }
  };

  return (
    <div className="w-full">
      <input
        id="bible-search"
        type="text"
        value={input}
        className={`form-input mt-1 mx-auto block w-full p-2 rounded-full border bg-[#ffffff4d] theme-${theme}-text theme-${theme}-line`}
        placeholder="예: 요3:16-17"
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default InputField;