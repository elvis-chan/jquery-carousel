module.exports = [
  /**
   * Transform @import rules by inlining content
   * https://github.com/postcss/postcss-import
   */
  require('postcss-import')({
    // The supplied file path must be an absolute path
  }),
  /**
   * Helps you to use the latest CSS syntax today, e.g., :root { --color: red; }
   * https://github.com/MoOx/postcss-cssnext
   */
  require('postcss-cssnext')({
    browsers: ['last 2 versions', '> 5%'],
  }),
  /**
   * Reduce calc() references whenever it's possible
   * https://github.com/postcss/postcss-calc
   */
  require('postcss-calc')(),
  /**
   * A little bag of CSS superpowers e.g., rgba(#fff, .3)
   * https://github.com/simplaio/rucksack
   */
  require('rucksack-css')(),
  /**
   * LostGrid is a powerful grid system built in PostCSS
   * https://github.com/peterramsing/lost
   */
  require('lost')(),
];