import React, { Component } from "react";
// import { Redirect } from "react-router-dom";
// import axios from "axios";
// import auth from "../../utils/auth";

class Textarea extends Component {
  constructor(props) {
    super(props);
    this.state = { value: "" };
  }

  render() {
    return (
      <div>
        <h2>Textarea</h2>
        {this.props.unknownWords.length < 5 && (
          <>
            <p> Language Test:</p>
            <p>Click submit below the following text.</p>
            <p>Click on words you don't know to look up their definition.</p>
            <p>Click "add word" to add this word to your vocabulary list.</p>
            <p> Please add at least 5 words to get started.</p>
            <textarea
              id="textarea"
              value={this.renderText(this.props.lang)}
              onChange={this.handleChange}
              // dont need this
            ></textarea>
          </>
        )}
        {this.props.unknownWords.length >= 5 && (
          <textarea
            id="textarea"
            placeholder="Paste your text here"
            onChange={this.handleChange}
          ></textarea>
        )}
        <button onClick={() => this.props.handleSubmit()}>Submit</button>
      </div>
    );
  }

  //no twoway state binding here. (maybe a better way)
  //need the value to change when dropdown changes lang. (could lift state up to read component i suppose)

  handleChange = (e) => {
    this.setState({ value: e.target.value });
  };
  renderText = (lang) => {
    console.log("render text called");
    console.log(lang);

    switch (lang) {
      case "en":
        return "English Test";
      case "fr":
        return "French TEST";
      case "es":
        return "Sánchez completará la ronda entre el jueves y el viernes con todas las fuerzas políticas, a cuyos representantes irá de recibiendo en el orden de mayor a menor representación parlamentaria. Con estas reuniones, el presidente del Gobierno persigue “avanzar hacia este gran pacto que permita sentar las bases de la España del día después tras vencer esta pandemia global”. “Tenemos que empezar hoy a construir ya la prosperidad del mañana”, ha asegurado Montero.";
    }
  };
}

export default Textarea;
