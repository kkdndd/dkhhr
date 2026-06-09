/**
 * VitePress 커스텀 테마 진입점
 *
 * - 기본 테마를 확장(extends)하고
 * - 모든 페이지 하단에 챗봇과 "맨 위로" 버튼을 항상 표시
 */
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import ChatBot from './ChatBot.vue'
import BackToTop from './BackToTop.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      // layout-bottom 슬롯에 챗봇과 맨 위로 버튼을 함께 렌더링
      // (둘 다 fixed 위치이므로 같은 슬롯에 넣어도 서로 영향 없음)
      'layout-bottom': () => [h(ChatBot), h(BackToTop)]
    })
  }
} satisfies Theme
