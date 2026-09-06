import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  /**
   * Cenas WebGL: o modelo do react-three-fiber é imperativo por definição.
   * O laço de render muta objetos Three.js (uniforms, câmera, transforms) a
   * cada frame, fora do ciclo de dados do React — é assim que a biblioteca
   * foi desenhada e é o que mantém a cena a 60fps sem re-render.
   *
   * As regras do React Compiler estão corretas para UI e seguem ativas em
   * todo o restante do projeto; aqui elas são desligadas de forma cirúrgica,
   * em um único arquivo, com escopo explícito.
   */
  {
    files: ["src/components/**/*Canvas.tsx"],
    rules: {
      "react-hooks/immutability": "off",
      "react-hooks/refs": "off",
    },
  },

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
