import React from 'react';

const OutputDiv = ({ verses, selectedVerses, onVerseClick }) => {
  return (
    <div className='mx-auto divide-y divide-gray-300'>
      {verses.map((verse, index) => (
        <div key={index} 
        className={`p-2 ${selectedVerses.some(v => v.id === verse.id) ? 'bg-slate-300' : 'bg-white'} hover:brightness-90 cursor-pointer`}
        onClick={() => onVerseClick(verse)}>
          <p><span className='text-superscript'>{verse.number}</span> {verse.text}</p>
        </div>
      ))}
    </div>
  );
};

export default OutputDiv;
