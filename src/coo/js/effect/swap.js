(function($) {
    /**
     * swap effect
     *
     * @since 1.0.2
     */
    Coo.Effect.register('swap', 'Coo.Effect.Swap');

    Coo.Effect.Swap = Coo.Effect._Grid.extend({
        _setup: function() {
            this._slider.$viewPort.find('.' + this._slider.getOption('classPrefix') + 'clone').remove();
            this._createBoxes(2, 1, this._currentItem);
            this._createBoxes(2, 1, this._nextItem);
        },

        _animate: function() {
            var that   = this,
                height = this._slider.$viewPort.height(),
                $boxes = this._slider.$viewPort.find('.' + this._slider.getOption('classPrefix') + 'box'),
                speed  = that._slider.getOption('animationSpeed');

            $boxes
                .eq(0)
                .css('height', height / 2)
                .animate({
                    top: height,
                    opacity: 1
                }, speed);
            $boxes
                .eq(1)
                .css({
                    height: height / 2,
                    top: height / 2
                })
                .animate({
                    top: -height / 2,
                    opacity: 1
                }, speed);
            $boxes
                .eq(2)
                .css('top', height / 2)
                .animate({
                    top: 0,
                    opacity: 1
                }, speed);
            $boxes
                .eq(3)
                .css('top', 0)
                .animate({
                    top: height / 2,
                    opacity: 1
                }, speed, function() {
                    that._complete();
                });
        },

        getClass: function() {
            return 'Coo.Effect.Swap';
        }
    });
})(window.jQuery);
