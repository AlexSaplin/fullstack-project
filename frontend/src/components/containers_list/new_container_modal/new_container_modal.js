import React from "react";
import {Alert, Button, Checkbox, Form, Input, InputNumber, Modal, Select, Tooltip, Space, Row, Col} from "antd";
import {internalApiURL} from "../../../config";
import axios from "axios";
import {ContainerActions} from "../../../actions";
import {connect} from "react-redux";
import {PlusOutlined, MinusCircleOutlined} from '@ant-design/icons';


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
        const name = this.formRef.current.getFieldValue('name');
        const image = this.formRef.current.getFieldValue('image');
        const instance = this.formRef.current.getFieldValue('instance');
        const port = parseInt(this.formRef.current.getFieldValue('port'));
        const scale = parseInt(this.formRef.current.getFieldValue('scale'));
        const env = this.formRef.current.getFieldValue('env');
        const auth = this.formRef.current.getFieldValue('auth');


        const endpoint = `${internalApiURL}/v1/container/${name}`;

        let envMap = {}
        if (!!env) {
            for (let i = 0; i < env.length; i++) {
                envMap[env[i].key] = env[i].value
            }
        }

        axios.post(endpoint, {
            image: image,
            instance_type: instance,
            port: port,
            scale: scale,
            env: envMap,
            auth: auth,
        }).then((_) => {

            this.props.get_containers_list();
            this.props.hideModal();

            this.setState({
                generalFormError: "",
                confirmLoading: false,
            });
            this.formRef.current.resetFields();

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

        return (
          <div>
              <Modal
                title="Deploy New Container"
                visible={this.props.visible}
                onOk={this.handleOk}
                confirmLoading={confirmLoading}
                onCancel={this.handleCancel}
              >
                  { this.state.generalFormError !== "" && <Alert message={this.state.generalFormError} type="error" showIcon style={{marginBottom: "10px"}}/>}
                  <Form
                    {...layout}
                    name="basic"
                    initialValues={{
                        remember: true,
                    }}
                    ref={this.formRef}
                  >
                      <Form.Item
                        label="Name"
                        name="name"
                        placeholder="example-container"
                        rules={[
                            {
                                required: true,
                                message: 'Container name must be a valid DNS subdomain',
                            },
                        ]}
                      >
                          <Input />
                      </Form.Item>

                      <Form.Item
                        label="Docker Image"
                        name="image"
                        placeholder="gcr.io/mycontainer"
                        rules={[
                            {
                                required: true,
                                message: 'Docker image must be present',
                            },
                        ]}
                      >
                          <Input />
                      </Form.Item>

                      <Form.Item
                        label="Instance Size"
                        name="instance"
                        placeholder="Select an option"
                        rules={[
                            {
                                required: true,
                                message: 'Instance size must be present',
                            },
                        ]}
                      >
                          <Select>
                              <Select.Option value="starter" >Starter: 1 CPU / 2 GB</Select.Option>
                              <Select.Option value="inference">Inference: 4 CPU / 12 GB / Tesla T4</Select.Option>
                              {//
                                  //<Select.Option value="inference_pro">Inference PRO: 16 CPU / 64 GB / Tesla T4 </Select.Option>
                              }
                          </Select>
                      </Form.Item>

                      <Form.Item
                        label="Container HTTP Port"
                        name="port"
                        placeholder="80"
                        initialValue="80"
                        rules={[
                            {
                                required: true,
                                message: 'HTTP port must be present',
                            },
                        ]}
                      >
                          <Input />
                      </Form.Item>

                      <Form.Item
                        label="Desired Scale"
                        name="scale"
                        initialValue={1}
                        rules={[
                            {
                                required: true,
                                message: 'Scale must be present',
                            },
                        ]}
                      >
                          <InputNumber min={1} max={10} />
                      </Form.Item>
                      <Form.List name="env">
                          {(fields, { add, remove }) => (
                            <>
                                {fields.map(field => (
                                  <Row>
                                      <Col span={8}>
                                          <Form.Item
                                            {...field}
                                            wrapperCol={{ sm: 24 }}
                                            style={{ width: "90%", marginRight: 0 }}
                                            name={[field.name, 'key']}
                                            fieldKey={[field.fieldKey, 'key']}
                                            rules={[{ required: true, message: 'Missing key' }]}
                                          >
                                              <Input placeholder="Key" />
                                          </Form.Item>
                                      </Col>
                                      <Col span={14}>
                                          <Form.Item
                                            {...field}
                                            wrapperCol={{ sm: 24 }}
                                            style={{ width: "100%", marginRight: 0 }}
                                            name={[field.name, 'value']}
                                            fieldKey={[field.fieldKey, 'value']}
                                            rules={[{ required: true, message: 'Missing value' }]}
                                          >
                                              <Input placeholder="Value" />
                                          </Form.Item></Col>
                                      <Col span={2}>
                                          <MinusCircleOutlined
                                            style={{marginLeft: "10px"}}
                                            onClick={() => remove(field.name)}
                                          />
                                      </Col>
                                  </Row>
                                ))}
                                <Form.Item wrapperCol={{ sm: 24 }} style={{ width: "100%", marginRight: 0 }}>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        Add Environment Variable
                                    </Button>
                                </Form.Item>
                            </>
                          )}
                      </Form.List>
                      <Form.List name="auth">
                          {(fields, { add, remove }) => (
                            <>
                                {fields.map(field => (
                                  <Row>
                                      <Col span={8}>
                                          <Form.Item
                                            {...field}
                                            wrapperCol={{ sm: 24 }}
                                            style={{ width: "90%", marginRight: 0 }}
                                            name={[field.name, 'registry']}
                                            fieldKey={[field.fieldKey, 'registry']}
                                            rules={[{ required: true, message: 'Missing registry' }]}
                                          >
                                              <Input placeholder="Registry" />
                                          </Form.Item>
                                      </Col>
                                      <Col span={7}>
                                          <Form.Item
                                            {...field}
                                            wrapperCol={{ sm: 24 }}
                                            style={{ width: "90%", marginRight: 0 }}
                                            name={[field.name, 'username']}
                                            fieldKey={[field.fieldKey, 'username']}
                                            rules={[{ required: true, message: 'Missing username' }]}
                                          >
                                              <Input placeholder="Username" />
                                          </Form.Item>
                                      </Col>
                                      <Col span={7}>
                                          <Form.Item
                                            {...field}
                                            wrapperCol={{ sm: 24 }}
                                            style={{ width: "90%", marginRight: 0 }}
                                            name={[field.name, 'password']}
                                            fieldKey={[field.fieldKey, 'password']}
                                            rules={[{ required: true, message: 'Missing password' }]}
                                          >
                                              <Input.Password placeholder="Password" />
                                          </Form.Item>
                                      </Col>
                                      <Col span={2}>
                                          <MinusCircleOutlined
                                            style={{marginLeft: "10px"}}
                                            onClick={() => remove(field.name)}
                                          />
                                      </Col>
                                  </Row>
                                ))}
                                <Form.Item wrapperCol={{ sm: 24 }} style={{ width: "100%", marginRight: 0 }}>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        Add Docker Pull Credentials
                                    </Button>
                                </Form.Item>

                            </>
                          )}
                      </Form.List>
                  </Form>
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
