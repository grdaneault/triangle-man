import {Graphics, Matrix, Polygon} from 'pixi.js';
import {PixiComponent} from '@inlet/react-pixi';
import {connect} from "react-redux";
import {addPointAndUpdateTriangles, colorTriangle} from "../redux/actions";
import {createGradientTexture} from "../graphics";

const defaultGradient = createGradientTexture('#DDDDDD', '#FFFFFF', 256)

const Triangle = PixiComponent('Triangle', {
    create: _ => new Graphics(),
    applyProps: (instance, oldProps, newProps) => {
        const {points, sideLengths, altitudes, fill, addPointAndUpdateTriangles} = newProps;
        if (!points) {
            // not sure why this update is happening, but the triangles seem to be attempting to update to a no-data state on regen.
            return;
        }
        let longestSide = 0;
        for (let i = 0; i < 3; i++) {
            if (sideLengths[longestSide] < sideLengths[i]) {
                longestSide = i;
            }
        }

        const slope = (points[(longestSide + 1) % 3].y - points[longestSide].y) / (points[(longestSide + 1) % 3].x - points[longestSide].x)
        const tri = new Polygon(points);
        tri.interactive = true;

        instance.interactive = true;
        instance.hitArea = tri;
        instance.buttonMode = true;
        instance.click = (e) => {
            addPointAndUpdateTriangles(e.data.global.x, e.data.global.y);
        }

        const resolution = 256;
        let texture = fill ? fill : defaultGradient;
        // console.log(texture, texture.valid, texture.baseTexture.width, texture.orig.width, texture.orig.height, texture.width, texture.height)
        // texture = Texture.from(uv)


        instance.clear()
            .beginTextureFill({
                // texture: ,
                texture: texture,
                matrix: new Matrix()
                    .scale(sideLengths[longestSide] / resolution * Math.sign(slope), altitudes[longestSide] / resolution * Math.sign(slope))
                    .rotate(Math.atan(slope))
                    .translate(points[(longestSide + 1) % 3].x, points[(longestSide + 1) % 3].y)
                // .rotate(Math.atan(slope))

            })
            .drawPolygon(tri)
            .endFill();

    }
});

const mapStateToProps = (state, ownProps) => {
    return {
        ...state.triangles.find(t => t.id === ownProps.id),
    }
}
export default connect(mapStateToProps, {colorTriangle, addPointAndUpdateTriangles})(Triangle);