# 1부 콘텐츠 기획: Linux에서 tmux 사용 가이드

## 개요

tmux(terminal multiplexer)의 기초부터 실전 활용까지 다루는 종합 가이드.
Storybook MDX 형식으로 작성하며, 인터랙티브한 문서 경험을 제공한다.

---

## 파일 구조

```
stories/
└── part1-tmux-guide/
    ├── 01-Introduction.mdx
    ├── 02-Basics.mdx
    ├── 03-SessionWindowManagement.mdx
    ├── 04-Configuration.mdx
    └── 05-AdvancedWorkflows.mdx
```

---

## Chapter 1: tmux 시작하기 (Introduction)

**파일명:** `01-Introduction.mdx`

### 섹션 상세 Outline

#### 1.1 tmux란 무엇인가?
- Terminal Multiplexer의 약자
- 하나의 터미널에서 여러 터미널 세션을 관리하는 도구
- 서버-클라이언트 아키텍처 설명
  - tmux 서버: 백그라운드에서 세션을 유지
  - tmux 클라이언트: 터미널에서 서버에 접속
- 역사: GNU Screen과의 비교, tmux의 등장 배경

#### 1.2 왜 tmux를 사용해야 하는가?
- **SSH 연결 끊김 방지**: 원격 서버 작업 중 연결이 끊겨도 세션 유지
- **멀티태스킹**: 하나의 터미널에서 여러 작업을 동시에 수행
- **작업 컨텍스트 보존**: 프로젝트별 세션으로 작업 환경 유지
- **협업**: 세션 공유를 통한 페어 프로그래밍
- **자동화**: 스크립트를 통한 개발 환경 자동 구성
- Use Case 시나리오:
  - 서버 관리자: 여러 서버 동시 모니터링
  - 개발자: 에디터 + 터미널 + 로그 동시 확인
  - 데이터 엔지니어: 장시간 실행 작업 관리

#### 1.3 설치 방법
- Ubuntu/Debian: `sudo apt install tmux`
- CentOS/RHEL: `sudo yum install tmux` / `sudo dnf install tmux`
- macOS (참고): `brew install tmux`
- 소스 빌드 (최신 버전이 필요한 경우)
- 버전 확인: `tmux -V`

#### 1.4 기본 용어
- **세션(Session)**: tmux의 최상위 단위. 하나의 작업 공간
- **윈도우(Window)**: 세션 안의 탭. 각 윈도우는 독립적인 터미널
- **페인(Pane)**: 윈도우를 분할한 영역. 화면을 나누어 사용
- 계층 구조: Session > Window > Pane

#### 1.5 첫 번째 tmux 세션 시작하기
- `tmux` 명령으로 세션 시작
- 하단 상태바(status bar) 확인
- `exit` 또는 `Ctrl+d`로 세션 종료
- 세션이 실행 중임을 확인하는 방법

### 코드 예제 목록

```bash
# 설치
sudo apt update && sudo apt install tmux

# 버전 확인
tmux -V

# 첫 번째 세션 시작
tmux

# 이름을 지정하여 세션 시작
tmux new-session -s my-first-session

# 세션 목록 확인
tmux list-sessions

# 세션 종료
exit
```

### 다이어그램

#### tmux 아키텍처 다이어그램 (ASCII)

```
┌─────────────────────────────────────────────────┐
│                  tmux Server                     │
│                                                  │
│  ┌──────────────┐  ┌──────────────┐              │
│  │  Session: dev │  │ Session: ops │              │
│  │  ┌────┬────┐ │  │  ┌────┬────┐ │              │
│  │  │Win1│Win2│ │  │  │Win1│Win2│ │              │
│  │  └────┴────┘ │  │  └────┴────┘ │              │
│  └──────────────┘  └──────────────┘              │
│                                                  │
└──────────────┬──────────────┬────────────────────┘
               │              │
        ┌──────┴──┐    ┌──────┴──┐
        │Client A │    │Client B │
        │(Terminal)│    │(Terminal)│
        └─────────┘    └─────────┘
```

#### 계층 구조 다이어그램 (ASCII)

```
Session "development"
├── Window 0: "editor"
│   ├── Pane 0 (vim)
│   └── Pane 1 (terminal)
├── Window 1: "server"
│   └── Pane 0 (npm start)
└── Window 2: "logs"
    ├── Pane 0 (app logs)
    └── Pane 1 (system logs)
```

