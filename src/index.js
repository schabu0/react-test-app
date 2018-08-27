import React, { Component } from "react";
import ReactDOM from "react-dom";

import "./styles.css";

function App() {
  return (
    <div className="App">
      <Cookie />
      <Viewer />
      <Shop />
    </div>
  );
}

class Cookie extends Component {
  handleClick = () => {
    updateClickCounter();
  };

  render() {
    return (
      <button className="cookie" onClick={this.handleClick}>
        Click here<br />as fast as you can!
      </button>
    );
  }
}

class Viewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clickCounter: 0,
      clickDate: [0, 0, 0, new Date()],
      clickPerSecond: 0,
      maxCPS: 0 //best click per second
    };
    updateClickCounter = updateClickCounter.bind(this);
    getClickCounter = getClickCounter.bind(this);
    getLevel = getLevel.bind(this);
  }

  //return the level calculated from the function: https://www.desmos.com/calculator/oydvyibtfv
  level = clicked => {
    return clicked < 10 ? 1 : Math.floor(Math.log2(clicked / 10) + 2);
  };

  render() {
    const level = this.level(this.state.clickCounter);
    //top - number of minimum points of next level
    const top = Math.pow(2, level - 1) * 10;

    if (this.state.clickPerSecond > this.state.maxCPS)
      this.setState(prevState => {
        return {
          maxCPS: prevState.clickPerSecond
        };
      });

    return (
      <div className="viewer">
        <ViewerSlider
          showLegend={true}
          name={"clicks"}
          fullName={"Clicks"}
          width={this.state.clickCounter / top}
          top={top}
          legendName={"next: "}
        >
          {this.state.clickCounter}
        </ViewerSlider>
        <ViewerSlider
          showLegend={false}
          fullName={"Level"}
          name={"level"}
          width={(7 * (level + 1.7)) / (level + 2.1) - 6}
          top={level}
        >
          {level}
        </ViewerSlider>
        <ViewerSlider
          showLegend={true}
          name={"cps"}
          fullName={"Clicks per second"}
          width={this.state.clickPerSecond / this.state.maxCPS}
          top={this.state.maxCPS.toFixed(2)}
          legendName={"max: "}
        >
          {this.state.clickPerSecond.toFixed(2)}
        </ViewerSlider>
      </div>
    );
  }
}

function ViewerSlider(props) {
  let innerStyle = {
    width: props.width * 100 + "%"
  };

  let legend = props.showLegend ? "/ " + props.legendName + props.top : "";

  return (
    <div className={"viewer__slider viewer__slider--" + props.name}>
      <p className={"viewer__slider__name"}>{props.fullName}</p>
      <div
        style={innerStyle}
        className={"viewer__slider__inner viewer__slider__inner--" + props.name}
      >
        <p>
          {props.children}
          <span className={"small"}>{legend}</span>
        </p>
      </div>
    </div>
  );
}

class Shop extends React.Component {
  itemsData = [
    // [clicks, (per) second, price]
    [1, 4, 20],
    [1, 2, 40],
    [1, 1, 80],
    [2, 1, 160],
    [3, 1, 320],
    [4, 1, 640],
    [5, 1, 1280]
    //[30,1, 1] //extra booster
  ];

  items = this.itemsData.map(item => (
    <ShopItem clicks={item[0]} per={item[1]} cost={item[2]} />
  ));
  render() {
    return (
      <div className="shop">
        <h2>Shop</h2>
        <p>Click to buy</p>
        {this.items}
      </div>
    );
  }
}

class ShopItem extends Component {
  state = {
    buyed: "",
    try: ""
  };

  boost = e => {
    //if already buyed
    if (this.state.buyed != "") return false;

    //if not enough points
    if (getClickCounter() < this.props.cost) {
      this.setState({ try: " shop__item--try" });
      return false;
    }

    updateClickCounter(-this.props.cost);
    /*setInterval(
      updateClickCounter,
      (1000 / this.props.clicks) * this.props.per
    );*/
    this.setState({ buyed: " shop__item--buyed" });
    booster.boost(this.props.clicks / this.props.per);
  };

  render() {
    let sS = this.props.per > 1 ? "s" : ""; //second or seconds
    let sC = this.props.clicks > 1 ? "s" : ""; //click or clicks
    return (
      <div
        class={"shop__item" + this.state.try + this.state.buyed}
        disabled={this.state.buyed}
        onClick={this.boost}
      >
        {this.props.clicks} click{sC}/{this.props.per} second{sS}
        <span>cost: {this.props.cost}</span>
      </div>
    );
  }
}

function Booster() {
  this.cps = 0; //click per second

  this.boost = function(cps) {
    console.log("booster", cps);
    this.cps += cps;
    this.setInt(this.cps);
  };

  this.setInt = function(cps) {
    console.log("setInt", cps);
    if (!cps) return false;
    if (this.int) clearInterval(this.int);
    this.int = setInterval(updateClickCounter, 1000 / cps);
  };
}
let booster = new Booster();

//auxiliary function for transferring state between components
function updateClickCounter(value) {
  if (!value) value = 1;
  this.setState(prevState => {
    return {
      clickCounter: prevState.clickCounter + value,
      clickDate: [
        prevState.clickDate[1],
        prevState.clickDate[2],
        prevState.clickDate[3],
        new Date()
      ],
      clickPerSecond:
        Math.round(
          100 / ((this.state.clickDate[3] - this.state.clickDate[0]) / 3000)
        ) / 100
    };
  });
}

function getClickCounter() {
  return this.state.clickCounter;
}

function getLevel() {
  return this.level(this.state.clickCounter);
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

/*
Twoja aplikacja ma składać się z:
- komponentu App, który będzie służyć za główny kontener aplikacji
- przycisku, będącego osobnym komponentem Reactowym, który po każdym kliknięciu zwiększa licznik kliknięć o "1"
- komponentu, który będzie wypisywał na ekranie ilość kliknięć oraz obecnie posiadany poziom doświadczenia,
 obliczanego według schematu:
- 1. poziom - od początku (0 kliknięć)
- 2. poziom - od 10 kliknięć
- 3. poziom - od 20 kliknięć
- 4. poziom - od 40 kliknięć
- 5. poziom - od 80 kliknięć
- itd.

Do rozwiązania zadania użyj https://codesandbox.io/s/new gdzie już na starcie posiadasz skonfigurowaną aplikację 
z komponentem App.

Zadania bonusowe (wystarczy wybrać jedno):
- Dodanie systemu achievementów, gdzie możesz odblokować określonymi akcjami (jak np. 100 kliknięć, czy osiągnięcie 
wysokiego wskaźnika kliknięć na sekundę). Po spełnieniu kryterium dla dostania achievementu pojawia się notyfikacja 
o tym, że się go zdobyło.
- Dodanie "sklepu", gdzie za kliknięcia kupujesz maszyny klikające za ciebie co określoną ilość sekund z kolejnymi
 maszynami odblokowanymi na wyższych poziomach.

Jak do tego zadania podejdziesz i co przygotujesz zależy od ciebie, ale na pewno punktujemy za ambicję i styl :)

Kilka linków, które powinno ci pomóc z nauką wszystkiego, co jest potrzebne do zrobienia tego zadania:
- https://reactjs.org/docs/hello-world.html
- https://medium.freecodecamp.org/all-the-fundamental-react-js-concepts-jammed-into-this-single-medium-article-c83f9b53eac2
- https://www.sitepoint.com/getting-started-react-beginners-guide/
- https://egghead.io/courses/the-beginner-s-guide-to-react
*/
