import React from "react";

const Spanner = (props) => {
  const { randomString } = props;

  if (!randomString) {
    return <p>*Empty entry*</p>;
  }

  //splits text by space and by newline
  return randomString.split(" ").map((stringPart, index) => {
    return (
      // <React.Fragment key={index}>
      <React.Fragment key={index + stringPart}>
        {index === 0 ? null : " "}

        {stringPart.includes("\n") ? (
          stringPart.split("\n").map((part, i) => (
            <React.Fragment key={i + stringPart}>
              {i === 0 ? null : "\n"}
              <span
                className={`searchable-word ${
                  props.wordHeading ? props.wordHeading : ""
                }`}
                onClick={(e) => props.handleSpanClick(e)}
              >
                {part}
              </span>
            </React.Fragment>
          ))
        ) : (
          <span
            // key={index}
            className={`searchable-word ${
              props.wordHeading ? props.wordHeading : ""
            }`}
            onClick={(e) => props.handleSpanClick(e)}
          >
            {stringPart}
          </span>
        )}
      </React.Fragment>
    );
  });
};

export default Spanner;
