(function(){
    var HOVER_MENU_TIME = 400,
        CYCLE_TIMEOUT = 6000,
        FB_LIKE_WIDTH = 100,
        FB_LIKE_HEIGHT = 21,
        MAX_LOGIN_WIDTH = 100,
        GALLERY_STEP = 680,
        WHERE_SHOW_UP_BUTTON = 200,
        RETURN_UP_ANIMATION_TIME = 600,
        
        isEmpty = function(value) { return /^\s*$/.test(value) };
        
        // bottles wrapper
        bottlesFix = (function() {
            var totalHeight = $('body').height(),
                footerHeight = $('.all-foot').outerHeight(true),
                footStop = totalHeight - footerHeight,
                items = $('.all-before, .all-after');
        
            items.each(function(i) {
                var me = $(this),
                    height = me.height();
                me.followTo(footStop - height);
            });
        });
    
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
                hoverClass = 'hover',
                items = root.find('.item'),
                links = root.find('.link, .level2'),
                time = HOVER_MENU_TIME,
                handler = null;

            links.hover(
                function() {
                    clearTimeout(handler);
                    $('.' + hoverClass).removeClass(hoverClass);
                    $(this).parent('.item').addClass(hoverClass);
                },

                function() {
                    var parent = $(this).parent('.item');
                    if(parent.find('.level2').length)
                        handler = setTimeout(
                            function() {
                                parent.removeClass(hoverClass);
                            },
                            time
                        );
                    else
                        parent.removeClass(hoverClass);
                }
            );
        })();
        
        // slider
        (function() {
            var root = $('.slider'),
                slides = root.find('.slider-slides'),
                slidesMove = slides.find('.slider-inf'),
                slide = slides.find('.slide'),
                pager = root.find('.slider-pages'),
                pageLink = pager.find('.page-link'),
                pageAttr = 'page',
                pageNow = 'page-now',
                slideWidth = slides.width(),
                slideNow = 0,
                slideMax = 0,
                cycleHandler = null,
                changeNow = function(direction) {
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
                             if(i == item) {
                                 $(this).addClass(pageNow);
                             }
                        });
                },
                moveSlider = function() {
                    choosePage(slideNow);
                    slidesMove.animate({left: -slideNow * slideWidth});
                },
                cycleSlider = function() {
                    cycleHandler = setInterval(
                        function() {
                            changeNow(true);
                            moveSlider();
                        },
                        CYCLE_TIMEOUT
                    );
                };
            
            pageLink.each(function(i) {
                $(this).data(pageAttr, i);
                ++slideMax;
            });
            
            pageLink.click(function(e) {
                choosePage($(this).data(pageAttr));
                moveSlider();
                clearTimeout(cycleHandler);
                cycleSlider();
                e.preventDefault();
            });
            
            cycleSlider();
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
                                localValid = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(value);
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

        // gallery
        (function() {
            $('.gallery').each(function() {
                var root = $(this),
                    inf = root.find('.gallery-inf'),
                    items = root.find('.ilu'),
                    itemsTotal = 0,
                    itemsNow = 0,
                    titlesNow = root.find('.gallery-title-title'),
                    titlesCount = root.find('.gallery-title-counter .now'),
                    itemsTitles = [],
                    leftLink = root.find('.slider-arrow-left'),
                    rightLink = root.find('.slider-arrow-right'),
                    tmp = 0,
                    changeInfo = function() {
                        titlesCount.html(itemsNow + 1);
                        titlesNow.html(itemsTitles[itemsNow]);
                    },
                    moveFn = function(dir) {
                        tmp = itemsNow;
                        itemsNow += dir ? 1 : -1;
                        itemsNow = itemsNow >= itemsTotal - 1 ? itemsTotal - 1 : itemsNow;
                        itemsNow = itemsNow < 1 ? 0 : itemsNow;
                        if(tmp != itemsNow)
                            inf.animate({
                                    left: -itemsNow*GALLERY_STEP
                                }, 
                                changeInfo
                            );
                    };

                items.each(function() {
                    ++itemsTotal;
                    itemsTitles.push($(this).data('title'));
                });

                leftLink.click(function(e) {
                    moveFn(false);
                    e.preventDefault();
                });

                rightLink.click(function(e) {
                    moveFn(true);
                    e.preventDefault();
                });
            });
        })();
        
        // image hovering
        (function() {
            var fbLikeUrl = function(url) { return "http://www.facebook.com/plugins/like.php?href=" + url + "&width=" + FB_LIKE_WIDTH + "&height=" + FB_LIKE_HEIGHT + "&colorscheme=light&layout=button_count&action=like&show_faces=false&send=false&appId=272457199470244" },
                fbIframe = function(url) { return '<iframe src="' + fbLikeUrl(url) + '" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:100px; height:21px;" allowTransparency="true"></iframe>'; },
                ilu = $('.ilu-wrap'),
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
                        cntBox.html(fbIframe(encodeURI(cntBox.data('fb'))));
                    el.find(show).show();
                },
                function() {
                    $(this).find(show).hide();
                }
            );
        })();

        // scroll up
        (function() {
            var el = $('<a />')
                        .attr('href', '#')
                        .attr('class', 'all-scrollup')
                        .appendTo('body');

            $(document).on('scroll resize', function(){
                if ($(this).scrollTop() > WHERE_SHOW_UP_BUTTON) {
                    el.show();
                } else {
                    el.hide();
                }
            });
     
            $(el).on('click', function(){
                $('html, body').animate({ scrollTop: 0 }, RETURN_UP_ANIMATION_TIME);
                return false;
            });
        })();
        
        bottlesFix();
    });
    
    $(window).load(function() {
        // for chrome mostly
        bottlesFix();
    });
})();