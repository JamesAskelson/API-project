import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import { SpotIndex } from "./components/Spots/SpotIndex/SpotIndex.js";
import { SpotShow } from "./components/Spots/SpotShow/SpotShow.js";
import { SpotForm } from "./components/Spots/SpotForm/SpotForm";



function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const spots = useSelector(state => Object.values(state.spots))

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded &&
      <Switch>
        <Route exact path='/'>
          <SpotIndex spots={spots}/>
        </Route>
        <Route path='/spots/new'>
          <SpotForm spots={spots}/>
        </Route>
        <Route exact path='/spots/:spotId'>
          <SpotShow spots={spots}/>
        </Route>
      </Switch>}
    </>
  );
}

export default App;
