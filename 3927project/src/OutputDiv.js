import React, { useEffect } from 'react';

const OutputDiv = ({ verses, selectedVerses, onVerseClick, theme, onCopyVerses }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'c' && selectedVerses.length > 0) {
        event.preventDefault();
        if (typeof onCopyVerses === 'function') {
          onCopyVerses();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedVerses, onCopyVerses]);

  return (
    <div className={`mx-auto divide-y`}>
      {verses.map((verse, index) => (
        <div 
          key={index} 
          className={`flex cursor-pointer theme-${theme}-bg ${selectedVerses.some(v => v.id === verse.id) ? `theme-${theme}-selectedBg` : ''} theme-${theme}-hover`}
          onClick={() => onVerseClick(verse)}>
        {selectedVerses.some(v => v.id === verse.id) ? <div className='w-2 h-2 p-2 rounded-full theme-${theme}-text opacity-50'>•</div> : <div className='w-2 h-2 p-2 rounded-full theme-${theme}-text'></div>}
        <div 
        className={`p-2 theme-${theme}-line`}
        >
          <p><span className='text-superscript mr-2'>{verse.number}</span> {verse.text}</p>
        </div>
        </div>
      ))}
    </div>
  );
};

export default OutputDiv;
