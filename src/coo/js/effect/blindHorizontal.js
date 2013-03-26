(function($) {
    /**
     * blindHorizontal effect
     *
     * @since 1.0.2
     */
    Coo.Effect.register('blindHorizontal', 'Coo.Effect.BlindHorizontal');

    Coo.Effect.BlindHorizontal = Coo.Effect._Grid.extend({
        _setup: function() {
            this._slider.$viewPort.find('.' + this._slider.getOption('classPrefix') + 'clone').remove();
            // Always create 1-column boxes
            this._createBoxes(this._slider.getOption('rows') || 5, 1);
        },

        _animate: function() {
            this._showCurrentItem();
            var that      = this,
                t         = 0,
                boxHeight = this._slider.$viewPort.height() / this._numBoxes,
                speed     = this._slider.getOption('animationSpeed'),
                $slices   = this._slider.$viewPort.find('.' + this._slider.getOption('classPrefix') + 'box');

            $slices.each(function(i) {
                t += speed / that._numBoxes;
                $(this)
                    .css({
                        top: i * boxHeight,
                        height: '0px'
                    })
                    .delay(t)
                    .animate({
                        opacity: '1.0',
                        height: (i < that._numBoxes - 1) ? boxHeight : (that._slider.$viewPort.height() - boxHeight * i)
                    }, speed, function() {
                        that._checkComplete();
                    });
            });
        },

        getClass: function() {
            return 'Coo.Effect.BlindHorizontal';
        }
    });
})(window.jQuery);
