# DSENSE 프로젝트 아키텍처 문서

이 문서는 DSENSE 디지털 에이전시 웹사이트(`dsense`)의 아키텍처, 디렉토리 구조, 주요 컴포넌트, 그리고 데이터 흐름을 설명합니다.

## 1. 프로젝트 개요
DSENSE는 Vanilla TypeScript와 Vite를 기반으로 구축된 단일 페이지(또는 스크롤 기반) 웹사이트입니다. 고성능 애니메이션을 위해 GSAP(GreenSock Animation Platform)를 적극적으로 사용하며, 부드러운 스크롤 경험을 위해 Lenis를 도입했습니다.

### 주요 기술 스택
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Vanilla CSS (`src/style.css`)
- **Animation**: GSAP (ScrollTrigger 포함)
- **Scrolling**: @studio-freight/lenis
- **Package Manager**: npm

---

## 2. 디렉토리 구조

```
d:/dsense/
├── index.html              # 엔트리 포인트 HTML
├── package.json            # 의존성 및 스크립트 정의
├── tsconfig.json           # TypeScript 설정
├── vite.config.ts          # Vite 설정
├── public/                 # 정적 리소스 (이미지, 파비콘 등)
│   ├── images/             # 프로젝트 썸네일 이미지 및 에셋
│   └── ...
└── src/
    ├── main.ts             # 애플리케이션 진입점 (컴포넌트 초기화)
    ├── style.css           # 전역 스타일 시트
    ├── types.ts            # 공통 데이터 타입 정의 인터페이스
    ├── components/         # UI 컴포넌트 (클래스 기반)
    │   ├── Header.ts
    │   ├── Hero.ts
    │   ├── About.ts
    │   ├── Thinking.ts
    │   ├── ProjectList.ts
    │   ├── ProjectCard.ts
    │   ├── Contact.ts
    │   └── Cursor.ts
    └── data/
        ├── works.json      # 포트폴리오 프로젝트 데이터 (JSON)
        └── ...
```

---

## 3. 아키텍처 상세

### 3.1. 진입점 (Entry Point: `src/main.ts`)
- `index.html`은 `src/main.ts` 모듈을 로드합니다.
- `main.ts`는 다음 역할을 수행합니다:
  - 전역 스타일(`style.css`) 로드
  - GSAP 플러그인 등록
  - Lenis(스무스 스크롤) 인스턴스 초기화 및 RAF(Request Animation Frame) 루프 설정
  - DOM의 `#app` 요소 내부에 주요 섹션 컨테이너들(`<header>`, `<main>`, `<section>`)을 동적으로 생성
  - 각 섹션에 해당하는 컴포넌트 클래스를 `new` 키워드로 인스턴스화

### 3.2. 컴포넌트 패턴 (Class-based Components)
모든 주요 섹션(`About`, `Hero` 등)은 유사한 클래스 구조를 따릅니다.
- **Constructor**: 타겟 컨테이너의 ID를 받아 해당 DOM 요소를 찾습니다.
- **`render()`**: HTML 문자열(Template Literal)을 생성하여 `container.innerHTML`에 주입합니다.
- **`initAnimations()`**: DOM 요소가 생성된 후, `gsap.timeline()` 또는 `ScrollTrigger`를 사용하여 애니메이션을 설정합니다.

### 3.3. 데이터 흐름
- **데이터 소스**: `src/data/works.json` 파일이 원본 데이터 역할을 합니다.
- **타입 정의**: `src/types.ts` 파일에 `WorkItem` 인터페이스가 정의되어 있어 데이터의 형태를 보장합니다.
- **렌더링**: `ProjectList.ts` 컴포넌트가 JSON 데이터를 import하고, `ProjectCard.ts` 헬퍼 함수를 사용하여 리스트를 렌더링합니다.
- *참고: 최근 변경으로 `works.json`에 `thumbnail` 필드가 추가되었습니다.*

---

## 4. 스타일링 전략
- 별도의 CSS 프레임워크(Tailwind 등) 없이 `src/style.css` 하나로 관리됩니다.
- **BEM(Block Element Modifier)** 네이밍 컨벤션과 유틸리티 클래스(Utility Classes)가 혼용되어 있습니다.
- 반응형 디자인은 `@media (min-width: ...)` 쿼리를 사용하여 구현됩니다.

## 5. 애니메이션 전략
- **GSAP ScrollTrigger**: 스크롤 위치에 따라 요소가 등장하거나 변하는 인터랙션을 제어합니다.
- **Text Reveal**: 텍스트를 한 글자(`char`) 또는 단어(`word`) 단위로 쪼개어(`split`) 순차적으로 등장시키는 기법이 공통적으로 사용됩니다.
- **Parallax**: `ProjectList` 및 `Thinking` 섹션 등에서 스크롤 속도(`data-scroll-speed`)를 다르게 주어 깊이감을 연출합니다.

## 6. 유지보수 가이드
- **프로젝트 추가**: `src/data/works.json`에 새 항목을 추가하고, `public/images/` 폴더에 해당 `no`와 일치하는 이미지(예: `024.png`)를 추가하면 자동으로 리스트에 반영됩니다.
- **섹션 추가**: `src/components/`에 새 클래스 파일을 만들고, `src/main.ts`에서 해당 컴포넌트를 import 및 초기화합니다.
- **타입 수정**: 데이터 구조 변경 시 반드시 `src/types.ts`의 인터페이스도 함께 수정해야 합니다.
