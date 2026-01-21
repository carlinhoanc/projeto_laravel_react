const plugins = [];

try {
  // load tailwind if available; if it fails, continue so dev server can still run
  plugins.push(require('tailwindcss'));
} catch (e) {
  // eslint-disable-next-line no-console
  console.warn('tailwindcss not available in postcss config:', e && e.message ? e.message : e);
}

// autoprefixer is required
plugins.push(require('autoprefixer'));

module.exports = {
  plugins,
};
