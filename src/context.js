const { createContext, useContext, useState } = require("react");

const App = createContext();

export const Provider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [projects, setProjects] = useState([]);

  return (
    <App.Provider
      value={{ user, setUser, userData, setUserData, projects, setProjects }}
    >
      {children}
    </App.Provider>
  );
};

export const useGlobalState = () => useContext(App);
