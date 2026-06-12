# 프로토타입 템플릿

## 이 프로젝트는

서비스 기능의 플로우를 빠르게 확인하기 위한 인터랙티브 프로토타입이다.
디자인 완성도가 아니라 흐름과 인터랙션 확인이 목적이다.

---

## 기술 스택

- **프레임워크**: React + Vite
- **언어**: JavaScript
- **스타일링**: Tailwind CSS + CSS 변수 (tokens.css)
- **폰트**: Pretendard (src/styles/fonts.css에서 CDN 로드)
- **배포**: Vercel

---

## 핵심 원칙

- 속도 우선. 빠르게 만들고, 써보고, 수정한다.
- 피그마 와이어프레임의 구조와 플로우를 정확히 따른다.
- 비주얼은 단순하게. 플로우가 돌아가면 된다.
- 없는 UI는 그 자리에서 바로 만든다.
- 외부 패키지는 최소화한다. 꼭 필요한 것만 설치한다.

---

## 프로토타입 작업

- 요청(제작, 수정, 페이지 추가 등)을 받으면 먼저 요청 내용을 분석한다.
- 빠지거나 불명확하거나 오류가 있으면 질문 리스트를 한번에 출력한다.
- 모든 답변을 받은 후 작업을 시작한다. 문제없으면 바로 작업.

---

## 디자인

- 색상은 반드시 `src/styles/tokens.css`의 CSS 변수를 사용한다. (`var(--color-primary-600)`)
- tokens.css에 없는 값은 하드코딩한다.
- tokens.css에 새로운 토큰을 임의로 추가하지 않는다.
- 컴포넌트 수정 과정에서 tokens.css는 절대 건들지 않는다.
- 폰트는 Pretendard만 사용한다.
- 모바일 화면 좌우 패딩은 16px 고정.
- 모바일 기준 너비: 375px
- 모바일 기준 높이: 812px (iPhone X/11/12/13 기준)
- OS: iOS 기반
- Safe Area 상단 44px (status bar), 하단 34px (home indicator) 반드시 대응
- 스크롤은 momentum scroll 적용 (-webkit-overflow-scrolling: touch)
- 탭바, 내비게이션바 등 시스템 UI 높이 기준도 iOS 기준으로 적용

---

## 컴포넌트

- `src/components/`에 있는 공용 컴포넌트는 재활용한다.
- `src/components/`에 새로운 컴포넌트를 임의로 추가하지 않는다.
- 컴포넌트는 외부에서 완성된 것을 가져다 넣는다. 여기서 직접 만들지 않는다.
- 없는 UI는 화면 코드 안에서 직접 만든다.

---

## 피그마

- 피그마 URL을 주면 `get_design_context`로 구조를 파악하고 플로우를 구현한다.
- `get_design_context`가 반환한 코드는 참고만 한다. 그대로 쓰지 않는다.
- 구조와 플로우만 파악하고, 코드는 직접 간단하게 작성한다.

---

## 서비스 컨텍스트

- 프로젝트마다 서비스 개요 md 파일을 수동으로 추가한다.
- 파일이 있으면 반드시 읽고 서비스 도메인 용어와 구조를 파악한 후 작업한다.

---

## 파일 구조

```
src/
├── components/   ← 완성된 공용 컴포넌트 (직접 만들지 않음)
├── pages/
│   ├── v1/       ← 버전별 프로토타입
│   └── v2/
└── styles/
    ├── fonts.css  ← Pretendard CDN
    ├── index.css  ← @import fonts.css, tokens.css
    └── tokens.css ← 색상/타이포 CSS 변수
```

---

## 배포 및 공유

"배포해줘" 명령 시 아래 순서로 실행:

1. `git add .`
2. `git commit -m "update"`
3. `git push`
4. 완료 후 아래 링크 표시:
   - GitHub: 현재 프로젝트의 GitHub 레포 URL
   - 팀원 공유:
     - (Vercel URL)/v1
     - (Vercel URL)/v2
     - (존재하는 버전만 표시)
