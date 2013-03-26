(function($) {
    /**
     * boxRain, boxRainGrowReverse, boxRainReverse effects
     *
     * @since 1.0.1
     */
    Coo.Effect.register(['boxRain', 'boxRainReverse', 'boxRainGrow', 'boxRainGrowReverse'], 'Coo.Effect.BoxRain');

    Coo.Effect.BoxRain = Coo.Effect._Grid.extend({
        _animate: function() {
            var that     = this,
                t        = 0,
                speed    = this._slider.getOption('animationSpeed'),
                $boxes   = this._slider.$viewPort.find('.' + this._slider.getOption('classPrefix') + 'box'),
                row      = 0,
                column   = 0,
                boxes2D  = [];   // Store the boxes in two dimensions array

            boxes2D[row] = [];
            if(['boxRainReverse', 'boxRainGrowReverse'].indexOf(this._effect) != -1) {
                $boxes = $($boxes.get().reverse());
            }
            $boxes.each(function() {
                boxes2D[row][column] = $(this);
                column++;
                if (column == that._slider.getOption('columns')) {
                    row++;
                    column       = 0;
                    boxes2D[row] = [];
                }
            });

            this._showCurrentItem();

            for (column = 0; column < this._slider.getOption('columns') * 2; column++) {
                var prevCol = column;
                t += 100; // speed / this._numBoxes;
                for (row = 0; row < this._slider.getOption('rows'); row++) {
                    if (prevCol >= 0 && prevCol < this._slider.getOption('columns')) {
                        var $box = $(boxes2D[row][prevCol]),
                            w    = $box.width(),
                            h    = $box.height();
                        if (['boxRainGrow', 'boxRainGrowReverse'].indexOf(that._effect) != -1) {
                            $box.width(0).height(0);
                        }
                        $box
                            .delay(t)
                            .animate({
                                opacity: '1',
                                width: w,
                                height: h
                            }, speed, function() {
                                that._checkComplete();
                            });
                    }
                    prevCol--;
                }
            }
        },

        getClass: function() {
            return 'Coo.Effect.BoxRain';
        }
    });
})(window.jQuery);
