import{C as l}from"./web-ifc-api-BC8YMRiS.js";import{S as m}from"./stats.min-GTpOrGrX.js";import{p as r,a as u,m as b}from"./index-DyM33b1I.js";import{f as p,p as d,s as f,k as h,N as g,u as x}from"./index-BmA4XTIx.js";import"./import-wrapper-prod-LhqN7JJy.js";import{P as v}from"./index-DKqERfnq.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./renderer-with-2d-k8_K2aYf.js";const $=document.getElementById("container"),t=new p,k=t.get(d),s=k.create();s.scene=new f(t);s.renderer=new v(t,$);s.camera=new h(t);s.scene.three.background=null;t.init();s.camera.controls.setLookAt(12,6,8,0,0,-10);s.scene.setup();const c=t.get(g);c.config.color.set(6710886);const E=c.create(s),i=new m;i.showPanel(2);document.body.append(i.dom);i.dom.style.left="0px";s.renderer.onBeforeUpdate.add(()=>i.begin());s.renderer.onAfterUpdate.add(()=>i.end());const w=new x(t),y=await fetch("https://thatopen.github.io/engine_components/resources/small.frag"),S=await y.arrayBuffer(),R=new Uint8Array(S),A=w.load(R);s.scene.three.add(A);const{postproduction:n}=s.renderer;n.enabled=!0;n.customEffects.excludedMeshes.push(E.three);const a=n.n8ao.configuration;r.init();const C=u.create(()=>b`
    <bim-panel label="Clipper Tutorial" style="position: fixed; top: 5px; right: 5px; max-height: calc(100vh - 10px)" active>
    
      <bim-panel-section collapsed label="Gamma" >
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
          @input="${({target:e})=>{const o=new l(e.value.color);n.customEffects.lineColor=o.getHex()}}">
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
          @change="${({target:e})=>{a.halfRes=e.value}}">
        </bim-checkbox>  
                      
        <bim-checkbox label="Screen space radius"
          @change="${({target:e})=>{a.screenSpaceRadius=e.value}}">
        </bim-checkbox>
        
                              
        <bim-color-input label="AO color" 
          @input="${({target:e})=>{const o=new l(e.value.color);a.color.r=o.r,a.color.g=o.g,a.color.b=o.b}}">
        </bim-color-input>     
        
        <bim-number-input 
          slider label="AO Samples" step="1" 
          value="${a.aoSamples}" min="1" max="16"
          @change="${({target:e})=>{a.aoSamples=e.value}}">
        </bim-number-input>    
            
        <bim-number-input 
          slider label="Denoise Samples" step="1" 
          value="${a.denoiseSamples}" min="1" max="16"
          @change="${({target:e})=>{a.denoiseSamples=e.value}}">
        </bim-number-input>   
                  
        <bim-number-input 
          slider label="Denoise Radius" step="1" 
          value="${a.denoiseRadius}" min="0" max="100"
          @change="${({target:e})=>{a.denoiseRadius=e.value}}">
        </bim-number-input>   
                       
        <bim-number-input 
          slider label="AO Radius" step="1" 
          value="${a.aoRadius}" min="0" max="16"
          @change="${({target:e})=>{a.aoRadius=e.value}}">
        </bim-number-input>  
                              
        <bim-number-input 
          slider label="Distance falloff" step="1" 
          value="${a.distanceFalloff}" min="0" max="16"
          @change="${({target:e})=>{a.distanceFalloff=e.value}}">
        </bim-number-input> 
                                      
        <bim-number-input 
          slider label="Intensity" step="1" 
          value="${a.intensity}" min="0" max="16"
          @change="${({target:e})=>{a.intensity=e.value}}">
        </bim-number-input> 
        
      </bim-panel-section>
      
    </bim-panel>
    `);document.body.append(C);
