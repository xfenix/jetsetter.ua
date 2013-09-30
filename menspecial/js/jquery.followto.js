$.fn.followTo = function (pos) {
    var $this = this,
        $window = $(window),
        $hbody = $('html,body'),
        fix = function(e) {
            if ($window.scrollTop() > pos) {
                $hbody.css('overflowX', 'hidden');
                $this.css({
                    position: 'absolute',
                    top: pos
                });
            } else {
                $hbody.css('overflowX', '');
                $this.css({
                    position: 'fixed',
                    top: 0
                });
            }
        };
    
    $window.scroll(fix);
};
