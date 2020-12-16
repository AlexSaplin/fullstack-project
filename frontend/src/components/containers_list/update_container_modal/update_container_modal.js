import React from "react";
import {Alert, Button, Checkbox, Form, Input, InputNumber, Modal, Select, Tooltip} from "antd";
import {internalApiURL} from "../../../config";
import axios from "axios";
import {ContainerActions} from "../../../actions";
import {connect} from "react-redux";
import {containerInstanceTypes} from "../../../constants";


class NewContainerModalUnwrapped extends React.Component {

  state = {
    confirmLoading: false,
    generalFormError: "",
  };

  formRef = React.createRef();

  handleOk = () => {
    this.setState({
      confirmLoading: true,
    });

    let data = {}
    if (this.props.image) {
      data['image'] = this.formRef.current.getFieldValue('image');
    }
    if (this.props.instance) {
      data['instance_type'] = this.formRef.current.getFieldValue('instance');
    }
    if (this.props.scale) {
      data['scale'] = this.formRef.current.getFieldValue('scale');
    }


    const endpoint = `${internalApiURL}/v1/container/${this.props.container.name}`;

    axios.patch(endpoint, data).then((_) => {
      this.props.get_containers_list();
      this.props.hideModal();

      this.setState({
        generalFormError: "",
        confirmLoading: false,
      });
      // this.formRef.current.resetFields();

    }, (error) => {
      if (error.response.status === 400) {
        this.setState({
          generalFormError: error.response.data.message,
          confirmLoading: false,
        })
      } else {
        this.setState({
          generalFormError: error.toString(),
          confirmLoading: false,
        })
      }
    });
  };

  handleCancel = () => {
    this.props.hideModal();
  };

  render() {
    const { confirmLoading } = this.state;

    const layout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };

    const form = (
      <Form
        {...layout}
        name="basic"
        initialValues={{
          remember: true,
        }}
        ref={this.formRef}
      >

        { this.props.image &&
          <Form.Item
            label="Docker Image"
            name="image"
            placeholder={this.props.container.image}
            rules={[
              {
                required: true,
                message: 'Docker image must be present',
              },
            ]}
          >
            <Input/>
          </Form.Item>
        }

        { this.props.instance &&
          <Form.Item
            label="Instance Size"
            name="instance"
            placeholder={containerInstanceTypes.enumToName[this.props.container.instance_type]}
            rules={[
              {
                required: true,
                message: 'Instance size must be present',
              },
            ]}
          >
            <Select>
              <Select.Option value="starter">Starter: 1 CPU / 2 GB</Select.Option>
              <Select.Option value="inference">Inference: 4 CPU / 12 GB / Tesla T4</Select.Option>
              {//
                //<Select.Option value="inference_pro">Inference PRO: 16 CPU / 64 GB / Tesla T4 </Select.Option>
              }
            </Select>
          </Form.Item>
        }
        {
          this.props.scale &&
          <Form.Item
            label="Desired Scale"
            name="scale"
            initialValue={this.props.container.scale}
            rules={[
              {
                required: true,
                message: 'Scale must be present',
              },
            ]}
          >
            <InputNumber min={1} max={10} />
          </Form.Item>}
      </Form>
    );

    return (
      <div>
        <Modal
          title={`Update ${this.props.container.name}`}
          visible={this.props.visible}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
        >
          { this.state.generalFormError !== "" && <Alert message={this.state.generalFormError} type="error" showIcon style={{marginBottom: "10px"}}/>}
          { form }
        </Modal>
      </div>
    );
  }
}


const actionCreators = {
  get_containers_list: ContainerActions.get_containers_list,
};

const NewContainerModal = connect(
  (_) => {{}},
  actionCreators,
)(NewContainerModalUnwrapped);

export default NewContainerModal;
