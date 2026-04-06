/**
 * ODIN — Three.js Scene Library
 * Reusable 3D scenes for each page
 * Requires three.min.js (r128) to be loaded first
 */

/* ═══════════════════════════════════════════════════
   SCENE: HERO GLOBE  (index.html)
   ═══════════════════════════════════════════════════ */
function initHeroGlobe(containerId) {
  const container = document.getElementById(containerId);
  if (!container || typeof THREE === 'undefined') return;

  const W = container.clientWidth  || window.innerWidth;
  const H = container.clientHeight || window.innerHeight;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%';
  container.appendChild(renderer.domElement);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 1000);
  camera.position.set(0, 0, 5.8);

  // Earth sphere
  const earthGeo = new THREE.SphereGeometry(2.1, 128, 128);
  const earthMat = new THREE.MeshPhongMaterial({
    color: 0x0f2f6a, emissive: 0x05182a, specular: 0x2244aa, shininess: 30,
    transparent: true, opacity: 0.96,
  });
  const earth = new THREE.Mesh(earthGeo, earthMat);
  scene.add(earth);

  // Soft surface glow
  const glow = new THREE.Mesh(
    new THREE.SphereGeometry(2.1, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0x79c2ff, transparent: true, opacity: 0.14, blending: THREE.AdditiveBlending, side: THREE.FrontSide })
  );
  glow.position.set(0.6, 0.3, 0);
  scene.add(glow);

  // Grid overlay
  const grid = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.SphereGeometry(2.14, 56, 56)),
    new THREE.LineBasicMaterial({ color: 0x4da6ff, transparent: true, opacity: 0.08 })
  );
  scene.add(grid);

  // Wireframe overlay
  const wMesh = new THREE.Mesh(
    new THREE.SphereGeometry(2.14, 38, 38),
    new THREE.MeshBasicMaterial({ color: 0x1a3a6a, wireframe: true, transparent: true, opacity: 0.1 })
  );
  scene.add(wMesh);

  // Atmosphere glow
  scene.add(new THREE.Mesh(
    new THREE.SphereGeometry(2.26, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0x1c649f, transparent: true, opacity: 0.14, side: THREE.FrontSide })
  ));

  // Soft orbital halo
  const halo = new THREE.Mesh(
    new THREE.TorusGeometry(2.6, 0.018, 16, 180),
    new THREE.MeshBasicMaterial({ color: 0xc8a96e, transparent: true, opacity: 0.12 })
  );
  halo.rotation.x = 0.44;
  scene.add(halo);

  // Orbiting moon
  const moon = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 16, 16),
    new THREE.MeshPhongMaterial({ color: 0xeaeaea, emissive: 0x111111, shininess: 10 })
  );
  scene.add(moon);

  // Distant sun accent
  const sunAccent = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 12, 12),
    new THREE.MeshBasicMaterial({ color: 0xffd18c, transparent: true, opacity: 0.95 })
  );
  sunAccent.position.set(-4.2, 1.2, -1.5);
  scene.add(sunAccent);

  // Orbit ellipses
  [2.2, 2.65, 3.15].forEach((r, i) => {
    const pts = [];
    for (let a = 0; a <= Math.PI * 2; a += 0.04) {
      pts.push(new THREE.Vector3(
        Math.cos(a) * r,
        Math.sin(a) * r * 0.35,
        Math.sin(a) * r
      ));
    }
    scene.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineBasicMaterial({ color: 0xc8a96e, transparent: true, opacity: 0.06 + i * 0.03 })
    ));
  });

  // Spacecraft
  const ships = [];
  [
    { r: 2.45, speed: 0.009, yOff: 0.3,  phase: 0 },
    { r: 2.95, speed: 0.005, yOff: -0.2, phase: 2 },
    { r: 3.35, speed: 0.003, yOff: 0.1,  phase: 4 },
  ].forEach(cfg => {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xc8a96e })
    );
    scene.add(mesh);
    ships.push({ mesh, ...cfg, angle: cfg.phase });
  });

  // Background stars
  const sPos = new Float32Array(2200 * 3);
  for (let i = 0; i < sPos.length; i++) sPos[i] = (Math.random() - 0.5) * 200;
  const starsBG = new THREE.Points(
    Object.assign(new THREE.BufferGeometry(), {
      attributes: { position: new THREE.BufferAttribute(sPos, 3) }
    }),
    new THREE.PointsMaterial({ color: 0xffffff, size: 0.14, transparent: true, opacity: 0.55 })
  );
  scene.add(starsBG);

  // Lights
  scene.add(Object.assign(new THREE.AmbientLight(0x112233, 0.5)));
  const sun = new THREE.DirectionalLight(0x4488ff, 1.2);
  sun.position.set(5, 3, 5); scene.add(sun);
  scene.add(Object.assign(new THREE.DirectionalLight(0xc8a96e, 0.4), { position: new THREE.Vector3(-5, -2, -3) }));

  let mox = 0, moy = 0;
  document.addEventListener('mousemove', e => {
    mox = (e.clientX / window.innerWidth  - 0.5) * 0.45;
    moy = (e.clientY / window.innerHeight - 0.5) * 0.28;
  });

  let t = 0;
  const animate = () => {
    requestAnimationFrame(animate);
    t += 0.008;
    earth.rotation.y += 0.0012;
    earth.rotation.x  = moy * 0.23;
    earth.rotation.z  = mox * 0.12;
    glow.rotation.y += 0.0025;
    grid.rotation.y  = earth.rotation.y * 0.95;
    wMesh.rotation.copy(earth.rotation);
    halo.rotation.z += 0.0007;
    moon.position.set(
      Math.cos(t * 0.74) * 3.45,
      Math.sin(t * 0.48) * 0.5,
      Math.sin(t * 0.74) * 3.45
    );
    ships.forEach(s => {
      s.angle += s.speed;
      s.mesh.position.set(
        Math.cos(s.angle) * s.r,
        s.yOff + Math.sin(s.angle * 0.5) * 0.2,
        Math.sin(s.angle) * s.r
      );
    });
    camera.position.x += (mox * 0.55 - camera.position.x) * 0.04;
    camera.position.y += (-moy * 0.28 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  };
  animate();

  window.addEventListener('resize', () => {
    const W2 = container.clientWidth, H2 = container.clientHeight;
    renderer.setSize(W2, H2);
    camera.aspect = W2 / H2;
    camera.updateProjectionMatrix();
  });
}

