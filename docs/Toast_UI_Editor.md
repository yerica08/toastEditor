# :rocket: TOAST UI Editor

TOAST UI Editor 관련 내용 중 실 사용된 부분을 정리한 내용입니다.

## 목차

1. [소개](##1.소개)
2. [설치](##2.설치)
3. [Plugins](##3.Plugins)
4. [참고](##참고)

## 1. 소개

- [TOAST UI](https://ui.toast.com/)
- [TOAST UI Editor](https://ui.toast.com/tui-editor)
- [TOAST UI Editor GitHUb](https://github.com/nhn/tui.editor)

TOAST UI Editor는 NHN에서 만든 오픈소스(MIT 라이선스) 마크다운 기반 에디터입니다.
한국어 지원이 잘 되어 있고, 웹 기반 문서 편집기에서 자주 쓰입니다.
마크다운 편집을 지원하면서도 WYSIWYG(What You See Is What You Get) 모드를 제공하는 것이 특징입니다.

## 2. 설치

TOAST UI Editor는 패키지 매니저를 이용하여 설치하거나, 직접 소스 코드를 다운받거나, cdn을 사용하여 이용가능합니다.
토스트에서는 패키지 매니저 사용을 권장하였지만, 저는 cdn 코드를 복사하여 폴더로 저장해 사용하였습니다.

+) *3.2.0 버전부터 table 안의 셀을 드레그 시 오류가 발생하여, **3.1.5** 버전을 사용했습니다.*

<details>
<summary>1. 패키지 매니저 사용시(npm)</summary>

***
각 패키지 매니저가 제공하는 CLI 도구를 사용하면 쉽게 패키지를 설치할 수 있다. npm 사용을 위해선 Node.js를 미리 설치해야 합니다.

```sh
$ npm install --save @toast-ui/editor # 최신 버전
$ npm install --save @toast-ui/editor@<version> # 특정 버전
```

설치하여 생성된 @toast-ui/editor/dist 폴더 안의 js와 css 파일을 import 하여 사용합니다.

***

#### Node.js 환경에서의 모듈 사용

- ES6 모듈

```js
import Editor from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css'; // Editor 스타일
```

- CommonJS

```js
const Editor = require('@toast-ui/editor');
require('@toast-ui/editor/dist/toastui-editor.css');
```

***
</details>

<details>
<summary>2. Contents Delivery Network (CDN) 사용하기</summary>

***
TOAST UI Editor는 CDN을 통해 사용할 수 있습니다.
특정 버전을 사용하려면 url 경로에서 latest 대신 버전 태그를 사용해야 합니다.

```html
<!-- 최신 버전 사용 시 -->
<script src="https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js"></script> 
<link rel="stylesheet" href="https://uicdn.toast.com/editor/latest/toastui-editor.min.css" />

<!-- 특정 버전 사용 시 -->
<script src="https://uicdn.toast.com/editor/3.1.5/toastui-editor-all.min.js"></script>
<link rel="stylesheet" href="https://uicdn.toast.com/editor/3.1.5/toastui-editor.min.css" />
```

***
</details>

### 현재 프로젝트 editor 파일

현재 프로젝트에서는 **3.1.5 버전**의 Toast UI Editor의 cdn 코드를 복사하여 저장하였습니다.
해당 파일은 `/src/toast/src/toastui-editor-all.min.js` 위치합니다.

### 인스턴스 생성하기

cdn으로 불러온 뒤, 옵션과 함께 인스턴트를 생성하면 다양한 API를 호출할 수 있습니다.

```html
<body>
    <div id="editor"></div>
    <script src="https://uicdn.toast.com/editor/3.1.5/toastui-editor-all.min.js"></script>
    <script>
        const { Editor } = toastui;

        const editor = new Editor({
            el: document.querySelector("#editor"),
            height: '500px'
            initialEditType: 'wysiwyg',
            // 기타 옵션들 설정
        });
    </script>
</body>
```

현재 프로젝트에서 사용된 옵션은 다음과 같습니다.

```js
const editor = new Editor({
    el: document.querySelector('#editor'),
    height: '500px',
    initialEditType: 'wysiwyg',
    previewStyle: 'vertical',
    language: 'ko-KR',
    initialValue: '',
    plugins: [tableMergedCell, codeSyntaxHighlight, colorSyntax],
    customHTMLSanitizer: (html) => {
       return DOMPurify.sanitize(html);
    },
    hooks: {
       async addImageBlobHook(blob, callback) {
          // 옵션
       },
    },
 });
```

- `'el'`: 에디터를 적용할 요소.
- `height`: 에디터 영역의 높이 값. `'300px'`, `'auto'` 와 같은 문자열
- `initialEditType`: 초기 모드 설정. `'markdown'` 또는 `'wysiwyg'` 
- `previewStyle`: 프리뷰 위치. `'vertical'` 또는 `'tab'`
- `language`: [언어](##3.language) 설정. `'ko-KR'`(한국어)
- `initialValue`: 콘텐츠 초기 값.
- `plugins`: [플러그인](##4.Plugins) 배열.
- `customHTMLSanitizer`: [사용자 정의 HTML 보안 필터링]((##5.customHTMLSanitizer)). `function`
- `hooks`: 객체. 현재 [addimageBlobHook](##6.addimageBlobHook)라는 이미지 업로드 후크만 존재.

+) 더 많은 옵션은 [여기](https://nhn.github.io/tui.editor/latest/ToastUIEditor)서 확인 가능합니다.

## 4. Plugins

토스트 에디터는 플러그인을 적용하여 커스텀마이징이 가능합니다. 
기본적으로 5가지의 플러그인을 제공하며, 사용자가 직접 플러그인 함수를 정의하여 사용할 수도 있습니다.
현재 프로젝트에서는 토스트에디터에서 제공하는 플러그인 3개를 사용하였습니다.

| 플러그인 명 | 파일 경로 | 설명 |
|:----|:----|:----|
| [table-merged-cell](###TableMergedCell) | /src/toast/src/plugin-tableMergedCell.min.js | 병합 테이블 셀을 사용하기 위한 플러그인 |
| color-syntax | /src/toast/src/plugin-colorSyntax.min.js | 컬러피커 사용을 위한 플러그인 |
| code-syntax-highlight | /src/toast/src/plugin-codeSyntaxHighlightAll.min.js | 코드 하이라이팅을 위한 플러그인 |

### 플러그인 설치 및 사용

플러그인은 npm을 통해 설치하거나 cdn 형태로 사용할 수 있습니다.
editor를 설치할 때 포함되어 있지 않기 때문에 따로 설치하여야 하며, 반드시 editor가 먼저 선언된 뒤에 가져와야합니다.

<details>
<summary>1. 패키지 매니저(npm)를 통한 설치</summary>

설치할 플러그인의 이름을 아래 `${pluginName}`에 작성하여 설치합니다.
예를들어 `table-merged-cell` 플러그인을 설치할 경우 `npm install @toast-ui/editor-plugin-table-merged-cell`과 같이 입력해야합니다.

```sh
$ npm install --save @toast-ui/editor-plugin-${pluginName} 
$ npm install --save @toast-ui/editor-plugin-${pluginName}@<version>
```

설치한 플러그인은 모듈 포맷에 따라 아래처럼 가져올 수 있습니다.

- ES 모듈

```js
import pluginFn from '@toast-ui/editor-plugin-${pluginName}';
```

- CommonJS

```js
const pluginFn = require('@toast-ui/editor-plugin-${pluginName}');
```
```js
```

</details>
<details>
<summary>2. Contents Delivery Network (CDN) 사용하기</summary>
</details>
상단 TOAST UI Editor를 설치할 때 함께 설치되지는 않고, 다음


### Table Merged Cell
