# 2부: tmux로 Claude Code Agent Team 활용하기 - 콘텐츠 기획서

## 개요

2부에서는 tmux의 실전 활용 사례로서 Claude Code의 Agent Team 기능을 다룹니다. 1부에서 배운 tmux 기초 지식을 바탕으로, 여러 AI 에이전트를 동시에 운영하고 모니터링하는 실무 워크플로우를 구축합니다.

**대상 독자**: 1부를 완료한 개발자, Claude Code에 관심이 있는 개발자
**목표**: tmux + Claude Code Agent Team을 활용한 병렬 AI 개발 워크플로우 구축

---

## Chapter 1: Claude Code와 Agent Team 소개

**파일명**: `part2/01-introduction.mdx`

### 섹션 구성

#### 1.1 Claude Code CLI 소개
- Claude Code란 무엇인가
  - Anthropic의 공식 CLI 기반 AI 코딩 도구
  - 터미널에서 직접 Claude와 대화하며 코드 작성/수정/디버깅
  - IDE 플러그인이 아닌 독립적인 CLI 도구의 장점
- Claude Code의 핵심 기능
  - 코드 생성, 수정, 리팩토링
  - 파일 시스템 직접 접근 및 수정
  - Git 작업 지원
  - 셸 명령어 실행
  - 프로젝트 컨텍스트 이해

#### 1.2 Agent Team이란?
- Agent Team의 개념
  - 하나의 작업을 여러 에이전트가 분담하여 병렬 처리
  - 각 에이전트는 독립적인 프로세스로 실행
  - Team Lead가 작업을 분배하고 하위 에이전트들이 실행
- Agent Team의 구조
  - Team Lead (조율자 역할)
  - Sub-agents (실제 작업 수행)
  - Task 시스템을 통한 작업 관리
- 단일 에이전트 vs Agent Team 비교

#### 1.3 tmux가 Agent Team에 필수적인 이유
- 여러 에이전트를 동시에 모니터링하는 화면 분할
- SSH 연결이 끊어져도 에이전트가 계속 실행됨
- 세션 단위로 프로젝트별 에이전트 환경 관리
- 스크롤백 버퍼로 에이전트 출력 히스토리 확인

### 코드/명령어 예제

```bash
# Claude Code 기본 실행
claude

# 대화형 모드
claude chat

# 특정 프롬프트로 실행
claude "이 프로젝트의 구조를 분석해줘"

# Agent Team 활용 예시 (개념 소개용)
claude "이 프로젝트의 프론트엔드와 백엔드를 동시에 개선해줘"
```

### 다이어그램

```
Agent Team 구조도:

┌─────────────────────────────────────────┐
│              Team Lead                  │
│         (작업 분배 & 조율)                │
├────────┬────────┬────────┬──────────────┤
│        │        │        │              │
▼        ▼        ▼        ▼              │
┌──────┐┌──────┐┌──────┐┌──────┐         │
│Agent1││Agent2││Agent3││Agent4│         │
│코더   ││테스터 ││리뷰어 ││문서화 │         │
└──────┘└──────┘└──────┘└──────┘         │
                                          │
tmux에서의 배치:                            │
┌─────────────────┬───────────────────┐   │
│ Pane 0          │ Pane 1            │   │
│ Team Lead       │ Agent 1 (코더)     │   │
│                 │                   │   │
├─────────────────┼───────────────────┤   │
│ Pane 2          │ Pane 3            │   │
│ Agent 2 (테스터) │ Agent 3 (리뷰어)   │   │
└─────────────────┴───────────────────┘   │
└─────────────────────────────────────────┘
```

### 실전 팁 박스

> **Tip: Agent Team은 언제 사용하면 좋을까?**
> - 서로 독립적인 작업이 여러 개 있을 때 (프론트/백엔드 동시 개발)
> - 코드 작성과 테스트를 병렬로 진행할 때
> - 대규모 코드베이스에서 여러 파일을 동시에 수정할 때
> - 단일 에이전트로 처리하기엔 복잡도가 높은 프로젝트

> **Tip: 왜 tmux인가?**
> 원격 서버에서 Claude Code Agent Team을 실행할 때, tmux 없이는 SSH 연결이 끊기면 모든 에이전트가 종료됩니다. tmux 세션 안에서 실행하면 연결이 끊어져도 에이전트들이 계속 작업을 수행합니다.

---

## Chapter 2: 기본 환경 설정

**파일명**: `part2/02-basic-setup.mdx`

### 섹션 구성

#### 2.1 Claude Code 설치 및 설정
- Node.js 환경 확인 및 설치
- Claude Code 설치 (npm)
- 인증 설정 (API 키 또는 OAuth)
- 기본 설정 확인 및 커스터마이징
- CLAUDE.md 파일을 통한 프로젝트 컨텍스트 설정

