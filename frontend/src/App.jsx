import { BrowserRouter as Router } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import AppRoutes from "./Routes/appRoutes";

function App() {

    
    return (

        
        <Router>
            <AppRoutes />
        </Router>
    );
}

export default App;
