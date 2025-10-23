var M=Object.defineProperty;var F=(e,r,s)=>r in e?M(e,r,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[r]=s;var a=(e,r,s)=>(F(e,typeof r!="symbol"?r+"":r,s),s);import{ae as B,s as _,v as R,$ as E,T as W,aR as P,aS as A,t as k,ar as U,M as O,aO as j,at as I,b as w,a as N,u as z,V as x,f as C,aT as V}from"./index-BVinSk0X.js";import{E as T,S as G,C as X,W as Z,a as Q,O as K,F as Y}from"./index-DBG1qVuX.js";import{G as $}from"./index-C6-W7G3U.js";function q(e,r,s,i){return new Promise((t,o)=>{function d(){const c=e.clientWaitSync(r,s,0);if(c===e.WAIT_FAILED){o();return}if(c===e.TIMEOUT_EXPIRED){setTimeout(d,i);return}t()}d()})}async function H(e,r,s,i,t,o,d){const c=e.fenceSync(e.SYNC_GPU_COMMANDS_COMPLETE,0);e.flush(),await q(e,c,0,10),e.deleteSync(c),e.bindBuffer(r,s),e.getBufferSubData(r,i,t,o,d),e.bindBuffer(r,null)}async function J(e,r,s,i,t,o,d,c){const l=e.createBuffer();return e.bindBuffer(e.PIXEL_PACK_BUFFER,l),e.bufferData(e.PIXEL_PACK_BUFFER,c.byteLength,e.STREAM_READ),e.readPixels(r,s,i,t,o,d,0),e.bindBuffer(e.PIXEL_PACK_BUFFER,null),await H(e,e.PIXEL_PACK_BUFFER,l,0,c),e.deleteBuffer(l),c}class ee{constructor(r,s){a(this,"onDisposed",new T);a(this,"onDistanceComputed",new T);a(this,"excludedObjects",new Set);a(this,"enabled",!0);a(this,"renderDebugFrame",!1);a(this,"components");a(this,"scene",new B);a(this,"camera",new _(-1,1,1,-1,0,1));a(this,"depthMaterial");a(this,"world");a(this,"worker");a(this,"_width",512);a(this,"_height",512);a(this,"_postQuad");a(this,"tempRT");a(this,"resultRT");a(this,"bufferSize");a(this,"_buffer");a(this,"_isWorkerBusy",!1);a(this,"compute",async()=>{if(!this.enabled||this.world.isDisposing||this._isWorkerBusy)return;this._isWorkerBusy=!0,this.world.camera.three.updateMatrix();const r=this.world.renderer.three;r.setRenderTarget(this.tempRT);const s="visibilityBeforeDistanceCheck";for(const t of this.excludedObjects)t.userData[s]=t.visible,t.visible=!1;r.render(this.world.scene.three,this.world.camera.three);for(const t of this.excludedObjects)t.userData[s]!==void 0&&(t.visible=t.userData[s]);this.depthMaterial.uniforms.tDiffuse.value=this.tempRT.texture,this.depthMaterial.uniforms.tDepth.value=this.tempRT.depthTexture,r.setRenderTarget(this.resultRT),r.render(this.scene,this.camera);const i=r.getContext();try{await J(i,0,0,this._width,this._height,i.RGBA,i.UNSIGNED_BYTE,this._buffer)}catch{r.setRenderTarget(null),this._isWorkerBusy=!1;return}r.setRenderTarget(null),this.renderDebugFrame&&r.render(this.scene,this.camera),this.worker.postMessage({buffer:this._buffer})});a(this,"handleWorkerMessage",r=>{if(!this.enabled||this.world.isDisposing)return;const s=r.data.colors;let i=Number.MAX_VALUE;for(const l of s)l!==0&&l<i&&(i=l);const t=this.world.camera.three||_,d=(i/255-1)*-1*(t.far-t.near),c=Math.min(d,t.far);this.onDistanceComputed.trigger(c),this._isWorkerBusy=!1});if(!s.renderer)throw new Error("The given world must have a renderer!");this.components=r,this.world=s;const i=s.camera.three;this.tempRT=new R(this._width,this._height),this.bufferSize=this._width*this._height*4,this._buffer=new Uint8Array(this.bufferSize),this.tempRT.texture.minFilter=E,this.tempRT.texture.magFilter=E,this.tempRT.stencilBuffer=!1,this.tempRT.samples=0,this.tempRT.depthTexture=new W(this._width,this._height),this.tempRT.depthTexture.format=P,this.tempRT.depthTexture.type=A,this.resultRT=new R(this._width,this._height),this.depthMaterial=new k({vertexShader:`
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
    `,fragmentShader:`
#include <packing>

varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform sampler2D tDepth;
uniform float cameraNear;
uniform float cameraFar;


float readDepth( sampler2D depthSampler, vec2 coord ) {
  float fragCoordZ = texture2D( depthSampler, coord ).x;
  float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
  return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
}

void main() {
  //vec3 diffuse = texture2D( tDiffuse, vUv ).rgb;
  float depth = readDepth( tDepth, vUv );

  gl_FragColor.rgb = 1.0 - vec3( depth );
  gl_FragColor.a = 1.0;
}
    `,uniforms:{cameraNear:{value:i.near},cameraFar:{value:i.far},tDiffuse:{value:null},tDepth:{value:null}}});const t=new U(2,2);this._postQuad=new O(t,this.depthMaterial),this.scene.add(this._postQuad);const o=`
      addEventListener("message", (event) => {
        const { buffer } = event.data;
        const colors = new Set();
        for (let i = 0; i < buffer.length; i += 4) {
          const r = buffer[i];
          colors.add(r);
        }
        postMessage({ colors });
      });
    `,d=new Blob([o],{type:"application/javascript"});this.worker=new Worker(URL.createObjectURL(d)),this.worker.addEventListener("message",this.handleWorkerMessage)}dispose(){this.enabled=!1,this.onDistanceComputed.reset(),this.worker.terminate(),this.tempRT.dispose(),this.resultRT.dispose();const r=[...this.scene.children];this.excludedObjects.clear();for(const s of r)s.removeFromParent();this._postQuad.geometry.dispose(),this._postQuad.removeFromParent(),this._buffer=null,this.onDisposed.reset()}}class te extends G{constructor(){super(...arguments);a(this,"_distanceRenderer");a(this,"autoBias",!0);a(this,"_defaultShadowConfig",{cascade:1,resolution:512});a(this,"_lightsWithShadow",new Map);a(this,"_isComputingShadows",!1);a(this,"_shadowsEnabled",!0);a(this,"_bias",0);a(this,"recomputeShadows",s=>{if(!this._shadowsEnabled)return;if(this.autoBias&&(this.bias=-.005),s*=1.5,!this.currentWorld)throw new Error("A world needs to be assigned to the scene before computing shadows!");if(!this._lightsWithShadow.size)throw new Error("No shadows found!");const t=this.currentWorld.camera.three;if(!(t instanceof I)&&!(t instanceof _))throw new Error("Invalid camera type!");const o=new w;t.getWorldDirection(o);let d=s;const c=new w;c.copy(this.config.directionalLight.position),c.normalize();for(const[l,L]of this._lightsWithShadow){const h=this.directionalLights.get(L);if(!h)throw new Error("Light not found.");const m=new w;m.copy(o);const y=l===this._lightsWithShadow.size-1,D=y?d/2:d*2/3;m.multiplyScalar(D),m.add(t.position);const f=d-D,g=new w;g.copy(c),g.multiplyScalar(f),h.target.position.copy(m),h.position.copy(m),h.position.add(g),h.shadow.camera.right=f,h.shadow.camera.left=-f,h.shadow.camera.top=f,h.shadow.camera.bottom=-f,h.shadow.camera.far=f*2,h.shadow.camera.updateProjectionMatrix(),h.shadow.camera.updateMatrix(),y||(d/=3)}this._isComputingShadows=!1})}get bias(){return this._bias}set bias(s){this._bias=s;for(const[,i]of this._lightsWithShadow){const t=this.directionalLights.get(i);t&&(t.shadow.bias=s)}}get shadowsEnabled(){return this._shadowsEnabled}set shadowsEnabled(s){this._shadowsEnabled=s;for(const[,i]of this.directionalLights)i.castShadow=s}get distanceRenderer(){if(!this._distanceRenderer)throw new Error("You must set up this component before accessing the distance renderer!");return this._distanceRenderer}setup(s){super.setup(s);const i={...this._defaultConfig,...this._defaultShadowConfig,...s};if(i.cascade<=0)throw new Error("Config.shadows.cascade must be a natural number greater than 0!");if(i.cascade>1)throw new Error("Multiple shadows not supported yet!");if(!this.currentWorld)throw new Error("A world needs to be assigned to the scene before setting it up!");for(const[,t]of this.directionalLights)t.target.removeFromParent(),t.removeFromParent(),t.dispose();this.directionalLights.clear(),this._distanceRenderer||(this._distanceRenderer=new ee(this.components,this.currentWorld),this._distanceRenderer.onDistanceComputed.add(this.recomputeShadows)),this._lightsWithShadow.clear();for(let t=0;t<i.cascade;t++){const o=new j;o.intensity=this.config.directionalLight.intensity,o.color=this.config.directionalLight.color,o.position.copy(this.config.directionalLight.position),o.shadow.mapSize.width=i.resolution,o.shadow.mapSize.height=i.resolution,this.three.add(o,o.target),this.directionalLights.set(o.uuid,o),this._lightsWithShadow.set(t,o.uuid),o.castShadow=!0,o.shadow.bias=this._bias}}dispose(){super.dispose(),this._distanceRenderer&&this._distanceRenderer.dispose(),this._lightsWithShadow.clear()}async updateShadows(){this._isComputingShadows||!this._shadowsEnabled||(this._isComputingShadows=!0,await this.distanceRenderer.compute())}}const se=document.getElementById("container"),u=new X,re=u.get(Z),n=re.create();n.scene=new te(u);n.renderer=new Q(u,se);n.camera=new K(u);u.init();n.camera.controls.setLookAt(12,6,8,0,0,-10);const ae=u.get($),ie=ae.create(n),S=u.get(Y);S.init("https://thatopen.github.io/engine_fragment/resources/worker.mjs");n.camera.controls.addEventListener("control",()=>S.core.update());const oe="example",ne=await fetch("/resources/frags/school_arq.frag"),de=await ne.arrayBuffer(),ce=new Uint8Array(de),v=await S.core.load(ce,{modelId:oe,camera:n.camera.three});n.scene.three.add(v.object);const p=new N;p.showPanel(2);document.body.append(p.dom);p.dom.style.left="0px";p.dom.style.zIndex="unset";n.renderer.onBeforeUpdate.add(()=>p.begin());n.renderer.onAfterUpdate.add(()=>p.end());z.init();const b=x.create(()=>C`
    <bim-panel active label="Shadowed Scene Tutorial" class="options-menu">
      <bim-panel-section>
        <bim-button icon="solar:sun-bold" label="Toggle Shadows" @click="${()=>{n.scene.shadowsEnabled=!n.scene.shadowsEnabled}}">
        </bim-button>
      </bim-panel-section>
    </bim-panel>
    `);document.body.append(b);const he=x.create(()=>C`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{b.classList.contains("options-menu-visible")?b.classList.remove("options-menu-visible"):b.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(he);n.renderer.three.shadowMap.enabled=!0;n.renderer.three.shadowMap.type=V;n.scene.setup({shadows:{cascade:1,resolution:1024}});n.scene.distanceRenderer.excludedObjects.add(ie.three);v.tiles.onItemSet.add(({value:e})=>{"isMesh"in e&&e.material[0].opacity===1&&(e.castShadow=!0,e.receiveShadow=!0)});for(const e of v.object.children)e.castShadow=!0,e.receiveShadow=!0;await n.scene.updateShadows();n.camera.controls.addEventListener("rest",async()=>{await n.scene.updateShadows()});n.scene.three.background=null;
