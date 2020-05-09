import {Graphics, Matrix, Polygon, Texture} from 'pixi.js';
import {PixiComponent} from '@inlet/react-pixi';
import {connect} from "react-redux";
import {colorTriangle} from "../redux/actions/triangles";

function gradient(from, to, orientation) {
    const c = document.createElement("canvas");
    console.log(from, to, orientation)
    c.width=512
    c.height=512
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
    ctx.fillRect(0,0,512,512);
    return Texture.from(c);
}

const Triangle = PixiComponent('Triangle', {
    create: props => new Graphics(),
    applyProps: (instance, _, newProps) => {
        const {points, id, fill, colorTriangle, sideLengths, altitudes} = newProps;
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
        const texture = gradient(fill.start, fill.end, fill.rotation);
        // console.log(texture, texture.valid, texture.baseTexture.width, texture.orig.width, texture.orig.height, texture.width, texture.height)


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

const mapStateToProps = (state, ownProps) => {
    return {...state.shapeData.triangles.find(t => t.id === ownProps.id)}
}
export default connect(mapStateToProps, {colorTriangle})(Triangle);