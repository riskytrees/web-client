'use strict';

const e = React.createElement;

class TreesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {

    return (
      <button onClick={() => this.setState({ liked: true })}>
        Like
      </button>
    )
  }
}

const domContainer = document.querySelector('#rt_trees_list_component');
ReactDOM.render(e(TreesList), domContainer);
