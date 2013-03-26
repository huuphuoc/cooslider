(function($) {
    /**
     * circleFadeOut effect
     *
     * @since 1.0.1
     */
    Coo.Effect.register('circleFadeOut', 'Coo.Effect.CircleFadeOut');

    Coo.Effect.CircleFadeOut = Coo.Effect._Circle.extend({
        _setup: function() {
            this._createCircles(this._currentItem);
        },

        _animate: function() {
            // Clone next image
            var $img = $(this._nextItem).is('img') ? $(this._nextItem) : $(this._nextItem).find('img');
            $('<img/>')
                .attr('src', $img.attr('src'))
                .addClass(this._slider.getOption('classPrefix') + 'clone')
                .css({
                    height: '100%',
                    width: '100%',
                    opacity: 1,
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    zIndex: 0
                })
                .appendTo(this._slider.$viewPort);

            var that     = this,
                $circles = this._slider.$viewPort.find('.' + this._slider.getOption('classPrefix') + 'circle');
            $circles.css({
                opacity: 1,
                zIndex: 2
            }).each(function(i) {
                $(this).css('border-radius', (i == that._minDiameter - 1) ? 0 : that._minDiameter * (i + 1));
            });

            this._hideCircle(1);
        },

        _hideCircle: function(i) {
            var that     = this,
                index    = this._numCircles - i,
                speed    = this._slider.getOption('animationSpeed'),
                $circles = this._slider.$viewPort.find('.' + this._slider.getOption('classPrefix') + 'circle'),
                opacity  = (1 - (index + 1) / this._numCircles).toFixed(2);

            $circles
                .eq(index)
                .animate({
                    opacity: opacity
                }, 50, function() {
                    if (i < that._numCircles - 1) {
                        that._hideCircle(i + 1);
                    } else {
                        $circles.animate({
                            opacity: 1,
                            zIndex: 0
                        }, speed);
                        that._complete();
                    }
                });
        },

        getClass: function() {
            return 'Coo.Effect.CircleFadeOut';
        }
    });
})(window.jQuery);
