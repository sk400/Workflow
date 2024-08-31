const { createContext, useContext, useState } = require("react");

const App = createContext();

export const Provider = ({ children }) => {
  const [filteredCategories, setFilteredCategories] = useState(null);
  const [selectedLabel, setSelectedLabel] = useState(null);

  return (
    <App.Provider
      value={{
        filteredCategories,
        setFilteredCategories,
        selectedLabel,
        setSelectedLabel,
      }}
    >
      {children}
    </App.Provider>
  );
};

export const useGlobalState = () => useContext(App);