### 단축키 테이블

이 챕터에서는 단축키 테이블 없음 (Chapter 2에서 다룸).
기본 명령어 테이블만 포함:

| 명령어 | 설명 |
|--------|------|
| `tmux` | 새 세션 시작 |
| `tmux new -s <name>` | 이름을 지정하여 세션 시작 |
| `tmux ls` | 세션 목록 확인 |
| `tmux -V` | 버전 확인 |
| `exit` | 현재 세션/페인 종료 |

---

## Chapter 2: 기본 사용법 (Basics)

**파일명:** `02-Basics.mdx`

### 섹션 상세 Outline

#### 2.1 Prefix 키 (Ctrl+b) 이해하기
- tmux 단축키의 작동 방식: Prefix + 명령키
- 기본 Prefix: `Ctrl+b`
- Prefix 키를 누른 후 손을 떼고 명령키를 누르는 방식
- Prefix 키 변경 방법 미리보기 (상세는 Chapter 4)

#### 2.2 세션 관리: 생성/분리/재접속
- 세션 생성: `tmux new -s <name>`
- 세션에서 분리(Detach): `Prefix + d`
- 세션 재접속(Attach): `tmux attach -t <name>`
- 세션 목록 확인: `tmux ls`
- 세션 종료: `tmux kill-session -t <name>`
- 세션 전환: `Prefix + s` (세션 목록에서 선택)

#### 2.3 윈도우 관리
- 새 윈도우 생성: `Prefix + c`
- 윈도우 간 전환:
  - 다음 윈도우: `Prefix + n`
  - 이전 윈도우: `Prefix + p`
  - 번호로 이동: `Prefix + 0~9`
  - 목록에서 선택: `Prefix + w`
- 윈도우 이름 변경: `Prefix + ,`
- 윈도우 닫기: `Prefix + &` 또는 `exit`

#### 2.4 페인 분할
- 수평 분할(위/아래): `Prefix + "`
- 수직 분할(좌/우): `Prefix + %`
- 분할 방향의 직관적 이해

#### 2.5 페인 간 이동
- 방향키로 이동: `Prefix + 화살표`
- 순서대로 이동: `Prefix + o`
- 마지막 페인으로 이동: `Prefix + ;`
- 페인 번호 표시: `Prefix + q` (번호를 눌러 이동)

#### 2.6 페인 조작
- 페인 닫기: `Prefix + x`
- 페인 확대/축소 (Zoom): `Prefix + z`
- 페인 위치 변경: `Prefix + {` / `Prefix + }`

#### 2.7 기본 단축키 총정리

### 코드 예제 목록

```bash
# 세션 생성 및 관리
tmux new -s project-a
# (작업 중) Prefix + d 로 분리
tmux new -s project-b
tmux ls
# 출력 예시:
# project-a: 1 windows (created Mon Jan  1 10:00:00 2026)
# project-b: 1 windows (created Mon Jan  1 10:05:00 2026) (attached)

# 세션 재접속
tmux attach -t project-a

# 세션 종료
tmux kill-session -t project-b
```

### 다이어그램

#### 페인 분할 다이어그램 (ASCII)

```
[초기 상태]            [수평 분할: Prefix + "]    [수직 분할: Prefix + %]
┌──────────────┐      ┌──────────────┐           ┌──────┬───────┐
│              │      │    Pane 0    │           │      │       │
│   Pane 0     │  ->  ├──────────────┤           │Pane 0│Pane 1 │
│              │      │    Pane 1    │           │      │       │
└──────────────┘      └──────────────┘           └──────┴───────┘

[복합 분할 예시]
┌──────────────────────────────┐
│           Pane 0             │
├──────────────┬───────────────┤
│    Pane 1    │    Pane 2     │
└──────────────┴───────────────┘
```

#### 윈도우 전환 다이어그램 (ASCII)

```
상태바:  [0:bash*  1:vim  2:logs]
                 ↑
            현재 윈도우

Prefix + n  →  다음 윈도우로 이동
Prefix + p  →  이전 윈도우로 이동
Prefix + 2  →  윈도우 2(logs)로 직접 이동
```

### 단축키 테이블

#### 세션 관련 단축키

