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
og.jpg            카톡 미리보기 사진 (1200×630)
js/share.js       자랑 카드 만들기·공유 (챌린지·가게)
img/              AI 일러스트 (손님 an_*.webp, 사장님 cook*.webp)
js/sim.js         굽기 엔진 (가게·챌린지가 함께 씀, 한 벌만!)
js/art.js         그림 도구 + 굽는 화면 (가게·챌린지가 함께 씀)
js/shop.js        가게 화면·저장 (저장 키 bpShopPubV1)
js/challenge.js   챌린지 화면·저장 (저장 키 bungeoppang2Pub1)
js/lb.js          순위표 연결 (Firebase)
js/firebase-config.js  Firebase 웹 설정값 (공개돼도 괜찮은 값)
js/iso.js         가게 그림(비스듬히 내려다보기)·가구 목록
js/net.js         가게 순위·구경 연결 (Firebase, shops/{uid})
docs/             이 문서, firestore.rules.txt
```

## 고칠 때 규칙

- 파일을 바꾸면 그 파일을 불러오는 html의 `?v=` 숫자를 올려요 (폰에 옛 파일이 남지 않게).
- `js/sim.js`의 규칙 숫자를 바꾸면 `SIMV`도 올려요 (옛 순위표 기록과 구분). 챌린지 규칙은 가게 업그레이드와 상관없이 항상 같아야 해요.
- Firestore 규칙을 바꾸면 `docs/firestore.rules.txt`를 Firebase 콘솔 → Firestore → 규칙에 붙여 넣고 게시.

## 운영

- **이상한 닉네임/점수**: Firebase 콘솔 → Firestore → `weeks` → 주 번호 → `scores` 에서 그 문서를 지우기.
- **점수 검증**: 주소 뒤에 `verify.html` 을 붙여 열기 → ✅/❌ 로 알려줘요.
- **무료 한도**: 하루 읽기 5만 / 쓰기 2만. 넘으면 그날은 순위표만 멈추고 요금은 안 나와요.
- **알려진 한계**: 기록은 브라우저에 저장돼요. 브라우저 데이터를 지우거나 주소가 바뀌면 처음부터예요 (→ 복구 코드 예정).
