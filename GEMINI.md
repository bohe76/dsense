# DSENSE 프로젝트 문서

## 프로젝트 개요

`dsense`는 TypeScript, Vite, GSAP 및 Three.js로 구축된 최신 단일 페이지 웹 애플리케이션입니다. 애니메이션, 3D 요소, 부드럽고 인터랙티브한 사용자 경험에 중점을 둔 디지털 에이전시 또는 포트폴리오 웹사이트로 보입니다. 이 프로젝트는 웹사이트의 여러 섹션이 개별 구성 요소로 캡슐화된 모듈식 단일 페이지 애플리케이션으로 구성됩니다.

## 사용된 기술

*   **빌드 도구:** Vite
*   **언어:** TypeScript
*   **애니메이션:** GSAP (GreenSock Animation Platform), Three.js
*   **스크롤:** Lenis (부드러운 스크롤)

## 빌드 및 실행

### 개발

개발 환경에서 프로젝트를 실행하려면 다음 명령을 사용하십시오. `http://localhost:3000`에서 개발 서버가 시작됩니다.

```bash
npm run dev
```

#### 백그라운드 실행

**중요:** 개발 서버는 다음 명령어를 사용하여 반드시 백그라운드에서 실행해야 합니다. 그렇지 않으면 CLI가 다른 명령을 처리할 수 없습니다.

```powershell
Start-Process cmd -ArgumentList "/c", "npm run dev" -NoNewWindow
```

### 빌드

프로덕션을 위해 프로젝트를 빌드하려면 다음 명령을 사용하십시오. 출력물은 `dist` 디렉토리에 배치됩니다.

```bash
npm run build
```

### 미리보기

프로덕션 빌드를 미리 보려면 다음 명령을 사용하십시오.

```bash
npm run preview
```

**참고: PowerShell 실행 정책**

만약 PowerShell에서 `npm` 스크립트 실행 시 권한 오류가 발생하면, 다음 명령어를 사용하여 `cmd`로 스크립트를 실행할 수 있습니다.

*   **개발 서버 실행:** `cmd /c "npm run dev"`
*   **패키지 설치:** `cmd /c "npm install"`

또는 다음 명령어로 현재 PowerShell 세션의 실행 정책을 변경할 수 있습니다.

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
```

## 프로젝트 구조

*   `index.html`: 애플리케이션의 기본 진입점입니다.
*   `src/main.ts`: 애플리케이션 및 해당 구성 요소를 초기화하는 기본 TypeScript 파일입니다.
*   `src/components/`: `Header`, `Hero`, `About` 등과 같이 웹사이트를 구성하는 개별 구성 요소가 포함되어 있습니다.
*   `public/`: 이미지 및 비디오와 같은 정적 자산이 포함되어 있습니다.
*   `vite.config.ts`: Vite의 구성 파일입니다.

## 개발 규칙

*   이 프로젝트는 모듈식 아키텍처를 사용하며 웹사이트의 각 섹션은 별도의 구성 요소로 구현됩니다.
*   애니메이션에는 GSAP가 사용되고 부드러운 스크롤에는 `lenis`가 사용됩니다.
*   이 프로젝트는 TypeScript로 작성되었으므로 유형 안전성과 코드 품질에 중점을 둡니다.

## 도구 사용 가이드라인

다음 지침은 에이전트와의 원활한 상호작용을 위해 중요합니다.

### Git 명령어 사용 원칙

*   **명시적 지시 필수:** 에이전트는 사용자님의 **명시적인 커밋 또는 푸시 지시 없이는 어떠한 Git 커밋이나 푸시 작업도 진행하지 않습니다.**
*   **커밋 메시지:** `git commit` 명령어 사용 시, 인터랙티브 편집기(`Vim` 등)가 실행되는 것을 방지하기 위해 `-m` 플래그로 커밋 메시지를 항상 명시적으로 전달해야 합니다. 예: `git commit -m "커밋 메시지"`
*   **브랜치 관리:** 브랜치 생성, 전환, 삭제 등 모든 브랜치 관련 작업은 사용자님의 명시적인 지시 후에만 수행됩니다.

### Shell 명령어 (run_shell_command) 사용 원칙

*   **명령어 연결 (`&&`):** `run_shell_command`는 `&&`와 같은 셸 명령어 연결자를 완벽하게 지원하지 않을 수 있습니다. 여러 명령어를 실행해야 할 경우, 각 명령어를 개별적으로 실행하는 것을 권장합니다.
*   **npm 스크립트 실행 (Windows PowerShell):** PowerShell 환경에서 `npm` 스크립트 실행 시 권한 오류가 발생할 수 있습니다. 이를 피하기 위해 `cmd /c "npm [스크립트명]"` 형식으로 명령어를 실행하는 것을 권장합니다. 예: `cmd /c "npm run dev"`

