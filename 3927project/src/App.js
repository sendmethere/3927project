import './App.css';
import { useEffect, useState } from 'react';
import { saveToLocalStorage, loadFromLocalStorage } from './storage';
import logo from './3927logo.svg';

import booksData from './data/books.json';
import chaptersData from './data/chapters.json';
import versesData from './data/verses.json';
import InputField from './InputField';
import OutputDiv from './OutputDiv';
import SummaryDiv from './SummaryDiv';


import { validateAndFetchVerses, copySelectedVerses, moveToNextChapter, moveToPreviousChapter } from './utils';
import BookChapterModal from './BookChapterModal';

function App() {
  
  // 상태값들
    // 장절 검색, 표시, 복사 관련 상태값
    const [input, setInput] = useState('');
    const [verses, setVerses] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [selected, setSelected] = useState([]);
    const [copyMessage, setCopyMessage] = useState('');
    const [currentChapterSummary, setCurrentChapterSummary] = useState('');
    const [currentChapterName, setCurrentChapterName] = useState('');
    const [currentChapterId, setCurrentChapterId] = useState('');
    const [showModal, setShowModal] = useState(false);


    // 옵션 관련 상태값
    const [theme, setTheme] = useState(loadFromLocalStorage('theme',1));
    const [copyFormat, setCopyFormat] = useState(loadFromLocalStorage('copyFormat', 'short')); // 'short', 'medium', 'long' 중 하나
    const [lastVerse, setLastVerse] = useState(loadFromLocalStorage('lastVerse', ''));
    const [copyOptions, setCopyOptions] = useState(loadFromLocalStorage('copyOptions', { bracket: true, lineBreak: true, verseNumber: true }));


    // UI 관련 상태값
    const [showOptions, setShowOptions] = useState(false);

    // 성경 책 데이터 매핑
    const booksMap = booksData.reduce((map, book) => {
      map[book.id] = book;
      return map;
    }, {});

    // 장 데이터 매핑
    const chaptersMap = chaptersData.reduce((map, chapter) => {
      map[chapter.id] = chapter;
      return map;
    }, {});

    // 구절 데이터 매핑
    const versesMap = versesData.reduce((map, verse) => {
      const key = verse.chapter_id;
      if (!map[key]) {
        map[key] = [];
      }
      map[key].push(verse);
      return map;
    }, {});

    // 검색어가 바뀔 때
    const handleInputChange = (value) => {
      setInput(value);
      setLastVerse(value);
      const result = validateAndFetchVerses(value, booksMap, chaptersMap, versesMap);
      if (result.isValid) {
        setVerses(result.verses);
        setCurrentChapterId(result.chapterId);
        setCurrentChapterName(result.chapterName);
        setCurrentChapterSummary(result.chapterSummary);
        setErrorMessage('');
      } else {
        setVerses([]);
        setCurrentChapterId(null);
        setCurrentChapterName('');
        setCurrentChapterSummary('');
        setErrorMessage('구절을 찾지 못했습니다.');
      }
      setSelected([]);
    };

    // 장을 선택할 때
    const toggleVerseSelection = (verse) => {
      setSelected(prevSelected => {
        const isSelected = prevSelected.some(selectedVerse => selectedVerse.id === verse.id);
        if (isSelected) {
          return prevSelected.filter(selectedVerse => selectedVerse.id !== verse.id);
        } else {
          return [...prevSelected, verse].sort((a, b) => a.number - b.number); // 절 번호 순으로 정렬
        }
      });
    };

    // 복사버튼
    const handleCopyVerses = () => {
      copySelectedVerses(selected, chaptersMap, booksData, setCopyMessage, copyFormat, copyOptions);
    };

    // 장 이동 이벤트
    const handleChapterChange = (currentChapterId) => {
      const chapter = chaptersMap[currentChapterId];
      const book = booksMap[chapter.book_id];
      const newSearchValue = `${book.abbreviation}${chapter.number}`;
      handleInputChange(newSearchValue);
    };

    const handleNextChapter = () => {
      moveToNextChapter(currentChapterId, chaptersMap, booksMap, handleChapterChange);
    };

    const handlePreviousChapter = () => {
      moveToPreviousChapter(currentChapterId, chaptersMap, booksMap, handleChapterChange);
    };

    // 테마 변경
    const changeTheme = (themeId) => {
      setTheme(themeId);
    };

    // 복사 옵션
    const copyFormatOptions = [
      { id: 'short', label: '창1:1' },
      { id: 'medium', label: '창세기 1:1' },
      { id: 'long', label: '창세기 1장 1절' }
    ];
    
    const updateCopyOption = (optionKey, value) => {
      setCopyOptions(prevOptions => ({
        ...prevOptions,
        [optionKey]: value
      }));
    };

    //모달창
    const handleModalSelect = (searchValue) => {
      setInput(searchValue);
      handleInputChange(searchValue);
    };

    useEffect(() => {
      saveToLocalStorage('theme', theme);
      saveToLocalStorage('lastVerse', lastVerse);
      saveToLocalStorage('copyFormat', copyFormat);
      saveToLocalStorage('copyOptions', copyOptions);
    }, [theme, lastVerse, copyOptions, copyFormat]);

    useEffect(() => {
      if (lastVerse) {
        setInput(lastVerse);
        handleInputChange(lastVerse);
      }
    }, [lastVerse]);
    

  return (
    <div className={`App w-full h-auto theme-${theme}-bg theme-${theme}-text` }>
      <div className="App mx-auto w-full min-h-screen md:w-1/2 md:min-w-[768px]">
        <div className='flex justify-center p-2'>
        <img className='lg:w-[200px] md:w-[150px] w-[60px]' src={logo} alt="3927 project" /></div>
        <div className="container mx-auto p-2">

          <div className="options-toggle flex justify-end">
            <button onClick={() => setShowOptions(!showOptions)}>⚙️</button>
          </div>
          { // 옵션
            showOptions && (
            <div className="options-menu py-2">
              <div className="flex theme-buttons my-1">
                <span className='p-1 text-[0.8rem] font-bold'>테마</span>
                <button className="theme-1-bg theme-1-text border theme-1-line mx-1 px-2 rounded" onClick={() => changeTheme(1)}>Aa</button>
                <button className="theme-2-bg theme-2-text border theme-2-line  mx-1 px-2 rounded" onClick={() => changeTheme(2)}>Aa</button>
                <button className="theme-3-bg theme-3-text border theme-3-line  mx-1 px-2 rounded" onClick={() => changeTheme(3)}>Aa</button>
                <button className="theme-4-bg theme-4-text border theme-4-line  mx-1 px-2 rounded" onClick={() => changeTheme(4)}>Aa</button>
              </div>
              <div className='flex'>
                <span className='p-1 text-[0.8rem] font-bold'>복사 옵션</span>
                {copyFormatOptions.map(option => (
                  <button
                    key={option.id}
                    className={`mx-1 px-2 py-1 text-[0.8rem] theme-${theme}-line ${copyFormat === option.id ? `border-[2px] theme-${theme}-selectedBg` : 'border'} rounded`}
                    onClick={() => setCopyFormat(option.id)}
                  >
                    {option.label}
                  </button>
                ))}
                 
                <button 
                  className={`mx-1 px-2 py-1 text-[0.8rem] theme-${theme}-line border ${copyOptions.bracket ? `theme-${theme}-selectedBg` : ''} rounded`} 
                  onClick={() => updateCopyOption('bracket', !copyOptions.bracket)}>
                  {copyOptions.bracket ? "인용괄호 ON" : "인용괄호 OFF"}
                </button>
                <button 
                  className={`mx-1 px-2 py-1 text-[0.8rem] theme-${theme}-line border ${copyOptions.lineBreak ? `theme-${theme}-selectedBg` : ''} rounded`} 
                  onClick={() => updateCopyOption('lineBreak', !copyOptions.lineBreak)}>
                  {copyOptions.lineBreak ? "줄바꿈 ON" : "줄바꿈 OFF"}
                </button>
                <button 
                  className={`mx-1 px-2 py-1 text-[0.8rem] theme-${theme}-line border ${copyOptions.verseNumber ? `theme-${theme}-selectedBg` : ''} rounded`} 
                  onClick={() => updateCopyOption('verseNumber', !copyOptions.verseNumber)}>
                  {copyOptions.verseNumber ? "절 표시 ON" : "절 표시 OFF"}
                </button>
              </div>
          </div>
          )}

          <div className='flex items-center my-2'>
            <button className="mx-2 text-[1.5rem]" onClick={() => setShowModal(true)}>📖</button>
          {showModal && (
            <BookChapterModal
              books={booksData}
              onSelect={handleModalSelect}
              onClose={() => setShowModal(false)}
              theme={theme}
            />
          )}
            <InputField input={input} onInputChange={handleInputChange} theme={theme}/>
          </div>
          
          {currentChapterName && (
            <div className='flex my-4 justify-between'>
              <button className={`px-2 border theme-${theme}-line rounded-xl font-bold`} onClick={handlePreviousChapter}>&lt;</button>
              <div className="chapter-name text-center">
                <p className="text-[1.25rem] font-bold">{currentChapterName}</p>
              </div>
              <button className={`px-2 border theme-${theme}-line rounded-xl font-bold`} onClick={handleNextChapter}>&gt;</button>
            </div>
          )}
          <p></p>
          {currentChapterSummary && <SummaryDiv summary={currentChapterSummary} theme={theme}/>}
          {errorMessage && <div className='mx-auto'><p className={`theme-${theme}-text`}>{errorMessage}</p></div>}
          <OutputDiv 
          verses={verses} 
          selectedVerses={selected} 
          onVerseClick={toggleVerseSelection} 
          theme={theme}/>
        </div>
        <div className='md:fixed md:bottom-0 md:left-1/2 md:transform md:-translate-x-1/2 p-3'>
        {
          selected.length > 0 && (
            <button 
              onClick={handleCopyVerses} 
              className={`
              fixed bottom-4 right-4 p-4 
              md:relative md:right-0 md:bottom-0 md:px-8
              theme-${theme}-buttonBg theme-${theme}-buttonText rounded-full shadow-lg opacity-50 hover:opacity-100
              `}
            >
              {copyMessage ? copyMessage : '복사'}
            </button>
          )
        }
        </div>
        {currentChapterName && (
          <div className="container mx-auto p-4">
              <div className='flex justify-between'>
                <button className={`px-2 py-0.5 border theme-${theme}-line rounded-xl font-bold`} onClick={handlePreviousChapter}>&lt;</button>
                <button className={`px-2 py-0.5 border theme-${theme}-line rounded-xl font-bold`} onClick={handleNextChapter}>&gt;</button>
              </div>
          </div>
          )}
        <div className='text-[0.8rem] pb-4 text-center opacity-60'>
          3927 project by 엄사야
        </div>
      </div>
    </div>
  );
}

export default App;
