// when using sencha touch's swipe event, the view(screen) will scroll most time at the same time.
// By adding this sniipet to the view's listeners will fix it.

listeners: {
    element:'element',
    touchstart: function  (e) {
        this.startX = e.pageX,
        this.startY = e.pageY,
        this.moveTimes = 0;
        console.log('touch start....');
    },
    touchmove: function  (e) {
        var deltaX,deltaY;
        if (this.moveTimes++ < 6) {
            deltaX = Math.abs(e.pageX - this.startX),
            deltaY = Math.abs(e.pageY - this.startY);
            if (deltaX > 8 * deltaY && deltaY < 5 && deltaX > 8){
                this.setScrollable(false);
                this.swiped = true;
            }
        }
    },
    touchend: function  (e) {
        if (this.swiped) {
            console.log('swiped');
            this.swiped = false;
        }
        this.moveTimes = 0;
        this.setScrollable(true);
        console.log('touch end');
    }
}
