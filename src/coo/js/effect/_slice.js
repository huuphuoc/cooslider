(function($) {
    /**
     * Base class for slice effects
     */
    Coo.Effect._Slice = Coo.Effect._Grid.extend({
        _setup: function() {
            this._slider.$viewPort.find('.' + this._slider.getOption('classPrefix') + 'clone').remove();
            // Always create 1-row boxes
            this._createBoxes(1, this._slider.getOption('columns') || 10);
        },

        getClass: function() {
            return 'Coo.Effect._Slice';
        }
    });
})(window.jQuery);
