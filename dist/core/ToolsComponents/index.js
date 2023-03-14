/**
 * An object to easily handle all the tools used (e.g. updating them, retrieving
 * them, performing batch operations, etc). A tool is a feature that achieves
 * something through user interaction (e.g. clipping planes, dimensions, etc).
 */
export class ToolComponents {
    constructor() {
        this.tools = [];
    }
    /**
     * Registers a new tool component.
     * @param tool - The tool to register in the application.
     */
    add(tool) {
        this.tools.push(tool);
    }
    /**
     * Deletes a previously registered tool component.
     * @param tool - The tool to delete.
     */
    remove(tool) {
        const index = this.tools.findIndex((c) => c === tool);
        if (index > -1) {
            this.tools.splice(index, 1);
            return true;
        }
        return false;
    }
    /**
     * Retrieves a tool component by its name.
     * @param name - The {@link Component.name} of the component..
     */
    get(name) {
        return this.tools.find((tool) => tool.name === name);
    }
    /**
     * Updates all the registered tool components. Only the components where the
     * property {@link Component.enabled} is true will be updated.
     * @param delta - The
     * [delta time](https://threejs.org/docs/#api/en/core/Clock) of the loop.
     */
    update(delta) {
        for (const tool of this.tools) {
            if (tool.enabled && tool.isUpdateable()) {
                tool.update(delta);
            }
        }
    }
    /**
     * Disposes all the memory used by all the tools.
     */
    dispose() {
        for (const tool of this.tools) {
            tool.enabled = false;
            if (tool.isDisposeable()) {
                tool.dispose();
            }
        }
        this.tools = [];
    }
}
//# sourceMappingURL=index.js.map