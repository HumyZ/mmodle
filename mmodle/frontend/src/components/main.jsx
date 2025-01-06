import React from 'react';
import { api_getUsername, api_guess, api_newgame } from './api';
import ReactDOM from 'react-dom/client';
import "../index.css";


//Header class
class Header extends React.Component {
  constructor(props) {
    super(props);
  }
  renderActiveClass = (sectionName) => {
    return this.props.activeSection === sectionName ? 'ui_active' : '';
  }

  render() {

    return (
      <header>
        <nav>
          <span className="alignleft"></span>
          <span className="aligncenter">
            <a id="home" name="ui_home" onClick={this.props.clickHandler} className={`ui_menu ${this.renderActiveClass('ui_home')}`} style={{ fontSize: "x-large", textDecoration: "underline", display: "inline-block" }} >MMODLE</a>
          </span>
          <span className="alignright">
            <a onClick={this.props.clickHandler} name="ui_username" className={this.renderActiveClass('ui_username')}><span id="user" className="material-symbols-outlined ui_menu"> person </span></a>
            <a onClick={this.props.clickHandler} name="ui_play" className={this.renderActiveClass('ui_play')}><span id="play" className="material-symbols-outlined ui_menu"> play_circle </span></a>
            <a onClick={this.props.clickHandler} name="ui_stats" className={this.renderActiveClass('ui_stats')}><span id="stats" className="material-symbols-outlined ui_menu"> leaderboard </span></a>
            <a onClick={this.props.clickHandler} name="ui_instructions" className={this.renderActiveClass('ui_instructions')}><span id="help" className="material-symbols-outlined ui_menu"> help </span></a>
          </span>
        </nav>
      </header>
    );
  }
}

//Home class
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderActiveClass = (sectionName) => {
    return this.props.activeSection === sectionName ? 'ui_active' : '';
  }

  render() {
    return (
      <div>
        <div
          className={this.renderActiveClass('ui_play')}
          id="ui_home"
          onClick={() => this.props.clickHandler('ui_play')}
        >
          <div className="textblock">
            Solo <br /> Play the classic game against yourself.
          </div>
        </div>

        <div
          className={this.renderActiveClass('ui_multi_play')}
          id="ui_home"
          onClick={() => this.props.clickHandler('ui_multi_play')}
        >
          <div className="textblock" id="multiplay">
            Classic <br /> Play the classic game against others.
          </div>
        </div>
      </div>
    );
  }
}

//Stats class
class Stats extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <div className="ui_top" id="ui_stats">
          <center style={{ fontSize: "xx-large" }}>
            <span className="material-symbols-outlined"> check_circle </span>{this.props.wins} &nbsp;
            <span className="material-symbols-outlined"> cancel </span> {this.props.losses}
          </center>
        </div>
      </div>
    );
  }
}

class MultiStats extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <div className="ui_top" id="ui_stats">
          <center style={{ fontSize: "xx-large" }}>
            <span className="material-symbols-outlined"> check_circle </span>{this.props.wins} &nbsp;
            <span class="material-symbols-outlined"> help </span> {this.props.players} &nbsp;
            <span className="material-symbols-outlined"> cancel </span> {this.props.losses}
          </center>
        </div>
      </div>
    );
  }
}

//NewGame class
class NewGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <br />
        <center>
          <button id="play_newgame_button" style={{ backgroundColor: "red" }} onClick={() => this.props.startNewGame(this.props.username)}>NEW GAME</button>
        </center>
      </div>
    );
  }
}

//Name class
class Name extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div>
        <div className="ui_top" id="ui_username">
          <h2>username: <span id="username">{this.props.username}</span></h2>
        </div>
      </div>
    );
  }
}

//Help class
class Help extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <div className="ui_top" id="ui_instructions">
          <div className="textblock">
          <center> Play either solo or against others and guess the word in under six tries. </center>
          <br />
          <center> Only valid five-letter words can be submitted. </center>
          <br />
          <center> After each guess, the color of the letters will change to indicate how good your guess was! </center>
          </div>
        </div>
      </div>
    );
  }
}

//Play Class
class Play extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div>
        <GameBoard board={this.props.board} row={this.props.row} col={this.props.col} gameBoardColors={this.props.gameBoardColors} />
        <br />
        <br />
        <VirtualKeyBoard onLetterInput={this.props.onLetterInput} newGameVisibility={this.props.newGameVisibility} keyScores={this.props.keyScores} mapScoreToColor={this.props.mapScoreToColor} />
      </div>
    );
  }
}

