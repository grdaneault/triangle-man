import React from 'react';
import './App.css';
import {addPoints, resetPoints, updateTriangleAesthetic} from "./redux/actions";
import {connect} from "react-redux";
import Wallpaper from "./components/Wallpaper";
import {debounce} from "underscore";
import sample1 from "./img/sample1.jpg";

function randomInRange(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            gridSize: 250,
            pointChance: 0.7,
            rows: 0,
            cols: 0,
            showPoints: false
        }

        this.sourceTexture = new Image();

        const renderImage = (img) => {
            const canvas = document.createElement("canvas");
            const {height, width} = this.getWindowDimensions();
            canvas.width = width;
            canvas.height = height
            const ctx = canvas.getContext("2d");
            console.log("image", img);
            ctx.drawImage(img, 0, 0, width, height);
            const textureData = ctx.getImageData(0, 0, width, height).data;
            this.props.updateTriangleAesthetic(textureData, width, height);
            console.log(this.textureData)
        }

        this.sourceTexture.onload = function () {
            renderImage(this);
        }

        this.sourceTexture.src = sample1
        this.generatePoints()
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
        const {addPoints, resetPoints} = this.props;

        resetPoints();
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
        // const triHeight = 800;
        //
        // points.push({x: offsetX, y: offsetY});
        // points.push({x: offsetX + triHeight, y: offsetY + triHeight});
        // // points.push({x: offsetX + triHeight, y: offsetY});
        // points.push({x: offsetX, y: offsetY + triHeight});

        addPoints(points);

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
        const {gridSize, width, height, showPoints} = this.state;
        const {points, triangles} = this.props;

        return (
            <div className="App">
                <div className="Controls">
                    <p>Grid size: {gridSize}px</p>
                    <p>Number of points: {points.length}</p>
                    <p>Number of triangles: {triangles.length}</p>
                    <label>Show points: <input type="checkbox" name="showPoints" checked={showPoints} onChange={this.handleInputChange} /></label>
                </div>
                <Wallpaper width={width} height={height} showPoints={showPoints}/>
            </div>
        );
    }
}

const mapStateToProps = (store) => {
    return {
        points: store.shapeData.points,
        triangles: store.shapeData.triangles
    }
}

export default connect(mapStateToProps, {addPoints, resetPoints, updateTriangleAesthetic})(App);
