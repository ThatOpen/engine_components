import { Components } from "../../core";
import { Event } from "../../base-types";
import { SimpleUIComponent } from "../SimpleUIComponent";

interface DragAndDropConfig {
  subTitle: string;
}

export class DragAndDropInput extends SimpleUIComponent<HTMLDivElement> {
  name = "DragAndDropInput";

  onFilesLoaded = new Event<FileList>();

  constructor(components: Components, config?: DragAndDropConfig) {
    const subtitle = config ? config.subTitle : "";
    const template = `
      <div class="absolute top-8 bottom-8 left-8 right-8">
        <div class="flex items-center justify-center w-full h-full">
            <label for="dropzone-file" class="h-full flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer backdrop-blur-xl bg-ifcjs-100 dark:hover:bg-bray-800 dark:bg-gray-700 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 transition ease-in-out hover:backdrop-blur-xl duration-300">
                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                    </svg>
                    <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">${subtitle}</p>
                </div>
                <input id="dropzone-file" type="file" class="hidden" />
            </label>
        </div> 
      </div>
    `;

    super(components, template);
    const input = this.get().querySelector("input");
    if (!input) throw new Error("Input not found!");

    const onFilesLoaded = async () => {
      if (input.files === null) return;
      await this.onFilesLoaded.trigger(input.files);
    };

    input.onchange = () => onFilesLoaded();

    const allowDragDrop = (event: any) => event.preventDefault();
    this.get().ondragover = allowDragDrop;
    this.get().ondragenter = allowDragDrop;

    this.get().ondrop = async (event: any) => {
      event.preventDefault();
      input.files = event.dataTransfer.files;
      await onFilesLoaded();
    };
  }

  async dispose(onlyChildren: boolean = false) {
    await super.dispose(onlyChildren);
    this.onFilesLoaded.reset();
  }
}
