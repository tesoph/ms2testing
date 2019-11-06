
describe('JavaScript addition operator', function () {
    it('adds two numbers together', function () {
        expect(1 + 2).toEqual(3);
    });
});/*
describe('Change background and stroke color function', function () {
    it('changes the background color and stroke color', function () {
        expect(1 + 2).toEqual(3);
    });
});*/
/*
describe("Sketch", function() {

    beforeEach(function() {
    //    p = new sketch;
    });
    var sketch;
    var p = new p5(sketch, document.getElementById("sketch-container"));

    describe("changeBackgroundColor", function() {
        it("should s", function() {
         // //  calc.add(20);
          //  calc.add(22);
          //  expect(calc.value).toBe(42);
          expect(p.changeBackgroundColor("white")).toBe(true);
        });
     p.changeBackgroundColor = function (bgCol_) {
        if (bgCol_ === "white") {
            p.backgroundColor = p.color(255, 255, 255, 5);
            p.strokeColor = p.color(0, 0, 0);
        } else if (bgCol_ === "black") {
            p.backgroundColor = p.color(0, 0, 0, 5);
            p.strokeColor = p.color(255, 255, 255);
        }
    }
    });
});*/
describe('Testing the functionality, this is the checklist', ()=>{
    it('should add an item', ()=>{

    
    let myp = new p5(sketch);
    let backgroundColor="white";
      expect(myp.changeBackgroundColor(backgroundColor)).toBe(true);
     // const done = todo.addTodo(item)
    //  expect(todo.getItems().length).toBe(1);
    })
  })