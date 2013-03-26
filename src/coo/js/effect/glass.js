(function($) {
    /**
     * glass effect
     *
     * @since 1.0.3
     */
    Coo.Effect.register(['glass', 'glassReverse'], 'Coo.Effect.Glass');

    Coo.Effect.Glass = Coo.Effect._Grid.extend({
        _setup: function() {
            this._slider.$viewPort.find('.' + this._slider.getOption('classPrefix') + 'clone').remove();
            this._createBoxes(2, this._slider.getOption('columns') || 10);
        },

        _animate: function() {
            var that   = this,
                t      = 0,
                speed  = this._slider.getOption('animationSpeed'),
                height = this._slider.$viewPort.height(),
                $boxes = this._slider.$viewPort.find('.' + this._slider.getOption('classPrefix') + 'box'),
                half   = this._numBoxes / 2,
                start  = ('glass' == this._effect) ? 0 : (half - 1),
                step   = ('glass' == this._effect) ? 1 : -1;

            this._showCurrentItem();
            $boxes.each(function(i) {
                $(this).css('top', i < half ? (-height / 2) : height);
            });

            for (var i = start; i != half - start + step - 1; i = i + step) {
                t += speed / this._numBoxes;
                $boxes
                    .eq(i)
                    .delay(t)
                    .animate({
                        top: 0,
                        opacity: 1
                    }, speed, function() {
                        that._checkComplete();
                    });
                $boxes
                    .eq(half + i)
                    .delay(t)
                    .animate({
                        top: height / 2,
                        opacity: 1
                    }, speed, function() {
                        that._checkComplete();
                    });
            }
        },

        getClass: function() {
            return 'Coo.Effect.Glass';
        }
    });
})(window.jQuery);
