import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

// import { terser } from 'rollup-plugin-terser';
import path from "path"
import {createSvgIconsPlugin} from "vite-plugin-svg-icons"
import {codeInspectorPlugin} from 'code-inspector-plugin';


// https://vitejs.dev/config/

export default defineConfig({
    base: '/',  // 静态资源assets文件夹路径，必须与服务器部署文件夹名字一致 或者 './' 相对路径
    plugins: [
        vue(),
        createSvgIconsPlugin({
            iconDirs: [path.resolve(process.cwd(), "src/assets/icons/svg")],
            symbolId: "icon-[dir]-[name]"
        }),
        codeInspectorPlugin({
            bundler: 'vite',
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    // 服务端渲染
    server: {
        // 端口号
        port: 5177,
        host: "0.0.0.0",
    },
    build: {
        // 关闭压缩
        // minify: terser,
        // rollupOptions: {
        //   plugins: [
        //     terser({
        //       compress: {
        //         drop_console: true, // 关闭所有的 console.log 打印
        //       },
        //     }),
        //   ],
        // },
        chunkSizeWarningLimit: 1500,
        // rollupOptions: {
        //   external: ['public'],
        // },
        // rollupOptions: {
        //     output: {
        //         manualChunks(id) {
        //             if (id.includes('node_modules')) {
        //                 return id.toString().split('node_modules/')[1].split('/')[0].toString();
        //             }
        //         }
        //     }
        // }
    }
})
