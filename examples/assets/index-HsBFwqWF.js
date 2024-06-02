var S=Object.defineProperty;var T=(l,t,e)=>t in l?S(l,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):l[t]=e;var o=(l,t,e)=>(T(l,typeof t!="symbol"?t+"":t,e),e);import{q as h,U as E,f as m,W as v,H as B,t as R,u as M,C as _,n as w,d as y,I as b,v as z,R as k,w as x,x as V}from"./web-ifc-api-BffFJDIm.js";import{b as L,o as G}from"./index-D43g96vP.js";import{P as d,F as P,$ as O}from"./import-wrapper-prod-BjFaIjiR.js";import{R as N}from"./renderer-with-2d-BJqAqs4R.js";const A={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class D extends d{constructor(t,e){super(),this.textureID=e!==void 0?e:"tDiffuse",t instanceof h?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=E.clone(t.uniforms),this.material=new h({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this.fsQuad=new P(this.material)}render(t,e,s){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=s.texture),this.fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class C extends d{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,s){const i=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let n,f;this.inverse?(n=0,f=1):(n=1,f=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(i.REPLACE,i.REPLACE,i.REPLACE),r.buffers.stencil.setFunc(i.ALWAYS,n,4294967295),r.buffers.stencil.setClear(f),r.buffers.stencil.setLocked(!0),t.setRenderTarget(s),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(i.EQUAL,1,4294967295),r.buffers.stencil.setOp(i.KEEP,i.KEEP,i.KEEP),r.buffers.stencil.setLocked(!0)}}class Q extends d{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class U{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){const s=t.getSize(new m);this._width=s.width,this._height=s.height,e=new v(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:B}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new D(A),this.copyPass.material.blending=R,this.clock=new M}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){t===void 0&&(t=this.clock.getDelta());const e=this.renderer.getRenderTarget();let s=!1;for(let i=0,r=this.passes.length;i<r;i++){const n=this.passes[i];if(n.enabled!==!1){if(n.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(i),n.render(this.renderer,this.writeBuffer,this.readBuffer,t,s),n.needsSwap){if(s){const f=this.renderer.getContext(),u=this.renderer.state.buffers.stencil;u.setFunc(f.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),u.setFunc(f.EQUAL,1,4294967295)}this.swapBuffers()}C!==void 0&&(n instanceof C?s=!0:n instanceof Q&&(s=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){const e=this.renderer.getSize(new m);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;const s=this._width*this._pixelRatio,i=this._height*this._pixelRatio;this.renderTarget1.setSize(s,i),this.renderTarget2.setSize(s,i);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(s,i)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class F extends d{constructor(t,e,s=null,i=null,r=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=s,this.clearColor=i,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new _}render(t,e,s){const i=t.autoClear;t.autoClear=!1;let r,n;this.overrideMaterial!==null&&(n=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor)),this.clearAlpha!==null&&(r=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:s),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=n),t.autoClear=i}}const I={name:"GammaCorrectionShader",uniforms:{tDiffuse:{value:null}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 tex = texture2D( tDiffuse, vUv );

			gl_FragColor = sRGBTransferOETF( tex );

		}`};function W(){return new h({side:2,clipping:!0,uniforms:{},vertexShader:`
    varying vec4 vColor;
    
    #include <clipping_planes_pars_vertex>
  
    void main() {
       #include <begin_vertex>
    
       vec4 absPosition = vec4(position, 1.0);
       vec3 trueNormal = normal;
       
       #ifdef USE_INSTANCING
          absPosition = instanceMatrix * absPosition;
          trueNormal = (instanceMatrix * vec4(normal, 0.)).xyz;
       #endif
       
       absPosition = modelMatrix * absPosition;
       trueNormal = (normalize(modelMatrix * vec4(trueNormal, 0.))).xyz;
       
       vec3 planePosition = absPosition.xyz / 40.;
       float d = abs(dot(trueNormal, planePosition));
       vColor = vec4(abs(trueNormal), d);
       gl_Position = projectionMatrix * viewMatrix * absPosition;
       
       #include <project_vertex>
       #include <clipping_planes_vertex>
    }
    `,fragmentShader:`
    varying vec4 vColor;
    
    #include <clipping_planes_pars_fragment>
  
    void main() {
      #include <clipping_planes_fragment>
      gl_FragColor = vColor;
    }
    `})}function j(){return new h({side:2,clipping:!0,uniforms:{},vertexShader:`
    varying vec3 vCameraPosition;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    #include <clipping_planes_pars_vertex>
  
    void main() {
       #include <begin_vertex>
       
       vec4 absPosition = vec4(position, 1.0);
       vNormal = normal;
       
       #ifdef USE_INSTANCING
          absPosition = instanceMatrix * absPosition;
          vNormal = (instanceMatrix * vec4(normal, 0.)).xyz;
       #endif
       
       absPosition = modelMatrix * absPosition;
       vNormal = (normalize(modelMatrix * vec4(vNormal, 0.))).xyz;
       
       gl_Position = projectionMatrix * viewMatrix * absPosition;
       
       vCameraPosition = cameraPosition;
       vPosition = absPosition.xyz;
       
       #include <project_vertex>
       #include <clipping_planes_vertex>
    }
    `,fragmentShader:`
    varying vec3 vCameraPosition;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    #include <clipping_planes_pars_fragment>
  
    void main() {
      #include <clipping_planes_fragment>
      vec3 cameraPixelVec = normalize(vCameraPosition - vPosition);
      float difference = abs(dot(vNormal, cameraPixelVec));
      
      // This achieves a double gloss effect: when the surface is perpendicular and when it's parallel
      difference = abs((difference * 2.) - 1.);
      
      gl_FragColor = vec4(difference, difference, difference, 1.);
    }
    `})}class H extends d{constructor(e,s,i,r,n){super();o(this,"components");o(this,"resolution");o(this,"renderScene");o(this,"renderCamera");o(this,"fsQuad");o(this,"normalOverrideMaterial");o(this,"glossOverrideMaterial");o(this,"planeBuffer");o(this,"glossBuffer");o(this,"outlineBuffer");o(this,"excludedMeshes",[]);o(this,"outlinedMeshes",{});o(this,"_outlineScene",new w);o(this,"_outlineEnabled",!1);o(this,"_lineColor",10066329);o(this,"_opacity",.4);o(this,"_tolerance",3);o(this,"_glossEnabled",!0);o(this,"_glossExponent",1.9);o(this,"_minGloss",-.1);o(this,"_maxGloss",.1);o(this,"_outlinesNeedsUpdate",!1);if(!i.renderer)throw new Error("The given world must have a renderer!");this.components=s,this.renderScene=r,this.renderCamera=n,this.resolution=new m(e.x,e.y),this.fsQuad=new P,this.fsQuad.material=this.createOutlinePostProcessMaterial(),this.planeBuffer=this.newRenderTarget(),this.glossBuffer=this.newRenderTarget(),this.outlineBuffer=this.newRenderTarget();const f=W();f.clippingPlanes=i.renderer.clippingPlanes,this.normalOverrideMaterial=f;const u=j();u.clippingPlanes=i.renderer.clippingPlanes,this.glossOverrideMaterial=u}get lineColor(){return this._lineColor}set lineColor(e){this._lineColor=e,this.fsQuad.material.uniforms.lineColor.value.set(e)}get tolerance(){return this._tolerance}set tolerance(e){this._tolerance=e;const s=this.fsQuad.material;s.uniforms.tolerance.value=e}get opacity(){return this._opacity}set opacity(e){this._opacity=e;const s=this.fsQuad.material;s.uniforms.opacity.value=e}get glossEnabled(){return this._glossEnabled}set glossEnabled(e){if(e===this._glossEnabled)return;this._glossEnabled=e;const s=this.fsQuad.material;s.uniforms.glossEnabled.value=e?1:0}get glossExponent(){return this._glossExponent}set glossExponent(e){this._glossExponent=e;const s=this.fsQuad.material;s.uniforms.glossExponent.value=e}get minGloss(){return this._minGloss}set minGloss(e){this._minGloss=e;const s=this.fsQuad.material;s.uniforms.minGloss.value=e}get maxGloss(){return new y().color.convertLinearToSRGB(),this._maxGloss}set maxGloss(e){this._maxGloss=e;const s=this.fsQuad.material;s.uniforms.maxGloss.value=e}get outlineEnabled(){return this._outlineEnabled}set outlineEnabled(e){if(e===this._outlineEnabled)return;this._outlineEnabled=e;const s=this.fsQuad.material;s.uniforms.outlineEnabled.value=e?1:0}async dispose(){this.planeBuffer.dispose(),this.glossBuffer.dispose(),this.outlineBuffer.dispose(),this.normalOverrideMaterial.dispose(),this.glossOverrideMaterial.dispose(),this.fsQuad.dispose(),this.excludedMeshes=[],this._outlineScene.children=[];const e=this.components.get(L);for(const s in this.outlinedMeshes){const i=this.outlinedMeshes[s];for(const r of i.meshes)e.destroy(r,!0,!0);i.material.dispose()}}setSize(e,s){this.planeBuffer.setSize(e,s),this.glossBuffer.setSize(e,s),this.outlineBuffer.setSize(e,s),this.resolution.set(e,s),this.fsQuad.material.uniforms.screenSize.value.set(this.resolution.x,this.resolution.y,1/this.resolution.x,1/this.resolution.y)}render(e,s,i){const r=s.depthBuffer;s.depthBuffer=!1;const n=this.renderScene.overrideMaterial,f=this.renderScene.background;this.renderScene.background=null;for(const c of this.excludedMeshes)c.visible=!1;if(e.setRenderTarget(this.planeBuffer),this.renderScene.overrideMaterial=this.normalOverrideMaterial,e.render(this.renderScene,this.renderCamera),this._glossEnabled&&(e.setRenderTarget(this.glossBuffer),this.renderScene.overrideMaterial=this.glossOverrideMaterial,e.render(this.renderScene,this.renderCamera)),this.renderScene.overrideMaterial=n,this._outlineEnabled){let c=!1;for(const g in this.outlinedMeshes){const p=this.outlinedMeshes[g];for(const a of p.meshes)c=!0,a.userData.materialPreOutline=a.material,a.material=p.material,a.userData.groupsPreOutline=a.geometry.groups,a.geometry.groups=[],a instanceof b&&(a.userData.colorPreOutline=a.instanceColor,a.instanceColor=null),a.userData.parentPreOutline=a.parent,this._outlineScene.add(a)}(c||this._outlinesNeedsUpdate)&&(e.setRenderTarget(this.outlineBuffer),e.render(this._outlineScene,this.renderCamera),this._outlinesNeedsUpdate=c);for(const g in this.outlinedMeshes){const p=this.outlinedMeshes[g];for(const a of p.meshes)a.material=a.userData.materialPreOutline,a.geometry.groups=a.userData.groupsPreOutline,a instanceof b&&(a.instanceColor=a.userData.colorPreOutline),a.userData.parentPreOutline&&a.userData.parentPreOutline.add(a),a.userData.materialPreOutline=void 0,a.userData.groupsPreOutline=void 0,a.userData.colorPreOutline=void 0,a.userData.parentPreOutline=void 0}}for(const c of this.excludedMeshes)c.visible=!0;this.renderScene.background=f;const u=this.fsQuad.material;u.uniforms.planeBuffer.value=this.planeBuffer.texture,u.uniforms.glossBuffer.value=this.glossBuffer.texture,u.uniforms.outlineBuffer.value=this.outlineBuffer.texture,u.uniforms.sceneColorBuffer.value=i.texture,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(s),this.fsQuad.render(e)),s.depthBuffer=r}get vertexShader(){return`
	  varying vec2 vUv;
	  void main() {
	  	vUv = uv;
	  	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	  }
	`}get fragmentShader(){return`
	  uniform sampler2D sceneColorBuffer;
	  uniform sampler2D planeBuffer;
	  uniform sampler2D glossBuffer;
	  uniform sampler2D outlineBuffer;
	  uniform vec4 screenSize;
	  uniform vec3 lineColor;
	  
	  uniform float outlineEnabled;
	  
      uniform int width;
	  uniform float opacity;
      uniform float tolerance;
      uniform float glossExponent;
      uniform float minGloss;
      uniform float maxGloss;
      uniform float glossEnabled;

	  varying vec2 vUv;

	  vec4 getValue(sampler2D buffer, int x, int y) {
	  	return texture2D(buffer, vUv + screenSize.zw * vec2(x, y));
	  }

      float normalDiff(vec3 normal1, vec3 normal2) {
        return ((dot(normal1, normal2) - 1.) * -1.) / 2.;
      }

      // Returns 0 if it's background, 1 if it's not
      float getIsBackground(vec3 normal) {
        float background = 1.0;
        background *= step(normal.x, 0.);
        background *= step(normal.y, 0.);
        background *= step(normal.z, 0.);
        background = (background - 1.) * -1.;
        return background;
      }

	  void main() {
	  
	    vec4 sceneColor = getValue(sceneColorBuffer, 0, 0);
	    vec3 normSceneColor = normalize(sceneColor.rgb);
  
        vec4 plane = getValue(planeBuffer, 0, 0);
	    vec3 normal = plane.xyz;
        float distance = plane.w;
  
        vec3 normalTop = getValue(planeBuffer, 0, width).rgb;
        vec3 normalBottom = getValue(planeBuffer, 0, -width).rgb;
        vec3 normalRight = getValue(planeBuffer, width, 0).rgb;
        vec3 normalLeft = getValue(planeBuffer, -width, 0).rgb;
        vec3 normalTopRight = getValue(planeBuffer, width, width).rgb;
        vec3 normalTopLeft = getValue(planeBuffer, -width, width).rgb;
        vec3 normalBottomRight = getValue(planeBuffer, width, -width).rgb;
        vec3 normalBottomLeft = getValue(planeBuffer, -width, -width).rgb;
  
        float distanceTop = getValue(planeBuffer, 0, width).a;
        float distanceBottom = getValue(planeBuffer, 0, -width).a;
        float distanceRight = getValue(planeBuffer, width, 0).a;
        float distanceLeft = getValue(planeBuffer, -width, 0).a;
        float distanceTopRight = getValue(planeBuffer, width, width).a;
        float distanceTopLeft = getValue(planeBuffer, -width, width).a;
        float distanceBottomRight = getValue(planeBuffer, width, -width).a;
        float distanceBottomLeft = getValue(planeBuffer, -width, -width).a;
        
        vec3 sceneColorTop = normalize(getValue(sceneColorBuffer, 1, 0).rgb);
        vec3 sceneColorBottom = normalize(getValue(sceneColorBuffer, -1, 0).rgb);
        vec3 sceneColorLeft = normalize(getValue(sceneColorBuffer, 0, -1).rgb);
        vec3 sceneColorRight = normalize(getValue(sceneColorBuffer, 0, 1).rgb);
        vec3 sceneColorTopRight = normalize(getValue(sceneColorBuffer, 1, 1).rgb);
        vec3 sceneColorBottomRight = normalize(getValue(sceneColorBuffer, -1, 1).rgb);
        vec3 sceneColorTopLeft = normalize(getValue(sceneColorBuffer, 1, 1).rgb);
        vec3 sceneColorBottomLeft = normalize(getValue(sceneColorBuffer, -1, 1).rgb);

        // Checks if the planes of this texel and the neighbour texels are different

        float planeDiff = 0.0;

        planeDiff += step(0.001, normalDiff(normal, normalTop));
        planeDiff += step(0.001, normalDiff(normal, normalBottom));
        planeDiff += step(0.001, normalDiff(normal, normalLeft));
        planeDiff += step(0.001, normalDiff(normal, normalRight));
        planeDiff += step(0.001, normalDiff(normal, normalTopRight));
        planeDiff += step(0.001, normalDiff(normal, normalTopLeft));
        planeDiff += step(0.001, normalDiff(normal, normalBottomRight));
        planeDiff += step(0.001, normalDiff(normal, normalBottomLeft));
        
        planeDiff += step(0.001, normalDiff(normSceneColor, sceneColorTop));
        planeDiff += step(0.001, normalDiff(normSceneColor, sceneColorBottom));
        planeDiff += step(0.001, normalDiff(normSceneColor, sceneColorLeft));
        planeDiff += step(0.001, normalDiff(normSceneColor, sceneColorRight));
       	planeDiff += step(0.001, normalDiff(normSceneColor, sceneColorTopRight));
        planeDiff += step(0.001, normalDiff(normSceneColor, sceneColorTopLeft));
        planeDiff += step(0.001, normalDiff(normSceneColor, sceneColorBottomRight));
        planeDiff += step(0.001, normalDiff(normSceneColor, sceneColorBottomLeft));

        planeDiff += step(0.001, abs(distance - distanceTop));
        planeDiff += step(0.001, abs(distance - distanceBottom));
        planeDiff += step(0.001, abs(distance - distanceLeft));
        planeDiff += step(0.001, abs(distance - distanceRight));
        planeDiff += step(0.001, abs(distance - distanceTopRight));
        planeDiff += step(0.001, abs(distance - distanceTopLeft));
        planeDiff += step(0.001, abs(distance - distanceBottomRight));
        planeDiff += step(0.001, abs(distance - distanceBottomLeft));

        // Add extra background outline

        int width2 = width + 1;
        vec3 normalTop2 = getValue(planeBuffer, 0, width2).rgb;
        vec3 normalBottom2 = getValue(planeBuffer, 0, -width2).rgb;
        vec3 normalRight2 = getValue(planeBuffer, width2, 0).rgb;
        vec3 normalLeft2 = getValue(planeBuffer, -width2, 0).rgb;
        vec3 normalTopRight2 = getValue(planeBuffer, width2, width2).rgb;
        vec3 normalTopLeft2 = getValue(planeBuffer, -width2, width2).rgb;
        vec3 normalBottomRight2 = getValue(planeBuffer, width2, -width2).rgb;
        vec3 normalBottomLeft2 = getValue(planeBuffer, -width2, -width2).rgb;

        planeDiff += -(getIsBackground(normalTop2) - 1.);
        planeDiff += -(getIsBackground(normalBottom2) - 1.);
        planeDiff += -(getIsBackground(normalRight2) - 1.);
        planeDiff += -(getIsBackground(normalLeft2) - 1.);
        planeDiff += -(getIsBackground(normalTopRight2) - 1.);
        planeDiff += -(getIsBackground(normalBottomRight2) - 1.);
        planeDiff += -(getIsBackground(normalBottomRight2) - 1.);
        planeDiff += -(getIsBackground(normalBottomLeft2) - 1.);

        // Tolerance sets the minimum amount of differences to consider
        // this texel an edge

        float line = step(tolerance, planeDiff);

        // Exclude background and apply opacity

        float background = getIsBackground(normal);
        line *= background;
        line *= opacity;
        
        // Add gloss
        
        vec3 gloss = getValue(glossBuffer, 0, 0).xyz;
        float diffGloss = abs(maxGloss - minGloss);
        vec3 glossExpVector = vec3(glossExponent,glossExponent,glossExponent);
        gloss = min(pow(gloss, glossExpVector), vec3(1.,1.,1.));
        gloss *= diffGloss;
        gloss += minGloss;
        vec4 glossedColor = sceneColor + vec4(gloss, 1.) * glossEnabled;
        
        vec4 corrected = mix(sceneColor, glossedColor, background);
        
        // Draw lines
        
        corrected = mix(corrected, vec4(lineColor, 1.), line);
        
        // Add outline
        
        vec4 outlinePreview =getValue(outlineBuffer, 0, 0);
        float outlineColorCorrection = 1. / max(0.2, outlinePreview.a);
        vec3 outlineColor = outlinePreview.rgb * outlineColorCorrection;
        
        // thickness between 10 and 2, opacity between 1 and 0.2
	    int outlineThickness = int(outlinePreview.a * 10.);
	    
	    float outlineDiff = 0.;
        
        outlineDiff += step(0.1, getValue(outlineBuffer, 0, 0).a);
        outlineDiff += step(0.1, getValue(outlineBuffer, 1, 0).a);
        outlineDiff += step(0.1, getValue(outlineBuffer, -1, 0).a);
        outlineDiff += step(0.1, getValue(outlineBuffer, 0, -1).a);
        outlineDiff += step(0.1, getValue(outlineBuffer, 0, 1).a);
        outlineDiff += step(0.1, getValue(outlineBuffer, outlineThickness, 0).a);
        outlineDiff += step(0.1, getValue(outlineBuffer, -outlineThickness, 0).a);
        outlineDiff += step(0.1, getValue(outlineBuffer, 0, -outlineThickness).a);
        outlineDiff += step(0.1, getValue(outlineBuffer, 0, outlineThickness).a);
        outlineDiff += step(0.1, getValue(outlineBuffer, outlineThickness, outlineThickness).a);
        outlineDiff += step(0.1, getValue(outlineBuffer, -outlineThickness, outlineThickness).a);
        outlineDiff += step(0.1, getValue(outlineBuffer, -outlineThickness, -outlineThickness).a);
        outlineDiff += step(0.1, getValue(outlineBuffer, outlineThickness, -outlineThickness).a);
        
        float outLine = step(4., outlineDiff) * step(outlineDiff, 12.) * outlineEnabled;
        corrected = mix(corrected, vec4(outlineColor, 1.), outLine);
        
        gl_FragColor = corrected;
	}
			`}createOutlinePostProcessMaterial(){return new h({uniforms:{opacity:{value:this._opacity},debugVisualize:{value:0},sceneColorBuffer:{value:null},tolerance:{value:this._tolerance},planeBuffer:{value:null},glossBuffer:{value:null},outlineBuffer:{value:null},glossEnabled:{value:1},minGloss:{value:this._minGloss},maxGloss:{value:this._maxGloss},outlineEnabled:{value:0},glossExponent:{value:this._glossExponent},width:{value:1},lineColor:{value:new _(this._lineColor)},screenSize:{value:new z(this.resolution.x,this.resolution.y,1/this.resolution.x,1/this.resolution.y)}},vertexShader:this.vertexShader,fragmentShader:this.fragmentShader})}newRenderTarget(){const e=new v(this.resolution.x,this.resolution.y);return e.texture.colorSpace="srgb-linear",e.texture.format=k,e.texture.type=B,e.texture.minFilter=x,e.texture.magFilter=x,e.texture.generateMipmaps=!1,e.stencilBuffer=!1,e}}class ${constructor(t,e,s){o(this,"overrideClippingPlanes",!1);o(this,"composer");o(this,"_enabled",!1);o(this,"_initialized",!1);o(this,"_n8ao");o(this,"_customEffects");o(this,"_basePass");o(this,"_gammaPass");o(this,"_depthTexture");o(this,"_settings",{gamma:!0,custom:!0,ao:!1});o(this,"_renderer");o(this,"_components");o(this,"_world");o(this,"_renderTarget");if(!s.renderer)throw new Error("The given world must have a renderer!");this._components=t,this._renderer=e,this._world=s,this._renderTarget=new v(window.innerWidth,window.innerHeight),this._renderTarget.texture.colorSpace="srgb-linear",this.composer=new U(e,this._renderTarget),this.composer.setSize(window.innerWidth,window.innerHeight)}get basePass(){if(!this._basePass)throw new Error("Custom effects not initialized!");return this._basePass}get gammaPass(){if(!this._gammaPass)throw new Error("Custom effects not initialized!");return this._gammaPass}get customEffects(){if(!this._customEffects)throw new Error("Custom effects not initialized!");return this._customEffects}get n8ao(){if(!this._n8ao)throw new Error("Custom effects not initialized!");return this._n8ao}get enabled(){return this._enabled}set enabled(t){this._initialized||this.initialize(),this._enabled=t}get settings(){return{...this._settings}}dispose(){var t,e,s,i;this._renderTarget.dispose(),(t=this._depthTexture)==null||t.dispose(),(e=this._customEffects)==null||e.dispose(),(s=this._gammaPass)==null||s.dispose(),(i=this._n8ao)==null||i.dispose()}setPasses(t){let e=!1;for(const s in t){const i=s;if(this.settings[i]!==t[i]){e=!0;break}}if(e){for(const s in t){const i=s;this._settings[i]!==void 0&&(this._settings[i]=t[i])}this.updatePasses()}}setSize(t,e){this._initialized&&(this.composer.setSize(t,e),this.basePass.setSize(t,e),this.n8ao.setSize(t,e),this.customEffects.setSize(t,e),this.gammaPass.setSize(t,e))}update(){this._enabled&&this.composer.render()}updateCamera(){const t=this._world.camera.three;this._n8ao&&(this._n8ao.camera=t),this._customEffects&&(this._customEffects.renderCamera=t),this._basePass&&(this._basePass.camera=t)}initialize(){if(!this._world.renderer)throw new Error("The given world must have a renderer!");const t=this._world.scene.three,e=this._world.camera.three;if(!(t instanceof w))throw new Error("The given scene must have a THREE.Scene as core!");this._world.camera instanceof G&&this._world.camera.projection.onChanged.add(()=>{this.updateCamera()});const s=this._world.renderer;this.overrideClippingPlanes||(this._renderer.clippingPlanes=s.clippingPlanes),this._renderer.outputColorSpace="srgb",this._renderer.toneMapping=V,this.newBasePass(t,e),this.newSaoPass(t,e),this.newGammaPass(),this.newCustomPass(t,e),this._initialized=!0,this.updatePasses()}updateProjection(t){this.composer.passes.forEach(e=>{e.camera=t}),this.update()}updatePasses(){for(const t of this.composer.passes)this.composer.removePass(t);this._basePass&&this.composer.addPass(this.basePass),this._settings.gamma&&this.composer.addPass(this.gammaPass),this._settings.ao&&this.composer.addPass(this.n8ao),this._settings.custom&&this.composer.addPass(this.customEffects)}newCustomPass(t,e){this._customEffects=new H(new m(window.innerWidth,window.innerHeight),this._components,this._world,t,e)}newGammaPass(){this._gammaPass=new D(I)}newSaoPass(t,e){if(!this._world.renderer)throw new Error("The given world must have a renderer!");const{width:s,height:i}=this._world.renderer.getSize();this._n8ao=new O(t,e,s,i);const{configuration:r}=this._n8ao;r.aoSamples=16,r.denoiseSamples=1,r.denoiseRadius=13,r.aoRadius=1,r.distanceFalloff=4,r.aoRadius=1,r.intensity=4,r.halfRes=!0,r.color=new _().setHex(13421772,"srgb-linear")}newBasePass(t,e){this._basePass=new F(t,e)}}class Z extends N{constructor(e,s,i){super(e,s,i);o(this,"_postproduction");this.onResize.add(r=>this.resizePostproduction(r)),this.onWorldChanged.add(()=>{this.currentWorld&&(this._postproduction&&this._postproduction.dispose(),this._postproduction=new $(e,this.three,this.currentWorld),this.setPostproductionSize())})}get postproduction(){if(!this._postproduction)throw new Error("Renderer not initialized yet with a world!");return this._postproduction}update(){if(!this.enabled||!this.currentWorld)return;this.onBeforeUpdate.trigger();const e=this.currentWorld.scene.three,s=this.currentWorld.camera.three;this.postproduction.enabled?this.postproduction.composer.render():this.three.render(e,s),e instanceof w&&this.three2D.render(e,s),this.onAfterUpdate.trigger()}dispose(){super.dispose(),this.postproduction.dispose()}resizePostproduction(e){this.postproduction&&this.setPostproductionSize(e)}setPostproductionSize(e){if(!this.container)return;const s=e?e.x:this.container.clientWidth,i=e?e.y:this.container.clientHeight;this.postproduction.setSize(s,i)}}export{Z as P};
