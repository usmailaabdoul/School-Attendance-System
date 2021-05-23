import React from 'react'
import { Dropdown } from 'react-bootstrap'

export default function SortButton(props) {
  const { sortBy, onClick } = props;

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
      href="###"
      className="nav-link"
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}{'  '}
      &#x25bc;
    </a>
  ));

  return (
    <Dropdown>
      <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
        Sort
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={() => onClick('present')} active={sortBy === 'present' ? true : false}>Present first</Dropdown.Item>
        <Dropdown.Item onClick={() => onClick('absent')} active={sortBy === 'absent' ? true : false}>Absent first</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}
