(function ($, window, document) {
  'use strict';

  const defaults = {};

  function Plugin(element, options) {
    this.options = $.extend(true, {}, defaults, options);
    this.element = $(element);

    this.init();
  }

  $.extend(Plugin.prototype, {
    init: function () {
      console.log(`print ${this.element.text()}`);

      this.element.addClass('ec-title');
    },
  });

  $.fn.plugin = function (options) {
    return this.each(function () {
      if (!$.data(this, 'plugin')) {
        $.data(this, 'plugin', new Plugin(this, options));
      }
    });
  };

})(jQuery, window, document);
