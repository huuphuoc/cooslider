(function($) {
    /**
     * Use the effect defined in the markup (data-effect attribute)
     */
    Coo.Effect.Markup = Coo.Effect.Default.extend({
        _effects: [],   // {Array} Array of effects created by children elements

        play: function() {
            var that      = this,
                $items    = $(this._nextItem)
                                .find('*')
                                .addBack()
                                .filter('[data-effect]');
            this._effects = [];
            this._done    = 0;

            if ($items.length == 0) {
                // If there are not any elements, just hide the current element and show the next one
                // as Coo.Effect.Default.play() does
                this._super.call(this);
            } else {
                var sameRandomForText = this._slider.getOption('sameRandomEffectForText'),
                    randomEffect      = null;
                $items.each(function() {
                    var effectName = $(this).attr('data-effect');
                    if (sameRandomForText && 'random' == effectName
                        && !$(this).is('img') && ($(this).find('img').length == 0))     // To ensure the element does not contain any image
                    {
                        if (randomEffect == null) {
                            randomEffect = Coo.Effect.factory('random', $(this)).getName();
                        }
                        effectName = randomEffect;
                    }
                    $(this).hide();
                    that._effects.push(Coo.Effect.factory(effectName, $(this))
                                                 .setSlider(that._slider)
                                                 .setCurrentItem(that._currentItem)
                                                 .setNextItem(that._nextItem)
                                                 .setTarget(this));
                });

                var numEffects = this._effects.length,
                    delay      = this._slider.getOption('delay');
                for (var i = 0; i < numEffects; i++) {
                    that._effects[i].setCallbacks({
                        onCompleted: function() {
                            that._done++;
                            if (that._done <= that._effects.length - 1) {
                                that._slider.$element
                                    .stop(true, true)
                                    .delay(delay)
                                    .queue(function() {
                                        that._effects[that._done].play();
                                    });
                            }
                            if (that._done == $items.length) {
                                $(that._currentItem).hide();
                                that._complete();
                            }
                        }
                    });
                }
                $(that._currentItem).hide();
                $(that._nextItem).show();
                this._effects[0].play();
            }
        },

        clean: function() {
            var numEffects = this._effects.length;
            for (var i = 0; i < numEffects; i++) {
                this._effects[i].clean();
            }
            // Don't forget to reset
            this._done    = 0;
            // Get the issue of "Uncaught RangeError: Maximum call stack size exceeded" if I do not reset the array of effects
            this._effects = [];
        },

        getClass: function() {
            return 'Coo.Effect.Markup';
        }
    });
})(window.jQuery);
