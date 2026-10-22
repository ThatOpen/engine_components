import{B as O,o as M,L as j,p as N,v as U,K as _,n as S,b as g,S as F,w as $,V as h,i as x}from"./TransformControls-lNp9RmyE.js";import{C as G,W,S as E,a as q,e as z,F as v}from"./index-CVHtJqZ2.js";import{T}from"./index-BrshZ9pk.js";import{B as V}from"./index-DevqH5IR.js";import"./index-d-7rbIVH.js";import"./preload-helper-PPVm8Dsz.js";const i=new G,K=i.get(W),o=K.create();o.scene=new E(i);o.scene.setup();o.scene.three.background=null;const L=document.getElementById("container");o.renderer=new q(i,L);o.camera=new z(i);await o.camera.controls.setLookAt(48.213,33.495,-5.062,13.117,-1.205,22.223);i.init();const X=await v.getWorker(),l=i.get(v);l.init(X);o.camera.controls.addEventListener("update",()=>l.core.update());l.list.onItemSet.add(({value:e})=>{e.useCamera(o.camera.three),o.scene.three.add(e.object),l.core.update(!0)});l.core.models.materials.list.onItemSet.add(({value:e})=>{"isLodMaterial"in e&&e.isLodMaterial||(e.polygonOffset=!0,e.polygonOffsetUnits=1,e.polygonOffsetFactor=Math.random())});const Y=await fetch("https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"),H=await Y.arrayBuffer();await l.core.load(H,{modelId:"school_arq"});const D=i.get(T),a=D.create(o);a.three.position.y=11.427046;const J=await fetch("https://thatopen.github.io/engine_components/resources/projections/projection.json").then(e=>e.json()),R=new O;R.setAttribute("position",new M(new Float32Array(J.positions),3));a.layers.create("projection",{material:new j({color:16711680})});const Q=new N(R);a.addProjectionLines(Q,"projection");const s=D.use(V);s.styles.set("COLUMN",{color:21964,textOffset:0,fontSize:0});s.styles.set("DOOR",{color:13386752,textOffset:0,fontSize:0});const y=[],u=.35,w=16;for(let e=0;e<w;e++){const t=e/w*Math.PI*2,n=(e+1)/w*Math.PI*2;y.push(Math.cos(t)*u,0,Math.sin(t)*u),y.push(Math.cos(n)*u,0,Math.sin(n)*u)}const A=new O;A.setAttribute("position",new M(new Float32Array(y),3));s.define("COLUMN",{lines:A});const r=.9,f=12,p=[];for(let e=0;e<f;e++){const t=e/f*(Math.PI/2),n=(e+1)/f*(Math.PI/2);p.push(Math.cos(t)*r,0,Math.sin(t)*r),p.push(Math.cos(n)*r,0,Math.sin(n)*r)}p.push(0,0,0,r,0,0);p.push(0,0,0,0,0,r);const I=new O;I.setAttribute("position",new M(new Float32Array(p),3));s.define("DOOR",{lines:I});let k=()=>{},c=null;s.onCommit.add(([{item:e}])=>{c=e.uuid,k()});let m="COLUMN",Z=0;const B=new U,P=new x,ee=e=>{const t=L.getBoundingClientRect();return new $((e.clientX-t.left)/t.width*2-1,-((e.clientY-t.top)/t.height)*2+1)},te=e=>{const t=new h(0,1,0).transformDirection(a.three.matrixWorld),n=new h().setFromMatrixPosition(a.three.matrixWorld);P.setFromNormalAndCoplanarPoint(t,n);const C=new h;return e.intersectPlane(P,C),a.three.worldToLocal(C)};L.addEventListener("click",e=>{B.setFromCamera(ee(e),o.camera.three);const t=te(B.ray);s.add(a,{blockName:m,position:t,rotation:Z,scale:1,style:m})});const oe=()=>{if(!c)return;const e=a.annotations.getBySystem(s).get(c);s.update(a,[c],{rotation:e.rotation+Math.PI/4})};_.init();const[b,ne]=S.create(e=>g`
    <bim-panel active label="Drawing Blocks" class="options-menu">

      <bim-panel-section label="Active Block">
        <bim-dropdown label="Block"
          @change=${t=>{m=t.target.value[0]}}>
          <bim-option label="Column" value="COLUMN" ?checked=${m==="COLUMN"}></bim-option>
          <bim-option label="Door"   value="DOOR"   ?checked=${m==="DOOR"}></bim-option>
        </bim-dropdown>
        <bim-label>Click anywhere on the drawing to place</bim-label>
      </bim-panel-section>

      <bim-panel-section label="Insertions">
        ${(()=>{const t=[...a.annotations.getBySystem(s).values()];return g`
            <bim-label>Columns: ${t.filter(n=>n.blockName==="COLUMN").length} · Doors: ${t.filter(n=>n.blockName==="DOOR").length}</bim-label>
          `})()}
        <bim-button
          label="Rotate last 45°"
          ?disabled=${!c}
          @click=${oe}>
        </bim-button>
        <bim-button
          label="Clear all"
          @click=${()=>{s.clear([a]),c=null,k()}}>
        </bim-button>
      </bim-panel-section>

    </bim-panel>
  `,{});k=ne;document.body.append(b);const ae=S.create(()=>g`
  <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
    @click="${()=>{b.classList.contains("options-menu-visible")?b.classList.remove("options-menu-visible"):b.classList.add("options-menu-visible")}}">
  </bim-button>
`);document.body.append(ae);const d=new F;d.showPanel(2);document.body.append(d.dom);d.dom.style.left="0px";d.dom.style.zIndex="unset";o.renderer.onBeforeUpdate.add(()=>d.begin());o.renderer.onAfterUpdate.add(()=>d.end());
