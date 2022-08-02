import { FragmentLoader } from "bim-fragment/fragment-loader";
import { Fragment } from "bim-fragment";
import { unzip } from "unzipit";
import { Components } from "../components";
import { FragmentHighlighter } from "./fragment-highlighter";

export class Fragments {
  loader = new FragmentLoader();
  fragments: Fragment[] = [];
  highlighter: FragmentHighlighter;

  constructor(private components: Components) {
    this.highlighter = new FragmentHighlighter(components);
  }

  async loadCompressed(fileURL: string) {
    const { entries } = await unzip(fileURL);

    const fileNames = Object.keys(entries);
    for (let i = 0; i <= fileNames.length - 5; i += 2) {
      const geometryName = fileNames[i];
      const geometry = await entries[geometryName].blob();
      const geometryURL = URL.createObjectURL(geometry);

      const dataName = fileNames[i + 1];
      const data = await entries[dataName].blob();
      const dataURL = URL.createObjectURL(data);

      const fragment = await this.loader.load(geometryURL, dataURL);
      this.fragments.push(fragment);

      const scene = this.components.scene.getScene();
      this.components.meshes.push(fragment.mesh);
      scene.add(fragment.mesh);
    }

    this.highlighter.fragments = this.fragments;
  }

  async load(geometryURL: string, dataURL: string) {
    const result = await this.loader.load(geometryURL, dataURL);
    this.fragments.push(result);
    const scene = this.components.scene.getScene();
    scene.add(result.mesh);
  }
}
