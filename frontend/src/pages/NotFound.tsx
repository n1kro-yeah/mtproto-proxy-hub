import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchOffIcon from '@mui/icons-material/SearchOff';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'SF Pro Display', 'Inter', -apple-system, sans-serif",
      padding: '2rem',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '1.5rem',
        padding: '3rem',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
        border: '1px solid rgba(255,255,255,0.8)',
        textAlign: 'center',
        maxWidth: '480px',
        width: '100%',
        animation: 'fadeIn 0.5s ease-out',
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '1rem',
          background: 'linear-gradient(135deg, #14b8a6 0%, #2dd4bf 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          boxShadow: '0 4px 12px rgba(20, 184, 166, 0.3)',
        }}>
          <SearchOffIcon style={{ fontSize: '2.5rem', color: 'white' }} />
        </div>

        <div style={{
          fontSize: '5rem',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #14b8a6 0%, #2dd4bf 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: 1,
          marginBottom: '0.5rem',
          letterSpacing: '-0.02em',
        }}>
          404
        </div>

        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: '#27272a',
          marginBottom: '0.75rem',
          letterSpacing: '-0.01em',
        }}>
          Page not found
        </h2>

        <p style={{
          fontSize: '1rem',
          color: '#71717a',
          marginBottom: '2rem',
          lineHeight: 1.6,
        }}>
          The page you're looking for doesn't exist or has been moved.
        </p>

        <button
          onClick={() => navigate('/', { replace: true })}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.875rem 1.75rem',
            background: 'white',
            color: '#3f3f46',
            border: '2px solid #e4e4e7',
            borderRadius: '0.75rem',
            fontFamily: "'SF Pro Display', 'Inter', sans-serif",
            fontWeight: 600,
            fontSize: '0.9375rem',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#14b8a6';
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#e4e4e7';
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
          }}
        >
          <ArrowBackIcon style={{ fontSize: '1.25rem' }} />
          Back to Home
        </button>
      </div>
    </div>
  );
}
