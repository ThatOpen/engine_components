import{B as O,y as k,o as U,q as A,R as F,P as I,p as _,m as S,a as g,b as N,j as $,V as h}from"./index-Lqgjukd8.js";import{C as x,W as G,S as W,a as q,f as E,F as z}from"./index-Dti8v1Xu.js";import{T}from"./index-DgbCpKb3.js";import{B as V}from"./index-DBL9cHrA.js";import"./index-YRuTAcp3.js";const i=new x,X=i.get(G),o=X.create();o.scene=new W(i);o.scene.setup();o.scene.three.background=null;const M=document.getElementById("container");o.renderer=new q(i,M);o.camera=new E(i);await o.camera.controls.setLookAt(48.213,33.495,-5.062,13.117,-1.205,22.223);i.init();const Y="https://thatopen.github.io/engine_fragment/resources/worker.mjs",H=await fetch(Y),J=await H.blob(),K=new File([J],"worker.mjs",{type:"text/javascript"}),Q=URL.createObjectURL(K),l=i.get(z);l.init(Q);o.camera.controls.addEventListener("update",()=>l.core.update());l.list.onItemSet.add(({value:e})=>{e.useCamera(o.camera.three),o.scene.three.add(e.object),l.core.update(!0)});l.core.models.materials.list.onItemSet.add(({value:e})=>{"isLodMaterial"in e&&e.isLodMaterial||(e.polygonOffset=!0,e.polygonOffsetUnits=1,e.polygonOffsetFactor=Math.random())});const Z=await fetch("https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"),ee=await Z.arrayBuffer();await l.core.load(ee,{modelId:"school_arq"});const j=i.get(T),a=j.create(o);a.three.position.y=11.427046;const te=await fetch("https://thatopen.github.io/engine_components/resources/projections/projection.json").then(e=>e.json()),v=new O;v.setAttribute("position",new k(new Float32Array(te.positions),3));a.layers.create("projection",{material:new U({color:16711680})});const oe=new A(v);a.addProjectionLines(oe,"projection");const s=j.use(V);s.styles.set("COLUMN",{color:21964,textOffset:0,fontSize:0});s.styles.set("DOOR",{color:13386752,textOffset:0,fontSize:0});const y=[],u=.35,w=16;for(let e=0;e<w;e++){const t=e/w*Math.PI*2,n=(e+1)/w*Math.PI*2;y.push(Math.cos(t)*u,0,Math.sin(t)*u),y.push(Math.cos(n)*u,0,Math.sin(n)*u)}const D=new O;D.setAttribute("position",new k(new Float32Array(y),3));s.define("COLUMN",{lines:D});const r=.9,f=12,p=[];for(let e=0;e<f;e++){const t=e/f*(Math.PI/2),n=(e+1)/f*(Math.PI/2);p.push(Math.cos(t)*r,0,Math.sin(t)*r),p.push(Math.cos(n)*r,0,Math.sin(n)*r)}p.push(0,0,0,r,0,0);p.push(0,0,0,0,0,r);const R=new O;R.setAttribute("position",new k(new Float32Array(p),3));s.define("DOOR",{lines:R});let L=()=>{},c=null;s.onCommit.add(([{item:e}])=>{c=e.uuid,L()});let d="COLUMN",ne=0;const B=new F,P=new I,ae=e=>{const t=M.getBoundingClientRect();return new $((e.clientX-t.left)/t.width*2-1,-((e.clientY-t.top)/t.height)*2+1)},se=e=>{const t=new h(0,1,0).transformDirection(a.three.matrixWorld),n=new h().setFromMatrixPosition(a.three.matrixWorld);P.setFromNormalAndCoplanarPoint(t,n);const C=new h;return e.intersectPlane(P,C),a.three.worldToLocal(C)};M.addEventListener("click",e=>{B.setFromCamera(ae(e),o.camera.three);const t=se(B.ray);s.add(a,{blockName:d,position:t,rotation:ne,scale:1,style:d})});const ie=()=>{if(!c)return;const e=a.annotations.getBySystem(s).get(c);s.update(a,[c],{rotation:e.rotation+Math.PI/4})};_.init();const[b,re]=S.create(e=>g`
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
          @click=${ie}>
        </bim-button>
        <bim-button
          label="Clear all"
          @click=${()=>{s.clear([a]),c=null,L()}}>
        </bim-button>
      </bim-panel-section>

    </bim-panel>
  `,{});L=re;document.body.append(b);const ce=S.create(()=>g`
  <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
    @click="${()=>{b.classList.contains("options-menu-visible")?b.classList.remove("options-menu-visible"):b.classList.add("options-menu-visible")}}">
  </bim-button>
`);document.body.append(ce);const m=new N;m.showPanel(2);document.body.append(m.dom);m.dom.style.left="0px";m.dom.style.zIndex="unset";o.renderer.onBeforeUpdate.add(()=>m.begin());o.renderer.onAfterUpdate.add(()=>m.end());
