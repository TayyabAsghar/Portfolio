import * as THREE from "three";

const canvas = /** @type {HTMLCanvasElement} */ (
  document.getElementById("bh-canvas")
);
if (!canvas) throw new Error("bh-canvas not found");

const isDark = () => document.documentElement.classList.contains("dark");

export const config = {
  // Particle Settings
  particles: {
    tilt: 0.15, // Positive = back is high, front is low
    size: window.innerWidth < 768 ? 0.05 : 0.09,
    count: window.innerWidth < 768 ? 6000 : 18000,
    spiralK: 2.5,
    ySpread: 0.1,
    direction: 1, // 1 for counter-clockwise, -1 for clockwise
    opacity: 0.7,
    yOffsetBase: 0, // Shift relative to BH center
    radiusMin: 0.7,
    speedBase: 0.02,
    radiusMax: 12.8,
    speedMin: 0.0005,
    colorDark: 0xffffff,
    colorLight: 0x222222,
  },
  // Sphere (Black Hole) Settings
  sphere: {
    radius: 0.7,
    shininess: 5,
    segments: 64,
    yCenter: -0.38,
    colorDark: 0x301e42,
    colorLight: 0xa78bfa, // Very light, luminous purple
    emissiveDark: 0x100a18,
    specularDark: 0x9966cc,
    emissiveLight: 0x5b21b6, // Stronger but bright glow
    specularLight: 0xffffff, // Maximum white shine
  },
  // Grid Settings
  grid: {
    rings: window.innerWidth < 768 ? 15 : 30,
    spokes: window.innerWidth < 768 ? 24 : 48,
    wellDepth: 0.6,
    spokeOuter: 11,
    radiusOuter: 8,
    wellWidth: 0.82,
    radiusInner: 0.7,
    frontBiasMultiplier: 0.3,
  },
  // Lighting Settings
  lighting: {
    rimIntensity: 1.0,
    keyIntensity: 1.5,
    fillIntensity: 1.8,
    ambientIntensity: 1.2,
    keyColorDark: 0xaa77ff,
    rimColorDark: 0x330066,
    keyColorLight: 0xc4b5fd, // Soft pastel lavender
    rimColorLight: 0xddd6fe, // Near-white violet
    fillColorDark: 0x4422bb,
    fillColorLight: 0xe0e7ff, // Softest indigo
    ambientColorDark: 0x1a0038,
    ambientColorLight: 0xffffff, // Pure white ambient for maximum clarity
    keyPos: { x: 0, y: -6, z: 3 },
    fillPos: { x: 4, y: 2, z: 3 },
    rimPos: { x: 0, y: -2, z: -4 },
  },
  // Camera Settings
  camera: {
    positionZ: () => window.innerWidth < 640 ? 7.0 : (window.innerWidth < 1024 ? 6.0 : 5.2),
    positionY: () => window.innerWidth < 640 ? 4.2 : (window.innerWidth < 1024 ? 3.8 : 3.4),
    lookAt: { x: 0, y: -1.2, z: 0 },
  },
};

/* ── soft cloud sprite: gentle radial falloff ── */
const makeCircleTex = () => {
  const sz = 128;
  const c = Object.assign(document.createElement("canvas"), {
    width: sz,
    height: sz,
  });
  const cx = c.getContext("2d");
  const r = sz / 2;
  const g = cx.createRadialGradient(r, r, 0, r, r, r);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.3, "rgba(255,255,255,0.8)");
  g.addColorStop(0.6, "rgba(255,255,255,0.3)");
  g.addColorStop(0.85, "rgba(255,255,255,0.05)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  cx.fillStyle = g;
  cx.fillRect(0, 0, sz, sz);
  return new THREE.CanvasTexture(c);
};

/* ── renderer ── */
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: false,
  alpha: true,
});
renderer.setClearColor(0x000000, 0);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 200);
camera.position.set(
  0,
  config.camera.positionY(),
  config.camera.positionZ(),
);
/* look slightly below origin to match the gravity-well funnel centre */
camera.lookAt(
  config.camera.lookAt.x,
  config.camera.lookAt.y,
  config.camera.lookAt.z,
);

/* Y position of the black hole — must match wellY(~BH radius) in buildGrid */
const BH_CENTER_Y = config.sphere.yCenter;

const spriteTex = makeCircleTex();

/* ── particles ── */
const N = config.particles.count;
const R_MIN = config.particles.radiusMin;
const R_MAX = config.particles.radiusMax;

const positions = new Float32Array(N * 3);
const colors = new Float32Array(N * 3);

/** @type {{ r:number, a:number, spd:number, y:number }[]} */
const pData = [];

