import{t as h,B as M,J as F,u as B,w as U,M as V,h as R,s as q,q as W,V as r,G as H,f as Y,R as N,p as X,m as $,k as x,a as k,b as J,n as Z,P as K}from"./index-CihJyAGz.js";import{T as Q,F as ee}from"./FontLoader-CkaXl0yw.js";import{C as te,W as ne,S as oe,a as se,f as ae,F as A}from"./index-Dy8ZicqY.js";import{T as ie,U as re}from"./index-YMXcKuMf.js";import{L as ce}from"./index-0a2HYHft.js";import"./index-gnb7d6C_.js";import"./three.tsl-DtvQaLlC.js";import"./ticks-Dlmou7_z.js";const d=new te,le=d.get(ne),s=le.create();s.scene=new oe(d);s.scene.setup();s.scene.three.background=null;const g=document.getElementById("container");s.renderer=new se(d,g);s.camera=new ae(d);await s.camera.controls.setLookAt(48.213,33.495,-5.062,13.117,-1.205,22.223);d.init();const de=await A.getWorker(),p=d.get(A);p.init(de);s.camera.controls.addEventListener("update",()=>p.core.update());p.list.onItemSet.add(({value:t})=>{t.useCamera(s.camera.three),s.scene.three.add(t.object),p.core.update(!0)});p.core.models.materials.list.onItemSet.add(({value:t})=>{"isLodMaterial"in t&&t.isLodMaterial||(t.polygonOffset=!0,t.polygonOffsetUnits=1,t.polygonOffsetFactor=Math.random())});const me=await fetch("https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"),pe=await me.arrayBuffer();await p.core.load(pe,{modelId:"school_arq"});const j=d.get(ie),n=j.create(s);n.three.position.y=11.427046;const fe=await fetch("https://thatopen.github.io/engine_components/resources/projections/projection.json").then(t=>t.json());n.layers.create("Geometry",{material:new h({color:16711680})});n.layers.create("Reference",{material:new h({color:22015})});n.layers.create("Dimensions",{material:new h({color:4491519})});const z=new M;z.setAttribute("position",new F(new Float32Array(fe.positions),3));n.addProjectionLines(new B(z),"Geometry");const G=new M;G.setAttribute("position",new F(new Float32Array([6.5,0,5,18.5,0,5,12,0,-.5,12,0,9.5]),3));n.addProjectionLines(new B(G),"Reference");const i=j.use(ce);let l=()=>{};const be=new Q,ue=await new Promise(t=>{be.load("https://thatopen.github.io/engine_components/resources/fonts/PlusJakartaSans-Medium.ttf",e=>{t(new ee(e))})});i.onCommit.add(t=>{for(const{item:e,group:o}of t){n.layers.assign(o,"Dimensions");const a=i.styles.get(e.style)??i.styles.get("default"),b=a.unit??re.m,y=`${(e.pointA.distanceTo(e.pointB)*b.factor).toFixed(2)} ${b.suffix}`,S=ue.generateShapes(y,a.fontSize),u=new U(S),w=new V(u,new R({color:a.color,side:q}));w.rotation.x=-Math.PI/2,w.layers.set(1);const C=new W().setFromObject(w).getCenter(new r);w.position.set(-C.x,0,-C.z);const P=new r().subVectors(e.pointB,e.pointA),E=new r(-P.z,0,P.x).normalize(),T=e.pointA.clone().add(e.pointB).multiplyScalar(.5).addScaledVector(E,e.offset),v=new H;v.layers.set(1),v.position.copy(T).addScaledVector(E,Math.sign(e.offset)*a.textOffset).setY(.005),v.add(w),o.add(v)}l()});i.onDelete.add(()=>l());const O=new M().setFromPoints([new r,new r]),c=new Y(O,new h({color:30719,depthTest:!1}));c.layers.set(1);c.renderOrder=999;c.frustumCulled=!1;c.visible=!1;n.three.add(c);const m=new N,D=new K,_=t=>{const e=g.getBoundingClientRect();return new Z((t.clientX-e.left)/e.width*2-1,-((t.clientY-e.top)/e.height)*2+1)},I=t=>{const e=new r(0,1,0).transformDirection(n.three.matrixWorld),o=new r().setFromMatrixPosition(n.three.matrixWorld);D.setFromNormalAndCoplanarPoint(e,o);const a=new r;return t.intersectPlane(D,a),n.three.worldToLocal(a)};g.addEventListener("mousemove",t=>{m.setFromCamera(_(t),s.camera.three);const e=n.raycast(m.ray);if(e!=null&&e.line){const o=O.attributes.position;o.setXYZ(0,e.line.start.x,.01,e.line.start.z),o.setXYZ(1,e.line.end.x,.01,e.line.end.z),o.needsUpdate=!0,c.visible=!0}else c.visible=!1;i.machineState.kind==="positioningOffset"&&i.sendMachineEvent({type:"MOUSE_MOVE",point:I(m.ray)})});g.addEventListener("mouseleave",()=>{c.visible=!1});document.addEventListener("keydown",t=>{t.key==="Escape"&&i.sendMachineEvent({type:"ESCAPE"})});g.addEventListener("click",t=>{m.setFromCamera(_(t),s.camera.three);const e=n.raycast(m.ray);if(i.machineState.kind==="awaitingFirstPoint"&&(e!=null&&e.line)){i.sendMachineEvent({type:"SELECT_LINE",line:e.line,drawing:n});return}i.machineState.kind==="positioningOffset"&&i.sendMachineEvent({type:"CLICK",point:I(m.ray),drawing:n})});X.init();const we=t=>"#"+t.toString(16).padStart(6,"0"),[L,he]=$.create(t=>k`
    <bim-panel active label="Drawing Layers" class="options-menu">

      <bim-panel-section label="Layers">
        ${[...n.layers].map(([e,o])=>k`
          <div style="display:flex; flex-direction:row; gap:0.5rem; justify-content:space-between;">
            <bim-checkbox
              style="flex:0"
              inverted
              label=${e}
              ?checked=${o.visible}
              @change=${a=>{n.layers.setVisibility(e,a.target.checked),l()}}>
            </bim-checkbox>
            <bim-color-input
              style="max-width:fit-content"
              color=${we(o.material.color.getHex())}
              @input=${a=>{n.layers.setColor(e,parseInt(a.target.color.slice(1),16)),l()}}>
            </bim-color-input>
            <bim-dropdown
              style="max-width:fit-content"
              @change=${a=>{const b=a.target.value[0]==="dashed",y=o.material.color.getHex(),S=b?new x({color:y,dashSize:.3,gapSize:.2}):new h({color:y});n.layers.setMaterial(e,S),b&&n.three.traverse(u=>{u.userData.layer===e&&u.isLineSegments&&u.computeLineDistances()}),l()}}>
              <bim-option label="Solid" value="solid"
                ?checked=${!(o.material instanceof x)}>
              </bim-option>
              <bim-option label="Dashed" value="dashed"
                ?checked=${o.material instanceof x}>
              </bim-option>
            </bim-dropdown>
          </div>
        `)}
      </bim-panel-section>

      <bim-panel-section label="Linear Dimensions">
        <bim-label>Hover a projection line, then click to place a dimension</bim-label>
        <bim-label>Committed: ${n.annotations.getBySystem(i).size}</bim-label>
        <bim-button
          label="Clear all"
          @click=${()=>{i.clear(),l()}}>
        </bim-button>
      </bim-panel-section>

    </bim-panel>
  `,{});l=he;document.body.append(L);const ge=$.create(()=>k`
  <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
    @click="${()=>{L.classList.contains("options-menu-visible")?L.classList.remove("options-menu-visible"):L.classList.add("options-menu-visible")}}">
  </bim-button>
`);document.body.append(ge);const f=new J;f.showPanel(2);document.body.append(f.dom);f.dom.style.left="0px";f.dom.style.zIndex="unset";s.renderer.onBeforeUpdate.add(()=>f.begin());s.renderer.onAfterUpdate.add(()=>f.end());
