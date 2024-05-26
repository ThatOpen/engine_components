import{B as p,b as d,M as b}from"./web-ifc-api-BC8YMRiS.js";import{S as u}from"./stats.min-GTpOrGrX.js";import{p as h,a as l,m}from"./index-DyM33b1I.js";import{f as w,p as g,s as f,i as v,n as k,N as P}from"./index-CLKLHy3P.js";import"./_commonjsHelpers-Cpj98o6Y.js";const F=document.getElementById("container"),t=new w,y=t.get(g),e=y.create();e.scene=new f(t);e.renderer=new v(t,F);e.camera=new k(t);e.scene.setup();await e.camera.controls.setLookAt(3,3,3,0,0,0);t.init();e.scene.three.background=null;const O=new p,j=new d({color:"#6528D7"}),s=new b(O,j);s.position.set(0,.5,0);e.scene.three.add(s);e.meshes.add(s);const $=t.get(P),x=$.create(e);e.camera.projection.onChanged.add(()=>{const o=e.camera.projection.current;x.fade=o==="Perspective"});const n=new u;n.showPanel(2);document.body.append(n.dom);n.dom.style.left="0px";n.dom.style.zIndex="unset";e.renderer.onBeforeUpdate.add(()=>n.begin());e.renderer.onAfterUpdate.add(()=>n.end());h.init();const r=l.create(()=>m`
    <bim-panel active label="Orthoperspective Camera Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
         
          <bim-dropdown required label="Navigation mode" 
            @change="${({target:o})=>{const i=o.value[0],{current:a}=e.camera.projection;if(a==="Orthographic"&&i==="FirstPerson"){alert("First person is not compatible with ortho!"),o.value[0]=e.camera.mode.id;return}e.camera.set(i)}}">

          <bim-option checked label="Orbit"></bim-option>
          <bim-option label="FirstPerson"></bim-option>
          <bim-option label="Plan"></bim-option>
        </bim-dropdown>
         
      
        <bim-dropdown required label="Camera projection" 
            @change="${({target:o})=>{const i=o.value[0],a=i==="Orthographic",c=e.camera.mode.id==="FirstPerson";if(a&&c){alert("First person is not compatible with ortho!"),o.value[0]=e.camera.projection.current;return}e.camera.projection.set(i)}}">
          <bim-option checked label="Perspective"></bim-option>
          <bim-option label="Orthographic"></bim-option>
        </bim-dropdown>

        <bim-checkbox 
          label="Allow user input" checked 
          @change="${({target:o})=>{e.camera.setUserInput(o.checked)}}">  
        </bim-checkbox>  
        
        <bim-button 
          label="Fit cube" 
          @click="${()=>{e.camera.fit([s])}}">  
        </bim-button>  

      </bim-panel-section>
    </bim-panel>
    `);document.body.append(r);const M=l.create(()=>m`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{r.classList.contains("options-menu-visible")?r.classList.remove("options-menu-visible"):r.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(M);
