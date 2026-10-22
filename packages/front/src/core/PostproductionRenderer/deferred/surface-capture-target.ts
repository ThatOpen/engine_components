import * as THREE from "three";

/**
 * Single-pass capture G-buffer.
 *
 * The scene is drawn once: the real lit surface materials emit their shaded
 * colour to attachment 0 and, via their define-gated capture-emission path, the
 * auxiliary geometry attributes the screen-space passes need to attachments 1
 * and 2. There is no separate forward colour render and no override-material
 * geometry prepass — one scene traversal fills every attachment.
 *
 *   - depth   : DepthTexture, float32
 *               float depth keeps position reconstruction stable far from the
 *               origin, which BIM / geo-referenced scenes need.
 *   - colour  : RGBA16F — the surface's own shaded colour, pre-tonemap (the
 *               composite tonemaps + sRGB-encodes it). Half-float keeps the HDR-ish
 *               range the forward colour target used to.
 *   - normal  : RG16F octahedral (Cigolle et al. 2014) — two channels, 16-bit to
 *               avoid 8-bit banding on glossy highlights.
 *   - faceId  : RGBA8 24-bit RGB-packed — R/G/B = id bytes, A = sub-element role /
 *               sentinel byte.
 *
 * Full-res by default: depth and normal feed edge / AO consumers that need full
 * precision.
 */
export class SurfaceCaptureTarget {
  /**
   * MRT target: textures[0] = shaded colour (RGBA16F), textures[1] = octahedral
   * normal (RG16F), textures[2] = faceId (RGBA8).
   */
  readonly renderTarget: THREE.WebGLRenderTarget;

  /** Float32 depth attachment, shared with downstream effect passes. */
  readonly depthTexture: THREE.DepthTexture;

  private _width: number;
  private _height: number;

  constructor(width: number, height: number) {
    this._width = Math.max(1, Math.floor(width));
    this._height = Math.max(1, Math.floor(height));

    // Float32 depth attachment. DEPTH_COMPONENT32F is
    // universally available on WebGL2 + EXT_color_buffer_float / WebGPU.
    this.depthTexture = new THREE.DepthTexture(this._width, this._height);
    this.depthTexture.type = THREE.FloatType;
    this.depthTexture.format = THREE.DepthFormat;
    this.depthTexture.minFilter = THREE.NearestFilter;
    this.depthTexture.magFilter = THREE.NearestFilter;

    // Three colour attachments: shaded colour + octahedral normal + packed faceId.
    this.renderTarget = new THREE.WebGLRenderTarget(this._width, this._height, {
      count: 3,
      depthTexture: this.depthTexture,
      // Point sampling default: id and octahedral channels must never be
      // bilinearly filtered (bilinear filtering an id attachment yields garbage).
      // The colour attachment opts back into linear below.
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      depthBuffer: true,
      stencilBuffer: false,
      generateMipmaps: false,
    });

    const [colorTex, normalTex, faceIdTex] = this.renderTarget.textures;

    // Attachment 0 — shaded surface colour, pre-tonemap. Linear filter is safe
    // here (the composite samples it 1:1) and matches the old forward target.
    colorTex.name = "capturedColor";
    colorTex.type = THREE.HalfFloatType;
    colorTex.format = THREE.RGBAFormat;
    colorTex.minFilter = THREE.LinearFilter;
    colorTex.magFilter = THREE.LinearFilter;

    // Attachment 1 — octahedral view normal, signed 16-bit float, 2 channels used.
    normalTex.name = "gNormalOcta";
    normalTex.type = THREE.HalfFloatType;
    normalTex.format = THREE.RGFormat;
    normalTex.internalFormat = "RG16F";

    // Attachment 2 — 24-bit RGB-packed faceId + role/sentinel byte in alpha.
    faceIdTex.name = "gFaceId";
    faceIdTex.type = THREE.UnsignedByteType;
    faceIdTex.format = THREE.RGBAFormat;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  get colorTexture(): THREE.Texture {
    return this.renderTarget.textures[0];
  }

  get normalTexture(): THREE.Texture {
    return this.renderTarget.textures[1];
  }

  get faceIdTexture(): THREE.Texture {
    return this.renderTarget.textures[2];
  }

  setSize(width: number, height: number) {
    this._width = Math.max(1, Math.floor(width));
    this._height = Math.max(1, Math.floor(height));
    this.renderTarget.setSize(this._width, this._height);
    this.depthTexture.image.width = this._width;
    this.depthTexture.image.height = this._height;
    this.depthTexture.needsUpdate = true;
  }

  dispose() {
    this.renderTarget.dispose();
    this.depthTexture.dispose();
  }
}
