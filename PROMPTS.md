# 나노 바나나 이미지 프롬프트 (부캉이 네컷사진)

부캉이 = **흑상어**. 실제 상어라서 팔·손이 없으니 포즈는 **지느러미, 꼬리, 몸 기울기, 표정**으로 표현해요.
귀엽고 친근한 캐릭터 느낌으로 가되, 실제 흑상어 외형(회색~검은빛 몸, 뾰족한 주둥이, 큰 등지느러미)은 유지하는 방향이에요.

> 가능하면 **부캉이 사진/기준 이미지를 첨부**하고 "Use the attached reference" 문구로 같은 외형을 유지시키세요.
> 화풍은 아래 `STYLE` 한 줄만 바꾸면 전체가 통일돼요. (예: 3D 인형풍 / 플랫 일러스트 / 스티커풍)

## 만들어야 할 파일 (assets/ 폴더에 저장)

| 파일명 | 용도 | 비고 |
|---|---|---|
| bukangi-pose1.png ~ pose4.png | 컷별 부캉이 포즈 | 배경 제거 필수(투명 PNG), 3:4 세로 비율 |
| frame-bg.jpg | 프레임 배경 (선택) | 9:16 세로 |
| frame-overlay.png | 프레임 위 장식 (선택) | 투명 PNG, 약 9:28 세로 |

---

## 0. 공통 규칙 (모든 포즈 프롬프트 앞에 붙이기)

```
Use the attached reference image of the character. Keep the design EXACTLY identical in every image.
CHARACTER: Bukangi, a black shark (dusky grey-black body, lighter belly, pointed snout, tall dorsal fin,
crescent tail). Friendly, cute, mascot-like expression with big round eyes and a gentle smile, NOT scary,
no visible blood, no aggressive teeth.
STYLE: cute 3D mascot render, soft studio lighting, clean smooth shapes, consistent proportions.
Full body, centered, entire character visible with small margin on all sides, no cropping.
Plain flat solid #FF00FF magenta background, no floor, no water, no shadow on the background,
no text, no watermark. Clean crisp edges suitable for background removal. Portrait 3:4.
```

> 나노 바나나는 진짜 투명 PNG를 못 만들어요. 마젠타 단색 배경으로 뽑은 뒤 Canva "배경 제거" 등으로 투명 PNG로 바꿔주세요.
> (몸이 회색~검정이라 초록·마젠타 어느 쪽도 괜찮아요. 가장자리에 색이 남으면 다른 색으로 다시 뽑아보세요.)
> 바다 배경이 아니라 **캐릭터만** 뽑아야 사진 위에 합성돼요.

## 1. 포즈 1 — 왼쪽 컷 (윙크 + 지느러미 브이)
```
[공통 규칙] The shark is upright and standing on its tail, body slightly tilted toward the right of the frame,
one pectoral fin raised making a cheerful V-sign shape with two small fin tips, winking, happy playful mood.
```

## 2. 포즈 2 — 오른쪽 컷 (하트)
```
[공통 규칙] The shark is upright, body slightly turned toward the left of the frame,
both pectoral fins joined above its head forming a big heart shape, eyes closed in a happy smile.
```

## 3. 포즈 3 — 가운데 아래 컷 (낮게 웅크려 손 흔들기)
```
[공통 규칙] The shark is low and compact, curled into a rounded sitting-like posture facing the viewer,
tail tucked beside the body, one pectoral fin waving hello, big smile. The silhouette is low and wide
so people can stand behind it.
```

## 4. 포즈 4 — 마지막 컷 (점프)
```
[공통 규칙] The shark leaps upward with its body arched in a dynamic curve, both pectoral fins spread wide,
tail flicking up, mouth open in a cheerful cheer (no sharp teeth shown), facing the viewer.
Small sparkle accents allowed only touching the character's silhouette.
```

---

## 5. 프레임 배경 (frame-bg.jpg)

사진 네 장이 중앙을 덮기 때문에 **가장자리와 아래쪽에만 장식**이 있으면 돼요.

```
Vertical photo-booth strip background, 9:16 portrait. Soft ocean-themed pastel gradient from light aqua
to pale cream, with a subtle repeating pattern of tiny bubbles, shells, starfish and sparkles.
Denser decorations along the left and right edges and at the bottom 15%, while the center area stays
calm and low-contrast. Cute, clean, Korean four-cut photo booth style.
No characters, no text, no photo frames, no borders drawn in the middle.
```

## 6. 프레임 장식 오버레이 (frame-overlay.png, 선택)

```
Sticker decorations for a vertical photo strip, tall narrow 9:28 layout, on a plain solid #FF00FF background.
Small bubbles, waves, shells, stars and sparkles only at the outer corners and the very bottom area.
Leave the entire center empty. Flat cute sticker style with white outline, no text, no characters.
```
(배경 제거 후 투명 PNG로 사용하세요.)

---

## 7. 제작 후 체크리스트
- [ ] 포즈 4장의 얼굴·몸 색감이 서로 같은가? (흑상어 특유의 회색~검정 톤 유지)
- [ ] 캐릭터 둘레가 깔끔하게 지워졌는가? (마젠타 테두리 남으면 가장자리 다듬기)
- [ ] 무섭게 나온 컷은 없는가? (이빨·표정이 과하면 "gentle smile, closed mouth"로 재생성)
- [ ] 파일명이 정확한가? (`bukangi-pose1.png` ~ `pose4.png`)
- [ ] 이미지 크기는 가로 600~900px 정도로 줄이면 사이트가 빨라져요.

## 8. 참고
- 부산 앞바다 화제 분위기를 살리고 싶다면 5번 배경 프롬프트에 `Busan coastal vibe, Gwangan Bridge silhouette
  at the very bottom edge` 같은 문구를 추가해 보세요. (실존 랜드마크는 작게, 가장자리에만)
