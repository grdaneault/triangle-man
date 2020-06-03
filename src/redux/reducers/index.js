import {combineReducers} from 'redux'
import points from "./points";
import triangles from "./triangles";
import themes from "./themes";
import pixiApp from "./pixiApp";
import currentTheme from "./currentTheme";
import resolution from "./resolution";
import pointSettings from "./pointSettings";
import renderState from "./renderState";

export default combineReducers({
    points,
    triangles,
    pixiApp,
    currentTheme,
    themes,
    resolution,
    pointSettings,
    renderState
});