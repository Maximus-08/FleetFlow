import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                app: resolve(__dirname, 'src/app.html'),
                full: resolve(__dirname, 'src/pages/full.html'),
                register: resolve(__dirname, 'src/pages/register.html')
            }
        }
    }
});
