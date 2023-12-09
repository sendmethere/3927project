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

// 복사 함수
export const copySelectedVerses = (selected, chaptersMap, booksData, setCopyMessage) => {
    const sortedVerses = [...selected].sort((a, b) => a.number - b.number);
  
    let currentRangeStart = null;
    let currentRangeEnd = null;
    let addressParts = [];
    sortedVerses.forEach((verse, index) => {
      if (currentRangeStart === null) {
        currentRangeStart = verse.number;
      }
  
      if (index === sortedVerses.length - 1 || sortedVerses[index + 1].number !== verse.number + 1) {
        currentRangeEnd = verse.number;
        if (currentRangeStart === currentRangeEnd) {
          addressParts.push(currentRangeStart);
        } else {
          addressParts.push(`${currentRangeStart}-${currentRangeEnd}`);
        }
        currentRangeStart = null;
      }
    });
  
    const chapter = chaptersMap[selected[0].chapter_id].number;
    const bookAbbreviation = booksData.find(book => book.id === chaptersMap[selected[0].chapter_id].book_id).abbreviation;
    const addressStr = `(${bookAbbreviation}${chapter}:${addressParts.join(',')})`;
  
    const textToCopy = selected.map(verse => `${verse.number} ${verse.text}`).join('\n') + '\n' + addressStr;
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