import React, { Component } from "react";

const Spanner = props => {
  const { randomString } = props;

  if (!randomString) {
    return;
  }

  return randomString.split(" ").map((stringPart, index) => {
    return (
      <React.Fragment>
        {/* {index === 0 ? null : <span>,</span>} */}
        <span
          key={index}
          className="searchable-word"
          onClick={e => props.handleSpanClick(e)}
        >
          {stringPart}
        </span>
        &nbsp;
      </React.Fragment>
    );
  });
};

export default Spanner;
