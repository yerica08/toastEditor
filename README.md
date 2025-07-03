# TOAST UI Editor 보안 + Viewer 통합 예제

이 프로젝트는 **TOAST UI Editor + Image Editor + Viewer**를 조합하여, 보안성과 사용자 편의성을 고려하여 구현된 마크다운 에디터 예제입니다.

---

## 📦 프로젝트 구성 개요

- `index.html` : 메인 WYSIWYG 에디터 페이지
- `viewer.html` : 렌더링 전용 뷰어 페이지 (보안 격리용 iframe)
- `viewer.js` : viewer 동작을 위한 JS (외부 분리 → CSP 우회용)
- `src/` : 라이브러리 및 에셋 파일들

---

## 🧪 테스트 방법

1. `index.html`을 브라우저에서 열기
2. 콘텐츠 입력 후 **저장** 버튼 클릭
3. 하단의 iframe(`viewer.html`)에서 `pages/viewer.html`이 렌더링 됨

---

## 🔐 보안 설계 핵심

### 1. DOMPurify

기본적으로, Toast는 sanitize-html 같은 기능을 내장하여, `<script>, onerror, onload, javascript: 링크` 등을 자동으로 제거합니다.
하지만 모든 보안을 막는 것은 아니기 때문에 **DOMPurify HTML 보안 필터링 라이브러리**를 사용하여 다시 한 번 필터링을 진행하였습니다.

- HTML 삽입 시, 악성 `<script>`, `onerror`, `style="expression(...)"` 등을 제거
- `sanitize()`와 `addHook()`을 함께 사용하여 완전한 필터링 수행
- `<a>` 태그에는 `rel="noreferrer"` 자동 삽입(3번에서 자세히 설명)

```js
// addHook은 전역에서 한 번만 등록하면 이후 어디서든 DOMPurify.sanitize()를 써도 위 Hook이 자동 적용됨
DOMPurify.addHook('uponSanitizeAttribute', (node, data) => {
  if (data.attrName === 'style' && /expression\s*\(/i.test(data.attrValue)) {
    data.keepAttr = false;
  }
  if (data.attrName === 'src' && /^data:(text\/html|image\/svg)/i.test(data.attrValue)) {
    data.keepAttr = false;
  }
  if (node.tagName === 'A') {
    node.setAttribute('rel', 'noreferrer');
  }
});

// getMarkdown으로 toast 에디터의 컨텐츠를 가져옴 
const dirty = editor.getMarkdown();

// sanitize를 사용하여 악성 HTML, <script>, onerror, javascript: 등 대부분 필터링
const sanitized = DOMPurify.sanitize(dirty);
```

---

### 2. CSP (Content-Security-Policy)

CSP는 브라우저에게 스크립트, 스타일, 이미지 등을 어디서 어떻게 불러올 수 있는지를 지시하는 보안 헤더로,.
DOMPurify 같은 HTML 필터링을 우회해서 공격자가 `<script>`를 삽입해도, **브라우저가 실행을 막아버릴 수 있는 “브라우저 차원의 방어선”** 입니다.

| 디렉티브 | 의미 |
|------|------|
| default-src 'self' | 기본 소스는 현재 도메인만 허용 |
| script-src 'self' | 외부 JS 불허 (cdn, XSS 차단 효과 있음) |
| style-src 'self' 'unsafe-inline' | 외부 스타일 불허, 인라인은 예외적으로 허용 |
| img-src 'self' data: | object, embed 금지 |
| object-src 'none' | object, embed 금지 |
| base-uri 'none' | <base> 태그 금지 |
| frame-ancestors 'none' | 이 페이지를 다른 iframe에서 못 불러옴 |

#### ✅ `viewer.html` 내부 `<meta>` 태그

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data:;
  object-src 'none';
  frame-ancestors 'none';
">
```

- 외부 JS 불허 (`'self' 'unsafe-inline'` 가능)
- 차후 `'unsafe-inline'` 를 삭제하고 인라인 스크립트가 삽입되지 않으면 보안에 더 좋음
   (현재 vscode liveserver를 쓰고 있어, 자동으로 인라인 스크립트가 추가되기 때문에 불가피 넣음)
- iframe 접근 차단 (`frame-ancestors 'none'`)

---

### 3. `<a>` 태그의 `rel="noopener noreferrer"` 속성

`rel="noopener noreferrer"`은 HTML의 `<a>` 태그에서 외부 링크를 새 창으로 열 때 사용하는 보안속성으로,
악성 링크가 `window.opener.location = "phishig.co"` 같은 식으로 피싱 공격하는 것을 방지해줍니다. 

| 속성 | 설명 |
|-----|-----|
| noopener | window.opener를 null로 만들어서 탭 납치(tabnabbing) 공격을 막음 |
| noreferrer | 부모 페이지 주소(Referrer)를 제거해서 내 웹사이트 주소를 외부에 노출하지 않는다.
동시에  noreferrer가 noopener의 기능도 포함하고 있음(window.opener도 막음)  |


`noreferrer`는 이번 페이지주소가 전송되지 않기 때문에 프라이버시나 민감한 url을 새 창에 노출시키지 않을 수 있다..
그렇기 때문에, 외부 사이트에 개인정보/비공개 주소를 노출시키면 안되거나, 외부 파트너에게 트래픽 경로를 숨시고 싶을 때, 강력한 보안이 필요한 경우 사용된다.
`noopener`는 이보다 보다 유연하게 사용하고 싶을 경우 사용된다.

#### ✅ noopener

| 실무 상황 | 이유 |
|-----|-----|
| 🔐 외부 사이트로 나가는 새 창 링크 (<a href="...">) | 탭 납치 방지. 외부에서 내 탭 조작 못하게 함. |
| 📊 유입 경로 분석(GA 등) 필요 | opener는 제거하되, Referer는 유지해야 분석 가능. 사내 시스템 또는 민감한 경로에서 외부로 이동할 때	noreferrer	내 시스템 주소 노출 막기 (ex: 인증 토큰 포함 URL). |
| 🧩 iframe 안에서 Viewer 등 콘텐츠 출력 | noreferrer는 링크 작동안할 수 있기 때문에 상황을 보고 사용여부 결정 |


#### ✅ noreferrer

| 실무 상황 | 이유 |
|-----|-----|
| 🔐 외부 사이트로 가되 내 URL을 숨기고 싶음 | Referer 제거 + opener 제거. 개인정보 보호. |
| 📚 위젯, 임베드 코드, 커뮤니티 게시물 등 유저 콘텐츠에 포함된 링크 | 보안 최우선. 유저 콘텐츠는 항상 위험 가능성 있음. |

- 내부 링크와 같은 같은 도메인의 경우 사용 불필요
---
### 4. <iframe> sandbox

#### ✅ `index.html` 내부 `<iframe>`에 **sandbox** 속성을 추가 후, `viewer.html` 호출

```html
<div id="#viewer">
   <iframe id="viewerFrame" sandbox="allow-scripts allow-popups allow-same-origilow-top-navgation-by-user-acrivation" src="../pages/viewer.html"></iframe>
