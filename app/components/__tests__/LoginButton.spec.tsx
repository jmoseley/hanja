import React from 'react';
import { shallow } from 'enzyme';
import LoginButton from '../LoginButton';

test('hello world', () => {
  const wrapper = shallow(<LoginButton />);
  expect(wrapper.text()).toMatch('Log In');
});
