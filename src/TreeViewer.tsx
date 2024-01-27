import React from 'react';
import { Network } from "vis-network/peer";
import { DataSet } from "vis-data/peer";
import Container, { ContainerProps } from "@mui/material/Container";
import Paper from '@mui/material/Paper';
import TreeData from './interfaces/TreeData';

const MAX_NODE_TEXT_SIZE = 25

class TreeViewer extends React.Component<{
  treeMap: Record<string, TreeData>
  zoomLevel: number,
  onNodeClicked: Function;
  onZoomChanged: Function;
}, {
  treeMap: Record<string, TreeData>,
  network: Network | null
  debouncing: boolean;
  currentNode: Record<string, unknown> | null
}> {
  constructor(props) {
    super(props);
    this.state = { treeMap: this.props.treeMap, network: null, debouncing: false, currentNode: null };

    this.loadAndRender = this.loadAndRender.bind(this);
    this.updateZoom = this.updateZoom.bind(this);

  }

  getShapeForNodeType(nodeModelAttributes) {

    if (nodeModelAttributes && nodeModelAttributes['node_type'] && nodeModelAttributes['node_type']['value_string']) {
      if (nodeModelAttributes['node_type']['value_string'] === 'and') {
        return 'And';
      } else if (nodeModelAttributes['node_type']['value_string'] === 'or') {
        return 'Or';
      }
    }
    return 'Condition';
  }

  loadAndRender() {
    const nodes: Record<string, any>[] = [];
    const edges: Record<string, any>[] = [];

    for (const tree of Object.values(this.state.treeMap)) {
      for (const node of tree.nodes) {
        nodes.push({
          id: node.id,
          label: this.getShapeForNodeType(node.modelAttributes) + '---' + node.title,
          description: node.description,
          modelAttributes: node.modelAttributes,
          conditionAttribute: node.conditionAttribute,
          margin: 10,
          padding: 14,
          color: {
            border: '#DBDBDB',
            background: 'rgb(07, 07, 07)',
            highlight: {
              border: '#2B7CE9',
              background: '#D2E5FF'
            },
            hover: {
              border: '#2B7CE9',
              background: '#D2E5FF'
            }
          },

          font: {
            color: '#EEE',
            size: 10, // px
            face: 'Open Sans',
            background: 'none',
            strokeWidth: 0, // px
            strokeColor: '#ffffff',
            align: 'center',
            multi: false,
            vadjust: 0,
          },
          shape: 'custom',
          ctxRenderer: ({
            ctx,
            x,
            y,
            state: { selected, hover },
            style,
            label,
          }) => {
            const splittedLabel = label.split("---");
            ctx.save();
            ctx.restore();
            const labelText = splittedLabel[0];
            let valueText = splittedLabel[1];

            if (valueText.length > MAX_NODE_TEXT_SIZE) {
              valueText = valueText.substring(0, MAX_NODE_TEXT_SIZE) + '...'
            }

            let nodeColor = "#1F1DA2";
            let labelBGColor = "#0D0C4B";
            let nodeBGColor = "#090920";
            
            if (labelText === "And") { nodeColor = "#00FF38"; labelBGColor = "#154B0C"; nodeBGColor = "#0B1C09";  }
            if (labelText === "Condition") { nodeColor = "#1F1DA2"; labelBGColor = "#0D0C4B"; nodeBGColor = "#090920"; }
            if (labelText === "Or") { nodeColor = "#4E0943"; labelBGColor = "#4B0C45"; nodeBGColor = "#1A0818"; }

            if (selected) {
              nodeBGColor = labelBGColor;
            }

            const r = 5;

            ctx.font = "normal 11px sans-serif";
            const labelWidth = ctx.measureText(labelText).width;
            ctx.font = "normal 14px sans-serif";
            const valueWidth = ctx.measureText(valueText).width;

            const wPadding = 10;
            const hPadding = 10;

            const w = valueWidth + 20;
            const lw = labelWidth + 10
            const h = 40;
            const drawNode = () => {
              const r2d = Math.PI / 180;
              if (w - 2 * r < 0) {
                r = w / 2;
              } //ensure that the radius isn't too large for x
              if (h - 2 * r < 0) {
                r = h / 2;
              } //ensure that the radius isn't too large for y

              const top = y - h / 2;
              const left = x - w / 2;

              ctx.lineWidth = 2;

              ctx.beginPath();
              ctx.moveTo(left + r, top);
              ctx.lineTo(left + r, top - 16);
              ctx.lineTo(left + lw + r, top - 16);
              ctx.lineTo(left + lw + r, top);
              ctx.fillStyle = labelBGColor;
              ctx.fill();
              ctx.closePath();

              ctx.beginPath();
              ctx.moveTo(left + r, top);
              ctx.lineTo(left + w - r, top);
              ctx.arc(left + w - r, top + r, r, r2d * 270, r2d * 360, false);
              ctx.lineTo(left + w, top + h - r);
              ctx.arc(left + w - r, top + h - r, r, 0, r2d * 90, false);
              ctx.lineTo(left + r, top + h);
              ctx.arc(left + r, top + h - r, r, r2d * 90, r2d * 180, false);
              ctx.lineTo(left, top + r);
              ctx.arc(left + r, top + r, r, r2d * 180, r2d * 270, false);
              ctx.save();
              ctx.fillStyle = nodeBGColor;
              ctx.fill();
              ctx.strokeStyle = nodeColor;
              ctx.stroke();
              ctx.closePath();




              // label text
              ctx.font = "normal 11px sans-serif";
              ctx.fillStyle = "#eee";
              ctx.textAlign = "left";
              ctx.textBaseline = "middle";
              const textHeight1 = 12;
              ctx.fillText(
                labelText,
                left + 10,
                top - 8,

              );

              // value text
              ctx.font = "normal 14px sans-serif";
              ctx.fillStyle = "#eee";
              ctx.textAlign = "center";
              ctx.textBaseline = "bottom";
              const textHeight2 = 12;

              ctx.fillText(valueText, left + w / 2, top + h / 2 + hPadding,);
            };

            ctx.save();
            ctx.restore();
            return {
              drawNode,
              nodeDimensions: { width: w, height: h },
            };
          }
        })

        for (const child of node.children) {
          edges.push({
            from: node.id,
            to: child
          })
        }
      }
    }

    // create an array with nodes
    const visNodes = new DataSet(nodes);

    // create an array with edges
    var visEdges = new DataSet(edges);

    // create a network
    var container = document.getElementById("mynetwork");
    var data = {
      nodes: visNodes,
      edges: visEdges,
    };
    const options = {
      layout: {
        hierarchical: {
          direction: 'UD',
          sortMethod: 'directed',
          nodeSpacing: 150,
          levelSeparation: 100
        }
      },
      interaction: {
        dragNodes: false
      },
      physics: {
        enabled: false
      }
    }

    let getNodeById = (id, searchNodes) => {
      for (const node of searchNodes) {
        if (node.id === id) {
          return node;
        }
      }

      return null;
    }


    if (container) {
      let network = this.state.network ? this.state.network : new Network(container, data, options);

      if (this.state.network !== null) {
        let currentScale = network.getScale();
        let currentViewPos = network.getViewPosition();
        network.setData(data);
        network.setOptions(options)

        if (currentScale !== 1 || currentViewPos['x'] !== 0 || currentViewPos['y'] !== 0) {
          network.moveTo({
            position: currentViewPos,
            scale: currentScale
          })
        }

      }

      this.setState({
        network: network
      })

      network.on('click', (properties) => {
        var id = properties.nodes[0];
        let selectedNodes = [];
        let foundNode = false;
        for (const node of nodes) {
          if (node.id === id) {
            this.nodeClicked(node);
            foundNode = true;
            this.setState({
              currentNode: node
            })
          }
        }

        if (!foundNode) {
          this.nodeClicked(null);

        }
      });

      network.on('zoom', (zoomInfo) => {

        if (zoomInfo.scale < 0.5) {
          network.setOptions({
            interaction: {
              zoomView: false
            }
          })

          setTimeout(() => {
            network.setOptions({
              interaction: {
                zoomView: true
              }
            })
          }, 1000)
        } else {
          if (!this.state.debouncing) {
            this.setState({
              debouncing: true
            }, () => {
              this.props.onZoomChanged({
                "target": {
                  "value": zoomInfo.scale
                }
              })

              window.setTimeout(() => {
                this.setState({
                  debouncing: false
                })
              }, 10)
            })

          }

        }
      })

      let keydownListener = function (relevantNodes) {
        return function curried_func(event) {
          if (!this.state.debouncing) {
            this.setState({
              debouncing: true
            }, () => {
              window.setTimeout(() => {
                this.setState({
                  debouncing: false
                })
              }, 10)

              // do something here
              if (event.code === "ArrowUp") {
                let network = this.state.network;

                if (this.state.currentNode !== null) {
                  let connectedNodes = network?.getConnectedNodes(this.state.currentNode['id'] as string, 'from');

                  // There should be only one parent.
                  if (connectedNodes?.length === 1) {
                    let node = this.state.network.body.nodes[connectedNodes[0]].options;
                    this.nodeClicked(node);
                  }
                }
              } else if (event.code === "ArrowDown") {
                let network = this.state.network;

                if (this.state.currentNode !== null) {
                  let connectedNodes = network?.getConnectedNodes(this.state.currentNode['id'] as string, 'to');

                  if (connectedNodes.length > 0) {
                    let node = this.state.network.body.nodes[connectedNodes[0]].options;
                    this.nodeClicked(node);
                  }

                }
              } else if (event.code === "ArrowLeft") {
                let network = this.state.network;

                if (this.state.currentNode !== null) {
                  let connectedNodes = network?.getConnectedNodes(this.state.currentNode['id'] as string, 'from');
                  let selfNode = this.state.network.body.nodes[this.state.currentNode['id'] as string];

                  // There should be only one parent.
                  if (connectedNodes?.length === 1) {
                    let siblings = network?.getConnectedNodes(connectedNodes[0] as string, 'to');
                    let closetSiblingToLeft = null;

                    for (const siblingId of siblings) {
                      const sibling = this.state.network.body.nodes[siblingId];
                      if (sibling.id !== selfNode.id) {
                        if (closetSiblingToLeft === null || closetSiblingToLeft['x'] < sibling.x) {
                          if (sibling.x < selfNode.x) {
                            closetSiblingToLeft = sibling;

                          }
                        }
                      }
                    }

                    if (closetSiblingToLeft !== null) {
                      let node = this.state.network.body.nodes[closetSiblingToLeft['id']].options;
                      this.nodeClicked(node);
                    }
                  }

                }
              } else if (event.code === "ArrowRight") {
                let network = this.state.network;

                if (this.state.currentNode !== null) {
                  let connectedNodes = network?.getConnectedNodes(this.state.currentNode['id'] as string, 'from');
                  let selfNode = this.state.network.body.nodes[this.state.currentNode['id'] as string];

                  // There should be only one parent.
                  if (connectedNodes?.length === 1) {
                    let siblings = network?.getConnectedNodes(connectedNodes[0] as string, 'to');
                    let closetSiblingToRight = null;

                    for (const siblingId of siblings) {
                      const sibling = this.state.network.body.nodes[siblingId];
                      if (sibling.id !== selfNode.id) {
                        if (closetSiblingToRight === null || closetSiblingToRight['x'] > sibling.x) {
                          if (sibling.x > selfNode.x) {
                            closetSiblingToRight = sibling;
                          }
                        }
                      }
                    }

                    if (closetSiblingToRight !== null) {
                      let node = this.state.network.body.nodes[closetSiblingToRight['id']].options;
                      this.nodeClicked(node);
                    }
                  }

                }
              }

            })
          }


        }
      }
      container.addEventListener("keydown", keydownListener(nodes).bind(this));
    }
  }

  componentDidMount() {
    this.loadAndRender()
  }

  updateZoom(level: number) {
    let network = this.state.network;

    if (network !== null) {
      let currentViewPos = network.getViewPosition();

      if (currentViewPos['x'] !== 0 || currentViewPos['y'] !== 0) {
        network.moveTo({
          position: currentViewPos,
          scale: level
        })
      }

      this.setState({
        network: network
      })
    }
  }

  nodeClicked(node) {
    let nodeCopy: Record<string, unknown> | null = null;

    if (node) {
      // Now remove our title hack
      nodeCopy = { ...node } as Record<string, unknown>
      nodeCopy.label = node.label.split("---")[1]
    }

    if (this.props.onNodeClicked) {
      this.props.onNodeClicked(nodeCopy);
    }

    this.setState({
      currentNode: nodeCopy
    })
  }

  componentDidUpdate(prevProps) {
    if (JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
      if (this.props.treeMap) {
        this.setState({ treeMap: this.props.treeMap }, this.loadAndRender);
      }

      if (this.props.zoomLevel) {
        this.updateZoom(this.props.zoomLevel);
      }
    }
  }

  render() {
    return (
      <>

        {/*<div id="mynetwor" className='RiskyTree'></div> */}
        <Paper variant="treearea" id="mynetwork"></Paper>
      </>
    )
  }
}

export default TreeViewer;
