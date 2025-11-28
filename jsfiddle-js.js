import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// -------------------------------------------------------------
// Helper: simple sponge texture as dots on a canvas
// -------------------------------------------------------------
function makeSpongeTexture(bgColor, dotColor) {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 250; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 1 + Math.random() * 2;
    ctx.globalAlpha = 0.3 + Math.random() * 0.4;
    ctx.fillStyle = dotColor;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1.8, 1.8);
  return tex;
}

// -------------------------------------------------------------
// Scene / camera / renderer
// -------------------------------------------------------------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new THREE.PerspectiveCamera(
  40,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(4.2, 4.0, 4.2);
camera.lookAt(0, 1, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// -------------------------------------------------------------
// Stand: slim / victorian-ish, smaller base
// -------------------------------------------------------------
const standGroup = new THREE.Group();
scene.add(standGroup);

const standMat = new THREE.MeshStandardMaterial({
  color: 0x111015,
  roughness: 0.35,
  metalness: 0.2
});

const plateRadius = 2.4;
const plateHeight = 0.16;
const plate = new THREE.Mesh(
  new THREE.CylinderGeometry(plateRadius, plateRadius, plateHeight, 64),
  standMat
);
plate.position.y = 0;
plate.receiveShadow = true;
standGroup.add(plate);

// slender decorative stem using LatheGeometry
const profile = [];
profile.push(new THREE.Vector2(0.0, -1.5));
profile.push(new THREE.Vector2(0.55, -1.5));
profile.push(new THREE.Vector2(0.85, -1.2));
profile.push(new THREE.Vector2(0.55, -0.7));
profile.push(new THREE.Vector2(0.35, -0.2));
profile.push(new THREE.Vector2(0.40, 0.0));
const stemGeom = new THREE.LatheGeometry(profile, 64);
const stem = new THREE.Mesh(stemGeom, standMat);
stem.position.y = -plateHeight / 2;
stem.castShadow = true;
stem.receiveShadow = true;
standGroup.add(stem);

// small base disk
const baseRadius = 1.2;
const baseHeight = 0.2;
const base = new THREE.Mesh(
  new THREE.CylinderGeometry(baseRadius, baseRadius, baseHeight, 64),
  standMat
);
base.position.y = -1.6;
base.castShadow = true;
base.receiveShadow = true;
standGroup.add(base);

// shadow catcher
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.ShadowMaterial({ opacity: 0.2 })
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -1.8;
ground.receiveShadow = true;
scene.add(ground);

// -------------------------------------------------------------
// Cake: use Code A's createCakeLayer pattern + Code B's textures
// -------------------------------------------------------------
const cakeGroup = new THREE.Group();
scene.add(cakeGroup);

const cakeHeight = 2.0;
const frostingRadius = 2.0;
const innerRadius = 1.9;

// Slice missing = 90 degrees
const missingAngle = Math.PI / 2;
const startAngle   = missingAngle;      // we keep the 270° behind it
const endAngle     = 2 * Math.PI;

// Generic wedge-layer builder – like createCakeLayer from Code A,
// but accepts either color or a material (for textures).
function createCakeLayer(radius, depth, materialOrColor, roughness = 0.7) {
  const shape = new THREE.Shape();
  shape.absarc(0, 0, radius, startAngle, endAngle, false);
  shape.lineTo(0, 0);
  shape.closePath();

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: false
  });

  geom.center();

  let mat;
  if (materialOrColor instanceof THREE.Material) {
    mat = materialOrColor;
  } else {
    mat = new THREE.MeshStandardMaterial({
      color: materialOrColor,
      roughness,
      metalness: 0.1
    });
  }

  const mesh = new THREE.Mesh(geom, mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.rotation.x = Math.PI / 2;
  return mesh;
}

// Materials / textures (from Code B)
const texYellow = makeSpongeTexture("#ffe8a6", "#d8b262");
const texRed    = makeSpongeTexture("#ff6b5c", "#c4332f");

const yellowMat = new THREE.MeshStandardMaterial({
  map: texYellow,
  roughness: 0.9,
  metalness: 0.03
});
const creamMat = new THREE.MeshStandardMaterial({
  color: 0xfffbf2,
  roughness: 0.95,
  metalness: 0.02
});
const redMat = new THREE.MeshStandardMaterial({
  map: texRed,
  roughness: 0.9,
  metalness: 0.03
});

