/**
 * Represents the properties of a camera viewpoint in a 3D space. This interface is compliant with the BCF API specifications.
 */
export interface ViewpointCamera {
  /**
   * The position of the camera in 3D space, defined by x, y, and z coordinates.
   */
  camera_view_point: { x: number; y: number; z: number };

  /**
   * The direction the camera is pointing towards, represented by x, y, and z components.
   */
  camera_direction: { x: number; y: number; z: number };

  /**
   * The upward direction vector of the camera, used to define the camera's orientation, represented by x, y, and z components.
   */
  camera_up_vector: { x: number; y: number; z: number };

  /**
   * The aspect ratio of the camera's view, typically defined as the ratio of width to height.
   */
  aspect_ratio: number;
}

/**
 * Represents a perspective camera viewpoint compliant with the BCF API specifications. Extends the `ViewpointCamera` type and includes additional properties specific to perspective cameras.
 */
export type ViewpointPerspectiveCamera = ViewpointCamera & {
  /**
   * The field of view of the perspective camera, expressed in degrees.
   */
  field_of_view: number;
};

/**
 * Represents an orthogonal camera viewpoint, extending the base `ViewpointCamera` type. This interface is compliant with the BCF API specifications.
 */
export type ViewpointOrthogonalCamera = ViewpointCamera & {
  /**
   * Defines the scale factor between the view space and the world space.
   */
  view_to_world_scale: number;
};

/**
 * Represents a component within a viewpoint, typically used in Building Information Modeling (BIM) workflows. This interface is compliant with the BCF API specifications.
 */
export interface ViewpointComponent {
  /**
   * The unique identifier for the component in the IFC format. Can be `null` if not applicable.
   */
  ifc_guid: string | null;

  /**
   * The identifier of the component as defined by the authoring tool. Can be `null` if not applicable.
   */
  authoring_tool_id: string | null;

  /**
   * (Optional) The name of the system or application that originated the component.
   */
  originating_system?: string;
}

/**
 * Represents a 3D vector with x, y, and z coordinates.
 */
export interface ViewpointVector {
  x: number;
  y: number;
  z: number;
}

/**
 * Represents the coloring information for a viewpoint, including the color and associated components. This interface is compliant with the BCF API specifications.
 */
export interface ViewpointColoring {
  /**
   * The color associated with the viewpoint, represented as a string (e.g., a hex code or color name).
   */
  color: string;

  /**
   * An array of components that are associated with the specified color in the viewpoint.
   */
  components: ViewpointComponent[];
}

/**
 * Represents the visibility settings for a viewpoint. This interface is compliant with the BCF API specifications.
 */
export interface ViewpointVisibility {
  /**
   * Indicates whether the default visibility is enabled.
   */
  default_visibility: boolean;

  /**
   * A list of viewpoint components that are exceptions to the default visibility.
   */
  exceptions: ViewpointComponent[];

  /**
   * Configuration hints for the viewpoint setup.
   */
  view_setup_hints: {
    /**
     * Specifies whether spaces are visible.
     */
    spaces_visible: boolean;

    /**
     * Specifies whether space boundaries are visible.
     */
    space_boundaries_visible: boolean;

    /**
     * Specifies whether openings are visible.
     */
    openings_visible: boolean;
  };
}

/**
 * Represents the components of a viewpoint in the BCF API. This interface is compliant with the BCF API specifications.
 */
export interface ViewpointComponents {
  /**
   * An array of viewpoint components representing the selection.
   */
  selection: ViewpointComponent[];

  /**
   * An array of viewpoint coloring definitions.
   */
  coloring: ViewpointColoring[];

  /**
   * Defines the visibility settings for the viewpoint.
   */
  visibility: ViewpointVisibility;
}

// https://github.com/buildingSMART/BCF-API/blob/release_3_0/Schemas/Collaboration/Viewpoint/bitmap_GET.json
/**
 * Represents a bitmap image associated with a viewpoint. This interface is compliant with the BCF API specifications.
 */
export interface ViewpointBitmap {
  /**
   * The type of the bitmap image, either "png" or "jpg".
   */
  bitmap_type: "png" | "jpg";

  /**
   * The base64-encoded string representing the bitmap image data.
   */
  bitmap_data: string;

  /**
   * The 3D vector specifying the location of the bitmap in space.
   */
  location: ViewpointVector;

  /**
   * The 3D vector specifying the normal direction of the bitmap.
   */
  normal: ViewpointVector;

  /**
   * The 3D vector specifying the upward direction of the bitmap.
   */
  up: ViewpointVector;

  /**
   * The height of the bitmap in units.
   */
  height: number;
}

// https://github.com/buildingSMART/BCF-API/blob/release_3_0/Schemas/Collaboration/Viewpoint/clipping_plane.json
/**
 * Represents a clipping plane in a viewpoint, defined by its location and direction. This interface is compliant with the BCF API specifications.
 */
export interface ViewpointClippingPlane {
  /**
   * The position vector of the clipping plane.
   */
  location: ViewpointVector;

  /**
   * The direction vector indicating the orientation of the clipping plane.
   */
  direction: ViewpointVector;
}

// https://github.com/buildingSMART/BCF-API/blob/release_3_0/Schemas/Collaboration/Viewpoint/snapshot_GET.json
/**
 * Represents a snapshot of a viewpoint, including its type and data. This interface is compliant with the BCF API specifications.
 */
export interface ViewpointSnapshot {
  /**
   * The type of the snapshot, either "png" or "jpg".
   */
  snapshot_type: "png" | "jpg";

  /**
   * The base64-encoded string representing the snapshot data.
   */
  snapshot_data: string;
}

// https://github.com/buildingSMART/BCF-API/blob/release_3_0/Schemas/Collaboration/Viewpoint/line.json
/**
 * Represents a line defined by a start and end point in a viewpoint. This interface is compliant with the BCF API specifications.
 */
export interface ViewpointLine {
  /**
   * The starting point of the line, represented as a `ViewpointVector`.
   */
  start_point: ViewpointVector;

  /**
   * The ending point of the line, represented as a `ViewpointVector`.
   */
  end_point: ViewpointVector;
}

/**
 * Represents a Building Collaboration Format (BCF) viewpoint. This interface is compliant with the BCF API specifications.
 */
export interface BCFViewpoint {
  /**
   * Optional title of the viewpoint.
   */
  title?: string;

  /**
   * Optional index of the viewpoint.
   */
  index?: number;

  /**
   * Unique identifier for the viewpoint.
   */
  guid: string;

  /**
   * Optional perspective camera settings for the viewpoint.
   */
  perspective_camera?: ViewpointPerspectiveCamera;

  /**
   * Optional orthogonal camera settings for the viewpoint.
   */
  orthogonal_camera?: ViewpointOrthogonalCamera;

  /**
   * Optional components associated with the viewpoint.
   */
  components?: ViewpointComponents;

  /**
   * Optional snapshot image of the viewpoint.
   */
  snapshot?: ViewpointSnapshot;

  /**
   * Optional array of lines associated with the viewpoint.
   */
  lines?: ViewpointLine[];

  /**
   * Optional array of clipping planes associated with the viewpoint.
   */
  clipping_planes?: ViewpointClippingPlane[];

  /**
   * Optional array of bitmaps associated with the viewpoint.
   */
  bitmaps?: ViewpointBitmap[];
}
