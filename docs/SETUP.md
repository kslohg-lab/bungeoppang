# 붕어빵 가게 (공개판) — 운영 메모

- 주소: https://bungeoppang-shop.vercel.app/ (Vercel 프로젝트 `bungeoppang-shop`, 저장소 `kslohg-lab/bungeoppang`의 `main`에 올리면 1분 안에 자동 배포)
- 옛 주소: https://kslohg-lab.github.io/bungeoppang/ (GitHub Pages, 같은 저장소라 함께 바뀜. 나중에 새 주소 안내로 정리)
- Firebase: `ksgame-54778` (익명 로그인 + Firestore, 무료 Spark 요금제, 카드 등록 없음)
  - 승인된 도메인: `kslohg-lab.github.io`, `bungeoppang-shop.vercel.app`. 주소를 새로 만들면 여기에 꼭 추가.

## 파일 구조

```
index.html        🔥 챌린지 (첫 화면) = 붕어빵 서바이벌 (주간 순위표)
shop.html         🏪 가게
challenge.html    옛 주소 → 첫 화면으로 넘겨 줌
verify.html       운영자용 기록 검증 (순위표 위쪽 30명을 다시 재생해 확인)
stats.html        📊 운영자 통계 (지금 접속·오늘·새로 온 사람·14일 그래프·챌린지·가게)
og.jpg            카톡 미리보기 사진 (1200×630)
js/share.js       자랑 카드 만들기·공유 (챌린지·가게)
js/news.js        📢 새 소식(패치 노트). 업데이트할 때 맨 위에 항목 추가
js/install.js     📲 앱으로 설치(홈 화면에 추가) 안내 + 서비스 워커 등록 · 기록 옮기기 화면 · 앱 권유
js/xfer.js        📦 기록 옮기기 (Firestore xfer/{6자리}, 15분·한 번만)
manifest.webmanifest  앱 이름·아이콘 (이름: 붕어빵 가게)
sw.js             서비스 워커: 항상 새 파일 먼저, 인터넷 끊기면 저장본
img/icon-*.png    앱 아이콘 (192·512), img/apple-touch-icon.png (아이폰)
js/filter.js      닉네임·가게 이름 욕설 거르기 (규칙 파일 clean()과 같은 목록)
img/              AI 일러스트 (손님 an_*.webp, 사장님 cook*.webp)
js/sim.js         굽기 엔진 (가게·챌린지가 함께 씀, 한 벌만!)
js/art.js         그림 도구 + 굽는 화면 (가게·챌린지가 함께 씀)
js/shop.js        가게 화면·저장 (저장 키 bpShopPubV1)
js/biz.js         가게 경영: 직원·월세·세금·자리 비운 동안 장사(최대 8시간) · 카페 음료 목록
js/cafe.js        ☕ 음료 만들기 (가게 도와주기 전용, 챌린지와 상관없음)
js/challenge.js   챌린지 화면·저장 (저장 키 bungeoppang2Pub1)
js/lb.js          순위표 연결 (Firebase) · 내 순위는 개수 세기(읽기 1번) · 내 순위 주변
js/stat.js        접속 기록 (stats_days / stats_new / stats_live)
js/firebase-config.js  Firebase 웹 설정값 (공개돼도 괜찮은 값)
js/iso.js         가게 그림(비스듬히 내려다보기)·가구 목록
js/net.js         가게 순위·구경 연결 (Firebase, shops/{uid})
docs/             이 문서, firestore.rules.txt
```

## 고칠 때 규칙

- 파일을 바꾸면 그 파일을 불러오는 html의 `?v=` 숫자를 올려요 (폰에 옛 파일이 남지 않게).
- 업데이트마다 `js/news.js` 맨 위에 새 소식을 적어요 (새 버전 첫 접속 때 한 번 떠요).
- 챌린지 굽기 규칙을 주중에 바꾸면 이번 주 기록 다시 재생이 어긋나요 → 다음 주 번호부터 적용 (예: sim.js `BURN_WK`).
- `js/sim.js`의 규칙 숫자를 바꾸면 `SIMV`도 올려요 (옛 순위표 기록과 구분). 챌린지 규칙은 가게 업그레이드와 상관없이 항상 같아야 해요.
- Firestore 규칙을 바꾸면 `docs/firestore.rules.txt`를 Firebase 콘솔 → Firestore → 규칙에 붙여 넣고 게시.

## 운영

- **이상한 닉네임/점수**: Firebase 콘솔 → Firestore → `weeks` → 주 번호 → `scores` 에서 그 문서를 지우기.
- **통계**: 주소 뒤에 `stats.html` → 지금 접속·오늘 접속·새로 온 사람 등. 열 때마다 읽기 30번 정도.
- **점수 검증**: 주소 뒤에 `verify.html` 을 붙여 열기 → ✅/❌ 로 알려줘요.
- **무료 한도**: 하루 읽기 5만 / 쓰기 2만. 넘으면 그날은 순위표만 멈추고 요금은 안 나와요.
- **기록 옮기기 쓰레기**: 안 쓰고 남은 번호는 Firestore `xfer`에 남아요(작아서 괜찮음). 가끔 콘솔에서 `xfer` 컬렉션을 지워도 돼요.
- **알려진 한계**: 기록은 브라우저에 저장돼요. 브라우저 데이터를 지우거나 주소가 바뀌면 처음부터예요 (→ 복구 코드 예정).
