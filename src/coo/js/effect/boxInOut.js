(function($) {
    /**
     * boxInOut effect.
     * Shows the boxes from inside to outside
     *
     * @since 1.0.2
     */
    Coo.Effect.register('boxInOut', 'Coo.Effect.BoxInOut');

    Coo.Effect.BoxInOut = Coo.Effect._Grid.extend({
        _animate: function() {
            this._showCurrentItem();
            var that      = this,
                t         = 0,
                speed     = this._slider.getOption('animationSpeed'),
                $boxes    = this._slider.$viewPort.find('.' + this._slider.getOption('classPrefix') + 'box'),
                boxWidth  = Math.round(this._slider.$viewPort.width() / this._numColumns),
                boxHeight = Math.round(this._slider.$viewPort.height() / this._numRows);
            $boxes.css({
                // Place boxes at the center
                left: (this._slider.$viewPort.width() - boxWidth) / 2,
                top: (this._slider.$viewPort.height() - boxHeight) / 2
            }).each(function() {
                $(this).animate({
                    left: boxWidth * $(this).attr('data-column'),
                    top: boxHeight * $(this).attr('data-row'),
                    opacity: 1
                }, speed, function() {
                    that._checkComplete();
                });
            });
        },

        getClass: function() {
            return 'Coo.Effect.BoxInOut';
        }
    });
})(window.jQuery);
