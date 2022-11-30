import { usePersistedLocallyStore } from '../globalStore'

const AfterStoreHyrdation = ({ children }) => {
  // FOR HYDRATION IN REACT, for persisted store use
  const isHydrated = usePersistedLocallyStore((state) => state.hasHydrated)
  if (!isHydrated) {
    return <p>Loading...</p>
  }

  return <>{children}</>
}

export default AfterStoreHyrdation
