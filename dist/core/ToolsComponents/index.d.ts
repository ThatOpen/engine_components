import { Component } from "../../types/component";
import { Disposable } from "../../types";
/**
 * An object to easily handle all the tools used (e.g. updating them, retrieving
 * them, performing batch operations, etc). A tool is a feature that achieves
 * something through user interaction (e.g. clipping planes, dimensions, etc).
 */
export declare class ToolComponents implements Disposable {
    tools: Component<any>[];
    /**
     * Registers a new tool component.
     * @param tool - The tool to register in the application.
     */
    add(tool: Component<any>): void;
    /**
     * Deletes a previously registered tool component.
     * @param tool - The tool to delete.
     */
    remove(tool: Component<any>): boolean;
    /**
     * Retrieves a tool component by its name.
     * @param name - The {@link Component.name} of the component..
     */
    get(name: string): Component<any> | undefined;
    /**
     * Updates all the registered tool components. Only the components where the
     * property {@link Component.enabled} is true will be updated.
     * @param delta - The
     * [delta time](https://threejs.org/docs/#api/en/core/Clock) of the loop.
     */
    update(delta: number): void;
    /**
     * Disposes all the memory used by all the tools.
     */
    dispose(): void;
}
