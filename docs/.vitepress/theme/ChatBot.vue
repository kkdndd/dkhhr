<script setup lang="ts">
/**
 * 인사·복지 챗봇 컴포넌트
 *
 * 동작 방식
 *  1) 우측 하단 플로팅 버튼 → 클릭 시 채팅창 열림
 *  2) 사용자 입력 → faq-data.ts 의 keywords 와 매칭
 *  3) 가장 많은 키워드가 일치하는 답변을 표시
 *  4) 매칭 결과가 없으면 안내 메시지 + FAQ 페이지 안내
 */
import { ref, nextTick, onMounted, computed } from 'vue'
import { faqData, type FAQItem } from './faq-data'

interface Message {
  role: 'user' | 'bot'
  text: string
  link?: string
}

const isOpen = ref(false)
const input = ref('')
const messages = ref<Message[]>([])
const messagesEl = ref<HTMLDivElement | null>(null)
const inputEl = ref<HTMLInputElement | null>(null)

// 빠른 질문 (자주 사용되는 키워드)
const quickQuestions = [
  '연차 며칠?',
  '경조금',
  '육아휴직',
  '출산휴가',
  '평가 등급'
]

// 초기 인사 메시지
onMounted(() => {
  messages.value = [
    {
      role: 'bot',
      text:
        '안녕하세요! 대교홀딩스 인사·복지 도우미입니다. 궁금한 점을 편하게 물어보세요. 😊'
    }
  ]
})

function toggle() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    nextTick(() => inputEl.value?.focus())
  }
}

/** 키워드 매칭 - 가장 많은 키워드가 일치하는 답변 반환 */
function findAnswer(question: string): FAQItem | null {
  const q = question.toLowerCase().replace(/\s+/g, '')
  let bestMatch: FAQItem | null = null
  let bestScore = 0

  for (const item of faqData) {
    let score = 0
    for (const keyword of item.keywords) {
      if (q.includes(keyword.toLowerCase().replace(/\s+/g, ''))) {
        score += 1
      }
    }
    if (score > bestScore) {
      bestScore = score
      bestMatch = item
    }
  }

  return bestScore > 0 ? bestMatch : null
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesEl.value) {
      messagesEl.value.scrollTop = messagesEl.value.scrollHeight
    }
  })
}

function send() {
  const userQ = input.value.trim()
  if (!userQ) return

  messages.value.push({ role: 'user', text: userQ })
  input.value = ''

  // 자연스럽게 보이도록 약간의 딜레이
  setTimeout(() => {
    const match = findAnswer(userQ)
    if (match) {
      messages.value.push({
        role: 'bot',
        text: match.answer,
        link: match.link
      })
    } else {
      messages.value.push({
        role: 'bot',
        text:
          '죄송합니다. 정확한 답을 찾지 못했어요. FAQ 페이지를 확인하시거나 인사팀(내선 1234)으로 문의해 주세요.',
        link: '/faq/'
      })
    }
    scrollToBottom()
  }, 300)

  scrollToBottom()
}

function askQuick(q: string) {
  input.value = q
  send()
}
</script>

<template>
  <!-- 플로팅 채팅 버튼 -->
  <button
    v-if="!isOpen"
    class="chatbot-fab"
    @click="toggle"
    aria-label="챗봇 열기"
    title="인사·복지 도우미"
  >
    💬
  </button>

  <!-- 채팅 창 -->
  <div v-if="isOpen" class="chatbot-window">
    <header class="chatbot-header">
      <div>
        <div class="chatbot-title">인사·복지 도우미</div>
        <div class="chatbot-subtitle">키워드로 빠르게 답을 찾아드려요</div>
      </div>
      <button class="chatbot-close" @click="toggle" aria-label="닫기">×</button>
    </header>

    <div ref="messagesEl" class="chatbot-messages">
      <div
        v-for="(msg, i) in messages"
        :key="i"
        :class="['chatbot-message', msg.role]"
      >
        <div class="chatbot-bubble">
          <div>{{ msg.text }}</div>
          <a v-if="msg.link" :href="msg.link" class="chatbot-link">
            자세히 보기 →
          </a>
        </div>
      </div>
    </div>

    <div class="chatbot-quick">
      <button
        v-for="q in quickQuestions"
        :key="q"
        class="chatbot-quick-btn"
        @click="askQuick(q)"
      >
        {{ q }}
      </button>
    </div>

    <form class="chatbot-input" @submit.prevent="send">
      <input
        ref="inputEl"
        v-model="input"
        type="text"
        placeholder="예: 연차 며칠인가요?"
        aria-label="질문 입력"
      />
      <button type="submit" :disabled="!input.trim()">전송</button>
    </form>
  </div>
