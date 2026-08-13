/*
 * Copyright (C) 2012-2020  Online-Go.com
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as React from "react";

/*
 * Plays a "stacked" transparent video: an mp4 with the color (premultiplied
 * over black) in the top half and the luma matte in the bottom half,
 * composited in WebGL so it renders with real transparency wherever mp4 plays.
 */

const VERT = `
attribute vec2 pos;
varying vec2 uv;
void main() {
    uv = vec2(pos.x * 0.5 + 0.5, 0.25 - pos.y * 0.25);
    gl_Position = vec4(pos, 0.0, 1.0);
}`;

// Color lives in the top half of the frame, matte in the bottom half.
const FRAG = `
precision mediump float;
varying vec2 uv;
uniform sampler2D tex;
void main() {
    vec3 rgb = texture2D(tex, uv).rgb;
    float a = texture2D(tex, uv + vec2(0.0, 0.5)).r;
    gl_FragColor = vec4(rgb, a);
}`;

export function MatteVideo({
    src,
    className,
    playing = true,
}: {
    src: string;
    className?: string;
    // false pauses; flipping to true restarts from the first frame. Mounting
    // with playing=false preloads the video so playback starts instantly.
    playing?: boolean;
}): JSX.Element {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const videoRef = React.useRef<HTMLVideoElement>();

    React.useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }
        const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true });
        if (!gl) {
            console.error("MatteVideo: WebGL unavailable");
            return;
        }

        const program = gl.createProgram()!;
        for (const [type, source] of [
            [gl.VERTEX_SHADER, VERT],
            [gl.FRAGMENT_SHADER, FRAG],
        ] as const) {
            const shader = gl.createShader(type)!;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            gl.attachShader(program, shader);
        }
        gl.linkProgram(program);
        gl.useProgram(program);

        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        const pos = gl.getAttribLocation(program, "pos");
        gl.enableVertexAttribArray(pos);
        gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        const video = document.createElement("video");
        videoRef.current = video;
        video.src = src;
        video.muted = true;
        video.playsInline = true;
        video.preload = "auto";
        video.crossOrigin = "anonymous";
        video.load();

        let disposed = false;
        function draw() {
            if (disposed) {
                return;
            }
            if (video.videoWidth) {
                if (canvas.width !== video.videoWidth) {
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight / 2;
                    gl.viewport(0, 0, canvas.width, canvas.height);
                }
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
                gl.drawArrays(gl.TRIANGLES, 0, 3);
            }
            schedule();
        }
        function schedule() {
            if ("requestVideoFrameCallback" in video) {
                (video as any).requestVideoFrameCallback(draw);
            } else {
                requestAnimationFrame(draw);
            }
        }
        schedule();

        return () => {
            disposed = true;
            video.pause();
            video.removeAttribute("src");
            video.load();
            gl.getExtension("WEBGL_lose_context")?.loseContext();
        };
    }, [src]);

    React.useEffect(() => {
        const video = videoRef.current;
        if (!video) {
            return;
        }
        if (playing) {
            video.currentTime = 0;
            void video.play().catch(() => undefined);
        } else {
            video.pause();
        }
    }, [playing]);

    return <canvas ref={canvasRef} className={className} />;
}