#### 2.2 tmux + Claude Code 기본 워크플로우
- tmux 세션에서 Claude Code 실행하기
- 기본적인 화면 분할로 에이전트와 터미널 분리
- 에이전트 출력 모니터링하면서 다른 작업 하기
- tmux 세션 분리/재접속으로 에이전트 백그라운드 실행

#### 2.3 첫 번째 Agent Team 실행해보기
- 간단한 Agent Team 작업 요청 예시
- Team Lead가 sub-agent를 생성하는 과정 관찰
- 각 에이전트의 작업 상태 확인하기
- 작업 완료 후 결과 확인

#### 2.4 기본 tmux 레이아웃으로 에이전트 모니터링
- 2-pane 레이아웃: Team Lead + 터미널
- 3-pane 레이아웃: Team Lead + Agent + 터미널
- 4-pane 균등 분할: 여러 에이전트 동시 모니터링
- 레이아웃 전환 단축키 활용

### 코드/명령어 예제

```bash
# Claude Code 설치
npm install -g @anthropic-ai/claude-code

# 버전 확인
claude --version

# 인증 설정
claude auth

# tmux 세션 생성 후 Claude Code 실행
tmux new-session -s claude-dev
claude

# 새 pane에서 추가 터미널 열기
# Ctrl-b % (세로 분할)
# Ctrl-b " (가로 분할)

# 기본 2-pane 레이아웃 설정
tmux new-session -s claude-dev \; \
  split-window -h \; \
  select-pane -t 0

# 4-pane 균등 분할 레이아웃
tmux new-session -s agent-team \; \
  split-window -h \; \
  split-window -v \; \
  select-pane -t 0 \; \
  split-window -v \; \
  select-layout tiled
```

```markdown
<!-- CLAUDE.md 예시 -->
# 프로젝트 컨텍스트

이 프로젝트는 React + Express 기반 웹 애플리케이션입니다.

## 기술 스택
- 프론트엔드: React 18, TypeScript, Tailwind CSS
- 백엔드: Express.js, PostgreSQL
- 테스트: Jest, React Testing Library

## 코딩 컨벤션
- TypeScript strict 모드 사용
- 함수형 컴포넌트 + hooks 패턴
- ESLint + Prettier 설정 준수
```

### 다이어그램

```
기본 워크플로우:

┌─ tmux session: claude-dev ──────────────────┐
│                                              │
│  ┌─ Pane 0 ──────────┬─ Pane 1 ───────────┐ │
│  │                    │                     │ │
│  │  $ claude          │  $ git status       │ │
│  │                    │  $ npm test         │ │
│  │  Claude Code       │  일반 터미널         │ │
│  │  대화형 세션        │  (빌드/테스트/Git)   │ │
│  │                    │                     │ │
│  └────────────────────┴─────────────────────┘ │
│                                              │
│  Status bar: [claude-dev] 0:claude  1:bash   │
└──────────────────────────────────────────────┘

Agent Team 기본 모니터링 레이아웃:

┌─ tmux session: agent-team ──────────────────┐
│                                              │
│  ┌─ Pane 0 ──────────┬─ Pane 1 ───────────┐ │
│  │ Team Lead          │ Sub-Agent 1        │ │
│  │ (작업 분배 중...)    │ (코드 작성 중...)    │ │
│  ├────────────────────┼─────────────────────┤ │
│  │ Pane 2             │ Pane 3             │ │
│  │ Sub-Agent 2        │ 터미널 (모니터링)    │ │
│  │ (테스트 작성 중...)  │ $ htop / git log   │ │
│  └────────────────────┴─────────────────────┘ │
│                                              │
└──────────────────────────────────────────────┘
```

### 실전 팁 박스

> **Tip: CLAUDE.md로 에이전트 품질 높이기**
> 프로젝트 루트에 CLAUDE.md 파일을 작성하면, Claude Code가 프로젝트의 컨텍스트를 자동으로 이해합니다. Agent Team의 모든 에이전트가 이 파일을 참조하므로, 코딩 컨벤션, 기술 스택, 프로젝트 구조를 명시해 두면 일관된 결과를 얻을 수 있습니다.

> **Tip: tmux 세션 네이밍 컨벤션**
> 프로젝트별로 세션 이름을 정해두면 관리가 편합니다: `tmux new -s project-name`. 여러 프로젝트를 동시에 진행할 때 `tmux ls`로 세션 목록을 확인하고 `tmux attach -t project-name`으로 빠르게 전환할 수 있습니다.

---

## Chapter 3: Agent Team 운영 전략

