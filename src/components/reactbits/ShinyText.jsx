import './shinyText.css';

export default function ShinyText({
  text = '',
  className = '',
  speed = 4,
}) {
  return (
    <span
      className={`shiny-text ${className}`}
      style={{ animationDuration: `${speed}s` }}
    >
      {text}
    </span>
  );
}
