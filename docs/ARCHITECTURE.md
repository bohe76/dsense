# DSENSE 프로젝트 아키텍처 문서

이 문서는 DSENSE 디지털 에이전시 웹사이트(`dsense`)의 아키텍처, 디렉토리 구조, 주요 컴포넌트, 데이터 흐름, 개발 표준 및 배포 관련 상세 정보를 제공하여 프로젝트의 전반적인 이해를 돕습니다.

## 1. 프로젝트 개요 및 핵심 기술

DSENSE는 Vanilla TypeScript와 Vite를 기반으로 구축된 단일 페이지(또는 스크롤 기반) 웹사이트입니다. 고성능 애니메이션을 위해 GSAP(GreenSock Animation Platform)를 적극적으로 사용하며, 부드러운 스크롤 경험을 위해 Lenis를 도입했습니다.

### 주요 기술 스택
- **Build Tool**: Vite (빠른 개발 서버 및 번들링)
- **Language**: TypeScript (타입 안정성 및 코드 품질 향상)
- **Styling**: Vanilla CSS (`src/style.css`를 통한 전역 스타일 관리)
- **Animation**: GSAP (ScrollTrigger 포함 - 복잡한 스크롤 기반 애니메이션 구현)
- **Scrolling**: @studio-freight/lenis (고급 스무스 스크롤 기능 제공)
- **Package Manager**: npm
- **Code Quality**: ESLint, Prettier (코드 스타일 일관성 및 자동 포맷팅)

---

## 2. 디렉토리 구조

```
d:/dsense/
├── index.html              # 애플리케이션의 단일 진입점
├── package.json            # 프로젝트 의존성 및 스크립트 정의
├── package-lock.json       # 정확한 의존성 버전 관리 (npm)
├── _assets_backup/         # [NEW] 배포에서 제외되는 미사용 에셋 백업 (예: 구 버전 hero-bg.png) 
├── tsconfig.json           # TypeScript 컴파일러 설정
├── vite.config.ts          # Vite 빌드 및 개발 서버 설정
├── .prettierrc.json        # Prettier 코드 포맷터 설정
├── eslint.config.js        # ESLint (v9 Flat Config) 설정
├── public/                 # 웹 서버를 통해 직접 접근 가능한 정적 리소스
│   ├── favicon.png         # 파비콘
│   ├── images/             # 프로젝트 썸네일 이미지 및 Open Graph 이미지 (og-image.jpg)
│   ├── videos/             # (로컬 개발용) 원본 비디오 파일 (Git 추적 제외)
│   ├── robots.txt          # 검색 엔진 크롤링 지침
│   └── sitemap.xml         # 검색 엔진 사이트맵
└── src/                    # 애플리케이션 소스 코드
    ├── main.ts             # 애플리케이션 진입점 및 컴포넌트 초기화 로직
    ├── main.ts             # 애플리케이션 진입점 및 컴포넌트 초기화 로직
    ├── styles/             # [NEW] 스타일시트 디렉토리 (모듈화)
    │   ├── base.css        # 기본 설정 (변수, 리셋)
    │   ├── utilities.css   # 유틸리티 클래스
    │   ├── layout.css      # 공통 레이아웃 (헤더, 모바일 메뉴)
    │   ├── main.css        # 메인 진입 CSS
    │   └── components/     # 컴포넌트별 스타일 (hero, about, projects, contact)
    ├── types.ts            # 공통 데이터 타입 정의 (인터페이스)
    ├── components/         # UI 컴포넌트 (클래스 기반)
    │   ├── Header.ts       # 헤더 내비게이션 및 애니메이션
    │   ├── Hero.ts         # 메인 히어로 섹션 및 텍스트/WebGL 애니메이션 조정
    │   ├── FluidBackground.ts # [NEW] WebGL 유체 시뮬레이션 배경 컴포넌트. 데스크톱(마우스) 및 모바일(자이로스코프) 인터랙션 지원.
    │   ├── About.ts        # 회사 소개 섹션 및 텍스트 애니메이션
    │   ├── Thinking.ts     # 비전/철학 섹션 및 텍스트 애니메이션
    │   ├── ProjectList.ts  # 포트폴리오 목록 렌더링 및 필터링, 카운터 관리
    │   ├── ProjectCard.ts  # 개별 포트폴리오 카드 UI 생성 헬퍼
    │   ├── Contact.ts      # 연락처 섹션 및 애니메이션
    │   ├── Cursor.ts       # 커스텀 마우스 커서 (현재 비활성화)
    │   └── VideoModal.ts   # 비디오 재생 모달 (클래스)
    └── data/               # 애플리케이션 데이터
        ├── projects.ts     # 프로젝트 관련 더미 데이터 (현재 사용 안 함)
        └── works.json      # 실제 포트폴리오 프로젝트 데이터 (비디오 URL 포함)
```