**파일명**: `part2/03-operation-strategy.mdx`

### 섹션 구성

#### 3.1 에이전트 역할 분배 전략
- 역할별 에이전트 유형
  - **코더 (Coder)**: 새로운 코드 작성, 기능 구현
  - **리뷰어 (Reviewer)**: 코드 리뷰, 품질 검증
  - **테스터 (Tester)**: 테스트 코드 작성, 테스트 실행
  - **리서처 (Researcher)**: 코드베이스 분석, 문서 탐색
  - **리팩토러 (Refactorer)**: 코드 개선, 성능 최적화
- 작업 유형에 따른 역할 조합 전략
- 효과적인 프롬프트로 역할 명확히 지정하기

#### 3.2 tmux 세션/윈도우/페인 구조 설계
- 프로젝트 규모별 권장 구조
  - 소규모 (2-3 에이전트): 단일 윈도우, 페인 분할
  - 중규모 (4-6 에이전트): 다중 윈도우
  - 대규모 (7+ 에이전트): 다중 세션 또는 세션 그룹
- 역할별 페인 배치 패턴
- 윈도우 전환을 활용한 에이전트 그룹 관리

#### 3.3 에이전트 간 작업 의존성 관리
- 순차적 작업 vs 병렬 작업 구분
- 작업 파이프라인 설계
  - 분석 -> 설계 -> 구현 -> 테스트 -> 리뷰
- 의존성이 있는 작업의 실행 순서 관리
- 에이전트 간 결과 전달 방법

#### 3.4 효율적인 프롬프트 설계
- Agent Team에 최적화된 프롬프트 구조
- 작업 범위를 명확히 하는 프롬프트 작성법
- 에이전트가 서로의 작업을 인식하도록 하는 방법
- 프롬프트 템플릿 모음

### 코드/명령어 예제

```bash
# 역할별 tmux 윈도우 구성 스크립트
#!/bin/bash
SESSION="fullstack-dev"

# 세션 생성
tmux new-session -d -s $SESSION -n "lead"

# 윈도우별 역할 분배
tmux new-window -t $SESSION -n "frontend"
tmux new-window -t $SESSION -n "backend"
tmux new-window -t $SESSION -n "testing"
tmux new-window -t $SESSION -n "monitor"

# 모니터링 윈도우 구성
tmux select-window -t $SESSION:monitor
tmux split-window -h
tmux send-keys -t $SESSION:monitor.0 'htop' C-m
tmux send-keys -t $SESSION:monitor.1 'watch -n 5 git log --oneline -10' C-m

# 첫 번째 윈도우로 이동
tmux select-window -t $SESSION:lead
tmux attach -t $SESSION
```

```
# Agent Team 프롬프트 예시

## 좋은 프롬프트 (역할과 범위가 명확):
"이 프로젝트에서 다음 작업을 Agent Team으로 병렬 처리해줘:
1. src/components/ 디렉토리의 모든 React 컴포넌트에 TypeScript 타입 추가
2. 각 컴포넌트에 대한 단위 테스트 작성
3. 완료된 작업에 대한 코드 리뷰"

## 피해야 할 프롬프트 (모호하고 범위가 넓음):
"이 프로젝트를 개선해줘"
```

### 다이어그램

```
작업 파이프라인과 tmux 매핑:

작업 흐름:
  [분석] ──> [설계] ──> [구현] ──> [테스트] ──> [리뷰]
    │          │          │          │           │
    ▼          ▼          ▼          ▼           ▼
  Agent-R    (Lead)    Agent-C    Agent-T     Agent-V
  리서처               코더       테스터       리뷰어

tmux 구조:
  Window 0: lead     ─ Team Lead (전체 조율)
  Window 1: research ─ 리서처 에이전트
  Window 2: code     ─ 코더 에이전트
  Window 3: test     ─ 테스터 에이전트
  Window 4: review   ─ 리뷰어 에이전트
  Window 5: monitor  ─ 시스템 모니터링

프로젝트 규모별 권장 구조:

소규모 (단일 윈도우):          중규모 (다중 윈도우):
┌──────────┬──────────┐      Window 0: [Lead + Agent1]
│ Lead     │ Agent 1  │      Window 1: [Agent2 + Agent3]
├──────────┼──────────┤      Window 2: [Agent4 + Monitor]
│ Agent 2  │ Terminal │
└──────────┴──────────┘
```

### 실전 팁 박스

> **Tip: 에이전트 수는 적절히**
> 에이전트를 너무 많이 생성하면 시스템 리소스가 부족해질 수 있습니다. 일반적으로 3-5개의 에이전트가 최적입니다. 각 에이전트는 별도의 Claude API 호출을 사용하므로, API 사용량도 고려해야 합니다.

