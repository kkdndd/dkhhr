import { defineConfig } from 'vitepress'

// VitePress 사이트 설정 - 사이드바, 메뉴, 검색 등은 모두 여기서 관리합니다.
export default defineConfig({
  lang: 'ko-KR',
  title: '대교홀딩스 인사·복리후생 안내',
  description: '대교홀딩스 임직원을 위한 인사 제도와 복리후생 안내 사이트입니다.',

  // 검색 노출 방지 (URL 아는 사람만 접근)
  head: [
    ['meta', { name: 'robots', content: 'noindex, nofollow' }],
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],

  // 한국어가 깨지지 않도록 청결한 URL 구조
  cleanUrls: true,
  lastUpdated: true,

  themeConfig: {
    // 상단 네비게이션 메뉴
    nav: [
      { text: '홈', link: '/' },
      { text: '인사 제도', link: '/hr/' },
      { text: '복리후생', link: '/welfare/' },
      { text: '공지사항', link: '/notices/' },
      { text: 'FAQ', link: '/faq/' }
    ],

    // 사이드바 (좌측 메뉴)
    sidebar: {
      '/hr/': [
        {
          text: '인사 제도',
          items: [
            { text: '개요', link: '/hr/' },
            { text: '채용', link: '/hr/recruitment' },
            { text: '평가', link: '/hr/evaluation' },
            { text: '승진', link: '/hr/promotion' }
          ]
        }
      ],
      '/welfare/': [
        {
          text: '복리후생',
          items: [
            { text: '개요', link: '/welfare/' },
            { text: '휴가 제도', link: '/welfare/leave' },
            { text: '경조사 지원', link: '/welfare/condolence' },
            { text: '모성보호 및 육아지원', link: '/welfare/maternity' }
          ]
        }
      ],
      '/notices/': [
        { text: '공지사항', link: '/notices/' }
      ],
      '/faq/': [
        { text: '자주 묻는 질문', link: '/faq/' }
      ]
    },

    // 검색 (로컬 검색 - 별도 서비스 가입 불필요)
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '검색',
            buttonAriaLabel: '검색'
          },
          modal: {
            displayDetails: '자세히 보기',
            resetButtonTitle: '초기화',
            backButtonTitle: '닫기',
            noResultsText: '검색 결과가 없습니다',
            footer: {
              selectText: '선택',
              navigateText: '이동',
              closeText: '닫기'
            }
          }
        }
      }
    },

    // 푸터
    footer: {
      message: '대교홀딩스 인사팀',
      copyright: `© ${new Date().getFullYear()} 대교홀딩스`
    },

    // 최종 수정일 표기
    lastUpdated: {
      text: '최근 업데이트',
      formatOptions: {
        dateStyle: 'medium'
      }
    },

    // 문서 페이지 좌우 네비게이션 라벨
    docFooter: {
      prev: '이전 문서',
      next: '다음 문서'
    },

    outline: {
      label: '이 페이지에서'
    },

    returnToTopLabel: '맨 위로'
  }
})
