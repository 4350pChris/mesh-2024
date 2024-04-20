import {telefunc} from "telefunc/vite";
import ssr from "vike/plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react({}), ssr({}), telefunc()],
});