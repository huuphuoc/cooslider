(function($) {
    /**
     * barDownSymmetry effect
     *
     * @since 1.0.3
     */
    Coo.Effect.register('barDownSymmetry', 'Coo.Effect.BarDownSymmetry');

    Coo.Effect.BarDownSymmetry = Coo.Effect._Slice.extend({
        _animate: function() {
            var that    = this,
                t       = 0,
                speed   = this._slider.getOption('animationSpeed'),
                $slices = this._slider.$viewPort.find('.' + this._slider.getOption('classPrefix') + 'box'),
                middle  = Math.floor(this._numBoxes / 2),
                total   = (this._numBoxes % 2 == 0) ? (this._numBoxes - 1) : this._numBoxes;

            this._showCurrentItem();
            $slices.css('top', -this._slider.$viewPort.height());
            for (var i = middle - 1; i >= 0; i--) {
                // t = 1.5 * t;
                t += speed / this._numBoxes;
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
                    .eq(total - i)
                    .delay(t)
                    .animate({
                        top: 0,
                        opacity: 1
                    }, speed, function() {
                        that._checkComplete();
                    });
            }
        },

        getClass: function() {
            return 'Coo.Effect.BarDownSymmetry';
        }
    });
})(window.jQuery);