---

## 3. 아키텍처 상세

### 3.1. 애플리케이션 진입점 (`src/main.ts`)
- `index.html`은 `type="module"` 스크립트를 통해 `src/main.ts`를 로드합니다.
- `main.ts`는 애플리케이션의 핵심 초기화 로직을 담당합니다:
  - 전역 스타일(`style.css`) 로드.
  - GSAP (`gsap`, `ScrollTrigger`) 플러그인 등록 및 스무스 스크롤 라이브러리 Lenis 초기화.
  - `requestAnimationFrame` 루프를 설정하여 Lenis의 스크롤 애니메이션과 GSAP의 동기화를 처리.
  - DOM의 `#app` 요소 내부에 주요 섹션 컨테이너들 (`<header>`, `<main>`, `<section>`)을 동적으로 생성합니다.
  - `new` 키워드를 사용하여 각 UI 컴포넌트 클래스(예: `new Header('header-container')`)를 인스턴스화하고, 해당 인스턴스의 `render()` 및 `initAnimations()` 메서드를 호출하여 페이지를 구성하고 애니메이션을 시작합니다.

### 3.2. 컴포넌트 패턴 (클래스 기반)
- 모든 주요 UI 섹션(예: `Header`, `Hero`, `About`, `ProjectList`)은 `src/components/` 디렉토리 내의 독립적인 TypeScript 클래스로 구현됩니다.
- 각 컴포넌트 클래스는 다음과 같은 구조와 역할을 가집니다:
  - **`constructor(targetId: string)`**: 컴포넌트가 마운트될 DOM 요소의 ID를 인자로 받아 해당 요소를 찾고, 필요한 초기 상태 및 인스턴스를 설정합니다.
  - **`render(): string`**: 컴포넌트의 HTML 구조를 문자열 템플릿 리터럴로 정의하여 반환합니다. 이 HTML은 `this.element.innerHTML`에 주입됩니다.
  - **`attachEvents()`**: `render()` 후 컴포넌트 내의 DOM 요소들에 이벤트 리스너(클릭, 마우스 오버 등)를 바인딩합니다.
  - **`initAnimations()`**: `render()` 및 `attachEvents()` 후에 `gsap.timeline()` 및 `ScrollTrigger`를 사용하여 컴포넌트 고유의 스크롤 기반 또는 타임라인 애니메이션을 초기화합니다.
  - **데이터 관리**: `ProjectList`와 같이 데이터를 다루는 컴포넌트는 `src/data`의 JSON 파일을 직접 import하여 사용합니다.

### 3.3. 데이터 흐름
- **정의**: `src/types.ts` 파일에 `WorkItem` 인터페이스가 정의되어 포트폴리오 데이터(`works.json`)의 일관된 구조와 타입 안정성을 보장합니다.
- **소스**: `src/data/works.json` 파일이 모든 포트폴리오 프로젝트 정보의 원본 데이터 역할을 합니다. 이 JSON 파일에는 `video_src`, `video_width`, `video_height`와 같은 비디오 관련 메타데이터도 포함됩니다.
- **활용**: `ProjectList.ts` 컴포넌트가 `works.json` 데이터를 import하여 필터링 및 렌더링 로직에 활용합니다. `ProjectCard.ts` 헬퍼 함수는 이 데이터와 `thumbnail` 경로를 받아 개별 포트폴리오 카드의 HTML을 생성합니다.

### 3.4. 스타일링 전략
### 3.4. 스타일링 전략
- **모듈화된 CSS 아키텍처**: 유지보수성과 확장성을 위해 기존의 거대한 `style.css`를 `src/styles/` 디렉토리 하위의 기능별/컴포넌트별 파일로 분리했습니다.
  - `main.css`가 진입점 역할을 하며 다른 CSS 파일들을 `@import` 합니다.
  - **Base**: `base.css` (변수, 리셋)
  - **Utilities**: `utilities.css` (재사용 가능한 헬퍼 클래스)
  - **Layout**: `layout.css` (헤더, 푸터 등 전역 구조)
  - **Components**: `components/*.css` (각 섹션별 독립적인 스타일)
