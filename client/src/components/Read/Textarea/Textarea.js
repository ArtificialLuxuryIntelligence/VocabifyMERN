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
            <p> We don't have enough words to guess your level. </p>
            <h3> Level finder:</h3>
            <p>Click on any word on the page to look up its definition.</p>

            <p>Click "add" to add a word to your vocabulary list.</p>
            <p>
              Add the first words that you see and aren't confident of the
              definition
            </p>
            <p> Please add 5 words to get started.</p>
            <p>
              As you continue to use Vocabify, it will get better at guessing
              the words you don't know.
            </p>
            <p>
              {" "}
              If you know all the words, then feel free to use the search bar to
              add words you have learned recently.
            </p>
            <p>Now hit submit below the following text.</p>
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
        return "English Test . . . . . . . . .\nball \nfall \nmall ";
      case "fr":
        return "French TEST";
      case "es":
        return "Sánchez completará la ronda entre el jueves y el viernes con todas las fuerzas políticas,Sánchez completará la ronda entre el jueves y el viernes con todas las fuerzas políticas,Sánchez completará la ronda entre el jueves y el viernes con todas las fuerzas políticas,Sánchez completará la ronda entre el jueves y el viernes con todas las fuerzas políticas,Sánchez completará la ronda entre el jueves y el viernes con todas las fuerzas políticas,Sánchez completará la ronda entre el jueves y el viernes con todas las fuerzas políticas,Sánchez completará la ronda entre el jueves y el viernes con todas las fuerzas políticas,Sánchez completará la ronda entre el jueves y el viernes con todas las fuerzas políticas,Sánchez completará la ronda entre el jueves y el viernes con todas las fuerzas políticas,Sánchez completará la ronda entre el jueves y el viernes con todas las fuerzas políticas, a cuyos representantes irá de recibiendo en el orden de mayor a menor representación parlamentaria. Con estas reuniones, el presidente del Gobierno persigue “avanzar hacia este gran pacto que permita sentar las bases de la España del día después tras vencer esta pandemia global”. “Tenemos que empezar hoy a construir ya la prosperidad del mañana”, ha asegurado Montero.";
    }
  };
}

export default Textarea;
