/**
 * VitePress 커스텀 테마 진입점
 *
 * - 기본 테마를 확장(extends)하고
 * - 모든 페이지 하단에 챗봇 컴포넌트를 추가합니다.
 */
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import ChatBot from './ChatBot.vue'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      // VitePress 기본 레이아웃의 'layout-bottom' 슬롯에 챗봇 삽입
      // (어느 슬롯이든 위치를 fixed로 잡았으니 자유롭게 변경 가능)
      'layout-bottom': () => h(ChatBot)
    })
  }
} satisfies Theme
