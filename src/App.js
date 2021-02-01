import './App.css';
import Client from "./utils"
import { ApolloProvider } from '@apollo/client';
import UserPanel from './components/userPanel'

function App() {
  return (
    <ApolloProvider client={Client} className="App">
      <header className="App-header">
        <UserPanel/>
      </header>
    </ApolloProvider>
  );
}

export default App;
