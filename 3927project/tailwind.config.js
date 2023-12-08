module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}", // adjust this line to include any file extensions you use
    ],
    theme: {
      extend: {
        fontSize: {
          superscript: ['75%', { verticalAlign: 'super' }], // 윗첨자용 커스텀 폰트 사이즈
        },
      }
    }
  };