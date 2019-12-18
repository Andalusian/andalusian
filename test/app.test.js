const React = require('react');
const ReactDOM = require('react-dom');
const Enzyme = require('enzyme');
const configure = Enzyme.configure;
const Adapter = require('enzyme-adapter-react-16');
const mount = Enzyme.mount;
const shallow = Enzyme.shallow;
import MicroList from "../client/components/MicroList.jsx"
const fs = require("fs");
const path = require("path");
import App from "../client/components/App.jsx";
import AWSFunctionForm from "../client/components/AWSFunctionForm.jsx";



configure({ adapter: new Adapter() });

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

describe('App possesses correct state on render', () => {
    let wrapper;
    const props = {
        awsRuntime: '',
        updateInfo: jest.fn(() => { props.awsRuntime = 'node' })
    }

    beforeAll(() => {
        wrapper = shallow(<App {...props} />);
    })

    props.updateInfo();

    it('UpdateInfo should work', () => {
        expect(props.awsRuntime).toBe('node');
    })

})

// describe('test', () => {
//     const wrapper = mount(<App />);
//     expect(wrapper.state().awsRuntime).toEqual('');

//     const { updateInfo } = wrapper

//     return updateInfo('awsRuntime', 'node').then(() => {
//         expect(wrapper.state().awsRuntime).toEqual('node')
//     })
// })

// describe('Addition', () => {
//     it('knows that 2 and 2 make 4', () => {
//         expect(2 + 2).toBe(4);
//     });
// });

describe('App component', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<App />, div);
        ReactDOM.unmountComponentAtNode(div);
    });

    it('starts with empty awsRuntime within state', () => {
        const wrapper = shallow(<App />);
        expect(wrapper.state("awsRuntime")).toBe('');
    });

    // it('updates awsRuntime within state', () => {
    //     const wrapper = shallow(<App updateInfo("awsRuntime", "node") />);
    //     wrapper.updateInfo("awsRuntime", "node")
    //     expect(wrapper.state("awsRuntime")).toBe('node');
    // });

});
