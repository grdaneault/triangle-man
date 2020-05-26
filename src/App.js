import React from 'react';
import './App.css';
import {addPointsAndGenerateTriangles, applyImageTheme, reset} from "./redux/actions";
import {connect} from "react-redux";
import Wallpaper from "./components/Wallpaper";
import {debounce} from "underscore";
import Button from "@material-ui/core/Button";
import {saveAs} from 'file-saver';
import sample from './img/sample1.jpg'

function randomInRange(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            gridSize: 250,
            pointChance: 0.65,
            rows: 0,
            cols: 0,
            showPoints: false,
            resolution: 1.25
        }

        this.generatePoints()
    }

    download = () => {
        this.props.pixiApp.renderer.view.toBlob((blob) => {
            saveAs(blob, "wallpaper.png")
        }, 'image/png');
    }

    handleInputChange = (event) => {
        const target = event.target;
        const name = target.name;
        const value = name === 'showPoints' ? target.checked : target.value;
        this.setState({
            [name]: value
        });
    }

    generatePoints = debounce(() =>{
        const {height, width} = this.getWindowDimensions();
        const {addPointsAndGenerateTriangles, reset, applyImageTheme} = this.props;

        reset();
        const {gridSize, pointChance} = this.state;

        const rows = Math.ceil(height / gridSize),
            cols = Math.ceil(width / gridSize);

        const points = []

        for (let row = -2; row < rows + 2; row += 1) {
            for (let col = -2; col < cols + 2; col += 1) {
                if (Math.random() < pointChance) {
                    const x = col * gridSize + randomInRange(0, gridSize),
                        y = row * gridSize + randomInRange(0, gridSize);
                    points.push({x, y})
                }
            }
        }


        // points.push({x: offsetX, y: offsetY});
        // points.push({x: offsetX + (2 * triHeight), y: offsetY});
        // points.push({x: offsetX + triHeight, y: offsetY + triHeight});

        // const offsetX = 200;
        // const offsetY = 200;
        // const triHeight = 600;
        //
        // points.push({x: offsetX, y: offsetY});
        // points.push({x: offsetX + triHeight, y: offsetY + triHeight});
        // // points.push({x: offsetX + triHeight, y: offsetY});
        // points.push({x: offsetX, y: offsetY + triHeight});

        addPointsAndGenerateTriangles(points);
        console.log("Sample?", sample)
        applyImageTheme(sample);

        this.setState( {
            rows,
            cols
        });
    }, 250);

    componentDidMount() {
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        const {width, height} = this.getWindowDimensions();
        this.setState({width, height});
        this.generatePoints();
    }

    getWindowDimensions() {
        const { innerWidth: width, innerHeight: height } = window;
        return {
            width,
            height
        };
    }

    render() {
        const {gridSize, width, height, showPoints, resolution} = this.state;
        const {points, triangles} = this.props;

        return (
            <div className="App">
                <div className="Controls">
                    <p>Grid size: {gridSize}px</p>
                    <p>Number of points: {points.length}</p>
                    <p>Number of triangles: {triangles.length}</p>
                    <label>Show points: <input type="checkbox" name="showPoints" checked={showPoints} onChange={this.handleInputChange} /></label>
                    <p>
                        <Button onClick={this.generatePoints} >Regenerate</Button>
                        <Button onClick={this.download} >Download</Button>
                    </p>
                </div>
                <Wallpaper width={width} height={height} showPoints={showPoints} resolution={resolution}/>
            </div>
        );
    }
}

const mapStateToProps = (store) => {
    return {
        points: store.points,
        triangles: store.triangles,
        pixiApp: store.pixiApp
    }
}

export default connect(mapStateToProps, {addPointsAndGenerateTriangles, reset, applyImageTheme})(App);
