/**
 * A set of helpers and management functions for dealing with user input from keyboard events.
 * {@link https://keycode.info/}
 */
declare class KeyboardManager {
  constructor();

  /**
   * The set of key codes which are currently depressed (down)
   */
  protected _downKeys: Set<string>;

  /**
   * The set of key codes which have been already handled per workflow
   */
  protected _handled: Set<string>;

  /**
   * A mapping of movement keys which are pending
   */
  protected _moveKeys: Set<string>;

  /**
   * @defaultValue `null`
   */
  protected _moveTime: number | null;

  /**
   * @defaultValue `0`
   */
  protected _tabState: 0 | 1;

  /**
   * @defaultValue `0`
   */
  protected _wheelTime: number;

  /**
   * Specify a rate limit for mouse wheel to gate repeated scrolling.
   * This is especially important for continuous scrolling mice which emit hundreds of events per second.
   * This designates a minimum number of milliseconds which must pass before another wheel event is handled
   */
  static MOUSE_WHEEL_RATE_LIMIT: 50;

  /**
   * Enumerate the "digit keys"
   */
  static DIGIT_KEYS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  /**
   * Map keys used for movement
   */
  static MOVEMENT_KEYS: {
    w: ['up'];
    a: ['left'];
    s: ['down'];
    d: ['right'];
    W: ['up'];
    A: ['left'];
    S: ['down'];
    D: ['right'];
    ArrowUp: ['up'];
    ArrowRight: ['right'];
    ArrowDown: ['down'];
    ArrowLeft: ['left'];
    Numpad1: ['down', 'left'];
    Numpad2: ['down'];
    Numpad3: ['down', 'right'];
    Numpad4: ['left'];
    Numpad6: ['right'];
    Numpad7: ['up', 'left'];
    Numpad8: ['up'];
    Numpad9: ['up', 'right'];
  };

  /**
   * Map keys used for canvas zooming
   */
  static ZOOM_KEYS: {
    PageUp: 'in';
    PageDown: 'out';
    NumpadAdd: 'in';
    NumpadSubtract: 'out';
  };

  /**
   * Reset tracking for which keys are in the down and released states
   */
  protected _reset(): void;

  /**
   * Return whether the key code is currently in the DOWN state
   * @param code - The key code to test
   */
  isDown(code: string): boolean;

  /**
   * A helper method to test whether, given an Event, the CTRL (or CMD) keys are pressed
   * @param event - The originating event or canvas interaction
   */
  isCtrl(event: Event | PIXI.InteractionEvent): boolean;

  /**
   * Get a standardized keyboard code for a given event
   * @param event - The originating keypress event
   * @returns The standardized string code to use
   */
  getKey(event: KeyboardEvent): string;

  /**
   * The key codes which represent a possible movement key
   */
  get moveKeys(): typeof KeyboardManager.MOVEMENT_KEYS;

  /**
   * The key codes which represent a digit key
   */
  get digitKeys(): typeof KeyboardManager.DIGIT_KEYS;

  /**
   * Return the key codes used for zooming the canvas
   */
  get zoomKeys(): typeof KeyboardManager.ZOOM_KEYS;

  /**
   * Test whether an input currently has focus
   */
  get hasFocus(): boolean;

  /**
   * Handle a key press into the down position
   * @param event - The originating keyboard event
   */
  protected _onKeyDown(event: KeyboardEvent): void;

  /**
   * Handle a key release into the up position
   * @param event - The originating keyboard event
   */
  protected _onKeyUp(event: KeyboardEvent): void;

  /**
   * Delegate tracked key codes by dispatching to their various handlers
   * @param event - The keydown or keyup event
   * @param key   - The key being depressed
   * @param up    - A flag for whether the key is down or up
   */
  protected _handleKeys(event: KeyboardEvent, key: string, up: boolean): void;

  /**
   * Input events do not fire with isComposing = false at the end of a composition event in Chrome
   * See: https://github.com/w3c/uievents/issues/202
   */
  protected _onCompositionEnd(event: CompositionEvent): void;

  /**
   * Master mouse-wheel event keyboard handler
   */
  protected _onWheel(event: WheelEvent): void;

  /**
   * Handle TAB keypress events
   * @param event     - The originating keyboard event
   * @param up        - Is the key being released?
   * @param modifiers - The identified modifiers attached to this keypress
   */
  protected _onTab(event: KeyboardEvent, up: boolean, modifiers: KeyboardManager.MetaModifiers): void;