</div>
```

#### 💡 `viewer.html`를 별도로 분리한 이유

- **보안적인 이유**: 에디터로 작성된 콘텐츠는 신뢰할 수 없는 HTML일 수 있습니다.
- **sandbox** 가 `iframe`을 감옥처럼 만들어, 만약 XSS가 실행되더라도 iframe 내부로 격리시킬 수 있습니다.
- 

| sandbox 옵션 | 설명 |
|------|------|
| allow-scripts | JS 실행 허용 (Viewer 작동에 필수) |
| allow-same-origin | iframe 내부 JS에서 document.cookie, localStorage 등 동일 출처 접근 허용 |
| allow-forms | <form> 제출 허용 |
| allow-popups | window.open() 가능 |
| allow-modals | alert(), confirm(), prompt() 사용 가능 |
| allow-presentation | 프레젠테이션 API 허용 (잘 안 씀) |
| allow-downloads | download 허용 |
| allow-top-navigation | iframe 안에서 window.top.location 변경 가능 (위험!) |
| allow-top-navigation-by-user-activation | 유저 클릭 시만 상위 페이지 이동 가능 |

- 💡 즉, 악성 스크립트가 viewer 안에서 실행된다 해도, viewer 바깥에는 절대 못 벗어납니다.
- 현재, VS Code Live Server를 사용하여 테스트하고 있기 때문에 `allow-same-origin`이 있으나, 삭제하면 보안에 더 유리합니다.

---

### 왜 viewer.js를 인라인으로 작성하지 않았는가?

- **CSP 정책 위반 방지**: `script-src 'self'` 설정이 되어 있을 때 `<script>...</script>` 같은 인라인 JS는 차단됩니다.
- 따라서 외부 JS 파일로 분리해야 CSP에 위배되지 않으며, 실무에서도 자주 사용되는 방식입니다.

---

## 📄 viewer.js 작동 방식

```js
window.addEventListener('message', (event) => {
   const { type, content } = event.data || {};

   if (type === 'render' && typeof content === 'string') {
      const decodedContent = decodeURIComponent(content);
      const { Editor } = toastui;
      const { tableMergedCell, codeSyntaxHighlight, colorSyntax } = Editor.plugin;

      new Editor.factory({
         el: document.querySelector('#viewer'),
         height: '100%',
         initialValue: decodedContent,
         viewer: true,
         plugins: [tableMergedCell, codeSyntaxHighlight, colorSyntax],
      });

      // 링크는 새 탭에서 열리도록 설정
      setTimeout(() => {
         document.querySelector('#viewer')?.addEventListener('click', (e) => {
            const target = e.target;
            if (target.tagName === 'A') {
               e.preventDefault();
               const url = target.getAttribute('href');
               if (url) window.open(url, '_blank', 'noreferrer');
            }
         });
      }, 0);
   }
});
```

- `postMessage()`로 에디터에서 보낸 내용을 받음
- 에디터가 아닌 **Viewer 모드로만 실행** → 보안성과 렌더링 최적화
- 링크 클릭 시 **새 탭**에서 열리도록 처리 (악성 링크 조작 방지)

---

## ✅ 주요 기능 요약

| 기능 | 설명 |
|------|------|
| WYSIWYG 에디터 | Toast UI Editor로 마크다운 및 리치 텍스트 작성 |
| 이미지 편집기 | TUI Image Editor를 통한 이미지 자르기, 회전 등 |
| 보안 필터링 | DOMPurify + CSP + iframe sandbox로 다층 방어 |
| 뷰어 분리 | iframe 기반 viewer.html 파일을 통한 안전한 렌더링 |
| plugin 활용 | table 병합, 문법 강조, 색상 등 다양한 확장 플러그인 |

---

## 📚 참고

- 더 자세한 내용은 docs 파일 참고
- [TOAST UI Editor Docs](https://ui.toast.com/tui-editor)
- [DOMPurify Docs](https://github.com/cure53/DOMPurify)
- [MDN CSP 가이드](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