| 단축키 | 설명 |
|--------|------|
| `Prefix + d` | 세션에서 분리 (Detach) |
| `Prefix + s` | 세션 목록 보기 및 전환 |
| `Prefix + $` | 현재 세션 이름 변경 |
| `Prefix + (` | 이전 세션으로 전환 |
| `Prefix + )` | 다음 세션으로 전환 |

#### 윈도우 관련 단축키

| 단축키 | 설명 |
|--------|------|
| `Prefix + c` | 새 윈도우 생성 |
| `Prefix + n` | 다음 윈도우로 이동 |
| `Prefix + p` | 이전 윈도우로 이동 |
| `Prefix + 0-9` | 해당 번호 윈도우로 이동 |
| `Prefix + w` | 윈도우 목록 보기 |
| `Prefix + ,` | 현재 윈도우 이름 변경 |
| `Prefix + &` | 현재 윈도우 닫기 |
| `Prefix + l` | 마지막 윈도우로 전환 |

#### 페인 관련 단축키

| 단축키 | 설명 |
|--------|------|
| `Prefix + "` | 수평 분할 (위/아래) |
| `Prefix + %` | 수직 분할 (좌/우) |
| `Prefix + 화살표` | 페인 간 이동 |
| `Prefix + o` | 다음 페인으로 이동 |
| `Prefix + ;` | 마지막 활성 페인으로 이동 |
| `Prefix + q` | 페인 번호 표시 |
| `Prefix + x` | 현재 페인 닫기 |
| `Prefix + z` | 페인 확대/축소 (Zoom) |
| `Prefix + {` | 현재 페인을 앞으로 이동 |
| `Prefix + }` | 현재 페인을 뒤로 이동 |
| `Prefix + Space` | 페인 레이아웃 순환 변경 |

---

## Chapter 3: 세션 & 윈도우 관리 (Intermediate)

**파일명:** `03-SessionWindowManagement.mdx`

### 섹션 상세 Outline

#### 3.1 여러 세션 동시 관리
- 프로젝트별 세션 운영 전략
- 세션 간 전환: `Prefix + s` 또는 `tmux switch-client`
- 세션 트리 뷰 활용법
- 세션 내 윈도우/페인 트리 구조 탐색

#### 3.2 세션 이름 지정 및 전환
- 의미 있는 세션 이름의 중요성
- 세션 이름 변경: `Prefix + $`
- 명령줄에서 세션 전환: `tmux switch -t <session>`
- `tmux has-session -t <name>` 으로 세션 존재 여부 확인

#### 3.3 윈도우 재배치 및 이동
- 윈도우 번호 재정렬: `move-window`
- 윈도우를 다른 세션으로 이동: `move-window -t <session>`
- 윈도우 연결(Link): `link-window`
- 윈도우 번호 자동 재정렬: `renumber-windows` 옵션

#### 3.4 페인 레이아웃
- 5가지 기본 레이아웃:
  - `even-horizontal`: 모든 페인 수평으로 균등 배치
  - `even-vertical`: 모든 페인 수직으로 균등 배치
  - `main-horizontal`: 상단 메인 + 하단 나머지
  - `main-vertical`: 좌측 메인 + 우측 나머지
  - `tiled`: 격자형 배치
- 레이아웃 순환: `Prefix + Space`
- `select-layout` 명령으로 직접 지정

#### 3.5 페인 크기 조절
- Prefix + 화살표 조합: `Prefix + Ctrl+화살표`
- `resize-pane` 명령 사용
  - `-U`, `-D`, `-L`, `-R` 옵션
  - 크기 지정: `resize-pane -D 5`
- 마우스를 이용한 크기 조절 (마우스 모드 활성화 시)

#### 3.6 복사 모드 (Copy Mode) 활용
- 복사 모드 진입: `Prefix + [`
- vi 스타일 탐색 (기본: emacs)
  - `Space`로 선택 시작, `Enter`로 복사
  - 검색: `/` (정방향), `?` (역방향)
- 붙여넣기: `Prefix + ]`
- 스크롤백 버퍼 크기 설정
- 시스템 클립보드와 연동 (xclip, xsel)

### 코드 예제 목록

