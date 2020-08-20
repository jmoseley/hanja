import React from "react";
import { shallow } from "enzyme";
import LogoutButton from "../LogoutButton";

test("hello world", () => {
  const wrapper = shallow(<LogoutButton />);
  expect(wrapper.text()).toMatch("Log Out");
});