- **BEM(Block Element Modifier)** 네이밍 컨벤션을 기반으로 한 클래스명과 유틸리티 클래스(`flex`, `container` 등)를 혼용하여 사용합니다.
- **BEM(Block Element Modifier)** 네이밍 컨벤션을 기반으로 한 클래스명과, 레이아웃 및 유틸리티를 위한 클래스(`flex`, `container` 등)가 혼용되어 사용됩니다.
- 반응형 디자인은 `@media (min-width: ...)` 쿼리를 주로 사용하여 데스크톱 우선(Desktop-First) 방식으로 구현됩니다.
- 커스텀 CSS 변수(`:root`에 정의된 `--bg-color`, `--text-color` 등)를 적극 활용하여 테마 및 유지보수를 용이하게 합니다.

### 3.5. 애니메이션 전략
- **GSAP (GreenSock Animation Platform)**: 고성능 웹 애니메이션을 구현하는 데 사용되는 핵심 라이브러리입니다.
  - **ScrollTrigger**: GSAP 플러그인 중 하나로, 스크롤 위치에 따라 요소의 애니메이션을 트리거하고 제어합니다. 패럴랙스 효과, 요소 등장/퇴장 애니메이션 등에 광범위하게 사용됩니다.
  - **Text Reveal**: 텍스트를 한 글자(`char`) 또는 단어(`word`) 단위로 분할(split)하여 순차적으로 등장시키는 애니메이션 기법이 여러 섹션(예: Hero, About)에서 공통적으로 사용됩니다. 이는 `text-mask` 및 `text-reveal` 클래스를 통해 구현됩니다.
  - **Parallax**: `data-scroll-speed` 속성을 사용하여 요소가 스크롤 속도에 따라 다르게 움직이도록 설정하여 깊이감을 연출합니다.
- **Lenis**: 부드러운 스크롤 경험을 제공하는 라이브러리로, GSAP ScrollTrigger와 함께 사용하여 최적화된 스크롤 인터랙션을 제공합니다.

---

## 4. 개발 표준 및 도구

### 4.1. Git 워크플로우
- **브랜치 전략**: `main` 브랜치를 중심으로 기능 개발을 위한 `feature/` 브랜치 또는 버그 수정을 위한 `fix/` 브랜치를 생성하여 작업 후 `main` 브랜치로 병합하는 방식을 따릅니다.
- **커밋 메시지**: Git 커밋 메시지는 `feat:`, `fix:`, `docs:`, `chore:` 등 Conventional Commits 규칙을 준수하여 작성됩니다.

### 4.2. 코드 품질 (ESLint & Prettier)
- **ESLint**: JavaScript 및 TypeScript 코드의 잠재적 오류를 식별하고 코드 스타일을 강제하는 데 사용됩니다. `eslint.config.js` (ESLint v9의 Flat Config 형식)를 통해 TypeScript 관련 규칙과 함께 설정됩니다.
- **Prettier**: 일관된 코드 포맷팅을 자동으로 적용하는 코드 포맷터입니다. `eslint-plugin-prettier`를 통해 ESLint 규칙으로 통합되어 코드 스타일을 자동으로 교정합니다. `.prettierrc.json` 파일을 통해 포맷팅 규칙이 정의됩니다.
- **스크립트**: `package.json`에 `lint` (검사) 및 `lint:fix` (자동 수정) 스크립트가 정의되어 있습니다.

### 4.3. 의존성 관리 및 빌드
- **npm**: 프로젝트 의존성 관리 및 스크립트 실행에 사용됩니다. `package-lock.json`을 통해 의존성 버전의 일관성을 유지합니다.
- **Vite**: 개발 서버 실행 (`npm run dev`), 프로덕션 빌드 (`npm run build`), 빌드 결과물 미리보기 (`npm run preview`)에 사용되는 빌드 도구입니다.

---

## 5. SEO 및 외부 연동

웹사이트의 검색 엔진 최적화(SEO) 및 외부 서비스 연동을 위한 메타데이터가 `index.html`에 설정되어 있습니다.

