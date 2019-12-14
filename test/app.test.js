const React = require('react');
const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

const App = require("../client/components/App.jsx");
// const updateInfo = require("../client/components/App");
// afterAll(() => {
//     wrapper = shallow({...this.state});
// });

test("Updates this.state.awsRuntime to nodejs10.x", () => {
    expect(App.updateInfo("awsRuntime", "nodejs10.x")).toBe("nodejs10.x")
})

// describe('#updateInfo', () => {
//     it('Updates this.state.awsRuntime to nodejs10.x', () => {
//         const result = App.updateInfo("awsRuntime", "nodejs10.x");
//         expect(result).not.toBeInstanceOf(Error);
//         expect(result).toEqual("nodejs10.x");
//     })
// })

// describe('Addition', () => {
//     it('knows that 2 and 2 make 4', () => {
//         expect(2 + 2).toBe(4);
//     });
// });