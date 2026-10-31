export default function AuthAnimatedBackground({ variant }) {
  return (
    <div className={`auth-animated-bg auth-animated-bg-${variant}`} aria-hidden="true">
      <span className="auth-bg-layer auth-bg-layer-one" />
      <span className="auth-bg-layer auth-bg-layer-two" />
      <span className="auth-bg-layer auth-bg-layer-three" />
      {variant === "threads" && (
        <svg className="auth-bg-threads" viewBox="0 0 800 700" preserveAspectRatio="none">
          {Array.from({ length: 12 }, (_, index) => (
            <path
              key={index}
              d={`M-40 ${80 + index * 45} C 180 ${20 + index * 37}, 330 ${170 + index * 22}, 840 ${60 + index * 48}`}
              style={{
                animationDuration: `${11 + index * 0.55}s`,
                animationDelay: `${index * -0.32}s`,
              }}
            />
          ))}
        </svg>
      )}
    </div>
  );
}
