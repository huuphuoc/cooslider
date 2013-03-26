(function($) {
    /**
     * CSS3 animation powered by https://github.com/daneden/animate.css
     *
     * @since 1.0.0
     */
    Coo.Effect.register([
        'bounce', 'bounceIn', 'bounceInDown', 'bounceInLeft', 'bounceInRight', 'bounceInUp',
        'fadeIn', 'fadeInDown', 'fadeInDownBig', 'fadeInLeft', 'fadeInLeftBig', 'fadeInRight', 'fadeInRightBig', 'fadeInUp', 'fadeInUpBig',
        'flash',
        'flip', 'flipInX', 'flipInY',
        'lightSpeedIn',
        'pulse',
        'rollIn',
        'rotateIn', 'rotateInDownLeft', 'rotateInDownRight', 'rotateInUpLeft', 'rotateInUpRight',
        'shake',
        'swing',
        'tada',
        'wiggle',
        'wobble'
    ], 'Coo.Effect.Css3Animate');

    Coo.Effect.Css3Animate = Coo.Effect._Base.extend({
        _animate: function() {
            this.reset();
            $(this._target)
                .data('effect', this._effect)
                .addClass('animated ' + this._effect)
                .show();
            this._complete();
        },

        reset: function() {
            var effect = $(this._target).data('effect');
            if (effect) {
                $(this._target).removeClass('animated ' + effect);
            }
        },

        getClass: function() {
            return 'Coo.Effect.Css3Animate';
        },

        getFeatures: function() {
            return ['css3'];
        },

        _supportByBrowser: function() {
            // See http://caniuse.com/css-animation
            // CSS3 animation is not supported on IE7/8/9
            var ie = Coo.Browser.ie();
            return (ie == undefined || ie > 9);
        },

        _supportByTarget: function() {
            return true;
        }
    });
})(window.jQuery);