### 5.1. 메타 태그 최적화
- **`title`**: 브라우저 탭 및 검색 결과에 표시되는 페이지 제목.
- **`description`**: 검색 결과에 표시되는 페이지 요약 설명. (`DSENSE(디센스)는 디지털 경험을 혁신하는 크리에이티브 에이전시로, UI/UX, 웹, 모바일, 영상, 일러스트 등 다양한 분야에서 최고의 전문가들이 함께하며, SEO 최적화 및 온라인 마케팅 전략을 제공합니다.`)
- **`keywords`**: 검색 엔진에 페이지의 주요 키워드를 제공. (`DSENSE, 디센스, 디지털 에이전시, 크리에이티브, UI/UX, 웹 개발, 모바일 앱, 영상 제작, 일러스트레이션, 브랜딩, SEO 최적화, 온라인 마케팅 전략`)

### 5.2. Open Graph 메타 태그 (SNS 공유 최적화)
`index.html`의 `<head>` 섹션에 Open Graph 프로토콜을 따르는 메타 태그들이 설정되어 있어, 웹사이트 URL 공유 시 소셜 미디어 플랫폼에서 풍부한 미리보기(리치 스니펫)를 제공합니다.
- **`og:title`**: 공유 시 표시될 제목.
- **`og:type`**: 콘텐츠 유형 (예: `website`).
- **`og:url`**: 페이지의 정규 URL. (`https://dsense.co.kr/`)
- **`og:image`**: 공유 시 표시될 대표 이미지. (`/images/og-image.jpg`)
  - **`og:image:width`, `og:image:height`**: 이미지의 너비와 높이 (권장 1200x630px).
- **`og:description`**: 공유 시 표시될 요약 설명.
- **`og:site_name`**: 웹사이트의 이름.

### 5.3. 사이트맵 (`sitemap.xml`) 및 Robots.txt
- **`sitemap.xml`**: `public/sitemap.xml` 경로에 위치하며, 웹사이트의 모든 페이지 URL을 검색 엔진에 알려주는 XML 파일입니다. 검색 엔진이 사이트 구조를 이해하고 콘텐츠를 효과적으로 크롤링하는 데 도움을 줍니다.
- **`robots.txt`**: `public/robots.txt` 경로에 위치하며, 검색 엔진 크롤러가 웹사이트의 어떤 부분에 접근할 수 있고 없는지를 지시합니다. `sitemap.xml`의 위치를 지정하여 검색 엔진이 사이트맵을 찾도록 안내합니다.

### 5.4. Google Analytics 연동
- `index.html`에 Google Analytics (gtag.js) 스크립트가 추가되어 웹사이트 방문자의 행동 데이터를 추적하고 분석할 수 있습니다. (`G-RJHBS83EY0` ID 사용)

### 5.5. Naver Site Verification
- `index.html`에 네이버 웹마스터 도구 사이트 확인 메타 태그가 추가되어 네이버 검색 엔진에 웹사이트 소유권을 확인합니다. (`88880aa8429a835833b17585b7ded341f8d4184f` ID 사용)

---

## 6. 에셋 관리

### 6.1. 이미지 및 로컬 비디오
- `public/images/`: 모든 정적 이미지 에셋(프로젝트 썸네일, 파비콘 등)이 이 디렉토리에 저장됩니다.
- `public/videos/`: (로컬 개발용) 대용량 비디오 에셋의 원본 저장 공간입니다. **이 디렉토리의 내용은 `.gitignore`를 통해 Git 추적에서 제외됩니다.**

### 6.2. 클라우드 비디오 에셋 (Cloudflare R2)
- 대용량 비디오 파일은 Cloudflare R2와 같은 외부 클라우드 스토리지 서비스에 업로드되어 관리됩니다.
- `src/data/works.json` 파일의 `video_src` 필드에는 R2에 업로드된 비디오의 공개 URL이 직접 명시됩니다. 이를 통해 Git 저장소의 크기를 줄이고, CDN을 통한 빠른 비디오 로딩을 보장합니다. (현재 URL: `https://pub-d9ca82cd711942f98faa7b2228e78c3d.r2.dev/videos/[파일명]`)
- `works.json`에는 `video_width` 및 `video_height` 정보도 포함되어, 비디오 로딩 전 미리 공간을 확보하여 레이아웃 쉬프트(Layout Shift)를 방지합니다.

