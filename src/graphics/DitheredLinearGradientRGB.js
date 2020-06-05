import chroma from "chroma-js";

/*
Dan Gries
rectangleworld.com
Nov 19 2012

Uses Floyd-Steinberg dither algorithm.
*/

class DitheredLinearGradient {
    constructor(x0, y0, x1, y1) {
        this.x0 = x0;
        this.y0 = y0;
        this.x1 = x1;
        this.y1 = y1;
        this.colorStops = [];
    }

    addColorStop(ratio, color) {
        if ((ratio < 0) || (ratio > 1)) {
            return;
        }
        const [r, g, b] = chroma(color)
            .rgb();
        const newStop = {ratio, r, g, b};
        if ((ratio >= 0) && (ratio <= 1)) {
            if (this.colorStops.length === 0) {
                this.colorStops.push(newStop);
            } else {
                let i = 0;
                let found = false;
                let len = this.colorStops.length;
                //search for proper place to put stop in order.
                while ((!found) && (i < len)) {
                    found = (ratio <= this.colorStops[i].ratio);
                    if (!found) {
                        i++;
                    }
                }
                //add stop - remove next one if duplicate ratio
                if (!found) {
                    //place at end
                    this.colorStops.push(newStop);
                } else {
                    if (ratio === this.colorStops[i].ratio) {
                        //replace
                        this.colorStops.splice(i, 1, newStop);
                    } else {
                        this.colorStops.splice(i, 0, newStop);
                    }
                }
            }
        }
    }

    fillRect(ctx, rectX0, rectY0, rectW, rectH) {

        if (this.colorStops.length === 0) {
            return;
        }

        let image = ctx.getImageData(rectX0, rectY0, rectW, rectH);
        let pixelData = image.data;
        let len = pixelData.length;
        let nearestValue;
        let quantError;
        let x;
        let y;

        let vx = this.x1 - this.x0;
        let vy = this.y1 - this.y0;
        let vMagSquareRecip = 1 / (vx * vx + vy * vy);
        let ratio;

        let r, g, b;
        let r0, g0, b0, r1, g1, b1;
        let ratio0, ratio1;
        let f;
        let stopNumber;
        let found;
        let q;

        let rBuffer = [];
        let gBuffer = [];
        let bBuffer = [];

        //first complete color stops with 0 and 1 ratios if not already present
        if (this.colorStops[0].ratio !== 0) {
            const newStop = {
                ratio: 0,
                r: this.colorStops[0].r,
                g: this.colorStops[0].g,
                b: this.colorStops[0].b
            }
            this.colorStops.splice(0, 0, newStop);
        }
        if (this.colorStops[this.colorStops.length - 1].ratio !== 1) {
            const newStop = {
                ratio: 1,
                r: this.colorStops[this.colorStops.length - 1].r,
                g: this.colorStops[this.colorStops.length - 1].g,
                b: this.colorStops[this.colorStops.length - 1].b
            }
            this.colorStops.push(newStop);
        }

        //create float valued gradient
        for (let i = 0; i < len / 4; i++) {

            x = rectX0 + (i % rectW);
            y = rectY0 + Math.floor(i / rectW);

            ratio = (vx * (x - this.x0) + vy * (y - this.y0)) * vMagSquareRecip;
            if (ratio < 0) {
                ratio = 0;
            } else if (ratio > 1) {
                ratio = 1;
            }

            //find out what two stops this is between
            if (ratio === 1) {
                stopNumber = this.colorStops.length - 1;
            } else {
                stopNumber = 0;
                found = false;
                while (!found) {
                    found = (ratio < this.colorStops[stopNumber].ratio);
                    if (!found) {
                        stopNumber++;
                    }
                }
            }

            //calculate color.
            r0 = this.colorStops[stopNumber - 1].r;
            g0 = this.colorStops[stopNumber - 1].g;
            b0 = this.colorStops[stopNumber - 1].b;
            r1 = this.colorStops[stopNumber].r;
            g1 = this.colorStops[stopNumber].g;
            b1 = this.colorStops[stopNumber].b;
            ratio0 = this.colorStops[stopNumber - 1].ratio;
            ratio1 = this.colorStops[stopNumber].ratio;

            f = (ratio - ratio0) / (ratio1 - ratio0);
            r = r0 + (r1 - r0) * f;
            g = g0 + (g1 - g0) * f;
            b = b0 + (b1 - b0) * f;

            //set color as float values in buffer arrays
            rBuffer.push(r);
            gBuffer.push(g);
            bBuffer.push(b);
        }

        //While converting floats to integer valued color values, apply Floyd-Steinberg dither.
        for (let i = 0; i < len / 4; i++) {
            nearestValue = ~~(rBuffer[i]);
            quantError = rBuffer[i] - nearestValue;
            rBuffer[i + 1] += 7 / 16 * quantError;
            rBuffer[i - 1 + rectW] += 3 / 16 * quantError;
            rBuffer[i + rectW] += 5 / 16 * quantError;
            rBuffer[i + 1 + rectW] += 1 / 16 * quantError;

            nearestValue = ~~(gBuffer[i]);
            quantError = gBuffer[i] - nearestValue;
            gBuffer[i + 1] += 7 / 16 * quantError;
            gBuffer[i - 1 + rectW] += 3 / 16 * quantError;
            gBuffer[i + rectW] += 5 / 16 * quantError;
            gBuffer[i + 1 + rectW] += 1 / 16 * quantError;

            nearestValue = ~~(bBuffer[i]);
            quantError = bBuffer[i] - nearestValue;
            bBuffer[i + 1] += 7 / 16 * quantError;
            bBuffer[i - 1 + rectW] += 3 / 16 * quantError;
            bBuffer[i + rectW] += 5 / 16 * quantError;
            bBuffer[i + 1 + rectW] += 1 / 16 * quantError;
        }

        //copy to pixel data
        for (let i = 0; i < len - 4 * rectW; i += 4) {
            q = i / 4;
            pixelData[i] = ~~rBuffer[q];
            pixelData[i + 1] = ~~gBuffer[q];
            pixelData[i + 2] = ~~bBuffer[q];
            pixelData[i + 3] = 255;
        }

        ctx.putImageData(image, 0, 0);

    }
}

export default DitheredLinearGradient;