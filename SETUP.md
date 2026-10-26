# 붕어빵 서바이벌 (공개판) — 올리는 방법

폴더 안의 파일을 전부 GitHub 새 저장소에 올리면 `https://kslohg-lab.github.io/bungeoppang/` 같은 주소가 생겨요.
카드 등록·결제 필요 없어요 (Firebase는 무료 Spark 요금제 그대로).
**가족 허브(my-personal-hub)와 완전히 별개로** 만들어요. 허브의 Firebase 프로젝트를 건드리지 않아요.

## A. 순위표용 Firebase 새로 만들기 (약 10분)

1. https://console.firebase.google.com → **프로젝트 추가** → 이름 `bungeoppang-public` (Google 애널리틱스는 **끄기**) → 만들기.
2. 왼쪽 **빌드 → Authentication → 시작하기 → Sign-in method → 익명** 을 켜고 저장.
3. 같은 Authentication 의 **설정 → 승인된 도메인 → 도메인 추가** 에 `kslohg-lab.github.io` 입력.
4. 왼쪽 **빌드 → Firestore Database → 데이터베이스 만들기** → 위치 `asia-northeast3 (서울)` → **프로덕션 모드로 시작** → 만들기.
5. Firestore 의 **규칙** 탭 → 안의 내용을 모두 지우고 `firestore.rules.txt` 내용을 통째로 붙여 넣기 → **게시**.
6. 톱니바퀴 **프로젝트 설정 → 일반 → 내 앱 → 웹(`</>`)** → 앱 닉네임 아무거나 → 등록. 화면에 나오는 `firebaseConfig` 중 **apiKey, authDomain, projectId, appId** 네 개를 `firebase-config.js` 의 따옴표 안에 붙여 넣기.
   (이 값들은 비밀번호가 아니라서 공개돼도 괜찮아요. 보호는 5번 규칙이 해요. 그래도 Claude에게 보낼 필요는 없어요.)

## B. GitHub Pages 로 올리기 (약 5분)

1. GitHub → **New repository** → 이름 `bungeoppang` → **Public** → 만들기. (무료 Pages 는 공개 저장소만 돼요. 이 저장소에는 게임 파일만 들어가요.)
2. **uploading an existing file** → 폴더 안의 파일을 전부(폴더째가 아니라 파일들을) 끌어다 놓기 → Commit.
3. **Settings → Pages → Branch: main / (root) → Save**. 1~2분 뒤 위쪽에 주소가 나와요.
4. 주소가 `https://kslohg-lab.github.io/bungeoppang/` 와 다르면 `index.html` 위쪽의 `og:image`, `og:url` 두 줄을 실제 주소로 고쳐 주세요 (카톡 미리보기 사진이 거기서 나와요).

## C. 처음 확인하기

1. 주소로 들어가 닉네임을 정하고 한 판 해 보기 (하루 지나면 🏆 순위표에 내 이름이 떠요 — 5단계마다, 그리고 판이 끝날 때 올라가요).
2. 안 보이면: 폰 브라우저 대신 PC 크롬에서 열어 F12 → 콘솔의 빨간 글씨를 알려 주세요.
3. 카톡에 주소를 보내 미리보기(사진·제목)가 뜨는지 확인. 예전 모양이 남아 있으면 https://developers.kakao.com/tool/debugger/sharing 에서 주소를 넣고 **초기화**.

## D. 운영 메모

- **이상한 닉네임/점수**: Firebase 콘솔 → Firestore → `weeks` → 주 번호 → `scores` 에서 그 문서를 지우면 돼요.
- **점수 검증**: 주소 뒤에 `verify.html` 을 붙여 열면, 위쪽 30명의 플레이 기록을 처음부터 다시 돌려 점수가 맞는지 ✅/❌ 로 알려줘요.
  (주소를 아는 사람은 볼 수 있지만 읽기만 해요. 검색에는 안 잡히게 해 뒀어요.)
- **무료 한도**: 하루 읽기 5만 / 쓰기 2만. 순위표를 열 때마다 30개를 읽어요. 한도가 차면 그날은 순위표만 잠깐 멈추고 요금은 안 나와요 (카드가 없으니까).
- **게임 고치기**: `sim.js`(규칙·계산), `ui.js`(화면)만 바꿔 다시 올리고, `index.html` 아래쪽 `?v=1` 숫자를 올려야 폰에 새 버전이 반영돼요. 규칙 숫자를 바꾸면 `sim.js` 의 `SIMV` 도 올리세요 (옛 기록을 구분해요). 월요일 0시에 맞춰 올리면 공정해요.
- **알려진 한계**: 로그인이 없으니 브라우저 데이터를 지우면 새 사람으로 보여요 (같은 닉네임이 한 줄 더 생길 수 있어요). 점수 조작은 규칙으로 상식 범위만 막고, 나머지는 verify.html 로 잡는 방식이에요.
