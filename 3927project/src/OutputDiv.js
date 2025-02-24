import React, { useEffect, useState } from 'react';

const OutputDiv = ({ verses, selectedVerses, onVerseClick, theme, onCopyVerses, focusedIndex, setFocusedIndex, onPrevChapter, onNextChapter, onClearSelection }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ignore all keyboard shortcuts in presentation mode
      if (document.querySelector('.fixed.inset-0.bg-black')) {
        return;
      }

      if (document.activeElement.tagName === 'INPUT') {
        return;
      }

      if (event.code === 'KeyR') {
        event.preventDefault();
        onClearSelection();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        onPrevChapter();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        onNextChapter();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        setFocusedIndex(prev => {
          if (prev >= verses.length - 1) {
            return 0;
          }
          return prev + 1;
        });
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setFocusedIndex(prev => {
          if (prev <= 0) {
            return verses.length - 1;
          }
          return prev - 1;
        });
      } else if (event.key === ' ' && focusedIndex !== -1) {
        event.preventDefault();
        onVerseClick(verses[focusedIndex]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedVerses, onCopyVerses, verses, focusedIndex, onVerseClick, setFocusedIndex, onPrevChapter, onNextChapter, onClearSelection]);

  useEffect(() => {
    if (focusedIndex !== -1) {
      const element = document.getElementById(`verse-${focusedIndex}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [focusedIndex]);

  return (
    <div className={`mx-auto divide-y`}>
      {verses.map((verse, index) => (
        <div 
          id={`verse-${index}`}
          key={index} 
          className={`flex cursor-pointer theme-${theme}-bg 
            ${selectedVerses.some(v => v.id === verse.id) ? `theme-${theme}-selectedBg` : ''} 
            ${focusedIndex === index ? `theme-${theme}-focusedBg` : ''}
            theme-${theme}-hover`}
          onClick={() => {
            setFocusedIndex(index);
            onVerseClick(verse);
          }}>
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
