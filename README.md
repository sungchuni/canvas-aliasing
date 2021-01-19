# 캔버스 얼라이어싱

직접 파일을 업로드하여 Canvas API의 이미지 리스케일링 시 얼라이어싱 현상을 비교합니다. 화면에 렌더링되는 이미지는 너비width를 지정할 수 있으며, 아래와 같은 목록의 결과물이 출력됩니다.

- default: 대조군
- low: `CanvasRenderingContext2D#imageSmoothingQuality = "low"`
- medium: `CanvasRenderingContext2D#imageSmoothingQuality = "medium"`
- high: `CanvasRenderingContext2D#imageSmoothingQuality = "high"`
- super sample: [슈퍼샘플링](https://en.wikipedia.org/wiki/Supersampling) 적용

적당한 이미지가 없을 경우에는 이 [이미지](https://img1.goodfon.com/original/2560x1600/e/a2/abstrakciya-linii-poloski.jpg)를 사용하셔요. 이 스택오버플로의 [답글](https://stackoverflow.com/questions/17861447/html5-canvas-drawimage-how-to-apply-antialiasing)을 참조하였습니다.
