import React, { Component } from "react";

class Textarea extends Component {
  constructor(props) {
    super(props);
    this.state = { value: "" };
  }

  render() {
    return (
      <div>
        {/* <h2>Textarea</h2> */}
        {this.props.unknownWords.length < 5 && (
          <>
            <p> We don't yet have enough words to estimate your level. </p>
            <h3> Level finder:</h3>
            <p> Read the following then click submit below</p>
            <ul>
              <li>
                <p>
                  Click on any word (including in definitions) to look up its
                  definition.
                </p>
              </li>
              <li>
                <p>
                  Click "add" to add a word to your personal vocabulary list.
                  You can see these words in 'Account'.
                </p>
              </li>

              <li>
                <p> Please add 5 words to get started.</p>
              </li>
              <li>
                <p>
                  As you continue to use Vocabify, it will get better at
                  guessing the words you don't know.
                </p>
              </li>
              <li>
                <p>
                  If you know all the words listed, then feel free to use the
                  search bar to add words you have learned recently.
                </p>
              </li>
            </ul>

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
        return "to\nfather\nidea\nwrong\nhere\nadvantage\nback\npolicy\ndoors\nearnest\nbelonging\nintelligent\nrelative\nlimbs\nmodest\ndistinguish\nstraw\ncorresponding\ndifferences\nsailing\ndeepest\nbriefly\nlegitimate\nlingered\ncanal\ntrials\nsplendor\nexpected\nmarried\nsteps\ncovenant\nexerted\nencamped\nsuppose\nmistaken\nspies\nlogin\nfuss\nparents\nransom\nanimation\noccurring\nchivalrous\nrichness\nsolar\npuff\nforgets\nestablished\nslain\ntub\ncomposition\nescaped\neclipse\nfeasible\nprecocious\nhorrible\nirreconcilable\ngable\ncruising\nshielded\nwildly\npews\npersecution\nweariness\nplacard\npleadings\ncoverings\ndisposes\nburglars\ndefaced\nsatirist\natomic\nchemistry\nstrongly\ntwirling\npromoters\napathetic\nstockholders\naverting\nwaistcoat\nnumbed\nsisterhood\ngrips\nflints\nporches\npistolet\ntank\nevasively\nventral\ngrinning\ncommingled\ndoers\nceremonials\npretext\nchapeaux\nquicksand\nprompter\nidyl\napposition\nakimbo\nobliterating\nlonga\ndisentangled\nsenator\nabominable\nhandmaiden\nsickens\ninfants\nmong\nflip\ncape\nuncorrupted\npeacefully\nlymphatic\nthumps\nfigment\nsuperseding\nsuits\nporteurs\nbanquette\nassassinations\ntemperately\ndénouement\nunfathomed\nbathos\npaneled\nimmutability\nmeesters\nto\noverbalance\nunction\ncrag";
      case "fr":
        return "pas\nparle\npenser\nmillions\nflic\nsouvenir\nweek-end\nfac\nheu\nprof\nballon\nconduite\npersonnelle\nbe\ncapacité\nprotocole\ntournage\nracheter\ncrétins\ntables\nimmatriculation\ntendue\némotionnel\ncoffre-fort\ncaleçon\nsincères\nclip\ngains\ntrafiquants\ndisciple\nrédiger\nbide\ncompatible\nmacho\nbuisson\nréciter\nbranlette\nroches\ntige\nmutants\nlatine\nécuries\npomper\ncommandements\nisolation\nsexiste\nélixir\nespérances\nmixte\ninfrastructure\nlasser\nloyers\nautos\nentourer\ngriffé\nfonte\nopportuniste\nforeuse\nmyrtille\nnaïfs\néventuels\nabrège\ndéveloppés\ndecide\napôtre\nled\napparaitre\nneurochirurgie\ngodasses\ndorloter\nbronzée\ninjure\narbitres\ntchèques\nlift\nnuisette\nsmoothies\nrâleur\nmassé\ndês\npropension\ndiminuée\ndégoutante\ncharitables\naudiovisuel\nbichonner\ntimon\npestes\nchronométrer\néconomiquement";
      case "es":
        return "a\ncampo\ntrago\ntardes\nmensajes\nadonde\nalternativa\nsolar\nexámenes\ncontratar\nespiritual\ncarmen\nposiciones\nliras\nartificiales\nespeluznante\ncuñada\ndifunto\ncálido\nadministrador\nsuero\nmapas\nsugerir\npezones\ndiálogo\nmicrófonos\ncangrejos\nmagnético\ninvasores\nmacarrones\nametralladoras\ndictador\nretorcida\ninformático\nmendigos\nsociedades\nmetropolitana\nremera\ndisparada\nhematoma\ncamarón\ncolapsó\ndelicadas\nemisario\nespecular\ntoga\nsofisticados\npanes\ndesempacar\nacumulación\ninmensamente\ntelégrafo\nrobles\ninformativa\nbayoneta\nfajo\nfifi\nhurón\nbudistas\nindiscutible\nbulevar\ninexplicables\ninvicto\nvainas\nsuperas\nnegociado\nguisado\nsiameses\nirónica\nalineado\ninvertida\nbaldes\nbocanada\ntorcidos\nenriquecido\npropensos\nrepostería\ncreadora\nharagán\nrenegociar\nbaladas\nexportaciones\npesimismo\nintuitiva\nbeberse\nreforzada\nafinado\ncalcomanías\npopurrí";
      default:
        break;
    }
  };
}

export default Textarea;
