export default function RandomBlocksTransition() {
  const numberPerSide = 10;

  const delays = Array.apply(null, Array(numberPerSide * numberPerSide)).map(function (_, i) {
    return i * 18;
  });
  const shuffledDelays = delays.sort((a, b) => 0.5 - Math.random());

  return (
    <>
      {shuffledDelays.map((delay, index) => (
        <div
          key={delay}
          className="fadeInAnimation biggerBlockAnimation block"
          style={{
            top: `${Math.floor(index / numberPerSide) * (100 / numberPerSide)}%`,
            left: `${(index % numberPerSide) * (100 / numberPerSide)}%`,
            "--fadeindelay": `${delay}ms`,
            "--fadeinduration": "300ms",
          }}
        />
      ))}
    </>
  );
}
