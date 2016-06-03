'use strict';

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
            selectedCellId: null,
            selectedCellPosition: 0
        };
        _this.handleScroll = _this.handleScroll.bind(_this);
        _this.handleCellEdit = _this.handleCellEdit.bind(_this);
        //this.handleKeyUp = this.handleKeyUp.bind(this);
        _this.setData = _this.setData.bind(_this);

        return _this;
    }

    _createClass(HexEdit, [{
        key: 'handleCellEdit',
        value: function handleCellEdit(id, pos) {
            this.setState({
                selectedCellId: id,
                selectedCellPosition: pos
            });
            console.log('id: ' + id + ', position: ' + pos);
        }
    }, {
        key: 'setData',
        value: function setData(cell, val) {
            if (cell === null) return false;
            var _data = this.state.data;
            var _chunks = this.state.chunks;

            //(h * 0xF) + w
            cell = cell.split(':');
            var row = parseInt(cell[0], 10);
            var col = parseInt(cell[1], 10);

            var pos = row * 16 + col;
            console.log('pos ' + pos);
            console.log('val ' + val);
            console.log(_data);

            val &= 0xFF;

            if (this.state.selectedCellPosition == 0) {
                val <<= 4;
            }

            //set main data
            _data[pos] = val;

            //set chunk (which is displayed)
            _chunks[row][col] = val;

            this.setState({ data: _data });
        }
    }, {
        key: 'render',
        value: function render() {

            var hexData = this.state.chunks.slice(this.state.offset, this.state.offset + 16).join().split(',');

            var hexViewData = {
                rowData: hexData,
                firstChunkIndex: this.state.offset
            };

            var selectedCell = {
                handleCellEdit: this.handleCellEdit,
                selectedCellId: this.state.selectedCellId
            };

            return React.createElement(
                'div',
                { onWheel: this.handleScroll },
                React.createElement(HexView, { data: hexViewData, selectedCell: selectedCell, handleCellEdit: this.setData }),
                React.createElement('input', { type: 'file', id: 'hexview-input', onChange: this.test.bind(this) })
            );
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {}
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            //console.log(this.state.data);

        }
    }, {
        key: 'handleScroll',
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
        key: 'test',
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
// HEXVIEW
//
//

var HexView = function (_React$Component2) {
    _inherits(HexView, _React$Component2);

    function HexView(props) {
        _classCallCheck(this, HexView);

        var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(HexView).call(this, props));

        _this2.state = {};

        //console.log(this.props.data);

        document.addEventListener('keyup', function (e) {
            console.log('e.keyCode : ' + e.keyCode);

            //Set a variable with the key pressed, like A or 0;
            var keyPressed = null;

            if (e.keyCode >= 65 && e.keyCode <= 70 || e.keyCode >= 48 && e.keyCode <= 57) {
                keyPressed = String.fromCharCode(e.keyCode);
            }

            //convert it from base 16 to base 10
            var keyValue = parseInt(keyPressed, 16);

            //parseInt will set NaN on non-hex
            if (!isNaN(keyValue)) {
                this.props.handleCellEdit(this.props.selectedCell.selectedCellId, keyValue);
            }

            //parentHexEdit.setData(row, col, value);
            //keyCodes 65 - 70 = A-F
        }.bind(_this2));
        return _this2;
    }

    _createClass(HexView, [{
        key: 'setEditState',
        value: function setEditState(id) {
            this.setState({
                editId: id
            });
        }
    }, {
        key: 'render',
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
                'div',
                { className: 'hex-view' },
                React.createElement(
                    'div',
                    { className: 'hex-head' },
                    React.createElement(
                        'div',
                        null,
                        '00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F'
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
        key: 'render',
        value: function render() {
            //var cols = {};

            var cols = this.props.data.data.map(function (v, i) {
                return React.createElement(HexCell, { data: v, key: i, dataKey: this.props.data.rowKey + ':' + i, selectedCell: this.props.selectedCell });
            }.bind(this));

            var offset = this.props.data.rowKey << 4;
            offset = ("0000" + offset.toString(16)).substr(-4) + ':';

            return React.createElement(
                'div',
                { className: 'hex-row' },
                React.createElement(
                    'span',
                    { className: 'hex-col-start' },
                    offset
                ),
                React.createElement(
                    'div',
                    { className: 'hex-data-row' },
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
        key: 'handleClick',
        value: function handleClick() {
            if (this.props.selectedCell.selectedCellId == this.props.dataKey) this.props.selectedCell.handleCellEdit(null);else this.props.selectedCell.handleCellEdit(this.props.dataKey);
        }
    }, {
        key: 'render',
        value: function render() {
            var hVal = ("00" + parseInt(this.props.data, 10).toString(16)).substr(-2);

            var selected = this.props.selectedCell.selectedCellId == this.props.dataKey ? true : false;

            return React.createElement(
                'span',
                { className: (selected ? 'edit ' : '') + 'hex-cell', 'data-key': this.props.dataKey, onClick: this.handleClick },
                hVal
            );
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