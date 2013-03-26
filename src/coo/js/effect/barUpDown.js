(function($) {
    /**
     * barDown, barDownReverse, barUp, barUpDown effects
     *
     * @since 1.0.2
     */
    Coo.Effect.register(['barDown', 'barDownReverse', 'barUp', 'barUpDown'], 'Coo.Effect.BarUpDown');

    Coo.Effect.BarUpDown = Coo.Effect._Grid.extend({
        _setup: function() {
            this._slider.$viewPort.find('.' + this._slider.getOption('classPrefix') + 'clone').remove();
            // Always create 1-row boxes
            this._createBoxes(1, this._slider.getOption('columns') || 10, ('barDownReverse' == this._effect) ? this._currentItem : this._nextItem);
        },

        _animate: function() {
            var that      = this,
                t         = 0,
                speed     = this._slider.getOption('animationSpeed'),
                height    = this._slider.$viewPort.height(),
                $slices   = this._slider.$viewPort.find('.' + this._slider.getOption('classPrefix') + 'box'),
                beforeTop = 0,
                afterTop  = 0;

            switch (this._effect) {
                case 'barDownReverse':
                    // Clone next image
                    var $img = $(this._nextItem).is('img') ? $(this._nextItem) : $(this._nextItem).find('img');
                    $('<img/>')
                        .attr('src', $img.attr('src'))
                        .addClass(this._slider.getOption('classPrefix') + 'clone')
                        .css({
                            height: '100%',
                            width: '100%',
                            opacity: 1,
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            zIndex: 0
                        })
                        .appendTo(this._slider.$viewPort);
                    $slices.css('opacity', 1);
                    beforeTop = 0;
                    afterTop  = -height;
                    break;

                case 'barUp':
                    beforeTop = height;
                    afterTop  = 0;
                    this._showCurrentItem();
                    break;

                case 'barUpDown':
                    this._showCurrentItem();
                    break;

                case 'barDown':
                default:
                    this._showCurrentItem();
                    beforeTop = -height;
                    afterTop  = 0;
                    break;
            }

            $slices.each(function(i) {
                $(this).css('top', ('barUpDown' == that._effect) ? (i % 2 == 0 ? height : -height) : beforeTop);
            }).each(function() {
                t += speed / that._numBoxes;
                $(this)
                    .delay(t)
                    .animate({
                        top: afterTop,
                        opacity: 1
                    }, speed, function() {
                        that._checkComplete();
                    });
            });
        },

        getClass: function() {
            return 'Coo.Effect.BarUpDown';
        }
    });
})(window.jQuery);
