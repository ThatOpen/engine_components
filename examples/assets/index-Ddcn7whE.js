var c=Object.defineProperty;var _=(r,t,e)=>t in r?c(r,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[t]=e;var s=(r,t,e)=>(_(r,typeof t!="symbol"?t+"":t,e),e);import{b as p,G as b,d as m,g,m as u}from"./index-chvdFvuw.js";import{z as x}from"./N8AO-ICbsPPfP.js";import{D as w}from"./types-BHr6GdIp.js";import{M as d}from"./mark-HyobHETu.js";const o=class o{constructor(t,e,i){s(this,"label");s(this,"boundingBox",new p);s(this,"world");s(this,"components");s(this,"_length");s(this,"_visible",!0);s(this,"_start");s(this,"_end");s(this,"_root",new b);s(this,"_endpoints",[]);s(this,"_line");this.components=t,this.world=e,this._start=i.start,this._end=i.end,this._length=this.getLength(),this._line=this.createLine(i),this.newEndpointElement(i.endpointElement),this.newEndpointElement(i.endpointElement.cloneNode(!0)),this.label=this.newText(),this._root.renderOrder=2,this.world.scene.three.add(this._root)}get visible(){return this._visible}set visible(t){this._visible=t,this.label.visible=t,this._endpoints[0].visible=t,this._endpoints[1].visible=t;const[e,i]=this._endpoints,n=e.three,h=i.three,l=this.label.three;t?(this.world.scene.three.add(this._root),this._root.add(l,n,h)):(l.removeFromParent(),n.removeFromParent(),h.removeFromParent(),this._root.removeFromParent())}get endPoint(){return this._end}set endPoint(t){this._end=t;const e=this._line.geometry.attributes.position;e.setXYZ(1,t.x,t.y,t.z),e.needsUpdate=!0,this._endpoints[1].three.position.copy(t),this.updateLabel()}get startPoint(){return this._start}set startPoint(t){this._start=t;const e=this._line.geometry.attributes.position;e.setXYZ(0,t.x,t.y,t.z),e.needsUpdate=!0,this._endpoints[0].three.position.copy(t),this.updateLabel()}get _center(){let t=this._end.clone().sub(this._start);const e=t.length()*.5;return t=t.normalize().multiplyScalar(e),this._start.clone().add(t)}dispose(){const t=this.components.get(x);this.visible=!1,t.destroy(this._root),t.destroy(this._line);for(const e of this._endpoints)e.dispose();this._endpoints.length=0,this.label.dispose(),this.boundingBox&&t.destroy(this.boundingBox),this.components=null}createBoundingBox(){this.boundingBox.geometry=new m(1,1,this._length),this.boundingBox.position.copy(this._center),this.boundingBox.lookAt(this._end),this.boundingBox.visible=!1,this._root.add(this.boundingBox)}toggleLabel(){this.label.toggleVisibility()}newEndpointElement(t){const i=this._endpoints.length===0?this._start:this._end,n=new d(this.world,t);n.three.position.copy(i),this._endpoints.push(n),this._root.add(n.three)}updateLabel(){this._length=this.getLength(),this.label.three.element.textContent=this.getTextContent(),this.label.three.position.copy(this._center),this._line.computeLineDistances()}createLine(t){const e=new g;e.setFromPoints([t.start,t.end]);const i=new u(e,t.lineMaterial);return this._root.add(i),i}newText(){const t=document.createElement("div");t.className=w,t.textContent=this.getTextContent();const e=new d(this.world,t);return e.three.position.copy(this._center),this._root.add(e.three),e}getTextContent(){return`${this._length/o.scale} ${o.units}`}getLength(){return parseFloat(this._start.distanceTo(this._end).toFixed(2))}};s(o,"scale",1),s(o,"units","m");let a=o;export{a as S};