import React, { useState, FunctionComponent } from 'react';

export interface Props {
  onSubmit: (name: string) => Promise<void>;
}

const NewTodo: FunctionComponent<Props> = (props) => {
  const [name, setName] = useState('');

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (name !== '') {
      setName('');
      props.onSubmit(name);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          New:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default NewTodo;