---

## 7. 주요 컴포넌트 분석 (ProjectList & VideoModal)

### 7.1. `ProjectList` 컴포넌트 (`src/components/ProjectList.ts`)
- `works.json` 데이터를 기반으로 포트폴리오 카드(`ProjectCard`) 목록을 렌더링합니다.
- **카테고리 필터링**: `activeCategories` **배열**을 사용하여 활성 필터를 **순서대로** 관리. 마지막에 클릭한 카테고리가 먼저 표시됨 (우선순위 정렬).
- **ALL 칩:** 기본 활성화 상태. 개별 카테고리 클릭 시 ALL 비활성화, 모든 선택 해제 시 자동 ALL 활성화.
- **섹션 헤더 카운터 (`.project-count`)**: `updateSectionProjectCount()` 메서드를 통해 현재 보이는 프로젝트 카드 개수를 정확하게 계산하고 섹션 헤더에 반영합니다.
- **플로팅 모바일 카운터 (`.project-floating-counter`)**:
  - `initAnimations()` 및 `filterProjects()` 호출 시 `setupFloatingCounterScrollTriggers()` 메서드를 통해 동적으로 `ScrollTrigger` 인스턴스들을 관리합니다.
  - 기존 `ScrollTrigger` 인스턴스를 `kill()`하고, 현재 **화면에 보이는 카드들**만을 대상으로 새로운 `ScrollTrigger`를 생성합니다.
  - 각 `visible` 카드가 뷰포트에 진입할 때 `index + 1` 값을 계산하여 `.project-floating-counter`에 표시함으로써, 필터링 후에도 정확한 순번을 유지합니다.
- **모바일 호버 고정 문제 해결**: `.filter-chip` 요소에 `mouseenter`, `mouseleave` 이벤트를 바인딩하여 `is-hovered` 클래스를 토글, 모바일 터치 환경에서 호버 효과가 고정되는 문제를 해결합니다.

### 7.2. `VideoModal` 컴포넌트 (`src/components/VideoModal.ts`)
- 비디오 재생을 위한 모달 오버레이 UI를 제공합니다.
- `open(project: WorkItem)` 메서드를 통해 특정 `WorkItem` 객체를 받아 비디오를 로드합니다.
- `video_width`와 `video_height` 정보가 `WorkItem`에 포함되어 있을 경우, `videoElement.style.aspectRatio`를 설정하여 비디오 로딩 전 공간을 미리 확보, 레이아웃 쉬프트를 방지합니다.

---

## 8. 유지보수 및 확장 가이드

- **프로젝트 추가**: `src/data/works.json`에 새 `WorkItem` 항목을 추가합니다. `public/images/`에 썸네일 이미지를, Cloudflare R2에 비디오 파일을 업로드한 후 `video_src`에 해당 URL을 기입합니다. `video_width`와 `video_height`도 함께 추가하여 레이아웃 안정성을 확보해야 합니다.
- **섹션 추가**: `src/components/`에 새 클래스 파일을 만들고, `src/main.ts`에서 해당 컴포넌트를 import 및 초기화하며, `index.html`에 적절한 컨테이너 `HTMLElement`를 추가합니다.
- **타입 수정**: 데이터 구조 변경 시 `src/types.ts`의 `WorkItem` 인터페이스를 반드시 함께 수정하여 타입 안정성을 유지해야 합니다.
- **스타일 변경**: `src/styles/` 디렉토리 내의 적절한 CSS 파일(`base.css`, `layout.css` 또는 `components/*.css`)을 수정하거나 새로운 컴포넌트 CSS 파일을 생성하여 `main.css`에 등록합니다. 기존 BEM 기반 클래스를 따르는 새로운 스타일을 추가합니다.
- **애니메이션 추가**: GSAP 및 ScrollTrigger API 문서를 참조하여 `initAnimations()` 메서드 내에서 새로운 애니메이션 시퀀스를 구현합니다.

---

## 9. 문제 해결 (Troubleshooting)

