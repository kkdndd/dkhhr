<script setup lang="ts">
/**
 * 인사·복지 챗봇 컴포넌트
 *
 * 동작 방식
 *  - 우측 하단에 채팅창이 항상 표시됨
 *  - 헤더 우측 - 버튼으로 최소화 (헤더만 남김)
 *  - 최소화 상태에서 헤더 클릭 또는 + 버튼 클릭 시 복원
 *  - 사용자 입력 → faq-data.ts 의 keywords 와 매칭
 */
import { ref, nextTick, onMounted } from 'vue'
import { faqData, type FAQItem } from './faq-data'

interface ChatTable {
  title?: string
  headers: string[]
  rows: string[][]
  colWidths?: string[]
  colAligns?: string[]
}

interface Message {
  role: 'user' | 'bot'
  text: string
  link?: string
  table?: ChatTable
  tables?: ChatTable[]
}

const isMinimized = ref(false)
const input = ref('')
const messages = ref<Message[]>([])
const messagesEl = ref<HTMLDivElement | null>(null)
const inputEl = ref<HTMLInputElement | null>(null)

// 빠른 질문 (자주 사용되는 키워드)
const quickQuestions = [
  '생일',
  '경조금',
  '외부교육',
  '건강검진',
  '시차출퇴근',
  '여비규정',
  '결재선'
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

function toggleMinimize() {
  isMinimized.value = !isMinimized.value
  if (!isMinimized.value) {
    nextTick(() => {
      inputEl.value?.focus()
      scrollToBottom()
    })
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

  setTimeout(() => {
    const match = findAnswer(userQ)
    if (match) {
      messages.value.push({
        role: 'bot',
        text: match.answer,
        link: match.link,
        table: match.table,
        tables: match.tables
      })
    } else {
      messages.value.push({
        role: 'bot',
        text:
          '죄송합니다. 정확한 답을 찾지 못했어요. 경영전략팀(내선 0219, minji_kang@daekyo.co.kr)으로 문의해 주세요.'
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
  <div :class="['chatbot-window', { minimized: isMinimized }]">
    <!-- 헤더: 최소화 상태에서도 항상 보임. 클릭하면 토글 -->
    <header
      class="chatbot-header"
      @click="isMinimized && toggleMinimize()"
      :class="{ clickable: isMinimized }"
    >
      <div>
        <div class="chatbot-title">인사·복지 도우미</div>
        <div class="chatbot-subtitle" v-if="!isMinimized">
          무엇이든 물어보세요
        </div>
      </div>
      <button
        class="chatbot-minimize"
        type="button"
        @click.stop="toggleMinimize"
        :aria-label="isMinimized ? '채팅창 펼치기' : '채팅창 최소화'"
        :title="isMinimized ? '펼치기' : '최소화'"
      >
        <span v-if="isMinimized">+</span>
        <span v-else>−</span>
      </button>
    </header>

    <!-- 본문: 최소화 시 숨김 -->
    <template v-if="!isMinimized">
      <div ref="messagesEl" class="chatbot-messages">
        <div
          v-for="(msg, i) in messages"
          :key="i"
          :class="['chatbot-message', msg.role]"
        >
          <div class="chatbot-bubble">
            <div class="chatbot-text">{{ msg.text }}</div>
            <!-- 단일 표 (table 필드) -->
            <div v-if="msg.table" class="chatbot-table">
              <div v-if="msg.table.title" class="chatbot-table-title">{{ msg.table.title }}</div>
              <table>
                <thead>
                  <tr>
                    <th v-for="(h, i) in msg.table.headers" :key="'h' + i" :style="{ ...(msg.table.colWidths && msg.table.colWidths[i] ? { minWidth: msg.table.colWidths[i] } : {}) }">{{ h }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, ri) in msg.table.rows" :key="'r' + ri">
                    <td v-for="(cell, ci) in row" :key="'c' + ci" :class="{ multiline: String(cell).includes('\n') }" :style="{ ...(msg.table.colWidths && msg.table.colWidths[ci] ? { minWidth: msg.table.colWidths[ci] } : {}), ...(msg.table.colAligns && msg.table.colAligns[ci] ? { textAlign: msg.table.colAligns[ci] } : {}) }">{{ cell }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- 복수 표 (tables 필드) -->
            <template v-if="msg.tables">
              <div v-for="(t, ti) in msg.tables" :key="'tbl' + ti" class="chatbot-table">
                <div v-if="t.title" class="chatbot-table-title">{{ t.title }}</div>
                <table>
                  <thead>
                    <tr>
                      <th v-for="(h, i) in t.headers" :key="'h' + i" :style="{ ...(t.colWidths && t.colWidths[i] ? { minWidth: t.colWidths[i] } : {}) }">{{ h }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, ri) in t.rows" :key="'r' + ri">
                      <td v-for="(cell, ci) in row" :key="'c' + ci" :class="{ multiline: String(cell).includes('\n') }" :style="{ ...(t.colWidths && t.colWidths[ci] ? { minWidth: t.colWidths[ci] } : {}), ...(t.colAligns && t.colAligns[ci] ? { textAlign: t.colAligns[ci] } : {}) }">{{ cell }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>
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
    </template>
  </div>
</template>

<style scoped>
.chatbot-window {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 400px;
  max-width: calc(100vw - 32px);
  height: 756px;
  max-height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
  background: var(--vp-c-bg, #fff);
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18);
  z-index: 9999;
  overflow: hidden;
  transition: height 0.25s ease, width 0.25s ease;
}

/* 최소화 상태: 헤더만 보이도록 높이 축소 (가로폭은 동일하게 400px 유지) */
.chatbot-window.minimized {
  height: auto;
  width: 400px;
}

.chatbot-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  background: var(--vp-c-brand-1, #1A2A4F);
  color: #fff;
  flex-shrink: 0;
}

.chatbot-header.clickable {
  cursor: pointer;
}

.chatbot-header.clickable:hover {
  background: var(--vp-c-brand-2, #2A3D6B);
}

.chatbot-window.minimized .chatbot-header {
  padding: 14px 20px;
}

.chatbot-title {
  font-weight: 600;
  font-size: 18px;
}

.chatbot-window.minimized .chatbot-title {
  font-size: 16px;
}

.chatbot-subtitle {
  font-size: 13px;
  opacity: 0.85;
  margin-top: 3px;
}

.chatbot-minimize {
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: #fff;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 20px;
  font-weight: 600;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
  flex-shrink: 0;
}

.chatbot-minimize:hover {
  background: rgba(255, 255, 255, 0.3);
}

.chatbot-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
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
  padding: 12px 17px;
  border-radius: 16px;
  font-size: 15px;
  line-height: 1.55;
  word-break: break-word;
}

.chatbot-message.user .chatbot-bubble {
  background: var(--vp-c-brand-1, #1A2A4F);
  color: #fff;
  border-bottom-right-radius: 5px;
}

.chatbot-message.bot .chatbot-bubble {
  background: var(--vp-c-bg, #fff);
  color: var(--vp-c-text-1, #213547);
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  border-bottom-left-radius: 5px;
}

/* 챗봇 답변 텍스트 - \n 줄바꿈 처리 */
.chatbot-text {
  white-space: pre-line;
}

/* 챗봇 답변 내 표 스타일 */
.chatbot-table {
  margin-top: 10px;
  margin-bottom: 4px;
  overflow-x: auto;
}

.chatbot-table-title {
  font-size: 12px;
  font-weight: 600;
  color: #1A2A4F;
  margin-bottom: 4px;
}

.chatbot-table table {
  min-width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  line-height: 1.4;
}

.chatbot-table th {
  background: #1A2A4F;
  color: #ffffff;
  padding: 6px 8px;
  text-align: center;
  font-weight: 600;
  border: 1px solid #1A2A4F;
  white-space: nowrap;
}

.chatbot-table td {
  padding: 6px 8px;
  border: 1px solid #DCE2EE;
  text-align: center;
  color: #1A2A4F;
  word-break: keep-all;
  white-space: pre-line;
  vertical-align: middle;
}

/* 여러 줄 셀은 좌측 정렬 */
.chatbot-table td:has(br),
.chatbot-table td.multiline {
  text-align: left;
}

.chatbot-table tbody tr:nth-child(even) td {
  background: #F4F6FA;
}

.chatbot-table tbody td:first-child {
  font-weight: 600;
}

.chatbot-link {
  display: inline-block;
  margin-top: 10px;
  font-size: 14px;
  color: var(--vp-c-brand-1, #1A2A4F);
  text-decoration: none;
  font-weight: 500;
}

.chatbot-link:hover {
  text-decoration: underline;
}

.chatbot-quick {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 13px 15px 0;
  background: var(--vp-c-bg, #fff);
}

.chatbot-quick-btn {
  background: var(--vp-c-bg-soft, #f6f6f7);
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  color: var(--vp-c-text-1, #213547);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s;
}

.chatbot-quick-btn:hover {
  background: var(--vp-c-default-soft, #e2e2e3);
}

.chatbot-input {
  display: flex;
  gap: 10px;
  padding: 16px;
  background: var(--vp-c-bg, #fff);
  border-top: 1px solid var(--vp-c-divider, #e2e2e3);
}

.chatbot-input input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  border-radius: 12px;
  font-size: 15px;
  background: var(--vp-c-bg, #fff);
  color: var(--vp-c-text-1, #213547);
  outline: none;
}

.chatbot-input input:focus {
  border-color: var(--vp-c-brand-1, #1A2A4F);
}

.chatbot-input button {
  padding: 12px 22px;
  background: var(--vp-c-brand-1, #1A2A4F);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.15s;
}

.chatbot-input button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .chatbot-window {
    right: 12px;
    left: 12px;
    bottom: 12px;
    width: auto;
    max-width: none;
    height: 75vh;
  }

  .chatbot-window.minimized {
    width: auto;
    left: auto;
    right: 12px;
  }
}
</style>
