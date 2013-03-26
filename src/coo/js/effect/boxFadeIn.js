(function($) {
    /**
     * boxFadeIn effect
     *
     * @since 1.0.3
     */
    Coo.Effect.register('boxFadeIn', 'Coo.Effect.BoxFadeIn');

    Coo.Effect.BoxFadeIn = Coo.Effect._Base.extend({
        _numBoxes: 10,        // {Number} The number of boxes
        _minDiameter: null,

        _setup: function() {
            this._slider.$viewPort.find('.' + this._slider.getOption('classPrefix') + 'clone').remove();

            this._numBoxes = this._slider.getOption('circles') || 10;
            if (Math.round(this._slider.$viewPort.width()) % 2 == 0) {
                this._numBoxes--;
            }
            this._minDiameter = this._slider.$viewPort.width() / this._numBoxes;

            var $img   = $(this._nextItem).is('img') ? $(this._nextItem) : $(this._nextItem).find('img:first'),
                zIndex = 100;
            for (var i = 0; i < this._numBoxes; i++) {
                var width = (i + 1) * this._minDiameter;
                /*
                // I can use the background image approach
                $('<div/>')
                    .css({
                        backgroundImage: 'url(' + $img.attr('src') + ')',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        height: width + 'px',
                        width: width + 'px',
                        opacity: 0,
                        overflow: 'hidden',
                        position: 'absolute',
                        left: (this._slider.$viewPort.width() / 2) - (width / 2),
                        top: (this._slider.$viewPort.height() / 2) - (width / 2),
                        zIndex: zIndex--
                    })
                    .addClass(this._slider.getOption('classPrefix') + 'box')
                    .addClass(this._slider.getOption('classPrefix') + 'clone')
                    .attr('data-box', i)
                    .appendTo(this._slider.$viewPort);
                */

                var $box = $('<div/>')
                    .attr('data-box', i)
                    .addClass(this._slider.getOption('classPrefix') + 'box')
                    .addClass(this._slider.getOption('classPrefix') + 'clone')
                    .css({
                        display: 'block',
                        height: width + 'px',
                        width: width + 'px',
                        opacity: 0,
                        overflow: 'hidden',
                        position: 'absolute',
                        left: (this._slider.$viewPort.width() / 2) - (width / 2),
                        top: (this._slider.$viewPort.height() / 2) - (width / 2),
                        zIndex: zIndex--
                    })
                    .appendTo(this._slider.$viewPort);

                $('<img/>')
                    .attr('src', $img.attr('src'))
                    .css({
                        display: 'block',
                        height: 'auto',
                        width: this._slider.$viewPort.width() + 'px',
                        position: 'absolute',
                        left: -(this._slider.$viewPort.width() / 2) + (width / 2),
                        top: -(this._slider.$viewPort.height() / 2) + (width / 2)
                    })
                    .appendTo($box);
            }
        },

        _animate: function() {
            var that   = this,
                t      = 0,
                speed  = this._slider.getOption('animationSpeed'),
                $boxes = this._slider.$viewPort.find('.' + this._slider.getOption('classPrefix') + 'box');
            this._showCurrentItem();
            $boxes.each(function() {
                t += speed / that._numBoxes;
                $(this)
                    .delay(t)
                    .animate({
                        opacity: 1
                    }, speed, function() {
                        that._done++;
                        if (that._done == that._numBoxes) {
                            that._complete();
                        }
                    });
            });
        },

        clean: function() {
            this._slider.$viewPort.find('.' + this._slider.getOption('classPrefix') + 'clone').remove();
        },

        getClass: function() {
            return 'Coo.Effect.BoxFade';
        },

        getFeatures: function() {
            return ['js'];
        }
    });
})(window.jQuery);
