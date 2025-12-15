import * as THREE from 'three';

const simVertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const simFragmentShader = `
varying vec2 vUv;
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 uTexelSize;
uniform float uDt;
uniform float uDissipation;

void main() {
    vec2 coord = vUv - uDt * texture2D(uVelocity, vUv).xy * uTexelSize;
    gl_FragColor = uDissipation * texture2D(uSource, coord);
}
`;

const splatFragmentShader = `
varying vec2 vUv;
uniform sampler2D uTarget;
uniform float uAspectRatio;
uniform vec3 uColor;
uniform vec2 uPoint;
uniform float uRadius;

void main() {
    vec2 p = vUv - uPoint.xy;
    p.x *= uAspectRatio;
    vec3 splat = exp(-dot(p, p) / uRadius) * uColor;
    vec3 base = texture2D(uTarget, vUv).xyz;
    gl_FragColor = vec4(base + splat, 1.0);
}
`;

const divergenceFragmentShader = `
varying vec2 vUv;
uniform sampler2D uVelocity;
uniform vec2 uTexelSize;

void main() {
    float L = texture2D(uVelocity, vUv - vec2(uTexelSize.x, 0.0)).x;
    float R = texture2D(uVelocity, vUv + vec2(uTexelSize.x, 0.0)).x;
    float T = texture2D(uVelocity, vUv + vec2(0.0, uTexelSize.y)).y;
    float B = texture2D(uVelocity, vUv - vec2(0.0, uTexelSize.y)).y;

    float div = 0.5 * (R - L + T - B);
    gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
}
`;

const pressureFragmentShader = `
varying vec2 vUv;
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
uniform vec2 uTexelSize;

void main() {
    float L = texture2D(uPressure, vUv - vec2(uTexelSize.x, 0.0)).x;
    float R = texture2D(uPressure, vUv + vec2(uTexelSize.x, 0.0)).x;
    float T = texture2D(uPressure, vUv + vec2(0.0, uTexelSize.y)).x;
    float B = texture2D(uPressure, vUv - vec2(0.0, uTexelSize.y)).x;
    float C = texture2D(uPressure, vUv).x;
    float divergence = texture2D(uDivergence, vUv).x;
    float pressure = (L + R + B + T - divergence) * 0.25;
    gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
}
`;

const gradientSubtractFragmentShader = `
varying vec2 vUv;
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
uniform vec2 uTexelSize;

void main() {
    float L = texture2D(uPressure, vUv - vec2(uTexelSize.x, 0.0)).x;
    float R = texture2D(uPressure, vUv + vec2(uTexelSize.x, 0.0)).x;
    float T = texture2D(uPressure, vUv + vec2(0.0, uTexelSize.y)).x;
    float B = texture2D(uPressure, vUv - vec2(0.0, uTexelSize.y)).x;
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    velocity.xy -= vec2(R - L, T - B);
    gl_FragColor = vec4(velocity, 0.0, 1.0);
}
`;

const displayFragmentShader = `
varying vec2 vUv;
uniform sampler2D uTexture;

void main() {
    gl_FragColor = texture2D(uTexture, vUv);
}
`;

// Helper to create ping-pong buffers
function createDoubleFBO(
  width: number,
  height: number,
  type: THREE.TextureDataType
) {
  const options: THREE.RenderTargetOptions = {
    wrapS: THREE.ClampToEdgeWrapping,
    wrapT: THREE.ClampToEdgeWrapping,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    type: type,
    depthBuffer: false,
    stencilBuffer: false,
  };
  const fbo1 = new THREE.WebGLRenderTarget(width, height, options);
  const fbo2 = new THREE.WebGLRenderTarget(width, height, options);
  return {
    read: fbo1,
    write: fbo2,
    swap: function () {
      const temp = this.read;
      this.read = this.write;
      this.write = temp;
    },
  };
}

function createFBO(width: number, height: number, type: THREE.TextureDataType) {
  const options: THREE.RenderTargetOptions = {
    wrapS: THREE.ClampToEdgeWrapping,
    wrapT: THREE.ClampToEdgeWrapping,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    type: type,
    depthBuffer: false,
    stencilBuffer: false,
  };
  return new THREE.WebGLRenderTarget(width, height, options);
}

export class FluidBackground {
  // Optimize: Intersection Observer to pause when not visible
  private observer: IntersectionObserver | null = null;
  private isVisible = true;
  private animationId: number | null = null;

