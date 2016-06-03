/* global $ global React global ReactDOM*/

//HexEdit
class HexEdit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: this.props.data,
            offset: 0,
            length: 0x200,
            chunks: [],
            selectedCellId: null,
            selectedCellPosition: 0
        };
        this.handleScroll = this.handleScroll.bind(this);
        this.handleCellEdit = this.handleCellEdit.bind(this);
        //this.handleKeyUp = this.handleKeyUp.bind(this);
		this.setData = this.setData.bind(this);

    }

    handleCellEdit(id, pos) {
        this.setState({
            selectedCellId: id,
            selectedCellPosition: pos
        });
        console.log(`id: ${id}, position: ${pos}`);
    }

    setData(cell, val) {
    	if (cell === null) return false;
    	var _data = this.state.data;
    	var _chunks = this.state.chunks;
    	
    	//(h * 0xF) + w
    	cell = cell.split(':');
    	var row = parseInt(cell[0], 10);
    	var col = parseInt(cell[1], 10);
    	
    	var pos = (row * 16) + (col);
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

    render() {

        var hexData = this.state.chunks.slice(this.state.offset, this.state.offset + 16).join().split(',');


        var hexViewData = {
            rowData: hexData,
            firstChunkIndex: this.state.offset,
        };

        var selectedCell = {
            handleCellEdit: this.handleCellEdit,
            selectedCellId: this.state.selectedCellId
        };

        return (
            <div onWheel={this.handleScroll}>
                <HexView data={hexViewData} selectedCell={selectedCell} handleCellEdit={this.setData} />
                <input type="file" id="hexview-input" onChange={this.test.bind(this)} />


            </div>
        );
    }
    componentDidMount() {


    }
    componentDidUpdate() {
        //console.log(this.state.data);

    }

    handleScroll(e) {
        //console.log(e.deltaY);

        if (e.deltaY >= 0) { //Down

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
    test() {

        var file = document.getElementById('hexview-input').files[0];
        //var file = $('#f-input')[0].files[0];

        var reader = new FileReader();
        reader.onload = function(e) {
            //this.state.data = reader.result;

            var _chunks = new Array();
            var _data = new Uint8Array(reader.result);

            for (var i = 0; i < Math.ceil(_data.length/16); i += 16) {
                _chunks.push(_data.slice(i, i+16));
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
}
HexEdit.propTypes = {

};
HexEdit.defaultProps = {

};

//
//
// HEXVIEW
//
//
class HexView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        //console.log(this.props.data);
        
        document.addEventListener('keyup', function(e) {
        	console.log('e.keyCode : ' + e.keyCode);
        	
        	//Set a variable with the key pressed, like A or 0;
        	var keyPressed = null;
        	
        	if ((e.keyCode >= 65 && e.keyCode <= 70) || (e.keyCode >= 48 && e.keyCode <= 57) ) {
        		keyPressed = String.fromCharCode(e.keyCode);
        	}
        	
        	//convert it from base 16 to base 10
        	var keyValue = parseInt(keyPressed, 16);

			//parseInt will set NaN on non-hex
        	if ( ! isNaN(keyValue)) {
        		this.props.handleCellEdit(this.props.selectedCell.selectedCellId, keyValue);
        	}
        	
           //parentHexEdit.setData(row, col, value);
           //keyCodes 65 - 70 = A-F
           
        }.bind(this));
    }

    setEditState(id) {
        this.setState({
            editId: id
        });
    }

    render() {
        
        
        
        var nodes = Array();

        var rows = Array();

        var row = Array();

        for (var i in this.props.data.rowData) {

            //var val = {"value": this.props.data[i]};
            //nodes.push(<HexRow data={val} key={i} />);

            if ((i % 16 == 0) && (i != 0)) {
                //var rowKey = (i / 16) - 1;
                var rowKey = (i / 16) + this.props.data.firstChunkIndex - 1;

                var rowData = {data: row, rowKey: rowKey};
                rows.push(
                    <HexRow data={rowData} key={rowKey} selectedCell={this.props.selectedCell} />
                );
                row = Array();
            }
            //var val = {"value": this.props.data[i]};
            var val = this.props.data.rowData[i];
            row.push(val);
        }
        //if (row.length)
            //rows.push(row);

            //console.log(nodes);

        return (
            <div className="hex-view">
                <div className="hex-head">
                    <div>00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F</div>
                </div>
                {rows}
            </div>
        );
    }
}
HexView.propTypes = {};
HexView.defaultProps = {};

//HexRow
class HexRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        //var cols = {};

        var cols = this.props.data.data.map(function(v, i){
            return (
                <HexCell data={v}  key={i} dataKey={this.props.data.rowKey + ':' + i}  selectedCell={this.props.selectedCell} />
            );
        }.bind(this));

        var offset = (this.props.data.rowKey << 4);
        offset = ("0000" + offset.toString(16)).substr(-4) + ':';

        return (
            <div className="hex-row">

                <span className="hex-col-start">{offset}</span>
                <div className="hex-data-row">
                    {cols}
                </div>
            </div>
        );
    }


}

//HexCell
class HexCell extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        if (this.props.selectedCell.selectedCellId == this.props.dataKey)
            this.props.selectedCell.handleCellEdit(null);
        else
            this.props.selectedCell.handleCellEdit(this.props.dataKey);
    }
    
    render() {
        var hVal = ("00" + parseInt(this.props.data, 10).toString(16)).substr(-2);

        var selected = this.props.selectedCell.selectedCellId == this.props.dataKey ? true : false;

        return (
            <span className={(selected ? 'edit ': '')  + 'hex-cell'} data-key={this.props.dataKey} onClick={this.handleClick}>{hVal}</span>
        );
    }

}
HexCell.propTypes = {};
HexCell.defaultProps = {};


/*global testData*/
$(function(){

	ReactDOM.render(
	  <HexEdit data={testData} />,
	  document.getElementById('n-hexview')
	);
});
