import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

require("jsdom-global")();

// Configure Enzyme with React 16 adapter
Enzyme.configure({ adapter: new Adapter() });