```bash
# 여러 세션 관리
tmux new -s frontend -d    # 백그라운드에서 세션 생성
tmux new -s backend -d
tmux new -s database -d
tmux ls

# 세션 전환
tmux switch -t backend

# 윈도우 이동
# 현재 윈도우를 'backend' 세션으로 이동
tmux move-window -t backend

# 페인 레이아웃 직접 지정
tmux select-layout even-horizontal
tmux select-layout main-vertical

# 페인 크기 조절
tmux resize-pane -D 10    # 아래로 10줄
tmux resize-pane -R 20    # 오른쪽으로 20칸

# 복사 모드에서 시스템 클립보드로 복사 (xclip 사용)
# .tmux.conf에 다음 설정 추가:
# bind -T copy-mode-vi y send -X copy-pipe-and-cancel "xclip -selection clipboard"

# 세션 존재 여부 확인 (스크립트용)
tmux has-session -t mysession 2>/dev/null && echo "exists" || echo "not found"
```

### 다이어그램

#### 5가지 페인 레이아웃 다이어그램 (ASCII)

```
even-horizontal          even-vertical           main-horizontal
┌────┬────┬────┐        ┌──────────────┐        ┌──────────────┐
│    │    │    │        │    Pane 0    │        │   Pane 0     │
│ P0 │ P1 │ P2 │        ├──────────────┤        │   (main)     │
│    │    │    │        │    Pane 1    │        ├────┬────┬────┤
│    │    │    │        ├──────────────┤        │ P1 │ P2 │ P3 │
└────┴────┴────┘        │    Pane 2    │        └────┴────┴────┘
                        └──────────────┘

main-vertical            tiled
┌────────┬─────┐        ┌───────┬──────┐
│        │ P1  │        │  P0   │  P1  │
│  P0    ├─────┤        ├───────┼──────┤
│ (main) │ P2  │        │  P2   │  P3  │
│        ├─────┤        └───────┴──────┘
│        │ P3  │
└────────┴─────┘
```

#### 세션 트리 뷰 다이어그램 (ASCII)

```
Prefix + s 또는 Prefix + w 로 확인:

(0) + frontend: 3 windows
      (0) + editor: 2 panes
      (1) + terminal: 1 panes
      (2) + browser: 1 panes
(1) + backend: 2 windows
      (0) + code: 2 panes
      (1) + server: 1 panes
(2) - database: 1 windows  <-- 현재 세션
      (0) > query: 1 panes
```

### 단축키 테이블

#### 세션 관리 단축키

| 단축키 | 설명 |
|--------|------|
| `Prefix + s` | 세션 트리 뷰 열기 |
| `Prefix + w` | 윈도우/세션 트리 뷰 열기 |
| `Prefix + $` | 현재 세션 이름 변경 |
| `Prefix + (` | 이전 세션으로 전환 |
| `Prefix + )` | 다음 세션으로 전환 |

#### 페인 레이아웃/크기 단축키

| 단축키 | 설명 |
|--------|------|
| `Prefix + Space` | 다음 레이아웃으로 순환 |
| `Prefix + Ctrl+화살표` | 페인 크기 1칸 조절 |
| `Prefix + Alt+화살표` | 페인 크기 5칸 조절 |

#### 복사 모드 단축키

| 단축키 | 설명 |
|--------|------|
| `Prefix + [` | 복사 모드 진입 |
| `Prefix + ]` | 붙여넣기 |
| `q` | 복사 모드 종료 |
| `Space` | 선택 시작 (vi 모드) |
| `Enter` | 선택 영역 복사 |
| `/` | 정방향 검색 |
| `?` | 역방향 검색 |
| `g` | 버퍼 맨 위로 이동 |
| `G` | 버퍼 맨 아래로 이동 |

---

## Chapter 4: 설정 & 커스터마이징 (Configuration)

**파일명:** `04-Configuration.mdx`

### 섹션 상세 Outline

#### 4.1 .tmux.conf 파일 기본 구조
- 설정 파일 위치: `~/.tmux.conf`
- 설정 파일 문법 기초
  - `set` (세션 옵션) vs `set -g` (글로벌 옵션)
  - `setw` (윈도우 옵션)
  - `bind` (키 바인딩)
  - `unbind` (키 바인딩 해제)
- 설정 즉시 적용: `Prefix + :` 후 `source-file ~/.tmux.conf`
- 설정 리로드 단축키 만들기

#### 4.2 유용한 설정 예시