> **Tip: 의존성 있는 작업은 순차적으로**
> "백엔드 API를 먼저 만들고, 그 다음 프론트엔드에서 호출하기"처럼 의존성이 있는 작업은 하나의 프롬프트에서 순서를 명시하세요. Agent Team이 자동으로 의존성을 관리하지만, 명시적으로 지정하면 더 정확한 결과를 얻을 수 있습니다.

---

## Chapter 4: 실전 프로젝트 시나리오

**파일명**: `part2/04-real-world-scenarios.mdx`

### 섹션 구성

#### 4.1 시나리오 1: 풀스택 웹앱 개발

**상황**: React + Express 기반 TODO 앱의 새 기능 추가
**에이전트 구성**:
- Agent 1: 백엔드 API 개발 (Express 라우트, DB 스키마)
- Agent 2: 프론트엔드 UI 개발 (React 컴포넌트)
- Agent 3: 테스트 코드 작성 (Jest, React Testing Library)

**다루는 내용**:
- tmux 레이아웃 설정
- 각 에이전트에게 작업 지시하는 프롬프트
- 에이전트 간 작업 진행 모니터링
- 충돌 해결 (같은 파일을 여러 에이전트가 수정할 때)
- 최종 통합 및 테스트

#### 4.2 시나리오 2: 대규모 리팩토링 프로젝트

**상황**: JavaScript 프로젝트를 TypeScript로 마이그레이션
**에이전트 구성**:
- Agent 1: 타입 정의 파일 작성 (.d.ts, 인터페이스)
- Agent 2: 소스 파일 변환 (.js -> .ts)
- Agent 3: 테스트 파일 업데이트 및 타입 체크 실행

**다루는 내용**:
- 파일 단위로 작업 분배하는 전략
- 변환 진행 상황을 tmux에서 추적하기
- 빌드 에러를 실시간으로 모니터링
- 점진적 마이그레이션 접근법

#### 4.3 시나리오 3: 코드 리뷰 & 문서화 자동화

**상황**: 레거시 코드베이스에 대한 리뷰 및 문서화
**에이전트 구성**:
- Agent 1: 코드 품질 분석 및 개선 제안
- Agent 2: JSDoc / TSDoc 주석 추가
- Agent 3: README 및 API 문서 생성

**다루는 내용**:
- 읽기 전용 에이전트 vs 쓰기 에이전트 구분
- 분석 결과를 다른 에이전트에 전달하기
- 문서 일관성 유지 전략
- 결과물 검증 프로세스

### 코드/명령어 예제

```bash
# 시나리오 1: 풀스택 개발 tmux 레이아웃
#!/bin/bash
SESSION="fullstack-todo"

tmux new-session -d -s $SESSION -n "lead"

# Lead 윈도우 - Team Lead 에이전트
tmux send-keys -t $SESSION:lead "claude" C-m

# Backend 윈도우
tmux new-window -t $SESSION -n "backend"
tmux send-keys -t $SESSION:backend "cd backend && claude" C-m

# Frontend 윈도우
tmux new-window -t $SESSION -n "frontend"
tmux send-keys -t $SESSION:frontend "cd frontend && claude" C-m

# Testing 윈도우 - 좌우 분할 (테스트 에이전트 + 테스트 실행)
tmux new-window -t $SESSION -n "testing"
tmux split-window -h -t $SESSION:testing
tmux send-keys -t $SESSION:testing.0 "claude" C-m
tmux send-keys -t $SESSION:testing.1 "npm test -- --watch" C-m

# Monitor 윈도우
tmux new-window -t $SESSION -n "monitor"
tmux split-window -h -t $SESSION:monitor
tmux split-window -v -t $SESSION:monitor.1
tmux send-keys -t $SESSION:monitor.0 "watch -n 10 'git diff --stat'" C-m
tmux send-keys -t $SESSION:monitor.1 "htop" C-m
tmux send-keys -t $SESSION:monitor.2 "tail -f logs/app.log" C-m

tmux select-window -t $SESSION:lead
tmux attach -t $SESSION
```

```bash
# 시나리오 2: 대규모 리팩토링 진행 상황 모니터링
# 별도 pane에서 실행
watch -n 5 'echo "=== Migration Progress ===" && \
  echo "Total JS files: $(find src -name "*.js" | wc -l)" && \
  echo "Total TS files: $(find src -name "*.ts" -o -name "*.tsx" | wc -l)" && \
  echo "TypeScript errors: $(npx tsc --noEmit 2>&1 | grep "error TS" | wc -l)"'
```

