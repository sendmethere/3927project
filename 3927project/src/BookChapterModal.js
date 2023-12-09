// BookChapterModal.js
import React, { useState } from 'react';

const BookChapterModal = ({ books, onSelect, onClose, theme }) => {
  const [selectedBook, setSelectedBook] = useState(null);

  const handleBookSelect = (book) => {
    setSelectedBook(book);
  };

  const handleChapterSelect = (chapter) => {
    onSelect(`${selectedBook.abbreviation}${chapter}`);
    onClose();
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className={`modal md:w-[50%] w-[80%] theme-${theme}-bg theme-${theme}-text`}>
        <div className='flex justify-between my-3'>
            <div>
            {selectedBook ? (
                <button className={`border theme-${theme}-line theme-${theme}-hover px-2 py-1 rounded-lg cursor-pointer`} onClick={() => setSelectedBook(null)}>이전</button>
            ): ('')}
            </div>
            <button className={`border theme-${theme}-line theme-${theme}-hover px-[10px] py-1 rounded-lg cursor-pointer hidden md:block`} onClick={onClose}>x</button>
            </div>
        {!selectedBook ? (
          <div className="selection-grid grid grid-cols-5 gap-2">
            {books.map(book => (
                <button className={`
                    border theme-${theme}-line theme-${theme}-hover 
                    lg:px-2 px-1
                    lg:py-2 py-1
                    lg:text-[1rem] md:text-[0.9rem] text-[0.8rem]
                `} key={book.id} onClick={() => handleBookSelect(book)}>
                <span className='hidden md:block'>{book.name}</span>
                <span className='md:hidden'>{book.abbreviation}</span>
                </button>
            ))}
          </div>
        ) : (
          <div className="selection-grid grid grid-cols-5 gap-3">
            {Array.from({ length: selectedBook.max_chapter }, (_, i) => (
              <button className={`
              border theme-${theme}-line theme-${theme}-hover 
              lg:px-2 px-1
              lg:py-2 py-1
              lg:text-[1rem] md:text-[0.9rem] text-[0.8rem]
          `} key={i + 1} onClick={() => handleChapterSelect(i + 1)}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default BookChapterModal;
