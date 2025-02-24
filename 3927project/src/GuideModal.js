function GuideModal({ onClose, theme }) {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`bg-white theme-${theme}-bg theme-${theme}-text p-6 rounded-lg max-w-lg w-full mx-4`}>
        <h2 className="text-xl font-bold mb-4">📖 사용 가이드</h2>
        <div className="space-y-3">
          <h3 className="font-bold">🔍 검색 방법</h3>
          <p>• 책이름 장 절: "창1:1" 또는 "창세기1:1"</p>
          <p>• 여러 절 검색: "창1:1-3" 또는 "창1:1,3,5"</p>
          
          <h3 className="font-bold mt-4">⌨️ 단축키</h3>
          <p>• Tab: 검색창으로 포커스 이동</p>
          <p>• Ctrl+C / Cmd+C: 선택된 구절 복사</p>
          <p>• ← →: 이전/다음 장으로 이동</p>
          <p>• R: 선택된 구절 초기화</p>
          <p>• F: 선택된 구절 전체화면으로 보기</p>
          
        </div>
        <button 
          className={`mt-6 px-4 py-2 theme-${theme}-buttonBg theme-${theme}-buttonText rounded`}
          onClick={onClose}
        >
          닫기
        </button>
      </div>
    </div>
  );
}

export default GuideModal; 