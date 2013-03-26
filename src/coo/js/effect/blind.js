(function($) {
    /**
     * blind effect
     *
     * @since 1.0.1
     */
    Coo.Effect.register('blind', 'Coo.Effect.Blind');

    Coo.Effect.Blind = Coo.Effect._Slice.extend({
        _animate: function() {
            this._showCurrentItem();
            var that    = this,
                t       = 0,
                speed   = this._slider.getOption('animationSpeed'),
                $slices = this._slider.$viewPort.find('.' + this._slider.getOption('classPrefix') + 'box');
            $slices.each(function() {
                var w = $(this).width();
                t += speed / this._numBoxes;
                $(this)
                    .data('width', $(this).width())      // Backup width
                    .css({
                        top: '0px',
                        width: '0px'
                    })
                    .delay(t)
                    .animate({
                        opacity: '1.0',
                        width: $(this).data('width')    // Restore width
                    }, speed, function() {
                        that._checkComplete();
                    });
            });
        },

        getClass: function() {
            return 'Coo.Effect.Blind';
        }
    });
})(window.jQuery);
