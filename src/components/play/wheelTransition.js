function handleTop(start, end, delay) {
  let arrayOfDivs = [];
  for (let i = start; i < end; i++) {
    arrayOfDivs.push(createElement(i, start, delay));
    delay++;
  }

  return { arrayOfDivs, delay };
}

function handleRight(start, end, delay) {
  let arrayOfDivs = [];
  for (let i = start; i < end; i++) {
    arrayOfDivs.push(createElement(end, i, delay));
    delay++;
  }

  return { arrayOfDivs, delay };
}

function handleBottom(start, end, delay) {
  let arrayOfDivs = [];
  for (let i = start; i > end; i--) {
    arrayOfDivs.push(createElement(i, start, delay));
    delay++;
  }

  return { arrayOfDivs, delay };
}

function handleLeft(start, end, delay) {
  let arrayOfDivs = [];
  for (let i = start; i > end; i--) {
    arrayOfDivs.push(createElement(end, i, delay));
    delay++;
  }

  return { arrayOfDivs, delay };
}

function createElement(x, y, iterator) {
  const delay = iterator * 10;
  const div = (
    <div
      key={delay}
      className="fadeInAnimation blockAnimation block"
      style={{
        top: `${y * (100 / 15)}%`,
        left: `${x * (100 / 15)}%`,
        "--fadeindelay": `${delay}ms`,
        "--fadeinduration": "250ms",
      }}
    ></div>
  );
  return div;
}

function wheelAnimation() {
  let start = 0;
  let end = 14;
  let iterator = 0;
  let divs = [];
  while (start !== end) {
    const topDivs = handleTop(start, end, iterator);
    iterator = topDivs.delay;
    divs.push(...topDivs.arrayOfDivs);

    const rightDivs = handleRight(start, end, iterator);
    iterator = rightDivs.delay;
    divs.push(...rightDivs.arrayOfDivs);

    const bottomDivs = handleBottom(end, start, iterator);
    iterator = bottomDivs.delay;
    divs.push(...bottomDivs.arrayOfDivs);

    const leftDivs = handleLeft(end, start, iterator);
    iterator = leftDivs.delay;
    divs.push(...leftDivs.arrayOfDivs);
    start++;
    end--;
  }

  divs.push(createElement(7, 7, iterator));

  return divs;
}

export default function WheelTransition() {
  return <>{wheelAnimation()}</>;
}
