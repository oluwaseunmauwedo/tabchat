export default function LoadingDots() {
    return (
      <div className="flex items-center gap-1.5 py-1">
        <span 
          className="h-1.5 w-1.5 rounded-full bg-current opacity-60" 
          style={{ 
            animation: 'loading-dot 1.4s ease-in-out infinite',
            animationDelay: '0s'
          }}
        />
        <span 
          className="h-1.5 w-1.5 rounded-full bg-current opacity-60" 
          style={{ 
            animation: 'loading-dot 1.4s ease-in-out infinite',
            animationDelay: '0.2s'
          }}
        />
        <span 
          className="h-1.5 w-1.5 rounded-full bg-current opacity-60" 
          style={{ 
            animation: 'loading-dot 1.4s ease-in-out infinite',
            animationDelay: '0.4s'
          }}
        />
      </div>
    );
  }