  /**
   * Handle ESC keypress events
   * @param event     - The originating keyboard event
   * @param up        - Is the key being released?
   * @param modifiers - The identified modifiers attached to this keypress
   */
  protected _onEscape(
    event: KeyboardEvent,
    up: boolean,
    modifiers: KeyboardManager.MetaModifiers
  ): void | Promise<void>;

  /**
   * Handle SPACE keypress events
   * @param event     - The originating keyboard event
   * @param up        - Is the key being released?
   * @param modifiers - The identified modifiers attached to this keypress
   */
  protected _onSpace(
    event: KeyboardEvent,
    up: boolean,
    modifiers: KeyboardManager.MetaModifiers
  ): void | ReturnType<Set<string>['add']>;

  /**
   * Handle ALT keypress events
   * @param event     - The originating keyboard event
   * @param up        - Is the key being released?
   * @param modifiers - The identified modifiers attached to this keypress
   */
  protected _onAlt(event: KeyboardEvent, up: boolean, modifiers: KeyboardManager.MetaModifiers): void;

  /**
   * Handle movement keypress events
   * @param event     - The originating keyboard event
   * @param up        - Is the key being released?
   * @param modifiers - The identified modifiers attached to this keypress
   */
  protected _onMovement(event: KeyboardEvent, up: boolean, modifiers: KeyboardManager.MetaModifiers): void;

  /**
   * Handle keyboard movement once a small delay has elapsed to allow for multiple simultaneous key-presses.
   */
  protected _handleMovement(event: KeyboardEvent, layer: PlaceablesLayer<any>): void;

  /**
   * Handle panning the canvas using CTRL + directional keys
   */
  protected _handleCanvasPan(): ReturnType<Canvas['animatePan']>;

  /**
   * Handle number key presses
   * @param event     - The original digit key press
   *                    (unused)
   * @param up        - Is it a keyup?
   * @param modifiers - What modifiers affect the keypress?
   */
  protected _onDigit(event: KeyboardEvent, up: boolean, modifiers: KeyboardManager.MetaModifiers): void;

  /**
   * Handle "A" keypress events (CTRL only) to select all objects
   * @param event     - The originating keyboard event
   *                    (unused)
   * @param up        - Is the key being released?
   * @param modifiers - The identified modifiers attached to this keypress
   */
  protected _onKeyA(event: KeyboardEvent, up: boolean, modifiers: KeyboardManager.MetaModifiers): void;

  /**
   * Handle "C" keypress events to copy data to clipboard
   * @param event     - The originating keyboard event
   * @param up        - Is the key being released?
   * @param modifiers - The identified modifiers attached to this keypress
   */
  protected _onKeyC(event: KeyboardEvent, up: boolean, modifiers: KeyboardManager.MetaModifiers): void;

  /**
   * Handle "V" keypress events to paste data from clipboard
   * @param event     - The originating keyboard event
   * @param up        - Is the key being released?
   * @param modifiers - The identified modifiers attached to this keypress
   */
  protected _onKeyV(event: KeyboardEvent, up: boolean, modifiers: KeyboardManager.MetaModifiers): void;

  /**
   * Handle Z Keypress Events to generally undo previous actions
   * @param event     - The originating keyboard event
   * @param up        - Is the key being released?
   * @param modifiers - The identified modifiers attached to this keypress
   */
  protected _onKeyZ(event: KeyboardEvent, up: boolean, modifiers: KeyboardManager.MetaModifiers): void;

  /**
   * Handle presses to keyboard zoom keys
   * @param event     - The originating keyboard event
   * @param up        - Is the key being released?
   * @param modifiers - The identified modifiers attached to this keypress
   */
  protected _onKeyZoom(
    event: KeyboardEvent,
    up: boolean,
    modifiers: KeyboardManager.MetaModifiers
  ): void | ReturnType<Canvas['animatePan']>;

  /**
   * Handle DELETE Keypress Events
   * @param event     - The originating keyboard event
   * @param up        - Is the key being released?
   * @param modifiers - The identified modifiers attached to this keypress
   */
  protected _onDelete(
    event: KeyboardEvent,
    up: boolean,
    modifiers: KeyboardManager.MetaModifiers
  ): void | Promise<foundry.abstract.Document<any, any>[] | undefined>;
}

declare namespace KeyboardManager {
  interface MetaModifiers {
    key: string;
    isShift: boolean;
    isCtrl: boolean;
    isAlt: boolean;
    hasFocus: boolean;
    hasModifier: boolean;
  }
}