</template>

<style scoped>
.chatbot-fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: var(--vp-c-brand-1, #3eaf7c);
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  z-index: 9999;
  transition: transform 0.2s, box-shadow 0.2s;
}

.chatbot-fab:hover {
  transform: scale(1.08);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

.chatbot-window {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 360px;
  max-width: calc(100vw - 32px);
  height: 540px;
  max-height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
  background: var(--vp-c-bg, #fff);
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18);
  z-index: 9999;
  overflow: hidden;
}

.chatbot-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: var(--vp-c-brand-1, #3eaf7c);
  color: #fff;
}

.chatbot-title {
  font-weight: 600;
  font-size: 15px;
}

.chatbot-subtitle {
  font-size: 12px;
  opacity: 0.85;
  margin-top: 2px;
}

.chatbot-close {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  padding: 0 4px;
}

.chatbot-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: var(--vp-c-bg-soft, #f6f6f7);
}

.chatbot-message {
  display: flex;
  max-width: 100%;
}

.chatbot-message.user {
  justify-content: flex-end;
}

.chatbot-message.bot {
  justify-content: flex-start;
}

.chatbot-bubble {
  max-width: 80%;
  padding: 10px 14px;
  border-radius: 14px;
  font-size: 14px;
  line-height: 1.5;
  word-break: break-word;
}

.chatbot-message.user .chatbot-bubble {
  background: var(--vp-c-brand-1, #3eaf7c);
  color: #fff;
  border-bottom-right-radius: 4px;
}

.chatbot-message.bot .chatbot-bubble {
  background: var(--vp-c-bg, #fff);
  color: var(--vp-c-text-1, #213547);
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  border-bottom-left-radius: 4px;
}

.chatbot-link {
  display: inline-block;
  margin-top: 8px;
  font-size: 13px;
  color: var(--vp-c-brand-1, #3eaf7c);
  text-decoration: none;
  font-weight: 500;
}

.chatbot-link:hover {
  text-decoration: underline;
}

.chatbot-quick {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 10px 12px 0;
  background: var(--vp-c-bg, #fff);
}

.chatbot-quick-btn {
  background: var(--vp-c-bg-soft, #f6f6f7);
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  color: var(--vp-c-text-1, #213547);
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.15s;
}

.chatbot-quick-btn:hover {
  background: var(--vp-c-default-soft, #e2e2e3);
}

.chatbot-input {
  display: flex;
  gap: 8px;
  padding: 12px;
  background: var(--vp-c-bg, #fff);
  border-top: 1px solid var(--vp-c-divider, #e2e2e3);
}

.chatbot-input input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  border-radius: 10px;
  font-size: 14px;
  background: var(--vp-c-bg, #fff);
  color: var(--vp-c-text-1, #213547);
  outline: none;
}

.chatbot-input input:focus {
  border-color: var(--vp-c-brand-1, #3eaf7c);
}

.chatbot-input button {
  padding: 10px 16px;
  background: var(--vp-c-brand-1, #3eaf7c);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.15s;
}

.chatbot-input button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 480px) {
  .chatbot-window {
    right: 12px;
    left: 12px;
    bottom: 12px;
    width: auto;
    max-width: none;
    height: 70vh;
  }
}
</style>
