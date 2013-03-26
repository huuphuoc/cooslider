(function($) {
    /**
     * circleFadeIn effect
     *
     * @since 1.0.1
     */
    Coo.Effect.register('circleFadeIn', 'Coo.Effect.CircleFadeIn');

    Coo.Effect.CircleFadeIn = Coo.Effect._Circle.extend({
        _setup: function() {
            this._createCircles(this._nextItem);
        },

        _animate: function() {
            var that        = this,
                radiusArray = [],
                t           = 0,
                speed       = this._slider.getOption('animationSpeed'),
                $circles    = this._slider.$viewPort.find('.' + this._slider.getOption('classPrefix') + 'circle');

            $circles.each(function(i) {
                radiusArray.push((i + 1) * that._minDiameter);
            });
            radiusArray[radiusArray.length - 1] = 0;

            this._showCurrentItem();
            $circles.each(function(i) {
                t += speed / that._numCircles;
                $(this)
                    .delay(t)
                    .css('border-radius', radiusArray[i])
                    .animate({
                        opacity: 1,
                        zIndex: 0
                    }, speed, function() {
                        that._done++;
                        if (that._done == that._numCircles) {
                            that._complete();
                        }
                    });
            });
        },

        getClass: function() {
            return 'Coo.Effect.CircleFadeIn';
        }
    });
})(window.jQuery);
