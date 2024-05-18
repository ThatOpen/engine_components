var b=Object.defineProperty;var _=(s,e,t)=>e in s?b(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var r=(s,e,t)=>(_(s,typeof e!="symbol"?e+"":e,t),t);import{n as z,C as u,f as x,V as m,a6 as k,q as v,P as y,p as S}from"./web-ifc-api-CmZKgq4q.js";import{S as V}from"./stats.min-GTpOrGrX.js";import{k as C,C as R,b as P}from"./index-CA2cPfXk.js";import{E as c,C as E,a as T,W as U,S as B,b as M,c as $}from"./index-D-_Rgxo_.js";import{G as A}from"./index-0yMcLqZW.js";import{F as D}from"./index-AoMuzpS3.js";import"./_commonjsHelpers-Cpj98o6Y.js";class O{constructor(e){r(this,"onDisposed",new c);r(this,"onAfterUpdate",new c);r(this,"onBeforeUpdate",new c);r(this,"onResize",new c);r(this,"frontOffset",0);r(this,"overrideMaterial",new z);r(this,"backgroundColor",new u(395274));r(this,"renderer");r(this,"enabled",!0);r(this,"world");r(this,"_lockRotation",!0);r(this,"_camera");r(this,"_plane");r(this,"_size",new x(320,160));r(this,"_tempVector1",new m);r(this,"_tempVector2",new m);r(this,"_tempTarget",new m);r(this,"down",new m(0,-1,0));r(this,"updatePlanes",()=>{if(!this.world.renderer)throw new Error("The given world must have a renderer!");const e=[],t=this.world.renderer.three;for(const o of t.clippingPlanes)e.push(o);e.push(this._plane),this.renderer.clippingPlanes=e});if(this.world=e,!this.world.renderer)throw new Error("The given world must have a renderer!");this.renderer=new k,this.renderer.setSize(this._size.x,this._size.y);const t=1,o=this._size.x/this._size.y;this._camera=new v(t*o/-2,t*o/2,t/2,t/-2),this.world.renderer.onClippingPlanesUpdated.add(this.updatePlanes),this._camera.position.set(0,200,0),this._camera.zoom=.1,this._camera.rotation.x=-Math.PI/2,this._plane=new y(this.down,200),this.updatePlanes()}get lockRotation(){return this._lockRotation}set lockRotation(e){this._lockRotation=e,e&&(this._camera.rotation.z=0)}get zoom(){return this._camera.zoom}set zoom(e){this._camera.zoom=e,this._camera.updateProjectionMatrix()}dispose(){this.enabled=!1,this.onBeforeUpdate.reset(),this.onAfterUpdate.reset(),this.onResize.reset(),this.overrideMaterial.dispose(),this.renderer.dispose(),this.onDisposed.trigger(),this.onDisposed.reset()}get(){return this._camera}update(){if(!this.enabled)return;this.onBeforeUpdate.trigger();const e=this.world.scene.three,t=this.world.camera;if(!t.hasCameraControls())throw new Error("The given world must use camera controls!");if(!(e instanceof S))throw new Error("The given world must have a THREE.Scene as a root!");const o=t.controls;if(o.getPosition(this._tempVector1),this._camera.position.x=this._tempVector1.x,this._camera.position.z=this._tempVector1.z,this.frontOffset!==0&&(o.getTarget(this._tempVector2),this._tempVector2.sub(this._tempVector1),this._tempVector2.normalize().multiplyScalar(this.frontOffset),this._camera.position.x+=this._tempVector2.x,this._camera.position.z+=this._tempVector2.z),!this._lockRotation){o.getTarget(this._tempTarget);const w=Math.atan2(this._tempTarget.x-this._tempVector1.x,this._tempTarget.z-this._tempVector1.z);this._camera.rotation.z=w+Math.PI}this._plane.set(this.down,this._tempVector1.y);const g=e.background;e.background=this.backgroundColor,this.renderer.render(e,this._camera),e.background=g,this.onAfterUpdate.trigger()}getSize(){return this._size}resize(e){if(e){this._size.copy(e),this.renderer.setSize(e.x,e.y);const t=e.x/e.y,o=1;this._camera.left=o*t/-2,this._camera.right=o*t/2,this._camera.top=o/2,this._camera.bottom=-o/2,this._camera.updateProjectionMatrix(),this.onResize.trigger(e)}}}const d=class d extends E{constructor(t){super(t);r(this,"onAfterUpdate",new c);r(this,"onBeforeUpdate",new c);r(this,"onDisposed",new c);r(this,"enabled",!0);r(this,"list",new Map);this.components.add(d.uuid,this)}create(t){if(this.list.has(t.uuid))throw new Error("This world already has a minimap!");const o=new O(t);return this.list.set(t.uuid,o),o}delete(t){const o=this.list.get(t);o&&o.dispose(),this.list.delete(t)}dispose(){for(const[t,o]of this.list)o.dispose();this.list.clear(),this.onDisposed.trigger()}update(){for(const[t,o]of this.list)o.update()}};r(d,"uuid","39ad6aad-84c8-4adf-a1e0-7f25313a9e7f");let h=d;const I=document.getElementById("container"),n=new T,G=n.get(U),i=G.create();i.scene=new B(n);i.renderer=new M(n,I);i.camera=new $(n);i.scene.setup();n.init();const L=n.get(A);L.create(i);i.camera.controls.setLookAt(1,2,-2,-2,0,-5);const W=new D(n),j=await fetch("../../../../../resources/small.frag"),F=await j.arrayBuffer(),q=new Uint8Array(F),H=W.load(q);i.scene.three.add(H);const X=new h(n),a=X.create(i),Y=document.getElementById("minimap"),f=a.renderer.domElement;f.style.borderRadius="12px";Y.append(f);a.lockRotation=!1;a.zoom=.2;const p=new V;p.showPanel(2);document.body.append(p.dom);p.dom.style.left="0px";i.renderer.onBeforeUpdate.add(()=>p.begin());i.renderer.onAfterUpdate.add(()=>p.end());C.registerComponents();const l=a.getSize(),Z=R.create(()=>P`
    <bim-panel label="Minimap Tutorial" style="position: fixed; top: 5px; right: 5px" active>
      <bim-panel-section style="padding-top: 10px">
      
        <bim-checkbox checked="true" label="Enabled" 
          @change="${({target:s})=>{a.enabled=s.value}}">  
        </bim-checkbox>
        
        <bim-checkbox label="Lock rotation" 
          @change="${({target:s})=>{a.lockRotation=s.value}}">  
        </bim-checkbox>
      
        <bim-color-input 
          label="Background Color" color="#202932" 
          @input="${({target:s})=>{i.scene.three.background=new u(s.color)}}">
        </bim-color-input>
        
        
        <bim-number-input 
          slider label="Zoom" value="${a.zoom}" min="0.01" max="0.5" step="0.01" 
          @change="${({target:s})=>{a.frontOffset=s.value}}">
        </bim-number-input>
                
        <div style="display: flex; gap: 12px">
        
          <bim-number-input slider value="${l.x}" pref="Size X" min="100" max="500" step="10"              
            @change="${({target:s})=>{const e=a.getSize();e.x=s.value,a.resize(e)}}">
          </bim-number-input>        
        
          <bim-number-input slider value="${l.y}" pref="Size Y" min="100" max="500" step="10"            
            @change="${({target:s})=>{const e=a.getSize();e.y=s.value,a.resize(e)}}">
          </bim-number-input>
        </div>
  
        
      </bim-panel-section>
    </bim-panel>
    `);document.body.append(Z);