##### 4.2.1 마우스 지원
- `set -g mouse on` 으로 마우스 전체 활성화
- 마우스로 페인 선택, 크기 조절, 스크롤

##### 4.2.2 Prefix 키 변경
- `Ctrl+b`를 `Ctrl+a`로 변경 (GNU Screen 스타일)
- Prefix 키 변경 시 주의사항

##### 4.2.3 키 바인딩 변경
- 직관적인 페인 분할 키: `|`와 `-`
- 페인 이동을 vim 스타일로: `h`, `j`, `k`, `l`
- 윈도우 이동 단축키 추가

##### 4.2.4 상태바 커스터마이징
- 상태바 위치 변경 (top/bottom)
- 좌측/우측 상태바 내용 설정
- 상태바 색상 변경
- 현재 윈도우 강조 표시
- 유용한 정보 표시: 시간, 호스트명, 세션명, 배터리 등

##### 4.2.5 기본 동작 개선
- 윈도우/페인 인덱스를 1부터 시작 (`base-index 1`)
- 히스토리 크기 증가 (`history-limit`)
- 이스케이프 타임 줄이기 (`escape-time 0`)
- 새 윈도우/페인에서 현재 경로 유지

#### 4.3 256 색상 / True Color 설정
- `default-terminal` 설정: `screen-256color` 또는 `tmux-256color`
- True Color (24-bit) 활성화: `terminal-overrides`
- 색상 확인 스크립트
- 터미널 에뮬레이터별 주의사항

#### 4.4 vi 모드 vs emacs 모드
- 기본값: emacs 모드
- vi 모드 설정: `set -g mode-keys vi`
- 복사 모드에서의 vi 키 바인딩 상세
- 명령줄 모드에서의 vi 키 바인딩
- vi 모드 복사 개선 설정

### 코드 예제 목록

```bash
# ~/.tmux.conf 기본 설정 파일 예시

# ------ 기본 설정 ------
# Prefix 키를 Ctrl+a로 변경
unbind C-b
set -g prefix C-a
bind C-a send-prefix

# 설정 리로드 단축키
bind r source-file ~/.tmux.conf \; display-message "Config reloaded!"

# 마우스 지원
set -g mouse on

# ------ 인덱스 설정 ------
# 윈도우 및 페인 번호를 1부터 시작
set -g base-index 1
setw -g pane-base-index 1

# 윈도우 번호 자동 재정렬
set -g renumber-windows on

# ------ 페인 분할 키 바인딩 ------
# 직관적인 분할 키
bind | split-window -h -c "#{pane_current_path}"
bind - split-window -v -c "#{pane_current_path}"
unbind '"'
unbind %

# 새 윈도우에서 현재 경로 유지
bind c new-window -c "#{pane_current_path}"

# ------ 페인 이동 (vim 스타일) ------
bind h select-pane -L
bind j select-pane -D
bind k select-pane -U
bind l select-pane -R

# ------ 페인 크기 조절 ------
bind -r H resize-pane -L 5
bind -r J resize-pane -D 5
bind -r K resize-pane -U 5
bind -r L resize-pane -R 5

# ------ 복사 모드 (vi 스타일) ------
setw -g mode-keys vi
bind -T copy-mode-vi v send -X begin-selection
bind -T copy-mode-vi y send -X copy-pipe-and-cancel "xclip -selection clipboard"

# ------ 히스토리 ------
set -g history-limit 50000

# ------ 타이밍 ------
set -sg escape-time 0
set -g display-time 4000

# ------ 색상 ------
set -g default-terminal "tmux-256color"
set -ag terminal-overrides ",xterm-256color:RGB"

# ------ 상태바 ------
set -g status-position bottom
set -g status-style 'bg=#1e1e2e fg=#cdd6f4'

set -g status-left-length 30
set -g status-left '#[fg=#1e1e2e,bg=#89b4fa,bold] #S #[default] '

set -g status-right-length 50
set -g status-right '#[fg=#bac2de] %Y-%m-%d #[fg=#cdd6f4,bold]%H:%M '

setw -g window-status-current-format '#[fg=#1e1e2e,bg=#a6e3a1,bold] #I:#W '
setw -g window-status-format '#[fg=#bac2de] #I:#W '
```

