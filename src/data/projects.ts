export interface Project {
    id: number;
    title: string;
    client: string;
    type: string;
    stack: string[];
    desc: string;
    features: string[];
    proposalPoints: string[];
}

export const projects: Project[] = [
    {
        id: 1,
        title: "Edwards Quiz Promotion",
        client: "Edwards Lifesciences",
        type: "Responsive Web (Mobile-First)",
        stack: ["PHP", "MySQL", "JavaScript"],
        desc: "의료진 대상 게이미피케이션 퀴즈 플랫폼. 이어풀기 및 실시간 저장 기능 탑재.",
        features: ["이어풀기(Resume) 로직", "접근 제어(Auth)", "관리자(Admin) 기능"],
        proposalPoints: ["참여율 증대 전략", "데이터 무결성"]
    },
    {
        id: 2,
        title: "DORCO Global Promotion",
        client: "DORCO",
        type: "Global Responsive Web",
        stack: ["HTML5", "CSS3", "i18n Logic", "PHP"],
        desc: "도루코 글로벌 5개국어 지원 샘플링 프로모션 사이트. i18n 아키텍처 적용.",
        features: ["다국어(i18n) 아키텍처", "선착순 자동 마감(Auto-Close)", "글로벌 입력 폼"],
        proposalPoints: ["글로벌 확장성", "대용량 트래픽 대응"]
    },
    {
        id: 3,
        title: "Altum Partners",
        client: "Altum Partners",
        type: "Corporate Responsive Web",
        stack: ["Responsive Grid System", "CSS Animation"],
        desc: "금융 컨설팅 기업 반응형 웹사이트. 신뢰도 중심의 정제된 UI.",
        features: ["정보 구조화(IA)", "신뢰도 중심 UI"],
        proposalPoints: ["B2B 신뢰도 구축", "모바일 경험"]
    },
    {
        id: 4,
        title: "Dong-A ST Logistics",
        client: "Dong-A ST",
        type: "Logistics Web Solution (B2B)",
        stack: ["Board System", "Data Grid", "Bulk Processing"],
        desc: "동아제약 영업 지점 홍보물 대량 주문 및 재고 관리 시스템.",
        features: ["대량 주문 UX", "배송 스케줄링 로직", "카테고리 필터링"],
        proposalPoints: ["업무 효율화", "물류 가시성"]
    },
    {
        id: 5,
        title: "Mr. Hyang",
        client: "Mr. Hyang",
        type: "Franchise Web, O2O Interface",
        stack: ["Responsive Web", "CTA Optimization"],
        desc: "프리미엄 중식 도시락 브랜드 및 주문 연동 웹. 가맹 관리 시스템 포함.",
        features: ["전환 유도(CTA) 설계", "가맹 관리 시스템", "메뉴 시각화"],
        proposalPoints: ["매출 연계", "프랜차이즈 솔루션"]
    },
    {
        id: 6,
        title: "Samsung Health Run",
        client: "SAMSUNG Electronics",
        type: "Mobile Web (Promotion)",
        stack: ["Mobile-First Design", "Data Visualization"],
        desc: "러닝 트래킹 기능 소개 글로벌 모바일 프로모션. 헬스 데이터 시각화.",
        features: ["데이터 시각화(VO2 max 등)", "Mobile-First 아키텍처", "스텝 바이 스텝 가이드"],
        proposalPoints: ["전문 정보의 대중화", "모바일 최적화"]
    },
    {
        id: 7,
        title: "Samsung SmartThings",
        client: "SAMSUNG Electronics",
        type: "Cross-Platform Web",
        stack: ["JS GIF Control", "Memory Optimization"],
        desc: "스마트싱스 글로벌 프로모션. TV 웹 브라우저 및 저사양 기기 최적화.",
        features: ["TV 브라우저 렌더링 최적화", "IoT 시나리오 연출", "GA 데이터 분석"],
        proposalPoints: ["고성능 웹 구현", "사용자 경험 통일"]
    },
    {
        id: 8,
        title: "Edwards TAVI Portal",
        client: "Edwards Lifesciences",
        type: "Closed Membership Portal",
        stack: ["OAuth 2.0", "AWS", "Google Maps API"],
        desc: "의료진 전용 폐쇄형 정보 포털. 메디게이트 연동 SSO 로그인.",
        features: ["OAuth 인증 연동", "AWS 클라우드 인프라", "위치 기반 서비스(LBS)"],
        proposalPoints: ["보안 및 인증", "클라우드 안정성"]
    },
    {
        id: 9,
        title: "Big Hit Global Audition",
        client: "Big Hit Entertainment",
        type: "React SPA, High-Traffic Web",
        stack: ["React.js", "AWS Serverless", "QR Code"],
        desc: "글로벌 오디션 접수 및 QR 자동 발급 시스템. 대규모 트래픽 대응.",
        features: ["QR 코드 자동 생성", "AWS 고가용성 아키텍처", "다국어 시스템"],
        proposalPoints: ["대규모 트래픽 처리", "O2O 운영 효율화"]
    },
    {
        id: 10,
        title: "ICEAGE Brand Web",
        client: "ICEAGE",
        type: "Brand Storytelling Web",
        stack: ["Parallax Scrolling", "PHP Board"],
        desc: "프리미엄 빙하수 브랜드 웹. 패럴랙스 스크롤링 적용.",
        features: ["패럴랙스 스크롤링", "B2B/B2C 문의 시스템"],
        proposalPoints: ["브랜드 스토리텔링"]
    },
    {
        id: 11,
        title: "Pfizer R.E.D Campaign",
        client: "Pfizer",
        type: "Campaign Web & Admin",
        stack: ["Interactive Form", "Survey Logic"],
        desc: "신경병증성 통증 캠페인 및 참여 관리 시스템. 설문 로직 및 미디어 플레이어.",
        features: ["참여 관리 시스템", "설문 로직", "멀티미디어 연동"],
        proposalPoints: ["데이터 기반 마케팅"]
    },
    {
        id: 12,
        title: "Dining Manager",
        client: "Own Service",
        type: "Hybrid App, SaaS",
        stack: ["Kakao Biz Message", "Gantt Chart UI"],
        desc: "예약 관리 및 알림톡 연동 CRM 솔루션. 간트 차트 UI 적용.",
        features: ["카카오 알림톡 연동", "간트 차트 UI", "SaaS 데이터 동기화"],
        proposalPoints: ["자동화 솔루션", "직관적 UX"]
    },
    {
        id: 13,
        title: "IPSEN Kiosk",
        client: "IPSEN",
        type: "Kiosk Application",
        stack: ["Adobe AIR", "Local DB (SQLite)"],
        desc: "학회 홍보용 터치 키오스크 및 디지털 방명록. 오프라인 독립 구동.",
        features: ["독립형 구동", "디지털 방명록", "문서 뷰어 최적화"],
        proposalPoints: ["오프라인 안정성", "페이퍼리스"]
    },
    {
        id: 14,
        title: "nPlaceUp (네플업)",
        client: "Own Service",
        type: "SaaS Web",
        stack: ["Node.js", "Python", "FastAPI"],
        desc: "네이버 플레이스 초고속 데이터 분석 SaaS 솔루션. 10초 내 분석.",
        features: ["초고속 분석 엔진", "마이크로 서비스", "데이터 추출"],
        proposalPoints: ["경쟁 우위 확보", "유연한 시스템"]
    }
];
