const objectURLs = new Set();
const inputElements = {file: null, number: null};

function createInputFile() {
  const input = document.createElement("input");
  Object.assign(input, {accept: "image/*", multiple: true, type: "file"});
  return document.body.appendChild(input);
}

function createInputNumber() {
  const input = document.createElement("input");
  Object.assign(input, {min: 0, type: "number", value: 400});
  return document.body.appendChild(input);
}

async function handleChange(event) {
  objectURLs.forEach((objectURL) => {
    window.URL.revokeObjectURL(objectURL);
    objectURLs.delete(objectURL);
  });
  document.querySelectorAll("canvas").forEach((canvas) => {
    document.body.removeChild(canvas);
  });
  const {files} = event.target;
  for (const file of files) {
    if (!file.type.startsWith("image/")) continue;
    const image = new Image();
    const objectURL = window.URL.createObjectURL(file);
    objectURLs.add(objectURL);
    image.src = objectURL;
    await image.decode();
    renderDefault(image);
    ["low", "medium", "high"].forEach(renderSmoothing.bind(null, image));
    renderSupersample(image);
  }
}

function createCanvas(image) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const ratio = image.height / image.width;
  const width = Number(inputElements.number.value) || image.width;
  const height = width * ratio;
  Object.assign(canvas, {width, height});
  document.body.appendChild(canvas);
  return {canvas, ctx};
}

function drawText(canvas, ctx, text) {
  ctx.font = "bold 32px sans-serif";
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.textAlign = "center";
  ctx.fillText(text, canvas.width * 0.5, canvas.height * 0.5);
  ctx.strokeText(text, canvas.width * 0.5, canvas.height * 0.5);
}

function renderDefault(image) {
  const {canvas, ctx} = createCanvas(image);
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  drawText(canvas, ctx, "default");
}

function renderSmoothing(image, quality) {
  const {canvas, ctx} = createCanvas(image);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = quality;
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  drawText(canvas, ctx, quality);
}

function renderSupersample(image) {
  const {canvas, ctx} = createCanvas(image);
  const offscreenCanvas = document.createElement("canvas");
  const offscreenCtx = offscreenCanvas.getContext("2d");
  Object.assign(offscreenCanvas, {width: image.width, height: image.height});
  offscreenCtx.drawImage(image, 0, 0);
  const total = Math.max(
    Math.floor(Math.log(image.width / canvas.width) / Math.log(2)),
    0
  );
  const iteration = {total, count: total};
  while (iteration.count-- > 0) {
    offscreenCtx.drawImage(
      offscreenCanvas,
      0,
      0,
      offscreenCanvas.width * 0.5,
      offscreenCanvas.height * 0.5
    );
  }
  ctx.drawImage(
    offscreenCanvas,
    0,
    0,
    offscreenCanvas.width * 0.5 ** iteration.total,
    offscreenCanvas.height * 0.5 ** iteration.total,
    0,
    0,
    canvas.width,
    canvas.height
  );
  drawText(canvas, ctx, "super sample");
}

function main() {
  inputElements.file = createInputFile();
  inputElements.number = createInputNumber();
  inputElements.file.addEventListener("change", handleChange);
}

window.addEventListener("DOMContentLoaded", main, {once: true});
