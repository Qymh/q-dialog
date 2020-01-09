const testsContext = require.context('./q-dialog', true, /\.spec.ts$/);
testsContext.keys().forEach(testsContext);

const srcContext = require.context('../src', true, /\.tsx?$/);
srcContext.keys().forEach(srcContext);