/* ═══════════════════════════════════════════════════
   SCENE: NODE NETWORK  (architecture.html)
   ═══════════════════════════════════════════════════ */
function initNodeNetwork(containerId) {
  const container = document.getElementById(containerId);
  if (!container || typeof THREE === 'undefined') return;

  const W = container.clientWidth, H = container.clientHeight;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%';
  container.appendChild(renderer.domElement);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
  camera.position.set(0, 0, 8);

  const colors   = [0xc8a96e, 0x4da6ff, 0x39ff88, 0xff3d3d, 0xe8d49e, 0x8888ff];
  const nodeGeo  = new THREE.SphereGeometry(0.13, 16, 16);
  const nodes    = [];

  for (let i = 0; i < 18; i++) {
    const phi   = Math.acos(-1 + (2 * i) / 18);
    const theta = Math.sqrt(18 * Math.PI) * phi;
    const mesh  = new THREE.Mesh(nodeGeo, new THREE.MeshBasicMaterial({
      color: colors[i % colors.length], transparent: true, opacity: 0.85,
    }));
    mesh.position.set(
      Math.sin(phi) * Math.cos(theta) * 3,
      Math.sin(phi) * Math.sin(theta) * 3,
      Math.cos(phi) * 3
    );
    mesh.userData = { ox: mesh.position.x, oy: mesh.position.y, oz: mesh.position.z, phase: Math.random() * Math.PI * 2 };
    scene.add(mesh);
    nodes.push(mesh);

    // Glow ring around each node
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.19, 0.27, 32),
      new THREE.MeshBasicMaterial({ color: colors[i % colors.length], transparent: true, opacity: 0.28, side: THREE.DoubleSide })
    );
    ring.position.copy(mesh.position);
    ring.lookAt(0, 0, 0);
    scene.add(ring);
  }

  // Connections
  nodes.forEach((n, i) => {
    nodes.slice(i + 1).forEach(m => {
      if (Math.random() < 0.32) {
        scene.add(new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([n.position.clone(), m.position.clone()]),
          new THREE.LineBasicMaterial({ color: 0x1e1e1e, transparent: true, opacity: 0.45 })
        ));
      }
    });
  });

  // Central brain
  scene.add(new THREE.Mesh(
    new THREE.SphereGeometry(0.82, 32, 32),
    new THREE.MeshPhongMaterial({ color: 0x090920, emissive: 0x040412, transparent: true, opacity: 0.6 })
  ));
  scene.add(new THREE.Mesh(
    new THREE.SphereGeometry(0.84, 20, 20),
    new THREE.MeshBasicMaterial({ color: 0x1a1a50, wireframe: true, transparent: true, opacity: 0.25 })
  ));

  scene.add(Object.assign(new THREE.AmbientLight(0x111133, 1)));
  const dl = new THREE.DirectionalLight(0xc8a96e, 1.6);
  dl.position.set(5, 5, 5); scene.add(dl);

  let mox = 0, moy = 0;
  document.addEventListener('mousemove', e => {
    mox = (e.clientX / window.innerWidth  - 0.5) * 0.7;
    moy = (e.clientY / window.innerHeight - 0.5) * 0.5;
  });

  let t = 0;
  const animate = () => {
    requestAnimationFrame(animate);
    t += 0.008;
    nodes.forEach(n => {
      n.position.x = n.userData.ox + Math.sin(t + n.userData.phase) * 0.16;
      n.position.y = n.userData.oy + Math.cos(t + n.userData.phase) * 0.11;
    });
    camera.position.x += (mox * 2.2 - camera.position.x) * 0.03;
    camera.position.y += (-moy * 2  - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
    scene.rotation.y += 0.003;
    renderer.render(scene, camera);
  };
  animate();

  window.addEventListener('resize', () => {
    const W2 = container.clientWidth, H2 = container.clientHeight;
    renderer.setSize(W2, H2); camera.aspect = W2 / H2; camera.updateProjectionMatrix();
  });
}

