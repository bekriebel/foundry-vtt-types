import { DocumentConstructor } from '../../types/helperTypes';
import DatabaseBackend from '../common/abstract/backend.mjs';

type ConfiguredDocumentClassOrDefault<Fallback extends DocumentConstructor> =
  Fallback['metadata']['name'] extends keyof DocumentClassConfig
    ? DocumentClassConfig[Fallback['metadata']['name']]
    : Fallback;

declare global {
  /**
   * This interface is used to configure the used document classes at a type
   * level. Module and system authors should use declaration merging to provide
   * the types of their configured document classes. It is extremely important
   * that this is kept in sync with the configuration that actually happens at
   * runtime.
   *
   * @example
   * ```typescript
   * // myActor.ts
   * class MyActor extends Actor {}
   *
   * // entryPoint.ts
   * import { MyActor } from './myActor'
   *
   * hooks.once('init', () => {
   *   CONFIG.Actor.documentClass = typeof MyActor;
   * });
   *
   * declare global {
   *   interface DocumentClassConfig {
   *     Actor: typeof MyActor
   *   }
   * }
   * ```
   */

  //eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DocumentClassConfig {}

  /**
   * This interface together with {@link SourceConfig} is used to configure the
   * types of the `data`  and `data._source` properties of the
   * {@link foundry.documents.BaseActor} and {@link foundry.documents.BaseItem}
   * classes. System authors should use declaration merging to provide the types
   * that match their `template.json` file. It is also very important for these
   * types to stay in sync with the `template.json` file, otherwise unexpected
   * runtime errors might appear.
   *
   * @example
   * ```typescript
   * interface ArmorDataSourceData {
   *   armorValue: number;
   * }
   *
   * interface ArmorDataSource {
   *   type: 'armor';
   *   data: ArmorDataSourceData;
   * }
   *
   * interface WeaponDataSourceData {
   *   damagePerHit: number;
   *   attackSpeed: number;
   * }
   *
   * interface WeaponDataSource {
   *   type: 'weapon';
   *   data: WeaponDataSourceData;
   * }
   *
   * interface ArmorDataPropertiesData extends ArmorDataSourceData {
   *   weight: number;
   * }
   *
   * interface ArmorDataProperties {
   *   type: 'armor';
   *   data: ArmorDataPropertiesData;
   * }
   *
   * interface WeaponDataPropertiesData extends WeaponDataSourceData {
   *   damage: number;
   * }
   *
   * interface WeaponDataProperties {
   *   type: 'weapon';
   *   data: WeaponDataPropertiesData;
   * }
   *
   * type MyItemDataSource = ArmorDataSource | WeaponDataSource;
   * type MyItemDataProperties = ArmorDataProperties | WeaponDataProperties;
   *
   * declare global {
   *   interface DataConfig {
   *     Item: MyItemDataProperties;
   *   }
   *
   *   interface SourceConfig {
   *     Item: MyItemDataSource;
   *   }
   * }
   * const item = await Item.create({
   *   name: 'Axe',
   *   type: 'weapon',
   *   attackSpeed: 1,
   *   damage: 5
   * });
   *
   * if(item.data.type === 'weapon') {
   *   const damage: number = item.data.data.damage;
   * }
   *
   * if(item.data._source.type === 'armor') {
   *   const armorValue = item.data._source.data.armorValue;
   * }
   * ```
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DataConfig {}

  /**
   * @see {@link DataConfig}
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface SourceConfig {}

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface FlagConfig {}

  /**
   * Runtime configuration settings for Foundry VTT which exposes a large number of variables which determine how
   * aspects of the software behaves.
   *
   * Unlike the CONST analog which is frozen and immutable, the CONFIG object may be updated during the course of a
   * session or modified by system and module developers to adjust how the application behaves.
   */
  interface CONFIG {
    /**
     * Configure debugging flags to display additional information
     */
    debug: {
      /**
       * @defaultValue `false`
       */
      dice: boolean;

      /**
       * @defaultValue `false`
       */
      documents: boolean;

      /**
       * @defaultValue `false`
       */
      fog: boolean;

      /**
       * @defaultValue `false`
       */
      hooks: boolean;

      /**
       * @defaultValue `false`
       */
      sight: boolean;

      /**
       * @defaultValue `false`
       */
      sightRays: boolean;

      /**
       * @defaultValue `false`
       */
      av: boolean;

      /**
       * @defaultValue `false`
       */
      avclient: boolean;

      /**
       * @defaultValue `false`
       */
      mouseInteraction: boolean;

      /**
       * @defaultValue `false`
       */
      time: boolean;
    };

    /**
     * Configure the DatabaseBackend used to perform Document operations
     * @defaultValue `new ClientDatabaseBackend()`
     */
    DatabaseBackend: DatabaseBackend; // TODO: ClientDatabaseBackend

    /**
     * Configuration for the Actor document
     */
    Actor: {
      /**
       * @defaultValue `Actor`
       */
      documentClass: ConfiguredDocumentClassOrDefault<typeof Actor>;

      /**
       * @defaultValue `Actors`
       */
      collection: ConstructorOf<Actors>;

      /**
       * @defaultValue `{}`
       */
      sheetClasses: EntitySheetConfig.SheetClasses;

      /**
       * @defaultValue `'fas fa-user'`
       */
      sidebarIcon: string;

      /**
       * @defaultValue `{}`
       */
      typeLabels: Partial<Record<string, string>>;
    };

    /**
     * Configuration for the ChatMessage document
     */
    ChatMessage: {
      /**
       * @defaultValue `ChatMessage`
       */
      documentClass: ConfiguredDocumentClassOrDefault<typeof ChatMessage>;
      /**
       * @defaultValue `Messages`
       */
      collection: ConstructorOf<Messages>;

      /**
       * @defaultValue `'templates/sidebar/chat-message.html'`
       */
      template: string;

      /**
       * @defaultValue `'fas fa-comments'`
       */
      sidebarIcon: string;

      /**
       * @defaultValue `100`
       */
      batchSize: number;
    };

    /**
     * Configuration for the Combat document
     */
    Combat: {
      /**
       * @defaultValue `Combat`
       */
      documentClass: ConfiguredDocumentClassOrDefault<typeof Combat>;

      /**
       * @defaultValue `CombatEncounters`
       */
      collection: ConstructorOf<CombatEncounters>;

      /**
       * @defaultValue `'dead'`
       */
      defeatedStatusId: string;

      /**
       * @defaultValue `'fas fa-fist-raised'`
       */
      sidebarIcon: string;

      initiative: {
        /**
         * @defaultValue `null`
         */
        formula: string | null;

        /**
         * @defaultValue `2`
         */
        decimals: number;
      };
    };

    /**
     * Configuration for dice rolling behaviors in the Foundry VTT client
     */
    Dice: {
      /**
       * @defaultValue `[Die, FateDie]`
       */
      types: Array<ConstructorOf<DiceTerm>>;

      rollModes: {
        /**
         * @defaultValue `'CHAT.RollPublic'`
         */
        roll: string;

        /**
         * @defaultValue `'CHAT.RollPrivate'`
         */
        gmroll: string;

        /**
         * @defaultValue `CHAT.RollBlind'`
         */
        blindroll: string;

        /**
         * @defaultValue `'CHAT.RollSelf'`
         */
        selfroll: string;
      } & Partial<Record<string, string>>;

      /**
       * @defaultValue `[Roll]`
       */
      rolls: Array<ConstructorOf<Roll>>;

      /**
       * @defaultValue
       * ```typescript
       * {
       *   DiceTerm: typeof DiceTerm,
       *   MathTerm: typeof MathTerm,
       *   NumericTerm: typeof NumericTerm,
       *   OperatorTerm: typeof OperatorTerm,
       *   ParentheticalTerm: typeof ParentheticalTerm,
       *   PoolTerm: typeof PoolTerm,
       *   StringTerm: typeof StringTerm
       * }
       * ```
       */
      termTypes: Record<string, ConstructorOf<RollTerm>>;

      terms: {
        c: typeof Coin;
        d: typeof Die;
        f: typeof FateDie;
      } & Partial<Record<string, ConstructorOf<DiceTerm>>>;

      /**
       * @defaultValue `MersenneTwister.random`
       */
      randomUniform: () => number;
    };

    /**
     * Configuration for the FogExploration document
     */
    FogExploration: {
      /**
       * @defaultValue `FogExploration`
       */
      documentClass: ConfiguredDocumentClassOrDefault<typeof FogExploration>;

      /**
       * @defaultValue `FogExplorations`
       */
      collection: ConstructorOf<FogExplorations>;
    };

    /**
     * Configuration for the Folder entity
     */
    Folder: {
      /**
       * @defaultValue `Folder`
       */
      documentClass: ConfiguredDocumentClassOrDefault<typeof Folder>;

      /**
       * @defaultValue `Folders`
       */
      collection: ConstructorOf<Folders>;

      /**
       * @defaultValue `FolderConfig`
       */
      sheetClass: ConstructorOf<FolderConfig>;
    };

    /**
     * Configuration for the default Item entity class
     */
    Item: {
      /**
       * @defaultValue `Item`
       */
      documentClass: ConfiguredDocumentClassOrDefault<typeof Item>;

      /**
       * @defaultValue `Items`
       */
      collection: ConstructorOf<Items>;

      /**
       * @defaultValue `{}`
       */
      sheetClasses: EntitySheetConfig.SheetClasses;

      /**
       * @defaultValue `'fas fa-suitcase'`
       */
      sidebarIcon: string;

      /**
       * defaultValue `{}`
       */
      typeLabels: Partial<Record<string, string>>;
    };

    /**
     * Configuration for the JournalEntry entity
     */
    JournalEntry: {
      /**
       * @defaultValue `JournalEntry`
       */
      documentClass: ConfiguredDocumentClassOrDefault<typeof JournalEntry>;

      /**
       * @defaultValue `Journal`
       */
      collection: ConstructorOf<Journal>;

      /**
       * @defaultValue `JournalSheet`
       */
      sheetClass: ConstructorOf<JournalSheet>;

      noteIcons: {
        /**
         * @defaultValue `'icons/svg/anchor.svg'`
         */
        Anchor: string;

        /**
         * @defaultValue `'icons/svg/barrel.svg'`
         */
        Barrel: string;

        /**
         * @defaultValue `'icons/svg/book.svg'`
         */
        Book: string;

        /**
         * @defaultValue `'icons/svg/bridge.svg'`
         */
        Bridge: string;

        /**
         * @defaultValue `'icons/svg/cave.svg'`
         */
        Cave: string;

        /**
         * @defaultValue `'icons/svg/castle.svg`
         */
        Castle: string;

        /**
         * @defaultValue `'icons/svg/chest.svg'`
         */
        Chest: string;

        /**
         * @defaultValue `'icons/svg/city.svg'`
         */
        City: string;

        /**
         * @defaultValue `'icons/svg/coins.svg'`
         */
        Coins: string;

        /**
         * @defaultValue `'icons/svg/fire.svg'`
         */
        Fire: string;

        /**
         * @defaultValue `'icons/svg/hanging-sign.svg'`
         */
        'Hanging Sign': string;

        /**
         * @defaultValue `'icons/svg/house.svg'`
         */
        House: string;

        /**
         * @defaultValue `'icons/svg/mountain.svg'`
         */
        Mountain: string;

        /**
         * @defaultValue `'icons/svg/oak.svg'`
         */
        'Oak Tree': string;

        /**
         * @defaultValue `'icons/svg/obelisk.svg'`
         */
        Obelisk: string;

        /**
         * @defaultValue `'icons/svg/pawprint.svg'`
         */
        Pawprint: string;

        /**
         * @defaultValue `'icons/svg/ruins.svg'`
         */
        Ruins: string;

        /**
         * @defaultValue `'icons/svg/tankard.svg'`
         */
        Tankard: string;

        /**
         * @defaultValue `'icons/svg/temple.svg'`
         */
        Temple: string;

        /**
         * @defaultValue `'icons/svg/tower.svg'`
         */
        Tower: string;

        /**
         * @defaultValue `'icons/svg/trap.svg'`
         */
        Trap: string;

        /**
         * @defaultValue `'icons/svg/skull.svg'`
         */
        Skull: string;

        /**
         * @defaultValue `'icons/svg/statue.svg'`
         */
        Statue: string;

        /**
         * @defaultValue `'icons/svg/sword.svg'`
         */
        Sword: string;

        /**
         * @defaultValue `'icons/svg/village.svg'`
         */
        Village: string;

        /**
         * @defaultValue `'icons/svg/waterfall.svg'`
         */
        Waterfall: string;
        /**
         * @defaultValue `'icons/svg/windmill.svg'`
         */
        Windmill: string;
      } & Partial<Record<string, string>>;

      /**
       * @defaultValue `'fas fa-book-open'`
       */
      sidebarIcon: string;
    };

    /**
     * Configuration for the Macro entity
     */
    Macro: {
      /**
       * @defaultValue `Macro`
       */
      documentClass: ConfiguredDocumentClassOrDefault<typeof Macro>;

      /**
       * @defaultValue `Macros`
       */
      collection: ConstructorOf<Macros>;

      /**
       * @defaultValue `MacroConfig`
       */
      sheetClass: ConstructorOf<MacroConfig>;

      /**
       * @defaultValue `'fas fa-terminal'`
       */
      sidebarIcon: string;
    };

    /**
     * Configuration for the default Playlist entity class
     */
    Playlist: {
      /**
       * @defaultValue `Playlist`
       */
      documentClass: ConfiguredDocumentClassOrDefault<typeof Playlist>;

      /**
       * @defaultValue `Playlists`
       */
      collection: ConstructorOf<Playlists>;

      /**
       * @defaultValue `PlaylistConfig`
       */
      sheetClass: ConstructorOf<PlaylistConfig>;

      /**
       * @defaultValue `'fas fa-music'`
       */
      sidebarIcon: string;

      /**
       * @defaultValue `20`
       */
      autoPreloadSeconds: number;
    };

    /**
     * Configuration for RollTable random draws
     */
    RollTable: {
      /**
       * @defaultValue `RollTable`
       */
      documentClass: ConfiguredDocumentClassOrDefault<typeof RollTable>;

      /**
       * @defaultValue `RollTables`
       */
      collection: ConstructorOf<RollTables>;

      /**
       * @defaultValue `RollTableConfig`
       */
      sheetClass: ConstructorOf<RollTableConfig>;

      /**
       * @defaultValue `'fas fa-th-list'`
       */
      sidebarIcon: string;

      /**
       * @defaultValue `'icons/svg/d20-black.svg'`
       */
      resultIcon: string;

      /**
       * @defaultValue `'templates/dice/table-result.html'`
       */
      resultTemplate: string;
    };

    /**
     * Configuration for the default Scene entity class
     */
    Scene: {
      /**
       * @defaultValue `Scene`
       */
      documentClass: ConfiguredDocumentClassOrDefault<typeof Scene>;

      /**
       * @defaultValue `Scenes`
       */
      collection: ConstructorOf<Scenes>;

      /**
       * @defaultValue `SceneConfig`
       */
      sheetClass: ConstructorOf<SceneConfig>;

      /**
       * @defaultValue `'fas fa-map'`
       */
      sidebarIcon: string;
    };

    Setting: {
      documentClass: ConfiguredDocumentClassOrDefault<typeof Setting>;
      collection: ConstructorOf<WorldSettings>;
    };

    /**
     * Configuration for the User entity, it's roles, and permissions
     */
    User: {
      /**
       * @defaultValue `User`
       */
      documentClass: ConfiguredDocumentClassOrDefault<typeof User>;

      /**
       * @defaultValue `Users`
       */
      collection: ConstructorOf<Users>;

      /**
       * @defaultValue `UserConfig`
       */
      sheetClass: ConstructorOf<UserConfig>;
    };

    /**
     * Configuration settings for the Canvas and its contained layers and objects
     */
    Canvas: {
      /**
       * @defaultValue `8`
       */
      blurStrength: number;

      /**
       * @defaultValue `0x242448`
       */
      darknessColor: number;

      /**
       * @defaultValue `0.4`
       */
      darknessLightPenalty: number;

      /**
       * @defaultValue `0xeeeeee`
       */
      daylightColor: number;

      dispositionColors: {
        /**
         * @defaultValue `0xe72124`
         */
        HOSTILE: number;

        /**
         * @defaultValue `0xf1d836`
         */
        NEUTRAL: number;

        /**
         * @defaultValue `0x43dfdf`
         */
        FRIENDLY: number;

        /**
         * @defaultValue `0x555555`
         */
        INACTIVE: number;

        /**
         * @defaultValue `0x33bc4e`
         */
        PARTY: number;

        /**
         * @defaultValue `0xff9829`
         */
        CONTROLLED: number;
      };

      /**
       * @defaultValue `0x7f7f7f`
       */
      exploredColor: number;

      /**
       * @defaultValue `0x000000`
       */
      unexploredColor: number;

      layers: {
        /**
         * @defaultValue `BackgroundLayer`
         */
        background: ConstructorOf<BackgroundLayer>;

        /**
         * @defaultValue `DrawingsLayer`
         */
        drawings: ConstructorOf<DrawingsLayer>;

        /**
         * @defaultValue `GridLayer`
         */
        grid: ConstructorOf<GridLayer>;

        /**
         * @defaultValue `WallsLayer`
         */
        walls: ConstructorOf<WallsLayer>;

        /**
         * @defaultValue `TemplateLayer`
         */
        templates: ConstructorOf<TemplateLayer>;

        /**
         * @defaultValue `NotesLayer`
         */
        notes: ConstructorOf<NotesLayer>;

        /**
         * @defaultValue `TokenLayer`
         */
        tokens: ConstructorOf<TokenLayer>;

        /**
         * @defaultValue `ForegroundLayer`
         */
        foreground: ConstructorOf<ForegroundLayer>;

        /**
         * @defaultValue `SoundsLayer`
         */
        sounds: ConstructorOf<SoundsLayer>;

        /**
         * @defaultValue `LightingLayer`
         */
        lighting: ConstructorOf<LightingLayer>;

        /**
         * @defaultValue `SightLayer`
         */
        sight: ConstructorOf<SightLayer>;

        /**
         * @defaultValue `EffectsLayer`
         */
        effects: ConstructorOf<EffectsLayer>;

        /**
         * @defaultValue `ControlsLayer`
         */
        controls: ConstructorOf<ControlsLayer>;
      };

      lightLevels: {
        /**
         * @defaultValue `0`
         */
        dark: number;

        /**
         * @defaultValue `0.5`
         */
        dim: number;

        /**
         * @defaultValue `1.0`
         */
        bright: number;
      };

      /**
       * @defaultValue `0xb86200`
       */
      normalLightColor: number;

      /**
       * @defaultValue `3.0`
       */
      maxZoom: number;

      /**
       * @defaultValue `4`
       */
      objectBorderThickness: number;

      lightAnimations: {
        torch: {
          /**
           * @defaultValue `'LIGHT.AnimationTorch'`
           */
          label: string;

          /**
           * @defaultValue PointSource.prototype.animateTorch
           */
          animation: PointSource.AnimationFunction;

          /**
           * @defaultValue `TorchIlluminationShader`
           */
          illuminationShader: ConstructorOf<AbstractBaseShader>;

          /**
           * @defaultValue `TorchColorationShader`
           */
          colorationShader: ConstructorOf<AbstractBaseShader>;
        };

        pulse: {
          /**
           * @defaultValue `'LIGHT.AnimationPulse'`
           */
          label: string;

          /**
           * @defaultValue `PointSource.prototype.animatePulse`
           */
          animation: PointSource.AnimationFunction;

          /**
           * @defaultValue `PulseIlluminationShader`
           */
          illuminationShader: ConstructorOf<AbstractBaseShader>;

          /**
           * @defaultValue `PulseColorationShader`
           */
          colorationShader: ConstructorOf<AbstractBaseShader>;
        };

        chroma: {
          /**
           * @defaultValue `'LIGHT.AnimationChroma'`
           */
          label: string;

          /**
           * @defaultValue `PointSource.prototype.animateTime`
           */
          animation: PointSource.AnimationFunction;

          /**
           * @defaultValue `ChromaColorationShader`
           */
          colorationShader: ConstructorOf<AbstractBaseShader>;
        };

        wave: {
          /**
           * @defaultValue `'LIGHT.AnimationWave'`
           */
          label: string;

          /**
           * @defaultValue `PointSource.prototype.animateTime`
           */
          animation: PointSource.AnimationFunction;

          /**
           * @defaultValue `WaveIlluminationShader`
           */
          illuminationShader: ConstructorOf<AbstractBaseShader>;

          /**
           * @defaultValue `WaveColorationShader`
           */
          colorationShader: ConstructorOf<AbstractBaseShader>;
        };

        fog: {
          /**
           * @defaultValue `'LIGHT.AnimationFog'`
           */
          label: string;

          /**
           * @defaultValue `PointSource.prototype.animateTime`
           */
          animation: PointSource.AnimationFunction;

          /**
           * @defaultValue `FogColorationShader`
           */
          colorationShader: ConstructorOf<AbstractBaseShader>;
        };

        sunburst: {
          /**
           * @defaultValue `'LIGHT.AnimationSunburst'`
           */
          label: string;

          /**
           * @defaultValue `PointSource.prototype.animateTime`
           */
          animation: PointSource.AnimationFunction;

          /**
           * @defaultValue `SunburstIlluminationShader`
           */
          illuminationShader: ConstructorOf<AbstractBaseShader>;

          /**
           * @defaultValue `SunburstColorationShader`
           */
          colorationShader: ConstructorOf<AbstractBaseShader>;
        };

        dome: {
          /**
           * @defaultValue `'LIGHT.AnimationLightDome'`
           */
          label: string;

          /**
           * @defaultValue `PointSource.prototype.animateTime`
           */
          animation: PointSource.AnimationFunction;

          /**
           * @defaultValue `LightDomeColorationShader`
           */
          colorationShader: ConstructorOf<AbstractBaseShader>;
        };

        emanation: {
          /**
           * @defaultValue `'LIGHT.AnimationEmanation'`
           */
          label: string;

          /**
           * @defaultValue `PointSource.prototype.animateTime`
           */
          animation: PointSource.AnimationFunction;

          /**
           * @defaultValue `EmanationColorationShader`
           */
          colorationShader: ConstructorOf<AbstractBaseShader>;
        };

        hexa: {
          /**
           * @defaultValue `'LIGHT.AnimationHexaDome';`
           */
          label: string;

          /**
           * @defaultValue `PointSource.prototype.animateTime`
           */
          animation: PointSource.AnimationFunction;

          /**
           * @defaultValue `HexaDomeColorationShader`
           */
          colorationShader: ConstructorOf<AbstractBaseShader>;
        };

        ghost: {
          /**
           * @defaultValue `'LIGHT.AnimationGhostLight'`
           */
          label: string;

          /**
           * @defaultValue `PointSource.prototype.animateTime`
           */
          animation: PointSource.AnimationFunction;

          /**
           * @defaultValue `GhostLightIlluminationShader`
           */
          illuminationShader: ConstructorOf<AbstractBaseShader>;

          /**
           * @defaultValue `GhostLightColorationShader`
           */
          colorationShader: ConstructorOf<AbstractBaseShader>;
        };

        energy: {
          /**
           * @defaultValue `'LIGHT.AnimationEnergyField'`
           */
          label: string;

          /**
           * @defaultValue `PointSource.prototype.animateTime`
           */
          animation: PointSource.AnimationFunction;

          /**
           * @defaultValue `EnergyFieldColorationShader`
           */
          colorationShader: ConstructorOf<AbstractBaseShader>;
        };

        roiling: {
          /**
           * @defaultValue `'LIGHT.AnimationRoilingMass'`
           */
          label: string;

          /**
           * @defaultValue `PointSource.prototype.animateTime`
           */
          animation: PointSource.AnimationFunction;

          /**
           * @defaultValue `RoilingIlluminationShader`
           */
          illuminationShader: ConstructorOf<AbstractBaseShader>;
        };

        hole: {
          /**
           * @defaultValue `'LIGHT.AnimationBlackHole'`
           */
          label: string;

          /**
           * @defaultValue `PointSource.prototype.animateTime`
           */
          animation: PointSource.AnimationFunction;

          /**
           * @defaultValue `BlackHoleIlluminationShader`
           */
          illuminationShader: ConstructorOf<AbstractBaseShader>;
        };
      } & Partial<
        Record<
          string,
          {
            label: string;
            animation: PointSource.AnimationFunction;
            illuminationShader?: ConstructorOf<AbstractBaseShader>;
            colorationShader?: ConstructorOf<AbstractBaseShader>;
          }
        >
      >;
    };

    /**
     * Configure the default Token text style so that it may be reused and overridden by modules
     * @defaultValue
     * ```typescript
     * new PIXI.TextStyle({
     *   fontFamily: 'Signika',
     *   fontSize: 36,
     *   fill: '#FFFFFF',
     *   stroke: '#111111',
     *   strokeThickness: 1,
     *   dropShadow: true,
     *   dropShadowColor: '#000000',
     *   dropShadowBlur: 4,
     *   dropShadowAngle: 0,
     *   dropShadowDistance: 0,
     *   align: 'center',
     *   wordWrap: false,
     *   padding: 1
     * })
     * ```
     **/
    canvasTextStyle: PIXI.TextStyle;

    /**
     * Available Weather Effects implementations
     */
    weatherEffects: {
      /**
       * @defaultValue `AutumnLeavesWeatherEffect`
       */
      leaves: ConstructorOf<SpecialEffect>;

      /**
       * @defaultValue `RainWeatherEffect`
       */
      rain: ConstructorOf<SpecialEffect>;

      /**
       * @defaultValue `SnowWeatherEffect`
       */
      snow: ConstructorOf<SpecialEffect>;
    } & Partial<Record<string, ConstructorOf<SpecialEffect>>>;

    /**
     * The control icons used for rendering common HUD operations
     */
    controlIcons: {
      /**
       * @defaultValue `'icons/svg/combat.svg'`
       */
      combat: string;

      /**
       * @defaultValue `'icons/svg/cowled.svg'`
       */
      visibility: string;

      /**
       * @defaultValue `'icons/svg/aura.svg'`
       */
      effects: string;

      /**
       * @defaultValue `'icons/svg/padlock.svg'`
       */
      lock: string;

      /**
       * @defaultValue `'icons/svg/up.svg'`
       */
      up: string;

      /**
       * @defaultValue `'icons/svg/down.svg'`
       */
      down: string;

      /**
       * @defaultValue `'icons/svg/skull.svg'`
       */
      defeated: string;

      /**
       * @defaultValue `'icons/svg/light.svg'`
       */
      light: string;

      /**
       * @defaultValue `'icons/svg/light-off.svg'`
       */
      lightOff: string;

      /**
       * @defaultValue `'icons/svg/explosion.svg'`
       */
      template: string;

      /**
       * @defaultValue `'icons/svg/sound.svg'`
       */
      sound: string;

      /**
       * @defaultValue `'icons/svg/sound-off.svg'`
       */
      soundOff: string;

      /**
       * @defaultValue `'icons/svg/door-closed-outline.svg'`
       */
      doorClosed: string;

      /**
       * @defaultValue `'icons/svg/door-open-outline.svg'`
       */
      doorOpen: string;

      /**
       * @defaultValue `'icons/svg/door-secret-outline.svg'`
       */
      doorSecret: string;

      /**
       * @defaultValue `'icons/svg/door-locked-outline.svg'`
       */
      doorLocked: string;
    } & Partial<Record<string, string>>;

    /**
     * Suggested font families that are displayed wherever a choice is presented
     * @defaultValue `['Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Times New Roman', 'Signika', 'Modesto Condensed']`
     */
    fontFamilies: string[];

    /**
     * The default font family used for text labels on the PIXI Canvas
     * @defaultValue `'Signika'`
     */
    defaultFontFamily: string;

    /**
     * An array of status effect icons which can be applied to Tokens
     * @defaultValue
     * ```typescript
     * [
     *   {
     *     id: 'dead';
     *     label: 'EFFECT.StatusDead';
     *     icon: 'icons/svg/skull.svg';
     *   },
     *   {
     *     id: 'unconscious';
     *     label: 'EFFECT.StatusUnconscious';
     *     icon: 'icons/svg/unconscious.svg';
     *   },
     *   {
     *     id: 'sleep';
     *     label: 'EFFECT.StatusAsleep';
     *     icon: 'icons/svg/sleep.svg';
     *   },
     *   {
     *     id: 'stun';
     *     label: 'EFFECT.StatusStunned';
     *     icon: 'icons/svg/daze.svg';
     *   },
     *   {
     *     id: 'prone';
     *     label: 'EFFECT.StatusProne';
     *     icon: 'icons/svg/falling.svg';
     *   },
     *   {
     *     id: 'restrain';
     *     label: 'EFFECT.StatusRestrained';
     *     icon: 'icons/svg/net.svg';
     *   },
     *   {
     *     id: 'paralysis';
     *     label: 'EFFECT.StatusParalysis';
     *     icon: 'icons/svg/paralysis.svg';
     *   },
     *   {
     *     id: 'fly';
     *     label: 'EFFECT.StatusFlying';
     *     icon: 'icons/svg/wing.svg';
     *   },
     *   {
     *     id: 'blind';
     *     label: 'EFFECT.StatusBlind';
     *     icon: 'icons/svg/blind.svg';
     *   },
     *   {
     *     id: 'deaf';
     *     label: 'EFFECT.StatusDeaf';
     *     icon: 'icons/svg/deaf.svg';
     *   },
     *   {
     *     id: 'silence';
     *     label: 'EFFECT.StatusSilenced';
     *     icon: 'icons/svg/silenced.svg';
     *   },
     *   {
     *     id: 'fear';
     *     label: 'EFFECT.StatusFear';
     *     icon: 'icons/svg/terror.svg';
     *   },
     *   {
     *     id: 'burning';
     *     label: 'EFFECT.StatusBurning';
     *     icon: 'icons/svg/fire.svg';
     *   },
     *   {
     *     id: 'frozen';
     *     label: 'EFFECT.StatusFrozen';
     *     icon: 'icons/svg/frozen.svg';
     *   },
     *   {
     *     id: 'shock';
     *     label: 'EFFECT.StatusShocked';
     *     icon: 'icons/svg/lightning.svg';
     *   },
     *   {
     *     id: 'corrode';
     *     label: 'EFFECT.StatusCorrode';
     *     icon: 'icons/svg/acid.svg';
     *   },
     *   {
     *     id: 'bleeding';
     *     label: 'EFFECT.StatusBleeding';
     *     icon: 'icons/svg/blood.svg';
     *   },
     *   {
     *     id: 'disease';
     *     label: 'EFFECT.StatusDisease';
     *     icon: 'icons/svg/biohazard.svg';
     *   },
     *   {
     *     id: 'poison';
     *     label: 'EFFECT.StatusPoison';
     *     icon: 'icons/svg/poison.svg';
     *   },
     *   {
     *     id: 'radiation';
     *     label: 'EFFECT.StatusRadiation';
     *     icon: 'icons/svg/radiation.svg';
     *   },
     *   {
     *     id: 'regen';
     *     label: 'EFFECT.StatusRegen';
     *     icon: 'icons/svg/regen.svg';
     *   },
     *   {
     *     id: 'degen';
     *     label: 'EFFECT.StatusDegen';
     *     icon: 'icons/svg/degen.svg';
     *   },
     *   {
     *     id: 'upgrade';
     *     label: 'EFFECT.StatusUpgrade';
     *     icon: 'icons/svg/upgrade.svg';
     *   },
     *   {
     *     id: 'downgrade';
     *     label: 'EFFECT.StatusDowngrade';
     *     icon: 'icons/svg/downgrade.svg';
     *   },
     *   {
     *     id: 'target';
     *     label: 'EFFECT.StatusTarget';
     *     icon: 'icons/svg/target.svg';
     *   },
     *   {
     *     id: 'eye';
     *     label: 'EFFECT.StatusMarked';
     *     icon: 'icons/svg/eye.svg';
     *   },
     *   {
     *     id: 'curse';
     *     label: 'EFFECT.StatusCursed';
     *     icon: 'icons/svg/sun.svg';
     *   },
     *   {
     *     id: 'bless';
     *     label: 'EFFECT.StatusBlessed';
     *     icon: 'icons/svg/angel.svg';
     *   },
     *   {
     *     id: 'fireShield';
     *     label: 'EFFECT.StatusFireShield';
     *     icon: 'icons/svg/fire-shield.svg';
     *   },
     *   {
     *     id: 'coldShield';
     *     label: 'EFFECT.StatusIceShield';
     *     icon: 'icons/svg/ice-shield.svg';
     *   },
     *   {
     *     id: 'magicShield';
     *     label: 'EFFECT.StatusMagicShield';
     *     icon: 'icons/svg/mage-shield.svg';
     *   },
     *   {
     *     id: 'holyShield';
     *     label: 'EFFECT.StatusHolyShield';
     *     icon: 'icons/svg/holy-shield.svg';
     *   }
     * ]
     * ```
     */
    statusEffects: { id: string; label: string; icon: string }[];

    /**
     * A mapping of core audio effects used which can be replaced by systems or mods
     */
    sounds: {
      /**
       * @defaultValue `'sounds/dice.wav'`
       */
      dice: string;

      /**
       * @defaultValue `'sounds/lock.wav'`
       */
      lock: string;

      /**
       * @defaultValue `'sounds/notify.wav'`
       */
      notification: string;

      /**
       * @defaultValue `'sounds/drums.wav'`
       */
      combat: string;
    };

    /**
     * Define the set of supported languages for localization
     * @defaultValue `{ en: 'English' }`
     */
    supportedLanguages: {
      en: string;
    } & Partial<Record<string, string>>;

    /**
     * Configuration for time tracking
     */
    time: {
      /**
       * @defaultValue `0`
       */
      turnTime: number;

      /**
       * @defaultValue `0`
       */
      roundTime: number;
    };

    /**
     * Configuration for the ActiveEffect embedded document type
     */
    ActiveEffect: {
      /**
       * @defaultValue `ActiveEffect`
       */
      documentClass: ConfiguredDocumentClassOrDefault<typeof ActiveEffect>;

      /**
       * @defaultValue `ActiveEffectConfig`
       */
      sheetClass: ConstructorOf<ActiveEffectConfig>;
    };

    /**
     * Configuration for the TableResult embedded document type
     */
    TableResult: {
      /**
       * @defaultValue `TableResult`
       */
      documentClass: ConfiguredDocumentClassOrDefault<typeof foundry.documents.BaseTableResult>; // TODO TableResult
    };

    /**
     * Configuration for the ActiveEffect embedded document type
     */
    PlaylistSound: {
      /**
       * @defaultValue `PlaylistSound`
       */
      documentClass: ConfiguredDocumentClassOrDefault<typeof foundry.documents.BasePlaylistSound>; // TODO PlaylistSound

      /**
       * @defaultValue `PlaylistSoundConfig`
       */
      sheetClass: ConstructorOf<PlaylistSoundConfig>;
    };

    /**
     * Configuration for the AmbientLight embedded document type and its representation on the game Canvas
     */
    AmbientLight: {
      /**
       * @defaultValue `AmbientLightDocument`
       */
      documentClass: ConfiguredDocumentClassOrDefault<typeof AmbientLightDocument>;

      /**
       * @defaultValue `AmbientLightDocument`
       */
      objectClass: ConstructorOf<AmbientLight>;

      /**
       * @defaultValue `AmbientLightDocument`
       */
      layerClass: ConstructorOf<LightingLayer>;

      /**
       * @defaultValue `AmbientLightDocument`
       */
      sheetClass: ConstructorOf<LightConfig>;
    };

    /**
     * Configuration for the AmbientSound embedded document type and its representation on the game Canvas
     */
    AmbientSound: {
      /**
       * @defaultValue `AmbientSoundDocument`
       */
      documentClass: ConfiguredDocumentClassOrDefault<typeof AmbientSoundDocument>;

      /**
       * @defaultValue `AmbientSound`
       */
      objectClass: ConstructorOf<AmbientSound>;

      /**
       * @defaultValue `SoundsLayer`
       */
      layerClass: ConstructorOf<SoundsLayer>;

      /**
       * @defaultValue `AmbientSoundConfig`
       */
      sheetClass: ConstructorOf<AmbientSoundConfig>;
    };

    /**
     * Configuration for the Combatant embedded document type within a Combat document
     */
    Combatant: {
      /**
       * @defaultValue `Combatant`
       */
      documentClass: ConfiguredDocumentClassOrDefault<typeof Combatant>;

      /**
       * @defaultValue `CombatantConfig`
       */
      sheetClass: ConstructorOf<CombatantConfig>;
    };

    /**
     * Configuration for the Drawing embedded document type and its representation on the game Canvas
     */
    Drawing: {
      /**
       * @defaultValue `DrawingDocument`
       */
      documentClass: ConfiguredDocumentClassOrDefault<typeof DrawingDocument>;

      /**
       * @defaultValue `Drawing`
       */
      objectClass: ConstructorOf<Drawing>;

      /**
       * @defaultValue `DrawingsLayer`
       */
      layerClass: ConstructorOf<DrawingsLayer>;

      /**
       * @defaultValue `DrawingConfig`
       */
      sheetClass: ConstructorOf<DrawingConfig>;
    };

    /**
     * Configuration for the MeasuredTemplate embedded document type and its representation on the game Canvas
     */
    MeasuredTemplate: {
      defaults: {
        /**
         * @defaultValue `53.13`
         */
        angle: number;

        /**
         * @defaultValue `1`
         */
        width: number;
      };

      types: {
        /**
         * @defaultValue `'Circle'`
         */
        circle: string;

        /**
         * @defaultValue `'Cone'`
         */
        cone: string;

        /**
         * @defaultValue `'Rectangle'`
         */
        rect: string;

        /**
         * @defaultValue `'Ray'`
         */
        ray: string;
      } & Partial<Record<string, string>>;

      /**
       * @defaultValue `MeasuredTemplateDocument`
       */
      documentClass: ConfiguredDocumentClassOrDefault<typeof MeasuredTemplateDocument>;

      /**
       * @defaultValue `MeasuredTemplate`
       */
      objectClass: ConstructorOf<MeasuredTemplate>;

      /**
       * @defaultValue `TemplateLayer`
       */
      layerClass: ConstructorOf<TemplateLayer>;

      /**
       * @defaultValue `MeasuredTemplateConfig`
       */
      sheetClass: ConstructorOf<MeasuredTemplateConfig>;
    };

    /**
     * Configuration for the Note embedded document type and its representation on the game Canvas
     */
    Note: {
      /**
       * @defaultValue `NoteDocument`
       */
      documentClass: ConfiguredDocumentClassOrDefault<typeof NoteDocument>;

      /**
       * @defaultValue `Note`
       */
      objectClass: ConstructorOf<Note>;

      /**
       * @defaultValue `NotesLayer`
       */
      layerClass: ConstructorOf<NotesLayer>;

      /**
       * @defaultValue `NoteConfig`
       */
      sheetClass: ConstructorOf<NoteConfig>;
    };

    /**
     * Configuration for the Tile embedded document type and its representation on the game Canvas
     */
    Tile: {
      /**
       * @defaultValue `TileDocument`
       */
      documentClass: ConfiguredDocumentClassOrDefault<typeof TileDocument>;

      /**
       * @defaultValue `Tile`
       */
      objectClass: ConstructorOf<Tile>;

      /**
       * @defaultValue `BackgroundLayer`
       */
      layerClass: ConstructorOf<BackgroundLayer>;

      /**
       * @defaultValue `TileConfig`
       */
      sheetClass: ConstructorOf<TileConfig>;
    };

    /**
     * Configuration for the Token embedded document type and its representation on the game Canvas
     */
    Token: {
      /**
       * @defaultValue `TokenDocument`
       */
      documentClass: ConfiguredDocumentClassOrDefault<typeof TokenDocument>;

      /**
       * @defaultValue `Token`
       */
      objectClass: ConstructorOf<Token>;

      /**
       * @defaultValue `TokenLayer`
       */
      layerClass: ConstructorOf<TokenLayer>;

      /**
       * @defaultValue `TokenConfig`
       */
      sheetClass: ConstructorOf<TokenConfig>;
    };

    /**
     * Configuration for the Wall embedded document type and its representation on the game Canvas
     */
    Wall: {
      /**
       * @defaultValue `WallDocument`
       */
      documentClass: ConfiguredDocumentClassOrDefault<typeof WallDocument>;

      /**
       * @defaultValue `Wall`
       */
      objectClass: ConstructorOf<Wall>;

      /**
       * @defaultValue `WallsLayer`
       */
      layerClass: ConstructorOf<WallsLayer>;

      /**
       * @defaultValue `WallConfig`
       */
      sheetClass: ConstructorOf<WallConfig>;
    };

    /**
     * Default configuration options for TinyMCE editors
     */
    TinyMCE: tinyMCE.RawEditorSettings;

    /**
     * Configuration for the WebRTC implementation class
     */
    WebRTC: {
      /**
       * @defaultValue `SimplePeerAVClient`
       */
      clientClass: ConstructorOf<AVClient>;

      /**
       * @defaultValue `50`
       */
      detectPeerVolumeInterval: number;

      /**
       * @defaultValue `20`
       */
      detectSelfVolumeInterval: number;

      /**
       * @defaultValue `25`
       */
      emitVolumeInterval: number;

      /**
       * @defaultValue `2`
       */
      speakingThresholdEvents: number;

      /**
       * @defaultValue `10`
       */
      speakingHistoryLength: number;
    };

    /**
     * Configure the Application classes used to render various core UI elements in the application
     */
    ui: CONFIG.UI;
  }

  namespace CONFIG {
    interface UI {
      /**
       * @defaultValue `MainMenu`
       */
      menu: ConstructorOf<MainMenu>;

      /**
       * @defaultValue `Sidebar`
       */
      sidebar: ConstructorOf<Sidebar>;

      /**
       * @defaultValue `Pause`
       */
      pause: ConstructorOf<Pause>;

      /**
       * @defaultValue `SceneNavigation`
       */
      nav: ConstructorOf<SceneNavigation>;

      /**
       * @defaultValue `Notifications`
       */
      notifications: ConstructorOf<Notifications>;

      /**
       * @defaultValue `ActorDirectory`
       */
      actors: ConstructorOf<ActorDirectory>;

      /**
       * @defaultValue `ChatLog`
       */
      chat: ConstructorOf<ChatLog>;

      /**
       * @defaultValue `CombatTracker`
       */
      combat: ConstructorOf<CombatTracker>;

      /**
       * @defaultValue `CompendiumDirectory`
       */
      compendium: ConstructorOf<CompendiumDirectory>;

      /**
       * @defaultValue `SceneControls`
       */
      controls: ConstructorOf<SceneControls>;

      /**
       * @defaultValue `Hotbar`
       */
      hotbar: ConstructorOf<Hotbar>;

      /**
       * @defaultValue `ItemDirectory`
       */
      items: ConstructorOf<ItemDirectory>;

      /**
       * @defaultValue `JournalDirectory`
       */
      journal: ConstructorOf<JournalDirectory>;

      /**
       * @defaultValue `MacroDirectory`
       */
      macros: ConstructorOf<MacroDirectory>;

      /**
       * @defaultValue `PlayerList`
       */
      players: ConstructorOf<PlayerList>;

      /**
       * @defaultValue `PlaylistDirectory`
       */
      playlists: ConstructorOf<PlaylistDirectory>;

      /**
       * @defaultValue `SceneDirectory`
       */
      scenes: ConstructorOf<SceneDirectory>;

      /**
       * @defaultValue `Settings`
       */
      settings: ConstructorOf<Settings>;

      /**
       * @defaultValue `RollTableDirectory`
       */
      tables: ConstructorOf<RollTableDirectory>;

      /**
       * @defaultValue `CameraViews`
       */
      webrtc: ConstructorOf<CameraViews>;
    }
  }

  const CONFIG: CONFIG;
}
