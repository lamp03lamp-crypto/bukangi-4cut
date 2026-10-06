# 부캉이 인생네컷

브라우저에서 4컷 사진을 찍고 부캉이 프레임으로 합성해 다운로드하는 정적 웹사이트입니다.
사진은 서버로 전송되지 않고 내 기기 안에서만 처리됩니다.

## 사용 준비
1. `assets/` 폴더를 만들고 이미지를 넣어주세요 (자세한 제작법은 `PROMPTS.md`).
   - `bukangi-pose1.png` ~ `bukangi-pose4.png` (투명 PNG, 필수)
   - `frame-bg.jpg`, `frame-overlay.png` (선택)
   - 이미지가 없어도 점선 박스 자리표시로 동작 확인은 가능해요.

## GitHub Pages 배포
1. GitHub에서 새 저장소 생성 (예: `bukangi-4cut`)
2. 이 폴더의 파일을 저장소 루트에 업로드/푸시
3. 저장소 **Settings → Pages → Build and deployment**
   - Source: `Deploy from a branch`, Branch: `main` / `/ (root)`
4. 몇 분 뒤 `https://<아이디>.github.io/bukangi-4cut/` 에서 접속

> 카메라는 HTTPS 또는 localhost에서만 동작합니다 (GitHub Pages는 HTTPS 제공).

## 로컬 테스트
```
python3 -m http.server 8000
```
브라우저에서 `http://localhost:8000` 접속. (파일을 더블클릭해서 열면 카메라가 동작하지 않을 수 있어요.)

## 커스터마이징 (`app.js` 상단)
- `SHOTS`: 컷별 부캉이 이미지·위치(`x`,`y`)·크기(`w`)·안내 문구
- `FRAME_TITLE`: 프레임 하단 문구
- `CELL_W/CELL_H`, `PAD`, `GAP`, `FOOTER`: 프레임 규격
