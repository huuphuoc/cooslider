(function($) {
    /**
     * Base class for effects creating circles
     */
    Coo.Effect._Circle = Coo.Effect._Base.extend({
        _numCircles: 10,        // {Number} The number of circles
        _minDiameter: null,

        _createCircles: function(element) {
            this._slider.$viewPort.find('.' + this._slider.getOption('classPrefix') + 'clone').remove();

            this._numCircles = this._slider.getOption('circles') || 10;
            if (Math.round(this._slider.$viewPort.width()) % 2 == 0) {
                this._numCircles--;
            }
            this._minDiameter = this._slider.$viewPort.width() / this._numCircles;

            var $img   = $(element).is('img') ? $(element) : $(element).find('img:first'),
                zIndex = 100;
            for (var i = 0; i < this._numCircles; i++) {
                var width = (i + 1) * this._minDiameter;
                // Use backgroundSize property to set the size of background image
                $('<div/>')
                    .css({
                        backgroundImage: 'url(' + $img.attr('src') + ')',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: this._slider.$viewPort.width() + 'px ' + this._slider.$viewPort.height() + 'px',
                        height: width + 'px',
                        width: width + 'px',
                        opacity: 0,
                        overflow: 'hidden',
                        position: 'absolute',
                        left: (this._slider.$viewPort.width() / 2) - (width / 2),
                        top: (this._slider.$viewPort.height() / 2) - (width / 2),
                        zIndex: zIndex--
                    })
                    .addClass(this._slider.getOption('classPrefix') + 'circle')
                    .addClass(this._slider.getOption('classPrefix') + 'clone')
                    .attr('data-circle', i)
                    .appendTo(this._slider.$viewPort);
            }
        },

        clean: function() {
            this._slider.$viewPort.find('.' + this._slider.getOption('classPrefix') + 'clone').remove();
        },

        getFeatures: function() {
            return ['css3'];
        },

        getClass: function() {
            return 'Coo.Effect._Circle';
        },

        _supportByBrowser: function() {
            // backgroundSize is not supported in IE8 and earlier
            var ie = Coo.Browser.ie();
            return (ie == undefined || ie >= 9);
        }
    });
})(window.jQuery);