for (let i = 0; i < N; i++) {
  const t = Math.pow(Math.random(), 2.6);
  const r = R_MIN + t * (R_MAX - R_MIN);
  // Generate a continuous 360-degree spread cloud (accretion disk)
  const baseAngle = Math.random() * Math.PI * 2;
  // We still add a spiral offset so that the texture stretches properly during animation,
  // but the initial distribution is completely uniform with no empty space.
  const spiralAngle =
    config.particles.direction *
    config.particles.spiralK *
    Math.log(1 + (r - R_MIN));
  const a = baseAngle + spiralAngle;
  const spd =
    config.particles.direction *
    (config.particles.speedBase * Math.pow(R_MIN / r, 1.5) +
      config.particles.speedMin);
  /* y offset: biased below sphere equator so disk sits at lower half of ball */
  const y =
    BH_CENTER_Y +
    config.particles.yOffsetBase +
    (Math.random() - 0.5) * config.particles.ySpread * (1 + t * 0.8);

  pData.push({ r, a, spd, y, t });
}

const geo = new THREE.BufferGeometry();
geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

const mat = new THREE.PointsMaterial({
  opacity: config.particles.opacity,
  map: spriteTex,
  alphaTest: 0.002,
  transparent: true,
  depthWrite: false,
  vertexColors: true,
  sizeAttenuation: true,
  size: config.particles.size, // larger soft cloud dots
  blending: THREE.AdditiveBlending,
});
scene.add(new THREE.Points(geo, mat));

/* ── scene lighting — three-point for shiny purple ball ── */
// Dim ambient: dark side stays deep purple, not black
const ambientLight = new THREE.AmbientLight(
  config.lighting.ambientColorDark,
  config.lighting.ambientIntensity,
);
scene.add(ambientLight);
// Key light: from BELOW the sphere → specular highlight appears on bottom
const keyLight = new THREE.DirectionalLight(
  config.lighting.keyColorDark,
  config.lighting.keyIntensity,
);
keyLight.position.set(
  config.lighting.keyPos.x,
  config.lighting.keyPos.y,
  config.lighting.keyPos.z,
);
scene.add(keyLight);
// Fill light: soft blue-purple from right
const fillLight = new THREE.DirectionalLight(
  config.lighting.fillColorDark,
  config.lighting.fillIntensity,
);
fillLight.position.set(
  config.lighting.fillPos.x,
  config.lighting.fillPos.y,
  config.lighting.fillPos.z,
);
scene.add(fillLight);
// Rim/back light: cold purple edge
const rimLight = new THREE.DirectionalLight(
  config.lighting.rimColorDark,
  config.lighting.rimIntensity,
);
rimLight.position.set(
  config.lighting.rimPos.x,
  config.lighting.rimPos.y,
  config.lighting.rimPos.z,
);
scene.add(rimLight);

/* ── black hole — 3D lit sphere at funnel centre ── */
const makeBH = (geo, mat) => {
  const m = new THREE.Mesh(geo, mat);
  m.position.y = BH_CENTER_Y;
  scene.add(m);
};

// Core sphere: rich purple with specular shine — MeshPhongMaterial gives clear highlight
const sphereMat = new THREE.MeshPhongMaterial({
  shininess: config.sphere.shininess,
});
makeBH(
  new THREE.SphereGeometry(
    config.sphere.radius,
    config.sphere.segments,
    config.sphere.segments,
  ),
  sphereMat,
);

