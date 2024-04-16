import { Components } from "../../core";
import { SimpleUIComponent } from "../SimpleUIComponent";

interface ToastConfig {
  message: string;
  materialIconName?: string;
}

export class ToastNotification extends SimpleUIComponent<HTMLDivElement> {
  name = "ToastNotification";
  duration = 3000;
  innerElements: {
    icon: HTMLSpanElement;
    message: HTMLParagraphElement;
  };

  set materialIcon(name: string | null) {
    this.innerElements.icon.textContent = name;
    if (name) {
      this.innerElements.icon.classList.remove("hidden");
    } else {
      this.innerElements.icon.classList.add("hidden");
    }
  }

  constructor(components: Components, config: ToastConfig) {
    // TODO: Extract icon ui component and reuse it
    const template = `
    <div class="absolute bottom-8 left-8 transition-transform">
      <div id="toast-default" class="flex items-center w-full max-w-xs p-4 text-gray-500 bg-ifcjs-200 rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
        <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-ifcjs-200 bg-ifcjs-300 rounded-full dark:bg-blue-800 dark:text-blue-200">
          <span id="icon" class="material-icons md-18"></span>
        </div>
        <p id="message" class="ml-3 text-sm font-normal"></p>
      </div>
    </div>
    `;

    super(components, template);

    this.innerElements = {
      icon: this.getInnerElement("icon") as HTMLSpanElement,
      message: this.getInnerElement("message") as HTMLParagraphElement,
    };

    this.domElement.style.zIndex = "9999";

    this.materialIcon = config.materialIconName ?? "done";
    this.message = config.message;
  }

  get message() {
    return this.innerElements.message.textContent;
  }

  set message(value: string | null) {
    this.innerElements.message.textContent = value;
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
