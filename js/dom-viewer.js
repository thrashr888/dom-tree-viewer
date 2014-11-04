(function () {

/*
  Contents:
  - Config
  - DOM selector caching
  - Create wrapper div
  - Load CSS file
  - DVNode
  - DBBranch
  - DVTree
  - DVContainer
  - DOM insertion
*/


// config
var HOSTNAME = '.';

// cache wrapper elements
var $html = document.getElementsByTagName('html')[0];
var $head = document.head;
var $body = document.getElementsByTagName('body')[0];

// create wrapper for React render
var $wrapper = document.createElement('div');
$wrapper.className = 'dom-viewer-wrapper'; // avoid className collision with host content
$body.appendChild($wrapper);

// Load our required CSS file
var $link = document.createElement('link');
$link.id = 'dom-viewer-styles';
$link.type = 'text/css';
$link.rel = 'stylesheet';
$link.href = HOSTNAME + '/css/main.css';
$head.appendChild($link);


// React Components

var DVNode = React.createClass({
  getInitialState: function() {
    return {selected: false};
  },

  handleNodeClick: function (e) {
    if (e.target.className === 'dv-expand-control') {
      return;
    }

    e.preventDefault();

    if (this.state.selected === false) {
      this.setState({selected: true});
    } else {
      this.setState({selected: false});
    }
  },

  render: function() {
    var level = this.props.level;

    var classSet = {
      'dv-node': true,
      'dv-selected': this.state.selected
    }
    classSet['dv-level-' + level] = true;
    var classes = React.addons.classSet(classSet);

    var text = this.props.target.textContent || this.props.target; // TODO truncate me

    return (
      <li className={classes} onClick={this.handleNodeClick}>
        <span>{text}</span>
      </li>
    );
  }
});


var DVBranch = React.createClass({
  getInitialState: function() {
    if (this.props.level === -1) {
      return {selected: false, expanded: true};
    } else {
      return {selected: false, expanded: false};
    }
  },

  handleExpandClick: function (e) {
    e.preventDefault();

    // commented out to allow expansion on private folders
    // if (this.props.isPrivate || this.props.target.childNodes.length === 0) {
    //   return;
    // }

    if (this.state.expanded === true) {
      this.setState({expanded: false});
    } else {
      this.setState({expanded: true});
    }
  },

  handleNodeClick: function (e) {
    if (e.target.className === 'dv-expand-control') {
      return;
    }

    e.preventDefault();

    if (this.state.selected === false) {
      this.setState({selected: true});
    } else {
      this.setState({selected: false});
    }
  },

  render: function() {
    // ceil makes it less likely that we'll match one in every list; ex. 1:5 chance for 4 nodes
    var rand = Math.ceil(Math.random() * this.props.target.childNodes.length);

    var level = this.props.level;

    // Kind of an Array methods polyfill for NodeLists
    var map = Array.prototype.map;
    var filter = Array.prototype.filter;

    // Don't map over DV's own DOM to avoid an infinite tree
    var Nodes = filter.call(this.props.target.childNodes, function (node) {
      // $wrapper.className set above
      if (node.className === $wrapper.className || node.id === $link.id) {
        return false;
      }
      return true;
    });
    // Choose Folder or File for each childNode
    var Nodes = map.call(Nodes, function(node, index){
      if (node.localName) {
        // console.log(node.localName, node.childNodes);
        var isPrivate = false;
        if (index === rand) {
            isPrivate = true; // TODO is this working?
        }
        // console.log(index === rand)
        return <DVBranch target={node} isPrivate={isPrivate} level={level + 1} />
      } else if (typeof node === 'String' || (node.nodeName === '#text' && node.textContent.trim() !== '')) {
        // console.log('DVNode', node);
        return <DVNode target={node} level={level + 1} />
      }
    });

    var classSet = {
      'dv-branch': true,
      'dv-expanded': this.state.expanded,
      'dv-expandable': this.props.target.childNodes.length > 0,
      'dv-selected': this.state.selected,
      'dv-private': this.props.isPrivate,
    }
    classSet['dv-level-' + level] = true;
    var classes = React.addons.classSet(classSet);

    return (
      <ul className={classes}>
        { this.props.level >= 0 ?
          <div className="dv-branch-node" onClick={this.handleNodeClick}>
            {this.props.target.childNodes.length > 0 ?
              <a className="dv-expand-control" href="#" onClick={this.handleExpandClick}></a>
              : <a className="dv-expand-control-empty" />}
            <span>{this.props.target.localName}</span>
          </div>
          : null
        }
        {Nodes}
      </ul>
    );
  }
});


var DVTree = React.createClass({
  render: function() {
    return (
      <div className="dv-tree">
        <DVBranch target={this.props.target} level={-1} />
      </div>
    );
  }
});


var DVContainer = React.createClass({
  getInitialState: function() {
    return {open: false};
  },

  handleCloseClick: function (e) {
    e.preventDefault();

    this.setState({open: false});

    // Cleanup ourselves
    $body.removeChild($wrapper);
    $head.removeChild($link);
  },

  componentDidMount: function () {
    setTimeout(function () {
      this.setState({open: true});
    }.bind(this), 1000);
  },

  render: function() {
    var classes = React.addons.classSet({
      'dv-container': true,
      'dv-open': this.state.open
    });

    return (
      <div className={classes}>
        <a className="dv-close" href="#" onClick={this.handleCloseClick}></a>
        <div className="dv-title">Title</div>
        <div className="dv-label">Label</div>
        <DVTree className="dv-tree" target={this.props.target}></DVTree>
        <div className="dv-footer"><a href="#">Link</a><button onClick={this.handleCloseClick}>Done</button></div>
      </div>
    );
  }
});


// delay a bit to let the target page load in dev
setTimeout(function () {
    React.render(
      <DVContainer target={$html}></DVContainer>,
      $wrapper
    );
}, 50);


})();