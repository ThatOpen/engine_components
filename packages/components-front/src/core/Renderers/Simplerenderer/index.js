"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleRenderer = void 0;
var THREE = require("three");
var CSS2DRenderer_js_1 = require("three/examples/jsm/renderers/CSS2DRenderer.js");
var base_types_1 = require("../../base-types");
/**
 * A basic renderer capable of rendering 3D and 2D objects
 * ([Objec3Ds](https://threejs.org/docs/#api/en/core/Object3D) and
 * [CSS2DObjects](https://threejs.org/docs/#examples/en/renderers/CSS2DRenderer)
 * respectively).
 */
var SimpleRenderer = /** @class */ (function (_super) {
    __extends(SimpleRenderer, _super);
    function SimpleRenderer(components, container, parameters) {
        var _this = _super.call(this, components) || this;
        /** {@link Component.enabled} */
        _this.enabled = true;
        /** {@link Disposable.onDisposed} */
        _this.onDisposed = new base_types_1.Event();
        /** {@link Updateable.onBeforeUpdate} */
        _this.onBeforeUpdate = new base_types_1.Event();
        /** {@link Updateable.onAfterUpdate} */
        _this.onAfterUpdate = new base_types_1.Event();
        _this._renderer2D = new CSS2DRenderer_js_1.CSS2DRenderer();
        /** {@link Resizeable.resize}. */
        _this.resize = function (size) {
            _this.updateContainer();
            if (!_this.container) {
                return;
            }
            var width = size ? size.x : _this.container.clientWidth;
            var height = size ? size.y : _this.container.clientHeight;
            _this._renderer.setSize(width, height);
            _this._renderer2D.setSize(width, height);
            _this.onResize.trigger(size);
        };
        _this.resizeEvent = function () {
            _this.resize();
        };
        _this.onContextLost = function (event) {
            event.preventDefault();
            _this.components.enabled = false;
        };
        _this.onContextBack = function () {
            _this._renderer.setRenderTarget(null);
            _this._renderer.dispose();
            _this._renderer = new THREE.WebGLRenderer(__assign({ canvas: _this._canvas, antialias: true, alpha: true }, _this._parameters));
            _this.components.enabled = true;
        };
        _this.container = container || null;
        _this._parameters = parameters;
        _this._renderer = new THREE.WebGLRenderer(__assign({ antialias: true, alpha: true }, parameters));
        _this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        _this.setupRenderers();
        _this.setupEvents(true);
        _this.resize();
        _this._canvas = _this._renderer.domElement;
        var context = _this._renderer.getContext();
        var canvas = context.canvas;
        canvas.addEventListener("webglcontextlost", _this.onContextLost, false);
        canvas.addEventListener("webglcontextrestored", _this.onContextBack, false);
        return _this;
    }
    /** {@link Component.get} */
    SimpleRenderer.prototype.get = function () {
        return this._renderer;
    };
    /** {@link Updateable.update} */
    SimpleRenderer.prototype.update = function () {
        return __awaiter(this, void 0, void 0, function () {
            var scene, camera;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.enabled)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.onBeforeUpdate.trigger(this)];
                    case 1:
                        _a.sent();
                        scene = this.overrideScene || this.components.scene.get();
                        camera = this.overrideCamera || this.components.camera.get();
                        if (!scene || !camera)
                            return [2 /*return*/];
                        this._renderer.render(scene, camera);
                        this._renderer2D.render(scene, camera);
                        return [4 /*yield*/, this.onAfterUpdate.trigger(this)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /** {@link Disposable.dispose} */
    SimpleRenderer.prototype.dispose = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.enabled = false;
                        this.setupEvents(false);
                        this._renderer.domElement.remove();
                        this._renderer.dispose();
                        this._renderer2D.domElement.remove();
                        this.onResize.reset();
                        this.onAfterUpdate.reset();
                        this.onBeforeUpdate.reset();
                        return [4 /*yield*/, this.onDisposed.trigger()];
                    case 1:
                        _a.sent();
                        this.onDisposed.reset();
                        return [2 /*return*/];
                }
            });
        });
    };
    /** {@link Resizeable.getSize}. */
    SimpleRenderer.prototype.getSize = function () {
        return new THREE.Vector2(this._renderer.domElement.clientWidth, this._renderer.domElement.clientHeight);
    };
    SimpleRenderer.prototype.setupEvents = function (active) {
        if (active) {
            window.addEventListener("resize", this.resizeEvent);
        }
        else {
            window.removeEventListener("resize", this.resizeEvent);
        }
    };
    SimpleRenderer.prototype.setupRenderers = function () {
        this._renderer.localClippingEnabled = true;
        this._renderer2D.domElement.style.position = "absolute";
        this._renderer2D.domElement.style.top = "0px";
        this._renderer2D.domElement.style.pointerEvents = "none";
        if (this.container) {
            this.container.appendChild(this._renderer.domElement);
            this.container.appendChild(this._renderer2D.domElement);
        }
        this.updateContainer();
    };
    SimpleRenderer.prototype.updateContainer = function () {
        if (!this.container) {
            var parent_1 = this._renderer.domElement.parentElement;
            if (parent_1) {
                this.container = parent_1;
                parent_1.appendChild(this._renderer2D.domElement);
            }
        }
    };
    return SimpleRenderer;
}(base_types_1.BaseRenderer));
exports.SimpleRenderer = SimpleRenderer;
