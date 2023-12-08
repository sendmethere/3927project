import React from 'react';

const OutputDiv = ({ verses, selectedVerses, onVerseClick, theme }) => {
  return (
    <div className={`mx-auto divide-y`}>
      {verses.map((verse, index) => (
        <div key={index} 
        className={`p-2 theme-${theme}-bg ${selectedVerses.some(v => v.id === verse.id) ? `theme-${theme}-selectedBg` : ''} hover:brightness-90 cursor-pointer theme-${theme}-line`}
        onClick={() => onVerseClick(verse)}>
          <p><span className='text-superscript'>{verse.number}</span> {verse.text}</p>
        </div>
      ))}
    </div>
  );
};

export default OutputDiv;
