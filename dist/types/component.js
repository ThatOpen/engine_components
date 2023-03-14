/**
 * Components are the building blocks of this library. Everything is a
 * component: tools, scenes, objects, cameras, etc.
 * All components must inherit from this class.
 */
export class Component {
    constructor() {
        /** Whether is component is {@link Disposable}. */
        this.isDisposeable = () => {
            return "dispose" in this;
        };
        /** Whether is component is {@link Resizeable}. */
        this.isResizeable = () => {
            return "resize" in this && "getSize" in this;
        };
        /** Whether is component is {@link Updateable}. */
        this.isUpdateable = () => {
            return "afterUpdate" in this && "beforeUpdate" in this && "update" in this;
        };
        /** Whether is component is {@link Hideable}. */
        this.isHideable = () => {
            return "visible" in this;
        };
    }
}
//# sourceMappingURL=component.js.map