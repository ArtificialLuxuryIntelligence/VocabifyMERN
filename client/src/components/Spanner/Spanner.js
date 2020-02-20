import React from "react";

const Spanner = props => {
  const { randomString } = props;

  if (!randomString) {
    return <p>*Empty entry*</p>;
  }

  //splits text by space and by newline
  return randomString.split(" ").map((stringPart, index) => {
    return (
      <React.Fragment key={index + stringPart.slice(1, 6)}>
        {index === 0 ? null : " "}

        {stringPart.includes("\n") ? (
          stringPart.split("\n").map((part, i) => (
            <>
              {i === 0 ? null : "\n"}
              <span
                className="searchable-word"
                onClick={e => props.handleSpanClick(e)}
              >
                {part}
              </span>
            </>
          ))
        ) : (
          <span
            className="searchable-word"
            onClick={e => props.handleSpanClick(e)}
          >
            {stringPart}
          </span>
        )}
      </React.Fragment>
    );
  });
};

export default Spanner;
