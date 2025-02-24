import React from 'react';
import { generateCitation } from './utils';

function PresentationModal({ selected, onClose, theme, chaptersMap, booksData }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className={`w-full h-full p-8 flex flex-col items-center justify-center text-white`}>
        <div className="max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          {selected?.map((verse, index) => (
            <div key={verse.id} className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl mb-6">
              <p className="leading-[1.3]">
                <sup className="text-xl md:text-2xl lg:text-3xl mr-2 align-top relative top-[0.15em]">{verse.number}</sup>
                {verse.text}
              </p>
            </div>
          ))}
          {Array.isArray(selected) && selected.length > 0 && chaptersMap && booksData && (
            <div className="text-2xl md:text-3xl mt-8 opacity-75">
              {generateCitation(selected, chaptersMap, booksData, 'medium')}
            </div>
          )}
        </div>
        <button 
          onClick={onClose}
          className={`absolute top-4 right-4 px-4 py-2 theme-${theme}-text opacity-50 hover:opacity-100`}
        >
          ESC
        </button>
      </div>
    </div>
  );
}

export default PresentationModal; 