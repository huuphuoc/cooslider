# CooSlider, a responsive jQuery slider #

Developed by Nguyen Huu Phuoc
* thenextcms@gmail.com
* @thenextcms

(c) 2013 APL Solutions

## Releases ##

### v1.0.7 ###

### v1.0.6 (Released on 18th, Feb 2013) ###
- Added: grunt build script
- Added #24: Add 'hash' option allowing to show the given slide based on the location hash
- Added #27: Register effect class by using Coo.Effect.register() method
- Changed: Renamed "autoplay" option to "autoPlay"
- Changed: Renamed "mousewheel" option to "mouseWheel"
- Enhanced #29: Make random effect generation better, more randomly
- Enhanced #33: Random effect every time the slide is shown when setting effect to 'random'
- Enhanced #35: Use jQuery.delay() instead of setTimeout() to make the effect run more smoothly
- Fixed #18: that._numBoxes is undefined in BlindHorizontal effect
- Fixed #28: Setting data-effect="random" does not work for image element in v1.0.5

### v1.0.5 (Released on 07th, Feb 2013) ###
- Added: Support jQuery 1.9.0
- Added #9: Compressed version
- Added #16: Allow to use the same random effects for all text elements by setting sameRandomEffectForText to TRUE
- Added #17: Add new option: delay, defines the delay time between effects in the same slide item
- Changed: Rename the "delay" option to "interval"
- Fixed #10: 'that' is undefined  jquery.slider.js, line 1001 character 21
- Fixed #12: Hide the images wrapped in other elements in responsive mode
- Fixed #13: Hide the prev/next buttons when the width of slider is smaller than minWidth
- Fixed #14: Place the position of prev/next buttons at the middle
- Fixed #15: [FF] The CSS3 effect does not play from the second time

### v1.0.4 (Released on 04th, Feb 2013) ###
- Added: Allow to use random effect by setting data-effect="random"
- Fixed #1: Turning off pagination and controls causes error
- Fixed #5: Cannot go to other slide when clicking on pagination
- Fixed #6: Conflicting with Prototype library (Uncaught TypeError: Object [object Object] has no method '_reverse')
- Fixed #7: Go to the next slide when the space bar is pressed
- Fixed #8: The responsive does not work

### v1.0.3 (Released on 28th, Jan 2013) ###
- Added: [Demo] Show the next slide when switching to other effect
- Added: New effects includes barDownSymmetry, boxFadeIn, glass, glassReverse
- Changed: sliceDownLeft, sliceDownRight, sliceUpLeft, sliceUpRight, sliceUpDownLeft, sliceUpDownRight effects are removed

### v1.0.2 (Released on 26th, Jan 2013) ###
- Added: barDown, barDownReverse, barUp, barUpDown, barUpDownSymmetry, blindHorizontal, boxInOut, boxSpiral,
boxSpiralReverse, boxTopBottom, cut, slap, slideDown, slideUp, swap effects
- Added: Use window.jQuery to allow using $ namespace
- Changed: Rename effects: fold => blind, slideInLeft => slideLeft, slideInRight => slideRight, swirlFadeIn => circleFadeIn, swirlFadeOut => circleFadeOut
- Enhanced: Play the animations in order of associating elements in each slide item. By doing that, the text element using CSS 3 animation can be shown as expected
- Fixed: [Demo] Fix the issue that the slider does not reset the CSS 3 animation

### v1.0.1 (Released on 23th, Jan 2013) ###
- Added: Options for showing/hiding the controls and pagination
- Added: Create the effect base class. New effect can extend from some built-in base classes
- Added: boxRain, boxRainReverse, boxRainGrow, boxRainGrowReverse, boxRandom, fold, sliceDownLeft,
sliceDownRight, sliceUpLeft, sliceUpRight, sliceUpDownLeft, sliceUpDownRight, slideInLeft, slideInRight, swirlFadeIn,
swirlFadeOut effects
- Added: [Demo] The demonstration provides the ability of choosing given effect
- Changed: Remove thumbnail generator option

### v1.0.0 (Released on 16th, Jan 2013) ###
- Basic slider with pager, previous and next buttons
- Support responsive, including image and video elements
- Hide text elements if the width of slider is smaller than predefined one
- Provide a built-in thumbnail generator (requires PHP)
- CSS 3 animation. The animation effect can be set using markup (data-animate attribute) or is generated randomly
- Support touch device
- Can use keyboard, mouse wheel to navigate the slider