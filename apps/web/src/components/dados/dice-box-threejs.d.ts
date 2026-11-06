declare module "@3d-dice/dice-box-threejs" {
  interface ColorsetCustomizado {
    name: string;
    foreground: string;
    background: string;
    outline: string;
    texture: string;
    material?: "none" | "metal" | "wood" | "glass" | "plastic";
  }

  interface ConfigDiceBox {
    assetPath?: string;
    sounds?: boolean;
    volume?: number;
    shadows?: boolean;
    theme_surface?: string;
    theme_customColorset?: ColorsetCustomizado | null;
    theme_material?: "none" | "metal" | "wood" | "glass" | "plastic";
    gravity_multiplier?: number;
    light_intensity?: number;
    baseScale?: number;
    strength?: number;
  }

  export default class DiceBox {
    constructor(seletor: string, config?: ConfigDiceBox);
    initialize(): Promise<void>;
    roll(notacao: string): Promise<unknown>;
    clearDice(): void;
  }
}
