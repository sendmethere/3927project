import './App.css';
import { useState } from 'react';
import booksData from './data/books.json';
import versesData from './data/verses.json';
import InputField from './InputField';
import OutputDiv from './OutputDiv';

function App() {

  const [input, setInput] = useState('');
  const [verses, setVerses] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selected, setSelected] = useState([]);
  const [copyMessage, setCopyMessage] = useState('');

  const handleInputChange = (value) => {
    setInput(value);
    const foundVerses = validateAndFetchVerses(value);
    if (foundVerses) {
      setVerses(foundVerses);
      setErrorMessage(''); // 오류 메시지 초기화
    } else {
      setVerses([]); // 유효하지 않은 입력인 경우, verses를 비웁니다.
      setErrorMessage('구절을 찾지 못했습니다.'); // 오류 메시지 설정
    }
    setSelected([]); // 검색어가 변경될 때마다 selected를 비웁니다.
  };

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

  const copySelectedVerses = () => {
    // 선택된 구절들을 절 번호에 따라 정렬
    const sortedVerses = [...selected].sort((a, b) => a.number - b.number);
  
    let currentRangeStart = null;
    let currentRangeEnd = null;
    let addressParts = [];
    sortedVerses.forEach((verse, index) => {
      if (currentRangeStart === null) {
        currentRangeStart = verse.number;
      }
  
      // 다음 구절이 연속되지 않거나 마지막 구절인 경우
      if (index === sortedVerses.length - 1 || sortedVerses[index + 1].number !== verse.number + 1) {
        currentRangeEnd = verse.number;
        // 연속 구간이면 범위로 표시, 아니면 단일 번호로 표시
        if (currentRangeStart === currentRangeEnd) {
          addressParts.push(currentRangeStart);
        } else {
          addressParts.push(`${currentRangeStart}-${currentRangeEnd}`);
        }
        currentRangeStart = null;
      }
    });
  
    // 장절 주소 문자열 생성
    const chapter = selected[0].chapter;
    const bookAbbreviation = booksData[selected[0].books_id - 1].abbreviation;
    const addressStr = `(${bookAbbreviation}${chapter}:${addressParts.join(',')})`;
  
    // 복사할 텍스트 생성
    const textToCopy = selected.map(verse => `${verse.number} ${verse.text}`).join('\n') + '\n' + addressStr;
    navigator.clipboard.writeText(textToCopy);

    setCopyMessage('클립보드에 복사되었습니다.');

    // 3초 후 메시지 숨기기
    setTimeout(() => {
      setCopyMessage('');
    }, 3000);

  };


  
  // 성경 책 데이터 매핑
  const booksMap = booksData.reduce((map, book) => {
    map[book.abbreviation] = book;
    return map;
  }, {});

  console.log(selected[0]);

  // 구절 데이터 매핑
  const versesMap = versesData.reduce((map, verse) => {
    const key = `${verse.books_id}-${verse.chapter}`;
    if (!map[key]) {
      map[key] = [];
    }
    map[key].push(verse);
    return map;
  }, {});

  const parseVerseRange = (rangeStr) => {
    const ranges = rangeStr.split(',').map(range => {
      const [start, end] = range.split('-').map(Number);
      return { start: start || 1, end: end || start };
    });
    return ranges;
  };

  const validateAndFetchVerses = (input) => {
    const cleanedInput = input.replace(/\s+/g, '');
    const regex = /^([가-힣]{1,2})([0-9]{1,3})(:[0-9]+(-[0-9]+)?(,[0-9]+(-[0-9]+)?)*)?$/;
    const matches = cleanedInput.match(regex);
  
    if (!matches) return false;
  
    const bookAbbreviation = matches[1];
    const chapter = parseInt(matches[2]);
    const verseRangeStr = matches[3];
  
    if (!booksMap[bookAbbreviation] || chapter > booksMap[bookAbbreviation].max_chapter) return false;
  
    const key = `${booksMap[bookAbbreviation].id}-${chapter}`;
    if (!versesMap[key]) return false;
  
    let verseRanges = [];
    if (verseRangeStr) {
      verseRanges = parseVerseRange(verseRangeStr.substring(1));
    } else {
      // 범위가 지정되지 않은 경우, 전체 장을 반환합니다.
      return versesMap[key];
    }
  
    return versesMap[key].filter(verse => {
      return verseRanges.some(range => verse.number >= range.start && verse.number <= range.end);
    });
  };

  return (
    <div className="App mx-auto w-full md:w-1/2 md:min-w-[768px]">
      <div className='text-center p-4 text-[3rem] font-black'>3927 project</div>
      <div className="container mx-auto p-4">
        <InputField onInputChange={handleInputChange} />
        {errorMessage && <div className='mx-auto'><p className="text-gray-400">{errorMessage}</p></div>}
        <OutputDiv 
        verses={verses} 
        selectedVerses={selected} 
        onVerseClick={toggleVerseSelection} />
      </div>
      <div className='md:fixed md:bottom-0 md:left-1/2 md:transform md:-translate-x-1/2 p-3'>
      {
        selected.length > 0 && (
          <button 
            onClick={copySelectedVerses} 
            className="
            fixed bottom-4 right-4 p-4 
            md:relative md:right-0 md:bottom-0 md:px-8
            bg-blue-500 text-white rounded-full shadow-lg opacity-50 hover:opacity-100
            "
          >
            {copyMessage ? copyMessage : '복사'}
          </button>
        )
      }
      </div>
      <div className='text-[0.8rem] p-2 mb-2 text-center opacity-60'>
        활용방법 / 3927 프로젝트를 후원해주세요
      </div>
    </div>
  );
}

export default App;
