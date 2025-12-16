# DSENSE Project Knowledge Base (Detailed Raw Data) V1.1
> **문서 개요:** 총 14개 프로젝트의 비즈니스 목표, 기술적 이슈 해결, 핵심 성과를 정리한 데이터베이스입니다. 제안서(Proposal) 및 PRD 작성 시 '기술적 근거 자료'로 활용하십시오.

---

## 1. Edwards Quiz Promotion (의료기기 퀴즈 프로모션)
### 📄 기본 정보 (General Info)
* **프로젝트명:** Edwards Lifesciences 의료진 대상 게이미피케이션 퀴즈 플랫폼
* **고객사:** Edwards Lifesciences
* **형태:** Responsive Web (Mobile-First)
* **주요 스택:** PHP, MySQL, JavaScript (Session Management)

### ⚙️ 기술적 구현 상세 (Technical Implementation)
* **이어풀기(Resume) 로직:** 퀴즈 도중 이탈 시 세션(Session) 및 DB에 진행 단계(State)를 실시간 저장하여 재접속 시 이어풀기 기능 제공.
* **접근 제어(Auth):** 폐쇄형 프로모션을 위해 비밀번호 기반의 간편 인증 게이트(Gate) 페이지 구현.
* **관리자(Admin) 기능:** 참여자 리스트, 정답률 통계, 개인정보 수집 동의 내역 관리 기능 탑재.

### 📝 제안서 활용 문구 (Proposal Snippets)
* **참여율 증대 전략:** "당사는 Edwards사 프로젝트에서 **'OX 퀴즈 및 객관식 인터랙션'**을 도입하여 전문 지식을 흥미롭게 전달하고, 학습 완료율을 획기적으로 높인 경험이 있습니다."
* **데이터 무결성:** "네트워크 불안정으로 인한 이탈을 방지하기 위해 **'실시간 진행 상태 저장(Auto-Save)'** 기술을 적용하여 사용자 경험을 보호합니다."

---

## 2. DORCO Global Promotion (도루코 글로벌 프로모션)
### 📄 기본 정보
* **프로젝트명:** 도루코 글로벌 5개국어 지원 샘플링 프로모션 사이트
* **고객사:** DORCO
* **형태:** Global Responsive Web
* **주요 스택:** HTML5, CSS3, i18n Logic, PHP, DB Transaction Control

### ⚙️ 기술적 구현 상세 (Technical Implementation)
* **다국어(i18n) 아키텍처:** 한국어, 영어, 일본어, 태국어, 베트남어, 러시아어 등 5개 이상의 언어 팩을 적용하여, 동일한 레이아웃에서 텍스트 리소스만 교체되는 효율적 구조 설계.
* **선착순 자동 마감(Auto-Close):** DB 트랜잭션 카운팅을 통해 설정된 목표 인원 도달 시 신청 양식이 자동으로 비활성화(Disabled) 처리하여 초과 신청 방지.
* **글로벌 입력 폼:** 국가별 주소 체계 및 전화번호 포맷에 대응하는 유동적 Input Form 설계.

### 📝 제안서 활용 문구 (Proposal Snippets)
* **글로벌 확장성:** "당사는 도루코 프로젝트를 통해 **단일 소스로 5개국 이상을 대응하는 i18n 아키텍처**를 검증했습니다."
* **대용량 트래픽 대응:** "트래픽이 몰리는 선착순 이벤트의 경우, **DB 트랜잭션 카운팅을 통한 자동 마감 시스템**으로 안정성을 확보합니다."

---

## 3. Altum Partners (알툼 파트너스 기업 사이트)
### 📄 기본 정보
* **프로젝트명:** 알툼 파트너스 금융 컨설팅 기업 반응형 웹사이트
* **고객사:** Altum Partners
* **형태:** Corporate Responsive Web
* **주요 스택:** Responsive Grid System, CSS Animation

### ⚙️ 기술적 구현 상세 (Technical Implementation)
* **정보 구조화(IA):** '주요 산업 실적', '연혁', '구성원' 등 텍스트 위주의 정보를 모바일에서도 가독성 있게 보여주는 적응형 그리드(Adaptive Grid) 구현.
* **신뢰도 중심 UI:** 금융/컨설팅 업계 특성에 맞는 정제된 타이포그래피와 모션 인터랙션 최소화 전략으로 로딩 속도 및 가독성 최적화.

