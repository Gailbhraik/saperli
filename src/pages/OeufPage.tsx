import { useEffect, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import * as THREE from 'three';

interface OeufPageProps {
  onBack: () => void;
}

// Vertex Shader pour l'œuf transparent
const eggVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  
  uniform float time;
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    vUv = uv;
    
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment Shader pour l'œuf transparent avec effet verre
const eggFragmentShader = `
  uniform float time;
  uniform vec3 color1;
  uniform vec3 color2;
  
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  
  void main() {
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - abs(dot(vNormal, viewDirection)), 2.5);
    
    // Effet de verre/membrane très transparent
    vec3 baseColor = mix(color2, color1, fresnel * 0.7);
    
    // Lignes organiques plus subtiles
    float lines = sin(vUv.y * 80.0 + time) * 0.5 + 0.5;
    lines *= sin(vUv.x * 50.0 - time * 0.5) * 0.5 + 0.5;
    lines = pow(lines, 2.0);
    
    // Veines sur la surface - plus fines et subtiles
    float veins = sin(vPosition.y * 15.0 + vPosition.x * 12.0 + time * 0.3) * 0.5 + 0.5;
    veins = pow(veins, 5.0) * 0.2;
    
    baseColor += vec3(veins * 0.4, veins * 0.05, veins * 0.05);
    
    // Transparence très élevée - seulement les bords sont visibles
    float alpha = fresnel * 0.4 + 0.05;
    alpha += lines * 0.02;
    alpha += veins * 0.1;
    
    // Les bords de l'œuf sont plus visibles
    float edgeGlow = pow(fresnel, 1.5) * 0.3;
    baseColor += color1 * edgeGlow;
    
    // Pulsation subtile
    float pulse = sin(time * 2.0) * 0.05 + 0.95;
    
    gl_FragColor = vec4(baseColor * pulse, alpha);
  }
`;

// Vertex Shader pour l'embryon
const embryoVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  
  uniform float time;
  
  // Simplex noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
            
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  
  void main() {
    vUv = uv;
    vPosition = position;
    
    // Déformation organique de l'embryon
    float noise1 = snoise(position * 2.0 + time * 0.5) * 0.08;
    float noise2 = snoise(position * 4.0 - time * 0.3) * 0.04;
    
    // Mouvement de respiration
    float breathe = sin(time * 1.5) * 0.03;
    
    vec3 newPosition = position + normal * (noise1 + noise2 + breathe);
    
    vNormal = normalize(normalMatrix * normal);
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

// Fragment Shader pour l'embryon monstrueux
const embryoFragmentShader = `
  uniform float time;
  uniform vec3 baseColor;
  uniform vec3 veinColor;
  
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  
  void main() {
    // Couleur de base chair/organique
    vec3 color = baseColor;
    
    // Veines pulsantes
    float vein1 = sin(vPosition.x * 20.0 + vPosition.y * 15.0 + time * 2.0);
    float vein2 = sin(vPosition.y * 25.0 + vPosition.z * 18.0 - time * 1.5);
    float veins = pow(max(vein1, vein2), 8.0);
    
    color = mix(color, veinColor, veins * 0.7);
    
    // Texture organique
    float organic = noise(vUv * 20.0 + time * 0.2);
    color += organic * 0.1;
    
    // Éclairage
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    float diff = max(dot(vNormal, lightDir), 0.0);
    
    // Subsurface scattering (lumière à travers la peau)
    float sss = pow(max(dot(-lightDir, vNormal), 0.0), 2.0) * 0.5;
    
    vec3 ambient = color * 0.3;
    vec3 diffuse = color * diff * 0.6;
    vec3 scatter = veinColor * sss;
    
    vec3 finalColor = ambient + diffuse + scatter;
    
    // Pulsation cardiaque
    float heartbeat = sin(time * 4.0) * 0.5 + 0.5;
    heartbeat = pow(heartbeat, 4.0);
    finalColor += veinColor * heartbeat * 0.2;
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

// Shader pour le fond style Hatom
const backgroundVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const backgroundFragmentShader = `
  uniform float time;
  uniform vec2 resolution;
  uniform vec2 mouse;
  
  varying vec2 vUv;
  
  // Simplex noise 2D
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for(int i = 0; i < 6; i++) {
      value += amplitude * snoise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }
  
  void main() {
    vec2 uv = vUv;
    vec2 aspect = vec2(resolution.x / resolution.y, 1.0);
    vec2 centeredUv = (uv - 0.5) * aspect;
    
    // Distance du centre
    float dist = length(centeredUv);
    
    // Grille principale style Hatom
    vec2 gridUv = uv * 50.0;
    float gridX = smoothstep(0.95, 1.0, abs(sin(gridUv.x * 3.14159)));
    float gridY = smoothstep(0.95, 1.0, abs(sin(gridUv.y * 3.14159)));
    float grid = max(gridX, gridY) * 0.15;
    
    // Grille secondaire plus fine
    vec2 gridUv2 = uv * 150.0;
    float grid2X = smoothstep(0.97, 1.0, abs(sin(gridUv2.x * 3.14159)));
    float grid2Y = smoothstep(0.97, 1.0, abs(sin(gridUv2.y * 3.14159)));
    float grid2 = max(grid2X, grid2Y) * 0.08;
    
    // Lignes diagonales animées
    float diagonal1 = sin((uv.x + uv.y) * 100.0 + time * 0.5) * 0.5 + 0.5;
    diagonal1 = smoothstep(0.98, 1.0, diagonal1) * 0.1;
    
    float diagonal2 = sin((uv.x - uv.y) * 80.0 - time * 0.3) * 0.5 + 0.5;
    diagonal2 = smoothstep(0.98, 1.0, diagonal2) * 0.08;
    
    // Noise animé
    float noise1 = fbm(uv * 3.0 + time * 0.1);
    float noise2 = fbm(uv * 5.0 - time * 0.15);
    
    // Couleur de base - noir profond
    vec3 color = vec3(0.02, 0.02, 0.03);
    
    // Ajouter les grilles (rouge sombre)
    vec3 gridColor = vec3(0.4, 0.05, 0.05);
    color += gridColor * (grid + grid2);
    color += gridColor * (diagonal1 + diagonal2);
    
    // Effet de brume/atmosphère
    float atmosphere = fbm(centeredUv * 2.0 + time * 0.05) * 0.5 + 0.5;
    color += vec3(0.15, 0.02, 0.02) * atmosphere * 0.3;
    
    // Glow central (où sera l'œuf)
    float centerGlow = 1.0 - smoothstep(0.0, 0.8, dist);
    centerGlow = pow(centerGlow, 2.0);
    color += vec3(0.3, 0.05, 0.02) * centerGlow * 0.4;
    
    // Particules/étoiles
    float stars = snoise(uv * 200.0 + time * 0.02);
    stars = smoothstep(0.85, 1.0, stars);
    color += vec3(0.8, 0.2, 0.1) * stars * 0.3;
    
    // Effet de scan lines subtil
    float scanline = sin(uv.y * resolution.y * 0.5) * 0.5 + 0.5;
    color *= 0.95 + scanline * 0.05;
    
    // Vignette
    float vignette = 1.0 - smoothstep(0.3, 1.2, dist);
    color *= vignette;
    
    // Effet de distorsion près de la souris
    vec2 mouseUv = mouse * 0.5 + 0.5;
    float mouseDist = length((uv - mouseUv) * aspect);
    float mouseGlow = 1.0 - smoothstep(0.0, 0.3, mouseDist);
    color += vec3(0.2, 0.05, 0.02) * mouseGlow * 0.2;
    
    // Ajout de bruit pour éviter le banding
    color += (noise1 - 0.5) * 0.02;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

export function OeufPage({ onBack }: OeufPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  
  // Curseur personnalisé
  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    if (!cursor || !cursorDot) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let dotX = 0;
    let dotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseEnterInteractive = () => {
      setIsHovering(true);
    };

    const handleMouseLeaveInteractive = () => {
      setIsHovering(false);
    };

    let animationId: number;
    const animateCursor = () => {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      dotX += (mouseX - dotX) * 0.5;
      dotY += (mouseY - dotY) * 0.5;

      cursor.style.transform = `translate(${cursorX - 40}px, ${cursorY - 40}px)`;
      cursorDot.style.transform = `translate(${dotX - 4}px, ${dotY - 4}px)`;

      animationId = requestAnimationFrame(animateCursor);
    };

    const addInteractiveListeners = () => {
      const interactiveElements = document.querySelectorAll('button, a, [data-cursor]');
      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', handleMouseEnterInteractive);
        el.addEventListener('mouseleave', handleMouseLeaveInteractive);
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    animateCursor();
    setTimeout(addInteractiveListeners, 100);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
      const interactiveElements = document.querySelectorAll('button, a, [data-cursor]');
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnterInteractive);
        el.removeEventListener('mouseleave', handleMouseLeaveInteractive);
      });
    };
  }, [isLoaded]);

  // Animation Three.js
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ 
      canvas, 
      alpha: false, 
      antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // === FOND STYLE HATOM ===
    const backgroundGeometry = new THREE.PlaneGeometry(2, 2);
    const backgroundMaterial = new THREE.ShaderMaterial({
      vertexShader: backgroundVertexShader,
      fragmentShader: backgroundFragmentShader,
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        mouse: { value: new THREE.Vector2(0, 0) },
      },
      depthWrite: false,
    });
    
    const backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
    backgroundMesh.frustumCulled = false;
    
    // Scène séparée pour le fond
    const backgroundScene = new THREE.Scene();
    const backgroundCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    backgroundScene.add(backgroundMesh);

    // === CRÉER L'ŒUF ===
    const eggPoints: THREE.Vector2[] = [];
    const segments = 100;
    
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const angle = t * Math.PI;
      const r = Math.sin(angle);
      const asymmetry = 1 + 0.25 * Math.pow(Math.cos(angle), 2) * (t < 0.5 ? 1.2 : -0.4);
      const radius = r * asymmetry * 1.5;
      const y = Math.cos(angle) * 2.0;
      eggPoints.push(new THREE.Vector2(radius, y));
    }
    
    const eggGeometry = new THREE.LatheGeometry(eggPoints, 64);
    eggGeometry.computeVertexNormals();

    const eggMaterial = new THREE.ShaderMaterial({
      vertexShader: eggVertexShader,
      fragmentShader: eggFragmentShader,
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color('#ff3030') },
        color2: { value: new THREE.Color('#330000') },
        cameraPosition: { value: camera.position },
      },
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const egg = new THREE.Mesh(eggGeometry, eggMaterial);
    scene.add(egg);

    // === CRÉER L'EMBRYON MONSTRUEUX ===
    const embryoGroup = new THREE.Group();
    
    // Corps principal de l'embryon (forme fœtale déformée)
    const bodyGeometry = new THREE.SphereGeometry(0.6, 32, 32);
    // Déformer pour forme plus organique
    const bodyPositions = bodyGeometry.attributes.position;
    for (let i = 0; i < bodyPositions.count; i++) {
      const x = bodyPositions.getX(i);
      const y = bodyPositions.getY(i);
      const z = bodyPositions.getZ(i);
      
      // Corps allongé et courbé
      const curve = Math.sin(y * 2) * 0.2;
      bodyPositions.setX(i, x * (1 + y * 0.3) + curve);
      bodyPositions.setZ(i, z * (1 + y * 0.2));
    }
    bodyGeometry.computeVertexNormals();

    const embryoMaterial = new THREE.ShaderMaterial({
      vertexShader: embryoVertexShader,
      fragmentShader: embryoFragmentShader,
      uniforms: {
        time: { value: 0 },
        baseColor: { value: new THREE.Color('#8b4050') },
        veinColor: { value: new THREE.Color('#ff2020') },
      },
    });

    const body = new THREE.Mesh(bodyGeometry, embryoMaterial);
    body.position.y = -0.2;
    body.rotation.z = 0.3;
    embryoGroup.add(body);

    // Tête du monstre (plus grosse, déformée)
    const headGeometry = new THREE.SphereGeometry(0.45, 32, 32);
    const headPositions = headGeometry.attributes.position;
    for (let i = 0; i < headPositions.count; i++) {
      const x = headPositions.getX(i);
      const y = headPositions.getY(i);
      const z = headPositions.getZ(i);
      
      // Crâne allongé et bosselé
      const bump1 = Math.sin(x * 8 + y * 6) * 0.05;
      const bump2 = Math.cos(z * 7 + y * 5) * 0.04;
      headPositions.setX(i, x * 1.1 + bump1);
      headPositions.setY(i, y * 1.3 + bump2);
      headPositions.setZ(i, z * 0.9);
    }
    headGeometry.computeVertexNormals();

    const headMaterial = new THREE.ShaderMaterial({
      vertexShader: embryoVertexShader,
      fragmentShader: embryoFragmentShader,
      uniforms: {
        time: { value: 0 },
        baseColor: { value: new THREE.Color('#7a3545') },
        veinColor: { value: new THREE.Color('#ff3030') },
      },
    });

    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.set(0.3, 0.5, 0);
    head.rotation.z = -0.4;
    embryoGroup.add(head);

    // Yeux (fermés mais visibles sous la peau)
    const eyeGeometry = new THREE.SphereGeometry(0.12, 16, 16);
    const eyeMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x220000,
      transparent: true,
      opacity: 0.8 
    });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(0.15, 0.6, 0.3);
    leftEye.scale.set(1, 0.6, 0.8);
    embryoGroup.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.15, 0.6, -0.3);
    rightEye.scale.set(1, 0.6, 0.8);
    embryoGroup.add(rightEye);

    // Queue/tentacule
    const tailCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -0.6, 0),
      new THREE.Vector3(-0.3, -0.9, 0.1),
      new THREE.Vector3(-0.5, -1.1, -0.1),
      new THREE.Vector3(-0.4, -1.3, 0.2),
      new THREE.Vector3(-0.2, -1.5, 0),
    ]);
    
    const tailGeometry = new THREE.TubeGeometry(tailCurve, 20, 0.08, 8, false);
    const tailMaterial = new THREE.ShaderMaterial({
      vertexShader: embryoVertexShader,
      fragmentShader: embryoFragmentShader,
      uniforms: {
        time: { value: 0 },
        baseColor: { value: new THREE.Color('#6a3040') },
        veinColor: { value: new THREE.Color('#ff2020') },
      },
    });
    
    const tail = new THREE.Mesh(tailGeometry, tailMaterial);
    embryoGroup.add(tail);

    // Petits bras/membres atrophiés
    const limbGeometry = new THREE.CapsuleGeometry(0.06, 0.25, 8, 8);
    const limbMaterial = embryoMaterial.clone();
    
    const leftArm = new THREE.Mesh(limbGeometry, limbMaterial);
    leftArm.position.set(0.1, 0.1, 0.4);
    leftArm.rotation.set(0.5, 0, 0.8);
    embryoGroup.add(leftArm);
    
    const rightArm = new THREE.Mesh(limbGeometry, limbMaterial);
    rightArm.position.set(0.1, 0.1, -0.4);
    rightArm.rotation.set(-0.5, 0, 0.8);
    embryoGroup.add(rightArm);

    // Cordon ombilical
    const cordCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -0.3, 0.3),
      new THREE.Vector3(0.5, -0.5, 0.5),
      new THREE.Vector3(0.8, -0.8, 0.3),
      new THREE.Vector3(1.0, -1.2, 0.4),
      new THREE.Vector3(0.9, -1.6, 0.2),
    ]);
    
    const cordGeometry = new THREE.TubeGeometry(cordCurve, 30, 0.05, 8, false);
    const cordMaterial = new THREE.ShaderMaterial({
      vertexShader: embryoVertexShader,
      fragmentShader: embryoFragmentShader,
      uniforms: {
        time: { value: 0 },
        baseColor: { value: new THREE.Color('#5a2535') },
        veinColor: { value: new THREE.Color('#cc1010') },
      },
    });
    
    const cord = new THREE.Mesh(cordGeometry, cordMaterial);
    embryoGroup.add(cord);

    // Épines/excroissances sur le dos
    for (let i = 0; i < 5; i++) {
      const spineGeometry = new THREE.ConeGeometry(0.04, 0.15, 6);
      const spineMaterial = embryoMaterial.clone();
      const spine = new THREE.Mesh(spineGeometry, spineMaterial);
      
      const angle = (i / 5) * Math.PI * 0.6 - 0.3;
      spine.position.set(-0.4, -0.2 + i * 0.15, Math.sin(angle) * 0.1);
      spine.rotation.z = 0.5 + i * 0.1;
      spine.scale.set(1, 1 + Math.random() * 0.5, 1);
      
      embryoGroup.add(spine);
    }

    embryoGroup.scale.set(0.7, 0.7, 0.7);
    embryoGroup.position.y = 0.2;
    scene.add(embryoGroup);

    // === LIQUIDE AMNIOTIQUE (particules) ===
    const fluidGeometry = new THREE.BufferGeometry();
    const fluidCount = 500;
    const fluidPositions = new Float32Array(fluidCount * 3);
    
    for (let i = 0; i < fluidCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = 0.5 + Math.random() * 1.0;
      
      fluidPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      fluidPositions[i * 3 + 1] = r * Math.cos(phi);
      fluidPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    
    fluidGeometry.setAttribute('position', new THREE.BufferAttribute(fluidPositions, 3));
    
    const fluidMaterial = new THREE.PointsMaterial({
      size: 0.015,
      color: 0xff4444,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
    });
    
    const fluidParticles = new THREE.Points(fluidGeometry, fluidMaterial);
    scene.add(fluidParticles);

    // === GLOW EXTÉRIEUR - plus subtil ===
    const glowGeometry = eggGeometry.clone();
    const glowMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position * 1.08, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.4 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
          float pulse = sin(time * 2.0) * 0.1 + 0.9;
          vec3 glowColor = vec3(1.0, 0.1, 0.05);
          gl_FragColor = vec4(glowColor * intensity * pulse, intensity * 0.2);
        }
      `,
      uniforms: { time: { value: 0 } },
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glowMesh);

    camera.position.z = 5;

    // Mouse tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const mouseNormalized = new THREE.Vector2(0, 0);

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      mouseNormalized.set(mouseX, mouseY);
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      backgroundMaterial.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation
    const clock = new THREE.Clock();
    let animationId: number;
    
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      const elapsedTime = clock.getElapsedTime();

      // Update background
      backgroundMaterial.uniforms.time.value = elapsedTime;
      backgroundMaterial.uniforms.mouse.value.copy(mouseNormalized);

      // Smooth mouse follow
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      // Rotation de l'œuf
      egg.rotation.y = elapsedTime * 0.1 + targetX * 0.3;
      egg.rotation.x = targetY * 0.15;
      glowMesh.rotation.copy(egg.rotation);

      // L'embryon bouge légèrement à l'intérieur
      embryoGroup.rotation.y = Math.sin(elapsedTime * 0.3) * 0.1;
      embryoGroup.rotation.x = Math.cos(elapsedTime * 0.2) * 0.05;
      embryoGroup.position.y = 0.2 + Math.sin(elapsedTime * 0.5) * 0.05;

      // Oscillation de l'œuf
      egg.position.y = Math.sin(elapsedTime * 0.8) * 0.05;
      glowMesh.position.y = egg.position.y;
      embryoGroup.position.y += egg.position.y;

      // Update shaders
      eggMaterial.uniforms.time.value = elapsedTime;
      eggMaterial.uniforms.cameraPosition.value.copy(camera.position);
      glowMaterial.uniforms.time.value = elapsedTime;
      
      // Update embryo materials
      embryoGroup.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.ShaderMaterial) {
          if (child.material.uniforms.time) {
            child.material.uniforms.time.value = elapsedTime;
          }
        }
      });

      // Fluid particles rotation
      fluidParticles.rotation.y = elapsedTime * 0.1;
      fluidParticles.rotation.x = Math.sin(elapsedTime * 0.2) * 0.1;

      // Render
      renderer.autoClear = false;
      renderer.clear();
      renderer.render(backgroundScene, backgroundCamera);
      renderer.render(scene, camera);
    };

    animate();
    setTimeout(() => setIsLoaded(true), 1000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="oeuf-page-container relative w-full h-screen overflow-hidden bg-black"
    >
      {/* Custom Cursor */}
      <div 
        ref={cursorRef}
        className={`fixed top-0 left-0 z-[200] pointer-events-none hidden md:flex items-center justify-center transition-all duration-300 ${isHovering ? 'scale-150' : 'scale-100'}`}
        style={{ width: '80px', height: '80px' }}
      >
        <div className={`absolute inset-0 rounded-full border transition-all duration-300 ${isHovering ? 'border-[#ff2020] bg-[#ff2020]/10' : 'border-white/30'}`} />
        <svg 
          width="20" 
          height="28" 
          viewBox="0 0 20 28" 
          className={`absolute transition-all duration-300 ${isHovering ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}
        >
          <rect x="2" y="2" width="16" height="24" rx="8" ry="8" fill="none" stroke="white" strokeWidth="1.5"/>
          <line x1="10" y1="8" x2="10" y2="14" stroke="#ff2020" strokeWidth="2" strokeLinecap="round" className="animate-pulse"/>
        </svg>
      </div>

      <div 
        ref={cursorDotRef}
        className="fixed top-0 left-0 z-[201] pointer-events-none hidden md:block"
        style={{ width: '8px', height: '8px' }}
      >
        <div className={`w-full h-full rounded-full transition-all duration-150 ${isHovering ? 'bg-[#ff2020] scale-0' : 'bg-[#ff2020] scale-100'}`} />
      </div>

      {/* Loading Screen */}
      <div className={`fixed inset-0 z-[100] bg-black flex items-center justify-center transition-opacity duration-1000 ${isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="w-16 h-16 border-2 border-[#ff2020] border-t-transparent rounded-full animate-spin" />
      </div>

      {/* Three.js Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0" />

      {/* Back Button */}
      <button 
        onClick={onBack}
        className="fixed top-6 left-6 z-50 w-12 h-12 flex items-center justify-center rounded-full border border-white/20 hover:border-[#ff2020] hover:bg-[#ff2020]/10 transition-all duration-300 group"
        data-cursor
      >
        <ArrowLeft className="w-5 h-5 text-white/70 group-hover:text-[#ff2020] transition-colors" />
      </button>

      <style>{`
        @media (min-width: 768px) {
          .oeuf-page-container,
          .oeuf-page-container * {
            cursor: none !important;
          }
        }
      `}</style>
    </div>
  );
}
