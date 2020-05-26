import {combineReducers} from 'redux'
import points from "./points";
import triangles from "./triangles";
import themes from "./themes";
import pixiApp from "./pixiApp";
import currentTheme from "./currentTheme";

export default combineReducers({points, triangles, pixiApp, currentTheme, themes});