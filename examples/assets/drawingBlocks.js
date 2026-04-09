import{B as O,y as k,p as U,q as A,R as F,P as I,l as N,c as S,a as g,b as _,k as $,V as h}from"./index-lAiblgEx.js";import{C as x,W as G,S as W,a as q,f as E,F as z}from"./index-Da4Pyzo_.js";import{T}from"./index-C1KzLF6N.js";import{B as V}from"./index-CmcsC9_D.js";import"./index-C0TZEIvY.js";const r=new x,X=r.get(G),o=X.create();o.scene=new W(r);o.scene.setup();o.scene.three.background=null;const M=document.getElementById("container");o.renderer=new q(r,M);o.camera=new E(r);await o.camera.controls.setLookAt(48.213,33.495,-5.062,13.117,-1.205,22.223);r.init();const Y="https://thatopen.github.io/engine_fragment/resources/worker.mjs",H=await fetch(Y),J=await H.blob(),K=new File([J],"worker.mjs",{type:"text/javascript"}),Q=URL.createObjectURL(K),l=r.get(z);l.init(Q);o.camera.controls.addEventListener("update",()=>l.core.update());l.list.onItemSet.add(({value:e})=>{e.useCamera(o.camera.three),o.scene.three.add(e.object),l.core.update(!0)});l.core.models.materials.list.onItemSet.add(({value:e})=>{"isLodMaterial"in e&&e.isLodMaterial||(e.polygonOffset=!0,e.polygonOffsetUnits=1,e.polygonOffsetFactor=Math.random())});const Z=await fetch("/resources/frags/school_arq.frag"),ee=await Z.arrayBuffer();await l.core.load(ee,{modelId:"school_arq"});const v=r.get(T),a=v.create(o);a.three.position.y=11.427046;const te=await fetch("/resources/projections/projection.json").then(e=>e.json()),D=new O;D.setAttribute("position",new k(new Float32Array(te.positions),3));a.layers.create("projection",{material:new U({color:16711680})});const oe=new A(D);a.addProjectionLines(oe,"projection");const s=v.use(V);s.styles.set("COLUMN",{color:21964,textOffset:0,fontSize:0});s.styles.set("DOOR",{color:13386752,textOffset:0,fontSize:0});const y=[],u=.35,w=16;for(let e=0;e<w;e++){const t=e/w*Math.PI*2,n=(e+1)/w*Math.PI*2;y.push(Math.cos(t)*u,0,Math.sin(t)*u),y.push(Math.cos(n)*u,0,Math.sin(n)*u)}const R=new O;R.setAttribute("position",new k(new Float32Array(y),3));s.define("COLUMN",{lines:R});const i=.9,f=12,p=[];for(let e=0;e<f;e++){const t=e/f*(Math.PI/2),n=(e+1)/f*(Math.PI/2);p.push(Math.cos(t)*i,0,Math.sin(t)*i),p.push(Math.cos(n)*i,0,Math.sin(n)*i)}p.push(0,0,0,i,0,0);p.push(0,0,0,0,0,i);const j=new O;j.setAttribute("position",new k(new Float32Array(p),3));s.define("DOOR",{lines:j});let L=()=>{},c=null;s.onCommit.add(([{item:e}])=>{c=e.uuid,L()});let m="COLUMN",ne=0;const B=new F,P=new I,ae=e=>{const t=M.getBoundingClientRect();return new $((e.clientX-t.left)/t.width*2-1,-((e.clientY-t.top)/t.height)*2+1)},se=e=>{const t=new h(0,1,0).transformDirection(a.three.matrixWorld),n=new h().setFromMatrixPosition(a.three.matrixWorld);P.setFromNormalAndCoplanarPoint(t,n);const C=new h;return e.intersectPlane(P,C),a.three.worldToLocal(C)};M.addEventListener("click",e=>{B.setFromCamera(ae(e),o.camera.three);const t=se(B.ray);s.add(a,{blockName:m,position:t,rotation:ne,scale:1,style:m})});const re=()=>{if(!c)return;const e=a.annotations.getBySystem(s).get(c);s.update(a,[c],{rotation:e.rotation+Math.PI/4})};N.init();const[b,ie]=S.create(e=>g`
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
          @click=${re}>
        </bim-button>
        <bim-button
          label="Clear all"
          @click=${()=>{s.clear([a]),c=null,L()}}>
        </bim-button>
      </bim-panel-section>

    </bim-panel>
  `,{});L=ie;document.body.append(b);const ce=S.create(()=>g`
  <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
    @click="${()=>{b.classList.contains("options-menu-visible")?b.classList.remove("options-menu-visible"):b.classList.add("options-menu-visible")}}">
  </bim-button>
`);document.body.append(ce);const d=new _;d.showPanel(2);document.body.append(d.dom);d.dom.style.left="0px";d.dom.style.zIndex="unset";o.renderer.onBeforeUpdate.add(()=>d.begin());o.renderer.onAfterUpdate.add(()=>d.end());