### 📝 제안서 활용 문구 (Proposal Snippets)
* **B2B 신뢰도 구축:** "알툼 파트너스 구축 사례와 같이, **데이터와 실적(Portfolio)을 가장 신뢰감 있게 보여주는 UI/UX 전략**을 제안합니다."
* **모바일 경험:** "복잡한 표나 연혁 데이터도 모바일에서 깨지지 않고 **자동으로 정렬되는 반응형 레이아웃**을 기본으로 적용합니다."

---

## 4. Dong-A ST (동아ST 물류 시스템)
### 📄 기본 정보
* **프로젝트명:** 동아제약 영업 지점 홍보물 대량 주문 및 재고 관리 시스템
* **고객사:** Dong-A ST
* **형태:** Logistics Web Solution (B2B)
* **주요 스택:** Board System, Data Grid, Bulk Processing Logic

### ⚙️ 기술적 구현 상세 (Technical Implementation)
* **대량 주문 UX:** 수십 종의 품목을 리스트에서 바로 수량 입력 후 '일괄 담기' 할 수 있는 B2B 전용 대량 발주 인터페이스 구현.
* **배송 스케줄링 로직:** "매주 화요일 발송 -> 수요일 도착"과 같은 정기 배송 비즈니스 로직을 시스템에 반영하여 배송 예정일 자동 산출.
* **카테고리 필터링:** 제품군(소화기, 순환기 등)에 따른 탭 분류 및 실시간 검색 기능.

### 📝 제안서 활용 문구 (Proposal Snippets)
* **업무 효율화:** "동아ST 사례처럼 **사용자에게 익숙한 쇼핑몰 UX**를 업무 시스템에 적용하여 교육 비용을 줄이고 발주 프로세스를 전산화합니다."
* **물류 가시성:** "지점별 주문 현황과 배송 상태를 **실시간 대시보드**로 제공하여 본사의 관리 투명성을 확보합니다."

---

## 5. Mr. Hyang (미스터향 웹사이트 & 주문)
### 📄 기본 정보
* **프로젝트명:** 미스터향 프리미엄 중식 도시락 브랜드 및 주문 연동 웹
* **고객사:** Mr. Hyang
* **형태:** Franchise Web, O2O Interface
* **주요 스택:** Responsive Web, CTA Optimization

### ⚙️ 기술적 구현 상세 (Technical Implementation)
* **전환 유도(CTA) 설계:** '전화 주문' 및 '온라인 주문' 버튼을 플로팅(Floating) 형태로 배치하여 주문 전환율 극대화.
* **가맹 관리 시스템:** 예비 창업자를 위한 '가맹 안내' 및 '상담 신청' 게시판을 구축하고 관리자 페이지에서 리드(Lead) 관리 기능 제공.
* **메뉴 시각화:** 고해상도 음식 이미지를 모바일 데이터 환경에 맞춰 최적화(Resizing/Lazy Loading)하여 로딩 속도 개선.

### 📝 제안서 활용 문구 (Proposal Snippets)
* **매출 연계:** "미스터향 사례와 같이 **방문자가 즉시 주문이나 문의로 이어질 수 있는 동선(User Flow)**을 설계합니다."
* **프랜차이즈 솔루션:** "본사의 브랜드 가치 전달과 가맹점 모집을 동시에 해결하는 **올인원 프랜차이즈 웹사이트**를 구축합니다."

---

## 6. Samsung Health (삼성 헬스 프로모션)
### 📄 기본 정보
* **프로젝트명:** 삼성 헬스 러닝 트래킹 기능 소개 글로벌 모바일 프로모션
* **고객사:** SAMSUNG Electronics
* **형태:** Mobile Web (Promotion)
* **주요 스택:** Mobile-First Design, Data Visualization (Charts)

### ⚙️ 기술적 구현 상세 (Technical Implementation)
* **데이터 시각화(Data Viz):** VO2 max, 수직 진폭 등 전문 헬스 데이터를 동적인 그래프와 게이지 UI로 구현.
* **Mobile-First 아키텍처:** 세로 스크롤 기반의 스토리텔링형 UI 구조 채택.
* **스텝 바이 스텝 가이드:** 'GPS 켜기'부터 '러닝 시작'까지의 앱 사용 흐름을 튜토리얼 UI로 구현.

### 📝 제안서 활용 문구 (Proposal Snippets)
* **전문 정보의 대중화:** "삼성 헬스 프로젝트 경험을 바탕으로, **난해한 데이터를 직관적인 인포그래픽으로 변환**하여 사용자 이해를 돕겠습니다."
* **모바일 최적화:** "데스크탑을 줄여놓은 모바일 웹이 아닌, **모바일 환경에 완벽하게 맞춰진 터치 친화적 인터페이스**를 제공합니다."

