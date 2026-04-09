import{B as Z,y as pe,p as K,q as me,aX as be,s as fe,M as ue,f as we,D as he,n as ge,V as a,G as ye,L as ve,R as xe,P as Ee,l as ke,c as J,a as g,b as Ce,k as Q}from"./index-lAiblgEx.js";import{T as Se,F as Le}from"./FontLoader-GldU-Ytn.js";import{C as Pe,W as Me,S as $e,a as Ae,f as Be,F as Re}from"./index-Da4Pyzo_.js";import{T as Ve}from"./index-C1KzLF6N.js";import{D as De}from"./index-eC_Eq_kb.js";import{L as Fe}from"./index-CUEwzW_n.js";import"./index-C0TZEIvY.js";import"./index-CqpWWeqw.js";import"./ticks-NMpJekG3.js";import"./index-DST-GF0p.js";import"./index-CmcsC9_D.js";document.body.style.cssText="margin:0; width:100vw; height:100vh; overflow:hidden; position:relative;";const k=new Pe,Oe=k.get(Me),m=Oe.create();m.scene=new $e(k);m.scene.setup();m.scene.three.background=null;const V=document.getElementById("container");V.style.cssText="position:absolute; inset:0;";m.renderer=new Ae(k,V);m.camera=new Be(k);await m.camera.controls.setLookAt(48.213,33.495,-5.062,13.117,-1.205,22.223);k.init();const je="https://thatopen.github.io/engine_fragment/resources/worker.mjs",Ue=await fetch(je),ze=await Ue.blob(),Te=new File([ze],"worker.mjs",{type:"text/javascript"}),_e=URL.createObjectURL(Te),$=k.get(Re);$.init(_e);m.camera.controls.addEventListener("update",()=>$.core.update());$.list.onItemSet.add(({value:t})=>{t.useCamera(m.camera.three),m.scene.three.add(t.object),$.core.update(!0)});$.core.models.materials.list.onItemSet.add(({value:t})=>{"isLodMaterial"in t&&t.isLodMaterial||(t.polygonOffset=!0,t.polygonOffsetUnits=1,t.polygonOffsetFactor=Math.random())});const Ie=await fetch("/resources/frags/school_arq.frag"),Ge=await Ie.arrayBuffer();await $.core.load(Ge,{modelId:"school_arq"});const ee=k.get(Ve),r=ee.create(m);r.three.position.y=11.427046;const We=await fetch("/resources/projections/projection.json").then(t=>t.json()),te=new Z;te.setAttribute("position",new pe(new Float32Array(We.positions),3));r.layers.create("projection",{material:new K({color:16711680})});const Xe=new me(te);r.addProjectionLines(Xe,"projection");const O=r.viewports.create({left:-.996,right:16.493,top:-57.877,bottom:-64.375,scale:100}),j=r.viewports.create({left:-5.04,right:-1.434,top:.568,bottom:-5.934,scale:100});O.helperVisible=!0;j.helperVisible=!0;O.helper.resizable=!0;O.helper.movable=!0;j.helper.resizable=!0;j.helper.movable=!0;const _=40,H=16,M=20,A=document.createElement("div");A.style.cssText=`
  position: absolute;
  bottom: 24px;
  left: 24px;
  background-color: #e8e8e8;
  background-image:
    linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px);
  background-size: ${_}px ${_}px;
  border: 2px solid #888;
  border-radius: 4px;
  overflow: hidden;
`;const y=document.createElement("canvas");y.style.cssText="position:absolute; top:0; left:0; display:block;";const Ye=k.get(De).exporter,qe=(t,e)=>{const o=Ye.export([{drawing:r,viewports:[{viewport:t}]}]),n=new Blob([o],{type:"application/dxf"}),l=URL.createObjectURL(n),i=document.createElement("a");i.href=l,i.download=e,i.click(),URL.revokeObjectURL(l)},c=[];let C=null,I="",B=null;const oe=t=>{const e=c.find(o=>o.viewport===t);if(e){C=t,I=e.id;for(const o of c)o.borderEl.style.border=`1.5px solid ${o.viewport===t?"#0055ff":"#000"}`;f()}},W=(t,e)=>{const o=document.createElement("div");o.style.cssText=`
    position: absolute;
    box-sizing: border-box;
    border: 1.5px solid #000;
    cursor: pointer;
    pointer-events: auto;
    user-select: none;
  `;const n=document.createElement("span");return n.textContent=t,n.style.cssText=`
    position: absolute;
    top: 3px; left: 4px;
    font: 10px/1 monospace;
    color: #000;
    background: rgba(255,255,255,0.75);
    padding: 1px 4px;
    border-radius: 2px;
    pointer-events: none;
  `,o.appendChild(n),o.addEventListener("click",l=>{l.stopPropagation(),oe(e)}),o._tag=n,o},ne=W("A",O),se=W("B",j);c.push({id:"A",viewport:O,borderEl:ne},{id:"B",viewport:j,borderEl:se});A.append(y,ne,se);document.body.append(A);const He=`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Cline x1='10' y1='0' x2='10' y2='8' stroke='black' stroke-width='1.5'/%3E%3Cline x1='10' y1='12' x2='10' y2='20' stroke='black' stroke-width='1.5'/%3E%3Cline x1='0' y1='10' x2='8' y2='10' stroke='black' stroke-width='1.5'/%3E%3Cline x1='12' y1='10' x2='20' y2='10' stroke='black' stroke-width='1.5'/%3E%3C/svg%3E") 10 10, crosshair`,b=new be({canvas:y,antialias:!0,alpha:!0}),re=new Map;b.autoClear=!1;function u(){const t=window.devicePixelRatio,e=c.map(({viewport:d})=>{const h=_*100/d.drawingScale;return{w:Math.round((d.right-d.left)*h),h:Math.round((d.top-d.bottom)*h)}}),o=e.reduce((d,h,v)=>d+h.w+(v>0?H:0),0)+2*M,n=Math.max(...e.map(d=>d.h))+2*M;A.style.width=`${o}px`,A.style.height=`${n}px`,b.setPixelRatio(t),b.setSize(o,n);const l=Math.round(o*t),i=Math.round(n*t),L=Math.round(M*t);b.setScissorTest(!0),b.setClearColor(0,0),b.setViewport(0,0,l,i),b.setScissor(0,0,l,i),b.clear(),b.setClearColor(16777215,1);let w=M;for(let d=0;d<c.length;d++){const{id:h,viewport:v,borderEl:x}=c[d],{w:P,h:E}=e[d],Y=Math.round(P*t),U=Math.round(E*t),q=Math.round(w*t);b.setViewport(q,i-L-U,Y,U),b.setScissor(q,i-L-U,Y,U),b.clear(),b.render(m.scene.three,v.camera),re.set(v,{x:w,y:M,w:P,h:E}),x._tag.textContent=`${h} — 1:${v.drawingScale}`,x.style.left=`${w}px`,x.style.top=`${M}px`,x.style.width=`${P}px`,x.style.height=`${E}px`,w+=P+H}b.setScissorTest(!1)}const s=ee.use(Fe);s.styles.get("default").textOffset=.3;const Ne=new Se,Ze=await new Promise(t=>{Ne.load("/resources/fonts/PlusJakartaSans-Medium.ttf",e=>{t(new Le(e))})});let f=()=>{};s.onCommit.add(t=>{for(const{item:e,group:o}of t){const n=s.styles.get(e.style)??s.styles.get("default"),l=`${e.pointA.distanceTo(e.pointB).toFixed(2)} m`,i=Ze.generateShapes(l,n.fontSize),L=new fe(i),w=new ue(L,new we({color:n.color,side:he}));w.rotation.x=-Math.PI/2,w.layers.set(1);const h=new ge().setFromObject(w).getCenter(new a);w.position.set(-h.x,0,-h.z);const v=new a().subVectors(e.pointB,e.pointA),x=new a(-v.z,0,v.x).normalize(),P=e.pointA.clone().add(e.pointB).multiplyScalar(.5).addScaledVector(x,e.offset),E=new ye;E.layers.set(1),E.position.copy(P).addScaledVector(x,Math.sign(e.offset)*n.textOffset).setY(.005),E.add(w),o.add(E)}u(),f()});s.onDelete.add(()=>{u(),f()});s.add(r,{pointA:new a(-3.054,0,-.347),pointB:new a(-3.054,0,5.754),offset:.6,style:"default"});s.add(r,{pointA:new a(-.378,0,61.239),pointB:new a(2.26,0,61.239),offset:.2,style:"default"});s.add(r,{pointA:new a(2.26,0,61.239),pointB:new a(5,0,61.239),offset:.2,style:"default"});s.add(r,{pointA:new a(5,0,61.239),pointB:new a(7.74,0,61.239),offset:.2,style:"default"});s.add(r,{pointA:new a(7.74,0,61.239),pointB:new a(10.48,0,61.239),offset:.2,style:"default"});s.add(r,{pointA:new a(10.48,0,61.239),pointB:new a(13.22,0,61.239),offset:.2,style:"default"});s.add(r,{pointA:new a(13.22,0,61.239),pointB:new a(15.96,0,61.239),offset:.2,style:"default"});u();const X=new Z().setFromPoints([new a,new a]),p=new ve(X,new K({color:30719,depthTest:!1}));p.layers.set(1);p.renderOrder=999;p.frustumCulled=!1;p.visible=!1;r.three.add(p);const R=new xe,N=new Ee,ie=t=>{const e=V.getBoundingClientRect();return new Q((t.clientX-e.left)/e.width*2-1,-((t.clientY-e.top)/e.height)*2+1)},F=t=>{const e=new a(0,1,0).transformDirection(r.three.matrixWorld),o=new a().setFromMatrixPosition(r.three.matrixWorld);N.setFromNormalAndCoplanarPoint(e,o);const n=new a;return t.intersectPlane(N,n),r.three.worldToLocal(n)},G=()=>c.some(t=>t.viewport.helper.isDragging);V.addEventListener("mousemove",t=>{R.setFromCamera(ie(t),m.camera.three);const e=R.ray;for(const{viewport:n}of c)n.helper.onPointerMove(e);if(G()){u();return}const o=r.raycast(e);if(o!=null&&o.line){const n=X.attributes.position;n.setXYZ(0,o.line.start.x,.01,o.line.start.z),n.setXYZ(1,o.line.end.x,.01,o.line.end.z),n.needsUpdate=!0,p.visible=!0}else p.visible=!1;s.machineState.kind==="positioningOffset"&&s.sendMachineEvent({type:"MOUSE_MOVE",point:F(e)})});V.addEventListener("mouseleave",()=>{p.visible=!1});document.addEventListener("keydown",t=>{if(t.key==="Escape"){if(S){S=!1,f();return}for(const{viewport:e}of c)e.helper.onPointerUp();B&&s.machineState.kind==="awaitingFirstPoint"?le():(s.sendMachineEvent({type:"ESCAPE"}),p.visible=!1,u())}});V.addEventListener("click",t=>{R.setFromCamera(ie(t),m.camera.three);const e=R.ray;if(G()){for(const{viewport:n}of c)n.helper.onPointerUp();u();return}for(const{viewport:n}of c)n.helper.onPointerDown(e);if(G())return;if(S){Ke(F(e)),S=!1,f();return}const o=r.raycast(e);if(s.machineState.kind==="awaitingFirstPoint"&&(o!=null&&o.line)){s.sendMachineEvent({type:"SELECT_LINE",line:o.line,drawing:r});return}s.machineState.kind==="positioningOffset"&&s.sendMachineEvent({type:"CLICK",point:F(e),drawing:r})});const ae=(t,e)=>{for(const o of c)o.borderEl.style.pointerEvents="auto";oe(t),B=t,e.style.pointerEvents="none",e.style.border="1.5px dashed #0055ff",y.style.cursor=He,f()},le=()=>{if(B){B=null;for(const t of c)t.borderEl.style.pointerEvents="auto",t.borderEl.style.border=`1.5px solid ${t.viewport===C?"#0055ff":"#000"}`;y.style.cursor="",p.visible=!1,u(),f()}},ce=()=>{B&&(s.sendMachineEvent({type:"ESCAPE"}),p.visible=!1,le())};for(const{viewport:t,borderEl:e}of c)e.addEventListener("dblclick",o=>{o.stopPropagation(),ae(t,e)}),e.addEventListener("click",ce);let S=!1,z=c.length;const Ke=t=>{const o=r.viewports.create({left:t.x-2.5,right:t.x+2.5,top:-t.z+2.5,bottom:-t.z-2.5,scale:100});o.helperVisible=!0,o.helper.resizable=!0,o.helper.movable=!0;const n=String.fromCharCode(65+z%26)+(z>=26?String(Math.floor(z/26)):"");z++;const l=W(n,o);A.appendChild(l);const i={id:n,viewport:o,borderEl:l};c.push(i),l.addEventListener("dblclick",L=>{L.stopPropagation(),ae(o,l)}),l.addEventListener("click",ce),u()},de=t=>{const e=y.getBoundingClientRect(),o=t.clientX-e.left,n=t.clientY-e.top;for(const{viewport:l}of c){const i=re.get(l);if(!(!i||o<i.x||o>i.x+i.w||n<i.y||n>i.y+i.h))return R.setFromCamera(new Q((o-i.x)/i.w*2-1,-((n-i.y)/i.h)*2+1),l.camera),{ray:R.ray,viewport:l}}return null};y.addEventListener("mousemove",t=>{const e=de(t);if(!e){p.visible=!1;return}const o=r.raycast(e.ray,e.viewport);if(o!=null&&o.line){const n=X.attributes.position;n.setXYZ(0,o.line.start.x,.01,o.line.start.z),n.setXYZ(1,o.line.end.x,.01,o.line.end.z),n.needsUpdate=!0,p.visible=!0}else p.visible=!1;s.machineState.kind==="positioningOffset"&&s.sendMachineEvent({type:"MOUSE_MOVE",point:F(e.ray)}),u()});y.addEventListener("mouseleave",()=>{p.visible=!1});y.addEventListener("click",t=>{const e=de(t);if(!e)return;const o=r.raycast(e.ray,e.viewport);if(s.machineState.kind==="awaitingFirstPoint"&&(o!=null&&o.line)){s.sendMachineEvent({type:"SELECT_LINE",line:o.line,drawing:r});return}s.machineState.kind==="positioningOffset"&&s.sendMachineEvent({type:"CLICK",point:F(e.ray),drawing:r})});ke.init();const[T,Je]=J.create(t=>g`
    <bim-panel active label="Multiple Viewports" class="options-menu" style="max-width: 20rem;">

      <bim-panel-section label="Viewports">
        ${S?g`
          <bim-label style="white-space: normal;">Click anywhere on the drawing to place a 5 m viewport. Press Esc to cancel.</bim-label>
          <bim-button label="Cancel"
            @click=${()=>{S=!1,f()}}>
          </bim-button>
        `:g`
          <bim-button label="Add Viewport"
            @click=${()=>{S=!0,f()}}>
          </bim-button>
        `}
      </bim-panel-section>

      <bim-panel-section label="Linear Dimensions">
        ${B?g`
          <bim-label style="white-space: normal;">Hover a projection line and click to anchor the first point, then click to set the offset. Press Esc to cancel a dimension in progress, or Esc again to exit edit mode.</bim-label>
        `:g`
          <bim-label style="white-space: normal;">Double-click a viewport to enter edit mode and start placing dimensions.</bim-label>
        `}
        <bim-label style="white-space: normal;">Committed: ${s.get([r]).size}</bim-label>
        <bim-button label="Clear all"
          @click=${()=>{s.clear([r]),u(),f()}}>
        </bim-button>
      </bim-panel-section>

      <bim-panel-section label="Viewport">
        ${C?g`
          <bim-label style="white-space: normal;">Click: select · Double-click: edit mode</bim-label>
          <bim-label style="white-space: normal;">Viewport ${I} — 1:${C.drawingScale}</bim-label>
          <bim-dropdown
            label="Scale"
            @change=${e=>{const o=e.target.value;o.length&&(C.drawingScale=parseInt(o[0],10),u(),f())}}>
            ${[50,100,200].map(e=>g`
              <bim-option
                label="1:${e}"
                value="${e}"
                ?checked=${e===C.drawingScale}>
              </bim-option>
            `)}
          </bim-dropdown>
          <bim-button label="Export DXF"
            @click=${()=>qe(C,`viewport-${I.toLowerCase()}.dxf`)}>
          </bim-button>
        `:g`
          <bim-label style="white-space: normal;">Click a viewport to select it · Double-click to edit</bim-label>
        `}
      </bim-panel-section>

    </bim-panel>
  `,{});f=Je;document.body.append(T);const Qe=J.create(()=>g`
  <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
    @click="${()=>{T.classList.contains("options-menu-visible")?T.classList.remove("options-menu-visible"):T.classList.add("options-menu-visible")}}">
  </bim-button>
`);document.body.append(Qe);const D=new Ce;D.showPanel(2);document.body.append(D.dom);D.dom.style.left="0px";D.dom.style.zIndex="unset";m.renderer.onBeforeUpdate.add(()=>D.begin());m.renderer.onAfterUpdate.add(()=>D.end());
