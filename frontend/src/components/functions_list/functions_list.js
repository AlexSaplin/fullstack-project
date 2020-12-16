import React from "react";
import { connect } from "react-redux";
import { Popconfirm, Tooltip, Row, Col, Typography, Button, Spin, Collapse, Tag, Table, Empty, Card } from "antd";
import {
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { FunctionActions } from "../../actions";
import { LoadingOutlined } from '@ant-design/icons';

import './functions_list.css'
import {func} from "../../reducers/func_reducer";

const { Title } = Typography;

class FunctionsListUnwrapped extends React.Component {
  componentDidMount() {
    this.props.get_functions_list()
  }

  render() {
    const { functions = [], processing } = this.props;
     
    const init_tag = (
      <Tag color="processing" style={{fontSize: '15px', lineHeight: '26px', marginTop: '5px', marginBottom: '5px'}} alt="Uplo">
        INITIALIZED
      </Tag>
    );

    const processing_tag = (
      <Tag icon={<SyncOutlined spin style={{fontSize: '18px'}} />} color="processing" style={{fontSize: '15px', lineHeight: '26px', marginTop: '5px', marginBottom: '5px'}} >
        PROCESSING
      </Tag>
    );

    const ready_tag = (
      <Tag icon={<CheckCircleOutlined style={{fontSize: '18px'}} />} color="success" style={{fontSize: '15px', lineHeight: '26px', marginTop: '5px', marginBottom: '5px'}} >
        READY
      </Tag>
    );

    const invalid_tag = (
      <Tag icon={<CloseCircleOutlined style={{fontSize: '18px'}} />} color="error" style={{fontSize: '15px', lineHeight: '26px', marginTop: '5px', marginBottom: '5px'}} >
        ERROR
      </Tag>
    )

    return processing ? (
      <Row align="middle" justify="center" style={{height: "100%"}}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
      </Row>
    ) : functions.length !== 0 ?
      functions.map((func, index) => {
            return (
                <Card key={func.name} className="functionslist_model_json" bodyStyle={{padding: "12px 16px 12px 20px"}}>
                  <Row align="middle" justify="space-between">
                      <Col>
                        <Title level={4} style={{ margin: 0, height: '100%', float: 'left', marginRight: '10px', marginTop: '5px', marginBottom: '5px'}}>
                          Function: {func.name}
                        </Title>
                        { func.state === "INIT" && init_tag}
                        { func.state === "PROCESSING" && processing_tag}
                        { func.state === "READY" && ready_tag}
                        { func.state === "INVALID" && <Tooltip title={func.error}>{invalid_tag}</Tooltip>}
                      </Col>
                      <Popconfirm
                        title="Are you sure you want delete this function?"
                        onConfirm={() => this.props.remove_function(func.name)}
                        onCancel={(e) => {e.stopPropagation()}}
                        cancelText="No"
                        okText="Yes"
                        placement="bottomRight"
                      >
                        <Button type="primary" style={{marginTop: '5px', marginBottom: '5px'}} danger onClick={(e) => {e.stopPropagation()}}>
                          Remove
                        </Button>
                      </Popconfirm>

                    </Row>

                </Card>

            )
          })
     : (
      <Row align="middle" justify="center" style={{height: "100%"}}>
        <Empty description="No functions yet">
          <Button type="primary">
              <a href="https://deep-mux.github.io/functions-quickstart/" target="_blank" rel="noopener noreferrer" >Get Started</a></Button>
        </Empty>
      </Row>
    )
  }
}

function mapStateToProps(state) {
  return {
    functions: state.func.funcs,
    processing: state.func.processing,
  };
}

const actionCreators = {
  get_functions_list: FunctionActions.get_functions_list,
  remove_function: FunctionActions.remove_function,
};

const FunctionsList = connect(
  mapStateToProps,
  actionCreators
)(FunctionsListUnwrapped);

export default FunctionsList;
