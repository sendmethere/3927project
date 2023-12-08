import React from 'react';

const SummaryDiv = ({ summary, theme }) => {
  return (
    <div className={`summary p-4 my-4 text-[0.9rem] rounded-xl theme-${theme}-summary`}>
      <p className={`theme-${theme}-text`}>{summary}</p>
    </div>
  );
};

export default SummaryDiv;