---

## 7. Samsung SmartThings (스마트싱스 TV 최적화)
### 📄 기본 정보
* **프로젝트명:** 삼성 스마트싱스 글로벌 프로모션 및 TV 웹 브라우저 최적화
* **고객사:** SAMSUNG Electronics
* **형태:** Cross-Platform Web (Mobile, PC, Smart TV)
* **주요 스택:** JS GIF Control, Memory Optimization, Google Analytics

### ⚙️ 기술적 구현 상세 (Technical Implementation)
* **TV 브라우저 렌더링 최적화:** 저사양/메모리 제한이 있는 스마트 TV 브라우저에서 GIF 재생 시 발생하는 렉(Lag) 현상 해결을 위해 **JavaScript로 GIF 재생 프레임과 시점을 제어하는 최적화 엔진** 적용.
* **IoT 시나리오 연출:** 06:00 AM ~ 07:00 PM 타임라인에 따라 가전제품이 작동하는 모습을 애니메이션으로 구현.
* **GA 데이터 분석:** 국가별, 기기별(TV/모바일) 접속 데이터를 분석하기 위한 구글 애널리틱스 연동.

### 📝 제안서 활용 문구 (Proposal Snippets)
* **고성능 웹 구현:** "하드웨어 성능이 낮은 키오스크나 TV 환경에서도 부드럽게 작동하는 **JS 기반 리소스 제어 기술**을 통해 안정성을 확보합니다."
* **사용자 경험 통일:** "PC부터 TV까지, 어떤 디바이스로 접속하더라도 **동일한 브랜드 경험(BX)**을 제공하는 크로스 플랫폼 웹을 구축합니다."

---

## 8. Edwards TAVI (의료진 전용 포털)
### 📄 기본 정보
* **프로젝트명:** 에드워즈 TAVI 의료진 전용 폐쇄형 정보 포털
* **고객사:** Edwards Lifesciences
* **형태:** Closed Membership Portal
* **주요 스택:** OAuth 2.0 (Medigate), AWS, WordPress, Google Maps API

### ⚙️ 기술적 구현 상세 (Technical Implementation)
* **OAuth 인증 연동:** 의사 커뮤니티 '메디게이트' API를 연동하여, 별도 가입 없이 의사 면허가 인증된 계정으로 로그인하는 SSO(Single Sign-On) 구현.
* **AWS 클라우드 인프라:** 대용량 임상 영상 및 문서를 안정적으로 서비스하기 위해 Amazon Web Service 기반의 확장성 있는 서버 구축.
* **위치 기반 서비스(LBS):** 사용자 위치 기반으로 가장 가까운 'TAVI 시술 센터(병원)'를 지도에 표시하고 안내하는 기능 개발.

### 📝 제안서 활용 문구 (Proposal Snippets)
* **보안 및 인증:** "특정 자격 소지자만 접근해야 하는 폐쇄형 플랫폼 구축 시, **외부 전문 플랫폼 OAuth 연동**을 통해 보안성과 편의성을 동시에 잡는 전략을 제안합니다."
* **클라우드 안정성:** "민감하고 방대한 데이터를 다루는 서비스일수록 **AWS 기반의 유연한 인프라 설계**가 필수적입니다."

---

## 9. Big Hit Entertainment (글로벌 오디션)
### 📄 기본 정보
* **프로젝트명:** 빅히트 뮤직 글로벌 오디션 접수 및 QR 자동 발급 시스템
* **고객사:** Big Hit Entertainment (HYBE)
* **형태:** React SPA, High-Traffic Web
* **주요 스택:** React.js, AWS Serverless, QR Code Generation Logic

### ⚙️ 기술적 구현 상세 (Technical Implementation)
* **QR 코드 자동 생성:** 지원자가 접수를 완료하는 즉시, 개인 식별 정보(ID, 이름 등)가 암호화된 QR 코드를 **React 클라이언트 단에서 생성 및 렌더링**하여 발급.
* **AWS 고가용성 아키텍처:** 전 세계 동시 접속자가 몰리는 시점에도 서버가 다운되지 않도록 **AWS Auto-Scaling 및 Serverless 아키텍처** 적용.
* **다국어 시스템:** 5개 언어 텍스트 리소스를 효율적으로 관리하여 실시간 언어 전환을 지원.

### 📝 제안서 활용 문구 (Proposal Snippets)
* **대규모 트래픽 처리:** "**React와 AWS를 결합한 고가용성 설계**로 서비스 중단 없는 운영을 보장하며, 오디션처럼 트래픽이 폭주하는 프로젝트 경험이 있습니다."
* **O2O 운영 효율화:** "**QR 코드 자동 발급 및 현장 리딩 시스템**을 도입하여, 오프라인 행사의 대기 줄을 없애고 운영 인건비를 절감합니다."

