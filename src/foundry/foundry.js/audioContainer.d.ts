/**
 * An AudioSourceNode container which handles the strategy of node type to use for playback.
 * Used by the Sound interface which controls playback.
 * This class is for internal use only and should not be used by external callers.
 * @internal
 */
declare class AudioContainer {
  constructor(src: string);

  /**
   * The audio source path
   */
  src: string;

  /**
   * The Audio Node used to control this sound
   * @defaultValue `undefined`
   */
  sourceNode: AudioBufferSourceNode | MediaElementAudioSourceNode | undefined;

  /**
   * The GainNode used to control volume
   * @defaultValue `undefined`
   */
  gainNode: GainNode | undefined;

  /**
   * Is this container using an AudioBuffer?
   * @defaultValue `false`
   */
  isBuffer: boolean;

  /**
   * Has the source for this audio container been loaded to a point that playback can begin?
   * @defaultValue `false`
   */
  loaded: boolean;

  /**
   * Did the audio source fail to load (a 404 or some other reason).
   * @defaultValue `false`
   */
  failed: boolean;

  /**
   * Is the audio source currently playing?
   * @defaultValue `false`
   */
  playing: boolean;

  /**
   * Should the audio source loop?
   * @defaultValue `false`
   * @internal
   */
  protected _loop: boolean;

  get loop(): boolean;
  set loop(looping: boolean);

  /**
   * The maximum duration, in seconds, for which an AudioBuffer will be used.
   * Otherwise a streaming media element will be used.
   * @defaultValue `10 * 60`
   */
  static MAX_BUFFER_DURATION: number;

  /**
   * A reference to the AudioBuffer if the sourceNode is a AudioBufferSourceNode.
   */
  get buffer(): AudioBuffer | null | undefined;

  /**
   * The game audio context used throughout the application.
   */
  get context(): AudioContext;

  /**
   * The total duration of the audio source in seconds
   */
  get duration(): number | undefined;

  /**
   * A reference to the HTMLMediaElement, if the sourceNode is a MediaElementAudioSourceNode.
   */
  get element(): HTMLMediaElement | undefined;

  /**
   * Load the source node required for playback of this audio source
   */
  load(): Promise<void>;

  /**
   * Create the initial audio node used for playback.
   * Determine the node type to use based on cached state and sound duration.
   * @internal
   */
  protected _createNode(): Promise<AudioBufferSourceNode | MediaElementAudioSourceNode | undefined>;

  /**
   * Create an Audio source node using a buffered array.
   * @internal
   */
  protected _createAudioBuffer(): Promise<AudioBuffer>;

  /**
   * Create a AudioBufferSourceNode using a provided AudioBuffer
   * @internal
   */
  protected _createAudioBufferSourceNode(buffer: AudioBuffer): AudioBufferSourceNode;

  /**
   * Create an HTML5 Audio element which has loaded the metadata for the provided source.
   * @internal
   */
  protected _createAudioElement(): Promise<HTMLAudioElement>;

  /**
   * Create a MediaElementAudioSourceNode using a provided HTMLAudioElement
   * @internal
   */
  protected _createMediaElementAudioSourceNode(element: HTMLAudioElement): MediaElementAudioSourceNode;

  /**
   * Begin playback for the source node.
   * @param offset  - The desired start time
   * @param onended - A callback function for when playback concludes naturally
   */
  play(offset: number, onended: () => void): void;

  /**
   * Pre-playback actions that are needed depending on the node type
   * @internal
   */
  protected _configureNode(): void;

  /**
   * Terminate playback for the source node.
   */
  stop(): void;

  /**
   * Perform cleanup actions when the sound has finished playing. For
   * MediaElementAudioSourceNodes, this also means optionally restarting if
   * the sound is supposed to loop.
   * @param onended - A callback provided by the owner of the container that gets fired when the sound ends.
   * @internal
   */
  protected _onEnd(onended: () => void): void;

  /**
   * Unload the MediaElementAudioSourceNode to terminate any ongoing
   * connections.
   * @internal
   */
  protected _unloadMediaNode(): void;
}