```bash
# 색상 확인 스크립트
for i in {0..255}; do
    printf "\x1b[38;5;${i}mcolor%-5i\x1b[0m" $i
    if (( (i + 1) % 8 == 0 )); then
        printf "\n"
    fi
done

# True Color 확인
printf "\x1b[38;2;255;100;0mTrueColor Test\x1b[0m\n"
```

### 다이어그램

#### 상태바 구조 (ASCII)

```
┌──────────────────────────────────────────────────────────────┐
│                      Terminal Window                          │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                                                        │  │
│  │                   Pane Content                          │  │
│  │                                                        │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ [session] 0:bash  1:vim*  2:logs  │  2026-01-01 12:00  │  │
│  └────────────────────────────────────────────────────────┘  │
│   ↑ status-left    ↑ window-status       ↑ status-right     │
└──────────────────────────────────────────────────────────────┘
```

### 단축키 테이블

#### 설정 관련 명령

| 명령/단축키 | 설명 |
|-------------|------|
| `Prefix + :` | tmux 명령 모드 진입 |
| `:source-file ~/.tmux.conf` | 설정 파일 리로드 |
| `:set -g option value` | 글로벌 옵션 설정 |
| `:setw option value` | 윈도우 옵션 설정 |
| `:show-options -g` | 글로벌 옵션 확인 |
| `:list-keys` | 모든 키 바인딩 확인 |

---

## Chapter 5: 실전 워크플로우 (Advanced)

**파일명:** `05-AdvancedWorkflows.mdx`

### 섹션 상세 Outline

#### 5.1 개발 환경 구축 (IDE-like Layout)
- 목표: tmux로 IDE와 유사한 개발 환경 만들기
- 레이아웃 예시:
  - 좌측 큰 페인: 에디터 (vim/neovim)
  - 우측 상단: 파일 탐색 또는 git 상태
  - 우측 하단: 터미널/빌드 출력
- 셸 스크립트로 환경 자동 구성

#### 5.2 SSH 원격 작업에서 tmux 활용
- 원격 서버 접속 후 tmux 사용 패턴
- 연결 끊김 후 세션 복구 시나리오
- 중첩 tmux (로컬 tmux + 원격 tmux) 처리
  - 중첩 시 Prefix 키 충돌 해결: `send-prefix`
- SSH + tmux 자동 접속 스크립트
- Mosh + tmux 조합 소개

#### 5.3 세션 공유 (Pair Programming)
- 같은 tmux 세션에 여러 사용자 접속
- `tmux -S /tmp/shared new -s pair` (소켓 공유 방식)
- tmate 소개 (tmux 기반 세션 공유 도구)
- 읽기 전용 세션 공유

#### 5.4 tmux + vim/neovim 조합
- vim에서 tmux 페인 간 이동 통합: `vim-tmux-navigator`
- 클립보드 공유 설정
- vim의 터미널 기능과 tmux 페인의 차이
- 효율적인 vim + tmux 워크플로우

#### 5.5 유용한 tmux 플러그인
- **TPM (Tmux Plugin Manager)**
  - 설치 방법
  - 플러그인 추가/제거/업데이트
- **tmux-resurrect**
  - 세션 저장 및 복원
  - vim/neovim 세션 함께 복원
- **tmux-continuum**
  - 자동 저장/복원
  - tmux 서버 시작 시 자동 복원
- **tmux-yank**: 시스템 클립보드 연동
- **tmux-sensible**: 합리적인 기본 설정 모음
- **catppuccin/tmux** 등 테마 플러그인

#### 5.6 스크립트를 이용한 환경 자동화
- **셸 스크립트 방식**: tmux 명령어를 직접 스크립트화
- **tmuxinator**
  - 설치 및 기본 사용법
  - YAML 기반 프로젝트 설정
  - 프로젝트 환경 예시
- **tmuxp**
  - 설치 및 기본 사용법
  - JSON/YAML 기반 설정
  - tmuxinator와의 비교

#### 5.7 트러블슈팅 & 자주 묻는 질문
- tmux 세션이 시작되지 않을 때
- 색상이 제대로 표시되지 않을 때
- 복사/붙여넣기가 작동하지 않을 때
- 키 바인딩이 작동하지 않을 때
- tmux 서버 완전 종료: `tmux kill-server`
- 버전 간 설정 호환성 문제

### 코드 예제 목록