/* ── grid — merged logarithmic rings + curved spokes ── */
const buildGrid = (dark) => {
  const old = scene.getObjectByName("grid");
  if (old) {
    old.geometry.dispose();
    scene.remove(old);
  }

  const lineCol = dark ? 0xffffff : 0x334155;
  const lineOp = dark ? 0.06 : 0.09;

  const gMat = new THREE.LineBasicMaterial({
    color: lineCol,
    opacity: lineOp,
    transparent: true,
    depthWrite: false,
  });

  const R0 = config.grid.radiusInner;
  const R1 = config.grid.radiusOuter;
  const nRings = config.grid.rings;
  const nSpokes = config.grid.spokes;
  const spokeR = config.grid.spokeOuter;
  const wellDepth = config.grid.wellDepth;
  const wellWidth = config.grid.wellWidth;
  const frontBiasMult = config.grid.frontBiasMultiplier;

  const wellY = (r) => -wellDepth / (r * r + wellWidth);

  const pts = [];

  // 1. Generate Rings (LineSegments need pairs of points)
  for (let i = 0; i < nRings; i++) {
    const t = i / (nRings - 1);
    const ri = R0 * Math.pow(R1 / R0, t);
    const segs = 100;
    for (let j = 0; j < segs; j++) {
      const a1 = (j / segs) * Math.PI * 2;
      const a2 = ((j + 1) / segs) * Math.PI * 2;

      const x1 = Math.cos(a1) * ri,
        z1 = Math.sin(a1) * ri;
      const x2 = Math.cos(a2) * ri,
        z2 = Math.sin(a2) * ri;

      const b1 = (z1 / ri) * frontBiasMult + 1.0;
      const b2 = (z2 / ri) * frontBiasMult + 1.0;

      pts.push(x1, wellY(ri) * b1, z1);
      pts.push(x2, wellY(ri) * b2, z2);
    }
  }

  // 2. Generate Spokes
  const spokeSeg = 56;
  for (let si = 0; si < nSpokes; si++) {
    const ang = (si / nSpokes) * Math.PI * 2;
    const cosA = Math.cos(ang),
      sinA = Math.sin(ang);
    for (let k = 0; k < spokeSeg; k++) {
      const t1 = k / spokeSeg,
        t2 = (k + 1) / spokeSeg;
      const r1 = R0 + t1 * (spokeR - R0),
        r2 = R0 + t2 * (spokeR - R0);

      const x1 = cosA * r1,
        z1 = sinA * r1;
      const x2 = cosA * r2,
        z2 = sinA * r2;

      const b1 = (z1 / r1) * frontBiasMult + 1.0;
      const b2 = (z2 / r2) * frontBiasMult + 1.0;

      pts.push(x1, wellY(r1) * b1, z1);
      pts.push(x2, wellY(r2) * b2, z2);
    }
  }

  const g = new THREE.BufferGeometry();
  g.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(pts), 3),
  );
  const grid = new THREE.LineSegments(g, gMat);
  grid.name = "grid";
  scene.add(grid);
};

/* ── Theme Application ── */
const applyTheme = () => {
  const dark = isDark();

  // 1. Update Sphere colors
  sphereMat.color.setHex(
    dark ? config.sphere.colorDark : config.sphere.colorLight,
  );
  sphereMat.emissive.setHex(
    dark ? config.sphere.emissiveDark : config.sphere.emissiveLight,
  );
  sphereMat.specular.setHex(
    dark ? config.sphere.specularDark : config.sphere.specularLight,
  );

  // 2. Update Particle colors & blending
  const pCol = new THREE.Color(
    dark ? config.particles.colorDark : config.particles.colorLight,
  );
  mat.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending;
  mat.needsUpdate = true;

  for (let i = 0; i < N; i++) {
    const t = pData[i].t;
    const bright = Math.max(0.08, 1 - t * 0.78);
    colors[i * 3] = pCol.r * bright;
    colors[i * 3 + 1] = pCol.g * bright;
    colors[i * 3 + 2] = pCol.b * bright;
  }
  geo.attributes.color.needsUpdate = true;

  // 3. Update Lights
  ambientLight.color.setHex(
    dark ? config.lighting.ambientColorDark : config.lighting.ambientColorLight,
  );
  keyLight.color.setHex(
    dark ? config.lighting.keyColorDark : config.lighting.keyColorLight,
  );
  fillLight.color.setHex(
    dark ? config.lighting.fillColorDark : config.lighting.fillColorLight,
  );
  rimLight.color.setHex(
    dark ? config.lighting.rimColorDark : config.lighting.rimColorLight,
  );

  // 4. Rebuild Grid
  buildGrid(dark);
};

// Initial setup
applyTheme();

/* rebuild when theme toggles */
new MutationObserver(() => applyTheme()).observe(document.documentElement, {
  attributes: true,
  attributeFilter: ["class"],
});

/* ── resize ── */
let rafId = 0;
new ResizeObserver((entries) => {
  const { width, height } = entries[0].contentRect;
  if (!width || !height) return;

  camera.aspect = width / height;
  camera.position.z = config.camera.positionZ();
  camera.position.y = config.camera.positionY();
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
}).observe(canvas);

/* ── animate ── */
const posArr = /** @type {Float32Array} */ (geo.attributes.position.array);

const frame = () => {
  const tilt = config.particles.tilt;
  for (let k = 0; k < N; k++) {
    const p = pData[k];
    p.a += p.spd;

    const cos = Math.cos(p.a);
    const sin = Math.sin(p.a);
    const r = p.r;

    const x = cos * r;
    const z = sin * r;

    const idx = k * 3;
    posArr[idx] = x;
    posArr[idx + 1] = p.y - z * tilt;
    posArr[idx + 2] = z;
  }
  geo.attributes.position.needsUpdate = true;
  renderer.render(scene, camera);
  rafId = requestAnimationFrame(frame);
};

document.addEventListener("visibilitychange", () => {
  if (document.hidden) cancelAnimationFrame(rafId);
  else frame();
});

frame();
