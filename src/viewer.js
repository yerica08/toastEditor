// const params = new URLSearchParams(window.location.search);
// const content = decodeURIComponent(params.get('content') || '');

// const { Viewer } = toastui;
// const { tableMergedCell, codeSyntaxHighlight, colorSyntax } = Viewer.plugin;

// new Viewer({
//    el: document.querySelector('#viewer'),
//    height: '100%',
//    initialValue: content,
//    plugins: [tableMergedCell, codeSyntaxHighlight, colorSyntax],
// });

// plugin을 쓸거면 viewer보단 editor를 쓰는게 더 나음
window.addEventListener('message', (event) => {
   const { type, content } = event.data || {};

   if (type === 'render' && typeof content === 'string') {
      const decodedContent = decodeURIComponent(content); // 🔥 디코딩 추가
      const { Editor } = toastui;
      const { tableMergedCell, codeSyntaxHighlight, colorSyntax } = Editor.plugin;

      new Editor.factory({
         el: document.querySelector('#viewer'),
         height: '100%',
         initialValue: decodedContent,
         viewer: true,
         plugins: [tableMergedCell, codeSyntaxHighlight, colorSyntax],
      });

      // ✅ 링크 클릭 시 새 탭으로 열도록 처리
      setTimeout(() => {
         document.querySelector('#viewer')?.addEventListener('click', (e) => {
            const target = e.target;
            if (target.tagName === 'A') {
               e.preventDefault(); // 기본 이동 막고
               const url = target.getAttribute('href');
               if (url) window.open(url, '_blank', 'noreferrer'); // 새 탭으로 열기
            }
         });
      }, 0);
   }
});
