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

class Cookie extends React.Component {
  render() {
    return <button onClick={() => updateClickCounter()}>Cookie</button>;
  }
}

class Viewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clickCounter: 0,
      clickDate: [0, 0, 0, 0, new Date()],
      clickPerSecond: 0
    };
    updateClickCounter = updateClickCounter.bind(this);
    getClickCounter = getClickCounter.bind(this);
  }

  level = clicked => {
    return clicked < 10 ? 1 : Math.floor(Math.log2(clicked / 10) + 2); // https://www.desmos.com/calculator/oydvyibtfv
  };

  render() {
    return (
      <div>
        <p>Clicks counter: {this.state.clickCounter}</p>
        <p>Level: {this.level(this.state.clickCounter)}</p>
        <p>Click per second: {this.state.clickPerSecond}</p>
      </div>
    );
  }
}

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
        prevState.clickDate[4],
        new Date()
      ],
      clickPerSecond:
        Math.round(
          100 / ((this.state.clickDate[4] - this.state.clickDate[0]) / 4000)
        ) / 100
    };
  });
}

function getClickCounter() {
  return this.state.clickCounter;
}

class ShopItem extends Component {
  state = {
    byued: false
  };

  boost = () => {
    if (getClickCounter() < this.props.cost) return false;
    updateClickCounter(-this.props.cost);
    setInterval(
      updateClickCounter,
      (1000 / this.props.clicks) * this.props.per
    );
    this.setState({ buyed: true });
  };

  render() {
    return (
      <button disabled={this.state.buyed} onClick={this.boost}>
        {this.props.clicks} clicks/{this.props.per} second, cost:{" "}
        {this.props.cost}
      </button>
    );
  }
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
  ];

  items = this.itemsData.map(item => (
    <ShopItem clicks={item[0]} per={item[1]} cost={item[2]} />
  ));

  render() {
    return <div>{this.items}</div>;
  }
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
