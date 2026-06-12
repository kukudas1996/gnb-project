# prototype-template

피그마 와이어프레임을 빠르게 인터랙티브 프로토타입으로 만들고 팀에 공유하기 위한 템플릿.

---

## 기술 스택

- React + Vite
- Tailwind CSS
- Pretendard 폰트
- Vercel 배포

---

## 시작하기

```bash
# 1. Use this template → 새 레포 생성
# 2. 로컬에 클론 후

npm install

# 3. 서비스 컨텍스트 md 추가 (선택)
# 프로젝트 루트에 서비스 개요 md 파일을 직접 추가한다.
# 예: bankcow-investment.md, bankcow-shopping.md 등

# 4. Claude Code 실행
claude

# 5. 피그마 URL 전달 후 작업 시작
```

---

## 폴더 구조

```
src/
├── components/   ← 완성된 공용 컴포넌트 (직접 만들지 않음)
├── pages/
│   ├── v1/       ← 버전별 프로토타입
│   └── v2/
└── styles/
    ├── fonts.css  ← Pretendard CDN
    ├── index.css
    └── tokens.css ← 색상/타이포 CSS 변수
```

---

## 배포 및 공유

Claude Code에 "배포해줘" 라고 입력하면 자동으로 처리된다.

```
git add . → git commit → git push → Vercel 자동 배포
```

배포 후 공유 링크:
- 모바일: `(Vercel URL)/v1`
- 웹: `(Vercel URL)/v2`

---

## 규칙

- `CLAUDE.md` 참고