const frostingMat = new THREE.MeshStandardMaterial({
  color: 0xfff165,
  roughness: 0.6,
  metalness: 0.05,
  polygonOffset: true,
  polygonOffsetFactor: 1,
  polygonOffsetUnits: 1
});

const frosting = createCakeLayer(frostingRadius, cakeHeight, frostingMat);
cakeGroup.add(frosting);

// Inner layers: red sponge (bottom), cream, yellow sponge (top)
const redHeight    = cakeHeight * 0.45;
const creamHeight  = cakeHeight * 0.15;
const yellowHeight = cakeHeight * 0.25;
const totalLayerH  = redHeight + creamHeight + yellowHeight;
const spare        = cakeHeight - totalLayerH;
const gapTop       = spare * 0.5;
const gapBottom    = spare * 0.5;

const redLayer    = createCakeLayer(innerRadius, redHeight, redMat);
const creamLayer  = createCakeLayer(innerRadius, creamHeight, creamMat);
const yellowLayer = createCakeLayer(innerRadius, yellowHeight, yellowMat);

const bottomY = -cakeHeight / 2 + gapBottom;
redLayer.position.y = bottomY + redHeight / 2;
creamLayer.position.y = redLayer.position.y + redHeight / 2 + creamHeight / 2;
yellowLayer.position.y =
  creamLayer.position.y + creamHeight / 2 + yellowHeight / 2;

cakeGroup.add(redLayer);
cakeGroup.add(creamLayer);
cakeGroup.add(yellowLayer);

// Position the whole cake on the stand
const plateTopY = plate.position.y + plateHeight / 2;
const cakeBottomGap = 0.02;
const cakeCenterY =
  plateTopY + cakeBottomGap + cakeHeight / 2;
cakeGroup.position.y = cakeCenterY;

// Rotate cake so the missing slice faces the camera nicely
cakeGroup.rotation.y = -Math.PI / 4;

// -------------------------------------------------------------
// Poured icing drips along outer curved side (reuse from Code B)
// -------------------------------------------------------------
const dripMaterial = frostingMat;
const dripCylinderGeom = new THREE.CylinderGeometry(0.07, 0.07, 0.45, 12);
const dripSphereGeom   = new THREE.SphereGeometry(0.09, 16, 16);

const keptAngle = 2 * Math.PI - missingAngle;
const dripAngles = [];
const dripCount = 7;

for (let i = 0; i < dripCount; i++) {
  const t = (i + 1) / (dripCount + 2);
  const angle = startAngle + t * keptAngle * 0.8; // avoid edges
  dripAngles.push(angle);
}

dripAngles.forEach((angle, idx) => {
  const dripGroup = new THREE.Group();
  const scaleY = 0.9 + 0.2 * Math.sin(idx * 1.1);

  const body = new THREE.Mesh(
    dripCylinderGeom.clone().scale(1, scaleY, 1),
    dripMaterial
  );
  const drop = new THREE.Mesh(dripSphereGeom, dripMaterial);

  const topY = cakeHeight / 2 - 0.2;
  const fullLen = 0.45 * scaleY;
  body.position.y = topY - fullLen / 2;
  drop.position.y = topY - fullLen;

  dripGroup.add(body);
  dripGroup.add(drop);

  const r = frostingRadius + 0.02;
  dripGroup.position.set(
    Math.cos(angle) * r,
    0,
    Math.sin(angle) * r
  );

  body.castShadow = drop.castShadow = true;
  body.receiveShadow = drop.receiveShadow = true;
  cakeGroup.add(dripGroup);
});

// -------------------------------------------------------------
// Lights
// -------------------------------------------------------------
const ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient);

const spot = new THREE.SpotLight(0xffffff, 0.9);
spot.position.set(6, 8, 4);
spot.angle = Math.PI / 5;
spot.penumbra = 0.45;
spot.decay = 2;
spot.distance = 40;
spot.castShadow = true;
spot.shadow.mapSize.width = 2048;
spot.shadow.mapSize.height = 2048;
scene.add(spot);

const fill = new THREE.DirectionalLight(0xffffff, 0.35);
fill.position.set(-5, 4, -4);
scene.add(fill);

// -------------------------------------------------------------
// Render loop
// -------------------------------------------------------------
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

