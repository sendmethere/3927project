// utils.js
// 이 파일은 App 컴포넌트에서 사용되는 다양한 유틸리티 함수들을 포함합니다.

// 구절 범위 파싱 함수
export const parseVerseRange = (rangeStr) => {
    const ranges = rangeStr.split(',').map(range => {
      const [start, end] = range.split('-').map(Number);
      return { start: start || 1, end: end || start };
    });
    return ranges;
  };
  
// 권/장/절 검증 및 검색 함수
export const validateAndFetchVerses = (input, booksMap, chaptersMap, versesMap) => {
const cleanedInput = input.replace(/\s+/g, '');
const regex = /^([가-힣]{1,2})([0-9]{1,3})(:[0-9]+(-[0-9]+)?(,[0-9]+(-[0-9]+)?)*)?$/;
const matches = cleanedInput.match(regex);

if (!matches) {
    return { isValid: false, chapterId: null, chapterSummary: '', verses: [] };
}

const bookAbbreviation = matches[1];
const chapterNumber = parseInt(matches[2]);
const bookData = Object.values(booksMap).find(book => book.abbreviation === bookAbbreviation);
if (!bookData) return { isValid: false, chapterId: null, chapterSummary: '', verses: [] };

const chapterData = chaptersMap[Object.values(chaptersMap).find(chapter => chapter.book_id === bookData.id && chapter.number === chapterNumber)?.id];
if (!chapterData) return { isValid: false, chapterId: null, chapterSummary: '', verses: [] };

const chapterId = chapterData.id;
const chapterName = `${bookData.name} ${chapterNumber}장`;

let verses = [];
if (versesMap[chapterId]) {
    const verseRangeStr = matches[3];
    let verseRanges = [];
    if (verseRangeStr) {
    verseRanges = parseVerseRange(verseRangeStr.substring(1));
    verses = versesMap[chapterId].filter(verse => {
        return verseRanges.some(range => verse.number >= range.start && verse.number <= range.end);
    });
    } else {
    verses = versesMap[chapterId];
    }
}

return {
    isValid: true,
    chapterId: chapterId,
    chapterName: chapterName,
    chapterSummary: chapterData.summary,
    verses: verses
};
};

// 구절 표시 생성 함수
export const generateCitation = (selected, chaptersMap, booksData, copyFormat = 'short', copyOptions = { bracket: false }) => {
  const currentChapter = chaptersMap[selected[0].chapter_id];
  const bookData = booksData.find(book => book.id === currentChapter?.book_id);

  const sortedVerses = [...selected].sort((a, b) => a.number - b.number);
  let currentRangeStart = null;
  let currentRangeEnd = null;
  let addressParts = [];
  
  // chapter 번호를 1 감소시켜 실제 장 번호와 맞춤
  const chapter = currentChapter.number;
  const bookName = bookData.name;
  const bookAbbreviation = bookData.abbreviation;

  // 정렬된 구절들을 순회하면서 연속된 구절 범위를 찾아 표시 형식 생성
  sortedVerses.forEach((verse, index) => {
    // 새로운 범위의 시작점이 없으면 현재 구절 번호를 시작점으로 설정
    if (currentRangeStart === null) {
      currentRangeStart = verse.number;
    }

    // 마지막 구절이거나 다음 구절이 연속되지 않는 경우
    if (index === sortedVerses.length - 1 || sortedVerses[index + 1].number !== verse.number + 1) {
      currentRangeEnd = verse.number;
      // 시작과 끝이 같으면 단일 구절로 표시
      if (currentRangeStart === currentRangeEnd) {
        addressParts.push(currentRangeStart);
      } else {
        // 시작과 끝이 다르면 범위로 표시 (예: 1-3)
        addressParts.push(`${currentRangeStart}-${currentRangeEnd}`);
      }
      // 다음 범위를 위해 시작점 초기화
      currentRangeStart = null;
    }
  });

  let citation;
  switch (copyFormat) {
    case 'short':
      citation = `${bookAbbreviation}${chapter}:${addressParts.join(',')}`;
      break;
    case 'medium':
      citation = `${bookName} ${chapter}:${addressParts.join(',')}`;
      break;
    case 'long':
      citation = `${bookName} ${chapter}장 ${addressParts.join(',')}절`;
      break;
    default:
      citation = '';
  }
  
  if (copyOptions.bracket) {
    citation = `(${citation})`;
  }

  return citation;
};

// 복사 함수 수정
export const copySelectedVerses = (selected, chaptersMap, booksData, setCopyMessage, copyFormat, copyOptions) => {
  const citation = generateCitation(selected, chaptersMap, booksData, copyFormat, copyOptions);
  
  const textToCopy = selected.map(verse => 
    `${copyOptions.verseNumber ? verse.number + ' ' : ''}${verse.text}`
  ).join(copyOptions.lineBreak ? '\n' : ' ') + '\n' + citation;

  navigator.clipboard.writeText(textToCopy);

  if (setCopyMessage) {
    setCopyMessage('클립보드에 복사되었습니다.');
    setTimeout(() => setCopyMessage(''), 3000);
  }
};

//다음 장 이동
export const moveToNextChapter = (currentChapterId, chaptersMap, booksMap, handleChapterChange) => {
    const currentChapter = chaptersMap[currentChapterId];
    if (!currentChapter) return;
  
    let nextChapter;
    if (currentChapter.number < booksMap[currentChapter.book_id].max_chapter) {
      nextChapter = Object.values(chaptersMap).find(chapter => chapter.book_id === currentChapter.book_id && chapter.number === currentChapter.number + 1);
    } else {
      const nextBook = booksMap[currentChapter.book_id + 1];
      if (nextBook) {
        nextChapter = Object.values(chaptersMap).find(chapter => chapter.book_id === nextBook.id && chapter.number === 1);
      }
    }
  
    if (nextChapter) {
      handleChapterChange(nextChapter.id);
      window.scrollTo(0, 0);
    }
  };
  
  //이전 장 이동
  export const moveToPreviousChapter = (currentChapterId, chaptersMap, booksMap, handleChapterChange) => {
    const currentChapter = chaptersMap[currentChapterId];
    if (!currentChapter) return;
  
    let prevChapter;
    if (currentChapter.number > 1) {
      prevChapter = Object.values(chaptersMap).find(chapter => chapter.book_id === currentChapter.book_id && chapter.number === currentChapter.number - 1);
    } else {
      const prevBook = booksMap[currentChapter.book_id - 1];
      if (prevBook) {
        prevChapter = Object.values(chaptersMap).find(chapter => chapter.book_id === prevBook.id && chapter.number === prevBook.max_chapter);
      }
    }
  
    if (prevChapter) {
      handleChapterChange(prevChapter.id);
      window.scrollTo(0, 0);
    }
  };