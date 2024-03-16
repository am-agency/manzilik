/* eslint-disable @typescript-eslint/no-explicit-any */
// Dropdown.tsx
import React, { useEffect, useState } from 'react';
import icons from '../../../../assets/icons';

interface DropdownProps {
  options: any[];
  onSelect: (option: any) => void;
  placeholder?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ options, onSelect, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
  };
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pageClickEvent = (e: any) => {
      // If the active element exists and is clicked outside of
      if (dropdownRef.current !== null && !dropdownRef.current.contains(e.target)) {
        setIsOpen(!isOpen);
      }
    };

    // If the item is active (ie open) then listen for clicks
    if (isOpen) {
      window.addEventListener('click', pageClickEvent);
    }

    return () => {
      window.removeEventListener('click', pageClickEvent);
    };
  }, [isOpen]);

  return (
    <div className="ai-dropdown-container" ref={dropdownRef}>
      <div className="dropdown-selected" onClick={() => setIsOpen(!isOpen)}>
        <p>{selectedOption ? selectedOption : placeholder}</p>
        <img src={isOpen ? icons.arrowUp.icon : icons.arrowDown.icon} alt="arrow" />
      </div>
      {isOpen && (
        <div className="dropdown-options">
          {options.map((option, index) => (
            <div key={index} className="dropdown-option" onClick={() => handleOptionClick(option.slug)}>
              {option.image && <img src={option.image} alt="ai" />}
              <p>{option.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
