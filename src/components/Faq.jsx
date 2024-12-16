import React, { useState } from 'react';
import upArrow from '../assets/icons/up-arrow.svg';
import downArrow from '../assets/icons/down-arrow.svg';

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      number: '01',
      question: 'What types of furniture do you offer?',
      answer: 'We offer a wide range of contemporary furniture including sofas, chairs, tables, beds, storage solutions, and outdoor furniture. Our collection is designed to suit modern aesthetics and functional needs.',
    },
    {
      number: '02',
      question: 'Do you offer international shipping?',
      answer: 'No, we do not currently offer international shipping.',
    },
    {
      number: '03',
      question: 'What is your return policy?',
      answer: 'We offer a 10-day exchange policy.',
    },
    {
      number: '04',
      question: 'What payment methods do you accept?',
      answer: 'We accept major credit cards (Visa, MasterCard, American Express), PayPal, and financing options through Affirm. All transactions are secure and encrypted.',
    },
  ];

  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-12 px-6 sm:px-10 lg:px-20">
    <div className="px-4 sm:px-6 lg:px-20">
      <h2 className="text-3xl sm:text-4xl font-plus-jakarta font-semibold text-left mb-10 text-[#2E2F33]">
        We have got the answers to your questions
      </h2>
      {faqs.map((faq, index) => (
        <div key={index} className="mb-6">
          <div
            className="flex items-center py-6 cursor-pointer"
            onClick={() => handleToggle(index)}
          >
            <span className="mr-4 text-center text-xl sm:text-2xl font-inter font-normal text-[#2E2F33]">
              {faq.number}
            </span>
            <span className="ml-4 sm:ml-6 text-lg sm:text-2xl font-plus-jakarta font-medium flex-grow text-[#2E2F33]">
              {faq.question}
            </span>
            <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center bg-[#F8F7FB] rounded-full">
              {activeIndex === index ? (
                <img src={upArrow} alt="Up Arrow" className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <img src={downArrow} alt="Down Arrow" className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </div>
          </div>
          {activeIndex === index && (
            <div className="text-[#5F6980] text-base sm:text-lg font-plus-jakarta font-normal ml-6 sm:ml-12 pt-2">
              {faq.answer}
            </div>
          )}
          <div className="w-full h-px bg-[#D9D9D9] my-6 sm:my-8"></div>
        </div>
      ))}
    </div>
  </section>
  
  );
};

export default Faq;
