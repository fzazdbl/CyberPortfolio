precision highp float;

uniform float u_time;
uniform float u_thickness;
uniform float u_refractIndex;
uniform float u_reflectivity;
uniform float u_ambientStrength;
uniform vec3 u_glowColor;
uniform float u_distortion;
uniform float u_mouseStrength;
uniform float u_scroll;
uniform float u_audioLevel;
uniform samplerCube u_envMap;
uniform vec3 u_sceneLightA;
uniform vec3 u_sceneLightB;
uniform float u_causticIntensity;

in vec3 vWorldPosition;
in vec3 vNormal;
in vec3 vViewDir;
in vec2 vUv;
in float vWaveStrength;
in vec3 vNoiseVector;

out vec4 fragColor;

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x * 34.0) + 1.0) * x);
}

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = vec4(i.z + vec4(0.0, i1.z, i2.z, 1.0));
  p = permute(p);
  p = permute(p + i.y + vec4(0.0, i1.y, i2.y, 1.0));
  p = permute(p + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  vec3 x = x0 - 0.0 + 0.0;
  vec3 y = x1 - 0.0 + 0.0;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;

  vec4 j = p - 49.0 * floor(p * 0.142857142857 * 0.142857142857);

  vec4 x_ = floor(j * 0.142857142857);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 xPos = x_ * 0.142857142857 + 0.0357142857143;
  vec4 yPos = y_ * 0.142857142857 + 0.0357142857143;
  vec4 h = 1.0 - abs(xPos) - abs(yPos);

  vec4 b0 = vec4(xPos.xy, yPos.xy);
  vec4 b1 = vec4(xPos.zw, yPos.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 g0 = vec3(a0.xy, h.x);
  vec3 g1 = vec3(a0.zw, h.y);
  vec3 g2 = vec3(a1.xy, h.z);
  vec3 g3 = vec3(a1.zw, h.w);

  vec4 norm = inversesqrt(vec4(dot(g0, g0), dot(g1, g1), dot(g2, g2), dot(g3, g3)));
  g0 *= norm.x;
  g1 *= norm.y;
  g2 *= norm.z;
  g3 *= norm.w;

  vec4 contributions = vec4(dot(g0, x0), dot(g1, x1), dot(g2, x2), dot(g3, x3));
  return 42.0 * dot(m * m, contributions);
}

float layeredNoise(vec3 pos) {
  float n = 0.0;
  n += snoise(pos * 1.2) * 0.5;
  n += snoise(pos * 2.4 + 12.5) * 0.3;
  n += snoise(pos * 4.5 - 7.3) * 0.2;
  return n;
}

vec3 tonemap(vec3 color) {
  return color / (color + vec3(1.0));
}

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(vViewDir);
  vec3 lightDir = normalize(u_sceneLightA);
  vec3 lightDirB = normalize(u_sceneLightB);

  float timeFactor = u_time * 0.65;
  float noiseField = layeredNoise(vec3(vUv * 4.0, timeFactor));
  float distortion = layeredNoise(vec3(vUv * 9.0, -timeFactor * 1.4));
  normal = normalize(mix(normal, normal + vec3(noiseField, distortion, 0.0) * u_distortion * 0.35, 0.6));

  vec3 incident = normalize(-viewDir);
  float eta = 1.0 / max(u_refractIndex, 1.01);
  vec3 refracted = refract(incident, normal, eta);
  vec3 reflected = reflect(incident, normal);

  vec3 dispersion = vec3(
    texture(u_envMap, refracted * vec3(1.02, 1.0, 1.0)).r,
    texture(u_envMap, refracted * vec3(0.99, 1.0, 0.98)).g,
    texture(u_envMap, refracted * vec3(1.0, 1.02, 1.03)).b
  );
  vec3 envReflection = texture(u_envMap, reflected).rgb;

  float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.0);
  float reflectionFactor = mix(u_reflectivity, 1.0, fresnel);

  float thickness = clamp(u_thickness * 1.8 + vWaveStrength * 0.4, 0.1, 3.0);
  vec3 marchDir = normalize(refracted);
  vec3 marchPos = vWorldPosition + normal * 0.02;
  float absorption = 0.0;
  const int STEPS = 14;
  for (int i = 0; i < STEPS; i++) {
    marchPos += marchDir * (thickness / float(STEPS));
    float density = layeredNoise(vec3(marchPos.xy * 1.5, timeFactor));
    absorption += density;
  }
  absorption = exp(-absorption * 0.65);

  vec3 refractedColor = tonemap(dispersion) * absorption;
  vec3 reflectionColor = tonemap(envReflection);

  vec3 combined = mix(refractedColor, reflectionColor, reflectionFactor);
  combined = mix(combined, refractedColor, 0.35 + (1.0 - absorption) * 0.2);

  float luma = dot(combined, vec3(0.2126, 0.7152, 0.0722));
  vec3 ambient = u_glowColor * (u_ambientStrength * 0.6 + luma * 0.3);

  float causticMask = pow(max(dot(normal, lightDir), 0.0), 2.5);
  float causticMaskB = pow(max(dot(normal, lightDirB), 0.0), 3.0);
  float ripple = layeredNoise(vec3(vUv * 8.0 + vNoiseVector.xz, timeFactor * 1.2));
  vec3 caustics = (vec3(0.7, 0.9, 1.2) * causticMask + vec3(0.45, 0.6, 1.1) * causticMaskB) * ripple * u_causticIntensity;

  float glowPulse = 0.35 + fresnel * 0.85 + u_audioLevel * 0.4;
  vec3 glow = u_glowColor * glowPulse;

  combined += ambient * (0.35 + vNoiseVector.z * 0.25);
  combined += caustics;
  combined += glow * 0.35;

  float alpha = clamp(0.22 + fresnel * 0.55 + (1.0 - absorption) * 0.3, 0.18, 0.96);
  alpha *= mix(0.78, 1.0, clamp(u_mouseStrength + u_scroll * 0.5, 0.0, 1.0));

  fragColor = vec4(combined, alpha);
}
