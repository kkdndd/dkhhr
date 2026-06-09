<script setup lang="ts">
/**
 * 항상 표시되는 "맨 위로" 플로팅 버튼
 *
 * theme/index.ts 의 'layout-bottom' 슬롯에 등록되어
 * 모든 페이지의 우측 하단에 떠 있습니다.
 * 챗봇창과 겹치지 않도록 챗봇 왼편에 위치합니다.
 */

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <button
    class="dk-back-to-top"
    type="button"
    @click="scrollToTop"
    aria-label="맨 위로 이동"
    title="맨 위로"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  </button>
</template>

<style scoped>
.dk-back-to-top {
  position: fixed;
  /* 챗봇 오른쪽 24px + 챗봇 너비 400px + 간격 24px = 448px */
  right: 448px;
  bottom: 24px;
  width: 48px;
  height: 48px;
  background: #ffffff;
  border: 1px solid #D2D2D7;
  border-radius: 12px;
  color: #1D1D1F;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
  z-index: 9998;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display',
    'Pretendard', sans-serif;
}

.dk-back-to-top:hover {
  background: #F5F5F7;
  border-color: #B0B0B5;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.dk-back-to-top:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.dk-back-to-top svg {
  width: 22px;
  height: 22px;
}

/* 다크 모드 */
.dark .dk-back-to-top {
  background: #2C2C2E;
  border-color: #48484A;
  color: #F5F5F7;
}

.dark .dk-back-to-top:hover {
  background: #3A3A3C;
  border-color: #636366;
}

/* 모바일: 챗봇이 화면 전체 폭이므로 버튼은 화면 왼쪽 하단에 배치 */
@media (max-width: 600px) {
  .dk-back-to-top {
    right: auto;
    left: 16px;
    bottom: 16px;
    width: 42px;
    height: 42px;
  }

  .dk-back-to-top svg {
    width: 20px;
    height: 20px;
  }
}
</style>