```
# 시나리오 1 프롬프트 예시 (Team Lead에게):
"이 TODO 앱 프로젝트에 '태그 기능'을 추가해줘. Agent Team으로 병렬 작업해줘:

1. 백엔드 에이전트:
   - tags 테이블 스키마 추가 (PostgreSQL)
   - /api/tags CRUD 엔드포인트 구현
   - todo-tag 관계 테이블 및 API 구현

2. 프론트엔드 에이전트:
   - TagSelector 컴포넌트 생성
   - TodoItem에 태그 표시 기능 추가
   - 태그별 필터링 UI 구현

3. 테스트 에이전트:
   - 백엔드 API 통합 테스트
   - 프론트엔드 컴포넌트 단위 테스트
   - E2E 테스트 시나리오"
```

### 다이어그램

```
시나리오 1 - 풀스택 개발 tmux 구성:

Session: fullstack-todo
├─ Window 0: lead
│  └─ [Team Lead Claude Code 세션]
│
├─ Window 1: backend
│  └─ [백엔드 에이전트 - API 개발]
│
├─ Window 2: frontend
│  └─ [프론트엔드 에이전트 - UI 개발]
│
├─ Window 3: testing
│  ├─ Pane 0: [테스트 에이전트]
│  └─ Pane 1: [npm test --watch 실행 중]
│
└─ Window 4: monitor
   ├─ Pane 0: [git diff 변경 추적]
   ├─ Pane 1: [htop 리소스 모니터]
   └─ Pane 2: [앱 로그 tail]


시나리오 2 - 리팩토링 진행 대시보드:

┌─────────────────────────────────────────────┐
│ Window: migration-dashboard                  │
├──────────────────────┬──────────────────────┤
│ Migration Agent      │ TypeScript Compiler  │
│                      │                      │
│ Converting:          │ $ npx tsc --watch    │
│ src/utils/auth.js    │                      │
│ -> src/utils/auth.ts │ Errors: 12 -> 8 -> 3│
│                      │                      │
├──────────────────────┼──────────────────────┤
│ Progress Monitor     │ Git Changes          │
│                      │                      │
│ JS files: 45 -> 32   │ $ watch git diff     │
│ TS files:  0 -> 13   │   --stat             │
│ Progress: ████░ 29%  │                      │
│                      │ 13 files changed     │
└──────────────────────┴──────────────────────┘
```

### 실전 팁 박스

> **Tip: 파일 충돌 방지**
> 여러 에이전트가 동시에 같은 파일을 수정하면 충돌이 발생할 수 있습니다. 작업 범위를 디렉토리나 파일 단위로 명확히 분리하고, 공유 파일(예: 라우터 설정, 타입 정의)은 하나의 에이전트만 수정하도록 지정하세요.

> **Tip: 실시간 빌드 모니터링**
> 별도의 tmux 페인에서 `npm run build -- --watch`나 `npx tsc --watch`를 실행해두면, 에이전트가 코드를 수정할 때마다 빌드 결과를 즉시 확인할 수 있습니다. 에러가 발생하면 해당 에이전트에게 빠르게 피드백할 수 있습니다.

> **Tip: Git 브랜치 전략**
> Agent Team 작업 시 각 에이전트별로 별도 브랜치를 사용하는 것을 권장합니다. 작업 완료 후 Team Lead가 merge하는 방식으로 충돌을 최소화할 수 있습니다. 다만 Claude Code Agent Team은 기본적으로 같은 브랜치에서 작업하므로, 필요시 프롬프트에서 브랜치 전략을 명시하세요.

---

## Chapter 5: 고급 팁 & 트러블슈팅

**파일명**: `part2/05-advanced-tips.mdx`

### 섹션 구성

#### 5.1 tmux 스크립트로 Agent Team 환경 자동 구성
- 프로젝트별 tmux 시작 스크립트 작성
- tmuxinator / tmuxp를 활용한 레이아웃 관리
- 셸 alias로 빠른 환경 구성
- 프로젝트별 .tmux 설정 파일

#### 5.2 에이전트 모니터링 대시보드 구성
- tmux 상태바 커스터마이징 (에이전트 상태 표시)
- 멀티 pane 대시보드 레이아웃
- watch 명령어로 실시간 상태 업데이트
- 알림 설정 (에이전트 작업 완료 시)

#### 5.3 로그 관리 및 출력 캡처
- tmux capture-pane으로 에이전트 출력 저장
- 로그 파일로 에이전트 활동 기록
- pipe-pane을 활용한 실시간 로깅
- 로그 분석 및 검색

#### 5.4 리소스 관리
- CPU/메모리 사용량 모니터링
- 에이전트 수 제한 및 조절
- API 호출 비용 추적
- 시스템 부하에 따른 에이전트 관리

