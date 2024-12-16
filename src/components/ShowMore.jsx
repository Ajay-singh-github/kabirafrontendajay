import React from 'react';

const ShowMore = ({ current, total, onShowMore }) => {
  return (
    <div className="flex flex-col items-center py-2">
      <div className="mb-14">
        <p className="text-[#2E2F33] text-center font-inter text-[16px] font-semibold leading-normal">
          Showing {current} of {total} results
        </p>
      </div>
      <div>
        <button
          className="flex w-[192px] h-[56px] px-5 py-2.5 justify-center items-center gap-5 bg-white text-[#2E2F33] rounded-full border border-[#686A74] cursor-pointer text-[16px] font-['Plus Jakarta Sans']"
          onClick={onShowMore}
        >
          {current < total ? 'Show More' : 'Show Less'}
        </button>
      </div>
    </div>
  );
};

export default ShowMore;