```bash
# ====== 5.1: IDE-like 개발 환경 스크립트 ======
#!/bin/bash
SESSION="dev"

tmux new-session -d -s $SESSION -x 200 -y 50

# 메인 윈도우: 에디터 레이아웃
tmux rename-window -t $SESSION:1 "editor"
tmux send-keys -t $SESSION:1 "nvim ." C-m

# 우측에 터미널 페인 추가
tmux split-window -h -t $SESSION:1 -p 35
tmux send-keys -t $SESSION:1.2 "git status" C-m

# 우측을 다시 수평 분할
tmux split-window -v -t $SESSION:1.2
tmux send-keys -t $SESSION:1.3 "npm run dev" C-m

# 두 번째 윈도우: 서버/로그
tmux new-window -t $SESSION -n "logs"
tmux send-keys -t $SESSION:2 "tail -f /var/log/app.log" C-m

# 첫 번째 윈도우의 에디터 페인으로 포커스
tmux select-window -t $SESSION:1
tmux select-pane -t $SESSION:1.1

# 세션 접속
tmux attach -t $SESSION
```

```bash
# ====== 5.2: SSH + tmux 자동 접속 스크립트 ======
#!/bin/bash
# ssh-tmux.sh - SSH 접속 후 자동으로 tmux 세션에 연결
HOST=$1
SESSION=${2:-main}

ssh -t $HOST "tmux attach -t $SESSION 2>/dev/null || tmux new -s $SESSION"
```

```bash
# ====== 5.3: 세션 공유 ======
# 호스트 (세션 생성자)
tmux -S /tmp/pair-session new -s pair
chmod 777 /tmp/pair-session

# 게스트 (세션 참여자)
tmux -S /tmp/pair-session attach -t pair

# 읽기 전용 접속
tmux -S /tmp/pair-session attach -t pair -r
```

```bash
# ====== 5.5: TPM 설치 및 플러그인 설정 ======
# TPM 설치
git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm

# ~/.tmux.conf에 추가:
# 플러그인 목록
# set -g @plugin 'tmux-plugins/tpm'
# set -g @plugin 'tmux-plugins/tmux-sensible'
# set -g @plugin 'tmux-plugins/tmux-resurrect'
# set -g @plugin 'tmux-plugins/tmux-continuum'
# set -g @plugin 'tmux-plugins/tmux-yank'
#
# # tmux-resurrect 설정
# set -g @resurrect-capture-pane-contents 'on'
# set -g @resurrect-strategy-nvim 'session'
#
# # tmux-continuum 설정
# set -g @continuum-restore 'on'
# set -g @continuum-save-interval '15'
#
# # TPM 초기화 (반드시 설정 파일 맨 아래에 위치)
# run '~/.tmux/plugins/tpm/tpm'

# 플러그인 설치: Prefix + I
# 플러그인 업데이트: Prefix + U
# 플러그인 제거: Prefix + alt + u
```

```yaml
# ====== 5.6: tmuxinator 프로젝트 설정 예시 ======
# ~/.tmuxinator/webapp.yml
name: webapp
root: ~/projects/my-webapp

windows:
  - editor:
      layout: main-vertical
      panes:
        - nvim
        - git log --oneline -20
  - server:
      panes:
        - npm run dev
  - database:
      panes:
        - docker compose up -d && docker compose logs -f db
  - terminal:
      panes:
        - # empty shell

# 실행: tmuxinator start webapp
# 종료: tmuxinator stop webapp
```

```json
// ====== 5.6: tmuxp 프로젝트 설정 예시 ======
// ~/.tmuxp/webapp.json
{
  "session_name": "webapp",
  "start_directory": "~/projects/my-webapp",
  "windows": [
    {
      "window_name": "editor",
      "layout": "main-vertical",
      "panes": [
        { "shell_command": "nvim" },
        { "shell_command": "git status" }
      ]
    },
    {
      "window_name": "server",
      "panes": [
        { "shell_command": "npm run dev" }
      ]
    }
  ]
}
```

### 다이어그램

#### IDE-like 레이아웃 (ASCII)

```
┌───────────────────────────────┬──────────────────┐
│                               │   git status     │
│                               │   (Pane 2)       │
│        nvim .                 ├──────────────────┤
│       (Pane 1)                │   npm run dev    │
│                               │   (Pane 3)       │
│        65% width              │   35% width      │
└───────────────────────────────┴──────────────────┘
 [1:editor*  2:logs]                   12:00
```