#### 5.5 자주 발생하는 문제 및 해결법
- 에이전트가 멈춘 것처럼 보일 때
- tmux 세션이 예기치 않게 종료될 때
- 여러 에이전트가 같은 파일을 수정할 때
- API 속도 제한(rate limit)에 걸릴 때
- 에이전트 출력이 너무 길어 화면이 넘칠 때
- 에이전트 간 컨텍스트 불일치 문제

#### 5.6 베스트 프랙티스 정리
- Agent Team 운영 체크리스트
- 효과적인 프롬프트 패턴 모음
- tmux 설정 권장사항
- 프로젝트 유형별 권장 워크플로우

### 코드/명령어 예제

```bash
# tmux 자동 구성 스크립트 (agent-team-setup.sh)
#!/bin/bash
PROJECT_DIR="${1:-.}"
SESSION_NAME="${2:-agent-team}"
NUM_AGENTS="${3:-3}"

# 기존 세션이 있으면 종료
tmux kill-session -t $SESSION_NAME 2>/dev/null

# 새 세션 생성
tmux new-session -d -s $SESSION_NAME -n "lead" -c "$PROJECT_DIR"
tmux send-keys -t $SESSION_NAME:lead "claude" C-m

# 에이전트 윈도우 생성
for i in $(seq 1 $NUM_AGENTS); do
  tmux new-window -t $SESSION_NAME -n "agent-$i" -c "$PROJECT_DIR"
done

# 모니터링 윈도우
tmux new-window -t $SESSION_NAME -n "monitor" -c "$PROJECT_DIR"
tmux split-window -h -t $SESSION_NAME:monitor
tmux split-window -v -t $SESSION_NAME:monitor.1

# 모니터링 명령어 실행
tmux send-keys -t $SESSION_NAME:monitor.0 \
  "watch -n 10 'git log --oneline -15'" C-m
tmux send-keys -t $SESSION_NAME:monitor.1 \
  "htop -t" C-m
tmux send-keys -t $SESSION_NAME:monitor.2 \
  "watch -n 5 'df -h && echo \"---\" && free -h'" C-m

# lead 윈도우로 이동
tmux select-window -t $SESSION_NAME:lead
tmux attach -t $SESSION_NAME
```

```bash
# 에이전트 출력 캡처
# 현재 pane의 스크롤백 버퍼 전체를 파일로 저장
tmux capture-pane -t $SESSION:lead -p -S - > agent-lead-output.log

# 모든 에이전트의 출력을 한번에 저장하는 스크립트
#!/bin/bash
SESSION="agent-team"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_DIR="logs/$TIMESTAMP"
mkdir -p $LOG_DIR

for window in $(tmux list-windows -t $SESSION -F '#W'); do
  tmux capture-pane -t "$SESSION:$window" -p -S - \
    > "$LOG_DIR/$window.log"
done
echo "Logs saved to $LOG_DIR"
```

```bash
# pipe-pane으로 실시간 로깅
# 특정 pane의 출력을 파일로 실시간 기록
tmux pipe-pane -t $SESSION:lead "cat >> ~/logs/lead.log"

# 로깅 중지
tmux pipe-pane -t $SESSION:lead
```

```bash
# tmux 상태바에 시스템 리소스 표시
# ~/.tmux.conf에 추가
set -g status-right '#[fg=green]CPU:#{cpu_percentage} #[fg=yellow]MEM:#{ram_percentage} #[fg=white]%H:%M'

# tmux-cpu, tmux-mem 없이 직접 표시
set -g status-right '#[fg=green]#(top -bn1 | grep "Cpu(s)" | awk "{print $2}") #[fg=white]%H:%M'
set -g status-interval 5
```

```bash
# 셸 alias 설정 (~/.bashrc 또는 ~/.zshrc)
alias agent-start='bash ~/scripts/agent-team-setup.sh'
alias agent-logs='bash ~/scripts/capture-agent-logs.sh'
alias agent-attach='tmux attach -t agent-team'
alias agent-kill='tmux kill-session -t agent-team'
```

```bash
# tmux 알림 설정 - 에이전트 pane에서 활동이 있을 때 알림
# 모니터링 활성화 (특정 윈도우)
tmux set-window-option -t $SESSION:agent-1 monitor-activity on

# 시각적 알림 활성화
tmux set-option -g visual-activity on

# 벨 알림도 활성화
tmux set-option -g visual-bell on
```

### 다이어그램

