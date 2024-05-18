import * as THREE from "three";

// Gets the plane information (ax + by + cz = d) of each face, where:
// - (a, b, c) is the normal vector of the plane
// - d is the signed distance to the origin

export function getProjectedNormalMaterial() {
  return new THREE.ShaderMaterial({
    side: 2,
    clipping: true,
    uniforms: {},
    vertexShader: `
    varying vec3 vCameraPosition;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    #include <clipping_planes_pars_vertex>
  
    void main() {
       #include <begin_vertex>
       
       vec4 absPosition = vec4(position, 1.0);
       vNormal = normal;
       
       #ifdef USE_INSTANCING
          absPosition = instanceMatrix * absPosition;
          vNormal = (instanceMatrix * vec4(normal, 0.)).xyz;
       #endif
       
       absPosition = modelMatrix * absPosition;
       vNormal = (normalize(modelMatrix * vec4(vNormal, 0.))).xyz;
       
       gl_Position = projectionMatrix * viewMatrix * absPosition;
       
       vCameraPosition = cameraPosition;
       vPosition = absPosition.xyz;
       
       #include <project_vertex>
       #include <clipping_planes_vertex>
    }
    `,
    fragmentShader: `
    varying vec3 vCameraPosition;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    #include <clipping_planes_pars_fragment>
  
    void main() {
      #include <clipping_planes_fragment>
      vec3 cameraPixelVec = normalize(vCameraPosition - vPosition);
      float difference = abs(dot(vNormal, cameraPixelVec));
      
      // This achieves a double gloss effect: when the surface is perpendicular and when it's parallel
      difference = abs((difference * 2.) - 1.);
      
      gl_FragColor = vec4(difference, difference, difference, 1.);
    }
    `,
  });
}
