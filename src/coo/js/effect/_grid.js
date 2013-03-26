(function($) {
    /**
     * Base class for effects that will split the slide into boxes
     */
    Coo.Effect._Grid = Coo.Effect._Base.extend({
        _numBoxes: 0,       // {Number} The number of boxes
        _numRows: 1,        // {Number} The number of rows
        _numColumns: 1,     // {Number} The number of columns

        _createBoxes: function(rows, columns, element) {
            element = element || this._nextItem;
            this._numRows    = rows;
            this._numColumns = columns;
            var boxWidth     = Math.round(this._slider.$viewPort.width() / columns),
                boxHeight    = Math.round(this._slider.$viewPort.height() / rows),
                $img         = $(element).is('img') ? $(element) : $(element).find('img:first');

            this._numBoxes   = rows * columns;

            for (var r = 0; r < rows; r++) {
                for (var c = 0; c < columns; c++) {
                    var $box = $('<div/>')
                        .attr('data-row', r)
                        .attr('data-column', c)
                        .addClass(this._slider.getOption('classPrefix') + 'box')
                        .addClass(this._slider.getOption('classPrefix') + 'clone')
                        .css({
                            display: 'block',
                            height: ((r == rows - 1) ? (this._slider.$viewPort.height() - (boxHeight * r)) : boxHeight) + 'px',
                            width: ((c == columns - 1) ? (this._slider.$viewPort.width() - (boxWidth * c)) : boxWidth) + 'px',
                            opacity: 0,
                            overflow: 'hidden',
                            position: 'absolute',
                            left: (boxWidth * c) + 'px',
                            top: (boxHeight * r) + 'px',
                            zIndex: 1000
                        })
                        .appendTo(this._slider.$viewPort);

                    $('<img/>')
                        .attr('src', $img.attr('src'))
                        .css({
                            display: 'block',
                            height: 'auto',
                            width: this._slider.$viewPort.width() + 'px',
                            position: 'absolute',
                            left: '-' + (boxWidth * c) +'px',
                            top: '-' + (boxHeight * r) +'px'
                        })
                        .appendTo($box);
                }
            }
        },

        _setup: function() {
            var numRows    = this._slider.getOption('rows')    || 5,
                numColumns = this._slider.getOption('columns') || 10;
            this._slider.$viewPort.find('.' + this._slider.getOption('classPrefix') + 'clone').remove();
            this._createBoxes(numRows, numColumns);
        },

        /**
         * Checks if all the animations are done. It might be called by sub-classes
         */
        _checkComplete: function() {
            this._done++;
            if (this._done == this._numBoxes) {
                this._complete();
            }
        },

        clean: function() {
            this._slider.$viewPort.find('.' + this._slider.getOption('classPrefix') + 'clone').remove();
        },

        getClass: function() {
            return 'Coo.Effect._Grid';
        },

        getFeatures: function() {
            return ['js'];
        }
    });
})(window.jQuery);
