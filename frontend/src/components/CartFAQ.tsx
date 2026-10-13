import React, { useState } from 'react';

interface CartFAQProps {
  readonly title: string;
  readonly content: string;
}

function CartFAQ({ 
  title = "Lorem ipsum", 
  content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." 
}: CartFAQProps) {
  const [isOpen, setIsOpen] = useState(false); 

  const toggleContent = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="faq-item">
      <div 
        className="d-flex justify-content-between align-items-center cursor-pointer"
        onClick={toggleContent}
        style={{ cursor: 'pointer' }}
      >
        <p className="mb-2 pb-2 fs-5">{title}</p> 
        
        <p className="fs-3 fw-semibold mb-2 pb-2">
          {isOpen ? '-' : '+'}
        </p>
      </div>
      
      {isOpen && (
        <p className="text-muted pb-3 faq-content">
          {content}
        </p>
      )}

      <div className='border-bottom border-dark-subtle'>
      </div>
      
    </div>
  );
}

export default CartFAQ;