  constructor(containerInfo: HTMLElement) {
    this.container = containerInfo;

    const width = this.container.offsetWidth;
    const height = this.container.offsetHeight;

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const geometry = new THREE.PlaneGeometry(2, 2);

    // Detect Float Texture Support
    let type = THREE.HalfFloatType;
    if (
      !this.renderer.capabilities.isWebGL2 &&
      !this.renderer.extensions.get('OES_texture_half_float')
    ) {
      // Fallback? usually HalfFloat is supported on modern devices
      console.warn('Half Float not supported');
    }

    // Init FBOs
    // Adjust resolution based on aspect ratio to keep square cells roughly
    const aspect = width / height;
    this.simResX = 256; // Increased from 128 for finer details
    this.simResY = Math.floor(256 / aspect);

    this.density = createDoubleFBO(this.simResX, this.simResY, type);
    this.velocity = createDoubleFBO(this.simResX, this.simResY, type);
    this.pressure = createDoubleFBO(this.simResX, this.simResY, type);
    this.divergence = createFBO(this.simResX, this.simResY, type);

    // Init Materials
    this.advectionMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uVelocity: { value: null },
        uSource: { value: null },
        uDt: { value: 0.016 },
        uTexelSize: {
          value: new THREE.Vector2(1 / this.simResX, 1 / this.simResY),
        },
        uDissipation: { value: 0.98 }, // Fading factor
      },
      vertexShader: simVertexShader,
      fragmentShader: simFragmentShader,
    });

    this.splatMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTarget: { value: null },
        uAspectRatio: { value: aspect },
        uColor: { value: new THREE.Vector3() },
        uPoint: { value: new THREE.Vector2() },
        uRadius: { value: 0.005 },
      },
      vertexShader: simVertexShader,
      fragmentShader: splatFragmentShader,
    });

    this.divergenceMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uVelocity: { value: null },
        uTexelSize: {
          value: new THREE.Vector2(1 / this.simResX, 1 / this.simResY),
        },
      },
      vertexShader: simVertexShader,
      fragmentShader: divergenceFragmentShader,
    });

    this.pressureMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uPressure: { value: null },
        uDivergence: { value: null },
        uTexelSize: {
          value: new THREE.Vector2(1 / this.simResX, 1 / this.simResY),
        },
      },
      vertexShader: simVertexShader,
      fragmentShader: pressureFragmentShader,
    });

    this.gradientSubtractMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uPressure: { value: null },
        uVelocity: { value: null },
        uTexelSize: {
          value: new THREE.Vector2(1 / this.simResX, 1 / this.simResY),
        },
      },
      vertexShader: simVertexShader,
      fragmentShader: gradientSubtractFragmentShader,
    });

    this.displayMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: null },
      },
      vertexShader: simVertexShader,
      fragmentShader: displayFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending, // Glow smoke effect
    });

    this.mesh = new THREE.Mesh(geometry, this.displayMaterial);
    this.scene.add(this.mesh);

    // Bind Events
    window.addEventListener('resize', this.onResize.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));

    // Device Orientation (Gyroscope) - Mobile only
    if (window.DeviceOrientationEvent) {
      window.addEventListener(
        'deviceorientation',
        this.onDeviceOrientation.bind(this)
      );
    }

    // Initial Splats for visual
    for (let i = 0; i < 5; i++) {
      this.splatStack.push({
        x: 0.5 + (Math.random() - 0.5) * 0.2,
        y: 0.5 + (Math.random() - 0.5) * 0.2,
        dx: (Math.random() - 0.5) * 500,
        dy: (Math.random() - 0.5) * 500,
        color: new THREE.Vector3(
          Math.random(),
          Math.random(),
          Math.random()
        ).multiplyScalar(5.0), // Bright colors
      });
    }

    // --- Optimization: IntersectionObserver ---
    this.initObserver();
  }

  private initObserver() {
    const options = {
      root: null, // Viewport
      threshold: 0, // Trigger as soon as 1px is visible/hidden
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.isVisible = true;
          if (!this.animationId) {
            this.lastTime = performance.now(); // Reset time to prevent huge delta
            this.animate();
          }
        } else {
          this.isVisible = false;
          if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
          }
        }
      });
    }, options);

    this.observer.observe(this.container);
  }

  onResize() {
    const width = this.container.offsetWidth;
    const height = this.container.offsetHeight;
    this.renderer.setSize(width, height);
    this.splatMaterial.uniforms.uAspectRatio.value = width / height;
    // Should resize FBOs? Usually keeping low-res sim and upscaling is better for performance/look.
  }

  onMouseMove(e: MouseEvent) {
    if (!this.isVisible) return; // Ignore events when invisible

    const x = e.clientX / window.innerWidth;
    const y = 1.0 - e.clientY / window.innerHeight; // Flip Y

    const dx = e.movementX;
    const dy = -e.movementY;

    // Time-based Hue Cycling
    const time = Date.now() * 0.001; // Speed of color change
    const color = new THREE.Color().setHSL((time % 10) / 10, 0.8, 0.6); // Full spectrum, High Saturation, Medium Lightness

    this.splatStack.push({
      x,
      y,
      dx: dx * 5.0,
      dy: dy * 5.0,
      color: new THREE.Vector3(color.r, color.g, color.b).multiplyScalar(3.0), // Boost intensity for glow
    });

    this.lastMouse.set(x, y);
  }

  // Device orientation handler - tilt phone to move fluid (Mobile only, sensitive)
  private lastOrientation = { beta: 0, gamma: 0 };
  onDeviceOrientation(e: DeviceOrientationEvent) {
    if (!this.isVisible || e.beta === null || e.gamma === null) return;

    // Smooth the values
    const beta = e.beta; // Front-back tilt (-180 to 180)
    const gamma = e.gamma; // Left-right tilt (-90 to 90)

    const dx = (gamma - this.lastOrientation.gamma) * 2;
    const dy = (beta - this.lastOrientation.beta) * 2;

    // More sensitive threshold (0.1)
    if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
      const time = Date.now() * 0.001;
      const color = new THREE.Color().setHSL((time % 10) / 10, 0.7, 0.5);

      this.splatStack.push({
        x: 0.5 + gamma / 180, // Center-ish based on tilt
        y: 0.5 + beta / 360,
        dx: dx * 20, // Longer strokes
        dy: -dy * 20,
        color: new THREE.Vector3(color.r, color.g, color.b).multiplyScalar(2.0),
      });
    }

    this.lastOrientation = { beta, gamma };
  }

  step(_dt: number) {
    // SPLAT
    for (const splat of this.splatStack) {
      // Apply velocity splat
      this.splatMaterial.uniforms.uTarget.value = this.velocity.read.texture;
      this.splatMaterial.uniforms.uPoint.value.set(splat.x, splat.y);
      this.splatMaterial.uniforms.uColor.value.set(splat.dx, splat.dy, 1.0); // xy is velocity
      const isMobile = window.innerWidth <= 768;
      this.splatMaterial.uniforms.uRadius.value = isMobile ? 0.0011 : 0.0025; // Smaller on mobile
      this.mesh.material = this.splatMaterial;
      this.renderer.setRenderTarget(this.velocity.write);
      this.renderer.render(this.scene, this.camera);
      this.velocity.swap();

      // Apply density splat (Color smoke)
      this.splatMaterial.uniforms.uTarget.value = this.density.read.texture;
      this.splatMaterial.uniforms.uColor.value.copy(splat.color);
      this.mesh.material = this.splatMaterial;
      this.renderer.setRenderTarget(this.density.write);
      this.renderer.render(this.scene, this.camera);
      this.density.swap();
    }
    this.splatStack = [];

    // ADVECTION Velocity
    this.advectionMaterial.uniforms.uVelocity.value =
      this.velocity.read.texture;
    this.advectionMaterial.uniforms.uSource.value = this.velocity.read.texture;
    this.advectionMaterial.uniforms.uDissipation.value = 0.98; // Velocity decay
    this.mesh.material = this.advectionMaterial;
    this.renderer.setRenderTarget(this.velocity.write);
    this.renderer.render(this.scene, this.camera);
    this.velocity.swap();

    // ADVECTION Density
    this.advectionMaterial.uniforms.uVelocity.value =
      this.velocity.read.texture;
    this.advectionMaterial.uniforms.uSource.value = this.density.read.texture;
    this.advectionMaterial.uniforms.uDissipation.value = 0.97; // Smoke decay
    this.mesh.material = this.advectionMaterial;
    this.renderer.setRenderTarget(this.density.write);
    this.renderer.render(this.scene, this.camera);
    this.density.swap();

    // DIVERGENCE
    this.divergenceMaterial.uniforms.uVelocity.value =
      this.velocity.read.texture;
    this.mesh.material = this.divergenceMaterial;
    this.renderer.setRenderTarget(this.divergence);
    this.renderer.render(this.scene, this.camera);

    // PRESSURE (Jacobi iteration)
    this.pressureMaterial.uniforms.uDivergence.value = this.divergence.texture;
    for (let i = 0; i < 20; i++) {
      // Iterations count affects quality
      this.pressureMaterial.uniforms.uPressure.value =
        this.pressure.read.texture;
      this.mesh.material = this.pressureMaterial;
      this.renderer.setRenderTarget(this.pressure.write);
      this.renderer.render(this.scene, this.camera);
      this.pressure.swap();
    }

    // GRADIENT SUBTRACT
    this.gradientSubtractMaterial.uniforms.uPressure.value =
      this.pressure.read.texture;
    this.gradientSubtractMaterial.uniforms.uVelocity.value =
      this.velocity.read.texture;
    this.mesh.material = this.gradientSubtractMaterial;
    this.renderer.setRenderTarget(this.velocity.write);
    this.renderer.render(this.scene, this.camera);
    this.velocity.swap();

    // DISPLAY
    this.displayMaterial.uniforms.uTexture.value = this.density.read.texture;
    this.mesh.material = this.displayMaterial;
    this.renderer.setRenderTarget(null);
    this.renderer.render(this.scene, this.camera);
  }

  animate() {
    if (!this.isVisible) return; // Double check

    const now = performance.now();
    let dt = (now - this.lastTime) / 1000;
    dt = Math.min(dt, 0.02); // Cap Max DT
    this.lastTime = now;

    this.step(dt);

    this.animationId = requestAnimationFrame(this.animate.bind(this));
  }

  dispose() {
    // Cleanup WebGL resources
    this.renderer.dispose();

    // Cleanup Observer
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
