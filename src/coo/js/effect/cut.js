(function($) {
    /**
     * cut effect
     *
     * @since 1.0.2
     */
    Coo.Effect.register('cut', 'Coo.Effect.Cut');

    Coo.Effect.Cut = Coo.Effect._Grid.extend({
        _setup: function() {
            this._slider.$viewPort.find('.' + this._slider.getOption('classPrefix') + 'clone').remove();
            this._createBoxes(2, 1, this._currentItem);
            this._createBoxes(2, 1, this._nextItem);
        },

        _animate: function() {
            var that   = this,
                width  = this._slider.$viewPort.width(),
                $boxes = this._slider.$viewPort.find('.' + this._slider.getOption('classPrefix') + 'box'),
                speed  = that._slider.getOption('animationSpeed');

            $boxes
                .eq(0)
                .animate({
                    left: -width,
                    opacity: 1
                }, speed);
            $boxes
                .eq(1)
                .animate({
                    left: width,
                    opacity: 1
                }, speed);
            $boxes
                .eq(2)
                .css('left', width + 'px')
                .animate({
                    left: 0,
                    opacity: 1
                }, speed);
            $boxes
                .eq(3)
                .css('left', -width + 'px')
                .animate({
                    left: 0,
                    opacity: 1
                }, speed, function() {
                    that._complete();
                });
        },

        getClass: function() {
            return 'Coo.Effect.Cut';
        }
    });
})(window.jQuery);