```
고급 모니터링 대시보드:

┌─ Session: agent-team ───────────────────────────────┐
│                                                      │
│  Window 0: lead    - Team Lead 에이전트               │
│  Window 1: agent-1 - Sub Agent 1                     │
│  Window 2: agent-2 - Sub Agent 2                     │
│  Window 3: agent-3 - Sub Agent 3                     │
│  Window 4: monitor - 모니터링 대시보드 (아래 레이아웃)  │
│                                                      │
│  ┌─ Window 4: monitor ──────────────────────────┐    │
│  │                                               │    │
│  │  ┌─ Pane 0 ──────────┬─ Pane 1 ────────────┐ │    │
│  │  │ Git Activity       │ System Resources    │ │    │
│  │  │                    │                     │ │    │
│  │  │ $ watch git log    │ $ htop              │ │    │
│  │  │   --oneline -15    │                     │ │    │
│  │  │                    │ CPU: ████░░░░ 48%   │ │    │
│  │  │ abc1234 feat: tag  │ MEM: ██████░░ 72%   │ │    │
│  │  │ def5678 fix: auth  │                     │ │    │
│  │  │ ...                │                     │ │    │
│  │  ├────────────────────┼─────────────────────┤ │    │
│  │  │ Pane 2             │                     │ │    │
│  │  │ Disk & Memory      │                     │ │    │
│  │  │                    │                     │ │    │
│  │  │ $ watch df/free    │                     │ │    │
│  │  └────────────────────┴─────────────────────┘ │    │
│  └───────────────────────────────────────────────┘    │
│                                                      │
│  Status: [agent-team] 0:lead 1:agent-1* 2:agent-2    │
│          CPU:48% MEM:72% 14:35                       │
└──────────────────────────────────────────────────────┘


트러블슈팅 흐름도:

에이전트 문제 발생
    │
    ├─ 에이전트가 멈춤?
    │   ├─ Yes → Ctrl-C로 중단 후 재시작
    │   └─ 응답 대기 중 → API 속도 제한 확인
    │
    ├─ 파일 충돌?
    │   ├─ git status 확인
    │   ├─ 충돌 파일 수동 해결
    │   └─ 에이전트에게 수정된 파일 알려주기
    │
    ├─ 리소스 부족?
    │   ├─ htop으로 프로세스 확인
    │   ├─ 불필요한 에이전트 종료
    │   └─ 에이전트 수 줄여서 재시작
    │
    └─ tmux 세션 종료?
        ├─ tmux ls로 세션 확인
        ├─ 세션 살아있으면 → tmux attach
        └─ 세션 없으면 → 스크립트로 재구성
```

### 실전 팁 박스

> **Tip: 자동 구성 스크립트를 프로젝트에 포함시키기**
> `scripts/agent-team-setup.sh` 파일을 프로젝트 저장소에 포함시키면, 팀원 누구나 동일한 Agent Team 환경을 빠르게 구성할 수 있습니다. README에 사용법을 문서화해 두세요.

> **Tip: 에이전트 출력 로그 습관**
> 중요한 Agent Team 작업을 시작하기 전에 `pipe-pane`을 설정하여 모든 에이전트의 출력을 로그로 남기세요. 나중에 에이전트가 어떤 판단을 내렸는지, 어떤 파일을 수정했는지 추적하는 데 매우 유용합니다.

> **Tip: tmux 세션 보호**
> 장시간 실행되는 Agent Team 작업의 경우, `tmux set-option -g destroy-unattached off`로 설정하여 모든 클라이언트가 분리되어도 세션이 유지되도록 하세요. 또한 시스템 재부팅에 대비하여 tmux-resurrect 플러그인 사용을 고려하세요.

> **Tip: API 비용 관리**
> Agent Team은 여러 에이전트가 동시에 API를 호출하므로, 단일 에이전트 대비 비용이 비례적으로 증가합니다. 작업 전에 예상 비용을 가늠하고, 불필요한 에이전트는 줄이세요. Claude Code의 `--usage` 옵션으로 현재까지의 사용량을 확인할 수 있습니다.

---

## 부록: 빠른 참조 카드

**파일명**: `part2/06-quick-reference.mdx`

### 섹션 구성

#### A.1 tmux + Agent Team 핵심 명령어 모음

| 작업 | 명령어 |
|------|--------|
| Agent Team 세션 생성 | `tmux new -s agent-team` |
| 페인 세로 분할 | `Ctrl-b %` |
| 페인 가로 분할 | `Ctrl-b "` |
| 페인 이동 | `Ctrl-b 방향키` |
| 윈도우 생성 | `Ctrl-b c` |
| 윈도우 전환 | `Ctrl-b 숫자` |
| 세션 분리 | `Ctrl-b d` |
| 세션 재접속 | `tmux attach -t agent-team` |
| 출력 캡처 | `tmux capture-pane -p > log.txt` |
| 레이아웃 전환 | `Ctrl-b Space` |
| 페인 확대/축소 | `Ctrl-b z` |
| 스크롤 모드 | `Ctrl-b [` |

