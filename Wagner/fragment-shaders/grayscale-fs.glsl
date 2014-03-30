varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform vec2 resolution;

void main() {

	vec3 luma = vec3( .299, 0.587, 0.114 );
	vec4 color = texture2D( tDiffuse, vUv );
	gl_FragColor = vec4( vec3( dot( color.rgb, luma ) ), color.a );

}