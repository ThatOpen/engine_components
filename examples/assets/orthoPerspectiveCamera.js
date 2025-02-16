import{B as u,M as h,a as w}from"./web-ifc-api-r1ed24cU.js";import{S as C}from"./stats.min-GTpOrGrX.js";import{T as L,L as g,m as v}from"./index-ByMLC5eT.js";import{C as f,W as k,S as P,d as j,O,G as y}from"./index-4oEgnBmA.js";import"./_commonjsHelpers-Cpj98o6Y.js";const F=document.getElementById("container");let t=new f,c=t.get(k),e=c.create();e.scene=new P(t);e.renderer=new j(t,F);e.camera=new O(t);e.scene.setup();await e.camera.controls.setLookAt(3,3,3,0,0,0);t.init();e.scene.three.background=null;let l=new u,m=new h({color:"#6528D7"}),n=new w(l,m);n.position.set(0,.5,0);e.scene.three.add(n);e.meshes.add(n);let d=t.get(y),p=d.create(e);e.camera.projection.onChanged.add(()=>{const o=e.camera.projection.current;p.fade=o==="Perspective"});const r=new C;r.showPanel(2);document.body.append(r.dom);r.dom.style.left="0px";r.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>r.begin());e.renderer.onAfterUpdate.add(()=>r.end());L.init();const a=g.create(()=>v`
    <bim-panel active label="Orthoperspective Camera Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
         
          <bim-dropdown required label="Navigation mode" 
            @change="${({target:o})=>{const i=o.value[0],{current:s}=e.camera.projection;if(s==="Orthographic"&&i==="FirstPerson"){alert("First person is not compatible with ortho!"),o.value[0]=e.camera.mode.id;return}e.camera.set(i)}}">

          <bim-option checked label="Orbit"></bim-option>
          <bim-option label="FirstPerson"></bim-option>
          <bim-option label="Plan"></bim-option>
        </bim-dropdown>
         
      
        <bim-dropdown required label="Camera projection" 
            @change="${({target:o})=>{const i=o.value[0],s=i==="Orthographic",b=e.camera.mode.id==="FirstPerson";if(s&&b){alert("First person is not compatible with ortho!"),o.value[0]=e.camera.projection.current;return}e.camera.projection.set(i)}}">
          <bim-option checked label="Perspective"></bim-option>
          <bim-option label="Orthographic"></bim-option>
        </bim-dropdown>

        <bim-checkbox 
          label="Allow user input" checked 
          @change="${({target:o})=>{e.camera.setUserInput(o.checked)}}">  
        </bim-checkbox>  
        
        <bim-button 
          label="Fit cube" 
          @click="${()=>{e.camera.fit([n])}}">  
        </bim-button>
        
        <bim-button 
          label="Reset scene" 
          @click="${async()=>{t.dispose(),t=new f,c=t.get(k),e=c.create(),e.scene=new P(t),e.renderer=new j(t,F),e.camera=new O(t),e.scene.setup(),await e.camera.controls.setLookAt(3,3,3,0,0,0),t.init(),e.scene.three.background=null,l=new u,m=new h({color:"#6528D7"}),n=new w(l,m),n.position.set(0,.5,0),e.scene.three.add(n),e.meshes.add(n),d=t.get(y),p=d.create(e),e.camera.projection.onChanged.add(()=>{const o=e.camera.projection.current;p.fade=o==="Perspective"})}}">  
        </bim-button>  

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(a);const S=g.create(()=>v`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{a.classList.contains("options-menu-visible")?a.classList.remove("options-menu-visible"):a.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(S);
