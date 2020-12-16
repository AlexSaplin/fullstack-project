import React from "react";
import { connect } from "react-redux";
import { Statistic, Card, Row, Col, Table } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import AddMoneyForm from '../add_money_form'
import { BrowserView, MobileView } from "react-device-detect";
import { BillingActions, UserActions } from '../../actions';


class BillingUnwrapped extends React.Component {
  state = {
    dailyChanges: 0
  };

  componentDidMount() {
    this.props.get_money().then(() => {
      const timestamp_end = Math.ceil(new Date().getTime() / 1000);
      const timestamp_begin = timestamp_end - 30 * 24 * 60 * 60;
      this.props.get_transactions(timestamp_begin, timestamp_end);
      this.props.get_daily_money_change().then((balance) => {this.setState({dailyChanges: balance})});
    }).catch(
      (error) => error.response && error.response.status === 401 && this.props.logout() // logout on 401 error
    );
  }

  convertTransactionsToTableData(transactions) { 
    let dates_mapped = {}
    transactions.map((transaction) => {
      const transaction_date = new Date(transaction.Date * 1000)
      const date = new Date(transaction_date.getFullYear(), transaction_date.getMonth(), transaction_date.getDate());
      if (!(date in dates_mapped)) {
        dates_mapped[date] = {
          date: date.toDateString(),
          FUNCTIONS: 0,
          STORAGE: 0,
          PAYMENT: 0,
          CONTAINERS: 0
        }
      }
      if (transaction.Category === "FUNCTIONS") {
        dates_mapped[date].FUNCTIONS += transaction.Balance;
      }
      if (transaction.Category === "STORAGE") {
        dates_mapped[date].STORAGE += transaction.Balance;
      }
      if (transaction.Category === "PAYMENT") {
        dates_mapped[date].PAYMENT += transaction.Balance;
      }
      if (transaction.Category === "CONTAINERS") {
        dates_mapped[date].CONTAINERS += transaction.Balance;
      }
      return null;
    });

    for (const key in dates_mapped) {
      dates_mapped[key].FUNCTIONS = dates_mapped[key].FUNCTIONS === 0 ? '—' : '$ ' + dates_mapped[key].FUNCTIONS.toFixed(2);
      dates_mapped[key].STORAGE = dates_mapped[key].STORAGE === 0 ? '—' : '$ ' + dates_mapped[key].STORAGE.toFixed(2);
      dates_mapped[key].PAYMENT = dates_mapped[key].PAYMENT === 0 ? '—' : '$ ' + dates_mapped[key].PAYMENT.toFixed(2);
      dates_mapped[key].CONTAINERS = dates_mapped[key].CONTAINERS === 0 ? '—' : '$ ' + dates_mapped[key].CONTAINERS.toFixed(2);
    }
    return Object.values(dates_mapped);
  }

  render() {
    const { money, transactions } = this.props;
    const table_columns = [
      {
        title: 'Date',
        dataIndex: 'date',
      },
      {
        title: 'Functions',
        dataIndex: 'FUNCTIONS',
      },
      {
        title: 'Storage',
        dataIndex: 'STORAGE',
      },
      {
        title: 'Containers',
        dataIndex: 'CONTAINERS',
      },
      {
        title: 'Filled',
        dataIndex: 'PAYMENT',
      },
    ];
    
    const table_data = this.convertTransactionsToTableData(transactions);
    const { dailyChanges } = this.state;

    return (
      <>
        <BrowserView>
          <Row gutter={16}>
            <Col span={6}>
              <Card>
                <Statistic title="Balance" value={money} precision={2}
                  valueStyle={{ color: money > 1.0 ? "#3f8600" : "#cf1322" }} prefix="$"
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic title="Daily change" value={dailyChanges} precision={2}
                  valueStyle={{ color: dailyChanges > 0 ? '#52c41a' : dailyChanges < 0 ? '#f5222d' : '#bfbfbf'}} 
                  prefix={dailyChanges > 0 ? <><ArrowUpOutlined />$</>: dailyChanges < 0 ? <><ArrowDownOutlined />$</> : null}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <div className="ant-statistic-title" style={{marginBottom: 9}}>Pay in</div>
                <AddMoneyForm />
              </Card>
            </Col>
          </Row>
        </BrowserView>
        <MobileView>
          <Row gutter={16}>
            <Col span={12}>
              <Card>
                <Statistic title="Balance" value={money} precision={2}
                  valueStyle={{ color: money > 1.0 ? "#3f8600" : "#cf1322" }} prefix="$"
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <Statistic title="Daily change" value={dailyChanges} precision={2}
                  valueStyle={{ color: dailyChanges > 0 ? '#52c41a' : dailyChanges < 0 ? '#f5222d' : '#bfbfbf'}} 
                  prefix={dailyChanges > 0 ? <><ArrowUpOutlined />$</>: dailyChanges < 0 ? <><ArrowDownOutlined />$</> : null}
                />
              </Card>
            </Col>
          </Row>
          <Row style={{marginTop: 16}}>
            <Card style={{width: '100%'}}>
              <div className="ant-statistic-title">Pay in</div>
              <AddMoneyForm />
            </Card>
          </Row>
        </MobileView>
      
        <Row style={{ marginTop: 16 }}>
          <Card style={{ width: "100%" }}>
            <div className="ant-statistic-title" style={{fontSize: 18}}>
              Details
            </div>
            <Table columns={table_columns} dataSource={table_data} style={{marginTop: 15}} />
          </Card>
        </Row>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    money: state.billing.money,
    processing_money: state.billing.money_processing,
    transactions: state.billing.transactions,
    processing_transactions: state.billing.processing_transactions,
  };
}

const actionCreators = {
  logout: UserActions.logout,
  get_money: BillingActions.get_money,
  get_transactions: BillingActions.get_transactions,
  get_daily_money_change: BillingActions.get_daily_money_change,
};

const Billing = connect(mapStateToProps, actionCreators)(BillingUnwrapped);

export default Billing;