#### 중첩 tmux 구조 (ASCII)

```
┌─ 로컬 tmux ──────────────────────────────────────┐
│ Prefix: Ctrl+a                                    │
│ ┌─ 원격 tmux (SSH) ─────────────────────────────┐ │
│ │ Prefix: Ctrl+b                                │ │
│ │                                               │ │
│ │  원격 작업 내용                                  │ │
│ │                                               │ │
│ │ [remote-session] 0:bash*     14:00            │ │
│ └───────────────────────────────────────────────┘ │
│ [local-session] 0:ssh*  1:local     14:00        │
└──────────────────────────────────────────────────┘

로컬 tmux 명령: Ctrl+a → 명령키
원격 tmux 명령: Ctrl+a → a → 명령키  (send-prefix)
```

#### tmux-resurrect 워크플로우 (ASCII)

```
┌──────────┐    Prefix + Ctrl+s    ┌──────────────┐
│  Running  │ ──────────────────> │  Saved State  │
│  Session  │    (저장)            │  (~/.tmux/    │
│           │                     │   resurrect/) │
└──────────┘                      └──────┬───────┘
     ↑                                   │
     │        Prefix + Ctrl+r            │
     └──────────────────────────────────┘
                  (복원)

시스템 재부팅 후에도 세션 구조와 프로그램 상태 복원 가능
```

### 단축키 테이블

#### TPM 플러그인 관리

| 단축키 | 설명 |
|--------|------|
| `Prefix + I` | 플러그인 설치 |
| `Prefix + U` | 플러그인 업데이트 |
| `Prefix + Alt+u` | 사용하지 않는 플러그인 제거 |

#### tmux-resurrect

| 단축키 | 설명 |
|--------|------|
| `Prefix + Ctrl+s` | 세션 상태 저장 |
| `Prefix + Ctrl+r` | 세션 상태 복원 |

---

## 공통 스타일 가이드

### MDX 파일 구조

각 MDX 파일은 다음 구조를 따른다:

```mdx
import { Meta } from '@storybook/blocks';

<Meta title="Part 1 - tmux Guide/Chapter N - Chapter Title" />

# 챕터 제목

## 섹션 1
...내용...

## 섹션 2
...내용...
```

### 코드 블록 스타일

- 모든 명령어는 코드 블록으로 표시
- 셸 명령어: `bash` 언어 지정
- 설정 파일: `bash` 또는 해당 언어 지정
- 출력 예시: `text` 또는 `plaintext` 지정
- 인라인 단축키: `<kbd>` 태그 또는 백틱 사용

### 다이어그램 스타일

- ASCII art를 코드 블록 내에 `text` 언어로 표시
- 박스 문자 사용: `┌ ─ ┐ │ └ ┘ ├ ┤ ┬ ┴ ┼`
- 화살표: `→ ← ↑ ↓`
- 각 다이어그램에 설명 캡션 포함

### 단축키 표기법

- Prefix 키: `Prefix` (기본값 Ctrl+b임을 명시)
- 조합키: `+`로 연결 (예: `Ctrl+b`)
- 순차입력: `→`로 연결 (예: `Prefix → d`)

---

## 예상 분량 및 우선순위

| 챕터 | 파일명 | 예상 분량 | 우선순위 |
|-------|--------|-----------|----------|
| Ch.1 Introduction | `01-Introduction.mdx` | 중 | 높음 |
| Ch.2 Basics | `02-Basics.mdx` | 상 | 높음 |
| Ch.3 Session & Window | `03-SessionWindowManagement.mdx` | 상 | 중 |
| Ch.4 Configuration | `04-Configuration.mdx` | 상 | 중 |
| Ch.5 Advanced | `05-AdvancedWorkflows.mdx` | 최상 | 중 |

---

## 참고 사항

- 모든 내용은 한국어로 작성하되, 기술 용어는 영문 병기
- 코드 예제는 복사하여 바로 실행 가능하도록 작성
- tmux 3.x 기준으로 작성 (하위 버전 차이점은 별도 표기)
- Storybook의 MDX 문법에 맞춰 작성 (Meta 태그, 코드 블록 등)
- 각 챕터는 독립적으로 읽을 수 있되, 순서대로 읽으면 학습 흐름이 자연스럽도록 구성
