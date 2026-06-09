# 대교홀딩스 인사·복리후생 안내 사이트

VitePress 기반 마크다운 사이트입니다. 인사팀이 마크다운 파일만 편집하면 사이트가 자동으로 업데이트됩니다.

## 사이트 구조

```
daekyo-handbook/
├── docs/
│   ├── .vitepress/
│   │   └── config.mts      ← 메뉴, 사이드바, 검색 설정
│   ├── index.md            ← 메인 홈 페이지 (카드형 인덱스)
│   ├── hr/                 ← 인사 제도
│   │   ├── index.md
│   │   ├── recruitment.md
│   │   ├── evaluation.md
│   │   └── promotion.md
│   ├── welfare/            ← 복리후생
│   │   ├── index.md
│   │   ├── leave.md
│   │   ├── condolence.md
│   │   └── medical.md
│   ├── notices/            ← 공지사항
│   │   └── index.md
│   └── faq/                ← 자주 묻는 질문
│       └── index.md
├── package.json
├── netlify.toml            ← Netlify 배포 설정
└── README.md
```

---

## 1. 처음 시작하기

### 사전 준비
- [Node.js 20 이상](https://nodejs.org) 설치
- [Git](https://git-scm.com) 설치
- [GitHub](https://github.com) 계정
- [Netlify](https://www.netlify.com) 계정 (무료)

### 설치
```bash
# 의존성 설치
npm install

# 로컬 미리보기 (브라우저에서 http://localhost:5173)
npm run dev

# 배포용 빌드
npm run build
```

---

## 2. 콘텐츠 편집하기

### 기존 페이지 수정
1. `docs/` 폴더에서 수정하고 싶은 `.md` 파일 열기
2. 마크다운 문법으로 내용 수정
3. 저장 → 로컬에서 `npm run dev`로 미리보기
4. GitHub에 푸시하면 Netlify가 자동으로 배포

### 새 페이지 추가
**예시: 복리후생에 "교육 지원" 페이지 추가하기**

1. `docs/welfare/training.md` 파일 생성
2. 내용 작성:
   ```markdown
   # 교육 지원

   ## 사내 교육
   ...
   ```
3. `docs/.vitepress/config.mts`의 `sidebar` 영역에 추가:
   ```ts
   '/welfare/': [
     {
       text: '복리후생',
       items: [
         { text: '개요', link: '/welfare/' },
         { text: '휴가 제도', link: '/welfare/leave' },
         { text: '경조사 지원', link: '/welfare/condolence' },
         { text: '의료비 지원', link: '/welfare/medical' },
         { text: '교육 지원', link: '/welfare/training' }  // ← 추가
       ]
     }
   ]
   ```
4. 홈 페이지(`docs/index.md`)의 `features` 영역에도 카드 추가 가능

### 마크다운 자주 쓰는 문법

#### 표 만들기
```markdown
| 구분 | 금액 |
|------|------|
| 결혼 | 500,000원 |
```

#### 강조 박스
```markdown
::: tip 안내
중요한 안내사항입니다.
:::

::: warning 주의
주의가 필요한 내용입니다.
:::

::: info 참고
참고 정보입니다.
:::
```

#### 링크
```markdown
[휴가 제도](/welfare/leave)
```

#### 목록
```markdown
- 항목 1
- 항목 2
  - 하위 항목

1. 첫 번째
2. 두 번째
```

---

## 3. Netlify에 배포하기

### 첫 배포
1. GitHub에 새 저장소(repository) 생성
2. 로컬에서 코드 푸시:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/[유저명]/[저장소명].git
   git push -u origin main
   ```
3. [Netlify](https://app.netlify.com) → **Add new site** → **Import an existing project**
4. GitHub 연결 → 저장소 선택
5. 빌드 설정은 `netlify.toml`에서 자동으로 읽어옵니다 → **Deploy**
6. 약 2~3분 후 `https://[랜덤문자열].netlify.app` 주소로 접속 가능

### URL 변경하기 (예: daekyo-hr.netlify.app)
1. Netlify 대시보드 → **Site settings** → **Change site name**
2. 원하는 이름으로 변경 (예: `daekyo-hr`)

### 이후 업데이트
GitHub에 푸시만 하면 자동 배포됩니다.
```bash
git add .
git commit -m "공지사항 추가"
git push
```

---

## 4. 검색 노출 방지

이미 다음 설정이 적용되어 있어 구글·네이버 등 검색엔진에 노출되지 않습니다.

`docs/.vitepress/config.mts`:
```ts
head: [
  ['meta', { name: 'robots', content: 'noindex, nofollow' }]
]
```

URL을 아는 사람만 접속 가능합니다.

---

## 5. 자주 묻는 질문 (관리자용)

### Q. 마크다운 편집기는 무엇을 쓰면 좋나요?
- **VS Code** (무료, 가장 추천) — 미리보기 기능 내장
- **Obsidian** — 메모 앱처럼 사용 가능
- **Typora** — 가장 직관적인 마크다운 편집기

### Q. Git을 잘 모르는데 어떻게 하나요?
- **GitHub Desktop** 앱 사용 — 클릭 몇 번으로 변경사항 푸시 가능
- 또는 GitHub 웹에서 직접 파일 편집 → 자동 배포

### Q. 이미지를 추가하려면?
1. `docs/public/` 폴더 생성 후 이미지 저장 (예: `docs/public/logo.png`)
2. 마크다운에서 `![설명](/logo.png)`처럼 사용

### Q. 비밀번호 보호를 걸 수 있나요?
Netlify Pro 플랜에서는 비밀번호 보호 기능이 있습니다.
무료 플랜에서는 URL 비공개로 운영하시면 됩니다.

### Q. 검색 기능은 어떻게 작동하나요?
VitePress의 로컬 검색이 자동으로 모든 페이지를 인덱싱합니다.
별도 설정 없이 상단의 검색 버튼 또는 `Ctrl+K`로 사용 가능합니다.

---

## 6. 도움말

- VitePress 공식 문서: https://vitepress.dev
- 마크다운 문법: https://www.markdownguide.org/cheat-sheet
- Netlify 문서: https://docs.netlify.com
