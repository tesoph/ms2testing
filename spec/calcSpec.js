describe('Testing the sketch', () => {
    var myp5;

    beforeEach(function () {
        myp5 = new p5(sketch);
    });

    it('should change the background color', () => {
        let color = "white";
        expect(myp5.changeBackgroundColor(color)).toBeDefined();
        color = "green";
        expect(myp5.changeBackgroundColor(color)).toBeFalse();
    })

    it('should resize canvas when window is resized and initialise new attractor and movers according to new canvas size', () => {
        myp5.windowResized(100, 100);
        expect(myp5.w).toBe(100);
        expect(myp5.a.location.x).toBe(50);
        myp5.windowResized("1z", "d");
        expect(myp5.w).toBe(200);
    })
})