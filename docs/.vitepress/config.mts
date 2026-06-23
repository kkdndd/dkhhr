import { defineConfig } from 'vitepress'

// VitePress 사이트 설정 - 사이드바, 메뉴, 검색 등은 모두 여기서 관리합니다.
export default defineConfig({
  lang: 'ko-KR',
  title: '대교홀딩스 인사·복지 안내',
  description: '대교홀딩스 임직원을 위한 근무제도, 복리후생, 인사제도 안내 사이트입니다.',

  // 검색 노출 방지 (URL 아는 사람만 접근)
  head: [
    ['meta', { name: 'robots', content: 'noindex, nofollow' }],
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],

  cleanUrls: true,
  lastUpdated: true,

  // 다크모드 비활성화 (라이트 모드 고정, 토글 버튼 숨김)
  appearance: false,

  themeConfig: {
    // 상단 네비게이션의 로고 (좌측 사이트 타이틀 옆에 표시)
    // 실제 PNG 로고로 교체하려면 docs/public/ 에 daekyo-logo.png 를 두고
    // 아래 경로를 '/daekyo-logo.png' 로 변경하세요.
    logo: '/daekyo-logo.svg',
    siteTitle: '대교홀딩스 인사·복지 안내',

    // 상단 네비게이션 메뉴 (공지사항·FAQ 제거)
    nav: [
      { text: '홈', link: '/' },
      { text: '근무제도', link: '/work/' },
      { text: '복리후생', link: '/welfare/' },
      { text: '인사제도', link: '/hr/' }
    ],

    // 사이드바 (좌측 메뉴)
    sidebar: {
      '/work/': [
        {
          text: '근무제도',
          items: [
            { text: '개요', link: '/work/' },
            { text: '근무/휴가', link: '/work/leave' },
            { text: '출산/육아', link: '/work/maternity' }
          ]
        }
      ],
      '/welfare/': [
        {
          text: '복리후생',
          items: [
            { text: '개요', link: '/welfare/' },
            { text: '성장/개발', link: '/welfare/growth' },
            { text: '복지/여가', link: '/welfare/leisure' },
            { text: '건강지원', link: '/welfare/health' }
          ]
        }
      ],
      '/hr/': [
        {
          text: '인사제도',
          items: [
            { text: '개요', link: '/hr/' },
            { text: '승진', link: '/hr/#promotion' },
            { text: '평가', link: '/hr/#evaluation' },
            { text: '교육', link: '/hr/#education' },
            { text: '특별성과급', link: '/hr/#special-bonus' },
            { text: '사내추천제도', link: '/hr/#referral' },
            { text: '장기근속포상', link: '/hr/#long-service' }
          ]
        }
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

    footer: {
      message: '대교홀딩스 경영전략팀',
      copyright: `© ${new Date().getFullYear()} 대교홀딩스`
    },

    lastUpdated: {
      text: '최근 업데이트',
      formatOptions: {
        dateStyle: 'medium'
      }
    },

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
