(function($) {
    /**
     * barUpDownSymmetry effect
     *
     * @since 1.0.2
     */
    Coo.Effect.register('barUpDownSymmetry', 'Coo.Effect.BarUpDownSymmetry');

    Coo.Effect.BarUpDownSymmetry = Coo.Effect._Slice.extend({
        _animate: function() {
            var that    = this,
                t       = 0,
                speed   = this._slider.getOption('animationSpeed'),
                height  = this._slider.$viewPort.height(),
                $slices = this._slider.$viewPort.find('.' + this._slider.getOption('classPrefix') + 'box');

            this._showCurrentItem();
            $slices.each(function(i) {
                $(this).css('top', i % 2 == 0 ? height : -height);
            }).each(function(i) {
                t += speed / that._numBoxes;
                $slices
                    .eq(i)
                    .delay(t)
                    .animate({
                        top: 0,
                        opacity: 1
                    }, speed, function() {
                        that._checkComplete();
                    });
                $slices
                    .eq(that._numBoxes - i - 1)
                    .delay(t)
                    .animate({
                        top: 0,
                        opacity: 1
                    }, speed, function() {
                        that._checkComplete();
                    });
            });
        },

        getClass: function() {
            return 'Coo.Effect.BarUpDownSymmetry';
        }
    });
})(window.jQuery);
