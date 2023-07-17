import { Components } from "../../core";
import { SimpleUIComponent } from "../SimpleUIComponent";

interface ToastConfig {
  message: string;
  materialIconName?: string;
}

export class ToastNotification extends SimpleUIComponent<HTMLDivElement> {
  name = "ToastNotification";
  duration = 3000;

  constructor(components: Components, config: ToastConfig) {
    // TODO: Extract icon ui component and reuse it
    const icon = `
        <span class="material-icons md-18">
            ${config.materialIconName || "done"}
        </span>
    `;

    const template = `
        <div id="toast-default" class="flex items-center w-full max-w-xs p-4 text-gray-500 bg-ifcjs-200 rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
            <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-ifcjs-200 bg-ifcjs-300 rounded-full dark:bg-blue-800 dark:text-blue-200">
                ${icon}
            </div>
            <div class="ml-3 text-sm font-normal">${config.message}</div>
        </div>
    `;

    const container = document.createElement("div");
    container.innerHTML = template;
    container.className = "absolute bottom-8 left-8 transition-transform";

    super(components, container);
  }

  set visible(active: boolean) {
    const delay = 200;
    if (active) {
      super.visible = active;
      setTimeout(() => {
        this.domElement.style.transform = "translateY(0)";
        this.hideAutomatically();
      }, delay);
    } else {
      this.domElement.style.transform = "translateY(10rem)";
      setTimeout(() => (super.visible = active), delay);
    }
  }

  private hideAutomatically() {
    setTimeout(() => {
      this.visible = false;
    }, this.duration);
  }
}
