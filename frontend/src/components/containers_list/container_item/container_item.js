import React from "react";
import {Button, Card, Col, Collapse, notification, Popconfirm, Row, Table, Tag, Tooltip, Typography} from "antd";
import {CheckCircleOutlined, LoadingOutlined} from "@ant-design/icons";
import {container} from "../../../reducers/container_reducer";
import {containerInstanceTypes} from "../../../constants";
import UpdateContainerModal from "../update_container_modal";
import EditOutlined from "@ant-design/icons/lib/icons/EditOutlined";
import {internalApiURL} from "../../../config";
import axios from "axios";


const { Panel } = Collapse;
const { Title } = Typography;


class ContainerItem extends React.Component {

  state = {
    imageModalVisible: false,
    instanceModalVisible: false,
    scaleModalVisible: false,
    details: null,
  }

  componentDidMount() {
    this.loadState();
  }

  showImageModal = () => {
    this.setState({
      imageModalVisible: true,
    });
  };

  hideImageModal = () => {
    this.setState({
      imageModalVisible: false,
    })
  };

  showInstanceModal = () => {
    this.setState({
      instanceModalVisible: true,
    });
  };

  hideInstanceModal = () => {
    this.setState({
      instanceModalVisible: false,
    })
  };

  showScaleModal = () => {
    this.setState({
      scaleModalVisible: true,
    });
  };

  hideScaleModal = () => {
    this.setState({
      scaleModalVisible: false,
    })
  };

  loadState() {
    const endpoint = `${internalApiURL}/v1/container/${this.props.container.name}`;

    axios.get(endpoint)
      .then((response) => {

        this.setState({
          details: response.data,
        });
      }, (error) => {
        if (Math.floor(error.response.status /  100) === 4) {
          this.setState({
            details: {
              error: error.response.data.message,
              state: "UNKNOWN",
            }
          });
        } else {
          this.setState({
            details: {
              error: error.toString(),
              state: "UNKNOWN",
            }
          });
        }
      });
  }

  deleteContainer() {
    const endpoint = `${internalApiURL}/v1/container/${this.props.container.name}`;

    axios.delete(endpoint)
      .then((response) => {
        notification['success']({
          message: 'Container deleted',
        });
        this.props.reloadParent();
      }, (error) => {
        if (Math.floor(error.response.status /  100) === 4) {
          notification['error']({
            message: 'Failed to delete container',
            description: error.response.data.message,
          });
        } else {
          notification['error']({
            message: 'Failed to delete container',
            description: error.toString(),
          });
        }
      });
  }

  format_env(env) {
    let res = [];
    for (var k in env) {
      if (env.hasOwnProperty(k)) {
        res.push(
        <p>{k}={env[k]}</p>
        );
      }
    }
    return res
  }
  format_auth(auth) {
    let res = [];
    for (var k in auth) {
      if (auth.hasOwnProperty(k)) {
        res.push(
          <>{auth[k]}</>
        );
      }
    }
    return res
  }

  render() {

    let { name, url, instance_type, image, port, scale, env, auth } = this.props.container;

    let item_tag = "";

    if (!!this.state.details) {
      let tag_types = {
        "CREATING": "processing",
        "RUNNING": "success",
        "UPDATING": "processing",
        "ERROR": "error",
        "UNKNOWN": "error",
      };

      item_tag = (
        <Tag icon={<CheckCircleOutlined
          style={{fontSize: '18px'}} />}
             color={tag_types[this.state.details.state]}
             style={{fontSize: '15px', lineHeight: '26px', marginTop: '5px', marginBottom: '5px'}} >

          {this.state.details.state}
        </Tag>
      );
    }

    const isReady = !!this.state.details && this.state.details.state === "RUNNING";

    let dataSource = [
      {
        key: '1',
        name: 'State',
        value: (!!this.state.details ? item_tag : <LoadingOutlined />),
        edit: null,
      },
      {
        key: '2',
        name: 'URL',
        value: (<a href={url} target="_blank">{url}</a>),
        edit: null,
      },
      {
        key: '3',
        name: 'Container Port',
        value: port,
        edit: null,
      },
      {
        key: '4',
        name: 'Environment',
        value: this.format_env(env),
        edit: null,
      },
      {
        key: '5',
        name: 'Authenticated Registries',
        value: this.format_auth(auth),
        edit: null,
      },
      {
        key: '6',
        name: 'Instance',
        value: containerInstanceTypes.enumToName[instance_type],
        edit: (<EditOutlined onClick={this.showInstanceModal} style={{ fontSize: '20px'}}/>),
      },
      {
        key: '7',
        name: 'Image',
        value: image,
        edit: (<EditOutlined onClick={this.showImageModal} style={{ fontSize: '20px'}}/>),
      },
      {
        key: '8',
        name: 'Scale (Instances running)',
        value: scale,
        edit: (<EditOutlined onClick={this.showScaleModal} style={{ fontSize: '20px'}}/>),
      },
    ];
    if (!!this.state.details && !!this.state.details.error) {
      dataSource.push({
        key: '0',
        name: 'Error',
        value: this.state.details.error,
        edit: null,
      })
    }

    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Value',
        dataIndex: 'value',
        key: 'value',
      },
      {
        title: 'Edit',
        dataIndex: 'edit',
        key: 'edit',
      },
    ];

    return (
      <Collapse key={ name } style={{marginTop: 10}}>
        <Panel header={(
          <Row align="middle" justify="space-between">
            <Col>
              <Title level={4} style={{ margin: 0, height: '100%', float: 'left', marginRight: '10px', marginTop: '5px', marginBottom: '5px'}}>
                { name }
              </Title>
            </Col>
            <Popconfirm
              title="Are you sure you want delete this container?"
              onConfirm={() => this.deleteContainer()}
              onCancel={(e) => {e.stopPropagation()}}
              cancelText="No"
              okText="Yes"
              placement="bottomRight"
            >
              <Button type="primary" style={{marginTop: '5px', marginBottom: '5px'}} danger onClick={(e) => {e.stopPropagation()}}>
                Delete
              </Button>
            </Popconfirm>

          </Row>
        )}>
          <Table showHeader={false} dataSource={dataSource} columns={columns} pagination={false}/>
          <UpdateContainerModal
            container={this.props.container}
            visible={this.state.instanceModalVisible}
            hideModal={this.hideInstanceModal}
            instance={true}
          />
          <UpdateContainerModal
            container={this.props.container}
            visible={this.state.imageModalVisible}
            hideModal={this.hideImageModal}
            image={true}
          />
          <UpdateContainerModal
            container={this.props.container}
            visible={this.state.scaleModalVisible}
            hideModal={this.hideScaleModal}
            scale={true}
          />
        </Panel>
      </Collapse>
    )
  }
}

export default ContainerItem;