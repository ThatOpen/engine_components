import{V as w,C as k,bw as l,J as P,K as D,n as $,b as c,S}from"./TransformControls-uP1Cexzu.js";import{R as C,c as L,W as M,S as x,O as R,F as I,a6 as B}from"./graphic-vertex-picker-BijCnCEg.js";import{w as N}from"./worker-BGfbLmKH.js";import{P as O}from"./index-B9_sa_qD.js";import{M as A,L as T,b as v}from"./index-DlCiRCyW.js";import"./preload-helper-PPVm8Dsz.js";import"./index-bKcSih7U.js";import"./renderer-with-2d-CrQsY-US.js";class b extends A{static uuid="2f9bcacf-18a9-4be6-a293-e898eae64ea1";_temp={isDragging:!1,line:new T};_lastEdgeKey=null;_edgeMissStreak=0;static EDGE_MISS_TOLERANCE=3;modes=["free","edge"];_mode="free";get mode(){return this._mode}set mode(e){this._mode=e,this.cancelCreation(),e==="edge"&&this.initPreview(),this.onStateChanged.trigger(["mode"])}get isDragging(){return this._temp.isDragging}constructor(e){super(e,"length"),e.add(b.uuid,this),this.initHandlers()}initHandlers(){this.list.onItemAdded.add(e=>{const n=this.createLineElement(e,this._temp.startNormal);n.createBoundingBox(),this.lines.add(n)}),this.list.onBeforeDelete.add(e=>{const s=[...this.lines].find(o=>o.line===e);s&&this.lines.delete(s)}),this.onPointerMove.add(()=>this.updatePreviewLine()),this.onEnabledChange.add(e=>{e&&this.mode==="edge"&&this.initPreview()})}_pendingPreview=null;initPreview(){return this._pendingPreview||(this._pendingPreview=this.buildPreview().finally(()=>{this._pendingPreview=null})),this._pendingPreview}async buildPreview(){if(!this.world)throw new Error("Measurement: world is need!");const e=this.lastPick??await this._vertexPicker.get({snappingClasses:this.snappings});if(this.enabled){if(this._temp.dimension?.dispose(),this._temp.dimension=void 0,this.mode==="free"){if(!e?.point)return;const n=e.point;this._temp.line.set(n,n.clone()),this._temp.isDragging=!0,this._temp.dimension=this.createLineElement(this._temp.line),this._temp.startNormal=e.normal??void 0}else if(this.mode==="edge"){const n=e?.snappedEdgeP1,s=e?.snappedEdgeP2,o=n||new w,g=s||o;this._temp.line.set(o,g),this._temp.isDragging=!0,this._temp.dimension=this.createLineElement(this._temp.line),this._temp.dimension.visible=!!(n&&s)}}}updatePreviewLine(){if(!this.world)throw new Error("Measurement: world is need!");const e=this.lastPick;if(this.mode==="free"){if(!e?.point||(this._temp.line.end.copy(e.point),!this._temp.dimension))return;this._temp.dimension.end=this._temp.line.end}else if(this.mode==="edge"){const n=e?.snappedEdgeP1,s=e?.snappedEdgeP2;if(!(n&&s)){this._edgeMissStreak+=1,this._edgeMissStreak>b.EDGE_MISS_TOLERANCE&&this._temp.dimension&&this._temp.dimension.visible&&(this._temp.dimension.visible=!1,this._lastEdgeKey=null);return}this._edgeMissStreak=0;const o=F(n,s);if(o===this._lastEdgeKey){this._temp.dimension&&!this._temp.dimension.visible&&(this._temp.dimension.visible=!0);return}if(this._lastEdgeKey=o,this._temp.line.start.copy(n),this._temp.line.end.copy(s),!this._temp.dimension)return;this._temp.dimension.visible||(this._temp.dimension.visible=!0),this._temp.dimension.start=this._temp.line.start,this._temp.dimension.end=this._temp.line.end}}hasEdgeUnderCursor(){const e=this.lastPick;return!!(e?.snappedEdgeP1&&e?.snappedEdgeP2)}create=async()=>{if(this.enabled){if(!this._temp.isDragging){await this.initPreview();return}this.endCreation()}};endCreation=()=>{this.enabled&&this._temp.dimension&&(this.mode==="edge"&&!this.hasEdgeUnderCursor()||(this.list.add(this._temp.line.clone()),this.mode==="free"&&(this._temp.dimension.dispose(),this._temp.dimension=void 0,this._temp.isDragging=!1,this._temp.startNormal=void 0)))};cancelCreation=()=>{this.enabled&&(this._temp.isDragging=!1,this._temp.dimension&&(this._temp.dimension?.dispose(),this._temp.dimension=void 0))};dispose(){this._temp.isDragging=!1,this._temp.dimension?.dispose(),this._temp.dimension=void 0,super.dispose()}delete=()=>{if(!this.enabled||this.list.size===0||!this.world)return;const e=this.getLineBoxes(),o=this.components.get(C).get(this.world).castRayToObjects(e);if(!o)return;const f=[...this.lines].find(E=>E.boundingBox===o.object);f&&this.list.delete(f.line)}}function F(i,e){const s=`${Math.round(i.x*1e3)},${Math.round(i.y*1e3)},${Math.round(i.z*1e3)}`,o=`${Math.round(e.x*1e3)},${Math.round(e.y*1e3)},${Math.round(e.z*1e3)}`;return s<o?`${s}|${o}`:`${o}|${s}`}const d=new L,j=d.get(M),a=j.create();a.scene=new x(d);a.scene.setup();a.scene.three.background=null;const y=document.getElementById("container");a.renderer=new O(d,y);a.camera=new R(d);await a.camera.controls.setLookAt(68,23,-8.5,21.5,-5.5,23);d.init();const r=d.get(I);r.init(N);a.camera.controls.addEventListener("update",()=>r.core.update());a.onCameraChanged.add(i=>{for(const[,e]of r.list)e.useCamera(i.three);r.core.update(!0)});r.list.onItemSet.add(({value:i})=>{i.useCamera(a.camera.three),a.scene.three.add(i.object),r.core.update(!0)});r.core.models.materials.list.onItemSet.add(({value:i})=>{"isLodMaterial"in i&&i.isLodMaterial||(i.polygonOffset=!0,i.polygonOffsetUnits=1,i.polygonOffsetFactor=Math.random())});const z=["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];await Promise.all(z.map(async i=>{const e=i.split("/").pop()?.split(".").shift();if(!e)return null;const s=await(await fetch(i)).arrayBuffer();return r.core.load(s,{modelId:e})}));const t=d.get(b);t.world=a;t.color=new k("#494cb6");t.enabled=!0;t.snappings=[l.POINT,l.LINE];y.ondblclick=()=>t.create();const K=()=>{t.list.clear()},Q=()=>{const i=[];for(const e of t.list)i.push(e.value);return i};window.onkeydown=i=>{(i.code==="Delete"||i.code==="Backspace")&&t.delete()};t.list.onItemAdded.add(i=>{const e=new w;i.getCenter(e);const n=i.distance()/3,s=new P(e,n);a.camera.controls.fitToSphere(s,!0)});const U=()=>{for(const i of t.lines)i.displayRectangularDimensions()},V=()=>{for(const i of t.lines)i.invertRectangularDimensions()},q=()=>{for(const i of t.lines)i.displayProjectionDimensions()},W=()=>{for(const i of t.lines)i.rectangleDimensions.clear(),i.projectionDimensions.clear()};D.init();const _=d.get(B).get(),u=i=>t.snappings?.includes(i)??!1,h=(i,e)=>{const n=new Set(t.snappings??[]);e?n.add(i):n.delete(i),t.snappings=Array.from(n)},H=()=>c`
  <bim-checkbox label="Snap: Point" ?checked=${u(l.POINT)}
    @change="${({target:i})=>h(l.POINT,i.value)}">
  </bim-checkbox>
  <bim-checkbox label="Snap: Line" ?checked=${u(l.LINE)}
    @change="${({target:i})=>h(l.LINE,i.value)}">
  </bim-checkbox>
  <bim-checkbox label="Snap: Face" ?checked=${u(l.FACE)}
    @change="${({target:i})=>h(l.FACE,i.value)}">
  </bim-checkbox>
  <bim-number-input slider step="0.05" label="Snap Range"
    value="${_.maxDistance}" min="0.05" max="5"
    @change="${({target:i})=>{_.maxDistance=i.value}}">
  </bim-number-input>
`,p=$.create(()=>{const i=()=>{const e=Q();console.log(e)};return c`
    <bim-panel active label="Length Measurement Tutorial" class="options-menu">
      <bim-panel-section label="Controls">
          <bim-label>Create dimension: Double click</bim-label>  
          <bim-label>Delete dimension: Delete</bim-label>  
      </bim-panel-section>
      
      <bim-panel-section label="Measurer">
        <bim-checkbox checked label="Enabled" 
          @change="${({target:e})=>{t.enabled=e.value}}">  
        </bim-checkbox>       
        <bim-checkbox checked label="Measurements Visible" 
          @change="${({target:e})=>{t.visible=e.value}}">  
        </bim-checkbox>  
        
<bim-number-input
          slider step="1" label="Picker Size" value="${t.pickerSize}" min="2" max="20"
          @change="${({target:e})=>{t.pickerSize=e.value}}">
        </bim-number-input>

        <bim-color-input
          label="Color" color=#${t.linesMaterial.color.getHexString()}
          @input="${({target:e})=>{t.color=new k(e.color)}}">
        </bim-color-input>
        
        <bim-dropdown
          label="Measure Mode" required
          @change="${({target:e})=>{const[n]=e.value;t.mode=n}}"> ${t.modes.map(e=>c`<bim-option label=${e} value=${e} ?checked=${e===t.mode}></bim-option>`)}
        </bim-dropdown>

        ${H()}

        <bim-dropdown
          label="Units" required
          @change="${({target:e})=>{const[n]=e.value;t.units=n}}">
          ${t.unitsList.map(e=>c`<bim-option label=${e} value=${e} ?checked=${e===t.units}></bim-option>`)}
        </bim-dropdown>

        <bim-dropdown 
          label="Precision" required
          @change="${({target:e})=>{const[n]=e.value;t.rounding=n}}">
          <bim-option label="0" value=0></bim-option>
          <bim-option label="1" value=1></bim-option>
          <bim-option label="2" value=2 checked></bim-option>
          <bim-option label="3" value=3></bim-option>
          <bim-option label="4" value=4></bim-option>
          <bim-option label="5" value=5></bim-option>
        </bim-dropdown>

        <bim-dropdown
          label="Line type" required
          @change="${({target:e})=>{t.lineType=e.value[0]}}">
          <bim-option label="Basic" value="${v.Basic}" checked></bim-option>
          <bim-option label="Fat" value="${v.Fat}"></bim-option>
        </bim-dropdown>

        <bim-number-input
          slider label="Line width" value="${t.lineWidth}"
          min="1" max="10" step="0.5"
          @change="${({target:e})=>{t.lineWidth=e.value}}">
        </bim-number-input>

        <bim-button label="Display Rectangle Dimensions" @click=${U}></bim-button>

        <bim-button label="Invert Rectangle Dimensions" @click=${V}></bim-button>

        <bim-button label="Display Projection Dimensions" @click=${q}></bim-button>

        <bim-button label="Remove Complementary Dimensions" @click=${W}></bim-button>

        <bim-button label="Delete all" @click=${()=>K()}></bim-button>
        
        <bim-button label="Log Values" @click=${i}></bim-button>
      </bim-panel-section>
    </bim-panel>
  `});document.body.append(p);const G=$.create(()=>c`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${()=>{p.classList.contains("options-menu-visible")?p.classList.remove("options-menu-visible"):p.classList.add("options-menu-visible")}}">
      </bim-button>
    `);document.body.append(G);const m=new S;m.showPanel(2);document.body.append(m.dom);m.dom.style.left="0px";m.dom.style.zIndex="unset";a.renderer.onBeforeUpdate.add(()=>m.begin());a.renderer.onAfterUpdate.add(()=>m.end());
