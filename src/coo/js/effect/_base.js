(function($) {
    /**
     * Base effect class
     */
    Coo.Effect._Base = Class.extend({
        _effect: null,          // {String} The effect name
        _slider: null,          // {Coo.Slider} The slider instance
        _currentItem: null,     // {HTMLElement} The current slide item
        _nextItem: null,        // {HTMLElement} The next slide item
        _target: null,          // {HTMLElement} The target of animation
        _done: 0,               // {Number} The number of clone elements which complete the animation

        _callbacks: {
            onCompleted: null
        },

        init: function(effect) {
            this._effect = effect;
        },

        setSlider: function(slider) {
            this._slider = slider;
            return this;
        },

        setCurrentItem: function(item) {
            this._currentItem = item;
            return this;
        },

        setNextItem: function(item) {
            this._nextItem = item;
            if (this._target == null) {
                this._target = item;
            }
            return this;
        },

        setTarget: function(element) {
            this._target = element;
            $(this._target).data('effectInstance', this);
            return this;
        },

        setCallbacks: function(callbacks) {
            this._callbacks = $.extend(this._callbacks, callbacks);
            return this;
        },

        getName: function() {
            return this._effect;
        },

        /**
         * Plays the animation
         */
        play: function() {
            this._setup();
            this._animate();
        },

        /**
         * Cleans the effect after the effect animation completes. The timeouts should be removed here
         */
        clean: function() {
            // Overridden by the sub-class
        },

        /**
         * Does the things that the animation need. Creating dynamic elements should be done here
         */
        _setup: function() {
            // Overridden by the sub-class
        },

        /**
         * Does the animation
         */
        _animate: function() {
            // Overridden by the sub-class
        },

        /**
         * Should be called when all animations complete
         */
        _complete: function() {
            this.clean();

            $(this._currentItem).hide();
            $(this._target).show();

            if (this._callbacks['onCompleted']) {
                this._callbacks['onCompleted'].call(this);
            } else {
                this._slider.$element.trigger('animationCompleted.CooSlider', this);
            }
        },

        /**
         * Shows the current item.
         * If I show the current item using $(this._currentItem).show(), maybe
         * the child element will show its animation (CSS3 animation, for example).
         * So, I have to reset all animations in current element first.
         *
         * @param {String} selector The selector to define the child elements going to be shown
         */
        _showCurrentItem: function(selector) {
            $(this._currentItem)
                .find('[data-effect]')
                .addBack()
                .each(function() {
                    var effect = $(this).data('effectInstance');
                    if (effect instanceof Coo.Effect._Base) {
                        effect.reset();
                    }
                });
            if (null == selector) {
                $(this._currentItem).show();
            } else {
                $(this._currentItem)
                    .children()
                        .hide()
                        .end()
                    .find(selector)
                    .addBack()
                    .show();
            }
        },

        /**
         * Resets the effect
         */
        reset: function() {
            // Overridden by the sub-class
        },

        /**
         * Reset all effects created by the slider on all elements.
         * Currently, it is used for the demo when user switch to other effect
         */
        resetAll: function() {
            this._slider.$element
                .find('[data-effect]')
                .each(function() {
                    var effect = $(this).data('effectInstance');
                    if (effect instanceof Coo.Effect._Base) {
                        effect.reset();
                    }
                });
        },

        /**
         * Gets the class of effect. Useful for debugging
         *
         * @return {String}
         */
        getClass: function() {
            // Overridden by the sub-class
            return 'Coo.Effect._Base';
        },

        /**
         * Gets features that indicate that the effect uses CSS3 or normal Js
         *
         * @return {Array}
         */
        getFeatures: function() {
            // Overridden by the sub-class
            return [];
        },

        /**
         * Checks if it is possible to play the animation or not
         *
         * @return {Boolean}
         */
        support: function() {
            return (this._supportByBrowser() && this._supportByTarget());
        },

        /**
         * Checks if the current browser supports the effect or not
         *
         * @return {Boolean}
         */
        _supportByBrowser: function() {
            // Overridden by the sub-class
            return true;
        },

        /**
         * Checks if the current target supports the effect or not
         *
         * @return {Boolean}
         */
        _supportByTarget: function() {
            // Overridden by the sub-class
            // Most effects requires the target element is an image or has to contain at least one image
            if (this._target) {
                return $(this._target).is('img') || !!($(this._target).find('img').length > 0);
            }
            return true;
        }
    });
})(window.jQuery);
