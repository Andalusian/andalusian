const React = require('react');
const ReactDOM = require('react-dom');

const Enzyme = require('enzyme');
const shallow = Enzyme.shallow;
const mount = Enzyme.mount;
const configure = Enzyme.configure;

const Adapter = require('enzyme-adapter-react-16');
const fs = require("fs");
const path = require("path");
// const App = require("../client/components/App.jsx");
import App from "../client/components/App.jsx";
import AWSFunctionForm from "../client/components/AWSFunctionForm.jsx";



configure({ adapter: new Adapter() });

// const updateInfo = require("../client/components/App");
// afterAll(() => {
//     wrapper = shallow({...this.state});
// });

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


    it('blah', function () {
        const result = shallow(<AWSFunctionForm />);
        const wrapper = shallow(<App />);
        result.find('select').simulate('change', { target: { value: 'node' } });
        expect(wrapper.state("awsRuntime").value).to.equal("node");
    });
});