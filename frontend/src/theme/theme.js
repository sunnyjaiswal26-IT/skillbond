import { createTheme } from '@mui/material/styles';

export const getTheme = (mode = 'dark') => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#6366F1', // Indigo
        light: '#818CF8',
        dark: '#4F46E5',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#EC4899', // Pink
        light: '#F472B6',
        dark: '#DB2777',
        contrastText: '#FFFFFF',
      },
      background: {
        default: isDark ? '#0B0F19' : '#F8FAFC',
        paper: isDark ? '#111827' : '#FFFFFF',
      },
      text: {
        primary: isDark ? '#F9FAFB' : '#0F172A',
        secondary: isDark ? '#9CA3AF' : '#64748B',
      },
      divider: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
      success: {
        main: '#10B981',
      },
      warning: {
        main: '#F59E0B',
      },
      error: {
        main: '#EF4444',
      },
      info: {
        main: '#3B82F6',
      },
    },
    typography: {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      h1: {
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 700,
        letterSpacing: '-0.02em',
      },
      h2: {
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 700,
        letterSpacing: '-0.01em',
      },
      h3: {
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 600,
      },
      h4: {
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 600,
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: '10px 22px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0px 4px 12px rgba(99, 102, 241, 0.25)',
            },
          },
          containedPrimary: {
            background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: isDark ? '#111827' : '#FFFFFF',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
            borderRadius: 16,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  });
};
