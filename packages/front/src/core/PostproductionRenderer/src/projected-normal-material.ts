import * as THREE from "three";

// Gets the dot product of the normal vector and the camera pixel vector:

export function getProjectedNormalMaterial() {
  return new THREE.ShaderMaterial({
    clipping: true,
    uniforms: {
      glossExponent: { value: 10 },
      fresnelExponent: { value: 6 },
      glossFactor: { value: 0.2 },
      fresnelFactor: { value: 1 },
    },
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
    uniform float glossExponent;
    uniform float glossFactor;
    uniform float fresnelExponent;
    uniform float fresnelFactor;

    varying vec3 vCameraPosition;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    #include <clipping_planes_pars_fragment>
  
    void main() {
      #include <clipping_planes_fragment>
      vec3 cameraPixelVec = normalize(vCameraPosition - vPosition);
      float dotProduct = dot(vNormal, cameraPixelVec);

      // Use abs() for both gloss and fresnel to handle DoubleSide materials
      // On back faces, dotProduct is negative, which breaks the fresnel calculation

      float absDotProduct = abs(dotProduct);
      float gloss = absDotProduct;

      // Use absDotProduct instead of dotProduct to prevent values > 1.0
      
      float fresnel = pow(1.0 - absDotProduct, fresnelExponent) * fresnelFactor;

      gloss = pow(gloss, glossExponent) * glossFactor;

      float result = gloss + fresnel;

      gl_FragColor = vec4(result, result, result, 1.);
    }
    `,
  });
}
