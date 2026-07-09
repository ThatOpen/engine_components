import{B as O,E as M,q as I,r as N,R as U,p as _,m as S,a as g,b as F,j as $,V as h,P as x}from"./index-r1u2qk8S.js";import{C as E,W as G,S as W,a as q,f as z,F as D}from"./index-Dx2GLmSS.js";import{T}from"./index-FkodYGyV.js";import{B as V}from"./index-DrkK79j1.js";import"./index-BKAJsCnu.js";import"./three.tsl-BohoDV_b.js";const i=new E,X=i.get(G),o=X.create();o.scene=new W(i);o.scene.setup();o.scene.three.background=null;const L=document.getElementById("container");o.renderer=new q(i,L);o.camera=new z(i);await o.camera.controls.setLookAt(48.213,33.495,-5.062,13.117,-1.205,22.223);i.init();const Y=await D.getWorker(),l=i.get(D);l.init(Y);o.camera.controls.addEventListener("update",()=>l.core.update());l.list.onItemSet.add(({value:e})=>{e.useCamera(o.camera.three),o.scene.three.add(e.object),l.core.update(!0)});l.core.models.materials.list.onItemSet.add(({value:e})=>{"isLodMaterial"in e&&e.isLodMaterial||(e.polygonOffset=!0,e.polygonOffsetUnits=1,e.polygonOffsetFactor=Math.random())});const H=await fetch("https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"),J=await H.arrayBuffer();await l.core.load(J,{modelId:"school_arq"});const v=i.get(T),a=v.create(o);a.three.position.y=11.427046;const K=await fetch("https://thatopen.github.io/engine_components/resources/projections/projection.json").then(e=>e.json()),R=new O;R.setAttribute("position",new M(new Float32Array(K.positions),3));a.layers.create("projection",{material:new I({color:16711680})});const Q=new N(R);a.addProjectionLines(Q,"projection");const s=v.use(V);s.styles.set("COLUMN",{color:21964,textOffset:0,fontSize:0});s.styles.set("DOOR",{color:13386752,textOffset:0,fontSize:0});const y=[],u=.35,w=16;for(let e=0;e<w;e++){const t=e/w*Math.PI*2,n=(e+1)/w*Math.PI*2;y.push(Math.cos(t)*u,0,Math.sin(t)*u),y.push(Math.cos(n)*u,0,Math.sin(n)*u)}const j=new O;j.setAttribute("position",new M(new Float32Array(y),3));s.define("COLUMN",{lines:j});const r=.9,f=12,p=[];for(let e=0;e<f;e++){const t=e/f*(Math.PI/2),n=(e+1)/f*(Math.PI/2);p.push(Math.cos(t)*r,0,Math.sin(t)*r),p.push(Math.cos(n)*r,0,Math.sin(n)*r)}p.push(0,0,0,r,0,0);p.push(0,0,0,0,0,r);const A=new O;A.setAttribute("position",new M(new Float32Array(p),3));s.define("DOOR",{lines:A});let k=()=>{},c=null;s.onCommit.add(([{item:e}])=>{c=e.uuid,k()});let d="COLUMN",Z=0;const P=new U,B=new x,ee=e=>{const t=L.getBoundingClientRect();return new $((e.clientX-t.left)/t.width*2-1,-((e.clientY-t.top)/t.height)*2+1)},te=e=>{const t=new h(0,1,0).transformDirection(a.three.matrixWorld),n=new h().setFromMatrixPosition(a.three.matrixWorld);B.setFromNormalAndCoplanarPoint(t,n);const C=new h;return e.intersectPlane(B,C),a.three.worldToLocal(C)};L.addEventListener("click",e=>{P.setFromCamera(ee(e),o.camera.three);const t=te(P.ray);s.add(a,{blockName:d,position:t,rotation:Z,scale:1,style:d})});const oe=()=>{if(!c)return;const e=a.annotations.getBySystem(s).get(c);s.update(a,[c],{rotation:e.rotation+Math.PI/4})};_.init();const[b,ne]=S.create(e=>g`
    <bim-panel active label="Drawing Blocks" class="options-menu">

      <bim-panel-section label="Active Block">
        <bim-dropdown label="Block"
          @change=${t=>{d=t.target.value[0]}}>
          <bim-option label="Column" value="COLUMN" ?checked=${d==="COLUMN"}></bim-option>
          <bim-option label="Door"   value="DOOR"   ?checked=${d==="DOOR"}></bim-option>
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
`);document.body.append(ae);const m=new F;m.showPanel(2);document.body.append(m.dom);m.dom.style.left="0px";m.dom.style.zIndex="unset";o.renderer.onBeforeUpdate.add(()=>m.begin());o.renderer.onAfterUpdate.add(()=>m.end());