//MultiPlay Class
class MultiPlay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div>
        <MultiStats wins={this.props.wins} losses={this.props.losses} players={this.props.players} />
        <GameTimer time={this.props.time}  />
        <GameBoard board={this.props.board} row={this.props.row} col={this.props.col} gameBoardColors={this.props.gameBoardColors} />
        <br />
        <br />
        <VirtualKeyBoard onLetterInput={this.props.onLetterInput} newGameVisibility={this.props.newGameVisibility} keyScores={this.props.keyScores} mapScoreToColor={this.props.mapScoreToColor} />
        {this.props.displayError &&
          <div>
            <Error err_msg={this.props.err_msg} updateErrDisplay={this.props.updateErrDisplay} />
          </div>
        }
      </div>
    );
  }
}

class VirtualKeyBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderKey = (keyValue) => {
    const handleClick = !this.props.newGameVisibility ? () => this.props.onLetterInput(keyValue) : () => { };
    return (
      <td className="keyboardKey" onClick={handleClick} style={{ backgroundColor: this.props.mapScoreToColor(this.props.keyScores[keyValue]) || "solid grey" }}>
        {keyValue}
      </td>
    );
  };

  render() {
    return (
      <div>
        <center>
          <table className="keyboardrow">
            <tbody>
              <tr>
                {["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"].map(this.renderKey)}
              </tr>
            </tbody>
          </table>
          <table className="keyboardrow">
            <tbody>
              <tr>
                {["A", "S", "D", "F", "G", "H", "J", "K", "L"].map(this.renderKey)}
              </tr>
            </tbody>
          </table>
          <table className="keyboardrow">
            <tbody>
              <tr>
                {["DEL", "Z", "X", "C", "V", "B", "N", "M", "ENTER"].map(this.renderKey)}
              </tr>
            </tbody>
          </table>
        </center>
      </div>
    );
  }
}

class GameBoard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div>
        <center>
          <table className="letterbox">
            <tbody>
              {this.props.board.map((row, rowIndex) => (
                <tr key={`row${rowIndex}`}>
                  {row.map((cell, cellIndex) => (
                    <td
                      key={`col${cellIndex}`}
                      className={`col${cellIndex}`}
                      style={{
                        backgroundColor: this.props.gameBoardColors[rowIndex][cellIndex]
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>

          </table>
        </center>
      </div>
    );
  }
}

class Error extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.props.updateErrDisplay(false);
    }, 5000);
  }

  render() {
    return (
      <div>
        <div id="errorToast" className="toast">
          {this.props.err_msg}
        </div>
      </div>
    );
  }
}

class Result extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div>
        <br></br>
        <br></br>
        <center>
          <div id="result" className="result">
            {this.props.result}
          </div>
        </center>
      </div>
    );
  }
}

class GameTimer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const minutes = Math.floor(this.props.time / 60);
    const seconds = this.props.time % 60;
    const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    return (
      <div>
        <center>
          <div className="game-timer">
            {formattedTime}
          </div>

        </center>
      </div>
    );
  }
}

class WebSocketComponent extends React.Component {
  state = {
    socket: Object,
    wins: 0,
    losses: 0,
    players: 0,
    time: 300,
    gameOver: false
  };

  componentDidMount() {
    this.connectWebSocket();
  }

  connectWebSocket = () => {
    const new_socket = new WebSocket(`ws://${window.location.hostname}:8232`);
    this.setState({socket: new_socket})

    new_socket.onmessage = (event) => {
      // HERE IS WHERE SERVER SENDS STUFF BACK
      const stats = JSON.parse(event.data);
      this.setState(prevState => ({
        wins: stats.wins || prevState.wins,
        losses: stats.losses || prevState.losses,
        players: stats.clients || prevState.players,
        time: stats.time || prevState.time,
        gameOver: stats.gameOver || false

      }));
      if (this.state.gameOver) {
        // this.props.showHomeDisplay(true);
        // this.props.renderActiveClass('ui_home')
      }
    }
  };

  componentWillUnmount() {
    if (this.state.socket) {
      this.state.socket.close();
    }
  }

