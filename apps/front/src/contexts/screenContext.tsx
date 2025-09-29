import { createContext, useContext } from "react";
import { useMediaQuery } from "react-responsive";

interface ScreenContextType {
  isDesktop: boolean;
  isTablet: boolean;
  isMobile: boolean;
}

interface ScreenProviderProps {
  children: React.ReactNode;
}

const ScreenContext = createContext<ScreenContextType | null>(null);

export default function ScreeProvider({ children }: ScreenProviderProps) {
  const isDesktop = useMediaQuery({ minWidth: 1024 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const isMobile = useMediaQuery({ maxWidth: 767 });

  return (
    <ScreenContext.Provider value={{ isDesktop, isTablet, isMobile }}>
      {children}
    </ScreenContext.Provider>
  );
}

export function useScreen() {
  const context = useContext(ScreenContext);
  if (!context) {
    throw new Error("useScreen must be used within a ScreenProvider");
  }
  return context;
}
