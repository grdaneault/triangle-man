import {Graphics, Matrix, Polygon, Texture} from 'pixi.js';
import {PixiComponent} from '@inlet/react-pixi';
import {connect} from "react-redux";
import {colorTriangle} from "../redux/actions";
import chroma from "chroma-js";

function gradient(from, to, orientation) {
    const c = document.createElement("canvas");
    // console.log(from, to, orientation)
    c.width = 512
    c.height = 512
    const ctx = c.getContext("2d");
    let grd;
    if (orientation) {
        grd = ctx.createLinearGradient(0, 0, 0, 512);
    } else {
        grd = ctx.createLinearGradient(512, 0, 0, 512);
    }
    grd.addColorStop(0, from);
    grd.addColorStop(1, to);
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 512, 512);
    return Texture.from(c);
}

const Triangle = PixiComponent('Triangle', {
    create: props => new Graphics(),
    applyProps: (instance, _, newProps) => {
        const {points, id, colorTriangle, sideLengths, altitudes, aesthetic} = newProps;
        let longestSide = 0;
        for (let i = 0; i < 3; i++) {
            if (sideLengths[longestSide] < sideLengths[i]) {
                longestSide = i;
            }
        }

        const slope = (points[(longestSide + 1) % 3][1] - points[longestSide][1]) / (points[(longestSide + 1) % 3][0] - points[longestSide][0])
        const tri = new Polygon(points.flat());
        tri.interactive = true;

        instance.interactive = true;
        instance.hitArea = tri;
        instance.buttonMode = true;
        // instance.click = (e) => {console.log("click triangle", points, e); colorTriangle(id, !fill)}

        // const texture = gradient("#A4DE02", "#1E5631")
        // const texture = fill ? gradient("#A4DE02", "#FFFFFF", fill) : Texture.from(refTexture);
        let start = "#FFFFFF";
        let end = chroma("white").darken(1);
        if (aesthetic.data.length > 0) {
            const fill = getFill(aesthetic, points);
            start = fill.start
            end = fill.end
        }
        let texture = gradient(start, end, 0);
        // console.log(texture, texture.valid, texture.baseTexture.width, texture.orig.width, texture.orig.height, texture.width, texture.height)
        // texture = Texture.from(uv)


        instance.clear()
            .beginTextureFill({
                // texture: ,
                texture: texture,
                matrix: new Matrix()
                    .scale(sideLengths[longestSide] / 512 * Math.sign(slope), altitudes[longestSide] / 512 * Math.sign(slope))
                    .rotate(Math.atan(slope))
                    .translate(points[(longestSide + 1) % 3][0], points[(longestSide + 1) % 3][1])


                // .rotate(Math.atan(slope))

            })
            .drawPolygon(tri)
            .endFill();

    }
});

const getFill = (aesthetic, points) => {
    const center = [(points[0][0] + points[1][0] + points[2][0]) / 3, (points[0][1] + points[1][1] + points[2][1]) / 3];

    // points |     x                          |
    // img        |   x                        |
    const x = Math.round((center[0] - aesthetic.pointDimensions.minX) / (aesthetic.pointDimensions.maxX - aesthetic.pointDimensions.minX) * aesthetic.sourceDimensions.width);
    const y = Math.round((center[1] - aesthetic.pointDimensions.minY) / (aesthetic.pointDimensions.maxY - aesthetic.pointDimensions.minY) * aesthetic.sourceDimensions.height);
    console.log(`Found x: ${x}, y: ${y} from x: ${center[0]}, y: ${center[1]}`, aesthetic.pointDimensions, aesthetic.sourceDimensions)
    const index = (aesthetic.sourceDimensions.width * y + x) * 4;
    const [r, g, b] = aesthetic.data.slice(index, index + 4);
    const start = chroma(r, g, b)
    console.log(`Found coord ${x},${y} (${index})has color ${start.hex()}`, r, g, b)
    const factor = y % 5 / 4;
    return {
        start: start.hex(),
        end: x % 2 === 0 ? start.brighten(factor) : start.darken(factor)
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        ...state.shapeData.triangles.find(t => t.id === ownProps.id),
        aesthetic: state.shapeData.aesthetic
    }
}
export default connect(mapStateToProps, {colorTriangle})(Triangle);