import React from 'react';

const SummaryDiv = ({ summary }) => {
  return (
    <div className="summary p-2 my-4 text-[0.9rem] rounded-xl bg-gray-100">
      <p className="text-gray-600">{summary}</p>
    </div>
  );
};

export default SummaryDiv;