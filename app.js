"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* global $ global React global ReactDOM*/

//HexEdit

var HexEdit = function (_React$Component) {
    _inherits(HexEdit, _React$Component);

    function HexEdit(props) {
        _classCallCheck(this, HexEdit);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HexEdit).call(this, props));

        _this.state = {
            data: _this.props.data,
            offset: 0,
            length: 0x200,
            chunks: [],
            selectedCellId: null
        };
        _this.handleScroll = _this.handleScroll.bind(_this);
        _this.handleSelectedCell = _this.handleSelectedCell.bind(_this);
        _this.handleKeyDown = _this.handleKeyDown.bind(_this);

        return _this;
    }

    _createClass(HexEdit, [{
        key: "handleSelectedCell",
        value: function handleSelectedCell(id) {
            this.setState({
                selectedCellId: id
            });
            console.log(id);
        }
    }, {
        key: "handleKeyDown",
        value: function handleKeyDown(e) {
            console.log(e);
        }
    }, {
        key: "render",
        value: function render() {

            var hexData = this.state.chunks.slice(this.state.offset, this.state.offset + 16).join().split(',');

            var hexViewData = {
                rowData: hexData,
                firstChunkIndex: this.state.offset
            };

            var selectedCell = {
                handleSelectedCell: this.handleSelectedCell,
                selectedCellId: this.state.selectedCellId
            };

            return React.createElement(
                "div",
                { onWheel: this.handleScroll },
                React.createElement(HexView, { data: hexViewData, selectedCell: selectedCell, onKeyDown: this.handleKeyDown }),
                React.createElement("input", { type: "file", id: "hexview-input", onChange: this.test.bind(this) })
            );
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {}
    }, {
        key: "componentDidUpdate",
        value: function componentDidUpdate() {
            //console.log(this.state.data);

        }
    }, {
        key: "handleScroll",
        value: function handleScroll(e) {
            //console.log(e.deltaY);

            if (e.deltaY >= 0) {
                //Down

                this.setState({
                    offset: Math.min(this.state.data.length, this.state.offset + 1)
                });
            } else {
                this.setState({
                    offset: Math.max(0, this.state.offset - 1)
                });
            }
            //console.log(e);
            e.preventDefault();
        }
    }, {
        key: "test",
        value: function test() {

            var file = document.getElementById('hexview-input').files[0];
            //var file = $('#f-input')[0].files[0];

            var reader = new FileReader();
            reader.onload = function (e) {
                //this.state.data = reader.result;

                var _chunks = new Array();
                var _data = new Uint8Array(reader.result);

                for (var i = 0; i < Math.ceil(_data.length / 16); i += 16) {
                    _chunks.push(_data.slice(i, i + 16));
                }

                this.setState({
                    data: _data,
                    chunks: _chunks
                });

                //this.setState(reader.result);
                //$('#test-container').html( BuildHexView(new Uint8Array(reader.result)) );
                //ReactDOM.render(React.createElement(HexEdit, { data: reader.result }), document.getElementById('n-hexview'));
            }.bind(this);

            reader.readAsArrayBuffer(file);
        }
    }]);

    return HexEdit;
}(React.Component);

HexEdit.propTypes = {};
HexEdit.defaultProps = {};

//
//
//
//HEXVIEW

var HexView = function (_React$Component2) {
    _inherits(HexView, _React$Component2);

    function HexView(props) {
        _classCallCheck(this, HexView);

        var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(HexView).call(this, props));

        _this2.state = {};

        //console.log(this.props.data);
        return _this2;
    }

    _createClass(HexView, [{
        key: "setEditState",
        value: function setEditState(id) {
            this.setState({
                editId: id
            });
        }
    }, {
        key: "render",
        value: function render() {

            var nodes = Array();

            var rows = Array();

            var row = Array();

            for (var i in this.props.data.rowData) {

                //var val = {"value": this.props.data[i]};
                //nodes.push(<HexRow data={val} key={i} />);

                if (i % 16 == 0 && i != 0) {
                    //var rowKey = (i / 16) - 1;
                    var rowKey = i / 16 + this.props.data.firstChunkIndex - 1;

                    var rowData = { data: row, rowKey: rowKey };
                    rows.push(React.createElement(HexRow, { data: rowData, key: rowKey, selectedCell: this.props.selectedCell }));
                    row = Array();
                }
                //var val = {"value": this.props.data[i]};
                var val = this.props.data.rowData[i];
                row.push(val);
            }
            //if (row.length)
            //rows.push(row);

            //console.log(nodes);

            return React.createElement(
                "div",
                { className: "hex-view" },
                React.createElement(
                    "div",
                    { className: "hex-head" },
                    React.createElement(
                        "div",
                        null,
                        "00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F"
                    )
                ),
                rows
            );
        }
    }]);

    return HexView;
}(React.Component);

HexView.propTypes = {};
HexView.defaultProps = {};

//HexRow

var HexRow = function (_React$Component3) {
    _inherits(HexRow, _React$Component3);

    function HexRow(props) {
        _classCallCheck(this, HexRow);

        var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(HexRow).call(this, props));

        _this3.state = {};
        return _this3;
    }

    _createClass(HexRow, [{
        key: "render",
        value: function render() {
            //var cols = {};

            var cols = this.props.data.data.map(function (v, i) {
                return React.createElement(HexCell, { data: v, key: i, dataKey: this.props.data.rowKey + ':' + i, selectedCell: this.props.selectedCell });
            }.bind(this));

            var offset = this.props.data.rowKey << 4;
            offset = ("0000" + offset.toString(16)).substr(-4) + ':';

            return React.createElement(
                "div",
                { className: "hex-row" },
                React.createElement(
                    "span",
                    { className: "hex-col-start" },
                    offset
                ),
                React.createElement(
                    "div",
                    { className: "hex-data-row" },
                    cols
                )
            );
        }
    }]);

    return HexRow;
}(React.Component);

//HexCell


var HexCell = function (_React$Component4) {
    _inherits(HexCell, _React$Component4);

    function HexCell(props) {
        _classCallCheck(this, HexCell);

        var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(HexCell).call(this, props));

        _this4.state = {};

        _this4.handleClick = _this4.handleClick.bind(_this4);
        return _this4;
    }

    _createClass(HexCell, [{
        key: "render",
        value: function render() {
            var hVal = ("00" + parseInt(this.props.data).toString(16)).substr(-2);

            var selected = this.props.selectedCell.selectedCellId == this.props.dataKey ? true : false;

            return(
                /*<input type="text" className="hex-cell" value={hVal} />*/
                React.createElement(
                    "span",
                    { className: (selected ? 'edit ' : '') + 'hex-cell', "data-key": this.props.dataKey, onClick: this.handleClick },
                    hVal
                )
            );
        }
    }, {
        key: "handleClick",
        value: function handleClick() {
            //do click stuff
            if (this.props.selectedCell.selectedCellId == this.props.dataKey) this.props.selectedCell.handleSelectedCell(null);else this.props.selectedCell.handleSelectedCell(this.props.dataKey);
        }
    }, {
        key: "handleKeyDown",
        value: function handleKeyDown() {
            //key stuff

        }
    }]);

    return HexCell;
}(React.Component);

HexCell.propTypes = {};
HexCell.defaultProps = {};

/*global testData*/
$(function () {

    ReactDOM.render(React.createElement(HexEdit, { data: testData }), document.getElementById('n-hexview'));
});