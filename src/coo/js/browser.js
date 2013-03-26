(function($) {
    Coo.Browser = {
        /**
         * Checks the current browser is IE or not
         * jQuery 1.9 remove jQuery.browser
         * @return {Number} returns undefined if the current browser is not IE, otherwise returns the version of IE
         * @see http://james.padolsey.com/javascript/detect-ie-in-js-using-conditional-comments
         */
        ie: function() {
            var undef,
                v   = 3,
                div = document.createElement('div'),
                all = div.getElementsByTagName('i');
            while (
                div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
                    all[0]
                );
            return v > 4 ? v : undef;
        }
    };
})(window.jQuery);
