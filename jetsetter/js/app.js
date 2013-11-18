(function(){
    "use strict";

    /* global jq functions */
    $.fn.replaceHtml = function (cnt) {
        var me = this;
        me.hide();
        me.html(cnt);
        me.fadeIn('slow');
    };

    $.fn.replaceSrc = function (src) {
        var me = this;
        me.fadeOut(
            'slow',
            function() {
                me.attr('src', src);
                me.fadeIn('slow');
            }
        );
    };

    // constants + some global functions + fb code
    var HOVER_MENU_TIME = 400,
        CYCLE_CAROUSEL_TIMEOUT = 8000,
        FB_LIKE_WIDTH = 100,
        FB_LIKE_HEIGHT = 21,
        MAX_LOGIN_WIDTH = 100,
        SLIDERS_CYCLE_TIMEOUT = 6000,
        SLIDERS_TIME_SWITCH_RANDOM = true, // add small random to cycle timeout
        SLIDERS_TIME_SWITCH_RANDOM_MAX = 200,
        SLIDERS_TIME_GAP = 1000, // prevent sliders from cycle all at the same time

        getFacebookIframe = function(url) {
            return $('<iframe/>')
                    .attr(
                        'src',
                        'http://www.facebook.com/plugins/like.php?href=' + encodeURI(url) +
                        '&width=' + FB_LIKE_WIDTH + '&height=' + FB_LIKE_HEIGHT +
                        '&colorscheme=light&layout=button_count&action=like&show_faces=false' +
                        '&send=false&appId=272457199470244'
                    )
                    .attr('scrolling', 'no')
                    .attr('frameborder', 0)
                    .attr('allowTransparency', true)
                    .css({
                        'border': 'none',
                        'overflow': 'hidden',
                        'width': FB_LIKE_WIDTH + 'px',
                        'height': FB_LIKE_HEIGHT + 'px',
                    }); 
        },
        isEmpty = function(value) {
            return /^\s*$/.test(value) 
        },
        getRandInt = function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };
    
    $(function(){
        // fix too looooooong user login
        (function() {
            var login = $('.all-head .login-title'),
                width = login.width();
            if(width > MAX_LOGIN_WIDTH) {
                login.hide();
            }
        })();
        
        // hover main menu
        (function(){
            var root = $('.all-menu'),
                links = root.find('.link'),
                subs = root.find('.level2'),
                time = HOVER_MENU_TIME,
                handler = null,
                hide = function(item) {
                    return function() {
                        item.fadeOut();
                    }
                };
            
            links.hover(
                function() {
                    var next = $(this).next();
                    if(next.css('display') == 'none') {
                        subs.hide();
                        clearTimeout(handler);
                        next.fadeIn();
                    }
                },
                function() {
                    handler = setTimeout(hide($(this).next()), time);
                }
            );
            
            subs.hover(
                function() {
                    clearTimeout(handler);  
                },     
                function() {
                    handler = setTimeout(hide($(this)), time);
                }
            );
        })();
        
        // slider
        (function() {
            var root = $('.slider');

            root.each(function(sliderNumber) {
                var localTimeout = SLIDERS_CYCLE_TIMEOUT + (
                        SLIDERS_TIME_SWITCH_RANDOM ? getRandInt(0, SLIDERS_TIME_SWITCH_RANDOM_MAX) : 0
                    ),
                    localRoot = $(this),
                    slides = localRoot.find('.slider-slides'),
                    slidesMove = slides.find('.slider-inf'),
                    slide = slides.find('.slide'),
                    pager = localRoot.find('.slider-pages'),
                    pageLink = pager.find('.page-link'),
                    pageAttr = 'page',
                    pageNow = 'page-now',
                    slideWidth = slides.width(),
                    cycleHandler = null,  
                    slideNow = 0,
                    slideMax = 0,
                    changeSlide = function(direction) {
                        slideNow += direction ? 1 : -1;
                        slideNow  = slideNow < 0 ? slideMax - 1 : slideNow;
                        slideNow  = slideNow >= slideMax ?  0 : slideNow; 
                    },
                    choosePage = function(item, page) {
                        slideNow = item;
                        pageLink.removeClass(pageNow);
                        if(page)
                            page.addClass(pageNow);
                        else
                            pageLink.each(function(i) {
                                 if(i == item)
                                     $(this).addClass(pageNow);
                            });
                    },
                    moveSlider = function() {
                        restartCycle();
                        choosePage(slideNow);
                        slidesMove.animate({left: -slideNow * slideWidth});
                    },
                    cycleSlider = function() {
                        cycleHandler = setInterval(
                            function() {
                                changeSlide(true);
                                moveSlider();
                            },
                            localTimeout
                        );
                    },
                    restartCycle = function() {
                        clearTimeout(cycleHandler);
                        cycleSlider();
                    };

                pageLink.each(function(i) {
                    $(this).data(pageAttr, i);
                    ++slideMax;
                });
                
                pageLink.click(function(e) {
                    choosePage($(this).data(pageAttr));
                    moveSlider();
                    e.preventDefault();
                });

                if(localRoot.hasClass('slider-with-arrows')) {
                    var localArrows = localRoot.find('.slider-arrow'),
                        leftArrow = localRoot.find('.slider-arrow-left .slider-arrow-link'),
                        rightArrow = localRoot.find('.slider-arrow-right .slider-arrow-link');

                    localRoot.hover(
                        function() {
                            localArrows.show();
                        },
                        function() {
                            localArrows.hide();
                        }
                    );

                    leftArrow.click(function(e) {
                        changeSlide(false);
                        moveSlider();
                        e.preventDefault();
                    });

                    rightArrow.click(function(e) {
                        changeSlide(true);
                        moveSlider();
                        e.preventDefault();
                    });
                }
                
                if(sliderNumber > 0)
                    setTimeout(
                        cycleSlider,
                        SLIDERS_TIME_GAP*sliderNumber
                    );
                else
                    cycleSlider();
            })
        })();
        
        // modal
        (function() {
            $('.modal').click(function(e) {
                $('#' + $(this).attr('rel')).modal({
                    onOpen: function (dialog) {
                    	dialog.overlay.fadeIn('fast', function () {
                    		dialog.container.show();
                    		dialog.data.fadeIn('fast');
                    		dialog.data.find('input:first').focus();
                    	});
                    }
                });
                e.preventDefault();
            });
    
            $('body').on(
                'click',
                '.simplemodal-overlay, .popup-registration .cancel',
                function() {
                    $.modal.close();
                }
            );
        })();
        
        // validation
        (function() {
            var submit = $('.submit'),
                forms = $('form');
            
            submit.on(
                'click',
                function() {
                    $(this).closest('form').submit();
                }
            );
            
            forms.on(
                'submit',
                function() {
                    var form = $(this),
                        valid = true;
                    form.find('.error').hide();
                    form.find('input,textarea').each(function(i) {
                       var field = $(this),
                           req = field.attr('required') ? true : false,
                           pattern = field.attr('pattern'),
                           fieldType = field.attr('type'),
                           value = field.val(),
                           localValid = true;
                           
                        if(req) {
                            if(fieldType == 'email') {
                                var re = new RegExp(
                                    "/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)\
                                    +([a-zA-Z0-9]{2,4})+$/"
                                );
                                localValid = re.test(value);
                            }
                            else if(pattern) {
                                var re = new RegExp(pattern);
                                localValid = re.test(value);
                            }
                            else if(isEmpty(value)) {
                                localValid = false;
                            }
                        }
                        
                        if(!localValid) {
                            field.closest('.line').find('.error').show();
                            valid = false;
                        }
                    });
                    return valid;
                }
            );
        })();

        // carousel
        (function() {
            var root = $('.carousel'),
                navLink = root.find('.carousel-link'),
                mainImg = root.find('.carousel-ilu'),
                underHtml = root.find('.carousel-under'),
                nowClass = 'carousel-now',
                preloadRoot = $('<div/>').addClass('preload').hide(),
                cycleHandler = null,
                choose = function(item) {
                    var bigUrl = item.attr('href'),
                        bigImg = item.data('big'),
                        replaceCnt   = item.next().html(),
                        now = $('.' + nowClass);
                    if(now[0] != item[0]) {
                        $('.' + nowClass).removeClass(nowClass);
                        item.addClass(nowClass);
                        mainImg.replaceSrc(bigImg);
                        mainImg.parent().attr('href', bigUrl);
                        underHtml.replaceHtml(replaceCnt);
                    }
                },
                cycle = function() {
                    uncycle();
                    cycleHandler = setInterval(
                        function() {
                            var now = $('.' + nowClass),
                                index = now.data('index'),
                                next = navLink[index + 1];
                            choose(
                                typeof next == 'undefined' ? navLink.first() : $(next)
                            );
                        },
                        CYCLE_CAROUSEL_TIMEOUT
                    );
                },
                uncycle = function() {
                    clearTimeout(cycleHandler);
                    cycleHandler = null;
                };

            if(root.length) {
                // preloading
                $('body').append(preloadRoot);
                navLink.each(function(i) {
                    $(this).data('index', i);
                    preloadRoot.append($('<img/>').attr('src', $(this).data('big')));
                });
                
                // click
                navLink.on(
                    'click',
                    function(e) {
                        choose($(this));
                        cycle();
                        e.preventDefault();
                    }
                );

                $(window).on('load resize scroll', function() {
                    if(root[0].getBoundingClientRect().bottom < 1)
                        uncycle();
                    else
                        if(!cycleHandler)
                            cycle();
                });
            }
        })();
        
        // image hovering
        (function() {
            var ilu = $('.ilu-wrap'),
                cnt = '.ilu-cnt',
                mask = 'ilu-mask',
                show = '.ilu-mask,.ilu-cnt';
                
            ilu.each(function() {
                $(this).append($('<div>').addClass(mask)); 
            });
                
            ilu.hover(
                function() {
                    var el = $(this),
                        cntBox = el.find(cnt);
                    if(isEmpty(cntBox.html()))
                        cntBox.append(
                            getFacebookIframe(cntBox.data('fb'))
                        );
                    el.find(show).show();
                },
                function() {
                    $(this).find(show).hide();
                }
            );
        })();

        // vote slider
        (function() {
            var root = $('.vote-slider'),
                keyDirs = {
                    37: false, // left
                    39: true   // right
                },
                triggerNow = null,
                animateGlobalLock = false,
                globalTriggerKey = 'voteGlobalTrigger',
                uniqueTriggers = [],
                totalSliders = 0;

            root.each(function(i) { 
                totalSliders++;
            });

            // local vote sliders
            root.each(function(i) {
                var localRoot = $(this),
                    wrap = localRoot.find('.vote-wrap'),
                    items = localRoot.find('.vote-item'),
                    inf = localRoot.find('.vote-inf'),
                    links = localRoot.find('.vote-arrow-link'),
                    nowItem = 0,
                    totalItems = 0,
                    totalVisibleItems = 0,
                    totalMinusVisible = 0,
                    itemWidth = 0,
                    uniqueTrigger = globalTriggerKey + i,
                    moveFn = function(dir) {
                        if (animateGlobalLock)
                            return false;
                        nowItem = dir ? nowItem + 1 : nowItem - 1;
                        nowItem = nowItem < 0 ? 0 : nowItem;
                        nowItem = nowItem >= totalMinusVisible ? totalMinusVisible : nowItem;
                        animateGlobalLock = true;
                        inf.animate(
                            {left: -nowItem*itemWidth},
                            function() {
                                animateGlobalLock = false;
                            }
                        );
                    };

                items.each(function(i) {
                    totalItems++;
                    if(i == 0)
                        itemWidth = $(this).width() + parseInt($(this).css('marginRight'));
                });

                totalVisibleItems = Math.ceil(wrap.width() / itemWidth);
                totalMinusVisible = totalItems - totalVisibleItems;

                if(totalItems > totalVisibleItems) {
                    links.show();

                    links.on(
                        'click',
                        function(e) {
                            moveFn($(this).hasClass('vote-link-right') ? true : false);
                            e.preventDefault();
                        }
                    );

                    if(totalSliders > 1) {
                        // events
                        localRoot.hover(
                            function() {
                                triggerNow = uniqueTrigger;
                            },
                            function() {
                                triggerNow = null;
                            }
                        );
                    }

                    uniqueTriggers.push(uniqueTrigger);
                    $(document).on(uniqueTrigger, function(e, dir) { moveFn(dir); });
                }
            });

            // 1 slider => catch all left-right key strokes
            if(totalSliders == 1)
                triggerNow = uniqueTriggers[0];
            $(document).keydown(function(e) {
                if(triggerNow && Object.keys(keyDirs).indexOf(e.which.toString()) > -1)
                    $(document).trigger(triggerNow, [ keyDirs[e.which] ]);
            });
        })();

        // small radio append
        // radio button will work without it, but
        // it's a little easier to work with this
        (function() {
            $('input[type="radio"]').each(function(i) {
                var me = $(this),
                    id = 'radiobutton' + i;
                me.attr('id', id);
                me.next().attr('for', id);
            });
        })();
    });
})();