### 9.1. PowerShell 스크립트 실행 오류
Windows PowerShell 환경에서 `npm` 스크립트(예: `npm run dev`, `npm install`) 실행 시 "running scripts is disabled on this system"과 같은 권한 오류가 발생할 수 있습니다.
- **해결책**: `cmd /c "[원하는 npm 명령어]"` 형식으로 명령어를 실행합니다. 예: `cmd /c "npm run dev"`.
- **(선택 사항)** 현재 PowerShell 세션의 실행 정책을 변경하려면: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process`.

### 9.2. Git 명령어 인터랙티브 편집기 문제
`git commit`과 같이 커밋 메시지 입력을 위해 기본 텍스트 편집기(`Vim`, `Nano` 등)를 실행하려는 Git 명령은 CLI 환경에서 대기 상태에 빠질 수 있습니다.
- **해결책**: 커밋 메시지를 `-m` 플래그로 명시적으로 전달합니다. 예: `git commit -m "커밋 메시지"`.

### 9.3. 동적 콘텐츠 카운터 불일치 문제 (해결됨)
이전에는 필터링 후 모바일 뷰의 플로팅 카운터 및 섹션 헤더의 총 프로젝트 개수가 올바르게 업데이트되지 않는 문제가 있었습니다.
- **해결**: `ProjectList.ts`에서 `updateSectionProjectCount()` 및 `setupFloatingCounterScrollTriggers()` 메서드를 구현하여, 필터링 시 현재 보이는 카드들의 개수와 순번에 맞춰 카운터를 동적으로 업데이트하도록 수정되었습니다.

### 9.4. 브라우저별 글래스모피즘(Glassmorphism) 렌더링 불일치 (해결됨)
- **문제**: 크롬에서는 정상인 유리 효과가 엣지, iOS, 카카오톡 브라우저 등에서 검게(Dark) 혹은 탁하게 렌더링되는 현상 발생.
- **원인**: 특정 브라우저(특히 WebKit 계열이나 엣지의 특정 버전)에서 `backdrop-filter` 적용 시 배경의 Alpha 값이 너무 낮으면 렌더링 엔진 내부에서 검은색 잔상이 섞여 나오거나, 시스템의 다크모드 설정을 강제로 추종하려는 경향이 확인됨.
- **해결**: 브라우저/OS별 복잡한 분기 처리를 지양하고, 전역적으로 `background: rgba(255, 255, 255, 0.4) !important;`와 충분한 블러 값(`20px`)을 강제 적용하여 모든 환경에서 동일하고 밝은 '화이트 글래스' 효과를 보장하도록 수정.

---

## 10. 최근 업데이트 요약

- **Git 저장소 초기화**: 손상된 Git 이력 문제를 해결하기 위해 저장소를 새로 초기화하고 원격에 강제 푸시.
- **비디오 에셋 외부 관리**: 대용량 비디오 파일을 Cloudflare R2에 업로드하여 Git 저장소 크기를 줄이고 CDN을 통한 로딩 최적화. `works.json`에 R2 URL 및 `video_width`, `video_height` 추가하여 레이아웃 쉬프트 방지.
- **ESLint 및 Prettier 도입**: 코드 품질 및 일관된 포맷팅을 위해 ESLint (v9 Flat Config) 및 Prettier 설정 도입 및 코드베이스에 적용.
- **Open Graph 메타 태그 추가**: `index.html`에 `og:title`, `og:type`, `og:url`, `og:image`, `og:description`, `og:site_name` 등 포괄적인 Open Graph 메타 태그 추가.
- **SEO 기본 메타 태그 강화**: `index.html`에 `description` 및 `keywords` 메타 태그를 상세화하여 검색 엔진 가시성 개선.
- **검색 엔진 연동**: `index.html`에 Google Analytics 스크립트 및 Naver Site Verification 메타 태그 추가. `public` 디렉토리에 `sitemap.xml` 및 `robots.txt` 파일 추가.
- **모바일 필터 호버 문제 해결**: `src/style.css` 및 `src/components/ProjectList.ts` 수정으로 모바일 터치 환경에서 필터 칩의 호버 효과가 고정되는 문제 해결.
- **동적 카운터 불일치 문제 해결**: 필터링 후 프로젝트 개수 카운터 및 섹션 헤더의 총 개수가 올바르게 표시되지 않던 문제 해결.
- **Hero 섹션 고도화**: 정적 이미지 배경을 WebGL 기반 유체 시뮬레이션(`FluidBackground.ts`)으로 교체하여 인터랙티브한 사용자 경험 제공. (Three.js 활용)
- **자산 관리 개선**: 미사용 에셋을 `_assets_backup` 루트 디렉토리로 이동하여 배포 패키지 용량 최적화.
- **필터 로직 개선**: "Select Mode + ALL" 방식으로 전환. 마지막 클릭 카테고리 우선 표시 (배열 기반 정렬).
- **스크롤 모션 블러**: 필터 오토 스크롤 시 SVG feGaussianBlur 기반 세로 모션 블러 적용.
- **유체 효과 반응형**: 모바일에서 붓 크기(splat radius) 축소 및 터치 이벤트 제거. **자이로스코프** 전용 인터랙션 구현 (움직임 거리 2배 등 튜닝).
- **줄바꿈 통일**: `.gitattributes` 추가로 LF 강제, CRLF 린트 에러 해결.
- **모바일 UI/UX 개선**: 스크롤바 완전 숨김 (`scrollbar-width: none`), `html`/`body`에 `width: 100%` 및 `overflow-x: hidden` 강제 적용으로 모바일 크롬 우측 여백 문제 해결.
- **글래스모피즘 호환성 개선**: 엣지, iOS 등에서 필터 바가 어둡게 보이는 렌더링 버그 해결을 위해 전역 스타일 강제화 및 투명도 최적화 적용.

---

## 11. 디자인 및 구현 상세 가이드라인 (Preferences)

다음은 프로젝트의 디자인 철학 및 특정 기능에 대한 세부 구현 원칙입니다.

### 11.1. 디자인 및 인터랙션 취향
- **고급스러운 유체 효과 선호:** Hero 섹션 등 주요 비주얼에 WebGL 기반의 유체 시뮬레이션(Fluid/Smoke) 또는 파티클 효과를 선호함 (Three.js 활용).
- **섬세한 표현:** 굵고 투박한 잉크보다는 **가늘고 섬세한 붓 터치** 느낌의 인터랙션을 지향함. (예: 시뮬레이션 해상도 High, Radius Low)
- **Time-based HSL 순환:** 단색보다는 시간 흐름에 따라 색상이 은은하게 변하는(Hue Cycle) 효과를 사용.
- **모바일 유체 인터랙션:**
    - 터치 드래그 이벤트는 제거(오동작 방지).
    - **자이로스코프 기울기**를 통한 반응형 인터랙션을 선호함 (민감도 0.1/강도 10/거리 20).
- **스크롤바 숨김:** 투명하거나 커스텀 디자인보다는 **완전히 숨김(Hidden)** 처리하여 배경색(검정/흰색)에 관계없이 깔끔한 UI를 지향함.

### 11.2. 자산 관리 및 백업 전략
- **배포 제외 백업:** 프로젝트에서 더 이상 사용하지 않지만 보관이 필요한 에셋(예: 교체된 이미지)은 `public` 폴더가 아닌 프로젝트 루트의 **`_assets_backup`** 폴더로 이동시켜 배포 패키지 용량을 최적화한다.

### 11.3. 필터 UI/UX 구현 방식
- **Select Mode + ALL 칩:** 필터는 "차감" 방식이 아닌 "선택" 방식.
    - 기본적으로 'ALL' 칩이 활성화됨.
    - 특정 카테고리 클릭 시 'ALL' 비활성화.
    - 모든 개별 선택 해제 시 다시 자동으로 'ALL' 활성화.
- **우선순위 정렬:** 선택된 카테고리 칩(Active)은 항상 리스트의 맨 앞(왼쪽)으로 이동하여 표시됨 (배열 `unshift` 로직 사용).
    - 필터 클릭으로 인한 **자동 스크롤(Auto-Scroll) 시에만** 카드 목록(`.project-grid-3col`)에 SVG feGaussianBlur 효과 적용 (Lenis velocity 기반).

### 11.4. 에셋 제작 가이드라인
- **프로젝트 썸네일 이미지:**
    - **권장 비율: 1.8 : 1** (가로 : 세로) - CSS `aspect-ratio: 1.8` 기준.
    - **권장 해상도:** 예) 1800px × 1000px, 900px × 500px 등.
    - **이유:** 다양한 비율의 이미지를 수용하되, 가로 잘림(좌우)을 방지하여 원본을 최대한 보여주기 위함. (세로가 긴 이미지는 상하가 크롭(Center Crop)됨).
    - **포맷:** `WebP`, `PNG`, `JPG` (용량 최적화 필수).