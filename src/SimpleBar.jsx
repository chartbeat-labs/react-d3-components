import React, { PropTypes, Component } from 'react';

import Chart from './Chart';
import Bar from './Bar';

import DefaultPropsMixin from './DefaultPropsMixin';
import HeightWidthMixin from './HeightWidthMixin';
import ArrayifyMixin from './ArrayifyMixin';
import StackAccessorMixin from './StackAccessorMixin';
import StackDataMixin from './StackDataMixin';
import DefaultScalesMixin from './DefaultScalesMixin';
import TooltipMixin from './TooltipMixin';


const DataSet = React.createClass({
    propTypes: {
        data: PropTypes.array.isRequired,
        xScale: PropTypes.func.isRequired,
        yScale: PropTypes.func.isRequired,
        colorScale: PropTypes.func.isRequired,
        values: PropTypes.func.isRequired,
        label: PropTypes.func.isRequired,
        x: PropTypes.func.isRequired,
        y: PropTypes.func.isRequired,
        y0: PropTypes.func.isRequired,
    },

    render() {
        const {
            data, xScale, yScale, colorScale, values, label, x, y, y0,
            onMouseEnter, onMouseLeave, colorByLabel} = this.props;

        let bars = data.map(stack => values(stack).map((e, index) => {
            const color = colorByLabel ?
                          colorScale(label(stack)) :
                          colorScale(x(e));

            return (
                <g className="bar_group"
                   key={`${label(stack)}.${index}`}>
                    <Bar
                        height={xScale.range()}
                        width={yScale(y(e))}
                        x={yScale(y0(e))}
                        y={xScale(x(e))}
                        fill={color}
                        data={e}
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                    />
                    <text
                        className="label"
                        x={yScale(y0(e))}
                        y={xScale(x(e))}
                        fill={color}>
                        {label(stack)}
                    </text>
                    <text
                        className="percent"
                        x={yScale(y0(e))}
                        y={xScale(x(e))}>
                        {`${Math.round(y(e) / yScale.domain()[1] * 100)}%`}
                    </text>
                </g>
            );
        }));
        return <g>{bars}</g>
    }
});


const SimpleBar = React.createClass({
    mixins: [
        DefaultPropsMixin,
        HeightWidthMixin,
        ArrayifyMixin,
        StackAccessorMixin,
        StackDataMixin,
        DefaultScalesMixin,
        TooltipMixin
    ],

    getDefaultProps() {
        return {
            colorByLabel: true
        };
    },

    render() {
        const {
            height, width, margin, colorScale, values, label,
            x, y, y0, colorByLabel, tickFormat} = this.props;

        const data = this._data;
        const innerWidth = this._innerWidth;
        const innerHeight = this._innerHeight;
        const yScale = this._yScale;
        const xScale = this._xScale;

        // Flip scales to allow left -> right instead of bottom -> top
        yScale.range = yScale.range([0, width]);
        xScale.range = xScale.range([0, height]);

        return (
            <div>
                <Chart height={height} width={width} margin={margin}>
                    <DataSet
                        data={data}
                        xScale={xScale}
                        yScale={yScale}
                        colorScale={colorScale}
                        values={values}
                        label={label}
                        x={x}
                        y={y}
                        y0={y0}
                        onMouseEnter={this.onMouseEnter}
                        onMouseLeave={this.onMouseLeave}
                        colorByLabel={colorByLabel}
                    />
                    {this.props.children}
                </Chart>
            </div>
        )
    }
});

export default SimpleBar;
