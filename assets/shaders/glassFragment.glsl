precision highp float;

uniform float u_time;
uniform float u_thickness;
uniform float u_refractIndex;
uniform float u_lightIntensity;
uniform vec3 u_ambientColor;
uniform float u_distortionScale;

varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vViewDir;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(23.2, 47.3))) * 37831.97531);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);

  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

vec3 fresnelColor(float fresnel) {
  vec3 tintA = vec3(0.25, 0.52, 0.92);
  vec3 tintB = vec3(0.56, 0.27, 0.96);
  return mix(tintA, tintB, fresnel);
}

vec3 computeCaustics(vec3 normal, vec3 lightDir, float timeMod) {
  float ripple = noise(vUv * 6.0 + vec2(timeMod * 1.4, timeMod * 0.9));
  float streaks = noise(vUv * 12.0 + vec2(timeMod * -0.6, timeMod * 0.3));
  float focus = pow(max(dot(normal, -lightDir), 0.0), 3.2);
  float caustic = (ripple * 0.6 + streaks * 0.4) * focus;
  return vec3(0.75, 0.88, 0.64) * caustic * 1.35;
}

void main() {
  vec3 normal = normalize(vNormal);

  vec3 lightDir = normalize(vec3(-0.35, 0.82, 0.48));
  vec3 secondaryLightDir = normalize(vec3(0.25, 0.5, -0.6));
  vec3 viewDir = normalize(vViewDir);

  float timeMod = u_time * 0.6;

  float layeredNoise = noise(vUv * 4.0 + vec2(timeMod, -timeMod * 0.5));
  layeredNoise += noise(vUv * 7.0 + vec2(-timeMod * 1.3, timeMod * 0.8)) * 0.5;
  layeredNoise += noise(vUv * 15.0 + vec2(timeMod * 1.7, timeMod * -1.2)) * 0.25;
  layeredNoise /= 1.75;

  vec3 wobble = vec3(layeredNoise - 0.5) * (u_distortionScale * 0.8);
  normal = normalize(normal + wobble);

  float nDotL = max(dot(normal, lightDir), 0.0);
  float nDotSL = max(dot(normal, secondaryLightDir), 0.0);

  float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.0);
  vec3 fresnelTint = fresnelColor(fresnel);

  vec3 refracted = refract(-viewDir, normal, 1.0 / max(u_refractIndex, 1.01));
  float refractionShift = (refracted.x + refracted.y) * 0.5;
  vec2 refractedUv = vUv + vec2(refractionShift * 0.12, refracted.z * 0.08);
  float refractionSample = noise(refractedUv * 10.0 + vec2(timeMod * 0.7, timeMod * 0.5));

  vec3 ambient = u_ambientColor * (0.35 + layeredNoise * 0.45);
  vec3 diffuse = vec3(0.42, 0.65, 1.0) * (nDotL * u_lightIntensity * 0.85);
  diffuse += vec3(0.56, 0.38, 0.98) * (nDotSL * u_lightIntensity * 0.45);

  vec3 caustics = computeCaustics(normal, lightDir, timeMod + refractionSample);

  vec3 halfVector = normalize(lightDir + viewDir);
  float specular = pow(max(dot(normal, halfVector), 0.0), 18.0);
  vec3 highlight = vec3(0.9, 0.95, 1.0) * specular * (0.6 + u_lightIntensity * 0.4);

  vec3 color = ambient + diffuse + caustics + highlight;
  color += fresnelTint * (0.35 + fresnel * 0.65);

  float absorption = exp(-u_thickness * 1.4);
  color *= mix(1.2, 0.75, absorption);

  float alpha = clamp(0.18 + fresnel * 0.6 + nDotL * 0.25, 0.18, 0.94);
  alpha *= mix(0.65, 1.0, 1.0 - absorption);

  gl_FragColor = vec4(color, alpha);
}
