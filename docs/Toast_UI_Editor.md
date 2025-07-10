# :rocket: TOAST UI Editor

TOAST UI Editor 관련 내용 중 실 사용된 부분을 정리한 내용입니다.

## [ 목차 ]

1. [소개](#white_check_mark-1-소개)
2. [설치](#2-설치)
3. [언어 설정](#3-언어-설정)
4. [플러그인](#4-플러그인plugin)
5. [툴바](#5-툴바-설정toolbar)
6. [메서드](#6-메소드methods)
7. [보안 필터링](#7-보안-필터링sanitizer)
8. [이미지 업로드](#8-이미지-업로드)

<br><br><br>

## :white_check_mark: 1. 소개

- [TOAST UI](https://ui.toast.com/)
- [TOAST UI Editor](https://ui.toast.com/tui-editor)
- [TOAST UI Editor GitHUb](https://github.com/nhn/tui.editor)

TOAST UI Editor는 NHN에서 만든 **오픈소스(MIT 라이선스)** 마크다운 기반 에디터입니다.  

한국어 지원이 잘 되어 있고, 웹 기반 문서 편집기에서 자주 쓰입니다.  

**Markdown** 편집을 지원하면서도 **WYSIWYG**(*What You See Is What You Get*) 모드를 제공하는 것이 특징입니다.  

### 1) 마크다운(Markdown) 언어란?

Markdown 언어는 간단한 문법으로 글의 구조나 서식을 표현할 수 있는 텍스트 기반 마크업 언어입니다.  

텍스트로 문서를 작성하는데, 간한단 기호(`*`, `#`, `>` 등)를 함께 사용하면 해당 글자가 Bold, 리스트, 링크 등으로 변환되는 것을 말합니다.  

마크다운은 현재 작성된 GitHub의 md 파일이나, 위키, 기술문서 등에서 사용되고 있습니다.

- GitHub의 마크다운 문법 예시

| 목적 | 문법 예시 | 결과 |
|:----|:----|:----|
| 가장큰 제목 | #제목1 | <h1>제목1</h1>
| 두번째로 큰 제목 | `##`제목2 | <h2>제목2</h2>
| 목록 | `-`, `*`, `+` 뒤에 글자 작성 | • 글자 |
| 순서 목록 | `1.` `2.` `3.` 과 함께 글자 작성 | 1. 글자<br>2. 글자<br>3. 글자
| 두껍게 | `**`굵게`**` | **굵게** |
| 기울임 | `*`기울임`*` | *기울임* |
| 취소선 | `~~`취소선`~~` | ~~취소선~~ |
| 링크 | `[`텍스트`](`링크주소`)` | [텍스트](링크주소) |
| 코드 | ` `` ` 사이에 글자 작성 | `글자` |
| 접기 | `<details><summary>`제목`</summary>`내용`</details>` | <details><summary>제목</summary></details> |
| 수평선 | `***`, `---`, `___` | ――― |
| 줄바꿈 | 문장 끝에 두칸이상 띄어쓰기 + Enter 두번(=문장과 문장사이에 빈 줄 한개) 혹은 `<br>`코드 사용 | 줄<br>바꿈

마크다운에선 간단한 HTML 문법(`<br>` ...등)이나 엔터티 코드(`&nbsp;` 등)도 사용 가능하다는 점에서 개발자에게 조금 더 친화적입니다.

### 2) 위지윅(WYSIWYG) 이란?

**WYSIWYG = What You See Is What You Get**  

직역하면 **"보는대로 얻는다"**, 즉 사용자가 화면에서 보이는 편집 내용이 그대로 저장되거나 출력된다는 뜻입니다. 

예를 들어, 글을 굵게 만들고 싶을 때, 마크다운에서는 `**굵게**` 처럼 코드를 써야 하지만 **WISYWYG 편집기**에서는 Bold 버튼을 클릭하여 텍스트가 굵게 보이게 만듭니다.

위지윅은 대부분의 웹 편집기에서 일반적으로 쓰이는 개념으로, Toast UI Editor 에서는 **Markdown 모드와 WISYWYG 모드를 둘 다 지원**합니다. 

### 3) 렌더러(Renderer)

Toast UI Editor는 두가지 언어를 함께 사용하기 때문에 Markdown 언어를 WYSIWYG 언어로, WYSIWYG 언어를 Markdown 언어로 변환시키는 렌더러가 필요합니다.

토스트는 기본적으로 이 렌더러가 내장되어 있지만 만약 사용자가 직접 렌더러를 수정하고 싶다면 [customHTMLRenderer](https://github.com/nhn/tui.editor/blob/master/docs/ko/custom-html-renderer.md) 혹은 `customMarkdownRenderer` 옵션을 사용하여 수정시킬 수 있습니다.  

렌더링이 진행 될 때, 토스트 에디터는 보안 필터링을 한번 거치도록 설계되어있습니다.  

[GitHub의 htmlSanitizer.ts](https://github.com/nhn/tui.editor/blob/master/apps/editor/src/sanitizer/htmlSanitizer.ts)파일을 확인하면 이 렌더러에 **DOMPurify 라이브러리**를 적용시켜 보안 필터링(XSS 공격 방지)이 되도록 돕고 있습니다.

만약 보안 필터링을 수정하고 싶다면, `customHTMLSanitizer` 옵션을 사용하여 수정할 수 있습니다.

더 자세한 내용은 [7. 보안 필터링](##7.보안필터링(sanitizer))을 참고 바랍니다.

<br><br><br>

## 2. 설치

### 1) 에디터 설치

TOAST UI Editor는 **패키지 매니저**를 이용하여 설치하거나, 직접 소스 코드를 다운받거나, **CDN**을 사용하여 사용가능합니다.  

토스트에서는 패키지 매니저 사용을 권장하였지만, 현재 프로젝트에서는 **CDN 코드를 복사** 후 폴더로 저장하여 연결했습니다.  

<br>
<details>
<summary>1. 패키지 매니저 사용시(npm)</summary>

***
각 패키지 매니저가 제공하는 CLI 도구를 사용하면 쉽게 패키지를 설치할 수 있습니다.  

npm 사용을 위해선 Node.js가 미리 설치되어 있어야 합니다.

```sh
$ npm install --save @toast-ui/editor # 최신 버전
$ npm install --save @toast-ui/editor@<version> # 특정 버전
```

설치하여 생성된 @toast-ui/editor/dist 폴더 안의 js와 css 파일을 import 하여 사용합니다.  

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
<br>

### ❗ 현재 최신 버전이 아닌 3.1.5 버전 사용 중 ❗ 

2025년 07월 기준, 토스트 에디터의 3.2.0 버전부터 *표 안의 셀을 드레그 시 오류가 발생*하고 있습니다.  

이에 현재 프로젝트에서는 **3.1.5 버전**의 Toast UI Editor를 사용하였습니다.  

해당 파일은 `/src/toast/src/toastui-editor-all.min.js` 위치합니다.
<br>
<br>
### 2) 인스턴스 생성

CDN으로 불러온 뒤, 옵션과 함께 **인스턴트를 생성**하면 다양한 **API**를 호출할 수 있습니다.

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

### 3) 옵션 설정

토스트 에디터는 인스턴트를 생성할 때 옵션을 함께 설정할 수 있습니다.  

몇가지 옵션들은 나중에 재설정이 불가능하여 에디터를 아예 삭제한 뒤 다시 불러와야 하는 것 밖에 방법이 없는 것들도 있으니, 잘 확인해보는 것이 좋을 것 같습니다.  

현재 프로젝트에서 적용된 옵션은 다음과 같습니다.  

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

&nbsp;+ ) 더 많은 옵션과 메서드는 [여기](https://nhn.github.io/tui.editor/latest/ToastUIEditor)서 확인 가능합니다.
<br><br><br>

## 3. 언어 설정

TOASE UI Editor는 총 22가지의 언어를 지원합니다.  

제공되는 언어 파일을 연결하면 자동으로 언어 코드가 등록되고, 옵션으로 사용할 언어를 설정할 수 있습니다.  

기본 설정 언어는 `영어`입니다. *때문에, `en-us.js` 파일은 가져올 필요가 없다.*

### 1) 언어 설치

공식 [GitHub](https://github.com/nhn/tui.editor)에 [apps/editor/src/i18n](https://github.com/nhn/tui.editor/tree/master/apps/editor/src/i18n)에 언어코드가 등록되어있으며, ES 모듈과 CDN에서 파일을 가져오는 방법은 아래와 같습니다.

- ES 모듈
```js
import '@toast-ui/editor/dist/i18n/${fileName}';
```

- CommonJS
```js
require('@toast-ui/editor/dist/i18n/${fileName}');
```

- CDN
```html
<script src="https://uicdn.toast.com/editor/latest/i18n/${fileName}"></script>
<!-- 한글을 불러오고 싶다면 -->
<script src="https://uicdn.toast.com/editor/latest/i18n/ko-kr.js"></script>
```

`${filteName}`에는 하단의 `i18n 파일`을 입력하면 됩니다.

| 언어명              | i18n 파일 =  ${filteName} | 등록 코드(둘 중 하나 입력) |
| -------------------------- | --------- | --------------- |
| Arabic                     | ar.js     | `ar`            |
| Chinese (S)                | zh-cn.js  | `zh-CN`         |
| Chinese (T)                | zh-tw.js  | `zh-TW`         |
| Croatian (Croatia)         | hr-hr.js  | `hr` \| `hr-HR` |
| Czech (Czech Republic)     | cs-cz.js  | `cs` \| `cs-CZ` |
| Dutch (Netherlands)        | nl-nl.js  | `nl` \| `nl-NL` |
| English (United States)    | en-us.js  | `en` \| `en-US` |
| Finnish (Finland)          | fi-fi.js  | `fi` \| `fi-FI` |
| French (France)            | fr-fr.js  | `fr` \| `fr-FR` |
| Galician (Spain)           | gl-es.js  | `gl` \| `gl-ES` |
| German (Germany)           | de-de.js  | `de` \| `de-DE` |
| Italian (Italy)            | it-it.js  | `it` \| `it-IT` |
| Japanese (Japan)           | ja-jp.js  | `ja` \| `ja-JP` |
| Korean (Korea)             | ko-kr.js  | `ko` \| `ko-KR` |
| Norwegian Bokmål (Norway)  | nb-no.js  | `nb` \| `nb-NO` |
| Polish (Poland)            | pl-pl.js  | `pl` \| `pl-PL` |
| Portuguese (Brazil)        | pt-br.js  | `pt` \| `pt-BR` |
| Russian (Russia)           | ru-ru.js  | `ru` \| `ru-RU` |
| Spanish (Castilian, Spain) | es-es.js  | `es` \| `es-ES` |
| Swedish (Sweden)           | sv-se.js  | `sv` \| `sv-SE` |
| Turkish (Turkey)           | tr-tr.js  | `tr` \| `tr-TR` |
| Ukrainian (Ukraine)        | uk-ua.js  | `uk` \| `uk-UA` |

### 2) 언어 설정

언어를 설치했다면 editor의 옵션을 설정할 때 사용할 언어를 옵션으로 입력하면 됩니다.  

사용하지 않을 경우, 기본값은 `en` \| `en-US` 이며, 이 외의 사용하고 싶은 언어는 상단 표의 `등록 코드`를 입력하시면 됩니다.

저는 CDN으로 불러왔기 때문에 한국어를 적용하기 위하여 다음과 같이 입력하였습니다.

```js
const { Editor } = null;

const editor = new Editor({
    // ...
    language: 'ko-KR'
});
```
<br><br><br>

## 4. 플러그인(Plugin)

토스트 에디터는 플러그인을 적용하여 커스텀마이징이 가능합니다.  

기본적으로 5가지의 플러그인을 제공하며, 사용자가 직접 플러그인 함수를 정의하여 사용할 수도 있습니다.  

현재 프로젝트에서는 토스트에디터에서 제공하는 플러그인 3개를 사용하였습니다.

| 플러그인 명 | 파일 경로 | 설명 |
|:----|:----|:----|
| [table-merged-cell](###TableMergedCell) | /src/toast/src/plugin-tableMergedCell.min.js | 병합 테이블 셀을 사용하기 위한 플러그인 |
| color-syntax | /src/toast/src/plugin-colorSyntax.min.js | 컬러피커 사용을 위한 플러그인 |
| code-syntax-highlight | /src/toast/src/plugin-codeSyntaxHighlightAll.min.js | 코드 하이라이팅을 위한 플러그인 |

### 1) 플러그인 설치

플러그인은 npm을 통해 설치하거나 cdn 형태로 사용할 수 있습니다.  

editor를 설치할 때 포함되어 있지 않기 때문에 따로 설치하여야 하며, 반드시 **editor가 먼저 선언**된 상태여야 합니다.  


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
// 예시 table merged cell
import tableMergedCell from '@toast-ui/editor-plugin-table-merged-cell';
```

- CommonJS

```js
const pluginFn = require('@toast-ui/editor-plugin-${pluginName}');
```

</details>

<details>
<summary>2. Contents Delivery Network (CDN) 사용하기</summary>

각 플러그인은 [NHN Cloud](https://www.nhncloud.com/kr)에서 제공하는 CDN을 통해서도 사용할 수 있습니다.

```js
<script src="https://uicdn.toast.com/editor-plugin-${pluginName}/latest/toastui-editor-plugin-${pluginName}.min.js"></script>
// 예시 table merged cell
<script src="https://uicdn.toast.com/editor-plugin-table-merged-cell/latest/toastui-editor-plugin-table-merged-cell.min.js"></script>
```

이후 불러온 플러그인은 다음과 같이 변수에 저장합니다.

```js
const { chart } = toastui.Editor.plugin;
```

</details>

### 2) 플러그인 사용

ES 모듈 혹은 CDN에 따라 플러그인을 설치했다면, 이를 Toast UI Editor에 저장하는 방법은 다음과 같습니다.

```js
const editor = new Editor({
    // 기타 옵션들...
    plugins: [pluginName],
})
```

불러온 플러그인은 `plugins` 라는 옵션에 배열로 나열되는데, 이때 pluginName은 상단에서 불러온 플러그인 함수가 저장된 변수명입니다.
저는 `table merged cell`과 `code syntax highlight`, `color syntax` 세개를 사용하였는데, 이를 ES 모듈과 CDN 환경에서 사용한다면 아래와 같습니다.

```js
import Editor from '@toast-ui/editor';
import tableMergedCell from '@toast-ui/editor-plugin-table-merged-cell';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';

const editor = new Editor({
  // ...
  plugins: [tableMergedCell, codeSyntaxHighlight, colorSyntax]
});
```

```js
import Editor from '@toast-ui/editor';
import tableMergedCell from '@toast-ui/editor-plugin-table-merged-cell';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';

const editor = new Editor({
  // ...
  plugins: [tableMergedCell, codeSyntaxHighlight, colorSyntax]
});
```

만약 기존 플러그인에서 옵션을 변경하여 사용하고 싶다면, `plugins`옵션에 튜플 형태의 데이터를 추가하면 됩니다.

```js
import Editor from '@toast-ui/editor';
import tableMergedCell from '@toast-ui/editor-plugin-table-merged-cell';

const pluginOptions = {
    // table merged cell 에서 사용할 옵션
};

const editor = new Editor({
  // ...
  plugins: [[tableMergedCell, pluginOptions]]
});
```

### 3) 플러그인 설정

Toast UI Editor의 플러그인은 설정 방식이 각각 다르고 또한 다른 컴포넌트와 종속성을 가지고 있어 사용하고자 하는 플러그인 외의 API를 설치해야할 수도 있습니다.  

이에, 자세한 내용은 [Toast_UI_Editor_Plugin.md]()에 별도로 설명을 기재하였습니다.  
<br><br><br>

## 5. 툴바 설정(Toolbar)

Toast UI Editor에서는 heading, bold, italic 등 총 16개의 옵션과 스크롤싱크를 기본 적으로 제공합니다.  

별도의 옵션을 지정하지 않았을 경우 하단 옵션이 자동으로 적용됩니다.

```js
const options = {
  // ...
  toolbarItems: [
    ['heading', 'bold', 'italic', 'strike'],
    ['hr', 'quote'],
    ['ul', 'ol', 'task', 'indent', 'outdent'],
    ['table', 'image', 'link'],
    ['code', 'codeblock'],
    ['scrollSync'],
  ],
}
```

툴바 옵션은 2차원 배열 형태로 정의되어있는데, 각 요소들은 정의된 순서대로 렌더링되며 그룹 사이는 `|`기호로 구분되어 보여집니다.  

툴바 구성을 변경하고 싶다면 위 배열을 수정하여 초기화 시 옵션에 지정하면 됩니다.

```js
const editor = new Editor({
  el: document.querySelector('#editor'),
  toolbarItems: [
    ['heading', 'bold'],
    ['ul', 'ol', 'task'],
    ['code', 'codeblock'],
  ],
});
```

### 툴바 버튼 커스터마이징

툴바 버튼을 커스텀하는 방법은 기본 툴바 버튼에 속성을 조금 수정하여 사용하는 것과 사용자가 직접 커스텀 버튼을 생성하여 추가하는 방법 두가지가 있습니다. 

먼저 에디터에서 제공하는 툴바 버튼 UI를 그대로 사용하여 커스텀하는 방법에 대해서 설명하겠습니다.  

### 1) 기본 버튼 커스텀

기본 툴바 버튼을 수정할 경우, 해당 버튼의 `아이콘`이나 `툴팁`, `팝업 동작`만 재정의 할 수 있습니다.

| 이름 | 타입 | 설명 |
| --- | --- | --- |
| `name` | string | 툴바 요소의 고유한 이름이며, 필수로 지정해야 한다. | 
| `tooltip` | string | 옵셔널 값이며, 툴바 요소에 마우스를 올렸을 때 보여줄 툴팁 문자열을 정의한다. | 
| `text` | string | 옵셔널 값이며, 툴바 버튼 요소에 보여줄 텍스트가 있는 경우 정의한다. | 
| `className` | string | 옵셔널 값이며, 툴바 요소에 적용할 class를 정의한다. | 
| `style` | Object | 옵셔널 값이며, 툴바 요소에 적용할 style을 정의한다. | 
| `command` | string | 옵셔널 값이며, 툴바 버튼을 클릭했을 때 실행하고 싶은 명령을 지정한다. `popup` 옵션과는 서로 배타적인 관계이다. | 
| `popup` | PopupOptions | 옵셔널 값이며, 툴바 버튼을 클릭했을 때 팝업을 띄우고 싶은 경우 지정한다. `command` 옵션과는 서로 배타적인 관계이다. |

```js
const editor = new Editor({
  el: document.querySelector('#editor'),
  toolbarItems: [
    [{
      name: 'myItem',
      tooltip: 'myItem',
      command: 'bold',
      text: '@',
      className: 'toastui-editor-toolbar-icons',
      style: { backgroundImage: 'none', color: 'red' }
    }]
  ],
  // ...
});
```

위 예제 코드에서는 내가 만들고자 하는 커스텀 버튼 이름과 툴팁을 `myItem`으로 설정한 뒤, `bold` 커멘드를 연결했습니다.  

실제 화면에는 `'text'`에 입력한 `@`가 버튼 모양으로 출력되며 `'className'`의 값이 해당 버튼의 `class`로 들어가고 `'style'`의 값이 해당 버튼에 `css`로 적용되어 보여집니다.  

이후 해당 버튼을 클릭하면 `blod`가 실행됩니다.  
<br>

#### 다음은 클릭 시 팝업 창을 띄우도록 하는 방법입니다.  

버튼을 클릭했을 때 직접 정의한 팝업을 띄우고 싶다면, `popup` 옵션을 사용하면 됩니다.  

 `popup` 옵션의 인터페이스는 아래와 같습니다.  

| 이름 | 타입 | 설명 |
| --- | --- | --- |
| `body` | HTMLElement | 렌더링 될 팝업 DOM 노드를 정의한다. | 
| `className` | string | 옵셔널 값이며, 팝업 요소에 적용할 class를 정의한다. | 
| `style` | Object | 옵셔널 값이며, 팝업 요소에 적용할 style을 정의한다. | 

옵션으로 설정한 팝업 노드는 툴바를 클릭했을 때 자동으로 화면에 나타나며, 다른 영역을 클릭했을 경우 자동으로 사라집니다.

아래는 컬러피커 플러그인 코드를 조금 변형한 예시 코드입니다.

```js
// 1. 팝업이 들어갈 컨테이너 생성
// 나중에 여기에 버튼 등의 UI 요소를 넣어서 팝업의 body로 사용합니다.
const container = document.createElement('div');

// 2. 버튼 생성
// createApplyButton은 컬러피커에서 버튼을 만드는 함수로 보입니다.
// i18n.get('OK')는 다국어 지원을 위한 것으로, 현재 언어에 맞는 "OK" 문자열(예: 한국어면 '확인')을 불러옵니다. 
const button = createApplyButton(i18n.get('OK'));

// 3. 버튼에 클릭 이벤트 등록
// 사용자가 버튼을 클릭하면 실행될 함수를 정의합니다.
// 자세한 내용은 이곳에선 생략...
button.addEventListener('click', () => {
  // ...
  eventEmitter.emit('command', 'color', { selectedColor });
  eventEmitter.emit('closePopup');
});

// 4. 버튼을 팝업 컨테이너에 삽입
container.appendChild(button);

// 5. 툴바 버튼 객체 정의
// popup 옵션에 사용할 클래스명과 스타일 DOM노드를 정의힙니다.
const colorPickerToolber = {
  name: 'color',
  tooltip: 'Text color',
  className: 'some class',
  popup: {
    className: 'some class', //class에 some과 class가 추가됨
    body: container, // 버튼이 들어가 있는 div가 팝업노드의 DOM이 됨
    style: { width: 'auto' }, // css
  },
};
```

### 2) 커스텀 버튼 생성

기본적으로 제공되는 툴바 버튼 외에 사용자 개인이 커스텀한 툴바 버튼을 만들고 싶다면 아래처럼 `el` 옵션을 지정해야합니다.

```js

// span 태그 생성
const myCustomEl = document.createElement('span');

// 생성된 span 태그의 옵션 설정
myCustomEl.textContent = '😎';
myCustomEl.style = 'cursor: pointer; background: red;'
myCustomEl.addEventListener('click', () => {
  // exec()는 에디터에서 제공하는 메서드로 편집기 명령을 실행하는 함수입니다.
  // 현재 blod가 실행되도록 되어있습니다.
  editor.exec('bold');
});

const editor = new Editor({
  // ...
  toolbarItems: [
    [{
      name: 'myItem',
      tooltip: 'myItem',
      el: myCustomEl, // 생성된 span 태그 el 옵션으로 지정
    }]
  ]
});
```

기존에 제공되는 버튼을 커스텀할 경우, command 옵션을 통해 'blod'를 연결하였습니다.  

커스텀 버튼의 경우 직접 버튼 요소와 기능을 생성하여 el 옵션에 지정해야합니다.


### 3) 툴바 상태 변경

에디터에서 내용을 입력시 포커스된 노드에 따라 툴바의 상태도 함께 변화하는데 이 툴바 상태도 변경할 수 있습니다.  

예를 들어, '\*\*굵은\*\* 글씨' 라는 내용이 에디터에 작성되어 있다면 저 '굵은' 이라는 단어는 마크다운에서는 `bold`가 적용되어 있다는 의미입니다.  

이때, '굵은'을 클릭하면 글자 사이에 포커스가 들어오며 상단 툴바의 bold 버튼에 `'active'`라는 `class`가 추가됩니다.  

기본 설정에서는 active 클레스가 추가되면 파란색으로 색상이 변하도록 되어있습니다. 

이러한 툴바 상태를 변경하고 싶다면 CSS상에서 스타일을 변경하면 됩니다.

만약, 툴바를 커스텀 하셨다면 기존 툴바를 수정하셨을 경우 `'state'` 옵션을 추가해야 하고,  

새로 버튼을 생성하신 거라면 onUpdated() 옵션을 지정해야합니다. 

<details>
<summary>1. 기존 툴바 생성 시</summary>

기존 툴바를 사용할 경우 아래의 `'state'` 값을 사용해야만 툴바 요소의 활성화 상태를 변경할 수 있습니다.

| command | state | 포커스시 active 클레스 추가되는 요소 |
|-----|-----|:----|
| heading | heading | 제목 |
| bold | strong | 굵은 글씨 |
| italic | emph | 이탤릭 요소 |
| strike | strike | 취소선 |
| hr | thematicBreak | 수평 가로줄 |
| quote | blockQuoto | 인용문 |
| ul | bulletList | 순서가 없는 리스트 |
| ol | orderedList | 순서가 있는 리스트 |
| task | taskList | 체크박스 |
| table | table | 표 |
| code | code | 인라인 코드 |
| codeblock |  codeBlock | 코드 블럭 | 

```js
const editor = new Editor({
  // ...
  toolbarItems: [
    [{
      name: 'myItem',
      tooltip: 'myItem',
      command: 'bold',
      text: '@',
      className: 'toastui-editor-toolbar-icons',
      style: { backgroundImage: 'none', color: 'red' },
      // `strong` 노드에 위치할 경우 툴바 요소에 'active' 클래스가 추가된다.
      state: 'strong',
    }]
  ]
});
```

</details>
<details>
<summary>2. 커스텀 툴바 생성 시</summary>

에디터 내부에서 커스텀한 툴바 요소를 직접 조작하는 것은 한계가 있기 때문에, `onUpdated` 콜백 함수를 통해 스타일링을 진행합니다.  

`onUpdated()` 함수는 `active`와 `disabled` 상태를 나타내는 객체를 매개변수로 전달합니다.  

이 매개변수를 사용하여 요소에 스타일을 추가하거나 원하는 동작을 정의할 수 있습니다.

```js
// 커스텀 버튼을 생성하고 el로 지정하는 방법은 동일
const myCustomEl = document.createElement('span');
myCustomEl.textContent = '😎';
myCustomEl.style = 'cursor: pointer; background: red;'
myCustomEl.addEventListener('click', () => {
  editor.exec('bold');
});

const editor = new Editor({
  // ...
  toolbarItems: [
    [{
      name: 'myItem',
      tooltip: 'myItem',
      el: myCustomEl,
      state: 'strong',
      // onUpddated 콜백 옵션을 통해 지정
      onUpdated({ active, disabled }) {
        // active 상태일 때 background 색상을 초록색으로
        if (active) {
          myCustomEl.style.background = 'green';
        } else {
          myCustomEl.style.background = '';
        }
      }
    }]
  ]
});
```

</details>
<br>
이 외에도 에디터 내에서 특정 키를 입력할 때 인명 검색과 같은 팝업 창을 띄우거나, 멘션 형태의 일반 노드를 특정한 위젯 노드로 보여주거나, 팝업을 띄고 싶을 때를 위하여 토스트 에디터에서는 옵션과 API를 제공하고 있습니다.

관련 내용은 [여기](https://github.com/nhn/tui.editor/blob/master/docs/ko/widget.md)서 확인할 수 있습니다.

<br><br><br>

## 6. 메소드(Methods)

Toast UI Editor는 정적 메소드(Static Methods)와 인스턴스 메소드(Instance Methods)를 제공합니다.  

더 자세한 메소드 관련 설명은 [여기]()에서 확인 할 수 있으며, 제 프로젝트 파일 [Toast_UI_Editor_Methods.md]()에도 정리 중에 있습니다.

먼저 현재 프로젝트에서 사용된 메소드를 설명하겠습니다. 

### 1) getMarkdown()

에디터에 작성된 내용은 Markdown과 HTML 형태 두가지로 가져올 수 있습니다.  

Markdown 형식으로 가져오고 싶다면 getMarkdown() 메소드를 사용하면 되며, HTML은 getHTML()으로 가져오면 됩니다.  

❗ 토스트 에디터는 기본적으로 sanitizer를 제공하긴 하지만 생각보다 필터링 범주가 적기 때문에 개인적으로 필터링 함수를 적용시켜야합니다. 자세한 내용은 [여기](#7-보안-필터링sanitizer)에서 확인 가능합니다.

```js
// 에디터 인스턴스 선언
const eitor = new toastui.Editor({
    //...
})

// 선언된 에디터 인스턴스에 getMarkdown() 메소드를 사용하여 변수 dirty 에 값 저장
const dirty = editor.getMarkdown();

// 이후 dirty 를 필터링하여 viewer 입력
```

### 2) factory()

`factory()` 메소드는 토스트 에디터에서 제공하는 정적 메소드 중 하나로 **클래스의 인스턴스를 생성하거나 초기 설정을 포함한 객체를 만들어주는 "팩토리 함수"** 입니다.  

현재 프로젝트에서는 `viewer`를 사용하기 위하여 `factory()` 메소드를 사용하였습니다.

토스트 에디터에서는 `toast-editor-viewer`를 따로 제공하고있습니다.

<details>
<summary>Toast UI Editor Viewer</summary>

***
TOASE UI Editor(이하 'Editor'라고 명시)는 에디터를 로딩하지 않고 마크다운 콘텐츠를 보여줄 수 있도록 뷰어를 제공합니다.  

뷰어가 에디터보다 훨씬 더 가볍습니다만, 에디터에 이미 뷰어 기능이 포함되어 있으므로 **에디터와 뷰어가 동시에 로드되지 않도록 주의**해야합니다.

#### 1) 설치 방법

- ES6 모듈
```js
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
```

- CommonJS
```js
const Viewer = require('@toast-ui/dist/toastui-editor-viewer');
require('@toast-ui/editor/dist/toastui-editor-viewer.css');
```

- CDN
```js
<script src="https://uicdn.toast.com/editor/latest/toastui-editor-viewer.js"></script>
<link rel="stylesheet" href="https://uicdn.toast.com/editor/latest/toastui-editor-viewer.min.css" />
```

#### 2) 사용 방법

사용 방법은 에디터와 유사합니다. 

```html
<div id="viewer"></div>
```

```js
const Viewer = toastui.Editor;
const viewer = new Viewer({
  el: document.querySelector('#viewer'),
  height: '600px',
  initialValue: '# hello',
  //...
});
```

Viewer의 더 많은 옵션은 [여기](https://nhn.github.io/tui.editor/latest/ToastUIEditorViewer)에서 확인할 수 있습니다.

</details>

그런데 왜 새로운 페이지를 만듬에도 불구하고 Viewer를 사용하지 않고 다시 에디터를 불러와 `factory()` 메소드를 사용했냐 하면, 에디터 플러그인을 사용했을 경우 **Viewer에서는 플러그인이 적용된 코드를 보여주는 기능이 없기 때문**에입니다.  

그래서, 에디터 라이브러리를 가져와 Viewer로 보여주는 `factory()` 메소드를 사용한 것입니다. 


현재 프로젝트에서 작성된 코드는 다음과 같으며, `viewer: true`로 설정하면 뷰어가 생성됩니다. 

```js
const { Editor } = toastui;
const { tableMergedCell, codeSyntaxHighlight, colorSyntax } = Editor.plugin;

const decodedContent = decodeURIComponent(content); // 에디터에서 작성된 내용을 디코딩

new Editor.factory({
   el: document.querySelector('#viewer'), // viewer에
   height: '100%',
   initialValue: decodedContent, // 디코딩 된 컨텐츠를 넣고
   viewer: true, // viewer로 활성화
   plugins: [tableMergedCell, codeSyntaxHighlight, colorSyntax], // 플러그인 추가
});
```
<br><br><br>

## 7. 보안 필터링(sanitizer)

Toast UI Editor는 `마크다운(Markdown)` 모드와 `위지윅(WYSIWYG)` 두 모드를 함께 제공하는 만큼 이 둘 버전을 동기화 시켜주는 렌더러가 존재합니다.  

이 렌더러에는 `DOMPurify` 라이브러리가 적용되어 보안 필터링이 되지만 `getMarkdown()` 혹은 `getHTML()`로 컨텐츠를 가져올 때는 `DOMPurify`이 적용되지 않고 viewer에서 다시 보여줄 때 `DOMPurify`가 적용됩니다.  

Viewer로 보여주지 않는다면 에디터에서 제공하는 최소한의 Sanitizer만 적용되기 때문에 악성 태그에 노출 될 수도 있습니다.  

이에 본 프로젝트에서는 자체적인 보안 필터링을 적용시켜 테스트를 진행하였습니다.  

보안 필터링 라이브러리는 토스트 에디터와 동일하게 `DOMPurify` 라이브러리를 사용하였으며, 몇가지 옵션과 태그를 사용하여 보안을 강화시켰습니다.  

더 자세한 내용은 [여기](https://github.com/yerica08/toastEditor/blob/main/README.md)서 확인하실 수 있습니다.  

<br><br><br>

## 8. 이미지 업로드

Toast UI Editor는 이미지 업로드 버튼은 존재하지만 기능은 비워져 있습니다.  

따라서, 이미지 업로드 로직은 개인이 직접 만들어야 합니다.  

이미지 업로드 로직을 커스텀하기 위핸선, 토스트의 `hook` 옵션의 `addImageBlobHook()` 콜백 함수를 사용하면 됩니다. 

```js
const editor = new toastui.Editor({
    //...
    hooks: {
        addImageBlobHook(blob, callback){
            // 이미지 업로드 로직 작성
        }
    }
})
```

### 1) addImageBlobHook의 매개변수 설명

다음은 `addImageBlobHook(blob, callback)` 함수의 매개변수에 대한 설명입니다. 

- `blob` 
: blob은 업로드된 이미지의 정보를 가진 **파일 객체**로, **날짜/이름/사이즈/타입 등의 정보**를 가지고 있습니다.

- `callback`
: callback은 에디터 내부 실행 로직의 일부인 함수(아래 코드)가 반환됩니다.  

호출 시 에디터에 이미지를 추가하는 역할을 합니다.  

아래는 콜백 함수를 콘솔 창에 찍어봤을 때 나오는 결과물입니다.

```js
this.props.eventEmitter.emit("addImageBlobHook", o, (function(e, r) {
    return t.props.execCommand("addImage", {
        imageUrl: e,
        altText: r || n.value
    })
}
), "ui")
```

### 2) 실제 사용 방법 

`addImageBlobHook` 을 사용하여 이미지 업로드를 구현하는 방식은 어떻게 사용하고 싶냐에 따라 달라집니다.  
<br>

<details>
<summary>1. (참고) 자바로 디스크에 이미지 파일 저장하고 불러오기</summary>

- [참고 링크](https://congsong.tistory.com/68#3.-addimageblobhook%EC%9C%BC%EB%A1%9C%C2%A0%EC%9D%B4%EB%AF%B8%EC%A7%80%C2%A0%EC%97%85%EB%A1%9C%EB%93%9C%C2%A0%EB%A1%9C%EC%A7%81%C2%A0%EC%BB%A4%EC%8A%A4%ED%85%80%ED%95%98%EA%B8%B0)

</details>

<details>
<summary>2. (참고) 이미지 첨부 로직을 base64 에서 파일 객체를 S3에 저장하고 S3 url 주소를 가져오는 방법</summary>

- [참고링크](https://leego.tistory.com/entry/Toast-UI-Editor-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EC%B2%A8%EB%B6%80%ED%95%98%EA%B8%B0)

</details>

<details>
<summary>3. base64로 인코딩해서 마크다운으로 삽입(비추천 용량증가)</summary>

```js
const editor = new toastui.Editor({
    //...
    hooks: {
        async addImageBlobHook(blob, callback){
            const reader = new FileReader();
            reader.onload = () => {
               const dataUrl = reader.result; // base64 인코딩된 이미지 URL
               callback(dataUrl, 'image alt attribute', 'markdown');
            };
            reader.readAsDataURL(blob); // base64로 변환
        }
    }
})
```
</details>
<br>


저는 실제 사용하는 서버가 없고, `Toast Image Editor`를 사용하여 불러온 이미지를 편집까지 한 뒤 에디터에 포함시키고 싶었기 때문에 다음과 같은 로직을 만들었지만, 실제로 사용할 경우 로직의 수정이 필요할 것으로 예상됩니다.  

아래는 현재 프로젝트에서 사용된 로직코드의 일부입니다.  

더 자세한 내용은 [Toast_Image_Editor.md]]()에서 확인 가능합니다.

```js
// 이미지 에디터 미리 만들어놓기
let imageEditor = null;
const container = document.getElementById('image-editor-container');

imageEditor = new tui.ImageEditor(container, {
   includeUI: {
      loadImage: {
         path: '', // 초기엔 비워두고, 나중에 이미지만 변경
         name: '',
      },
      menu: ['crop', 'flip', 'rotate', 'draw', 'shape', 'text'],
      initMenu: 'crop',
      uiSize: {
         width: '1000px',
         height: '700px',
      },
      menuBarPosition: 'bottom',
   },
   cssMaxWidth: 700,
   cssMaxHeight: 500,
   selectionStyle: {
      cornerSize: 20,
      rotatingPointOffset: 70,
   },
});

// Toast UI Editor 설정
const { Editor } = toastui;
const { tableMergedCell, codeSyntaxHighlight, colorSyntax } = Editor.plugin;

const editor = new toastui.Editor({
    //...
    hooks: {
        async addImageBlobHook(blob, callback){
            // Toast Image Editor와 연결한 뒤 blob을 base64로 변환하여 에디터에 삽입
            const reader = new FileReader();
            reader.onload = () => {
               const container = document.getElementById('image-editor-container');
               if (container) container.style.display = 'block';

               if (imageEditor && imageEditor.ui) {
                  imageEditor.ui._editorCallback = callback;
                  imageEditor.ui._imageEditorInstance = imageEditor;
                  imageEditor.ui._containerElement = container;
               }

               imageEditor.ui._addDownloadEvent();

               imageEditor.loadImageFromURL(reader.result, '편집 이미지').then(() => {
                  imageEditor.clearUndoStack();
                  imageEditor.clearRedoStack();
               });
            };
            reader.readAsDataURL(blob);
        }
    }
})
```
