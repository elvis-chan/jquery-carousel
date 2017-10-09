(function ($, window, document) {
  'use strict';

  const defaults = {
    animateDuration: 200,
  };

  function EcCarousel(element, options) {
    this.options = $.extend(true, {}, defaults, options);
    this.element = $(element);

    this.$slides = $();
    this.$dots = $();

    this.init();
  }

  $.extend(EcCarousel.prototype, {

    attachEvents: function () {
      $('li', this.$dots).on('click', this.handleClickDot.bind(this));
    },

    handleClickDot: function (e) {
      this.$slides.removeClass('ec-stop-transition')
        .css({
          transition: `all ${this.options.animateDuration}ms ease-in-out`,
          transform: `translateX(${-100 * $(e.currentTarget).index()}vw)`,
        });

      setTimeout(() => this.$slides.addClass('ec-stop-transition'), this.options.animateDuration);

      $(this).addClass('ec-selected');
    },

    buildDots: function () {
      this.$dots = $('<ul/>', { class: 'ec-dots' });

      for (let i = 0; i < this.slidesLength; i += 1) {
        this.$dots.append(`<li><button>${i}</button></li>`);
      }

      this.element.append(this.$dots);
    },

    buildSlides: function () {
      const slidesClass = 'ec-slides';
      const slideClass = 'ec-slide';
      const slideContentClass = 'ec-slide-content';

      const $slides = $('<div/>', { class: slidesClass });
      
      this.element.wrapInner($slides);

      this.$slides = this.element.find(`.${slidesClass}`);

      this.$slides.children().each((idx, el) => {
        $(el).addClass(slideClass)
          .wrapInner($('<div/>', { class: slideContentClass }))
          .css({ left: `calc(100vw * ${idx})` });
      });
    },

    init: function () {
      if (!this.element.hasClass('ec-ready')) {
        this.element.addClass('ec-carousel');

        this.slidesLength = this.element.children().length;

        this.buildSlides();
        this.buildDots();
        this.attachEvents();

        this.element.addClass('ec-ready');
      }
    },
  });

  $.fn.ecCarousel = function (options) {
    return this.each(function () {
      if (!$.data(this, 'ecCarousel')) {
        $.data(this, 'ecCarousel', new EcCarousel(this, options));
      }
    });
  };

})(jQuery, window, document);
