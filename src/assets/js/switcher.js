/* jquery.switcher - 1.2.4
 * Copyright (c) 2014-11-04 Janic Beauchemin - https://github.com/djanix/ 
 Edited by: aleksandr.kilyakov@gmail.com */

;(function ( $, window, document, undefined ) {
    var pluginName = "switcher";

    var defaults = {
        className: "switcher",
        selected: null,
        language: "en",
        disabled: null,
        style: "default",
        copy: {
            en: {
                yes: '',
                no: ''
            },
            fr: {
                yes: 'oui',
                no: 'non'
            }
        }
    };

    function Plugin(element, options) {
        this.input = element;
        this.container = null;
        this.settings = $.extend({}, defaults, $(element).data(), options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    $.extend(Plugin.prototype, {
        init: function () {
            this.buildHtml(this.input, this.settings);
            this.bindEvents(this.container, this.settings);
        },

        buildHtml: function (input, settings) {
            var self = this;
            var $input = $(input);
            var receive = $input.attr('class');
            var $receive = (receive ? receive.replace(/^switch/, '') : null);

            $input.wrap('<div class="' + settings.className + ' ' + settings.style + ' ' + $receive + '"></div>');
            $input.attr('class','switch');
            $input.after(
                '<div class="content clearfix">' +
                    '<div class="slider">' +
                        '<svg viewBox="0 0 44 44"><path d="M14,24 L21,31 L39.7428882,11.5937758 C35.2809627,6.53125861 30.0333333,4 24,4 C12.95,4 4,12.95 4,24 C4,35.05 12.95,44 24,44 C35.05,44 44,35.05 44,24 C44,19.3 42.5809627,15.1645919 39.7428882,11.5937758" transform="translate(-2.000000, -2.000000)"></path></svg>' + 
                    '</div>' +
                    '<span class="text textYes"></span>' +
                    '<span class="text textNo"></span>' +
                '</div>'
            );

            this.container = $($input).parent('.' + settings.className)[0];

            self.setLanguage(settings.language);
            self.setValue(settings.selected);
            self.setDisabled(settings.disabled);
        },

        bindEvents: function (container, settings) {
            var self = this;
            var $container = $(container);
            var $input =  $container.find('input');

            $container.on('click', function (e) {
                if (settings.disabled) { return; }

                if ($input.attr('type') == 'radio') {
                    self.setValue(true);
                } else {
                    if ($container.closest('label').length) {
                        self.setValue($input.prop("checked"));
                    } else {
                        self.setValue(!$input.prop("checked"));
                    }
                }
            });

            $container.on('swipeleft', function () {
                if (settings.disabled) { return; }
                self.setValue(false);
            });

            $container.on('swiperight', function () {
                if (settings.disabled) { return; }
                self.setValue(true);
            });
        },

        setValue: function (val) {
            var self = this;
            var $input = $(self.input);
            var $container = $(self.container);

            if (val === null) {
                if ($input.attr('type') == 'radio') {
                    val = typeof $input.filter(':checked').val()!=='undefined';
                } else {
                    val = $input.prop('checked');
                }
            }

            if (typeof val != 'boolean') {
                return console.log('The parameter need to be true or false as a boolean');
            }

            self.settings.selected = val;
            $input.prop("checked", val).trigger('change');

            if ($input.attr('type') == 'radio') {
                var name = $input.attr('name');
                var $inputGroup = $('input[name="' + name + '"]');
                var $containerGroup = $inputGroup.parent('.' + self.settings.className);

                if (val === true) {
                    $containerGroup.removeClass('is-active');
                    $inputGroup.prop("checked", false);

                    $container.addClass('is-active');
                    $input.prop("checked", true);
                }
            } else {
                if (val === true) {
                    $container.addClass('is-active');
                } else {
                    $container.removeClass('is-active');
                }
            }
        },

        setDisabled: function (val) {
            var self = this;
            var $input = $(self.input);
            var $container = $(self.container);

            if (val === null) {
                if ($input.attr('disabled')) {
                    val = true;
                } else {
                    val = false;
                }
            }

            if (typeof val != 'boolean') {
                return console.log('The parameter need to be true or false as a boolean');
            }

            self.settings.disabled = val;

            if (val === true) {
                $container.addClass('is-disabled');
            } else {
                $container.removeClass('is-disabled');
            }
        },

        setLanguage: function (language) {
            var self = this;
            var $container = $(self.container);

            self.settings.language = language;

            $container.find('.textYes').text(self.settings.copy[language].yes);
            $container.find('.textNo').text(self.settings.copy[language].no);
        },

        getLanguage: function (callback) {
            var self = this;
            return callback(self.settings.language);
        },

        importLanguage: function (languageObj) {
            var self = this;
            self.settings.copy = languageObj;
        }
    });
    
    $.fn[ pluginName ] = function (options) {
        // http://stackoverflow.com/questions/12880256/jquery-plugin-creation-and-public-facing-methods
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function () {
            var $item = $(this);
            var instance = $item.data("plugin_" + pluginName);


            if (!instance) {
                $item.data("plugin_" + pluginName, new Plugin(this, options));
            } else {
                if(typeof options === 'string') {
                    instance[options].apply(instance, args);
                }
            }
        });

        // return this;
    };

//  SWIPE EVENTS
//  -----------------------------------------------------------------------
    var startX = 0;
    var startY = 0;
    var moving = false;
    var threshold = 30;

    function onTouchEnd() {
        this.removeEventListener('touchmove', onTouchMove);
        this.removeEventListener('touchend', onTouchEnd);
        moving = false;
    }

    function onTouchMove(e) {
        e.preventDefault();

        if (moving) {
            var x = e.touches[0].pageX;
            var y = e.touches[0].pageY;
            var dx = startX - x;
            var dy = startY - y;
            var direction = null;

            if(Math.abs(dx) >= threshold) {
                direction = dx > 0 ? 'left' : 'right';
            } else if (Math.abs(dy) >= threshold) {
                direction = dy > 0 ? 'down' : 'up';
            }

            if(direction) {
                onTouchEnd.call(this);
                $(this).trigger('swipe', direction).trigger('swipe' + direction);
            }
        }
    }

    function onTouchStart(e) {
        if (e.touches.length == 1) {
            startX = e.touches[0].pageX;
            startY = e.touches[0].pageY;
            moving = true;
            this.addEventListener('touchmove', onTouchMove, false);
            this.addEventListener('touchend', onTouchEnd, false);
        }
    }

    function setup() {
        this.addEventListener && this.addEventListener('touchstart', onTouchStart, false);
    }

    $.event.special.swipe = { setup: setup };

    $.each(['left', 'up', 'down', 'right'], function () {
        $.event.special['swipe' + this] = { setup: function(){
            $(this).on('swipe', $.noop);
        } };
    });
//  END SWIPE EVENTS
//  -----------------------------------------------------------------------
$('.switch').switcher({copy: {en: {yes: '', no: ''}}}).on('change', function(){
    var checkbox = $(this);
    if(checkbox.data('link')){
        checkbox.switcher('setDisabled', true);
        $.getJSON(checkbox.data('link') + ((checkbox.data('sublink')) ? '/'+checkbox.data('sublink') : '/') +(checkbox.is(':checked') ? 'on' : 'off') + '/' + checkbox.data('id'), function(response){
            if(response.result === 'error'){
                alert(response.error);
            }
            if(checkbox.data('reload')){
                location.reload();
            }else{
                checkbox.switcher('setDisabled', false);
            }
        });
    }
});
})( jQuery, window, document );