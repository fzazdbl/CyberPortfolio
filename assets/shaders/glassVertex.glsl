precision highp float;

uniform float u_time;
uniform float u_distortionScale;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vViewDir;

mat3 rotationZ(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat3(
    c, -s, 0.0,
    s,  c, 0.0,
    0.0, 0.0, 1.0
  );
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
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

vec3 animatedNormal(vec3 baseNormal, vec3 worldPos, float t) {
  vec2 offset = worldPos.xy * 0.35;
  float n1 = noise(offset + vec2(t * 0.6, t * -0.4));
  float n2 = noise(offset * 1.7 + vec2(t * 0.25, t * 0.5));
  float n3 = noise(offset * 3.2 + vec2(t * -0.35, t * 0.2));

  vec3 distortion = vec3(n1 - 0.5, n2 - 0.5, n3 - 0.5) * (u_distortionScale * 1.8);
  mat3 bend = rotationZ((n1 - n2) * 0.65);

  return normalize(bend * (baseNormal + distortion));
}

void main() {
  vec3 displaced = position;
  float distortion = noise(position.xy * 1.4 + vec2(u_time * 0.4, u_time * -0.3));
  displaced.z += (distortion - 0.5) * u_distortionScale * 2.4;

  vec4 world = modelMatrix * vec4(displaced, 1.0);
  vWorldPosition = world.xyz;
  vUv = uv;

  vec3 transformedNormal = normalMatrix * animatedNormal(normal, world.xyz, u_time);
  vNormal = normalize(transformedNormal);

  vec4 view = viewMatrix * world;
  vViewDir = normalize(cameraPosition - world.xyz);

  gl_Position = projectionMatrix * view;
}
