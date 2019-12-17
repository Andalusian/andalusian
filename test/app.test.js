const React = require('react');
const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
const mount = Enzyme.mount;
const shallow = Enzyme.shallow;
import App from "../client/components/App.jsx";
import AWSFunctionForm from "../client/components/AWSFunctionForm.jsx";
import MicroList from "../client/components/MicroList.jsx"

// configure({ adapter: new Adapter() });

// const updateInfo = require("../client/components/App");
// afterAll(() => {
//     wrapper = shallow({...this.state});
// });

// test("Updates this.state.awsRuntime to nodejs10.x", () => {
//     expect(App.updateInfo("awsRuntime", "nodejs10.x")).toBe("nodejs10.x")
// })

describe('Deploy tester', () => {
    it('Create Function Should Trigger on Click', () => {
        const props = {createFunction: jest.fn(() => {return})}
        const component = shallow(< AWSFunctionForm {...props}/>)

        component.find('#createFuncBtn').simulate('click');

        expect(props.createFunction).toHaveBeenCalled();
    });

    it('Toggling Radio button updates state', () => {
        const props = {updateInfo: jest.fn(() => {return})}
        const wrapper = shallow(<MicroList {...props}/>)

        wrapper.find('#googleRadio').simulate('change');

        expect(props.updateInfo).toHaveBeenCalled()
    })
});

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
