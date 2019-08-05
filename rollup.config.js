import typescript from 'rollup-plugin-typescript2';
import dts from 'rollup-plugin-dts';
import { uglify } from 'rollup-plugin-uglify';
import pkg from './package.json';

const config = [
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
      },
    ],
    external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
    plugins: [
      typescript({
        typescript: require('typescript'),
        useTsconfigDeclarationDir: true,
      }),
      uglify(),
    ],
  },
  {
    input: 'types/index.d.ts',
    output: [{ file: pkg.types, format: 'cjs' }],
    plugins: [dts()],
  },
];

export default config;
