import{o as h,B as M,y as E,q as j,s as I,M as T,e as R,D as V,l as q,V as r,G as W,L as H,R as Y,P as N,p as X,m as B,h as x,a as k,b as Z,j as J}from"./index-BNf8AL5k.js";import{T as K,F as Q}from"./FontLoader-D_5CqpKI.js";import{C as ee,W as te,S as ne,a as oe,f as se,F as ae}from"./index-DwlKX12C.js";import{T as ie,U as re}from"./index-DLtwR-0W.js";import{L as ce}from"./index-ChJ76L6A.js";import"./index-DwCB2ABR.js";import"./ticks-8hjRULTR.js";const d=new ee,le=d.get(te),s=le.create();s.scene=new ne(d);s.scene.setup();s.scene.three.background=null;const g=document.getElementById("container");s.renderer=new oe(d,g);s.camera=new se(d);await s.camera.controls.setLookAt(48.213,33.495,-5.062,13.117,-1.205,22.223);d.init();const de="https://thatopen.github.io/engine_fragment/resources/worker.mjs",me=await fetch(de),pe=await me.blob(),be=new File([pe],"worker.mjs",{type:"text/javascript"}),fe=URL.createObjectURL(be),p=d.get(ae);p.init(fe);s.camera.controls.addEventListener("update",()=>p.core.update());p.list.onItemSet.add(({value:t})=>{t.useCamera(s.camera.three),s.scene.three.add(t.object),p.core.update(!0)});p.core.models.materials.list.onItemSet.add(({value:t})=>{"isLodMaterial"in t&&t.isLodMaterial||(t.polygonOffset=!0,t.polygonOffsetUnits=1,t.polygonOffsetFactor=Math.random())});const ue=await fetch("https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"),we=await ue.arrayBuffer();await p.core.load(we,{modelId:"school_arq"});const $=d.get(ie),n=$.create(s);n.three.position.y=11.427046;const he=await fetch("https://thatopen.github.io/engine_components/resources/projections/projection.json").then(t=>t.json());n.layers.create("Geometry",{material:new h({color:16711680})});n.layers.create("Reference",{material:new h({color:22015})});n.layers.create("Dimensions",{material:new h({color:4491519})});const A=new M;A.setAttribute("position",new E(new Float32Array(he.positions),3));n.addProjectionLines(new j(A),"Geometry");const O=new M;O.setAttribute("position",new E(new Float32Array([6.5,0,5,18.5,0,5,12,0,-.5,12,0,9.5]),3));n.addProjectionLines(new j(O),"Reference");const i=$.use(ce);let l=()=>{};const ge=new K,ye=await new Promise(t=>{ge.load("/resources/fonts/PlusJakartaSans-Medium.ttf",e=>{t(new Q(e))})});i.onCommit.add(t=>{for(const{item:e,group:o}of t){n.layers.assign(o,"Dimensions");const a=i.styles.get(e.style)??i.styles.get("default"),f=a.unit??re.m,y=`${(e.pointA.distanceTo(e.pointB)*f.factor).toFixed(2)} ${f.suffix}`,S=ye.generateShapes(y,a.fontSize),u=new I(S),w=new T(u,new R({color:a.color,side:V}));w.rotation.x=-Math.PI/2,w.layers.set(1);const C=new q().setFromObject(w).getCenter(new r);w.position.set(-C.x,0,-C.z);const F=new r().subVectors(e.pointB,e.pointA),P=new r(-F.z,0,F.x).normalize(),_=e.pointA.clone().add(e.pointB).multiplyScalar(.5).addScaledVector(P,e.offset),v=new W;v.layers.set(1),v.position.copy(_).addScaledVector(P,Math.sign(e.offset)*a.textOffset).setY(.005),v.add(w),o.add(v)}l()});i.onDelete.add(()=>l());const U=new M().setFromPoints([new r,new r]),c=new H(U,new h({color:30719,depthTest:!1}));c.layers.set(1);c.renderOrder=999;c.frustumCulled=!1;c.visible=!1;n.three.add(c);const m=new Y,D=new N,z=t=>{const e=g.getBoundingClientRect();return new J((t.clientX-e.left)/e.width*2-1,-((t.clientY-e.top)/e.height)*2+1)},G=t=>{const e=new r(0,1,0).transformDirection(n.three.matrixWorld),o=new r().setFromMatrixPosition(n.three.matrixWorld);D.setFromNormalAndCoplanarPoint(e,o);const a=new r;return t.intersectPlane(D,a),n.three.worldToLocal(a)};g.addEventListener("mousemove",t=>{m.setFromCamera(z(t),s.camera.three);const e=n.raycast(m.ray);if(e!=null&&e.line){const o=U.attributes.position;o.setXYZ(0,e.line.start.x,.01,e.line.start.z),o.setXYZ(1,e.line.end.x,.01,e.line.end.z),o.needsUpdate=!0,c.visible=!0}else c.visible=!1;i.machineState.kind==="positioningOffset"&&i.sendMachineEvent({type:"MOUSE_MOVE",point:G(m.ray)})});g.addEventListener("mouseleave",()=>{c.visible=!1});document.addEventListener("keydown",t=>{t.key==="Escape"&&i.sendMachineEvent({type:"ESCAPE"})});g.addEventListener("click",t=>{m.setFromCamera(z(t),s.camera.three);const e=n.raycast(m.ray);if(i.machineState.kind==="awaitingFirstPoint"&&(e!=null&&e.line)){i.sendMachineEvent({type:"SELECT_LINE",line:e.line,drawing:n});return}i.machineState.kind==="positioningOffset"&&i.sendMachineEvent({type:"CLICK",point:G(m.ray),drawing:n})});X.init();const ve=t=>"#"+t.toString(16).padStart(6,"0"),[L,Le]=B.create(t=>k`
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
              color=${ve(o.material.color.getHex())}
              @input=${a=>{n.layers.setColor(e,parseInt(a.target.color.slice(1),16)),l()}}>
            </bim-color-input>
            <bim-dropdown
              style="max-width:fit-content"
              @change=${a=>{const f=a.target.value[0]==="dashed",y=o.material.color.getHex(),S=f?new x({color:y,dashSize:.3,gapSize:.2}):new h({color:y});n.layers.setMaterial(e,S),f&&n.three.traverse(u=>{u.userData.layer===e&&u.isLineSegments&&u.computeLineDistances()}),l()}}>
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
  `,{});l=Le;document.body.append(L);const Se=B.create(()=>k`
  <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
    @click="${()=>{L.classList.contains("options-menu-visible")?L.classList.remove("options-menu-visible"):L.classList.add("options-menu-visible")}}">
  </bim-button>
`);document.body.append(Se);const b=new Z;b.showPanel(2);document.body.append(b.dom);b.dom.style.left="0px";b.dom.style.zIndex="unset";s.renderer.onBeforeUpdate.add(()=>b.begin());s.renderer.onAfterUpdate.add(()=>b.end());