---

## 10. ICEAGE (아이스 에이지 브랜드 웹)
### 📄 기본 정보
* **프로젝트명:** 아이스 에이지 프리미엄 빙하수 국내 런칭 브랜드 웹사이트
* **고객사:** ICEAGE
* **형태:** Brand Storytelling Web
* **주요 스택:** Parallax Scrolling, PHP Board

### ⚙️ 기술적 구현 상세 (Technical Implementation)
* **패럴랙스 스크롤링(Parallax):** 스크롤 움직임에 따라 배경의 빙하 이미지와 텍스트가 시차를 두고 움직이는 효과를 적용하여 깊이감 있는 시각적 경험 제공.
* **B2B/B2C 문의 시스템:** 유통 제휴 및 고객 문의를 통합 접수받을 수 있는 게시판 시스템 및 관리자 알림 기능 구현.

### 📝 제안서 활용 문구 (Proposal Snippets)
* **브랜드 스토리텔링:** "**패럴랙스 스크롤링과 같은 인터랙티브 웹 기술**을 통해 브랜드의 이야기를 고객이 '경험'하게 만듭니다."

---

## 11. Pfizer R.E.D Campaign (화이자 R.E.D 캠페인)
### 📄 기본 정보
* **프로젝트명:** 화이자 신경병증성 통증(R.E.D) 캠페인 및 참여 관리 시스템
* **고객사:** Pfizer
* **형태:** Campaign Web & Admin
* **주요 스택:** Interactive Form, Survey Logic, Admin Data Management

### ⚙️ 기술적 구현 상세 (Technical Implementation)
* **참여 관리 시스템:** 패키지 신청, 설문 조사 참여, 뉴스레터 구독 데이터를 통합 관리하는 백엔드 어드민(Admin) 시스템 개발.
* **설문 로직:** 조건부 문항 이동(Skip Logic) 등이 포함된 인터랙티브 설문 조사 폼 구현.
* **멀티미디어 연동:** 'Listen to Pain' 캠페인 음원 및 영상을 웹 내에서 바로 재생할 수 있는 커스텀 플레이어 탑재.

### 📝 제안서 활용 문구 (Proposal Snippets)
* **데이터 기반 마케팅:** "이벤트 페이지와 **데이터 관리자 모드**를 통합 구축하여, 실시간으로 참여율을 모니터링하고 대응할 수 있도록 합니다."

---

## 12. Dining Manager (다이닝 매니저 솔루션)
### 📄 기본 정보
* **프로젝트명:** 다이닝 매니저 예약 관리 및 알림톡 연동 CRM 솔루션
* **고객사:** 자체 솔루션 (Own Service)
* **형태:** Hybrid App, SaaS
* **주요 스택:** Kakao Biz Message API, Gantt Chart UI, Native App (Android/iOS)

### ⚙️ 기술적 구현 상세 (Technical Implementation)
* **카카오 알림톡 연동:** 예약 생성/수정/취소 이벤트 발생 시 **카카오 API**를 호출하여 고객에게 알림톡을 실시간 자동 발송, 노쇼 방지.
* **간트 차트(Gantt Chart) UI:** 시간축과 테이블을 기준으로 예약 블록을 드래그 앤 드롭으로 관리하는 타임라인 개발.
* **SaaS 데이터 동기화:** 여러 디바이스에서 동시 접속해도 데이터가 실시간 동기화되는 클라우드 DB 설계.

### 📝 제안서 활용 문구 (Proposal Snippets)
* **자동화 솔루션:** "인력 의존도가 높은 예약/안내 업무를 **시스템 자동화(카카오 알림톡 연동)**로 전환하여 운영 효율을 극대화합니다."
* **직관적 UX:** "복잡한 예약 현황을 한눈에 파악할 수 있는 **타임라인 형태의 시각적 인터페이스**를 제공합니다."

---

## 13. IPSEN (입센 키오스크)
### 📄 기본 정보
* **프로젝트명:** 입센 학회 홍보용 터치 키오스크 및 디지털 방명록
* **고객사:** IPSEN
* **형태:** Kiosk Application (Standalone)
* **주요 스택:** Adobe AIR, Local DB (SQLite), Touch Event Handling

