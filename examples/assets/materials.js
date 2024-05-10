var k=Object.defineProperty;var D=(i,e,t)=>e in i?k(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var r=(i,e,t)=>(D(i,typeof e!="symbol"?e+"":e,t),t);import{I as b,B,aB as E,t as I,C as f,d as M,M as w}from"./index-vsiIwi5G.js";import{S as _}from"./stats.min-GTpOrGrX.js";import{k as G,C as T,b as v}from"./index-CA2cPfXk.js";import{a as R,E as $,C as z}from"./index-BhNtB8fA.js";import{W as A,S as L}from"./index-W7GLNhb1.js";import{S as U,a as W}from"./simple-camera-CmWpoHk7.js";import"./_commonjsHelpers-Cpj98o6Y.js";const m=class m extends R{constructor(t){super(t);r(this,"enabled",!0);r(this,"onDisposed",new $);r(this,"list",{});r(this,"_originals",{});this.components.add(m.uuid,this)}dispose(){for(const t in this.list){const{material:o}=this.list[t];o.dispose()}this.list={},this._originals={},this.onDisposed.trigger(m.uuid),this.onDisposed.reset()}set(t,o=Object.keys(this.list)){for(const d of o){const{material:y,meshes:S}=this.list[d];for(const s of S)if(t)this._originals[s.uuid]||(this._originals[s.uuid]={material:s.material}),s instanceof b&&s.instanceColor&&(this._originals[s.uuid].instances=s.instanceColor,s.instanceColor=null),s.material=y;else{if(!this._originals[s.uuid])continue;s.material=this._originals[s.uuid].material;const u=this._originals[s.uuid].instances;s instanceof b&&u&&(s.instanceColor=u)}}}addMaterial(t,o){if(this.list[t])throw new Error("This ID already exists!");this.list[t]={material:o,meshes:new Set}}addMeshes(t,o){if(!this.list[t])throw new Error("This ID doesn't exists!");for(const d of o)this.list[t].meshes.add(d)}removeMeshes(t,o){if(!this.list[t])throw new Error("This ID doesn't exists!");for(const d of o)this.list[t].meshes.delete(d)}};r(m,"uuid","24989d27-fa2f-4797-8b08-35918f74e502");let p=m;const j=document.getElementById("container"),c=new z,N=c.get(A),n=N.create();n.scene=new U(c);n.renderer=new L(c,j);n.camera=new W(c);c.init();n.camera.controls.setLookAt(13,13,13,0,0,0);n.scene.setup();const g=[],C=[],O=new B(2,2,2),P=new E(2,8,8),x=new I({color:"#6528D7"});function l(i){return Math.random()*i}function q(){for(let i=0;i<3;i++){const e=new w(O,x);e.position.x=l(10),e.position.y=l(10),e.position.z=l(10),e.updateMatrix(),n.scene.three.add(e),g.push(e)}}function F(){for(let i=0;i<3;i++){const e=new w(P,x);e.position.x=l(10),e.position.y=l(10),e.position.z=l(10),e.updateMatrix(),n.scene.three.add(e),C.push(e)}}q();F();const a=c.get(p),H=new f(7460648),J=new M({color:H}),K=new f(14100587),Q=new M({color:K});a.addMaterial("cubeMaterial",J);a.addMeshes("cubeMaterial",g);a.addMaterial("sphereMaterial",Q);a.addMeshes("sphereMaterial",C);G.registerComponents();const V=T.create(()=>v`
    <bim-panel label="Materials Tutorial" style="position: fixed; top: 5px; right: 5px" active>
      <bim-panel-section style="padding-top: 10px">
      
        <bim-button 
          label="Change spheres material" 
          @click="${()=>{a.set(!0,["sphereMaterial"])}}">  
        </bim-button>  
              
        <bim-button 
          label="Change cubes material" 
          @click="${()=>{a.set(!0,["cubeMaterial"])}}">  
        </bim-button>  
              
        <bim-button 
          label="Reset materials" 
          @click="${()=>{a.set(!1,["cubeMaterial","sphereMaterial"])}}">  
        </bim-button>
        
      </bim-panel-section>
    </bim-panel>
    `);document.body.append(V);const h=new _;h.showPanel(2);document.body.append(h.dom);h.dom.style.left="0px";n.renderer.onBeforeUpdate.add(()=>h.begin());n.renderer.onAfterUpdate.add(()=>h.end());
