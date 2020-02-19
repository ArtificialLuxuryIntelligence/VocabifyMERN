import React from "react";

const Spanner = props => {
  const { randomString } = props;

  if (!randomString) {
    return <p>*Empty entry*</p>;
  }

  return randomString.split(" ").map((stringPart, index) => {
    return (
      <React.Fragment key={index}>
        {/* {index === 0 ? null : <span>,</span>} */}
        <span
          className="searchable-word"
          onClick={e => props.handleSpanClick(e)}
        >
          {stringPart + " "}
        </span>
      </React.Fragment>
    );
  });
};

export default Spanner;
