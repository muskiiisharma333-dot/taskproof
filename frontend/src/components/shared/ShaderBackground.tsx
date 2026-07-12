import React, { useEffect, useRef } from "react";

export const ShaderBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Sync drawing-buffer size with client size
    const syncSize = () => {
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(syncSize);
      resizeObserver.observe(canvas);
    } else {
      window.addEventListener("resize", syncSize);
    }
    syncSize();

    const gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) return;

    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      varying vec2 v_texCoord;
      uniform float u_time;
      uniform vec2 u_resolution;

      void main() {
        vec2 uv = v_texCoord;
        
        // Pastel colors from prompt
        vec3 lavender = vec3(0.804, 0.706, 0.859); // #CDB4DB
        vec3 softPink = vec3(1.0, 0.784, 0.867); // #FFC8DD
        vec3 babyPink = vec3(1.0, 0.686, 0.8);   // #FFAFCC
        vec3 icyBlue = vec3(0.741, 0.878, 0.996);  // #BDE0FE
        vec3 skyBlue = vec3(0.635, 0.824, 1.0);    // #A2D2FF

        // Moving blobs
        float t = u_time * 0.2;
        
        float blob1 = sin(uv.x * 2.0 + t) * 0.5 + 0.5;
        float blob2 = cos(uv.y * 1.5 - t * 0.8) * 0.5 + 0.5;
        float blob3 = sin((uv.x + uv.y) * 1.2 + t * 0.5) * 0.5 + 0.5;
        
        vec3 color = mix(lavender, softPink, blob1);
        color = mix(color, icyBlue, blob2);
        color = mix(color, skyBlue, blob3 * 0.5);
        color = mix(color, babyPink, sin(t) * 0.2 + 0.2);

        gl_FragColor = vec4(color, 0.12); // Subtle transparency for glassmorphism layering
      }
    `;

    const loadShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error: " + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = loadShader(gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error: " + gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const timeLocation = gl.getUniformLocation(program, "u_time");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const mouseLocation = gl.getUniformLocation(program, "u_mouse");

    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = 1.0 - (event.clientY - rect.top) / rect.height;
        mouse.x = nx * canvas.width;
        mouse.y = ny * canvas.height;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    let animationFrameId: number;

    const render = (time: number) => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (timeLocation) gl.uniform1f(timeLocation, time * 0.001);
      if (resolutionLocation) gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      if (mouseLocation) gl.uniform2f(mouseLocation, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    };

    render(0);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener("resize", syncSize);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: -1 }}
    />
  );
};
