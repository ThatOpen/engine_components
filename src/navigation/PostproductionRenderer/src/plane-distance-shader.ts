import * as THREE from "three";

// Gets the plane information (ax + by + cz = d) of each face, where:
// - (a, b, c) is the normal vector of the plane
// - d is the signed distance to the origin

export function getPlaneDistanceMaterial() {
  return new THREE.ShaderMaterial({
    side: 2,
    clipping: true,
    uniforms: {},
    vertexShader: `
    varying vec4 vColor;
    
    #include <clipping_planes_pars_vertex>
  
    void main() {
       #include <begin_vertex>
    
       vec4 absPosition = vec4(position, 1.0);
       vec3 trueNormal = normal;
       
       #ifdef USE_INSTANCING
          absPosition = instanceMatrix * absPosition;
          trueNormal = (instanceMatrix * vec4(normal, 0.)).xyz;
       #endif
       
       absPosition = modelMatrix * absPosition;
       trueNormal = (normalize(modelMatrix * vec4(trueNormal, 0.))).xyz;
       
       vec3 planePosition = absPosition.xyz / 40.;
       float d = abs(dot(trueNormal, planePosition));
       vColor = vec4(abs(trueNormal), d);
       gl_Position = projectionMatrix * viewMatrix * absPosition;
       
       #include <project_vertex>
       #include <clipping_planes_vertex>
    }
    `,
    fragmentShader: `
    varying vec4 vColor;
    
    #include <clipping_planes_pars_fragment>
  
    void main() {
      #include <clipping_planes_fragment>
      gl_FragColor = vColor;
    }
    `,
  });
}