/* ═══════════════════════════════════════════════════
   SCENE: COMPLETED TRAJECTORY  (report.html)
   ═══════════════════════════════════════════════════ */
function initReportScene(containerId) {
  const container = document.getElementById(containerId);
  if (!container || typeof THREE === 'undefined') return;

  const W = container.clientWidth, H = container.clientHeight;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%';
  container.appendChild(renderer.domElement);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
  camera.position.set(0, 2, 8);

  const addPlanet = (geo, mat, pos) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(...pos);
    scene.add(m);
    return m;
  };

  const earth = addPlanet(
    new THREE.SphereGeometry(0.9, 32, 32),
    new THREE.MeshPhongMaterial({ color: 0x0a1a4a, emissive: 0x030d24, specular: 0x1a3a8a, shininess: 25 }),
    [-3, -1, 0]
  );
  scene.add(new THREE.Mesh(
    new THREE.SphereGeometry(0.92, 20, 20),
    new THREE.MeshBasicMaterial({ color: 0x0a2060, wireframe: true, transparent: true, opacity: 0.18 })
  )).position.set(-3, -1, 0);

  const moon = addPlanet(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshPhongMaterial({ color: 0x2a2416, emissive: 0x100e08, specular: 0x3a3220, shininess: 8 }),
    [3, 1.5, 0]
  );

  // Completed path (gold)
  const pathPts = [];
  for (let t = 0; t <= 1; t += 0.018) {
    pathPts.push(new THREE.Vector3(
      THREE.MathUtils.lerp(-3, 3, t) + Math.sin(t * Math.PI) * 0.55,
      THREE.MathUtils.lerp(-1, 1.5, t) + Math.sin(t * Math.PI) * 1.55,
      Math.sin(t * Math.PI) * 0.5
    ));
  }
  scene.add(new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(pathPts),
    new THREE.LineBasicMaterial({ color: 0xc8a96e, transparent: true, opacity: 0.75 })
  ));

  // Ghost baseline (dimmer)
  const basePts = pathPts.map(p => new THREE.Vector3(p.x, p.y - Math.sin((p.x + 3) / 6 * Math.PI) * 0.3, p.z));
  scene.add(new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(basePts),
    new THREE.LineBasicMaterial({ color: 0x2a2a2a, transparent: true, opacity: 0.5 })
  ));

  // Spacecraft at Moon
  const ship = new THREE.Mesh(
    new THREE.SphereGeometry(0.09, 12, 12),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  ship.position.set(3.75, 1.5, 0);
  scene.add(ship);

  // Green orbit ring around moon
  const orbitPts = [];
  for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.08) {
    orbitPts.push(new THREE.Vector3(3 + Math.cos(a) * 0.82, 1.5 + Math.sin(a) * 0.32, 0));
  }
  scene.add(new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(orbitPts),
    new THREE.LineBasicMaterial({ color: 0x39ff88, transparent: true, opacity: 0.55 })
  ));

  // BG stars
  const sp = new Float32Array(1600 * 3);
  for (let i = 0; i < sp.length; i++) sp[i] = (Math.random() - 0.5) * 30;
  scene.add(new THREE.Points(
    Object.assign(new THREE.BufferGeometry(), { attributes: { position: new THREE.BufferAttribute(sp, 3) } }),
    new THREE.PointsMaterial({ color: 0xffffff, size: 0.09, transparent: true, opacity: 0.5 })
  ));

  scene.add(Object.assign(new THREE.AmbientLight(0x111133, 0.7)));
  const dl = new THREE.DirectionalLight(0xc8a96e, 1.2);
  dl.position.set(8, 5, 5); scene.add(dl);

  let mox = 0, moy = 0;
  document.addEventListener('mousemove', e => {
    mox = (e.clientX / window.innerWidth  - 0.5) * 0.45;
    moy = (e.clientY / window.innerHeight - 0.5) * 0.32;
  });

  const animate = () => {
    requestAnimationFrame(animate);
    earth.rotation.y += 0.0022;
    moon.rotation.y  += 0.001;
    camera.position.x += (mox * 1.6 - camera.position.x) * 0.03;
    camera.position.y += (2 - moy - camera.position.y) * 0.03;
    camera.lookAt(0, 0.5, 0);
    renderer.render(scene, camera);
  };
  animate();

  window.addEventListener('resize', () => {
    const W2 = container.clientWidth, H2 = container.clientHeight;
    renderer.setSize(W2, H2); camera.aspect = W2 / H2; camera.updateProjectionMatrix();
  });
}
