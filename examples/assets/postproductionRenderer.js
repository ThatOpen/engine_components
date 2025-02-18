import{C as c}from"./web-ifc-api-r1ed24cU.js";import{S as b}from"./stats.min-GTpOrGrX.js";import{T as p,L as m,m as u}from"./index-ByMLC5eT.js";import{C as d,W as f,S as h,a as g,G as v,F as x}from"./index-4oEgnBmA.js";import{W as $}from"./index-CDKMALq_.js";import"./_commonjsHelpers-Cpj98o6Y.js";const k=document.getElementById("container"),o=new d,E=o.get(f),a=E.create();a.scene=new h(o);a.renderer=new $(o,k);a.camera=new g(o);a.scene.three.background=null;o.init();a.camera.controls.setLookAt(12,6,8,0,0,-10);a.scene.setup();const w=o.get(v),r=w.create(a);r.config.color.set(6710886);a.scene.three.background=null;const y=new x(o),S=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),C=await S.arrayBuffer(),G=new Uint8Array(C),A=y.load(G);a.scene.three.add(A);const{postproduction:n}=a.renderer;n.enabled=!0;n.customEffects.excludedMeshes.push(r.three);const s=n.n8ao.configuration,t=new b;t.showPanel(2);document.body.append(t.dom);t.dom.style.left="0px";t.dom.style.zIndex="unset";a.renderer.onBeforeUpdate.add(()=>t.begin());a.renderer.onAfterUpdate.add(()=>t.end());p.init();const l=m.create(()=>u`
  <bim-panel active label="Postproduction Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Gamma">
        <bim-checkbox checked label="Gamma Correction"
          @change="${({target:e})=>{n.setPasses({gamma:e.value})}}">
        </bim-checkbox>
      </bim-panel-section>
      
      <bim-panel-section collapsed label="Custom effects" >
        <bim-checkbox checked label="Custom effects"
          @change="${({target:e})=>{n.setPasses({custom:e.value})}}">
        </bim-checkbox>    
        
        <bim-checkbox checked label="Gamma Correction"
          @change="${({target:e})=>{n.customEffects.glossEnabled=e.value}}">
        </bim-checkbox>   
      
        <bim-number-input 
          slider step="0.01" label="Opacity" 
          value="${n.customEffects.opacity}" min="0" max="1"
          @change="${({target:e})=>{n.customEffects.opacity=e.value}}">
        </bim-number-input>  
            
        <bim-number-input 
          slider step="0.1" label="Tolerance" 
          value="${n.customEffects.tolerance}" min="0" max="6"
          @change="${({target:e})=>{n.customEffects.tolerance=e.value}}">
        </bim-number-input> 
                      
        <bim-color-input label="Line color" 
          @input="${({target:e})=>{const i=new c(e.value.color);n.customEffects.lineColor=i.getHex()}}">
        </bim-color-input>  
      
        <bim-number-input 
          slider label="Gloss exponent" step="0.1" 
          value="${n.customEffects.glossExponent}" min="0" max="5"
          @change="${({target:e})=>{n.customEffects.glossExponent=e.value}}">
        </bim-number-input>    
           
        <bim-number-input 
          slider label="Max gloss" step="0.05" 
          value="${n.customEffects.maxGloss}" min="-2" max="2"
          @change="${({target:e})=>{n.customEffects.maxGloss=e.value}}">
        </bim-number-input>  
                  
        <bim-number-input 
          slider label="Min gloss" step="0.05" 
          value="${n.customEffects.minGloss}" min="-2" max="2"
          @change="${({target:e})=>{n.customEffects.minGloss=e.value}}">
        </bim-number-input> 
        
      </bim-panel-section>
      
      <bim-panel-section collapsed label="Ambient Oclussion">
      
        <bim-checkbox label="AO enabled"
          @change="${({target:e})=>{n.setPasses({ao:e.value})}}">
        </bim-checkbox>  
                
        <bim-checkbox checked label="Half resolution"
          @change="${({target:e})=>{s.halfRes=e.value}}">
        </bim-checkbox>  
                      
        <bim-checkbox label="Screen space radius"
          @change="${({target:e})=>{s.screenSpaceRadius=e.value}}">
        </bim-checkbox>
        
                              
        <bim-color-input label="AO color" 
          @input="${({target:e})=>{const i=new c(e.value.color);s.color.r=i.r,s.color.g=i.g,s.color.b=i.b}}">
        </bim-color-input>     
        
        <bim-number-input 
          slider label="AO Samples" step="1" 
          value="${s.aoSamples}" min="1" max="16"
          @change="${({target:e})=>{s.aoSamples=e.value}}">
        </bim-number-input>    
            
        <bim-number-input 
          slider label="Denoise Samples" step="1" 
          value="${s.denoiseSamples}" min="1" max="16"
          @change="${({target:e})=>{s.denoiseSamples=e.value}}">
        </bim-number-input>   
                  
        <bim-number-input 
          slider label="Denoise Radius" step="1" 
          value="${s.denoiseRadius}" min="0" max="100"
          @change="${({target:e})=>{s.denoiseRadius=e.value}}">
        </bim-number-input>   
                       
        <bim-number-input 
          slider label="AO Radius" step="1" 
          value="${s.aoRadius}" min="0" max="16"
          @change="${({target:e})=>{s.aoRadius=e.value}}">
        </bim-number-input>  
                              
        <bim-number-input 
          slider label="Distance falloff" step="1" 
          value="${s.distanceFalloff}" min="0" max="16"
          @change="${({target:e})=>{s.distanceFalloff=e.value}}">
        </bim-number-input> 
                                      
        <bim-number-input 
          slider label="Intensity" step="1" 
          value="${s.intensity}" min="0" max="16"
          @change="${({target:e})=>{s.intensity=e.value}}">
        </bim-number-input> 
        
      </bim-panel-section>
      
    </bim-panel>
    `);document.body.append(l);const R=m.create(()=>u`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{l.classList.contains("options-menu-visible")?l.classList.remove("options-menu-visible"):l.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(R);