  render() {
    return (
      <div>
        {!this.state.gameOver ? (
          <MultiPlay
            displayError={this.props.displayError}
            err_msg={this.props.err_msg}
            updateErrDisplay={this.props.updateErrDisplay}
            time={this.state.time}
            players={this.state.players}
            wins={this.state.wins}
            losses={this.state.losses}
            board={this.props.board}
            row={this.props.row}
            col={this.props.col}
            gameBoardColors={this.props.gameBoardColors}
            onLetterInput={this.props.onLetterInput}
            newGameVisibility={this.props.newGameVisibility}
            keyScores={this.props.keyScores}
            mapScoreToColor={this.props.mapScoreToColor}
          />
        ) : (
          <Home activeSection={this.props.activeSection} clickHandler={this.props.clickHandler} />
        )}
      </div>
    );
  }
}

//Main class
class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayHome: true,
      displayName: false,
      displayPlay: false,
      displayMultiPlay: false,
      displayStats: false,
      displayHelp: false,
      displayError: false,
      displayResult: false,
      result: '',
      activeSection: 'ui_home',
      username: '',
      newGameVisibility: true,
      board: Array(6).fill().map(() => Array(5).fill('')),
      gameBoardColors: Array(6).fill().map(() => Array(5).fill('black')),
      row: 0,
      col: 0,
      guess: '',
      keyScores: {},
      wins: 0,
      losses: 0,
      err_msg: ''
    };

    this.fetchUsername();
  }

  renderActiveClass = (sectionName) => {
    return this.props.activeSection === sectionName ? 'ui_active' : '';
  }


  fetchUsername() {
    api_getUsername((data) => {
      this.setState({ username: data.username });
    });
  }

  startNewGame = (username, displayMultiPlay) => {
    api_newgame(username, displayMultiPlay, (data) => {
      this.setState(prevState => ({
        newGameVisibility: false,
        board: Array(6).fill().map(() => Array(5).fill('')),
        gameBoardColors: Array(6).fill().map(() => Array(5).fill('black')),
        row: 0,
        col: 0,
        guess: '',
        keyScores: {},
        err_msg: '',
        displayResult: false,
        result: ''
      }));
    });
  };

  updateErrDisplay = (boolValue) => {
    this.setState({ displayError: boolValue });
  };

  showHomeDisplay = (boolValue) => {
    this.setState({ displayHome: true, 
      displayMultiPlay: false, 
      displayPlay: false,
      activeSection: 'ui_home' });
  };

  mapScoreToColor(score) {
    switch (score) {
      case 3: return "green"
      case 2: return "orange";
      case 1: return "grey";
      case 0: return "black";
      default: return "black"; // Default case
    }
  }


  handleLetterInput = (letter) => {
    if (letter) {

      if (this.state.row <= 5 && this.state.col <= 4) {

        // WITHIN BOUNDS

        if (letter !== "ENTER" && letter !== "DEL") {

          if (this.state.board[this.state.row][this.state.col] == '') {

            // GENERIC CASE OF NOT ENTER/DEL

            this.setState(prevState => {
              const updatedBoard = [...prevState.board]; // Create a copy of the board array
              updatedBoard[prevState.row][prevState.col] = letter; // Update the specific cell
              return { board: updatedBoard }; // Return the updated state
            });

            this.setState(prevState => ({
              // WE DO NOT WANT TO OVERFLOW SO KEEP COL MAX 4
              col: prevState.col === 4 ? 4 : prevState.col + 1 // Increment col by 1
            }));

            if (this.state.guess.length < 5) {
              this.setState(prevState => ({
                guess: prevState.guess + letter // Concatenate letter to guess array
              }), () => {
              });
            }
          }
        }

        // HANDLE DELETE

        if (letter === "DEL") {
          // move one col down (stay at 0 if col = 0)
          if (this.state.guess.length !== 5) {
            this.setState(prevState => ({
              col: prevState.col !== 0 ? prevState.col - 1 : 0 // Decrement col by 1
            }));
          } else {
            this.setState(prevState => ({
              col: prevState.col !== 0 ? prevState.col : 0 // do not decrement col
            }));
          }

          // update board 
          this.setState(prevState => {
            const updatedBoard = [...prevState.board]; // Create a copy of the board array
            updatedBoard[prevState.row][prevState.col] = ''; // Update the specific cell
            return { board: updatedBoard }; // Return the updated state
          });

          //remove deleted letter from guess string
          this.setState(prevState => ({
            guess: prevState.guess.slice(0, -1)
          }));
          return;
        }

        // HANDLE ENTER

        if (letter === "ENTER") {
          //forward guess to server and check for error
          if (this.state.guess === '') {
            return;
          }

          api_guess(this.state.username, this.state.guess, (data) => {
            if (data.success) {
              // Guess was valid

              // If row is incremented past the board, does not matter since
              // at this point backend API knows if game is over (data.state = "won" || "lost")

              // Map cur_keyScore to letters
              // reset keyScores

              let i = 0;
              data.score.forEach(item => {
                this.setState(prevState => {
                  // Make a copy of the gameBoardColors array to avoid mutating the state directly
                  const newGameBoardColors = [...prevState.gameBoardColors];

                  // Update the color of the specified cell
                  newGameBoardColors[this.state.row][i] = this.mapScoreToColor(item.score);
                  i = i + 1;

                  return { gameBoardColors: newGameBoardColors };
                });

                // If the keyboard has already seen a better guess, we do not want to overwrite it with a worse guess
                if (!(item.char in this.state.keyScores) || item.score > this.state.keyScores[item.char]) {
                  this.state.keyScores[item.char] = item.score;
                }
              });
              

              this.setState(prevState => ({
                row: prevState.row + 1,
                col: 0,
                guess: '',
              }));

              //on win
              if (data.state === "won") {
                this.setState(prevState => ({
                  wins: prevState.wins + 1,
                  newGameVisibility: true,
                  displayResult: true,
                  result: 'You won'
                }));
              }

              //on lost
              if (data.state === "lost") {
                this.setState(prevState => ({
                  losses: prevState.losses + 1,
                  newGameVisibility: true,
                  displayResult: true,
                  result: 'You lost'
                }));
              }
              return;
            } else {
              // if guess was invalid then raise error toast
              this.setState({
                displayError: true,
                err_msg: data.error,
              });
            }
          });
        }
      }
    }
  };

  handleClick = (event) => {
    let elementId = '';
    if (event === "ui_play") {
      // Clicked on Solo Game button in home page
      this.startNewGame(this.state.username, false);
      elementId = "play";
      this.setState({ activeSection: "ui_play" });

    } 
      // Clicked on Classic Game button in home page
    else if (event === "ui_multi_play") {
      
      this.startNewGame(this.state.username, true);
      elementId = "multi_play";
      this.setState({ activeSection: "ui_play" });
    }
    else {
      elementId = event.target.id;
      const sectionName = event.currentTarget.getAttribute('name');
      this.setState({ activeSection: sectionName });
    }

    this.setState((prevState) => ({
      displayHome: elementId === "home",
      displayName: elementId === "user",
      displayPlay: elementId === "play",
      displayStats: elementId === "stats",
      displayHelp: elementId === "help",
      displayMultiPlay: elementId === "multi_play"
    }));
  }

  render() {
    return (
      <div>
        <Header activeSection={this.state.activeSection} clickHandler={this.handleClick} />
        {this.state.displayHome && <Home activeSection={this.state.activeSection} clickHandler={this.handleClick} />}
        {this.state.displayHelp && <Help />}
        {this.state.displayName && <Name username={this.state.username} />}
        {this.state.displayPlay && (
          <div>
            <Play board={this.state.board} onLetterInput={this.handleLetterInput} row={this.state.row} col={this.state.col} newGameVisibility={this.state.newGameVisibility} keyScores={this.state.keyScores} wins={this.state.wins} losses={this.state.losses} mapScoreToColor={this.mapScoreToColor} gameBoardColors={this.state.gameBoardColors} />
          </div>
        )}

        {this.state.displayPlay && this.state.displayResult &&
          <div>
            <Result result={this.state.result} />
          </div>
        }

        {this.state.displayPlay && this.state.newGameVisibility &&
          <div>
            <NewGame username={this.state.username} startNewGame={this.startNewGame} />
          </div>
        }

        {this.state.displayPlay && this.state.displayError &&
          <div>
            <Error err_msg={this.state.err_msg} updateErrDisplay={this.updateErrDisplay} />
          </div>
        }

        {this.state.displayStats && <Stats wins={this.state.wins} losses={this.state.losses} />}
        {this.state.displayMultiPlay && <WebSocketComponent updateErrDisplay={this.updateErrDisplay}  displayError={this.state.displayError} err_msg={this.state.err_msg} showHomeDisplay={this.showHomeDisplay}  board={this.state.board} onLetterInput={this.handleLetterInput} row={this.state.row} col={this.state.col} newGameVisibility={this.state.newGameVisibility} keyScores={this.state.keyScores} mapScoreToColor={this.mapScoreToColor} gameBoardColors={this.state.gameBoardColors} activeSection={this.state.activeSection} clickHandler={this.handleClick} />}
      </div>
    );
  }
}
export { Main };


