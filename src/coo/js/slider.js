/**
 * -----
 * CooSlider, a responsive slider powered by jQuery
 *
 * @author Nguyen Huu Phuoc (thenextcms@gmail.com / @thenextcms)
 * @license MIT
 * -----
 */

// Namespace
window.Coo = {
    VERSION: '1.0.7'    // The current version of Coo Slider
};

// --- Slider ---

(function($) {
    Coo.Slider = Class.extend({
        /**
         * The constructor
         *
         * @param {HTMLElement} element The root slider element
         * @param {Array} options The options
         */
        init: function(element, options) {
            // The default options
            this._defaultOptions = {
                selector: '*',                  // {String} The CSS selector to retrieve all slide items
                                                // By default, it will get all children of the slider node

                // User interface options
                classPrefix: 'coo-slider-',     // {String} The prefix that will be appended at the top to CSS class of
                                                // prev, next, pager, and slide items
                pagination: true,               // {Boolean} Show the pagination or not
                controls: true,                 // {Boolean} Show the prev/next controls or not
                width: null,                    // {Number} The width of slider
                height: null,                   // {Number} The height of slider
                hash: false,                    // {Boolean} Append the ID of current slide item to the end of URL after # character

                // Play options
                randomize: false,               // {Boolean} Show the slide randomly
                autoPlay: true,                 // {Boolean} Setting it to TRUE will start the slider automatically
                interval: 4000,                 // {Number} The number of milliseconds to show each slide
                startAt: 0,                     // {Number|String} The index of starting slide
                                                // Set to:
                                                // - 'first' to run the first slide
                                                // - 'last' to run the last slide
                                                // - 'random' to run random slide
                                                // - 'hash' to start at the slide which ID is defined after # character in the URL
                pauseOnHover: true,             // {Boolean} Pause the slider when hovering on current slide item.
                                                // Resume when user moving the mouse out of the slide

                // Control options
                touch: true,                    // {Boolean} Support touch devices
                keyboard: true,                 // {Boolean} Use the shortcut keys (<-/->) to go to the previous/next slide
                mouseWheel: false,              // {Boolean} Use mouse wheel to navigate the slider
                                                // Requires {@link https://github.com/brandonaaron/jquery-mousewheel} library

                // Responsive options
                responsive: true,               // {Boolean} Support responsive or not
                minWidth: 480,                  // {Number} The text elements will be hidden if the width of slide is smaller than this value

                // Effect options
                effect: 'auto',                 // {String} The effect name.
                                                // Set to:
                                                // - 'random' if you want the effect method is chosen randomly
                                                // - 'auto' to get the effect from the data-effect attribute
                                                // - 'none' to disable
                sameRandomEffectForText: false, // {Boolean} Set it to TRUE if you want to all the text elements use the same random effect as the first one
                animationSpeed: 500,            // {Number} The animation duration in ms
                delay: 400,                     // {Number} The delay time (in ms) between two effects in the same slide
                columns: 10,                    // {Number} The number of columns
                rows: 5,                        // {Number} The number of rows
                circles: 10                     // {Number} The number of circles
            };

            this.$element          = $(element);                                        // The jQuery object represents the root slider element
            this._options          = $.extend({}, this._defaultOptions, options);       // The slide options
            this.$items            = this.$element.children(this._options.selector);    // The array of slide items
            this._numItems         = this.$items.length;                                // The total number of items

            this.$viewPort         = null;                                              // The view port element contains all slide items
            this.$pagination       = null;                                              // Represents the pager
            this.$prevButton       = null;                                              // The Previous button
            this.$nextButton       = null;                                              // The Next button

            this._currentItemIndex = null;                                              // The index of current slide
            this._isPlaying        = false;                                             // Flag to indicate the slider is running
            this._timer            = null;                                              // The timer that shows the slide if it is set for running automatically
            this.width             = options.width;
            this.height            = options.height;

            // Support touch device
            // this._isTouchDevice    = 'ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch;
            this._isTouchDevice    = 'ontouchstart' in document.documentElement;
            this._mouseStartX      = null;
            this._deltaX           = null;
            this._isMouseDown      = false;     // Is mouse down/touched?

            // The effect instance
            this._effectInstance   = null;

            this._init();
        },

        /**
         * Initializes the slider
         */
        _init: function() {
            var that = this;
            this.$element.addClass(this._options.classPrefix + 'slide');

            // Retrieve all items
            if (this._options.randomize) {
                this.$items.sort(function() {
                    return Math.round(Math.random()) - 0.5;
                });
                this.$element.empty().append(this.$items);
            }
            this.$items.addClass(this._options.classPrefix + 'item');

            // Wrap all items in an inner node
            this.$element.wrapInner($('<div/>')
                .addClass(this._options.classPrefix + 'inner')
                .addClass(this._options.classPrefix + 'loading')
            );
            this.$viewPort = this.$element.find('.' + this._options.classPrefix + 'inner');

            // Wait for all images loaded
            var $images      = this.$element.find('img'),
                imagesLoaded = 0;
            $images.each(function() {
                var img = new Image();
                // This is safe way to get the size of image
                $(img)
                    .on('load', function() {
                        imagesLoaded++;
                        that.width  = that.width  || this.width;
                        that.height = that.height || this.height;
                        if (imagesLoaded >= $images.length) {
                            that._completeLoading();
                        }
                    })
                    .attr('src', $(this).attr('src'));
            });

            // Called when the animation completes
            this.$element
                .off('animationCompleted.CooSlider')
                .on('animationCompleted.CooSlider', function() {
                    that._isPlaying = false;
                    // Re-create the timer
                    that._createPlayTimer();
                });
        },

        /**
         * Called when all images are loaded. At that time, the width of height are already determined
         */
        _completeLoading: function() {
            var that = this;
            this.$element.height(this.height * this.$element.width() / this.width);

            // Create the effect instance
            switch (true) {
                case ('random' == this._options.effect):
                    this.$items.each(function() {
                        // var effect = Coo.Effect.randomize(this);
                        // I want to randomize effect every time the slide is shown
                        $(this).attr('data-effect', 'random');
                    });
                    this._effectInstance = new Coo.Effect.Markup('random');
                    break;

                case ('auto' == this._options.effect):
                    this._effectInstance = new Coo.Effect.Markup('auto');
                    break;

                case (Coo.Effect.isAvailable(this._options.effect)):
                    this.$items.attr('data-effect', this._options.effect);
                    this._effectInstance = new Coo.Effect.Markup('auto');
                    break;

                case ('none' == this._options.effect):
                default:
                    this._effectInstance = new Coo.Effect.Default('none');
                    break;
            }
            this._effectInstance.setSlider(this);

            // Remove the loading
            this.$element.find('.' + this._options.classPrefix + 'inner').removeClass(this._options.classPrefix + 'loading');

            // Create the pagination
            if (this._options.pagination) {
                this.$pagination = $('<ol/>')
                    .addClass(this._options.classPrefix + 'pagination')
                    .hide()
                    .appendTo(this.$element);
                this.$items.each(function(i) {
                    var $li = $('<li/>').appendTo(that.$pagination);
                    if (i == that._currentItemIndex) {
                        $li.addClass(that._options.classPrefix + 'active');
                    }
                    $('<a/>')
                        .attr('href', 'javascript: void(0)')
                        .html(i)
                        .data('index', i)
                        .on('click', function() {
                            that._isPlaying = false;            // Force to go to the selected slide
                            that.show($(this).data('index'));
                        })
                        .appendTo($li);
                });
            }

            // Create the prev and next buttons
            if (this._options.controls) {
                this.$prevButton = $('<a/>')
                    .attr('href', 'javascript: void(0)')
                    .addClass(this._options.classPrefix + 'control ' + this._options.classPrefix + 'prev')
                    .hide()
                    .on('click', function() {
                        that.prev();
                    })
                    .appendTo(this.$element);

                this.$nextButton = $('<a/>')
                    .attr('href', 'javascript: void(0)')
                    .addClass(this._options.classPrefix + 'control ' + this._options.classPrefix + 'next')
                    .hide()
                    .on('click', function() {
                        that.next();
                    })
                    .appendTo(this.$element);
            }

            // Create the timer only when all items are loaded completely
            this._createPlayTimer();

            // Allow to use the keyboard
            if (this._options.keyboard) {
                $(document).on('keyup', function(e) {
                    switch (e.keyCode) {
                        case 37:    // left arrow key (<-)
                            that.prev();
                            // Prevent the page scrolling horizontally
                            return false;
                            break;
                        case 39:    // right arrow key (->)
                        case 32:    // Space bar
                            that.next();
                            return false;
                            break;
                        default:
                            break;
                    }
                });
            }

            // Support touch device
            if (this._options.touch && this._isTouchDevice) {
                this.$element.on({
                    'touchstart': function(e) {
                        var pageX = (e.originalEvent.touches[0] || e.originalEvent.changedTouches[0]).pageX;
                        if (that._isMouseDown == false) {
                            that._isMouseDown = true;
                            that._mouseStartX = pageX;
                        }

                        // Show the pager and nav buttons
                        that._showButtons(true);
                        that._showPagination(true);
                    },
                    'touchmove': function(e) {
                        var pageX = (e.originalEvent.touches[0] || e.originalEvent.changedTouches[0]).pageX;
                        if (that._isMouseDown) {
                            // Calculate the distance moved by user's finger
                            that._deltaX = pageX - that._mouseStartX;
                            that.pause();
                        }
                        return false;
                    },
                    'touchend': function(e) {
                        that._isMouseDown = false;
                        // var width = that.$element.width() || that.width;
                        // if (Math.abs(that._deltaX) >= (width / 2 - width * 0.25)) {
                        if (Math.abs(that._deltaX) >= 20) {
                            if (that._deltaX < 0) {
                                // User move/drop the slider to the right
                                that.next();
                            } else {
                                // User move/drop the slider to the left
                                that.prev();
                            }
                        }
                        that._deltaX = 0;

                        // Hide the pager and nav buttons
                        that._showButtons(false);
                        that._showPagination(false);
                        return false;
                    }
                });
            }

            // Use mouse wheel
            if (this._options.mouseWheel) {
                this.$element.on('mousewheel', function(e, delta, deltaX, deltaY) {
                    // I shouldn't go to the prev/next slide because in most case this handler is called many times
                    // when mouse wheel is fired quickly
                    if (that._isPlaying) {
                        return false;
                    }
                    clearInterval(that._timer);
                    if (delta < 0) {
                        that.next();
                    } else {
                        that.prev();
                    }
                    return false;
                });
            }

            // Show the nav buttons and pager when hover the mouse on the slider element
            this.$element.hover(function() {
                that._showButtons(true);
                that._showPagination(true);
                if (that._options.pauseOnHover) {
                    that.pause();
                }
            }, function() {
                that._showButtons(false);
                that._showPagination(false);
                if (that._options.pauseOnHover && that._options.interval > 0) {
                    that._createPlayTimer();
                }
            });

            // Support responsive
            if (this._options.responsive) {
                $(window).on('load resize', function(e) {
                    that._onResize();
                });
            }

            if (that._options.autoPlay) {
                that.start();
            }
        },

        /**
         * Shows/Hides prev/next buttons
         *
         * @param {Boolean} showing TRUE if you want to show buttons
         */
        _showButtons: function(showing) {
            if (this._options.controls) {
                if (showing == false) {
                    this.$prevButton.fadeOut();
                    this.$nextButton.fadeOut();
                } else if (showing && (!this._options.responsive || this.$element.width() > this._options.minWidth)) {
                    this.$prevButton.fadeIn();
                    this.$nextButton.fadeIn();
                }
            }
        },

        /**
         * Shows/Hides pagination
         *
         * @param {Boolean} showing TRUE if you want to show pagination
         */
        _showPagination: function(showing) {
            if (this._options.pagination) {
                showing ? this.$pagination.fadeIn() : this.$pagination.fadeOut();
            }
        },

        /**
         * Creates the timer that show the next slide after given delay time
         */
        _createPlayTimer: function() {
            var that = this;
            if (this._options.interval > 0 && this._numItems > 1) {
                this._timer = setInterval(function() {
                    that.next();
                }, this._options.interval);
            }
        },

        /**
         * Called when resizing the browser.
         * To support responsive design, this method:
         * - Resize the slide items with the same ratio
         * - Hide the text elements when the width of element is smaller than predefined one
         * - Wrap video element into another one
         */
        _onResize: function() {
            var that          = this,
                currentWidth  = this.$element.width(),
                currentHeight = that.height * currentWidth / that.width;

            this.$element.height(currentHeight);
            this.$items.each(function() {
                $(this).height(currentHeight);

                // Hide the text element if the current width is smaller than minWidth
                $(this).children().each(function() {
                    if (!$(this).is('img') && ($(this).find('img').length == 0) && currentWidth < that._options.minWidth) {
                        $(this).hide();
                    } else {
                        $(this).show();
                    }
                });
            });

            // Hide the prev/next buttons when the width of slider is smaller than minWidth
            if (currentWidth < this._options.minWidth) {
                this._showButtons(false);
            }

            // Place the position of prev/next buttons at the middle
            if (this._options.controls) {
                var top = (currentHeight - $(this.$prevButton).height()) / 2;
                this.$prevButton.css('top', top);
                this.$nextButton.css('top', top);
            }

            // Support video elements
            // Inspired from https://github.com/davatron5000/FitVids.js
            var videoSelectors = [
                "iframe[src*='player.vimeo.com']",
                "iframe[src*='www.youtube.com']",
                "iframe[src*='www.dailymotion.com']",
                "iframe[src*='blip.tv']",
                "object",
                "embed"
            ];
            this.$element
                .find(videoSelectors.join(','))
                .each(function() {
                    // Check if it is contained in wrapper element
                    if ('embed' == this.tagName.toLowerCase() && $(this).parent('object').length || $(this).parent('.' + that._options.classPrefix + 'video-wrapper').length) {
                        return;
                    }

                    var height = ('object' === this.tagName.toLowerCase() || ($(this).attr('height') && !isNaN(parseInt($(this).attr('height'), 10))))
                                ? parseInt($(this).attr('height'), 10)
                                : $(this).height(),
                        width  = !isNaN(parseInt($(this).attr('width'), 10))
                                ? parseInt($(this).attr('width'), 10)
                                : $(this).width();

                    $(this)
                        .wrap($('<div/>')
                            .addClass(that._options.classPrefix + 'video-wrapper')
                            .css('padding-top', ((height / width) * 100) + '%')
                        )
                        .removeAttr('height')
                        .removeAttr('width');
                });
        },

        // --- APIs ---

        /**
         * Shows the previous slide
         */
        prev: function() {
            var index = (this._currentItemIndex == 0) ? (this._numItems - 1) : (this._currentItemIndex - 1);
            this._isPlaying = false;    // Force to go to the previous slide, no matter what the current effect completes or not
            this.show(index);
        },

        /**
         * Shows the next slide
         */
        next: function() {
            var index = (this._currentItemIndex == this._numItems - 1) ? 0 : (this._currentItemIndex + 1);
            this._isPlaying = false;
            this.show(index);
        },

        /**
         * Starts playing the slider at predefined position
         */
        start: function() {
            var startAt = this._options.startAt;
            switch (startAt) {
                case 0:
                case 'first':
                    startAt = 0;
                    break;
                case 'last':
                    startAt = this._numItems - 1;
                    break;
                case 'random':
                    startAt = Math.floor(Math.random() * this._numItems);
                    break;
                case 'hash':
                    var hash = window.location.hash;
                    if (hash && hash.length >= 2) {
                        var index = this.$items.index($(hash));
                        startAt   = (index == -1) ? 0 : index;
                    } else {
                        startAt = 0;
                    }
                    break;
                default:
                    break;
            }
            this.show(startAt);
        },

        /**
         * Pauses the slider
         */
        pause: function() {
            clearInterval(this._timer);
            this._timer     = null;
            this._isPlaying = false;
            return this;
        },

        /**
         * Shows slide item at given index, starting from 0
         *
         * @param {Number} index The slide index
         */
        show: function(index) {
            if (this._isPlaying) {
                return;
            }
            this._isPlaying = true;
            clearInterval(this._timer);
            this._timer = null;

            if (this._currentItemIndex == null) {
                // Run the first time
                this._currentItemIndex = index;
                this.$items
                    .eq(index)
                    .addClass(this._options.classPrefix + 'active')
                    .show();
                this.$element.trigger('animationCompleted.CooSlider');
            } else {
                var currSlide = this.$items
                                    .eq(this._currentItemIndex)
                                    .removeClass(this._options.classPrefix + 'active'),
                    nextSlide = this.$items
                                    .eq(index)
                                    .addClass(this._options.classPrefix + 'active');

                // Play the animation
                this._effectInstance.setCurrentItem(currSlide)
                                    .setNextItem(nextSlide)
                                    .setTarget(nextSlide)
                                    .play();

                this._currentItemIndex = index;
            }

            // Update the hash if enabled
            if (this._options.hash) {
                window.location.hash = '#' + (this.$items.eq(index).attr('id') || '');
            }

            // Active the pager
            if (this._options.pagination) {
                this.$pagination
                    .find('li')
                    .removeClass(this._options.classPrefix + 'active')
                    .eq(index)
                    .addClass(this._options.classPrefix + 'active');
            }
        },

        /**
         * Gets the option
         *
         * @param {String} name The option's name
         * @return {String|Object}
         */
        getOption: function(name) {
            return name ? this._options[name] : this._options;
        },

        /**
         * Gets the index of current slide
         *
         * @return {Number}
         */
        getCurrentIndex: function() {
            return this._currentItemIndex || 0;
        },

        /**
         * Gets the effect instance
         *
         * @return {Coo.Effect._Base}
         */
        getEffect: function() {
            return this._effectInstance;
        }
    });

    // Plugin definition
    $.fn.cooslider = function(options) {
        return this.each(function() {
            new Coo.Slider(this, options);
        });
    };
})(window.jQuery);
