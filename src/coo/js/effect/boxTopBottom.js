(function($) {
    /**
     * boxTopBottom effect: Showing the boxes from top to bottom
     *
     * @since 1.0.2
     */
    Coo.Effect.register('boxTopBottom', 'Coo.Effect.BoxTopBottom');

    Coo.Effect.BoxTopBottom = Coo.Effect._Grid.extend({
        _animate: function() {
            this._showCurrentItem();

            var that      = this,
                speed     = this._slider.getOption('animationSpeed'),
                t         = speed / this._numBoxes,
                $boxes    = this._slider.$viewPort.find('.' + this._slider.getOption('classPrefix') + 'box'),
                boxWidth  = Math.round(this._slider.$viewPort.width() / this._numColumns),
                boxHeight = Math.round(this._slider.$viewPort.height() / this._numRows);

            $boxes.each(function() {
                // Backup the dimensions
                $(this)
                    .data('width', $(this).width())
                    .data('height', $(this).height());
            }).css({
                // Place boxes at the center
                left: (this._slider.$viewPort.width() - boxWidth) / 2,
                top: (this._slider.$viewPort.height() - boxHeight) / 2,
                // Reset the dimensions
                height: 0,
                width: 0
            }).each(function() {
                t += speed / that._numBoxes;
                $(this)
                    .delay(t)
                    .animate({
                        left: boxWidth * $(this).attr('data-column'),
                        top: boxHeight * $(this).attr('data-row'),
                        opacity: 1,
                        height: $(this).data('height'),
                        width: $(this).data('width')
                    }, speed, function() {
                        that._checkComplete();
                    });
            });
        },

        getClass: function() {
            return 'Coo.Effect.BoxTopBottom';
        }
    });
})(window.jQuery);
