(function($) {
    Coo.Effect = {
        /**
         * Maps the name with the class
         * @type {Object}
         */
        _effects: {},

        /**
         * Maps the class with array of effect names it provides
         * @type {Object}
         */
        _classes: {},

        /**
         * Gets a random effect instance
         *
         * @param {HTMLElement} target The target that the effect plays on
         * @return {Coo.Effect._Base}
         */
        randomize: function(target) {
            var instance = null,
                effects  = Coo.Effect.getEffects(),
                random   = null;

            while (instance == null && effects.length > 0) {
                // Reset
                if ($(target).data('effectInstance')) {
                    $(target).data('effectInstance').reset();
                }

                random   = Coo.Effect._getRandomEffect(effects);
                instance = Coo.Effect.factory(random, target);
                instance.setTarget(target);
                if (instance.support()) {
                    return instance;
                } else {
                    instance = null;
                    effects.splice(effects.indexOf(random), 1);
                }
            }
            return new Coo.Effect.Default('none');
        },

        /**
         * Gets a random effect name
         *
         * @param {Array} effects Effect names
         * @return {String}
         */
        _getRandomEffect: function(effects) {
            // The approach below does not give good random effect because many effect names are provided by the
            // same effect class (Coo.Effect.Css3Animate, for example):
            // return Coo.Effect._getRandomItem(effects);

            // The following random generation, which I think it is better, because it randomizes the effect class first
            var classes = [],   // Array of classes
                clazz   = null;

            for (var i in effects) {
                clazz = Coo.Effect._effects[effects[i]];
                if (classes.indexOf(clazz) == -1) {
                    classes.push(clazz);
                }
            }

            // Get random class first
            clazz = Coo.Effect._getRandomItem(classes);
            // Then get random effect
            return Coo.Effect._getRandomItem(Coo.Effect._classes[clazz]);
        },

        /**
         * Gets a random item of an array
         *
         * @param {Array} a The array
         * @return {Object}
         */
        _getRandomItem: function(a) {
            return (a.length == 1) ? a[0] : a[Math.floor(Math.random() * a.length)];
        },

        /**
         * Get the effects name
         *
         * @return {Array}
         */
        getEffects: function() {
            var names = [];
            for (var name in Coo.Effect._effects) {
                if (names.indexOf(name) == -1) {
                    names.push(name);
                }
            }
            return names;
        },

        /**
         * Checks if an effect is available or not
         *
         * @param {String} effect The effect name
         * @return {Boolean}
         */
        isAvailable: function(effect) {
            return effect && Coo.Effect._effects[effect] != undefined;
        },

        /**
         * Registers an effect class
         *
         * @param {String|Array} names The effect name
         * @param {String} clazz The effect class's name
         */
        register: function(names, clazz) {
            if (!$.isArray(names)) {
                names = [names];
            }
            for (var i in names) {
                if (Coo.Effect._classes[clazz] == undefined) {
                    Coo.Effect._classes[clazz] = [];
                }
                if (names[i] && !Coo.Effect.isAvailable(names[i])) {
                    Coo.Effect._effects[names[i]] = clazz;
                    Coo.Effect._classes[clazz].push(names[i]);
                }
            }
        },

        /**
         * Gets an effect instance by on given name
         *
         * @param {String} effect The effect name
         * @param {HTMLElement} target The target that the effect is played on. It is required when generating a random
         * effect and I need to check the target supports the effect
         * @return {Coo.Effect._Base}
         */
        factory: function(effect, target) {
            switch (true) {
                case ('auto' == effect):
                    return new Coo.Effect.Markup();

                case ('none' == effect):
                    return new Coo.Effect.Default('none');

                case ('random' == effect):
                    return Coo.Effect.randomize(target);

                case (!Coo.Effect.isAvailable(effect)):
                    return new Coo.Effect._Base();

                default:
                    var clazz = Coo.Effect._effects[effect].split('.');
                    if (clazz.length == 1) {
                        return new window[clazz]();
                    } else {
                        var obj = window;
                        for (var i = 0; i < clazz.length; i++) {
                            obj = obj[clazz[i]];
                        }
                        return new obj(effect);
                    }
            }
        }
    };
})(window.jQuery);
