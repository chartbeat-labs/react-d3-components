import React, { PropTypes } from 'react';
import d3 from 'd3';

import Chart from './Chart';
import Axis from './Axis';
import Path from './Path';
import Tooltip from './Tooltip';

import LineChart, { DataSet } from './LineChart';


const PointSet = React.createClass({
    propTypes: {
        data: PropTypes.array.isRequired,
        colorScale: PropTypes.func.isRequired,
        xScale: PropTypes.func.isRequired,
        yScale: PropTypes.func.isRequired,
    },

    render() {
        const {
            data,
            xScale,
            yScale,
            colorScale,
            values,
            label,
            onMouseEnter,
            onMouseLeave
        } = this.props;

        const circles = data.map((stack) => {
            var point = stack.values[stack.values.length - 1];

            return (
                <g className="line_group" key={`${label(stack)}`}>
                    <circle
                        key={`${label(stack)}.point`}
                        className={'point'}
                        cx={xScale(point.x)}
                        cy={yScale(point.y)}
                        r={3}
                        fill={colorScale(label(stack))}
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                    />
                    <text
                        className="label"
                        x={xScale(point.x)}
                        y={yScale(point.y)}
                        fill={colorScale(label(stack))}
                    >
                        {label(stack)}
                    </text>
                </g>
            );
        });

        return (<g>{circles}</g>);
    }
});


class PointLineChart extends LineChart {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            height,
            width,
            margin,
            colorScale,
            interpolate,
            defined,
            stroke,
            values,
            label,
            x,
            y,
            xAxis,
            yAxis,
            shape,
            shapeColor
        } = this.props;

        const data = this._data;
        const innerWidth = this._innerWidth;
        const innerHeight = this._innerHeight;
        const xScale = this._xScale;
        const yScale = this._yScale;
        const xIntercept = this._xIntercept;
        const yIntercept = this._yIntercept;

        const line = d3.svg.line()
            .x(e => xScale(x(e)))
            .y(e => yScale(y(e)))
            .interpolate(interpolate)
            .defined(defined);

        let tooltipSymbol = this.state.tooltip.hidden ? null : this.genTooltip();

        return (
            <div>
                <Chart height={height} width={width} margin={margin}>
                    <Axis
                        className="x axis"
                        orientation="bottom"
                        scale={xScale}
                        height={innerHeight}
                        width={innerWidth}
                        zero={yIntercept}
                        {...xAxis}
                    />
                    <Axis
                        className="y axis"
                        orientation="left"
                        scale={yScale}
                        height={innerHeight}
                        width={innerWidth}
                        zero={xIntercept}
                        {...yAxis}
                    />
                    <DataSet
                        height={innerHeight}
                        width={innerWidth}
                        data={data}
                        line={line}
                        colorScale={colorScale}
                        values={values}
                        label={label}
                        onMouseEnter={this.onMouseEnter}
                        onMouseLeave={this.onMouseLeave}
                        {...stroke}
                    />
                    <PointSet
                        data={data}
                        colorScale={colorScale}
                        values={values}
                        label={label}
                        xScale={xScale}
                        yScale={yScale}
                        onMouseEnter={this.onMouseEnter}
                        onMouseLeave={this.onMouseLeave}
                    />
                    {this.props.children}
                    {tooltipSymbol}
                </Chart>
                <Tooltip {...this.state.tooltip} />
            </div>
        );
    }
}

export default PointLineChart;