#### A.2 Agent Team 프롬프트 템플릿

- 풀스택 개발 프롬프트 템플릿
- 리팩토링 프롬프트 템플릿
- 코드 리뷰 프롬프트 템플릿
- 문서화 프롬프트 템플릿

#### A.3 트러블슈팅 체크리스트

- 환경 설정 확인 사항
- 자주 발생하는 에러 메시지와 해결법
- 성능 최적화 체크리스트

### 코드/명령어 예제

```bash
# 풀스택 개발 프롬프트 템플릿
claude "다음 기능을 Agent Team으로 구현해줘:

## 기능: [기능명]

### 백엔드 에이전트
- [ ] DB 스키마 설계 및 마이그레이션
- [ ] REST API 엔드포인트 구현
- [ ] 입력 검증 및 에러 핸들링

### 프론트엔드 에이전트
- [ ] UI 컴포넌트 구현
- [ ] API 연동 및 상태 관리
- [ ] 반응형 디자인 적용

### 테스트 에이전트
- [ ] 백엔드 API 테스트
- [ ] 프론트엔드 컴포넌트 테스트
- [ ] 통합 테스트

### 제약 조건
- TypeScript strict 모드 사용
- 기존 코딩 컨벤션 준수
- 에러 핸들링 필수"
```

### 다이어그램

```
Agent Team 워크플로우 요약:

1. 환경 준비           2. 작업 시작           3. 모니터링
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ tmux 세션 생성 │ ──> │ Claude Code  │ ──> │ 페인 분할로    │
│ 레이아웃 구성  │     │ Agent Team   │     │ 에이전트 관찰  │
│ CLAUDE.md 준비│     │ 프롬프트 입력  │     │ 리소스 모니터  │
└──────────────┘     └──────────────┘     └──────────────┘
                                                │
4. 결과 확인           5. 정리                    │
┌──────────────┐     ┌──────────────┐           │
│ 코드 리뷰     │ <── │ 로그 캡처     │ <─────────┘
│ 테스트 실행   │     │ 결과 저장     │
│ 머지 & 커밋   │     │ 세션 정리     │
└──────────────┘     └──────────────┘
```

---

## 파일 구조 요약

```
part2/
├── 01-introduction.mdx          # Chapter 1: Claude Code와 Agent Team 소개
├── 02-basic-setup.mdx           # Chapter 2: 기본 환경 설정
├── 03-operation-strategy.mdx    # Chapter 3: Agent Team 운영 전략
├── 04-real-world-scenarios.mdx  # Chapter 4: 실전 프로젝트 시나리오
├── 05-advanced-tips.mdx         # Chapter 5: 고급 팁 & 트러블슈팅
└── 06-quick-reference.mdx       # 부록: 빠른 참조 카드
```

## 각 챕터별 예상 분량

| 챕터 | 예상 분량 | 코드 예제 수 | 다이어그램 수 | 팁 박스 수 |
|------|----------|------------|-------------|-----------|
| Ch1. 소개 | 1,500자 | 3-4 | 2 | 2 |
| Ch2. 기본 설정 | 2,500자 | 6-8 | 2 | 2 |
| Ch3. 운영 전략 | 3,000자 | 5-6 | 2 | 2 |
| Ch4. 실전 시나리오 | 4,000자 | 8-10 | 3 | 3 |
| Ch5. 고급 팁 | 3,500자 | 10-12 | 2 | 4 |
| 부록 참조 카드 | 1,500자 | 3-4 | 1 | 0 |
| **합계** | **약 16,000자** | **35-44** | **12** | **13** |

## 작성 시 유의사항

1. **1부와의 연결**: 1부에서 배운 tmux 기초를 자연스럽게 활용하도록 구성. 새로운 tmux 명령어는 최소한으로 소개.
2. **실습 중심**: 각 챕터에 "따라해보기" 섹션을 포함하여 독자가 직접 실행할 수 있도록 구성.
3. **점진적 난이도**: Chapter 1-2는 초급, Chapter 3-4는 중급, Chapter 5는 고급 수준.
4. **코드 복사 가능성**: 모든 코드 블록은 독자가 그대로 복사하여 사용할 수 있도록 완전한 형태로 제공.
5. **한국어 우선**: 전문 용어는 영어를 병기하되, 설명은 한국어로 작성.
6. **Storybook 기반**: 프로젝트가 Storybook을 사용하고 있으므로, .mdx 파일 형식으로 작성하여 Storybook에서 렌더링 가능하도록 구성.
