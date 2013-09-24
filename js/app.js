$.fn.followTo = function (pos) {
    var $this = this,
        $window = $(window);

    $window.scroll(function (e) {
        if ($window.scrollTop() > pos) {
            $this.css({
                position: 'absolute',
                top: pos
            });
        } else {
            $this.css({
                position: 'fixed',
                top: 0
            });
        }
    });
};

$(function(){
    var HOVER_MENU_TIME = 500,
        CYCLE_TIMEOUT = 6000,
        FB_LIKE_WIDTH = 100,
        FB_LIKE_HEIGHT = 21,
        
        isEmpty = function(value) { return /^\s*$/.test(value) };

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
    
    
    (function() {
        var totalHeight = $('.all').outerHeight(true),
            footerHeight = $('.all-foot').outerHeight(true),
            scrollStop = totalHeight - footerHeight,
            items = $('.all-before, .all-after');
        
        items.each(function(i) {
            var me = $(this),
                height = me.height();
            me.followTo(scrollStop - height);
        });
    })();
});
