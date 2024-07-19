// import React from 'react';
// import Home from './Home';

// function App() {
//   const handleNetworkSelected = (network, wallet, hasWallet) => {
//     if (hasWallet) {
//       // Make an API call to the backend to proceed with the connection part
//       console.log(`Proceed with connecting ${wallet} on ${network} network`);
//       // Implement the connection logic here
//     } else {
//       console.log(`User needs to install ${wallet}`);
//     }
//   };

//   return (
//     <div className="App">
//       <Home onNetworkSelected={handleNetworkSelected} />
//     </div>
//   );
// }

// export default App;

import React from 'react';
import Home from './home';

function App() {
 
  return (
    <div className="App">
      <Home />
    </div>
  );
}

export default App;