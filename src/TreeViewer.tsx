import React from 'react';
import { Network } from "vis-network/peer";
import { DataSet } from "vis-data/peer";
import Container, { ContainerProps } from "@mui/material/Container";
import Paper from '@mui/material/Paper';
import TreeData from './interfaces/TreeData';



class TreeViewer extends React.Component<{
  treeMap: Record<string, TreeData>

  onNodeClicked: Function;
}, {
  treeMap: Record<string, TreeData>
}> {
  constructor(props) {
    super(props);
    this.state = { treeMap: this.props.treeMap };

    this.loadAndRender = this.loadAndRender.bind(this);

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
          size: 25,
          margin:10,
          padding:14,
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
            const valueText = splittedLabel[1];
            let nodeColor = "#1F1DA2";
            let labelBGColor = "#0D0C4B";
            let nodeBGColor = "#090920";
              if (labelText === "And"){nodeColor = "#00FF38";labelBGColor = "#154B0C";nodeBGColor="#0B1C09";}
              if (labelText === "Condition"){nodeColor = "#1F1DA2";labelBGColor = "#0D0C4B";nodeBGColor="#090920"}
              if (labelText === "Or"){nodeColor = "#4E0943";labelBGColor = "#4B0C45";nodeBGColor = "#1A0818"}


              
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
              ctx.moveTo(left + r , top);
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
    
              ctx.fillText(valueText, left + w / 2, top + h / 2 + hPadding, );
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
      interaction: { dragNodes: false },
      physics: {
        enabled: false
      }
    }

    if (container) {
      let network = new Network(container, data, options);
      network.on('click', (properties) => {
         var id = properties.nodes[0];
         let selectedNodes = [];
         let foundNode = false;
         for (const node of nodes) {
           if (node.id === id) {
             // Now remove our title hack
             console.log(node)
             let nodeCopy = {...node}
             nodeCopy.label = node.label.split("---")[1]
             this.nodeClicked(nodeCopy);
             foundNode = true;
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
        }
      })
    }    
  }

  componentDidMount() {
    this.loadAndRender()
  }

  nodeClicked(node) {
    if (this.props.onNodeClicked) {
      this.props.onNodeClicked(node);
    }
  }

  componentDidUpdate(prevProps) {
    if (JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
      if (this.props.treeMap) {
        this.setState ({ treeMap: this.props.treeMap }, this.loadAndRender);
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