### ⚙️ 기술적 구현 상세 (Technical Implementation)
* **독립형(Standalone) 구동:** 인터넷 연결이 불안정한 전시장 환경을 고려하여 **Adobe AIR** 기반의 로컬 애플리케이션으로 개발.
* **디지털 방명록 (Local DB):** 키오스크 내 로컬 DB에 방문자 정보를 암호화하여 저장하고 추후 데이터 추출(Export) 기능 구현.
* **문서 뷰어 최적화:** 수백 페이지의 의학 가이드라인을 터치 제스처로 부드럽게 넘겨볼 수 있는 전용 뷰어 엔진 탑재.

### 📝 제안서 활용 문구 (Proposal Snippets)
* **오프라인 안정성:** "네트워크가 없는 환경에서도 완벽하게 작동하는 **독립형 소프트웨어 기술**을 보유하고 있습니다."
* **페이퍼리스(Paperless):** "무거운 인쇄물 대신 **디지털 키오스크** 하나로 모든 정보를 담아, 비용 절감과 방문자 데이터 수집을 동시에 실현합니다."

---

## 14. 네플업 (nPlaceUp) - 네이버 플레이스 분석 솔루션
### 📄 기본 정보 (General Info)
* **프로젝트명:** 네플업(nPlaceUp) 네이버 플레이스 초고속 데이터 분석 SaaS 솔루션
* **고객사:** 자체 솔루션 (Own Service)
* **형태:** SaaS Web (MCP 단계)
* **주요 스택:** **Node.js, Python, FastAPI**, WordPress CMS (Headless)

### ⚙️ 기술적 구현 상세 (Technical Implementation)
* **초고속 분석 엔진:** 경쟁사 대비 6배 이상 빠른 **10초 이내**의 분석 속도를 달성. **Python의 FastAPI**와 **Node.js**를 활용한 비동기/병렬 크롤링 아키텍처 구축.
* **마이크로 서비스:** 고성능 분석 로직(FastAPI)과 유연한 콘텐츠 관리(Headless WordPress)를 분리하여 서비스 확장성 및 안정성 확보.
* **데이터 추출:** 네이버 플레이스의 수십 개 핵심 랭킹 요소를 통으로 크롤링(Crawling)하여 데이터 기반의 '플레이스 지수' 산출.

### 📝 제안서 활용 문구 (Proposal Snippets)
* **경쟁 우위 확보:** "분석에 1분 이상 걸리는 기존 시장의 한계를 뛰어넘어, **10초 이내**에 상위 노출 전략을 제시하는 **초고속 데이터 처리 기술**을 보유하고 있습니다."

---

## 15. DSENSE Official Website (디센스 공식 웹사이트)
### 📄 기본 정보 (General Info)
* **프로젝트명:** DSENSE 크리에이티브 그룹 공식 포트폴리오 웹사이트
* **고객사:** DSENSE (Self-Branding)
* **형태:** Interactive Web Portfolio
* **주요 스택:** **Vanilla TypeScript, Three.js (WebGL), GSAP, Lenis**

### ⚙️ 기술적 구현 상세 (Technical Implementation)
* **Fluid WebGL 배경:** Three.js와 GLSL 쉐이더를 활용하여 마우스 움직임과 모바일 자이로스코프(기울기)에 반응하는 **실시간 유체 시뮬레이션(Fluid Simulation)** 배경 구현.
* **고성능 인터랙션 최적화:** `IntersectionObserver`를 활용하여 화면 밖의 캔버스 렌더링을 일시 중지(Pause)하고, 모바일 환경에서는 호버 이펙트를 자동 제어하여 배터리 소모와 발열을 최소화.
* **모듈형 아키텍처:** Vanilla TypeScript 환경에서도 컴포넌트 기반 개발이 가능하도록 클래스 단위로 UI를 모듈화하고, CSS 또한 기능별로 분리하여 유지보수성 극대화.

### 📝 제안서 활용 문구 (Proposal Snippets)
* **최신 웹 기술:** "**WebGL과 GLSL 쉐이더**를 활용한 압도적인 시각 경험을 제공하며, 이를 웹 표준 기술(TypeScript)로 가볍고 빠르게 구현합니다."
* **인터랙티브 경험:** "단순한 정보 전달을 넘어, 사용자의 움직임에 반응하는 **몰입형 인터랙션(Immersive Interaction)**을 통해 브랜드 이미지를 각인시킵니다."
* **사용자 중심 UX 설계:** "다양한 포트폴리오를 직관적으로 탐색할 수 있도록 **다중 필터링 시스템(Multi-Filtering System)**을 도입하여, 사용자가 원하는 정보를 빠르고 정확하게 찾을 수 있는 최적의 경험을 제공합니다."
