// Banderas en SVG: los emojis de banderas no se ven en Windows (muestran letras).
const FLAGS = {
  ar: (
    <>
      <rect width="30" height="20" fill="#74acdf" />
      <rect y="6.67" width="30" height="6.67" fill="#fff" />
      <circle
        cx="15"
        cy="10"
        r="2.3"
        fill="#f6b40e"
        stroke="#85340a"
        strokeWidth="0.4"
      />
    </>
  ),
  us: (
    <>
      <rect width="30" height="20" fill="#fff" />
      {[0, 2, 4, 6, 8, 10, 12].map((i) => (
        <rect
          key={i}
          y={(i * 20) / 13}
          width="30"
          height={20 / 13}
          fill="#b22234"
        />
      ))}
      <rect width="13" height={(7 * 20) / 13} fill="#3c3b6e" />
      {[2.2, 6.5, 10.8].flatMap((x) =>
        [2.2, 5.4, 8.6].map((y) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="0.7" fill="#fff" />
        )),
      )}
    </>
  ),
};

export default function Flag({ code, width = 24 }) {
  return (
    <svg
      viewBox="0 0 30 20"
      width={width}
      height={(width * 2) / 3}
      aria-hidden="true"
      style={{ borderRadius: 3, display: "block" }}
    >
      {FLAGS[code]}
    </svg>
  );
}
