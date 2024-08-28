const { createContext, useContext, useState } = require("react");

const App = createContext();

export const Provider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <App.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </App.Provider>
  );
};

export const useGlobalState = () => useContext(App);
