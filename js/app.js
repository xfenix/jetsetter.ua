$(function(){
    var HOVER_MENU_TIME = 500,
        CYCLE_TIMEOUT = 6000;

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
});
